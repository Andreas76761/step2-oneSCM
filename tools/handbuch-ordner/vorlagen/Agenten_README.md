# Agenten – Steuerung durch den Orchestrator

Der **orchestrator** plant und verfeinert die Arbeit aller Agenten. Er schreibt keine Handbuchtexte und entscheidet nichts.

| Datei | Inhalt |
|---|---|
| `AUFGABEN.md` | offene Todos je Agent: Agent, Aufgabe, Priorität, Status, Herkunft (Orchestrator, GOAL, von Hand) |
| `ENTSCHEIDUNGEN.md` | Fragen an den Menschen mit Antwortmöglichkeiten; Antwort, wer, wann; Ausführung durch den Orchestrator |
| `TRIAGE.md` | Bericht des Agenten triage: Pflichtlabels, Zuordnungsvorschläge, neue Unterkapitel, „zu prüfen“ |

Ablauf: **Eingang → input-sortierer → triage → orchestrator plant → Agenten arbeiten → goal gleicht mit dem Ziel ab → orchestrator verfeinert.**
Mit `abgleich --app …` kommen Aufgaben, Entscheidungen und der Ziel-Abgleich aus der App hierher (eigene Änderungen bleiben, die App-Fassung liegt dann als `.neu` daneben).
