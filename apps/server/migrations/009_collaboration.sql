-- Etappe 7: Kollaboration (ADR-019) – Kommentare und Aufgaben mit @Erwähnung, Benachrichtigungen.
ALTER TABLE users ADD COLUMN email TEXT;

CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  entity_type TEXT NOT NULL,            -- block (Lineage, bleibt über Kapitelversionen erhalten) | finding | chapter
  entity_id TEXT NOT NULL,
  parent_id TEXT REFERENCES comments(id),
  kind TEXT NOT NULL,                   -- comment | task
  body TEXT NOT NULL,
  mentions TEXT NOT NULL DEFAULT '[]',  -- JSON: erwähnte Benutzer
  assignee TEXT,                        -- nur Aufgaben
  due_date TEXT,
  status TEXT NOT NULL,                 -- open | done (Kommentare: open)
  author TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  done_by TEXT,
  done_at TEXT
);
CREATE INDEX idx_comments_entity ON comments (project_id, entity_type, entity_id, created_at);
CREATE INDEX idx_comments_assignee ON comments (project_id, assignee, status);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,                   -- mention | assigned | reply | task_done
  comment_id TEXT NOT NULL REFERENCES comments(id),
  text TEXT NOT NULL,
  link TEXT,                            -- Pfad in der Web-UI
  created_at TEXT NOT NULL,
  read_at TEXT,
  delivered TEXT NOT NULL DEFAULT '{}'  -- JSON: Zustellung je Kanal (webhook, email)
);
CREATE INDEX idx_notifications_user ON notifications (user_id, read_at, created_at);
