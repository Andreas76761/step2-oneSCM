-- Etappe 7: Embeddings für semantische Suche und hybride Analyse (ADR-017).
CREATE TABLE snippet_embeddings (
  snippet_id TEXT NOT NULL REFERENCES text_snippets(id),
  model TEXT NOT NULL,                  -- z. B. local-hash-384 oder das Modell des Embedding-Dienstes
  dims INTEGER NOT NULL,
  vector TEXT NOT NULL,                 -- Float32 (little endian) als Base64, L2-normalisiert
  text_hash TEXT NOT NULL,              -- Textstand, zu dem der Vektor gehört
  created_at TEXT NOT NULL,
  PRIMARY KEY (snippet_id, model)
);
