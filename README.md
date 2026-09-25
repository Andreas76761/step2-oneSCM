# oneSCM Handbook Studio

Revisionssichere Webapp, die aus vielen Markdown-Texten ein konsistentes, rollen- und spartenspezifisches oneSCM-Benutzerhandbuch erzeugt.
Grundlage ist das Projektpaket in [`reference/`](reference/) (Masterprompt v1.0 und Referenz-UI).

> **Status: Etappe 15 (v0.15.0).** Alle P0-, P1- und P2-Stories (US-001 … US-020) sind umgesetzt, dazu die KI-Umformulierung mit Quellenbindung je Satz (E-16, ADR-013) – auch für ganze Kapitel –, mehrere Projekte (ADR-014), Betriebsfunktionen (ADR-015), Barrierefreiheit nach WCAG 2.2 AA (ADR-016), semantische Suche (ADR-017), Handbuch-Releases mit Online-Hilfe (ADR-018), Kollaboration (ADR-019), Mehrsprachigkeit (ADR-020) samt mehrsprachiger Releases (ADR-021), Import aus Confluence, Word und Git (ADR-022), Analytik und Berichte (ADR-023) ein skalierbarer Vektorindex mit HNSW bzw. pgvector (ADR-024), mehrstufige Freigabe (ADR-025), ein Handbuch-Assistent mit Quellen je Satz (ADR-026), Kubernetes-Betrieb mit Helm-Chart, OpenTelemetry und verteilten Rate-Limits (ADR-027), Integrationen mit API-Tokens, signierten Webhooks und Confluence Cloud (ADR-028), Bilder mit Pflicht-Alternativtext (ADR-029), Kontexthilfe für oneSCM mit einbettbarem Widget (ADR-030) eine Release-Pipeline mit signiertem Container-Image und SBOM (ADR-031) sowie Stammdaten mit Gliederungen je Variante (ADR-032) und ein Draft Manual mit farblicher Kennzeichnung von Dopplungen, Lücken, Widersprüchen und Warnungen (ADR-033), aus dem Handbuch-Varianten mit Freigabe, Export und Online-Hilfe samt Verzeichnissen entstehen (ADR-034), dazu Drag & Drop, Gliederungsvergleich, globale Suche und Dunkelmodus (ADR-035) sowie Pflegefunktionen: entfernte Quelldateien, bereinigtes SVG, Stammdaten-Import aus CSV/Excel und Planungserinnerungen (ADR-036); Varianten lassen sich mit dem Blueprint abgleichen (ADR-037), Handbücher erscheinen im Firmen-Layout und als Word-Dokument (ADR-038), und die Suche nutzt einen Volltextindex (ADR-039); unter „Schreibstil“ werden Texte geprüft, gelb markiert und umformuliert (ADR-040), unter „Bilder“ entstehen aus Textstellen ASCII-Bilder, Klickstrecken, Prozessbilder und Infografiken (ADR-041) – mit PNG-Fassung für Word, direkt aus der Werkstatt, nachbearbeitbar und als Vorlage, dazu markierte Screenshots (ADR-042); der Schreibstil ist in die Werkstatt und das Dashboard integriert (ADR-043). Die P0-Entscheidungen wurden am 24.09.2026 festgelegt ([docs/04-offene-entscheidungen.md](docs/04-offene-entscheidungen.md)); im Code sind sie mit `ENTSCHEIDUNG(E-xx)` markiert. Für den Produktivbetrieb gibt es PostgreSQL, eine OIDC-Anmeldung und eine persistente Jobqueue.

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
7. **Freigabe:** Redaktion reicht ein (Qualitätsgate muss bestanden sein), die Freigabe entscheidet: freigeben oder ablehnen. Optional mehrere Stufen mit Zuständigen, Mindestanzahl, Frist und Vier-Augen-Prinzip (ADR-025); „Meine offenen Entscheidungen“ zeigt, was ansteht. Alles wird protokolliert.
8. **Export / Rollen- und Spartenansichten:** gefiltert als Markdown, HTML, PDF oder JSON. Enthalten sind allgemeine Inhalte plus die passenden spezifischen.
9. **Terminologie / Optimierungen:** Begriffe pflegen; Kennzahlen und priorisierte Empfehlungen je Kapitel.
10. **Traceability:** Matrix als Excel, CSV oder Markdown.
11. **Diskussion & Aufgaben (ADR-019):** In der Kapitelwerkstatt (Tab „Diskussion“) Absätze kommentieren, Personen mit `@kennung` erwähnen, Aufgaben mit Frist zuweisen; Hinweise unter **Aufgaben & Hinweise**, optional per Webhook und E-Mail.
12. **Übersetzungen (ADR-020):** Freigegebene Kapitel in die Zielsprachen des Projekts übersetzen (KI mit Satz-Zuordnung oder manuell), prüfen, je Sprache freigeben und exportieren.
13. **Veröffentlichung (ADR-018, ADR-021):** Den Stand aller freigegebenen Kapitel als Handbuch-Version veröffentlichen – mit Änderungsliste zur Vorversion und statischer Online-Hilfe (ZIP), inklusive freigegebener Übersetzungen mit Sprachumschalter.
14. **Analytik (ADR-023):** Kennzahlen im Zeitverlauf, Freigabedauer und Erstfreigabequote, Projektbericht als PDF, Export für BI-Werkzeuge (CSV/JSON).
15. **Assistent (ADR-026):** Fragen an das freigegebene Handbuch – Antworten mit Quellen je Satz, gefiltert nach Sprache, Rolle und Sparte; Wissenslücken für die Redaktion.
16. **Kontexthilfe (ADR-030):** Kontext-IDs aus oneSCM (z. B. `order.create`) Kapiteln zuordnen; Aufruf per API, Deep-Link `/hilfe/<id>` oder eingebettetem Hilfe-Widget mit Assistent.
17. **Integrationen (ADR-028):** API-Tokens für Maschinen, Webhooks zu Ereignissen des Projekts mit Zustellprotokoll.
18. **Stammdaten (ADR-032, unten in der Navigation):** **Inhaltsverzeichnis** – Gliederungen je Rolle, Sparte und Blueprint oder Märkten anlegen (leer, aus der Kapitelstruktur, per Upload `.md`/`.json`), bearbeiten, erweitern, als Version speichern, exportieren; **Abkürzungen**, **Glossar**, **Bildverzeichnis**, **FAQ** (mit Vorschlägen aus dem Assistenten) und **Planung** (Verantwortliche, Termin, Status je Kapitel). Die Navigation lässt sich mit « / » einklappen.
19. **Draft Manual (ADR-033):** Gliederung wählen, Textschnipsel automatisch, manuell oder per Drag & Drop Kapiteln/Unterkapiteln zuordnen; 🔴 Widersprüche, 🟠 Dopplungen, 🟡 Warnungen und 🟣 Lücken sind farblich und mit Text gekennzeichnet; Export als Markdown.
20. **Handbuch der Variante (ADR-034):** Im Draft Manual „Kapitel für Freigabe erzeugen“ – die Kapitel erscheinen in der Werkstatt unter „Variante: …“, werden geprüft und freigegeben. Unter **Export** bzw. **Veröffentlichung** das Handbuch wählen: Ausgabe gefiltert nach der Variante, mit Abkürzungsverzeichnis, Glossar, Bildverzeichnis und FAQ.
21. **Suche und Darstellung (ADR-035):** Suchfeld oben in der Navigation (Taste „/“) findet Kapitel, Texte, Schnipsel, Quellen, Gliederungen und Stammdaten; unter „Darstellung“ Hell, Dunkel oder wie System. Gliederungsversionen lassen sich vergleichen.
22. **Pflege (ADR-036):** ZIP als „vollständigen Stand“ importieren markiert fehlende Dateien als entfernt (wiederherstellbar); Abkürzungen, Glossar und FAQ lassen sich aus CSV/Excel importieren (mit Vorschau); SVG-Grafiken werden bereinigt übernommen; überfällige Planung wird stündlich im Posteingang erinnert.
23. **Varianten abgleichen (ADR-037):** Im Draft Manual „Mit anderer Gliederung abgleichen“ – neue Inhalte und Kapitel aus dem Blueprint gezielt in eine Markt- oder Rollenvariante übernehmen.
24. **Layout und Word (ADR-038):** Unter Einstellungen › Layout Firmenname, Hausfarbe, Logo, Titelseite, Kopf-/Fußzeile und eine Word-Vorlage festlegen; unter Export das Format „Word (.docx)“ wählen.
25. **Schreibstil (ADR-040):** Text einfügen oder ein Kapitel bzw. Textschnipsel wählen, „Prüfen“ – gelb markierte Sätze anklicken und korrigieren, „Automatisch korrigieren“, „Professionell umformulieren“ oder „In Präsens umwandeln“; Kapitelabsätze im Entwurf direkt speichern.
26. **Bilder (ADR-041):** Textstelle einfügen, Bildarten wählen, „Bilder erzeugen“ – Struktur bei Bedarf bearbeiten, Bilder auswählen, Alternativtext prüfen und „Ausgewählte speichern“; das Markdown in einen Absatz einfügen.
27. **Bilder in der Werkstatt (ADR-042):** Am Absatz „🎨 Bild erzeugen“ – Diagramm auswählen, speichern, es wird angehängt und erscheint auch im Word-Export. Unter „Bilder“ die Struktur und Darstellung nachbearbeiten, als Vorlage speichern oder im Tab „Screenshot markieren“ Klickpunkte einzeichnen.
28. **Schreibstil in der Werkstatt (ADR-043):** „🖋️ Stil anzeigen“ markiert Sätze gelb (anklicken zum Korrigieren), „🖋️ Stil korrigieren“ korrigiert das ganze Kapitel mit Vorschau; das Dashboard zeigt den Stilwert je Kapitel.

