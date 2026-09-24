# ADR-032 Stammdaten und Gliederungen

**Status:** akzeptiert, umgesetzt in Etappe 11

## Kontext
Die Redaktion braucht neben den aus den Quellen abgeleiteten Kapiteln eigene, gepflegte Inhaltsverzeichnisse – je Zielgruppe (Dealer, Markt, HQ), Sparte (Pkw, Van) und Marktbezug (Blueprint oder konkrete Märkte) – sowie Nachschlagewerke (Abkürzungen, Glossar, Bildverzeichnis, FAQ) und eine Redaktionsplanung. Der Auftraggeber hat am 24.09.2026 entschieden: Gliederungen sind eine **zusätzliche Sicht**, die bestehende Kapitelstruktur, Werkstatt und Freigabe bleiben unverändert; die 6 Märkte sind **konfigurierbar**; Planung ist eine **Redaktionsplanung** je Kapitel; FAQ werden **gepflegt, mit Vorschlägen aus dem Assistenten**.

## Entscheidung
- **Navigation:** links, einklappbar (nur Symbole, Zustand je Browser gemerkt); unten die Gruppe „Stammdaten“ mit Untermenü (Inhaltsverzeichnis, Abkürzungen, Glossar, Bildverzeichnis, FAQ, Planung) und „Einstellungen“; neues Register „Draft Manual“ (ADR-033).
- **Gliederungen** (`outlines`, `outline_nodes`, Migration `021`): zwei Ebenen (Kapitel, Unterkapitel), Nummern ergeben sich aus der Reihenfolge. Variante = Rollen und Sparten (leer = alle) sowie Marktbezug `blueprint` (marktneutral) oder `markets` mit einer Auswahl der Projektmärkte (`projects.markets`, Vorbelegung DE, FR, IT, ES, GB, NL, von der Administration änderbar).
- **Versionen:** „Als neue Version speichern“ kopiert Einträge, Zuordnungen und Planung (`family_id`, `version_no`, `based_on_id`); die Vorlage bleibt unverändert. Höchstens eine Version je Gliederung ist „aktiv“ und wird im Draft Manual und in der Planung vorausgewählt. Eine Version, auf der weitere aufbauen, kann nicht gelöscht werden.
- **Anlegen:** leer, aus der aktuellen Kapitelstruktur der Quellen oder per Upload – Markdown (`#`/`##`, `1.`/`1.1`, eingerückte Aufzählung; Nummern werden entfernt, tiefere Ebenen dem Unterkapitel zugeschlagen) oder JSON im Exportformat (enthält die Variante). Export als Markdown und JSON.
- **Abkürzungen** (`abbreviations`): je Projekt eindeutig; Vorschläge aus aktuellen Schnipseln (2–6 Großbuchstaben/Ziffern, nach Häufigkeit).
- **Glossar:** Sicht auf die Begriffe der Terminologie mit Definition (alphabetisch); keine zweite Begriffsquelle.
- **Bildverzeichnis:** Bilder (ADR-029) mit fortlaufender Abbildungsnummer (nur verwendete), Titel (`media_assets.title`), Alternativtexten, Hinweis bei fehlendem Alternativtext und Verwendung in Quellen und Kapitelversionen.
- **FAQ** (`faq_entries`): Frage, Antwort (Markdown), Rollen/Sparten, Status Entwurf/veröffentlicht, Reihenfolge. Vorschläge aus dem Assistentenprotokoll: wiederholte, unbeantwortete oder negativ bewertete Fragen, die noch nicht erfasst sind; beantwortete bringen die Antwort als Entwurf mit.
- **Planung** (`plan_items`): je Gliederungseintrag Verantwortliche, Termin, Status (offen, in Arbeit, Review, fertig), Notiz; Überfälligkeit und Fortschritt.
- **Berechtigungen:** Lesen für alle Projektmitglieder; Ändern mit `edit`; Märkte des Projekts mit `admin`. Alle Änderungen im Audit.

## Konsequenzen
- Gliederungen erzeugen keine Kapitelversionen; freigegebene Inhalte entstehen weiterhin über Generator, Werkstatt und Freigabe.
- Backups enthalten alle neuen Tabellen; Unterkapitel werden nach ihrem Kapitel wiederhergestellt.
