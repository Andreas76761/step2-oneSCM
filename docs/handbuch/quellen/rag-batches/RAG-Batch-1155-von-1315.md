# Batch 1155 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 26 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Neuerungen und Änderungen**

Bei Preisanfragen mit einem Datum in der Vergangenheit berücksichtigt das System jetzt die Produkthistorisierung. Für den Leasing-Kanal wird die Preisversion ermittelt, die zum Zeitpunkt der Angebotserstellung (Proposal) aktiv war. Die zugehörigen Price Points für dieses Datum werden ausgewählt, und diese Preise werden zusammen mit dem Namen der Preisversion angeboten. Der Name der verwendeten Preisversion wird bei jedem Aufruf des Product Managements durch den Vertrag mitgesendet, also bei Aktivierung und bei Verlängerung, und grundsätzlich in allen zutreffenden Abläufen im Payload an den Vertrag übermittelt. Im Vertrag wird der Name der Preisversion in der Benutzeroberfläche angezeigt.

Im Bereich der Produkt- und Kampagnenverwaltung wurden mehrere Verbesserungen an der Oberfläche vorgenommen. Im zweiten Schritt der Produkterstellung wurde die Schaltfläche unter dem Produktbild entfernt. Bei der Preismatrix für optionale Deckungen und technische Optionen ist nun alles auf einen Blick sichtbar, sodass kein seitliches Scrollen mehr nötig ist. Voraussetzung ist eine verfügbare Blueprint mit optionalen Deckungen und technischen Optionen.

Für Kampagnen gelten bei den Eingabefeldern jetzt klare Regeln. Die Kostenstelle ist ein Pflichtfeld mit maximal 10 numerischen Zeichen, Leerzeichen sind nicht erlaubt, und als einziges Sonderzeichen ist der Bindestrich zulässig (zum Beispiel 123-1234). Die Debitorennummer ist optional, darf höchstens 10 Zeichen enthalten und darf keine Leerzeichen enthalten. Außerdem werden im zweiten Schritt der Kampagnenerstellung die Fahrzeuggruppen alphabetisch sortiert angezeigt. Ebenso sind die Preiscluster unter den Preisversionen eines Produkts alphabetisch geordnet. Darüber hinaus wurde die Anzahl der zulässigen Stellen für den Rabattbetrag erhöht.

In der Preisverwaltung sind alle Felder eines Preisclusters bearbeitbar, wenn man ihn über „Manage Vehicle Groups“ aufruft. Das entspricht dem Verhalten beim Bearbeiten über „Manage Prices“. Voraussetzung ist ein Produkt mit einer gültigen Preisversion. Für bestehende Fahrzeuggruppen funktionieren Anlegen und Bearbeiten im Zusammenspiel mit der Ergebnistabelle, auch mit dem zusätzlichen Filter für das maximale Gesamtgewicht.

Bei den Allgemeinen Geschäftsbedingungen können Nutzer diese für Produkte mit mehreren Sprachen jetzt auch in einer fehlenden Sprache anlegen, wobei der Inhalt vorausgefüllt wird. Dies gilt auch in Verbindung mit dem Filter der Schaltfläche „Manage“.

Für B2B- und VAN-Sonderfälle im Product Management gibt es eine eigene Übersichtsseite in der Vertragserstellung. Sie umfasst den Seitenzugriff, die Standardsortierung und die Paginierung, außerdem Filter und Suche, eine Statusspalte, eine Fälligkeitsspalte und eine Aktionsspalte. Weitere Bestandteile sind die Anfragezeilen-Ansicht mit Modal samt Review-Schaltfläche und Feldzugriff, der Bereich für Rabatte, das Verhalten der Preiskomponenten, die individuelle Seite für Laufzeit oder Laufleistung, der Ablauf „Reject & Proceed“ sowie die MPC-2-Review-Seite.

Zusätzlich wurde im Product Management eine Trennung nach den Divisionen PC und Van umgesetzt, die sich rollenabhängig auswirkt:

Ein Nutzer mit der Rolle Dealer und Van-Division sieht unter „Manage Products & Prices“ die Van-Produkte und kann im Produkttest auf Van-Produkte zugreifen. Bei PC-Produkten erscheint eine Meldung über verweigerten Zugriff. Fordert dieser Nutzer in der Vertragserstellung ein PC-Chassis an, liefert der Payload keine Ergebnisse.

Ein Nutzer mit der Rolle MPC/MO und PC-Division kann unter „Manage Products & Prices“ neue Produkte und Filter anlegen und auf die PC-Fahrzeuggruppen unter „Manage Vehicle Groups“ zugreifen. Für Van wird jeweils eine Fehlermeldung bzw. Meldung über verweigerten Zugriff ausgegeben.

Ein Nutzer mit der Rolle HQ und PC-Division kann neue technische Optionen anlegen. Für Van erscheint die Meldung über verweigerten Zugriff.

Ein Nutzer mit der Rolle HQ und beiden Divisionen hat unter „Manage Blueprints“ und „Create Blueprint“ Zugriff auf die Blueprint-Informationen beider Divisionen. Mit HQ-Rolle und ausschließlich Van-Division sind dort nur die Blueprint-Informationen der Van-Division zugänglich.