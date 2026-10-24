# ADR-088 Dubletten über alle Formate je Abschnitt, inkrementell nach jedem Import

**Status:** akzeptiert, umgesetzt in Etappe 36 (M4 aus [docs/06](../06-plan-onescm-metadaten.md); ergänzt ADR-006, ADR-024, ADR-084, ADR-086)

## Kontext
Die Analyse (ADR-006) findet gleiche und ähnliche Textabschnitte, aber nur auf Absatzebene und nur auf Anforderung. Dieselbe Anleitung sieht als Folie (Aufzählung), als PDF (nummerierte Liste oder Fließtext) und in Word unterschiedlich aus – auf Absatzebene ergeben sich kaum Treffer. Der Plan verlangt eine Dublettenprüfung nach jedem Import, formatübergreifend, ab 85 % Ähnlichkeit (M-07), mit Neuberechnung nur geänderter Dateien und einer Seite mit Paaren, Gruppen, markierten Unterschieden und der Wahl „führende Fassung“ bzw. „kein Duplikat“.

## Entscheidung
- **Abschnitt** = aufeinanderfolgende Chunks einer Datei unter derselben Überschrift (bei PowerPoint: Folie, ADR-086). Der Text wird formatneutral normalisiert: ohne Aufzählungszeichen und Nummerierung, Formatierung, Bilder, Tabellenstriche, Zitatzeichen; Links werden zu ihrem Text. Abschnitte unter 40 Zeichen zählen nicht.
- **Paare:** exakt gleich (gleicher normalisierter Hash) oder ähnlich (TF-IDF-Kosinus der vorhandenen Engine ≥ 0,85, lokal, ohne KI); `crossFormat`, wenn die Formate verschieden sind. Gruppen entstehen über die Paare (Union-Find), z. B. dieselbe Folie in PowerPoint, PDF und Word.
- **Inkrementell:** Am Ende jedes Imports werden nur Dateien mit neuer Revision oder als entfernt markierte neu in Abschnitte zerlegt; gespeichert werden nur Paare, an denen ein geänderter Abschnitt beteiligt ist – Paare zwischen unveränderten Dateien bleiben stehen (mit derselben ID). Ein Bestand von vor Etappe 36 wird beim ersten Aufruf einmal vollständig berechnet; „Neu berechnen“ (Bearbeitung) baut alles neu auf. Die Embeddings werden wie bisher nur für geänderte Texte neu berechnet (Hash je Text, ADR-017).
- **Entscheidung je Inhaltspaar:** „A führend“, „B führend“, „kein Duplikat“ oder zurücksetzen (Bearbeitungsrecht, mit Notiz, im Audit). Gespeichert wird sie über die normalisierten Hashes beider Abschnitte – sie überlebt erneutes Einlesen und gilt für alle Paare mit demselben Inhalt (z. B. PPTX und PDF gegenüber derselben Markdown-Fassung). Bei exakt gleichen Abschnitten wären beide Seiten so nicht zu unterscheiden; dort zählt zusätzlich der Dateipfad („Hash@Pfad“).
- **Unterschiede:** wortweiser Vergleich (LCS), bei sehr langen Texten satzweise; Anzeige nebeneinander mit beiden Fundstellen.
- **PDF-Leser (Korrektur):** Textstücke einer Zeile werden nach ihrer Position zusammengesetzt, weil manche Erzeuger z. B. die Nummer „1.“ erst nach dem Zeilentext schreiben; nummerierte Listen bleiben damit erhalten.

## Folgen
- Migration `042_section_duplicates.sql`; Tests T-260, T-261, E2E T-262; Anforderungen NFR-85, NFR-86.
- Semantische (embedding-basierte) Paare je Abschnitt können später ergänzt werden; die Schwelle bleibt bei 85 %.
