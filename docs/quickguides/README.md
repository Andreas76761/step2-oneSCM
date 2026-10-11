# Quick Guides oneSCM

Je Hauptkapitel (1 bis 23), Anhang (A.1 bis I.3), Übergangsmodul (T6-7 bis T15-16) und Vorspannseite (V.1, V.2) des oneSCM-Handbuchs ein zweiseitiger Quick Guide, insgesamt 43, im Design der Vorlage
„Van_20260429_Quick_Guide_oneSCM_Antragserstellung_und_-verwaltung“ (780 x 540 pt, Kartenlayout, Sternmuster, Logo, Fußzeile mit Stand und Seitenzahl).

- `pptx/` – bearbeitbare PowerPoint-Dateien (Schriften MB Corpo A Title Cond Office und MB Corpo S Text Office wie in der Vorlage)
- `pdf/` – Einzel-PDFs, `Alle_Quick_Guides_oneSCM.pdf` – alle 43 Guides in einer Datei (86 Seiten)
- `src/` – Generator: `content.py` (Inhalte der Kapitel), `content_extra.py` (Anhänge, Übergangsmodule, Vorspann), `images.py` (Prozessbilder) und `gen.js` (Layout, pptxgenjs)

## Aufbau je Guide

Seite 1: Ziel und Nutzen, Themen im Überblick (Unterkapitel), „So gehen Sie vor“ als nummerierte Schritte, Warnhinweis.
Seite 2: Rollen und Voraussetzungen, Checkliste, Hinweise und Stolpersteine, FAQ, wichtige Links und Ansprechpartner.

Jeder Guide enthält drei Grafiken: ein Kapitelbild (Nummer und Prozessphase), ein Prozessbild mit den nummerierten Schritten des Kapitels und eine Prozesslandkarte, in der die Phase des Kapitels rot hervorgehoben ist. Die Grafiken erzeugt `src/images.py` im Design der Vorlage; echte Bildschirmbilder können sie ersetzen.

## Neu erzeugen

```bash
cd docs/quickguides/src && npm install
python3 content.py spec.json && python3 images.py assets/img spec.json && node gen.js spec.json ../out
```

Die Inhalte sind aus der Kapitelgliederung und den gesicherten Prozessinhalten der Vorlage abgeleitet; Aussagen zu Systemdetails sind gegen das jeweilige Handbuchkapitel zu prüfen.
