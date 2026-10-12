# Batch 581 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Slowakischer Markt: Anpassungen des Gewerbekundenmodells**

Für den slowakischen Markt wurde das Gewerbekundenmodell angepasst. Dies betrifft alle Gewerbekunden-Typen, also Commercial, Commercial Fleet und Commercial Governmental. Ein Unternehmen kann entweder eine Umsatzsteuer-Identifikationsnummer (VAT-ID), eine Steuernummer oder beide Angaben hinterlegen. Die Eingaben werden dabei auf die slowakischen Formate geprüft: Die Steuernummer muss aus 10 Ziffern bestehen, die VAT-ID aus dem Länderkürzel „SK“ gefolgt von 10 Ziffern.

Zwischen beiden Feldern besteht folgender Zusammenhang: Gibt ein Benutzer die VAT-ID ein, wird das Feld „Steuernummer“ automatisch vorbelegt. Der Wert ergibt sich aus der VAT-ID ohne das Länderkürzel. Aus der VAT-ID SK2021872083 wird somit die Steuernummer 2021872083. Das vorbelegte Feld bleibt weiterhin editierbar. Wird dagegen nur die Steuernummer eingegeben, wird das Feld „VAT-ID“ nicht automatisch befüllt. Die Anfrage an das Finanzsystem CoFiCo enthält im ersten Fall beide Angaben, im zweiten Fall nur die Steuernummer im Attribut „taxNumber1“.

**Neues Feld „Company Registration Number“**

Für Gewerbekunden (Commercial, Commercial Fleet und Commercial Governmental) steht außerdem das neue Feld „Company Registration Number“ (Handelsregister- bzw. Unternehmensregisternummer) zur Verfügung. Dabei handelt es sich um einen eindeutigen Code, der einem eingetragenen Unternehmen zugewiesen wird, um seine rechtliche Existenz nachzuweisen und es gegenüber Behörden, Banken und anderen Organisationen zu identifizieren. Bisher konnte dieses Datum im globalen Standard des Gewerbekundenmodells nicht erfasst werden.

Das Feld erscheint in der Vertragserstellung (Contract Generation) sowie in der Kundenverwaltung (Customer Management) im Bereich „Tax & Legal Details“. Es ist optional, darf maximal 15 Zeichen lang sein und ist pro Kunde eindeutig. Es ist daher nicht möglich, einen neuen Kunden mit einer bereits vergebenen Nummer anzulegen. Auch bei Änderungen über die Kundenverwaltung bzw. das Vorschaufenster erfolgt eine Prüfung auf Duplikate. Eingegebene und geänderte Werte werden gespeichert.

Die Sichtbarkeit des Feldes wird über einen Schalter in den Market Settings unter „General Settings“ im Bereich „Customer“ gesteuert. Ist der Schalter aktiviert, wird das Feld angezeigt, andernfalls ist es ausgeblendet. Die Einstellung steht für beide Divisionen, Van und PC, zur Verfügung und gilt wie die übrigen Einstellungen dieses Reiters jeweils nur für die zugeordnete Division.

Für den slowakischen Markt gilt eine Besonderheit: Bei Kunden vom Typ Commercial Governmental ist das Feld „Company Registration Number“ ein Pflichtfeld.

**Übermittlung an CoFiCo**

Die Anfrage (POST Request) an CoFiCo wurde um weitere Attribute erweitert: „salesOrganization“, „paymentMethod“, „taxNumber1“ bis „taxNumber5“, „directDebit“ und „partnerBankType“. Diese Felder werden, sofern nicht anders festgelegt, mit einem leeren Wert übermittelt. „taxNumber1“ enthält die Steuernummer, „taxNumber2“ die Company Registration Number. Für Märkte, die oneERP nutzen, sind aktuell keine Änderungen erforderlich. Eine Nutzung des Feldes im Zusammenhang mit SWT ist für die Zukunft noch zu klären.