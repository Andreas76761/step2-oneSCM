# ADR-104 Änderungsvorschläge: Word-Prüffassung zurücklesen, KI-Lektorat mit Wortvergleich, interne Kommentare

**Status:** akzeptiert, umgesetzt in Etappe 51. Umfasst W-06, G-07 und W-08 aus docs/10. Erweitert ADR-013 (KI-Vorschläge), ADR-038 (Word-Export), ADR-040 (Schreibstil) und ADR-085 (Lesefassung).

## Kontext
Kapitel werden heute an zwei Stellen außerhalb der Werkstatt überarbeitet:
- **in Word:** Fachbereiche lesen eine exportierte Fassung und schreiben ihre Korrekturen hinein. Bisher ließ sich die Datei nur als neue Quelle importieren, nicht als Änderung am Kapitel (W-06, Screenarchiv).
- **durch das KI-Lektorat:** Es gab KI-Vorschläge je Absatz und die Stil-Korrektur je Kapitel, aber keine gemeinsame Ansicht mit Wortvergleich und Übernahme je Kapitel (G-07, Ticket-Cockpit).

Dazu fehlten interne Kommentare, die sicher nie im Export stehen, und eine Ansicht Stand | Verbesserung | Neu (W-08).

Alle drei sind in docs/10 als „optional“ empfohlen. Der Auftraggeber hat „weiter mit der nächsten Etappe“ gewünscht; Punkte mit offener Entscheidung bleiben offen (G-04, weitere Märkte, Schreibweise offener Begriffe, O-09).

## Entscheidung

**Gemeinsame Liste von Änderungsvorschlägen**
- Word-Rücklauf und KI-Lektorat erzeugen eine Vorschlagsliste (`revision_batches`) mit Vorschlägen je Absatz (`revision_proposals`): geändert, neu oder entfällt.
- Ein Vorschlag merkt sich den Absatz über seine Lineage, den Text beim Einlesen und den Vorschlag. Nichts wird sofort geändert.
- **Übernehmen** schreibt in einen Entwurf des Kapitels:
  - Gibt es einen offenen Entwurf, wird er geändert.
  - Ist die neueste Version freigegeben, entsteht der Entwurf als Kopie; die freigegebene Version bleibt unverändert und gilt bis zur nächsten Freigabe.
  - Ist sie zur Freigabe eingereicht, ist Übernehmen gesperrt, bis die Einreichung zurückgezogen ist.
- Steht im Absatz inzwischen ein anderer Text als beim Einlesen, wird der Vorschlag beim Übernehmen **veraltet** statt den neuen Stand zu überschreiben.
- Je Vorschlag lässt sich eine eigene Fassung übernehmen; „Alle übernehmen“ wirkt je Kapitel oder für die ganze Liste.
- Ein neuer Absatz bekommt die Begründung „Ergänzung aus Änderungsvorschlag“, damit die Evidenzprüfung ihn als bewusst manuell erkennt.

**Word-Prüffassung (W-06)**
- Export Word mit „Prüffassung“: Lesefassung (ADR-085) mit der Zeile „Fertig, wenn: …“ unter jeder Kapitelüberschrift.
  - Das Kriterium ist frei wählbar. Standard: „alle Schritte, Begriffe und Bildschirmtexte mit der aktuellen Oberfläche übereinstimmen.“
  - Die Exportkennung steht als benutzerdefinierte Dokumenteigenschaft `onescm-export` in der Datei; der Export merkt sich die Kapitelversionen.
- Zurücklesen: Die Datei wird wie beim Word-Import in Markdown gewandelt.
  - Kapitel über die Exportkennung, sonst über den Titel (freigegebene Version, sonst die neueste).
  - Abschnitte über ihre Überschrift; Absätze über eine Ausrichtung nach Wortähnlichkeit (Dice ≥ 0,35, Reihenfolge bleibt).
  - Ein Absatz mit Leerzeilen (z. B. Einleitung und Liste) steht in Word als mehrere Absätze. Er wird in Teile zerlegt, ausgerichtet und wieder zusammengesetzt.
  - Hinweis-, Tipp- und Warnkästen sind in Word Tabellen mit einer Zelle; sie werden wieder zum Absatztext.
  - Das „Fertig, wenn“ der Datei wird an jedem Vorschlag festgehalten und erscheint in der Begründung der Änderung.
- Kapitel und Abschnitte ohne Zuordnung werden gemeldet, nicht verworfen.

**KI-Lektorat (G-07)**
- Je Absatz die Umformulierung „professionell“ der Schreibstil-Funktion (ADR-040) mit Stilregeln, Tonalität und Terminologie – über den lokalen KI-Dienst, sonst Regelkorrekturen.
- Ausgelassen werden gesperrte Absätze, Absätze mit Bild, Lücken, Querverweise, Tabellen sowie Absätze, in denen eine Zahl verloren ginge.
- Anzeige mit Wortvergleich: entfernte Wörter durchgestrichen, neue unterstrichen; das Original steht beim Überfahren.

**Interne Kommentare und Drei-Spalten-Ansicht (W-08)**
- Interner Kommentar je Vorschlag und je Absatz (Feld `comment`). Er steht in keinem Export: Markdown, HTML, PDF und Word geben ihn nicht aus, der JSON-Export entfernt ihn.
- Seite „Überarbeitung“: je Vorschlag drei Spalten – **Stand** (aktueller Text), **Vorschlag** (Wortvergleich), **Neu** (bearbeitbare Fassung) – mit internem Kommentar, Übernehmen und Verwerfen.
- Bearbeiten erfordert die Berechtigung „Bearbeiten“; Lesen genügt für Listen und Vorschläge.

## Begründung
- Eine Liste für beide Wege hält die Prüfung an einer Stelle; was übernommen wird, entscheidet immer ein Mensch.
- Die freigegebene Version bleibt unangetastet, damit das veröffentlichte Handbuch bis zur nächsten Freigabe gilt.
- Die Zuordnung braucht keine Word-Kommentare oder Änderungsverfolgung; auch eine ohne Prüffassung bearbeitete Datei lässt sich über die Titel zuordnen.
- Die Daten bleiben lokal: Zurücklesen und Wortvergleich laufen ohne KI, das Lektorat nutzt den eingestellten (lokalen) KI-Dienst wie die übrigen Schreibstil-Funktionen.

## Folgen
- Migration 057: `revision_batches`, `revision_proposals`.
- Neue Schnittstellen:
  - `POST /revisions/word`, `POST /chapter-versions/{id}/lektorat`;
  - `GET /revision-batches`, `GET /revision-batches/{id}`, `POST /revision-batches/{id}/accept-all`;
  - `POST /revision-proposals/{id}/decision`, `PATCH /revision-proposals/{id}`;
  - `POST /exports` mit `reviewCopy` (nur Word).
- Grenzen der Zuordnung:
  - Ein in Word umbenannter Abschnitt wird nicht zugeordnet und gemeldet.
  - Ein stark umgeschriebener Absatz (Ähnlichkeit unter 0,35) erscheint als „entfällt“ und „neu“.
  - Formatierung in Kästen und Tabellen kann sich beim Zurücklesen ändern (z. B. fette Tabellenköpfe).
- Das Lektorat ruft den KI-Dienst je Absatz einzeln auf; bei langen Kapiteln dauert es entsprechend.
