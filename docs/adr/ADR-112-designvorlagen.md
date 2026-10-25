# ADR-112 Designvorlagen: Quick Reference Guide und Handbuch-Kapitel

**Status:** akzeptiert, umgesetzt in Etappe 60. Anlass ist der Wunsch des Auftraggebers vom 24.10.2026: Er hat zwei Muster-PDFs (einen Quick Reference Guide und ein Kapitel einer Fachdokumentation) mit der Bitte geschickt, sie „detailgetreu als Designvorlagen anzulegen“ und dabei professionelle Icons zu nutzen. Diese Entscheidung erweitert ADR-038 (Firmen-Layout) und ADR-111 (Icons mit Lucide).

## Kontext
Der HTML-Export hatte bisher genau ein Layout, das Firmen-Layout mit Hausfarbe, Logo, Kopf- und Fußzeile. Die Redaktion braucht außerdem zwei weitere Formen:
- **Quick Reference Guide:** eine kompakte Anleitung zum Ausdrucken oder Verteilen.
- **Handbuch-Kapitel:** ein ausführliches Kapitel im Stil einer Fachdokumentation.

Die gelieferten Muster tragen das Branding eines Herstellers. Dieses Branding darf nicht übernommen werden, also kein Logo, kein Markenzeichen und keine Hausschrift.

## Entscheidung
- **Zwei Designvorlagen** für das Format `html`. Der Parameter `design` von `POST /exports` nimmt `standard` (Vorgabe), `quickref` oder `fachdoku` an. Eine Designvorlage bei einem anderen Format wird mit 400 abgewiesen.
- **Quick Reference Guide** (`quickref`, A4 quer):
  - Kopf: Titel in Serifenschrift; rechts davon die Marke, also Logo oder ein neutrales Buchzeichen, Firmenname und ein Zusatz in Kursiv.
  - Darunter der Hinweis „Dieses Dokument ist interaktiv“, wenn das Dokument Links enthält.
  - Inhalt in zwei Spalten:
    - „Die Prozesse im Überblick“ mit römisch nummerierten Kapiteln und gekürzten Schritten;
    - je Abschnitt eine Karte mit abgerundetem hellblauem Rahmen, nummerierten Schritten und Bildschirmfotos rechts daneben;
    - rote Warnboxen, Hinweise als „**Hinweis**: …“;
    - Karten „Wichtige Links und Ansprechpartner“ und „Häufig gestellte Fragen und Antworten“.
  - Fußzeile je Seite: links „Hinweis: …“, rechts „STAND: TT.MM.JJJJ | n/N“.
  - Vorgabeprofil: Quick Guide (Voraussetzungen, Schritte, Ergebnis, Warnungen).
- **Handbuch-Kapitel** (`fachdoku`, A4 hoch):
  - Kopfzeile je Seite: Dokumentart und Kapitel in Großbuchstaben, „Seite n von N“, mit Linie darunter.
  - Titel in Dunkelblau mit Untertitel.
  - Vier Kennzahlen-Karten mit Icon: Abschnitte, Handlungsschritte, Version und Freigabe, Hinweise.
  - Nummerierte Abschnitte mit Balken links; Tabellen mit grauem Kopf.
  - Boxen: Hinweis (blau), Wichtig/Tipp (orange), Warnung (rot), Querverweis. Beginnt der Text mit einem fett gesetzten Signalwort (z. B. „**Wichtig:**“), ist es die Beschriftung der Box und steht nicht doppelt im Text (Etappe 71, `boxLabel`).
  - Code- und Ablaufdarstellungen.
  - Fußzeile mit Fußzeilentext und Titel.
- **Firmen-Layout** um drei Felder erweitert, die nur die Administration ändern kann:
  - `productLine`: Zusatz unter der Marke, z. B. „für Transporter“;
  - `docLabel`: Dokumentart in der Kopfzeile, z. B. „oneSCM Fachdokumentation“;
  - `quickRefLinks`: Markdown für die Links-Karte.
  
  Firmenname, Logo und Fußzeile kommen aus den vorhandenen Feldern.
- **Icons:**
  - Lucide (ISC) wie in der Oberfläche. Das Skript `apps/server/scripts/gen-design-icons.mjs` erzeugt sie als Inline-SVG in `src/domain/designIcons.ts` aus `lucide-react`.
  - Der Server hat dadurch keine neue Laufzeit-Abhängigkeit.
  - Die Icons sind für Screenreader ausgeblendet.
- **Eigenständiges HTML:**
  - keine Skripte, keine externen Schriften oder Stylesheets;
  - CSP `default-src 'none'; style-src 'unsafe-inline'; img-src data:`;
  - Bilder sind als `data:`-URI eingebettet.
  
  Seitenränder (Kopf- und Fußzeilen mit Seitenzahl) laufen über `@page`-Randfelder. Chromium und damit auch „Als PDF speichern“ unterstützen sie.
- **Muster:**
  - `GET /design-templates` listet die Vorlagen.
  - `GET /design-templates/:id/sample` zeigt jede Vorlage mit fiktiven Inhalten (Servicevertrag anlegen/verwalten bzw. „Kapitel 4: Vertragsberechnung“) und mit Marke, Logo und Texten des Projekts.
  - Bildschirmfotos sind neutrale Platzhalter. Links zeigen auf `example.org`.
- **Oberfläche:**
  - Auf der Seite Export gibt es die Karte „Designvorlagen“ mit „Muster ansehen“ und „Für den Export wählen“, dazu die Auswahl „Design“ beim Format HTML.
  - Die neuen Felder liegen in den Einstellungen unter Layout.

## Begründung
- Die Designvorlagen sind reine Darstellung über denselben gefilterten und zugeschnittenen Inhalt wie der Standard-Export. Filter, Profile, Freigabe und Blocker gelten unverändert.
- HTML mit Druck-CSS ist der kürzeste Weg zu einer druckfähigen Ausgabe, die dem Muster sehr nahe kommt.
- Die gemeinsame Icon-Bibliothek sorgt dafür, dass Oberfläche und Dokumente einheitlich aussehen.

## Folgen
- Kontraste der Vorlagen erfüllen WCAG AA. axe prüft die Muster in T-361.
- Neue Icons für die Vorlagen kommen über das Generator-Skript hinzu, nicht von Hand.
- PDF direkt im Design: umgesetzt in Etappe 61 ([ADR-113](ADR-113-pdf-im-design.md)). Ohne eingerichteten Browser gilt weiter: HTML öffnen und im Browser als PDF speichern.
