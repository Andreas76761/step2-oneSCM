# oneSCM Benutzerhandbuch – Arbeitsordner {{STAND}}

Lokale Arbeitsumgebung für das oneSCM-Benutzerhandbuch. Grundlage ist die Gesamtgliederung `00_Dokumentation/Gliederung/{{GLIEDERUNG}}` (Kapitel 1–23, Vorspann V, Anhänge A–I, Übergangstexte T). Gliederungen aus der App (Varianten je Rolle, Sparte, Markt) liegen unter `03_Varianten/`, die Sprachausgaben unter `04_Output/`. **Hauptsprache ist Deutsch**; fremdsprachige Quellen werden als `dt_`-Datei übersetzt.

## Grundregeln (verbindlich)

1. **Daten bleiben lokal.** Keine Inhalte an Webdienste, Cloud-KI, Übersetzungsdienste oder Suchmaschinen. WebFetch und WebSearch sind gesperrt. Einzige erlaubte Netzadresse: die lokale App (z. B. `http://localhost:3000`) für den Gliederungsabgleich.
2. **Nichts erfinden.** Jede fachliche Aussage braucht eine Quelle aus `01_Quellen` (Datei + Fundstelle: Seite, Folie, Abschnitt oder Zeitmarke). Ohne Beleg: `[offen: …]`.
3. **Nichts löschen.** Verschieben oder als ersetzt markieren. Gliederungsordner werden nie umbenannt oder entfernt, nur gemeldet.
4. **Datenschutz:** Namen, E-Mail, Telefon, FIN/VIN, Kennzeichen, User-IDs, GSSN von Personen und Kundendaten vor jeder Weiterverarbeitung melden; in Entwürfen, FAQ und Bildern nur anonymisiert.
5. **Status nie vorwegnehmen:** Rollen, Scope (Pkw/Van, Markt, Release) und Freigaben bleiben „?“ bzw. „Vorschlag“, bis ein Beleg vorliegt. Freigaben erteilt nur ein Mensch.
6. **Übersetzungen sind kein Original.** `dt_`-Dateien und Sprachausgaben tragen ihre Herkunft im Kopf; Belege nennen immer auch das Original.
7. **Neuere Quelle schlägt ältere nicht automatisch.** Widersprechen sich `Raw_2025` und `Raw_2026`, beide Aussagen mit Jahr nennen und als Widerspruch melden.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `00_Dokumentation/` | Arbeitsweise, Gliederungen (Excel, CSV, Markdown, App-Exporte), Status, Entscheidungen, Begriffe, Gesamtlisten (Audit, FAQ, Ideen, Steuerung), Werkzeuge |
| `01_Input/` | `01_Eingang` (neue Dateien), `02_Zugeordnet` (Originale), `03_Ausgeschlossen` |
| `02_Kapitel/<Kapitel>/` | Gesamtgliederung: `KAPITEL.md`, acht Arbeitsordner, je Unterkapitel ein Ordner mit `UNTERKAPITEL.md` |
| `03_Varianten/<Gliederung>/` | dieselbe Struktur für jede Gliederung aus der App, dazu `VARIANTE.md` und `STATUS.md` |
| `04_Output/<Sprache>/<Kapitel>/` | freigegebene Fassung je Sprache: `01_Deutsch_DE`, `02_Englisch_EN`, `03_Französisch_FR`, `04_Italienisch_IT`, `05_Spanisch_ES`, `06_Tschechisch_CS`, `07_Slowakisch_SK`, `08_Koreanisch_KO`, `09_Malaiisch_MS`; Varianten unter `<Sprache>/Varianten/<Name>/` |

### Die acht Arbeitsordner je Kapitel

