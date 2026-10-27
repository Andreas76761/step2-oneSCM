# I Output – fertige Produkte

Hier entstehen die Endtexte mit Screenshots – je Produktart ein Ordner. Grundlage sind ausschließlich **freigegebene Kapitel** aus `02_Kapitel` (bzw. `03_Varianten`); neue fachliche Aussagen entstehen hier nicht.

| Ordner | Produkt |
|---|---|
| `01_Handbuch` | gesetztes Gesamthandbuch bzw. Handbuchteile (DOCX/PDF) |
| `02_Releaseletter` | Änderungen je Release für die Anwender |
| `03_QuickGuide` | Kurzanleitung je Rolle (1–2 Seiten) |
| `04_Schulungsmaterial` | Folien, Übungen, Trainerunterlagen |
| `05_Interne_Dokumente` | interne Unterlagen für Redaktion, HQ und IT |
| `06_Videos` | Drehbücher, Untertitel, Sprechertexte |
| `07_Grafiken` | Schaubilder, Infografiken |
| `08_Prozesse` | Prozessbeschreibungen und -diagramme |

Je Produkt:

| Ordner/Datei | Inhalt |
|---|---|
| `PRODUKT.md` | Zweck, Zielgruppe/Rollen, Quellen, Format, Qualitätskriterien, Statustabelle |
| `01_Entwurf/` | Entwürfe `<Kurzname>_Entwurf_vN.<ext>` |
| `02_Screens/` | Screenshots des Produkts (aus `03_Bilder` der Kapitel, aufbereitet nach `06_II_Stil_und_Design`) |
| `03_Final/<Sprache>/` | freigegebene Endfassung je Sprache; `01_Deutsch_DE` ist der Master |

## Abgrenzung zu `04_Output`

| | `04_Output` | `05_I_Output` |
|---|---|---|
| Inhalt | Handbuchtext je Unterkapitel (Markdown) | fertige Produkte nach Art (gesetzt, mit Screenshots) |
| Gliederung | Sprache × Kapitel | Produkt × Arbeitsschritt, Endfassung je Sprache |
| Ausgangsbasis | freigegebener Entwurf aus `02_Kapitel` | freigegebene Kapitel, deutscher Master |

**Regel für Übersetzungen:** Übersetzt wird immer aus dem deutschen Master über `08_IV_Translation` (Glossar, Übersetzungsspeicher, Länderreview). Kapiteltexte landen in `04_Output/<Sprache>/<Kapitel>/`, fertige Produkte in `05_I_Output/<Produkt>/03_Final/<Sprache>/`. Ein Produkt wird nie aus einer anderen Übersetzung erstellt.

## Ablauf

1. **Planen:** `PRODUKT.md` ausfüllen (Zweck, Zielgruppe, Quellen mit Kapitel und Freigabestand).
2. **Entwerfen:** „ausgabe-produzent: QuickGuide Dealer“ – Entwurf aus freigegebenen Kapiteln nach `STIL_UND_DESIGN.md` und `TONALITAET.md`.
3. **Lektorat:** „sprach-lektor: 03_QuickGuide“ – Grammatik, Synonyme, Fehlerliste.
4. **Freigeben:** ein Mensch trägt die Freigabe in die Statustabelle von `PRODUKT.md` ein; der ausgabe-produzent legt die Endfassung nach `03_Final/01_Deutsch_DE/`.
5. **Übersetzen:** „uebersetzer-ausgabe: QuickGuide Dealer, alle Sprachen“ – über `08_IV_Translation` nach `03_Final/<Sprache>/`.

Ändert sich ein zugrunde liegendes Kapitel, gilt das Produkt als veraltet (Statustabelle).
