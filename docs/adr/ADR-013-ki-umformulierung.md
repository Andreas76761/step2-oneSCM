# ADR-013 KI-gestützte Umformulierung mit Quellenbindung je Satz

**Status:** akzeptiert, umgesetzt in Etappe 5 (Entscheidung E-16 vom 24.09.2026)

## Kontext
Der Generator bleibt extraktiv (ADR-007): Er übernimmt bestätigte Quelltexte unverändert. Sprachlich sind diese Texte oft uneinheitlich. Eine KI kann sie glätten, darf aber nichts erfinden (US-008) und muss nachvollziehbar bleiben (US-009, US-012, §9 Regel 5).

Entscheidung E-16 (Auftraggeber, 24.09.2026):
- **a)** Quelltexte dürfen an einen Cloud-KI-Dienst übertragen werden. Die Funktion ist standardmäßig ausgeschaltet; der Betreiber aktiviert sie per Konfiguration.
- **b)** Anzubinden sind Anthropic Claude **und** OpenAI-kompatible Endpunkte (OpenAI, Azure OpenAI, vLLM, Ollama …), Auswahl per Konfiguration.
- **c)** Jeder umformulierte Satz muss Quellen nennen; die Umformulierung ist nur ein Vorschlag, den die Redaktion annimmt oder verwirft.

## Entscheidung
- **Anbieter-Schnittstelle** `LlmProvider` (`apps/server/src/llm.ts`) mit den Adaptern `anthropic` (Messages API), `openai` (Chat Completions) und `demo` (ohne Netzwerk, nur für Demo und Tests). Konfiguration: `LLM_PROVIDER`, `LLM_MODEL` (Standard für Anthropic: `claude-sonnet-5`), `LLM_API_KEY` bzw. `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`, `LLM_BASE_URL`, `LLM_TIMEOUT_MS`, `LLM_MAX_TOKENS`. Ohne `LLM_PROVIDER` ist die Funktion aus (HTTP 503).
- **Übertragen werden nur** der Absatz, seine zugeordneten Quelltexte (als `S1…Sn`) und die aktiven Begriffe der Terminologie. Die Nutzdaten stehen getrennt von den Anweisungen als JSON-Block; das Modell soll sie als Daten behandeln.
- **Keine Übertragung** bei gesperrten Blöcken, Lücken, Querverweisen, Tabellen, Code, Absätzen ohne Quelle, offenen Datenschutzbefunden der Quellen oder personenbezogenen Daten, die nur im (manuell bearbeiteten) Absatz stehen.
- **Antwortformat:** `{"sentences":[{"text":…,"sources":["S1"]}]}`. Jeder Satz wird automatisch geprüft (`domain/rewrite.ts`):
  - mindestens eine Quelle, nur bekannte Quellen (`no_sources`, `unknown_source`);
  - keine Zahlen, die nicht in den zitierten Quellen stehen (`new_numbers`);
  - Abdeckung der Inhaltswörter durch die zitierten Quellen mindestens `rewrite.minSupport` (Standard 0,5; bevorzugte Begriffe zählen als gedeckt) (`low_support`);
  - keine neuen personenbezogenen Daten (`privacy`).
- **Vorschlag** (`rewrite_proposals`): Status `proposed` (alle Sätze bestanden) oder `invalid`. Nur `proposed` kann übernommen werden, und nur, solange der Absatz unverändert ist (sonst `stale`). Verwerfen ist immer möglich.
- **Übernahme:** Blocktext = Sätze (Listen zeilenweise), Modus `ai_rewritten`, Satz-Evidenz in `content_blocks.sentence_sources`, Blockversion mit Änderungstyp `rewritten`. Der Modus ist wie manuelle Bearbeitung vor Neugenerierung geschützt; ändern sich die Quellen, wird er `needs_regeneration`. Eine manuelle Textänderung entfernt die Satz-Evidenz (Modus `manually_edited`).
- **Qualitätsgate:** neue Prüfung `sentence_evidence` – die gespeicherten Sätze ergeben den Blocktext, und jeder Satz zitiert eine Quelle, die dem Absatz noch zugeordnet ist.
- **Nachvollziehbarkeit:** Audit `rewrite.proposed` / `rewrite.failed` / `rewrite.accepted` / `rewrite.rejected` mit Anbieter, Modell, Prompt-Version, SHA-256 der Anfrage und den übertragenen Textabschnitten; die Rohantwort wird am Vorschlag gespeichert.

## Konsequenzen
- Die Prüfung ist heuristisch (Wortstämme, Zahlen). Sie verhindert grobe Erfindungen, ersetzt aber nicht das Lesen durch die Redaktion; deshalb bleibt die Übernahme eine bewusste Entscheidung und die Freigabe (US-016) unverändert.
- Mit einem externen Anbieter verlassen Handbuchtexte das Unternehmen. Betreiber regeln Auftragsverarbeitung und Region (z. B. über `LLM_BASE_URL`). Die Oberfläche fragt vor jeder Übertragung an einen externen Dienst nach.
- Kosten und Latenz entstehen je Anfrage; Umformulierung erfolgt bewusst je Absatz, nicht für ganze Kapitel auf einmal.

## Alternativen
- Freie Umformulierung ganzer Kapitel: höheres Risiko erfundener Inhalte, Evidenz nicht mehr je Satz prüfbar.
- Selbst betriebenes Modell only: datenschutzfreundlicher, aber vom Auftraggeber nicht gefordert; über den OpenAI-kompatiblen Adapter weiterhin möglich.
