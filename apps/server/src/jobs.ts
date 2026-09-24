// Serielle In-Process-Jobqueue (ADR-008). Status wird von den Jobs selbst in der Datenbank geführt.
type Job = { name: string; run: () => Promise<void> };

export class JobQueue {
  private queue: Job[] = [];
  private running: Promise<void> | null = null;
  constructor(private readonly onError: (name: string, err: unknown) => void) {}

  enqueue(name: string, run: () => Promise<void>) {
    this.queue.push({ name, run });
    if (!this.running) this.running = this.drain();
  }

  private async drain() {
    while (this.queue.length) {
      const job = this.queue.shift()!;
      try {
        await job.run();
      } catch (e) {
        this.onError(job.name, e);
      }
    }
    this.running = null;
  }

  /** Wartet, bis alle Jobs abgearbeitet sind (Tests, Seed-Skript). */
  async idle() {
    while (this.running) await this.running;
  }
}
