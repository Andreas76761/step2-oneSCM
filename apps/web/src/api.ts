// API-Client. ANNAHME(E-15): Demo-Benutzer wird per Header X-User-Id übertragen.
const USER_KEY = 'onescm.user';

export function currentUserId(): string {
  try {
    return localStorage.getItem(USER_KEY) ?? 'u-admin';
  } catch {
    return 'u-admin';
  }
}
export function setCurrentUserId(id: string) {
  try {
    localStorage.setItem(USER_KEY, id);
  } catch {
    /* ohne Speicher weiter mit Standard */
  }
}

export class ApiError extends Error {
  constructor(public status: number, public problem: any) {
    super(problem?.detail ?? problem?.title ?? `HTTP ${status}`);
  }
}

export async function api<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'X-User-Id': currentUserId() };
  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`/api/v1${path}`, { method, headers, body: payload });
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get('content-type') ?? '';
  const data = ct.includes('json') ? await res.json() : await res.text();
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

export const get = <T = any>(p: string) => api<T>('GET', p);
export const post = <T = any>(p: string, b?: unknown) => api<T>('POST', p, b ?? {});
export const patch = <T = any>(p: string, b: unknown) => api<T>('PATCH', p, b);
export const put = <T = any>(p: string, b: unknown) => api<T>('PUT', p, b);
export const del = (p: string) => api('DELETE', p);

export function qs(params: Record<string, string | number | boolean | undefined | null>) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') u.set(k, String(v));
  const s = u.toString();
  return s ? `?${s}` : '';
}
