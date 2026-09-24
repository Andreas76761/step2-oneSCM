// Embedding-Anbieter für semantische Suche und hybride Analyse (ADR-017).
// - local: Merkmals-Hashing über Wortstämme und Zeichen-Trigramme (ohne Netzwerk, Standard). Erkennt Flexion und
//   Komposita, aber keine Synonyme.
// - openai: OpenAI-kompatibler /embeddings-Endpunkt (OpenAI, Azure OpenAI, Voyage AI, Ollama, vLLM …) – echte
//   semantische Nähe, Texte werden an den Dienst übertragen.
import { LlmError } from './llm.js';
import { tokenize } from './domain/similarity.js';

export interface EmbeddingConfig {
  provider: 'local' | 'openai';
  model: string;
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
  batchSize?: number;
}

export interface EmbeddingProvider {
  readonly id: 'local' | 'openai';
  readonly model: string;
  /** Daten verlassen die eigene Umgebung */
  readonly external: boolean;
  embed(texts: string[]): Promise<Float32Array[]>;
}

export const LOCAL_DIMS = 384;

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function normalize(v: Float32Array): Float32Array {
  let n = 0;
  for (const x of v) n += x * x;
  n = Math.sqrt(n) || 1;
  for (let i = 0; i < v.length; i++) v[i] /= n;
  return v;
}

/** Deterministisches lokales Embedding: gewichtete Stämme und Trigramme, per Vorzeichen-Hashing in LOCAL_DIMS Dimensionen. */
export function localEmbedding(text: string): Float32Array {
  const v = new Float32Array(LOCAL_DIMS);
  const add = (feature: string, w: number) => {
    const h = fnv1a(feature);
    v[h % LOCAL_DIMS] += (h & 0x80000000 ? -1 : 1) * w;
  };
  for (const stem of tokenize(text)) {
    add(`w:${stem}`, 1);
    const padded = `^${stem}$`;
    for (let i = 0; i + 3 <= padded.length; i++) add(`t:${padded.slice(i, i + 3)}`, 0.35);
  }
  return normalize(v);
}

export class LocalEmbeddingProvider implements EmbeddingProvider {
  readonly id = 'local' as const;
  readonly external = false;
  readonly model = `local-hash-${LOCAL_DIMS}`;
  async embed(texts: string[]) {
    return texts.map(localEmbedding);
  }
}

export class OpenAiEmbeddingProvider implements EmbeddingProvider {
  readonly id = 'openai' as const;
  readonly external = true;
  readonly model: string;
  constructor(private readonly cfg: EmbeddingConfig) {
    this.model = cfg.model;
  }
  async embed(texts: string[]) {
    const out: Float32Array[] = [];
    const size = this.cfg.batchSize ?? 64;
    const base = (this.cfg.baseUrl ?? 'https://api.openai.com/v1').replace(/\/+$/, '');
    for (let i = 0; i < texts.length; i += size) {
      const batch = texts.slice(i, i + size);
      let res: Response;
      try {
        res = await fetch(`${base}/embeddings`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...(this.cfg.apiKey ? { authorization: `Bearer ${this.cfg.apiKey}` } : {}) },
          body: JSON.stringify({ model: this.model, input: batch }),
          signal: AbortSignal.timeout(this.cfg.timeoutMs ?? 60_000),
        });
      } catch (e) {
        throw new LlmError(`Embedding-Dienst nicht erreichbar: ${(e as Error).message}`);
      }
      const body = await res.text();
      if (!res.ok) throw new LlmError(`Embedding-Dienst antwortete mit HTTP ${res.status}: ${body.slice(0, 200)}`, res.status);
      let data: any;
      try {
        data = JSON.parse(body);
      } catch {
        throw new LlmError('Antwort des Embedding-Dienstes ist kein JSON.');
      }
      const items = [...(data?.data ?? [])].sort((a: any, b: any) => (a.index ?? 0) - (b.index ?? 0));
      if (items.length !== batch.length) throw new LlmError(`Embedding-Dienst lieferte ${items.length} statt ${batch.length} Vektoren.`);
      for (const it of items) out.push(normalize(Float32Array.from(it.embedding as number[])));
    }
    return out;
  }
}

export function createEmbeddingProvider(cfg: EmbeddingConfig): EmbeddingProvider {
  return cfg.provider === 'openai' ? new OpenAiEmbeddingProvider(cfg) : new LocalEmbeddingProvider();
}

export function embeddingsFromEnv(): EmbeddingConfig {
  const provider = (process.env.EMBEDDINGS_PROVIDER ?? 'local').toLowerCase();
  if (provider === 'local' || provider === '') return { provider: 'local', model: `local-hash-${LOCAL_DIMS}` };
  if (provider !== 'openai') throw new Error('EMBEDDINGS_PROVIDER muss local oder openai (OpenAI-kompatibel, auch Voyage/Ollama) sein.');
  const model = process.env.EMBEDDINGS_MODEL;
  if (!model) throw new Error('EMBEDDINGS_PROVIDER=openai erfordert EMBEDDINGS_MODEL.');
  return {
    provider: 'openai', model,
    apiKey: process.env.EMBEDDINGS_API_KEY || process.env.OPENAI_API_KEY || undefined,
    baseUrl: process.env.EMBEDDINGS_BASE_URL || undefined,
    timeoutMs: Number(process.env.EMBEDDINGS_TIMEOUT_MS || 60_000),
    batchSize: Number(process.env.EMBEDDINGS_BATCH_SIZE || 64),
  };
}

// Vektoren kompakt als Base64 (Float32, little endian) speichern
export const encodeVector = (v: Float32Array) => Buffer.from(v.buffer, v.byteOffset, v.byteLength).toString('base64');
export function decodeVector(s: string): Float32Array {
  const b = Buffer.from(s, 'base64');
  return new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}

export function dot(a: Float32Array, b: Float32Array): number {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}
