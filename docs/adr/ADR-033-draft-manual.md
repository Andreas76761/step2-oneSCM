# ADR-033 Draft Manual und Kennzeichnung

**Status:** akzeptiert, umgesetzt in Etappe 11

## Kontext
Die Redaktion will alle Markdown-Textschnipsel einem ausgewählten Inhaltsverzeichnis je Kapitel und Unterkapitel zuordnen und dabei Dopplungen, Lücken, Widersprüche und Warnungen sofort sehen – bevor Kapitel generiert und freigegeben werden.

## Entscheidung
- **Zuordnung** (`outline_assignments`): je Gliederung höchstens ein Eintrag je Schnipsel, Reihenfolge je Eintrag. Zuordnen gesammelt aus der Liste nicht zugeordneter Schnipsel (Suche, Seiten), verschieben, umsortieren, lösen. **Automatisch zuordnen** ordnet nicht zugeordnete aktuelle Schnipsel über den Titel ihres Quell-Unterkapitels bzw. -Kapitels zu (Nummern und Schreibweise ignoriert; mehrdeutige Unterkapitel werden ausgelassen).
- **Kennzeichnung** je Schnipsel bzw. Eintrag – Farbe **und** Symbol **und** Text (WCAG 1.4.1):
  - 🔴 **Widerspruch:** offener Widerspruchsbefund der Qualitätsanalyse zum Schnipsel.
  - 🟠 **Dopplung:** offener Dopplungsbefund oder gleicher normalisierter Text mehrfach in derselben Gliederung (mit Angabe der anderen Stelle).
  - 🟣 **Lücke:** Eintrag ohne Inhalte (Kapitel: auch keine Inhalte in den Unterkapiteln).
  - 🟡 **Warnung:** übrige offene Befunde (Datenschutz, Terminologie, Lesbarkeit), nicht bestätigte Quelle, veraltete Revision, Schnipsel passt nicht zur Variante (Rolle, Sparte, marktspezifisch in Blueprint, Markt außerhalb der Auswahl).
- **Übersicht** mit Anzahl je Kennzeichnung, Filter „nur Auffälligkeiten“, **Export** als Markdown (Arbeitsstand, Kennzeichnungen als Zitatzeilen, optional ohne).
- Das Draft Manual ist ein **Arbeitsstand**, kein freigegebener Inhalt; es ändert weder Schnipsel noch Kapitelversionen.

## Konsequenzen
- Kennzeichnungen aus Befunden sind so aktuell wie die letzte Qualitätsanalyse; Dopplungen innerhalb der Gliederung werden immer sofort erkannt.
- Neue Quellrevisionen erzeugen neue Schnipsel; zugeordnete alte erscheinen als „veraltet“, bis sie ersetzt werden.
