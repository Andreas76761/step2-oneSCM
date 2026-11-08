# Batch 662 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Händlerverwaltung und SAP-Debitorennummern**

Im Admin-Bereich von oneSCM steht Benutzern der Market Operation (MO) bzw. des MPC eine Funktion zur Verwaltung von Händlern samt SAP-Debitorennummern zur Verfügung. Über die Schaltfläche „Upload Dealers" kann eine Liste bekannter Händler hochgeladen werden. Akzeptiert werden Excel- und CSV-Dateien. Jede hochgeladene Datei wird auf Viren und Bedrohungen geprüft. Die Datei muss die Spalten Dealership Name, City, GSSN Outlet ID und SAP Debitor Number enthalten; das System validiert diese Pflichtspalten. Beim Upload werden nur neue oder geänderte Einträge übernommen, bereits vorhandene Datensätze bleiben unverändert. Etwaige Fehler beim Upload werden dem Benutzer angezeigt.

Die Daten erscheinen anschließend in einer Tabelle. Alle Spaltenüberschriften sind sortierbar (von A bis Z bzw. vom kleinsten zum größten Wert), und beim Überfahren mit der Maus wird die jeweilige Zeile hervorgehoben. Die Tabelle lässt sich nach Dealership Name und GSSN Outlet ID durchsuchen, wobei die Suche nach dem Prinzip „enthält" arbeitet. Die Anzahl der angezeigten Einträge pro Seite kann der Benutzer selbst wählen.

Einzelne Händler lassen sich auch manuell erfassen. Über die Schaltfläche „Register Dealership" öffnet sich ein Pop-up mit den Feldern Dealership Name (max. 30 Zeichen, alphanumerisch), City (max. 30 Zeichen, alphanumerisch), GSSN Outlet ID (max. 10 Zeichen, numerisch) und SAP Debitor Number (max. 10 Zeichen, numerisch). Alle Felder sind Pflichtfelder; die Schaltfläche „Create" steht erst zur Verfügung, wenn alle Felder ausgefüllt sind. Der neu angelegte Händler wird in der Tabelle angezeigt. In der Tabellenübersicht stehen außerdem die Aktionen „Edit" und „Delete" bereit. „Edit" öffnet ein Pop-up mit vorausgefüllten Daten, die bearbeitet werden können. Es gelten dieselben Validierungen, und „Update" ist erst verfügbar, wenn alle Pflichtfelder gefüllt sind. „Delete" ist nur verfügbar, solange die SAP-Debitorennummer noch in keiner Rechnung verwendet wurde. Vor dem Löschen erscheint eine Warnmeldung.

**Prüfung bei der Vertragserstellung**

Wenn bei der Erstellung eines Vertrags ein Händlerrabatt angeboten wird, teilen sich die Vertragskosten in den Anteil des Kunden und den Anteil des Händlers auf. Bei der Aktivierung eines solchen Vertrags prüft das System, ob für den rabattgebenden Händler eine SAP-Debitorennummer zur zugeordneten GSSN Outlet ID hinterlegt ist. Wird keine Übereinstimmung gefunden, zeigt der Bereich „Dealership Check" in den MO-Checks den Status „NOK" an. Ein Hyperlink führt dann zu einem Pop-up, in dem die fehlende Nummer ergänzt werden kann. Dealership Name, City und GSSN Outlet ID sind dort aus GSSN+ vorausgefüllt und nicht editierbar. Nur die SAP Debitor Number (max. 10 Zeichen) muss manuell eingegeben werden. „Create" ist erst nach Eingabe der Nummer verfügbar. Die neu eingegebene Nummer wird gespeichert und die Vertragserstellung wird fortgesetzt. Die Daten werden in der Vertragsdatenbank abgelegt und an das Revenue Management übermittelt.

**Korrekturen**

Bei der Vertragserstellung wurde eine gültige Adresse (getestet mit einer Stuttgarter Adresse) fälschlicherweise als ungültig abgelehnt, sodass kein Vertrag erzeugt werden konnte. Vorgesehen ist, dass nach dem Ausfüllen der Pflichtfelder die Adresse validiert, die zugehörigen Felder befüllt und der Prozess fortgesetzt werden kann.

Außerdem wurde das Datumsformat in der Vorschau der Kundendaten korrigiert. Datumsangaben werden nun im Format TT.MM.JJJJ (dd.mm.yyyy) dargestellt.