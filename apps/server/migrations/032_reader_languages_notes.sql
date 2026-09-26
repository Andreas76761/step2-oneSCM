-- Etappe 24: Glossar je Sprache (ADR-071) und Notizen an Lesezeichen (ADR-073)
-- Übersetzungen eines Begriffs: JSON { "en": { "term": "…", "definition": "…" }, … }
ALTER TABLE terminology_terms ADD COLUMN translations TEXT NOT NULL DEFAULT '{}';
ALTER TABLE reader_bookmarks ADD COLUMN note TEXT;
