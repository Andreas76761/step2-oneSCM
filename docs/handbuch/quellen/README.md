# Quellen: RAG-Batches

`rag-batches/` enthält die 1315 automatisch erzeugten Teiltexte (RAG-Batch 1 bis 1315), jeweils aus einer Auswahl von Tickets. Sie sind Quellmaterial für die Handbuchkapitel, nicht freigegebener Handbuchtext.

Die Zuordnung der 3713 Textabschnitte zu den Handbuchkapiteln erfolgt per Schlüsselwortanalyse (`docs/dashboard/quelltexte_index.json`, erzeugt von `docs/dashboard/src/classify.py`) und ist im Dashboard unter „Quelltexte je Gliederung“ je Kapitel einsehbar. Die Zuordnung ist ein Vorschlag und redaktionell zu prüfen; Abschnitte ohne ausreichende Treffer stehen unter „Ohne Zuordnung“.

Die redaktionell überarbeiteten Texte der Batches 1 bis 5 stehen in `../zuordnung-batch-01-05.md`.
