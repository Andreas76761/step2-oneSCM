# 6. Plan: oneSCM_Metadaten – RAG über alle Quelldateien

> **Status: entschieden am 23.10.2026, Etappe M1 umgesetzt (v0.27.0, [ADR-079](adr/ADR-079-onescm-metadaten.md)).**
> Der Auftraggeber hat die Annahmen M-01 … M-10 übernommen, mit drei Änderungen: Die Daten bleiben lokal, die Labels sind vordefiniert (100 Stück, darunter ein Gliederungsvorschlag für das Handbuch, Rollen und die Navigation im System), Sprachen sind Deutsch und Englisch (Abschnitt 6.7). Im Code sind die Stellen mit `ENTSCHEIDUNG(M-xx)` markiert.

## 6.1 Ziel

Ein eigener Bereich **„oneSCM_Metadaten“** in der App. Er liest Dateien im Format DOCX, PPTX, HTML, PDF und MP4 ein. Texte, Bilder und gesprochene Inhalte werden in kleine Abschnitte (Chunks) zerlegt, indexiert und **je Überschrift** angezeigt. Über eine Fragemaske lassen sich Fragen an alle Quellen stellen. Jede Antwort nennt **Quelldatei, Fundstelle und den Auszug (Chunk)**. Fragen und Antworten sowie Chunks lassen sich **mit Labels speichern**. Doppelte Inhalte werden erkannt.

## 6.2 Was das Handbook Studio schon mitbringt (Wiederverwendung)

| Baustein | Vorhanden in | Nutzung für oneSCM_Metadaten |
|---|---|---|
| Upload, Importjobs, Revisionen, SHA-256-Dubletten | `services/imports.ts`, Tabellen `imports`, `source_documents`, `source_revisions` | unverändert, Formate werden erweitert |
| Umwandlung HTML/DOCX → Markdown samt Bildern | `domain/convert.ts` (mammoth, turndown), `media_assets` | Basis für den Text-Extraktor |
| Chunks je Überschrift (H1/H2/`heading_path`) | `domain/markdown.ts`, Tabelle `text_snippets` | Chunk-Modell; wird um Seite/Folie/Zeitmarke ergänzt |
| Embeddings (lokal oder OpenAI-kompatibel), HNSW/pgvector | `embeddings.ts`, `services/vectorIndex.ts`, `snippet_embeddings` | Indexierung ohne neue Infrastruktur |
| Volltextindex | `services/searchIndex.ts` | hybride Suche (Schlüsselwort + Vektor) |
| Dopplungen, Cluster, Widersprüche | `services/analysis.ts`, `pages/Duplicates.tsx` | Dublettensuche über alle Formate |
| Assistent mit Quellen je Satz, Prüfung der Belege | `services/assistant.ts`, `domain/assistant.ts`, `llm.ts` | RAG-Antwort; heute nur über **freigegebene Kapitel** → wird auf **Quellen-Chunks** erweitert |
| Berechtigungen, Projekte, Audit, Jobqueue | `auth.ts`, `jobs.ts`, `audit_events` | unverändert |

**Entscheidung (M-01):** oneSCM_Metadaten ist ein **Modul innerhalb der bestehenden App** (eigener Bereich in der Navigation), keine zweite App.

## 6.3 Ablauf (Pipeline)

```
 ① Ablage           ② Extraktion          ③ Chunking            ④ Indexierung         ⑤ Frage           ⑥ Ausgabe
 Upload/Ordner  →  Text, Bild, Ton   →  je Überschrift,    →  Embedding +       →  hybride Suche  →  Antwort + Quelle
 (Rohdatei,         → Markdown mit       300–800 Zeichen,     Volltext +           + Re-Ranking      + Chunk-Auszug,
 SHA-256)           Fundstellen          Überlappung          Dublettenprüfung     + LLM             Labels speichern
```

