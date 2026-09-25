// Anbindung von KI-Diensten für die Umformulierung (ADR-013, ENTSCHEIDUNG E-16).
// Adapter: Anthropic Claude (Messages API), OpenAI-kompatible Chat-API (OpenAI, Azure, vLLM, Ollama …) und ein
// Demo-Anbieter ohne Netzwerkzugriff (nur für Demo und Tests). Standard: keine Anbindung.
import { extractiveAnswer } from './domain/assistant.js';
import { extractPromptData } from './domain/rewrite.js';
import { parseStructure } from './domain/diagrams.js';
import { autoFix, PRESENT_RULES } from './domain/style.js';

export type LlmProviderId = 'anthropic' | 'openai' | 'demo';

export interface LlmConfig {
  provider: LlmProviderId;
  model: string;
  apiKey?: string;
  /** Basis-URL, z. B. für EU-Endpunkte, Proxys oder selbst betriebene OpenAI-kompatible Server */
  baseUrl?: string;
  timeoutMs?: number;
  maxTokens?: number;
}

export interface LlmRequest {
  system: string;
  user: string;
}

export interface LlmResponse {
  text: string;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export interface LlmProvider {
  readonly id: LlmProviderId;
  readonly model: string;
  /** true, wenn Daten die eigene Umgebung verlassen (Anzeige in der Oberfläche) */
  readonly external: boolean;
  complete(req: LlmRequest): Promise<LlmResponse>;
}

export class LlmError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

export const DEFAULT_MODELS: Partial<Record<LlmProviderId, string>> = { anthropic: 'claude-sonnet-5', demo: 'demo-extractive' };

async function postJson(url: string, headers: Record<string, string>, body: unknown, timeoutMs: number): Promise<any> {
  let res: Response;
  try {
    res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs) });
  } catch (e) {
    const timeout = (e as Error).name === 'TimeoutError';
    throw new LlmError(timeout ? `Zeitüberschreitung nach ${timeoutMs} ms` : `Verbindung fehlgeschlagen: ${(e as Error).message}`);
  }
  const text = await res.text();
  if (!res.ok) {
    // Fehlermeldung des Anbieters kürzen; niemals Zugangsdaten oder Anfrage zurückgeben
    let msg = text.slice(0, 300);
    try {
      const j = JSON.parse(text);
      msg = j?.error?.message ?? j?.message ?? msg;
    } catch {
      /* kein JSON */
    }
    throw new LlmError(`Anbieter antwortete mit HTTP ${res.status}: ${String(msg).slice(0, 300)}`, res.status);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new LlmError('Antwort des Anbieters ist kein JSON.');
  }
}

export class AnthropicProvider implements LlmProvider {
  readonly id = 'anthropic' as const;
  readonly external = true;
  readonly model: string;
  constructor(private readonly cfg: LlmConfig) {
    this.model = cfg.model;
  }
  async complete(req: LlmRequest): Promise<LlmResponse> {
    const base = (this.cfg.baseUrl ?? 'https://api.anthropic.com').replace(/\/+$/, '');
    const data = await postJson(
      `${base}/v1/messages`,
      { 'x-api-key': this.cfg.apiKey ?? '', 'anthropic-version': '2023-06-01' },
      { model: this.model, max_tokens: this.cfg.maxTokens ?? 4000, system: req.system, messages: [{ role: 'user', content: req.user }] },
      this.cfg.timeoutMs ?? 60_000,
    );
    const text = (data?.content ?? []).filter((c: any) => c?.type === 'text').map((c: any) => c.text).join('');
    if (!text) throw new LlmError(data?.stop_reason === 'refusal' ? 'Anbieter hat die Anfrage abgelehnt.' : 'Leere Antwort des Anbieters.');
    return { text, usage: { inputTokens: data?.usage?.input_tokens, outputTokens: data?.usage?.output_tokens } };
  }
}

export class OpenAiCompatibleProvider implements LlmProvider {
  readonly id = 'openai' as const;
  readonly external = true;
  readonly model: string;
  constructor(private readonly cfg: LlmConfig) {
    this.model = cfg.model;
  }
  async complete(req: LlmRequest): Promise<LlmResponse> {
    const base = (this.cfg.baseUrl ?? 'https://api.openai.com/v1').replace(/\/+$/, '');
    const data = await postJson(
      `${base}/chat/completions`,
      this.cfg.apiKey ? { authorization: `Bearer ${this.cfg.apiKey}` } : {},
      { model: this.model, max_tokens: this.cfg.maxTokens ?? 4000, messages: [{ role: 'system', content: req.system }, { role: 'user', content: req.user }] },
      this.cfg.timeoutMs ?? 60_000,
    );
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text) throw new LlmError('Leere Antwort des Anbieters.');
    return { text, usage: { inputTokens: data?.usage?.prompt_tokens, outputTokens: data?.usage?.completion_tokens } };
  }
}