| Ordner | Inhalt | Agent |
|---|---|---|
| `01_Quellen/Raw_2023` … `Raw_2027` | zugeordnete Quellen nach Jahr des Dokumentstands; `QUELLEN.md` | input-sortierer |
| `02_Entwurf/` | Text je Unterkapitel (`<Nr>_Entwurf.md`) mit Quelle je Absatz | kapitel-redakteur |
| `03_Bilder/` | Screenshots, Schaubilder, `BILDER.md` | bild-redakteur |
| `04_Pruefung_Freigabe/` | Prüfberichte, Freigabebelege | pruefer, Mensch |
| `05_Audit/` | Audit-Berichte (Nachweisführung, Kennzahlen), `AUDIT.md` | auditor |
| `06_FAQ/` | häufige Fragen mit belegter Antwort, `FAQ.md` | faq-redakteur |
| `07_Ideenspeicher/` | Ideen, Verbesserungen, zukünftige Funktionen, Inhalte außerhalb des Scopes, `IDEEN.md` | ideen-sammler |
| `08_Steuerung/` | `01_Dealer`, `02_MO`, `03_Markt`, `04_HQ`, `05_IT`, `06_Marktspezifisch`, `07_Spartenspezifisch`; `STEUERUNG.md` | steuerung |

Material, das nur ein Unterkapitel betrifft, darf direkt im Unterkapitel-Ordner liegen.

## Agenten (`.claude/agents/`)

| Agent | Aufgabe |
|---|---|
| `gliederungs-pfleger` | Ordner und Agenten mit neuen Gliederungen abgleichen – aus Excel oder aus der App |
| `input-sortierer` | Eingang sichten, Datenschutz und Dubletten prüfen, Raw-Jahr bestimmen, Kapitel/Unterkapitel zuordnen |
| `kapitel-redakteur` | Entwurf je Unterkapitel ausschließlich aus den Quellen, gesteuert nach `08_Steuerung` |
| `bild-redakteur` | Bilder benennen, Alternativtext, Anonymisierung, Bildverzeichnis |
| `pruefer` | Entwürfe prüfen (Belege, Vollständigkeit, Terminologie, Datenschutz, Steuerung) – ändert keine Texte |
| `auditor` | Nachweisführung prüfen und messen (Quellenabdeckung, Belegquote, Pflichtkriterien, Freigabebelege) |
| `faq-redakteur` | Fragen sammeln und nur mit Beleg beantworten, je Rolle und Sparte |
| `ideen-sammler` | Ideen, Verbesserungen und Zukünftiges festhalten, nie ungefragt in den Entwurf übernehmen |
| `steuerung` | Inhalte den Rollen Dealer, MO, Markt, HQ, IT sowie markt- oder spartenspezifischen Themen zuordnen |
| `uebersetzer-de` | englische und andere fremdsprachige Quellen ins Deutsche übersetzen – neue Datei `dt_<Original>` neben dem Original |
| `uebersetzer-ausgabe` | freigegebene deutsche Kapitel nach `04_Output` übernehmen und in die acht Landessprachen übersetzen |

Ablauf: **Eingang → input-sortierer → uebersetzer-de → steuerung → kapitel-redakteur + bild-redakteur + faq-redakteur → pruefer → auditor → Mensch gibt frei → uebersetzer-ausgabe → Sprachreview durch das jeweilige Land.** Englisch ist die internationale Fassung. Ideen sammelt der ideen-sammler jederzeit. Stand: `00_Dokumentation/STATUS.md`.

## Neue Gliederung

Neue Gesamtgliederung (Excel) oder neue Gliederung in der App (Stammdaten › Inhaltsverzeichnis): „gliederungs-pfleger: Gliederungen abgleichen“. Er ruft `00_Dokumentation/Werkzeuge/handbuch_struktur.py abgleich` auf, legt fehlende Ordner und neue Agenten an und meldet Umbenanntes oder Entfallenes in `00_Dokumentation/GLIEDERUNG_ABGLEICH.md`.

## Begriffe und offene Entscheidungen

- Schreibweise: **oneSCM**, **Servicevertrag**, **Antrag (Proposal)**, **MO Checks / MO-Prüfungen**. Englische UI-Begriffe in „…“ mit deutschem Handbuchbegriff.
- Rollen der Steuerung: **Dealer, MO, Markt, HQ, IT**. Sparten laut Gliederung: **Pkw und Van**.
- **Offen:** Steht MO für „Market Operation“ oder „Market Organisation“? Bis zur Klärung nur „MO“.
- Weitere offene Entscheidungen: `00_Dokumentation/ENTSCHEIDUNGEN.md`.
