# ADR-074 Beschriftungen der Leseransicht in der Lesesprache

**Status:** akzeptiert, umgesetzt in Etappe 25 (erweitert ADR-071, ADR-072)

## Kontext
Seit Etappe 24 erscheinen Kapitel in der gewählten Sprache, die Beschriftungen rundherum („Tipp“, „Siehe auch“, „3 von 5 Schritten erledigt“, „War dieses Kapitel hilfreich?“, Deckblatt und Seitenzahlen im Druck) blieben aber deutsch. Für Händler im Ausland wirkte das Handbuch dadurch halb übersetzt.

## Entscheidung
- Ein **Wörterbuch der Leseransicht** im Web-Client (`readerText.ts`): Deutsch, Englisch, Französisch, Spanisch und Italienisch vollständig; die übrigen Projektsprachen (Niederländisch, Polnisch, Tschechisch, Portugiesisch) lesen die **englischen** Beschriftungen – verständlicher als Deutsch. Sprachnamen erscheinen in der Sprache selbst („français“).
- **Was Leser sehen, folgt der Lesesprache:** Inhaltsverzeichnis, Suche, Lesezeichen/Verlauf, Hinweise „neu/geändert“, Rückfall-Hinweis, Schritte-Zähler, Rückmeldung, „Siehe auch“ und FAQ, Notiz. Bedienelemente der Redaktion („Verweise bearbeiten“, „Entwürfe einblenden“) und die App-Navigation bleiben deutsch. Jeder Bereich trägt das passende `lang`-Attribut (WCAG 3.1.2).
- **Hinweis-Beschriftungen im Kapiteltext** („Tipp:“, „Achtung:“) folgen der Sprache des *gezeigten Textes* – bei deutschem Rückfall also deutsch, passend zu den Abschnittstiteln.
- **Druck:** Deckblatt (Benutzerhandbuch, Stand, Kapitel, Veröffentlicht), Inhaltsverzeichnis, „Siehe auch: Kapitel 4 „…““ mit landesüblichen Anführungszeichen, FAQ- und Glossar-Anhang, Rückfall-Hinweis, Kopfzeile („für Rolle“) und **„Seite X von Y“** in der Druck-Sprache; Datumsformat der Sprache.
- **Online-Hilfe:** Beschriftungen gab es in fünf Sprachen; für die übrigen Projektsprachen jetzt englisch statt deutsch.

## Konsequenzen
- Neue Beschriftungen der Leseransicht werden im Wörterbuch für alle fünf Sprachen ergänzt (TypeScript erzwingt vollständige Einträge).
