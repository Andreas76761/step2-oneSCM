# ADR-022 Import aus Fremdsystemen

**Status:** akzeptiert, umgesetzt in Etappe 8

## Kontext
Handbuchinhalte liegen nicht nur als Markdown vor, sondern in Confluence, in Word-Dokumenten und in Git-Repositories (Docs-as-Code). Die Pipeline (Revisionen, Identitätserkennung, Klassifikation, Nachweise) soll unverändert für alle Quellen gelten.

## Entscheidung
- **Umwandlung in Markdown beim Import:** HTML/Confluence-Export (`.html`, `.htm`) über `turndown`, Word (`.docx`) über `mammoth` (Formatvorlagen „Überschrift 1/2“ → Kapitel/Unterkapitel). Einzeldatei oder ZIP.
  - Confluence: Seitentitel („Bereich : Seite“) wird Kapitelüberschrift, Seitenüberschriften rücken darunter; Brotkrumen, Fußzeile, Anhänge und die Übersichtsseite (`index.html`, „Available Pages“) entfallen.
  - Tabellen als Pipe-Tabellen, Bilder nur als Alternativtext (`[Bild: …]`), keine Skripte oder aktiven Inhalte. HTML-Zeichensatz laut `meta charset`.
  - Schutz vor Zip-Bomben auch für `.docx` (entpackte Größe).
- **Nachweise beziehen sich auf das erzeugte Markdown** (`storage_key`, Zeilen). Die **Originaldatei** bleibt unter `originals/<sha256>` erhalten (`source_revisions.original_key`, `source_format`; Migration `012`), abrufbar über `GET /source-revisions/{id}/original` (HTML nur als `text/plain`) und Teil des Backups. Die Umwandlung ist deterministisch – ein unveränderter Re-Import wird als „identisch“ erkannt.
- **Git-Quellverbindungen** (`source_connections`): Repository-URL (nur `https`), Branch, Unterordner, Intervall (0 = manuell, 5 … 10080 Minuten).
  - Abgleich als Job `source-sync`: flacher Klon (`--depth 1`), Protokolle außer https gesperrt, keine Hooks, `core.symlinks=false`, symbolische Links werden nicht importiert, eigene leere git-Konfiguration, Zeitlimit.
  - Unveränderter Commit → kein Import; sonst ZIP der Dateien unterhalb des Unterordners durch die normale Pipeline (Pfade relativ zum Unterordner). Der Commit gilt erst nach erfolgreichem Import als abgeglichen; ein fehlgeschlagener Import wird beim nächsten Abgleich wiederholt. Geänderte URL, Branch oder Unterordner setzen den Stand zurück und gleichen sofort neu ab. Gelöschte Dateien bleiben wie bei ZIP-Importen als Quelle erhalten.
  - **Zugangsdaten nie in Datenbank, URL oder Backup:** Token in einer Umgebungsvariable `GIT_CREDENTIAL_*` des Servers, übergeben als HTTP-Header über die Umgebung des git-Prozesses.
  - Periodischer Abgleich über verzögerte Jobs; ein Planungstoken sorgt dafür, dass nur der zuletzt geplante Folgejob wirkt.
  - Verwaltung mit `admin`, manueller Abgleich mit `edit`. Lokale Repositories nur mit `GIT_ALLOW_FILE=1` (Tests).

## Konsequenzen
- Container-Image enthält `git`.
- Bestehende Installationen mit gespeicherter Liste erlaubter Endungen ergänzen `.html`, `.htm`, `.docx` unter „Einstellungen“.
- Confluence-Cloud-API und Webhooks für Push-Ereignisse sind mögliche nächste Schritte.
