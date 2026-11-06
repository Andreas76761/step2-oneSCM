# ADR-114 Designvorlagen anpassen

**Status:** akzeptiert, umgesetzt in Etappe 62 (Wahl des Auftraggebers vom 24.10.2026: „Designvorlagen anpassbar“). Erweitert ADR-112 (Designvorlagen) und ADR-038 (Firmen-Layout).

## Kontext
Die Designvorlagen Quick Reference Guide und Handbuch-Kapitel geben Farben und Schriften des gelieferten Musters fest vor. Projekte mit eigenem Erscheinungsbild brauchen dieselbe Gestaltung in ihren Farben und mit ihrer Logo-Platzierung. Die Lesbarkeit und die Barrierefreiheit der Muster müssen dabei erhalten bleiben.

## Entscheidung
- **Anpassung je Vorlage und Projekt:**
  - **Hauptfarbe:** Links, Überschriften, Kopfzeile.
  - **Akzentfarbe:** Rahmen der Karten, Icons, Hinweisboxen.
  - **Warnfarbe:** Warnboxen und Warntext.
  - **Schriften** für Überschriften und Text: mit Serifen (Georgia) oder serifenlos (Segoe UI bzw. Systemschrift). Es sind nur Systemschriften, nichts wird nachgeladen.
  - **Logo:** rechts, links oder ohne.
- **Prüfung vor dem Speichern und vor jeder Vorschau** (`normalizeTheme`):
  - Farben nur als `#rrggbb`. Erst danach werden sie ins CSS eingesetzt, damit nichts anderes ins Stylesheet gelangt.
  - Kontrast zu Weiß: Textfarben (Haupt- und Warnfarbe) mindestens 4,5 : 1 (WCAG 1.4.3), Akzentfarbe für Rahmen und Icons mindestens 3 : 1 (WCAG 1.4.11).
  - Schriften und Logo-Position nur aus der Auswahl.
  - Fehler kommen gesammelt als verständliche Sätze zurück (400, `issues`).
- **Abgeleitete Töne:** Rahmen und Hintergrund der Warnbox sowie dunkler Warntext entstehen per `color-mix` aus der Warnfarbe.
- **Speicherung** im Firmen-Layout des Projekts (`designThemes`). Gepflegt wird sie nur über die eigenen Endpunkte, das Speichern des Firmen-Layouts lässt sie unverändert. Änderungen und Zurücksetzen stehen im Audit-Protokoll.
- **API:**
  - `GET /design-templates` liefert je Vorlage `theme` (wirksam), `defaultTheme`, `customized` und `minContrast`.
  - `POST /design-templates/:id/preview` liefert das Muster mit ungespeicherter Anpassung (Leserecht).
  - `PUT` bzw. `DELETE /design-templates/:id/theme` speichert bzw. setzt zurück (Administration).
- **Wirkung:** Export im Design (HTML und PDF), Muster und Muster als PDF nutzen die gespeicherte Anpassung. Ohne Anpassung entsteht genau das bisherige Muster.
- **Oberfläche:** Karte „Designvorlagen anpassen“ in den Einstellungen:
  - Vorlage wählen; je Farbe Farbwähler und Farbwert mit Kontrastanzeige.
  - Auswahl der Schriften und der Logo-Position.
  - Vorschau als abgeschottetes iframe (`sandbox`, ohne Skripte), die beim Ändern nachzieht.
  - „Anpassung speichern“ ist gesperrt, solange eine Farbe zu wenig Kontrast hat; dazu „Standardwerte einsetzen“ und „Auf Standard zurücksetzen“.

## Begründung
- Wenige, klar benannte Stellschrauben decken das eigene Erscheinungsbild ab, ohne die Gestaltung der Vorlage zu zerlegen.
- Die Kontrastregeln entsprechen denen der Hausfarbe (ADR-038) und halten die Muster barrierefrei.

## Folgen
- Neue Felder in `GET /layout` (`designThemes`); keine Migration (JSON im Projekt).
- Die Kontrastfunktion liegt gemeinsam für Firmen-Layout und Designvorlagen in `domain/designs.ts`.
