# ADR-038 Firmen-Layout und Word-Export

**Status:** akzeptiert, umgesetzt in Etappe 13

## Kontext
Handbücher werden an Händler und Märkte weitergegeben und sollen im Erscheinungsbild des Unternehmens erscheinen; viele Empfänger arbeiten mit Word weiter.

## Entscheidung
- **Layout je Projekt** (`projects.layout`, Migration `023`, `GET/PUT /layout`, Administration): Firmenname, Hausfarbe, Logo (PNG/JPEG aus der Medienablage), Titelseite ein/aus mit Untertitel und Vertraulichkeitshinweis, Kopf- und Fußzeile. Die Hausfarbe braucht mindestens 4,5 : 1 Kontrast zu Weiß (WCAG 1.4.3), weil sie als Schriftfarbe und als Hintergrund weißer Schrift dient.
- **Angewendet** in PDF (Titelseite, Kopfzeile ab Seite 2, Fußzeile mit Seitenzahl, Kapitelüberschriften in Hausfarbe), HTML-Export (Titelseite, Farben, Kopf-/Fußzeile) und Online-Hilfe (Logo, Firmenname, Kopfzeile in Hausfarbe).
- **Word-Export** (`format: docx`, Bibliothek `docx`, MIT): Formatvorlagen Titel und Überschrift 1–3, Inhaltsverzeichnis als Word-Feld (wird beim Öffnen aktualisiert), Aufzählungen und nummerierte Listen, Tabellen, Bilder (PNG/JPEG/GIF; sonst Alternativtext), Hinweise/Warnungen als farbig hinterlegte Kästen, Rollen-/Sparten-/Marktkennzeichnung, Kopf- und Fußzeile mit „Seite x von y“, Verzeichnisse bei Varianten.
- **Firmenvorlage** (`POST /layout/docx-template`, .dotx/.docx): übernommen werden nur die Formatvorlagen (`word/styles.xml`). Die IDs für Titel und Überschriften werden über die englischen Built-in-Namen ermittelt – auch lokalisierte Vorlagen („berschrift1“) funktionieren. Die Vorlage liegt im Object-Store und ist Teil des Backups.

## Konsequenzen
- Kopf-/Fußzeilen, Seitenränder und Titelblatt einer Word-Vorlage werden nicht übernommen, nur die Formatvorlagen.
- SVG- und WebP-Bilder erscheinen in Word als Alternativtext.
