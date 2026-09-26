# ADR-067 Kapitelvorlagen duplizieren, exportieren und importieren

**Status:** akzeptiert, umgesetzt in Etappe 22 (erweitert ADR-059, ADR-062)

## Kontext
Eigene Vorlagen galten nur im Projekt, in dem sie entstanden; ähnliche Vorlagen mussten von Grund auf neu angelegt werden, und mitgelieferte Vorlagen ließen sich nicht anpassen.

## Entscheidung
- **Duplizieren** (`POST /chapter-templates/duplicate` mit `id`): eigene und mitgelieferte Vorlagen als neue eigene Vorlage „X (Kopie)“ (mitgelieferte so zum Anpassen). Die ID steht im Body, da mitgelieferte Vorlagen nicht in der Tabelle stehen; eigene werden gegen das Projekt geprüft.
- **Export** (`GET /chapter-templates/export`, optional `ids`): JSON-Datei `{ format: "onescm-chapter-templates", version: 1, templates: [...] }` nur mit Inhalten – ohne IDs, Personen und Quellversion.
- **Import** (`POST /chapter-templates/import`, Bearbeitungsrecht): höchstens 50 Vorlagen; erst wird die ganze Datei geprüft (Format, Name, mindestens ein Schritt je Vorlage), dann angelegt – eine fehlerhafte Datei legt nichts an. Vorhandene Vorlagen werden nie überschrieben; bei gleichem Namen entsteht „X (2)“, die Antwort nennt die Umbenennungen.
- Im Kapitel-Assistenten: „Vorlage kopieren“ (Auswahl aus mitgelieferten und eigenen), „Duplizieren“ und „📤“ je Vorlage, „📤 Alle exportieren“ und „📥 Importieren“.
