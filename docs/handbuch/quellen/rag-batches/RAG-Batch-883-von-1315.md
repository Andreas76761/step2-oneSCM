# Batch 883 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungsart Banküberweisung: Konfiguration nach Kundentyp und Markt**

Die Verfügbarkeit der Zahlungsart Banküberweisung war bisher fest vorgegeben: Sie wurde ausschließlich für gewerbliche Kundentypen angeboten. Diese Festlegung ist nun aufgehoben. Ob eine Zahlungsart für einen Kunden zur Verfügung steht, wird künftig über eine vierstufige Konfigurationskette gesteuert. Sie besteht aus der Einstellung im Bereich Utility, der Zahlungsmatrix in den Markteinstellungen, den Einschränkungen auf Produktebene und dem Kundentyp. Bestehende Märkte arbeiten nach der Einführung unverändert weiter: Der neue Schalter in Utility ist standardmäßig ausgeschaltet, und die bisherigen Einstellungen werden so übernommen, dass die Banküberweisung nur für gewerbliche Kunden gilt.

**Utility: Neuer Reiter „Payment"**

Der Bereich Utility erhält eine Unterteilung in Reiter. Der bisherige einzelne Schalter befindet sich nun im Reiter „General", zusätzlich gibt es den neuen Reiter „Payment". Dieser folgt der bekannten Aufteilung in Passenger Cars (PC) und Vans (VAN), abhängig von den Berechtigungen des Marktes. Er enthält den Schalter „Allow Bank Transfer for Private Customers". Der Schalter ist standardmäßig ausgeschaltet und kann für jede Sparte unabhängig eingestellt werden. Damit legt der Administrator fest, ob ein Markt die Banküberweisung für Privatkunden überhaupt anbieten darf. Änderungen werden wie bei anderen Utility-Einstellungen protokolliert; angezeigt werden der Benutzer und der Zeitpunkt der Änderung. Die Konfiguration der digitalen Zahlung (MPay, Supported Payments) bleibt weiterhin in den Mpay Configurations und ist wie bisher vom Payment-Reiter aus verlinkt.

**Markteinstellungen: Die Zahlungsmatrix**

Der Reiter „Payment" unter Admin Section → General Settings wurde gemäß dem freigegebenen UI-Design neu gestaltet. Die Aufteilung nach PC und Vans bleibt erhalten, die Matrix wird also je Sparte konfiguriert.

Im linken Bereich „Payment Type" gibt es zwei aufklappbare Gruppen: Pre Activation und Post Activation. Jede Gruppe enthält die dafür verfügbaren Zahlungsarten, zum Beispiel Digital Payment, Direct Debit und Bank Transfer. Unter jeder Zahlungsart stehen Kontrollkästchen für die Kundentypen All, Private, Commercial und Governmental. Wird „All" ausgewählt, werden alle einzelnen Typen ausgewählt und gesperrt; wird „All" abgewählt, sind sie wieder einzeln bearbeitbar.

Der rechte Bereich „Preview" zeigt live eine Zusammenfassung der entstehenden Konfiguration, gegliedert nach Zahlungstyp und Zahlungsart, mit den jeweils aktivierten Kundentypen. Ist noch nichts ausgewählt, erscheint der Hinweis „No options were selected – Select the customer types from each payment type listed in the section in the left." In der Fußzeile stehen die Aktionen zum Zurücksetzen (ungespeicherte Änderungen verwerfen) und zum Bestätigen (Speichern).

**Zusammenspiel mit dem Utility-Schalter**

Ist der Schalter „Allow Bank Transfer for Private Customers" für die Sparte ausgeschaltet, wird das Kontrollkästchen „Private" unter Bank Transfer (sowohl Pre als auch Post Activation) gar nicht angezeigt. In diesem Fall wählt „All" unter Bank Transfer alle Kundentypen außer Private aus. Ist der Schalter eingeschaltet, wird das Kästchen angezeigt und kann ausgewählt werden; damit wird die Banküberweisung für Privatkunden in diesem Markt und dieser Sparte aktiviert.

Wird der Schalter ausgeschaltet, nachdem „Private" in einem Markt bereits ausgewählt wurde, wird die Auswahl automatisch deaktiviert und ausgeblendet. Bereits angelegte Verträge mit Banküberweisung bleiben unverändert; die Änderung gilt nur für neu angelegte Verträge.

**Einschränkung auf Produktebene**

