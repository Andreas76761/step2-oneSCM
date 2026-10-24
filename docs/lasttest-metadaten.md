# Lasttest oneSCM_Metadaten und Gesamtanwendung (Etappe 41, wiederholt in Etappe 49)

Gemessen am 23.10.2026 in der Entwicklungsumgebung (Container, 4 Kerne, 16 GB, Node 22, SQLite) gegen einen laufenden Server mit Demo-Daten:

```bash
DATA_DIR=./perf npx tsx apps/server/scripts/seed-demo.ts
DATA_DIR=./perf PORT=3200 LLM_PROVIDER=demo node apps/server/dist/index.js &
node apps/server/scripts/perf-metadata.mjs 3200 500     # bzw. 2000
```

Das Skript erzeugt Markdown-Dokumente mit je 8 Abschnitten (je 3 Textabschnitte, insgesamt 12 000 bzw. 48 000) und 20 Bilder, importiert sie über die normale Pipeline (Chunks, Klassifikation, Dubletten je Abschnitt) und misst typische Abläufe. Die Texte sind bewusst gleichförmig (Vorlagen) – für die Dubletten ein ungünstiger Fall mit sehr vielen ähnlichen Paaren.

## Ergebnis (nach Optimierung, ADR-094)

| Ablauf | 500 Dokumente (12 000 Chunks) | 2 000 Dokumente (48 000 Chunks) |
|---|---|---|
| Import ZIP (inkl. Dubletten-Abgleich) | 5,1 s (99 Dok./s) | 33,0 s (61 Dok./s) |
| erneuter Import, unverändert | 0,3 s | 0,9 s |
| Chunks-Liste / Chunks-Suche (p50 · p95) | 18 · 33 ms / 16 · 19 ms | 54 · 68 ms / 42 · 65 ms |
| globale Suche (p50 · p95) | 5 · 8 ms | 13 · 16 ms |
| Quellen je Überschrift | 86 ms | 464 ms |
| **Frage an alle Quellen** (p50 · p95) | **160 · 328 ms** | **294 · 617 ms** |
| Dubletten-Liste | 2 ms | 2 ms |
| Bildarchiv / Deckungsmatrix | 102 / 78 ms | 459 / 457 ms |
| Prüflauf Antwortqualität, 30 Fragen | 4,5 s (149 ms je Frage) | 6,9 s (231 ms je Frage) |
| Kapitel erzeugen (p50) | 10 ms | 11 ms |
| Export 27 Kapitel: Markdown · HTML · PDF · Word | 44 · 118 · 535 · 170 ms | 49 · 100 · 543 · 179 ms |
| 20 parallele Nutzer, 500 Leseanfragen | 195 Anfr./s, p95 191 ms | 62 Anfr./s, p95 795 ms |
| 10 parallele Fragen an alle Quellen | p50 1,2 s · p95 2,5 s | p50 2,0 s · p95 4,4 s |
| Arbeitsspeicher des Servers | 554 MB | 711 MB |

## Vor der Optimierung

| Ablauf | 500 Dokumente | 2 000 Dokumente |
|---|---|---|
| Import | 5,0 s | 44,3 s |
| Frage an alle Quellen (p50 · p95) | 328 · 453 ms | 523 · 659 ms |
| Prüflauf 30 Fragen | 9,4 s | 15,5 s |
| 10 parallele Fragen (p95) | 5,2 s | 9,4 s |

Ursachen laut CPU-Profil: Beim Import mit 2 000 Dokumenten entfielen 23 von 43 s auf den paarweisen Dubletten-Vergleich; bei jeder Frage wurden alle 48 000 Texte neu in Wortstämme zerlegt (5,3 von 6 s). Abhilfe siehe ADR-094.

## Wiederholung in Etappe 49 (24.10.2026)

Gleiche Umgebung und gleiches Skript. Das Skript wartet jetzt auf die TRIAGE nach dem Import (seit Etappe 47 ein eigener Job), damit spätere Messungen nicht mitlaufen. Neu gemessen werden die Funktionen der Etappen 48 und 49.

