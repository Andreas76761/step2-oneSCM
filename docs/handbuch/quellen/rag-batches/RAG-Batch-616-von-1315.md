# Batch 616 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kreditkartenänderung per Kundenselbstservice**

Kreditkarten laufen mit der Zeit ab. Das kann auch während der Laufzeit eines Servicevertrags geschehen, etwa bei einer Vertragsdauer von vier Jahren. Außerdem kann ein Endkunde seine hinterlegte Kreditkarte einfach austauschen wollen. Damit Zahlungen weiterhin korrekt verarbeitet werden können und die Rechnungsstellung möglich bleibt, bietet oneSCM einen Ablauf, mit dem der Kunde seine Kreditkarte für einen Vertrag ändern kann. Der Ablauf ist ein Hintergrundprozess und wird von einem Market-Operations-Mitarbeiter (MO) begleitet und nachverfolgt. Wenn ein Endkunde den MO kontaktiert und mitteilt, dass er die Zahlungsart für einen Vertrag ändern möchte, stößt der MO den Vorgang an.

**Änderungsanfrage versenden**

Der MO wählt in der Kundenverwaltung (Customer Management) die Aktion „Update Requests“ aus. Die Aktion wird künftig unter der Bezeichnung „Customer Self Service“ geführt. Das System lädt die Vorlage und sendet eine E-Mail an den Endkunden. Diese E-Mail enthält einen gültigen Link zum Customer Account Center. Die versendete E-Mail wird in der Vertragshistorie des betreffenden Vertrags protokolliert.

**Authentifizierung des Kunden**

Der Kunde öffnet den Link aus der E-Mail und gelangt in das Customer Account Center. Dort zeigt das System das Authentifizierungsfenster von Mercedes me an. Der Kunde kann sich per QR-Code-Scan oder über die Option „follow this link“ anmelden. Bei Bedarf kann er einen neuen Code erzeugen lassen oder den Vorgang abbrechen. Das System prüft die CIAM-ID des Kunden. Ist die Prüfung erfolgreich, geht es weiter. Andernfalls zeigt das System eine passende Fehlermeldung an. Für den Zugang erhält der Kunde außerdem einen Einmalcode (OTP) auf sein Telefon.

**Aktuelle Zahlungsart ansehen und Änderung starten**

Nach erfolgreicher Authentifizierung ruft das System die vorhandene Kreditkarte des Kunden aus dem Revenue-System ab und zeigt sie an. Die Kreditkartennummer wird dabei anonymisiert dargestellt. Möchte der Kunde die Karte ändern, wählt er „Edit Credit Card“. Das System löst daraufhin bei Revenue eine neue Zahlungsanforderung über MPay aus und leitet den Kunden auf die MPay-Oberfläche weiter. Dieser Schritt findet außerhalb von oneSCM statt.

**Abschluss und Rückmeldung**

Nach Abschluss des MPay-Vorgangs erfolgt eine Rückmeldung (Callback) an oneSCM. Meldet der Callback „OK“, sieht der Kunde eine Erfolgsmeldung. Ist der Callback nicht erfolgreich, erscheint eine Fehlermeldung. Beide Meldungen entsprechen dem vorgesehenen Design der Benutzeroberfläche.

**Aktualisierung des Vertrags**

Bei erfolgreicher Änderung informiert das System das Vertragsmanagement über die neue Kreditkarte. Die neue Asset-ID und die neue Network Transaction Reference (NTR) werden im Vertrag gespeichert und überschreiben die bisherigen Werte. Dies ist Voraussetzung dafür, dass die Rechnungsstellung weiterhin funktioniert.