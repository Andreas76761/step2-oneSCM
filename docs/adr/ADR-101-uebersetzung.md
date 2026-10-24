# ADR-101 Übersetzung: Übersetzungsspeicher, Prüfungen, Länderreview mit MQM, Glossar, XLIFF/Excel, Rückübersetzung, Schweizer Varianten, Rahmentexte, Releaseletter DE↔EN, Bildvarianten

**Status:** akzeptiert, umgesetzt in Etappe 48 (U-01 … U-10 aus docs/10; erweitert ADR-020 Mehrsprachigkeit, ADR-083 Releaseletter, ADR-093 Varianten einer Maske)

## Kontext
Übersetzt wurde je Kapitel und Sprache mit KI-Vorschlag, Satz-Zuordnung, Prüfregeln und einer Freigabe je Sprache. Für den Betrieb mit vielen Sprachen, Ländern und Releases fehlten:
- die Wiederverwendung freigegebener Sätze (Kosten je Release),
- weitere Prüfungen,
- das Länderreview als eigener Schritt,
- ein Austausch mit Übersetzungsbüros,
- die Rückübersetzung von Sicherheitshinweisen,
- übersetzte Rahmentexte im Export,
- die Übersetzung von Releaselettern,
- ein Hinweis auf Bilder ohne Fassung in der Zielsprache.

Entscheidungen des Auftraggebers vom 24.10.2026:
- Zusätzliche Sprachen **de-CH** und **fr-CH**. Slowakisch, Tschechisch und Französisch gibt es schon.
- Austausch mit Büros über **XLIFF 1.2 und Excel**.

Daten bleiben lokal. Die KI läuft nur über den eingerichteten Dienst; an externe Dienste gehen keine personenbezogenen Daten.

## Entscheidung

**Übersetzungsspeicher (U-01)**
- Tabelle `translation_memory` je Sprachpaar. Segment ist der Absatz, 100-%-Treffer laufen über den normalisierten Quelltext.
- Bei der Freigabe einer Übersetzung bzw. eines übersetzten Releaseletters kommen alle Absätze (bzw. Zeilen) in den Speicher, mit Herkunft und Ausgangsversion.
- Beim Anlegen einer Übersetzung und vor der KI übernimmt die App freigegebene 100-%-Treffer (`mode memory`).
- Je Absatz zeigt sie ähnliche Treffer ab 75 % als Vorschlag. Gemessen wird die Ähnlichkeit per Levenshtein auf Wörtern, wie bei CAT-Werkzeugen.
- Export und Import entsprechen `SPEICHER.csv` des Arbeitsordners. Importierte Segmente sind „zu prüfen“, außer der Status heißt „freigegeben“. Ein freigegebenes Segment ersetzt kein ungeprüfter Import.

**Weitere Prüfungen (U-02)** in `checkTranslation`:
- **Längenverhältnis:** außerhalb 0,55–1,8 der deutschen Quelle (Koreanisch 0,25–1,2, de-CH 0,9–1,15; erst ab 20 Zeichen).
- **Deutsche Wörter im Zieltext:** mindestens zwei verschiedene, klein geschriebene deutsche Funktionswörter, die in keiner Zielsprache als Wort vorkommen.
- **Datum oder Kennung nur auf einer Seite:** Datum in jedem Format, Kennungen wie E-4711. Reine Zahlen prüft weiterhin `numbers_changed`.

**Länderreview mit MQM (U-03)**
- Eine Runde je Übersetzung mit Prüferin bzw. Prüfer und Markt; angefordert wird sie mit der Berechtigung „Bearbeiten“.
- Fehler erfasst nur die zugewiesene Person oder die Administration: je Absatz mit Kategorie (Genauigkeit, Sprachfluss, Terminologie, Stil, Landeskonventionen, Layout) und Schwere (gering 1, schwer 5, kritisch 10 Punkte).
- Bestanden ist eine Runde bis 5 Punkte je 1 000 Wörter des Zieltexts (Checkliste); dann gibt das Land frei. Sonst heißt es „zurück an Übersetzung“, danach folgt eine neue Runde.
- Wurde ein Review angefordert, muss es vor der Freigabe der Übersetzung vom Land freigegeben sein.
- Ändert jemand die Übersetzung nach der Freigabe durch das Land, öffnet sich die Runde erneut.

**Glossar je Sprache (U-04)**
- Eigene Sicht auf die festen Übersetzungen der Terminologie; Schweizer Varianten erben von der Grundsprache.
- Export wie `GLOSSAR.csv` oder als Excel.
- Beim Rückimport setzt die App feste Übersetzungen. Unbekannte deutsche Begriffe meldet sie nur und legt sie nicht an.

