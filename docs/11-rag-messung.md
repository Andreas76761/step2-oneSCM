# 11 RAG-Komponente: Test, Methoden und Messung (Etappe 46)

Stand: 24.10.2026, Version 0.46. Gegenstand ist „Frage an alle Quellen“ (oneSCM_Metadaten, ADR-089) – die Suche nach Belegen und die Antwort daraus. Entscheidung und Aufbau: [ADR-099](adr/ADR-099-rag-retrieval-v2.md).

## 11.1 Vorgehen

1. **Messaufbau:** `apps/server/scripts/rag-bench.ts` mit dem fiktiven Messbestand `apps/server/scripts/fixtures/rag-benchmark.ts`.
   - 10 Dokumente, darunter eine ältere Fassung mit gleichem Abschnitt, ein Jira-Ticket, Rollen, Abrechnung mit Fehlercodes.
   - 6 Terminologie-Einträge mit Synonymen und englischen Übersetzungen, 3 Abkürzungen.
   - Alle Inhalte sind erfunden.
2. **Fragentypen:** direkt, Umschreibung, Synonym, Kompositum, Abkürzung, Kennung (Fehlercode, Ticket), Englisch auf deutsche Quellen, Lückenfrage (keine Antwort in den Quellen).
3. **Zwei Fragensätze:**
   - **Abstimmungssatz** (36 Fragen): Mit ihm wurde v2 entwickelt und eingestellt.
   - **Prüfsatz** (22 Fragen): danach geschrieben. Er wurde **einmal** zur Fehleranalyse genutzt (Ergebnis: Wortarten gewichten, englische Füllwörter). Danach wurde nur noch gemessen.

   Die Zahlen des Prüfsatzes sind deshalb die ehrlichere Schätzung.
4. **Kennzahlen:**

   | Kennzahl | Bedeutung |
   |---|---|
   | bestanden | Lückenfrage ohne Antwort; sonst Antwort mit passendem Beleg und mindestens der Hälfte der Stichworte |
   | Treffer@1/@6 | erwartete Stelle an erster Stelle bzw. unter den ersten sechs |
   | MRR | mittlerer reziproker Rang der erwarteten Stelle |
   | nDCG@6 | wie weit oben die passenden Stellen stehen (1 = ideal) |
   | Beleg richtig | Antwort belegt mit einer erwarteten Stelle |
   | Stichworte | Anteil der erwarteten Stichworte in der Antwort |
   | Enthaltung | Lückenfragen ohne Antwort |
   | Dubletten | gleiche Texte unter den Belegen |
   | Laufzeit | Dauer je Frage |

   Gemessen wird ohne KI (extraktive Antwort, reproduzierbar) und mit den lokalen Embeddings (`local-hash-384`).

## 11.2 Recherche: professionelle Methoden

| Methode | Kern | Übernommen |
|---|---|---|
| Hybride Suche BM25 + Vektor | Begriffs- und Bedeutungssuche scheitern an unterschiedlichen Stellen; BM25 findet exakte Kennungen (Fehlercodes, Produktnamen), die Vektoren verwischen | ja – BM25 je Begriff statt Wortanteil |
| Reciprocal Rank Fusion (k = 60) | Ranglisten nur über die Position verbinden – keine Abstimmung unterschiedlicher Punkteskalen nötig | ja |
| Contextual Retrieval | jedem Abschnitt vor dem Index Kontext voranstellen; senkt die Fehlerquote der Suche deutlich, vor allem zusammen mit BM25 und Reranking | lokal als **Kontextkopf** (Dateiname und Überschriftenpfad, doppelt gewichtet) – ohne KI-Aufruf, Daten bleiben lokal |
| Reranking der Kandidaten | breite Suche, dann genauer neu ordnen | ja – nach gewichteter Begriffsabdeckung; ein neuronaler Reranker wäre ein lokaler Zusatzdienst (offen) |
| Zerlegung deutscher Komposita | im Deutschen vor allem für die Trefferquote (Recall) wichtig; Teile und Ganzes indexieren | ja – Zerlegung gegen das Vokabular des Bestands, dazu Wortteil-Suche |
| Abfrageerweiterung | Synonyme und Übersetzungen ergänzen | ja – aus Terminologie und Abkürzungen des Projekts |
| Maximal Marginal Relevance | Belege nach Relevanz und Verschiedenheit wählen, Redundanz senken | ja (λ = 0,75), dazu Ausschluss nahezu gleicher Texte |
| Bewertung Suche und Antwort getrennt | Trefferquote/MRR/nDCG für die Suche, Beleg- und Stichwortprüfung für die Antwort; Testsätze laufend im CI | ja – nDCG@6 im Prüflauf, Qualitäts-Tor als Test T-306 |

