// Persistente Jobqueue (ADR-008). Jobs liegen in der Tabelle `jobs` und überstehen Neustarts.
// Mehrere Instanzen sind mit PostgreSQL möglich (FOR UPDATE SKIP LOCKED). Laufende Jobs verlängern
// ihre Lease per Heartbeat; Jobs abgestürzter Instanzen werden bei jedem Polling nach Ablauf der
// Lease zurückgeholt. Handler müssen idempotent sein.
import { randomUUID } from 'node:crypto';
import { json, newId, now, parseJson, type Db } from './db.js';

export type JobHandler = (payload: any, job: { id: string; attempt: number }) => Promise<void>;
export type JobFailedHandler = (payload: any, error: string) => Promise<void>;

interface JobRow {
  id: string;
  type: string;
  payload: string;
  attempts: number;
  max_attempts: number;
}

export interface JobQueueOptions {
  pollMs?: number;
  leaseMs?: number;
  backoffMs?: number;
  onError?: (type: string, err: unknown) => void;
}

const LEASE_EXPIRED = 'Lease abgelaufen (Worker nicht mehr aktiv)';

export class JobQueue {
  private readonly workerId = `w_${randomUUID().slice(0, 8)}`;
  private readonly handlers = new Map<string, { run: JobHandler; failed?: JobFailedHandler }>();
  private timer: NodeJS.Timeout | null = null;
  private active: Promise<void> | null = null;
  /** Weckruf während eines laufenden Durchgangs → danach sofort erneut prüfen */
  private pending = false;
  private stopped = true;
  private readonly pollMs: number;
  private readonly leaseMs: number;
  private readonly backoffMs: number;

  constructor(private readonly db: Db, private readonly opts: JobQueueOptions = {}) {
    this.pollMs = opts.pollMs ?? 500;
    this.leaseMs = opts.leaseMs ?? Number(process.env.JOB_LEASE_MS ?? 10 * 60 * 1000);
    this.backoffMs = opts.backoffMs ?? 2000;
  }

  register(type: string, run: JobHandler, failed?: JobFailedHandler) {
    this.handlers.set(type, { run, failed });
  }

  /**
   * Job anlegen. Innerhalb einer Transaktion wird er erst mit deren Commit sichtbar;
   * der Aufrufer ruft danach `wake()` auf (siehe createImport/startAnalysis).
   */
  async enqueue(type: string, payload: unknown, maxAttempts = 3) {
    const id = newId('job');
    await this.db.run(
      "INSERT INTO jobs (id, type, payload, status, max_attempts, run_after, created_at) VALUES (?, ?, ?, 'queued', ?, ?, ?)",
      id, type, json(payload), maxAttempts, now(), now(),
    );
    this.wake();
    return id;
  }

  /** Startet den Worker. Bei SQLite (eine Instanz) sind alle laufenden Jobs verwaist. */
  async start() {
    this.stopped = false;
    if (this.db.dialect === 'sqlite') await this.reclaim(true);
    this.wake();
  }

  async stop() {
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    await this.active;
  }

  /** Worker sofort prüfen lassen (z. B. nach dem Commit einer Transaktion mit enqueue). */
  wake() {
    if (this.active) this.pending = true;
    this.schedule(0);
  }

  private schedule(delay: number) {
    if (this.stopped) return;
    if (this.timer) clearTimeout(this.timer);
    // Timer außerhalb eines evtl. offenen Transaktionskontexts anlegen – der Worker darf ihn nicht erben
    this.timer = this.db.outside(() =>
      setTimeout(() => {
        this.timer = null;
        if (!this.active) {
          this.active = this.drain().finally(() => {
            this.active = null;
            if (this.pending) this.wake();
          });
        } else this.pending = true;
      }, delay),
    );
    this.timer.unref();
  }

  /**
   * Verwaiste Jobs zurückholen: abgelaufene Lease → erneut einreihen, oder bei ausgeschöpften
   * Versuchen endgültig fehlschlagen lassen (inkl. fachlichem Fehler-Handler).
   */
  private async reclaim(all = false) {
    const expired = new Date(Date.now() - this.leaseMs).toISOString();
    const rows = await this.db.all<JobRow>(
      `SELECT id, type, payload, attempts, max_attempts FROM jobs WHERE status = 'running' ${all ? '' : 'AND locked_at < ?'}`,
      ...(all ? [] : [expired]),
    );
    for (const job of rows) {
      const cond = all ? "status = 'running'" : "status = 'running' AND locked_at < ?";
      const condArgs = all ? [] : [expired];
      if (job.attempts < job.max_attempts) {
        await this.db.run(`UPDATE jobs SET status = 'queued', locked_by = NULL, locked_at = NULL, error = ? WHERE id = ? AND ${cond}`, LEASE_EXPIRED, job.id, ...condArgs);
      } else {
        const res = await this.db.run(`UPDATE jobs SET status = 'failed', finished_at = ?, error = ? WHERE id = ? AND ${cond}`, now(), LEASE_EXPIRED, job.id, ...condArgs);
        if (res.changes) await this.handlers.get(job.type)?.failed?.(parseJson(job.payload, {}), LEASE_EXPIRED).catch((e) => this.opts.onError?.(job.type, e));
      }
    }
  }

