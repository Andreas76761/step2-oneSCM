# Output

Freigegebene Kapitel je Sprache: `<Sprache>/<Kapitel>/`. Varianten aus der App unter `<Sprache>/Varianten/<Name>/<Kapitel>/`.

| Ordner | Inhalt | Agent |
|---|---|---|
| `01_Deutsch_DE` | freigegebene deutsche Fassung (Hauptsprache) | uebersetzer-ausgabe (Kopie des freigegebenen Entwurfs) |
| `02_Englisch_EN` … `09_Malaiisch_MS` | Übersetzungen der freigegebenen deutschen Fassung | uebersetzer-ausgabe |

Regeln:
- Übersetzt wird nur, was in `02_Kapitel/<Kapitel>/04_Pruefung_Freigabe/` einen Freigabebeleg hat – immer aus der deutschen Fassung, nie aus einer anderen Übersetzung.
- Dateiname: `<Unterkapitel-Nr>_<Sprachcode>.md`, z. B. `6.2_EN.md`. Kopf jeder Datei: Ausgangsversion, Übersetzungsdatum, Status (`Entwurf – Review offen` / `geprüft durch …`).
- Englische UI-Begriffe bleiben unverändert; Fachbegriffe laut `SPRACHEN.md` und `00_Dokumentation/BEGRIFFE.md`.
- Ändert sich die deutsche Fassung, gilt die Übersetzung als veraltet (`STATUS_UEBERSETZUNG.md` je Sprache).
