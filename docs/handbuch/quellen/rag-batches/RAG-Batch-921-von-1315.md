# Batch 921 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungsart „Überweisung“ (Bank Transfer) bei der Vertragserstellung**

Für Gewerbekunden, Flottenkunden und staatliche Gewerbekunden steht im Bereich „Zahlung“ künftig neben dem Lastschriftverfahren (Direct Debit) die zusätzliche Zahlungsart „Überweisung“ (Bank Transfer) zur Verfügung. Kundinnen und Kunden können so die Zahlungsart wählen, die am besten zu ihren Anforderungen passt. Voraussetzung ist, dass der Kundentyp Commercial, Fleet oder Governmental Commercial ist. Die Verkäuferin oder der Verkäufer startet die Vertragserstellung wie gewohnt mit der Kundenkennung und den Pflichtdaten, konfiguriert die verfügbaren Produkte und gelangt anschließend zu den Kundendaten und den Zahlungsinformationen. Das System prüft dabei auf doppelte Kunden. Die Gestaltung orientiert sich an der Mercedes-Benz Workbench.

**Überweisung bei Account Note = K**

Wird „Überweisung“ gewählt und hat der Kunde die Account Note „K“, wird der Servicevertrag angelegt und die Übersicht mit Bestätigung geöffnet. Dort werden die Währung und die Zahlungsart „Überweisung“ angezeigt. Die Felder Bankname, IBAN, BIC, FI-System, Bank-ID, Lastschriftcode und SEPA-Mandatsstatus werden ausgeblendet. Im Bereich der Forderungen aus dem FI-System werden SAP-Debitorennummer, FI-System-Partnerstatus und Account Note angezeigt. Die Bearbeitungsfunktion für den Zahlungsbereich steht weiterhin zur Verfügung. Sowohl bei der Dokumentvorschau als auch beim Fortfahren zur Unterschrift wird das Servicevertragsdokument ohne SEPA-Dokument erzeugt. Ist der Vertrag unterschrieben und lautet das Ergebnis der CAS-Prüfung „negativ“, wird der Vertragsstatus auf „Bestätigt“ gesetzt. Anschließend wird der Vertrag aktiviert, die i155 erzeugt und die Information an Revenue gesendet. Bei der Aktivierung wird Revenue die Zahlungsart „Überweisung“ übermittelt.

**Überweisung bei Account Note ungleich K**

Ist die Account Note nicht „K“, wird der Servicevertrag ebenfalls angelegt und die Übersicht mit Bestätigung geöffnet. Die Vorschau des Angebots ist jedoch deaktiviert, die Zahlungsinformationen zeigen „Not Yet Available“ (noch nicht verfügbar), und die weiteren Unterschriftsschritte sind gesperrt. In den MO-Prüfungen erscheint unter „Customer Check“ der Eintrag „Bank Transfer: Not OK“. Außerdem wird automatisch eine E-Mail-Benachrichtigung an Accounting und Market versendet; die genauen Empfänger sind noch zu definieren. Zusätzlich wird eine Synchronisation mit oneERP (CustomerImportFiSystemJob) angestoßen.

**Account Note bleibt nach der Synchronisation ungleich K**

Bleibt die Account Note auch nach der Synchronisation ungleich „K“, zeigen die MO-Prüfungen weiterhin „Bank Transfer – Not OK“. Die Frage, wie das MO über eine Statusänderung informiert wird, ist noch offen. Das MO nimmt in einem Offline-Prozess Kontakt mit der Verkäuferin oder dem Verkäufer auf, um das Problem zu klären. Diese können den Vertrag stornieren oder anpassen. Bei einer Anpassung wird der Vertrag geöffnet, in der Übersicht mit Bestätigung werden die Zahlungsinformationen bearbeitet, auf Lastschrift umgestellt und die IBAN erfasst. Danach werden die Angebotsvorschau und die Anzeige der Zahlungsinformationen wieder aktiviert, und der Eintrag „Bank Transfer“ wird aus den MO-Prüfungen entfernt oder als „Nicht zutreffend“ markiert. Der Vertrag geht dann mit SEPA-Dokument zur Unterschrift. Bei Unterschrift und negativer CAS-Prüfung wird der Status auf „Bestätigt“ gesetzt, der Vertrag aktiviert, die i155 erzeugt und die Information an Revenue gesendet.

**Account Note wechselt nach der Synchronisation auf K**

Wechselt die Account Note nach der Synchronisation mit oneERP auf „K“, wird die MO-Prüfung auf „Bank Transfer – OK“ aktualisiert. Anschließend läuft der Prozess wie bei Account Note = K ab: Die Übersicht zeigt die Zahlungsdetails ohne SEPA-bezogene Felder, das Servicevertragsdokument wird ohne SEPA-Dokument erzeugt, und nach erfolgreicher CAS-Prüfung wird der Vertrag bestätigt, aktiviert, die i155 erzeugt und die Information an Revenue gesendet.