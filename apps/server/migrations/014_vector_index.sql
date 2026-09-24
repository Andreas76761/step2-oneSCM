-- Etappe 8: Vektorindex (ADR-024) – günstige Änderungserkennung für den Suchindex im Speicher
CREATE INDEX idx_embeddings_model_created ON snippet_embeddings (model, created_at);
CREATE INDEX idx_findings_project_decided ON quality_findings (project_id, decided_at);
