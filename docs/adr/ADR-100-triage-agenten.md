# ADR-100 Agent TRIAGE mit Pflichtlabels und Kapitelzuordnung, Detaillevel, Agenten in der App (ORCHESTRATOR, GOAL)

**Status:** akzeptiert, umgesetzt in Etappe 47 (erweitert ADR-079 Labels, ADR-082 Domänen, ADR-095 Kapitelanweisung, ADR-098 Arbeitsbereiche, ADR-099 Retrieval v2)

## Kontext
Eingangsdateien mischen oft Inhalte verschiedener Domänen und Kapitel, Allgemeines und Ausnahmen – etwa eine Schulungsunterlage mit Abschnitten zu Vertrag anlegen, Kündigung und Abrechnung. Bisher landete jeder Chunk im Kapitel seiner Datei (H1). Labels wurden von Hand vergeben, und der Generator übernahm alles, was im Kapitel lag.

Gewünscht:
- Nach dem Einlesen ordnet ein Agent jeden Text den Pflichtlabels und dem passenden Kapitel bzw. Unterkapitel zu. Er darf neue Unterkapitel mit Kennung „neu“ anlegen.
- Die Labels steuern die Dokumentation: HappyPath zeigt den Standardablauf, Edge die Ausnahmen.
- Je Kapitel lässt sich die Detaillierung einstellen.
- Ein Dashboard zeigt Chunks, Labels und Wörter je Kapitel und Domäne.
- Agenten sind in der App sichtbar, mit Aufgaben, offenen Todos und Entscheidungen.
- Ein Orchestrator steuert alle Agenten, GOAL vergleicht mit dem Ziel.

Daten bleiben lokal (M-01): keine Cloud-KI.

## Entscheidung

**Pflichtlabels:** neun Gruppen im Labelkatalog, jede mit fester Auswahl.

| Gruppe | Werte |
|---|---|
| Version | Release/PI/Version aus Quelle oder Text, sonst „offen“; fehlende Versionen legt TRIAGE als Label an |
| Status | live, Entwurf, in Bearbeitung |
| Domäne | Domänen des Projekts, sonst „Allgemein“ |
| Rolle | Dealer, MO, Market, HQ, Sonstiges |
| Sprache | de, en … |
| Sparte | Pkw, Van, Pkw+Van |
| Markt | Ländercode oder „alle“ |
| Detaillevel | Basis, Basis+, Zusatz, Intern, HappyPath, Edge, inPrüfung |
| zu prüfen | zu prüfen, geprüft |

**TRIAGE** (`domain/triage.ts`, `services/triage.ts`) läuft als Job nach jedem Einlesen (Einstellung `triage.auto`, Standard an) und auf Anforderung (alle Chunks oder nur Chunks ohne Pflichtlabels).
- Die Erkennung ist regelbasiert und lokal. Sie nutzt Quellangaben (Front-Matter, Markt, Release, Evidenz, Jira-Status), den Text und den Überschriftenpfad.
- Jedes Label hat eine Sicherheit und eine Begründung. Liegt eine Gruppe unter 0,5, kein Kapitel passt sicher oder ist ein neues Unterkapitel nötig, wird der Chunk „zu prüfen“.
- Labels setzt TRIAGE direkt mit Herkunft `triage`. Hat ein Mensch in einer Gruppe ein Label vergeben, bleibt diese Gruppe unberührt. Eigene Labels ersetzt TRIAGE bei einem neuen Lauf. Setzt ein Mensch ein Label, das TRIAGE schon vergeben hat, gilt es danach als von Hand gesetzt.
- **Zuordnung** über die Suchmorphologie von ADR-099: Abdeckung des Kapitel- und Unterkapiteltitels im Chunk (mit Kontextkopf), Schwelle 0,6. Möglich sind nur Kapitel der Gliederung, also nummerierte oder in der Kapitelsteuerung angelegte, ohne Sammelkapitel.
  - Passt ein Unterkapitel: Vorschlag „verschieben“.
  - Passt nur das Kapitel und die Überschrift des Chunks nennt ein eigenes Thema: Vorschlag „neues Unterkapitel“.
  - Passt nichts: „nicht zugeordnet“, zu prüfen.
- Zuordnungen sind **Vorschläge**. Übernehmen, Verwerfen und „alle übernehmen“ (Berechtigung edit) verschieben den Chunk. Ein neues Unterkapitel trägt `triage_new` (Kennung „neu“), bis ein Mensch es bestätigt.
- Übernommene Zuordnungen merkt sich TRIAGE über den normalisierten Text. Nach einem erneuten Import schlägt sie dieselbe Zuordnung wieder vor.

