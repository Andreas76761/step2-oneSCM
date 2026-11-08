# Batch 582 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungsarten im Kundenmanagement**

Im Bereich „Customer Management" wird im Abschnitt „Payment Information" nicht mehr die Zahlungsart „Credit/Debit" angezeigt. Stattdessen erscheint die Zahlungsart „Digital Payments", unter der mehrere Optionen angeboten werden. Dies gilt für Angebote sowohl für Privat- als auch für Gewerbekunden. Welche Optionen zur Auswahl stehen, richtet sich nach dem Markt und dem Produkt. In einem globalen Markt werden unter „Digital Payments" die Symbole für VISA und Mastercard angezeigt. In einem spezifischen Markt wie Indien kommen weitere Optionen hinzu, etwa UPI und NetBanking, die jeweils vom Markt festgelegt werden.

Die unterstützten Zahlungsarten werden in einem neuen Bereich „Payment Methods" in den Markteinstellungen konfiguriert. Sobald die Optionen auf Produktebene konfiguriert sind, erscheinen sie automatisch im Abschnitt „Payment Information" als die verschiedenen Zahlungsmöglichkeiten unter „Payment methods".

**Erweiterte E-Mail-Domänen in Testumgebungen**

In den Testumgebungen (DEV, INT und prePROD) werden E-Mail-Adressen der Domänen globallogic.com und mercedes-benz.com unterstützt. Zusätzlich wird nun die Domäne extaccount.com akzeptiert.

**Marktindividuelle Lieferantentabelle im Partner Management**

Bisher waren die Tabellen im Partner Management globale Listen, die den Markt des angemeldeten Benutzers nicht berücksichtigten. Die Lieferantentabelle (Supplier-Tabelle) ist nun eine marktindividuelle Liste, die sich am Mandanten (Tenant) des angemeldeten Benutzers orientiert. Dazu wird im Backend gefiltert, sodass nur die Händlerbetriebe des beim Login zugewiesenen Marktes angezeigt werden. Die Tabelle wird auf Marktebene gepflegt. Der Grund dafür ist, dass sich die Lieferanten-Kreditorennummer (Supplier Creditor) eines Marktes von der eines anderen Marktes unterscheidet.