-- Etappe 47: Agent TRIAGE (Pflichtlabels und Kapitelzuordnung nach dem Einlesen), Detaillevel je Kapitel,
-- Agenten in der App (Aufgaben, Entscheidungen), Ziel-Abgleich GOAL und Orchestrator (ADR-100)

-- Herkunft einer Label-Zuordnung: manual (Mensch) oder triage (Agent) – TRIAGE ersetzt nur eigene Zuordnungen
ALTER TABLE metadata_chunk_labels ADD COLUMN origin TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE metadata_chunk_labels ADD COLUMN confidence REAL;

-- Detaillevel je Kapitel: welche Level der Generator übernimmt (JSON-Liste der Codes, NULL = Standard)
ALTER TABLE chapters ADD COLUMN detail_levels TEXT;
-- vom Agenten TRIAGE angelegte Unterkapitel tragen die Kennung „neu“, bis ein Mensch sie bestätigt
ALTER TABLE subchapters ADD COLUMN triage_new INTEGER NOT NULL DEFAULT 0;
ALTER TABLE subchapters ADD COLUMN triage_created_at TEXT;

CREATE TABLE triage_runs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  scope TEXT NOT NULL,                    -- all | missing (ohne Pflichtlabels) | import:<id>
  status TEXT NOT NULL,                   -- running | finished | failed
  stats TEXT NOT NULL DEFAULT '{}',       -- JSON: chunks, labels, moved, newSubchapters, review, …
  started_by TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT
);
CREATE INDEX idx_triage_runs_project ON triage_runs (project_id, started_at);

-- Vorschlag je Chunk: Kapitel/Unterkapitel (vorher → nachher) und Begründung; Labels werden direkt gesetzt
CREATE TABLE triage_results (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES triage_runs(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  snippet_id TEXT NOT NULL,
  labels TEXT NOT NULL DEFAULT '[]',      -- JSON: [{ group, code, confidence, reason }]
  chapter_before TEXT,
  subchapter_before TEXT,
  chapter_id TEXT,
  subchapter_id TEXT,
  new_subchapter_title TEXT,              -- Vorschlag „neu“: Unterkapitel wird beim Übernehmen angelegt
  placement TEXT NOT NULL,                -- kept | move | new_subchapter | unassigned
  confidence REAL NOT NULL,
  review INTEGER NOT NULL DEFAULT 0,      -- zu prüfen
  reasons TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL,                   -- applied (nur Labels) | proposed | accepted | rejected
  decided_by TEXT,
  decided_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_triage_results_run ON triage_results (run_id, status);
CREATE INDEX idx_triage_results_snippet ON triage_results (project_id, snippet_id);

-- Agenten in der App: Aufgaben (offene Todos) und Entscheidungen; Schlüssel `key` verhindert Doppelungen beim Planen
CREATE TABLE agent_tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  agent TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  status TEXT NOT NULL,                   -- open | in_progress | done | dropped
  priority INTEGER NOT NULL DEFAULT 2,    -- 1 hoch, 2 mittel, 3 niedrig
  source TEXT NOT NULL,                   -- manual | orchestrator | goal | triage
  task_key TEXT,
  link TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  done_at TEXT
);
CREATE INDEX idx_agent_tasks_project ON agent_tasks (project_id, status, priority);
CREATE UNIQUE INDEX idx_agent_tasks_key ON agent_tasks (project_id, task_key) WHERE task_key IS NOT NULL;

CREATE TABLE agent_decisions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  agent TEXT NOT NULL,
  question TEXT NOT NULL,
  context TEXT,
  options TEXT NOT NULL DEFAULT '[]',     -- JSON-Liste der Antwortmöglichkeiten
  status TEXT NOT NULL,                   -- open | decided | dropped
  decision TEXT,
  note TEXT,
  decision_key TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  decided_by TEXT,
  decided_at TEXT,
  executed_at TEXT                        -- vom Orchestrator ausgeführt (z. B. alle Vorschläge übernommen)
);
CREATE INDEX idx_agent_decisions_project ON agent_decisions (project_id, status);
CREATE INDEX idx_agent_decisions_key ON agent_decisions (project_id, decision_key);

-- GOAL: Zielbild und Kriterien je Projekt, Abgleich mit Ergebnis und Empfehlungen
CREATE TABLE agent_goals (
  project_id TEXT PRIMARY KEY REFERENCES projects(id),
  goal TEXT NOT NULL,
  criteria TEXT NOT NULL,                 -- JSON: [{ code, target, enabled }]
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE goal_runs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  results TEXT NOT NULL,                  -- JSON: [{ code, title, value, target, ok, recommendation, agent }]
  score REAL NOT NULL,                    -- Anteil erfüllter Kriterien
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_goal_runs_project ON goal_runs (project_id, created_at);
