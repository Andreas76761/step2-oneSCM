# Batch 187 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 33 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Änderungen und Validierungen**

Im Bereich Revenue Management wurden die Ausgabedateien (Outbound Files) an die angebundenen Finanzsysteme oneERP, SWT und Cofico umfassend geprüft und erweitert. Für oneERP werden die Schnittstellen E174 und E169 validiert. Bei E174 stehen die Werte für Profit Center und Auftragsnummer im Fokus. Als Voraussetzung dient ein aktivierter Vertrag mit angewendeter Kampagne und internem Händlerrabatt. Bei E169 betrifft die Validierung die QSD5-Nummer, doppelte oneSCM-Rechnungsnummern, doppelte Verarbeitungsnummern sowie die Debitorennummer. Hierfür wird ein aktivierter Vertrag mit externem Händlerrabatt benötigt.

Auch für SWT und Cofico werden die Outbound-Dateien validiert, einschließlich der Fälle, in denen ein Validierungsfehler auftritt. Für diese Prüfungen sollten 20 aktive Verträge mit abrechenbaren Rechnungen vorliegen.

Beim Export an Cofico und SWT wird die Rechnungsart für Händlerrechnungen nun anhand des Händlertyps unterschieden. Dies gilt jeweils für interne und externe Händler, auch im Fall eines manuell vergebenen Händlerrabatts. Voraussetzung ist ein aktiver Vertrag, der von einem internen bzw. externen Händler angelegt wurde. Ebenso wurde der Export der Zahlungsarten Net Banking und UPI an Cofico und SWT geprüft. Dafür wird ein Vertrag mit einer Kundenrechnung im Status „Accepted“ benötigt.

Die Zahlungsreferenz eines Kunden wird bei MPPI- und MANU-Vorgängen an das FI-System exportiert, und zwar an Cofico, SWT und oneERP. Voraussetzung ist, dass der Kunde mit aktualisierter Zahlungsreferenz existiert. Diese Funktion ist bereits im Einsatz.

Zusätzlich wurde das Batch-Job-Framework für den Betrieb in mehreren Märkten angepasst. Das Framework übernimmt automatisch den Markt des angemeldeten Benutzers, der den Job startet, und gibt ihn an den jeweiligen Job weiter. Die Revenue-Management-Jobs nutzen diesen Parameter nun dort, wo er benötigt wird. Abfragen und andere marktspezifische Funktionen werden dynamisch auf Basis des Marktes aufgebaut.

Darüber hinaus wurden weitere Punkte abgeschlossen. Dazu gehören die Prüfung der Rechnungsart bei manuell erstellten internationalen Werkstattrechnungen und die Vereinheitlichung der Benutzeroberfläche für Rechnungen. Behoben wurden außerdem folgende Probleme:

Der Job MBLD_OneERPInvE169EXP funktionierte nicht. Im F-Satz für SWT und CoFiCo wurde die Header-Anzahl fehlerhaft angegeben. Für über Commercial Fleet angelegte Verträge wurden Zahlungsintervall und Rechnungen nicht erzeugt. In E174 wurden Rechnungen nicht aufgenommen.

Die geplante Aktivierung des indischen Marktes in der Preprod-Umgebung, um dort Funktionen wie MPay und SWT testen zu können, wurde nicht umgesetzt und abgebrochen.