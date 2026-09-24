-- Etappe 8: mehrsprachige Releases (ADR-021). JSON: [{ language, translated, total, markdownKey }]
ALTER TABLE handbook_releases ADD COLUMN languages TEXT NOT NULL DEFAULT '[]';
