# Batch 1180 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Externe Schnittstellen (External APIs)**

Die externen Anwendungen werden zusammengeführt und über eine einheitliche Schnittstellenstruktur bereitgestellt. Zusätzlich wird die Leasingfunktion für Produkte integriert, etwa für die Abfrage verfügbarer Produkte oder für den Online-Vertrieb. Außerdem wird eine Versionierung der Schnittstellen unterstützt.

**Kommunikation zwischen Vertrag und Produkt (BTO/BTS-Fall)**

Für diesen Fall gibt es zunächst eine temporäre Lösung. Dabei werden die Preise anhand des Erstellungsdatums des Angebots rückwirkend berechnet. Die Konfiguration bleibt unverändert: Die Administrationsgebühr wird nicht angepasst, und die optionale COV des Produkts wird nicht entfernt. Diese Übergangslösung wurde am 14.04.2025 produktiv bereitgestellt. Als dauerhafte Lösung ist eine Schnittstelle vorgesehen, die den Preis auf Basis des Erstellungsdatums des Angebots berechnet. Für die Produktivsetzung wurde im besten Fall Sprint 10.2 angestrebt, im ungünstigsten Fall Sprint 10.3.

**Massenanlage: Informationen anhand einer Liste von Identifikatoren**

Das System stellt Fahrzeugdaten und Informationen zur Produktkompatibilität an Generation zurück, sodass mehrere Angebote gleichzeitig angelegt werden können (Massenanlage). Pro Anfrage sind maximal 100 Identifikatoren erlaubt. Als Identifikatoren werden FIN/VIN oder Auftragsnummer akzeptiert. Baumuster-Identifikatoren sind nicht zulässig. Wird ein Baumuster übergeben, liefert das System für diesen Identifikator sofort einen Fehler. Ob die Anfrage vollständig abgelehnt wird, wenn ausschließlich Baumuster enthalten sind, hängt von der noch festzulegenden Fehlerbehandlungsstrategie ab.

Der gesamte Ablauf aus Senden der Liste, Suchen und Validieren sowie Zurückgeben der Ergebnisse erfolgt asynchron. Für jeden gültigen Identifikator prüft das System, ob dieser in den zugrunde liegenden Datenquellen vorhanden ist. Es ermittelt außerdem das Datum der Erstzulassung (FRD), den aktuellen Kilometerstand und den aktuellen Fahrzeugstatus. Auf Basis dieser Daten bestimmt es die Kompatibilität der Produkte mit dem jeweiligen Fahrzeug.

Nach Abschluss der Verarbeitung sendet das System eine gesammelte Antwort für alle verarbeiteten Identifikatoren an Generation. Für jedes erfolgreich validierte Fahrzeug enthält sie die Fahrzeugdaten (FRD, Kilometerstand, Status), die Liste der kompatiblen Produkte und den genauen Preis jedes kompatiblen Produkts, jeweils als Monatspreis und als Gesamtpreis. Dabei gilt die Annahme, dass die Fahrzeuge dieselben technischen Optionen und Konfigurationen haben. Das bedeutet: Ist ein Produkt kompatibel, ist sein Grundpreis vor fahrzeugspezifischen Rabatten und Kampagnen einheitlich. Kompatibilität und Endpreis werden dennoch für jedes Fahrzeug einzeln bestimmt. Kann ein Identifikator nicht validiert werden oder lassen sich Daten nicht abrufen, etwa weil der Identifikator nicht gefunden wird oder das Erstzulassungsdatum fehlt, gibt das System für diesen Identifikator eine eigene, detaillierte Fehlermeldung zurück.

Wird ein Händlerrabatt übermittelt, wendet das System ihn bei der Preisberechnung auf jedes kompatible Produkt jedes Fahrzeugs an. Ebenso kann das System Kampagneninformationen als Teil der Anfrage entgegennehmen und deren Vorteile oder Rabatte für jedes kompatible Produkt jedes Fahrzeugs berücksichtigen.

Ändert der Händler nach Erhalt der Antwort die Fahrzeugliste, oder nimmt er Änderungen vor, nachdem die vollständige Fahrzeugliste vorliegt, wird die vollständige Liste erneut an das System übergeben. Das System kann eine solche Liste auch dann erneut verarbeiten, wenn sie bereits zuvor verarbeitet wurde. Es führt dann den gesamten asynchronen Validierungsprozess für alle Identifikatoren der neu übermittelten Liste erneut durch.

**Mögliches Preisproblem in der Produktivumgebung**

Zu einem möglichen Preisproblem in der Produktivumgebung (Bezug: CSF3YWDP/DE25PE) liegen in den Rohdaten keine weiteren Angaben vor. Das Thema wurde abgeschlossen, Details zu Ursache oder Lösung sind jedoch nicht dokumentiert.