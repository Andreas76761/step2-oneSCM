# ADR-053 Einfache Oberfläche: Startseite und Menü nach Arbeitsablauf

**Status:** akzeptiert, umgesetzt in Etappe 18 (ergänzt ADR-016, ADR-035)

## Kontext
Das Menü war auf über 25 gleichrangige Punkte angewachsen. Wer nur ein Handbuch schreiben will, braucht wenige, klar geordnete Einstiege.

## Entscheidung
- **Startseite „Was möchten Sie tun?“** (`/`): fünf Hauptaufgaben als große Kacheln (Quellen hochladen, neues Kapitel schreiben, Kapitel überarbeiten, Verständlichkeit prüfen, Handbuch veröffentlichen); „Ihr Weg zum fertigen Handbuch“ mit sechs Schritten aus vorhandenen Daten (Quellen, Widersprüche, Kapitel, Anleitungs-Check ≥ 80, Freigabe, Veröffentlichung) und markiertem nächsten Schritt; „Braucht Aufmerksamkeit“ mit den Kapiteln mit den meisten offenen Punkten. Das Dashboard liegt unter `/dashboard`.
- **Menü nach Ablauf:** Gruppen „1 Sammeln“, „2 Schreiben“, „3 Prüfen“, „4 Veröffentlichen“ (als `role="group"` mit Beschriftung); Selteneres (Dashboard, Rollen-/Spartenansichten, Optimierungen, Assistent, Kontexthilfe, Analytik, Traceability, Projekte, Benutzer, Integrationen) unter „Weitere“, standardmäßig eingeklappt und automatisch geöffnet, wenn eine dieser Seiten aktiv ist.

## Konsequenzen
- Alle bisherigen Seiten und Adressen bleiben erreichbar (außer dem Dashboard, das von `/` nach `/dashboard` umzieht).
- Im eingeklappten Menü (nur Symbole) trennen Linien die Gruppen.
