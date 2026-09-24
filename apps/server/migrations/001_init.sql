-- oneSCM Handbook Studio – Initiales Schema (Etappe 1)
-- Dialektneutral gehalten (ADR-003): TEXT-IDs, ISO-Zeitstempel, JSON als TEXT.

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  permissions TEXT NOT NULL            -- JSON-Array technischer Berechtigungen (ADR-009)
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL                  -- JSON
);

-- Referenzdaten (US-003, US-004, US-010)
CREATE TABLE roles (
  code TEXT PRIMARY KEY, label TEXT NOT NULL, icon TEXT NOT NULL, color TEXT NOT NULL, description TEXT NOT NULL
);
CREATE TABLE divisions (
  code TEXT PRIMARY KEY, label TEXT NOT NULL, icon TEXT NOT NULL, color TEXT NOT NULL
);
CREATE TABLE markets (
  code TEXT PRIMARY KEY, label TEXT NOT NULL
);
CREATE TABLE release_scopes (
  code TEXT PRIMARY KEY, label TEXT NOT NULL
);

-- Import (US-001)
CREATE TABLE imports (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  file_name TEXT NOT NULL,
  kind TEXT NOT NULL,                  -- zip | md
  sha256 TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  status TEXT NOT NULL,                -- queued | processing | completed | completed_with_errors | failed
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  finished_at TEXT,
  stats TEXT NOT NULL DEFAULT '{}',
  error TEXT
);

CREATE TABLE source_documents (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (project_id, path)
);

CREATE TABLE source_revisions (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES source_documents(id),
  import_id TEXT NOT NULL REFERENCES imports(id),
  revision_no INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  front_matter TEXT NOT NULL DEFAULT '{}',
  is_current INTEGER NOT NULL DEFAULT 1,
  imported_at TEXT NOT NULL,
  UNIQUE (document_id, revision_no)
);

CREATE TABLE import_items (
  id TEXT PRIMARY KEY,
  import_id TEXT NOT NULL REFERENCES imports(id),
  path TEXT NOT NULL,
  sha256 TEXT,
  status TEXT NOT NULL,                -- imported | identical | failed | skipped
  message TEXT,
  revision_id TEXT REFERENCES source_revisions(id)
);

-- Struktur (US-002)
CREATE TABLE chapters (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  key TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE (project_id, key)
);

CREATE TABLE subchapters (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  key TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE (chapter_id, key)
);

