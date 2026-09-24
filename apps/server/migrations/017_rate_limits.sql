-- Etappe 9: gemeinsame Rate-Limits über mehrere Instanzen (ADR-027, RATE_LIMIT_STORE=db)
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  window_no INTEGER NOT NULL,            -- Nummer des Zeitfensters (Zeit / Fensterlänge)
  count INTEGER NOT NULL
);