| Ablauf | 500 Dokumente | 2 000 Dokumente | Etappe 41 (500 / 2 000) |
|---|---|---|---|
| Import ZIP (inkl. Dubletten-Abgleich) | 7,5 s | 42,5 s | 5,1 s / 33,0 s |
| TRIAGE nach dem Import (neu, eigener Job) | 7,3 s | 12,2 s | – |
| erneuter Import, unverändert | 0,3 s | 1,0 s | 0,3 s / 0,9 s |
| Chunks-Liste (p50) | 26 ms | 70 ms | 18 / 54 ms |
| Frage an alle Quellen (p50 · p95) | 150 · 890 ms | 258 · 1 269 ms | 160 · 328 / 294 · 617 ms |
| Prüflauf Antwortqualität, 30 Fragen | 4,2 s | 6,9 s | 4,5 / 6,9 s |
| Export 27 Kapitel: Markdown · HTML · PDF · Word | 50 · 97 · 535 · 150 ms | 49 · 99 · 554 · 167 ms | unverändert |
| Stilprüfung mit Ton, 40 Sätze (p50) | 12 ms | 15 ms | – |
| Stilprüfung eines Kapitels (p50) | 10 ms | 11 ms | – |
| Release-Abgleich mit Einstufung, 500 Tickets (p50) | 136 ms | 142 ms | – |
| Projektvergleich zweier Releases (p50) | 127 ms | 166 ms | – |
| Releaseletter aus dem Vergleich | 422 ms | 373 ms | – |
| 20 parallele Nutzer, 500 Leseanfragen | 67 Anfr./s, p95 666 ms | 19 Anfr./s, p95 2,8 s | 195 / 62 Anfr./s |
| 10 parallele Fragen an alle Quellen (p50 · p95) | 1,4 · 2,4 s | 2,1 · 4,2 s | 1,2 · 2,5 / 2,0 · 4,4 s |
| Arbeitsspeicher des Servers | 603 MB | 712 MB | 554 / 711 MB |

**Gefunden und behoben:**
- **TRIAGE sperrte den Server.** Sie lief in einer einzigen Transaktion über alle Chunks (12 000 Chunks ≈ 7 s); in dieser Zeit warteten alle anderen Anfragen. Jetzt arbeitet sie in Teilschritten zu 250 Chunks mit je eigener Transaktion, dazwischen kommen andere Anfragen an die Reihe. Bricht ein Lauf ab, steht er auf „failed“.
- **Übersicht oneSCM_Metadaten:** Seit TRIAGE trägt jeder Chunk rund zwölf Labels (144 000 Zuordnungen bei 12 000 Chunks). Das Zählen der gelabelten Chunks per Join über alle Zuordnungen dauerte 504 ms; mit `EXISTS` je Chunk sind es 31 ms. Vorher brachen die 20 parallelen Nutzer auf 9 Anfr./s mit p95 6,5 s ein.

**Bekannt, nicht behoben:**
- Die Übersicht braucht bei 48 000 Chunks weiter rund 200 ms. Sie macht ein Fünftel der Anfragen im gemischten Paralleltest aus und bestimmt dessen Wert; die übrigen Leseanfragen sind so schnell wie in Etappe 41. Abhilfe wäre ein Zähler je Projekt, der beim Labeln mitgeführt wird.
- Der Import ist um rund 30 % langsamer als in Etappe 41 (mehr Prüfungen je Chunk seit den Etappen 42–47). Die TRIAGE kommt als eigener Job dazu.
- Die erste Frage an alle Quellen nach einem großen Import ist langsamer (p95), weil der Suchindex dann neu aufgebaut wird.

## Bewertung und Empfehlungen

- Für einen Einzelplatz und kleine Teams reicht SQLite bis mindestens 2 000 Dokumente / 48 000 Chunks; Antworten mit Belegen kommen in unter einer Sekunde.
- **Gleichzeitige Fragen** sind rechenintensiv und laufen in einem Server-Prozess nacheinander. Ab etwa 10 gleichzeitig Fragenden mehrere Instanzen mit PostgreSQL betreiben (Helm-Chart, `JOB_WORKER=0` für reine API-Instanzen).
- **Bildarchiv und Deckungsmatrix** wachsen mit der Zahl der Textabschnitte (Verwendung je Bild wird im Text gesucht) – bei sehr großen Beständen ein Kandidat für einen Verwendungsindex.
- Lasttest mit PostgreSQL und echten Quellen (PowerPoint, PDF, Video) steht aus – dafür werden echte Beispieldateien gebraucht.
- Seit Etappe 47 läuft nach jedem Import die TRIAGE: Bei großen Importen ist der Bestand erst danach vollständig gelabelt (12 000 Chunks ≈ 7 s).

## Etappe 54 – Übersicht mit Zwischenspeicher

- Die teuren Zählungen der Übersicht (Dokumente, Chunks je Format, gelabelte Chunks) werden je Projekt höchstens 30 s zwischengespeichert und bei Import, Labeln, TRIAGE und Entfernen sofort verworfen (ADR-107). Wiederholte Aufrufe ohne Änderung kosten damit nur noch die günstigen Zählungen der Labelgruppen und Antworten.
