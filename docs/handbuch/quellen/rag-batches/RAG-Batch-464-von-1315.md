# Batch 464 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**E-Mail-Vorlage für die Sperrung (Suspension) eines Vertrags erstellen**

Im Bereich Documents & Communications können Sie eine E-Mail-Vorlage anlegen, die automatisch an den Vertragshalter versendet wird, wenn ein Vertrag im Rahmen des Vertragsmanagements den Status „SUSPENDED“ erhält. Die Vorlage legt fest, welchen Inhalt der Vertragshalter in dieser Benachrichtigung erhält. Der Versand selbst wird nicht bei der Vorlagenerstellung, sondern im Rahmen des Vertragsmanagements geprüft.

**Vorlage anlegen**

Melden Sie sich mit Ihren Zugangsdaten an und wechseln Sie in den Admin-Bereich unter „Template Management“ auf den Reiter „Notification“. Voraussetzung ist, dass die Vorlagen für Header und Footer bereits definiert sind. Klicken Sie anschließend auf „Create Template“ und wählen Sie „E-mail“.

Auf der Seite zur Vorlagenerstellung sind folgende Pflichtfelder auszufüllen: Der Template Name ist ein Textfeld mit maximal 25 Zeichen (zum Beispiel „Template-Expired Status“). Das Feld Market ist vorbelegt mit GERMANY; dies gilt zunächst für das MVP, künftig wird der Markt abhängig vom Land angezeigt. Im Dropdown „Used For“ werden je nach Geschäftsprozess verschiedene Werte angeboten; für diese Vorlage wählen Sie „SUSPENSION“. Bei „Valid From“ legen Sie das Datum fest, ab dem die Vorlage für den Geschäftsprozess gültig und aktiv sein soll.

Sind Pflichtfelder nicht befüllt, wird das jeweilige Feld gemeldet. „Save as Draft“ ist dann weiterhin möglich, „Publish“ jedoch nicht.

Optional können Sie Division, Brand und Language angeben. Für das MVP ist als Division „PC“ und als Marke „Mercedes-Benz“ auszuwählen; Van beziehungsweise Smart sollen erst nach dem MVP berücksichtigt werden. Die Sprache richtet sich nach der Marktrolle des Benutzers und ist im MVP Englisch.

**Inhalt der E-Mail gestalten**

Alle Inhalte werden gemäß dem MB Style Guide für E-Mails erstellt. Der Betreff lautet „Suspended Service Contract - %Contract Number“. Die Vertragsnummer wird erst beim Versand an den Kunden eingesetzt und entsprechend dem jeweiligen Vertrag aktualisiert. Header und Footer wählen Sie über Dropdowns aus den angezeigten Werten aus.

Im Template Design Editor erfassen Sie den Text der E-Mail. Werte mit vorangestelltem „%“ sind Platzhalter (Print Variables), die per Drag-and-drop in den Text eingefügt werden. Der Text beginnt mit der Anrede „Dear %First Name, %Last name“ und teilt mit, dass der Servicevertrag zum Datum %Suspension date gesperrt wird. Das bedeutet, dass entsprechende Wartungs- und Reparaturleistungen in autorisierten Servicestellen nicht mehr übernommen werden. Es folgen die Vertragsdetails: Vertragsnummer (zum Beispiel DEPE001A), Fahrgestellnummer, Kennzeichen und Produkt (zum Beispiel Excellent). Das Kennzeichen wird nur angezeigt, wenn ein Wert vorhanden ist; andernfalls entfällt das Feld in der E-Mail. Danach folgt der Hinweis, sich bei Fragen an das Customer Support Team zu wenden, sowie die Grußformel „Yours sincerely, Service Contract Team, Mercedes-Benz Cars Germany“. Telefonnummer und E-Mail-Adresse des Kontakts sind marktspezifisch einzutragen. Den Abschluss bildet der Hinweis, die Umwelt zu berücksichtigen, bevor die E-Mail ausgedruckt wird.

Für den deutschen Markt wird jeweils nur der angefragte Vertrag gesperrt. Die Vorlage soll dennoch so vorbereitet sein, dass sie künftig eine Liste beziehungsweise Tabelle mehrerer gesperrter Verträge mit Vertragsnummer, Fahrgestellnummer, Kennzeichen und Produkt unterstützen kann.

**Testen, speichern und veröffentlichen**

Mit „Send Test E-mail“ erhält der angemeldete Benutzer eine E-Mail im selben Format, das später der Kunde erhält, einschließlich Betreff, Header, Footer und Inhalt. So lässt sich prüfen, wie die Nachricht beim Empfänger aussieht.

Mit „Save as Draft“ speichern Sie eine Entwurfsversion. Diese wird in keinem Geschäftsprozess angewendet, auch dann nicht, wenn das Datum „Valid From“ erreicht ist. Mit „Publish“ veröffentlichen Sie die endgültige Version; sie wird ab dem Datum „Valid From“ in den Prozessen angewendet und an Kunden versendet. „Publish“ steht erst zur Verfügung, wenn alle Pflichtfelder erfasst sind. Die erstellte Vorlage wird anschließend in der Übersichtsseite der Vorlagen angezeigt.