### ① Ablage der Inputdaten
- Upload in der Oberfläche (einzeln, mehrere, ZIP) oder ein **Eingangsordner** (`data/inbox/<projekt>/`), der stündlich bzw. per Knopf abgeglichen wird.
- Rohdatei unverändert im Objektspeicher (lokal oder S3, vorhanden über `storage.ts`), Prüfsumme SHA-256 → identische Dateien werden nicht doppelt verarbeitet.
- Metadaten je Datei: Name, Format, Größe, Hochlader, Datum, Sprache, frei wählbare Labels.

### ② Extraktion je Format

| Format | Text | Struktur / Überschriften | Bilder | Fundstelle |
|---|---|---|---|---|
| DOCX | mammoth (vorhanden) | Formatvorlagen Überschrift 1–6 | eingebettete Bilder → `media_assets` | Überschrift + Absatz |
| HTML | turndown (vorhanden) | `h1`–`h6` | `img` | Überschrift + Anker |
| PPTX | XML der Folien (jszip, vorhanden) | Folientitel = Überschrift, Folie = Unterabschnitt; Sprechernotizen | Folienbilder | Foliennummer |
| PDF | Textebene (pdf.js) | Lesezeichen bzw. Schriftgröße als Überschrift | Seitenbilder; gescannte Seiten per OCR (M-05) | Seitenzahl |
| MP4 | Transkription (M-04) | Kapitelmarken bzw. Themenwechsel/Zeitblöcke à ~2 Min. | Standbilder je Szene (optional) | Zeitmarke `mm:ss` |

Bilder: Alternativtext aus der Quelle; optional **Bildbeschreibung per KI** (M-05), damit Diagramme und Screenshots durchsuchbar werden.

### ③ Chunking
- Grundlage bleibt die Überschriftenstruktur: H1 → Kapitel, H2 → Unterkapitel, tiefer → `heading_path`.
- Zielgröße 300–800 Zeichen, lange Absätze an Satzgrenzen geteilt, 1 Satz Überlappung; Tabellen und Listen bleiben ganz.
- Jeder Chunk speichert: Quelldatei, Revision, Überschriftenpfad, Fundstelle (Seite/Folie/Zeitmarke/Zeile), Format, Text, Hash, Labels.

### ④ Indexierung
- Volltextindex (vorhanden) + Embedding je Chunk (vorhanden, Anbieter nach M-03).
- **Dublettenprüfung** nach jedem Import: exakt (Hash), fast gleich (Kosinus ≥ 0,85, vorhanden) und formatübergreifend (z. B. gleiche Folie in PPTX und PDF).
- Neuindexierung nur für geänderte Dateien.

### ⑤ Fragestellung (RAG)
1. Frage → hybride Suche (Volltext + Vektor) über alle Chunks, Filter nach Datei, Format, Überschrift, Label.
2. Top-20 → Re-Ranking → Top-6 Chunks als Kontext.
3. LLM antwortet **nur aus diesen Chunks**, jeder Satz mit Beleg `[n]`. Die vorhandene Belegprüfung (`checkSentences`) verwirft Sätze ohne Beleg.
4. Ohne KI-Dienst: extraktive Antwort (beste Chunks) – vorhanden.

### ⑥ Ausgabe
- Antwort mit nummerierten Belegen; Klick auf einen Beleg öffnet Quelldatei, Fundstelle und Chunk-Auszug (bei MP4 mit Sprung zur Zeitmarke).
- **„Frage & Antwort speichern“** mit Labels, Notiz und Bewertung; Liste aller gespeicherten Fragen und Antworten, filterbar und als CSV/Excel/JSON exportierbar.

## 6.4 Oberfläche (Menüpunkt „oneSCM_Metadaten“)