Die für einen Kunden wirksamen Zahlungsarten ergeben sich aus dem Utility-Schalter, der Zahlungsmatrix des Marktes (Zahlungstyp des Produkts und Kundentyp) und der Produkteinschränkung. In der Produktkonfiguration kann optional je Zahlungsart festgelegt werden, für welche Kundentypen das Produkt diese Zahlungsart unterstützt. Standardmäßig gibt es keine Einschränkung: Das Produkt unterstützt alle Zahlungsarten seiner Zahlungsartenliste für alle Kundentypen. So kann ein Produkt beispielsweise die Banküberweisung für gewerbliche Kunden beibehalten und für Privatkunden ausschließen, selbst wenn die Marktmatrix Privatkunden erlaubt. Die Produkteinschränkung kann das, was Utility und Markteinstellungen erlauben, nur einengen, niemals erweitern.

**Vertragserstellung**

Der Schritt „Payment Information" bietet genau die ermittelte Auswahl an Zahlungsarten an; für Privatkunden kann dies nun auch die Banküberweisung umfassen. Das Gleiche gilt für Kunden vom Typ PRIVATE_GOVERNMENTAL. Die bisher fest hinterlegte Konstante für erlaubte Kundentypen der Banküberweisung und ihre Verwendungen entfallen, und die Vertragsvalidierung prüft gegen die ermittelte Konfiguration. Die Ermittlung erfolgt in allen Einstiegspunkten identisch: in den fünf Standard-Erstellungsabläufen, in der Massenerstellung, bei der Verlängerung (LTP/STE) und bei Änderungen der Zahlungsart in der Kundenverwaltung. Die Konfiguration wird zum Zeitpunkt der Vertragserstellung ermittelt und mit dem Vertrag gespeichert.

**Prüfung der Banküberweisung je nach Finanzsystem**

In Märkten mit dem Finanzsystem One ERP bleibt die Prüfung des Kontenvermerks (Account Note) bestehen und wird erweitert. Sie gilt nun für jeden Vertrag mit der Zahlungsart Banküberweisung, unabhängig vom Kundentyp; bisher galt sie nur für gewerbliche Kunden. Einschränkungen erfolgen über die Produktkonfiguration. Für Privatkunden ohne Kontenvermerk gilt dieselbe Regel wie für gewerbliche Kunden mit fehlendem Vermerk (Kontenvermerk leer → in Ordnung). Ob für Privatkunden ein abweichender Prüfpfad erforderlich ist, ist noch zu klären.

In COFICO-Märkten existiert kein Kontenvermerk, daher entfällt die Prüfung des Kontenvermerks bei der Banküberweisung vollständig. Die MO-Prüfung der Banküberweisung gilt als nicht anwendbar (NOT_APPLICABLE) und wird automatisch gewährt: Solange die Banküberweisung ausgewählt und durch die Konfigurationskette erlaubt ist, wird sie ohne weitere Verifizierung gewährt. Kundenaktualisierungen über Kafka-Ereignisse führen in COFICO-Märkten weder zu einer erneuten Bewertung noch zu einer Sperre von Banküberweisungsverträgen aufgrund von Kontenvermerken. Zudem wird das Feld „Account Note" (unter „Receivables from FI System") in COFICO-Märkten ausgeblendet. Das betrifft die Kundenseiten für Privat- und Geschäftskunden, den Vertragsreiter „Kunde" sowie „Overview & Confirmation". Die Fehlermeldung „Blocked Account Note" in der Zahlungsfußzeile wird unterdrückt. In One-ERP-Märkten wird das Feld wie bisher angezeigt.

**Verhalten beim Ausschalten**

Das Ausschalten des Utility-Schalters oder das Abwählen in den Markteinstellungen wirkt sich nur auf die Neuanlage von Verträgen aus: Die Zahlungsart verschwindet sofort aus der angebotenen Liste. Bestehende Verträge behalten in jedem Status ihre gewählte Zahlungsart, auch im Status „Created" (noch nicht aktiviert), und können weiter aktiviert werden. Die Konfiguration wird bei der Erstellung geprüft, nicht bei der Aktivierung. Es gibt keine rückwirkende Datenänderung und keinen erzwungenen Wechsel der Zahlungsart bei laufenden Angeboten.

**Beispiel Schweiz**

Im Schweizer Markt (COFICO) kann ein Vertrag für einen Privatkunden mit Banküberweisung angelegt werden, wenn der Utility-Schalter eingeschaltet und in der Matrix Bank Transfer × Private aktiviert ist. Die Banküberweisung wird dann ohne Prüfung des Kontenvermerks gewährt. In allen anderen Märkten mit ausgeschaltetem Utility-Schalter (Standard) wird Privatkunden die Banküberweisung weiterhin nicht angeboten.