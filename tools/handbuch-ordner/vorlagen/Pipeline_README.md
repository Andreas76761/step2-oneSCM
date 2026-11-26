# 09 Pipeline – Funktionen in Bearbeitung, noch nicht produktiv

Hier liegen die Jira-Tickets, die **in Bearbeitung und noch nicht produktiv** sind – geordnet nach der aktuellen Gliederung (gleiche Kapitel- und Unterkapitelordner wie in `02_Kapitel`). Je Ticket eine Datei `<Ticket>.md` mit **Erstelldatum**, **Stream**, **Produktionsdatum** und der Dokumentation, die schon vorab geschrieben wird.

| Ordner/Datei | Inhalt |
|---|---|
| `<Kapitel>/<Unterkapitel>/<Ticket>.md` | Ticket mit Kopf (Ticket, Status, Erstelldatum, Stream, Produktionsdatum, Gliederung) und Abschnitt „Dokumentation“ |
| `00_Ohne_Zuordnung/` | Tickets, die noch keinem Gliederungspunkt zugeordnet sind |
| `PIPELINE.md` | Übersicht aller Tickets (vom Abgleich aus der App gepflegt) |

Regeln:

1. **Nicht produktiv = nicht im Handbuch.** Inhalte aus der Pipeline gehören nicht in `02_Entwurf`, `04_Output` oder `05_I_Output`, auch nicht als Hinweis, solange das Ticket nicht produktiv ist.
2. **Produktiv** ist ein Ticket erst, wenn es erledigt ist **und** das Produktionsdatum erreicht ist – bestätigt von einem Menschen. Ticket- und Teststatus allein sind kein Nachweis.
3. **Übernahme:** In der App unter „Pipeline“ → Eintrag → „Ins Handbuch übernehmen“; die Dokumentation wird Quelle des Kapitels (Evidenz unbestätigt). Im Ordner legt der pipeline-redakteur eine Kopie nach `02_Kapitel/<Kapitel>/01_Quellen/Raw_<Jahr>/` und vermerkt die Übernahme in der Ticketdatei – die Ticketdatei bleibt hier (nichts löschen).
4. Tickets, deren Bearbeitung noch nicht begonnen hat, stehen in `10_Backlog`; interne Themen in `11_Intern`.

Abgleich mit der App: `python 00_Dokumentation/Werkzeuge/handbuch_struktur.py abgleich . --app http://localhost:3000 --projekt p_default --token <API-Token>` – eigene Änderungen an einer Ticketdatei bleiben, die App-Fassung liegt dann als `<Ticket>.md.neu` daneben.
