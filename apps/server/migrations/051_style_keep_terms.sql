-- Etappe 44: Begriff nicht übersetzen („Fix-Sprache“, S-04, ADR-097) – der bevorzugte Begriff steht in jeder Sprache
-- unverändert (z. B. UI-Begriffe wie „MO Checks“), KI-Übersetzung und Übersetzungsprüfung beachten das
ALTER TABLE terminology_terms ADD COLUMN keep_untranslated INTEGER NOT NULL DEFAULT 0;
