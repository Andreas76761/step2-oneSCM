# ADR-010 Traceability aus OpenAPI und Test-Registry

**Status:** akzeptiert

## Entscheidung
Quelle der Wahrheit:
- Anforderungen: `traceability/requirements.json`
- API-Operationen: `openapi/openapi.yaml` (`x-requirements` je Operation)
- Tests: `traceability/tests.json` (Test-ID → Stories → Datei); jede Test-ID kommt im Testnamen vor (`[T-xxx]`), ein Test prüft die Konsistenz.
- Dokumentation: `documentation` je Anforderung in `requirements.json`
- Release: `package.json` Version

`GET /api/v1/traceability` erzeugt daraus die Matrix als JSON, CSV, Markdown oder XLSX. Ein API-Test stellt sicher: jede P0-Story hat ≥1 Test, jede Operation ≥1 Story.
