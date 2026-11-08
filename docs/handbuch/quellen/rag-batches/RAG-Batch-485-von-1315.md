# Batch 485 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vorlage für die E-Mail-Benachrichtigung bei ausgesetztem Vertrag (Status „Suspended")**

Im Bereich Documents & Communications können Sie eine E-Mail-Vorlage anlegen, die automatisch an den Vertragshalter versendet wird, sobald ein Vertrag im Rahmen des Vertragsmanagement-Prozesses ausgesetzt wird (Status „SUSPENDED"). Der Inhalt der E-Mail wird dabei von Ihnen in der Vorlage festgelegt. Für den deutschen Markt wird jeweils nur die angefragte Vertragsnummer ausgesetzt. Die Vorlage ist dennoch so ausgelegt, dass sie künftig auch eine Liste bzw. Tabelle mehrerer ausgesetzter Verträge mit Vertragsnummer, Fahrgestellnummer, Kennzeichen und Produkt unterstützen kann. Die Prüfung des tatsächlichen E-Mail-Versands gehört nicht zu dieser Funktion, sondern zum Vertragsmanagement.

**Vorlage aufrufen und Pflichtangaben erfassen**

Melden Sie sich mit Ihren Zugangsdaten an und öffnen Sie im Admin-Bereich die Template-Verwaltung. Wechseln Sie dort auf den Reiter „Notification" und wählen Sie „Create Template" und anschließend „E-mail". Voraussetzung ist, dass die Vorlagen für Header und Footer bereits definiert sind.

Auf der Seite zur Vorlagenerstellung erfassen Sie zunächst die Pflichtangaben: den Template-Namen (Textfeld, maximal 25 Zeichen), den Markt (für das MVP mit Deutschland vorbelegt, künftig abhängig vom Land), das Feld „Used For" (für diesen Fall wählen Sie „SUSPENSION") sowie das Datum „Valid From", ab dem die Vorlage im Geschäftsprozess gültig ist. Sind Pflichtfelder nicht ausgefüllt, werden Sie auf das jeweilige Feld hingewiesen. „Save as Draft" ist dann weiterhin möglich, „Publish" dagegen nicht.

Optional können Sie die Division (im MVP PC, Van folgt nach dem MVP), die Marke (im MVP Mercedes-Benz, Smart folgt nach dem MVP) und die Sprache angeben. Die Sprache richtet sich nach der Marktrolle des Benutzers; im MVP wird Englisch angezeigt.

**E-Mail-Inhalt gestalten**

Der gesamte Inhalt wird gemäß dem MB Style Guide für E-Mails erstellt. Als Betreff dient „Suspended Service Contract - %Contract Number". Die Vertragsnummer wird erst beim Versand an den Kunden eingesetzt und entsprechend der jeweiligen Vertragsnummer aktualisiert. Header und Footer wählen Sie aus den angebotenen Werten per Dropdown aus.

Den Text gestalten Sie im Template Design Editor. Werte mit vorangestelltem „%" sind Platzhalter (Print Variables), die Sie per Drag and Drop einfügen. Der Mustertext lautet sinngemäß: Der Kunde wird mit Vor- und Nachnamen angesprochen und darüber informiert, dass sein Servicevertrag zum Aussetzungsdatum ausgesetzt ist. Entsprechende Wartungs- und Reparaturleistungen in autorisierten Servicebetrieben werden dann nicht mehr übernommen. Es folgen die Vertragsdetails: Vertragsnummer (z. B. DEPE001A), Fahrgestellnummer, Kennzeichen und Produkt (z. B. Excellent). Das Kennzeichen wird nur angezeigt, wenn ein Wert vorhanden ist; andernfalls entfällt das Feld in der E-Mail. Anschließend folgt der Hinweis, sich bei Fragen an das Customer Support Team zu wenden, die Grußformel „Service Contract Team, Mercedes-Benz Cars Germany" mit marktspezifischer Telefonnummer und E-Mail-Adresse sowie der Hinweis, die Umwelt vor dem Ausdrucken der E-Mail zu bedenken.

**Testen, speichern und veröffentlichen**

Mit „Send Test E-mail" wird eine E-Mail im selben Format wie für den Kunden (Betreff, Header, Footer und Inhalt) an den angemeldeten Benutzer gesendet. So sehen Sie vorab, wie die Nachricht im Postfach aussieht.

Mit „Save as Draft" speichern Sie einen Entwurf. Dieser wird in Geschäftsprozessen nicht angewendet, auch wenn das Gültigkeitsdatum erreicht ist. Mit „Publish" veröffentlichen Sie die endgültige Version; sie wird entsprechend dem Datum „Valid From" in den Prozessen angewendet und für den Versand an den Kunden verwendet. „Publish" steht erst zur Verfügung, wenn alle Pflichtfelder ausgefüllt sind. Die erstellte Vorlage erscheint anschließend in der Übersichtsseite der Vorlagen.