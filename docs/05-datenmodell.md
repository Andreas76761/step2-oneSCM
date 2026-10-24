# 5. Datenmodell

Migrationen: `apps/server/migrations/001_init.sql`, `002_jobs_and_ordering.sql`, `003_workflow_terminology.sql`, `004_rewrite.sql`, `005_projects.sql`, `006_rewrite_batches.sql`, `007_embeddings.sql`, `008_releases.sql`, `009_collaboration.sql`, `010_translations.sql` (dialektneutral für SQLite und PostgreSQL, ADR-003).

## Entitäten aus Masterprompt §9 → Tabellen

| Entität | Tabelle(n) | Bemerkung |
|---|---|---|
| Project | `projects` | Standardprojekt `p_default`; seit Etappe 6 beliebig viele Projekte mit `visibility` (`open`/`restricted`), Beschreibung, Archivierung (ADR-014) |
| – | `project_members` | Mitgliedschaft je Projekt und Benutzer mit technischen Berechtigungen (ADR-014) |
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
| GeneratedChapterVersion | `generated_chapter_versions` | `draft` → `in_review` (gesperrt, `submitted_by/at`, Kommentar) → `approved`/zurück zu `draft`; `superseded`; `approved` ist unveränderlich |
| ContentBlock | `content_blocks` | `lineage_id` verbindet Blöcke über Kapitelversionen, Modus, Soft-Delete; `sentence_sources` = Satz-Evidenz KI-umformulierter Absätze (JSON) |
| – | `content_block_roles`, `content_block_divisions`, `content_block_sources` | m:n Rollen, Sparten und **Quellenbeziehung je Absatz** |
| ContentBlockVersion | `content_block_versions` | append-only Snapshot je Änderung (Vergleich/Wiederherstellung) |
| – | `snippet_embeddings` | Vektor je Textabschnitt und Modell (Base64, normalisiert), Text-Hash für inkrementelle Aktualisierung (ADR-017) |
| – | `handbook_releases` | Handbuch-Version: Kapitel-Snapshot, Änderungen zur Vorversion, Online-Hilfe und Markdown im Object-Store (ADR-018); `languages` = Sprachfassungen mit Abdeckung und Markdown-Schlüssel (ADR-021) |
| – | `source_connections` | Git-Quellverbindung: URL, Branch, Unterordner, Name der Token-Variable, Intervall, Planungstoken, letzter erfolgreich importierter Commit, Commit des laufenden Imports, letzter Import/Fehler (ADR-022); `source_revisions.source_format`/`original_key` für umgewandelte HTML-/Word-Quellen |
| – | `kpi_snapshots` | Kennzahlen je Projekt und Tag (JSON) für Zeitreihen (ADR-023) |
| – | `snippet_vectors` | nur PostgreSQL mit pgvector, zur Laufzeit angelegt: Vektor als `vector` mit HNSW-Index je Dimension; abgeleitet aus `snippet_embeddings`, nicht im Backup (ADR-024) |
| – | `comments`, `notifications` | Diskussionen/Aufgaben an Absatz-Lineage, Befund oder Kapitel; Benachrichtigungen mit Zustellstatus je Kanal (ADR-019) |
| – | `translations`, `translation_blocks` | Übersetzung einer freigegebenen Kapitelversion je Sprache; Absätze mit Satz-Zuordnung, Prüfbefunden, Modus (ADR-020) |
| – | `rewrite_batches` | KI-Umformulierung ganzer Kapitel: Status, Fortschritt (gültig/ungültig/übersprungen/Fehler), Tokens, Abbruch; Vorschläge verweisen über `batch_id` darauf |
| – | `rewrite_proposals` | KI-Umformulierungsvorschläge: Blockversion, Anbieter, Modell, Prompt-Hash, übertragene Textabschnitte, Sätze mit Prüfergebnis, Status `proposed`/`invalid`/`accepted`/`rejected`/`stale` (ADR-013) |
| – | `terminology_terms` | Terminologie: bevorzugter Begriff, zu vermeidende Varianten (JSON), Definition, `active`/`retired` (US-015) |
| Approval | `approvals` | Freigeber, Entscheidung, Kommentar, Gate-Ergebnis; `stage` und `final` bei mehrstufiger Freigabe (ADR-025) |
| – | `projects.approval_workflow`, `generated_chapter_versions.workflow/current_stage/stage_*` | Freigabeworkflow je Projekt und Schnappschuss/Stand je Einreichung (ADR-025) |
| – | `passage_embeddings`, `assistant_log` | Vektoren freigegebener Passagen je Text-Hash; Fragen, Antworten, Quellen, Bewertungen (ADR-026) |
| – | `rate_limits` | Zähler je Schlüssel und Zeitfenster bei `RATE_LIMIT_STORE=db` (ADR-027) |
| – | `api_tokens` | API-Tokens je Projekt: SHA-256, Präfix, Scopes, Ablauf, Widerruf, letzte Nutzung (ADR-028) |
| – | `webhook_subscriptions`, `webhook_deliveries` | Webhook-Abos (Ziel, Ereignisse, Geheimnis) und Zustellprotokoll (Status, Versuche, Antwortcode) (ADR-028); `source_connections` um `kind` (git/confluence), `space_key`, `webhook_secret` erweitert |
| – | `media_assets` | Bilder je Projekt, inhaltsadressiert (`media/<sha256>`), Format, Abmessungen, Herkunft (ADR-029) |
| – | `outlines`, `outline_nodes` | Gliederungen je Variante (Rollen, Sparten, Blueprint/Märkte), Versionen über `family_id`/`version_no`, Kapitel und Unterkapitel (ADR-032); `projects.markets` |
| – | `outline_assignments` | Zuordnung Textschnipsel → Gliederungseintrag mit Reihenfolge (Draft Manual, ADR-033) |
| – | `plan_items` | Redaktionsplanung je Gliederungseintrag: Verantwortliche, Termin, Status, Notiz; `reminded_at` für die einmalige Erinnerung je Termin (ADR-036) |
| – | Migration `031_reader_links_bookmarks` | `chapter_links` („Siehe auch“: `manual` mit Reihenfolge, `hidden` = ausgeblendeter Vorschlag, ADR-069); `reader_bookmarks` (Lesezeichen je Person); `reader_visits` (gelesene Fassung je Person und Kapitel, `visited_at`, `first_visited_at`, ADR-070) |
| – | Migration `032_reader_languages_notes` | `terminology_terms.translations` (JSON: Sprache → Begriff und Definition fürs Glossar beim Lesen, ADR-071); `reader_bookmarks.note` (private Notiz, höchstens 500 Zeichen, ADR-073) |
| – | Migration `033_translation_requests` | `translation_requests` (Übersetzungswunsch je Projekt, Kapitel, Sprache und Person; Stand wird aus `translations` berechnet, ADR-075); `translation_request_notices` (Hinweis an die Redaktion je Kapitel und Sprache genau einmal) |
| – | Migration `034_faq_translations` | `faq_translations` (Übersetzung je deutschem FAQ-Eintrag und Sprache: Frage, Antwort, `draft`/`approved`, `manual`/`machine`, `source_hash` für veraltet, Prüfbefunde, ADR-077) |
| – | Migration `036_source_updates_access` | `source_update_decisions` (Entscheidung je Absatz und veralteter bzw. neuer Quelle: replace, relink, append, remove, dismiss), `access_matrix` (Stufe V/L/–/? und Beleg je Rollen- und Navigations-Label, ADR-081) |
| – | Migration `037_domain_map` | `metadata_label_links` (Domänen-Label → Gliederungs- oder Navigations-Label, Herkunft catalog/manual, active; ADR-082) |
| – | Migration `038_release_letters` | `release_letters` (Titel, Release, Tickets, Sprache, Zielgruppe, Markt, Sparte, Herkunft generated/external, Markdown, Status draft/approved, letztes Urteil; ADR-083) |
| – | Migration `039_knowledge_notes` | `knowledge_notes` (Frage, Erkenntnis, Rollen, Sparten, bestätigt, Screenshot, Pfad der Quelle, Status), `duplicate_targets` (Dopplung → Gliederungs-Label, Notiz; ADR-084) |
| – | Migration `040_image_archive` | `media_meta` (Bildnummer, Sprache, Rollen, Sparten, Märkte, Release, Reiter, Platzhalter je erstem Bild), `media_versions` (Fassungen je Bild), `chapter_transitions` (Übergangstext und Folgekapitel; ADR-085) |
| – | Migration `041_slides_pages` | `media_context` (Bild aus Folie: Quelldatei, Folie, Folientitel, Gliederungs-Vorschläge), `media_meta.outline_label_id` (übernommene Gliederungsstelle); `text_snippets.locator` wird für PPTX, PDF, HTML und Word gefüllt (ADR-086) |
| – | Migration `042_section_duplicates` | `metadata_sections` (Abschnitt je Datei: Überschrift, Fundstelle, Format, Chunks, normalisierter Text und Hash), `metadata_duplicates` (Paar, Ähnlichkeit, exakt/ähnlich, formatübergreifend), `metadata_duplicate_decisions` (Entscheidung je Inhaltspaar; ADR-088) |
| – | Migration `043_metadata_ask` | `metadata_ask_log` (Frage, Rahmen, Antwortart, Antwort, Belege), `metadata_qa.filters` und `metadata_qa.ask_id` (Rahmen für „erneut fragen“; ADR-089) |
| – | Migration `044_question_catalog` | `metadata_question_sets` (Fragenkatalog: Name, Datei), `metadata_question_items` (Kapitel, Frage, Status, Antwort, Belege, übernommene Frage & Antwort; ADR-089) |
| – | Migration `045_media_tools` | gespeicherte Importeinstellungen: Formatliste um `.mp4`, `.vtt`, `.srt` ergänzt; Fundstelle `text_snippets.locator` auch `{ "time": "mm:ss" }` (ADR-090) |
| – | Migration `046_answer_quality` | `metadata_eval_sets` (Testfragensatz), `metadata_eval_items` (Frage, erwartete Quellen, Stichworte, Lückenfrage), `metadata_eval_runs` (Kennzahlen, Suchparameter, Modelle), `metadata_eval_results` (Rang, Beleg, Stichworte, Antwort, gefundene Stellen je Frage; ADR-091) |
| – | Migration `047_points_surveys` | `projects.guidance_levels` (Abweichungen Muss/Soll), `projects.guidance_require_must`; `metadata_surveys` (Titel, Zielgruppe, Optionen, Herkunft, Status), `metadata_survey_items` (Frage, Hintergrund, Optionen, Auswahl, Freitext, beantwortet von, übernommene Frage & Antwort; ADR-092) |
| – | Migration `048_variants_clickpaths` | `media_meta.variant_group` (Variantengruppe einer Maske), `media_clickpaths` (Titel, Stationen mit parallelen Wegen, Stationen je Zeile, erzeugtes Bild im Archiv; ADR-093) |
| – | Migration `049_image_redaction_labels` | `media_redactions` (je Fassung: Stellen relativ mit Art und maskiertem Treffer, Schalter, verpixelte Kopie, Stand der Texterkennung), `media_labels` (mehrere Labels je Bild, bisherige Gliederungspunkte übernommen), `media_chapters` (mehrere Kapitel je Bild; ADR-095) |
| – | Migration `050_chapter_instructions_history` | `chapters`/`subchapters`: Kapitelanweisung (`instruction`, `instruction_topics`, `instruction_excluded`), `valid_from`, `valid_until`, `replaced_by`, `history_at`; `metadata_labels`: `valid_from`, `valid_until`, `replaced_by`, `history_at`; `structure_history` (abgelöste Funktionen mit Nachfolger; ADR-096) |
| – | Etappe 46 (keine Migration) | Suche v2 (ADR-099) liest `text_snippets`, `terminology_terms` (bevorzugt, zu vermeiden, Übersetzungen) und `abbreviations`; Index im Speicher. Prüfläufe speichern das Verfahren und RRF-k, Mindestabdeckung und MMR-λ in `metadata_eval_runs.config`, nDCG@6 in `metadata_eval_runs.metrics` |
| – | Migration `052_work_areas` | `work_items` (Pipeline, Backlog, Intern: Bereich, Thema, Herkunft jira/manual, Ticket, Jira-Status/-Typ, Stream, Erstelldatum, Produktionsdatum und letzter Jira-Wert, Kapitel/Unterkapitel mit Herkunft der Zuordnung, Vorab-Dokumentation, Zustand open/documented/ready/live/cancelled, Import der Übernahme; ein Eintrag je Ticket und Projekt; ADR-098) |
| – | Migration `053_triage_agents` | `metadata_chunk_labels.origin` (manual/triage) und `.confidence`; `chapters.detail_levels` (Detaillierung je Kapitel); `subchapters.triage_new`, `.triage_created_at` (Kennung „neu“); `triage_runs` (Lauf, Umfang, Kennzahlen), `triage_results` (je Chunk: Labels mit Sicherheit, Kapitel vorher/nachher, neues Unterkapitel, Art, zu prüfen, Begründung, Status); `agent_tasks` (Agent, Aufgabe, Status, Priorität, Herkunft, Schlüssel), `agent_decisions` (Frage, Möglichkeiten, Entscheidung, ausgeführt), `agent_goals` (Ziel, Kriterien), `goal_runs` (Ergebnis je Kriterium, Anteil erfüllt; ADR-100) |
| – | Migration `054_translation_workflow` | `translation_memory` (Sprachpaar, Quelltext normalisiert, Übersetzung, Herkunft, Datei, Ausgangsversion, Status freigegeben/zu prüfen, Nutzung); `translation_blocks.tm_id`, `.tm_score` (Modus memory/imported); `translation_reviews` (Prüferin bzw. Prüfer, Markt, Status, MQM-Fehler, Wörter, Kommentar); `translation_backchecks` (Stichprobe der Rückübersetzung); `release_letters.translation_of`, `.translation_issues` (ADR-101) |
| – | Migration `055_tone_tickets_comparison` | `ticket_classifications` (Projekt, Ticketschlüssel, Einstufung approved/review/internal/background, Notiz, gesetzt von, am); `release_letters.comparison` (JSON: verglichene Releases, Anzahl Kapitel, Bilder, neue und abgelöste Funktionen, Tickets). Die Tonalität steht in `projects.style_rules.tone` (Ton je Produktart und Rolle), Zukunfts-Inhalte nutzen `chapters.valid_from` (ADR-102) |
| – | Migration `056_language_errors` | `language_errors` (Nr F-0001 je Projekt, Funddatum, Fundstelle, Kapitel/Version/Absatz, Fehler, Korrektur, Kategorie laut FEHLERLISTE.md, Regel, Status offen/korrigiert/abgelehnt/Regel fehlt, Begründung, Herkunft check/manual/import, Fingerabdruck der Fundstelle) (ADR-103) |
| – | Migration `057_revision_proposals` | `revision_batches` (Herkunft word/ai, Datei, Exportkennung der Prüffassung, Kennzahlen) und `revision_proposals` (Kapitel, verglichene Version, Lineage des Absatzes, Abschnitt, Änderung geändert/neu/entfällt, Text beim Einlesen, Vorschlag, Kriterium „Fertig, wenn“, Status offen/übernommen/verworfen/veraltet, interner Kommentar, Entwurf der Übernahme) (ADR-104) |
| – | Migration `058_profile_reviews` | `profile_reviews` (Kapitel, Kapitelversion, Profil fachlich/Redaktion/Compliance/Endanwender, Verfahren Regeln bzw. Regeln und KI, Wert 0–100, Funde als JSON mit Schweregrad, Regel, Meldung, Absatz, Abschnitt, Zitat, Vorschlag, Hinweis) (ADR-105) |
| – | Migration `059_media_comparisons` | `media_comparisons` (Titel, Vorher- und Nachher-Bild, gemeinsames Bild bei Fassungen, Anlass, Änderung, Wirkung, Ticket, erzeugte Gegenüberstellung im Archiv) (ADR-106) |
| – | Migration `060_text_modules` | `text_modules` (Kennung je Projekt, Titel, Art, aktuelle Fassung, Status aktiv/abgelegt), `text_module_versions` (Fassung, Text, Notiz), `content_blocks.module_id` und `module_version` (verknüpfter Absatz) (ADR-107) |
| – | Migration `061_market_reviewers` | `market_reviewers` (Markt, Sprache oder alle, Ansprechperson, Vertretung, Notiz) sowie `translation_reviews.deputy` und `assigned_by` (manual/market) (ADR-108) |
| – | Migration `051_style_keep_terms` | `terminology_terms.keep_untranslated` (Begriff in jeder Sprache unverändert, ADR-097); Stilregeln je Projekt um `allowed` (erlaubte Begriffe) und `audience` (Zielgruppe) erweitert, Formulierungen um `language` (JSON in `projects.style_rules`) |
| – | Migration `035_metadata` | `text_snippets.locator` (Fundstelle: Seite, Folie, Zeitmarke, Anker), `metadata_labels` (vordefinierte und eigene Labels je Projekt: Code, Gruppe, Name Deutsch/Englisch, ausgeblendet), `metadata_chunk_labels` (Chunk ↔ Label), `metadata_qa` (Frage, Antwort, Sprache, Quellen mit Auszug beim Speichern, Notiz), `metadata_qa_labels` (ADR-079) |
| – | Etappe 22 (keine Migration) | Suche und Glossar der Leseransicht lesen `content_blocks`, `terminology_terms` (mit Definition) und `abbreviations` (ADR-066); Vorlagen-Export/-Import nutzt `chapter_templates` (ADR-067) |
| – | Migration `030_weekly_digest` | `projects.digest_weekday` (1 = Montag … 7 = Sonntag, NULL = aus, Standard 1); `digest_log` (Projekt, Person, ISO-Woche, Versandzeit – je Person höchstens eine Übersicht je Woche, ADR-064) |
| – | Migration `029_templates_feedback_source` | `chapter_templates` (eigene Kapitelvorlagen je Projekt: Name eindeutig, Zweck, Voraussetzungen/Schritte/Tipps als JSON, Ergebnis, Quellversion, ADR-059); `chapter_feedback.source` (`app` \| `online-help`, ADR-061) |
| – | Migration `028_reader_feedback` | `chapter_feedback` (Leser-Rückmeldung je Kapitel/Version: hilfreich, Kommentar, Status open/done, ADR-054); `projects.guidance_min_score` (Mindestwert des Anleitungs-Checks für Einreichen/Freigabe, NULL = aus, ADR-057) |
| – | Migration `027_style_libraries` | `style_libraries` (Stilregel-Bibliotheken, global: Name, Beschreibung, Formulierungen als JSON), `project_style_libraries` (Abonnement je Projekt mit Reihenfolge = Vorrang, ADR-050); Kapitel aus dem Kapitel-Assistenten nutzen `chapters`/`generated_chapter_versions` (`generator = assistant-1.0`, ADR-052) |
| – | Migration `026_roles_style_history` | `role_templates` (Rollenvorlagen, global), `users.role_template_id`; `style_scores` (Stilwert-Messpunkte je Kapitel, ADR-047/048) |
| – | Migration `025_users_style` | `projects.style_rules` (JSON: eigene Stilregeln, ADR-044); `users.disabled_at/disabled_by/created_at/created_by/origin` (Benutzerverwaltung, ADR-045) |
| – | Migration `024_images_style` | `media_assets.png_sha` (PNG-Fassung eines SVG-Bildes für Word); `diagram_templates` (Diagramm-Vorlagen je Projekt: Name, Bildarten, Struktur, Darstellung) (ADR-042) |
| – | (keine Migration in Etappe 14) | Schreibstil prüft nur bzw. speichert über `content_blocks`; gespeicherte Bilder liegen in `media_assets` mit `title` (ADR-040, ADR-041) |
| – | Migration `023_layout` | `projects.layout` (JSON): Firmen-Layout und Word-Vorlage (Object-Store-Schlüssel) (ADR-038) |
| – | `search_fts` bzw. `search_docs`, `search_index_state` | Volltextindex je Projekt und Bereich, zur Laufzeit angelegt, nicht im Backup (ADR-039) |
| – | Migration `022_variants` | `chapters.outline_family_id`/`outline_node_key` (Kapitel einer Handbuch-Variante), `outline_nodes.node_key` (stabil über Versionen), `handbook_releases.outline_id`/`outline_family_id` (ADR-034); `source_documents.removed_at`/`removed_in_import`, `imports.origin`/`snapshot` (vollständiger Stand, ADR-036) |
| – | `abbreviations`, `faq_entries` | Abkürzungsverzeichnis; FAQ mit Rollen/Sparten, Status, Herkunft (manuell/Assistent); `media_assets.title` für das Bildverzeichnis |
| – | `help_contexts` | Kontext-ID → Kapitel/Abschnitt, Herkunft manuell/Front-Matter (ADR-030); `projects.help_public` schaltet die öffentliche Einbettung frei |
| AuditEvent | `audit_events` | jede Änderung, Entscheidung, Freigabe; `project_id` (NULL = systemweit) |
| Requirement / TestCase / ApiOperation / DocumentationItem | `requirements`, `test_cases`, `api_operations`, `documentation_items` (+ Verknüpfungen) | Schema vorhanden; Etappe 1 liest die Quellen direkt aus `traceability/*.json` und OpenAPI (ADR-010) |

## Zentrale Regeln → Umsetzung

| Regel (§9) | Umsetzung |
|---|---|
| 1. Ursprungstexte unveränderlich | Object-Store schreibt nie über (`wx`), keine API ändert `text_snippets.text`, neue Datei-Version = neue Revision |
| 2. Redaktion an versionierten Content Blocks | `content_block_versions` bei jeder Änderung |
| 3. Rollen und Sparten unabhängige m:n | getrennte Tabellen für Snippets und Blöcke |
| 4. Veröffentlichte Versionen unveränderlich | 409 bei jeder Änderung an Blöcken einer nicht-`draft`-Version |
| 5. Evidenz oder Begründung je Absatz | Qualitätsgate-Prüfung `evidence_per_block`; bei KI-Umformulierung zusätzlich je Satz (`sentence_evidence`) |
| 6. Klassifikation mit Modell, Version, Score, Bestätigung | Spalten in `snippet_roles`/`snippet_divisions` |
| 7. Canonical Topics verhindern Wiederholungen | Generator ersetzt Nicht-Leitkapitel-Inhalte durch Querverweise |
