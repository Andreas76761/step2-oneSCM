# ADR-007 Extraktiver Kapitelgenerator

**Status:** akzeptiert (Entscheidung E-09 vom 24.09.2026)

## Kontext
US-008 verlangt „keine fachlichen Details erfinden“ und Rückverfolgbarkeit jedes Absatzes.

## Entscheidung
Der Generator ordnet ausschließlich bestätigte Quelltexte (Evidenzstatus `source_confirmed`/`manually_confirmed`) den 10 Standardabschnitten zu, entfernt exakte Dopplungen, ersetzt Inhalte, deren Canonical Topic in einem anderen Kapitel liegt, durch Querverweise und verknüpft jeden Block mit seinen Snippets (`content_block_sources`). Abschnitte ohne Quelle erhalten keinen Fülltext, sondern einen sichtbaren Lückenhinweis (Befund `gap`).

## Konsequenzen
Sprachliche Glättung bleibt Redaktionsaufgabe (Kapitelwerkstatt). Eine LLM-Umformulierung kann später als `Rewriter` ergänzt werden, muss aber je Satz Quellen referenzieren und als `generated` (nicht `approved`) markiert bleiben.
