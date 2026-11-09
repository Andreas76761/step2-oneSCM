# ADR-080 Labelkatalog nach echtem oneSCM und erweiterte Datenschutzprüfung

**Status:** akzeptiert, umgesetzt in Etappe 28 (erweitert ADR-079, US-012)

## Kontext
Der Labelkatalog aus Etappe 27 war ein Vorschlag aus den Demo-Daten. Die Auswertung der bestehenden Artefakte ([docs/07](../07-bestehende-artefakte.md)) zeigte: Gliederung, Menüpfade und Rollen weichen vom echten oneSCM ab. Am 23.10.2026 hat der Auftraggeber entschieden: MO = Market Operation, Anrede „Sie“, nur Pkw und Van, und die Empfehlungen der Entscheidungsvorlage übernommen (Gesamtgliederung mit 23 Kapiteln, Katalog darf über 100 Labels wachsen, Jira nur als Datei, Confluence Cloud nur für einzelne Projekte, Datenschutz zuerst).

## Entscheidung
- **Katalog (153 Labels, neun Gruppen):** Handbuch-Gliederung (Vorspann, Kapitel 1–23, Anhänge A–I der Gesamtgliederung vom 11./12.10.2026), Rollen (Dealer, Dealer+, Markt/MPC, MO = Market Operation, KAM, HQ, HQ Admin, HQ Produktmanagement, CaM-Team, IT, Alle), Navigation (34 Menüpunkte der Oberfläche; `nameEn` = UI-Begriff, `nameDe` = Handbuchbegriff; Schreibfehler der Oberfläche in der Beschreibung), neu Fachdomäne (9), Kundengruppe (5), Systeme und Schnittstellen (19), Inhaltstyp (22, u. a. Diátaxis, Statusmodell, Systemsteckbrief, Quick Guide, Jira-Ticket), Sparte (nur Pkw, Van, beide), Qualität (17, u. a. „Produktivnachweis fehlt“, „Redaktionsteil – nicht veröffentlichen“).
- **Abgleich bestehender Projekte** (beim Start und beim Anlegen eines Projekts): fehlende Katalog-Labels werden angelegt; Katalog-Labels, die niemand bearbeitet hat, folgen dem Katalog (Name, Beschreibung, Reihenfolge); Katalog-Labels früherer Stände werden **ausgeblendet** – Zuordnungen zu Chunks und Antworten bleiben sichtbar. Von der Administration bearbeitete und eigene Labels bleiben unverändert. Nichts wird gelöscht.
- **Datenschutz (F-04):** zusätzlich zu E-Mail, Telefon und IBAN erkennt die Prüfung Fahrgestellnummern (17 Zeichen ohne I/O/Q, mit Ziffern und Buchstaben – wird nicht mehr als IBAN gemeldet), Kfz-Kennzeichen (`S-AB 1234`), Benutzerkennungen hinter Feldbezeichnungen (`User-ID:`, `Benutzerkennung:` …), Straßenadressen mit Hausnummer (optional PLZ und Ort), Personennamen hinter Metadatenfeldern (Autor, Bearbeiter, Assignee, Reporter, „Erstellt von“ …) und Namen einer Namensliste (Einstellung `privacy.names`, nur Administration). Treffer bleiben Blocker für Generierung, Freigabe und Export.
- **Pseudonymisierung:** `POST /privacy/check` liefert maskierte Treffer und optional den Text mit Platzhaltern (`[Person 1]`, `[FIN 1]` …; gleicher Wert → gleicher Platzhalter). Klarwerte werden weder gespeichert noch zurückgegeben.

## Folgen
- Keine Migration; Tests T-212, T-213; Anforderungen NFR-69, NFR-70; E2E T-237 angepasst.
- Bestehende Datenschutzbefunde behalten ihren Fingerabdruck (Reihenfolge der Arten unverändert); Texte mit Fahrgestellnummer erhalten einen neuen Befund der Art `vin` statt `iban`.
- Gliederung und Navigation im Katalog sind belegt durch Gesamtgliederung und Navigationsunterlagen; die Gliederung selbst kennzeichnet einzelne Bildschirmnachweise noch als offen.
