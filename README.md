# oneSCM Handbook Studio

Revisionssichere Webapp, die aus vielen Markdown-Texten ein konsistentes, rollen- und spartenspezifisches oneSCM-Benutzerhandbuch erzeugt.
Grundlage ist das Projektpaket in [`reference/`](reference/) (Masterprompt v1.0 und Referenz-UI).

> **Status: Etappe 2 (v0.2.0).** Alle P0-Stories sind umgesetzt. Die P0-Entscheidungen wurden am 24.09.2026 festgelegt ([docs/04-offene-entscheidungen.md](docs/04-offene-entscheidungen.md)); im Code sind sie mit `ENTSCHEIDUNG(E-xx)` markiert. Für den Produktivbetrieb gibt es PostgreSQL, eine OIDC-Anmeldung und eine persistente Jobqueue.

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
2. ein Access-Token mit Zielgruppe `OIDC_AUDIENCE` (optional) und einem Claim mit den Gruppen/Rollen des Benutzers;
3. die Gruppen `onescm-reader`, `onescm-editor`, `onescm-reviewer`, `onescm-approver`, `onescm-admin` (oder eine eigene Zuordnung über `OIDC_PERMISSION_MAP`).

## Arbeitsablauf in der App

1. **Quellen:** ZIP- oder MD-Datei importieren. Textabschnitte suchen und filtern, Rollen/Sparten/Markt/Release bestätigen.
2. **Dashboard → Analyse starten:** erzeugt Cluster, Dopplungen, Widersprüche, Lücken sowie Datenschutz-, Terminologie- und Lesbarkeitsbefunde.
3. **Widersprüche / Dopplungen / Textcluster:** Befunde mit Begründung entscheiden und Canonical Topics festlegen. Offene Blocker sperren Generierung, Freigabe und Export.
4. **Kapitelgenerator:** Entwurf ausschließlich aus bestätigten Quellen erzeugen (`source_confirmed` / `manually_confirmed`).
5. **Kapitelwerkstatt:** Absätze bearbeiten, verschieben, löschen, sperren, klassifizieren, kommentieren. Versionen vergleichen und wiederherstellen.
6. **Freigabe:** Das Qualitätsgate muss bestanden sein; die Freigabe wird protokolliert.
7. **Export / Rollen- und Spartenansichten:** gefiltert. Enthalten sind allgemeine Inhalte plus die passenden spezifischen.
8. **Traceability:** Matrix als Excel, CSV oder Markdown.

### Import

- Erlaubt sind `.md`, `.markdown` und `.zip` (E-01). Grenzen: `UPLOAD_MAX_BYTES`, `ZIP_MAX_FILES` bzw. **Einstellungen**.
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
| `DATA_DIR` | `./data` | Object-Store (Originaldateien, Exporte); bei mehreren Instanzen gemeinsames Volume |
| `AUTH_MODE` | `demo` | `oidc` für den Produktivbetrieb |
| `OIDC_ISSUER` | – | Issuer-URL des Providers (Discovery unter `/.well-known/openid-configuration`) |
| `OIDC_CLIENT_ID` | – | Client-ID der Web-UI |
| `OIDC_AUDIENCE` | – | erwartete Zielgruppe (`aud`) des Access-Tokens |
| `OIDC_SCOPE` | `openid profile` | angeforderte Scopes |
| `OIDC_PERMISSIONS_CLAIM` | `roles` | Claim mit Gruppen/Rollen, Punktnotation erlaubt (z. B. `realm_access.roles`) |
| `OIDC_PERMISSION_MAP` | Standardgruppen | JSON: `{"gruppe": ["read","edit"]}` |
| `OIDC_JWKS_URI` / `OIDC_JWKS` | Discovery | abweichende JWKS-URL bzw. Inline-JWKS |
| `JOB_WORKER` | `1` | `0` = Instanz ohne Hintergrund-Worker (nur API) |
| `JOB_LEASE_MS` | 600000 | nach dieser Zeit gelten laufende Jobs abgestürzter Instanzen als verwaist und werden wiederholt |
| `UPLOAD_MAX_BYTES` | 50 MB | maximale Uploadgröße |
| `ZIP_MAX_FILES` | 5000 | maximale Dateien je ZIP |
| `LOG` | `1` | `0` schaltet das Request-Logging ab |

Mehrere Instanzen sind mit PostgreSQL möglich: Jobs werden per `FOR UPDATE SKIP LOCKED` verteilt (ADR-008). `DATA_DIR/objects` muss dann ein gemeinsames Volume sein.

Sicherheit: Markdown/HTML aus Quellen wird nie ausgeführt (eigener Parser, `react-markdown` ohne Raw-HTML, Rohtext als `text/plain` + `nosniff`). Dazu eine restriktive CSP, Datenschutzblocker vor Export und ein Auditprotokoll (`GET /api/v1/audit-events`).

