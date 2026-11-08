# Batch 469 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**E-Mail-Vorlage für Preisinformationen erstellen (Documents & Communications)**

Im Bereich Documents & Communications können Benutzer eine E-Mail-Vorlage für den Geschäftsprozess „Informing“ anlegen. Diese Vorlage wird verwendet, wenn ein Kunde eine Preisinformation anfordert, damit er den Preis analysieren und sich für einen Servicevertrag entscheiden kann. Ausgelöst wird der Versand, sobald der Benutzer alle erforderlichen Angaben eingetragen und auf „Send E-mail“ geklickt hat. Die E-Mail wird dann zusammen mit der Preisinformation als PDF an den Kunden gesendet.

Um eine Vorlage zu erstellen, melden Sie sich mit den entsprechenden Berechtigungen an und öffnen den Admin-Bereich. Dort wählen Sie „Template Management“ und den Reiter „Notification“. Voraussetzung ist, dass die Vorlagen für Header und Footer bereits definiert sind. Klicken Sie anschließend auf „Create Template“ und wählen Sie „E-mail“.

Zunächst erfassen Sie die Pflichtangaben: den Template-Namen (Textfeld, maximal 25 Zeichen, zum Beispiel „Template-Active Status“), den Markt (Dropdown, im MVP mit Germany vorbelegt, künftig abhängig vom Land), das Feld „Used For“ (Dropdown mit Werten entsprechend den Geschäftsprozessen; für die Preisinformation bei der Vertragserstellung wählen Sie „Informing“) sowie das Datum „Valid From“, ab dem die Vorlage für den Geschäftsprozess gelten soll. Sind Pflichtfelder nicht ausgefüllt, weist das System auf das jeweilige Feld hin. Die Schaltfläche „Save as Draft“ ist dann aktiv, „Publish“ jedoch nicht.

Optional können Sie weitere Felder angeben: die Division (im MVP PC, Van folgt nach dem MVP), die Marke (im MVP Mercedes-Benz, Smart folgt nach dem MVP) und die Sprache, die sich nach der Marktrolle des Benutzers richtet und im MVP Englisch ist.

Anschließend erfassen Sie den Inhalt der E-Mail gemäß dem MB Style Guide für E-Mails. Der Betreff lautet „Service Contract %Product% Price Information“. Die Vertragsnummer wird erst beim Versand an den Kunden festgelegt und entsprechend dem jeweiligen Vertrag angepasst. Header und Footer wählen Sie per Dropdown aus den vorhandenen Werten aus.

Im Template Design Editor geben Sie den Text der E-Mail ein. Mit „%“ gekennzeichnete Werte sind Variablen, die per Drag-and-drop eingefügt werden. Der Text beginnt mit der Anrede („Dear“ mit Vor- und Nachname), gefolgt von einem Dank für das Interesse am Mercedes-Benz Service Contract und dem Hinweis auf die angehängte Preisinformation. Die Preisinformationen umfassen Fahrgestellnummer, Datum der Erstzulassung, Kennzeichen, Produkt (zum Beispiel „Excelent“), Vertragsbeginn (Erstzulassungsdatum), Gesamtlaufleistung, Zahlungsintervall, Gesamtpreis inklusive Mehrwertsteuer und monatlichen Preis inklusive Mehrwertsteuer. Mit Ausnahme des Produkts wird jedes dieser Felder nur angezeigt, wenn ein Wert vorhanden ist; andernfalls entfällt es in der E-Mail.

Danach folgt ein Haftungshinweis: Die Preisinformation kann sich ändern, dient nur Diskussionszwecken und stellt kein rechtsverbindliches Angebot und keine Vereinbarung dar. Verbindliche Zusagen erfordern einen vollständig ausgefertigten schriftlichen Vertrag, der von bevollmächtigten Vertretern beider Parteien unterzeichnet ist. Bei Fragen wird auf das Customer Support Team verwiesen. Den Abschluss bilden die Grußformel „Yours sincerely, Service Contract Team“, die Angabe Mercedes-Benz Cars Germany, marktspezifische Angaben zu Telefonnummer und E-Mail-Adresse sowie der Hinweis, vor dem Drucken die Umwelt zu bedenken.

Mit „Send Test E-mail“ senden Sie sich selbst als angemeldeter Benutzer eine E-Mail im Format der späteren Kundenmail, also mit Betreff, Header, Footer und Inhalt. So sehen Sie vorab, wie die E-Mail beim Empfänger aussieht.

Mit „Save as Draft“ speichern Sie eine Entwurfsversion der Vorlage. Diese wird noch nicht in Geschäftsprozessen angewendet. Mit „Publish“ veröffentlichen Sie die endgültige Version. Sie steht dann für die Prozesse bereit und wird entsprechend dem Datum „Valid From“ angewendet.

Beim Test dieser Funktion ist insbesondere zu prüfen, dass der Benutzer im Dropdown „Used For“ den Wert „Informing“ auswählen kann und sich die Vorlage als Entwurf speichern lässt.