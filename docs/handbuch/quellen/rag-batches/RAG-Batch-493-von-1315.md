# Batch 493 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**E-Mail-Vorlage für abgelaufene Verträge (Status „Expired")**

In der Stammdatenverwaltung können Sie eine Benachrichtigungsvorlage mit E-Mail-Inhalt erstellen, die speziell für Verträge im Status „Expired" gilt. Läuft ein Vertrag im Rahmen des Vertragsmanagements ab, wird automatisch eine E-Mail mit dem in der Vorlage festgelegten Inhalt an den Vertragsinhaber gesendet. Die Vorlage selbst wird hier erstellt. Der tatsächliche E-Mail-Versand wird im Rahmen des Vertragsmanagements geprüft.

**Voraussetzungen und Aufruf**

Sie müssen mit den entsprechenden Zugangsdaten angemeldet sein. Außerdem müssen die Vorlagen für Header und Footer bereits definiert sein. Navigieren Sie zu Admin-Bereich, Template Management und dem Reiter „Notification". Klicken Sie dort auf „Create Template" und wählen Sie „E-mail".

**Pflichtfelder**

Auf der Seite zur Vorlagenerstellung erfassen Sie zunächst die Pflichtangaben:

Der Template Name ist ein Textfeld mit maximal 25 Zeichen, zum Beispiel „Template-Expired Status". Der Market ist ein Dropdown, das im MVP mit „GERMANY" vorbelegt ist; künftig wird er je nach Land angezeigt. Im Dropdown „Used For" stehen Werte passend zu den Geschäftsprozessen zur Verfügung. Für diese Vorlage wählen Sie „EXPIRATION". Mit „Valid From" legen Sie das Datum fest, ab dem die Vorlage für den Geschäftsprozess gültig bzw. aktiv wird.

Sind Pflichtfelder nicht ausgefüllt, wird Ihnen das betreffende Feld angezeigt. Die Schaltfläche „Save as Draft" bleibt dann verfügbar, „Publish" ist jedoch nicht aktiviert.

**Optionale Felder**

Optional können Sie weitere Angaben machen. Im Dropdown „Division" wählen Sie den Bereich, für den die Vorlage erstellt wird; im MVP ist das PC, Van soll nach dem MVP berücksichtigt werden. Im Dropdown „Brand" wählen Sie die Marke; im MVP ist das Mercedes-Benz, Smart soll nach dem MVP folgen. Das Dropdown „Language" richtet sich nach der Marktrolle des Benutzers; im MVP wird Englisch angezeigt.

**E-Mail-Inhalt**

Alle Inhalte werden gemäß dem Mercedes-Benz E-Mail-Styleguide erstellt. Der Betreff lautet „End of Service Contract - %Contract Number". Die Vertragsnummer wird erst beim Versand an den Kunden eingesetzt und entsprechend der jeweiligen Vertragsnummer aktualisiert. Header und Footer wählen Sie jeweils aus einem Dropdown mit den bereits definierten Werten aus.

Im Template Design Editor geben Sie den Text der E-Mail ein. Alle mit „%" gekennzeichneten Werte sind Platzhalter (Print Variables), die Sie per Drag-and-drop in die Vorlage einfügen. Der vorgesehene Text lautet sinngemäß:

Die E-Mail beginnt mit der Anrede „Dear %First Name, %Last name". Es folgt der Dank dafür, dass sich der Kunde für die Wartung seines Fahrzeugs mit einem Mercedes-Benz Service Contract entschieden hat. Danach wird mitgeteilt, dass der Servicevertrag zum Datum %contractEndDate abgelaufen ist. Entsprechende Wartungs- und Reparaturleistungen in autorisierten Servicestellen sind damit nicht mehr abgedeckt.

Anschließend folgen die Vertragsdetails: Contract Number (%Contract number, zum Beispiel DEPE001A), Chassis Number (%Chassis Number), Licence Plate (%Licence Plate) und Product (%Product, zum Beispiel „Excelent"). Das Kennzeichen wird nur angezeigt, wenn ein Wert vorhanden ist; andernfalls entfällt das Feld in der E-Mail.

Den Abschluss bilden der Hinweis, bei Fragen den Customer Support zu kontaktieren, die Grußformel „Yours sincerely, Service Contract Team", die Angabe „Mercedes-Benz Cars Germany", marktspezifische Platzhalter für Telefonnummer und E-Mail-Adresse sowie der Hinweis, die Umwelt zu bedenken, bevor die E-Mail ausgedruckt wird.

**Testversand, Entwurf und Veröffentlichung**

Mit „Send Test E-mail" wird eine E-Mail im selben Format, wie sie später an den Kunden geht (Betreff, Header, Footer und Inhalt), an den angemeldeten Benutzer gesendet. So sehen Sie, wie die Nachricht beim Empfänger aussieht.

Mit „Save as Draft" speichern Sie eine Entwurfsversion. Sie wird für Geschäftsprozesse nicht angewendet, auch wenn das Gültigkeitsdatum erreicht ist.

Mit „Publish" veröffentlichen Sie die endgültige Version. Sie steht dann für die Prozesse bereit und wird entsprechend dem Datum „Valid From" angewendet. „Publish" ist erst verfügbar, wenn alle Pflichtfelder ausgefüllt sind.

Die erstellte Vorlage wird anschließend auf der Übersichtsseite (Summary) der Vorlagen angezeigt.