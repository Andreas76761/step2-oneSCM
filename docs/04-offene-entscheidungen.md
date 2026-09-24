# 4. Offene Widersprüche und P0-Entscheidungen

> **Keine der folgenden Entscheidungen ist fachlich getroffen.** Die Spalte „Vorläufige Annahme“ beschreibt, womit Etappe 1 technisch arbeitet. Jede Annahme ist im Code mit `ANNAHME(E-xx)` markiert und – wo möglich – über `Einstellungen` bzw. Umgebungsvariablen konfigurierbar. Eine fachliche Freigabe wird nirgends behauptet.

## 4.1 Widersprüche im Auftrag

| ID | Widerspruch | Fundstellen | Vorläufige Behandlung |
|---|---|---|---|
| W-01 | „Datenschutzprüfung“ ist P1, aber Datenschutzblocker sind Teil des P0-Qualitätsgates und Pflichttest | §5 vs. US-012, §13, §16 | Datenschutzmuster-Prüfung in Etappe 1 umgesetzt |
| W-02 | „Freigabeworkflow“ ist P1, aber „Fachliche Freigabe ist protokolliert“ ist P0 | §5 vs. US-012 | einstufige, protokollierte Freigabe in Etappe 1; mehrstufiger Workflow P1 |
| W-03 | „Versionsvergleich“ ist P2, aber „Frühere Versionen können verglichen werden“ ist P0 | §5 vs. US-009 | Block-Versionsvergleich P0, Kapitelversionsvergleich P2 |
| W-04 | „kombinierte Suche und Filter“ und „gefilterter Export“ sind P1, aber Pflichttests | §5 vs. §16 | in Etappe 1 umgesetzt |
| W-05 | Rolle „Markt“ vs. Dimension „Markt“ (Market-Entität) – gleicher Begriff für fachliche Rolle und Gültigkeitsbereich | §2, §9 | getrennt: Rolle `market` (🌍 Markt), Dimension `market_code` (z. B. `DE`) |
| W-06 | Referenz-UI („MD Content Studio v1.3“) nutzt andere Navigation, Status (`übernehmen/Widerspruch/überarbeiten`, `offen/freigegeben/verworfen`) und Pfade (`/api/upload`, `/api/analysis`) | REFERENZ_UI.png vs. §10, §14 | Masterprompt ist verbindlich; Referenz-UI nur als visuelle Vorlage (Layout, Karten, Tabellen, Schwellen-Slider) |
| W-07 | Bearbeitungsmodus `approved` auf Blockebene vs. Regel „veröffentlichte Versionen sind unveränderlich“ auf Versionsebene | §8, §9 | Freigabe erfolgt je Kapitelversion; beim Freigeben erhalten alle Blöcke den Modus `approved`; danach 409 bei Änderung |
| W-08 | US-008 „nur bestätigte Quellen“ vs. §15 „Empfehlung als vorläufige Annahme verwenden“ – Klassifikationen sind initial alle unbestätigt, Generierung wäre ohne manuelle Bestätigung leer | US-008, §15 | Generierung nutzt nur Snippets mit Evidenzstatus `source_confirmed`/`manually_confirmed`; Demo-Daten enthalten Front-Matter (→ `source_confirmed`); Snippets lassen sich in „Quellen“ bestätigen |
| W-09 | Story-IDs US-011, US-013…019 fehlen | §4 | vorläufige Vergabe, siehe `traceability/requirements.json` (E-14) |

## 4.2 P0-Entscheidungen (entscheidungspflichtig nach §15)

