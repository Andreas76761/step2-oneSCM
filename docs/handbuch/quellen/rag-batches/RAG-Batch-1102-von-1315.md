# Batch 1102 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 25 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation) – Neuerungen und Änderungen**

**Dokumentenprüfung und Ablauf der Vertragsaufnahme**
Die bisherige MO-Prüfung „Document Signature Check“ wurde umstrukturiert und heißt nun „Document Check“. Sie umfasst zwei Teilprüfungen: die Vertragsnummer und die Dokumentensignatur. Beim Anlegen eines Vertrags steht jede Teilprüfung zunächst auf „Pending“. Kann die Vertragsnummer vom Dokumentensystem nicht gelesen werden, wird der Status auf „Not Ok“ gesetzt und eine automatische Aktivierung ist nicht möglich. Als Grund wird per Hyperlink der Hinweis „Contract Number must be confirmed!“ angezeigt; der Link führt in die Vertragsdetails auf den Reiter „Communication“. Ist die Vertragsnummer in Ordnung, wird der Status auf „Ok“ gesetzt und die automatische Aktivierung ist erlaubt. Für die Dokumentensignatur gilt dasselbe Vorgehen: Wird keine Signatur erkannt, erscheint „Not Ok“ mit dem Hinweis „Contract Signature must be confirmed!“ und dem Link zum Reiter „Communication“; andernfalls wird der Status auf „Ok“ gesetzt und die automatische Aktivierung zugelassen.

Außerdem wird der Endpunkt /fi-system-data/{id} nun erst aufgerufen, nachdem der Vertrag unterschrieben wurde.

**Ablauf von Verträgen und Angeboten**
Das Ablaufen eines Vertrags richtet sich jetzt nach dem Ablaufkriterium des Produkts. Lautet das Kriterium TIME, kann der Vertrag nur durch Erreichen des geplanten Enddatums auslaufen. Bei TIME_OR_MILEAGE läuft er entweder mit dem geplanten Enddatum oder bei Überschreiten der geplanten Laufleistung aus. Bei CONTINGENT endet der Vertrag, sobald alle Kontingentleistungen verbraucht sind. Für Kontingentprodukte wird zudem die Anzahl der Leistungen als Platzhalter übermittelt. Die Information über den Ablauf eines Angebots wird an den Kunden gesendet, der Händler erhält eine Kopie.

In der Angebotsverwaltung (Proposal Management) wurde im Reiter „Proposal“ die Bezeichnung „Offer Validity“ in „Proposal Validity“ umbenannt.

**Händlerdaten und SAP-Debitorennummer**
Nachdem Produkt ausgewählt und konfiguriert sowie die Kundendaten erfasst wurden, wird beim Anlegen des Angebots und der Vergabe der Referenznummer geprüft, ob der Verkäufer (der angemeldete Händler oder ein von MPC bzw. MO zugewiesener Händler) in oneSCM existiert und eine SAP-Debitorennummer hinterlegt ist. Ist das der Fall, wird die Aktivierung fortgesetzt und die Nummer bei der Aktivierung an Revenue übermittelt. Andernfalls kann der Vertrag bis zum Status „Waiting for Activation“ gelangen und es wird eine MO-Prüfung der Kategorie „Dealership Check“ mit dem Ergebnis „Dealers SAP Debtor Number - NOK“ und dem Grund „Dealership not registered“ gesetzt. Der Hyperlink führt in die Händlerverwaltung (Dealership Management), wo die Nummer manuell ergänzt werden kann. Sobald sie erfasst ist, wird die Prüfung auf „OK“ gesetzt und die Vertragsaktivierung fortgesetzt.

Die Adresse des ausgewählten Outlets wird beim Anlegen des Vertrags mitgesendet und am Vertrag gespeichert. Außerdem werden die Anmeldedetails und die Händlerdetails um eine weitere Kennung für Händler erweitert, sowohl bei der Anmeldung als auch wenn MO im Auftrag eines Händlers einen Vertrag verkauft. Hintergrund ist, dass ein Autohaus mehrere Outlets (z. B. acht in einer Stadt) haben kann; dafür werden die vollständigen Adressdaten aus ALICE genutzt.

**Kampagnen und Preise**
Bei Sticker-Price-Kampagnen hängt der Preis nun von Laufzeit und Laufleistung ab. Die Produktantwort enthält alle möglichen Preiskombinationen. Öffnet der Verkäufer in der Produktkonfiguration das Kampagnenfenster, wird neben jeder Kampagne der zur Konfiguration passende Preis angezeigt, jeweils als Nettowert. Die Kampagnenbeschreibung wird jetzt aus dem Feld „salesDescription“ der Antwort übernommen. Der Attributwert „Provision Component“ aus den Kampagnen wird am Vertrag gespeichert und, sobald der Vertrag mit angewandter Kampagne aktiv ist, im Zahlungsplan-Ereignis an Revenue gesendet.

**Anzeige und Formate**
Das Bestelldatum (Order Date) wird in der Oberfläche nun im Datumsformat der Markteinstellungen angezeigt. Wird es beispielsweise vom Fahrzeugbereich im Format YYYY-MM-DD geliefert und ist im Markt DD.MM.YYYY eingestellt, erscheint es als DD.MM.YYYY. Zwischen Währung und Betrag steht jetzt ein Leerzeichen (statt „EUR300.85“ nun „EUR 300.85“). Die Produktbeschreibung wird aus der Produktantwort auf Vertragsebene gespeichert; die Übersichtsseiten für Vertragsaktionen (Erstellung, Übertragung, Zahlerwechsel und Verlängerung) verwenden sie aus den Produktdetails des Vertrags.

Beim ersten Login in oneSCM erscheint ein Pop-up mit den marktspezifisch konfigurierten Nutzungsbedingungen. Der Nutzer muss sie lesen und aktiv akzeptieren. Ein Symbol fordert dazu auf, bis zum Ende des Dokuments zu scrollen.

**Dokumente, Zahlerwechsel und Schnittstellen**
Das Größenlimit für den Upload von Dokumenten in den Markteinstellungen wurde auf 100 MB erhöht, damit größere Dateien unterstützt werden. Beim Zahlerwechsel im Vertragsmanagement wird der CAS-Status des Zahlers geprüft, sofern dieser vom Vertragsinhaber abweicht. Fällt die Prüfung für den neuen Zahler positiv aus, wird der Zahlerwechsel abgebrochen und der Vertrag mit dem Grund „Change Payer Failed“ in den Standardzustand reaktiviert. In der Schnittstelle i155 (Übermittlung an Vega) wird für die Produktlinie „Tire“ an Position 175–176 im Satz RC05 nun der Wert „06“ ausgegeben.