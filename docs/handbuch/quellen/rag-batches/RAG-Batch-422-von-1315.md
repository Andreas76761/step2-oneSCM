# Batch 422 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Versand von Preisinformationen per E-Mail und Erstellung der E-Mail-Vorlage**

Im Bereich Documents & Communications können Sie bei der Vertragserstellung (Contract Generation) Preisinformationen direkt per E-Mail an Kunden senden. Wenn ein Kunde Preisinformationen zu einem Servicevertrag anfragt, tragen Sie zunächst alle erforderlichen Angaben ein und klicken anschließend auf „Send via Email“. Im Moment des Klicks wird die E-Mail auf Basis der hinterlegten Vorlage an den Kunden versendet. Das PDF mit den Preisinformationen wird dabei als Anhang mitgeschickt. So kann der Kunde die Informationen prüfen und sich für einen Servicevertrag entscheiden.

**Vorlage anlegen**

Die E-Mail-Vorlage erstellen Sie nach der Anmeldung im Admin-Bereich unter Template Management auf dem Reiter „Notification“. Voraussetzung ist, dass die Vorlagen für Header und Footer bereits definiert sind. Über „Create Template“ und die Auswahl „E-mail“ öffnen Sie die Erfassungsmaske.

Pflichtangaben sind der Template-Name (Textfeld, maximal 25 Zeichen, zum Beispiel „Template-Active Status“), der Markt (Dropdown, im MVP mit Germany vorbelegt, künftig abhängig vom Land), das Feld „Used For“ (Dropdown, für Preisinformationen im Rahmen der Vertragserstellung wählen Sie „Informing“) sowie das Datum „Valid From“, ab dem die Vorlage für den Geschäftsprozess gilt. Sind Pflichtfelder nicht ausgefüllt, weist das System auf das betreffende Feld hin. „Save as Draft“ ist dann weiterhin möglich, „Publish“ jedoch nicht.

Optional können Sie Division (im MVP PC, Van folgt nach dem MVP), Brand (im MVP Mercedes-Benz, Smart folgt später) und Sprache angeben. Die Sprache richtet sich nach der Marktrolle des Benutzers, im MVP wird Englisch angezeigt.

**Inhalt der E-Mail**

Alle Inhalte werden gemäß dem Mercedes-Benz Style Guide für E-Mails erstellt. Der Betreff lautet „Service Contract %Product% Price Information“. Die Vertragsnummer wird erst beim Versand an den Kunden festgelegt und entsprechend dem jeweiligen Vertrag aktualisiert. Header und Footer wählen Sie aus den vordefinierten Vorlagen per Dropdown aus.

Den Text gestalten Sie im Template Design Editor. Werte mit vorangestelltem „%“ sind Platzhalter (Print-Variablen), die Sie per Drag-and-drop einfügen. Der Text beginnt mit der Anrede mit Vor- und Nachname des Kunden und bedankt sich für das Interesse am Mercedes-Benz Service Contract. Es folgt der Hinweis auf die angehängte Preisinformation. Die Preisdetails umfassen Fahrgestellnummer, Datum der Erstzulassung, Kennzeichen, Produkt (zum Beispiel „Excellent“), Vertragsbeginn, Gesamtlaufleistung, Zahlungsintervall, Gesamtpreis inklusive MwSt. und monatlichen Preis inklusive MwSt. Mit Ausnahme des Produkts erscheinen diese Felder nur, wenn ein Wert vorhanden ist. Leere Felder werden in der E-Mail weggelassen.

Anschließend folgt ein Standardhinweis: Die Preisinformation kann sich ändern, dient nur Diskussionszwecken und stellt kein rechtsverbindliches Angebot dar. Verbindlich ist nur ein vollständig ausgefertigter, schriftlicher Vertrag, der von den berechtigten Vertretern beider Parteien unterzeichnet wurde. Bei Fragen wird auf das Customer Support Team verwiesen. Die E-Mail schließt mit der Grußformel „Yours sincerely, Service Contract Team“, der Angabe Mercedes-Benz Cars Germany, den marktspezifischen Kontaktdaten (Telefonnummer und E-Mail-Adresse) und dem Hinweis, vor dem Drucken die Umwelt zu bedenken.

**Testen, speichern und veröffentlichen**

Mit „Send Test E-mail“ erhält der angemeldete Benutzer eine E-Mail im selben Format wie der Kunde, einschließlich Betreff, Header, Footer und Inhalt. So sehen Sie vorab, wie die Nachricht im Postfach aussieht. Mit „Save as Draft“ speichern Sie eine Entwurfsversion, die für Geschäftsprozesse noch nicht wirksam ist. Mit „Publish“ veröffentlichen Sie die endgültige Version. Sie wird entsprechend dem Datum „Valid From“ in den jeweiligen Prozessen angewendet und steht danach für E-Mails mit Preisinformationen zur Verfügung.