# oneSCM Benutzerhandbuch – Arbeitsordner {{STAND}}

Dieser Ordner ist die lokale Arbeitsumgebung für das oneSCM-Benutzerhandbuch. Grundlage ist die Gliederung `00_Dokumentation/Gliederung/{{GLIEDERUNG}}` (23 Kapitel, Vorspann V, Anhänge A–I, Übergangstexte T).

## Grundregeln (verbindlich)

1. **Daten bleiben lokal.** Keine Inhalte aus diesem Ordner an Webdienste, Cloud-KI, Übersetzungsdienste oder Suchmaschinen senden. WebFetch und WebSearch sind in `.claude/settings.json` gesperrt.
2. **Nichts erfinden.** Jede fachliche Aussage braucht eine Quelle aus `01_Quellen` des Kapitels (Datei + Fundstelle: Seite, Folie, Abschnitt oder Zeitmarke). Ohne Beleg: `[offen: …]` schreiben, nicht raten.
3. **Nichts löschen.** Dateien werden verschoben oder als ersetzt markiert, nie gelöscht. Ordner der Gliederung werden nie umbenannt oder entfernt, nur gemeldet.
4. **Datenschutz:** Namen, E-Mail-Adressen, Telefonnummern, FIN/VIN, Kennzeichen, User-IDs, GSSN von Personen und Kundendaten werden vor jeder Weiterverarbeitung gemeldet; in Entwürfen und Bildern nur anonymisiert.
5. **Status nie vorwegnehmen:** Rollen, Scope (Pkw/Van, Markt, Release) und Freigaben bleiben „Offen“/„Vorschlag“, bis ein Beleg in `04_Pruefung_Freigabe` liegt.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `00_Dokumentation/` | Arbeitsweise, Gliederung (Excel, CSV, Markdown), Entscheidungen, Status, Begriffe |
| `01_Input/01_Eingang/` | neue Dateien hier ablegen (DOCX, PPTX, PDF, HTML, XLSX, MP4, Bilder) |
| `01_Input/02_Zugeordnet/` | Originale nach der Zuordnung (mit Protokoll) |
| `01_Input/03_Ausgeschlossen/` | Dubletten, fachfremde oder nicht lesbare Dateien (mit Begründung) |
| `02_Kapitel/<Kapitel>/` | je Kapitel `KAPITEL.md`, vier Arbeitsordner und je Unterkapitel ein Ordner |

Die vier Arbeitsordner je Kapitel:

| Ordner | Inhalt | Wer schreibt |
|---|---|---|
| `01_Quellen/` | Kopien bzw. Auszüge der zugeordneten Input-Dateien, `QUELLEN.md` mit Fundstellen | input-sortierer |
| `02_Entwurf/` | Text je Unterkapitel (`<Nr>_Entwurf.md`), mit Quellenangabe je Absatz | kapitel-redakteur |
| `03_Bilder/` | Screenshots und Schaubilder, `BILDER.md` mit Nummer, Alternativtext, Quelle, Anonymisierung | bild-redakteur |
| `04_Pruefung_Freigabe/` | Prüfberichte, Freigabebelege, offene Punkte | pruefer (Bericht), Mensch (Freigabe) |

Jeder Unterkapitel-Ordner (z. B. `1.1_Ziele_und_Nutzen_von_oneSCM`) enthält `UNTERKAPITEL.md` mit den Punkten der Ebene 3, Nachweisbedarf und Abschlusskriterium. Material, das nur ein Unterkapitel betrifft, darf direkt dort liegen.

## Agenten (`.claude/agents/`)

| Agent | Aufgabe |
|---|---|
| `gliederungs-pfleger` | Ordner mit einer neuen Gliederung abgleichen (anlegen, Abweichungen melden) |
| `input-sortierer` | Eingang sichten, Datenschutz prüfen, Dateien Kapiteln/Unterkapiteln zuordnen |
| `kapitel-redakteur` | Entwurf je Unterkapitel ausschließlich aus den Quellen des Kapitels |
| `bild-redakteur` | Bilder benennen, Alternativtext, Anonymisierung prüfen, Bildverzeichnis |
| `pruefer` | Entwürfe prüfen (Belege, Terminologie, Datenschutz, Vollständigkeit) – ändert keine Texte |

Ablauf: **Eingang → input-sortierer → kapitel-redakteur + bild-redakteur → pruefer → Mensch gibt frei.** Den Stand führt `00_Dokumentation/STATUS.md`.

## Begriffe und offene Entscheidungen

- Schreibweise: **oneSCM**, **Servicevertrag**, **Antrag (Proposal)**, **MO Checks / MO-Prüfungen**. Englische UI-Begriffe (Menüpunkte) unverändert in Anführungszeichen, deutscher Handbuchbegriff dazu.
- Sparten laut Gliederung: **Pkw und Van** (Truck/Bus nicht belegt).
- **Offen:** Steht MO für „Market Operation“ oder „Market Organisation“? Bis zur Klärung nur „MO“ schreiben.
- Weitere offene Entscheidungen: `00_Dokumentation/ENTSCHEIDUNGEN.md`.
