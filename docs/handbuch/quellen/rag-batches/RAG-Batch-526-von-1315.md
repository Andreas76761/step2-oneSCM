# Batch 526 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 21 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: Änderungen und Verbesserungen**

**Edge Service**

Der Edge Service wurde in mehreren Punkten überarbeitet, damit Anfragen von außen zuverlässiger und nachvollziehbarer verarbeitet werden. Datumsfelder in Anfragen akzeptieren nur noch Eingaben, die den Marktvorgaben entsprechen. Entspricht ein Datumsformat nicht diesen Vorgaben, erscheint eine verständliche Fehlermeldung, aus der hervorgeht, was korrigiert werden muss. Der betroffene Vorgang, etwa die Aktivierung eines Vertrags, wird in diesem Fall nicht abgeschlossen. Anlass war ein Datumsformat, das in der Vorproduktionsumgebung zu Problemen geführt hatte.

Bei der Aktivierung eines Vertrags wird außerdem geprüft, dass das FRD nicht später als das Datum der Anfrage liegt. Fordert MBLD zum Beispiel am 24. März 2026 die Aktivierung eines Vertrags an, ist ein FRD wie der 1. April 2026 nicht zulässig.

Auch die Baumuster-Validierung wurde ergänzt. Werden Fahrzeugdaten zur Aktivierung übermittelt, prüft das System nacheinander, ob das Produkt, die Produktkonfiguration und der Preis der Produktkonfiguration mit den ursprünglichen Angaben übereinstimmen. Sind alle Prüfungen erfolgreich, wird die Aktivierung fortgesetzt. Weicht eines dieser Merkmale ab, wird der Vertrag abgelehnt. Unterscheidet sich lediglich das Baumuster der übermittelten Fahrgestellnummer vom ursprünglich verwendeten Baumuster, wird der ursprüngliche Wert überschrieben, sofern Produkt, Produktkonfiguration und Preis übereinstimmen. Dies entspricht der Logik der Baumuster-Vertragserzeugung für den Retail-Bereich.

Darüber hinaus wurden mehrere Fehler behoben. Dazu zählen ein Fehler beim Stornieren eines Leasingvertrags im Status „Aktiv“, die Situation, dass ein Kunde nicht angelegt wurde, sowie die Frage, ob BIC und Bankname Pflichtangaben sind. Ebenso wurde ein Fehler beim Basispreis bei der Erstellung von MBLD-Verträgen korrigiert. Zudem wurde die Antwort des Online-Vertriebs erweitert: Wird die paymentAssetID ohne Wert übergeben, liefert das System den paymentType „DIRECT_DEBIT“ zurück. Ist die paymentAssetID mit einem tatsächlichen Wert belegt, lautet der paymentType „CREDIT_CARD“. Außerdem wurde die Umsetzung eines technischen Benutzer-Alias für Machine-to-Machine-Anfragen bearbeitet.

**User Interface**

Beim Info-Banner wurden zwei Punkte korrigiert. Das Banner wird nach einem Neustart des Systems nicht mehr angezeigt, wenn der entsprechende Bereich in den ursprünglichen Einstellungen deaktiviert war. Außerdem wird bei aktiviertem Info-Banner immer ein Footer bereitgestellt.

**Customer Account Center**

Für Privatkunden mit MMe-Profil, deren Zahlungsintervall nicht „Einmalig“ ist (zum Beispiel monatlich, vierteljährlich oder jährlich), ist ein angepasster Ablauf mit der Zahlungsart Kreditkarte (digitale Zahlungen) vorgesehen. Dieser Ablauf ist noch offen. Vorgesehen ist, dass das Produkt in oneSCM ausgewählt und konfiguriert wird und der Kunde ein MMe-Profil besitzt oder anlegt. Danach wählt er die Zahlungsart Kreditkarte und authentifiziert sich per QR-Code bei MMe. Anschließend kann der Vertrag erstellt und unterzeichnet werden, und der Vertrag wird aktiviert.

Nach der Aktivierung löst der Vertrag eine Benachrichtigung aus, die einen Link zum Customer Account Center enthält. Über diesen Link ruft der Kunde das Customer Account Center auf, gibt einen OTP-Code ein und authentifiziert sich erneut per QR-Code bei MMe. Der Link zur Erfassung der Kreditkartendaten wird von Revenue erzeugt. Auf der Seite wird angezeigt, dass ausschließlich die Kreditkartendaten mit einem Betrag von 0 erfasst werden, und es steht eine Schaltfläche „Authorize“ zur Verfügung. Nach Klick auf diese Schaltfläche wird der Kunde in den Mpay-Bereich weitergeleitet, um die Kreditkarte hinzuzufügen und zu autorisieren. Wird die Karte autorisiert, erscheint eine Erfolgsmeldung, andernfalls eine Fehlermeldung.

Zusätzlich wurde ein Darstellungsproblem auf der Dokumenten-Download-Seite behandelt, die über die Aktivierungsmail bei Massenanlage erreicht wird. Dort überlagerten sich Dokumentnamen und Dokumenttyp, wenn die Zoomstufe des Browsers erhöht wurde.

**DevOps**

Im Bereich DevOps wurden die Kosten für AWS und Datadog optimiert. Ziel war es, die Betriebskosten von AWS zu senken, indem Ineffizienzen identifiziert, die Ressourcennutzung optimiert und Mechanismen zur Kostenkontrolle in den Umgebungen eingeführt werden. Darüber hinaus befinden sich Verbesserungen bei Datadog in Entwicklung. Sie sollen die Effizienz des Monitorings steigern, indem bestehende Konfigurationen bereinigt, die Qualität von Alarmen verbessert und eine bessere betriebliche Transparenz ermöglicht wird.

Außerdem wurden mehrere Alarmmeldungen zur Nichtverfügbarkeit der Anwendungen onescm-fe, gateway-app und security-app in der Vorproduktionsumgebung bearbeitet und abgeschlossen. Die Meldung, dass oneSCM in der Entwicklungsumgebung nicht erreichbar war, wurde abgebrochen.