# Batch 271 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Händlerrabatte und Rechnungsverwaltung**

**Händlerrabatt (Dealer Discount)**

Händler können Kunden Preisnachlässe gewähren. Diese individuellen Rabatte werden bei der Vertragserstellung erfasst und entweder als Prozentwert oder als absoluter Betrag definiert. Sämtliche preisbezogenen Berechnungen übernimmt die Domäne Product & Price Provisioning. Der vom Händler gewählte Rabatt wird an den Price Provisioning Service übergeben, der die Preisreduzierung berechnet und die reduzierten monatlichen Raten ermittelt, die der Kunde zahlt. Der Rabattbetrag wird zugleich vom Gesamtbasispreis abgezogen.

Die Vertragsgenerierung bzw. das Vertragsmanagement stellt anhand des gewählten Rabatts alle Informationen bereit, die zur Erstellung einer Rechnung im Zahlungsplan erforderlich sind. Der Händlerrabatt wird dabei wie eine Kundenzahlung bzw. externe Einnahme behandelt. Die Rechnungsart „DD“ ist deshalb in die Schnittstelle E169 aufgenommen, damit diese Rechnungen an das FI-System übertragen, dem Händler in Rechnung gestellt und der gewährte Rabattbetrag eingezogen werden kann. Beim Aktivierungsprozess wird die Schnittstelle zur Rabatterstellung ausgelöst, um den Erlös anzulegen.

Für die Rechnung werden der Vertragsnummer, der Rabattbetrag (Nettobetrag), das Vertragsstartdatum, die Rechnungsart DD sowie die Partnerdaten benötigt. Die SAP-Debitorennummer wird über die GSSN-ID des Händlers ermittelt, die im Bereich Customer & Partner Management gepflegt wird. Die Händlerinformationen (VegaID und GSSN-Outlet-ID) stehen in den Vertragsdetails zur Verfügung, und die Zuordnung zur SAP-Debitorennummer erfolgt über die Pflege im Partnermanagement. Die Rechnung erhält als Rechnungsdatum das aktuelle Datum. Rechnungszeitraum von und bis entsprechen jeweils dem Vertragsstartdatum. Kundenrechnungsart ist DD, der Belegtyp ist „Invoice“, der Status lautet „Accepted“, der Nettobetrag entspricht dem Rabattbetrag, und die Rechnungsempfängernummer ist die SAP-Debitorennummer.

Gewährt ein Händler bei der Vertragserstellung einen Rabatt, wird somit eine Rechnung mit demselben Nettobetrag erzeugt. Diese Rabattrechnungen durchlaufen denselben Übertragungsprozess an NACOS wie Kundenrechnungen.

Die erzeugte Rabattrechnung wird im Reiter „Payment“ im Bereich „Financial Flows“ angezeigt. Neben den Kunden- und Werkstattrechnungen gibt es dort einen eigenen Abschnitt „Price Reductions“. Er enthält die Rechnungen sowie die Summe aller Rechnungen. Zur Tabelle gehören die Anzeige „Displaying x of y records“ und eine Auswahl für die Anzahl der Einträge pro Seite. Die Spalten sind: Flow Type (bei Händlerrabatten „External Discount Dealer“), Document Type (Invoice oder Credit Note), Invoice Date, Invoice Status, Net Amount (Nettobetrag des Rabatts mit Währung, Format x.xxx,xx EUR), Invoice Period (Format dd.MM.yyyy - dd.MM.yyyy), Processing Number, FI-System Transfer Date, FI-System Invoice Number, oneSCM Invoice Number, Invoice Recipient und Actions. Für Händlerrabattrechnungen steht dort die Aktion „See History“ zur Verfügung.

**Rechnungshistorie**

Ein Market-Operation-Nutzer kann für eine ausgewählte Rechnung die Historie der Statusänderungen einsehen. Dies gilt für die Historie einzelner Rechnungspositionen und auch für die Rechnungshistorie im Vertragsmanagement.

**Sammelrechnungen**

Sammelrechnungen fassen nur noch Rechnungen desselben Kunden zusammen. Zuvor wurden gleichartige Rechnungen unterschiedlicher Kunden in einer Kundenrechnung gruppiert. Nun werden nur Rechnungen desselben Kunden unter einer gemeinsamen Processing Number (Kundenrechnung) gebündelt.

**Steuerklassifizierung**

Beim Anlegen einer neuen Steuerklassifizierung kann der Nutzer die Aktion abbrechen. Der dabei angezeigte Toast-Hinweistext wurde angepasst. Außerdem wurde ein Fehler in der Methode getTaxFactor behoben, die bei leerer Datenbank nicht funktionierte.

**Batch Job Management**

Im Batch Job Management stehen Administratoren mehrere Funktionen zur Verfügung. Ein Job kann manuell gestartet werden, was insbesondere nötig ist, wenn ein Lauf fehlgeschlagen ist und erneut angestoßen werden muss. Jobs lassen sich deaktivieren und über „Run a job now“ sofort ausführen. Zudem kann nach Jobs gesucht werden, und die Tabelle bietet eine Seitennavigation, um durch die Einträge zu blättern.