Quellen der Recherche (Sekundärquellen; Zahlen zur Contextual Retrieval nicht gegen das Original geprüft):
- [Boundev: Contextual Retrieval](https://www.boundev.ai/blog/contextual-retrieval-rag-cut-failure-rate)
- [getcoai: Anthropic Contextual Retrieval](https://getcoai.com/news/anthropic-introduces-contextual-retrieval-to-boost-accuracy-of-rag-systems)
- [Towards AI: Hybrid Search mit BM25 und RRF](https://pub.towardsai.net/how-to-build-hybrid-search-for-rag-in-python-bm25-vectors-and-reciprocal-rank-fusion-c47b7bed75dd)
- [Field Guide to AI Memory: Hybrid Retrieval](https://www.memoryplugin.com/wiki/hybrid-retrieval.html)
- [Braschler 2004: Stemming and Decompounding](https://srv-clst-301-data66.zhaw.ch/bitstream/11475/4169/2/2004_Braschler_How%20Effective%20is%20Stemming%20and%20Decompounding%20_Information%20Retrieval.pdf)
- [Bitext: Decompounding für Vektorsuche und RAG](https://www.bitext.com/blog/german-korean-retrieval-fails-without-proper-decompounding/)
- [DF-RAG: Query-Aware Diversity (arXiv 2601.17212)](https://arxiv.org/abs/2601.17212v1)
- [Zimaspace: MMR gegen redundante Belege](https://shop.zimaspace.com/blogs/tech-ai-hub/maximal-marginal-relevance-reduce-redundant-rag-evidence)
- [Maxim: RAG Evaluation Guide 2025](https://www.getmaxim.ai/articles/complete-guide-to-rag-evaluation-metrics-methods-and-best-practices-for-2025/)
- [dev.to: RAG-Kennzahlen Faithfulness, Context Precision](https://dev.to/dublecc/rag-evaluation-metrics-guide-2026-faithfulness-context-precision-and-how-to-score-a-pipeline-46gi)

## 11.3 Ergebnis

| Kennzahl | Abstimmung v1 | Abstimmung v2 | Prüfsatz v1 | Prüfsatz v2 |
|---|---|---|---|---|
| bestanden | 53 % | **89 %** | 77 % | **82 %** |
| Treffer@1 | 61 % | **81 %** | 78 % | 78 % |
| Treffer@6 | 71 % | **97 %** | 83 % | 83 % |
| MRR | 0,65 | **0,88** | 0,81 | 0,81 |
| nDCG@6 | 0,67 | **0,90** | 0,81 | 0,81 |
| Beleg richtig | 65 % | **97 %** | 78 % | **83 %** |
| Stichworte | 58 % | **90 %** | 78 % | **83 %** |
| Enthaltung bei Lückenfragen | 20 % | **80 %** | 75 % | 75 % |
| Dubletten unter den Belegen | 3 | **0** | 0 | 0 |
| Laufzeit je Frage (10 Dokumente) | 1,8 ms | 2,8 ms | 2,3 ms | 3,1 ms |

Je Fragentyp (bestanden, v1 → v2):

| Fragentyp | Abstimmung | Prüfsatz |
|---|---|---|
| direkt | 7 → 8 von 8 | 4 → 4 von 4 |
| Umschreibung | 2 → 5 von 5 | 2 → 3 von 3 |
| Synonym | 2 → 4 von 4 | 2 → 1 von 2 |
| Kompositum | 2 → 3 von 5 | 4 → 4 von 4 |
| Abkürzung | 2 → 3 von 3 | 2 → 2 von 2 |
| Kennung | 2 → 3 von 3 | 0 → 1 von 1 |
| Englisch | 1 → 2 von 3 | 0 → 0 von 2 |
| Lückenfrage | 1 → 4 von 5 | 3 → 3 von 4 |

**Laufzeit bei großem Bestand:** Lasttest mit 2 000 Dokumenten (`scripts/perf-metadata.mjs`, gleiche Umgebung, je 20 Fragen).
- v1: Median 210 ms, p95 295 ms.
- v2: Median 206 ms, p95 253 ms.
- Die erste Frage nach einem Import baut den Index auf: ca. 1,3 s.

## 11.4 Bewertung und Grenzen

- **Größter Gewinn:**
  - Umschreibungen, Synonyme, Abkürzungen, Kennungen und Komposita.
  - Die begründete **Enthaltung**: v1 beantwortete Lückenfragen meist mit einem einzelnen gemeinsamen Wort, v2 nennt unbekannte Fachbegriffe („in den Quellen nicht gefunden: SAP“).
- **Prüfsatz ehrlich gelesen:**
  - v2 liegt vorn, aber nur um eine Frage (82 % gegen 77 %). Die großen Sprünge des Abstimmungssatzes sind teilweise auf diesen Satz zugeschnitten.
  - v2 löst zwei Fragen, an denen v1 scheitert: „Wie behebe ich E-4711?“ (Kennung) und „Was brauche ich für die Anmeldung?“ (Satzauswahl).
  - Eine Frage ist durch v2 schlechter geworden: „Kann ein Autohaus Preise freigeben?“ enthält sich, weil „Autohaus“ in den Quellen nicht vorkommt und in der Terminologie nicht mit „Dealer“ verbunden ist.
  - Beide Verfahren scheitern an den zwei englischen Fragen und an der Lückenfrage „Wie storniere ich eine Schulung?“: „stornieren“ ist in der Terminologie ein Synonym von „kündigen“, und „Schulung“ steht in den Quellen.
- **Englisch auf deutsche Quellen** bleibt die Grenze des lexikalischen Verfahrens: Übersetzt wird nur, was in der Terminologie steht („contract“ → Vertrag).
  - Abhilfe: ein **lokales mehrsprachiges Embedding-Modell** (z. B. bge-m3 über Ollama) mit `EMBEDDINGS_LOCAL=true`. Die Daten bleiben auf dem Rechner (ADR-099).
  - Nicht messbar in dieser Umgebung (kein Modell-Download).
- **Kein Ersatz für Fachwissen:** Bedeutungsgleichheit ohne gemeinsame Wörter („nicht genehmigt“ = „abgelehnt“) erkennt v2 nur über Terminologie-Einträge oder ein semantisches Modell.
- **Regressionsschutz:** T-306 bricht ab, wenn v2 im Abstimmungssatz unter 85 % bzw. im Prüfsatz unter 80 % fällt, schlechter als v1 wird, die Enthaltung sinkt oder Dubletten auftauchen.

## 11.5 Messung wiederholen

```bash
cd apps/server
npx tsx scripts/rag-bench.ts v1,v2              # Abstimmungssatz
npx tsx scripts/rag-bench.ts v1,v2 --holdout    # Prüfsatz
npx tsx scripts/rag-bench.ts v2 --md bericht.md # Bericht als Markdown
```

Am eigenen Bestand: oneSCM_Metadaten › **Antwortqualität** → Testfragensatz → Verfahren v1 bzw. v2 → „Prüflauf starten“. Der Vergleich zeigt die Änderung je Kennzahl, auch nDCG@6.
