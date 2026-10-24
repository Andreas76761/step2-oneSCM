// Zwischenspeicher der Übersicht oneSCM_Metadaten (ADR-107): je Projekt höchstens 30 s alt; Schreibzugriffe auf Quellen,
// Chunks, Labels und gespeicherte Antworten verwerfen ihn sofort. Bei mehreren Instanzen kann eine andere Instanz bis
// zu 30 s den alten Stand zeigen.
const TTL_MS = 30_000;
const cache = new Map<string, { at: number; value: unknown }>();

export function touchMetadata(projectId: string) {
  cache.delete(projectId);
}

export async function cachedOverview<T>(projectId: string, compute: () => Promise<T>, nowMs = Date.now()): Promise<T> {
  const hit = cache.get(projectId);
  if (hit && nowMs - hit.at < TTL_MS) return hit.value as T;
  const value = await compute();
  cache.set(projectId, { at: nowMs, value });
  return value;
}
