# ADR-077 Häufige Fragen übersetzen

**Status:** akzeptiert, umgesetzt in Etappe 26 (erweitert ADR-069, ADR-071, ADR-072)

## Kontext
Häufige Fragen hatten je Eintrag eine Sprache; für andere Sprachen musste die Redaktion eigene Einträge anlegen, ohne Bezug zum deutschen Original. Leser sahen deshalb meist deutsche FAQ, auch wenn die Kapitel übersetzt waren, und Änderungen am Original blieben in Kopien unbemerkt.

## Entscheidung
- **Übersetzung je deutschem Eintrag und Projektsprache** (Tabelle `faq_translations`, Migration 034): Frage und Antwort, Stand *Entwurf* oder *freigegeben*, Herkunft *von Hand* oder *KI-Vorschlag*, Prüfbefunde wie bei Kapitelübersetzungen.
- **Veraltet-Erkennung:** Beim Übersetzen wird ein Fingerabdruck (SHA-256) der deutschen Frage und Antwort gespeichert. Ändert sich das Original, gilt die Übersetzung als *veraltet*, Leser sehen wieder die deutsche Fassung, und eine Freigabe ist erst nach Überarbeitung möglich (409).
- **Rechte:** Lesen mit Leserecht; Übersetzen, KI-Vorschlag und Löschen mit Bearbeitungsrecht; Freigeben mit Freigaberecht (Vier-Augen-Prinzip wie bei Kapiteln).
- **KI-Vorschlag** (`POST /faq/{id}/translations/{lang}/machine`): satzweise wie Kapitelübersetzungen (Terminologie im Prompt, keine personenbezogenen Daten an externe Dienste), gespeichert als Entwurf.
- **Leser** (`GET /reader/faq?lang=`): deutsche Einträge in der freigegebenen, aktuellen Übersetzung, sonst deutsch mit Kennzeichen „DE“ und Hinweis; direkt in der Sprache verfasste Einträge bleiben erhalten. Dieselbe Liste speist „Häufige Fragen dazu“, den FAQ-Anhang im Druck und die Online-Hilfe.
- **Passende FAQ sprachunabhängig:** Einträge mit deutscher Quelle werden über die deutsche Quelle mit den Kapiteln verglichen (wie „Siehe auch“, ADR-072); nur direkt fremdsprachig verfasste Einträge gegen die angezeigten Texte. Die Online-Hilfe zeigt „Siehe auch“ und FAQ in der angefragten Sprache, auch wenn das Kapitel selbst noch deutsch ist.
- **Pflege** in den Stammdaten unter „FAQ“: Stand je Sprache an jedem Eintrag (✓ freigegeben, ✎ Entwurf, ⚠ veraltet, – fehlt), Bearbeiten, KI-Vorschlag, Freigeben, Löschen.
