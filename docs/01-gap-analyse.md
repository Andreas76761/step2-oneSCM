# 1. Gap-Analyse

**Stand:** 24.09.2026 · **Basis:** `reference/CLAUDE_MASTER_PROMPT.md` v1.0, `reference/REFERENZ_UI.png`
**Ausgangslage:** leeres Repository (keine Commits, kein Code, keine Daten).

Legende Status: ✅ im ersten Implementierungsschritt umgesetzt · 🟡 umgesetzt als *vorläufige Annahme* (seit 24.09.2026 als Entscheidung übernommen, siehe 1.4) · ⏳ bewusst späteren Etappen zugeordnet · ❓ fachlich ungeklärt

## 1.1 Anforderungen vs. Ist

| Bereich | Soll (Masterprompt) | Ist vorher | Ergebnis Etappe 1 |
|---|---|---|---|
| Import (US-001) | ZIP + MD, SHA-256, Status, Teilfehler, identische Revision, Originale unveränderlich | nichts | ✅ ZIP/MD-Import als Hintergrundjob, SHA-256 je Datei, Import-Items mit Status `imported`/`identical`/`failed`/`skipped`, Originaldatei im Object-Store (content-addressed) 🟡 Limits/Dateitypen konfigurierbar |
| Struktur (US-002) | H1→Kapitel, H2→Unterkapitel, H3–H6 erhalten, Reihenfolge, `Ohne Kapitel` | nichts | ✅ eigener, nicht ausführender Markdown-Parser, `heading_path`, Zeilennummern, Position; 🟡 Snippet-Granularität = Absatz/Liste/Tabelle/Code/Zitat |
| Rollen (US-003) | Mehrfachzuordnung, Score, Methode, Modellversion, Evidenzstatus, Trennung fachliche Rolle/Berechtigung | nichts | ✅ m:n `snippet_roles` mit Score/Methode/Modellversion/Evidenzstatus; Berechtigungen separat in `users.permissions`; 🟡 Klassifikation = Schlüsselwortregeln `rules-1.0` |
| Sparten (US-004) | unabhängig von Rollen, Icon+Label, Dateinamen-Ableitung unbestätigt | nichts | ✅ m:n `snippet_divisions`; Ableitung aus Dateiname/Pfad immer `unconfirmed` |
| Clustering (US-005) | kapitelintern/-übergreifend, Schwellen konfigurierbar, Score/Quelle/Methode/Begründung, bestätigen/teilen/zusammenführen/umbenennen | nichts | ✅ TF-IDF-Kosinus (`tfidf-cosine-1.0`), Schwellen in Einstellungen, Cluster-Aktionen; 🟡 Verfahren selbst ist P0-offen (kein Embedding-Modell verfügbar/entschieden) |
| Dopplungen (US-006) | exakt vs. semantisch getrennt, CanonicalTopic, Querverweis, kein Auto-Löschen | nichts | ✅ Stufe 1 (Hash) + Stufe 2 (semantisch) + Stufe 3 (kapitelübergreifend) getrennt; Canonical Topic nur per Entscheidung; Generator setzt Querverweis |
| Widersprüche (US-007) | beide Aussagen + Kontext, Blocker sperren Generierung/Freigabe/Export, Entscheidung mit Begründung/Entscheider/Zeit, Unterschiedsklassen | nichts | ✅ Regeln Negation, Pflicht/Optional, Zahl, Frist, Zuständigkeit, Rollen/Sparten/Markt/Release-Unterschied, veraltete Quelle; alle 10 Entscheidungsoptionen; 🟡 Blocker-Definition konfigurierbar |
| Generierung (US-008) | nur bestätigte Quellen, 10-teilige Struktur, Absatz-Traceability, nichts erfinden | nichts | ✅ **extraktiver** Generator (keine Textsynthese → nichts erfunden), leere Abschnitte werden als Lücke (`gap`) statt mit Fülltext markiert; ⏳ LLM-gestützte Umformulierung hinter Schnittstelle (ADR-007) |
| Werkstatt (US-009) | hinzufügen/ändern/löschen/verschieben, Versionierung, Schutz manueller Änderungen, Vergleich, Wiederherstellung | nichts | ✅ `content_block_versions` (append-only), Modi `generated`/`manually_edited`/`locked`/`needs_regeneration`/`approved`, Diff + Restore |
| Icons (US-010) | eindeutige Icons, Icon+Label+Farbe, gefilterte Ansicht = allgemein + passend | nichts | ✅ zentrale Referenzdaten, `Badge`-Komponente rendert immer Icon+Label+Farbe; Filterlogik serverseitig getestet |
| Qualitätsgate (US-012) | keine Blocker, Evidenz/Begründung je Absatz, Klassifikation bestätigt oder bewusst allgemein, Freigabe protokolliert | nichts | ✅ Gate-Service mit Einzelprüfungen; Freigabe nur mit Berechtigung `approve`; Approval + Audit; veröffentlichte Version unveränderlich |
| Traceability (US-020) | Anforderung↔API↔Test↔Doku↔Release, Export Excel/CSV/MD | nichts | ✅ `x-requirements` in OpenAPI wird geparst, Test-Registry `traceability/tests.json`, Export XLSX/CSV/MD, Test-Check „jede Operation hat ≥1 Story“ |
| P1 Dashboard/Optimierungen | | nichts | ✅ Basis (Kennzahlen, Befundverteilung, Lesbarkeit/Terminologie-Befunde) |
| P1 Terminologieverwaltung | | nichts | 🟡 Terminologie-Liste in Einstellungen (bevorzugt/abgelehnt), Befundtyp `terminology`; ⏳ eigene Verwaltungsmaske |
| P1 Suche/Filter | | nichts | ✅ kombinierte Suche (Text, Kapitel, Unterkapitel, Rolle, Sparte, Markt, Release, Evidenzstatus) — als Pflichttest ohnehin nötig |
| P1 Datenschutzprüfung | | nichts | ✅ Muster E-Mail/Telefon/IBAN → `privacy`-Blocker (Pflicht wegen US-012/Tests) |
| P2 Versionsvergleich | | nichts | ✅ Block-Versionsvergleich (wegen US-009); ⏳ Vergleich ganzer Kapitelversionen |
| Produktion PostgreSQL | | nichts | ⏳ Migrationen sind dialektneutral gehalten; PostgreSQL-Adapter in Etappe 2 (ADR-003) |
| Echte Authentifizierung | RBAC | nichts | 🟡 Demo-Benutzer mit Berechtigungen per Header `X-User-Id`; ⏳ OIDC/IdP-Anbindung |
| Docker, CI, E2E | | nichts | ✅ Dockerfile, docker-compose, GitHub Actions (Node 20 + 22), Playwright-Smoke-Test |

