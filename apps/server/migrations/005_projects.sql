-- Etappe 6: Mandanten/Projekte (ADR-014). Mehrere Handbuch-Projekte, Mitgliedschaften mit Berechtigungen je Projekt.

-- open = alle angemeldeten Benutzer mit ihren globalen Berechtigungen; restricted = nur Mitglieder (und Administration)
ALTER TABLE projects ADD COLUMN visibility TEXT NOT NULL DEFAULT 'open';
ALTER TABLE projects ADD COLUMN description TEXT;
ALTER TABLE projects ADD COLUMN created_by TEXT;
ALTER TABLE projects ADD COLUMN archived_at TEXT;

CREATE TABLE project_members (
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL,                -- Demo-Benutzer oder OIDC-Identität (oidc:<sub>)
  permissions TEXT NOT NULL,            -- JSON-Array technischer Berechtigungen in diesem Projekt
  added_by TEXT NOT NULL,
  added_at TEXT NOT NULL,
  PRIMARY KEY (project_id, user_id)
);

-- Audit je Projekt (NULL = systemweit, z. B. Einstellungen)
ALTER TABLE audit_events ADD COLUMN project_id TEXT;
UPDATE audit_events SET project_id = 'p_default';
CREATE INDEX idx_audit_project ON audit_events (project_id, at);
