# Batch 1041 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 33 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation – Release-Hinweise für das Benutzerhandbuch**

**Startseite der Vertragserstellung**
Für Kunden und Händler gibt es eine neue Startseite, auf der sich Serviceverträge passend zur Fahrzeugspezifikation erzeugen lassen. Oben befindet sich eine Suchbox, mit der Sie unter anderem nach der Fahrgestellnummer suchen können. Die Suche startet entweder mit der Eingabetaste oder über die Schaltfläche „Search“. Mit „Reset“ löschen Sie die eingegebenen Suchkriterien. Darunter zeigt die Tabellenkopfzeile an, wie viele Datensätze von der Gesamtzahl der Treffer angezeigt werden. Die Anzahl der Einträge pro Seite lässt sich auf 10, 20, 30, 40 oder 50 einstellen; der 51. Datensatz erscheint dann auf der zweiten Seite. Die Beschriftung „Entries on page“ entfällt, damit die Ansicht zu den anderen Tabellenansichten passt. Über die Schaltfläche „Create Contract“ öffnen Sie den Assistenten zur Vertragserstellung. Der Tabelleninhalt wird in weiteren Abstimmungen noch festgelegt. Die Gestaltung folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design. Voraussetzung für die Nutzung ist die Anmeldung mit einem Benutzer, der das Recht zur Vertragserstellung hat. Die genaue Berechtigung ist noch offen, für die Entwicklung wird ein Super-Admin verwendet. Anschließend rufen Sie den Bereich Contract Generation auf und starten den Assistenten über „Create Contract“.

**Banküberweisung in der Schweiz**
Für den Schweizer Markt ist die Banküberweisung nun für alle Kundentypen auswählbar, also für Privatkunden, private öffentliche Kunden, Gewerbekunden, Flottenkunden und gewerbliche öffentliche Kunden. Bisher war sie auf gewerbliche Kundentypen beschränkt. Im Reiter „Payment“ wird die Banküberweisung für jeden Kundentyp angeboten, sofern die Zahlungsmethoden des Produkts und die Markteinstellungen dies zulassen und die Banküberweisung in den Markteinstellungen aktiviert ist. Die Backend-Validierung akzeptiert die Banküberweisung für alle Kundentypen, wenn der Markt Schweiz ist. Da die Schweiz ein COFICO-Markt ist, wird die gewählte Banküberweisung ohne Prüfung eines Kontovermerks gewährt, und die entsprechende MO-Prüfung gilt als „NOT_APPLICABLE“. Der Vertrag läuft danach im üblichen Ablauf weiter. In allen anderen Märkten bleibt die Banküberweisung unverändert auf gewerbliche Kunden beschränkt.

**Konfigurierbare zusätzliche Prüfungen bei der Vertragsaktivierung**
Die MO-Prüfungen werden um zusätzliche, konfigurierbare Aktivierungsprüfungen erweitert. Dabei wird das Verhalten bei der Vertragserstellung und -aktivierung geprüft, je nachdem, ob diese zusätzlichen Prüfungen aktiviert oder deaktiviert sind. Voraussetzung ist, dass ein HQ-Admin-MPC-Benutzer Zugriff auf die Markteinstellungen hat und das MO-Checks-Framework umgesetzt ist. Die Erweiterung ist derzeit noch in Bearbeitung.

**Sonderfall-Freigabe**
Es wird geprüft, ob ein MO/MPC-Benutzer ein Produktangebot erstellen kann, das eine Sonderfall-Freigabe erfordert. Dieses Angebot wird einem Händler zugewiesen, die erforderliche unabhängige Validierung und Freigabe erfolgen, und der Händler kann die Aktivierung abschließen.

**Weitere Funktionen**
Der Schalter für gesammelte Finanzdokumente in der Vertragserstellung steht für MO-Benutzer zur Verfügung. Außerdem wurden die ISP-Daten in der Vertragserstellung geprüft, jeweils für Deals mit ISP „true“ und ISP „uncertain“.

**Behobene Fehler und Korrekturen**
Unterschriebene SEPA-Dokumente, die in oneSCM signiert waren, kamen in oneERP zunächst unsigniert an. Dies wurde korrigiert. Eine frühere Backend-Implementierung wurde zurückgenommen.

Zahlreiche Störungen in der Vertragserstellung sind behoben. Dazu gehören:

Bei der Aktivierung und Prüfung betraf dies das Fortsetzen von Verträgen, fehlerhafte MO-Prüfungen, Probleme mit dem VIES-Check, eine zu frühe automatische Ablehnung mit falschem Ablehnungsgrund in der Vertragshistorie sowie Angebote, die zu Unrecht abgelehnt wurden oder nach langer Zeit im Status „CAS Check Pending“ nicht auf „Confirmed“ wechselten. Ebenfalls behoben ist die automatische Ablehnung von Vertragsvorschlägen wegen fehlender Fahrzeugdaten. Dazu zählt der Fall, dass eine in OTR vorhandene Fahrgestellnummer in den oneSCM-Fahrzeugdaten fehlte und die Vertragserstellung blockierte.

Bei Daten und Dokumenten betraf dies abweichende FRD-Werte, die fehlende Möglichkeit, FRD und Kennzeichen bei Massenerstellungen von Angeboten zu aktualisieren, falsche Allgemeine Geschäftsbedingungen an Verträgen, fehlgeschlagene Dokumenten-Uploads sowie das Drucken von Preisinformationen.

In der Bedienung betraf dies die Fehlermeldung „No industries selected from the list“, Angebote für Gewerbekunden ohne Branche, die Meldung „Product Data could not be loaded“ bei der Auswahl der Zahlungsmethode, Fehler bei der Gruppen-ID sowie einen Benutzer, der einen Sonderfall nicht prüfen konnte. Drei Verträge mussten manuell aktiviert werden. Ein Fehler bei der Erstellung von Verträgen für Gebrauchtwagenprodukte befindet sich noch in Analyse.