# Batch 215 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Rückerstattung einer MPay-Zahlung**

Die Marktorganisation kann eine über MPay bezahlte Rechnung erstatten. Dafür stehen zwei Wege zur Verfügung. Voraussetzung ist in beiden Fällen, dass die zugehörige Transaktion den MPay-Status „Settled“ hat. Ohne eine solche Transaktion ist keine Rückerstattung möglich.

Beim ersten Weg wird eine Gutschrift erstellt. Dazu wechseln Sie im Reiter „Payment“ zu den Kundenrechnungen und wählen die Schaltfläche „Create Invoice“. Im Erstellungsprozess wählen Sie als Dokumenttyp „Credit Note“. Anschließend wird das Feld „Invoice Reference“ verfügbar und ist ein Pflichtfeld. Bei einem Vertrag, der per Kreditkarte (MPay) bezahlt wurde, tragen Sie dort die FI-System-Rechnungsnummer der Rechnung ein, die den MPay-Status „Settled“ und den Rechnungsstatus „Paid“ hat. Der maximal zulässige Gutschriftsbetrag entspricht dem Betrag der referenzierten Rechnung, die Erstattung darf also höchstens den Transaktionsbetrag umfassen. Für die Rechnungsposition darf der maximale Nettobetrag den bereits bezahlten Nettobetrag der Rechnung nicht überschreiten.

Beim zweiten Weg führen Sie eine Korrektur durch. Auch hier gehen Sie im Reiter „Payment“ zu den Kundenrechnungen und wählen eine Rechnung mit dem Rechnungsstatus „Paid“ und dem MPay-Status „Settled“. In der Spalte „Action“ steht dann die Option „Make Correction“ zur Verfügung. Sie öffnet die Seite „Create Customer Invoice“, auf der der Dokumenttyp standardmäßig deaktiviert und vorbelegt ist. Wird für eine Rechnung eine Korrektur erstellt, lautet der Dokumenttyp „Credit Note“; handelt es sich bei dem korrigierten Dokument um eine Gutschrift, lautet er „Invoice“. Das Feld „Invoice Reference“ ist ebenfalls deaktiviert und mit der FI-System-Rechnungsnummer des korrigierten Dokuments vorbelegt.

In beiden Fällen entsteht im Zahlungsplan ein neuer Eintrag (Gutschrift bzw. Rechnung) mit dem Rechnungsstatus „Accepted“ und dem MPay-Status „Created“. Im Hintergrund wird für eine Gutschrift die Refund-API von MPay verwendet, für eine Rechnung die Create-Transaction-API. Bei einer Transaktion soll die „shopperBankStatementReference“ die Rechnungsposition enthalten. Damit kann eine Marktorganisation bereits bezahlte Rechnungen per Gutschrift oder Korrektur erstatten, und das Geld wird an die Kundin bzw. den Kunden zurückgesendet.

**MPay-Statushistorie**

Mitarbeitende der Marktorganisation (MO) und des MPC können den Verlauf der MPay-Status einsehen, um den Ablauf der Transaktionen nachzuvollziehen. Diese Funktion steht ausschließlich für Verträge zur Verfügung, bei denen die Zahlung über MPay erfolgt. Nur dort sind die Spalte „MPay-Status“ und die Historie vorhanden.

Um die Historie anzuzeigen, wählen Sie einen über MPay bezahlten Vertrag und wechseln in den Reiter „Payment“. Ein Klick auf den MPay-Status einer Rechnung öffnet ein Popup mit dem Protokoll zu dieser Rechnung. Es enthält je Eintrag das Änderungsdatum als UTC-Zeitstempel der Aktion im Format TT.MM.JJJJ HH:mm:ss UTC. Die Spalte „Reason“ zeigt den Text „Automatic Changed by System“. „Old Value“ nennt den Statuswert vor der Änderung; bei der Anlage einer Rechnung lautet er „-“. „New Value“ zeigt den Statuswert nach der Änderung. In der Spalte „Modify by“ steht der Text „Changed by System“.

Jeder von MPay gesendete Status wird gespeichert und in der Tabelle angezeigt. Die Historie der MPay-Transaktionen kann nicht gelöscht werden. Das Popup schließen Sie über die Schaltfläche „Back“ oder das „X“.