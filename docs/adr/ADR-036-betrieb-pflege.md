# ADR-036 Betrieb & Pflege: entfernte Quelldateien, SVG, Stammdaten-Import, Erinnerungen

**Status:** akzeptiert, umgesetzt in Etappe 12

## Kontext
Gelöschte Quelldateien blieben bisher „aktuell“, SVG-Grafiken wurden wegen möglicher Skripte abgelehnt (ADR-029), Stammdaten mussten einzeln erfasst werden und überfällige Planung fiel nur beim Hinsehen auf.

## Entscheidung
- **Vollständiger Stand:** Ein ZIP-Import mit `snapshot=true` (Option in der Oberfläche) sowie jeder Abgleich einer Git-/Confluence-Verbindung gilt als vollständiger Stand seiner Herkunft (`imports.origin`: `upload` bzw. `connection:<id>`). Dokumente, deren letzte Revision aus einem vollständigen Stand derselben Herkunft stammt und die jetzt fehlen, werden als **entfernt** markiert (`source_documents.removed_at`, Importprotokoll „entfernt“) und haben keine aktuelle Revision mehr – sie zählen nicht mehr für Analyse, Draft Manual, Generierung und Suche; im Draft Manual sind zugeordnete Schnipsel mit „Quelle entfernt“ markiert. Einzeln hochgeladene Dateien bleiben unberührt; ein Stand ohne Dokumente oder ein vollständig fehlgeschlagener Import entfernt nichts. Wiederherstellen per Knopf oder durch erneutes Auftauchen der Datei.
- **SVG** wird nicht übernommen, sondern aus einer Positivliste von Elementen und Attributen **neu geschrieben**: keine Skripte, `foreignObject`, eingebetteten Bilder, Animationen, Ereignis-Attribute, externen Verweise (nur `#id`), CSS nur als Präsentationseigenschaften ohne externe `url()`. DTDs, Entities und CDATA führen zur Ablehnung, ebenso nicht wohlgeformte Dateien. Auslieferung weiter mit `Content-Security-Policy: sandbox`. Im PDF als Vektorgrafik.
- **Stammdaten-Import** (`POST /master-data/import?kind=abbreviations|glossary|faq`): CSV (Trennzeichen `;`, `,` oder Tab automatisch, UTF-8 oder Windows-1252) oder Excel (erstes Blatt); Kopfzeile mit deutschen oder englischen Spaltennamen. Vorschau zeigt je Zeile neu/aktualisieren/unverändert/Fehler; die Übernahme wendet gültige Zeilen über dieselben Dienste wie die Einzelerfassung an (Validierung, Audit) und meldet fehlerhafte. Vorhandene Einträge werden über Abkürzung, Begriff bzw. Frage (ohne Groß-/Kleinschreibung) erkannt.
- **Erinnerungen:** Ein stündlicher Hintergrundjob meldet überfällige, nicht erledigte Planungseinträge einmal je Termin (`plan_items.reminded_at`, zurückgesetzt bei neuem Termin oder neuer Verantwortung) an die verantwortliche Person (Kennung oder Name eines Benutzers), sonst an die Administratoren des Projekts – als Hinweis im Posteingang mit Link in die Planung, Webhook/E-Mail je Einstellung.
- **Release:** Version 0.11.0 ist das erste Release über die Release-Pipeline (ADR-031): Tag `v0.11.0` auf dem Merge-Stand von `main` setzen (GitHub → Releases oder `git tag`), die Pipeline baut Image, Chart und Release-Notes. Das portable Windows-Paket wird mit jeder Etappe aktualisiert.

## Konsequenzen
- ADR-029 („kein SVG“) ist in diesem Punkt abgelöst.
- Wer Quellen per ZIP nur teilweise hochlädt, darf die Option „vollständiger Stand“ nicht setzen – sonst werden die übrigen Dateien als entfernt markiert (wiederherstellbar).
