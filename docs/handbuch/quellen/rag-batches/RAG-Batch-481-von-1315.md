# Batch 481 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**E-Mail-Vorlage für die Neuberechnung nach Genehmigung einer Kulanzzeit-Kampagne (Documents & Communications)**

Hinweis: Diese Funktion hat derzeit den Status „On Hold“ und ist daher noch nicht freigegeben.

Im Bereich Vorlagenverwaltung können Benutzer eine E-Mail-Benachrichtigungsvorlage mit vertragsspezifischem Inhalt anlegen. Diese Vorlage wird verwendet, wenn eine Kulanzzeit-Kampagne (Grace Period Campaign) vom MPC-Benutzer genehmigt wird, nachdem der Vertrag bereits den Status „Active“ erreicht hat, und sich dadurch die Preise ändern. In diesem Fall wird eine E-Mail mit dem in der Vorlage definierten Inhalt an den Vertragsinhaber gesendet. Die E-Mail wird ausschließlich versendet, wenn der Vertragsstatus „Active“ ist.

Voraussetzung für die Erstellung ist, dass der Benutzer angemeldet ist und im Admin-Bereich unter „Template Management“ den Reiter „Notification“ geöffnet hat. Die Vorlagen für Kopf- und Fußzeile müssen bereits definiert sein. Anschließend wählt der Benutzer „Create Template“ und dann „E-mail“.

Auf der Seite zur Vorlagenerstellung sind folgende Pflichtfelder auszufüllen: der Vorlagenname (Textfeld, maximal 25 Zeichen, zum Beispiel „Template-Active Status“), der Markt (Dropdown, im MVP mit „GERMANY“ vorbelegt, künftig abhängig vom Land), das Feld „Used For“ (Dropdown, hier ist „RECALCULATION“ auszuwählen, da die Vorlage Änderungen nach dem Status „Active“ betrifft) sowie „Valid From“ (Datum, ab dem die Vorlage für den Geschäftsprozess gilt). Sind Pflichtfelder nicht ausgefüllt, wird der Benutzer auf das jeweilige Feld hingewiesen. „Save as Draft“ ist dann weiterhin möglich, „Publish“ jedoch nicht.

Optional können weitere Felder gepflegt werden: die Division (im MVP „PC“, „Van“ folgt nach dem MVP), die Marke (im MVP „Mercedes-Benz“, „Smart“ folgt nach dem MVP) und die Sprache (abhängig von der Marktrolle des Benutzers, im MVP Englisch).

Anschließend erfasst der Benutzer den eigentlichen E-Mail-Inhalt, der gemäß dem MB Style Guide für E-Mails gestaltet wird. Der Betreff lautet „Service Contract Recalculation (Contract Number: %Contract Number)“. Die Anrede erfolgt mit Vor- und Nachname des Empfängers. Der Text bedankt sich dafür, dass sich der Kunde für einen Mercedes-Benz Service-Vertrag entschieden hat, und teilt mit, dass der Vertragspreis erfolgreich neu berechnet wurde.

Danach folgen die neu berechneten Vertragsdetails: Zahlungsbedingung (Payment Term), Gesamtpreis inkl. MwSt., monatlicher Preis inkl. MwSt., Kampagnenname und der aktualisierte Zahlungsplan. Der monatliche Preis wird nur angezeigt, wenn ein Wert vorhanden ist; andernfalls entfällt das Feld in der E-Mail. Der Zahlungsplan basiert auf den Angaben aus dem Revenue Management und wird tabellarisch dargestellt, mit Rate, Zeitraum, Produkt, Zahlungsart sowie Netto-, Steuer- und Bruttobetrag je Rate und einer Summenzeile. Im Beispiel umfasst der Plan zwölf monatliche Raten des Produkts „Excellent“ zu je 100,00 netto, 19,00 Steuer und 119,00 brutto, insgesamt 1200,00 netto, 228,00 Steuer und 1428,00 brutto.

Weiter wird mitgeteilt, dass die Zahlungen ab dem Vertragsbeginn per Lastschrift vom Konto des Kunden eingezogen werden. Genannt werden der Zahlungsempfänger Mercedes-Benz Group AG, die Gläubiger-ID DE02ZZZ00000151350 und die SEPA-Mandatsreferenz. Bei Fragen wird auf das Customer Support Team verwiesen. Die E-Mail schließt mit der Grußformel „Yours sincerely, Service Contract Team, Mercedes-Benz Cars Germany“, den marktspezifischen Kontaktdaten (Telefonnummer und E-Mail-Adresse) sowie dem Hinweis, die Umwelt vor dem Ausdrucken zu bedenken. Die Platzhalter im Text, etwa für Vorname, Vertragsnummer und Preise, werden beim Versand automatisch mit den Vertragsdaten befüllt.

Für die Vorlage stehen drei Funktionen zur Verfügung. Mit „Send Test E-mail“ wird eine E-Mail im selben Format wie die spätere Kundenmail (Betreff, Kopfzeile, Fußzeile und Inhalt) an den angemeldeten Benutzer gesendet, sodass dieser prüfen kann, wie die Nachricht beim Kunden aussieht. Mit „Save as Draft“ wird ein Entwurf gespeichert, der noch nicht für Geschäftsprozesse gilt. Mit „Publish“ wird die endgültige Version veröffentlicht; sie wird entsprechend den Angaben unter „Used For“ und dem Datum „Valid From“ angewendet.

Inhalt, Sprache und Markenauftritt der E-Mail müssen jeweils zum Markt passen.