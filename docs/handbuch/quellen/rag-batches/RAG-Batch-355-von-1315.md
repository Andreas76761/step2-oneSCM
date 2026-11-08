# Batch 355 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Documents & Communications**

**Neue E-Mail-Vorlage für die vorzeitige Abrechnung (Early Settlement)**

Bisher wurde der Kunde nicht informiert, wenn ein aktiver Vertrag vorzeitig beendet wurde. Die vorzeitige Beendigung erfolgt, indem im Contract Management auf dem Reiter „Payment" das Zahlungsintervall auf „One Time" umgestellt wird. Künftig erhält der Kunde in diesem Fall automatisch eine E-Mail. Die Benachrichtigung wird unabhängig davon versendet, ob das bisherige Intervall monatlich, vierteljährlich, halbjährlich oder jährlich war.

Die E-Mail trägt den Betreff „Early Settlement (Reference Number: [Referenznummer])". Im Text wird der Kunde darüber informiert, dass er die vorzeitige Abrechnung seines Servicevertrags beantragt hat und der verbleibende Betrag über die gewählte Zahlungsart fällig wird. Die E-Mail enthält außerdem Angaben zur Zahlungsart, zur SEPA-Mandatsreferenz, zum Creditor Code und zur Gültigkeit der Kreditkarte sowie die Angaben zum Unternehmen Mercedes-Benz Group AG. Am Ende steht ein Hinweis, sich bei Fragen an das Customer-Support-Team zu wenden. Die Anrede richtet sich nach dem Kundentyp: Privatkunden werden mit Vor- und Nachname angesprochen. Bei Geschäftskunden werden Vor- und Nachname der Kontaktperson sowie der Name des vertretenen Unternehmens verwendet.

Der Inhalt hängt zudem von der Zahlungsart des Vertrags ab. Bei einer anderen Zahlungsart als Digital Payments enthält die E-Mail den allgemeinen Text. Bei Digital Payments enthält sie zusätzlich den Link zum Customer Account Center (CAC) mit einem Hinweistext darunter. Der Kunde wird darin aufgefordert, über diesen Link die Zahlung abzuschließen und sich dazu im Customer Account Center anzumelden. Der CAC-Link wird von einem anderen Entwicklungsstrom bereitgestellt. Die Funktionen, die diesen Link betreffen, lassen sich daher erst testen, wenn diese Arbeiten abgeschlossen sind.

**Verwaltung der Vorlage in den Market Settings**

MPC- und HQ-Administratoren finden die neue Vorlage unter Market Settings > Emails. Im Dropdown „Use Case" steht „Early Settlement" als Filterkriterium zur Verfügung. Wird es ausgewählt, werden alle Vorlagen mit diesem Anwendungsfall angezeigt. Ebenso kann „Early Settlement" beim Erstellen einer E-Mail über „Create Template > Create Email" als Use Case gewählt werden.

Die vom System bereitgestellte Vorlage kann weder bearbeitet noch gelöscht werden. Im Aktionsmenü stehen nur „View" und „Clone" zur Verfügung. Beim Anzeigen entsprechen Betreff und Text den oben beschriebenen Inhalten.

Beim Erstellen oder Bearbeiten einer Early-Settlement-Vorlage entspricht die Seite im Aufbau den übrigen E-Mail-Vorlagen. Der Bereich „E-mail Setup" enthält folgende Felder:
- E-mail Name: Pflichtfeld, maximal 50 Zeichen.
- Market: Pflicht-Dropdown, vorbelegt mit Deutschland.
- Use Case: Pflicht-Mehrfachauswahl mit allen vorhandenen Use Cases.
- Customer Type: Pflicht-Mehrfachauswahl mit „Private" und „Commercial".
- Valid From: Pflicht-Datumsfeld, das festlegt, ab wann die Vorlage für den Geschäftsprozess gilt.

Der Bereich „E-mail Details" enthält zwei Felder:
- Division: Einfachauswahl mit „Passenger Car" und „VAN".
- Language: Einfachauswahl mit den für den Markt verfügbaren Sprachen.

Der Bereich „E-mail Design" enthält diese Pflichtfelder:
- E-mail Subject: Textfeld.
- Header: Dropdown mit allen verfügbaren Headern.
- Footer: Dropdown mit allen verfügbaren Footern.

Sind Pflichtfelder nicht ausgefüllt, wird der Benutzer auf das jeweilige Feld hingewiesen. „Save as Draft" bleibt dann aktiv, „Publish" ist nicht verfügbar.

**Anzeige im Contract Management**

Nach dem Versand erscheint die E-Mail im Contract Management auf dem Reiter „Communication" im Bereich „Emails". Als Dokumentname wird „Early Settlement" angezeigt, in der Spalte „Date" das Versanddatum, zusammen mit dem passenden Status. Als Aktion steht „Re-send" zur Verfügung.

**Weitere Korrekturen im Bereich Documents & Communications**

Im Rahmen dieser Release wurden zudem Fehler im Dokumentenmanagement behoben oder bearbeitet. Dazu zählen:
- Ein PDF-Dokument wurde von oneSCM erst nach einer Nachbearbeitung mit Adobe OCR akzeptiert.
- Beim Hochladen von Dokumenten gab es Probleme, etwa die Anzeige einer falschen Version und ein unklares Verhalten.
- Das Aktivierungsdokument enthielt zwei zusätzliche leere Seiten.
- Für den Markt Slowakei wurden die Links vor und nach der Aktivierung bei der Kundensprache Slowakisch nicht geöffnet.
- Die Dokumentenvorschau löste einen Fehler 400 aus.
- Der Job zur Prüfung des Signaturstatus von Dokumenten konnte nicht gestoppt und erneut gestartet werden.

Außerdem wird der DSS-Ablauf an die Kundensprache angepasst. Dieser Punkt befindet sich in Prüfung. Das Thema „Coverage descriptions on documents" (Leistungsbeschreibungen auf Dokumenten) ist angelegt, aber noch nicht bearbeitet.