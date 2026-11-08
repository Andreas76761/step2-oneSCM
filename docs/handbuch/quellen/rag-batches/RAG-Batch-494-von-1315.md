# Batch 494 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**E-Mail-Vorlage für den Vertragsstatus „Abgelehnt"**

Im Bereich Documents & Communications können Sie eine Benachrichtigungsvorlage mit E-Mail-Inhalt anlegen, die speziell für Verträge im Status „Abgelehnt" gedacht ist. Wird ein Vertrag während der Vertragserstellung abgelehnt, erhält der Vertragshalter eine E-Mail mit dem Inhalt, den Sie in dieser Vorlage festgelegt haben. Der Umfang dieser Funktion beschränkt sich auf das Erstellen der Vorlage. Der tatsächliche E-Mail-Versand wird im Rahmen der Vertragserstellung geprüft.

**Voraussetzungen und Einstieg**

Sie müssen mit den passenden Zugangsdaten angemeldet sein. Außerdem müssen die Vorlagen für Kopfbereich (Header) und Fußbereich (Footer) bereits definiert sein. Navigieren Sie im Admin-Bereich zur Template-Verwaltung und öffnen Sie dort den Reiter „Notification". Wählen Sie anschließend „Create Template" und danach „E-mail".

**Pflichtfelder**

Auf der Seite zur Vorlagenerstellung erfassen Sie zunächst die Pflichtangaben:

Der Template-Name ist ein Textfeld mit maximal 25 Zeichen, zum Beispiel „Template-Reject Status". Das Feld „Market" ist ein Dropdown, das für die erste Ausbaustufe (MVP) mit Deutschland vorbelegt ist und künftig je nach Land angezeigt werden soll. Im Dropdown „Used For" werden je nach Geschäftsprozess verschiedene Werte angeboten; für diese Vorlage wählen Sie „Rejection". Unter „Valid From" legen Sie das Datum fest, ab dem die Vorlage für den Geschäftsprozess gültig und aktiv sein soll.

Sind Pflichtfelder nicht ausgefüllt, weist das System auf das betreffende Feld hin. In diesem Fall ist die Schaltfläche „Save as Draft" verfügbar, „Publish" dagegen nicht.

**Optionale Felder**

Zusätzlich können Sie die Division angeben, für die die Vorlage erstellt wird. Im MVP wählen Sie hier PC; Van soll nach dem MVP berücksichtigt werden. Beim Feld „Brand" wählen Sie im MVP Mercedes-Benz; Smart soll später folgen. Die Sprache richtet sich nach der Marktrolle des Benutzers und ist im MVP Englisch.

**E-Mail-Inhalt**

Alle Inhalte werden gemäß dem Mercedes-Benz E-Mail-Styleguide erstellt. Der Betreff lautet „Service Contract Rejection (Contract Number: %Contract Number)". Die Vertragsnummer wird erst beim Versand an den Kunden eingesetzt und entsprechend der jeweiligen Nummer aktualisiert. Header und Footer wählen Sie jeweils aus einem Dropdown unter den angezeigten Werten aus.

Im Template Design Editor geben Sie den folgenden Text ein. Alle mit „%" gekennzeichneten Werte sind Platzhalter (Print Variables), die Sie per Drag-and-drop einfügen:

Dear (%First Name) (%Last name),
Thank you for choosing to maintain your vehicle with a Mercedes-Benz Service Contract. Unfortunately, your request cannot be processed further. For further details, please contact our Customer Support Team.
Yours sincerely,
Service Contract Team
Mercedes-Benz Cars Germany
[Market Specific input] <Contact Phone Number>
[Market Specific input] <Contact E-mail Address>
[Market Specific input] Please consider the environment before printing this email.

**Test-E-Mail, Entwurf und Veröffentlichung**

Mit „Send Test E-mail" wird eine E-Mail im selben Format, wie sie später der Kunde erhält (Betreff, Header, Footer und Inhalt), an den angemeldeten Benutzer gesendet. So können Sie prüfen, wie die Nachricht per E-Mail aussieht.

Mit „Save as Draft" speichern Sie einen Entwurf der Vorlage. Dieser wird für Geschäftsprozesse noch nicht angewendet, auch dann nicht, wenn das Datum „Valid From" erreicht ist. Mit „Publish" veröffentlichen Sie die endgültige Version, die für die Geschäftsprozesse bereitsteht. Angewendet wird sie ab dem festgelegten Gültigkeitsdatum. „Publish" ist erst verfügbar, wenn alle Pflichtfelder ausgefüllt sind.

Die erstellte Vorlage wird anschließend in der Übersichtsseite der Vorlagen angezeigt.