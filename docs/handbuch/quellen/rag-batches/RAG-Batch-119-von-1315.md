# Batch 119 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Neuberechnung des Vertragskontostands und neue Darstellung der Finanzbelege**

Der Vertragskontostand (Contract Account Balance) ist eine zentrale Kennzahl, die die Rentabilität eines Servicevertrags zeigt. Er wird vor allem von den Market-Operations-Teams genutzt, um die finanzielle Situation eines Vertrags zu beurteilen. Bisher gab es keine klare Trennung zwischen Erlös- und Kostenbelegen. Die Formel unterschied nicht zwischen diesen Kategorien, und Lieferantengutschriften (SCIN, Supplier Credit Invoice/Note) wurden unter den Lieferantenrechnungen, also auf der Kostenseite, angezeigt. Dadurch war der Kontostand verzerrt. Zudem fehlten Filtermöglichkeiten in den Tabellen der Finanzbelege, und internationale Werkstattrechnungen, die nur der Information dienen, beeinflussten den Kontostand, ohne exportiert zu werden. Die Berechnung und die Darstellung wurden daher überarbeitet.

**Berechnung des Kontostands**

Der Vertragskontostand ergibt sich künftig aus der Differenz zwischen Erlösen und Kosten (Kontostand = Erlöse − Kosten). Zu den Erlösen zählen die Kundenrechnungen (Rechnungen positiv, Gutschriften negativ), die Preisreduzierungen und die Lieferantengutschriften (SCIN), also Erstattungen von Lieferanten oder Versicherern für Schadensfälle. Zu den Kosten zählen die Werkstattrechnungen (Erstattungen an Händler), die Händlerprovisionen (SCOM) und die Rechnungen zum Lieferanten-Zahlungsplan (SPMP). Stornierte Finanzbelege werden nicht berücksichtigt, es fließen nur aktive Belege in die Berechnung ein.

Zwei Beispiele: Bei Kundenrechnungen über 2.000 EUR, einer SCIN-Rechnung über 500 EUR und SPMP-Rechnungen über 800 EUR betragen die Erlöse 2.500 EUR, die Kosten 800 EUR und der Kontostand 1.700 EUR. Bei Kundenrechnungen über 1.000 EUR und einer Kundengutschrift über −200 EUR betragen die Erlöse 800 EUR.

In der Aufschlüsselung des Kontostands werden die Erlöse (+) als Summe der Netto-Kundenbeträge, der Netto-Preisreduzierungen und der Netto-Lieferantenbeträge dargestellt. Die Kosten (−) werden als Summe der Netto-Werkstattbeträge, der Netto-Händlerprovisionen und der Netto-Lieferantenbeträge dargestellt.

**Reiter und Filterleiste im Bereich Rechnungen**

Statt der bisherigen vier Reiter nach Belegart gibt es im Bereich der Finanzbelege eines Vertrags nun zwei Reiter: „Revenue" (Erlöse) und „Cost" (Kosten). Innerhalb jedes Reiters wählen Sie über ein Dropdown mit Einfachauswahl die Rechnungskategorie. Im Reiter „Revenue" stehen Customer Financial Document (Standardansicht), Price Reduction und Supplier Financial Document zur Auswahl. Im Reiter „Cost" stehen Workshop Financial Document (Standardansicht), Dealer Commissions und Supplier Payment Plan zur Auswahl.

Oberhalb der Liste befindet sich eine dauerhaft sichtbare Filterleiste, die für beide Reiter gilt. Sie enthält die Dropdown-Felder „Invoice Category" und „Invoice Status" sowie die Textfelder „oneSCM Invoice Number" und „FI System Invoice Number", in denen Sie nach exakten oder teilweisen Nummern suchen können. Mit der Suchschaltfläche (blaues Lupen-Symbol) wird der Filter ausgeführt, mit der Schaltfläche mit X-Symbol werden alle Filter zurückgesetzt. Über den Link „More filters" oben rechts (blauer Text mit Trichter-Symbol) öffnet sich ein Dialog mit weiteren Filtern: „Financial Document Start Date" und „Financial Document End Date" als Datumsauswahl, dazu die Schaltflächen „Cancel" und „Apply".

Unterhalb der Filterleiste werden Summenwerte angezeigt. „Sum of Invoices" (blauer Text) erscheint immer. „Sum of Dunning Invoices" (roter Text) erscheint nur bei Kategorien, die Mahnungen unterstützen. Rechts oberhalb der Ergebnisliste befindet sich die blaue Schaltfläche „Create Invoice" mit einem Dropdown-Pfeil für weitere Optionen zur Rechnungserstellung. Am Ende der Liste können Sie die Seitengröße wählen (Standard: 10) und mit Pfeilen und einer Seitenzahlanzeige blättern.

**Reiter „Revenue": Kategorien und Spalten**

Die Kategorie „Customer Financial Document" zeigt die Belegarten MANU, MPPI, BDCR, FDCR und CCIN. Die Tabelle enthält die Spalten Flow Type, Document Type, Document Date, FI Document Status, MPay Status (nur bei Zahlung über MPay), Net Amount, Document Period, Processing Number, FI System Transfer Date, FI System Document Number, oneSCM Document Number, Document Reference, Document Recipient (Kundenname) und Actions (Kontextmenü über drei Punkte). Korrekturbelege, die zu einem periodischen Finanzbeleg gehören, werden als eingerückte Unterzeilen mit einem Rückkehrpfeil-Symbol unter dem ursprünglichen Beleg dargestellt. Für diese Kategorie wird zusätzlich zur Standardsumme die rote Summe „Sum of Dunning Invoices" angezeigt.

Die Kategorie „Price Reduction" zeigt alle Rabattbelege für Verkaufs- und Aftersales-Kampagnen sowie Händlerrabatte (Belegarten DD, CAMP, SDAS). Die Spalten sind Flow Type, Document Type, Document Date, FI Document Status, Net Amount, Document Period, Processing Number, FI System Transfer Date, FI System Document Number, oneSCM Document Number und Document Recipient (Händlername). Es gibt keine Mahnsumme.

Die Kategorie „Supplier Financial Document" zeigt Lieferantengutschriften (SCIN). Die Spalten entsprechen denen der Kategorie „Customer Financial Document", einschließlich der Darstellung von Korrekturbelegen als Unterzeilen. Es gibt keine Mahnsumme.

Ist bei einer Erlösrechnung eine Mahnstufe erreicht, wird diese im Reiter „Revenue" unabhängig von der gewählten Kategorie angezeigt.

**Reiter „Cost": Kategorien und Spalten**

Die Kategorie „Workshop Financial Document" zeigt die Belegarten CLAI und WSIN. Die Spalten sind Workshop Document No., Document Date, FI Document Status, Repair Date, Workshop Name, Mileage, Workshop Document Type, Total Claim Amount, oneSCM Document No., FI System Transfer Date, FI System Processing No., FI System Document No. und Actions (Kontextmenü über drei Punkte). Es gibt keine Mahnsumme.

Die Kategorie „Dealer Commission" zeigt die Belegart SCOM, die Kategorie „Supplier Payment Plan" die Belegart SPMP. Beide Tabellen haben dieselben Spalten: Flow Type, Document Type, Document Date, FI Document Status, MPay Status (nur bei Zahlung über MPay), Net Amount, Document Period, Processing Number, FI System Transfer Date, FI System Document Number, oneSCM Document Number, Document Reference, Document Recipient (Kundenname) und Actions (Kontextmenü über drei Punkte).