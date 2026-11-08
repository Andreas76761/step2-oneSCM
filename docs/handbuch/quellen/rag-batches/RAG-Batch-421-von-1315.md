# Batch 421 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**E-Mail-Vorlage für die Vertragssperrung (Suspension)**

Wird ein Vertrag im Rahmen des Vertragsmanagements auf den Status „SUSPENDED“ gesetzt, kann das System eine E-Mail an den Vertragsinhaber senden. Den Inhalt dieser E-Mail legen Sie vorab in einer Benachrichtigungsvorlage fest. Für den deutschen Markt wird jeweils nur der angeforderte Vertrag gesperrt. Die Vorlage ist jedoch bereits darauf ausgelegt, bei Bedarf eine Liste oder Tabelle mehrerer gesperrter Verträge mit Vertragsnummer, Fahrgestellnummer, Kennzeichen und Produkt darzustellen. Die Prüfung des tatsächlichen E-Mail-Versands gehört zum Vertragsmanagement und nicht zur Erstellung der Vorlage.

**Vorlage anlegen**

Melden Sie sich mit Ihren Zugangsdaten an und öffnen Sie im Admin-Bereich die Template-Verwaltung und dort den Reiter „Notification“. Voraussetzung ist, dass die Vorlagen für Header und Footer bereits definiert sind. Klicken Sie anschließend auf „Create Template“ und wählen Sie „E-mail“.

Auf der Erstellungsseite erfassen Sie zunächst die Pflichtangaben: den Template-Namen (Textfeld, maximal 25 Zeichen, z. B. „Template-Expired Status“), den Markt (in der MVP-Phase mit Deutschland vorbelegt, künftig länderabhängig), das Feld „Used For“ (hier wählen Sie „SUSPENSION“) sowie das Datum „Valid From“, ab dem die Vorlage für den Geschäftsprozess gelten soll. Sind Pflichtfelder nicht ausgefüllt, weist das System auf das jeweilige Feld hin. „Save as Draft“ bleibt dann verfügbar, „Publish“ jedoch nicht.

Optional geben Sie die Division (im MVP: PC; Van folgt nach dem MVP), die Marke (im MVP: Mercedes-Benz; Smart folgt später) und die Sprache an. Die Sprache richtet sich nach der Marktrolle des Benutzers, im MVP wird Englisch angezeigt.

**Inhalt der E-Mail**

Alle Inhalte werden gemäß dem MB Style Guide für E-Mails erstellt. Als Betreff verwenden Sie „Suspended Service Contract - %Contract Number“. Die Vertragsnummer wird erst beim Versand an den Kunden eingesetzt und entsprechend dem jeweiligen Vertrag angepasst. Header und Footer wählen Sie aus den angebotenen Werten per Dropdown aus.

Den Text gestalten Sie im Template Design Editor. Alle mit „%“ gekennzeichneten Werte sind Platzhalter (Print Variables), die Sie per Drag-and-drop einfügen. Der Text lautet sinngemäß: Die Anrede lautet „Dear %First Name, %Last name“. Danach folgt die Mitteilung, dass der Servicevertrag zum Datum %Suspension date gesperrt ist und entsprechende Wartungs- und Reparaturleistungen in autorisierten Servicestellen damit nicht mehr abgedeckt werden. Unter „Contract Details“ erscheinen Vertragsnummer (z. B. DEPE001A), Fahrgestellnummer, Kennzeichen und Produkt (z. B. Excellent). Das Kennzeichen wird nur angezeigt, wenn ein Wert vorhanden ist; andernfalls entfällt das Feld in der E-Mail. Es folgt der Hinweis, bei Fragen den Customer Support zu kontaktieren, sowie die Grußformel „Yours sincerely, Service Contract Team, Mercedes-Benz Cars Germany“. Telefonnummer und E-Mail-Adresse werden marktspezifisch ergänzt. Den Abschluss bildet der Hinweis, vor dem Ausdrucken der E-Mail die Umwelt zu bedenken.

**Testen, speichern und veröffentlichen**

Mit „Send Test E-mail“ senden Sie sich selbst eine E-Mail im selben Format, wie sie der Kunde erhält (Betreff, Header, Footer und Inhalt). So sehen Sie vorab, wie die Nachricht im Postfach wirkt.

Mit „Save as Draft“ speichern Sie einen Entwurf. Dieser wird in Geschäftsprozessen nicht angewendet, auch dann nicht, wenn das Datum „Valid From“ erreicht ist. Mit „Publish“ veröffentlichen Sie die endgültige Version. Sie wird ab dem Datum „Valid From“ im jeweiligen Prozess angewendet, und die E-Mail wird an den Kunden gesendet. „Publish“ steht erst zur Verfügung, wenn alle Pflichtfelder erfasst sind. Die erstellte Vorlage erscheint anschließend in der Übersichtsseite der Vorlagen.