### Import

- Erlaubt sind `.md`, `.markdown`, `.zip` (E-01) sowie `.html`/`.htm` (Confluence-/HTML-Export) und `.docx` (Word), die in Markdown umgewandelt werden; das Original bleibt abrufbar (ADR-022). Grenzen: `UPLOAD_MAX_BYTES`, `ZIP_MAX_FILES` bzw. **Einstellungen**. Bestehende Installationen mit angepasster Endungsliste ergänzen die neuen Endungen dort.
- **Git-Quellverbindungen** (Seite „Quellen“, Administration): https-Repository, Branch, Unterordner, Intervall. Unveränderte Commits erzeugen keinen Import. Ein Token wird nie gespeichert, sondern als Umgebungsvariable `GIT_CREDENTIAL_<NAME>` des Servers hinterlegt und in der Verbindung nur mit Namen genannt. **Push-Webhook** (ADR-028): Die Verbindung zeigt URL und Geheimnis für GitHub (Secret, `application/json`) bzw. GitLab (Secret Token); ein Push auf den Branch stößt den Abgleich sofort an.
- **Confluence Cloud** (ADR-028): Verbindungsart „Confluence“ mit Basis-URL (`https://firma.atlassian.net/wiki`) und Bereichsschlüssel; Zugang als `CONFLUENCE_CREDENTIAL_<NAME>=email:api-token`. Seiten und Bildanhänge werden übernommen, unveränderte Stände nicht erneut importiert.
- **Bilder** (ADR-029): PNG, JPEG, GIF und WebP im ZIP (relativ referenziert, z. B. `![Anmeldemaske](bilder/maske.png)`), in Word, HTML und Confluence werden übernommen und als `media:<sha256>` versioniert abgelegt; in der Werkstatt fügt **🖼️ Bild einfügen** Bilder hinzu. Jedes Bild braucht einen Alternativtext – sonst blockiert das Qualitätsgate (`image_alt`).
- Optionales Front-Matter je Datei legt Werte als **von der Quelle bestätigt** fest:

  ```yaml
  ---
  roles: [dealer, mo]          # dealer | market | mo | hq | all
  divisions: [car, truck]      # car | van | truck | bus | all
  market: DE
  release: "2026.3"
  evidence_status: source_confirmed
  help_context: [order.create]  # optional: Kontext-IDs für die Kontexthilfe (ADR-030)
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
| `VECTOR_INDEX` | `auto` | Suchverfahren der semantischen Suche (ADR-024): `auto` (exakt im Speicher; bei einem semantischen Embedding-Modell ab `semantic.annThreshold` Abschnitten näherungsweise über pgvector, falls verfügbar, sonst HNSW), `exact`, `hnsw`, `pgvector` |
| `RATE_LIMIT_STORE` | `memory` | `db`: Rate-Limits gemeinsam über alle Instanzen derselben Datenbank (ADR-027) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` / `OTEL_SERVICE_NAME` | – / `onescm-handbook-studio` | OpenTelemetry-Tracing per OTLP/HTTP (ADR-027); ohne Endpunkt aus |
| `GIT_CREDENTIAL_*` | – | Tokens für Git-Quellverbindungen (ADR-022), in der Verbindung nur per Name referenziert |
| `GIT_TIMEOUT_MS` / `GIT_ALLOW_FILE` | `120000` / – | Zeitlimit je git-Aufruf; `1` erlaubt lokale Repositories (nur Tests) |
| `CONFLUENCE_CREDENTIAL_*` | – | Zugang für Confluence-Cloud-Verbindungen (ADR-028): `email:api-token` (Basic) oder persönliches Token (Bearer) |
| `INTEGRATIONS_ALLOW_INSECURE` | – | `1` erlaubt `http` und interne Ziele für Webhooks und Confluence (nur Tests/abgeschottete Netze; sonst SSRF-Schutz) |
| `JOB_BACKOFF_MS` | `2000` | Grundabstand der Wiederholungen fehlgeschlagener Jobs (verdoppelt sich je Versuch), z. B. Webhook-Zustellungen |
| `HELP_EMBED_ORIGINS` | – | Ursprünge, die das Hilfe-Widget einbetten dürfen (ADR-030), z. B. `https://onescm.example.com`; ohne Angabe nur die eigene Anwendung |
| `APP_VERSION` | Version aus `package.json` | im Container-Image von der Release-Pipeline gesetzt; erscheint in `/api/v1/health` und Traces |

