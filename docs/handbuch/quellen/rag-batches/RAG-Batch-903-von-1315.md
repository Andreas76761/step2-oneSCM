# Batch 903 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Prepaid-Verträge: globaler Standard**

Das System unterstützt für Serviceverträge sowohl Zahlungen vor der Aktivierung (Prepaid, „Pre-Activation") als auch nach der Aktivierung (Postpaid, „Post-Activation"). Dadurch lassen sich marktspezifische, regulatorische und kommerzielle Anforderungen standardisiert und konfigurierbar in allen Märkten abbilden. Die Funktion gilt für alle Kundentypen, Divisionen, Branchen und Identifikatoren.

**Konfiguration in Markt und Produkt**

Voraussetzung ist, dass digitale MPay-Zahlungen in den Markteinstellungen konfiguriert sind. Ein Administrator legt die unterstützten MPay-Zahlungsarten unter „Market Settings → Feature Settings → MPay Configuration → Digital Payment" fest. Die im Markt unterstützten Zahlungsarten werden unter „Market Settings → General → Payment" definiert. Zur Auswahl stehen Lastschrift, Überweisung und Digital Payment, Letzteres nur, wenn es in MPay aktiviert ist. Auf Produktebene (versioniert) konfiguriert der MPC die erlaubten Zahlungsarten. Produkten können nur Zahlungsarten zugewiesen werden, die in den Markteinstellungen zugelassen sind.

**Vertragsangebot und Produktkonfiguration**

Der Verkäufer startet ein Vertragsangebot, der Contract Product Service liefert die passenden Produkte, und der Verkäufer wählt ein Produkt aus und konfiguriert es. Bei einem Pre-Activation-Produkt sind Zahlungsart (Pre-Activation) und Zahlungsmethode (Einmalzahlung) schreibgeschützt. Bei einem Post-Activation-Produkt ist die Zahlungsart (Post-Activation) schreibgeschützt, die Zahlungsmethode ist wählbar: monatlich, vierteljährlich, halbjährlich, jährlich oder einmalig. Unterstützt ein Produkt beide Varianten, wählt der Verkäufer die Zahlungsart selbst. Pre-Activation führt dann zur Einmalzahlung, Post-Activation zu wählbaren Intervallen. Die Produktkarte aktualisiert sich dynamisch entsprechend der Auswahl. Der Zahlungsplan ist bei Pre-Activation sowie bei Post-Activation mit Einmalzahlung ein Einmalzahlungsplan, bei Post-Activation mit Intervall ein intervallbasierter Plan.

**Kunden- und Zahlungsdaten**

Existiert der Kunde bereits, werden seine Daten vorbelegt, andernfalls werden die Daten des neuen Kunden erfasst. Anschließend folgen die Zahlungsinformationen. Bei Pre-Activation ist ausschließlich Digital Payment (der auf Produktebene konfigurierte Wert) verfügbar. Bei Post-Activation werden die konfigurierten Optionen angezeigt: Lastschrift (SEPA), Überweisung und Digital Payment.

**Bestätigung, Unterschrift und Zahlung**

Der Servicevertrag wird erstellt und in der Übersicht mit Bestätigung angezeigt. Optional kann der Verkäufer die Zahlungsart bearbeiten, sofern dies erlaubt ist. Mit der Auswahl der Unterschrift wird der Vertragsstatus auf „Waiting for Confirmation" gesetzt. Sind die Unterschrift erfasst, SAP CAS negativ und eine SAP-Debitorennummer vorhanden, wechselt der Status auf „Confirmed". Bei Post-Activation bleibt der Ablauf der Vertragserstellung unverändert. Bei Pre-Activation wird der Vertrag auf „Confirmed" gesetzt und folgende Daten werden an Revenue gesendet: Vertragsnummer, die vom Kunden zu zahlenden Beträge (brutto und netto) und die SAP-Debitorennummer.

**Zahlungsablauf bei Pre-Activation**

Revenue erzeugt den Zahlungsplan und bestätigt dies dem Vertrag (200 auf der API). Der Vertrag sendet dem Kunden eine E-Mail auf Basis der von Stream 4 definierten Vorlage. Darin wird der Kunde aufgefordert, dem Link zum CAC zu folgen und anschließend die Zahlung fortzusetzen. Nach dem Aufruf des CAC fragt der Vertrag die Zahlungsberechtigung ab. Ist der Vertrag zahlbar, wird dies an das CAC bestätigt, andernfalls zeigt das CAC einen Fehler an. Ist die Zahlung möglich, fordert der Vertrag bei Revenue einen Zahlungslink an. Revenue erstellt den Link und liefert Betrag und Gültigkeitsdauer, die aus den Markteinstellungen (Feature Settings / MPay Configuration / Payment Validity) stammen. Das CAC zeigt Link, Betrag und optional die Gültigkeit an.

Läuft der Zahlungslink ab, erscheint im CAC ein Fehler, und die Schaltfläche „Regenerate" wird im CAC und in den MO Checks aktiviert. Löst der Kunde die Neuerzeugung im CAC aus, wird der Status in den MO Checks auf „Pending" gesetzt, die Retrigger-Funktion deaktiviert und bei Revenue ein neuer Link inklusive Betrag und Gültigkeit angefordert. Ist der Link noch gültig, gelangt der Kunde zu MPay, um die Zahlung zu validieren und abzuschließen. Danach wird Revenue informiert. Der Customer-&-Partner-Microservice fragt per Short Polling bei Revenue den Zahlungsstatus ab, und das CAC zeigt „Payment Successful" oder „Payment Failed" an. Revenue sendet dem Vertrag zudem eine Benachrichtigung zum Zahlungsstatus.

**MO Checks und erneutes Auslösen der Zahlung**

Es gibt einen neuen MO Check der Kategorie „Price Check" mit dem Feld „Pre-Activation Payment", Standardwert „Pending". Bei „OK" kann die Aktivierung fortgesetzt werden, bei „Not OK" ist sie blockiert. Die Funktion „Retrigger Payment" ist nur bei Status „Not OK" aktiv. Sie erfordert eine Bestätigung und einen Grund und speichert Benutzer-ID und Zeitstempel. Der Status wird auf „Pending" zurückgesetzt und ein neuer Zahlungslink erzeugt. Dieser Vorgang kann mehrfach wiederholt werden. Das MO kann den Vertrag jederzeit ablehnen, wenn die Zahlung fehlschlägt.

**Aktivierung und Ablehnung**

Ist die Zahlung in Ordnung, wird der MO-Check-Status auf „OK" und der Vertragsstatus auf „Waiting for Activation" gesetzt. Der Vertrag wird aktiviert, i155 erzeugt, und Revenue sowie Nemesis werden benachrichtigt. Schlägt die Zahlung fehl, wird der MO Check auf „Not OK" gesetzt, die Aktivierung verhindert und die Retrigger-Funktion in den MO Checks freigeschaltet.

Muss ein Vertrag abgelehnt werden, wird ein Ereignis mit Kundendaten, Vertragsnummer, Betrag und Zahlungsmethode an Revenue gesendet. Der Revenue-Microservice erstellt eine Gutschrift und erstattet die Transaktion, sodass der Kunde die gezahlten Beträge zurückerhält.

**Gestaltung**

Grafik und Design müssen den UI/UX-Vorgaben der Mercedes-Benz Workbench entsprechen.