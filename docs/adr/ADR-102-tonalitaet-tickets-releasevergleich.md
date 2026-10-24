# ADR-102 Tonalität je Produktart und Rolle, Ticket-Einstufung, Releaseletter aus dem Projektvergleich, Zukunfts-Inhalte

**Status:** akzeptiert, umgesetzt in Etappe 49 (S-02, W-03, W-04, W-09 aus docs/10; erweitert ADR-040 Schreibstil, ADR-044 Stilregeln, ADR-083 Releaseletter, ADR-096 Historie und „gültig ab“)

## Kontext
Nach der Übersetzung (Etappe 48) schlägt docs/10 vier Punkte ohne offene Entscheidung vor, alle mit Empfehlung **übernehmen**:
- **S-02 Tonalität:** Bisher gab es nur die Anrede (Sie/du) und einen freien Redaktionshinweis. `TONALITAET.md` des Arbeitsordners legt einen Ton je Produktart fest; das Ticket-Cockpit kennt Rollenprofile.
- **W-03 Ticket-Einstufung:** Das Ticket-Cockpit stuft Tickets ein in genehmigt, in Prüfung, intern und Background. Die App kannte nur „Bug = intern“ im Release-Abgleich, und alle Tickets konnten als Quelle in Kapitel einfließen.
- **W-04 Releaseletter aus dem Projektvergleich:** Releaseletter entstanden bisher nur aus Tickets. Die Handbuch-Releases kennen aber ihre Kapitelversionen, das Bildarchiv die Bildfassungen und die Historie die abgelösten Funktionen.
- **W-09 Zukunfts-Inhalte:** „gültig ab“ gibt es seit v0.43; Kapitel mit späterem „gültig ab“ standen trotzdem im Export.

Daten bleiben lokal; alle Prüfungen sind regelbasiert, die KI läuft nur über den eingerichteten Dienst.

## Entscheidung

**Tonalität (S-02)**
- Vier Töne: **sachlich**, **freundlich**, **formell**, **knapp**, jeweils mit einer kurzen Beschreibung.
- Acht Produktarten wie in `TONALITAET.md` bzw. `05_I_Output`, je mit Standardton:
  - Handbuch und Prozesse: sachlich;
  - Releaseletter, Quick Guide und Grafiken: knapp;
  - Schulung und Videos: freundlich;
  - Interne Dokumente: formell.
- Je Projekt in den Stilregeln (`style_rules.tone`): Ton je Produktart und je Rolle (Dealer, Markt, MO, HQ). Ein **Rollenprofil** gilt für Texte bzw. Absätze, die genau dieser einen Rolle zugeordnet sind; sonst gilt der Ton der Produktart.
- Neue Prüfregel **„Tonalität“** (`tone`, nur Deutsch, abschaltbar wie jede Regel). Je Ton meldet sie:
  - sachlich und knapp: Werbesprache wie „einfach“, „schnell“, „optimal“;
  - formell: Verkürzungen wie „gibt’s“ und Smileys (Warnung);
  - knapp: Sätze über 15 Wörter (sofern nicht schon als langer Satz gemeldet) und Floskeln wie „Bitte beachten Sie, dass“;
  - freundlich: strenge Formulierungen wie „Sie müssen“, „verboten“ – als Empfehlung formulieren.
- Die Kapitelprüfung wählt den Ton je Absatz nach seinen Rollen. Die freie Prüfung und die KI-Umformulierung nehmen Produktart und Rolle entgegen.
- Die KI bekommt Ton und Beschreibung mit, im Stil-Umformulieren und im KI-Vorschlag je Absatz (Prompt `rewrite-1.1`).

**Ticket-Einstufung (W-03)**
- Tabelle `ticket_classifications` je Projekt und Ticketschlüssel, gesetzt von einem Menschen mit der Berechtigung „Entscheiden“.
- Ohne Eintrag gilt: Bug = **intern**, sonst **in Prüfung**.
- Wirkung je Einstufung:
  - **genehmigt** und **in Prüfung:** fließen ins Handbuch.
  - **intern:** keine Quelle für Kapitel; im Releaseletter nur als behobener Fehler (Bug), andere als intern eingestufte Tickets entfallen.
  - **Background:** keine Quelle für Kapitel, kein Releaseletter, nur in der Lückenanalyse.
