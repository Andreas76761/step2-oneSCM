# ADR-084 Gliederungs-Vorschlag je Chunk, Kapitel ↔ Quellen, Wissensnotizen, Ausschlussliste, Zielkapitel je Dopplung

**Status:** akzeptiert, umgesetzt in Etappe 32 (F-13, F-14, F-15, F-17, F-18 aus [docs/07](../07-bestehende-artefakte.md); zieht Teile von M2–M4 vor; erweitert ADR-036, ADR-079, ADR-082)

## Kontext
Aus den Artefakten „Struktur und Klickstrecke“, „Handbuch-Werkstatt V4“ und „Wissenssuche“ wurden am 23.10.2026 übernommen: ein Gliederungs-Vorschlag je Chunk (nie automatisch bestätigt), die Gegenüberstellung Handbuch ↔ Quellen je Kapitel, Wissensnotizen als eigene Quelle, eine Ausschlussliste für den Eingang und ein Zielkapitel je Dopplung. Daten bleiben lokal, ohne KI.

## Entscheidung
- **Gliederungs-Vorschlag (F-13):** je Chunk ohne Gliederungspunkt bis zu drei Punkte der Gesamtgliederung mit Trefferwert 0–1 (ab 0,25) und den Treffer-Wörtern. Profil je Punkt: Name und Beschreibung doppelt gewichtet, dazu Namen der über die Zuordnung (ADR-082) verbundenen Domänen und Menüpunkte; seltene Wörter zählen mehr (Gewicht ÷ √Anzahl Profile). Unterüberschriften zählen 1,5-fach, der Kapiteltitel der Quelle wie Fließtext. Bonus 0,25, wenn der Chunk schon ein verbundenes Domänen- oder Menü-Label trägt. Übernommen wird nur von Hand über die vorhandene Label-Zuordnung; Filter „nur ohne Gliederungspunkt“ (`noOutline`).
- **Kapitel ↔ Quellen (F-14):** Seite unter oneSCM_Metadaten; links das Handbuchkapitel (gleicher Titel wie der Gliederungspunkt oder auf Grundlage zugeordneter Chunks) mit den Absätzen der neuesten Version, rechts die zugeordneten Chunks mit „im Handbuch“ bzw. „nicht verwendet“ und darunter Vorschläge mit „Zuordnen“. Übersicht je Punkt: zugeordnet, verwendet, Vorschläge; Ordner wie im Arbeitsordner.
- **Wissensnotizen (F-15):** Frage, Erkenntnis, Rollen, Sparten (nur Pkw, Van), „fachlich bestätigt“ und optional ein Screenshot (PNG, JPEG, GIF, WebP bis 5 MB, Pflicht-Alternativtext) werden als Quelle `wissensnotizen/<id>.md` über die normale Importpipeline eingelesen (Herkunft `note`, sofort statt über die Jobqueue): Revisionen, Chunks, Bild, Rollen/Sparten aus der Front-Matter, Evidenzstatus `manually_confirmed` bzw. `unconfirmed`. Personenbezogene Daten werden abgewiesen (422 mit Fundstellen) oder auf Wunsch pseudonymisiert. Ändern erzeugt eine neue Revision, Entfernen markiert die Quelle als entfernt (ADR-036).
- **Ausschlussliste (F-17):** Einstellung `import.excludePatterns` (höchstens 200 Muster, nur Administration): `*`, `**`, `?`; ohne „/“ für Dateinamen und Ordnernamen, mit „/“ für den Pfad; Groß-/Kleinschreibung egal. Ausgeschlossene Dateien – im ZIP, als Einzeldatei, auch einzelne Jira-Tickets – erscheinen im Import als „übersprungen“ mit dem zutreffenden Muster.
- **Zielkapitel je Dopplung (F-18):** „zusammenführen in …“ wählt einen Punkt der Gesamtgliederung (Vorschlag aus F-13 über beide Texte). Die Wahl setzt das Gliederungs-Label auf beide Textabschnitte, so dass sie unter „Kapitel ↔ Quellen“ zusammen erscheinen; Entfernen lässt die Label-Zuordnungen stehen. Tabelle `duplicate_targets`, Audit `duplicate.target_set`.

## Folgen
- Migration `039_knowledge_notes.sql`; Tests T-244 … T-246, E2E T-247; Anforderungen NFR-77, NFR-78.
- Die Vorschläge sind bewusst lexikalisch; ein semantischer Vorschlag (lokale Embeddings) kann später ergänzt werden, ohne die Regel „nie automatisch“ zu ändern.