| ID | Gruppe | Offene Frage(n) | Vorläufige Annahme (Etappe 1) | Konfigurierbar über |
|---|---|---|---|---|
| E-01 | Importformate, Limits, Teilfehler, Revisionslogik | Erlaubte Endungen? Max. Größe? ZIP-Tiefe? Verhalten bei Teilfehlern? Wann ist eine Revision „identisch“? | `.md`, `.markdown`, `.zip`; max. 50 MB Upload, 5 000 Dateien, 20 MB entpackt je Datei; Teilfehler → Status `completed_with_errors`, andere Dateien werden übernommen; identisch = gleicher SHA-256 wie letzte Revision desselben Pfads | `UPLOAD_MAX_BYTES`, `ZIP_MAX_FILES`, Einstellungen `import.*` |
| E-02 | Markdown-Mapping, Snippet-Granularität | Absatz- oder Satzebene? Listen als ein Snippet? Tabellen? | Absatz, Liste, Tabelle, Codeblock, Zitat je ein Snippet; H1 = Kapitel, H2 = Unterkapitel, H3–H6 = `heading_path`; Kapitelidentität über normalisierten H1-Titel (projektweit) | Code (`domain/markdown.ts`) |
| E-03 | Rollenzuordnung, Konfidenz, Freigabeberechtigung | Ab welchem Score gilt eine Zuordnung? Wer darf bestätigen/freigeben? | Schlüsselwortregeln, Score 0,5–0,9; automatische Zuordnung bleibt `unconfirmed`; bestätigen: Berechtigung `edit`; freigeben: Berechtigung `approve` | Einstellungen `classification.*`, Demo-Benutzer |
| E-04 | Spartenliste, Icons, automatische Ableitung | Ist die Liste abschließend? Ableitung aus Pfad/Dateiname zulässig? | Liste gemäß §2; Ableitung aus Pfad/Dateiname erlaubt, aber stets `unconfirmed` | `domain/reference.ts` |
| E-05 | Semantisches Verfahren, Schwellenwerte | Embedding-Modell? On-Prem? Schwellen? | TF-IDF-Kosinus (`tfidf-cosine-1.0`), Clusterschwelle 0,55, Dopplung 0,85, Widerspruchskandidat 0,40 (vgl. Referenz-UI 40 %/55 %) | Einstellungen `analysis.*` |
| E-06 | Globale Cluster und Canonical Topics | Wer legt das führende Kapitel fest? Automatischer Vorschlag? | Vorschlag = Kapitel mit höchster Snippet-Anzahl im Cluster; Festlegung nur manuell mit Begründung | – |
| E-07 | Blockerdefinition, Widerspruchsentscheidungen | Welche Befunde blockieren? | Blocker: Negation, Pflicht/Optional, abweichende Zahl/Frist, Datenschutz; `high`: Zuständigkeit; `medium`: Rollen/Sparten/Markt/Release-Unterschied, veraltete Quelle | Einstellungen `analysis.blockerRules` |
| E-08 | Zulässige Evidenzstatus | Vollständige Liste und Semantik? | `source_confirmed` (Front-Matter der Quelle), `manually_confirmed`, `unconfirmed`, `open_question` | `domain/reference.ts` |
| E-09 | Kapitelstruktur, Styleguide | Ist die 10-teilige Struktur fix? Zuordnung von Inhalten zu Abschnitten? | Struktur fix nach §6; Zuordnung per Heuristik (Überschrift/Schlüsselwort/Listentyp); Generator ist extraktiv und formuliert nicht um | `domain/generator.ts` |
| E-10 | Schutz manueller Änderungen, Aufbewahrung | Aufbewahrungsdauer? Darf Regenerierung manuelle Blöcke ersetzen? | Manuelle/gesperrte Blöcke werden bei Regenerierung übernommen, nie ersetzt; betroffene Blöcke werden `needs_regeneration`, wenn sich Quellen ändern; keine Löschung (Soft-Delete), unbegrenzte Aufbewahrung | – |
| E-11 | Verbindliche Icons, Barrierefreiheit | WCAG-Level? Emoji oder SVG? | Emoji gemäß §2 + Textlabel + Farbe; Ziel WCAG 2.2 AA (Kontrast, Tastatur, `aria-label`) | `domain/reference.ts` |
| E-12 | Qualitätsgates, Freigeberrollen, Ausnahmen | Vier-Augen? Ausnahmegenehmigung? | Gate gemäß US-012; einstufige Freigabe; keine Ausnahmen möglich | – |
| E-13 | Traceability-Ebenen, Tests, Status, Nachweise | Welche Ebenen? Nachweisformat? | Story ↔ API-Operation ↔ Test ↔ Doku ↔ Release; Nachweis = Testdatei + CI-Lauf | `traceability/*.json` |
| E-14 | Story-IDs für P1/P2 | Welche IDs? | US-011 Evidenzansicht, US-013 Optimierungsdashboard, US-014 gefilterter Export, US-015 Terminologie, US-016 Freigabeworkflow, US-017 Suche/Filter, US-018 Datenschutzprüfung, US-019 Versionsvergleich | `traceability/requirements.json` |
| E-15 | Authentifizierung | IdP? Rollenmodell? | Demo-Benutzer, Auswahl in der UI, Header `X-User-Id`; Berechtigungen `read`, `edit`, `decide`, `approve`, `admin` | `users`-Tabelle |
