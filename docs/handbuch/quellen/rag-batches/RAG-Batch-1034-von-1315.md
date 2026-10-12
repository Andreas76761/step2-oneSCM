# Batch 1034 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungsdaten und Adressdaten im Bereich „Kundeninformationen“**

Im Rahmen der Vertragserstellung erfassen Sie im Bereich „Kundeninformationen“ die Angaben, die für den Vertrag benötigt werden. Dazu gehören die Adressdaten und die Zahlungsdaten. Beide Abschnitte sind Teil des Assistenten für die Vertragserstellung. Diesen starten Sie im Bereich „Contract Generation“ über die Schaltfläche „Create Contract“, nachdem die vorherigen Schritte aus dem Produktbereich validiert wurden. Alle Werte geben Sie manuell ein, sofern ein Feld nicht ausdrücklich vorbefüllt ist oder eine Auswahlliste anbietet. Die Gestaltung der Oberfläche folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Adressdaten**

Im Abschnitt „Address“ geben Sie die Adresse des Kunden an. Bitte beachten Sie die vorgegebene Reihenfolge der Eingabefelder: Zuerst wählen Sie das Land, danach folgen Postleitzahl, Stadt, Straße, Hausnummer und eine zusätzliche Adresszeile. Das Feld „Country“ ist eine Auswahlliste mit Ländern, zum Beispiel Germany. Pflichtfelder sind Country, Post Code, City, Street und House Number. Die Postleitzahl (zum Beispiel 70565) und die Stadt (zum Beispiel Stuttgart) erfassen Sie als Text, wobei für die Stadt maximal 40 Zeichen zulässig sind. Für die Straße (zum Beispiel Am Wallgraben) sind maximal 60 Zeichen möglich, für die Hausnummer maximal 30 Zeichen. Optional können Sie in „Street Line 2“ ergänzende Angaben machen, die die Adresse vervollständigen, etwa ein Haus-Postfach oder den Namen des Postempfängers; auch hier sind maximal 60 Zeichen erlaubt.

**Zahlungsdaten**

Im Abschnitt „Payment Details“ erfassen Sie die Zahlungsinformationen für den Vertrag. Das Feld „Account Holder“ ist ein Pflichtfeld. Es ist schreibgeschützt und wird automatisch mit dem Namen des Kunden vorbefüllt, der sich aus Vor- und Nachname zusammensetzt (maximal 60 Zeichen). Ebenfalls Pflicht ist die IBAN (zum Beispiel DE02600501010002034304) mit maximal 34 Zeichen. Auch die Währung ist ein Pflichtfeld. Sie wählen sie aus einer Dropdown-Liste, in der EUR an oberster Stelle steht. Optional können Sie den Bankname (zum Beispiel Landesbank Baden Württemberg, maximal 50 Zeichen) und den BIC (zum Beispiel SOLADEST600, maximal 15 Zeichen) eintragen.

**Navigation und Validierung**

Mit „Back“ gelangen Sie zur vorherigen Seite, der Produktauswahl. Mit „Next“ gehen Sie zur nächsten Seite. Das ist erst möglich, wenn alle Pflichtfelder ausgefüllt und validiert sind. Ist ein Pflichtfeld leer, erscheint eine Hinweismeldung (Toast-Nachricht), die das betroffene Feld nennt, zum Beispiel „IBAN is not filled“.

Wenn Sie auf „Cancel“ klicken, erscheint ein Hinweisdialog: „You have unsaved changes that will be lost. The changes you have made will not be updated and they will be lost. Are you sure you want to proceed?“ Wählen Sie im Dialog „Cancel“, kehren Sie zur aktuellen Seite zurück. Wählen Sie „Proceed“, werden Ihre Änderungen verworfen und Sie gelangen zur Startseite (Landing Page).