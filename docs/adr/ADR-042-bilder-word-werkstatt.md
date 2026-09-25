# ADR-042 Bilder in Word und Werkstatt, Screenshots markieren, Diagramme nachbearbeiten

**Status:** akzeptiert, umgesetzt in Etappe 15 (erweitert ADR-029, ADR-038, ADR-041)

## Kontext
Die in Etappe 14 erzeugten Diagramme sind SVG-Grafiken und erschienen im Word-Export nur als Alternativtext. Bilder mussten auf der Seite „Bilder“ erzeugt und das Markdown von Hand in einen Absatz kopiert werden. Vom Auftraggeber am 25.09.2026 festgelegt: Bilder in Word & Werkstatt, Screenshots markieren, Diagramme nachbearbeiten.

## Entscheidung
- **PNG-Fassung für Word:** Zu einem SVG-Bild kann eine PNG-Fassung hinterlegt werden (`PUT /media/{sha}/rendition`, Migration `024_images_style`: `media_assets.png_sha`). Gerastert wird **im Browser** (Canvas, doppelte Auflösung, höchstens 2400 px, weißer Hintergrund) – der Server bleibt ohne native Grafikbibliothek (wichtig für das portable Windows-Paket). Der Server prüft die PNG-Signatur und legt das PNG inhaltsadressiert ab.
- **Word-Export:** SVG mit PNG-Fassung wird als SVG-Bild mit PNG-Ersatzdarstellung eingebettet (`a:blip` = PNG, `asvg:svgBlip` = SVG; Word ab 2016 zeigt das SVG, andere Programme das PNG). Ohne PNG-Fassung bleibt es beim Alternativtext; das Bildverzeichnis zeigt „ohne PNG für Word“ und erzeugt fehlende Fassungen per Klick („PNG für Word erzeugen“). PDF und HTML nutzen weiter das SVG.
- **PNG-Fassungen** erscheinen nicht als eigene Einträge im Bildverzeichnis, solange sie nicht selbst verwendet werden.
- **Werkstatt: „🎨 Bild erzeugen“** je Absatz öffnet das Diagramm-Studio mit dem Absatztext; ausgewählte Bilder werden gespeichert (mit PNG-Fassung) und an den Absatz angehängt (normale Absatzbearbeitung mit Versionsprüfung).
- **Diagramme nachbearbeiten:** Schritte als Liste (Text, Entscheidung mit Ja/Nein-Zweig, Reihenfolge ↑ ↓, entfernen, hinzufügen), Klickpfad, Kennzahlen; Darstellung: Farbe (Standard Hausfarbe), Form (abgerundet, eckig, Pille), Schriftgröße (normal, groß), Stationen je Zeile der Klickstrecke (2–6). Optionen werden serverseitig geprüft (`normalizeOptions`).
- **Vorlagen:** Struktur, Bildarten und Darstellung als benannte Vorlage je Projekt speichern, laden und löschen (`/diagram-templates`, Tabelle `diagram_templates`, im Backup enthalten).
- **Screenshots markieren** (Seite „Bilder“, Tab „Screenshot markieren“): PNG/JPEG laden, nummerierte Klickpunkte setzen, Rahmen ziehen, Farbe, Rückgängig; Legende je Nummer mit Beschreibung und Position in Prozent (auch per Tastatur anlegbar und verschiebbar). Gespeichert wird ein PNG über die Bildablage (`POST /media`) mit Titel fürs Bildverzeichnis; das Markdown samt nummerierter Legende lässt sich kopieren.

## Konsequenzen
- PNG-Fassungen entstehen nur im Browser; per API importierte SVGs brauchen einmal „PNG für Word erzeugen“.
- Die Screenshot-Markierung ist ein einfacher Editor (Nummern, Rahmen); Pfeile, Unschärfe (z. B. für Kundendaten) und Textfelder sind nicht enthalten.
