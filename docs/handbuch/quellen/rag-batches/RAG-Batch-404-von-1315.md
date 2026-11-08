# Batch 404 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Erinnerungs-E-Mails für Vertragsangebote (Master-Data-Template)**

Für Servicevertragsangebote, die noch auf die Unterschrift des Kunden warten (Status „Waiting for Confirmation"), versendet das System automatisch Erinnerungs-E-Mails. Diese gehen sowohl an den Kunden als auch an den Händler, der das Angebot erstellt hat. Sie gelten für Angebote, die per DSS-Fernsignatur oder als Ausdruck unterschrieben werden. Bei gedruckten Verträgen werden die Erinnerungen über die internen Templates versendet. Im DSS-Ablauf greift stattdessen der DSS-Prozess mit den Parametern REMIND und CANCEL.

Es gibt zwei Erinnerungen. Die erste wird 7 Kalendertage vor dem Ende der Angebotsgültigkeit verschickt, die zweite 5 Kalendertage danach. Die Tage werden im Market Configuration Service festgelegt. Der Betreff lautet jeweils „Kind reminder for (Contract Number: %Contract Number%)".

Die erste Erinnerung dankt dem Kunden für sein Interesse an einem Mercedes-Benz Servicevertrag und nennt das Datum, an dem das Angebot ausgedruckt wurde, sowie die verbleibende Zeit bis zum Ablauf der Gültigkeit. Der Kunde wird gebeten, das Angebotsdokument digital zu unterschreiben. Das geht über den aufgedruckten QR-Code oder über einen Link in der E-Mail. Alternativ kann er das unterschriebene Dokument beim Händler abgeben. Die zweite Erinnerung teilt mit, dass das Angebot am Gültigkeitsende abgelaufen ist, und empfiehlt, sich für ein neues Angebot an den bevorzugten Händler zu wenden. Beide E-Mails sprechen den Kunden mit Vor- und Nachnamen an, bei Geschäftskunden zusätzlich mit dem Firmennamen. Sie enden mit der Signatur des Service Contract Teams von Mercedes-Benz Cars Germany samt marktspezifischer Telefonnummer und E-Mail-Adresse. Die enthaltenen Links müssen funktionieren und anklickbar sein.

Die Vorlagen werden im Template Management für Privat- und Geschäftskunden angelegt. Dafür sind Pflichtangaben nötig: ein Template-Name (maximal 25 Zeichen, zum Beispiel „Reminder for offer"), der Markt (vorbelegt mit Deutschland), der Verwendungszweck („REMINDER before Offer Validity End Date" oder „REMINDER after Offer Validity End Date") und das Datum „Valid From", ab dem die Vorlage gilt. Optional können die Division (PC oder VAN) und die Sprache (Englisch) angegeben werden. Sind Pflichtfelder nicht ausgefüllt, weist das System auf das betroffene Feld hin. „Save as Draft" bleibt dann möglich, „Publish" nicht. Der Inhalt der E-Mail richtet sich nach dem MB Style Guide für E-Mails. Für die Erinnerungen wurden außerdem neue Druckvariablen im Template Management ergänzt.

**Weitere Änderungen im Bereich Documents & Communications**

Bei Rechnungen bleibt der blaue Punkt in der Benachrichtigungsliste (Glockensymbol) nun sichtbar, bis der Nutzer die Rechnung annimmt oder ablehnt. Bisher verschwand er schon nach dem bloßen Anklicken. Das entspricht der Umsetzung bei der Grace Period.

Bei der Vertragsvorlage gibt es außerdem den neuen Signaturtyp „1 Customer". Er ist für Märkte gedacht, die nur die Kundenunterschrift benötigen und keine Unterschrift von Mercedes-Benz.

Behoben wurden zudem ein Fehler, bei dem das Feld „Valid From" beim Anlegen einer Vorlage für PP und T&C einen Strich („-") anzeigte, sowie ein Problem bei der Filterung von Vorlagen im End-to-End-Test „Get Pdf From Template Repository".