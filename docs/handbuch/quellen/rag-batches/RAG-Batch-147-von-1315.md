# Batch 147 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manueller Upload von OneERP-Feedback (Invoice Feedback und BP36)**

Im Bereich Admin → Cross File Transfer → File Upload können HQ-Administratoren sowie alle Benutzer mit Zugriff auf diesen Bereich künftig neben der bereits vorhandenen Schnittstelle I156 zwei weitere Schnittstellen auswählen: „oneERP Invoice Feedback" und „oneERP BP36". Damit steht ein manueller Weg zur Verfügung, um OneERP-Rückmeldungen einzuspielen, wenn die automatische Übertragung über CFT bzw. Kafka verzögert oder nicht verfügbar ist.

Für den Upload von Invoice Feedback wählen Sie die Schnittstelle „oneERP Invoice Feedback" aus und laden eine Datei im .txt-Format hoch. OneSCM verarbeitet die Datei nach der bestehenden Logik für Invoice Feedback und korrigiert dadurch die Rechnungsstatus sowie die damit verbundenen Geschäftsergebnisse. Für BP36 wählen Sie die Schnittstelle „oneERP BP36" und laden eine Datei im .json-Format hoch. Diese Datei kann mehrere BP36-Updates enthalten, mit denen zahlungs- und mahnbezogene Aktualisierungen auf Rechnungen angewendet werden, wenn der Eventeingang verzögert oder nicht verfügbar ist. Beim Upload prüft das System, ob die Schnittstellenauswahl und die Datei zusammenpassen.

Nach dem Hochladen werden die Details wie bei I156 im Bereich „Ergebnisse" angezeigt. Der bekannte Upload-Ablauf mit Verlauf bleibt erhalten. Da der Upload zentral durch das HQ erfolgt, ist nachvollziehbar, wer welche Datei wann hochgeladen hat und mit welchem Ergebnis. So bleiben Rechnungsstatus sowie Mahn- und Zahlungskennzeichen auch bei Ausfall der automatischen Integrationen verlässlich, und die Wiederherstellung nach Störungen verkürzt sich, sobald die Datei dem HQ vorliegt.

**MPay: Zahlungsmethode KCP für den südkoreanischen Markt**

OneSCM bietet für den südkoreanischen Markt die neue Zahlungsmethode KCP (Korea Cyber Payment) über MPay an. KCP ist ein bedeutender südkoreanischer Payment-Gateway- und VAN-Anbieter (Value-Added Network) und ermöglicht die Zahlung mit in Korea ausgestellten Karten in koreanischen Won (KRW). Kunden aus Südkorea können damit ihre Servicekontrakte bezahlen, wobei sie eine gültige Debit- oder Kreditkarte verwenden.

In den Markteinstellungen steht unter „Digital Payment" für MPay die neue Option „KCP" zur Verfügung. Ist sie für ein Produkt ausgewählt, wird KCP bei der Vertragserstellung als Zahlungsmethode angezeigt. In den digitalen Zahlungen erscheint dann das KCP-Logo.

Über KCP wird ein MPay-Zahlungslink erzeugt, der den Kunden in den KCP-Zahlungsablauf weiterleitet. Ein gültiger Link wird nur erzeugt, wenn die Währung KRW ist. Bei der Währung KRW muss KCP die einzige Zahlungsmethode in der Anfrage sein; andere Zahlungsmethoden werden abgelehnt oder ignoriert, und das System gibt einen Validierungsfehler zurück, wenn zusätzliche Methoden mitgeschickt werden. Umgekehrt ist KCP bei einer anderen Währung als KRW nicht zulässig und führt ebenfalls zu einer passenden Fehlermeldung.

Schließt ein Kunde die Zahlung mit KCP erfolgreich ab, wird der MPay-Status in OneSCM bzw. MPay auf „Captured" gesetzt, und die KCP-Transaktionsreferenz sowie die Operation-ID werden an der Rechnung gespeichert. Schlägt die Zahlung fehl oder wird sie abgebrochen, wird der Zahlungsstatus entsprechend aktualisiert.

Wurde eine Rechnung mit KCP bezahlt, erfolgt auch eine Rückerstattung (vollständig oder teilweise) über KCP; eine Erstattung über eine andere Zahlungsmethode ist nicht zulässig. Der erstattete Betrag entspricht dem angeforderten Betrag und wird im Zahlungs- und Rechnungsstatus korrekt abgebildet. Auch eine Rückbuchung (Chargeback) für eine mit KCP bezahlte Rechnung wird über KCP abgewickelt.