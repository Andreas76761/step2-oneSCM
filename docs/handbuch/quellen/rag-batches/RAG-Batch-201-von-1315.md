# Batch 201 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

**FI-Konfiguration für CoFiCo/SWT-Märkte**

Die bisher fest im System hinterlegte Konfiguration für das FI-System kann von HQ-Admin-Benutzern nun selbst verwaltet werden. Die Seite finden Sie unter Admin → Market Settings → External System Settings → FI-Configuration Feature. Sie steht ausschließlich für SWT-/CoFiCo-Märkte zur Verfügung; für Deutschland wird sie nicht angeboten. Die hier gepflegten Werte werden beim Export von Kundendaten (über die API) und beim Export von Rechnungen an das FI-System automatisch herangezogen.

Die Seite gliedert sich in die Bereiche „General Details“, „Invoice Settings“, „Customer Settings“ und „History“. In den General Details legen Sie Werte fest, die sowohl für Kunden als auch für Rechnungen gelten. Dazu gehören das oneSCM-Mandat (editierbares Freitextfeld, z. B. 20000DE), der Sprachcode (Auswahl eines Codes aus einer Liste, z. B. En) und der Währungscode (Auswahl eines Codes aus einer Liste, z. B. INR).

Die Invoice Settings enthalten die Werte, die beim Export der Rechnungsdatei an das FI-System verwendet werden. Aufgrund der Divisionsaufteilung gibt es hier für jede Rolle (PC oder VAN) einen eigenen Tab, in dem jeweils nur ein Feld „Sales Organization“ angezeigt wird. Dieses nimmt einen alphanumerischen Wert mit maximal vier Zeichen auf, z. B. INPC für Passenger Cars oder INLC für Vans. Das frühere Feld „Sales Organization Setup“ entfällt.

Die Customer Settings enthalten die Werte für den Export der Kundendaten. Auch hier gibt es je Tab (PC oder VAN) nur ein Feld „Legal Entity“ (SAP Company Code), das bis zu vier Ziffern aufnimmt, z. B. 1920. Außerdem pflegen Sie die Account Group (Textfeld mit maximal vier Ziffern, z. B. 3799) und Land1, das einem Ländercode entspricht. Für Land1 wählen Sie einen Wert aus der Liste aller Ländercodes, z. B. DE oder ES.

Mit der Schaltfläche „Save“ speichern Sie Ihre Änderungen. Mit „Restore“ werden neu eingegebene Werte durch die bisher gespeicherten Werte ersetzt. Im Bereich „Modification History“ sehen Sie, wann welche Änderungen auf Attributebene an der Seite vorgenommen wurden.

**Umbenennung der Einträge im Menü „Create Invoice“**

Damit die Bezeichnungen für Market-Operation-Benutzer verständlicher sind, wurden die Einträge im Auswahlmenü „Create Invoice“ geändert. Sie finden es im Vertragsmanagement unter dem Reiter „Payment“ im Bereich „Workshop Invoice“. „Manual Invoice“ heißt jetzt „Workshop Invoice“ (deutsch: Werkstattrechnung), „International Workshop Invoice“ heißt „SIVECO Invoice“ (deutsch: SIVECO Werkstattrechnung) und „Reimbursement Invoice“ heißt „Customer Reimbursement“ (deutsch: Rückerstattung Kunde).

**Internationale Werkstattrechnungen im Vertragsmanagement**

Market-Operation-Benutzer können internationale Werkstattrechnungen für einen Kunden manuell erstellen. Dabei handelt es sich um Rechnungen, die von einem anderen Markt ausgestellt wurden als dem, zu dem der Kunde gehört. Die manuelle Erfassung ist nötig, weil keine automatischen Buchungen durch externe Systeme erfolgen.

Eine manuell erstellte Rechnung erhält zunächst den Status „Created“. Sie muss anschließend über das bestehende Benachrichtigungssystem von einem anderen MO-Benutzer genehmigt werden und wechselt dann in den Status „Processed“. Rechnungen dieses Typs werden nicht aus oneSCM exportiert und dienen ausschließlich der Dokumentation. Wird die Rechnung im Reiter „Payment“ des Vertrags erstellt, erhält sie nach der Genehmigung den Status „Processed“. Wird sie im Admin-Bereich erstellt, erhält sie den Status „Accepted“. Die Art der internationalen Werkstattrechnung richtet sich nach dem Ursprung der Erstellung (Vertrag oder Admin) und wird nicht mehr anhand der Partnernummer oder der GSSN-Affiliate-Zuordnung bestimmt.

**Weitere Anpassungen**

Für den indischen Markt wurde die Bearbeitung des Steuerfaktors in der Steuerverwaltung bei den Steuersätzen überarbeitet. Zudem wurden Fehler behoben: Die Feedback-Datei von VEGA im Zusammenhang mit ONEERP wird nun gefunden, und das Kafka-Event für Langzeitverlängerungen zeigt nicht mehr fälschlich MONTHLY statt ONE_TIME an. Auch der neue Kilometerstand eines Fahrzeugs wird nach der Verarbeitung einer Werkstattrechnung in der Kilometerstandshistorie angezeigt.