## 1.2 Lücken im Masterprompt selbst

1. **Story-Nummerierung lückenhaft:** US-011 und US-013…US-019 fehlen. Die P1/P2-Stories aus Abschnitt 5 haben keine IDs. → Vorläufig vergeben: US-011 Evidenz-/Quellenansicht, US-013 Optimierungsdashboard, US-014 gefilterter Export, US-015 Terminologie, US-016 Freigabeworkflow, US-017 Suche/Filter, US-018 Datenschutzprüfung, US-019 Versionsvergleich (**Annahme, zu bestätigen**, siehe E-14).
2. **Evidenzstatus unvollständig definiert:** genannt werden `source_confirmed`, `manually_confirmed`, `unconfirmed`, `open_question`. Semantik von `source_confirmed` fehlt. → Annahme: `source_confirmed` = explizit in der Quelle (Front-Matter) deklariert.
3. **Keine Definition von „Blocker“** außer „offene Blocker-Widersprüche oder Datenschutzblocker“.
4. **Keine Markt-/Releaseliste**, keine Regeln zur Ableitung.
5. **Keine Aufbewahrungsfristen** für Ursprungstexte, Versionen, Audit.
6. **Keine Uploadgrenzen** (Größe, Anzahl Dateien, ZIP-Tiefe, Zip-Bomb-Schutz).
7. **Keine Freigeberrollen** (wer darf freigeben? Vier-Augen-Prinzip?).
8. **Keine Barrierefreiheitsnorm** (WCAG-Level) genannt.
9. **Keine Exportformate** für das Handbuch (nur Traceability-Formate genannt). → Annahme: Markdown + HTML.
10. **API-Liste deckt UI-Bedarf nicht ab** (Cluster, Canonical Topics, Einstellungen, Quellenliste, Versionsliste/Restore). → Ergänzungsoperationen mit `x-requirements` in OpenAPI, als `x-extension: true` gekennzeichnet.

## 1.3 Risiken

| Risiko | Wirkung | Maßnahme |
|---|---|---|
| Semantik ohne Embedding-Modell | Paraphrasen werden schwächer erkannt | Verfahren hinter Interface `SimilarityEngine`, Methode + Version je Treffer gespeichert, Austausch ohne Datenmigration |
| Regelbasierte Widerspruchserkennung | False Positives | Befunde sind *Hinweise*, nie automatische Entscheidung; Schwellen konfigurierbar |
| Tausende Quellen, paarweiser Vergleich O(n²) | Laufzeit | invertierter Index über Terme, Vergleich nur von Kandidaten mit gemeinsamen Termen; Job im Hintergrund |
| SQLite in Produktion | Nebenläufigkeit | nur Demo/Test; PostgreSQL in Etappe 2 |

