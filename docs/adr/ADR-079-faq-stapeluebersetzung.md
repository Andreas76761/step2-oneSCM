# ADR-079 Häufige Fragen als Stapel übersetzen

**Status:** akzeptiert, umgesetzt in Etappe 27 (erweitert ADR-077, ADR-044)

## Kontext
Seit Etappe 26 lassen sich häufige Fragen je Eintrag übersetzen. Bei vielen Einträgen und mehreren Sprachen musste die Redaktion den KI-Vorschlag für jede Frage einzeln auslösen; nach Änderungen am deutschen Original war unklar, welche Übersetzungen nachzuziehen sind.

## Entscheidung
- **Auftrag je Sprache** (`POST /faq/translation-batches`, Berechtigung edit): übersetzt alle deutschen Einträge, deren Übersetzung in der Sprache **fehlt oder veraltet** ist, als KI-Entwurf. Aktuelle Entwürfe und Freigaben bleiben unberührt, damit keine Handarbeit überschrieben wird.
- **Hintergrundjob** `faq-translate-batch` (Tabelle `faq_translation_batches`, Migration 035) wie die Stapelumformulierung (ADR-044): Fortschritt (`done`/`total`), Zähler *übersetzt*, *mit Prüfbefund*, *übersprungen*, *fehlgeschlagen*, Abbruch, Fortsetzung nach Neustart ab der letzten Position. Je Projekt und Sprache läuft höchstens ein Auftrag (eindeutiger Teilindex, sonst 409).
- **Datenschutz:** Bei einem externen KI-Dienst werden Einträge mit personenbezogenen Daten (E-Mail, Telefon, IBAN) nicht ausgewählt; die Vorschau (`/faq/translation-batches/preview`) nennt ihre Zahl.
- **Freigabe unverändert:** Stapel-Entwürfe tragen die auftraggebende Person als Bearbeiter; freigegeben wird wie bisher nur ohne Prüfbefund und durch eine andere Person (Vier-Augen-Prinzip).
- **Ergebnis-Hinweis** an die auftraggebende Person mit Link `/stammdaten/faq?sprache=…`; die Karte „Häufige Fragen übersetzen“ in den Stammdaten zeigt je Sprache „fehlen · veraltet · Entwürfe warten auf Freigabe“, den Fortschritt und das Ergebnis des letzten Auftrags.

## Konsequenzen
- Ein Klick statt vieler; die Prüfung bleibt Menschensache.
- Fehlgeschlagene Einträge bleiben fehlend und werden beim nächsten Auftrag erneut ausgewählt.
