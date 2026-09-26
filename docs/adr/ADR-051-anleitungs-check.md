# ADR-051 Anleitungs-Check (Leserfreundlichkeit je Kapitel)

**Status:** akzeptiert, umgesetzt in Etappe 18

## Kontext
Ein Benutzerhandbuch ist dann gut, wenn Leserinnen und Leser eine Aufgabe damit ohne Rückfragen erledigen. Die Stilprüfung (ADR-040) bewertet Sätze, nicht den Aufbau einer Anleitung.

## Entscheidung
- **Regelbasierte Checkliste je Kapitelversion** (`domain/guidance.ts`, ohne KI), zehn Punkte:
  Zweck beschrieben · Voraussetzungen genannt · Handlungsschritte vorhanden · Schritte nummeriert · eine Handlung je Schritt · Menüpfade hervorgehoben · Ergebnis beschrieben · überschaubare Schrittzahl (≤ 10) · Abkürzungen erklärt (im Text „(SCM)“, in den Stammdaten oder der Terminologie) · kurze Absätze (≤ 80 Wörter).
  Handlungssätze werden an der Form erkannt („Klicken Sie …“, „Klicke …“, „Auf **Speichern** klicken.“), Menüpfade an „A > B“, „A → B“, „A » B“, „A › B“.
- **Wert 0–100:** je nicht erfüllter Pflicht (⚠) −15, je Empfehlung (i) −5. Einstufung „leicht zu befolgen“ ab 90, „gut, mit Lücken“ ab 70.
- **Korrekturen per Klick**, wo eindeutig: Fließtext mit Schritten → nummerierte Liste (Blocktyp `list`), zusammengesetzte Schritte („… und wählen Sie …“) teilen, Menüpfade fett setzen. Übernahme über die normale Absatzbearbeitung mit Versionsprüfung (veraltete Vorschläge werden übersprungen). Fehlende Abschnitte (Zweck, Voraussetzungen, Schritte, Ergebnis) schreibt man direkt in der Checkliste.
- **API:** `GET /guidance` (Übersicht je Kapitel), `GET /guidance/chapter-versions/{id}`, `POST …/apply` (Bearbeitungsrecht). Oberfläche „Anleitungs-Check“ (Menü „3 Prüfen“), Einstieg auch aus der Werkstatt und der Startseite.
- Icons ✓/!/i immer mit Text; der Abschnitt „Quellen- und Freigabestatus“ wird nicht bewertet.

## Konsequenzen
- Heuristik für deutsche Handbuchsprache: Handlungen ohne Imperativ oder Menüpfade aus kleingeschriebenen Wörtern werden nicht immer erkannt; die Checkliste ist Hilfe, keine Freigabebedingung.