**Integrationen (ADR-028):** API-Tokens (Seite „Integrationen“, Administration) gelten für ein Projekt mit gewählten Rechten: `curl -H "Authorization: Bearer oscm_…" https://handbuch.example.org/api/v1/chapters`. Webhooks senden Ereignisse (z. B. `chapter_version.approved`, `release.published`) als JSON mit `X-Onescm-Event`, `X-Onescm-Delivery`, `X-Onescm-Timestamp` und `X-Onescm-Signature: sha256=<HMAC-SHA256(Geheimnis, "<Zeitstempel>.<Rumpf>")>`; fehlgeschlagene Zustellungen werden bis zu fünfmal wiederholt.

**Kontexthilfe in oneSCM (ADR-030):** Nach Freischaltung unter „Kontexthilfe“ bindet oneSCM das Widget ein – angezeigt wird der Stand des neuesten Releases:

```html
<script src="https://handbuch.example.org/help/widget.js" data-project="p_default" data-language="de" data-role="dealer" defer></script>
<button type="button" data-onescm-help="order.create">Hilfe</button>   <!-- Klick oder F1 im Bereich öffnet die Hilfe -->
```

Server-seitig liefert `GET /api/v1/context-help/order.create?role=dealer&language=en` (API-Token) den freigegebenen Stand samt HTML.

