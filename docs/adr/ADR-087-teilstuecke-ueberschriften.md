# ADR-087 Teilstücke langer Chunks und Quellen je Überschrift

**Status:** akzeptiert, umgesetzt in Etappe 35 (Rest von M3 aus [docs/06](../06-plan-onescm-metadaten.md); erweitert ADR-079, ADR-084, ADR-086)

## Kontext
Der Plan für oneSCM_Metadaten sieht Chunks von 300–800 Zeichen vor, geteilt an Satzgrenzen mit einem Satz Überlappung; Tabellen und Listen bleiben ganz. Die Textabschnitte (`text_snippets`) sind aber zugleich die Grundlage des Handbuchs: ihre Granularität ist entschieden (E-02: Absatz, Liste, Tabelle, Codeblock, Zitat) und sie sind unveränderlich (ADR-004). Eine Überlappung im gespeicherten Text würde Sätze im Handbuch doppeln. Außerdem fehlte die Seite „Quellen je Überschrift“.

## Entscheidung
- **Teilstücke statt Umbau der Textabschnitte:** Ein Chunk über 800 Zeichen (nur Absatz und Zitat) wird für Suche und Antworten in Teilstücke zerlegt – an Satzgrenzen, 300–800 Zeichen, ein überlanger Satz an Kommas bzw. Leerzeichen; ein zu kurzer Rest wird an das vorige Teilstück gehängt (bis 1 000 Zeichen). Je Teilstück steht der letzte Satz des vorigen als Überlappung dabei – nur als Kontext, nicht im Text. Bleibt nur ein Stück übrig, bleibt der Chunk ganz. Die Teilstücke werden aus dem Text abgeleitet (keine Migration, kein doppelter Speicher) und mit jedem Chunk ausgeliefert (`chars`, `parts`); E-02 bleibt unverändert. Die Nutzung in der Antwortsuche folgt mit M5.
- **Quellen je Überschrift:** Seite unter oneSCM_Metadaten mit zwei Ansichten – je Datei ein Überschriftenbaum (Kapitel › Unterkapitel › tiefere Überschriften) mit Chunk-Vorschau und Fundstelle; zusammengeführt je Überschrift, Schlüssel = tiefste Überschrift ohne Nummerierung und Formatierung (wie beim Kapitelabgleich), mehrfach vorkommende Überschriften zuerst, Quellen nebeneinander. Von jeder Überschrift führt ein Link zu den Chunks.
- **Filter „Überschrift“** in der Chunk-Liste: Teiltreffer in Kapitel, Unterkapitel oder tieferer Überschrift (auch über `?heading=` im Link).

## Folgen
- Keine Migration; Tests T-257, T-258, E2E T-259; Anforderungen NFR-83, NFR-84.
- Ändert sich die Zielgröße, ändern sich nur die abgeleiteten Teilstücke, nicht die Textabschnitte, Nachweise oder Kapitel.
