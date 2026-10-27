-- Etappe 98 (zweites Code-Review der Etappen 2–10): Ein Push-Webhook während eines laufenden Abgleichs ging verloren.
-- Er wird jetzt vorgemerkt; nach Abschluss des laufenden Abgleichs startet ein weiterer.
ALTER TABLE source_connections ADD COLUMN resync_requested INTEGER NOT NULL DEFAULT 0;
