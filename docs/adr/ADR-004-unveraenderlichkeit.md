# ADR-004 Unveränderliche Ursprungstexte und append-only Versionierung

**Status:** akzeptiert

## Entscheidung
1. Die Originaldatei wird content-addressed (SHA-256) im Object-Store abgelegt und nie überschrieben.
2. `source_revisions` und `text_snippets.text` werden nach dem Import nicht mehr geändert (die API bietet keine Operation dafür; `PATCH /snippets` ändert nur Klassifikation/Evidenzstatus).
3. Redaktionelle Änderungen erfolgen an `content_blocks`; jede Änderung erzeugt einen Datensatz in `content_block_versions` (append-only). Löschen ist Soft-Delete mit Version.
4. Eine freigegebene Kapitelversion (`status = approved`) ist unveränderlich; Änderungen verlangen eine neue Version (409 sonst).
5. Alle Änderungen, Entscheidungen und Freigaben erzeugen `audit_events`.
