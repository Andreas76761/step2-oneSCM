# ADR-070 Lesezeichen und Verlauf in der Leseransicht

**Status:** akzeptiert, umgesetzt in Etappe 23 (erweitert ADR-054)

## Kontext
Wer regelmäßig mit dem Handbuch arbeitet, braucht wenige Kapitel immer wieder und möchte wissen, was sich seit dem letzten Lesen geändert hat.

## Entscheidung
- **Lesezeichen je Person** auf dem Server (geräteübergreifend): „☆ Merken“/„★ Gemerkt“ (`aria-pressed`) im Kapitelkopf, Liste „★ Lesezeichen“ oben im Inhaltsverzeichnis (`PUT`/`DELETE /reader/bookmarks/{chapterId}`).
- **Verlauf:** Beim Öffnen eines Kapitels wird die gelesene Fassung gemerkt (`POST /reader/visits`, Fassung wird gegen Kapitel und Projekt geprüft); „Zuletzt gelesen“ zeigt die letzten drei.
- **Hinweise** (`GET /reader/me`), bezogen auf freigegebene Fassungen:
  - **Geändert:** Es ist eine neuere Fassung freigegeben als die zuletzt gelesene.
  - **Neu:** Das Kapitel wurde nach dem **ersten** Lesen im Handbuch freigegeben und noch nie geöffnet. Bezug ist `first_visited_at`, das beim erneuten Lesen erhalten bleibt, weil der aktuelle Besuch beim Öffnen sofort gespeichert wird und den Hinweis sonst verdrängen würde. Neue Leser sehen daher keine Flut von Hinweisen.
- Markierung „Neu“/„Geändert“ im Inhaltsverzeichnis und ein Hinweis im Kapitel mit der Anzahl. Nach dem Lesen entfällt die Markierung.
- Tabellen `reader_bookmarks` und `reader_visits` (Migration 031), je Projekt und Person.
