-- Etappe 30: Zuordnung Fachdomäne → Gliederungspunkt und Menüpunkt (ADR-082)
CREATE TABLE metadata_label_links (
  project_id TEXT NOT NULL REFERENCES projects(id),
  domain_label_id TEXT NOT NULL REFERENCES metadata_labels(id),
  target_label_id TEXT NOT NULL REFERENCES metadata_labels(id),   -- Label der Gruppe outline oder navigation
  origin TEXT NOT NULL,                                           -- catalog (Vorschlag des Katalogs) | manual
  active INTEGER NOT NULL DEFAULT 1,                              -- 0 = entfernt; Katalogvorschläge kommen dann nicht wieder
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (domain_label_id, target_label_id)
);
CREATE INDEX idx_metadata_label_links_project ON metadata_label_links (project_id);
