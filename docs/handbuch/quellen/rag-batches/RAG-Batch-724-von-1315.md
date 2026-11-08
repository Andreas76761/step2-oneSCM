# Batch 724 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kostenmanagement: Neuerungen und Änderungen**

**Finanzkontrolltabelle für Altteilsteuer (Old Part Tax)**
Die Finanzkontrolltabelle in der Altteil-Ansicht wurde erweitert, damit sich die Richtigkeit der Werte leichter nachverfolgen lässt. Neu ist die Spalte „oneSCM Invoice Number", die als Link in die Ansicht der jeweiligen oneSCM-Rechnung führt. Die bisherige Spalte „Workshop Invoice Number" heißt nun „Workshop Invoice No". Die Spalte „Date" wurde in „oneSCM Invoice Date" umbenannt und übernimmt das Datum aus der oneSCM-Rechnung. Standardmäßig ist die Tabelle absteigend nach diesem Datum sortiert, sodass die neueste Rechnung zuerst erscheint. Die Spalte „Status" zeigt den Status der oneSCM-Rechnung, die Spalte „Contract Number" verlinkt auf den zugehörigen Vertrag. Die Spalte „Check" steht am Tabellenende.

Auch die Suche wurde angepasst. Gesucht werden kann nach der oneSCM Invoice Number (Textfeld, Zahlen zulässig, unscharfe Suche), nach dem oneSCM Invoice Date (Datumsfeld), nach der Workshop Invoice Number (Textfeld, Zahlen zulässig, unscharfe Suche) sowie nach der Workshop Id.

**Übermittlung internationaler Werkstattrechnungen an NEMESIS**
Nicht alle MPC sind in den SIVECO-Prozess eingebunden. Wo dieser Prozess nicht genutzt wird, werden Papierrechnungen bearbeitet, die bisher nicht an NEMESIS übertragen wurden, aber relevant sind. Diese Rechnungen werden nun im regulären Rechnungsereignis an NEMESIS übermittelt. Wird eine internationale Rechnung manuell direkt im Vertrag angelegt und erreicht den Status „Processed", sendet das System ein Kosten-Rechnungsereignis (Cost Master Data Event bzw. DealerInvoiceDto auf NEMESIS) mit den Details der internationalen Rechnung.

**Nicht umgesetzte Vorhaben**
Zwei weitere Vorhaben wurden abgebrochen und sind daher nicht Teil der Funktionalität: die Verwaltung von Managed Contracts samt Kostenabwicklung sowie die Anzeige importierter Lieferantenrechnungen im Vertrag.