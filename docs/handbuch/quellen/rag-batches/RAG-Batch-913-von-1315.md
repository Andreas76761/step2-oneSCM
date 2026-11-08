# Batch 913 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Händlerwechsel: Aktualisierung von Servicever­trägen**

Wechselt ein Autohaus den Eigentümer, werden die zugehörigen Serviceverträge automatisch angepasst, sodass Vertragsdaten und Anwendungszugriffe in allen Märkten (Deutschland und übrige Welt) korrekt und aktuell bleiben. Ein zeitgesteuerter Batch-Job prüft dazu regelmäßig, ob sich Eigentumsverhältnisse bei Händlern geändert haben. Wird eine Änderung erkannt, etwa nachdem die Marktorganisation (MO) die SAP-Debitorennummer ergänzt hat, sendet der Customer-Microservice ein Ereignis an den Contract-Microservice. Dieses enthält Händlername, Händleradresse, die bisherige und die neue GS-Outlet-ID, die SAP-Debitorennummer sowie die Kreditorennummer. Werden keine Änderungen gefunden, wird kein Ereignis ausgelöst und im Contract-Microservice erfolgt keine Aktualisierung.

Sobald der Contract-Microservice ein Ereignis mit einer neuen GS-Outlet-ID erhält, ermittelt er alle zur bisherigen GS-Outlet-ID gehörenden Serviceverträge, sowohl im Status Angebot (Proposal) als auch in der Verwaltung (Management). Anschließend überschreibt er die Händlerdaten in der Datenbank und in der Oberfläche, und zwar in der Detailansicht des Vertrags auf dem Reiter „Contract". Aktualisiert werden der Vertragshändler (GSSN+), der Händlername und die Händleradresse. Die Felder des Verkäufers bleiben unverändert. Für die E-Mail-Adresse gibt es einen Hinweis: Sie kann sich ändern, wenn sich der Firmenname ändert. In den Abnahmekriterien ist hingegen festgehalten, dass E-Mail-Adresse und Verkäufer unverändert bleiben sollen.

Erfolgt die Aktualisierung, während sich der Servicevertrag in der Widerrufsfrist befindet, sendet das System zusätzlich ein Benachrichtigungsereignis an den Revenue-Microservice.

**Floater: Fortschrittsanzeige bei der Fahrzeugvalidierung für die Massenanlage**

Für die Massenanlage von Verträgen steht ein schwebendes Anzeigeelement, der sogenannte Floater, zur Verfügung. Er zeigt den Fortschritt der Validierung der Fahrzeugliste in Echtzeit an, sodass Verkäufer währenddessen an anderen Aufgaben weiterarbeiten und den Status trotzdem im Blick behalten können. Voraussetzung ist, dass die Validierung über die Oberfläche gestartet wurde, die Fahrzeuge zur Prüfung an den Vehicle-Microservice gesendet werden und der Tabelle mit der Fahrzeugliste eine Massenanlage-ID zugewiesen ist.

Sobald das erste Fahrzeug zur Validierung gesendet wird, erscheint der Floater zunächst mit „0/Gesamtzahl". Die Anzeige hat das Format x/y: x ist die Anzahl bereits validierter Fahrzeuge, y die Gesamtzahl der Fahrzeuge der Massenanlage-ID. Der Wert x wird mit jeder abgeschlossenen Validierung aktualisiert. Ändert sich die Gesamtzahl, weil Fahrzeuge hinzugefügt oder entfernt werden, passt sich auch der zweite Wert automatisch an. Der Floater bleibt in allen Bereichen der Anwendung sichtbar und aktualisiert sich auch bei einem Seitenwechsel weiter.

Ein Klick auf den Floater führt in den Bereich „Vehicle List" der Massenanlage. Solange die Validierung läuft, ist der Floater orange. Sind alle Fahrzeuge erfolgreich validiert (x = y), wechselt er auf grün. Schließt der Verkäufer den Floater über die Schaltfläche „X", verschwindet er von der Oberfläche. Das interne Benachrichtigungssystem informiert dann nach Abschluss aller Validierungen. Gestaltung und Grafik richten sich nach der Mercedes-Benz Workbench UI/UX.

**Sammlung von Änderungswünschen (PI13)**

Für die Contract Generation wurde zudem eine Sammlung von Änderungswünschen für PI13 abgeschlossen. Nähere Angaben zu Inhalten oder Verhalten liegen dazu nicht vor.