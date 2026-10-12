# Batch 743 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Werkstattrechnungen: Kilometerstand, Händler-/Werkstattname und Reparaturdatum in der Übersicht**

Werkstattrechnungen enthalten Kosten, die der MPC zu tragen hat. Sämtliche Kosteninformationen werden in VEGA verwaltet. Der größte Teil dieser Informationen gelangt von dort nach oneSCM, nur wenige Angaben werden manuell erfasst. In der Zusammenfassungsansicht der Werkstattrechnungen stehen Ihnen als MPC-Benutzer drei weitere Angaben zur Verfügung, die aus der Schnittstelle i156 importiert werden. Sie sind jeweils einem bestimmten Markt, einem Vertrag und einer FIN zugeordnet. Sie geben einen Gesamtüberblick über die am Fahrzeug durchgeführten Leistungen und können außerdem für Auswertungen in oneSCM genutzt werden.

Der Kilometerstand zeigt, welchen Stand der Kilometerzähler hatte, als das Fahrzeug in die Werkstatt kam. Diese Information ist wichtig, wenn ein laufleistungsbasierter Vertrag beendet werden soll, weil die geplante Laufleistung überschritten wurde. Die Anzeige verwendet den Punkt als Tausendertrennzeichen. Ist die Einheit Kilometer, wird sie als „Km“ dargestellt, getrennt durch ein Leerzeichen vom Zahlenwert, zum Beispiel „37.000 Km“.

Der Händler- bzw. Werkstattname wird anhand der in der i156-Datei enthaltenen Händlernummer ermittelt und in der Übersicht angezeigt. Der Name muss dabei Datentyp und Länge des Feldes entsprechen.

Das Reparaturdatum wird ebenfalls aus der i156 übernommen. Es muss dem vorgegebenen Datentyp und Datumsformat entsprechen und darf nicht in der Zukunft liegen.

Die Darstellung entspricht den Vorgaben der Mercedes-Benz Workbench sowie dem mit dem Kunden abgestimmten UI-Design.

So finden Sie die Angaben: Suchen Sie einen Vertrag, für den bereits Kosten vorliegen, und öffnen Sie dessen Registerkarte „Payment Details“. Klicken Sie im Bereich „Invoicing“ auf die Werkstattrechnung. Dort sehen Sie für die Werkstattrechnungen den Kilometerstand, den Händler-/Werkstattnamen und das Reparaturdatum. Die Daten stehen jederzeit zur Anzeige bereit.

Damit die Angaben angezeigt werden können, muss die i156-Datei verfügbar sein, und das Fahrzeug sowie der Servicevertrag müssen in oneSCM bereits vorhanden sein. Die i156 wird voraussichtlich einmal pro Woche oder in dem von den Architekten festgelegten Rhythmus empfangen. Bei jedem weiteren Import werden bereits vorhandene Daten aktualisiert, und beim erstmaligen Import werden neue Daten hinzugefügt.

Beachten Sie folgende Hinweise: Steht die i156 aus irgendeinem Grund nicht zur Verfügung, liegen keine aktualisierten Informationen zur Anzeige vor. Die angezeigten Daten sind aufgrund des wöchentlichen bzw. von den Architekten festgelegten Erstellungs- und Verarbeitungsrhythmus mindestens eine Woche alt. Enthält ein Eintrag in der i156 einen Fehler, steht der betreffende Datensatz in oneSCM nicht zur Verfügung und muss manuell nachgepflegt werden. Jobs, die auf gemeinsame Daten zugreifen, dürfen nicht gleichzeitig laufen. So darf beispielsweise während des Imports der i156 nicht der Job für die i155 gestartet werden.