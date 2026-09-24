# ADR-021 Mehrsprachige Releases

**Status:** akzeptiert, umgesetzt in Etappe 8

## Kontext
Seit Etappe 7 gibt es Übersetzungen je Kapitelversion (ADR-020) und Handbuch-Releases (ADR-018). Releases enthielten aber nur die deutsche Fassung.

## Entscheidung
- Ein Release nimmt für jede Zielsprache des Projekts die **freigegebenen Übersetzungen genau der veröffentlichten Kapitelversionen** auf. Veraltete oder nicht freigegebene Übersetzungen gelten als nicht vorhanden.
- Eine Sprache wird nur aufgenommen, wenn **mindestens ein Kapitel** übersetzt ist; `handbook_releases.languages` hält je Sprache `translated/total` und den Schlüssel des Markdown-Handbuchs (Migration `011`).
- **Online-Hilfe:** Deutsch im Wurzelverzeichnis, jede weitere Sprache unter `<sprache>/` mit denselben Dateinamen, Sprachumschalter auf jeder Seite, `lang`-Attribut, Oberflächentexte für de/en/fr/es/it (sonst Englisch).
- **Rückfall:** Nicht übersetzte Kapitel erscheinen in der Sprachfassung auf Deutsch mit sichtbarem Hinweis (z. B. „Not yet translated – German version shown.“) und `lang="de"` am Inhalt.
- **Markdown je Sprache** über `GET /releases/{id}/download?format=md&language=en`.
- **Übersetzungsstand** je Sprache (freigegeben, Entwurf, veraltet, fehlend) im Dashboard.

## Konsequenzen
- Releases bleiben unveränderlich; spätere Übersetzungen erscheinen erst im nächsten Release.
- Backups enthalten alle Sprachfassungen (Objektschlüssel aus `languages`).
