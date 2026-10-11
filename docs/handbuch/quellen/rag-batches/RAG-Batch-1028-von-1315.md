# Batch 1028 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Erweiterte Suchmöglichkeiten bei der Vertragsabfrage**

Die Abfrage von Verträgen über die Schnittstelle wurde um zahlreiche zusätzliche Suchkriterien erweitert. Bisher konnten Verträge nur anhand von Vertragsnummer, Kundenname, FIN/VIN, Status und Kennzeichen abgefragt werden. Nun stehen zusätzlich die folgenden Kriterien zur Verfügung: Land, Erstellungsdatum, Ablaufdatum, Monate bis zum Ablauf, Ersteller, Produktname, Baumuster (BM6) und Deckungsumfänge (Coverages). Für Baumuster und Deckungsumfänge können jeweils mehrere Werte angegeben werden.

Darüber hinaus ist es nun möglich, bei den Feldern Kundenname, FIN/VIN (Fahrgestellnummer), Ersteller und Produktname mehrere Eingabewerte gleichzeitig zu verwenden. Die Ergebnisse lassen sich filtern, sortieren und seitenweise anzeigen. Alle Felder sind optional; die Abfrage wird anhand der tatsächlich eingegebenen Felder ausgeführt. Es werden alle passenden Ergebnisse ermittelt und entsprechend dargestellt.

**Automatisierte Vertragsprüfungen für Kundendaten**

Im Rahmen der Vertragserstellung werden die kundenbezogenen Angaben nun automatisch geprüft. Ziel ist es, die Genauigkeit, Effizienz und Regelkonformität zu erhöhen, die Qualität der Vertragserstellung und -verwaltung insgesamt zu verbessern, das Risiko menschlicher Fehler zu verringern und eine einheitliche Validierung der geprüften Daten sicherzustellen.

Die Prüfungen werden nach dem zweiten Schritt des Assistenten zur Vertragserstellung durchgeführt, und zwar beim Klick auf „Weiter“. Sie finden statt, bevor eine Vertragsnummer vergeben und der Vertragsstatus auf „CREATED“ gesetzt wird. Vorausgesetzt wird, dass zuvor die automatisierten Prüfungen für Fahrzeug, Produkt und Preis erfolgreich abgeschlossen wurden. Die Reihenfolge lautet: Zunächst werden Fahrgestellnummer, Datum der Erstzulassung (FRD) und Laufleistung geprüft, danach die produktbezogenen Prüfungen, anschließend die preisbezogenen Prüfungen und zuletzt die kundenbezogenen Prüfungen.

Geprüft werden die Kundendaten, die Kundenadresse und die Zahlungsdaten. Dabei wird kontrolliert, ob alle Pflichtfelder ausgefüllt sind, ob die Formate dem Kundendatenmodell entsprechen und ob der Kunde in der Domäne Customer and Partner Management vorhanden ist. Sind alle Kriterien erfüllt, gilt die Prüfung als bestanden. Dann wird die Vertragsnummer vergeben und der Vertrag mit dem Status „CREATED“ angelegt.

Ist mindestens ein Kriterium nicht erfüllt, gilt die Prüfung als nicht bestanden. Es erscheint eine Hinweismeldung (Toast Message) mit dem Text „Please insert a valid format in the XYZ field“, wobei XYZ für das Feld steht, dessen Angaben nicht korrekt ausgefüllt wurden. In diesem Fall wird der Vertrag nicht erstellt und es wird keine Vertragsnummer vergeben.

Ohne diese automatisierten Prüfungen drohen unter anderem fehlerhafte Daten, Verstöße gegen Compliance-Vorgaben, Sicherheitsrisiken durch mögliche Manipulation von Daten während der Vertragserstellung, Schwierigkeiten beim Nachweis der durchgeführten Prüfungen, finanzielle Verluste durch Preisfehler oder falsche Abrechnung, Vertrauensverlust bei Kunden durch unvollständige oder irreführende Vertragsangaben sowie ein hoher Aufwand für manuelle Kontrollen.