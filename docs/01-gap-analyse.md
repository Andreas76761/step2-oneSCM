# 1. Gap-Analyse

**Stand:** 24.09.2026 · **Basis:** `reference/CLAUDE_MASTER_PROMPT.md` v1.0, `reference/REFERENZ_UI.png`
**Ausgangslage:** leeres Repository (keine Commits, kein Code, keine Daten).

Legende Status: ✅ im ersten Implementierungsschritt umgesetzt · 🟡 umgesetzt als *vorläufige Annahme* (P0-Entscheidung offen, konfigurierbar) · ⏳ bewusst späteren Etappen zugeordnet · ❓ fachlich ungeklärt

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
