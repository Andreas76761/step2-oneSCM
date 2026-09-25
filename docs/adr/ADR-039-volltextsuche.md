# ADR-039 Volltextsuche mit Suchindex

**Status:** akzeptiert, umgesetzt in Etappe 13 (löst die Teilwortsuche aus ADR-035 ab)

## Kontext
Die globale Suche (ADR-035) war eine Teilwortsuche ohne Index: ohne Ranking, in SQLite mit Umlaut-Problemen und bei großen Beständen langsam.

## Entscheidung
- **Index je Datenbank**, zur Laufzeit angelegt und nicht im Backup (abgeleitete Daten):
  - SQLite: FTS5-Tabelle `search_fts`, Tokenizer `unicode61 remove_diacritics 2` (Groß-/Kleinschreibung, Umlaute und Akzente egal), Relevanz über BM25 mit Titel sechsfach gewichtet, Ausschnitt über `snippet()`.
  - PostgreSQL: Tabelle `search_docs` mit `tsvector` (Konfiguration `german`: Stammformen, Titel Gewicht A, Text B) und GIN-Index, Relevanz `ts_rank`, Ausschnitt `ts_headline`. Mit der Erweiterung `unaccent` (wird angelegt, wenn die Rechte reichen) werden auch Akzente anderer Sprachen ignoriert.
- **Inhalte:** Kapitel, Texte der neuesten Kapitelversion, aktuelle Textschnipsel (ohne entfernte Quellen), Quellen, Gliederungen (neueste Version, mit Einträgen), Abkürzungen, Glossar, FAQ – mit Sprungziel.
- **Aktualität:** je Projekt und Bereich ein Fingerabdruck (Anzahl, letzte Änderung); vor jeder Suche werden nur geänderte Bereiche neu aufgebaut, nach jedem Import vorab. `POST /search/reindex` baut alles neu auf (Administration, z. B. nach einer Wiederherstellung).
- **Anfrage:** Wörter aus Buchstaben/Ziffern, Präfixsuche je Wort („Anmel“ → „Anmeldung“), alle Wörter müssen vorkommen; Filter nach Bereich mit Trefferzahl je Bereich; Seiten; hervorgehobene Treffer.
- Die semantische Suche (ADR-017) bleibt für Bedeutungssuche.

## Konsequenzen
- Messung mit 20 000 Textabschnitten: erster Aufbau ca. 0,3 s (SQLite) bzw. 1,4 s (PostgreSQL), danach 10–20 ms je Suche.
- PostgreSQL findet über Stammformen mehr („Anmeldung“ findet auch „anmelden“) als SQLite (Präfix).
- Überschriften der Quellen (Unterkapitel) sind nur über ihre Kapitel bzw. Schnipsel auffindbar.
