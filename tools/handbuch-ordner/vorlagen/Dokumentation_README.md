# Arbeitsweise – oneSCM-Benutzerhandbuch (Stand {{STAND}})

## Vom Eingang zum freigegebenen Kapitel

1. **Dateien ablegen:** neue Unterlagen nach `01_Input/01_Eingang/` (DOCX, PPTX, PDF, HTML, XLSX, MP4 mit Untertitel, Bilder).
2. **Sortieren:** „input-sortierer: Eingang verarbeiten“ – Raw-Jahr (2023–2027), Kapitel, Unterkapitel; Datenschutzfunde und Unsicheres unter „Zu entscheiden“ in `INPUT_PROTOKOLL.md`.
3. **Übersetzen:** „uebersetzer-de: Kapitel 6“ – englische Quellen erhalten eine deutsche Fassung `dt_<Original>` daneben.
4. **Steuern:** „steuerung: Kapitel 6“ – wer braucht was (Dealer, MO, Markt, HQ, IT), was ist markt- oder spartenspezifisch.
5. **Schreiben:** „kapitel-redakteur: Unterkapitel 6.2“, „bild-redakteur: Kapitel 6“, „faq-redakteur: Kapitel 6“.
6. **Lektorat:** „sprach-lektor: Kapitel 6“ – Grammatik, Synonyme, Tonalität; Funde in `07_III_Grammatik_Synonyme_Fehlerliste/03_Fehlerliste/FEHLERLISTE.csv`.
7. **Prüfen:** „pruefer: Kapitel 6“ – Bericht in `04_Pruefung_Freigabe/`.
8. **Audit:** „auditor: Kapitel 6“ – Kennzahlen und Nachweise in `05_Audit/`.
9. **Freigeben:** ein Mensch legt den Freigabebeleg (Name, Datum, Version) in `04_Pruefung_Freigabe/` ab.
10. **Ausgeben:** „uebersetzer-ausgabe: Kapitel 6, alle Sprachen“ – deutsche Endfassung und acht Übersetzungen in `04_Output/<Sprache>/<Kapitel>/`, mit Glossar und Übersetzungsspeicher aus `08_IV_Translation`; danach Sprachreview durch das jeweilige Land (`08_IV_Translation/<Sprache>/03_Laenderreview/REVIEW.md`).

Vor dem Schreiben gelten Stil und Ton aus `06_II_Stil_und_Design` und die Sprachregeln aus `07_III_Grammatik_Synonyme_Fehlerliste`.

## Von freigegebenen Kapiteln zum Produkt (I Output)

1. **Produkt wählen:** `05_I_Output/<Produkt>/PRODUKT.md` – Handbuch, Releaseletter, QuickGuide, Schulungsmaterial, Interne Dokumente, Videos, Grafiken, Prozesse.
2. **Erstellen:** „ausgabe-produzent: QuickGuide Dealer“ – Entwurf in `01_Entwurf/`, Screens in `02_Screens/`.
3. **Prüfen:** „sprach-lektor: 03_QuickGuide“ und „stil-designer: 03_QuickGuide prüfen“.
4. **Freigeben:** ein Mensch trägt die Freigabe in `PRODUKT.md` ein; Endfassung in `03_Final/01_Deutsch_DE/`.
5. **Übersetzen:** „uebersetzer-ausgabe: QuickGuide Dealer, alle Sprachen“ → `03_Final/<Sprache>/`, Länderreview über `08_IV_Translation`.

Ideen jederzeit: „ideen-sammler: Idee für Kapitel 9 – …“.

## Mit der App arbeiten

Quellen in der App einlesen, Fragen mit Belegen beantworten, Testfragen prüfen, Wissenslücken an Fachleute geben und Screenshots verwalten: `App/APP.md`. Testfragen aus Wissens-Check und Lückenanalyse gehören in `App/TESTFRAGEN.csv`, ausgefüllte Befragungen in `App/Befragungen/`, Exporte der App in `App/Exporte/`.

## Neue Gliederungen

| Fall | Aufruf (im Projektordner) |
|---|---|
| neue Gesamtgliederung (Excel) | Datei nach `Gliederung/` legen, dann „gliederungs-pfleger: neue Gesamtgliederung abgleichen“ |
| neue oder geänderte Gliederung in der App | „gliederungs-pfleger: Gliederungen aus der App abgleichen“ |
| direkt ohne Agent | `python 00_Dokumentation/Werkzeuge/handbuch_struktur.py abgleich . --app http://localhost:3000 --projekt p_default --token <API-Token>` |

Der Abgleich legt nur Fehlendes an (Kapitel mit acht Arbeitsordnern, Unterkapitel, Hauptordner `05`–`08`, neue Agenten), löscht und überschreibt nichts – geänderte Vorlagen wie `CLAUDE.md` legt er als `CLAUDE.md.neu` daneben – und meldet Umbenanntes oder Entfallenes in `GLIEDERUNG_ABGLEICH.md`. Jede App-Gliederung erhält einen eigenen Ordner unter `03_Varianten/`; der Ordnername bleibt gleich, auch wenn die Gliederung in der App umbenannt oder neu versioniert wird. Das API-Token legt die Administration in der App unter Integrationen › API-Tokens an (Berechtigung read). Regelmäßig: den Aufruf in der Windows-Aufgabenplanung täglich einplanen.

## Dateien in diesem Ordner

| Datei | Inhalt |
|---|---|
| `Gliederung/{{GLIEDERUNG}}` | Gesamtgliederung (Matrix mit Status- und Nachweisspalten) |
| `Gliederung/Gliederung.csv`, `Gliederung.md` | Gliederung mit Zielordnern bzw. zum Lesen |
| `Gliederung/App/` | Exporte der App-Gliederungen und Zuordnung Gliederung → Ordner |
| `STATUS.md` | Stand je Unterkapitel |
| `AUDIT_GESAMT.md`, `FAQ_GESAMT.md`, `IDEEN_GESAMT.md`, `STEUERUNG_GESAMT.md` | Gesamtlisten der Agenten |
| `ENTSCHEIDUNGEN.md`, `BEGRIFFE.md` | Entscheidungen, verbindliche Schreibweisen |
| `INPUT_PROTOKOLL.md`, `GLIEDERUNG_ABGLEICH.md` | Protokolle |
| `App/` | Arbeit mit der App: `APP.md`, `TESTFRAGEN.csv`, `Befragungen/`, `Exporte/` |
| `Werkzeuge/` | `handbuch_struktur.py` mit Vorlagen für Ordner und Agenten |

## Voraussetzungen auf dem Rechner

- Claude Code (Desktop-App oder `claude` im Terminal), im Ordner `{{STAND}}` gestartet.
- Python 3.9+ mit `openpyxl`, `python-docx`, `python-pptx`, `pypdf` (`pip install openpyxl python-docx python-pptx pypdf`).
- Optional für Videos: Untertiteldatei (SRT/VTT) neben das MP4 legen oder ein lokales Whisper installieren.
- Optional: die App oneSCM Handbook Studio (Windows-Paket mit `start.cmd`, ohne Installation) – siehe `App/APP.md`.
