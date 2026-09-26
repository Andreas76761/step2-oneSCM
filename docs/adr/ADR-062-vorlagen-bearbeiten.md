# ADR-062 Eigene Kapitelvorlagen vollständig bearbeiten

**Status:** akzeptiert, umgesetzt in Etappe 21 (erweitert ADR-059)

## Kontext
Eigene Vorlagen entstanden bisher nur aus einem Kapitel der Werkstatt und ließen sich im Assistenten nur umbenennen. Wer eine Vorlage verbessern wollte, musste ein Kapitel ändern und neu speichern.

## Entscheidung
- Im Kapitel-Assistenten öffnet **„✏️ Bearbeiten“** je eigener Vorlage einen Dialog mit allen Teilen: Name, Kurzbeschreibung, Titelvorschlag, Zweck, Voraussetzungen, Schritte, Ergebnis, Tipps.
- Listen werden als **eine Zeile je Eintrag** bearbeitet; der Dialog zählt die erkannten Schritte und verhindert das Speichern ohne Schritt (Hinweis als `role="alert"`).
- Gespeichert wird über das bestehende `PATCH /chapter-templates/{id}`; nicht übergebene Felder bleiben unverändert, jede Änderung wird protokolliert.
- Mitgelieferte Vorlagen (ADR-055) bleiben unveränderlich.
