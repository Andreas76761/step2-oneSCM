# Batch 849 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Bearbeitbare Felder in der Detailansicht von Verträgen**

Für Benutzer aus dem Bereich Market Operation bzw. MPC ist es möglich, Verträge, die zu einem früheren Zeitpunkt aktiviert wurden, nachträglich anzupassen. Dazu melden Sie sich als Market-Operation-Benutzer an, öffnen die Detailansicht eines ausgewählten Vertrags, wechseln auf den gewünschten Reiter und klicken auf die Schaltfläche „EDIT". Anschließend werden die jeweils zulässigen Felder bearbeitbar. Alle bearbeitbaren Felder werden versioniert, sodass sämtliche Werte, die seit der Vertragsaktivierung gültig waren, erhalten bleiben. Die Oberfläche entspricht dem Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

Im Reiter „Vertrag" können drei Felder angepasst werden. Beim Feld „Mileage at contract start" gilt: Wurde der Vertrag für das Produkt „Excellent" abgeschlossen, darf die Laufleistung 10.000 km nicht überschreiten, und der Wert bei Vertragsbeginn muss kleiner sein als der Wert bei Vertragsende. Bei einer zu hohen Eingabe erscheint die Fehlermeldung „Mileage at contract Start cannot be higher than 10.000 km". Das Feld „Start Date" darf nicht vor dem Datum der Erstzulassung (FRD) liegen. Eine Rückdatierung ist im Kalender nicht möglich; gibt jemand ein früheres Datum über die Tastatur ein, erscheint die Fehlermeldung „Start Date cannot be smaller than FRD". Für beide Felder gilt, dass die Änderung nach dem Speichern für die nächste i155-Übertragung vorgemerkt wird. Das Feld „Contract Duration Real" richtet sich nach Statuswechseln des Vertrags: Bei vorzeitiger Beendigung wird das Beendigungsdatum eingetragen, bei einer Aussetzung das Datum der Aussetzung, bei der Reaktivierung aus dem Status „Suspended" das geplante Vertragsende („Contract Planned End Date") und bei einer Stornierung das Stornierungsdatum.

Im Reiter „Fahrzeug" lassen sich das Kennzeichen und die Erstzulassung betrachten bzw. ändern. Das Kennzeichen ist auf 11 alphanumerische Zeichen einschließlich Bindestrich begrenzt. Nach dem Speichern wird die Änderung für die nächste i155-Übertragung vorgemerkt, und die Kennzeicheninformation im Permanent Header wird aktualisiert. Die Erstzulassung (FRD) ist bearbeitbar, sofern der Vertrag nicht für das Produkt „Excellent" abgeschlossen wurde; bei „Excellent"-Verträgen ist sie schreibgeschützt. Auch hier wird eine gespeicherte Änderung für die nächste i155-Übertragung vorgemerkt.

Im Reiter „Kunde" entfällt die Schaltfläche „EDIT", und es sind keine Felder bearbeitbar. Die Kundennummer wird als Hyperlink dargestellt und führt zur Detailansicht des ausgewählten Kunden in der Kundenverwaltung. Ob bei einer Namensänderung des Kunden das optionale Feld RC80 (Position 78–177) der i155 aktualisiert werden muss, ist noch zu klären. Im Reiter „Produkt" ist die Schaltfläche „EDIT" ausgegraut (deaktiviert); sie kann in Zukunft genutzt werden.

Im Reiter „Zahlung" kann das Zahlungsintervall ausschließlich von „Monthly" auf „One Time" umgestellt werden. Dadurch wird das Revenue Management angestoßen, die nächste Rechnung mit dem Restbetrag zu erzeugen, und der Betrag pro Intervall wird auf den noch zu zahlenden Restbetrag aktualisiert.

**Ablauf einer Änderung**

Wählen Sie einen Vertrag aus, öffnen Sie den gewünschten Reiter und klicken Sie auf „EDIT". Danach werden anstelle der Schaltfläche „EDIT" zwei Schaltflächen mit Symbolen angezeigt: „Abbrechen" und „Bestätigen". Mit „Abbrechen" werden alle vorgenommenen Änderungen in den bearbeitbaren Feldern verworfen. Mit „Bestätigen" öffnet sich ein Pop-up, in dem ein Änderungsgrund einzugeben ist. Wählen Sie dort „Cancel", wird die Änderung zurückgesetzt; mit „Proceed" werden die Informationen aktualisiert, die Daten im System gespeichert und weitere Folgeaktionen ausgelöst. Entsprechen Eingaben nicht den Feldbedingungen, werden Fehlermeldungen angezeigt.

**Änderungen in der Vertragshistorie**

Alle Änderungen können im Reiter „History" nachvollzogen werden. Dort werden folgende Angaben angezeigt: das geänderte Objekt („Modified Object", hier: Contract), das geänderte Attribut („Modified Attribute", also der Name des Feldes, z. B. Payment Interval), der alte und der neue Wert (z. B. Monthly und One Time), die Art der Änderung („Type of Modification", also die Bezeichnung des Bereichs des Attributs, z. B. Payment), der im Pop-up eingegebene Grund, das Änderungsdatum im Format TT.MM.JJJJ HH:MM:SS sowie die ändernde Person mit Vor- und Nachnamen.

**Hinweis zur Weitergabe der Daten**

Geänderte Feldwerte müssen an andere Domänen weitergegeben werden, die diese Daten verarbeiten, namentlich Revenue, Customer & Partner sowie Vega.