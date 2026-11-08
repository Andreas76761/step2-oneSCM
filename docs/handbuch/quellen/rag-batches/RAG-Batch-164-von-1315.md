# Batch 164 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 35 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Änderungen und Verbesserungen**

**Altteilesteuer-Rechnungen**

Die Seite für Altteilesteuer-Rechnungen wurde überarbeitet, damit die angezeigten Informationen klarer und eindeutiger sind. Die Bezeichnung „Customer Invoice" lautet nun „Old Part Tax Invoice", und das Feld „Net Amount" heißt jetzt „Old Part Tax Base Amount". Als Rechnungstyp wird auf der Seite „Old Part Tax Invoice" angezeigt; das zugehörige neue Kürzel lautet OPTI.

Auch im Ablauf wurden Fehler behoben. Eine neu erstellte Altteilesteuer-Rechnung ging zuvor direkt in den Status „Exported" über und durchlief den Status „Accepted" nicht. Die für die Altteilesteuer erzeugte E169-Datei enthielt außerdem die oneSCM-Rechnungsnummer statt der Werkstattrechnungsnummer, und das Datum des aktuellen Imports im Feld „booking_period_dates" war offenbar fehlerhaft. Beim Import der i156-Datei mit Altteilesteuer wurde zudem die Steuerklassifizierung der Rechnung falsch angezeigt. Auch diese Fehler wurden behoben. Ebenfalls korrigiert wurde, dass eine Rechnung vom Typ MANU im Status „Accepted" nicht in die E169-Datei exportiert wurde.

**Sonderfall: Flow-Typ und Rechnungstyp**

Für den Sonderfall wurden die Bezeichnungen angepasst. Statt des Flow-Typs „Special Case Subsidy" gilt nun der Flow-Typ „Special Case Discount". Anstelle des Rechnungstyps „SCSAS Special Case Subsidy After Sales" wird der Rechnungstyp „Special Case Discount After Sales" (SCDAS) verwendet. Zudem wurde ein Fehler behoben, durch den für Verträge, die mit einem Sonderfall aktiviert wurden, keine Rechnungen erzeugt wurden.

**Materialnummernverwaltung und Produktlinien**

In der Materialnummernverwaltung wird die Produktlinie nun über die von M&M bereitgestellte Produktlinien-API bezogen. Wo im Revenue Management weitere Stellen die Produktlinie verwenden, wurden diese ebenfalls angepasst. Zuvor wurde bei einer Materialnummer die Produktlinie fälschlich als „Enums.ProductLine.BASIC" angezeigt. Außerdem wird die Prüfung vorbereitet, dass die Produktlinie „Basic" für die Division Passenger Car in der Materialnummernverwaltung nicht mehr verfügbar ist.

**Zahlungen und Benachrichtigungen**

Bei MPay wird der Zahlungslink bei der Vertragsaktivierung neu erzeugt. Bisher gab es keine Möglichkeit, einen abgelaufenen Zahlungslink neu zu erzeugen und die Zahlung fortzusetzen. Solange sich ein Vertrag im Status „Waiting for Confirmation" oder „Waiting for Activation" befindet, liefert das System bei jeder Anfrage des Front-Ends einen gültigen Zahlungslink. Wurde der Link bereits verwendet, wird kein neuer Link bereitgestellt.

Bei abgelehnten Zahlungen wird die Referenznummer nun in der Benachrichtigung angezeigt. Ein weiterer Fehler betraf interne Benachrichtigungen: Sie wurden für Benutzer mit der Rolle MO PC VAN nicht angezeigt, obwohl das Glockensymbol hervorgehoben war. Auch dieser Fehler wurde behoben.

**Plausibilitätsprüfungen COFICO/SWT**

Bei der Plausibilitätsprüfung für COFICO und SWT wurden zwei Fehler korrigiert: Wurden dieselben Rechnungen mehrfach hochgeladen, wurden die Summen vervielfacht, und die Gesamtsumme wurde nicht durch 100 geteilt. Derzeit werden die Plausibilitätsprüfung für den Vergleich von Outbound- und Inbound-Beträgen sowie alle Oberflächenelemente und Filter der Registerkarte „Cofico Checks" auf der Seite „Financial Control" für den Markt Slowakei geprüft. Entsprechend werden die Plausibilitätsprüfung und die Registerkarte „SWT Checks" für den Markt Indien validiert.

**Weitere Prüfungen im Revenue Management**

Zusätzlich befinden sich Prüfungen in Arbeit, die die Abbuchung vom Kontostand bei verarbeiteten Werkstattrechnungen (interne Händler) und bei exportierten Werkstattrechnungen (externe Händler) validieren. Ebenso wird geprüft, dass für Verträge, die über einen Händlerrabatt bezahlt werden, keine Kundenrechnung entsteht.

**Fehlerbehebungen und technische Verbesserungen**

Behoben wurden außerdem folgende Probleme: Die Datei i156 konnte wegen des Fehlers „Request execution failed" nicht verarbeitet werden. Beim Download der i155-Datei trat ein Out-of-Memory-Fehler in den Batch-Jobs auf. Das Exportdatum wurde nicht korrekt angezeigt. Bei Vega-Claims wurde die Beschreibung im Front-End falsch dargestellt. Nach dem Erstellen einer Rechnung flackerten die Registerkarten. Zudem fehlten auf der Schadencode-Oberfläche Schadencodes für Benutzer, die beiden Divisionen zugeordnet sind.

Im Bereich Architektur wird derzeit ein Upgrade der Java-Version von 17 auf 21 geprüft.