/**
 * Demo-Anbieter ohne Netzwerkzugriff: zerlegt den Absatz in Sätze, glättet Leerraum und zitiert die Quellen,
 * in denen der Satz vorkommt. Formuliert nicht wirklich um – dient Demo und automatisierten Tests.
 */
export class DemoProvider implements LlmProvider {
  readonly id = 'demo' as const;
  readonly external = false;
  readonly model: string;
  constructor(cfg: LlmConfig) {
    this.model = cfg.model;
  }
  async complete(req: LlmRequest): Promise<LlmResponse> {
    const data = extractPromptData(req.user);
    if (!data) throw new LlmError('Demo-Anbieter: Eingabedaten nicht gefunden.');
    // Handbuch-Assistent (ADR-026): extraktive Antwort aus den mitgegebenen Passagen
    const qa = data as unknown as { question?: string; passages?: { id: string; text: string; chapter: string; section: string }[] };
    if (qa.question && qa.passages) {
      const sentences = extractiveAnswer(qa.question, qa.passages.map((p) => ({ label: p.id, text: p.text, chapter: p.chapter, section: p.section })));
      return { text: JSON.stringify({ sentences }), usage: { inputTokens: 0, outputTokens: 0 } };
    }
    // Schreibstil (ADR-040): automatische Regelkorrekturen statt echter Umformulierung
    const st = data as unknown as { task?: string; mode?: string; text?: string; terminology?: { preferred: string; avoid: string[] }[] };
    if (st.task === 'style' && typeof st.text === 'string') {
      const fixed = autoFix(st.text, st.mode === 'present' ? { rules: PRESENT_RULES } : { terms: st.terminology ?? [] }).text;
      return { text: JSON.stringify({ text: fixed }), usage: { inputTokens: 0, outputTokens: 0 } };
    }
    // Bilder aus Text (ADR-041): regelbasierte Struktur statt echter Analyse
    if (st.task === 'diagram' && typeof st.text === 'string') {
      return { text: JSON.stringify(parseStructure(st.text)), usage: { inputTokens: 0, outputTokens: 0 } };
    }
    // Übersetzung (ADR-020): kennzeichnet den Text mit der Zielsprache statt wirklich zu übersetzen
    const tr = data as unknown as { targetLanguage?: string; sentences: { n: number; text: string }[] };
    if (tr.targetLanguage) {
      const tag = `[${tr.targetLanguage.toUpperCase()}]`;
      const sentences = tr.sentences.map((s) => {
        const marker = s.text.match(/^\s*(?:\d+\.|[-*])\s+/)?.[0] ?? '';
        return { text: `${marker}${tag} ${s.text.slice(marker.length)}`, sources: [s.n] };
      });
      return { text: JSON.stringify({ sentences }), usage: { inputTokens: 0, outputTokens: 0 } };
    }
    const parts = data.blockType === 'list'
      ? data.paragraph.split('\n').map((l) => l.trim()).filter(Boolean)
      : data.paragraph.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ0-9])/).map((s) => s.trim()).filter(Boolean);
    const squash = (t: string) => t.replace(/\s+/g, ' ').toLowerCase();
    const sentences = parts.map((text) => {
      const cited = data.sources.filter((s) => squash(s.text).includes(squash(text).replace(/^(\d+\.|[-*])\s+/, '')));
      return { text, sources: (cited.length ? cited : data.sources).map((s) => s.id) };
    });
    return { text: JSON.stringify({ sentences }), usage: { inputTokens: 0, outputTokens: 0 } };
  }
}

export function createProvider(cfg: LlmConfig | null): LlmProvider | null {
  if (!cfg) return null;
  if (cfg.provider === 'anthropic') return new AnthropicProvider(cfg);
  if (cfg.provider === 'openai') return new OpenAiCompatibleProvider(cfg);
  if (cfg.provider === 'demo') return new DemoProvider(cfg);
  return null;
}