- Die Kapitelgenerierung lässt Abschnitte aus Tickets „intern“ und „Background“ weg und meldet die Anzahl (`excludedByTicket`).

**Releaseletter aus dem Projektvergleich (W-04)**
- Vergleich eines Handbuch-Releases mit seinem Vorgänger oder einem gewählten älteren Release. Er umfasst:
  - **Kapitel:** neu, geändert (beim Vorgänger mit Absatzzahlen), entfernt.
  - **Bilder:** neues Bild, neue Fassung desselben Bildes (gleiche erste Fassung im Bildarchiv), entfernt.
  - **Neue Funktionen:** Kapitel und Unterkapitel des Releases, deren „gültig ab“ der Version entspricht.
  - **Abgelöste Funktionen:** Einträge der Historie mit „gültig bis“ gleich der Version oder abgelöst zwischen den beiden Releases.
  - **Tickets:** solche mit dieser Lösungsversion, ohne stornierte und nach Einstufung (ohne Background).
- Daraus entsteht ein Letter-Entwurf (Herkunft `comparison`, Deutsch oder Englisch, Zielgruppe wie beim Letter aus Tickets).
  - Tickets stehen mit Nummer, Typ und Status darin. Geprüft wird der Entwurf wie jeder Letter gegen seine Tickets.
  - Für Management und Endanwender nennt er bei den Bildern nur die Anzahl.
- Kapitel- und Bildtitel bleiben deutsch; übersetzen lässt sich der Letter wie jeder andere (ADR-101).

**Zukunfts-Inhalte (W-09)**
- Ein Kapitel mit „gültig ab“ nach dem **Stand** ist ein Zukunfts-Inhalt: eingebaut, aber noch nicht veröffentlicht.
- Im Export ist der Stand das neue Feld `asOf`, sonst der Release-Filter; ohne beides wird nichts ausgeblendet. Ausgeblendete Kapitel nennt das Ergebnis (`future`).
- Beim Veröffentlichen eines Handbuch-Releases ist der Stand die Versionsnummer: Solche Kapitel kommen erst in ein späteres Release.
- Reihenfolge von Versionen: Zahlen- und Wortteile werden verglichen. Ein vorangestelltes Wort wie „PI“, „R“ oder „v“ zählt nicht. So gilt „2026.10“ > „2026.9“, „PI 26.3“ < „PI26.10“ und „2026.1-beta“ < „2026.1“.

## Begründung
- Der Ton je Produktart steht schon in `TONALITAET.md`; die App übernimmt ihn als Vorgabe, statt eigene Werte zu erfinden.
- Rollenprofile gelten nur bei genau einer Rolle, damit allgemeine Absätze nicht je nach Zufall den Ton wechseln.
- Die Ticket-Einstufung ist eine fachliche Entscheidung und braucht deshalb die Berechtigung „Entscheiden“. Die abgeleitete Einstufung hält das bisherige Verhalten (Bug = intern) bei.
- Der Projektvergleich nutzt nur gespeicherte Fakten (Releases, Bildfassungen, Historie, Tickets). Der Letter bleibt ein Entwurf, den ein Mensch prüft und freigibt.

## Folgen
- Migration 055: `ticket_classifications`; `release_letters.comparison` (verglichene Releases und Umfang).
- `GET /style/rules` liefert zusätzlich `tone`; `GET /style/tone` zeigt den wirksamen Ton.
- Neue Schnittstellen:
  - `PUT /ticket-classifications`
  - `GET /releases/{id}/comparison`
  - `POST /release-letters/from-comparison`
  - Export mit `asOf`
- Die Tonprüfung ist ab sofort aktiv (Handbuch: sachlich); sie meldet nur Hinweise bzw. bei formellem Ton Warnungen und lässt sich mit der Regel „Tonalität“ abschalten.
- Ein Bug-Ticket ist ohne Einstufung intern und damit keine Quelle mehr für Kapitel. Soll es doch ins Handbuch, stufen Sie es als „genehmigt“ ein.
- Unterkapitel mit späterem „gültig ab“ blendet der Export noch nicht aus; Absätze ordnet die App keinem Unterkapitel zu.
- Offen bleiben G-04 (LanguageTool lokal) und weitere Märkte bzw. Sprachen (U-07).
