# Batch 594 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Händlerverwaltung: Änderungshistorie und Gültigkeit**

Mit dieser Funktion werden Händlerdaten in oneSCM automatisch aktualisiert, wenn sich die Eigentümerschaft eines Händlers ändert. Bisher gab es keinen Prozess, der die Händlerverwaltung in oneSCM über einen Eigentümerwechsel informiert oder die Daten entsprechend anpasst. Ein zeitgesteuerter Batch-Job ruft nun die Händler ab, deren Eigentümerschaft auf ein anderes Unternehmen übertragen wurde (als Intervall wurden 30 Tage besprochen). Änderungen werden in der gesamten Anwendung übernommen und zu Historisierungszwecken gespeichert. Voraussetzung ist, dass die GC-Company-ID für die Märkte außerhalb Deutschlands (ROW) hinterlegt ist; für Deutschland ist die Speicherung dieser ID nicht verpflichtend. Die Funktion richtet sich an Benutzer der Market Operations (MO) entsprechend den definierten bzw. neuen Rollen.

**Szenario 1: Eigentümerwechsel in Deutschland**

In Deutschland wird der Händler beim bisherigen Unternehmen beendet, und für das neue Unternehmen wird ein neuer Händler mit einer anderen GSSN-Outlet-ID angelegt. Der ursprüngliche Händler gilt dabei als Vorgänger, der neue als Nachfolger. Name und Adresse können sich ändern, ebenso ändern sich die SAP-Debitorennummer und die Kreditorennummer.

Der Batch-Job prüft in GSSN+, ob sich ein Händler geändert hat. Ist er in oneSCM inaktiv bzw. beendet, wird er auf inaktiv gesetzt und das Datum der Schließung gespeichert. Anschließend wird in der Händlerverwaltungstabelle ein neuer Händler mit allen aktualisierten Daten angelegt, und zwar ohne SAP-Debitorennummer und Kreditorennummer. Für beide Händler, den inaktiven Vorgänger und den neuen Nachfolger, wird in der Verwaltungstabelle eine Historie angezeigt. Market Operations wird per interner E-Mail darüber informiert, dass Änderungen in der Händlerverwaltung vorgenommen wurden und die FI-Systeminformationen aktualisiert werden müssen. MO trägt daraufhin die SAP-Debitorennummer (Pflichtfeld) und die Kreditorennummer (optional) ein.

Anschließend wird ein Event mit den neuen Händlerdaten an den Vertragsbereich gesendet. Es enthält Händlername, Händleradresse, die GSSN-Outlet-ID des inaktivierten und des neu angelegten Händlers, die SAP-Debitorennummer und die Kreditorennummer. Befindet sich der Vertrag innerhalb der Widerrufsfrist (in den Markteinstellungen als Kulanzfrist von 14 Tagen definiert), benachrichtigt der Vertragsbereich den Bereich Revenue. Die Sichtbarkeit von Verträgen bei einer Händleränderung oder beim Wechsel eines Händlers in GSSN+ von einem Unternehmen zu einem anderen soll sich nach dem angepassten ORG-Scope richten. Die Daten müssen dafür während des Epic-Tests auf der eigenen Seite simuliert werden.

Die Historisierung erfolgt in einem einklappbaren Bereich, der die Änderungen anzeigt. Dargestellt werden die Felder Nachfolger (sofern im Payload ein Nachfolger enthalten ist), Vorgänger, Name, Typ, Stadt, Vega-ID, GSSN-Outlet-ID, SAP-Debitorennummer, Kreditorennummer, Startdatum, Enddatum und der Zeitstempel „Generated On“. Ein Händler kann dabei nur einen Vorgänger, nur einen Nachfolger oder beide haben. Wird ein aktueller Händler beendet und ein neuer angelegt, zeigt die Historie den Nachfolger. Gleiches gilt für einen Händler, der in oneSCM auf inaktiv gesetzt wurde. Hat ein aktiver Händler bereits einen Vorgänger und wechselt dann selbst die Eigentümerschaft und wird inaktiv, bleibt in der Historie der Vorgänger sichtbar, und zusätzlich werden die Daten des Nachfolgers ergänzt.

