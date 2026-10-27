// Zwischenspeicher der Übersicht oneSCM_Metadaten (ADR-107): je Projekt höchstens 30 s alt; Schreibzugriffe auf Quellen,
// Chunks, Labels und gespeicherte Antworten verwerfen ihn sofort. Bei mehreren Instanzen kann eine andere Instanz bis
// zu 30 s den alten Stand zeigen.
import type { Db } from '../db.js';

const TTL_MS = 30_000;
const cache = new Map<string, { at: number; value: unknown }>();
/** Zähler je Projekt: eine Berechnung, während der geschrieben wurde, wird nicht gespeichert */
const generation = new Map<string, number>();

function drop(projectId: string) {
  cache.delete(projectId);
  generation.set(projectId, (generation.get(projectId) ?? 0) + 1);
}

/**
 * Übersicht verwerfen – sofort und noch einmal nach dem COMMIT der laufenden Transaktion: eine Anfrage dazwischen sieht
 * (PostgreSQL, andere Verbindung) noch den alten Stand und darf ihn nicht für 30 s festhalten.
 */
export function touchMetadata(scope: { db: Db; projectId: string }) {
  drop(scope.projectId);
  scope.db.afterCommit(() => drop(scope.projectId));
}

export async function cachedOverview<T>(projectId: string, compute: () => Promise<T>, nowMs = Date.now()): Promise<T> {
  const hit = cache.get(projectId);
  if (hit && nowMs - hit.at < TTL_MS) return hit.value as T;
  const gen = generation.get(projectId) ?? 0;
  const value = await compute();
  if ((generation.get(projectId) ?? 0) === gen) cache.set(projectId, { at: nowMs, value });
  return value;
}
