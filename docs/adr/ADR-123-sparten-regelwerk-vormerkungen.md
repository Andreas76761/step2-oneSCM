# ADR-123 Sparten PKW und VAN, Regelwerk, Kapitel „Intern“ und „In Planung“

Status: akzeptiert, umgesetzt (Etappe 100, v0.100.0, 08.11.2026)

## Kontext

Wünsche des Auftraggebers vom 08.11.2026:

1. Sparten nur noch VAN und PKW, beide als Standard; Bus und Truck entfallen.
2. Ein neuer Bereich „Regelwerk“: Regeln je Kapitel und allgemein, die bei der Verarbeitung geprüft werden.
3. Zwei neue Kapitel „Intern“ und „In Planung“: Textabschnitte lassen sich dafür vormerken und fallen aus dem aktuellen Benutzerhandbuch.

Entscheidungen dazu (Rückfrage am 08.11.2026):

- Bisherige Bus-/Truck-Zuordnungen werden zu PKW und VAN, unbestätigt.
- Regeln sind Text-Regeln (Pflichtbegriff, verbotener Begriff, Textmuster); ein Verstoß wird ein Befund mit wählbarem Schweregrad, „Blocker“ sperrt die Freigabe.
- „Intern“ und „In Planung“ sind zwei neue Kapitel neben den vorhandenen Bereichen „Pipeline, Backlog, Intern“ (ADR-098).
- „Gelöscht“ heißt: ab der nächsten Version weg; in Entwürfen sofort, freigegebene Kapitel bleiben unveränderlich bis zur nächsten Freigabe.

## Entscheidung

**Sparten**
- Referenzdaten nur noch `car` (PKW), `van` (VAN), `all`, `unconfirmed` (Altbestand).
- Ohne Spartenangabe ordnet die Klassifikation beide Sparten zu (Methode `default`, unbestätigt). „Truck“, „LKW“, „Bus“ werden nicht mehr erkannt; Front-Matter mit entfallenen Sparten fällt auf den Standard zurück.
- Beim Start werden vorhandene Zuordnungen umgestellt, solange die alten Sparten noch in der Datenbank stehen: Textabschnitte und Absätze erhalten PKW und VAN (unbestätigt), Listen in Gliederungen, FAQ, Wissensnotizen und Bildmerkmalen werden ersetzt, Releaseletter mit entfallener Sparte gelten für „Alle“. Danach werden die Sparten gelöscht.
- Die Demodaten wurden angepasst (Truck → VAN, Bus → Transporter).

**Regelwerk**
- Tabelle `rulebook_rules` (Migration 068): Geltung (allgemein oder Kapitel), Art, Begriff/Muster, Erklärung, Schweregrad, aktiv.
- Begriffe gelten als ganzes Wort (Unicode-Wortgrenzen, auch mit Umlauten), unabhängig von Groß-/Kleinschreibung. Muster werden wie die Vale-Regeln geprüft: riskante Wiederholungen, Rückverweise und Lookbehind werden abgelehnt (Schutz vor blockierenden Ausdrücken).
- Die Qualitätsanalyse prüft je Kapitel die allgemeinen und die Kapitelregeln gegen die Textabschnitte; Verstöße werden Befunde vom Typ `rule` (je Regel ein eigener Befund). Ein Pflichtbegriff gilt nicht für „Ohne Kapitel“.
- Regeln mit Schweregrad „Blocker“ prüft das Qualitätsgate außerdem im Kapiteltext der Version vor dem Einreichen und vor der Freigabe (Prüfpunkt `rulebook`) – so greifen sie auch für Text, der erst in der Werkstatt entstanden ist.

**Kapitel „Intern“ und „In Planung“**
- Zwei reservierte Kapitel je Projekt (`__intern__`, `__planung__`), beim ersten Vormerken angelegt; sie stehen in keiner Kapitelliste des Handbuchs, lassen sich nicht generieren und erscheinen damit nie in Leseransicht, Export, Release oder Übersetzung. Die Analyse prüft ihre Abschnitte nicht.
- Vormerken (Textabschnitt oder Absatz der Werkstatt mit allen Quellen): Der Abschnitt wandert in das reservierte Kapitel, das Herkunftskapitel wird gemerkt. In Entwürfen des Herkunftskapitels entfallen Absätze nur aus diesem Abschnitt sofort (mit Protokoll), bei mehreren Quellen nur die Quellenangabe. Freigegebene Kapitel bleiben unverändert, bis die nächste Version freigegeben ist.
- Die Vormerkung gilt je Datei und normalisiertem Text (`snippet_parking`) und überdauert einen erneuten Import.
- „Zurück ins Handbuch“ stellt Kapitel und Unterkapitel wieder her; ab dem nächsten Entwurf steht der Text wieder im Kapitel.

## Folgen

- Neue Seiten „Regelwerk“ (Prüfen) und „Kapitel Intern & In Planung“ (Pipeline, Backlog, Intern); in der Kapitelwerkstatt „Vormerken für …“ je Absatz und die beiden Kapitel unter „Nicht im Handbuch“.
- Neue Schnittstellen: `/rulebook/rules`, `/parked`, `/snippets/{snippetId}/park`, `/content-blocks/{blockId}/park`.
- Tests T-429 bis T-432.
