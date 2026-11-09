# ADR-095 Datenschutz im Bild und mehrere Labels und Kapitel je Bild

**Status:** akzeptiert, umgesetzt in Etappe 42 (Auftrag 23.10.2026; nutzt ADR-029, ADR-080, ADR-085, ADR-090, ADR-092)

## Kontext
Screenshots aus oneSCM zeigen Namen, User-IDs, Adressen und Fahrgestellnummern (FIN). Die Datenschutzprüfung (ADR-080) erkennt diese Daten bisher nur im Text. Bilder sollen sie automatisch unkenntlich zeigen; die Redaktion schaltet das ein oder aus (rückgängig) und das Original bleibt erhalten. Außerdem sollen je Bild mehrere Labels – Domäne, Sprache, Rolle, Gliederung – und mehrere Kapitel zugeordnet werden; bisher gab es nur einen Gliederungspunkt.

## Entscheidung
- **Erkennung lokal:** Texterkennung mit Wortpositionen (`OCR_BOXES_CMD`, TSV wie Tesseract; ohne Angabe abgeleitet aus einem Tesseract-`OCR_CMD` mit „tsv“). Je Zeile wird der Text aus den Wörtern zusammengesetzt und mit der Datenschutzprüfung (Namen aus Metadatenfeldern und Namensliste, User-ID, Adresse, FIN, Kennzeichen, E-Mail, Telefon, IBAN) geprüft. Unkenntlich wird nur der Wert, nicht die Feldbezeichnung („User-ID:“ bleibt lesbar). Keine Daten verlassen den Rechner.
- **Automatisch:** Nach dem Ablegen eines Rasterbildes (Import, Upload, neue Fassung, eingebettete Bilder aus Word/PowerPoint/PDF, Standbilder) läuft die Erkennung als Job `image-redact`. Sie ist eingeschaltet, sobald etwas gefunden wurde. Erzeugte Bilder (Klickstrecken, Diagramme, Platzhalter) werden nicht geprüft.
- **Original bleibt:** Je Fassung speichert `media_redactions` die Stellen (relativ 0–1, Art, maskierter Treffer – nie Klartext), den Schalter und die verpixelte Kopie. Verpixelt wird mit Blöcken der halben Stellenhöhe (mindestens 8 px); die Kopie ist ein eigenes, inhaltsadressiertes PNG, erscheint aber nicht als Bild im Archiv.
- **Auslieferung:** `GET /media/{sha}` (auch `?original=1`), Exporte, Releases, Übersetzungen und Klickstrecken liefern bei eingeschalteter Unkenntlichmachung die Kopie. Das Original gibt es nur mit `?unredacted=1` und Bearbeitungsrecht.
- **Bedienung:** Unkenntlichmachung an/aus, je Stelle an/aus, eigene Stellen mit der Maus ziehen oder in Prozent angeben, „Original ansehen“, „Erneut erkennen“ (manuelle Stellen bleiben). Eine neue Fassung übernimmt manuelle Stellen und Schalter der Vorfassung. Prüfregeln: `privacy_visible` (Warnung: erkannte Stellen sichtbar), `privacy_redacted` (Info), `privacy_unchecked` (Texterkennung fehlgeschlagen).
- **Labels und Kapitel:** `media_labels` (mehrere Labels je Bild aus Domäne, Rolle, Gliederung, Navigation, Inhalt, Sparte, Kunde, System, Qualität; bestehende Gliederungspunkte übernommen) und `media_chapters` (mehrere Kapitel, unabhängig von der Verwendung im Text). Sprache bleibt das Merkmal „Sprache der Oberfläche“ (für Varianten, ADR-093). `outlineLabelId` bleibt kompatibel und folgt dem ersten Gliederungs-Label. Filter `labelId`/`chapterId` im Bildarchiv; Deckungsmatrix zusätzlich „je Gliederungspunkt“, „je Kapitel“ zählt zugeordnete Kapitel mit.

## Folgen
- Migration `049_image_redaction_labels.sql`; Tests T-288 … T-290, E2E T-291; Anforderungen NFR-99, NFR-100.
- Ohne Texterkennung: nur manuelle Stellen. Die Erkennung findet nur, was die Texterkennung liest – vor der Freigabe prüft ein Mensch das Bild (Prüfregel, Leitfaden).
- Gesichter oder Unterschriften erkennt die App nicht; dafür manuelle Stellen.
