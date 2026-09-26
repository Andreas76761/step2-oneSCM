# ADR-055 Kapitelvorlagen im Assistenten

**Status:** akzeptiert, umgesetzt in Etappe 19 (erweitert ADR-052)

## Entscheidung
- Sechs **Vorlagen je Aufgabentyp** (`domain/chapterTemplates.ts`, `GET /chapter-assistant/templates`): Datensatz anlegen, Prüfen und genehmigen, Suchen und filtern, Einstellung ändern, Fehler beheben, Bericht erstellen – jeweils mit Zweck, Voraussetzungen, Schritten, Ergebnis und Tipp.
- Im ersten Schritt des Kapitel-Assistenten optional wählbar; die Vorlage füllt leere oder noch unveränderte Felder. Stellen zum Ausfüllen sind mit „…“ markiert.
- **Platzhalter-Prüfung:** Der Anleitungs-Check (ADR-051) erhält einen elften Punkt „Keine Platzhalter“ (Pflicht, ⚠); der Assistent weist vor dem Anlegen auf offene „…“ hin.

## Konsequenzen
- Vorlagen sind fest im Code (keine Pflege in der Oberfläche); eigene Vorlagen je Projekt wären eine spätere Erweiterung.
- Auch „...“ (drei Punkte) gilt als Platzhalter.
