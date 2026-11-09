# ADR-093 Varianten einer Maske und Klickstrecke aus Screenshots

**Status:** akzeptiert, umgesetzt in Etappe 41 (optionale Funktionen F-22, F-24 aus [docs/07](../07-bestehende-artefakte.md); nutzt ADR-029, ADR-041, ADR-085, ADR-092)

## Kontext
Dieselbe Maske gibt es als Screenshot in mehreren Fassungen – Deutsch und Englisch, für Händler und Markt, für Pkw und Van, je Markt. Kapitel verweisen auf eine Fassung; Exporte, Handbuch-Varianten und Übersetzungen sollen die passende zeigen (F-22). Klickstrecken entstehen bisher nur aus Text (ADR-041); das Screenarchiv baut sie aus echten Screenshots mit parallelen Wegen 3a/3b (F-24).

## Entscheidung
- **Variantengruppe (F-22):** Bilder derselben Maske werden im Bildarchiv verknüpft (`media_meta.variant_group`, Kennung = Basis-Bild der Gruppe); Gruppen werden beim Verknüpfen zusammengeführt, beim Lösen bleibt keine Ein-Bild-Gruppe übrig. Prüfregel „variant_duplicate“: zwei Varianten mit gleicher Sprache, Rolle, Sparte und Markt.
- **Passende Fassung je Ausgabe:** Beim Export (Rolle, Sparte, Markt der Auswahl bzw. Handbuch-Variante; Sprache Deutsch), bei Releases (Deutsch und je Übersetzungssprache) und beim Export einer Übersetzung (deren Sprache) wird jeder Bildverweis mit Variantengruppe auf die passendste Fassung umgestellt: eine andere Sprache bzw. ein anderer Markt ist ausgeschlossen, gleiche Sprache zählt am meisten, dann Markt, Rolle und Sparte (eigene vor „alle“, ausdrücklich andere zählt negativ); marktspezifische Fassungen nur, wenn der Markt gefragt ist. Bei Gleichstand bleibt die verwendete Fassung. Kapiteltexte selbst ändern sich nicht.
- **Deckungsmatrix:** zusätzliche Zeilenart „je Maske (Varianten)“ – zeigt, welche Variante einer Maske fehlt (ADR-092).
- **Klickstrecke aus Screenshots (F-24):** 2–12 Stationen aus Bildern des Archivs, je Station 1–3 Bilder; mehrere Bilder sind parallele Wege und heißen 3a, 3b, 3c. Gezeichnet wird serverseitig ein PNG (Vorschaubilder mit Nummernkreis, Beschriftung, Pfeile über einen Knoten je Lücke, Umbruch nach 2–6 Stationen je Zeile) mit Roboto aus pdfmake – auch ohne Systemschriften. Das Bild liegt im Archiv (Bildunterschrift „Klickstrecke: Titel“) mit erzeugtem Alternativtext „Klickstrecke Titel: 1 … → 2a … oder 2b … → 3 …“. Gezeichnet wird jeweils die aktuelle Fassung der Screenshots; jede Änderung wird eine neue Fassung desselben Bildes (F-21), Verweise folgen. Das Löschen der Definition lässt das Bild bestehen.

## Folgen
- Migration `048_variants_clickpaths.sql`; Tests T-284 … T-286, E2E T-287; Anforderungen NFR-97, NFR-98.
- Weiter optional: F-10 (Prüferprofile mit lokalem Modell), F-11 (Grammatikprüfung); „später“: F-19, F-31.
