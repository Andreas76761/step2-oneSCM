# Batch 1110 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation): Änderungen im Überblick**

**Produktauswahl und Produktkarten**

Wenn nach Eingabe einer Kennung die Produktkarten angezeigt werden, zeigt die Produktkarte beim Überfahren mit der Maus die enthaltenen Leistungen an. Die Anzahl der dort angezeigten Leistungen ist auf die ersten sieben begrenzt. Unter dem Eingabefeld für die Kennung erscheint beim Start eines Vertragsangebots mit einer Kennung nun der Hinweis „Enter a valid Chassis Number, Order Number or Model Code“, wobei die Begriffe in Großbuchstaben beginnen.

Bei der Erstellung des Produktinformationsdokuments wurde der Vergleich der Hauptleistungen angepasst. Die Leistungsliste enthält nun alle Leistungen der Produkte, die zum Vergleich ausgewählt wurden. Bei einem unverbindlichen Angebot für ein einzelnes Produkt erscheinen im Dokument nur die Leistungen, die zu diesem Produkt gehören.

**Unterschriftsart und Navigation**

Bei der Auswahl der Unterschriftsart wurden die Infoboxen entfernt. Die Auswahlmöglichkeiten sind nun mit „Use eSignature flow on mobile device“ und „Use DSS Signature flow via email“ beschriftet.

Auch Seiten und Navigation wurden überarbeitet, zum Beispiel in Schritt 2 („Overview & Confirmation“). Die Schaltfläche „Zurück“ wird durch ein „<“-Symbol gekennzeichnet, ist immer sekundär dargestellt und zeigt beim Überfahren mit der Maus den Tooltip „Back“. Sie erscheint ab dem zweiten Schritt in allen folgenden Schritten. Die Schaltfläche „Weiter“ wird durch ein „>“-Symbol gekennzeichnet, ist immer primär dargestellt und zeigt beim Überfahren mit der Maus den Tooltip „Next“.

In „Overview & Confirmation“ kann eine Kampagne genehmigt werden, wenn der Vertrag den Status „CREATED“ hat. Dabei wird die Schaltfläche zur besseren Bedienbarkeit während der Verarbeitung mit einem Ladezustand versehen bzw. deaktiviert.

**Händlerrabatt**

Alle Berechnungen basieren auf Nettopreisen. Ein vom Händler eingegebener Prozentsatz oder Rabattbetrag wird daher als Nettowert auf den Netto-Grundpreis angewendet. Zuvor wurden Händlerrabatte als Bruttowerte betrachtet und entsprechend abgezogen. Im Dialog zum Händlerrabatt erscheint deshalb ein zusätzlicher Hinweis: „Entered Percentage / Amount must refer to an amount excl. VAT“.

**Prüfung der Kundenbonität (CAS) und Aktivierung**

Der Ablauf in allen Vertragserstellungsprozessen wurde angepasst. Sobald ein Vertrag den Status „Bestätigt“ (Confirmed) erreicht, wird bei Kunde und Partner zunächst nur die CAS-Prüfung angefragt. Je nach Ergebnis gilt:

Ist das Ergebnis positiv, werden die Market Operations benachrichtigt (MO Checks) und der Vertrag wird auf „Rejected“ gesetzt. Ist das Ergebnis ein falsch positives Ergebnis, werden die Market Operations ebenfalls benachrichtigt, und die CAS-Prüfung wird bei Bedarf mehrfach erneut aufgerufen, bis sie negativ oder positiv ausfällt. Ist das Ergebnis negativ, wird fortgefahren und das SEPA-Mandat sowie die SAP-Debitorennummer werden angefragt. Zuvor wurden diese Anfragen direkt beim Erreichen des Status „Bestätigt“ gestellt, und die Antworten trafen im Status „Waiting for Activation“ ein.

Für die Aktivierung und die erzwungene Aktivierung wurde zudem das ChangePayerEventDto um die Vertragsnummer erweitert und die Prozesse entsprechend angepasst.

**Zahlerwechsel**

Wenn eine aktive Kampagne und/oder ein Händlerrabatt zusammen dem Vertragswert entsprechen, der Kunde also nichts zahlen muss, ist ein Zahlerwechsel für den Vertrag nicht mehr möglich. Zuvor war er in diesem Fall noch erlaubt.

**MO-Intelligence-Seite: Kundenprüfung**

Auf der MO-Intelligence-Seite wurde die Kategorie „Customer Check“ mit zusätzlichen Prüfungen ergänzt:

Bei der CAS-Prüfung wird „OK“ angezeigt, wenn die Validierung erfolgreich war. Bei einem positiven CAS-Ergebnis erscheint „NOK“ mit der Meldung „CAS Check Positive“, bei einem falsch positiven Ergebnis „NOK“ mit der Meldung „False Positive“. Bei der SAP-Debitorennummer und beim SEPA-Mandat wird jeweils „OK“ oder „NOK“ angezeigt. Beim FI-Status wird „OK“ angezeigt, wenn die Validierung erfolgreich war; ist der Kunde gesperrt oder suspendiert, erscheint „NOK“ mit der Meldung „Blocked“ bzw. „Suspended“. Bei der Unterschrift wird „OK“ angezeigt, wenn die Validierung erfolgreich war, und „NOK“, wenn das System nicht erkennt, dass der Kunde per Stift unterschrieben hat.