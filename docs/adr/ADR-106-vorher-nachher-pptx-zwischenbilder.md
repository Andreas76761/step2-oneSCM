# ADR-106 Vorher/Nachher-Belege, Ausgabe als PowerPoint und BPMN, Zwischenbilder aus Videos

**Status:** akzeptiert, umgesetzt in Etappe 53. Umfasst W-05, W-07 und W-10 aus docs/10. Erweitert ADR-038 (Word-Export), ADR-085 (Bildarchiv mit Fassungen), ADR-090 (Standbilder aus Videos) und ADR-093 (Klickstrecke).

## Kontext
Die drei letzten optionalen Punkte aus docs/10 betreffen Bilder und Ausgabe:
- **Vorher/Nachher-Belege (W-05, Screenarchiv):** Das Bildarchiv kennt Fassungen eines Bildes, zeigt aber nicht, was sich warum geändert hat.
- **Ausgabe als PowerPoint und Klickstrecke als BPMN (W-07, Screenarchiv, Screenshot-Studio, Wissenssuche):** Schulungen und Prozessbeschreibungen werden aus dem Handbuch abgeschrieben.
- **Zwischenbilder (W-10, Screenshot-Studio):** Standbilder entstehen alle 2 s. Ein kurz geöffnetes Menü oder ein Dialog fehlt daher oft.

Der Auftraggeber hat „weiter mit der nächsten Etappe“ gewünscht; Punkte mit offener Entscheidung bleiben offen (G-04, weitere Märkte, Schreibweise offener Begriffe, O-09).

## Entscheidung

**Vorher/Nachher (W-05)**
- Ein Beleg verbindet ein Vorher- und ein Nachher-Bild (meist zwei Fassungen desselben Bildes) mit Anlass, Änderung, Wirkung und optional einem Ticket.
- Die Seite „Vorher/Nachher“ zeigt die beiden Bilder übereinander. Das Nachher-Bild ist links bis zum Schieberegler sichtbar; der Regler ist per Tastatur bedienbar.
- „Als Bild ins Archiv“ legt eine Gegenüberstellung als PNG ab: links Vorher, rechts Nachher, darunter Anlass, Änderung und Wirkung. Sie lässt sich wie jedes Bild in Kapitel einfügen. Wird sie erneut erzeugt, entsteht eine neue Fassung desselben Archivbilds; Verweise in Kapiteln zeigen dann die neue Fassung.
- Bearbeiten erfordert die Berechtigung „Bearbeiten“, Lesen genügt für die Belege.

**PowerPoint (W-07)**
- Neues Exportformat `pptx` (16:9) mit eigenem schlanken OOXML-Generator (JSZip, keine neue Abhängigkeit):
  - Titelfolie mit Stand und Filter;
  - je Kapitel eine Übersichtsfolie mit Versionszeile, Zweck und den Abschnitten;
  - je Abschnitt Inhaltsfolien. Aufzählungen und Nummerierung bleiben erhalten, ebenso **Fettdruck**; Hinweisarten tragen ihr Kennwort.
  - Höchstens 8 Absätze bzw. etwa 110 Wörter je Folie, danach eine Folgefolie.
  - Je Bild eine eigene Folie, eingepasst unter dem Titel, mit dem Alternativtext.
- Hausfarbe aus dem Firmen-Layout für Titel. Filter, Profile und Lesefassung gelten wie bei den übrigen Formaten.
- Geprüft mit dem eigenen PPTX-Import (Rücklesen), python-pptx und LibreOffice.

**BPMN (W-07)**
- Jede Klickstrecke lässt sich als BPMN 2.0 herunterladen:
  - Startereignis, je Station eine Benutzeraufgabe „Nummer Beschriftung“, Endereignis.
  - Parallele Wege einer Station (3a, 3b) liegen zwischen einem exklusiven Gateway „Weg 3a oder 3b“ und seiner Zusammenführung.
- Mit Diagramm (BPMN DI), damit Modellierungswerkzeuge wie Camunda Modeler oder bpmn.io die Strecke ohne Nacharbeit anzeigen.

**Zwischenbilder (W-10)**
- Ein zweiter Durchgang über das Video entnimmt 2 Bilder je Sekunde.
- Ein Zwischenbild ist ein Zustand, der sich vom Bild davor sichtbar unterscheidet (ab 2 % der Fläche) und nach höchstens 2 s wieder dem Zustand davor gleicht.
- Behalten wird das Bild mit der größten Änderung; der geänderte Bereich wird rot umrahmt. Ein Zwischenbild, das zeitlich mit einem Standbild zusammenfällt, entfällt.
- Zwischenbilder stehen wie Standbilder an ihrer Zeitmarke im Text: „Zwischenbild bei 00:12 – kurz sichtbar (Menü oder Dialog)“.
- Abschaltbar mit `MEDIA_TRANSIENT_STILLS=false`.

## Begründung
- Vorher/Nachher nutzt die vorhandenen Fassungen; der Beleg erklärt die Änderung dort, wo das Bild gepflegt wird.
- Ein eigener PPTX-Generator hält die Abhängigkeiten klein. Das Format ist schlicht und lässt sich in PowerPoint mit einer Firmenvorlage weiter gestalten.
- BPMN ist das gängige Austauschformat für Prozessmodelle; die Klickstrecke liefert Reihenfolge und Alternativen bereits.
- Die Erkennung kurzer Zustände braucht keine KI und bleibt lokal (ffmpeg).

## Folgen
- Migration 059: `media_comparisons`.
- Neue Schnittstellen:
  - `GET`/`POST /image-comparisons`, `GET`/`PATCH`/`DELETE /image-comparisons/{id}`, `POST /image-comparisons/{id}/render`;
  - `GET /image-clickpaths/{id}/bpmn`;
  - Format `pptx` in `POST /exports`.
- Seite „Vorher/Nachher“ (Schreiben); Export-Format „PowerPoint“; in der Klickstrecke „Als BPMN 2.0“.
- Videos werden für Zwischenbilder ein zweites Mal gelesen; der Import langer Videos dauert entsprechend länger (höchstens 2 400 Bilder, also 20 Minuten Video).
- Tabellen erscheinen in PowerPoint als Textzeilen mit „·“ zwischen den Zellen, nicht als PowerPoint-Tabelle.
