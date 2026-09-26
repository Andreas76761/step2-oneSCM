# ADR-064 Wöchentliche Übersicht für die Redaktion

**Status:** akzeptiert, umgesetzt in Etappe 21

## Kontext
Rückmeldungen, Aufgaben und schwache Kapitel waren über mehrere Seiten verteilt. Ohne regelmäßigen Anstoß blieben offene Punkte liegen.

## Entscheidung
- Alle mit Bearbeitungsrecht erhalten **einmal je Kalenderwoche** (ISO-Woche) eine Benachrichtigung „Wochenübersicht JJJJ-Www: …“ mit offenen Leser-Rückmeldungen (je Kapitel), eigenen offenen Aufgaben (davon überfällig) und bis zu drei Kapiteln mit offenen Pflichtpunkten des Anleitungs-Checks.
- **Nur wenn es etwas zu tun gibt:** Eine leere Übersicht wird nicht gesendet und sperrt die Woche nicht.
- **Wochentag je Projekt** (`projects.digest_weekday`, Standard Montag, `null` = aus), einstellbar durch die Administration auf der Seite „Rückmeldungen“; dort auch eine **Vorschau** der eigenen Übersicht und **„Jetzt senden“**.
- Ein stündlicher Job (`weekly-digest`) versendet am eingestellten Tag; `digest_log` (Projekt, Person, Woche) verhindert doppelte Nachrichten – auch bei mehreren Instanzen und bei „Jetzt senden“.
- Zustellung als Benachrichtigung in der App (ADR-019, „Aufgaben“ mit Link zu „Rückmeldungen“ bzw. „Aufgaben“); kein eigener Mailversand.
