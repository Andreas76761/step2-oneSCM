# Batch 158 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Gutschriften bei Rückbuchungen (Chargeback) annehmen oder ablehnen**

Wird im Rahmen eines Chargeback-Ablaufs durch MPay eine Gutschrift erzeugt, konnten Benutzer der Rolle MO diese bisher nur annehmen. Künftig können MO-Benutzer solche Gutschriften auch ablehnen. Dazu werden auf der Detailseite der Kundenrechnung beide Schaltflächen, „Accept" und „Reject", angezeigt.

Diese Art der Gutschrift wird ausschließlich für Verträge erstellt, bei denen MPay als Zahlungsmethode hinterlegt ist. Sie entsteht automatisch, sobald eine Rechnung beim MPay-Status „second chargeback" ankommt. Die Gutschrift ist vom Typ MPPI und hat den Rechnungsstatus „created" sowie den MPay-Status „second_chargeback". Als Rechnungsreferenz enthält sie die FI-System-Rechnungsnummer der Rechnung, mit der sie verknüpft ist. Hinweis: Diese Funktion befindet sich derzeit noch im Status „Blocked BAT Testing".

**MPay: Zahlungen vor der Vertragsaktivierung (Pre-Activation Payments)**

Bei Verträgen mit Zahlungen vor der Aktivierung muss der Zahlungsplan bereits vor der Vertragsaktivierung und noch vor der Erstellung des MPay-Zahlungslinks angelegt werden. Nur so lässt sich die Transaktion eindeutig identifizieren und lassen sich die Transaktionsdetails auf der Rechnung speichern. Diese Details werden für den Export benötigt.

In den Marktsettings wird unter „Feature Setting" im Bereich „MPay Configuration" ein Feld „Supported Payments" ergänzt. Dort wird je nach Markt eine Liste der Zahlungsarten angezeigt, die in oneSCM für MPay in diesem Markt umgesetzt sind. Beispielsweise stehen für Indien Karten, UPI und Net Banking zur Verfügung, für Deutschland nur Karten. Abhängig von Markt und gewähltem Produkt kann die digitale Zahlung in der Vertragserstellung eine Liste verfügbarer Zahlungsmethoden wie Karte, UPI, NetBanking oder PayPal umfassen.

Kunden wählen in der Vertragserstellung nicht selbst eine konkrete MPay-Zahlungsart aus. Sie wählen „Digital payments" und erhalten einen MPay-Zahlungslink, der alle für den jeweiligen Markt und das jeweilige Produkt verfügbaren Optionen enthält. Die gewünschte Methode wählt der Kunde erst nach dem Öffnen des Links aus. Wird in der Vertragserstellung unter „Payment Information" die Option „Digital payments" gewählt, wird dieser Zahlungslink bereitgestellt. Für die Zahlung vor der Aktivierung (Pre-Activation) gibt es drei Methoden, nach der Aktivierung (Post-Activation) nur eine. Für Pre-Activation wird ein einziger MPay-Zahlungslink erstellt, der alle drei Möglichkeiten abdeckt. Der Zahlungslink wird im Customer Account Center (Stream 4) gespeichert und von Stream 4 an den Kunden versendet.

Da die Rechnung bei Zahlungen vor der Aktivierung bereits vor der Vertragsaktivierung exportiert werden muss, wird der Zahlungsplan mit der Rechnung im Vertragsstatus „Confirmed" erzeugt. Der Zahlungsplan enthält eine Rechnung. Die Details dafür stammen aus der Vertragserstellung und entsprechen denen der Zahlungsplanerstellung bei der Aktivierung.