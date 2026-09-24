# ADR-024 Vektorindex der semantischen Suche

**Status:** akzeptiert, umgesetzt in Etappe 8

## Kontext
Bis Etappe 7 las jede semantische Suche alle aktuellen Abschnitte samt Text und Vektor aus der Datenbank und verglich vollständig (ADR-017). Bei 50 000 Abschnitten sind das je Anfrage rund 100 MB Base64-Vektoren; die hybride Analyse verglich paarweise (n²) und war auf 8 000 Abschnitte begrenzt.

## Entscheidung
- **`snippet_embeddings` bleibt die maßgebliche Quelle.** Darüber liegt ein austauschbarer Index (`services/vectorIndex.ts`), gewählt mit `VECTOR_INDEX`:
  - `exact` – Vektoren des Projekts als zusammenhängender `Float32Array` im Speicher, vollständiger Durchlauf mit Top-k-Auswahl.
  - `hnsw` – zusätzlich ein HNSW-Graph (eigene Implementierung ohne Abhängigkeiten, `domain/hnsw.ts`, M = 12, efConstruction = 64), im Hintergrund in kurzen Abschnitten aufgebaut; bis er vollständig ist, antwortet die exakte Suche. Identische Vektoren (Textbausteine) werden ein Graphknoten mit Aliasen – ohne das entstehen Plateaus, auf denen die Graphsuche hängen bleibt.
  - `pgvector` – PostgreSQL mit Erweiterung `vector`: Tabelle `snippet_vectors` und HNSW-Ausdrucksindex je Dimension (`(embedding::vector(d)) vector_ip_ops`), zur Laufzeit angelegt und aus `snippet_embeddings` nachgezogen. Kein Speicherbedarf je Instanz, geeignet für mehrere Instanzen. Filter (Projekt, aktueller Stand) greifen auf überabgefragte Kandidaten (`hnsw.ef_search`); liefert die Näherung zu wenig, wird exakt in SQL gesucht.
  - `auto` (Standard) – **näherungsweise** nur bei einem semantischen (externen) Embedding-Modell ab `semantic.annThreshold` Abschnitten (Standard 20 000): pgvector, wenn verfügbar, sonst HNSW im Speicher. Sonst – und mit dem lokalen Hash-Modell immer – exakt im Speicher.
  - Auch bei `hnsw`/`pgvector` wird erst ab `annThreshold` genähert: Kleine Bestände sind exakt schneller, und Graphindizes übersehen dort einzelne Ausreißer (pgvector 0.8.1 fand in T-147 den besten von 41 Treffern nicht).
- **Suchliste** `semantic.annEfSearch` (Standard 200) für Graph und pgvector; für nahezu gleichverteilte Vektoren (lokales Hash-Modell mit `VECTOR_INDEX=hnsw`) 800 wählen.
- **Änderungserkennung ohne Vollabfragen:** Ein Schlüssel aus indizierten Maxima (neueste Vektoren, Revisionen, Befundentscheidungen) entscheidet, ob Signatur und fehlende Vektoren neu geprüft werden. Im Normalfall kostet eine Suche nur Anfragevektor, Indexsuche und das Laden der Treffer.
- **Fehlende Vektoren:** bis 2 000 während der Suche, darüber im Index-Job (Antwort meldet `pending`).
- **Hybride Analyse großer Bestände:** über `maxPairDocs` je Abschnitt die 10 nächsten Nachbarn über HNSW statt n²-Vergleich (`approximate: true` in den Laufstatistiken).
- `snippet_vectors` ist abgeleitet: nicht Teil von Migrationen und Backup, jederzeit rekonstruierbar.

## Messung
Lasttest `npm run perf:semantic -w apps/server -- 50000`; Ergebnisse in [docs/lasttest-semantik.md](../lasttest-semantik.md).

Kurzfassung (50 000 Abschnitte, SQLite, Details im Lasttest):

| Verfahren | Antwortzeit p50 | Recall@10 |
|---|---|---|
| exakt (Speicher), lokales Modell | 42 ms | 1,000 |
| HNSW (Speicher), lokales Modell, ef = 800 | 18 ms | 0,996 |
| exakt, gruppierte Vektoren | 39 ms | 1,000 |
| HNSW, gruppierte Vektoren, ef = 100 | 2 ms | 1,000 |

Auf PostgreSQL: pgvector-HNSW-Index 29 ms (Recall 1,0); exakte Suche in pgvector ohne Index 276 ms – deshalb sucht `auto` ohne Näherung im Speicher (44 ms). Der HNSW-Aufbau im Speicher für 50 000 Vektoren dauert 90–100 s im Hintergrund. Vor Einführung der Duplikat-Aliase erreichte der Graph auf Daten mit vielen identischen Vektoren nur einen Recall von 0,44 (pgvector 1,0).

## Konsequenzen
- CI und docker-compose nutzen `pgvector/pgvector:pg16`; ohne Erweiterung oder ohne Recht, sie anzulegen, fällt der Server auf den Speicherindex zurück.
- Der Speicherindex belegt je Projekt und Modell `Anzahl × Dimensionen × 4` Byte (50 000 × 384: rund 77 MB) und wird nach einem Neustart beim ersten Zugriff geladen.
- Der HNSW-Graph lebt nur im Speicher und wird nach einem Neustart neu aufgebaut; für große Mehrinstanz-Installationen ist pgvector vorgesehen.
