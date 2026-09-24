# 5. Datenmodell

Migrationen: `apps/server/migrations/001_init.sql`, `002_jobs_and_ordering.sql` (dialektneutral für SQLite und PostgreSQL, ADR-003).

## Entitäten aus Masterprompt §9 → Tabellen

| Entität | Tabelle(n) | Bemerkung |
|---|---|---|
| Project | `projects` | Etappe 1: ein Standardprojekt `p_default` |
| SourceDocument | `source_documents` | eindeutig je Projekt + Pfad |
| SourceRevision | `source_revisions` | SHA-256, `revision_no`, `is_current`, Front-Matter; Original im Object-Store (`storage_key`) |
| – | `imports`, `import_items` | Importlauf und Protokoll je Datei (`imported`/`identical`/`failed`/`skipped`), Reihenfolge über `position` |
| – | `jobs` | persistente Jobqueue: Typ, Payload, Status, Versuche, `run_after`, Lease (ADR-008) |
| – | `users` | Demo-Benutzer bzw. OIDC-Identitäten (`oidc:<sub>`) mit technischen Berechtigungen (ADR-009, ADR-011) |
| Chapter / Subchapter | `chapters`, `subchapters` | Identität über normalisierten Titel ohne Nummerierung (E-02) |
| TextSnippet | `text_snippets` | **unveränderlicher** Text, Position, Zeilen, `heading_path` (H3–H6), Hashes, Evidenzstatus, Markt, Release |
| Role / Division | `roles`, `divisions` | Referenzdaten mit Icon, Label, Farbe |
| – | `snippet_roles`, `snippet_divisions` | **unabhängige m:n-Beziehungen** mit Score, Methode, Modellversion, Evidenzstatus |
| Market / ReleaseScope | `markets`, `release_scopes` | werden beim Import/bei Bestätigung angelegt |
| SemanticCluster / ClusterMember | `semantic_clusters`, `cluster_members` | Status `proposed`/`confirmed`/`dissolved`, Score + Begründung je Mitglied |
| CanonicalTopic | `canonical_topics`, `canonical_topic_members` | führendes Kapitel, Begründung, Entscheider |
| QualityFinding | `quality_findings` | Typ, Untertyp (Regel), Schwere, Status, Score, Methode, Begründung, Entscheidung (+ Begründung, Entscheider, Zeit), `fingerprint` für stabile Wiedererkennung |
| – | `analysis_runs` | Analyselauf mit verwendeten Einstellungen |
| GeneratedChapterVersion | `generated_chapter_versions` | `draft`/`approved`/`superseded`; `approved` ist unveränderlich |
| ContentBlock | `content_blocks` | `lineage_id` verbindet Blöcke über Kapitelversionen, Modus, Soft-Delete |
| – | `content_block_roles`, `content_block_divisions`, `content_block_sources` | m:n Rollen, Sparten und **Quellenbeziehung je Absatz** |
| ContentBlockVersion | `content_block_versions` | append-only Snapshot je Änderung (Vergleich/Wiederherstellung) |
| Approval | `approvals` | Freigeber, Entscheidung, Kommentar, Gate-Ergebnis |
| AuditEvent | `audit_events` | jede Änderung, Entscheidung, Freigabe |
| Requirement / TestCase / ApiOperation / DocumentationItem | `requirements`, `test_cases`, `api_operations`, `documentation_items` (+ Verknüpfungen) | Schema vorhanden; Etappe 1 liest die Quellen direkt aus `traceability/*.json` und OpenAPI (ADR-010) |

## Zentrale Regeln → Umsetzung

| Regel (§9) | Umsetzung |
|---|---|
| 1. Ursprungstexte unveränderlich | Object-Store schreibt nie über (`wx`), keine API ändert `text_snippets.text`, neue Datei-Version = neue Revision |
| 2. Redaktion an versionierten Content Blocks | `content_block_versions` bei jeder Änderung |
| 3. Rollen und Sparten unabhängige m:n | getrennte Tabellen für Snippets und Blöcke |
| 4. Veröffentlichte Versionen unveränderlich | 409 bei jeder Änderung an Blöcken einer nicht-`draft`-Version |
| 5. Evidenz oder Begründung je Absatz | Qualitätsgate-Prüfung `evidence_per_block` |
| 6. Klassifikation mit Modell, Version, Score, Bestätigung | Spalten in `snippet_roles`/`snippet_divisions` |
| 7. Canonical Topics verhindern Wiederholungen | Generator ersetzt Nicht-Leitkapitel-Inhalte durch Querverweise |
