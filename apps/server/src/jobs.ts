// Persistente Jobqueue (ADR-008). Jobs liegen in der Tabelle `jobs` und überstehen Neustarts.
// Mehrere Instanzen sind mit PostgreSQL möglich (FOR UPDATE SKIP LOCKED); abgebrochene Jobs werden
// nach Ablauf der Lease wieder eingereiht. Handler müssen idempotent sein.
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

export class JobQueue {
  private readonly workerId = `w_${randomUUID().slice(0, 8)}`;
  private readonly handlers = new Map<string, { run: JobHandler; failed?: JobFailedHandler }>();
  private timer: NodeJS.Timeout | null = null;
  private active: Promise<void> | null = null;
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

  async enqueue(type: string, payload: unknown, maxAttempts = 3) {
    const id = newId('job');
    await this.db.run(
      "INSERT INTO jobs (id, type, payload, status, max_attempts, run_after, created_at) VALUES (?, ?, ?, 'queued', ?, ?, ?)",
      id, type, json(payload), maxAttempts, now(), now(),
    );
    this.kick();
    return id;
  }

  /** Startet den Worker und reiht verwaiste Jobs (abgelaufene Lease) wieder ein. */
  async start() {
    this.stopped = false;
    const expired = new Date(Date.now() - this.leaseMs).toISOString();
    const where = this.db.dialect === 'sqlite' ? "status = 'running'" : "status = 'running' AND locked_at < ?";
    await this.db.run(`UPDATE jobs SET status = 'queued', locked_by = NULL, locked_at = NULL WHERE ${where}`, ...(this.db.dialect === 'sqlite' ? [] : [expired]));
    this.kick();
  }

  async stop() {
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    await this.active;
  }

  private kick(delay = 0) {
    if (this.stopped) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      if (!this.active) this.active = this.drain().finally(() => (this.active = null));
    }, delay);
    this.timer.unref();
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

  private async drain() {
    while (!this.stopped) {
      const job = await this.claim();
      if (!job) break;
      const handler = this.handlers.get(job.type);
      const payload = parseJson(job.payload, {});
      try {
        if (!handler) throw new Error(`Kein Handler für Jobtyp „${job.type}“`);
        await handler.run(payload, { id: job.id, attempt: job.attempts });
        await this.db.run("UPDATE jobs SET status = 'completed', finished_at = ?, error = NULL WHERE id = ?", now(), job.id);
      } catch (err) {
        const msg = (err as Error)?.message ?? String(err);
        this.opts.onError?.(job.type, err);
        if (job.attempts < job.max_attempts) {
          const runAfter = new Date(Date.now() + this.backoffMs * 2 ** (job.attempts - 1)).toISOString();
          await this.db.run("UPDATE jobs SET status = 'queued', run_after = ?, error = ?, locked_by = NULL WHERE id = ?", runAfter, msg, job.id);
        } else {
          await this.db.run("UPDATE jobs SET status = 'failed', finished_at = ?, error = ? WHERE id = ?", now(), msg, job.id);
          await handler?.failed?.(payload, msg).catch((e) => this.opts.onError?.(job.type, e));
        }
      }
    }
    if (!this.stopped) {
      const next = await this.db.get<{ t: string }>("SELECT MIN(run_after) AS t FROM jobs WHERE status = 'queued'");
      if (next?.t) this.kick(Math.max(0, Math.min(new Date(next.t).getTime() - Date.now(), this.pollMs * 20)));
      else this.kick(this.pollMs * 20); // Leerlauf: gelegentlich nach Jobs anderer Instanzen sehen
    }
  }

  /** Wartet, bis keine Jobs dieser Instanz mehr offen sind (Tests, Seed-Skript). */
  async idle(timeoutMs = 30_000) {
    const until = Date.now() + timeoutMs;
    for (;;) {
      await this.active;
      const open = await this.db.get<{ n: number }>("SELECT COUNT(*) AS n FROM jobs WHERE status IN ('queued', 'running')");
      if (!open?.n && !this.active) return;
      if (Date.now() > until) throw new Error('Zeitüberschreitung beim Warten auf Jobs');
      this.kick();
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}
