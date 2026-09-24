# ADR-006 Austauschbare Ähnlichkeits-Engine, Start mit TF-IDF-Kosinus

**Status:** vorläufig – abhängig von P0-Entscheidung E-05

## Entscheidung
Interface `SimilarityEngine` mit Methode + Version. Etappe 1: TF-IDF-Kosinus über normalisierte Tokens (Kleinschreibung, Umlaut-Normalisierung, deutsche Stoppwörter, einfaches Suffix-Stemming), Kandidatensuche über invertierten Index (vermeidet O(n²) über alle Paare). Jeder Treffer speichert `method`, `score`, `reason` (gemeinsame Schlüsselbegriffe).

## Alternativen
Embedding-Modelle (on-prem, z. B. multilingual-e5) liefern bessere Paraphrasen-Erkennung, erfordern aber Modellbetrieb, Datenschutzfreigabe und Versionierung – Entscheidung offen (E-05). Durch das Interface ist ein Austausch ohne Schemaänderung möglich.
