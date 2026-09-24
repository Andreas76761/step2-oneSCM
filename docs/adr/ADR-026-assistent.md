# ADR-026 Handbuch-Assistent (RAG)

**Status:** akzeptiert, umgesetzt in Etappe 9

## Kontext
Anwenderinnen und Anwender sollen Fragen an das Handbuch stellen können, ohne dass eine KI Inhalte erfindet oder Entwürfe preisgibt.

## Entscheidung
- **Grundlage ausschließlich freigegebene Inhalte:** Absätze freigegebener Kapitelversionen; bei einer anderen Sprache nur freigegebene Übersetzungen (ADR-020). Filter nach Rolle und Sparte wie beim Export (Absätze ohne Zuordnung gelten allgemein).
- **Suche:** hybride Bewertung aus Embedding-Ähnlichkeit (ADR-017) und gemeinsamen Begriffen; höchstens 6 Passagen. Vektoren der Passagen werden je Text-Hash und Modell zwischengespeichert (`passage_embeddings`, Migration `016`).
- **Antwort mit KI** (Anbieter aus ADR-013): Jeder Satz nennt seine Passagen; die Antwort wird wie eine Umformulierung geprüft (Zuordnung, Zahlen, Wortabdeckung, personenbezogene Daten). Nicht belegte Sätze werden verworfen; bleibt nichts übrig, folgen die passenden Handbuchstellen. Die KI darf „keine Aussage“ antworten.
- **Ohne KI:** extraktive Antwort – die passendsten Sätze der besten Passagen, jeweils mit Quelle.
- **Datenschutz:** Fragen mit personenbezogenen Mustern werden nicht an externe Dienste übertragen (422). Passagen mit solchen Mustern gehen weder an einen externen Embedding-Dienst (sie entfallen dann) noch an einen externen KI-Dienst (sie bleiben nur für die extraktive Antwort).
- **Protokoll und Wissenslücken:** Jede Frage wird mit Antwort, Quellen und Modus protokolliert (`assistant_log`); die fragende Person kann bewerten. Fragen ohne Antwort oder mit negativer Bewertung sieht die Redaktion als Wissenslücken.
- **Online-Hilfe** bleibt ohne Skripte (ADR-018); mit `APP_URL` verlinkt sie den Assistenten der Anwendung in der jeweiligen Sprache.

## Konsequenzen
- Antworten sind so gut wie das freigegebene Handbuch; fehlende Inhalte werden sichtbar statt überdeckt.
- Die Prüfung ist formal (Belegbarkeit); die fachliche Richtigkeit ergibt sich aus der Freigabe der zugrunde liegenden Absätze.
