# Datenbankregeln (Zugriffsrechte der gemeinsamen Datenbank)

Die Rollen im Dashboard (Betrachter, Bearbeiter, Administrator, siehe `src/roles.js`) führen die Nutzer in der Oberfläche. **Durchgesetzt werden Rechte nur von der Plattform**, über die Regeln der Fähigkeit `db`, die beim Veröffentlichen des Artifacts gespeichert werden.

## Stand heute

Die gespeicherte Deklaration des Dashboards enthält (Auszug):

```json
"db": { "rules": [
  { "path": "",                  "write": "admin" },
  { "path": "data/users/{self}", "read": "view", "write": "interact" },
  { "path": "versions",          "read": "admin" },
  { "path": "version-docs",      "read": "admin" },
  { "path": "drafts",            "read": "admin" },
  { "path": "drafts/shared",     "read": "view" } ] }
```

Folge: Alles außer dem persönlichen Bereich (`data/users/<eigene Kennung>`) darf **nur ein Administrator** schreiben. Die Sammlungen `actions` (Maßnahmen), `scenarios` (Szenarien) und `audit` (Änderungsprotokoll) können deshalb Bearbeiter ohne Administratorrecht nicht gemeinsam speichern: Maßnahmen melden einen Hinweis, Szenarien fallen auf den lokalen Browser zurück, das Protokoll auf einen lokalen Eintrag.

## Empfohlene Ergänzung

Drei Regeln, die alle lesen und angemeldete Nutzer mit Bearbeiterrecht (`interact`) schreiben lassen:

```json
{ "path": "actions",   "read": "view", "write": "interact" },
{ "path": "scenarios", "read": "view", "write": "interact" },
{ "path": "audit",     "read": "view", "write": "interact" }
```

Was das bewirkt: **Betrachter** (nur Lesen) können weiterhin nichts schreiben; **Bearbeiter** können Maßnahmen, Szenarien und Protokolleinträge anlegen. Ändern und Löschen fremder Einträge schränkt die Oberfläche ein (nur Ersteller oder Administratoren), die Plattform erzwingt das nicht: Regeln gelten je Pfad, nicht je Dokument.

## Strengere Variante (je Nutzer ein eigener Bereich)

Wer auch das Ändern fremder Einträge technisch sperren will, legt Einträge je Nutzer ab (`actions/<Kennung>`) und setzt:

```json
{ "path": "actions",          "read": "view", "write": "admin" },
{ "path": "actions/{self}",   "write": "interact" }
```

Das erfordert eine Änderung des Datenmodells in `src/ma.js` (Dokument je Nutzer statt je Maßnahme) und ist hier nicht umgesetzt.

## Warum die Regeln nicht schon gesetzt sind

Die Deklaration des Artifacts ist ein Gesamtpaket (Fähigkeiten `assets`, `comments`, `db`, `downloads`, `flags`, `mcp`, `room`, `tts`, `user`). Wer sie beim Veröffentlichen neu setzt, muss **alle** Teile nennen; was fehlt, wird entzogen. Die Funktionen `flags` (Funktionsschalter des Dashboard-Typs) und `tts` lassen sich aus dieser Umgebung nicht sicher mitschreiben. Ob das Berechtigungsmenü des Artifacts eine Eingabe für Regeln bietet, ist nicht geprüft. Gesichert ist nur der Weg über eine Veröffentlichung der Deklaration, die für das typbasierte Dashboard von hier nicht möglich war (Werkzeug verlangt eine Seitendatei).

## Weg ohne Regeländerung: Stufe „Editor“

Gemeinsam schreiben darf, wer am Dashboard die Stufe **Editor** (Administrator) hat. Der Eigentümer vergibt sie im Teilen-Menü. Die App zeigt allen anderen den Hinweis „Gemeinsames Speichern ist nur mit der Stufe Editor möglich“. Nachteil: Editoren dürfen auch Seite und Datensätze ändern.

## Prüfen

Nach dem Setzen als Administrator und als Bearbeiter anmelden: Maßnahme anlegen, Szenario für alle speichern, Eintrag im Änderungsprotokoll prüfen; als Betrachter darf nichts gespeichert werden (Schaltflächen gesperrt, Hinweis sichtbar).
