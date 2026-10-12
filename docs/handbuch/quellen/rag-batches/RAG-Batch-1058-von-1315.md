# Batch 1058 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 59 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

In der Vertragserstellung wurde die Anlage von Verträgen für Gewerbekunden geprüft, sowohl mit neu angelegten als auch mit bereits vorhandenen Kunden. Dabei werden die Daten auf der Übersichts- und Bestätigungsseite kontrolliert, der Vertrag wird aktiviert und anschließend werden die Kundendaten im Vertragsmanagement überprüft. Im Backend wurde außerdem der Platzhalter für das vorzeitige Vertragsende angepasst: Statt „Termination Notification" wird nun „earlyTerminationDateRequestedByCustomer" verwendet. Die Fehlermeldung bei einer ungültigen Mercedes-Me-ID bei der Vertragserstellung wurde bearbeitet und das zugehörige Thema abgeschlossen.

**Abweichender Zahler für Servicevertrag**

Bei der Vertragserstellung kann ein vom Halter abweichender Zahler angegeben werden. Dafür steht ein neuer Schalter mit der Bezeichnung „I want to add a different payer for this contract." zur Verfügung, der beim Anlegen eines neuen Vertrags für einen neuen Kunden standardmäßig deaktiviert ist. Wird der Schalter umgelegt, erscheint ein Bereich für die neuen Zahlerinformationen. Der Zahler kann aus einer Liste aktiver Benutzer ausgewählt werden. Über den Schalter „Payer is already a customer" öffnet sich der Dialog „Customer Details". Ist der Zahler bereits als Benutzer vorhanden, werden die Daten aus der oneSCM-Datenbank vorausgefüllt; bei einem nicht vorhandenen Benutzer bleiben die Zahlerinformationen ungefüllt. Existiert ein Kunde nur in Mercedes me, können die abgerufenen Daten bearbeitet werden. Auf der Übersichts- und Bestätigungsseite werden die Zahlerinformationen angezeigt, auch wenn ein neuer Kunde als Zahler angelegt wird. Wird ein Vertrag mit einem vom Halter abweichenden Zahler erstellt, aber nicht aktiviert, werden Halter und Zahler auf der Detailseite der Vertragserstellung angezeigt.

**Produktauswahl**

Auf der Seite zur Produktauswahl wurden mehrere Funktionen geprüft. Dazu gehört die automatische Befüllung der Laufleistung, einschließlich der Fehlermeldung. Ebenso wurden der Händlerrabatt (Erfolgsfall, Feldvalidierungen und Abbruchfunktion) sowie die vom Markt angewendete Kampagne (Erfolgsfall, Feldvalidierungen und Abbruchfunktion) betrachtet. Bei der MCC-Grace-Period-Kampagne kann eine Kampagnenanfrage gesendet werden, woraufhin das Marktunternehmen (MO) eine Benachrichtigung erhält. Nach Genehmigung der Anfrage wird der neue Preis im Vertragsmanagement angezeigt; auch der Abbruch ist möglich. Außerdem wurde die Erstellung eines Vertrags im Built-to-Stock-Ablauf erfolgreich geprüft. Weitere Prüfungen betreffen die angezeigten Felder bei der Auswahl von Situation bzw. Ablauf, den Built-to-Order-Ablauf mit Feldvalidierungen und spezifischen Feldern auf der Übersichts- und Bestätigungsseite sowie die Vertragserstellung über Modellcode, Bestellnummer und Fahrgestellnummer. Diese Prüfungen sind teilweise noch offen. Ebenfalls offen ist die Prüfung der Anzeige der Produkte.

Für Verträge mit Händlerrabatt wird geprüft, was geschieht, wenn der Rabatt höher als der Vertragswert ist oder ihm entspricht; im letzteren Fall werden zudem die Händlerdaten in den Vertragsdetails kontrolliert. Bei Verträgen mit Kontingentprodukten wird auf der Übersichts- und Bestätigungsseite die Anzahl der Services geprüft. Nach der Aktivierung bleibt der Vertrag im Wartestatus, und die Gesamtanzahl der Services wird auf der Detailseite der Vertragserstellung kontrolliert.

**Übersicht und Bestätigung, Kunden- und Zahlungsinformationen**

Auf der Übersichts- und Bestätigungsseite sowie in der Zahlungsdetailansicht wird die Plan-Vorschau-Tabelle angezeigt. Felder können dort bearbeitet werden; geprüft wurden der Erfolgsfall, die Eingabe ungültiger Daten, die Abbruchfunktion sowie die Fehlermeldung, die erscheint, wenn zwei Felder gleichzeitig bearbeitet werden. Auf der Seite für Kunden- und Zahlungsinformationen werden bei ungültigen Eingaben entsprechende Fehlermeldungen angezeigt.

**Startseite, Detailansicht und Ablehnung**

Auf der Startseite wurde die Aktionsschaltfläche „Update" hinsichtlich Erfolgsfall, Feldvalidierungen und Abbruchfunktion geprüft. In der Detailansicht können Felder auf den Registerkarten „Vehicle" und „Payment" bearbeitet und aktualisiert werden, wobei kontrolliert wird, ob die Daten übernommen wurden. Wird ein erstellter Vertrag abgelehnt, ist dies auf der Registerkarte „History" nachvollziehbar.

**CAS-Prüfung und weitere offene Prüfungen**

Die CAS-Prüfung soll in die Vertragserstellung integriert werden. Vorgesehen sind Tests, ob ein Vertrag bei positivem CAS-Ergebnis abgelehnt wird, ob das MO bei den Rückgabewerten „0" oder „2" eine Benachrichtigung erhält und ob ein Vertrag bei den Rückgabewerten „3" oder „4" aktiviert werden kann. Darüber hinaus stehen noch Prüfungen aus zu Rollen und Berechtigungen (Lese-, Erstellungs- und Aktualisierungsprüfungen sowie das manuelle Setzen eines abweichenden Status durch das MO bei fehlgeschlagenen Prüfungen), zu Änderungen auf der Registerkarte „Communication" in der Vertragsübersicht, zur Validierung notwendiger Operationen gegen die Organisations-ID (Brabus) und zum Auslösen von DSS in der Vertragserstellung.