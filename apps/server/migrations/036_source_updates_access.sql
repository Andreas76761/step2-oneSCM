-- Etappe 29: Update-Eingang und Zugriffsmatrix (ADR-081, F-05, F-06)
CREATE TABLE source_update_decisions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  block_id TEXT NOT NULL REFERENCES content_blocks(id),
  old_snippet_id TEXT REFERENCES text_snippets(id),   -- veraltete Quelle des Absatzes (NULL bei neuem Abschnitt)
  new_snippet_id TEXT REFERENCES text_snippets(id),   -- Abschnitt der aktuellen Revision (NULL, wenn entfallen)
  action TEXT NOT NULL,                               -- replace | relink | append | remove | dismiss
  reason TEXT,
  decided_by TEXT NOT NULL,
  decided_at TEXT NOT NULL
);
CREATE INDEX idx_source_update_decisions_block ON source_update_decisions (project_id, block_id);

-- Zugriffsmatrix (ADR-081, F-06): Stufe je Rolle und Menüpunkt (Labels der Gruppen role und navigation)
CREATE TABLE access_matrix (
  project_id TEXT NOT NULL REFERENCES projects(id),
  role_label_id TEXT NOT NULL REFERENCES metadata_labels(id),
  nav_label_id TEXT NOT NULL REFERENCES metadata_labels(id),
  level TEXT NOT NULL,                  -- V (nutzt/bearbeitet) | L (liest) | - (kein Zugriff) | ? (offen)
  evidence TEXT,                        -- Beleg: Quelle, Fundstelle
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (role_label_id, nav_label_id)
);
CREATE INDEX idx_access_matrix_project ON access_matrix (project_id);
