-- Etappe 8: Analytik (ADR-023) – tägliche Kennzahlen je Projekt (Zustandsgrößen; Flussgrößen aus Zeitstempeln)
CREATE TABLE kpi_snapshots (
  project_id TEXT NOT NULL REFERENCES projects(id),
  day TEXT NOT NULL,                     -- YYYY-MM-DD (UTC)
  metrics TEXT NOT NULL,                 -- JSON, siehe services/analytics.ts
  updated_at TEXT NOT NULL,
  PRIMARY KEY (project_id, day)
);
