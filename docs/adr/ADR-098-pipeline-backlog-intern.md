# ADR-098 Pipeline, Backlog und Intern: kommende Funktionen vorab dokumentieren, interne Themen getrennt halten

**Status:** akzeptiert, umgesetzt in Etappe 45 (erweitert ADR-081 Jira-Import, ADR-083 Release-Abgleich, ADR-096 Kapitelsteuerung)

## Kontext
Die Redaktion soll Funktionen schon dokumentieren, während die Jira-Tickets noch in Bearbeitung sind. Ins Handbuch dürfen diese Inhalte erst, wenn die Funktion produktiv ist. Bisher gab es dafür keinen Ort:
- Jira-Tickets waren nur Quellen und wurden im Release-Abgleich gezeigt.
- Vorab-Dokumentation landete entweder im Entwurf, wo sie zu früh ist, oder gar nicht.
- Interne Themen wie Testing, Reporting, Systeme, Migration und Rollout mischten sich mit Handbuchinhalten.

Gewünscht sind drei neue Bereiche in App, Datenbank und Arbeitsordner:
- **Pipeline:** Jira-Tickets in Bearbeitung, noch nicht produktiv. Unterordner nach der aktuellen Gliederung, mit Erstelldatum, Stream und Produktionsdatum, bereits dokumentiert.
- **Backlog:** Tickets, deren Bearbeitung noch nicht begonnen hat.
- **Intern:** mit den Unterordnern Testing, Reporting, Systeme, Migration, Rollout und Other.

## Entscheidung

**Datenmodell**
- Eine Tabelle `work_items` (Migration 052) hält alle drei Bereiche: `area` = pipeline | backlog | intern; `topic` nur für Intern.
- Weitere Felder: Ticket, Status und Typ aus Jira, Stream, Erstelldatum, Produktionsdatum (dazu der zuletzt aus Jira gelesene Wert), Kapitel und Unterkapitel mit Herkunft der Zuordnung, Vorab-Dokumentation (Markdown) und Zustand.
- Je Projekt gibt es höchstens einen Eintrag je Ticket.

**Zustände**

| Zustand | Bedeutung |
|---|---|
| offen | noch keine Dokumentation |
| bereits dokumentiert | Text vorhanden |
| produktiv – übernehmen | erledigt und Produktionsdatum erreicht |
| übernommen | ins Handbuch übernommen, Eintrag bleibt als Nachweis |
| abgebrochen | Ticket abgebrochen oder von Hand gesetzt |

**Jira-Felder**
- Der Jira-Import liest zusätzlich **Stream** und **Produktionsdatum** aus eigenen Feldern: XML-Customfield bzw. CSV-Spalte „Stream“, „Production Date“, „Produktionsdatum“, „Go-Live Date“, jeweils auch als „Custom field (…)“.
- Deutsche Datumsangaben TT.MM.JJJJ werden als Datum erkannt.
- Front-Matter und Feldtabelle des Tickets enthalten die beiden Felder nur, wenn sie gefüllt sind. Ältere Exporte ergeben dieselbe Quelle wie bisher.

**Abgleich „Aus Jira-Tickets abgleichen“**
- Der Abgleich ordnet nach den Statusgruppen des Release-Abgleichs (ADR-083) ein:

  | Ticketstatus | Bereich |
  |---|---|
  | offen/Backlog | Backlog |
  | in Bearbeitung, Test, blockiert | Pipeline |
  | erledigt, Produktionsdatum in der Zukunft | Pipeline – noch nicht produktiv |
  | erledigt sonst | produktiv |
  | abgebrochen | abgebrochen |

- Neue Einträge entstehen nur für Backlog und Pipeline. Bugs sind intern (F-03) und bekommen keinen Eintrag.
- Vorhandene Einträge folgen dem Status: Backlog ↔ Pipeline; produktiv → „übernehmen“; abgebrochen; wieder in Arbeit → zurück. Was nach Intern verschoben wurde, bleibt dort.
- Leere Felder füllt Jira. Ein von Hand geändertes Produktionsdatum gilt vor dem aus Jira, auch für die Einordnung.
- **Gliederung:**
  - Nutzt die aktuelle Fassung eines Kapitels das Ticket bereits als Quelle, gilt dieses Kapitel.
  - Sonst gibt es einen **Vorschlag** über gemeinsame Wortstämme von Ticket und Kapitel- bzw. Unterkapiteltitel. Mindestens die Hälfte der Titelwörter muss im Ticket stehen.
  - Der Vorschlag ist gekennzeichnet; die Redaktion bestätigt oder ändert ihn.
- „Aktuelle Gliederung“ heißt: Kapitel und Unterkapitel der Quellen ohne Historie, ohne Varianten und ohne die Sammelkapitel „Jira-Tickets“ und „Wissensnotizen“.

