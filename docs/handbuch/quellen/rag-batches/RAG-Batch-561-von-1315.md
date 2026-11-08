# Batch 561 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mehrere Bankverbindungen für Kunden in oneERP**

Mit dieser Erweiterung wird die Grundlage dafür geschaffen, dass einem Kunden in oneERP künftig mehrere IBANs zugeordnet werden können. Dafür wird das Konzept des Partner Bank Type eingeführt. Bislang war die Verwaltung der Bankdaten eines Kunden in oneERP eingeschränkt: Das SAP-System verwendet standardmäßig immer die erste Bankverbindung, weshalb die Angabe des Partner Bank Type bei der Rechnungserstellung entscheidend ist. Kunden mit dem Kontohinweis K konnten Lastschrift bisher nicht als Zahlungsart nutzen. Dies ist nun möglich. Eine Auswahl des Partner Bank Type in der Benutzeroberfläche ist erst in einer späteren Ausbaustufe vorgesehen, sobald mehrere IBANs tatsächlich unterstützt werden. Aktuell wird weiterhin nur eine IBAN unterstützt.

Im Vertrag steht ein neues Feld „Partner Bank Type“ zur Verfügung. Zusätzliche Bankverbindungszeilen werden mit dem oneSCM-spezifischen Bank Type angelegt, und dieser Wert wird an oneERP übergeben. Dafür wurde der Export an oneERP so angepasst, dass die zusätzlichen Bankdaten mitgesendet werden. Die Partner Bank Type ID ist nur für SEPA-Lastschrift relevant und wird bei anderen Zahlungsarten wie Banküberweisung oder MPay nicht angezeigt. Sie wird im Vertrag gespeichert, auf der Zahlungsseite des Vertrags stets in der aktuellen Version angezeigt, an Revenue übermittelt und in der Historie dokumentiert. Änderungen sind auch in der Kundenhistorie (Customer Management) sowie in der Vertragshistorie nachvollziehbar. Die ID ist in der Oberfläche nicht editierbar und wird ausschließlich im Backend aktualisiert.

Ändert sich eine IBAN, wird die bisherige Partner Bank Type ID nicht wiederverwendet. Stattdessen wird eine neue, fortlaufende ID vergeben (zum Beispiel OSC2 nach OSC1), während die alte ID zu Prüfzwecken erhalten bleibt. Bei der Berechnung der korrekten ID wird die Anzahl der Bankverbindungen des Kunden berücksichtigt, auch im Hinblick auf künftige Erweiterungen. Wird eine IBAN geändert und das bisherige SEPA-Mandat wurde nicht von oneSCM erstellt, wird ein weiteres SEPA-Mandat mit der oneSCM-ID erzeugt. Das vorherige Mandat wird nicht automatisch storniert.

**Lastschrift bei Kunden mit Kontohinweis K**

Wird ein Kunde mit Kontohinweis K gefunden und wählt Lastschrift, ist diese als Zahlungsart auswählbar. Der Kunde gibt seine IBAN ein. Dabei sind zwei Fälle zu unterscheiden.

Wird der Kunde in oneERP anhand der IBAN nicht gefunden, muss ein SEPA-Mandat angelegt werden. Beim Erstellen des Vertrags werden die zugehörigen Dokumente erzeugt, darunter ein SEPA-Mandat für die angegebene IBAN. Der Signaturprozess wird gestartet, und der Kunde unterschreibt das Mandat zusammen mit den übrigen Vertragsdokumenten. Der Bank Type (OSC1, OSC2 usw.) wird vergeben und gemeinsam mit den Vertragsdaten per POST-Anfrage an oneERP gesendet. Die Partner Bank Type ID wird im Vertrag auf dem Reiter „Zahlung“ und in der Historie angezeigt und an Revenue weitergegeben.

Wird der Kunde anhand der IBAN gefunden und existiert in oneERP bereits ein SEPA-Mandat, muss kein neues Mandat erstellt werden. Die Dokumente werden erzeugt, der Signaturprozess gestartet, und der Bank Type wird aus oneERP übernommen (z. B. 0001). Auch hier wird die ID im Vertrag gespeichert, auf dem Reiter „Zahlung“ und in der Historie angezeigt und an Revenue übermittelt. Wird ein Kunde über die IBAN gefunden, es existiert aber kein SEPA-Mandat, wird die Anfrage mit dem Partner Bank Type aus oneSCM erzeugt.

Kunden, die per Banküberweisung zahlen, behalten ihren bisherigen Partner Bank Type. Für Kunden mit Kontohinweis K, die Banküberweisung oder eine andere Nicht-SEPA-Zahlungsart wählen, bleibt das bisherige Zahlungsverhalten unverändert, und es wird kein SEPA-spezifischer Ablauf ausgelöst.

**Offene Punkte**

Einige Punkte sind noch zu klären: die Festlegung der oneSCM-Bank-ID, die Frage, ob bei allen von oneSCM erstellten SEPA-Mandaten die Partner Bank Type ID in oneERP von 001 auf die oneSCM-ID umgestellt wird (dies muss mit oneERP abgestimmt werden, da es Fehler in anderen Systemen verursachen könnte), sowie uneinheitliche Feldbezeichnungen und ID-Längen in Anfragen und Antworten.

**Erweiterung der Rechtsformen für Geschäftskunden**

Zusätzlich wurde in den Markteinstellungen die Erweiterung der Rechtsformen für Geschäftskunden für die MBD-Produktivumgebung geprüft. Die Änderung ist im Einsatz. Weitere Details liegen nicht vor.