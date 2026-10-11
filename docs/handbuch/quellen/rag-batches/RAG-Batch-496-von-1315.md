# Batch 496 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**E-Mail-Vorlage für den Vertragsstatus „Bestätigt"**

Im Bereich der Stammdaten-Vorlagen können Sie eine Benachrichtigungsvorlage anlegen, deren E-Mail-Inhalt speziell für Verträge im Status „Bestätigt" gilt. Wird ein Vertrag im Rahmen der Vertragserstellung bestätigt, erhält der Vertragsinhaber eine E-Mail mit dem Inhalt, den Sie in dieser Vorlage festgelegt haben. Die Vorlage selbst wird an dieser Stelle erstellt; die Prüfung des tatsächlichen E-Mail-Versands erfolgt im Rahmen der Vertragserstellung.

**Voraussetzungen und Einstieg**

Sie sind mit den passenden Zugangsdaten angemeldet und haben im Admin-Bereich unter „Template Management" den Reiter „Notification" geöffnet. Die Vorlagen für Kopf- und Fußzeile müssen bereits definiert sein. Über „Create Template" und anschließend „E-mail" gelangen Sie zur Seite für die Vorlagenerstellung.

**Pflichtangaben**

Zunächst erfassen Sie die Pflichtangaben:

Der Vorlagenname ist ein Textfeld mit maximal 65 Zeichen, zum Beispiel „Template-Confirmed Status". Der Markt ist ein Dropdown, das im MVP mit „Germany" vorbelegt ist und künftig je nach Land angezeigt wird. Unter „Used For" stehen je nach Geschäftsprozess verschiedene Werte zur Auswahl; für den Status „Bestätigt" wählen Sie „CONFIRMATION". Mit „Valid From" legen Sie das Datum fest, ab dem die Vorlage für den Geschäftsprozess gültig bzw. aktiv ist.

Sind Pflichtfelder nicht ausgefüllt, werden Sie auf das jeweilige Feld hingewiesen. In diesem Fall ist die Schaltfläche „Save as Draft" verfügbar, „Publish" jedoch nicht.

**Optionale Angaben**

Optional können Sie Division, Marke und Sprache festlegen. Als Division wählen Sie im MVP „PC"; „Van" soll nach dem MVP folgen. Als Marke wählen Sie im MVP „Mercedes-Benz"; „Smart" ist für die Zeit nach dem MVP vorgesehen. Die Sprache richtet sich nach der Marktrolle des Benutzers; im MVP wird Englisch angezeigt.

**E-Mail-Inhalt**

Alle Inhalte werden gemäß dem Mercedes-Benz-Styleguide für E-Mails erstellt. Der Betreff lautet „Service Contract confirmation (Contract Number: %Contract Number)". Die Vertragsnummer wird erst beim Versand an den Kunden eingesetzt und entsprechend dem jeweiligen Vertrag aktualisiert. Kopf- und Fußzeile wählen Sie jeweils aus einem Dropdown aus den angezeigten Werten aus.

Im Template Design Editor geben Sie den E-Mail-Text ein. Alle mit „%" gekennzeichneten Werte sind Platzhalter (Print Variables), die Sie beim Erstellen per Drag-and-drop einfügen. Der Text beginnt mit der Anrede „Dear (%First Name) (%Last name)," und bedankt sich dafür, dass sich der Kunde für einen Mercedes-Benz Service Contract zur Wartung seines Fahrzeugs entschieden hat. Er informiert darüber, dass die Anfrage zur abschließenden Prüfung weitergeleitet wurde und der Kunde alle vertragsbezogenen Unterlagen per E-Mail erhält, sobald der Vertrag aktiviert ist.

Darauf folgen die Vertragsdetails: Vertragsnummer (zum Beispiel DEPE001A), Fahrgestellnummer, Datum der Erstzulassung, Kennzeichen, Produkt (zum Beispiel „Excelent"), Vertragsbeginn, Vertragsende, Gesamtlaufleistung, Zahlungsbedingung, Gesamtpreis inklusive MwSt. und monatlicher Preis inklusive MwSt. Das Kennzeichen und der monatliche Preis werden nur angezeigt, wenn ein Wert vorhanden ist; andernfalls entfällt das jeweilige Feld in der E-Mail.

Anschließend folgt der Hinweis, sich bei Fragen an das Customer Support Team zu wenden. Die E-Mail endet mit der Grußformel „Yours sincerely, Service Contract Team", den marktspezifischen Angaben (Mercedes-Benz Cars Germany, Kontakttelefonnummer und Kontakt-E-Mail-Adresse) sowie dem Hinweis, vor dem Ausdrucken die Umwelt zu bedenken.

**Testversand, Entwurf und Veröffentlichung**

Mit „Send Test E-mail" wird eine E-Mail im selben Format, wie sie später der Kunde erhält (Betreff, Kopfzeile, Inhalt und Fußzeile), an den angemeldeten Benutzer gesendet. So sehen Sie, wie die Nachricht in der Praxis aussieht.

Mit „Save as Draft" speichern Sie eine Entwurfsversion. Diese wird für Geschäftsprozesse noch nicht angewendet, auch dann nicht, wenn das Datum „Valid From" erreicht ist.

Mit „Publish" veröffentlichen Sie die endgültige Version. Sie steht danach für die Geschäftsprozesse bereit und wird entsprechend dem Datum „Valid From" angewendet. Die erstellte Vorlage wird anschließend in der Übersichtsseite der Vorlagen angezeigt.