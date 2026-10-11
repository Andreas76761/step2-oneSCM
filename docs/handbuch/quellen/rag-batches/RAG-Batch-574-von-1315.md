# Batch 574 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 18 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Neuerungen und Korrekturen**

**Vollständig subventionierte Verträge**
Für Verträge mit einem Betrag von 0 (zum Beispiel aufgrund von Rabatten oder Kampagnen) entfallen auf Kundenebene künftig mehrere Schritte der üblichen Vertragserstellung. Dazu gehören die Erfassung der Zahlungsinformationen, die Übermittlung des Kunden an das FI-System zur Neuanlage und die SEPA-Erstellung. Eine vollständig subventionierte Vertragskonstellation kann für alle Kundentypen auftreten. Diese Funktion befindet sich derzeit noch in Entwicklung.

Wird ein solcher Vertrag für einen neuen Kunden angelegt, werden nur die Kundendaten gespeichert. Im Assistenten „Payment Information“ erscheint anstelle der Zahlungsdetails nur ein Hinweis, dass der Vertrag vollständig subventioniert ist und daher keine Zahlungsinformationen erforderlich sind. Im Assistenten „Overview & Confirmation“ werden ausschließlich die Kundeninformationen angezeigt, die Zahlungsinformationen entfallen.

Besteht der Kunde bereits und hat einen nicht subventionierten Vertrag, während der neue Vertrag vollständig subventioniert ist, zeigt der Assistent „Payment Information“ die „Receivables from FI System“ an. Darunter erscheint derselbe Hinweis. Im Assistenten „Overview & Confirmation“ werden unter den Zahlungsinformationen nur die „Receivables from FI System“ dargestellt. In beiden Fällen wird nach der Vertragserstellung kein SEPA-Mandat angelegt, und es wird keine Anlageanfrage an das FI-System gesendet. Synchronisationen und Aktualisierungen sind möglich, sofern der Kunde im Finanzsystem gefunden wird.

Wird dagegen für einen Kunden, der bisher nur vollständig subventionierte Verträge hat, ein nicht subventionierter Vertrag angelegt, läuft der Prozess wie gewohnt ab: Zahlungsinformationen und Unterschrift sind erforderlich, SEPA-Mandate werden bei Bedarf erstellt, und die Synchronisation mit dem FI-System erfolgt.

In der Kundenverwaltung ändert sich nichts für Kunden, die bereits vor einem subventionierten Vertrag existierten. Bei Kunden mit ausschließlich subventionierten Verträgen sind in der Detailansicht alle zahlungsbezogenen Felder vorhanden, aber leer und deaktiviert. Beim Bearbeiten ist die Änderung möglich, und verpflichtende zahlungsbezogene Felder werden ignoriert. Zahlungsdetails können nicht hinzugefügt oder geändert werden, da keine Zahlungsart hinterlegt ist. Ob das Feld „SAP Debtor“ editierbar und optional sein soll, ist noch zu klären; vorgeschlagen ist dies.

**Kontoinhaber bei Geschäftskunden**
Beim Anlegen eines Geschäftskunden wird das Feld „Account Holder“ automatisch mit dem Firmennamen vorbelegt. Das Feld bleibt im Assistenten „Payment Information“ der Vertragserstellung sowie in der Kundenverwaltung editierbar. Wird der Firmenname geändert, aktualisiert sich der Kontoinhaber, wie es bereits bei Privatkunden der Fall ist. Dieser Punkt befindet sich im Status „QG-BU“.

**Zahlungsarten bei Geschäftskunden**
Für Geschäftskunden, bei denen der Kontovermerk (Account Memo) den Wert „K“ hat, wird die Zahlungsart Lastschrift nicht mehr als Auswahlmöglichkeit angezeigt.

**Namensfelder und Hinweise**
Im Dialog zum Anlegen eines Privatkunden erscheint nun für Vor- und Nachname der Hinweis „Maximum 35 characters allowed“, ähnlich wie bei Geschäftskunden. Außerdem wurden die Grenzwerte der Namensfelder für Privat- und Geschäftskunden überprüft. Zusätzlich wurde korrigiert, dass die Firmennamen-Validierung fälschlicherweise auch auf den Namen von Privatkunden angewendet wurde.

**Kundenhistorie**
In der Kundenhistorie gibt es eine neue Spalte, die die Zahlungsart abbildet.

**Benachrichtigungen**
Bei der Massenanlage führte der Sprung aus einer Benachrichtigung auf eine falsche Seite; dies wurde behoben. Zudem wurde korrigiert, dass lange Kundennamen in Benachrichtigungen den vorgesehenen Platz überschritten.

**Weitere Korrekturen**
Für den Markt Slowakei wurde behoben, dass in der Vertragserstellung doppelte Steuernummern zugelassen wurden. Die Vorlagen für Kopf- und Fußzeilen werden nun korrekt gefiltert. Die Händlersuche nach der Stadt „Köln“ liefert keinen Fehler mehr. Ebenfalls behoben wurde ein Problem, bei dem bei der Vertragserstellung mit bestimmten Benutzern ein Händler fälschlich als nicht im MO-Check registriert galt. Im Hintergrund werden zudem Kafka-Ereignisse zu Lieferanten verarbeitet, die anzeigen, ob ein Lieferant für ein Produkt verwendet wird. Die Struktur der SWT-POST-Daten wurde geprüft.