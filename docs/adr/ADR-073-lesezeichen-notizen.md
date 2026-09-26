# ADR-073 Lesezeichen mit eigenen Notizen

**Status:** akzeptiert, umgesetzt in Etappe 24 (erweitert ADR-070)

## Kontext
Leser merken sich Kapitel (ADR-070), wollen aber festhalten, *wozu* – z. B. „für die Inventur im Dezember“.

## Entscheidung
- Je Lesezeichen eine **private Notiz** (höchstens 500 Zeichen, nur für die Person sichtbar): `PUT /reader/bookmarks/{chapterId}` mit `{ note }` legt das Lesezeichen an bzw. ändert die Notiz; leer = keine Notiz; andere Typen → 400.
- Seite **„Lesezeichen“** (`/lesen/lesezeichen`, verlinkt unter „★ Lesezeichen“ im Inhaltsverzeichnis): Filter über Titel und Notiz, Notiz bearbeiten, Lesezeichen entfernen, **Export als CSV** (Excel-tauglich mit BOM und Semikolon).
- Im Kapitel steht die Notiz unter dem Titel mit Link „Notiz bearbeiten“.
- Spalte `reader_bookmarks.note` (Migration 032).