**Szenario 2: Eigentümerwechsel in den übrigen Märkten (ROW)**

Hier wird der Händler zum neuen Unternehmen verschoben, wobei die GSSN-Outlet-ID gleich bleibt. Der Batch-Job prüft in GSSN+, ob sich der Händler geändert hat. Die GC-Company-ID ändert sich, Name und Adresse können sich ebenfalls ändern, und diese Änderungen werden gespeichert. Die Händlerdaten in der Verwaltungstabelle werden aktualisiert. SAP-Debitorennummer und Kreditorennummer werden entfernt, da sie sich bei der Übertragung ändern können. Alte und neue Werte werden gespeichert und in der einklappbaren Historientabelle angezeigt.

Market Operations wird wie in Szenario 1 per interner E-Mail benachrichtigt und trägt die SAP-Debitorennummer (Pflicht) und die Kreditorennummer (optional) ein. Auch das Event an den Vertragsbereich wird gesendet, enthält hier jedoch die unveränderte GSSN-Outlet-ID statt zweier IDs. Die Regelung zur Widerrufsfrist und zur Sichtbarkeit von Verträgen entspricht Szenario 1. Die Historientabelle zeigt die Felder Alter Wert und Neuer Wert mit Name, Typ, Stadt, Vega-ID, GSSN-Outlet-ID, SAP-Debitorennummer, Kreditorennummer, Company-ID, Startdatum und Zeitstempel.

**Benachrichtigung an Market Operations**

Market Operations erhält eine interne E-Mail mit der Information, dass in der Händlerverwaltung eine Aktualisierung erfolgt ist, und wird gebeten, die FI-Systemdaten zu prüfen und zu aktualisieren. Der Betreff lautet „Update FI System Data for Dealership“. Der Inhalt lautet: „New Dealership added or updated in oneSCM: Dealership Name, GSSN Outlet ID. MO-Task: Please update FI System Data for the dealership“.

**Änderungsprotokoll bei Änderungen ohne Eigentümerwechsel**

Der bestehende Batch-Job DealershipSyncWithGssnDataJob prüft Änderungen an der Adresse (Straße, Straßenschlüssel, Land), am Namenszusatz, an der Zugehörigkeit (Affiliate) und an der Vertriebsebene. Werden diese Daten geändert, werden sie zu Historisierungszwecken protokolliert. Das Protokoll ist in der Spalte „Aktionen“ über die neue Option „View Log“ erreichbar. Beim Klick darauf öffnet sich ein Modal, das das geänderte Objekt, den alten Wert, den neuen Wert und den Zeitstempel anzeigt.

**Abnahmekriterien**

In Szenario 1 (Deutschland) wird der bestehende Händler bei einem Eigentümerwechsel auf inaktiv gesetzt, und seine Historie wird im einklappbaren Bereich gespeichert. Der neu angelegte Händler erhält ebenfalls eine Historie mit allen definierten Elementen, der Zeitstempel ist korrekt, und die Felder für SAP-Debitorennummer und Kreditorennummer sind leer. MO erhält die Benachrichtigung zur Aktualisierung der FI-Systemdaten und kann die Werte anschließend eintragen und speichern.

In Szenario 2 (ROW) werden die Daten in der Händlerverwaltung aktualisiert, und die Historie wird mit altem Wert, neuem Wert und Zeitstempel gespeichert. Die Felder für SAP-Debitorennummer und Kreditorennummer sind leer, MO wird benachrichtigt und kann die Werte eintragen und speichern.

Für das Protokoll bei Änderungen ohne Eigentümerwechsel muss die Option „View Log“ verfügbar und aufrufbar sein, und das Protokoll muss die korrekten Änderungen samt Zeitstempel anzeigen.