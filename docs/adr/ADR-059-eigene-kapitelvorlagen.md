# ADR-059 Eigene Kapitelvorlagen

**Status:** akzeptiert, umgesetzt in Etappe 20 (erweitert ADR-055)

## Entscheidung
- Tabelle `chapter_templates` je Projekt (Name eindeutig, auch gegenüber den mitgelieferten Vorlagen). **„💾 Als Vorlage“** in der Kapitelwerkstatt übernimmt Zweck, Voraussetzungen (Listenzeilen), Schritte, Ergebnis und Tipps der gezeigten Version (`POST /chapter-templates` mit `fromVersionId`); alternativ Felder direkt.
- Der Kapitel-Assistent zeigt mitgelieferte und eigene Vorlagen (Kennzeichen „eigene“, `GET /chapter-assistant/templates` mit `builtin`); unter „Eigene Vorlagen“ umbenennen und löschen (`PATCH`/`DELETE /chapter-templates/{id}`, Bearbeitungsrecht). Vorlagen sind projektgebunden.

## Konsequenzen
- Konkrete Begriffe aus dem Kapitel bleiben in der Vorlage stehen; wer „…“-Platzhalter möchte, ersetzt sie nach dem Speichern.
