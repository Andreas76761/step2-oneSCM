# ADR-099 RAG-Retrieval v2: deutsche Morphologie, Abfrageerweiterung, BM25 + Vektor per RRF, Relevanzschwelle, MMR

**Status:** akzeptiert, umgesetzt in Etappe 46 (erweitert ADR-089 „Frage an alle Quellen“, ADR-091 „Antwortqualität“, ADR-017 Embeddings)

## Kontext
„Frage an alle Quellen“ suchte bisher (v1) so:
- Gewichtung aus Wortanteil (Stämme, 5-Zeichen-Präfixe) und lokalem Hash-Embedding.
- Mindestanteil 30 % der Fragewörter.
- Neugewichtung über Überschriften und Wortpaare.

Ein Messbestand (docs/11) zeigte die Schwächen:
- Umschreibungen, Synonyme (Händler/Dealer) und Abkürzungen (MO) wurden selten gefunden.
- Komposita (Kündigungsfrist ↔ Frist … gekündigt) und Kennungen wie E-4711 fielen durch: Die Ziffern wurden nicht indexiert.
- Englische Fragen auf deutsche Quellen scheiterten.
- Lückenfragen wurden meist beantwortet (nur 20 % Enthaltung).
- Ältere Fassungen desselben Abschnitts standen als Dubletten unter den Belegen.

Daten müssen lokal bleiben (M-01). Cloud-KI für kontextuelle Chunks, Cloud-Embeddings und Modell-Downloads sind ausgeschlossen.

## Entscheidung

**Neues Modul `domain/retrieval.ts`** („v2“, Standard; v1 bleibt wählbar)

**Analyse**
- Stämme mit Varianten:
  - Partizip ge…t → Stamm (gekündigt → kündig);
  - ohne End-t (prüft → prüf);
  - Umlaut gefaltet (Gründe ↔ Grund).
- Trennbare Verben aus der Frage: „lege … an“ → anlegen.
- Kennungen wie E-4711 oder ONESCM-1234 als ein Token; Zahlen ab drei Stellen werden indexiert.
- Abkürzungen in Großbuchstaben bleiben trotz Kürze erhalten.
- Komposita werden gegen das Vokabular des Bestands zerlegt (Fugen-s/-es/-n), Teile und Ganzes indexiert.
- Für Fragewörter ohne Treffer: Suche als Wortteil eines Kompositums – Kopf, oder Schwanz mit bekanntem Kopf davor (Fahrzeug → Fahrzeugmodell, Grund → Kündigungsgrund, nicht Über|sicht).
- Bei Verben zusätzlich ohne Vorsilbe (bezahlen → Zahlungsziel), bei Partikelverben die Wortfamilie (zurücknehmen → zurück…).
- Kleine Liste unregelmäßiger Formen (gilt → gelten/gültig).

**Abfrageerweiterung**
- Quellen: aktive Begriffe der Terminologie (bevorzugt, zu vermeiden, Übersetzungen je Sprache) und Abkürzungen des Projekts.
- Ein Eintrag greift, wenn alle seine Wörter in der Frage stehen. Mehrteilige Einträge („payment term“) bilden ein Konzept.
- Erweiterungen zählen mit 0,85, Kompositumteile mit 0,8, Wortteil-Treffer mit 0,7.

**Suche**
- **BM25 je Konzept** (k1 = 1,2, b = 0,75): je Fragewort zählt der beste seiner Begriffe, Varianten werden nicht doppelt gezählt.
- Kontextkopf = Dateiname und Überschriftenpfad, doppelt gewichtet. Das ist eine lokale Form von Contextual Retrieval.
- Vektorähnlichkeit für die 200 besten nach BM25 (kleine Bestände: alle) mit Kontextkopf. Abfragetext = Frage plus Erweiterungen.
- **Reciprocal Rank Fusion** (k = 60) der beiden Listen.
- Neugewichtung der besten 30: 0,4 RRF + 0,45 Abdeckung + 0,15 Überschriftenabdeckung.

