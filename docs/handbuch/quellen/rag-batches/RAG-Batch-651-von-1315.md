# Batch 651 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Customer & Partner Management**

**Regelmäßige Sanktionslistenprüfung (CAS)**

Bereits vor der Aktivierung eines Vertrags werden automatisierte CAS-Prüfungen durchgeführt. Neu hinzu kommt eine regelmäßige Prüfung der Kunden, die in einem Vertrag die Rolle des Halters innehaben. Dazu übermittelt oneSCM über den CFT-Datenfluss eine Datei an CAS. Die Prüfung erfolgt alle drei Monate, gerechnet ab dem Datum, an dem der Vertrag aktiv wurde. Je Halter werden Vorname, Nachname und die Adressdaten (Postleitzahl, Ort, Straße, Hausnummer, Adresszusatz und Land) übermittelt. Technisch wird dies über zwei Batch-Jobs umgesetzt: Der ausgehende Job erstellt die Kundenliste und sendet sie an CAS, der eingehende Job holt die Antwortdatei von CAS ab, verarbeitet sie und löst die erforderlichen Folgeaktionen aus. Beide laufen quartalsweise, also alle drei Monate.

Die Antwort von CAS wird wie folgt behandelt: Meldet die Prüfung einen potenziellen Treffer, bleibt zunächst alles unverändert, bis das Ergebnis der Clearing-Gruppe vorliegt. Meldet die Prüfung einen positiven Treffer, wird der Vertrag vorzeitig beendet. Das MO-Team wird per E-Mail informiert und nimmt Kontakt mit dem betroffenen Kunden auf. Die E-Mail ist fest vorgegeben: Der Betreff lautet „Sanction list positive for Customer <Vorname> <Nachname>". Der Inhalt weist darauf hin, dass der Vertrag mit der genannten Vertragsnummer automatisch vorzeitig beendet wurde, wobei die Vertragsnummer auf den entsprechenden Vertrag in oneSCM verlinkt ist. Es folgen die Aufforderung, die freigegebenen Maßnahmen zu ergreifen, und der Hinweis, dass die Nachricht automatisch erzeugt wurde und nicht beantwortet werden soll. Zusätzlich wird der Grund der vorzeitigen Beendigung in der Historie des Vertrags dokumentiert. Bei einem positiven Treffer steht in der Spalte „Reason" der Eintrag „CAS-Check: Positive Hit".

Die Schnittstelle wird zudem überwacht: Trifft innerhalb von 24 Stunden keine Rückmeldung von CAS ein, erscheint die Meldung „CAS-Feedback missing for Periodical Checks." Auf die Kundenkonten hat dies zunächst keine Auswirkung. Das MO-Team wendet sich an die Support-Teams und weist auf das Problem hin. Sobald die Datei nach der Analyse erfolgreich vorliegt, wird sie verarbeitet und die nötigen Maßnahmen an Verträgen und Kunden, etwa die vorzeitige Beendigung, werden eingeleitet.

**Datenschutz-Schalter und Marketingpräferenzen**

Der DSGVO-Schalter wurde samt der zugehörigen Einschränkungen und Regeln aus dem Bereich Kunden- und Zahlungsinformationen entfernt. Das gilt sowohl in der Vertragserstellung als auch im Kundenmanagement und für private wie gewerbliche Kunden. Der Grund: Der Kunde steht dem Händler direkt gegenüber, und die Einwilligung ergibt sich aus der Absicht, einen Servicevertrag abzuschließen. Die Marketingpräferenzen wurden unterhalb des Bereichs SEPA platziert.

**Partner Management**

Der Bereich Partner Management wurde auf den Umgebungen INT und PrePROD aus der Benutzeroberfläche entfernt. Kein Benutzer kann diesen Bereich einsehen oder darauf zugreifen. Die Entwicklung in diesem Bereich ist bis auf Weiteres gestoppt.

**Weitere Korrekturen und Verbesserungen**

Mehrere Fehler wurden behoben. Die Vertragserstellung war zeitweise blockiert, dies wurde korrigiert. Sonderzeichen in der Exportdatei für Nacos werden nun korrekt behandelt. Im Downloadbereich wurde eine fehlerhafte Dateierweiterung korrigiert. Der Kundenstatus in der Übersicht der Vertragserstellung war fest hinterlegt und wurde angepasst. Außerdem wurde behoben, dass ein Halter im selben Vertrag zusätzlich als abweichender Zahler hinzugefügt werden konnte. Ebenso wurde der Schalter „Payer is already a customer" korrigiert, der deaktiviert war, wenn ein Halter als Zahler verwendet wurde. Schließlich wird ein neu angelegter Vertrag in der Liste „Latest service contracts" im Kundenmanagement nicht mehr an letzter Stelle angezeigt.

**Tests zur Vertragsrolle auf Kundenebene**

Derzeit wird geprüft, dass der Kundenstatus nach der Verwendung eines Kunden bei der Vertragserstellung korrekt gesetzt wird: „Payer" nach Verwendung als Zahler, „Holder" nach Verwendung als Halter und „Holder & Payer" nach Verwendung in beiden Rollen. Die manuellen Testdurchführungen zur Vertragsrolle auf Kundenebene und zur Download-Funktion für Nacos-Benutzer sind noch offen.