# Batch 1287 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis zur Einordnung:** Die vorliegenden Rohdaten betreffen überwiegend interne Architektur- und Testautomatisierungsthemen und keine Funktionen, die Anwenderinnen und Anwender im Alltag bedienen. Die folgenden Absätze geben den Stand sachlich wieder.

**Autonomes QA-Framework, Phase 2 (abgebrochen)**

Für die zweite Phase des autonomen QA-Frameworks war vorgesehen, aus fachlich freigegebenen Testfallbeschreibungen im Gherkin-Format automatisch Playwright-Tests zu erstellen, diese gegen die Zielumgebungen DEV, INT und PRE-PROD auszuführen und die Ergebnisse nach Xray zu übertragen. KI-Agenten sollten die Testimplementierungen schreiben, Entwicklerinnen und Entwickler sollten diese prüfen, korrigieren und verifizieren. Die Korrekturen sollten in die Wissensbasis und den Prompt-Kontext zurückfließen, damit sich die Genauigkeit der KI schrittweise einem Zielwert von 98 Prozent annähert. Der Ablauf sollte manuell oder künftig über einen Jira-Statuswechsel ausgelöst werden, nicht durch Git-Ereignisse wie Push oder Pull Request.

Die Pipeline umfasste mehrere Schritte: das Laden der freigegebenen Gherkin-Dateien aus Xray, die KI-gestützte Erstellung der Step Definitions, die Testausführung, die Übertragung der Ergebnisse als JUnit-XML nach Xray (eine Test Execution pro Umgebung und Lauf), einen Test Plan pro Release als durchgängig nachvollziehbares Artefakt, eine Lernschleife sowie eine Fehlerbehandlung mit Audit-Trail, Jira-Kommentar und erneutem Auslösen. Die Infrastruktur für Playwright war bereits umgesetzt, der Xray-Ergebnisimport befand sich in Arbeit. Als Erfolgskriterien waren unter anderem eine vollständig korrekte Zuordnung in Xray und eine Gesamtlaufzeit von unter einer Stunde pro Epic definiert. Der Status ist jedoch „Cancelled“, die Umsetzung wird also nicht weiterverfolgt.

**Konsolidierung der Security-E2E-Tests (offen)**

Für die Konsolidierung der End-to-End-Tests im Sicherheitsbereich liegt bislang nur eine leere Vorlage ohne inhaltliche Angaben vor. Weder Ziel noch Umfang oder Akzeptanzkriterien sind beschrieben. Der Punkt ist offen.

**Prüfung der Fahrzeugdetails auf Kennungen und Konfiguration (Dev Backlog)**

Geplant ist ein Test, der prüft, ob Marke, Geschäftsbereich und Verkaufsbezeichnung eines Fahrzeugs in den Fahrzeugdetails korrekt angezeigt werden. Grundlage sind die Angaben aus dem Bereich der Fahrzeugidentifikation. Als erwartetes Ergebnis ist die Marke Mercedes Benz, der Geschäftsbereich Passenger Cars und die Verkaufsbezeichnung C 300 e Limousine bzw. C 350 e Limousine festgelegt. Der Test soll Teil der Regressionssuite werden und befindet sich im Dev Backlog.