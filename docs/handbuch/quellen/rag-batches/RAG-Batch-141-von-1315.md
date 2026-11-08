# Batch 141 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

**Statistik-Aktion für Export-Dateien im Cross File Transfer Monitoring**

Die Monitoring-Seite des Cross File Transfer zeigt bislang die Übertragungshistorie aller Schnittstellendateien, die durch oneSCM laufen. Für Dateien der Schnittstelle I156 (VEGA Claims) lässt sich über das Aktionsmenü einer Zeile bereits ein Statistik-Bereich öffnen. Dieser zeigt, wie viele Einträge einer Datei verarbeitet, übersprungen oder fehlerhaft waren. Diese Statistik-Aktion soll künftig für alle Exportdateien zur Verfügung stehen, also für alle Dateien, die in oneSCM entstehen und an ein externes Finanzsystem gesendet werden, etwa SWT, CoFiCo, oneERP oder künftige Zielsysteme. Operations- und Finance-Teams erhalten so einheitlich Einblick in das Verarbeitungsergebnis jeder ausgehenden Dateiübertragung. Die Funktion richtet sich an Admin-Nutzer und MO.

Die Spalte „Total Number of Items“ wird auf alle Export-Schnittstellen ausgeweitet (Export E169, E167, E174, SWT-Export und CoFiCo-Export). Bei Einträgen mit dem Status „Completed“ wird die Anzahl der exportierten Rechnungen angezeigt, gefolgt von der Anzahl der übersprungenen Rechnungen in Klammern, zum Beispiel „1000 (450 skipped)“. Bei Einträgen mit dem Status „Skipped“ oder „Failed“ wird nur die Anzahl der exportierten Rechnungen angezeigt. Kann die Datei nicht gelesen werden, lautet der Wert „N/A“.

In der Spalte „Actions“ erscheinen für diese Export-Schnittstellen drei Punkte („…“). Ein Klick darauf öffnet zwei Optionen: „Details“, dessen Funktionalität unverändert bleibt, und „Statistics“. Wählt man „Statistics“, wird man auf eine neue Seite mit den Details der jeweiligen Datei weitergeleitet. Der Seitentitel lautet „File“ gefolgt vom Dateinamen. Als Filterkriterien stehen Processing Number, oneSCM-Rechnungsnummer, Vertragsnummer und ein Status-Dropdown mit den Werten „Exported“ und „Skipped“ zur Verfügung, außerdem die Schaltflächen „Search“ und „Reset“. Die Tabelle enthält die Spalten Processing Number, oneSCM-Rechnungsnummer, Vertragsnummer, Status und Reason. Der Grund wird aus Datadog übernommen, wo er bereits protokolliert wird. Jede Spalte lässt sich auf- oder absteigend sortieren. Die Werte in „Contract No.“ und „oneSCM Invoice No.“ sind Links, die zur Vertrags- bzw. Rechnungsseite führen.

Auch die Navigation im Admin-Bereich ändert sich. Im Menü „Admin Section“ steht der Eintrag „Cross File Transfer“ zur Verfügung, während „Cross File Transfer - Upload“ und „Cross File Transfer - Monitoring“ nicht mehr einzeln erscheinen. Die Seite „Cross File Transfer“ bietet zwei Tabs: „Cross File Transfer“ und „Upload“. Der Tab „Upload“ zeigt denselben Inhalt wie die bisherige Upload-Seite. Der Tab „Cross File Transfer“ enthält den Inhalt der bisherigen Monitoring-Seite, ergänzt um die neue Spalte „Total Number of Items“ und die Option „Statistics“, die jeweils nur bei den genannten Export-Schnittstellen verfügbar sind.

**Beibehaltung der Seitenzahl in der Paginierung**

Im Bereich Revenue and Cost Management wird ein einheitlicher Mechanismus eingeführt, der den Paginierungsstatus speichert. Bisher springt die Liste beim Zurückkehren aus einer Detailansicht, etwa einer Rechnung, auf Seite 1 zurück, auch wenn man zuvor zum Beispiel auf Seite 4 war. Nutzer mussten die gewünschte Seite erneut manuell ansteuern, was zusätzliche Klicks und einen langsameren Arbeitsablauf bedeutete. Künftig merkt sich das System die zuletzt besuchte Seite und stellt sie beim Zurückkehren wieder her, etwa über die Zurück-Schaltfläche. Der Status bleibt während der Sitzung erhalten oder bis der Nutzer den jeweiligen Bereich verlässt. Die Funktion richtet sich an MO, HQ und MPC.

Sie gilt im Bereich Payment für Customer Invoices, Price Reduction, Dealer Commission und Workshop Invoice, im Bereich Finance Management für Invoices, Finance Control, Nemesis und International Workshop, im Admin-Bereich für Batch Jobs und CFT Uploads sowie für alle paginierten Seiten der Damage-Code-Seiten.

**CoFiCo-Export: Produktname statt Produktlinie**

Der Export an CoFiCo wurde angepasst. Anstelle der Produktlinie wird nun der Produktname übertragen. Da der Produktname bis zu 50 Zeichen umfassen kann, in der Exportdatei aber nur 40 Zeichen zur Verfügung stehen, wird er auf 40 Zeichen gekürzt. Ist der Produktname kürzer als 40 Zeichen, wird der restliche Platz mit Leerzeichen aufgefüllt. Die zugrunde liegenden Regeln sind in den Outbound Mapping Rules für CoFiCo dokumentiert.

**Rechnungsstornierung nach vorzeitiger Beendigung innerhalb der Kulanzfrist**

Für die Systeme CAMP, SDAS sowie DD und SCOM wurde die Stornierung von Rechnungen nach einer vorzeitigen Vertragsbeendigung innerhalb der Kulanzfrist geprüft. Die entsprechenden Aufgaben befinden sich im Status „Reviewed“. Ein zugehöriger Fehlerhinweis, wonach DD, SCOM und SDAS nach einer vorzeitigen Beendigung innerhalb der Kulanzfrist nicht storniert werden, wurde abgebrochen.