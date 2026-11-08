# Batch 1015 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis zum Status:** Die Funktion „Mileage Check – Market Operations Interface" wurde abgebrochen (Status „Cancelled") und ist nicht Teil des Releases. Ich habe sie daher nicht in den Handbuchtext aufgenommen. Falls sie dennoch dokumentiert werden soll, z. B. als Hinweis auf eine nicht umgesetzte Funktion, gebe ich Ihnen gern eine entsprechende Fassung.

**Entwurf für das Benutzerhandbuch: Anzeige der Zahlerinformationen in der Übersicht und Bestätigung**

Wenn ein Kunde wünscht, dass nicht der Vertragsinhaber, sondern eine andere Person als Zahler hinterlegt wird, erfassen Sie als Händler die entsprechenden Zahlerinformationen im Vertragserstellungsprozess. Diese Angaben werden jetzt auf der Seite „Übersicht und Bestätigung" in einem eigenen Abschnitt „Payer Information" dargestellt. Der Abschnitt befindet sich unterhalb der Kundeninformationen (Adressdetails) und oberhalb der Planvorschau.

Der Abschnitt enthält die Kundendaten des Zahlers: Vorname, Nachname, E-Mail-Adresse, Mercedes-me-ID, Telefonnummer, Sprache und private USt-ID (Finanzidentifikationsnummer). Hinzu kommen die steuerlichen und rechtlichen Angaben, nämlich Steuerklassifizierung, Steuerklassifizierungscode und Rechtseinheit (PC/VAN). Ebenfalls angezeigt werden die Daten aus dem FI-System: Partnertyp, SAP-Debitorennummer und FI-System-Status. Zur Datenschutzeinwilligung (DSGVO) ist die entsprechende Einstellung aktiviert.

Darüber hinaus werden die Adressdetails des Zahlers mit Postleitzahl, Ort, Straße, Hausnummer, Adresszusatz und Land angezeigt. Den Abschluss bilden die Zahlungsinformationen mit Kontoinhaber, IBAN, Bankname, BIC und Währung. Alle genannten Angaben stammen aus dem vorherigen Schritt „Partner & Payment Information" und müssen nicht erneut eingegeben werden.

So gehen Sie vor: Starten Sie die Vertragserstellung und wählen Sie im Bereich „Customer & Payment" einen abweichenden Zahler für den Vertrag aus. Geben Sie die Daten des Zahlers ein oder wählen Sie einen bereits vorhandenen Zahler aus. Wechseln Sie anschließend zu Schritt 3, „Overview and Confirmation". Dort sehen Sie sowohl die erfassten Informationen zum Kunden als auch die gesonderten Informationen zum Zahler.

Die Gestaltung der Oberfläche entspricht der Mercedes-Benz Workbench sowie dem vom Kunden freigegebenen UI-Design.