CREATE TABLE text_snippets (
  id TEXT PRIMARY KEY,
  seq INTEGER NOT NULL UNIQUE,         -- kurze, lesbare Text-ID (#34)
  revision_id TEXT NOT NULL REFERENCES source_revisions(id),
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  subchapter_id TEXT REFERENCES subchapters(id),
  heading_path TEXT NOT NULL DEFAULT '[]',
  position INTEGER NOT NULL,
  line_start INTEGER NOT NULL,
  line_end INTEGER NOT NULL,
  kind TEXT NOT NULL,                  -- paragraph | list | ordered_list | table | code | quote
  text TEXT NOT NULL,                  -- unveränderlich (ADR-004)
  text_hash TEXT NOT NULL,
  norm_hash TEXT NOT NULL,
  evidence_status TEXT NOT NULL,       -- source_confirmed | manually_confirmed | unconfirmed | open_question
  market_code TEXT,
  release_code TEXT,
  scope_status TEXT NOT NULL DEFAULT 'unconfirmed',
  note TEXT,
  excluded_reason TEXT,                -- gesetzt durch Widerspruchsentscheidung (z. B. „A übernehmen“)
  created_at TEXT NOT NULL
);
CREATE INDEX idx_snippets_chapter ON text_snippets(chapter_id, subchapter_id);
CREATE INDEX idx_snippets_revision ON text_snippets(revision_id);
CREATE INDEX idx_snippets_norm_hash ON text_snippets(norm_hash);

-- m:n Klassifikation, unabhängig voneinander (Regel 3)
CREATE TABLE snippet_roles (
  snippet_id TEXT NOT NULL REFERENCES text_snippets(id),
  role_code TEXT NOT NULL REFERENCES roles(code),
  score REAL NOT NULL,
  method TEXT NOT NULL,
  model_version TEXT NOT NULL,
  evidence_status TEXT NOT NULL,
  evidence TEXT,
  PRIMARY KEY (snippet_id, role_code)
);
CREATE TABLE snippet_divisions (
  snippet_id TEXT NOT NULL REFERENCES text_snippets(id),
  division_code TEXT NOT NULL REFERENCES divisions(code),
  score REAL NOT NULL,
  method TEXT NOT NULL,
  model_version TEXT NOT NULL,
  evidence_status TEXT NOT NULL,
  evidence TEXT,
  PRIMARY KEY (snippet_id, division_code)
);

-- Analyse (US-005, US-006, US-007)
CREATE TABLE analysis_runs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  status TEXT NOT NULL,
  method TEXT NOT NULL,
  settings TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  stats TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE semantic_clusters (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  analysis_run_id TEXT REFERENCES analysis_runs(id),
  name TEXT NOT NULL,
  status TEXT NOT NULL,                -- proposed | confirmed | dissolved
  scope TEXT NOT NULL,                 -- intra_chapter | cross_chapter
  method TEXT NOT NULL,
  threshold REAL NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE cluster_members (
  cluster_id TEXT NOT NULL REFERENCES semantic_clusters(id),
  snippet_id TEXT NOT NULL REFERENCES text_snippets(id),
  score REAL NOT NULL,
  reason TEXT NOT NULL,
  PRIMARY KEY (cluster_id, snippet_id)
);

CREATE TABLE canonical_topics (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  cluster_id TEXT REFERENCES semantic_clusters(id),
  lead_chapter_id TEXT NOT NULL REFERENCES chapters(id),
  lead_snippet_id TEXT REFERENCES text_snippets(id),
  reason TEXT NOT NULL,
  decided_by TEXT NOT NULL,
  decided_at TEXT NOT NULL
);
CREATE TABLE canonical_topic_members (
  topic_id TEXT NOT NULL REFERENCES canonical_topics(id),
  snippet_id TEXT NOT NULL REFERENCES text_snippets(id),
  PRIMARY KEY (topic_id, snippet_id)
);

CREATE TABLE quality_findings (
  id TEXT PRIMARY KEY,
  seq INTEGER NOT NULL UNIQUE,
  project_id TEXT NOT NULL REFERENCES projects(id),
  analysis_run_id TEXT REFERENCES analysis_runs(id),
  type TEXT NOT NULL,                  -- gap | duplicate | contradiction | terminology | privacy | readability
  subtype TEXT NOT NULL,               -- Regelcode, z. B. negation, obligation, exact_hash
  severity TEXT NOT NULL,              -- blocker | high | medium | low
  status TEXT NOT NULL,                -- open | resolved | deferred | ignored
  chapter_id TEXT REFERENCES chapters(id),
  snippet_a_id TEXT REFERENCES text_snippets(id),
  snippet_b_id TEXT REFERENCES text_snippets(id),
  score REAL,
  method TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '{}',
  fingerprint TEXT NOT NULL,
  decision TEXT,
  decision_reason TEXT,
  decided_by TEXT,
  decided_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_findings_fp ON quality_findings(fingerprint);
CREATE INDEX idx_findings_chapter ON quality_findings(chapter_id, status);

-- Generierung und Kapitelwerkstatt (US-008, US-009)
CREATE TABLE generated_chapter_versions (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  version_no INTEGER NOT NULL,
  status TEXT NOT NULL,                -- draft | approved | superseded
  title TEXT NOT NULL,
  based_on_version_id TEXT REFERENCES generated_chapter_versions(id),
  generator TEXT NOT NULL,
  generated_by TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  approved_at TEXT,
  UNIQUE (chapter_id, version_no)
);

CREATE TABLE content_blocks (
  id TEXT PRIMARY KEY,
  chapter_version_id TEXT NOT NULL REFERENCES generated_chapter_versions(id),
  lineage_id TEXT NOT NULL,            -- stabil über Kapitelversionen hinweg
  section_code TEXT NOT NULL,
  position INTEGER NOT NULL,
  kind TEXT NOT NULL,                  -- paragraph | list | note | tip | warning | xref | gap
  text TEXT NOT NULL,
  mode TEXT NOT NULL,                  -- generated | manually_edited | locked | needs_regeneration | approved
  market_code TEXT,
  release_code TEXT,
  scope_status TEXT NOT NULL DEFAULT 'unconfirmed',  -- confirmed | general | unconfirmed
  justification TEXT,
  comment TEXT,
  version_no INTEGER NOT NULL,
  deleted_at TEXT,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_blocks_version ON content_blocks(chapter_version_id);

CREATE TABLE content_block_roles (
  block_id TEXT NOT NULL REFERENCES content_blocks(id),
  role_code TEXT NOT NULL REFERENCES roles(code),
  PRIMARY KEY (block_id, role_code)
);
CREATE TABLE content_block_divisions (
  block_id TEXT NOT NULL REFERENCES content_blocks(id),
  division_code TEXT NOT NULL REFERENCES divisions(code),
  PRIMARY KEY (block_id, division_code)
);
CREATE TABLE content_block_sources (
  block_id TEXT NOT NULL REFERENCES content_blocks(id),
  snippet_id TEXT NOT NULL REFERENCES text_snippets(id),
  PRIMARY KEY (block_id, snippet_id)
);

CREATE TABLE content_block_versions (
  id TEXT PRIMARY KEY,
  block_id TEXT NOT NULL REFERENCES content_blocks(id),
  version_no INTEGER NOT NULL,
  change_type TEXT NOT NULL,           -- created | edited | moved | deleted | restored | locked | unlocked | classified | approved
  snapshot TEXT NOT NULL,              -- JSON: text, mode, section, position, kind, roles, divisions, …
  author TEXT NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (block_id, version_no)
);

-- Freigabe (US-012)
CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  chapter_version_id TEXT NOT NULL REFERENCES generated_chapter_versions(id),
  approver TEXT NOT NULL,
  decision TEXT NOT NULL,
  comment TEXT NOT NULL,
  gate_result TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Export
CREATE TABLE exports (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  params TEXT NOT NULL,
  status TEXT NOT NULL,
  format TEXT NOT NULL,
  storage_key TEXT,
  file_name TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Audit (§13)
CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  at TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_audit_entity ON audit_events(entity_type, entity_id);

-- Traceability (US-020)
CREATE TABLE requirements (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, priority TEXT NOT NULL, status TEXT NOT NULL, id_status TEXT NOT NULL
);
CREATE TABLE test_cases (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, file TEXT NOT NULL, level TEXT NOT NULL
);
CREATE TABLE test_case_requirements (
  test_case_id TEXT NOT NULL REFERENCES test_cases(id), requirement_id TEXT NOT NULL REFERENCES requirements(id),
  PRIMARY KEY (test_case_id, requirement_id)
);
CREATE TABLE api_operations (
  id TEXT PRIMARY KEY, method TEXT NOT NULL, path TEXT NOT NULL, summary TEXT NOT NULL, is_extension INTEGER NOT NULL
);
CREATE TABLE api_operation_requirements (
  operation_id TEXT NOT NULL REFERENCES api_operations(id), requirement_id TEXT NOT NULL REFERENCES requirements(id),
  PRIMARY KEY (operation_id, requirement_id)
);
CREATE TABLE documentation_items (
  id TEXT PRIMARY KEY, path TEXT NOT NULL, requirement_id TEXT NOT NULL REFERENCES requirements(id)
);
