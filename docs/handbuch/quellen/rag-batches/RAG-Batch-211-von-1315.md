# Batch 211 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Abgelehnte Schäden und Claims (Revenue Management)**

Wird ein Claim in VEGA abgelehnt, wurde die Werkstattrechnung bisher mit dem Betrag 0 in der Oberfläche von oneSCM angezeigt. Künftig wird ein abgelehnter Claim, der in oneSCM importiert wird, in der Oberfläche ausgeblendet.

Ist der gesamte Claim abgelehnt, wird er nicht mehr angezeigt. Das Kontingent wird dabei zurückgebucht: Im abgelehnten Claim (Schaden) hat das Kontingent das umgekehrte Vorzeichen. Betrug das Kontingent in der Entscheidung mit der vorherigen Entscheidungsnummer beispielsweise +2, so ist es in der neuen Entscheidungsnummer -2. Die Rückbuchung des Kilometerstands aus der Vertragshistorie ist noch mit Stream 2 abzustimmen und steht daher noch nicht abschließend fest. Wird nur ein einzelner Schadencode abgelehnt, werden die übrigen Schadencodes weiterhin angezeigt. Das Kontingent wird in diesem Fall genauso behandelt wie beim abgelehnten Claim.

**Anpassungen an E174 für interne Händlerrabatte**

Die Schnittstelle E174 war bisher auf die kurzfristig notwendigen Anwendungsfälle Sales Campaign und After Sales Campaigns ausgerichtet und konnte interne Händlerrabatte (Internal Dealer Discounts) für Eigenbetriebe (OwnRetail-Tochtergesellschaften) nicht abbilden. Mit der Anpassung werden Logik und Attribute für diese internen Händlerrabatte erweitert. Dafür wird das Kriterium OwnRetail Subsidiaries ergänzt, wobei in der Datei lediglich eine entsprechende Kostenstelle anzugeben ist. Da dies nur für oneERP freigeschaltet wird, entfallen für diesen Prozess separate Kostenstellen je Tochtergesellschaft, wodurch er weniger komplex wird. Die Erweiterung ist aufgrund des aktuellen Marktsetups erforderlich. Genutzt wird die Schnittstelle von Market Operations und Accounting, um die benötigten Daten automatisch an das empfangende System zu übermitteln.

Beim Export von E174 wird die Revenue Area mit der Retail-ID befüllt, die sich aus der VEGA-ID aus dem Dealership Management zuzüglich einer angehängten „0“ zusammensetzt. Das Profit Center wird nach der Division befüllt; für die Division VAN lautet es 2724-12000. Der Wert für die Division PC ist in den vorliegenden Angaben nicht vollständig enthalten. Bei den Materialnummern gelten dieselben Änderungen wie bei Sales Campaign und After Sales Campaigns.

**Hinweis zu nicht umgesetzten Inhalten**

Die Funktion, Vertragsnummer und Schadencode im Reiter „Financial Control“ mit einem Link zum Vertrag anzuzeigen, wurde abgebrochen und ist nicht Bestandteil des Releases. Zu dieser Funktion liegen keine weiteren Angaben vor.