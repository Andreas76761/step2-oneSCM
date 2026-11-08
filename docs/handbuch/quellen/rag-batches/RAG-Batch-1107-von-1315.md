# Batch 1107 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 23 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung und Vertragsverwaltung: Änderungen im Überblick**

**Bedienung und Oberfläche**

Bei der Vertragserstellung wurde die Oberfläche an mehreren Stellen vereinheitlicht. Die Wortreihenfolge wurde angeglichen, und zwischen einem Wort und einer folgenden Klammer steht nun ein Leerzeichen. Die Abkürzung „FRD“ wird durch „First Registration Date“ ersetzt. In der Vertragsdetailansicht heißt die Bezeichnung „Sales Designation“ jetzt „Model“. Das gilt auch für die permanenten Kopfzeilen. Wird im ersten Schritt der Vertragserstellung der Schalter „FRD unavailable“ aktiviert, soll zudem das Textfeld „License Plate“ ausgeblendet werden, da ein nie zugelassenes Fahrzeug auch kein Kennzeichen hat.

Die Seite aktualisiert sich nun automatisch, wenn der Vertragsstatus oder ein Vertragsdetail geändert wird. Die neuesten Änderungen erscheinen ohne manuelles Neuladen des Browsers. Zuvor wurde zum Beispiel die Historie nach dem Aussetzen („Suspend“) eines aktiven Vertrags erst nach einem manuellen Neuladen aktualisiert.

Die Preisanzeige und die zugehörigen Hover-Informationen (Tooltips) wurden überarbeitet. Das betrifft die Produktdetailansicht, den Produktvergleich, die Rabattanzeige, die Übersicht und Bestätigung sowie die Verlängerung (kurz- und langfristig). Für die Übersicht und die Bestätigung stellt das Backend dem Frontend die richtigen Preise bereit.

**Angebot, Kunden und Rabatte**

Beim Erstellen eines Vertragsangebots wählt man zunächst den Kundentyp (gewerblich oder privat), gibt eine Kennung ein, erhält passende Produkte, wählt und konfiguriert das Produkt und sendet das Angebot an den Kunden. Bei Privatkunden werden weiterhin Vorname, Nachname und E-Mail-Adresse erfasst. Bei gewerblichen Kunden müssen stattdessen Vorname und Nachname der Kontaktperson, der Firmenname und die E-Mail-Adresse erfasst werden. Die Funktionalität bleibt ansonsten gleich. Die E-Mail-Vorlage soll entsprechend angepasst werden. Die Änderung wurde im Frontend und im Backend umgesetzt.

Händlerrabatte lassen sich im Vertragsangebot nach der Produktauswahl und -konfiguration nur noch als Betrag vergeben. Die Prozentoption wurde aus der Oberfläche entfernt. Die Händlerprovision wird als Nettobetrag angezeigt, wie es in der Produktdefinition festgelegt ist. Der Grund: Die Auszahlung von Provisionen ist entweder eine interne Buchung ohne Umsatzsteuer oder, bei externen Händlern oder Vermittlern, ein B2B-Vorgang, ebenfalls ohne Umsatzsteuer.

Die Reihenfolge der Deckungen (Coverages) wurde angepasst. Sie lautet nun: enthalten, optional, Karosserie. Das gilt für die Produktanzeige (beim Hover) und für i155.

**Prüfungen und Aktivierung**

Die USt-IdNr. ist kein Pflichtfeld mehr. Ist das Feld nicht ausgefüllt, findet keine VIES-Prüfung statt und es wird kein Hinweis in den MO Checks gesetzt. Ist es ausgefüllt, wird die VIES-Prüfung durchgeführt, und das Ergebnis, ob nicht in Ordnung oder in Ordnung, wird als Hinweis in die MO Checks übernommen.

Ein Vertrag kann nur aktiviert werden, wenn die SAP-Debitorennummer des Händlers gültig ist. Das System prüft, ob die SAP-Dealership-Nummer in der Händlerverwaltungstabelle vorhanden ist. Das gilt bei Händlerrabatten und wenn MO einen Servicevertrag im Namen eines Händlers zuweist. Sobald der Händler eine gültige SAP-Nummer hat, markiert das System die Prüfung als in Ordnung.

**Dokumente und E-Mails**

Ein hochgeladenes, unterschriebenes Dokument wird bei der Signaturart PRINT_DOCUMENT nun auch dann abgerufen, wenn der Vertragsstatus nicht „Active“ ist. Zuvor wurde der über Hochladen/Ersetzen aus der Vertragserstellung hochgeladene Servicevertrag nicht gespeichert. Das SEPA-Dokument ist außerdem für jeden Kunden eindeutig.

Die Aktivierungs- und die Reaktivierungs-E-Mail enthalten jeweils Vertragsnummer, Fahrgestellnummer, Datum der Erstzulassung, Kennzeichen, Produkt, Vertragsbeginn und Aktivierungsdatum. Der Vertragsbeginn wird aus dem Feld „Contract Start Date“ übernommen. Bei fahrzeugbasierten Produkten entspricht er dem Datum der Erstzulassung. Bei der Aktivierungs-E-Mail wird das Aktivierungsdatum übernommen, das meist in der Zukunft liegt und vom Datum der Erstzulassung abweicht. Bei der Reaktivierungs-E-Mail wird stattdessen das Reaktivierungsdatum verwendet. Damit wurde auch der fehlerhafte Vertragsbeginn in der Reaktivierungs-E-Mail korrigiert.

**Schnittstellen und Daten**

Für das Revenue Management steht eine API bereit, die auf Basis der Vertragsnummer eine Liste aller Coverage Codes liefert. Im bestehenden Kafka-Vertragsnachricht wurden für das Reporting weitere Felder ergänzt: cylinderNumber, driveFormula, modelSeriesCode, modelType, priceModel und hybrid. Sie stammen aus den Fahrzeuginformationen (Zylinderzahl des Motors, 4matic, Baureihe, Verkaufsbezeichnung, Hybrid) und aus dem Blueprint (Preismodell).

Bei Kampagnen entfielen im Backend die Validierungen für Kostenstelle, Debitorennummer, Provisionskomponenten-ID und externe Kampagnen-ID. Diese Felder sind jeweils mit maximal 150 Zeichen optional.