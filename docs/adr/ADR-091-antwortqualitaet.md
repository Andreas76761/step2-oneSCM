# ADR-091 Antwortqualität messen: Testfragen mit erwarteten Quellen, Prüfläufe, Kennzahlen

**Status:** akzeptiert, umgesetzt in Etappe 39 (M7 aus [docs/06](../06-plan-onescm-metadaten.md); nutzt ADR-089)

## Kontext
„Frage an alle Quellen“ (ADR-089) soll messbar gut antworten: die richtige Datei finden, sie als Beleg zitieren und bei Fragen ohne Grundlage keine Antwort erfinden. Änderungen an Quellen, Suchparametern oder dem lokalen Modell sollen sich am selben Fragensatz vergleichen lassen. Testfragen aus bestehenden Artefakten (D-08: Wissens-Check, Lückenanalyse) sollen sich übernehmen lassen, ohne Inhalte ins Repository zu legen.

## Entscheidung
- **Testfragensatz** je Projekt mit höchstens 500 Fragen. Je Frage: erwartete Quellen (Teil des Pfads, optional mit Überschrift: „Pfad › Überschrift“), Stichworte für die Antwort und das Kennzeichen **Lückenfrage** (richtig ist „keine Aussage in den Quellen“).
- **Anlegen:** aus CSV oder Excel (Spalten Frage, Erwartete Quelle, Erwartete Überschrift, Stichworte, Keine Antwort; Listen mit „|“), aus JSON, aus gespeicherten Fragen & Antworten (erwartete Quelle = Dateien der gespeicherten Belege) oder leer und von Hand ergänzt.
- **Prüflauf:** jede Testfrage wird genau wie eine Frage an alle Quellen gestellt (gleiche Suche, gleiche Belegprüfung), aber nicht ins Frageprotokoll geschrieben; der Lauf selbst steht im Audit. Gespeichert werden je Frage Rang der ersten erwarteten Quelle unter den sechs gefundenen Stellen, ob die Antwort sie zitiert, Stichwort-Treffer, Antwort und gefundene Stellen, dazu die Suchparameter, das Embedding-Modell, der KI-Dienst und die Zahl der durchsuchten Stellen.
- **Bestanden:** Frage beantwortet, mit erwarteter Quelle als Beleg (sofern angegeben) und mindestens der Hälfte der Stichworte (sofern angegeben); Lückenfrage ohne Antwort.
- **Kennzahlen:** bestanden, Treffer@1/@3/@6 (Trefferquote), MRR, Beleg richtig, Antwortquote, Stichwort-Abdeckung, Lücken richtig, mittlere Zeit je Frage.
- **Vergleich** mit dem vorigen Lauf desselben Satzes: Änderung je Kennzahl und Fragen, die neu bestanden bzw. neu durchgefallen sind. Export eines Laufs als Excel (Kennzahlen und Ergebnisse), CSV oder JSON.
- Seite „oneSCM_Metadaten › Antwortqualität“; Anlegen und Prüfläufe mit dem Recht „Bearbeiten“, Ansehen für alle.

## Folgen
- Migration `046_answer_quality.sql`; Tests T-275 … T-277, E2E T-278; Anforderungen NFR-92, NFR-93.
- Testfragen aus Artefakten (Wissens-Check, Lückenanalyse) werden über die Oberfläche eingelesen und bleiben in der Datenbank der App.
- Die Suchparameter bleiben unverändert (CANDIDATES 20, PASSAGES 6, Mindestrelevanz ADR-089); Anpassungen werden künftig mit Prüfläufen belegt.
