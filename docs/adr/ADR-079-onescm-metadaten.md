# ADR-079 oneSCM_Metadaten: Labels, Chunks und gespeicherte Fragen und Antworten (Etappe M1)

**Status:** akzeptiert, umgesetzt in Etappe 27 (M1 des Plans [docs/06-plan-onescm-metadaten.md](../06-plan-onescm-metadaten.md))

## Kontext
Der Auftraggeber möchte alle Quelldateien (DOCX, PPTX, HTML, PDF, MP4) in kleinen Abschnitten (Chunks) je Überschrift sehen, labeln, nach doppelten Inhalten durchsuchen und befragen. Antworten sollen Quelldatei und Auszug nennen und sich mit Labels speichern lassen. Am 23.10.2026 hat er die Annahmen M-01 … M-10 übernommen, mit drei Änderungen: Die Daten bleiben lokal, die Labels sind vordefiniert (100 Stück, darunter ein Gliederungsvorschlag für das Handbuch, Rollen und die Navigation im System), Sprachen sind Deutsch und Englisch.

## Entscheidung
- **Modul in der bestehenden App** (M-01): eigener Navigationsbereich „oneSCM_Metadaten“ mit Übersicht, Chunks, Fragen & Antworten und Labels. Einlesen, Chunking je Überschrift, Volltext- und semantischer Index sowie die Dopplungserkennung werden wiederverwendet.
- **Chunks** sind die Textabschnitte (`text_snippets`) der aktuellen Revisionen nicht entfernter Quelldateien. Neu ist die Spalte `locator` (JSON: `page`, `slide`, `time` oder `anchor`), die ab M2 für PDF-Seiten, Folien und Zeitmarken gefüllt wird; ohne sie gelten die Zeilen.
- **Label-Katalog** (M-06, `domain/metadataLabels.ts`): 100 Labels in sechs Gruppen – Handbuch-Gliederung (30, als Kapitelfolge nummeriert), Rollen (10), Navigation im System (25 Menüpfade), Inhaltstyp (15), Sparte (5), Qualität und Status (15) –, jeweils mit deutschem und englischem Namen und stabilem Code. Jedes Projekt erhält den Katalog beim Anlegen und beim Start der Anwendung (nur fehlende Codes, bestehende Anpassungen bleiben).
- **Pflege nur durch die Administration:** umbenennen (Deutsch, Englisch), beschreiben, ausblenden/einblenden, eigene Labels ergänzen. Ausgeblendete Labels sind nicht mehr zuweisbar, bestehende Zuordnungen bleiben sichtbar. Labels werden nie gelöscht.
- **Chunks labeln** (Berechtigung `edit`): einzeln oder gesammelt (bis 500 Chunks je Aufruf) hinzufügen und entfernen; filtern nach Text, Format, „ohne Label“ und mehreren Labels (alle müssen vorhanden sein). Ansicht „je Überschrift“ fasst Chunks aller Dateien unter Kapitel › Unterkapitel zusammen.
- **Fragen und Antworten speichern** (Berechtigung `edit`, lesen mit `read`): Frage, Antwort, Sprache (Deutsch/Englisch), Notiz, Labels und bis zu 20 Quell-Chunks. Je Quelle werden Pfad, Überschriftenpfad, Fundstelle und ein Auszug (600 Zeichen) **beim Speichern festgehalten**, damit die Antwort nachvollziehbar bleibt, auch wenn sich die Quelle später ändert. Die automatische Antwort aus allen Quellen folgt in M5.
- **Daten bleiben lokal** (M-02, M-03, M-04): M1 überträgt nichts an externe Dienste. Für spätere Etappen gilt: Embeddings lokal, Antworten extraktiv oder über ein lokal betriebenes, OpenAI-kompatibles Sprachmodell (z. B. Ollama), Transkription lokal (whisper.cpp).
- Alle Änderungen werden im Audit protokolliert (`metadata.label.*`, `metadata.chunk_labels.changed`, `metadata.qa.*`); IDs anderer Projekte gelten als nicht vorhanden.

## Folgen
- Migration `035_metadata.sql`: `text_snippets.locator`, `metadata_labels`, `metadata_chunk_labels`, `metadata_qa`, `metadata_qa_labels`.
- API unter `/metadata/…` (OpenAPI, Tag „Metadaten“), Anforderungen NFR-66 … NFR-68, Tests T-209 … T-211 und E2E T-237 (axe).
- Gliederung und Navigation sind ein **Vorschlag**: Codes bleiben stabil, Namen passt die Administration je Projekt an. Weitere Katalog-Labels einer späteren Version erscheinen automatisch, ohne Anpassungen zu überschreiben.