  private async claim(): Promise<JobRow | undefined> {
    const ts = now();
    if (this.db.dialect === 'postgres') {
      return this.db.get<JobRow>(
        `UPDATE jobs SET status = 'running', attempts = attempts + 1, locked_by = ?, locked_at = ?
         WHERE id = (SELECT id FROM jobs WHERE status = 'queued' AND run_after <= ? ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED)
         RETURNING id, type, payload, attempts, max_attempts`,
        this.workerId, ts, ts,
      );
    }
    return this.db.tx(async () => {
      const job = await this.db.get<JobRow>("SELECT id, type, payload, attempts, max_attempts FROM jobs WHERE status = 'queued' AND run_after <= ? ORDER BY created_at LIMIT 1", ts);
      if (!job) return undefined;
      await this.db.run("UPDATE jobs SET status = 'running', attempts = attempts + 1, locked_by = ?, locked_at = ? WHERE id = ?", this.workerId, ts, job.id);
      return { ...job, attempts: job.attempts + 1 };
    });
  }

  private async runJob(job: JobRow) {
    const handler = this.handlers.get(job.type);
    const payload = parseJson(job.payload, {});
    // Heartbeat: Lease verlängern, solange der Job läuft
    const heartbeat = setInterval(() => {
      this.db.run("UPDATE jobs SET locked_at = ? WHERE id = ? AND status = 'running' AND locked_by = ?", now(), job.id, this.workerId)
        .catch((e) => this.opts.onError?.(job.type, e));
    }, Math.max(1000, Math.floor(this.leaseMs / 3)));
    heartbeat.unref();
    try {
      if (!handler) throw new Error(`Kein Handler für Jobtyp „${job.type}“`);
      await handler.run(payload, { id: job.id, attempt: job.attempts });
      await this.db.run("UPDATE jobs SET status = 'completed', finished_at = ?, error = NULL WHERE id = ? AND locked_by = ?", now(), job.id, this.workerId);
    } catch (err) {
      const msg = (err as Error)?.message ?? String(err);
      this.opts.onError?.(job.type, err);
      if (job.attempts < job.max_attempts) {
        const runAfter = new Date(Date.now() + this.backoffMs * 2 ** (job.attempts - 1)).toISOString();
        await this.db.run("UPDATE jobs SET status = 'queued', run_after = ?, error = ?, locked_by = NULL, locked_at = NULL WHERE id = ?", runAfter, msg, job.id);
      } else {
        await this.db.run("UPDATE jobs SET status = 'failed', finished_at = ?, error = ? WHERE id = ?", now(), msg, job.id);
        await handler?.failed?.(payload, msg).catch((e) => this.opts.onError?.(job.type, e));
      }
    } finally {
      clearInterval(heartbeat);
    }
  }

  private async drain() {
    this.pending = false;
    try {
      await this.reclaim();
      while (!this.stopped) {
        const job = await this.claim();
        if (!job) break;
        await this.runJob(job);
      }
    } catch (e) {
      this.opts.onError?.('queue', e);
    }
    if (this.stopped || this.pending) return;
    const next = await this.db.get<{ t: string | null }>("SELECT MIN(run_after) AS t FROM jobs WHERE status = 'queued'").catch(() => undefined);
    const idle = this.pollMs * 20; // Leerlauf: regelmäßig nach Jobs anderer Instanzen und abgelaufenen Leases sehen
    this.schedule(next?.t ? Math.max(0, Math.min(new Date(next.t).getTime() - Date.now(), idle)) : idle);
  }

  /** Wartet, bis keine Jobs mehr offen sind (Tests, Seed-Skript). */
  async idle(timeoutMs = 30_000) {
    const until = Date.now() + timeoutMs;
    for (;;) {
      await this.active;
      const open = await this.db.get<{ n: number }>("SELECT COUNT(*) AS n FROM jobs WHERE status IN ('queued', 'running')");
      if (!open?.n && !this.active) return;
      if (Date.now() > until) throw new Error('Zeitüberschreitung beim Warten auf Jobs');
      this.wake();
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}
