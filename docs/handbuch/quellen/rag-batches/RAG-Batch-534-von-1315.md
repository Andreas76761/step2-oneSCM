# Batch 534 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Edge Service**

Der Edge Service wurde überarbeitet, um die Bereitstellung von Produkt- und Preisinformationen zu beschleunigen und zu vereinfachen. Dafür wurde der Produkt- und Preis-Edge-Service neu gestaltet und eine neue interne API eingeführt, die parallel zur bisherigen API betrieben wird. Die neue API liefert ausschließlich die tatsächlich benötigten Informationen. Derzeit nutzt nur der neue Edge Service diese Schnittstelle, während die Oberfläche zur Vertragserstellung weiterhin die bestehende API verwendet. Der bisherige Produkt- und Preisabruf der Oberfläche bleibt unverändert.

Die Produktsuche erfolgt über einen neuen Endpunkt „product/searches“, der als mögliche Version 2 vorgesehen ist. Er zeigt den Preis nur für die Kombination aus Laufleistung und Laufzeit an, die in der Anfrage übergeben wird. Sind Laufleistung und Laufzeit nicht angegeben, wird der Preis der kleinsten verfügbaren Kombination ausgegeben. Zusätzlich enthält die Antwort alle verfügbaren Kombinationen aus Laufleistung und Laufzeit des jeweiligen Produkts. Die Endpunkte für Online-Verkauf und Leasing wurden zusammengeführt. Dabei werden sowohl die jährliche als auch die gesamte Laufleistung unterstützt. Über das Feld „mileageType“ wird festgelegt, ob es sich um eine jährliche oder eine Gesamtlaufleistung handelt („annual“ oder „total“). Die bisherigen Felder „requestedTotalMileage“ und „requestedAnnualMileage“ werden durch das einheitliche Feld „requestedMileage“ ersetzt, das abhängig vom Wert in „mileageType“ interpretiert wird.

Die vollständige Preismatrix eines Produkts steht über einen zusätzlichen Preis-Endpunkt zur Verfügung, der auf der Produkt-ID basiert. Dieser Endpunkt nutzt den bestehenden internen Produkt-Endpunkt und erzwingt die Angabe einer Produkt-ID als Parameter. Dadurch wird die Datenmenge in der Antwort reduziert.

Darüber hinaus wurde die Anzahl und der Umfang der Anfragen und Antworten des Edge Service reduziert, und alle Edge-Service-APIs sind nun durch End-to-End-Tests abgedeckt. Die geplante Neugruppierung der Anfragen nach Domänen samt Anpassung der Fehlermeldungen wurde nicht umgesetzt.

**DevOps**

Im Bereich DevOps wurde die bisherige AWS-Lambda-Funktion für Benutzerbenachrichtigungen durch Delivery Channels ersetzt. Der Aufbau einer eigenen, wiederverwendbaren Notification-Service-Lambda (für MIM) wurde nicht weiterverfolgt. Zudem wurde eine Prüfung auf Schwachstellen für ECR und Sechub eingerichtet.

Außerdem wurden mehrere betriebliche Störungen bearbeitet und abgeschlossen. Dazu zählen Alarme zu Ausfällen der Anwendungen gateway-app, security-app und onescm-fe in der Produktionsumgebung sowie der security-app in der Vorproduktionsumgebung. Behoben wurden zudem ein Fehler beim Anlegen eines neuen Kunden und ein Problem, bei dem das AQA-Team von einem neuen Branch nicht mehr in Git pushen konnte.