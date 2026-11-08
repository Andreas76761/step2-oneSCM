# Batch 1094 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 17 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung: Änderungen und Verbesserungen**

**Produkte, Preise und Vertragsbeginn**

In der Vertragserstellung und im Vertragsmanagement lassen sich Verträge jetzt zusätzlich nach dem Produktnamen suchen. Die Suche liefert alle Verträge, die für das jeweilige Produkt angelegt wurden, unabhängig vom Kundentyp. Im Prüfdialog für Sonderfälle werden nun Nettopreise statt Bruttopreisen angezeigt. Fährt man mit der Maus über einen Nettopreis, erscheint ein Tooltip mit dem zugehörigen Bruttopreis. Bei Preisen für Sticker-Price-Kampagnen werden die Kampagnen aus der Kampagnenliste und der Preismatrix jetzt über ihre gemeinsame ID zusammengeführt. Dadurch stehen der Prozentwert und der Kampagnenname aus der Kampagnenliste zur Verfügung. Hat eine Kampagne keinen Prozentwert, wird ihr Preis aus der Preismatrix angezeigt.

Der Vertragsbeginn eines Servicevertrags richtet sich nun nach der Konfiguration des Produkts. Ist das Produkt FRD-bezogen, beginnt der Vertrag mit dem FRD-Datum. Ist es nicht FRD-bezogen, beginnt er mit dem Erstellungsdatum. Dasselbe Vorgehen gilt für die Schnittstelle zum Erfassen fehlender Fahrzeuginformationen, wenn FRD und Kennzeichen bei Build-to-Stock- bzw. Bestellprozessen eingehen. Zuvor war der Vertragsbeginn für Contingent- und Reifenprodukte fest im System hinterlegt. Die Logik zur Inanspruchnahme der Services bleibt für Contingent- und Reifenprodukte unverändert.

Für Reifenprodukte wird an das Produktmanagement nun die aktuelle, von der Benutzeroberfläche übermittelte Fahrzeuglaufleistung gesendet. Bisher wurde der Wert „mileageAtContractStart“ übergeben, der bei Reifenprodukten 0 ist. Die Änderung ist nötig, weil manche Produkte eine Untergrenze für die Laufleistung haben können.

**Division und Produktlinie**

Bei der Initiierung eines Vertragsvorschlags wird nun für alle abgerufenen Produkte eine Produktlinie berücksichtigt, unabhängig von der Division. Bisher galt das nur für Pkw. Anhand der dem Produkt zugewiesenen Produktlinie und der hinterlegten Zuordnung wird der entsprechende Vega-Code in der i155 gespeichert, und zwar im Satz RC05 an Position 175–176. Hat ein Produkt beispielsweise die Produktlinie „SELECTPLUS“, steht dort der Wert „20“. Die Zuordnung lautet: Compact 04, Maintenance 19, Compact Plus 15, MaintenancePlus 24, Excellent 05, Complete 16, Tire 06, Advance 01, ExtendedWarranty 18, SelectPlus 20 und WearTear 23. Dabei gehören Compact, Compact Plus, Excellent und Advance zu Pkw, Maintenance, MaintenancePlus, Complete, ExtendedWarranty, SelectPlus und WearTear zu Vans, und Tire gilt für beide Divisionen.

Bei Leasingverträgen wird die Division (PC/VAN) nicht mehr im Request-Body der Edge Services übergeben, sondern aus dem Produkt ermittelt. In der Vertragsantwort wird die Division nun als „PASSENGER_CAR“ statt „IS_PC“ und als „VAN_CAR“ statt „IS_VAN“ ausgegeben.

Außerdem gilt: Ein MPC-Benutzer für VAN kann Sonderfälle für Pkw nicht mehr prüfen, und ein MPC-Benutzer für Pkw kann Sonderfälle für VAN nicht mehr prüfen. Zuvor war dies in beide Richtungen möglich.

**Dokumente, Benachrichtigungen und Zahlungsplan**

Lädt ein Verkäufer im Reiter „Kommunikation“ eine Datei hoch, die mehrere Dokumente enthält (zum Beispiel Servicevertrag, SEPA und AGB), erscheint nicht mehr die Meldung „The document type is invalid!“. Stattdessen wird im Kopfbereich des Upload-Dialogs mit rotem Hintergrund der Hinweis angezeigt, dass mehrere Dokumente gleichzeitig hochgeladen wurden und diese bitte einzeln mit dem passenden Dokumenttyp hochzuladen sind.

Die E-Mail nach Ablauf der Angebotsgültigkeit wird nur noch versendet, wenn der Vertrag abgelehnt wurde und der Ablehnungsgrund „offer validity expired“ lautet. Bei manuell abgelehnten Verträgen mit anderem Grund wird sie nicht mehr verschickt.

Wird beim Erzeugen des QR-Codes für Kunden bzw. die Self App die Market-ID benötigt, wird sie nun aus dem Vertrag und nicht mehr aus den Benutzerdaten (Alice) bezogen. Damit werden Änderungen an den Kundendaten nach Auswahl von „Dokument drucken“ korrekt berücksichtigt.

Bei MBLD-Serviceverträgen wird der Zahlungsplan bei der Aktivierung ohne Umverteilung (Re-Allocation) erstellt. Zuvor enthielt er Umverteilungsbeträge.

**Datenfelder und Validierung**

Die maximale Länge der E-Mail-Adresse des Verkäufers im Vertrag wurde von 50 auf 255 Zeichen erhöht. Die Kontonummer aus der Kampagnen-Entität wird nun als Zeichenkette (String) verarbeitet. Für die Validierung der USt-ID werden nur noch die Ziffern übermittelt, die Buchstaben werden ausgeschlossen. Außerdem wurde die Fahrzeugversion im Vertrag aktualisiert, weil sich ein im Vertrag verwendeter Enum im Fahrzeug geändert hatte.