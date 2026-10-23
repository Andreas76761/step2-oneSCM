# Mit der App arbeiten – oneSCM Handbook Studio

Die App (Installationspaket `onescm-studio-<Version>-windows-x64.zip`, Start mit `start.cmd`, dann http://localhost:3000) ergänzt diesen Arbeitsordner: Sie liest die Quellen ein, beantwortet Fragen mit Belegen, misst die Antwortqualität und verwaltet Screenshots. Daten bleiben lokal. Ausführlich: `Dokumentation/09-benutzerdokumentation.md` im App-Paket.

## Quellen einlesen

1. `01_Input/02_Zugeordnet/` (oder ein Kapitel unter `02_Kapitel/<Kapitel>/01_Quellen/`) als ZIP packen.
2. App › oneSCM_Metadaten › **Einlesen**: ZIP hineinziehen. Formate: Markdown, HTML/Confluence, Word, PowerPoint, PDF (gescannte Seiten mit Texterkennung, falls eingerichtet), Untertitel VTT/SRT, Video MP4 (Untertitel mit gleichem Namen daneben legen), Jira-Export (XML/CSV).
3. Jeder Chunk trägt seine Fundstelle (Seite, Folie, Zeitmarke, Zeile) – genau die Angabe, die Grundregel 2 für Belege verlangt.

## Fragen mit Belegen, Rückfragen, Antwortqualität

| Aufgabe | In der App | Ablage hier |
|---|---|---|
| einzelne Frage an alle Quellen | Fragen & Antworten → „Fragen“; Antwort mit Beleg je Satz übernehmen | belegte Antworten in `06_FAQ/FAQ.md` des Kapitels (faq-redakteur) |
| Fragenkatalog (z. B. Review-Cockpit) | Rückfragen → Datei einlesen → „Alle mit Belegen beantworten“ → Export Excel | Export nach `App/Exporte/` |
| Testfragen mit erwarteten Quellen | Antwortqualität → `App/TESTFRAGEN.csv` einlesen → „Prüflauf starten“ | Kennzahlen-Export nach `App/Exporte/` |
| Wissenslücken an Fachleute | Expertenbefragung → aus Prüflauf oder Rückfragen anlegen → Excel exportieren | ausgefüllte Excel-Dateien nach `App/Befragungen/`, dann in der App einlesen |

**`TESTFRAGEN.csv`** (Semikolon, UTF-8): `Frage`; `Erwartete Quelle` (Teil des Dateipfads, optional „Pfad › Überschrift“, mehrere mit „|“); `Erwartete Überschrift`; `Stichworte` (mit „|“); `Keine Antwort` (`ja` = Lückenfrage – richtig ist „keine Aussage in den Quellen“). Fragen aus Wissens-Check und Lückenanalyse hier eintragen.

Antworten aus der Expertenbefragung tragen in der App das Label „Prüfen“ und haben **keinen Quellenbeleg** – im Entwurf nur als `[offen: Expertenaussage <Fachbereich>, Beleg fehlt]` verwenden, bis eine Quelle vorliegt.

## Screenshots

- Bildarchiv: jedes Bild mit fester Nummer (B-0001 …) und Merkmalen (Sprache, Rolle, Sparte, Markt, Release, Reiter). Platzhalter reservieren Nummern für fehlende Screenshots.
- **Varianten einer Maske** (z. B. Deutsch/Englisch, Pkw/Van) verknüpfen – Export und Übersetzungen nehmen automatisch die passende Fassung.
- **Klickstrecke aus Screenshots** mit parallelen Wegen 3a/3b; **Deckungsmatrix** zeigt, welche Fassung je Maske fehlt.
- Bildnummern in `03_Bilder/BILDER.md` des Kapitels mitführen (bild-redakteur).

## Gliederung abgleichen

`python 00_Dokumentation/Werkzeuge/handbuch_struktur.py abgleich . --app http://localhost:3000 --projekt p_default --token <API-Token>` – API-Token in der App unter Integrationen › API-Tokens (Berechtigung read).
