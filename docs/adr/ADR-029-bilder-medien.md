# ADR-029 Bilder & Medien

**Status:** akzeptiert, umgesetzt in Etappe 10

## Kontext
Benutzerhandbücher leben von Bildschirmfotos. Bisher wurden Bilder beim Import durch ihren Alternativtext ersetzt. Bilder sollen aus allen Quellen übernommen, versioniert und überall angezeigt werden – ohne aktive Inhalte, externe Abrufe oder Zugriff über Projektgrenzen, und barrierefrei.

## Entscheidung
- **Inhaltsadressierte Ablage je Projekt** (`media_assets`, Migration `019`; Objekt `media/<sha256>`): Markdown verweist mit `![Alternativtext](media:<sha256>)`. Ein geänderter Screenshot hat einen neuen Hash; da Quellrevisionen und Kapitelversionen unveränderlich sind (ADR-004), bleibt jeder frühere Stand mit seinem Bild reproduzierbar.
- **Nur Rasterformate** PNG, JPEG, GIF, WebP – erkannt an der Dateisignatur, nicht an der Endung. SVG ist ausgeschlossen (Skripte). Abmessungen werden aus dem Dateikopf gelesen.
- **Quellen:** ZIP (Bilddateien werden zuerst abgelegt; relative Verweise in Markdown und HTML werden relativ zur Datei aufgelöst und umgeschrieben, Zeilennummern bleiben erhalten; Codeblöcke unverändert; fehlende Bilder als Warnung), Word (`convertImage` von mammoth mit Alternativtext; EMF/WMF bleiben Alternativtext), HTML mit `data:`-URIs, Git-Repositories (Bilddateien werden mitgenommen) und Confluence Cloud (Anhänge von `<ac:image>` werden geladen; externe Bild-URLs nie).
- **Auslieferung** `GET /api/v1/media/{sha}` nur im eigenen Projekt, `nosniff`, eigene CSP `sandbox`, unveränderlich zwischenspeicherbar. Die Web-Oberfläche lädt Bilder mit Anmeldung als Blob (CSP `img-src blob:`); externe Bilder werden nie geladen (nur Alternativtext).
- **Barrierefreiheit:** Qualitätsgate-Prüfung `image_alt` – Bilder ohne Alternativtext blockieren Einreichung, Freigabe und Export. Die Werkstatt fügt Bilder nur mit Alternativtext ein.
- **Ausgabe:** HTML- und Markdown-Export betten Bilder als `data:`-URI ein (eigenständige Datei, CSP `img-src data:`); PDF bettet PNG/JPEG in natürlicher Größe bis Satzspiegelbreite ein (GIF/WebP: Alternativtext); die Online-Hilfe legt Bilder einmal unter `bilder/` ab (CSP `img-src 'self' data:`). Backups enthalten die Medien.
- **KI:** Absätze mit Bildern werden nicht umformuliert; maschinelle Übersetzungen hängen verlorene Bildverweise wieder an.

## Konsequenzen
- Exporte werden größer; dafür bleiben sie ohne Netzwerkzugriff vollständig.
- Bilder sind nur so aktuell wie die Quelle – ein neuer Screenshot erfordert einen neuen Import und eine neue Kapitelversion.
