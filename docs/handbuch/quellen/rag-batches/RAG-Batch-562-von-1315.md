# Batch 562 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 19 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Customer & Partner Management**

Im Bereich Kunden- und Partnerverwaltung wurden mehrere Anpassungen an der Anbindung zwischen oneSCM und oneERP sowie an der Kundenerfassung vorgenommen.

**Abgleich mit oneERP.** Die Fuzzy-Suche, mit der Kunden mit Daten aus oneERP abgeglichen werden, wurde überarbeitet. Ein Kandidat gilt nur dann als Treffer, wenn drei Bedingungen gemeinsam erfüllt sind. Erstens muss ein gewichteter Gesamtwert von mindestens 0,8 erreicht werden. In diesen Wert fließen Name (35 %), Ort (20 %), Straße (15 %), Postleitzahl (10 %), E-Mail (10 %), Hausnummer (5 %) und Telefonnummer (5 %) ein. Zweitens muss der Namenswert mindestens 0,75 betragen. Drittens muss entweder die Ortsbedingung (Land exakt übereinstimmend, Ort und Straße jeweils mindestens 0,80) oder die Kontaktdatenbedingung (E-Mail mindestens 0,95 oder Telefon mindestens 0,85) erfüllt sein.

Für Geschäftskunden wurde der Suchablauf in oneERP angepasst: Die Suche über USt-IdNr. und Steuernummer ist dort nicht mehr möglich.

In den MO-Prüfungen wird eine Liste möglicher Treffer aus oneERP angezeigt, wenn eine solche Liste eingeht oder der Schwellenwert nicht erreicht wird. Bisher musste die prüfende Person einen Treffer auswählen. Neu gibt es die Schaltfläche „Not applicable“. Wird sie angeklickt, werden die Suchergebnisse verworfen, eine POST-Anfrage an oneERP ausgelöst und der Ablauf zur Kundenneuanlage fortgesetzt.

**Zahlungsarten.** Die Zahlungsart Banküberweisung für die Schweiz (CH) und Tschechien (CZ) ist derzeit noch in Bearbeitung und befindet sich im Abnahmetest, der aktuell blockiert ist. Vorgesehen ist, die Zahlungsart für beide Länder zu aktivieren und je Kundensegment (Geschäfts- bzw. Privatkunden) zu konfigurieren. Nach dem aktuellen Stand der Anforderungen soll sie für die Schweiz sowohl für Privat- als auch für Geschäftskunden und für Tschechien nur für Geschäftskunden gelten; dieser Punkt ist noch in Klärung. Beim Export an CoFiCo muss das Attribut „paymentMethod“ den passenden Wert tragen. Für Tschechien ist das „B“, für die Schweiz steht der Wert noch aus. Die POST-Anfrage bleibt wie bei digitalen Zahlungen, nur der Wert von „paymentMethod“ unterscheidet sich je nach Markt. Eine Logik für Kontovermerke wird nicht berücksichtigt. Als Zahlungsbedingung ist jeweils FB30 hinterlegt.

**Steuerbefreite Kunden.** Die geplante Synchronisation steuerbefreiter Kunden zwischen oneSCM und oneERP wurde nicht umgesetzt; der entsprechende Eintrag wurde abgebrochen.

**Weitere Änderungen.** Folgende Punkte stehen zur Verifizierung im Einsatz bereit:

Die Aufteilung von Kunden- und Zahlungsinformationen für Privat- und Geschäftskunden wurde angepasst. Im Modal für kommunale bzw. staatliche Geschäftskunden im deutschen Markt sind USt-IdNr. und Steuernummer keine Pflichtfelder mehr. Bei Adressen mit Doppelnummerierung wird nun die Komponente „Premise“ berücksichtigt. Außerdem wurde die Anzeige von Vertrag, SEPA und Zahlungsplan im CAC ergänzt. Die Logik für die Pflege der SAP-Debitorennummer und des Lastschriftcodes bei Kunden im Status „in Confirmation“ wurde angepasst.

**Behobene Fehler.** Behoben wurden unter anderem:
- die Fehlermeldung „Failed to convert 'id' with value: 'null'“ bei Geschäftskunden,
- eine fehlende Fehlermeldung zur Zahlungsart ID beim Kunden,
- ein Problem bei der Aktivierung eines Vertrags,
- ein CAS-Check-Fehler,
- das nicht angezeigte QR-Code-Retail-Modal bei Privatkunden mit einem Zahlungsintervall ungleich „einmalig“ (MBSK),
- der nicht gespeicherte Kontoinhaber bei Namensänderung,
- nicht korrekt formatierte Platzhalter im Reiter „Historie“ der Kundenverwaltung.