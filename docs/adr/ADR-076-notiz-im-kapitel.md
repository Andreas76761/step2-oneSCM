# ADR-076 Notizen direkt im Kapitel

**Status:** akzeptiert, umgesetzt in Etappe 25 (erweitert ADR-073)

## Kontext
Notizen zu Lesezeichen (ADR-073) ließen sich nur auf der Seite „Lesezeichen“ bearbeiten – ein Umweg mitten im Lesen.

## Entscheidung
- Unter dem Kapiteltitel **„📝 Notiz hinzufügen“** bzw. die vorhandene Notiz mit **„Notiz bearbeiten“**: Textfeld direkt im Kapitel (höchstens 500 Zeichen, Zähler), Speichern, Abbrechen (auch Esc), Notiz löschen.
- Eine Notiz merkt das Kapitel automatisch (gleiche Schnittstelle `PUT /reader/bookmarks/{chapterId}` mit `note`); Löschen der Notiz lässt das Lesezeichen bestehen.
- Beschriftungen in der Lesesprache (ADR-074); die Seite „Lesezeichen“ bleibt die Übersicht mit Filter und CSV-Export.
