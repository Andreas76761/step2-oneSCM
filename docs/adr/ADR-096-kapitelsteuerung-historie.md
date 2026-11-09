# ADR-096 Kapitelsteuerung: Kapitelanweisung, Kapitel ergänzen, Version und Historie abgelöster Funktionen

**Status:** akzeptiert, umgesetzt in Etappe 43 (Auftrag 23.10.2026; nutzt ADR-013, ADR-051, ADR-079, ADR-085, ADR-095)

## Kontext
Die Redaktion will je Kapitel und Unterkapitel kurz festlegen, worauf es ankommt und welche Themen nicht beschrieben werden – als Anweisung mit hohem Vorrang für alle Agenten (App: Generator, KI-Vorschläge, Anleitungs-Check; Arbeitsordner: Claude-Agenten). Fehlende Kapitel und Unterkapitel sollen sich ergänzen lassen, ohne dass zuerst eine Quelle eingelesen wird. Labels und Gliederungspunkte brauchen eine Version („gültig ab“), die im Output erscheint. Werden veraltete Funktionen durch neue ersetzt, soll das Alte nicht verschwinden, sondern nachvollziehbar in einer Historie liegen.

## Entscheidung
- **Kapitelanweisung** an Kapiteln und Unterkapiteln (`instruction`, `instruction_topics`, `instruction_excluded`): kurze Anleitung, wichtige Themen (müssen vorkommen), Themen, die nicht beschrieben werden (je bis 30, 3–80 Zeichen). Das Unterkapitel ergänzt das Kapitel, es hebt nichts auf. Themen gelten als erwähnt, wenn der Wortanfang passt („Kündigung“ findet „Kündigungen“, nicht „Vorkündigung“).
- **Vorrang, aber nach Quellenbindung und Datenschutz:**
  - Generator: Quellen, die ein ausgeschlossenes Thema erwähnen, kommen nicht in den Entwurf (gemeldet als `excludedByInstruction`); wichtige Themen ohne bestätigte Quelle erscheinen als Lücke „Laut Kapitelanweisung wichtig, aber ohne bestätigte Quelle: …“ – die App erfindet nichts.
  - KI-Vorschläge: Anweisung im Systemteil der Anfrage („mit hoher Priorität, die Regeln oben gehen vor“); ohne Anweisung bleibt die Anfrage unverändert.
  - Anleitungs-Check: zusätzlich „Kapitelanweisung eingehalten?“ (ausgeschlossene Themen im Text, fehlende wichtige Themen) – ohne Einfluss auf den Punktwert und ohne Freigabesperre.
  - Werkstatt: Anweisung oben als Hinweis.
  - Arbeitsordner: je Kapitel und Unterkapitel `ANWEISUNG.md`; Grundregel 8 in `CLAUDE.md` und alle Agenten: vor der Arbeit lesen, mit Vorrang befolgen, nur die Grundregeln 1–4 gehen vor. `abgleich --app` übernimmt die Anweisungen der App über die Kapitel- bzw. Unterkapitelnummer; eigene Angaben werden nie überschrieben (App-Fassung als `ANWEISUNG.md.neu`).
- **Kapitel ergänzen:** neue Kapitel und Unterkapitel mit dem Schlüssel wie beim Import (Überschrift ohne Nummer), damit später eingelesene Quellen dazu passen; Einordnung nach Nummer im Titel oder hinter einem gewählten Kapitel.
- **Version:** `valid_from` an Kapiteln, Unterkapiteln und Labels; im Export (Markdown, HTML, PDF, Word) unter der Kapitelüberschrift „Gültig ab …“ – auch in der Lesefassung.
- **Ablösen und Historie:** Kapitel, Unterkapitel oder Label durch einen vorhandenen oder neuen Nachfolger ersetzen (neuer Nachfolger übernimmt die Kapitelanweisung). Das Alte erhält `valid_until` = Version des Nachfolgers, `replaced_by`, `history_at` und einen Eintrag in `structure_history` (Titel zum Zeitpunkt der Ablösung). Es fehlt danach in Kapitelliste, Labelkatalog (ausgeblendet) und Handbuch-Export; der Export enthält den Anhang „Historie: abgelöste Funktionen“. Inhalte werden nicht verschoben – Ausnahme Labels: auf Wunsch werden Chunks, Fragen & Antworten und Bilder auf das neue Label übertragen. Zurückholen macht die Ablösung rückgängig. Labels ablösen nur mit Administration (wie der Labelkatalog).

## Folgen
- Migration `050_chapter_instructions_history.sql`; Tests T-292 … T-294, E2E T-295; Anforderungen NFR-101 … NFR-103; Seite „2 Schreiben › Kapitelsteuerung“.
- Varianten-Kapitel (ADR-034) haben keine eigene Anweisung; sie kommt aus den Kapiteln der Quellen, soweit deren Absätze verwendet werden.
- Im Arbeitsordner wird nichts gelöscht: Ordner abgelöster Kapitel bleiben, der Abgleich meldet sie.
