# ADR-117 Lesestil „Handbuch-Kapitel“ für Leseransicht, Druck und Online-Hilfe

**Status:** akzeptiert, umgesetzt in Etappe 65. Diese Option hatte der Auftraggeber am 24.10.2026 zur Wahl gestellt. Erweitert ADR-054 (Leseransicht), ADR-060/063 (Druck), ADR-018 (Online-Hilfe) und ADR-112/114 (Designvorlagen).

## Kontext
Exporte gibt es im Stil der Designvorlagen (HTML, PDF, Word, PowerPoint). Leseransicht, Druck und Online-Hilfe nutzten weiter nur die Hausfarbe. Leser sollen das Handbuch überall im gleichen Erscheinungsbild sehen.

## Entscheidung
- **Einstellung im Firmen-Layout** `readingStyle`: `standard` (wie bisher) oder `fachdoku`, also Handbuch-Kapitel mit der Anpassung aus ADR-114. Ändern darf nur die Administration. Der Quick Reference Guide eignet sich wegen Querformat und Karten nicht als Lesestil.
- **Leseransicht und Druck** (gemeinsamer Baustein `ChapterContent`):
  - Abschnittsüberschriften in Schrift und Hauptfarbe der Vorlage, mit Balken links.
  - Hinweisboxen mit farbigem Balken (Hinweis: Akzentfarbe, Tipp: Orange, Warnung: Warnfarbe); Fließtext in der Textschrift.
  - Im dunklen Modus bleiben die Textfarben der App, damit der Kontrast stimmt. Balken und Schriften gelten weiter. Im Druck bleiben die Farben.
  - Die Oberfläche lädt Lesestil und Anpassung einmal je Projekt und lädt sie nach dem Speichern in den Einstellungen neu.
- **Online-Hilfe** (Handbuch-Release): Zusatz-CSS aus `readingCss` mit Kopfzeile, Überschriften, Links und Boxen in den Farben und Schriften der Vorlage. Vor der Beschriftung der Hinweisboxen steht ein Lucide-Icon als Inline-SVG, für Screenreader ausgeblendet. Die Seiten bleiben ohne Skripte und mit strikter CSP.

## Begründung
- Ein Schalter statt freier Gestaltung: Lesestil und Exporte nutzen dieselbe geprüfte Anpassung (Kontrast, Schriften).
- Kein Umbau der Leseransicht: Der Stil wirkt über eine Klasse und CSS-Variablen, Funktionen und Barrierefreiheit bleiben unverändert.

## Folgen
- Neues Feld `readingStyle` in `GET/PUT /layout`; keine Migration.
- Ohne Wahl (`standard`) bleibt alles wie bisher.
