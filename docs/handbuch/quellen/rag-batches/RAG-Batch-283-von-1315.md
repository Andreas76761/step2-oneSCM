# Batch 283 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Rückmeldungen des Finanzsystems und Bearbeitung von Rechnungen**

**Import der Rückmeldedatei von NACOS**

NACOS verarbeitet die Rechnungsanforderungen, die mit der Datei E169EXP gesendet werden, und erzeugt für jeden Datensatz (je oneSCM-Rechnungsnummer) eine Rückmeldung. Diese Rückmeldungen werden in einer Datei namens E169IMP gesammelt und in einem dafür vorgesehenen AWS-Bucket abgelegt. Ein Batch-Job liest die Datei anschließend aus, ordnet die Rückmeldungen den jeweiligen Rechnungen zu und aktualisiert den Status der Rechnungsanforderungen entsprechend der NACOS-Antwort. Jeder Datensatz enthält die Rückmeldung zu genau einer Rechnung. Ein Datensatz umfasst 85 Zeichen. Er enthält unter anderem die in NACOS erzeugte Nummer, die „FI-System Invoice Number“, das NACOS-Buchungsdatum, das oneSCM-Belegdatum, die oneSCM-Belegnummer, den Belegtyp (R für Rechnung, G für Gutschrift) sowie Netto- und Steuerbetrag. Beträge werden dabei durch 100 geteilt, aus 1257 wird also 12,57.

Zur Identifikation der Rechnungsanforderung dient die oneSCM-Rechnungsnummer. Dabei kann sich eine Zeile auf jede beliebige Anforderung aus einer E169-Outbound-Datei beziehen, nicht zwingend auf die zuletzt gesendete.

Für die FI-Nummer gibt es drei Fälle. Lautet sie 8888888888, konnte NACOS die gesendeten Daten nicht verarbeiten und hat keinen Datensatz angelegt; die Rechnung erhält in oneSCM den Status „Error“. Lautet sie 9999999999, wurde ein bereits angelegter Datensatz storniert und im System rückgängig gemacht; der Status wechselt dann von „Exported“ auf „Cancelled“. In diesen beiden Fällen mit technischer FI-Nummer wird die Nummer nicht gespeichert, nur der Status wird angepasst. In allen anderen Fällen gilt die Buchung als erfolgreich: Der Status wird auf „FI Document created“ gesetzt, die FI-System-Rechnungsnummer wird aus der NACOS-Nummer übernommen und das Rechnungsdatum wird durch das NACOS-Buchungsdatum aktualisiert.

Dadurch können Market-Operation-Benutzer die Rückmeldung des Finanzsystems zu einer bestimmten Rechnungsanforderung einsehen.

**Rechnungen im Admin-Bereich bearbeiten**

Market-Operation-Benutzer können die Details einer Rechnung im Admin-Bereich unter „Invoice“ bearbeiten. Dazu nutzen sie die Aktionsspalte der Ergebnistabelle. Die Option „Edit“ steht nur für Rechnungen im Status „Planned“, „Created“ oder „Approved“ zur Verfügung. Nach Auswahl gelangt der Benutzer in die Bearbeitungsansicht, die in Aufbau und Funktion der bereits umgesetzten Ansicht entspricht.

Die Bearbeitungsansicht zeigt folgende Felder: Rechnungsnummer, Verarbeitungsnummer, Belegtyp, Kundenrechnungstyp, Erstellungsdatum der Rechnung (Format TT.MM.JJJJ, zum Beispiel 16.05.2023), Rechnungszeitraum (Start- und Enddatum), Rechnungsstatus, tatsächliche Laufleistung, Rechnungstext, Rechnungsempfänger, Übertragungsdatum an das Finanzsystem (Format TT.MM.JJJJ), FI-System-Rechnungsnummer, Rechnungsreferenz, Währung sowie Netto-, Steuer- und Gesamtbetrag.

Bearbeitbar sind nur der Rechnungstext, die Rechnungspositionen und die tatsächliche Laufleistung. Die Laufleistung ist ein optionales numerisches Feld mit Werten zwischen 0 und 9999999. Der Rechnungstext ist ebenfalls optional, erlaubt Sonderzeichen und ist auf maximal 240 Zeichen begrenzt. Netto-, Steuer- und Gesamtbetrag sind nicht editierbar, sondern werden aus den Rechnungspositionen abgeleitet. Der Nettobetrag ergibt sich aus der Summe der Positionen: Bei zwei Positionen zu je 100 € werden 200 € angezeigt. Der Steuerbetrag wird ebenso summiert; bei zwei Positionen mit je 19 € Steuer sind es 38 €. Der Gesamtbetrag ist die Summe aus Netto- und Steuerbetrag.

In der Positionstabelle können neue Positionen angelegt sowie vorhandene Positionen bearbeitet oder gelöscht werden. Die Tabelle muss mindestens eine Position enthalten, damit die Rechnung gültig ist.

Wurde kein Feld verändert, schließt „Cancel“ die Bearbeitungsansicht direkt. Wurde mindestens ein Feld geändert, erscheint ein Hinweisfenster mit dem Titel „You have unsaved changes!“ und der Meldung, dass bei Fortfahren alle vorgenommenen Änderungen verloren gehen und gefragt wird, ob wirklich geschlossen werden soll. Mit „Yes“ werden das Fenster und die Bearbeitungsansicht geschlossen und alle Änderungen verworfen. Mit „No“ wird nur das Fenster geschlossen, die Bearbeitungsansicht bleibt geöffnet. Die Schaltfläche „Update“ ist nur aktiv, wenn alle Felder die Validierungsregeln erfüllen, die auch bei der Erstellung gelten. Sie speichert die Änderungen und leitet zur Tabelle der Kundenrechnungen weiter. Jede Änderung wird zu Prüfzwecken in der Datenbank protokolliert. Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Weitere Funktionen rund um Kundenrechnungen und Rechnungspositionen**

In der Tabelle der Kundenrechnungen stehen eine Sortierung nach Spalten sowie die Einstellung der Anzahl der Einträge pro Seite zur Verfügung. Für die Schaltfläche des Admin-Bereichs gibt es einen automatisierten Test. Bei Rechnungspositionen kann die tatsächliche Laufleistung der Rechnung bearbeitet werden. Die Funktion für die Detailansicht einer Rechnungsposition mit Rückkehrmöglichkeit ist noch offen.