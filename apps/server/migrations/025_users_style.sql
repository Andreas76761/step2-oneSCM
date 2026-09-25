-- Etappe 16: eigene Stilregeln je Projekt (ADR-044) und Benutzerverwaltung (ADR-045)
ALTER TABLE projects ADD COLUMN style_rules TEXT;            -- JSON: disabled, phrases, address, maxSentenceWords

ALTER TABLE users ADD COLUMN disabled_at TEXT;               -- gesetzt = Anmeldung gesperrt
ALTER TABLE users ADD COLUMN disabled_by TEXT;
ALTER TABLE users ADD COLUMN created_at TEXT;
ALTER TABLE users ADD COLUMN created_by TEXT;
ALTER TABLE users ADD COLUMN origin TEXT;                    -- demo | local | oidc