Umgesetzt in M1: **Übersicht**, **Chunks** (je Überschrift oder Tabelle, Labels einzeln und gesammelt), **Fragen & Antworten** (speichern mit Quellen und Labels) und **Labels**. Seit Etappe 32 (vorgezogen aus M3/M4): **Gliederungs-Vorschlag je Chunk**, **Kapitel ↔ Quellen**, **Wissensnotizen**, Zielkapitel je Dopplung und Ausschlussliste ([ADR-084](adr/ADR-084-gliederung-wissen.md)). Seit Etappe 33: **Bildarchiv** mit Bildnummer, Merkmalen, Versionen und Platzhaltern sowie Quick Guide, One Pager und Lesefassung ([ADR-085](adr/ADR-085-bilder-ausgabe.md)). Etappe 34 = **M2**: **Einlesen** von PowerPoint und PDF mit Fundstelle je Folie bzw. Seite ([ADR-086](adr/ADR-086-pptx-pdf-fundstellen.md)). Eingelesen wird bis M2 über „Quellen“, Dopplungen zeigt bis M4 die vorhandene Seite „Dopplungen“.

| Seite | Inhalt |
|---|---|
| **Einlesen** | Drag & Drop für mehrere Dateien/ZIP, Fortschritt je Datei (extrahiert → gechunkt → indexiert), Fehler je Datei, Eingangsordner abgleichen |
| **Quellen je Überschrift** | Baum: Datei → Überschrift → Chunks; alternativ **alle Quellen zusammengeführt je Überschrift** (gleiche Überschrift aus mehreren Dateien nebeneinander); Formatsymbol, Fundstelle, Vorschau |
| **Chunks** | Tabelle mit Suche und Filtern (Format, Datei, Überschrift, Label, ohne Label); Mehrfachauswahl → Labels setzen/entfernen |
| **Dopplungen** | Paare und Gruppen gleicher oder fast gleicher Chunks, Ähnlichkeit in %, nebeneinander mit markierten Unterschieden; „führende Fassung“ festlegen oder „kein Duplikat“ |
| **Fragen** | Eingabefeld, Filter für Quellen, Antwort mit Belegen, Quelldatei und Auszug; Speichern mit Labels |
| **Gespeicherte Fragen & Antworten** | Liste mit Labels, Suche, erneut fragen (Antwort mit neuem Stand vergleichen), Export |
| **Labels** | Labels anlegen, umbenennen, einfärben, zusammenführen; getrennt für Chunks und Fragen/Antworten |

Gestaltung wie die bestehende App (Karten, Tabellen, Dunkelmodus, WCAG 2.2 AA).

## 6.5 Agenten

### 6.5.1 Agenten in der App (Laufzeit, als Jobs in der vorhandenen Jobqueue)

| Agent | Aufgabe | Eingabe → Ausgabe |
|---|---|---|
| **Ingest-Agent** | Dateien annehmen, Prüfsumme, Format erkennen, Rohdatei ablegen | Datei → `source_revision` |
| **Extraktions-Agent** | Text/Struktur je Format, Bilder, OCR, Transkription | Rohdatei → Markdown mit Fundstellen + Bilder |
| **Chunking-Agent** | Überschriftenbaum, Chunks mit Fundstelle | Markdown → Chunks |
| **Index-Agent** | Embeddings, Volltext, Neuindexierung | Chunks → Index |
| **Dubletten-Agent** | exakte, ähnliche und formatübergreifende Dopplungen | Index → Dublettengruppen |
| **Label-Agent** (optional) | Labels für neue Chunks vorschlagen (nie automatisch bestätigt) | Chunk → Labelvorschlag |
| **Antwort-Agent** | Suche, Re-Ranking, Antwort mit Belegen, Belegprüfung | Frage → Antwort + Belege |

### 6.5.2 Entwicklungs-Agenten (Claude Code, `.claude/agents/`)

| Agent | Verantwortet |
|---|---|
| `metadaten-architekt` | Datenmodell, Migrationen, ADRs, Schnittstellen (OpenAPI) |
| `metadaten-extraktion` | Extraktoren DOCX/HTML/PPTX/PDF/MP4, Fundstellen, Tests mit Beispieldateien |
| `metadaten-rag` | Chunking, Indexierung, Dubletten, Antwort-Agent, Bewertung der Antwortqualität |
| `metadaten-ui` | Seiten aus 6.4 in `apps/web` |
| `metadaten-pruefer` | Tests, Typprüfung, Lint, E2E, Traceability, Review vor jedem Push |

## 6.6 Etappen

