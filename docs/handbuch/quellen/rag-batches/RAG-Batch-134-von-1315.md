# Batch 134 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Abweichender Rechnungsempfänger**

Gewerbekunden benötigen häufig, dass Rechnungen an eine andere Stelle als den Hauptvertragspartner gesendet werden, zum Beispiel an eine Muttergesellschaft, eine zentrale Kreditorenbuchhaltung oder einen externen Dritten. Bisher war das im System nicht möglich: Alle erzeugten Dokumente und Revenue-Ereignisse verwenden standardmäßig die Adresse des Hauptkunden, und es gibt keine Möglichkeit, diese zu überschreiben.

Mit der neuen Funktion können abweichende Rechnungsempfänger (Bill-To Party) genutzt werden. Sie steht ausschließlich für OneERP zur Verfügung. Das System ruft dazu alle Kundennummern mit der Partnerfunktion "BP" ab und speichert für jeden zurückgegebenen Rechnungsempfänger Name und Adresse. Diese Daten stehen anschließend zur Anzeige in der Benutzeroberfläche bereit.

Bei der Vertragserstellung startet der Vertrieb einen Servicevertrag und wählt das Produkt aus und konfiguriert es. Hat der Kunde mehrere Rechnungsempfänger-Werte, werden die verfügbaren abweichenden Rechnungsempfänger auf der Kundenseite als auswählbare Liste angezeigt. Jeder Eintrag zeigt den Firmennamen (vollständiger Name aus oneERP), die SAP-Debitorennummer, die Straße, die Postleitzahl und den Ort. Wird der Vertrag aktiviert, werden diese Daten des gewählten Rechnungsempfängers im Rahmen des Aktivierungsereignisses an den Revenue-Microservice übermittelt. Das Ereignis enthält Firmenname, SAP-Debitorennummer, Straße, Postleitzahl und Ort.

Im Revenue Management gilt: Hat ein Kunde abweichende Rechnungsangaben, werden die Daten des Rechnungsempfängers in den Export E169 übernommen. Dort werden sie im Satz vom Typ "HDRPAR" abgebildet. Die SAP-Debitorennummer wird der SAP-Debitorennummer des Rechnungsempfängers zugeordnet, die Namensfelder dem Firmennamen des Rechnungsempfängers, die Straße der Straße und Hausnummer, die Postleitzahl der Postleitzahl und der Ort dem Ort des Rechnungsempfängers. Auch der ISO-Ländercode wird korrekt zugeordnet. Wurde für einen Vertrag kein abweichender Rechnungsempfänger ausgewählt, verwendet der Export wie bisher die Standard-Rechnungsdaten des Kunden.

**Mahnstufen-Berücksichtigung für weitere Zahlungsintervalle**

In den Markteinstellungen gab es bisher nur eine allgemeine Einstellung für die Bedingungen, unter denen ein Vertrag gesperrt wird. Sie ließ sich nicht nach Zahlungsintervall unterscheiden. Mahnstufe und Anzahl überfälliger Rechnungen als Sperrbedingungen werden nun je Zahlungsintervall und je Sparte festgelegt.

HQ-Administratoren finden die Einstellungen unter Market Settings > Market Config > Feature Settings > Financial Document Configuration, getrennt für Passenger Cars und Vans. Im Bereich "Trigger Contract Suspension" am unteren Seitenende erscheinen fünf Einträge, je einer für die Zahlungsintervalle einmalig, monatlich, vierteljährlich, halbjährlich und jährlich. Jeder Eintrag enthält zwei Dropdown-Felder: "Dunning Level" (Mahnstufe) und "Number of Overdue Financial Documents" (Anzahl überfälliger Finanzdokumente). Wählt man eine Mahnstufe, gibt einen numerischen Wert für die Anzahl überfälliger Rechnungen ein und klickt auf "Speichern", wird nur der geänderte Eintrag gespeichert.

Sind für eine Sparte die drei Bedingungen erfüllt, also Zahlungsintervall, Mahnstufe und Anzahl der Rechnungen, wird der Vertrag gesperrt. Wird die Zahlung während der Sperre geleistet, aktiviert das System den Vertrag wieder. Die Einstellungen gelten weiterhin getrennt für die Sparten PC und VAN.