**Releases (ADR-031):** Version setzen, CHANGELOG-Abschnitt schreiben, taggen – die Pipeline baut und veröffentlicht den Rest:

```bash
npm run release -- bump 0.11.0 && $EDITOR CHANGELOG.md && npm run release -- check
git commit -am "Release 0.11.0" && git tag v0.11.0 && git push --follow-tags
docker pull ghcr.io/<owner>/<repo>:0.11.0
cosign verify ghcr.io/<owner>/<repo>:0.11.0 --certificate-identity-regexp '^https://github.com/<owner>/<repo>/.github/workflows/release.yml@' --certificate-oidc-issuer https://token.actions.githubusercontent.com
helm install handbuch oci://ghcr.io/<owner>/charts/onescm --version 0.11.0
```

Mehrere Instanzen sind mit PostgreSQL und `OBJECT_STORE=s3` möglich: Jobs werden per `FOR UPDATE SKIP LOCKED` verteilt, Dateien liegen im gemeinsamen Bucket (ADR-008).

**Kubernetes (ADR-027):** Helm-Chart unter [`deploy/helm/onescm`](deploy/helm/onescm/values.yaml) mit getrennten Deployments für API und Worker, Probes, HPA, PodDisruptionBudget, Ingress und ServiceMonitor:

```bash
kubectl create secret generic onescm-secrets --from-literal=DATABASE_URL=postgres://… --from-literal=METRICS_TOKEN=…
helm install handbuch deploy/helm/onescm --set image.repository=registry.example.org/onescm --set extraEnv.S3_BUCKET=onescm --set extraEnv.OIDC_ISSUER=https://idp.example.org
```

Mehrere Replikate starten gefahrlos gleichzeitig (Migrationen unter PostgreSQL-Sperre).

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

