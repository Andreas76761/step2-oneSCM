# ADR-103 Kapitelbewertung mit Ampel, Plausibilität je Aussage, Fehlerliste in der App

**Status:** akzeptiert, umgesetzt in Etappe 50. Umfasst S-07, W-02 und G-05 aus docs/10. Erweitert ADR-040 (Schreibstil), ADR-057 (Anleitungs-Check), ADR-097 (Grammatik) und ADR-102 (Tonalität).

## Kontext
Die App misst die Qualität eines Kapitels an mehreren Stellen, aber getrennt:
- Schreibstil und Lesbarkeit,
- Anleitungs-Check,
- Tonalität,
- Evidenz je Absatz,
- Widersprüche aus der Qualitätsanalyse.

Für drei Wünsche aus den Artefakten fehlte bisher etwas:
- **Kapitelbewertung mit Ampel** (Wissenssuche): Es gab keine Gesamtsicht.
- **Plausibilität je Aussage** (Ticket-Cockpit): Die Evidenz zeigte nur je Absatz, ob eine Quelle zugeordnet ist, nicht je Satz, ob sie ihn trägt.
- **Fehlerliste** (Agent `sprach-lektor`): Sie gab es nur als Datei `FEHLERLISTE.csv` im Arbeitsordner.

Alle drei sind in docs/10 als „optional“ empfohlen. Der Auftraggeber hat „weiter mit der nächsten Etappe“ gewünscht; Punkte mit offener Entscheidung bleiben offen (G-04, weitere Märkte, Schreibweise offener Begriffe, O-09).

## Entscheidung

**Plausibilität je Aussage (W-02)**
- Jeder Satz eines Absatzes wird gegen die Quellen desselben Absatzes geprüft. Das Verfahren ist dasselbe wie für KI-Vorschläge: Inhaltswörter (Stämme) und Zahlen (`checkSentences`), Mindestdeckung wie in den Einstellungen.
- Jeder Satz bekommt eine von vier Einstufungen:
  - **Widerspruch:** Eine Quelle, die den Satz trägt, steht in einem offenen bzw. zurückgestellten Widerspruch der Qualitätsanalyse oder ist per Entscheidung ausgeschlossen.
  - **belegt:** Der Satz ist durch bestätigte Quellen gedeckt.
  - **unbelegt:** Der Absatz hat keine Quelle, nur unbestätigte Quellen, eine Zahl fehlt in der Quelle, oder der Satz geht über die Quelle hinaus.
  - **fehlend:** Lücke im Kapitel (Thema ohne bestätigte Quelle).
- Keine Aussagen sind:
  - Querverweise,
  - Bilder,
  - Überschriften,
  - der Abschnitt „Quellen- und Freigabestatus“,
  - die vom Generator erzeugte Rollenliste.
- Wert 0–100 = Anteil belegter Aussagen; ein Widerspruch zählt doppelt.

**Kapitelbewertung (S-07)**
- Fünf Kriterien, je 0–100:
  - **Sprache:** 70 % Stilwert der Sätze, 30 % erfüllte Lesbarkeitsziele der Zielgruppe.
  - **Ziel:** Punktwert des Anleitungs-Checks.
  - **Tonalität:** Anteil der Sätze ohne Befund der Regel „Tonalität“; Ton je Absatz wie in ADR-102.
  - **Quellenabgleich:** Plausibilität je Aussage.
  - **Fakten:** Anteil der Zahlen und Kennungen (z. B. E-4711) im Text, die auch in den Quellen des Absatzes stehen; Schrittnummern zählen nicht.
- Die Ampel je Kriterium ist grün ab 80, gelb ab 60, sonst rot.
- Der Gesamtwert ist der Mittelwert. Die Gesamtampel ist höchstens so gut wie das schwächste Kriterium.
- Bewertet wird die neueste Version je Kapitel; Seite „Kapitelbewertung“ mit Übersicht und Detail.
- Die Bewertung wird nicht gespeichert, sondern jedes Mal aus dem aktuellen Stand berechnet.

**Fehlerliste (G-05)**
- Tabelle `language_errors` mit den Spalten von `FEHLERLISTE.csv`:
  - Nr `F-0001`, je Projekt fortlaufend und nie neu vergeben;
  - Datum, Fundstelle, Fehler, Korrektur;
  - Kategorie laut `FEHLERLISTE.md`;
  - Regel;
  - Status offen / korrigiert / abgelehnt (mit Begründung) / Regel fehlt.
- „Funde in die Fehlerliste“ übernimmt die Warnungen der Stilprüfung einer Kapitelversion; die Stilregel bestimmt die Kategorie.
  - Dieselbe Fundstelle (Kapitel, Regel, Text) kommt nur einmal in die Liste.
  - Offene Funde, deren Text im Kapitel nicht mehr steht, gelten danach als korrigiert.
- Einträge lassen sich von Hand erfassen, etwa für Funde in Produkten oder Übersetzungen.
- Export wie `FEHLERLISTE.csv` (UTF-8 mit BOM, Semikolon); eine Ablehnung steht als „abgelehnt (Begründung)“ im Status.
- Rückimport mit Vorschau:
  - Bekannte Nr. übernehmen Status, Korrektur, Kategorie und Begründung; neue Nr. werden angelegt.
  - Ungültige Zeilen verhindern das Übernehmen.
- Arbeitsordner: `abgleich --app` schreibt die Liste nach `07_III_…/03_Fehlerliste/FEHLERLISTE.csv`. Eine von Hand geänderte Datei bleibt, die App-Fassung kommt als `.neu` daneben.
- Bearbeiten erfordert die Berechtigung „Bearbeiten“, Lesen genügt für Liste und Export.

## Begründung
- Die Kriterien nutzen nur vorhandene, regelbasierte Messungen. Es kommt keine KI dazu, die Daten bleiben lokal, und das Ergebnis ist nachvollziehbar.
- Die Plausibilität je Satz verwendet dasselbe Verfahren wie die Satz-Evidenz der KI-Vorschläge. Ein Satz gilt also nach denselben Maßstäben als belegt, egal ob ein Mensch oder die KI ihn geschrieben hat.
- Die strengere Gesamtampel verhindert, dass ein gutes Mittel einen roten Quellenabgleich verdeckt.
- Die Fehlerliste spiegelt die Datei des Arbeitsordners, damit der Agent `sprach-lektor` und die Redaktion an einer Liste arbeiten.

## Folgen
- Migration 056: `language_errors`.
- Neue Schnittstellen:
  - `GET /assessments`, `GET /chapter-versions/{id}/assessment`, `GET /chapter-versions/{id}/plausibility`;
  - `GET`/`POST /language-errors`, `PATCH /language-errors/{id}`;
  - `POST /language-errors/collect`, `GET /language-errors/export`, `POST /language-errors/import`.
- Die Übersicht berechnet die Bewertung für jedes Kapitel neu. Bei sehr vielen Kapiteln ist das ein Kandidat für einen Zwischenspeicher.
- Ein Satz, der eine Quelle sinngemäß, aber mit anderen Wörtern wiedergibt, kann als unbelegt gelten (Wortstämme, kein semantischer Vergleich). Er bleibt ein Hinweis zum Prüfen, keine Sperre.
- Nicht umgesetzt: die schnellere Übersicht oneSCM_Metadaten aus dem Lasttest der Etappe 49 (Zähler je Projekt). Sie bleibt offen.