**XLIFF 1.2 und Excel (U-05)**
- Eine `trans-unit` je Absatz, ID ist der Übersetzungsabsatz, mit Hinweis auf Abschnitt und offene Befunde. Excel hat die Spalten ID, Abschnitt, Deutsch, Zielsprache, Status, Hinweis.
- Der Rückimport übernimmt nur Absätze dieser Übersetzung mit unverändertem deutschem Text und prüft jede Übersetzung. Zuerst zeigt er eine Vorschau.
- Inline-Elemente von CAT-Werkzeugen (`g`, `x`, `mrk` …) reduziert die App auf ihren Text. DOCTYPE und Entitäten lehnt sie ab.

**Rückübersetzung (U-06):** 10 % der übersetzten Warnhinweise bzw. Absätze mit Signalwort, mindestens einer, gleichmäßig verteilt. Die KI übersetzt sie wörtlich ins Deutsche zurück. Der Vergleich mit der Quelle läuft per Dice-Koeffizient über Wortstämme, Schwelle 0,5.

**Schweizer Varianten (U-07)**
- **de-CH** entsteht nach Regeln aus dem deutschen Text: ss statt ß, «…» und ‹…›; Code, Links und Platzhalter bleiben. Das braucht keine KI. Eine Prüfung meldet ß.
- **fr-CH** übernimmt die freigegebene französische Fassung derselben Kapitelversion; sonst übersetzt die KI mit Schweizer Konventionen.
- Bilder, Signalwörter, Abschnittstitel, Beschriftungen und feste Begriffe fallen auf die Grundsprache zurück.
- Sprachcodes klein (`de-ch`), im HTML `de-CH`. Ordner im Arbeitsordner: `10_Deutsch_DE-CH`, `11_Französisch_FR-CH`.

**Rahmentexte (U-08):** `domain/frameTexts.ts` für 14 Sprachen. Übersetzt werden Titel, „Exportiert am“/„Stand“, Filterzeile, Versionszeile, „Gültig ab“, Inhaltsverzeichnis, „Seite … von …“, Hinweisarten und die Titel der Verzeichnisse im Anhang einschließlich „Historie“. Das gilt in Markdown, HTML (`lang`), PDF und Word sowie in den Sprachfassungen der Releases.

**Releaseletter DE↔EN (U-09)**
- Die Übersetzung wird ein neuer Letter-Entwurf mit Verweis auf den Ausgangsletter. Jede Zeile kommt erst aus dem Speicher, sonst übersetzt die KI; Markdown-Zeichen am Zeilenanfang bleiben erhalten.
- Prüfbefunde je Zeile (Prüfregeln wie U-02, gleiche Zeilenzahl) sperren die Freigabe. Bei der Freigabe gehen die Zeilenpaare in den Speicher.
- Der Ausgangsletter lässt sich nicht löschen, solange es eine Übersetzung gibt.

**Bildvarianten (U-10):** Die Übersetzung meldet Bilder, deren beste Fassung eine andere Oberflächensprache zeigt. Sie sperrt die Freigabe nicht. Bilder ohne Sprachangabe gelten als sprachneutral.

**Demo-KI:** Ohne KI-Dienst „übersetzt“ die Demo per Pseudo-Lokalisierung: klein geschriebene Wörter bekommen Akzente, Sprachkennung vorn; Begriffe, Signalwörter, Platzhalter, Code und Kennungen bleiben. Ins Deutsche läuft das rückwärts. So sind die Abläufe ohne echten Dienst durchspielbar, und die Prüfung „deutsche Wörter“ meldet die Demo-Ausgabe nicht fälschlich.

## Begründung
- Der Speicher auf Absatzebene passt zur Struktur der App (ein Absatz je Block) und zu `SPEICHER.csv`. Satzsegmente bringen erst mit einem echten Segmentierer (SRX) mehr.
- MQM ist der übliche Standard für Fehlerpunkte. Schwellwert und Gewichte stammen aus der vorhandenen Checkliste.
- XLIFF 1.2 lesen praktisch alle CAT-Werkzeuge; XLIFF 2.0 wird nicht von allen gleich gut unterstützt.
- Schweizer Hochdeutsch unterscheidet sich im Schriftbild vor allem durch ss; eine KI-Übersetzung wäre hier Aufwand ohne Nutzen.

## Folgen
- Migration 054: `translation_memory`, `translation_reviews`, `translation_backchecks`; `translation_blocks.tm_id` und `.tm_score`; `release_letters.translation_of` und `.translation_issues`.
- Neue Blockmodi `memory` (aus dem Speicher) und `imported` (Büro).
- Das Länderreview ist optional. Ob es für bestimmte Sprachen Pflicht werden soll, ist offen.
- Die Ansprechperson je Land (O-09) bleibt offen; in der App ist es ein Benutzer.
- Die Rückübersetzung braucht einen KI-Dienst. Mit externem Dienst überspringt sie Absätze mit personenbezogenen Daten.
- Arabisch, Asiatisches und weitere Sprachen sind nicht Teil der Entscheidung (U-07, weitere Märkte offen).
