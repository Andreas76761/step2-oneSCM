// RFC 9457 Problem Details (ADR-002).
export class Problem extends Error {
  constructor(
    public readonly status: number,
    public readonly title: string,
    public readonly detail?: string,
    public readonly extra: Record<string, unknown> = {},
  ) {
    super(detail ?? title);
  }
  toJSON() {
    return { type: `https://onescm.example/problems/${this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, title: this.title, status: this.status, detail: this.detail, ...this.extra };
  }
}
export const notFound = (what: string) => new Problem(404, 'Not Found', `${what} wurde nicht gefunden.`);
export const badRequest = (detail: string, extra?: Record<string, unknown>) => new Problem(400, 'Bad Request', detail, extra);
export const conflict = (detail: string, extra?: Record<string, unknown>) => new Problem(409, 'Conflict', detail, extra);
export const forbidden = (detail: string) => new Problem(403, 'Forbidden', detail);
export const unprocessable = (detail: string, extra?: Record<string, unknown>) => new Problem(422, 'Unprocessable Content', detail, extra);