| Etappe | Inhalt | Ergebnis |
|---|---|---|
| M1 ✅ | Datenmodell (Chunk-Fundstelle, Labels, gespeicherte Fragen), 100 vordefinierte Labels, ADR-079, Menübereich | Chunks labeln, Fragen und Antworten speichern, Labelkatalog |
| M2 ✅ | Extraktoren PPTX und PDF (Text), DOCX/HTML erweitert um Fundstellen; Seite „Einlesen“ – umgesetzt in Etappe 34 ([ADR-086](adr/ADR-086-pptx-pdf-fundstellen.md)) | alle Textformate einlesbar |
| M3 ✅ | Chunking je Überschrift, Seite „Quellen je Überschrift“ und „Chunks“ mit Labels – Rest umgesetzt in Etappe 35 ([ADR-087](adr/ADR-087-teilstuecke-ueberschriften.md)): Teilstücke statt Umbau der Textabschnitte | Daten sichtbar und labelbar |
| M4 ✅ | Indexierung, Seite „Dopplungen“ (formatübergreifend) – umgesetzt in Etappe 36 ([ADR-088](adr/ADR-088-dubletten-formatuebergreifend.md)) | Dublettensuche |
| M5 ✅ | Fragen mit Belegen über alle Quellen, Fragen & Antworten speichern mit Labels – umgesetzt in Etappe 37 ([ADR-089](adr/ADR-089-fragen-alle-quellen.md)) | RAG nutzbar |
| M6 | MP4-Transkription, Bildbeschreibung/OCR (nach M-04/M-05) | Video und Bilder durchsuchbar |
| M7 | Qualität: Testfragen mit erwarteten Quellen, Kennzahlen (Trefferquote), Feinschliff | messbare Antwortqualität |

Jede Etappe endet mit Tests, Traceability, Changelog und Pull Request.

## 6.7 Entscheidungen (23.10.2026)

| ID | Frage | Entscheidung |
|---|---|---|
| M-01 | Modul in der bestehenden App oder eigenständige App? | Modul in der bestehenden App |
| M-02 | Welcher KI-Dienst für Antworten? Dürfen Inhalte die eigene Umgebung verlassen? | **Daten bleiben lokal.** Antworten extraktiv oder über ein lokal betriebenes, OpenAI-kompatibles Sprachmodell (z. B. Ollama, `LLM_PROVIDER=openai` mit lokaler `LLM_BASE_URL`); keine Cloud-Dienste |
| M-03 | Embeddings lokal oder als Dienst? | lokal (Standard `local`, oder ein lokal betriebenes Embedding-Modell) |
| M-04 | MP4: Transkription lokal oder Cloud? Untertitel? | lokal mit whisper.cpp; vorhandene Untertitel (SRT/VTT) bevorzugt |
| M-05 | Bilder: Alternativtext, OCR oder KI-Bildbeschreibung? | Alternativtext + lokale OCR für gescannte Seiten |
| M-06 | Labels: feste Liste oder frei? | **vordefiniert** – seit Etappe 28 153, seit Etappe 30 158 Labels in neun Gruppen nach echtem oneSCM ([ADR-080](adr/ADR-080-katalog-onescm-datenschutz.md), Contract Management 3.1–3.5: [ADR-082](adr/ADR-082-zuordnung-domaene-ordner.md)); ursprünglich 100 Labels in sechs Gruppen – Handbuch-Gliederung (30), Rollen (10), Navigation im System (25), Inhaltstyp (15), Sparte (5), Qualität und Status (15); gemeinsam für Chunks und Fragen/Antworten; Pflege durch die Administration |
| M-07 | Dublette: ab welcher Ähnlichkeit? Formatübergreifend? | ≥ 85 %, formatübergreifend |
| M-08 | Mengengerüst, Sprachen? | < 2 000 Dateien, < 10 GB; **Deutsch und Englisch** |
| M-09 | Wer darf einlesen, labeln, fragen? | `edit` einlesen, labeln, Antworten speichern; `read` lesen und fragen; `admin` Labels pflegen |
| M-10 | Betrieb? | wie bisher (Docker/Helm) |
