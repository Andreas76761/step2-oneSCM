# Output

Freigegebene Kapitel je Sprache: `<Sprache>/<Kapitel>/`. Varianten aus der App unter `<Sprache>/Varianten/<Name>/<Kapitel>/`.

Hier liegt der **Handbuchtext je Sprache und Kapitel** (Markdown je Unterkapitel). Fertige Produkte (gesetztes Handbuch, Releaseletter, QuickGuide, Schulungsmaterial usw.) liegen in `05_I_Output/<Produkt>/03_Final/<Sprache>/`. Glossare, Übersetzungsspeicher und Länderreview für beide: `08_IV_Translation/`.

| Ordner | Inhalt | Agent |
|---|---|---|
| `01_Deutsch_DE` | freigegebene deutsche Fassung (Hauptsprache) | uebersetzer-ausgabe (Kopie des freigegebenen Entwurfs) |
| `02_Englisch_EN` … `09_Malaiisch_MS` | Übersetzungen der freigegebenen deutschen Fassung | uebersetzer-ausgabe |

Regeln:
- Übersetzt wird nur, was in `02_Kapitel/<Kapitel>/04_Pruefung_Freigabe/` einen Freigabebeleg hat – immer aus der deutschen Fassung, nie aus einer anderen Übersetzung.
- Dateiname: `<Unterkapitel-Nr>_<Sprachcode>.md`, z. B. `6.2_EN.md`. Kopf jeder Datei: Ausgangsversion, Übersetzungsdatum, Status (`Entwurf – Review offen` / `geprüft durch …`).
- Englische UI-Begriffe bleiben unverändert; Fachbegriffe laut Glossar `08_IV_Translation/<Sprache>/01_Glossar/GLOSSAR.csv`, `SPRACHEN.md` und `00_Dokumentation/BEGRIFFE.md`.
- **Englisch** ist die internationale Fassung ohne marktspezifische Abschnitte.
- **Sprachreview macht das jeweilige Land**, für Englisch alle Länder gemeinsam (Redaktion führt zusammen); erst danach gilt eine Übersetzung als freigegeben (`geprüft durch Markt …`). Stand des Reviews: `08_IV_Translation/<Sprache>/03_Laenderreview/REVIEW.md`.
- Ändert sich die deutsche Fassung, gilt die Übersetzung als veraltet (`STATUS_UEBERSETZUNG.md` je Sprache).
