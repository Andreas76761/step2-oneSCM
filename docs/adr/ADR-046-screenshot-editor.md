# ADR-046 Screenshot-Editor: Pfeile, Textfelder, Unschärfe

**Status:** akzeptiert, umgesetzt in Etappe 16 (erweitert ADR-042)

## Entscheidung
- Zusätzliche Werkzeuge im Tab „Screenshot markieren“: **Pfeil ziehen**, **Textfeld setzen** (Beschriftung, Position per Tastatur änderbar), **Unkenntlich machen** (Bereich aufziehen).
- Unkenntlich gemachte Bereiche werden **verpixelt** (verkleinert und ohne Glättung vergrößert, Blockgröße abhängig von der Bildgröße) und so ins PNG geschrieben – das Original wird nicht gespeichert, die Inhalte sind im Ergebnis nicht wiederherstellbar.
- Zeichenreihenfolge: Unschärfe, Rahmen, Pfeile, Textfelder, Nummern. Rückgängig gilt für alle Werkzeuge in der Reihenfolge des Einzeichnens. Die Beschreibung des Bildes für Screenreader nennt die Anzahl je Markierungsart.

## Konsequenzen
- Der Editor arbeitet vollständig im Browser; auf dem Server kommt nur das fertige PNG an (Bildablage wie ADR-029).
