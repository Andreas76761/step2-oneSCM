# Quick Guides oneSCM

Je Hauptkapitel des oneSCM-Handbuchs (Kapitel 1 bis 23) ein zweiseitiger Quick Guide im Design der Vorlage
„Van_20260429_Quick_Guide_oneSCM_Antragserstellung_und_-verwaltung“ (780 x 540 pt, Kartenlayout, Sternmuster, Logo, Fußzeile mit Stand und Seitenzahl).

- `pptx/` – bearbeitbare PowerPoint-Dateien (Schriften MB Corpo A Title Cond Office und MB Corpo S Text Office wie in der Vorlage)
- `pdf/` – Einzel-PDFs, `Alle_Quick_Guides_oneSCM.pdf` – alle 23 Guides in einer Datei
- `src/` – Generator: `content.py` (Inhalte je Kapitel) und `gen.js` (Layout, pptxgenjs)

## Aufbau je Guide

Seite 1: Ziel und Nutzen, Themen im Überblick (Unterkapitel), „So gehen Sie vor“ als nummerierte Schritte, Warnhinweis.
Seite 2: Rollen und Voraussetzungen, Checkliste, Hinweise und Stolpersteine, FAQ, wichtige Links und Ansprechpartner.

Grau hinterlegte Felder „Screenshot: …“ sind Platzhalter für Bildschirmbilder aus dem jeweiligen Handbuchkapitel.

## Neu erzeugen

```bash
cd docs/quickguides/src && npm install
python3 content.py spec.json && node gen.js spec.json ../out
```

Die Inhalte sind aus der Kapitelgliederung und den gesicherten Prozessinhalten der Vorlage abgeleitet; Aussagen zu Systemdetails sind gegen das jeweilige Handbuchkapitel zu prüfen.
