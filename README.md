# oneSCM Handbook Studio

Revisionssichere Webapp, die aus vielen Markdown-Texten ein konsistentes, rollen- und spartenspezifisches oneSCM-Benutzerhandbuch erzeugt.
Grundlage ist das Projektpaket in [`reference/`](reference/) (Masterprompt v1.0 und Referenz-UI).

> **Status: Etappe 1.** Alle P0-Stories sind in einer ersten lauffähigen Ausprägung umgesetzt. **Die P0-Entscheidungen aus Masterprompt §15 sind noch offen.** Die App arbeitet mit vorläufigen, konfigurierbaren Annahmen. Diese sind im Code mit `ANNAHME(E-xx)` markiert und in der UI gelb hinterlegt. Eine fachliche Freigabe dieser Annahmen gibt es noch nicht; siehe [docs/04-offene-entscheidungen.md](docs/04-offene-entscheidungen.md).

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

Mit Docker:

```bash
docker compose up --build      # http://localhost:3000, Daten im Volume onescm-data
```

In der Seitenleiste wählen Sie einen **Demo-Benutzer**. Technische Berechtigungen sind von fachlichen Rollen getrennt (ADR-009):

| Demo-Benutzer | Berechtigungen |
|---|---|
| Redaktion | read, edit |
| Fachprüfung | read, edit, decide |
| Freigabe | read, decide, approve |
| Administration | alle |
| Lesezugriff | read |

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
npm run traceability     # docs/traceability.md neu erzeugen; bricht ab, wenn P0-Stories ohne Test/API sind
npm run typecheck
```

Jeder Test trägt eine ID (`[T-xxx]`), die in [`traceability/tests.json`](traceability/tests.json) den User Stories zugeordnet ist.

## Betrieb

| Variable | Standard | Bedeutung |
|---|---|---|
| `PORT` / `HOST` | `3000` / `0.0.0.0` | HTTP |
| `DATA_DIR` | `./data` | SQLite-Datenbank und Object-Store (Originaldateien, Exporte) |
| `DB_PATH` | `$DATA_DIR/onescm.db` | Datenbankdatei |
| `UPLOAD_MAX_BYTES` | 50 MB | maximale Uploadgröße |
| `ZIP_MAX_FILES` | 5000 | maximale Dateien je ZIP |
| `LOG` | `1` | `0` schaltet das Request-Logging ab |

Sicherheit: Markdown/HTML aus Quellen wird nie ausgeführt (eigener Parser, `react-markdown` ohne Raw-HTML, Rohtext als `text/plain` + `nosniff`). Dazu eine restriktive CSP, Datenschutzblocker vor Export und ein Auditprotokoll (`GET /api/v1/audit-events`).

**Nicht produktionsreif (Etappe 2):** PostgreSQL-Adapter, OIDC statt Demo-Benutzer, persistente Jobqueue (ADR-003, ADR-008, ADR-009).
