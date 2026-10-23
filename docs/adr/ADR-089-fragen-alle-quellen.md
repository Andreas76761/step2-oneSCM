# ADR-089 Fragen über alle Quellen mit Belegen, erneut fragen, Export

**Status:** akzeptiert, umgesetzt in Etappe 37 (M5 aus [docs/06](../06-plan-onescm-metadaten.md); nutzt ADR-013, ADR-026, ADR-087)

## Kontext
Der Handbuch-Assistent (ADR-026) beantwortet Fragen nur aus dem freigegebenen Handbuch. Für oneSCM_Metadaten sollen Fragen an **alle eingelesenen Quellen** gehen – Handbücher, Folien, PDFs, Tickets, Wissensnotizen – mit Belegen je Satz, eingrenzbar nach Datei, Format, Überschrift und Label. Gespeicherte Fragen sollen sich mit neuem Stand erneut stellen und exportieren lassen. Daten bleiben lokal (M-02, M-03).

## Entscheidung
- **Such-Einheiten:** Chunks der aktuellen Revisionen; lange Chunks als Teilstücke mit Überlappung (ADR-087). Filter: Format, Datei, Überschrift (Teiltreffer im Überschriftenpfad), Labels (alle müssen gesetzt sein).
- **Hybride Suche:** Begriffe (Stämme und Präfixe, wie im Assistenten) für alle Einheiten; Vektor (lokale Embeddings, je Text-Hash zwischengespeichert) für die 200 besten nach Begriffen bzw. alle bei kleinen Beständen; Wert = Hälfte Bedeutung, Hälfte Begriffe → **Top 20**.
- **Neugewichtung:** 60 % Suchwert, 25 % Treffer in den Überschriften, 15 % gemeinsame Wortpaare → **Top 6** als nummerierte Belege.
- **Antwort:** mit KI-Dienst nur aus den Belegen (eigene Anweisung „nur aus den Auszügen“, Widersprüche benennen), jeder Satz wird wie bei der KI-Umformulierung gegen die zitierten Belege geprüft; unbelegte Sätze werden verworfen. Ohne KI oder ohne belegte Sätze: extraktive Antwort aus den passendsten Sätzen. Personenbezogene Daten gehen nie an externe Dienste. Jede Frage wird protokolliert (`metadata_ask_log`), KI-Antworten zusätzlich im Audit.
- **Speichern:** „Als Frage & Antwort übernehmen“ füllt die vorhandene Maske (ADR-079); der Rahmen der Frage (Filter) und die Frage-ID werden mitgespeichert.
- **Erneut fragen:** dieselbe Frage im gleichen Rahmen neu stellen; Vergleich mit dem gespeicherten Stand – Belege neu, entfallen, gleich und die Antwort wortweise.
- **Export:** gespeicherte Fragen und Antworten als CSV (Semikolon, UTF-8 mit BOM, Formeln entschärft), Excel oder JSON – mit den Filtern der Liste.

## Folgen
- Migration `043_metadata_ask.sql`; Tests T-263 … T-265, E2E T-266; Anforderungen NFR-87, NFR-88.
- Die Antwortqualität (Testfragen mit erwarteten Quellen, Trefferquote) misst M7.
