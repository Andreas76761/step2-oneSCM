# Batch 572 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 32 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Neuerungen und Korrekturen**

**Zahlung per Kreditkarte bei einmaligem Zahlungsintervall**
Bisher öffnete sich bei Kunden mit einem MMe-Profil, sobald im Customer Management die Zahlungsart Kreditkarte gewählt wurde, ein Fenster mit QR-Code zur Authentifizierung in MMe. Ohne diese Authentifizierung konnte der Angebotserstellungsprozess nicht fortgesetzt werden. Ist nun das Zahlungsintervall „Einmalig“ ausgewählt und die Zahlungsart Kreditkarte gesetzt, entfällt diese Aufforderung. Das gilt auch für Privatkunden mit MMe-Profil. Der Ablauf wird ohne QR-Code-Fenster und ohne Authentifizierung fortgesetzt. Auch bei der Eingabe der Kartendaten für Autorisierung und Abbuchung muss sich der Kunde nicht mehr in MMe authentifizieren. Die Verfügbarkeit der Zahlungsart Karte bei einmaligem Zahlungsintervall wurde für Privat- und Geschäftskunden mit und ohne MMe-ID sowie für den deutschen und den indischen Markt geprüft. Ergänzend wurde das Verhalten bei anderen Zahlungsintervallen für den deutschen Markt verifiziert.

**Slowakischer Markt (MBSK)**
Für die Slowakei wurden mehrere Anpassungen vorgenommen. Bei der Adresssuche über die Google-API wird die Stadt nun besser vorbelegt. Bisher wurde das Feld aus dem Attribut „city“ befüllt, die Google-API liefert für einige slowakische Städte den Ort jedoch als Ortsteil (Sublocality). Wird die Stadt weder als Locality, Postal Town noch als Administrative Area Level 3 gefunden, werden daher die Werte der Sublocality aus der Google-Antwort berücksichtigt.

Bei der Anlage eines Angebots für Geschäftskunden steht die Zahlungsart „Debit-/Kreditkarte“ nicht zur Verfügung, wenn ein anderes Zahlungsintervall als „Einmalig“ gewählt ist. Auf der Seite Customer Management bleibt diese Zahlungsart weiterhin auswählbar. Bei der Übermittlung an CoFiCo wird für den Typ CREDIT_CARD die Zahlungsart „D“ gesendet. Außerdem wurde behoben, dass die Zahlungsart für den slowakischen Markt nicht gespeichert wurde, und dass die Seite mit den Zahlungsinformationen für unterschiedliche Kunden unpassend dargestellt wurde. Zudem wurde korrigiert, dass die Zahlungsart Lastschrift für neue Privatkunden verfügbar war. Die Zahlungsart Banküberweisung für die Slowakei ist noch offen.

**Firmenregistrierungsnummer**
Für Geschäftskunden wurde das neue Feld „Company Registration Number“ eingeführt und für den deutschen, den indischen und den slowakischen Markt geprüft. In der Slowakei gilt dies sowohl für Geschäftskunden als auch für staatliche Geschäftskunden. Behoben wurde, dass dieselbe Hinweismeldung zur Eindeutigkeit der Firmenregistrierungsnummer mehrfach angezeigt wurde.

**Validierung und Bedienung**
Die Postleitzahlenprüfung folgt nun marktunabhängig derselben Regel. Das Feld „Affiliation“ wird jetzt als Pflichtfeld hervorgehoben. Auf der Seite „System Notifications“ wurde die Formatierung des Filterkriteriums „Division“ korrigiert. Außerdem friert die Anwendung nicht mehr ein, wenn ein Leerzeichen als Zeichen eingegeben wird.

**Partnerverwaltung und Lieferantenrechnungen**
Im Zusammenhang mit der Verarbeitung von Lieferantenrechnungen wurden die Lieferantenseite in der Partnerverwaltung sowie die Systembenachrichtigungen im Template Management geprüft. Ebenfalls geprüft wurde die marktindividuelle Lieferantentabelle in der Partnerverwaltung.

**Technische Korrekturen und offene Punkte**
Behoben wurde ein Fehler beim Abruf von Daten während der Elasticsearch-Synchronisierungsjobs für Kunden. Noch offen ist die Integration der neuen Schnittstelle „searchDealershipByOutletIdAndType“ für die Händlersuche über die Outlet-ID.