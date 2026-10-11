# Batch 704 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Cost Management: Neuerungen und Änderungen**

**Export von MOT und Altteilsteuer nach oneERP (E167)**

In oneSCM können bei der manuellen Erstellung einer Werkstattrechnung bereits MOT-Beträge (gesetzliche Prüfung) und Altteilsteuer erfasst werden. Neu ist, dass diese Beträge im Export E167 an oneERP übergeben werden. Damit stehen in den Buchungen in oneERP die korrekten Werte für MOT und Altteilsteuer zur Verfügung. Der Freigabeprozess bleibt unverändert: Eine manuelle Werkstattrechnung wird erstellt und anschließend von einer anderen Person freigegeben. Die Dateistruktur des Exports bleibt grundsätzlich bestehen. Hinzu kommen zusätzliche Zeilen, und zwar 50er-Zeilen bei Rechnungen und 40er-Zeilen bei Gutschriften.

Es werden drei Varianten unterschieden. Wird zusammen mit der allgemeinen Reparatur nur MOT erfasst, entsteht im Export eine zusätzliche 50er-Zeile (bei Dokumentart Rechnung) mit dem Steuerkennzeichen 90 und der speziellen Materialnummer für MOT. MOT lässt sich dabei über den Coverage-Code identifizieren. Werden MOT und Altteilsteuer gemeinsam mit der Reparatur erfasst, wird die allgemeine Reparatur bei normaler Steuerklassifizierung mit dem Steuerkennzeichen 67 exportiert. MOT erhält das Steuerkennzeichen 90 (steuerbefreit). Die Altteilsteuer wird mit ihrem Berechnungsgrundwert exportiert, und zwar mit dem Steuerkennzeichen 68 in der 40er-Zeile bzw. 92 in der 50er-Zeile. Diese Buchungen neutralisieren den Altteilsteuerwert im FI-System, welches die an den Händler zu vergütende Altteilsteuer anschließend selbst berechnet. Wird zusammen mit der Reparatur nur die Altteilsteuer erfasst, gelten die gleichen Regeln ohne die MOT-Zeile.

Dieselben Regeln gelten für manuelle Werkstattrechnungen der Dokumentart Gutschrift. Alle Varianten sind auch dort anwendbar, wobei die Buchung im Export E167 umgekehrt wird. Zusätzlich wird in E167 jeweils eine neue Materialnummer übergeben, sobald in der manuellen Werkstattrechnung Altteilsteuer oder MOT vorhanden ist. Für Altteilsteuer und MOT gibt es jeweils eine eigene Materialnummer.

Außerdem werden die Deckungsbeträge nun nach Steuerklassifizierung getrennt ausgewiesen, statt wie bisher alle Deckungen in einer einzigen Buchung zusammenzufassen. Gibt es mehrere Rechnungspositionen (ohne MOT und Altteilsteuer), werden die Nettobeträge anhand der vom Benutzer gewählten Steuerklassifizierung summiert und als eine einzige 50er- bzw. 40er-Zeile in E167 gebucht. Ein Beispiel: Bei zwei Deckungen und einer optionalen Deckung werden die Nettobeträge zweier Schadenscodes mit der Steuerklassifizierung „steuerbefreit“ zu einer einzigen 50er-Zeile zusammengefasst. Ein weiterer Schadenscode erhält eine eigene 50er-Zeile, und MOT wird in einer separaten 50er-Zeile ausgewiesen.

**Weitere Änderungen**

Für das Feld „Mileage“ (Laufleistung) gilt eine neue Validierung: Bei Werkstattrechnungen, Siveco-Rechnungen und Kundenerstattungen sind nur noch maximal sechs Stellen erlaubt, der höchste zulässige Wert beträgt 999.999. Diese Begrenzung gilt auch für alle weiteren Rechnungsarten mit diesem Feld, nämlich Kundenrechnung, Preisminderung und internationale Werkstattrechnung.

Behoben wurde außerdem ein Fehler, bei dem eine manuell erstellte internationale Werkstattrechnung nach dem Lauf des Batchjobs im Status „Accepted“ verblieb. Ebenfalls behoben wurde ein Problem bei der Verarbeitung von Werkstattrechnungen: Zuvor wurde nur die Rechnung mit der niedrigsten Laufleistung an den Vertrag übermittelt.

Darüber hinaus wurden ein Problem bei der Freigabe internationaler Werkstattansprüche (Int. Workshop Claims) sowie ein Anliegen zum Kopftextfeld für manuell erstellte Rechnungen in oneSCM bearbeitet. Zu diesen beiden Punkten liegen keine näheren Angaben vor.