# Batch 212 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Technisches Feedback der SWT-Integration (Revenue Management)**

Mit dieser Funktion erhält oneSCM von der Schnittstelle zu SWT ein technisches Feedback zu den Rechnungsdaten, die zuvor an das FI-System übermittelt wurden. Auf dieser Grundlage lässt sich beurteilen, ob die gesendeten Daten vom FI-System grundsätzlich verarbeitet werden können. Das erhöht die Transparenz und Genauigkeit der Daten in oneSCM und macht den Prozess robuster, sodass sich Verzögerungen im Fehlerfall minimieren lassen.

Das technische Feedback wird als CSV-Datei vom FI-System in einem S3-Ablageort bereitgestellt. Der Ordnerpfad lautet ENV/MARKET_CODE/SWT/Incoming/INTERFACE. Jede Zeile der Datei enthält die Verarbeitungsnummer (Position 1 bis 16) sowie ab Position 16 die Fehlermeldung. Die Verarbeitungsnummer wird von oneSCM vergeben und dient als identifizierendes Merkmal dafür, welche Rechnungen betroffen sind. Bei Sammelrechnungen können dadurch mehrere oneSCM-Rechnungen gleichzeitig betroffen sein. Folgende Fehlermeldungen sind im technischen Feedback möglich: Customer Not Exist, Account is blocked for Posting, HSN code is incorrect, Tax code is incorrect und Cost center reference is unknown.

Erhält oneSCM eine solche Fehlermeldung, ordnet das System sie anhand der Verarbeitungsnummer der betreffenden Rechnung zu und trägt die Meldung in der Spalte „Reason“ dieser Rechnung ein. Zudem wird der Status der Rechnung auf „Error“ gesetzt. Die betroffenen Rechnungen sind im Bereich „Admin“ unter „Invoices“ einsehbar.

Sobald die Ursache des Fehlers behoben ist, öffnet der Benutzer den Admin-Bereich, wählt „Invoices“ und sucht die fehlerhafte Rechnung heraus. Über die Spalte „Actions“ wählt er die Option „Confirm Fixes“, um die Behebung zu bestätigen. Anschließend kann er den Status der Rechnung von „Error“ auf „Accepted“ ändern (die Werte stehen in einer Auswahlliste zur Verfügung), einen Grund eintragen und mit „Confirm“ abschließen. Dabei werden die Verarbeitungsnummer und das Transferdatum zum FI-System von der Rechnung entfernt. Die Historie dieser Bestätigung, also die Benutzer-ID der Person, die die Behebung bestätigt hat, sowie der angegebene Grund, wird im Modification Log der Rechnung festgehalten.

Wird der Export-Batchjob (SWTInvExp) das nächste Mal ausgelöst, erzeugt das System für die Rechnung eine neue Verarbeitungsnummer und das zugehörige Transferdatum zum FI-System. Diese Angaben werden anschließend erneut an das FI-System gesendet.

Zu beachten ist, dass das FI-System üblicherweise zwei weitere Fehler aus zwei zusätzlichen Prüfungen liefern würde: eine Dublettenprüfung auf Basis des CDS-Zählers, der für jeden Dateikopf „F“ erstellt wird, und eine Plausibilitätsprüfung der Einträge in der Datei. Diese beiden Rückmeldungen werden bewusst nicht berücksichtigt, da solche Prüfungen in oneSCM selbst durchgeführt werden sollen, um entsprechende Fehler im FI-System von vornherein zu vermeiden.

**CoFiCo-Integration für die ausgehende Rechnungsstellung**

Hinweis: Dieser Punkt hat den Status „Cancelled“ und wurde nicht umgesetzt. Er ist daher nicht als verfügbare Funktion zu beschreiben. Geplant war, die CoFiCo-Integration für den Rechnungsprozess zu beginnen, mit derselben Dateistruktur wie bei SWT und einer dateibasierten Anbindung an CoFiCo über CFT/Axway. Vorgesehen waren unter anderem eine eigene Infrastruktur für CoFiCo-Märkte, die Dateistruktur samt Feldmapping, die CFT-Konnektivität sowie separate Batchjobs je Markt. Die Funktion hätte keine aktive Nutzung durch eine bestimmte Benutzergruppe erfordert, sondern wäre Teil der regulären automatischen Rechnungsstellung für oneSCM-Mandanten gewesen.