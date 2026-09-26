# ADR-049 Screenshot-Editor: Zuschneiden, Lupe, Verschieben

**Status:** akzeptiert, umgesetzt in Etappe 17 (erweitert ADR-046)

## Entscheidung
- **Zuschneiden:** Ausschnitt aufziehen; im Editor wird der Rest abgedunkelt, gespeichert wird nur der Ausschnitt (neu gezeichnet ohne Abdunklung). „Zuschnitt aufheben“ stellt das ganze Bild wieder her. Markierungen behalten ihre Lage relativ zum Originalbild.
- **Lupe:** Quellbereich aufziehen, 2- oder 3-fach vergrößerte Kopie erscheint daneben (rechts, sonst links, innerhalb des Bildes) mit Rahmen und Verbindungslinie; unkenntlich gemachte Bereiche bleiben auch in der Lupe unkenntlich.
- **Verschieben:** Nummern, Textfelder, Pfeilenden, Rahmen, unkenntliche Bereiche und Lupen (Quelle mit Ziel oder nur das Ziel) mit der Maus anfassen und verschieben; Nummern und Textfelder zusätzlich über die Prozentfelder (Tastatur).

## Konsequenzen
- Verschieben ist nicht Teil von „Rückgängig“ (nur das Einzeichnen).
