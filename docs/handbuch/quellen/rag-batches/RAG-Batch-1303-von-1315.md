# Batch 1303 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Architektur und technische Qualität**

Im Bereich Architektur wurden in diesem Release mehrere Themen abgeschlossen, die vor allem die Stabilität, Wartbarkeit und Leistungsfähigkeit des Systems betreffen.

Ein Schwerpunkt lag auf der Codequalität und Sicherheit. Die von Sonar gemeldeten Auffälligkeiten im Frontend wurden bearbeitet. Für den Bereich „Explorers" wurden die gemeldeten Bugs und Security Hotspots behandelt, die zuvor im Dokumenten- und im Kundenservice aufgeführt waren. Darüber hinaus wurde ein Arbeitspaket zur Behebung von Schwachstellen abgeschlossen. Auch die Abmeldung von Benutzern (Security-User-Logout) wurde für die Entwicklungs- und Integrationsumgebung angepasst.

Im Edge Service wurde eine Inkonsistenz bei der Interpretation der Laufleistung zwischen den Schnittstellen „getProducts" und „createContract" behoben. Die Batch-Jobs wurden für einen neuen Markt (Explorers) angepasst. Außerdem wurde ein Problem gelöst, bei dem der Batch-Job „CustomerImportFiSystemJob" blockiert war, sowie ein Datenbankfehler, bei dem Transaktionen wegen Lese-/Schreibabhängigkeiten nicht serialisiert werden konnten und abgebrochen wurden.

Für den Job E169 wurde die Performance im Backend verbessert. Externe Aufrufe, die Daten für die Verarbeitung abrufen, werden nun zwischengespeichert. Dadurch entfallen redundante Anfragen und die Antwortzeiten verbessern sich, was sich vor allem bei großen Rechnungsmengen und insbesondere bei Sammelrechnungen bemerkbar macht.

In den Markteinstellungen wurde die Steuerverwaltung neu angeordnet. Die Komponente „Tax Management" wurde in die allgemeinen Einstellungen der Markteinstellungen verschoben und steht dort als neuer Tab „Tax Management" an zweiter Stelle, nach dem Tab „General". Zudem wurde in jedem Microservice der Aufruf zum Abrufen der Steuerwerte entsprechend angepasst.

Im Rahmen der Qualitätssicherung (AQA) wurden für PI 12 mehrere Themen abgeschlossen: die Architekturthemen, die technische Analyse, die Prüfung, dass allen Tests Xray-Einträge zugeordnet sind, sowie die Produktanlage und -veröffentlichung. Das Vorhaben zur Einführung von AQA-Abläufen für leistungsbezogene Unit-Tests wurde geschlossen.

Das Vorhaben „Configure Market Users" wurde abgebrochen und ist in diesem Release nicht enthalten.