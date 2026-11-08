# Batch 135 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mastercard Transaction Link ID (TLID) in MPay**

oneSCM unterstützt jetzt die Speicherung und Verwendung der Mastercard Transaction Link ID (TLID) im Zahlungsablauf über MPay. Die Funktion gilt ausschließlich für Mastercard und deckt sowohl Customer Initiated Transactions (CIT) als auch Merchant Initiated Transactions (MIT) ab. Zuvor wurde die TLID nicht verarbeitet.

Die TLID ist eine global eindeutige Kennung, mit der zusammengehörige Transaktionen verknüpft werden, insbesondere bei MIT-Szenarien. Sie beschreibt die Beziehung zwischen einer Ausgangstransaktion und allen nachfolgenden MITs, die im Rahmen desselben Vertrags durchgeführt werden. Bei der Ausgangstransaktion handelt es sich typischerweise um eine CIT als Zero-Authorization (Preauthorization), mit der ein wiederkehrender Vertrag begründet wird. Die TLID wird in der Benachrichtigung zum Zahlungslink zurückgegeben und kann auch über die Transaktions-APIs abgerufen werden. Sie ist ein Zeichenkettenwert, beispielsweise e7R9d3L2-Q9vS6pP1_WzEh. Anders als die NTRs ist sie global eindeutig, sodass Mastercard Transaktionsbeziehungen weltweit unterscheiden kann. Die NTRs sind weiterhin nicht abgekündigt und werden bis auf Weiteres ebenfalls verwendet. Die TLID wird auf dieselbe Weise gespeichert wie der bisherige NTR-Wert.

Bei neuen Verträgen wird die TLID während der ersten CIT erzeugt, in der Regel einer Zero-Authorization mit starker Kundenauthentifizierung (SCA/3DS). Das System speichert sie und verwendet sie für alle folgenden MITs. Bei bestehenden Verträgen, für die zum Zeitpunkt der ersten CIT noch keine TLID vorlag, wird die TLID aus der ersten MIT-Antwort übernommen, die eine solche enthält, und für die weitere Nutzung gespeichert. Eine einmal für einen Vertrag gespeicherte TLID wird nicht überschrieben, auch nicht durch TLIDs aus späteren Antworten. Die TLID bleibt über den gesamten Lebenszyklus des Vertrags dem Vertrag bzw. dem Kontext der wiederkehrenden Zahlung zugeordnet.

Alle nachfolgenden MIT-Anfragen enthalten die gespeicherte TLID im Zahlungsobjekt (payment object) der Anfrage. Die Transaktion wird dabei über den Endpunkt POST /merchants/{merchantId}/transactions angelegt.

Ist für einen wiederkehrenden Vertrag noch keine gültige TLID hinterlegt, muss eine neue CIT mit SCA (z. B. 3DS2) angestoßen werden, um eine neue gültige TLID zu erhalten. Dazu kann eine Zahlungsanfrage mit dem Betrag null unter Verwendung des hinterlegten Assets erstellt werden. Für die Anforderung der starken Kundenauthentifizierung wird empfohlen, den zusätzlichen Parameter „challengeRequested“ zu verwenden.

Zu beachten ist: Wird die TLID nicht korrekt gespeichert oder übermittelt, kann dies zu Soft Declines durch den Kartenherausgeber führen, auch wenn die Zahlungsplattform das TLID-Feld selbst nicht strikt validiert. Händler sind verpflichtet, TLIDs ab dem 2. Juni 2026 zu speichern und ab dem 23. Oktober 2026 in Transaktionsanfragen zu übermitteln. Weitere Informationen finden sich in der MPay-Dokumentation unter https://docs.mercedes-pay.io/docs/off-session-payment-copy.

**Hinweis zu „Supplier Report / Export Templates (Contract, Claim, Invoice)“**

Für diesen Punkt enthalten die Rohdaten ausschließlich Platzhaltertexte und keine inhaltlichen Angaben. Der Status lautet „Cancelled“. Da nichts umgesetzt wurde und keine Informationen vorliegen, habe ich dafür keinen Handbuchtext formuliert.