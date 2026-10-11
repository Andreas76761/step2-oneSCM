# Batch 698 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 25 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Cost Management: Neuerungen und Verbesserungen**

**Aufschlüsselung des aktuellen Kontosaldos in den Vertragsdaten**

Neben dem Feld „Current Account Balance" im Kopfbereich der Vertragsdetailseite steht nun ein Info-Symbol (i). Es wird für alle Verträge aus dem Vertragsmanagement angezeigt, die sich in einem der Status „Active", „Cancelled", „Expired", „Suspended", „Closed" oder „Terminated" befinden. Bei Verträgen aus dem Contract Proposal wird das Symbol nicht angezeigt.

Fahren Sie mit der Maus über das Info-Symbol, erscheint ein Tooltip mit dem Titel „Price breakdown". Dieser zeigt, wie sich der aktuelle Kontosaldo zusammensetzt, und ist in zwei Bereiche gegliedert. Der Bereich „Add-ons (+)" enthält die Zeilen „Net Customer Amount" und „Net Price Reduction". Der Bereich „Costs (-)" enthält die Zeilen „Net Dealer Commission", „Net Workshop Amount" und „Net Supplier Amount".

Die Werte stammen aus den Tabellen im Reiter „Payment":

Der Net Customer Amount entspricht der Summe aller bezahlten Rechnungen aus der Tabelle „Customer Invoices". Die Net Price Reduction ergibt sich aus der Summe aller Rabatte in der Tabelle „Price Reduction". Die Net Dealer Commission ist die Summe aller bezahlten Provisionen aus der Tabelle „Dealer Commission". Der Net Workshop Amount entspricht der Summe aller Contract Claims aus der Tabelle „Workshop Invoice". Der Net Supplier Amount ist die Summe aller Lieferantenrechnungen im Status „Exported" oder höher aus der Tabelle „Supplier Invoice".

Der angezeigte Current Account Balance im Vertragskopf entspricht dem Ergebnis folgender Formel: Account Balance = Customer Invoice + Price Reduction − Workshop invoices − Commission − Supplier Invoices. Gibt es zu einer Zeile keine Rechnungen bzw. keinen Betrag, wird dort 0,00 angezeigt.

**Darstellung in den Rechnungs- und Zahlungstabellen**

In den Tabellen des Zahlungsbereichs lässt sich nun auf einen Blick erkennen, ob es sich bei einem Dokument um eine Rechnung oder eine Gutschrift handelt. Dafür gibt es eine neue Spalte mit einem kleinen Symbol anstelle von Text. In den Reitern „Customer Invoice" und „Price Reduction" kennzeichnet ein Symbol mit Plus eine Rechnung und ein Symbol mit Minus eine Gutschrift. In den Reitern „Workshop Invoice" und „Dealer Commission" ist es umgekehrt: Ein Symbol mit Minus steht für eine Rechnung, ein Symbol mit Plus für eine Gutschrift.

**Schadencodes und Import-Vorlage**

Die Import-Vorlage für Schadencodes wurde auf die aktuelle Version aktualisiert und enthält nun Übersetzungsspalten. Zudem steht für Schadencodes im Cost Management ein Ansichtsmodus zur Verfügung, in dem HQ-Admin-Benutzer alle Details eines Schadencodes einsehen können, ohne in den Bearbeitungsmodus zu wechseln. Ein Fehler bei der Auswahl von Schadencodes wurde behoben.

**Altteilsteuer (Old Part Tax) und I156-Dateien**

Mehrere Korrekturen betreffen die Altteilsteuer: Bei Werkstattrechnungsnummern fehlten führende Nullen, was behoben wurde. Gutschriften und Rechnungen wurden mehrfach erzeugt, auch dieses Verhalten wurde korrigiert. Die Logik für Altteilsteuer-Rechnungen basiert nun auf der Entscheidungsnummer aus RC10.

Im Zusammenhang mit dem I156-Import wurden außerdem folgende Probleme behoben: Daten aus den letzten beiden I156-Dateien fehlten im Zahlungsbereich bei den Werkstattrechnungen. Der Download der I156-Datei des Vorjahres schlug mit der Meldung „File not found" fehl. Der automatische Upload von I156-Dateien schlug fehl. Außerdem wurden Betragsfelder bei der Währungsumrechnung während des I156-Uploads nicht korrekt gerundet.

**Weitere Korrekturen und Anpassungen**

Der Begriff „CrossFileTransfer" wird in der Benutzersprache Deutsch nun korrekt angezeigt. Für die SAP-Kreditorennummer gilt bei MWSI nun eine Pflichtangabe. HQ-Admin-Benutzer von MBSK haben Zugriff auf die Seite „Financial Control".