# ADR-017 Semantische Suche und hybride Analyse mit Embeddings

**Status:** akzeptiert, umgesetzt in Etappe 7 (Umfang vom Auftraggeber am 24.09.2026 festgelegt)

## Kontext
Die Qualitätsanalyse nutzt TF-IDF (Entscheidung E-05). Sie erkennt keine Umschreibungen ohne gemeinsame Begriffe, und die Textsuche findet nur Zeichenfolgen. Der Lasttest (ADR-015) zeigte zudem, dass die Analyse bei großen Beständen überproportional wächst.

## Entscheidung
- **Embedding-Anbieter** (`apps/server/src/embeddings.ts`), austauschbar über `EMBEDDINGS_PROVIDER`:
  - `local` (Standard, ohne Netzwerk): Merkmals-Hashing über Wortstämme und Zeichen-Trigramme in 384 Dimensionen. Erkennt Flexion und Komposita, aber keine Synonyme.
  - `openai`: jeder OpenAI-kompatible `/embeddings`-Endpunkt (OpenAI, Azure OpenAI, Voyage AI, Ollama, vLLM) über `EMBEDDINGS_MODEL`, `EMBEDDINGS_BASE_URL`, `EMBEDDINGS_API_KEY`. Erkennt echte semantische Nähe; Texte verlassen die Umgebung (erlaubt nach E-16a).
- **Vektorindex** in der Datenbank (`snippet_embeddings`, Float32 als Base64, L2-normalisiert, je Modell), inkrementell über den Text-Hash; Aufbau bei Bedarf oder als Hintergrundjob. Unabhängig vom Dialekt – kein pgvector erforderlich; die Suche vergleicht im Speicher (bis zu einigen zehntausend Abschnitten ausreichend schnell).
- **Semantische Suche** `GET /search/semantic` (Seite „Quellen“), optional je Kapitel.
- **Hybride Analyse** als Option (`semantic.analysisMethod = hybrid`): TF-IDF-Paare plus Embedding-Paare ab `semantic.embeddingThreshold`; vollständiger Paarvergleich bis `semantic.maxPairDocs` Abschnitte. **Standard bleibt TF-IDF** (E-05 unverändert).
- **Datenschutz:** Abschnitte mit offenem Datenschutzbefund oder erkennbaren personenbezogenen Mustern werden nie an einen externen Embedding-Dienst übertragen (außer der Befund wurde bewusst entschieden).

## Konsequenzen
- Mit dem lokalen Anbieter ist die Suche robuster als Volltext, aber nicht „verständnisbasiert“; die volle Wirkung entsteht mit einem semantischen Modell.
- Für sehr große Bestände (> 50 000 Abschnitte) ist ein ANN-Index (z. B. pgvector/HNSW) der nächste Schritt; die Schnittstelle erlaubt den Austausch.
