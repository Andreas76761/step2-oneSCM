# oneSCM Handbuch Dashboard

Quellen des Dashboards „oneSCM Handbuch: Struktur und Klickstrecke“ (Claude-Artefakt vom Typ Dashboard):
https://claude.ai/artifact/MnvrjEq7jANj2WtYxaSjpo

- `index.html` – Seite des Dashboards (Kennzahlen, Bereiche, Klickstrecke als Prozessfluss, Unterkapitel je Hauptkapitel, Quick Guides, durchsuchbare Gliederung). Läuft im Dashboard-Rahmen mit der `dash`-API und d3.
- `gliederung.csv` – Gliederung des Handbuchs (Kapitel, Thema, Ebene, Bereich, Teil), Datensatz `gliederung`.
- `quickguides.csv` – Quick Guides je Hauptkapitel mit Seitenzahl und Link auf die im Dashboard abgelegte PDF (`/_blob/…`), Datensatz `quickguides`. Die PDFs selbst liegen unter `docs/quickguides/`.

Die Seite ist im Dashboard als Dokument `files/index.html` hinterlegt; die CSV-Dateien sind als Dateien im Dashboard abgelegt und über die Datensätze `datasets/gliederung` und `datasets/quickguides` eingebunden.
