# ADR-007 Extraktiver Kapitelgenerator

**Status:** akzeptiert (Entscheidung E-09 vom 24.09.2026)

## Kontext
US-008 verlangt „keine fachlichen Details erfinden“ und Rückverfolgbarkeit jedes Absatzes.

## Entscheidung
Der Generator ordnet ausschließlich bestätigte Quelltexte (Evidenzstatus `source_confirmed`/`manually_confirmed`) den 10 Standardabschnitten zu, entfernt exakte Dopplungen, ersetzt Inhalte, deren Canonical Topic in einem anderen Kapitel liegt, durch Querverweise und verknüpft jeden Block mit seinen Snippets (`content_block_sources`). Abschnitte ohne Quelle erhalten keinen Fülltext, sondern einen sichtbaren Lückenhinweis (Befund `gap`).

## Konsequenzen
Sprachliche Glättung bleibt Redaktionsaufgabe (Kapitelwerkstatt). Seit Etappe 5 gibt es eine optionale KI-Umformulierung je Absatz ([ADR-013](ADR-013-ki-umformulierung.md)): nur als Vorschlag, jeder Satz mit Quelle, Übernahme durch die Redaktion (Modus `ai_rewritten`); der Generator selbst bleibt extraktiv.