**Relevanzschwelle (Enthaltung)**
- IDF-gewichtete Abdeckung der Konzepte, Mindestwert 0,6.
- Unbekannte **Substantive**, Abkürzungen und Kennungen zählen voll. Die deutsche Großschreibung ist das Signal; bei englischen Fragen zählen alle Inhaltswörter gleich.
- Verben und Adjektive zählen halb, allgemeine Wörter („Zeit“) und Fragewörter gar nicht.
- Ohne Beleg über der Schwelle gibt es keine Antwort; die Oberfläche nennt die unbekannten Begriffe.

**Auswahl**
- **MMR** (λ = 0,75) über die Wortmengen der Belege.
- Texte mit Jaccard ≥ 0,9 zu einem gewählten Beleg entfallen (ältere Fassungen).

**Antwort ohne KI**
- Sätze der besten vier Belege nach Abdeckung. Der Satz zählt im Zusammenhang seiner Überschrift: Passt sie, tragen auch die ersten Schritte.
- Bei Mengen-, Dauer- und Zeitfragen werden Sätze mit Zahl bevorzugt.

**Mit KI**
- Die Frage erhält den Hinweis „In den Quellen auch: …“ mit den Erweiterungen, damit Händler/Dealer zugeordnet wird.
- Satzprüfung und Quellenbindung bleiben.

**Index-Zwischenspeicher**
- Je Bestand und Rahmen gibt es einen Schlüssel aus Chunk-IDs, Teilstücken und Textlängen; höchstens 6 Indizes werden gehalten.
- Neue Revisionen ergeben neue Chunk-IDs und damit einen neuen Index.

**Antwortqualität**
- Prüflauf mit `method` (v1/v2) und **nDCG@6** je Frage und gesamt, auch im Vergleich mit dem vorigen Lauf.
- Konfiguration im Lauf: RRF-k, Mindestabdeckung, MMR-λ.

**Lokale Dienste**
- `LLM_LOCAL=true` bzw. `EMBEDDINGS_LOCAL=true` erklären einen OpenAI-kompatiblen Dienst als intern, z. B. Ollama mit einem mehrsprachigen Embedding-Modell wie bge-m3.
- Das gilt **nur**, wenn die Basis-URL auf diesen Rechner oder ein privates Netz zeigt (Loopback, 10/8, 172.16/12, 192.168/16, .local).
- Dann entfallen die Datenschutz-Sperren für externe Dienste, denn die Daten verlassen die Umgebung nicht.
- Ohne Schalter bleibt jeder OpenAI-kompatible Dienst „extern“.

**Messung und Regressionsschutz**
- `scripts/rag-bench.ts` mit fiktivem Messbestand, Abstimmungs- und Prüfsatz (docs/11).
- Test T-306 hält Mindestwerte fest.

## Folgen
- Am Abstimmungssatz steigt „bestanden“ von 53 % auf 89 %, am Prüfsatz von 77 % auf 82 %.
- Lückenfragen: 80 % statt 20 % Enthaltung (Abstimmungssatz). Die Laufzeit bei 2 000 Dokumenten bleibt gleich (Median ca. 210 ms).
- Die erste Frage nach einem Import baut den Index auf (ca. 1,3 s bei 2 000 Dokumenten).
- Die Schwelle kann sich bei Fragen mit unbekanntem Fachbegriff zu früh enthalten, z. B. „Autohaus“ ohne Terminologie-Verknüpfung zu „Dealer“.
  - Abhilfe ist die Pflege der Terminologie, die zugleich die Abfrageerweiterung speist.
  - Für den Vergleich bleibt v1 wählbar (`method: v1` in Frage und Prüflauf).
- Englisch auf deutsche Quellen und Bedeutungsgleichheit ohne gemeinsame Wörter brauchen ein semantisches Modell. Der Weg dahin ist ohne Cloud offen (lokaler Dienst), aber in dieser Etappe nicht gemessen.
- Offen bleiben ein lokaler neuronaler Reranker (Cross-Encoder) als Zusatzdienst und eine Treueprüfung (Faithfulness) der KI-Antworten über die Satzprüfung hinaus.
