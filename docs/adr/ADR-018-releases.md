# ADR-018 Handbuch-Releases und statische Online-Hilfe

**Status:** akzeptiert, umgesetzt in Etappe 7

## Entscheidung
- Ein **Release** ist der unveränderliche Stand aller Kapitel mit freigegebener Version eines Projekts unter einer Versionsnummer (`handbook_releases`, eindeutig je Projekt). Veröffentlichen erfordert die Berechtigung `approve`; offene Blocker- oder Datenschutzbefunde verhindern es (gleiches Gate wie der Export).
- **Änderungsliste** gegenüber dem Vorgänger-Release je Kapitel: neu, geändert (mit Absatzzahlen aus dem Versionsvergleich, US-019), entfernt, unverändert.
- **Statische Online-Hilfe** als ZIP: Startseite mit Inhaltsverzeichnis und Einleitung, eine Seite je Kapitel mit Blättern, Änderungsseite. Eigenständig, ohne Skripte, mit eigener CSP (wie ADR-012); Quell-HTML wird escaped. Zusätzlich das Handbuch als Markdown.
- Artefakte liegen im Object-Store (`releases/<id>/…`) und werden bei Backups mitgesichert.

## Konsequenzen
- Spätere Freigaben verändern bestehende Releases nicht; ein neues Release dokumentiert die Änderungen.
- Die Online-Hilfe ist bewusst ohne Suche (keine Skripte); eine Suche kann ein nachgelagertes Hosting übernehmen.
