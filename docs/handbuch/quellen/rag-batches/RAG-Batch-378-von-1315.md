# Batch 378 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Documents & Communications: Neuerungen und Änderungen**

**Vier-Augen-Freigabe für Sonderfälle über das interne Benachrichtigungscenter**

Für Sonderfälle wird eine Vier-Augen-Freigabe eingeführt, die vollständig über das interne Benachrichtigungscenter abläuft. Das Prinzip: Es gibt immer einen Antragsteller (Requester), einen ersten Nutzer, der Aktionen durchführt, und einen zweiten Nutzer, der diese freigibt. Werden Änderungen vorgenommen, muss eine zweite Person sie bestätigen. Diese zweite Person darf weder mit dem ersten Nutzer noch mit dem Antragsteller identisch sein. Nach Abschluss des Durchlaufs wird der Antragsteller über die Entscheidung informiert. Die Funktion richtet sich an MPC-Nutzer (MPC 1 und MPC 2) sowie an Händler.

Der Ablauf gestaltet sich wie folgt: Ein Händler stellt über den internen Benachrichtigungsfluss eine Anfrage für einen Sonderfall an den MPC. Der MPC-Nutzer (MPC 1) sieht am Glockensymbol eine neue Benachrichtigung. Im Benachrichtigungsbereich erscheint die Anfrage mit einem blauen Punkt, der anzeigt, dass die Benachrichtigung für den jeweiligen Nutzer noch nicht gelesen wurde. Sobald der Nutzer sie öffnet, verschwindet der blaue Punkt. Der Text der Benachrichtigung nennt die Referenznummer oder die Gruppen-ID der Anfrage sowie ihren Status, in diesem Fall „Offen“. Über den Link in der Benachrichtigung gelangt der MPC-Nutzer direkt zur Sonderfall-Seite, auf der blaue Punkte zeigen, wo Aufmerksamkeit erforderlich ist. Welche Inhalte ein Nutzer dort sehen darf, richtet sich nach seinen Rollen und Berechtigungen.

Lehnt der MPC-Nutzer die Anfrage ab, sieht der Händler bzw. Antragsteller am Glockensymbol eine Benachrichtigung mit dem Status „Abgelehnt“ und gelangt über sie zur Sonderfall-Seite. Nimmt der MPC-Nutzer dagegen Änderungen vor, etwa am Preis, benötigt der Vorgang eine zweite Freigabe. Dann erhalten alle übrigen MPC-Nutzer, also alle außer demjenigen, der die Änderung vorgenommen hat, eine Benachrichtigung mit dem Status „In Prüfung“. Akzeptiert der zweite MPC-Nutzer die Änderungen, wird der Händler bzw. Antragsteller mit dem Status „Genehmigt“ benachrichtigt. Nimmt der zweite MPC-Nutzer selbst weitere Änderungen vor, wird der Freigabeprozess erneut durchlaufen, und der Status bleibt „In Prüfung“.

Das System erzeugt Benachrichtigungen, wenn Freigabeanfragen eingereicht werden und bei jeder Änderung durch den MPC. Sie werden den jeweils zuständigen Prüfern (MPC und Händler) angezeigt und enthalten die Referenznummer oder Gruppen-ID sowie den Status. Am Ende des Durchlaufs erhält der Antragsteller eine Benachrichtigung. Ein Sonderfall kann nicht über denselben Endpunkt auf den Status „Geprüft“ gesetzt werden, mit dem die Benachrichtigung abgeschlossen wird; hierfür steht ein neuer Endpunkt zur Verfügung. Der zweite Prüfer darf nicht mit dem ersten identisch sein. Liegen zwei Prüfungen vor, kann die Benachrichtigung nur noch mit dem Status „Akzeptiert“ oder „Abgelehnt“ abgeschlossen werden.

**Sortierung der Vorlagen nach Sprache in der Dokumentenverwaltung**

In der Dokumentenverwaltung kann die Vorlagentabelle künftig zusätzlich nach der Sprache der Vorlagen sortiert werden. Dafür wurde die Auswahl der Sortierkriterien um einen entsprechenden Wert erweitert.

**Neue Druckvariablen in der Vorlagenverwaltung**

In der Vorlagenverwaltung werden neue Druckvariablen benötigt. Dazu zählen die technischen Optionen, die durch Kommas getrennt ausgegeben werden und insgesamt etwa fünf bis sechs Optionen umfassen, insbesondere für Vans. Hinzu kommen Reifentyp und Reifengröße, wobei die Größe mit Zollzeichen dargestellt wird, beispielsweise 16". Außerdem werden Fahrgestelltyp sowie Zylinder bzw. Motor als Variablen bereitgestellt. Die bisherige Einrichtung der technischen Optionen entfällt dadurch. Der Fahrgestelltyp wird künftig als Aufbautyp bezeichnet.

**Digitale Signatur: Gültigkeit von mehr als 95 Tagen (in Planung)**

Der Signaturdienst DSS ist auf eine Gültigkeit von 95 Tagen begrenzt. Ist die Angebotsgültigkeit länger als 95 Tage, muss der Vertrag die DSS-Signatur erneut anstoßen, damit der Kunde unterschreiben kann. Ist das Angebot abgelaufen oder der Vertrag storniert, soll der DSS-Umschlag bzw. die Workstep-ID abgebrochen werden, sowohl für DSS per E-Mail als auch für die On-Premise-Variante. Diese Anpassung befindet sich noch im Entwicklungs-Backlog.

**Übertragung der Vorlagen von PROD nach PrePROD**

Die Vorlagen der Produktivumgebung sollen in die PrePROD-Umgebung übertragen werden. Ein Teil dieser Aufgaben ist bereits abgeschlossen, ein weiterer Teil noch offen.

**Korrektur der Umlaute im Preisinformationsdokument**

Die Darstellung der Umlaute im Preisinformationsdokument wurde korrigiert.