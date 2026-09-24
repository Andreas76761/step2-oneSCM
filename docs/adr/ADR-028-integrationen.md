# ADR-028 Integrationen & API

**Status:** akzeptiert, umgesetzt in Etappe 10

## Kontext
oneSCM, CI-Systeme und Redaktionswerkzeuge sollen das Handbook Studio ohne Benutzeranmeldung ansprechen, auf Ereignisse reagieren und Quellen automatisch nachziehen – ohne dass Geheimnisse im Klartext gespeichert oder interne Netze erreichbar werden.

## Entscheidung
- **API-Tokens je Projekt** (`api_tokens`, Migration `018`): `Authorization: Bearer oscm_…`. Gespeichert wird nur der SHA-256; der Klartext erscheint einmal bei der Erstellung. Scopes sind höchstens die Rechte der erstellenden Person, Laufzeit 1–365 Tage, Widerruf sofort wirksam. Tokens gelten nur für ihr Projekt, haben keinen Zugriff auf die Projektverwaltung und können keine weiteren Tokens anlegen; in archivierten Projekten nur lesend. `last_used_at` wird höchstens alle 5 Minuten geschrieben.
- **Ausgehende Webhooks** (`webhook_subscriptions`, `webhook_deliveries`): Ereignisse aus dem Audit (Import, Analyse, Generierung, Freigabe-Workflow, Release, Übersetzung, Quellverbindung, Befund) werden in derselben Transaktion als Zustellung eingeplant. Zustellung über die persistente Jobqueue mit bis zu 5 Versuchen und exponentiellem Abstand; Protokoll je Zustellung, „ping“ und erneute Zustellung. Signatur `X-Onescm-Signature: sha256=HMAC(Geheimnis, "<Zeitstempel>.<Rumpf>")` mit `X-Onescm-Timestamp` (Schutz vor Wiedereinspielung, Toleranz 5 Minuten).
- **SSRF-Schutz:** nur `https`, keine Zugangsdaten in der URL, keine Weiterleitungen, Ziele werden per DNS aufgelöst und private, Loopback- und Link-Local-Adressen abgelehnt – bei Anlage und vor jeder Zustellung. `INTEGRATIONS_ALLOW_INSECURE=1` hebt das nur für Tests und abgeschottete Netze auf.
- **Push-Webhooks für Git-Verbindungen:** öffentlicher Endpunkt `/api/v1/hooks/source-connections/{id}`; GitHub (`X-Hub-Signature-256` über den Rohrumpf) oder GitLab (`X-Gitlab-Token`). Unbekannte Verbindung und falsche Signatur sind nicht unterscheidbar (401). Nur Pushes auf den verbundenen Branch planen einen Abgleich (ADR-022).
- **Confluence Cloud:** Verbindungsart `confluence` mit Bereichsschlüssel; Seiten über die REST-API (Speicherformat, Paginierung auf demselben Host), Zugang über `CONFLUENCE_CREDENTIAL_*` („E-Mail:API-Token“ → Basic, sonst Bearer). Stand = Hash über Seiten- und Anhangversionen; unverändert → kein Import. Die Seiten laufen als HTML durch die normale Importpipeline (ADR-022).

## Konsequenzen
- Maschinenzugriffe sind nachvollziehbar (Audit mit Token-Kennung) und einzeln widerrufbar.
- Empfänger müssen Signatur und Zeitstempel prüfen; Zustellungen sind „mindestens einmal“ (Empfänger idempotent über `X-Onescm-Delivery`).
