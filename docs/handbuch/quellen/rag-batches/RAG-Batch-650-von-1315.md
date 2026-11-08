# Batch 650 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Customer & Partner Management – Änderungen und Neuerungen**

**Configuration Service**
Mit dem Configuration Service lässt sich die Darstellung von Angaben in der Anwendung für einen bestimmten Markt festlegen. Die Einstellungen können von MPC-PM-Benutzern vorgenommen werden. Pro Markt steht genau eine Konfiguration zur Verfügung. Alle anderen Benutzer sehen die Felder anschließend entsprechend der Konfiguration ihres Marktes.

Folgende Einstellungen stehen zur Verfügung:

Das Zeitformat wird per Einzelauswahl festgelegt, entweder als 24-Stunden-Format [hh:mm] oder als 12-Stunden-Format [hh:mm PM]. Über ein Kontrollkästchen lässt sich zusätzlich festlegen, ob auch Sekunden angezeigt werden (hh:mm:ss). Das Datumsformat wird ebenfalls per Einzelauswahl bestimmt, wobei die Reihenfolgen [yyyy mm dd], [mm dd yyyy] und [dd mm yyyy] zur Verfügung stehen. Als Datumstrennzeichen können [-], [/] oder [.] gewählt werden.

Für die Währung ist eine Mehrfachauswahl möglich. Es wird dieselbe Liste verwendet wie im Auswahlfeld „Currency“ in den Customer Details, und es werden die im jeweiligen Markt zulässigen Währungen festgelegt. Das Namensformat wird per Einzelauswahl bestimmt, entweder [First Name, Last Name] oder [Last Name, First Name]. Beim Zahlenformat stehen [1.000,0], [1,000.0] und [1’000.0] zur Auswahl. Die Anzahl der Nachkommastellen wird ebenfalls per Einzelauswahl festgelegt: [No decimal], [1 Decimal] oder [2 Decimals]. Die Sprachen eines Marktes werden per Mehrfachauswahl bestimmt, und zwar aus derselben Liste wie im Auswahlfeld „Language“ in den Customer Details. Für die Schweiz sind beispielsweise Deutsch, Französisch, Italienisch und Englisch vorgesehen.

**Anlage von Kunden in oneERP**
Wenn der Vertragsstatus „Confirmed“ ist und der Kundenstatus „In Confirmation“ lautet, prüft das System zunächst, ob in oneSCM bereits eine Debitorennummer des Kunden vorliegt. Anschließend wird geprüft, ob oneERP die Debitorennummer des Kunden kennt. Sind die Bedingungen nicht erfüllt, wird an oneERP eine XML-Datei gesendet, um den Kunden dort anzulegen. Der Status „In Confirmation“ signalisiert dabei, dass der Datensatz per XML-Datei an das FI-System übermittelt werden muss. Für die BusinessPartnerAPI ist stets MPI-BusinessProcessVariantCode = „CMD“ zu setzen.

Die Anlage erfolgt anschließend in oneERP. Da die Schnittstelle asynchron arbeitet, erhält oneSCM auf den Post-Call keine Debitorennummer, sondern lediglich eine Rückmeldung, dass der Kunde zu einem bestimmten Datum angelegt wurde. Die Debitorennummer wird daher über einen weiteren Aufruf der BP-API von oneERP abgerufen, wobei nach dem Datum der Rückmeldung gefiltert wird. Wurde der Debitor beispielsweise am 29.11.2023 angelegt, werden alle Debitoren mit diesem Aktualisierungsdatum abgefragt. Die erhaltene Rückmeldung wird genutzt, um die Kundendaten in oneSCM zu aktualisieren. Die Informationen werden nach etwa 24 Stunden zurückgemeldet. Der konkrete Endpunkt für die Übergabe der Datei steht noch nicht fest. Eine entsprechende Anforderung an das oneERP-Projektteam wurde im Januar 2024 genehmigt, ein fester Zeitplan für die Umsetzung liegt jedoch noch nicht vor.

**Behobene Fehler**
Auf der Übersichtsseite der Vertragserstellung trat beim Vor- und Zurücknavigieren ein Fehler auf, der behoben wurde. Ebenfalls behoben wurde ein Problem mit der Statusaktualisierung des Umschalters für die globale Sammelrechnung in Schritt 3 des Vertragserstellungs-Assistenten.

**Noch offene Tests**
Manuelle Testdurchführungen stehen derzeit noch aus für die Debitorennummer (SAP) von Händlern bzw. die Market-Operation-Tabelle, für die Sanktionslistenprüfung im CAS sowie für das Anlegen und Aktualisieren eines neuen Mercedes-me-Profils im Customer & Partner Management.