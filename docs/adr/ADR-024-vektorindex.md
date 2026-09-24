# ADR-024 Vektorindex der semantischen Suche

**Status:** akzeptiert, umgesetzt in Etappe 8

## Kontext
Bis Etappe 7 las jede semantische Suche alle aktuellen Abschnitte samt Text und Vektor aus der Datenbank und verglich vollständig (ADR-017). Bei 50 000 Abschnitten sind das je Anfrage rund 100 MB Base64-Vektoren; die hybride Analyse verglich paarweise (n²) und war auf 8 000 Abschnitte begrenzt.

## Entscheidung
- **`snippet_embeddings` bleibt die maßgebliche Quelle.** Darüber liegt ein austauschbarer Index (`services/vectorIndex.ts`), gewählt mit `VECTOR_INDEX`:
  - `exact` – Vektoren des Projekts als zusammenhängender `Float32Array` im Speicher, vollständiger Durchlauf mit Top-k-Auswahl.
  - `hnsw` – zusätzlich ein HNSW-Graph (eigene Implementierung ohne Abhängigkeiten, `domain/hnsw.ts`, M = 12, efConstruction = 64), im Hintergrund in kurzen Abschnitten aufgebaut; bis er vollständig ist, antwortet die exakte Suche. Identische Vektoren (Textbausteine) werden ein Graphknoten mit Aliasen – ohne das entstehen Plateaus, auf denen die Graphsuche hängen bleibt.
  - `pgvector` – PostgreSQL mit Erweiterung `vector`: Tabelle `snippet_vectors` und HNSW-Ausdrucksindex je Dimension (`(embedding::vector(d)) vector_ip_ops`), zur Laufzeit angelegt und aus `snippet_embeddings` nachgezogen. Kein Speicherbedarf je Instanz, geeignet für mehrere Instanzen. Filter (Projekt, aktueller Stand) greifen auf überabgefragte Kandidaten (`hnsw.ef_search`); liefert die Näherung zu wenig, wird exakt in SQL gesucht.
  - `auto` (Standard) – pgvector, wenn verfügbar, sonst Speicherindex. **Näherungsweise** (HNSW-Graph bzw. -Index) nur bei einem semantischen (externen) Embedding-Modell ab `semantic.annThreshold` Abschnitten (Standard 20 000); mit dem lokalen Hash-Modell immer exakt.
- **Suchliste** `semantic.annEfSearch` (Standard 800) für Graph und pgvector.
- **Änderungserkennung ohne Vollabfragen:** Ein Schlüssel aus indizierten Maxima (neueste Vektoren, Revisionen, Befundentscheidungen) entscheidet, ob Signatur und fehlende Vektoren neu geprüft werden. Im Normalfall kostet eine Suche nur Anfragevektor, Indexsuche und das Laden der Treffer.
- **Fehlende Vektoren:** bis 2 000 während der Suche, darüber im Index-Job (Antwort meldet `pending`).
- **Hybride Analyse großer Bestände:** über `maxPairDocs` je Abschnitt die 10 nächsten Nachbarn über HNSW statt n²-Vergleich (`approximate: true` in den Laufstatistiken).
- `snippet_vectors` ist abgeleitet: nicht Teil von Migrationen und Backup, jederzeit rekonstruierbar.

## Messung
Lasttest `npm run perf:semantic -w apps/server -- 50000`; Ergebnisse in [docs/lasttest-semantik.md](../lasttest-semantik.md).

MESSUNG

## Konsequenzen
- CI und docker-compose nutzen `pgvector/pgvector:pg16`; ohne Erweiterung oder ohne Recht, sie anzulegen, fällt der Server auf den Speicherindex zurück.
- Der Speicherindex belegt je Projekt und Modell `Anzahl × Dimensionen × 4` Byte (50 000 × 384: rund 77 MB) und wird nach einem Neustart beim ersten Zugriff geladen.
- Der HNSW-Graph lebt nur im Speicher und wird nach einem Neustart neu aufgebaut; für große Mehrinstanz-Installationen ist pgvector vorgesehen.
