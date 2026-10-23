# Arbeitsweise – oneSCM-Benutzerhandbuch (Stand {{STAND}})

## Vom Eingang zum freigegebenen Kapitel

1. **Dateien ablegen:** neue Unterlagen nach `01_Input/01_Eingang/` (DOCX, PPTX, PDF, HTML, XLSX, MP4 mit Untertitel, Bilder).
2. **Sortieren:** „input-sortierer: Eingang verarbeiten“ – Raw-Jahr (2023–2027), Kapitel, Unterkapitel; Datenschutzfunde und Unsicheres unter „Zu entscheiden“ in `INPUT_PROTOKOLL.md`.
3. **Übersetzen:** „uebersetzer-de: Kapitel 6“ – englische Quellen erhalten eine deutsche Fassung `dt_<Original>` daneben.
4. **Steuern:** „steuerung: Kapitel 6“ – wer braucht was (Dealer, MO, Markt, HQ, IT), was ist markt- oder spartenspezifisch.
5. **Schreiben:** „kapitel-redakteur: Unterkapitel 6.2“, „bild-redakteur: Kapitel 6“, „faq-redakteur: Kapitel 6“.
6. **Prüfen:** „pruefer: Kapitel 6“ – Bericht in `04_Pruefung_Freigabe/`.
7. **Audit:** „auditor: Kapitel 6“ – Kennzahlen und Nachweise in `05_Audit/`.
8. **Freigeben:** ein Mensch legt den Freigabebeleg (Name, Datum, Version) in `04_Pruefung_Freigabe/` ab.
9. **Ausgeben:** „uebersetzer-ausgabe: Kapitel 6, alle Sprachen“ – deutsche Endfassung und acht Übersetzungen in `04_Output/<Sprache>/<Kapitel>/`; danach Sprachreview durch einen Menschen.

Ideen jederzeit: „ideen-sammler: Idee für Kapitel 9 – …“.

## Neue Gliederungen

| Fall | Aufruf (im Projektordner) |
|---|---|
| neue Gesamtgliederung (Excel) | Datei nach `Gliederung/` legen, dann „gliederungs-pfleger: neue Gesamtgliederung abgleichen“ |
| neue oder geänderte Gliederung in der App | „gliederungs-pfleger: Gliederungen aus der App abgleichen“ |
| direkt ohne Agent | `python 00_Dokumentation/Werkzeuge/handbuch_struktur.py abgleich . --app http://localhost:3000 --projekt p_default --token <API-Token>` |

Der Abgleich legt nur Fehlendes an (Kapitel mit acht Arbeitsordnern, Unterkapitel, neue Agenten), löscht und überschreibt nichts und meldet Umbenanntes oder Entfallenes in `GLIEDERUNG_ABGLEICH.md`. Jede App-Gliederung erhält einen eigenen Ordner unter `03_Varianten/`; der Ordnername bleibt gleich, auch wenn die Gliederung in der App umbenannt oder neu versioniert wird. Das API-Token legt die Administration in der App unter Integrationen › API-Tokens an (Berechtigung read). Regelmäßig: den Aufruf in der Windows-Aufgabenplanung täglich einplanen.

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
| `Werkzeuge/` | `handbuch_struktur.py` mit Vorlagen für Ordner und Agenten |

## Voraussetzungen auf dem Rechner

- Claude Code (Desktop-App oder `claude` im Terminal), im Ordner `{{STAND}}` gestartet.
- Python 3.9+ mit `openpyxl`, `python-docx`, `python-pptx`, `pypdf` (`pip install openpyxl python-docx python-pptx pypdf`).
- Optional für Videos: Untertiteldatei (SRT/VTT) neben das MP4 legen oder ein lokales Whisper installieren.
