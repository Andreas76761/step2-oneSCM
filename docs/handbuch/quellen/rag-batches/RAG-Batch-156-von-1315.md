# Batch 156 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 30 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Änderungen im Überblick**

**Händlersubvention und Export an das FI-System**

Der Positionstext PTXT01 beim Export der Händlersubventionsrechnung (E169) wurde überarbeitet. Bisher enthielt er bei Privatkunden-Verträgen (PC) den Händlernamen statt des Kundennamens, bei Transportern (VAN) fehlte der Kundenname ganz. Der Text beginnt nun mit „Händlersubvention für“, gefolgt vom Kundennamen (Vor- und Nachname bzw. Firmenname), der Vertragsnummer, dem Produkt und der Auftragsnummer des Fahrzeugs (MB Order Number).

Interne Händlerprovisionen für VAN-Verträge werden nicht mehr an das FI-System exportiert. Sobald das System sie akzeptiert hat, wechselt ihr Status auf „Processed“. Diese Regel gilt ausschließlich für VAN oneERP. Bei SWT und CoFiCo werden die entsprechenden Rechnungen weiterhin an das FI-System exportiert. Außerdem wurde der fest hinterlegte Wert für den FI-Steuercode im Export für SWT und CoFiCo geändert.

**SWT- und CoFiCo-Schnittstellen**

Für den indischen Markt wird im Feld „MPay Operation Id“ nun die Transaktions-ID anstelle der Operations-ID übermittelt. Die Transaktions-ID befindet sich im Notification-Objekt im Feld „id“. In den Rückmeldedateien zu Rechnungen (Invoice Feedback) für SWT und CoFiCo wurden die Positionen aktualisiert: Der Zahlbetrag steht in den Stellen 58 bis 73, die Währung in den Stellen 74 bis 76. Die genaue Beschreibung finden Sie in den aktualisierten Mapping-Regeln für SWT Inbound.

**Marktkonfiguration**

In den Markteinstellungen wird auf der Seite „Feature Settings“ im Bereich „Invoice configuration“ beim Feld „Threshold amounts“ jetzt zusätzlich die Währung angezeigt, die in den Markteinstellungen hinterlegt ist.

**Ereignisse an Nemesis**

Das Ereignis zur Änderung der Zahlungsdauer enthält nun zusätzlich das Feld „numberOfInvoices“. Im Vertrags-Revenue-Ereignis an Nemesis fehlte bei den Zahlungsarten einmalig, jährlich, vierteljährlich und halbjährlich der Zahlungstyp; dieser Fehler wurde behoben. Ebenso wurde ein Fehler beim Senden von Revenue-Ereignissen an Nemesis korrigiert. Nemesis-Ereignisse werden nur für Rechnungen gesendet, die in den Status „FI Doc Created“ gewechselt sind. Beim Mapping des Händlerrechnungs-Ereignisses wird für die Händler-ID nun die Partnernummer (Vega ID) statt der GSSN-Outlet-ID zurückgegeben.

**Schäden und Ansprüche**

Die neue Oberflächenlösung für abgelehnte Schäden bzw. Ansprüche wurde für kontingentbasierte und laufleistungsbasierte Verträge geprüft, jeweils für den Fall, dass nur ein einzelner Schadencode abgelehnt wird, und für den Fall, dass der gesamte Anspruch abgelehnt wird. Voraussetzung ist ein aktiver Vertrag des jeweiligen Typs und eine erzeugte I155-Datei. Zudem wurde ein Fehler behoben, durch den manuell angelegte Schadencodes beim Import überschrieben wurden.

**Weitere Hinweise**

Ein Problem beim Revenue-Start-up in der Produktionsumgebung wurde behoben. Für Sonderfall-Verträge mit Subventionsrechnungen wird das Verhalten bei Rechnungserstellung, Statusaktualisierung, Export und Nemesis-Ereignissen geprüft. Ebenso befinden sich Prüfungen des MPay-Ablaufs in Arbeit: Es wird verifiziert, dass Vorgänge mit dem MPay-Status „Refunded“ oder „Captured“ sowie MANU- und MPPI-Rechnungen im Status „Accepted“ exportiert und in der Tabelle angezeigt werden.