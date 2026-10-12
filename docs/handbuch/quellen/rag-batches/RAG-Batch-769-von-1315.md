# Batch 769 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 38 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung (Contract Management): Änderungen und Verbesserungen**

In der Vertragsverwaltung wurden zahlreiche Verbesserungen und Fehlerbehebungen umgesetzt, die vor allem die Verlängerung von Verträgen, die Anzeige von Preisen, die Dokumentenverwaltung und die Statusmeldungen an Nachbarsysteme betreffen.

**Langzeitverlängerung (Long Term Prolongation)**
Die Preisberechnung bei der Langzeitverlängerung wurde korrigiert, sodass nun der richtige Preis angezeigt wird. Eine Langzeitverlängerung nach Laufleistung wird jetzt auch im Reiter „Historie“ dargestellt. Bei Leasingverträgen liefert der Verlängerungsentwurf nun einen Standardwert für die Gesamtlaufleistung. Zudem wurde ein Fehler behoben, durch den das Feld „configurationIsTheSame“ beim Erstellen eines Verlängerungsangebots für Leasingverträge immer den Wert „true“ hatte. Wird bei einer MBLD-Verlängerung eine fehlerhafte Konfiguration von Laufzeit oder Laufleistung gewählt, wird nun eine Fehlermeldung ausgelöst. Außerdem wird die Verlängerungskonfiguration zurückgesetzt, wenn ein anderes Startdatum ausgewählt wird. In der Vorproduktionsumgebung (Preprod) steht die Aktionsschaltfläche für die Verlängerung bei aktiven Verträgen nun zur Verfügung. Die Voraussetzung, dass für eine Langzeitverlängerung ein aktiver Vertrag vorliegen muss, sowie die Erweiterung der Verlängerungslogik für MBLD-Verträge werden derzeit geprüft bzw. getestet.

**Preisanzeige und Vertragsdetailseite**
Auf der Vertragsdetailseite wurde die Darstellung der detaillierten Preisinformationen geprüft, insbesondere die Anzeige des Preisclusters. Ein Fehler, durch den der Preis für technische Optionen nicht angezeigt wurde, wurde behoben. Für den Reiter „Vertrag“ auf der Vertragsdetailseite wurde zudem das Kriterium für den Vertragsablauf verifiziert.

**Übersicht und Benutzeroberfläche**
In der Vertragsübersichtstabelle gibt es eine neue Spalte sowie einen Filter für das Aktivierungsdatum. Die Beschriftungen der MO-Bestätigungsoptionen (MO Acknowledgement) wurden im Bereich und in den zugehörigen Dialogfenstern vereinheitlicht. Ebenso wurden die Feldbeschriftungen bei der Funktion „Per E-Mail senden“ korrigiert.

**Dokumente**
Nach der Aktivierung eines Vertrags können Dokumente hochgeladen werden; diese Funktion wird derzeit verifiziert. Hochgeladene Dokumente lassen sich nach der Aktivierung nur eingeschränkt löschen: Servicevertrag, Langzeitverlängerung, SEPA-Mandat, Allgemeine Geschäftsbedingungen und Zahlungsplan können nicht gelöscht, sondern nur ersetzt werden. Fahrzeugschein, Steuerbefreiungsnachweis, Handelsregisterauszug und sonstige Dokumente können hingegen gelöscht werden.

**Statusänderungsdatum in der I155-Schnittstellendatei**
Bei neu aktivierten Verträgen entspricht das Statusänderungsdatum in der I155-Datei (Satzart 05, Stellen 140 bis 147) nun dem Vertragsbeginn. Dies gilt ausschließlich für die erste Aktivierung; bei allen weiteren Statuswechseln wird weiterhin das tatsächliche Änderungsdatum verwendet. Die entsprechende Verifikation für neu aktivierte Verträge sowie für gekündigte und ausgesetzte Verträge ist in Arbeit bzw. geprüft. Außerdem wurde ein Fehler des I155-Jobs in der Entwicklungsumgebung behoben.

**Weitere Anpassungen**
Die Anpassung des Wirksamkeitsdatums (Effective Date) im Retail-Bereich wird für Leasing über den EDGE-Service, Leasing über die oneSCM-Oberfläche und Retail über die oneSCM-Oberfläche geprüft. In den Markteinstellungen wurde ein Problem behoben, bei dem die Versionierung des Impressums für die deutsche Sprache nicht gefunden wurde.

**Weitere Korrekturen**
Behoben wurden außerdem Probleme bei der Anlage von SAP-Debitorennummern für Kunden, bei der Erfassung von Erstzulassungsdatum und Kfz-Kennzeichen sowie bei Rechnungen zu gekündigten Verträgen, die fälschlich im Status „geplant“ standen bzw. nicht den Status „Dokument erstellt“ erhielten.