## 1.4 Stand nach Etappe 2 (24.09.2026)

| Lücke aus Etappe 1 | Ergebnis Etappe 2 |
|---|---|
| Alle 🟡-Punkte (offene P0-Entscheidungen) | ✅ als Entscheidungen übernommen (docs/04, Entscheidungsprotokoll); Code-Markierung `ENTSCHEIDUNG(E-xx)` |
| Produktion PostgreSQL | ✅ PostgreSQL-Adapter (`DATABASE_URL`), gemeinsame Testsuite läuft gegen SQLite **und** PostgreSQL (ADR-003) |
| Echte Authentifizierung | ✅ OpenID Connect: Bearer-JWT in der API, PKCE-Anmeldung in der UI, Berechtigungen aus IdP-Gruppen (ADR-011) |
| In-Process-Jobqueue | ✅ persistente Jobqueue in der Datenbank mit Wiederholung, Lease und Neustart-Sicherheit (ADR-008) |
| E-06 Vorschlag führendes Kapitel | ✅ UI schlägt das Kapitel mit den meisten Cluster-Mitgliedern vor |

Weiterhin offen nach Etappe 2: Freigabeworkflow, eigene Terminologiemaske, HTML/PDF-Export (→ Etappe 3), S3-kompatibler Object-Store (→ Etappe 4).

## 1.5 Stand nach Etappe 3 (24.09.2026)

| P1-Story | Ergebnis |
|---|---|
| US-011 Evidenz- und Quellenansicht | ✅ `GET /chapter-versions/{id}/evidence`, Seite „Evidenz“: Quellen je Absatz, Revision, Bestätigung, Auffälligkeiten (fehlend, nur begründet, veraltet, unbestätigt, ausgeschlossen) |
| US-013 Optimierungsdashboard | ✅ `GET /optimizations`: Kennzahlen je Kapitel, Nachweisquote, priorisierte Empfehlungen mit Sprung ins passende Modul |
| US-014 Gefilterter Export | ✅ zusätzlich HTML (eigenständig, ohne Skripte) und PDF (ADR-012) |
| US-015 Terminologieverwaltung | ✅ Tabelle `terminology_terms`, Seite „Terminologie“, Konsistenzprüfung, Ausmustern mit Audit; Analyse nutzt aktive Begriffe |
| US-016 Freigabeworkflow | ✅ Entwurf → eingereicht → freigegeben/abgelehnt, Zurückziehen, Sperre während der Prüfung (einstufig gemäß E-12) |

Offen (Etappe 4): US-019 Vergleich ganzer Kapitelversionen, S3-kompatibler Object-Store, optionale LLM-Umformulierung.

## 1.6 Stand nach Etappe 4 (24.09.2026)

| Punkt | Ergebnis |
|---|---|
| US-019 Versionsvergleich | ✅ Vergleich ganzer Kapitelversionen über die Lineage der Absätze; Seite „Versionsvergleich“ |
| Mehrinstanzbetrieb | ✅ S3-kompatibler Object-Store; zusammen mit PostgreSQL und der verteilten Jobqueue horizontal skalierbar |
| Lineage-Stabilität | ✅ behoben (Lückenhinweise und Blöcke mit gleichen Quellen verloren bei Neugenerierung ihre Lineage) |

Damit sind alle User Stories US-001 … US-020 umgesetzt. Offen ist nur die optionale LLM-Umformulierung (E-16).

## 1.7 Stand nach Etappe 5 (24.09.2026)

| Punkt | Ergebnis |
|---|---|
| E-16 KI-Umformulierung | ✅ entschieden (Cloud erlaubt, Anthropic + OpenAI-kompatibel, Evidenz je Satz + Übernahme durch die Redaktion) und umgesetzt ([ADR-013](adr/ADR-013-ki-umformulierung.md)) |
| Nichts erfinden (US-008) | ✅ automatische Satzprüfung: Quellen, unbekannte Quellen, neue Zahlen, Wortabdeckung, Datenschutz; ungültige Vorschläge sind nicht übernehmbar |
| Nachvollziehbarkeit (US-009, §9) | ✅ Modus `ai_rewritten`, Satz-Evidenz am Absatz, Blockversion `rewritten`, Audit mit Anbieter/Modell/Prompt-Hash/übertragenen Textabschnitten |
| Qualitätsgate (US-012) | ✅ neue Prüfung `sentence_evidence` |
| Datenschutz (§13) | ✅ keine Übertragung bei offenen Datenschutzbefunden oder neuen personenbezogenen Daten; Rückfrage vor Übertragung an externe Dienste |

Offene Punkte aus dem Auftrag bestehen nicht mehr.
