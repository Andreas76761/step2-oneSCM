# ADR-057 Anleitungs-Check vor der Freigabe

**Status:** akzeptiert, umgesetzt in Etappe 19 (erweitert ADR-051, US-012)

## Entscheidung
- **Anzeige:** Die Freigabe zeigt zu jeder Kapitelversion den Wert des Anleitungs-Checks, die offenen Pflichtpunkte und den Link zur Checkliste.
- **Optionale Bedingung:** je Projekt ein Mindestwert (`projects.guidance_min_score`, `GET/PUT /guidance/settings`, ändern nur Administration; Auswahl keiner/60/70/80/90/100 unter „Anleitungs-Check“). Ist er gesetzt, enthält das Qualitätsgate für Einreichen und Freigabe den Punkt „Anleitungs-Check mindestens X von 100 (aktuell Y)“ mit den offenen Punkten; darunter ist beides gesperrt (409). Ohne Mindestwert bleibt das Gate unverändert.
- Handbuch-Varianten (ADR-034) werden nicht geprüft; der Check bewertet Kapitel aus den Quellen und dem Assistenten.

## Konsequenzen
- Ein Mindestwert wirkt auf bereits eingereichte Versionen erst bei der nächsten Entscheidung.
