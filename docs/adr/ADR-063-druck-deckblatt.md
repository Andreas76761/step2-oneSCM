# ADR-063 Druck mit Deckblatt und Seitenzahlen

**Status:** akzeptiert, umgesetzt in Etappe 21 (erweitert ADR-060)

## Kontext
Das gedruckte Handbuch begann direkt mit dem Inhaltsverzeichnis; Seitenzahlen und ein Hinweis auf den Stand fehlten – beim Weitergeben als PDF war unklar, welche Fassung vorliegt.

## Entscheidung
- `/lesen/druck` beginnt mit einem **Deckblatt**: „Benutzerhandbuch“, Projektname, Fassung (**„Version X“** der neuesten Veröffentlichung, sonst bzw. mit Entwürfen **„Arbeitsstand“**), Stand (Datum), Anzahl Kapitel und – bei Entwürfen – der Hinweis „enthält nicht freigegebene Entwürfe“.
- Kapitel sind im Inhaltsverzeichnis und in den Überschriften **nummeriert**.
- **Seitenränder per `@page`:** unten rechts „Seite X von Y“, oben Projekt und Fassung als Kopfzeile; beides nicht auf dem Deckblatt. Die Kopfzeile wird als eigener Stilblock gesetzt, da Randboxen keine CSS-Variablen der Seite erben.
- Browser ohne Unterstützung für Randboxen drucken ohne Kopf-/Fußzeile; Inhalt und Deckblatt bleiben gleich.
