# ADR-094 Leistung bei großen Beständen und Installationspaket

**Status:** akzeptiert, umgesetzt am 23.10.2026 (Abschluss nach Etappe 41; nutzt ADR-088, ADR-089, ADR-031)

## Kontext
Der Lasttest ([lasttest-metadaten](../lasttest-metadaten.md)) mit 2 000 Dokumenten zeigte: Der Import wächst überproportional (CPU-Profil: 23 von 43 s im paarweisen Dubletten-Vergleich), und jede Frage an alle Quellen zerlegt alle 48 000 Texte neu in Wortstämme (5,3 von 6 s). Außerdem soll die App ohne Entwicklungsumgebung auf einem anderen Rechner laufen – auch unter Windows ohne Administratorrechte und ohne Zugang zum npm-Registry.

## Entscheidung
- **Dubletten mit Präfix-Filter:** `TfidfEngine.pairs` nutzt ab einem Mindestwert von 0,7 den Präfix-Filter nach All-Pairs (Bayardo et al. 2007): je Abschnitt werden nur die seltenen Terme indexiert, deren obere Schranke Σ w·maxw den Mindestwert erreicht; der Wert jedes Kandidatenpaars wird exakt berechnet. Das Ergebnis ist identisch zum bisherigen Verfahren (geprüft mit 4 800 Abschnitten und Schwellen 0,4–0,95); unter 0,7 (Textcluster) bleibt das bisherige Verfahren. Mit `involving` werden beim inkrementellen Abgleich nur Paare mit einem geänderten Abschnitt bewertet.
- **Zwischenspeicher für Wortstämme:** `keywordScore` merkt sich die Stämme und Präfixe je Text (LRU, 60 000 Texte) und die Terme je Frage; die Bewertung ist unverändert.
- **Darstellung:** Antwortsätze und Belegauszüge zeigen Markdown formatiert (fett, kursiv, Code, Bild als „[Bild: …]“) statt Sternchen.
- **Installationspaket** (`tools/paket/paket.sh`): universelles ZIP mit gebauter App, Start-, Installations- und Sicherungsskripten für Windows und Linux/macOS, Dokumentation und fiktiven Beispieldaten; dazu ein **Windows-x64-Offline-Paket** mit Node.js portable, allen Laufzeit-Abhängigkeiten und Windows-Binärdateien (better-sqlite3 als Prebuild für Node 22, @napi-rs/canvas für win32). PowerShell-Skripte mit UTF-8-BOM, damit Windows PowerShell 5 Umlaute richtig liest; `start.cmd` startet ohne dauerhafte Änderung der Ausführungsrichtlinie.

## Folgen
- Import 2 000 Dokumente 33 statt 44 s; Frage an alle Quellen p50 160 statt 328 ms (500 Dok.); Prüflauf 30 Fragen 4,5 statt 9,4 s; 10 parallele Fragen p95 2,5 statt 5,2 s.
- Arbeitsspeicher steigt durch den Zwischenspeicher um etwa 100–200 MB bei 48 000 Abschnitten.
- Das Windows-Paket ist an Node 22 gebunden (ABI der better-sqlite3-Binärdatei); neue Pakete mit `paket.sh … --windows node-v22….zip` bauen.
