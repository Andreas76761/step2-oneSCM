# oneSCM Handbook Studio

Revisionssichere Webapp, die aus vielen Markdown-Texten ein konsistentes, rollen- und spartenspezifisches oneSCM-Benutzerhandbuch erzeugt.
Grundlage ist das Projektpaket in [`reference/`](reference/) (Masterprompt v1.0 und Referenz-UI).

> **Status: Etappe 8 (v0.8.0).** Alle P0-, P1- und P2-Stories (US-001 … US-020) sind umgesetzt, dazu die KI-Umformulierung mit Quellenbindung je Satz (E-16, ADR-013) – auch für ganze Kapitel –, mehrere Projekte (ADR-014), Betriebsfunktionen (ADR-015), Barrierefreiheit nach WCAG 2.2 AA (ADR-016), semantische Suche (ADR-017), Handbuch-Releases mit Online-Hilfe (ADR-018), Kollaboration (ADR-019), Mehrsprachigkeit (ADR-020) samt mehrsprachiger Releases (ADR-021), Import aus Confluence, Word und Git (ADR-022), Analytik und Berichte (ADR-023) sowie ein skalierbarer Vektorindex mit HNSW bzw. pgvector (ADR-024). Die P0-Entscheidungen wurden am 24.09.2026 festgelegt ([docs/04-offene-entscheidungen.md](docs/04-offene-entscheidungen.md)); im Code sind sie mit `ENTSCHEIDUNG(E-xx)` markiert. Für den Produktivbetrieb gibt es PostgreSQL, eine OIDC-Anmeldung und eine persistente Jobqueue.

## Dokumentation

| Dokument | Inhalt |
|---|---|
| [docs/01-gap-analyse.md](docs/01-gap-analyse.md) | Gap-Analyse Soll/Ist, Lücken im Auftrag, Risiken |
| [docs/02-p0-reihenfolge.md](docs/02-p0-reihenfolge.md) | priorisierte P0-Reihenfolge und Etappenplan |
| [docs/03-repository-struktur.md](docs/03-repository-struktur.md) | Repository-Struktur |
| [docs/04-offene-entscheidungen.md](docs/04-offene-entscheidungen.md) | Widersprüche im Auftrag und P0-Entscheidungen samt vorläufiger Annahme |
| [docs/05-datenmodell.md](docs/05-datenmodell.md) | Datenmodell und zentrale Regeln |
| [docs/adr/](docs/adr/README.md) | Architecture Decision Records |
| [docs/traceability.md](docs/traceability.md) | Traceability-Matrix (generiert) |
| [docs/lasttest-semantik.md](docs/lasttest-semantik.md) | Lasttest der semantischen Suche mit 50 000 Textabschnitten |
| [openapi/openapi.yaml](openapi/openapi.yaml) | OpenAPI 3.1.1, Basispfad `/api/v1` |

## Schnellstart

Voraussetzung: Node.js 20 oder 22.

```bash
npm install
npm run build          # Web-UI und Server bauen
npm run demo:seed      # fiktive Demo-Quellen importieren und analysieren (./data)
npm start              # http://localhost:3000
```

