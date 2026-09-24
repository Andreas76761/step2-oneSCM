# Lasttest semantische Suche (ADR-024)

Gemessen am 24.09.2026 in der Entwicklungsumgebung (Container, Node 22, PostgreSQL 16 mit pgvector 0.6) mit

```bash
npm run perf:semantic -w apps/server -- 50000                                   # SQLite
DATABASE_URL=postgres://…/onescm_perf npm run perf:semantic -w apps/server -- 50000   # PostgreSQL
```

Das Skript importiert 50 000 Textabschnitte (2 000 Markdown-Dateien) über die normale Pipeline, berechnet die Vektoren mit dem lokalen Modell und misst 50 Suchanfragen über `semanticSearch` (inkl. Änderungserkennung und Laden der Treffer). **Recall@10** = Anteil der Treffer, deren Ähnlichkeit mindestens die zehntbeste der exakten Suche erreicht. HNSW-Suchliste bei diesen Läufen: `annEfSearch` = 800.

Zusätzlich ein reiner Indexvergleich mit **gruppierten Vektoren** (1 000 Themen), wie sie semantische Embedding-Modelle liefern: Dort ist die Graphsuche bereits mit kleiner Suchliste vollständig – daher der Standard `annEfSearch` = 200 und die Näherung im Modus `auto` nur für semantische Modelle.

## SQLite

- Import (2000 Dateien, ZIP 3.7 MB): 20.9 s, 50000 Textabschnitte
- Vektoren berechnen und speichern: 11.0 s

**Suche über die API-Schicht** (lokales Hash-Modell, 50 Anfragen, je 10 Treffer)

| Verfahren | erste Suche (inkl. Laden/Synchronisieren) | Vorbereitung | Antwortzeit p50 | p95 | Recall@10 |
|---|---|---|---|---|---|
| exakt (Speicher) | 1193 ms | – | 42.1 ms | 55.1 ms | 1.000 |
| HNSW (Speicher) | 65 ms | HNSW-Aufbau 101.9 s | 17.6 ms | 20.4 ms | 0.996 |

**Reiner Indexvergleich mit gruppierten Vektoren** (50000 Vektoren, 384 Dimensionen, 1000 Themen – Verteilung wie bei semantischen Modellen; 100 Anfragen)

| Verfahren | Aufbau | Antwortzeit je Anfrage | Recall@10 |
|---|---|---|---|
| exakt | – | 38.5 ms | 1.000 |
| HNSW (M=12, efConstruction=64, ef=100) | 92.0 s | 2.03 ms | 1.000 |
| HNSW (M=12, efConstruction=64, ef=400) | 92.0 s | 7.81 ms | 1.000 |
| HNSW (M=12, efConstruction=64, ef=800) | 92.0 s | 15.15 ms | 1.000 |

Speicher (RSS) 534 MB

## PostgreSQL mit pgvector

Messung läuft – Ergebnisse folgen.

