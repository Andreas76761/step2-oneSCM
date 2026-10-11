# Batch 1037 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Produkt konfigurieren**

Nachdem im vorherigen Schritt die FIN/VIN, das Datum der Erstzulassung und die Laufleistung eingegeben und bestätigt wurden und die Schaltfläche „Select“ betätigt wurde, zeigt das System die für das jeweilige Fahrzeug verfügbaren Produkte an. Jedes Produkt wird mit seinem niedrigsten Preis dargestellt. Der Nutzer wählt ein Produkt aus und konfiguriert es anhand der möglichen Optionen. So sieht er den Preis passend zur gewählten Konfiguration und kann anschließend einen Servicevertrag erstellen.

Für die Konfiguration stehen drei Pflichtfelder zur Verfügung: die Laufzeit („Period“), die jährliche Fahrleistung in Kilometern („Annual Mileage km“) und das Zahlungsintervall („Payment interval“). Die Auswahlwerte für Laufzeit und Fahrleistung werden aus der Produkt- und Preistabelle abgeleitet, die aus der OneSCM Product & Price Provisioning stammt. Beim Zahlungsintervall stehen die Optionen „Onetime“ (einmalig) und „Monthly“ (monatlich) zur Verfügung.

Der Preis wird erst angezeigt, nachdem alle Felder konfiguriert wurden, und erscheint in Euro. Bei einmaliger Zahlung zeigt das System den Gesamtbetrag des Vertrags an, der von der Vertragskalkulation (Contract Calculation) bereitgestellt wird. Bei monatlicher Zahlung werden der Betrag pro Monat sowie der Gesamtbetrag für alle Vertragsjahre angezeigt. Der monatliche Betrag errechnet sich aus dem Gesamtpreis geteilt durch die Anzahl der Jahre multipliziert mit 12.

Die Schaltfläche „Next“ ist ausgegraut und damit nicht verfügbar, bis das Produkt konfiguriert und der zugehörige Preis ermittelt wurde. Danach führt sie den Nutzer zum nächsten Schritt des Assistenten, den Kundeninformationen. Wählt der Nutzer „Cancel“, erscheint der Hinweis: „You have unsaved changes that will be lost. The changes you have made will not be updated and they will be lost. Are you sure you want to proceed?“ Die Schaltfläche „Cancel“ im Pop-up führt zurück zur aktuellen Seite, während „Proceed“ den Nutzer zur Startseite (Landing Page) bringt.

**Kundendaten im Bereich Customer Information**

Der Bereich „Customer Information“ ist nur zugänglich, wenn im vorherigen Schritt alle Bedingungen bestätigt wurden und der Nutzer auf „Next“ geklickt hat. Hier gibt der Nutzer nach der Produktauswahl und der Preiskonfiguration die Kundendaten ein, um einen Servicevertrag zu erstellen. Alle Werte werden manuell in Textfeldern erfasst.

Der Bereich trägt die Überschrift „Customer“ und die Zwischenüberschrift „Customer Details“. Als Pflichtfelder sind Vorname („First Name“, maximal 100 Zeichen), Nachname („Last Name“, maximal 100 Zeichen), E-Mail-Adresse („Email Address“, maximal 241 Zeichen), Mobilnummer („Mobile Number“, maximal 30 Zeichen) sowie die Sprache („Language“) auszufüllen. Die Sprache wird über ein Dropdown-Feld mit den Werten DE, EN, FR, PL und ES ausgewählt. Optional ist das Feld „BusinessMe ID“, das nicht zum MVP gehört. Ebenfalls optional und nicht Teil des MVP ist die private Umsatzsteuer-Identifikationsnummer („Private VAT-ID“, Financial Identification Number) mit maximal 16 Zeichen. Sie ist marktspezifisch: In einigen Märkten, zum Beispiel Portugal, müssen Kunden diese Nummer angeben, um das Geschäft abzuschließen.

Mit „Back“ gelangt der Nutzer zur vorherigen Seite „Product Selection“. „Next“ führt zur nächsten Seite, „Data & Documents Preview“. Voraussetzung dafür ist, dass alle Pflichtfelder ausgefüllt und validiert sind. Ist ein Pflichtfeld nicht ausgefüllt, erscheint eine Hinweismeldung (Toast) mit dem Namen des Feldes, zum Beispiel „First name is not filled“. Wählt der Nutzer „Cancel“, erscheint dieselbe Warnung vor Datenverlust wie im vorherigen Schritt. „Cancel“ im Pop-up führt zurück zur aktuellen Seite, „Proceed“ zur Startseite.

Die Gestaltung der Oberfläche entspricht dem Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.