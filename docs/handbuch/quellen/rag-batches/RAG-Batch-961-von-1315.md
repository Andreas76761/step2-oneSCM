# Batch 961 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

In der Domäne Contract Generation wurde die automatisierte Qualitätssicherung für zentrale Abläufe der Vertragserstellung ausgebaut. Die wichtigsten Testfälle der Fachseite wurden neu geordnet und zu durchgängigen End-to-End-Smoke-Abläufen zusammengeführt. Grundlage sind die bereits freigegebenen Testfälle. Ein weiterer Ablauf deckt die Vertragserstellung mit einer Kampagne ab.

Abgedeckt sind mehrere Szenarien. Ein Benutzer kann einen monatlichen Privatvertrag mit Fahrgestellnummer als Identifikator für einen neuen Kunden aktivieren und per Druckverfahren (PRINT) unterschreiben. Dies ist sowohl für die Abläufe mit Baumuster, Build-to-Order und Build-to-Stock als auch für den Fall eines Privatkunden mit bereits vorhandener Fahrgestellnummer vorgesehen. Ebenso kann ein monatlicher Gewerbevertrag (Commercial) mit vorhandener Fahrgestellnummer für einen neuen Kunden aktiviert und per Druckverfahren unterzeichnet werden.

Für jedes dieser Szenarien gilt: Alle erwarteten Ergebnisse sind im jeweiligen Testfall abgedeckt, die Testergebnisse werden ausgeführt und sind auf GitHub Pages einsehbar, und jedem Szenario ist ein zugehöriger xRay-Testfall zugeordnet.

Darüber hinaus wurde eine Funktion zur Bereitstellung von Vertrags-, Fahrzeug- und Kundendaten als XLSX-Datei beim Download aus der Kundenhistorie konzipiert. Hintergrund ist die Datenschutz-Grundverordnung (DSGVO), nach der Kunden das Recht haben zu erfahren, welche personenbezogenen Daten über sie gespeichert werden. Anfragen hierzu gelangen über das DATIX-System (Daimler Application For Trusted Information Xchange) an die Marktorganisationen (MO). Der MO-Benutzer soll den Kunden in der Kundenhistorie suchen und die in oneSCM gespeicherten Daten per Klick in einem DATIX-spezifischen Format herunterladen können. Die Datei wird anschließend in das DATIX-Ticketsystem hochgeladen. Dieses Vorhaben wurde allerdings geschlossen und nicht umgesetzt.

Für die geplante Datei waren folgende Vorgaben festgelegt: Sie enthält Fahrzeugdaten (gefiltert nach einer bestimmten FIN aus der Kundenhistorie), Vertragsdaten und Kundendaten. Die Daten stehen in der Spalte „Inhalt“, alle Felder werden im Textformat so ausgegeben, wie sie in oneSCM gespeichert sind, und Zeilen ohne Daten werden vollständig entfernt, es gibt also keine leeren Zeilen. Bei Kunden mit mehreren Fahrzeugen, Verträgen oder Bankverbindungen können zusätzliche Zeilen ergänzt werden, solange das Format erhalten bleibt. Pro Kundenanfrage wird ein Export für den gesamten Kunden bereitgestellt. Die Datei wird an die Domäne Customer & Partner geliefert und nicht gespeichert.

Zusätzlich existiert eine Sammlung von Change Requests für die Vertragserstellung im Programminkrement 9 (PI9). Dazu liegen keine weiteren inhaltlichen Angaben vor.