# Batch 1104 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 22 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Sprache und Vorlagen**

Alle Dokumente, die an Endkunden erzeugt und versendet werden, liegen künftig in der Sprache vor, die auf Kundenebene hinterlegt ist. Im Vertragserstellungsprozess wurde dafür die deutsche Übersetzung „noch nicht verfügbar“ ergänzt. Beim Versenden eines Preisangebots, sowohl aus der Produktdetailansicht als auch aus dem Vergleich, enthält der Angebotsdialog ein zusätzliches Dropdown-Feld „Sprache“. Es listet die Sprachen auf, die in der Marktkonfiguration definiert sind, und ist standardmäßig auf die vom Benutzer eingestellte Sprache gesetzt. Im B2C-Fall lautet die Reihenfolge der Felder Vorname, Nachname, E-Mail-Adresse und Sprache. Im B2B-Fall lauten sie Vorname und Nachname der Kontaktperson, Firmenname, E-Mail-Adresse und Sprache.

**Dokumente und Benachrichtigungen**

Die Bezeichnung „Service_Contract_XXXXXX“ wurde in „Service_Contract_Proposal_XXXXXX“ umbenannt. Beim SEPA-Dokument werden Hausnummer und Lastschriftcode (directDebitCode) für alle Kundentypen als Platzhalter übergeben. Firmenname und Umsatzsteuer-ID werden nur bei gewerblichen Kunden übermittelt. Beim Erzeugen von Dokumenten für die Bereitstellung gibt es zudem einen zusätzlichen Parameter, der bei monatlicher Zahlung den Gesamtpreis ausweist.

Die E-Mail-Benachrichtigungen wurden angepasst. Wird ein Vertrag bestätigt, erhält der Kunde eine E-Mail mit dem Hinweis, dass der Vertrag zur weiteren Prüfung eingereicht wurde. Dieser E-Mail sind nun die unterzeichnete Version des Servicevertrags und die Allgemeinen Geschäftsbedingungen beigefügt. Wird der Vertrag aktiviert, erhält der Kunde eine Bestätigungs-E-Mail ohne Servicevertrag und AGB. In Benachrichtigungen und Dokumenten wurde außerdem der Platzhalter „contractNumber“ durch „contractRequestNumber“ ersetzt. Die Darstellung von Währungen, bei denen das Symbol vor dem Betrag steht, wurde im Backend angepasst: Statt „EUR300.85“ erscheint nun „EUR 300.85“.

**Marktkonfiguration und Erinnerungen**

Die Logik der Erinnerungsfelder in der Marktkonfiguration wurde neu gestaltet. Dies betrifft „First Reminder (Days)“ und „Second Reminder (Days)“ sowie die beiden entsprechenden Felder unter „Contract End Date Reminders“. Alle vier Felder sind optional. Ist kein Wert eingetragen, wird keine Erinnerung versendet. Ist ein Wert eingetragen, wird die Erinnerung nach der angegebenen Anzahl von Tagen versendet.

**Preiskonfiguration**

In der Preiskonfiguration wird ein Banner zum umverteilten Betrag („Reallocated Amount“) angezeigt. Es erscheint erst, nachdem das Produkt konfiguriert wurde, und nur bei monatlichen Zahlungsintervallen.

**MO-Prüfungen**

Die MO-Prüfungen berücksichtigen nun auch Verträge im Status „Bestätigt“ (CONFIRMED), und zwar in der Anzeige und in den Filtern. Zuvor wurden nur Verträge mit den Status „Erstellt“, „Wartet auf Bestätigung“ und „Wartet auf Aktivierung“ angezeigt.

Bei der Prüfung des Kundenstatus gilt: Ein verfügbarer Kunde ist in Ordnung und benötigt keine Begründung. Ein gesperrter oder archivierter Kunde ist nicht in Ordnung. Bei einem Kunden im Status „Pending“ wird der Status „Pending“ ohne Begründung angezeigt. Bei der CAS-Prüfung wird „PENDING“ angezeigt, wenn keine CAS-Antwort vorliegt, und „Positive hit“, wenn die CAS-Antwort einen positiven Treffer enthält.

Auch die Dokumentenprüfung des Vertrags wurde angepasst. Lautet das Ergebnis der Vertragsnummernprüfung „Ok“, wird die Dokumentenprüfung auf „OK“ gesetzt, der Vertrag erhält den Status „Bestätigt“, und der Aktivierungsprozess wird fortgesetzt. Lautet das Ergebnis „NOK“, wird die Dokumentenprüfung auf „NOK“ gesetzt. Der MO prüft dann das hochgeladene Dokument und entscheidet über das weitere Vorgehen. Bestätigt der MO, wird der Vertrag auf „Bestätigt“ gesetzt, die MO-Prüfung „Contract Check“ auf „OK“ aktualisiert und der Aktivierungsprozess fortgesetzt. Lehnt der MO ab, wird der Status des Servicevertrags auf „Abgelehnt“ gesetzt. Zudem kann ein Servicevertrag nun für verschiedene Vertragsstatus hochgeladen werden.

**Weitere Änderungen**

Wird ein Vertrag abgelehnt, weil die Gültigkeit des Angebots abgelaufen ist, wird der zugehörige DSS-Signaturworkflow abgebrochen. Dadurch wird die DSS-E-Mail nicht länger als wartend angezeigt. Im Dialog zum Lesen, Herunterladen und Drucken wurden mehrere Funktionen entfernt, darunter das Hinzufügen von Bildern, die Textformatierung und die Stiftfunktion. Außerdem wurde ein Kafka-Consumer für das Ereignis zur SAP-Debitorennummer implementiert.