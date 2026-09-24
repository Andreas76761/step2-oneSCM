-- Etappe 10: Integrationen (ADR-028) – API-Tokens, ausgehende Webhooks, Push-Webhooks und Confluence-Cloud
CREATE TABLE api_tokens (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,       -- SHA-256 des vollständigen Tokens; Klartext wird nur bei der Erstellung gezeigt
  prefix TEXT NOT NULL,                  -- erste Zeichen zur Wiedererkennung
  scopes TEXT NOT NULL,                  -- JSON: Berechtigungen (read, edit, approve, admin), höchstens die der erstellenden Person
  expires_at TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_used_at TEXT,
  revoked_at TEXT,
  revoked_by TEXT
);
CREATE INDEX idx_api_tokens_project ON api_tokens (project_id, created_at);

CREATE TABLE webhook_subscriptions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  url TEXT NOT NULL,
  events TEXT NOT NULL,                  -- JSON: Ereignistypen oder ["*"]
  secret TEXT NOT NULL,                  -- HMAC-Schlüssel (nur bei Erstellung angezeigt)
  active INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_webhooks_project ON webhook_subscriptions (project_id);

CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL REFERENCES webhook_subscriptions(id),
  event TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL,                  -- pending | delivered | failed
  attempts INTEGER NOT NULL DEFAULT 0,
  response_code INTEGER,
  error TEXT,
  created_at TEXT NOT NULL,
  delivered_at TEXT
);
CREATE INDEX idx_webhook_deliveries_sub ON webhook_deliveries (subscription_id, created_at);

-- Quellverbindungen: Push-Webhook (Geheimnis je Verbindung) und Confluence Cloud (Bereich)
ALTER TABLE source_connections ADD COLUMN webhook_secret TEXT;
ALTER TABLE source_connections ADD COLUMN space_key TEXT;
