# Batch 1214 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Neuerungen im Bereich Contract Calculation**

**Terms and Conditions direkt aus der Produktübersicht anlegen**

Bisher konnten MPC-Anwender Vorlagen für Allgemeine Geschäftsbedingungen (T&C) nur auf einer separaten Seite und in einem eigenen Ablauf definieren. Künftig steht im Aktionsmenü eines Produkts für alle Status der Eintrag „Create T&C" zur Verfügung. Dafür wird dasselbe Symbol verwendet wie bei der Kachel „Manage Templates". Ein Klick darauf führt in den Ablauf zum Erstellen einer T&C-Vorlage, in dem mehrere Felder bereits vorausgefüllt sind: Der Vorlagenname lautet „[Produktname] T&C template". Das Startdatum wird übernommen, sofern bereits eine Preisversion existiert, und entspricht dann der chronologisch ersten Preisversion. Produktname und Division stammen aus dem Produkt, an dem die Aktion ausgeführt wurde. Sprache und Markt werden aus den Einstellungen des Benutzers übernommen.

Zusätzlich prüft das System beim Veröffentlichen eines Produkts, ob eine veröffentlichte T&C-Vorlage für dieses Produkt vorhanden ist. Ist das der Fall, wird das Produkt wie gewohnt veröffentlicht. Fehlt eine solche Vorlage, erscheint ein Dialog mit dem Titel „Terms and Conditions missing". Er weist darauf hin, dass für das Produkt keine Vorlage für Terms and Conditions angelegt wurde, und bietet an, die Vorlage direkt zu erstellen oder das Produkt dennoch ohne Vorlage zu veröffentlichen. Die Hauptschaltfläche ist „Publish Anyway"; alternativ kann der Vorgang abgebrochen werden.

**Ansichtsseiten für Fahrzeuggruppen und Kampagnen**

MPC- und MO-Anwender können die Konfigurationsdetails von Fahrzeuggruppen und Kampagnen nun ansehen, ohne in den Bearbeitungsmodus zu wechseln, sodass keine Informationen versehentlich geändert werden. Dazu gibt es im Aktionsmenü aller Fahrzeuggruppen und aller Kampagnen den Eintrag „View". Die jeweilige Seite wird ohne Stepper und ohne Navigation dargestellt.

**Verkaufsprovision in der Produktdefinition**

MPC-Anwender können für ihre Produkte nun Verkaufsprovisionen festlegen, damit Händler einen Anreiz haben, Servicverträge zu verkaufen. Der bisherige Schritt „Payment Periods" heißt jetzt „Fees and Commissions". Er enthält einen neuen Abschnitt für die Verkaufsprovision, der sich über einen Schalter aktivieren oder deaktivieren lässt. Ist der Schalter aktiv, werden darunter die Optionen zur Definition angezeigt. Wählbar sind eine prozentuale Provision oder ein Fixbetrag. Die Händlerprovision wird anhand der Einstellungen in diesem Schritt berechnet und zum Listenpreis des Produkts addiert. Für Produkte nach Zeit bzw. Laufleistung und für kontingentbasierte Produkte gibt es jeweils eine eigene Variante.

Bei Zeit- oder Laufleistungsprodukten wird die prozentuale Provision für jede Laufzeitoption angegeben. Sie ist ein Pflichtfeld mit vier Stellen, davon zwei Ganzzahl- und zwei Nachkommastellen. Zusätzlich ist für jede Laufzeitoption ein Höchstbetrag als Pflichtfeld festzulegen, ebenfalls mit Währungsauswahl; dieser hat sechs Stellen, davon vier Ganzzahl- und zwei Nachkommastellen. Beim Fixbetrag wird für jede Laufzeitoption ein fester Betrag mit derselben Stellenvorgabe (sechs Stellen, vier Ganzzahl- und zwei Nachkommastellen) und einer Währungsauswahl hinterlegt.

Bei kontingentbasierten Produkten gelten dieselben Regeln, nur dass die Werte je Kontingentoption statt je Laufzeitoption definiert werden. Die prozentuale Provision ist ein Pflichtfeld mit zwei Ganzzahl- und zwei Nachkommastellen, der Höchstbetrag ein Pflichtfeld mit Währungsauswahl. Der Fixbetrag wird je Kontingentoption mit sechs Stellen (vier Ganzzahl-, zwei Nachkommastellen) und Währung angegeben.

Als Provisionsbasis ist standardmäßig der Nettobetrag der Basisleistungen ausgewählt. Optional kann das Kontrollkästchen „Include product options" aktiviert werden (standardmäßig deaktiviert). In diesem Fall wird die Provision unter Einbeziehung des Nettobetrags der ausgewählten Produktoptionen berechnet.

Für die Berechnung gelten folgende Regeln: Auf die Verkaufsprovision wird ebenfalls Mehrwertsteuer berechnet und ausgewiesen. Die Provision wird zu den berechneten Preisen addiert, bevor Rabatte und Kampagnen abgezogen werden. Einmalige oder monatliche Gebühren fließen bei einer prozentualen Provision nicht in die Berechnung ein. Bei monatlicher Zahlung wird die Provision auf den Gesamtpreis berechnet und gleichmäßig auf alle monatlichen Zahlungen verteilt.

**Dashboard für MPC-Anwender**

MPC-Anwender gelangen nach der Anmeldung nun direkt auf ihr persönliches Dashboard, damit sie Informationen auf einen Blick sehen und Aktionen schneller ausführen können. Das Dashboard ist die Startseite nach dem Login; auch ein Klick auf das App-Logo führt dorthin. Es zeigt eine Begrüßung mit dem Namen des Benutzers sowie Kacheln als Verknüpfungen zu den bestehenden Seiten: Manage Products and Prices, Manage Vehicle Groups, Manage Campaigns, Manage Templates und Manage Customers.