**Detaillevel steuern die Erzeugung**
- Je Kapitel `detail_levels`. Standard: alle außer Intern und inPrüfung.
- Der Generator lässt Chunks anderer Level weg und meldet sie als `excludedByDetail`. Chunks ohne Detaillevel bleiben.
- Edge-Chunks kommen in den Abschnitt „Fehlerbehebung“, HappyPath bleibt im Standardablauf.

**Inhalts-Dashboard:** Chunks, Wörter und Label-Zuordnungen je Kapitel und Domäne, Anteil je Pflichtgruppe, Detaillevel, offene Vorschläge, Unterkapitel „neu“.

**Labels löschen** (admin): Die Zuordnungen zu Chunks, Fragen & Antworten und Bildern werden entfernt. Katalog-Labels werden als gelöscht vermerkt, damit der Katalogabgleich sie nicht wieder anlegt.

**Agenten in der App** (`services/agents.ts`): Katalog aus ORCHESTRATOR, TRIAGE, GOAL und den Agenten des Arbeitsordners.
- **Aufgaben:** offene Todos je Agent mit Priorität, Status und Herkunft (Orchestrator, GOAL, von Hand).
- **Entscheidungen:** Frage mit Antwortmöglichkeiten. Entscheiden darf nur, wer die Berechtigung „decide“ hat.
- **ORCHESTRATOR** – „Plan erstellen / verfeinern“:
  1. Getroffene Entscheidungen ausführen, die er selbst umsetzen kann: Triage-Vorschläge übernehmen oder verwerfen, neue Unterkapitel aufnehmen. „einzeln prüfen“ bleibt bei der Redaktion.
  2. Aus dem Stand Aufgaben mit Schlüssel planen, ohne Doppelungen: Triage, zu prüfen, Unterkapitel „neu“, fehlender HappyPath oder Edge je Kapitel, Kapitel ohne Freigabe, produktive Pipeline-Einträge, Antwortqualität, Ziel-Abgleich.
  3. Entscheidungen vorlegen.
  4. Beim nächsten Lauf verfeinern: geänderte Aufgaben anpassen, wieder aufgetretene neu öffnen, entfallene schließen. Verworfene bleiben verworfen.
- **GOAL:** Ziel und zehn Kriterien mit Sollwert, je Projekt einstellbar. Der Abgleich speichert Ist, Soll, erfüllt, Empfehlung und zuständigen Agenten. Nicht erfüllte Kriterien werden Aufgaben des Agenten (Schlüssel `goal:<Kriterium>`), erfüllte schließen ihre Aufgabe.

**Arbeitsordner:** neuer Hauptordner `12_Goal` (`ZIEL.md`, `ABGLEICH.md`, `EMPFEHLUNGEN.md`) und `00_Dokumentation/Agenten` (`AUFGABEN.md`, `ENTSCHEIDUNGEN.md`, `TRIAGE.md`).
- Neue Agenten `orchestrator`, `triage` und `goal`; Grundregel 10 „Pflichtlabels, Mensch geht vor“.
- `abgleich --app` holt `/agents/export` (Dateien mit Hash-Regel, `.neu` bei eigenen Änderungen) und legt für neue Unterkapitel der Triage Ordner `neu_<Titel>` an.

## Begründung
- Regelbasierte Erkennung ist nachvollziehbar (Begründung je Label), lokal und ohne Trainingsdaten. Wo sie unsicher ist, entscheidet ein Mensch: „zu prüfen“, Vorschläge statt Verschiebungen.
- Die Zuordnung nutzt dieselbe Morphologie wie die Suche, damit Komposita und Flexion konsistent behandelt werden.
- Der Orchestrator plant aus messbarem Stand und schließt Aufgaben selbst, sobald die Bedingung entfällt. Entscheidungen trifft nie ein Agent. Das gilt auch für offene P0-Entscheidungen und Begriffe, die bewusst nicht im Katalog stehen.

## Folgen
- Neue Tabellen `triage_runs`, `triage_results`, `agent_tasks`, `agent_decisions`, `agent_goals`, `goal_runs` (Migration 053).
- Neue Spalten: `metadata_chunk_labels.origin` und `.confidence`, `chapters.detail_levels`, `subchapters.triage_new`.
- Die Domänenkarte (ADR-082) zählt nur Label-Paare von Menschen. Die Zugriffsmatrix ignoriert die Rolle „Sonstiges“.
- Die Erkennung ist auf deutsch- und englischsprachige Texte ausgelegt. Weitere Sprachen erkennt sie als „de“/„en“ oder gar nicht (offene Entscheidung „weitere Sprachen“).
- Eine Zuordnung über ein lokales Sprachmodell oder Embeddings (z. B. Ollama, ADR-099) ist möglich, sobald die offene Entscheidung zum lokalen Dienst getroffen ist.
