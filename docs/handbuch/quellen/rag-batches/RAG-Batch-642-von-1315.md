# Batch 642 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Mercedes me ID**

In der Kunden- und Partnerverwaltung wurde der Umgang mit der Mercedes me ID präzisiert. Sobald einem Kunden eine ciamId zugeordnet ist, also der Wert der ciamId nicht leer ist, kann die Mercedes me ID nicht mehr bearbeitet werden. Das Feld wird in diesem Fall schreibgeschützt dargestellt. Dadurch wird verhindert, dass eine bereits verknüpfte Mercedes me ID versehentlich verändert wird.

Zusätzlich stellt das System sicher, dass eine Mercedes me ID nicht für zwei verschiedene Kunden verwendet werden kann. Versucht ein Anwender, eine Mercedes me ID zuzuweisen, die bereits einem anderen Kunden zugeordnet ist, wird die Speicherung abgelehnt. Stattdessen erscheint die Meldung „Entry already exists with assigned mercedes me email address: {email}“, wobei anstelle des Platzhalters die betroffene E-Mail-Adresse angezeigt wird.

Hinweis zum Umfang: Eine weitere Änderung, die sich auf die Meldung „Customer Debtor not found“ bezog, wurde abgebrochen und ist daher nicht Bestandteil dieser Version. Für sie sind im Benutzerhandbuch keine Funktionen zu beschreiben.