**Übernahme ins Handbuch** („Ins Handbuch übernehmen“, nur Pipeline)
- Voraussetzungen: Gliederung zugeordnet, Dokumentation vorhanden.
- Ein Mensch bestätigt, dass das Ticket produktiv ist. Ticket- und Teststatus allein sind kein Nachweis.
- Die Dokumentation wird über den normalen Import als Quelle `pipeline-<Ticket>.md` eingelesen:
  - Kapitelüberschrift als H1, Unterkapitel als H2, eigene Überschriften darunter.
  - Evidenz „unbestätigt“, damit Bestätigen, Generieren und Freigeben bei der Redaktion bleiben.
- Der Eintrag bleibt mit Zustand „übernommen“ und Verweis auf den Import erhalten und lässt sich danach nicht mehr ändern.

**Intern**
- Sechs feste Themen: Testing, Reporting, Systeme, Migration, Rollout, Other.
- Intern-Einträge erscheinen nie im Handbuch, in Export, Release oder Übersetzung, denn sie sind keine Quellen.

**Datenschutz und Löschen**
- Titel und Text werden wie bei Wissensnotizen geprüft: Ein Fund wird abgewiesen oder auf Wunsch pseudonymisiert.
- Eigene Einträge lassen sich löschen. Jira-Einträge nicht, denn sie kämen beim nächsten Abgleich wieder; sie werden auf „abgebrochen“ gesetzt.

**Oberfläche**
- Neue Navigationsgruppe „Pipeline, Backlog, Intern“ mit drei Seiten:
  - Pipeline gruppiert je Kapitel → Unterkapitel, dazu „Ohne Zuordnung“.
  - Spalten Ticket, Titel, Erstelldatum, Stream, Produktionsdatum, Status (Jira), Dokumentation.
  - Intern hat Reiter je Thema.
  - Bearbeiten im Dialog.
- In der Kapitelwerkstatt erscheint ein Hinweis „Pipeline: n Tickets für dieses Kapitel – noch nicht produktiv“.
- In der Kapitelsteuerung steht die Zahl der Pipeline-Tickets je Kapitel.

**Arbeitsordner**
- Die Hauptordner `09_Pipeline`, `10_Backlog` und `11_Intern` werden nach `08_IV_Translation` nummeriert.
- `09_Pipeline` hat dieselben Kapitel- und Unterkapitelordner wie `02_Kapitel` (ohne Arbeitsordner), dazu `00_Ohne_Zuordnung` und `PIPELINE.md`. Der Abgleich ergänzt sie bei jedem Lauf nach `02_Kapitel`.
- `10_Backlog` hat `BACKLOG.md`.
- `11_Intern` hat `01_Testing` … `06_Other`, je mit `THEMA.md`.
- `abgleich --app` holt `GET /work-areas/export` (Format `onescm-work-areas`) und schreibt je Eintrag `<Ticket>.md`:
  - Kopf: Ticket, Status, Erstelldatum, Stream, Produktionsdatum (TT.MM.JJJJ), Gliederung, Dokumentationsstand; darunter die Dokumentation.
  - Eine Datei, die seit der letzten Lieferung niemand geändert hat, wird aktualisiert (Stand in `00_Dokumentation/App/bereiche_stand.json`). Eine geänderte bleibt, die App-Fassung kommt als `.neu` daneben.
  - Wechselt ein Eintrag den Ort, bleibt die alte Datei liegen und wird gemeldet (Grundregel 3).
- **Grundregel 9** in `CLAUDE.md`: Pipeline und Backlog sind nicht produktiv und kein Beleg; Intern ist nie für Anwendende (Ausnahme `05_I_Output/05_Interne_Dokumente`).
- Neuer Agent **pipeline-redakteur**. Alle anderen 14 Agenten erhalten die Regel; input-sortierer, kapitel-redakteur, pruefer, auditor und gliederungs-pfleger zusätzlich ihren Teil davon.

## Folgen
- Kommende Funktionen werden dokumentiert, ohne das Handbuch zu verfälschen. Der Übergang „produktiv“ ist ein bewusster, protokollierter Schritt (Audit `work_item.live`).
- Stream und Produktionsdatum hängen vom Feldnamen im Jira-Export ab. Fehlt das Feld, bleibt der Wert `[offen]` bzw. wird von Hand gepflegt; geschätzt wird nicht.
- Der Kapitelvorschlag ist absichtlich einfach (Titelwörter) und kann danebenliegen. Er ist deshalb nur ein Vorschlag.
- Ein Ticket, das schon produktiv ist, wenn es zum ersten Mal eingelesen wird, bekommt keinen Pipeline-Eintrag. Es gehört direkt in den normalen Ablauf (Release-Abgleich, Kapitel).
