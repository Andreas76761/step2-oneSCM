# ADR-072 „Siehe auch“ und FAQ im Druck und in der Online-Hilfe

**Status:** akzeptiert, umgesetzt in Etappe 24 (erweitert ADR-069, ADR-056, ADR-022)

## Kontext
„Siehe auch“ und passende FAQ (ADR-069) gab es nur in der Leseransicht. Im gedruckten Handbuch und in der Online-Hilfe aus oneSCM fehlten die Querverweise.

## Entscheidung
- **Druck:** Unter jedem Kapitel „Siehe auch: Kapitel 4 „…“; Kapitel 7 „…““ – mit Kapitelnummer des gedruckten Handbuchs und Sprungmarke (im PDF anklickbar). Es zählen nur Kapitel, die mitgedruckt werden. Passende FAQ der gedruckten Kapitel erscheinen gesammelt im Anhang **„Häufige Fragen“** (im Inhaltsverzeichnis). Ein Abruf für alle Kapitel: `GET /reader/related` (Map chapterId → Verweise, FAQ), beim Druck einer Handbuch-Variante mit `outline=` für deren Kapitel. Die Druckansicht wartet darauf, bevor „Drucken“ möglich ist.
- **Sprache im Druck:** Auswahl „Sprache“ (`?sprache=`), Kapitel in der Übersetzung, nicht übersetzte deutsch mit Kennzeichen „(noch nicht übersetzt – deutsche Fassung)“.
- **Online-Hilfe:** `GET /context-help/{key}` liefert zusätzlich `related` (Titel und – falls vorhanden – Hilfethema `contextKey` des verwandten Kapitels) und `faq`. Die eingebettete Hilfe zeigt „Siehe auch“ als Links auf die Hilfe der anderen Themen (Rolle und Sprache bleiben erhalten) und FAQ aufklappbar; Beschriftungen in fünf Sprachen.
- **Sprachunabhängige Ähnlichkeit:** Kapitel werden über die deutsche Quelle verglichen, damit Verweise nicht davon abhängen, welche Kapitel schon übersetzt sind; FAQ in der Lesesprache werden gegen die übersetzten Texte verglichen.
