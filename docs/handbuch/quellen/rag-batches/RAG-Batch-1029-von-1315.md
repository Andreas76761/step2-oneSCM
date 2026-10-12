# Batch 1029 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Automatische Vertragsprüfungen bei der Vertragserstellung**

Bei der Erstellung eines Vertrags führt oneSCM automatische Prüfungen durch, um sicherzustellen, dass die Angaben im Vertrag mit den ursprünglich validierten Angaben übereinstimmen, die bei der Anzeige der Produktoptionen verwendet wurden. Diese Prüfungen erhöhen die Genauigkeit, die Effizienz und die Regelkonformität und verbessern die Gesamtqualität des Prozesses der Vertragserstellung und -verwaltung. Sie verringern das Risiko menschlicher Fehler und sorgen dafür, dass alle geprüften Daten einheitlich validiert werden. Ohne diese Prüfungen drohen fehlerhafte Daten, Compliance-Probleme, mögliche Manipulationen während der Vertragserstellung, fehlende Nachweise bei Audits, finanzielle Verluste durch Preisfehler oder falsche Abrechnung, ein Vertrauensverlust bei Kunden durch unvollständige oder irreführende Vertragsinformationen sowie ein hoher Aufwand für manuelle Kontrollen.

**Zeitpunkt und Ablauf**

Die Prüfungen werden nach dem zweiten Schritt des Vertragserstellungs-Assistenten durchgeführt, also vor der Vergabe der Vertragsnummer und bevor der Vertragsstatus auf CREATED gesetzt wird. Sobald Sie die Schaltfläche „Next“ anklicken, starten die Prüfungen. Zuvor haben Sie unter „Contract Generation“ die Funktion zum Erstellen eines Vertrags aufgerufen, in der Produktauswahl die Pflichtfelder Fahrgestellnummer, FRD und Laufleistung angegeben, aus den passenden Produkten eines ausgewählt und konfiguriert und anschließend die Kundendaten erfasst.

Die Prüfungen laufen in fester Reihenfolge ab. Zunächst werden Fahrgestellnummer, FRD und Laufleistung geprüft. Sind diese in Ordnung, folgen die produktbezogenen Prüfungen. Sind auch diese erfolgreich, folgen die preisbezogenen Prüfungen und danach die kundenbezogenen Prüfungen. Sind alle Prüfungen erfolgreich, vergibt das System die Vertragsnummer und setzt den Vertragsstatus auf CREATED. Schlägt eine der Prüfungen fehl, wird eine passende Hinweismeldung (Toast-Meldung) angezeigt. Der Vertrag wird dann nicht erstellt, und es wird keine Vertragsnummer vergeben.

**Produktbezogene Prüfungen**

Voraussetzung ist, dass Produktcode bzw. Produkt-ID, Produktvariante und die Eignung des Fahrzeugs für das gewählte und konfigurierte Produkt zuvor von der Domäne Contract Calculation validiert wurden. Grundlage dafür sind der aus der Fahrgestellnummer ermittelte Baumuster-Code (BM6) sowie FRD und Laufleistung, aus denen die angezeigten Produktoptionen abgeleitet werden.

Bei der Prüfung des Produktcodes bzw. der Produkt-ID wird kontrolliert, ob der dem Vertrag zugewiesene Wert mit dem im ersten Schritt des Assistenten gewählten Produkt übereinstimmt. Die Domäne Contract Calculation liefert dabei nur Produkte, die für die eingegebenen Fahrzeugkriterien verfügbar sind. Stimmt der Wert nicht überein, erscheint die Meldung „Selected product is not available, please select a valid product“, und der Vorgang wird nicht fortgesetzt.

Bei der Prüfung der Produktvariante wird kontrolliert, ob die dem Vertrag zugewiesene Variante mit der im ersten Schritt gewählten übereinstimmt. Die Domäne Contract Calculation liefert hierfür die Matrix mit dem niedrigsten Preis, und anhand der Konfiguration des Benutzers wird der Preis angezeigt. Stimmt die Variante nicht überein, erscheint die Meldung „The selected product is no longer available for the selected period, annual mileage and payment interval“, und der Vorgang wird ebenfalls abgebrochen.

Bei der Prüfung der Fahrzeugeignung wird kontrolliert, ob die zugewiesene Eignung mit der Auswahl im ersten Schritt übereinstimmt. Contract Calculation liefert nur Produkte, die für die eingegebenen Fahrzeugkriterien verfügbar sind, und prüft über das Digitale Serviceheft (DSB), ob das Fahrzeug die Voraussetzungen hinsichtlich der Servicehistorie erfüllt. Die Prüfung, ob das Fahrzeug bereits einen aktiven Servicevertrag besitzt, der mit dem gewünschten Produkt nicht kompatibel ist, gehört nicht zum MVP und ist damit nicht Teil des ersten Funktionsumfangs.

**Preisbezogene Prüfungen**

Voraussetzung ist, dass der Gesamtpreis brutto und der monatliche Kundenpreis brutto zuvor von der Domäne Contract Calculation validiert wurden. Die von Contract Calculation gelieferten Preise sind Nettopreise; die Mehrwertsteuer wird erst in der Domäne Contract Generation hinzugefügt.

Bei der ersten Preisprüfung wird kontrolliert, ob der dem Vertrag zugewiesene Gesamtpreis brutto mit dem im ersten Schritt gewählten und konfigurierten Preis übereinstimmt. Der Gesamtpreis brutto des Kunden muss dazu dem Bruttolistenpreis der Produktvariante in oneSCM entsprechen. Ist das der Fall, gilt die Prüfung als bestanden. Weicht er ab, gilt sie als nicht bestanden, es erscheint die Meldung „The selected price is no longer available“, und der Vorgang wird nicht fortgesetzt.

Bei der zweiten Preisprüfung wird entsprechend kontrolliert, ob der dem Vertrag zugewiesene monatliche Kundenpreis brutto mit dem monatlichen Bruttolistenpreis der Produktvariante in oneSCM übereinstimmt. Bei Übereinstimmung gilt die Prüfung als bestanden. Bei einer Abweichung erscheint ebenfalls die Meldung „The selected price is no longer available“, und der Vorgang wird nicht fortgesetzt.