# ADR-006 Austauschbare Ähnlichkeits-Engine, Start mit TF-IDF-Kosinus

**Status:** akzeptiert (Entscheidung E-05 vom 24.09.2026)

## Entscheidung
Interface `SimilarityEngine` mit Methode + Version. Etappe 1: TF-IDF-Kosinus über normalisierte Tokens (Kleinschreibung, Umlaut-Normalisierung, deutsche Stoppwörter, einfaches Suffix-Stemming), Kandidatensuche über invertierten Index (vermeidet O(n²) über alle Paare). Jeder Treffer speichert `method`, `score`, `reason` (gemeinsame Schlüsselbegriffe).

## Alternativen
Embedding-Modelle (on-prem, z. B. multilingual-e5) liefern bessere Paraphrasen-Erkennung, erfordern aber Modellbetrieb, Datenschutzfreigabe und Versionierung. Mit E-05 wurde TF-IDF entschieden; ein späterer Wechsel bleibt ohne Schemaänderung möglich. Durch das Interface ist ein Austausch ohne Schemaänderung möglich.