Entwicklung mit Hot Reload: `npm run dev` (API auf :3000, UI auf http://localhost:5173 mit Proxy).

Mit Docker (App + PostgreSQL):

```bash
POSTGRES_PASSWORD=… docker compose up --build      # http://localhost:3000
```

### Anmeldung

**Demo-Modus** (Standard, `AUTH_MODE=demo`): In der Seitenleiste wählen Sie einen **Demo-Benutzer**. Nur für Entwicklung und Vorführung. Technische Berechtigungen sind von fachlichen Rollen getrennt (ADR-009):

| Demo-Benutzer | Berechtigungen |
|---|---|
| Redaktion | read, edit |
| Fachprüfung | read, edit, decide |
| Freigabe | read, decide, approve |
| Administration | alle |
| Lesezugriff | read |

**OIDC-Modus** (`AUTH_MODE=oidc`, Produktion, ADR-011): Die UI meldet über den OpenID-Connect-Provider an (Authorization Code + PKCE), die API prüft das Bearer-Token. Beim Provider benötigen Sie:
1. einen **öffentlichen Client** (z. B. `onescm-web`) mit Redirect-URI `https://<app>/` und Post-Logout-URI `https://<app>/`;
2. ein Access-Token mit der Zielgruppe `OIDC_AUDIENCE` (Pflicht – Tokens für andere Anwendungen desselben Providers werden abgelehnt) und einem Claim mit den Gruppen/Rollen des Benutzers;
3. die Gruppen `onescm-reader`, `onescm-editor`, `onescm-reviewer`, `onescm-approver`, `onescm-admin` (oder eine eigene Zuordnung über `OIDC_PERMISSION_MAP`).

## Arbeitsablauf in der App

0. **Projekt wählen** (Seitenleiste): Jedes Projekt ist ein eigenes Handbuch mit eigenen Quellen, Befunden, Kapiteln, Freigaben und Audit. Projekte und Mitglieder verwaltet die Administration unter **Projekte** (ADR-014).
1. **Quellen:** ZIP-, Markdown-, HTML- (Confluence-Export) oder Word-Datei importieren oder ein **Git-Repository verbinden**, das automatisch abgeglichen wird (ADR-022). Textabschnitte suchen und filtern – auch **semantisch** (ähnliche Aussagen bei anderer Formulierung, ADR-017) –, Rollen/Sparten/Markt/Release bestätigen.
2. **Dashboard → Analyse starten:** erzeugt Cluster, Dopplungen, Widersprüche, Lücken sowie Datenschutz-, Terminologie- und Lesbarkeitsbefunde.
3. **Widersprüche / Dopplungen / Textcluster:** Befunde mit Begründung entscheiden und Canonical Topics festlegen. Offene Blocker sperren Generierung, Freigabe und Export.
4. **Kapitelgenerator:** Entwurf ausschließlich aus bestätigten Quellen erzeugen (`source_confirmed` / `manually_confirmed`).
5. **Kapitelwerkstatt:** Absätze bearbeiten, verschieben, löschen, sperren, klassifizieren, kommentieren, einzelne Absatzversionen wiederherstellen. **Versionen vergleichen** zeigt die Unterschiede zweier ganzer Kapitelversionen. Mit eingerichtetem KI-Dienst (`LLM_PROVIDER`) liefert **✨ KI-Vorschlag** eine Umformulierung, in der jeder Satz seine Quellen nennt; nur geprüfte Vorschläge lassen sich übernehmen (ADR-013). **✨ Kapitel umformulieren** fordert Vorschläge für alle geeigneten Absätze im Hintergrund an; die Sammelprüfung zeigt sie gemeinsam, gültige lassen sich einzeln oder gesammelt übernehmen. Nutzung und Tokens stehen unter **Einstellungen**.
6. **Evidenz:** je Absatz prüfen, auf welcher Quelle er beruht und ob sie aktuell und bestätigt ist.
7. **Freigabe:** Redaktion reicht ein (Qualitätsgate muss bestanden sein), die Freigabe entscheidet: freigeben oder ablehnen. Alles wird protokolliert.
8. **Export / Rollen- und Spartenansichten:** gefiltert als Markdown, HTML, PDF oder JSON. Enthalten sind allgemeine Inhalte plus die passenden spezifischen.
9. **Terminologie / Optimierungen:** Begriffe pflegen; Kennzahlen und priorisierte Empfehlungen je Kapitel.
10. **Traceability:** Matrix als Excel, CSV oder Markdown.
11. **Diskussion & Aufgaben (ADR-019):** In der Kapitelwerkstatt (Tab „Diskussion“) Absätze kommentieren, Personen mit `@kennung` erwähnen, Aufgaben mit Frist zuweisen; Hinweise unter **Aufgaben & Hinweise**, optional per Webhook und E-Mail.
12. **Übersetzungen (ADR-020):** Freigegebene Kapitel in die Zielsprachen des Projekts übersetzen (KI mit Satz-Zuordnung oder manuell), prüfen, je Sprache freigeben und exportieren.
13. **Veröffentlichung (ADR-018, ADR-021):** Den Stand aller freigegebenen Kapitel als Handbuch-Version veröffentlichen – mit Änderungsliste zur Vorversion und statischer Online-Hilfe (ZIP), inklusive freigegebener Übersetzungen mit Sprachumschalter.
14. **Analytik (ADR-023):** Kennzahlen im Zeitverlauf, Freigabedauer und Erstfreigabequote, Projektbericht als PDF, Export für BI-Werkzeuge (CSV/JSON).

### Import

- Erlaubt sind `.md`, `.markdown`, `.zip` (E-01) sowie `.html`/`.htm` (Confluence-/HTML-Export) und `.docx` (Word), die in Markdown umgewandelt werden; das Original bleibt abrufbar (ADR-022). Grenzen: `UPLOAD_MAX_BYTES`, `ZIP_MAX_FILES` bzw. **Einstellungen**. Bestehende Installationen mit angepasster Endungsliste ergänzen die neuen Endungen dort.
- **Git-Quellverbindungen** (Seite „Quellen“, Administration): https-Repository, Branch, Unterordner, Intervall. Unveränderte Commits erzeugen keinen Import. Ein Token wird nie gespeichert, sondern als Umgebungsvariable `GIT_CREDENTIAL_<NAME>` des Servers hinterlegt und in der Verbindung nur mit Namen genannt.
- Optionales Front-Matter je Datei legt Werte als **von der Quelle bestätigt** fest:

  ```yaml
  ---
  roles: [dealer, mo]          # dealer | market | mo | hq | all
  divisions: [car, truck]      # car | van | truck | bus | all
  market: DE
  release: "2026.3"
  evidence_status: source_confirmed
  ---
  ```

  Ohne Front-Matter bleibt alles `unconfirmed`; auch Werte, die aus Dateinamen oder Pfaden abgeleitet sind.

## Tests

```bash
npm test                 # Unit- und API-Tests (Vitest)
npm run test:e2e         # Playwright (baut vorher: npm run build)
TEST_DATABASE_URL=postgres://user:pass@localhost:5432/onescm_test npm test   # dieselben Tests gegen PostgreSQL (Schema wird geleert!)
npm run traceability     # docs/traceability.md neu erzeugen; bricht ab, wenn P0-Stories ohne Test/API sind
npm run typecheck
npm run lint             # u. a. keine unabgewarteten Datenbankaufrufe (no-floating-promises)
```

Jeder Test trägt eine ID (`[T-xxx]`), die in [`traceability/tests.json`](traceability/tests.json) den User Stories zugeordnet ist.

## Betrieb

| Variable | Standard | Bedeutung |
|---|---|---|
| `PORT` / `HOST` | `3000` / `0.0.0.0` | HTTP |
| `DATABASE_URL` | – | `postgres://user:pass@host:5432/db` → PostgreSQL (Produktion). Ohne Angabe: SQLite in `DB_PATH` |
| `DB_PATH` | `$DATA_DIR/onescm.db` | SQLite-Datei (Demo/Entwicklung) |
| `DB_POOL_SIZE` | `10` | Verbindungen im PostgreSQL-Pool |
| `DATA_DIR` | `./data` | lokaler Object-Store (Originaldateien, Exporte) bei `OBJECT_STORE=local` |
| `OBJECT_STORE` | `local` | `s3` für AWS S3 oder S3-kompatible Speicher (MinIO, Ceph …) – empfohlen für mehrere Instanzen |
| `S3_BUCKET` / `S3_PREFIX` | – | Bucket (Pflicht bei `s3`) und optionales Präfix |
| `S3_ENDPOINT` / `S3_REGION` / `S3_FORCE_PATH_STYLE` | AWS / `us-east-1` / automatisch | für S3-kompatible Speicher; Zugangsdaten über `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` oder Instanzrolle |
| `LLM_PROVIDER` | `none` | KI-Umformulierung (ADR-013): `anthropic`, `openai` (OpenAI-kompatibel, auch Azure/vLLM/Ollama) oder `demo` (offline, nur Demo/Tests) |
| `LLM_MODEL` | `claude-sonnet-5` bei `anthropic` | Modell; bei `openai` Pflicht |
| `LLM_API_KEY` | – | Schlüssel; alternativ `ANTHROPIC_API_KEY` bzw. `OPENAI_API_KEY` |
| `LLM_BASE_URL` / `LLM_TIMEOUT_MS` / `LLM_MAX_TOKENS` | Anbieter-Standard / `60000` / `4000` | eigener Endpunkt (z. B. EU-Region, Proxy, selbst betrieben), Zeitlimit, Antwortlänge |
| `AUTH_MODE` | `demo` | `oidc` für den Produktivbetrieb |
| `OIDC_ISSUER` | – | Issuer-URL des Providers (Discovery unter `/.well-known/openid-configuration`) |
| `OIDC_CLIENT_ID` | – | Client-ID der Web-UI |
| `OIDC_AUDIENCE` | – | **Pflicht im OIDC-Modus:** erwartete Zielgruppe (`aud`) des Access-Tokens |
| `OIDC_SCOPE` | `openid profile` | angeforderte Scopes |
| `OIDC_PERMISSIONS_CLAIM` | `roles` | Claim mit Gruppen/Rollen, Punktnotation erlaubt (z. B. `realm_access.roles`) |
| `OIDC_PERMISSION_MAP` | Standardgruppen | JSON: `{"gruppe": ["read","edit"]}` |
| `OIDC_JWKS_URI` / `OIDC_JWKS` | Discovery | abweichende JWKS-URL bzw. Inline-JWKS |
| `JOB_WORKER` | `1` | `0` = Instanz ohne Hintergrund-Worker (nur API) |
| `JOB_LEASE_MS` | 600000 | nach dieser Zeit gelten laufende Jobs abgestürzter Instanzen als verwaist und werden wiederholt |
| `UPLOAD_MAX_BYTES` | 50 MB | maximale Uploadgröße |
| `ZIP_MAX_FILES` | 5000 | maximale Dateien je ZIP |
| `LOG` / `LOG_LEVEL` | `1` / `info` | `0` schaltet das Logging ab; Logs sind JSON mit Request-ID, Benutzer und Projekt |
| `TRUST_PROXY` | – | `1` hinter einem Reverse Proxy (Client-IP aus `X-Forwarded-For`) |
| `METRICS_TOKEN` | – | Bearer-Token für `/metrics` (Prometheus); ohne Token nur mit Berechtigung `admin` |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_EXPENSIVE_MAX` | `1200` / `60` | Anfragen je Benutzer und Minute; aufwendig = Import, Git-Abgleich, Analyse, Export, Projektbericht, KI, semantische Suche; `0` schaltet ab |
| `LLM_PRICE_INPUT_PER_MTOK` / `LLM_PRICE_OUTPUT_PER_MTOK` / `LLM_PRICE_CURRENCY` | – / – / `USD` | optionale Preise je 1 Mio. Tokens für die Kostenschätzung der KI-Nutzung |
| `EMBEDDINGS_PROVIDER` | `local` | semantische Suche (ADR-017): `local` (ohne Netzwerk) oder `openai` (OpenAI-kompatibel, auch Azure/Voyage/Ollama) |
| `EMBEDDINGS_MODEL` / `EMBEDDINGS_BASE_URL` / `EMBEDDINGS_API_KEY` | – | Modell (Pflicht bei `openai`), Endpunkt, Schlüssel (alternativ `OPENAI_API_KEY`) |
| `NOTIFY_WEBHOOK_URL` | – | Benachrichtigungen per Webhook (ADR-019), JSON mit `text` |
| `SMTP_URL` / `MAIL_FROM` | – / `noreply@example.com` | Benachrichtigungen per E-Mail (`smtp://user:pass@host:587`) |
| `APP_URL` | – | Basis-URL der Web-UI für Links in Benachrichtigungen |
| `VECTOR_INDEX` | `auto` | Suchverfahren der semantischen Suche (ADR-024): `auto` (pgvector, falls verfügbar, sonst HNSW ab `semantic.annThreshold` Abschnitten, sonst exakt), `exact`, `hnsw`, `pgvector` |
| `GIT_CREDENTIAL_*` | – | Tokens für Git-Quellverbindungen (ADR-022), in der Verbindung nur per Name referenziert |
| `GIT_TIMEOUT_MS` / `GIT_ALLOW_FILE` | `120000` / – | Zeitlimit je git-Aufruf; `1` erlaubt lokale Repositories (nur Tests) |

Mehrere Instanzen sind mit PostgreSQL und `OBJECT_STORE=s3` möglich: Jobs werden per `FOR UPDATE SKIP LOCKED` verteilt, Dateien liegen im gemeinsamen Bucket (ADR-008).

**Überwachung (ADR-015):** `GET /api/v1/health/live` (Liveness) und `GET /api/v1/health/ready` (Datenbank, Object-Store, Jobqueue) ohne Anmeldung; Prometheus-Metriken unter `/metrics`. Jede Antwort trägt `X-Request-Id`.

**Backup und Wiederherstellung (ADR-015):** mit derselben Konfiguration wie der Server

```bash
npm run backup -- --out backup.zip             # im Container: node apps/server/dist/cli.js backup --out /data/backup.zip
npm run restore -- --in backup.zip [--force]   # --force ersetzt vorhandene Daten
```

Das Backup ist dialektunabhängig (Tabellen als JSON-Zeilen plus Objekte) – damit lässt sich auch von SQLite nach PostgreSQL umziehen: Backup mit SQLite-Konfiguration erstellen, Restore mit `DATABASE_URL` einspielen.

**Lasttest:** `npm run perf -w apps/server -- 2000` (Messwerte in ADR-015); semantische Suche: `npm run perf:semantic -w apps/server -- 50000` (Messwerte in [docs/lasttest-semantik.md](docs/lasttest-semantik.md)).

**pgvector (ADR-024):** Mit PostgreSQL und der Erweiterung `vector` (z. B. Image `pgvector/pgvector:pg16`) legt der Server Tabelle `snippet_vectors` und einen HNSW-Index selbst an; fehlt die Erweiterung oder das Recht dazu, sucht er im Speicher.

Sicherheit: Markdown/HTML aus Quellen wird nie ausgeführt (eigener Parser, `react-markdown` ohne Raw-HTML, Rohtext als `text/plain` + `nosniff`). Dazu eine restriktive CSP, Datenschutzblocker vor Export und ein Auditprotokoll (`GET /api/v1/audit-events`).

