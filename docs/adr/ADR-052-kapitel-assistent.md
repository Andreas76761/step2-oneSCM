# ADR-052 Kapitel-Assistent

**Status:** akzeptiert, umgesetzt in Etappe 18

## Kontext
Ein leerer Editor ist der schwerste Einstieg. Redakteurinnen und Redakteure sollen ein neues Kapitel geführt und im richtigen Aufbau schreiben – mit dem, was in den Quellen schon steht.

## Entscheidung
- **Vier Schritte:** Aufgabe (Titel, Zweck) → Voraussetzungen → Schritte → Ergebnis & Tipps; jederzeit zurück, Einträge bearbeiten, sortieren und entfernen; Vorschau rechts.
- **Vorschläge aus den Quellen** (`GET /chapter-assistant/suggestions?topic=`): Sätze aktueller Textschnipsel, die Begriffe des Titels enthalten, plus die Nachbarsätze aus den (bis zu drei) Kapiteln mit den meisten Treffern; eingeteilt in Schritte (Handlungssätze, Quellreihenfolge), Voraussetzungen, Ergebnis und Hinweise. Übernommene Sätze bleiben als Quelle am Absatz verknüpft (Evidenz).
- **Anlegen** (`POST /chapter-assistant`, Bearbeitungsrecht): neues Kapitel mit Entwurf Version 1 im Standardaufbau der Kapitelabschnitte (Zweck, Voraussetzungen als Liste, nummerierte Schritte, Ergebnis, Tipps); Absätze ohne Quelle erhalten die Begründung „Mit dem Kapitel-Assistenten verfasst“. Die Antwort enthält gleich den Anleitungs-Check (ADR-051).

## Konsequenzen
- Der Assistent legt neue Kapitel an; bestehende Kapitel werden in der Werkstatt überarbeitet.
- Die Vorschläge sind stichwortbasiert (kein KI-Aufruf) und damit auch ohne KI-Dienst verfügbar.
