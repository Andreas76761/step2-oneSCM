# Batch 1108 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Vertragserstellung (Contract Generation)

Bei der Auswahl der Unterschriftsart stehen drei Optionen zur Verfügung: zwei digitale und eine Druckvariante. Wer nach dem Starten des Vertragsangebots, der Auswahl und Konfiguration des Produkts sowie der Erfassung und Bestätigung der Kundendaten die Option „Drucken“ wählt, erhält ein Fenster zum Ausdrucken des Servicevertrags. Das Dokument enthält dabei kein Wasserzeichen. Nach dem Druck erscheint eine Erfolgsseite mit der Meldung „Contract Number XXXXXXXX / XXXXXX has been successfully printed“. Ergänzend wird darauf hingewiesen, dass der Vertrag mit der Unterschrift des Kunden hochgeladen werden kann und nach der Aktivierung durch Mercedes Benz per E-Mail versendet wird.

Steuerklassifizierung und Preisdarstellung

Bei der Erfassung der Kundendaten im Vertragsangebot gilt für Bestandskunden, dass die Steuerklassifizierung nur lesbar ist und nicht geändert werden kann. Wird ein neuer Kunde erfasst, bestimmt die Steuerklassifizierung die Darstellung der Beträge. Bei „Standard“ enthalten Zahlung und Zahlungsplan Netto-, Mehrwertsteuer- und Bruttobeträge. Bei „Exempt“ enthalten sie nur den Nettopreis, die Mehrwertsteuer beträgt 0, und der Bruttopreis zeigt denselben Wert wie der Nettopreis.

Wenn ein Vertrag in den Status „Waiting for Activation“ wechselt, erhält der Endkunde eine E-Mail-Bestätigung mit den zu zahlenden Beträgen. Diese Beträge werden mit zwei Nachkommastellen dargestellt.

Zahlungsplan und Preisinformationen

Bei der Anfrage an das Revenue Management zur Erstellung des Zahlungsplans werden nicht mehr nur der Nettobetrag, sondern zusätzlich Mehrwertsteuer und Bruttobetrag übermittelt. Bei einer Einmalzahlung werden Netto-, Mehrwertsteuer- und Bruttowert für den gesamten Vertragszeitraum gesendet. Bei monatlicher, vierteljährlicher, halbjährlicher oder jährlicher Zahlung werden der umgelegte Netto-, der umgelegte Mehrwertsteuer- und der umgelegte Bruttobetrag pro Intervall übermittelt. Betroffen sind die Zahlungspläne in den Produktdetails und in der Vertragsübersicht. Außerdem wird der Mehrwertsteuersatz im Preisinformationsdokument ausgewiesen.

Ein Fehler wurde behoben, bei dem für Produkte mit ausschließlich monatlichem Zahlungsintervall während der Vertragserstellung keine Preise angezeigt wurden, obwohl sie bei Produkten mit monatlichem und einmaligem Intervall erschienen.

Händlerrabatt und Rabattzuordnung

Bisher war es möglich, einen Händlerrabatt einzugeben, obwohl das Produkt Händlerrabatte nicht zulässt. Die auf Produktebene erlaubten Rabatte werden nun berücksichtigt.

Mitarbeitende von MO/MPC können einen Servicevertrag erstellen und einem bestimmten Händler zuordnen. Dabei kann ein Rabatt für den Endkunden vergeben werden. Die Rabattinformationen werden zusammen mit den Händlerdaten an das Revenue Management übermittelt, sobald der Vertrag aktiviert wird, damit die Rechnung für den jeweiligen Händler erstellt wird. Das gilt auch, wenn MO/MPC während der Widerrufsfrist den zugeordneten Händler wechselt. Wurde bereits eine Rechnung für einen Händler ausgestellt und der Vertrag anschließend einem anderen Händler zugeordnet, soll die vorherige Rechnung gutgeschrieben bzw. storniert und eine neue für den neu zugeordneten Händler erzeugt werden.

Kennzeichen

Beim Start eines Vertragsangebots war das Feld „Kennzeichen“ bislang optional. Sind Fahrgestellnummer und FRD vorhanden, ist das Kennzeichen nun ein Pflichtfeld, und bei fehlender Eingabe wird eine Fehlermeldung angezeigt. Das Kennzeichen wird nicht in die Anfrage an die Produkte aufgenommen.

E-Mail-Benachrichtigung bei Vertragsaktivierung

Bei der Aktivierung eines Vertrags wird nur noch eine einzige E-Mail an alle Beteiligten gesendet, statt wie bisher getrennter E-Mails an Kunde und Händler. Erstellt der Händler den Vertrag, steht der Kunde im Feld „An“ und der Händler in „CC“. Erstellt MO den Vertrag im Namen des Händlers, steht der Kunde in „An“, während der Händler und der erstellende MO in „CC“ stehen.

Entfernte Funktionen

In den Umgebungen prePROD und PROD sind einige Funktionen in der Benutzeroberfläche nicht mehr verfügbar. Dazu gehört der Schalter zum Hinzufügen eines abweichenden Zahlers beim Servicevertrag. Er soll wieder bereitgestellt werden, sobald ein Workaround für die Handhabung und Unterzeichnung des SEPA-Dokuments in Papierform vorliegt. Ebenfalls entfernt wurden die Optionen „Vertrag übertragen“ und „Zahler ändern“ in der Vertragsverwaltung, da diese Funktionen überarbeitet werden. In den Umgebungen DEV und INT können die Inhalte zu Testzwecken bestehen bleiben.