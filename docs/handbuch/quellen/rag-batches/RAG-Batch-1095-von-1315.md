# Batch 1095 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation): Neuerungen und Änderungen**

**Bedienoberfläche und Bedienung**

In der Produktübersicht des Vertragsvorschlags wurde eine Darstellungsschwäche behoben. Wenn Anwenderinnen und Anwender bei bestimmten Zoomstufen des Browsers mit der Maus über eine Produktkachel fuhren, konnten die Beschreibungen der Deckungsumfänge (Coverages) die Trennlinie überschreiten und den Startpreis überlagern. Die Beschreibungen bleiben nun bei allen Zoomstufen in dem dafür vorgesehenen Bereich der Kachel.

Die Schaltfläche, über die in der Vertragserstellung weitere Aktionen ausgelöst werden, hieß bisher „Status“. Sie wurde in „Action“ umbenannt und entspricht damit der Bezeichnung in der Vertragsverwaltung (Contract Management).

Im Reiter „Communication“ wird beim Ersetzen eines Dokuments nun der passende Dokumenttyp im Popup vorausgewählt. Beim Ersetzen des SEPA-Dokuments ist „SEPA Document“ voreingestellt, beim Ersetzen der Allgemeinen Geschäftsbedingungen „Terms and Conditions“. Beim Ersetzen des Servicevertrags bleibt „Service Contract“ vorausgewählt. Bisher war in allen drei Fällen „Service Contract“ voreingestellt, was nicht intuitiv war. Die übrigen Optionen im Typ-Dropdown sind beim Ersetzen deaktiviert, damit keine Dokumente vermischt werden. Wer ein zusätzliches Dokument hinzufügen möchte, nutzt dafür die Upload-Funktion.

Lädt eine Verkäuferin oder ein Verkäufer im Reiter „Communication“ eine Datei hoch, die mehrere Dokumente enthält (zum Beispiel Servicevertrag, SEPA-Dokument und AGB), erscheint nicht mehr die Kurzmeldung „The document type is invalid!“. Stattdessen wird im Kopfbereich des Upload-Fensters mit rotem Hintergrund der Hinweis angezeigt: „You have tried to upload multiple documents at once. Please upload them separately using the correct document type.“

In den Market Settings löst die Schaltfläche „Restore“ das Zurücksetzen nicht mehr sofort aus. Es erscheint ein Bestätigungsfenster mit der Frage, ob die Market Settings wirklich auf die ursprüngliche Einstellung zurückgesetzt werden sollen, und mit dem Hinweis, dass dabei alle vorgenommenen Einstellungen verloren gehen. Mit „Cancel“ oder dem „X“ wird das Fenster geschlossen und der Vorgang abgebrochen. Mit „Proceed“ werden die Werte des aktiven Reiters auf die Standardwerte zurückgesetzt. Nach einem erfolgreichen Zurücksetzen werden Datum und Uhrzeit der letzten Änderung bzw. des letzten Zurücksetzens angezeigt.

**Verträge, Dokumente und Schnittstellen**

Bestätigt die Marktorganisation (MO) einen Vertrag, werden alle Dokumentenprüfungen auf „OK“ gesetzt, sofern sie nicht den Status „Not Applicable“ haben.

Über den Edge Service konnten Verträge bisher nur im Status „Confirmed“ aktualisiert werden. Künftig ist das Aktualisieren bzw. Neukonfigurieren auch im Status „Created“ möglich.

Bei den Leasing-Schnittstellen (POST /contract/v1/leasing und PUT /contract/v1/leasing/configuration) wurden die Felder zu Verkäufer und Händler aus dem Request-Body entfernt: salesmanFirstName, salesmanLastName, outletName, outletCountry, salesmanPhoneNumber, dealerName und dealerAddress. Die Ermittlung der verkaufenden Person erfolgt nun wie im Retail-Bereich (oneSCM FE): Anhand der E-Mail-Adresse werden die relevanten Informationen über ALICE abgerufen und auf Vertragsebene gespeichert. Die Dokumentation wurde entsprechend aktualisiert.

Beim Aufruf des Vehicle Service wird der Vertriebskanal nicht mehr fest auf „Retail“ gesetzt. Der Vertriebskanal (Sales Channel) wird stattdessen in den Produktdetails hinterlegt und als Feld in den Anfragen für Leasing- und Standardverträge im Contract Service und im Edge Service mitgegeben.

In Edge-Service-Anfragen wird zusätzlich die Division (PC oder VAN) im Body übergeben. Ist der Wert „null“, leer oder keiner der vorhandenen Divisionen zugeordnet, wird ein Fehler ausgegeben.

Für Dokumente wird bei Verträgen für den slowakischen Markt nun eine Übersetzung des Ländernamens verwendet. Diese Änderung befindet sich derzeit im BAT-Test.

**Markt-ID (Market ID)**

Die Markt-ID wird nicht mehr nur im Header übergeben, sondern ist Teil der Anfrage zum Erstellen eines Vertrags, sowohl für Standard- als auch für Leasingverträge. Das Feld marketId der Vertragsentität ist ein Pflichtfeld. Beim Erstellen, Bestätigen und Aktivieren eines Leasingvertrags ist außerdem der Header „X-Market“ verpflichtend. Bei der Vertragserstellung wird zusätzlich geprüft, dass die marketId in der Anfrage nicht leer ist und als Markt im Configuration Service existiert.

**Anpassung der Parameter für MBLD**

Der bisherige Kilometerparameter wird durch requestedTotalMileage ersetzt, der die Gesamtlaufleistung über die gesamte Vertragslaufzeit abfragt. Das neue Kennzeichen isPriceForTotalMileageRequested = true gibt an, dass die Preisberechnung auf der Gesamtlaufleistung über die Vertragslaufzeit und nicht auf der jährlichen Laufleistung basiert. Der Serviceaufruf von MBLD muss die Laufleistungsanfrage als requestedTotalMileage enthalten.