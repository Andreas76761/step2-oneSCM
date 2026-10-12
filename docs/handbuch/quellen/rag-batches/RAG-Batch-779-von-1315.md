# Batch 779 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management: Neuerungen und Änderungen**

**Long Term Prolongation per API für MBLD**

MBLD kann Langzeitverlängerungen (Long Term Prolongation) von Verträgen nun direkt über eine API abwickeln und Vertragsanpassungen selbstständig verwalten, ohne dass die Market Operation dafür das Frontend bedienen muss. Voraussetzung ist, dass die Anfrage aus dem Vertriebskanal „Leasing“ stammt und der Vertrag den Status „Aktiv“ hat. Da der gesamte Ablauf im Backend über die API erfolgt, gibt es keine Benutzeroberfläche für diese Funktion.

Zunächst fordert MBLD über den Edge Service den Kontostand (Account Balance) zu einer Vertragsnummer an und prüft anhand des zurückgegebenen Werts, ob Vertragsanpassungen zulässig sind. Anschließend fragt MBLD über den Edge Service beim Product Microservice ein Preisangebot für eine gewünschte Laufleistung und Laufzeit an. Die Anfrage enthält die Vertragsnummer, LZ/LL, einen Offset (die Anzahl der nächsten Wirksamkeitstermine, die übersprungen werden können) und optional ein Wirksamkeitsdatum. Der Product Microservice berechnet den Preis und liefert LZ/LL, Gesamtpreis, Intervallpreis sowie den Preis pro Mehr- und Minderkilometer zurück.

MBLD berechnet daraufhin die eigene Servicerate und die Vertragsanpassung. Ist die Konfiguration nicht passend, kann MBLD jederzeit eine neue Anfrage mit angepassten Parametern senden, die als neue Konfigurationsanfrage verarbeitet wird. Ist die Konfiguration in Ordnung, sendet MBLD über den Edge Service eine Anfrage zur Anwendung der Langzeitverlängerung mit Vertragsnummer, LZ/LL, Offset und optional dem Wirksamkeitsdatum. Der Contract Microservice legt die Konfiguration der Vertragsanpassung an und bestätigt sie mit den aktualisierten Preisangaben.

Lehnt der Endkunde das Angebot ab, sendet MBLD eine Ablehnungsanfrage über den Edge Service. Der Contract Microservice verwirft die Konfiguration und bestätigt dies mit einer Erfolgsantwort (HTTP 200). Stimmt der Endkunde zu, sendet MBLD eine Anfrage zur Anwendung der Konfiguration mit der Vertragsnummer. Der Contract Microservice bestätigt die Anpassung mit einer Erfolgsantwort (HTTP 200), übernimmt die neue Konfiguration auf Vertragsebene und setzt den Vertrag als angepasst. Außerdem wird das Dokument i155 erzeugt, und Vega, der Revenue Microservice sowie Nemesis werden benachrichtigt.

**Wiederholung der Signatur und angepasste Erfolgsseiten**

Schlägt die Signatur bei einem Transfer, einem Zahlerwechsel oder einer Verlängerung fehl, wird der Benutzer wie bei der Vertragserstellung auf eine Fehlerseite weitergeleitet. Dort steht eine Schaltfläche zur Verfügung, mit der sich die Signatur erneut auslösen lässt. Dafür wurde die bestehende Funktion zum erneuten Anstoßen der Signatur erweitert, sodass sie auch für Transfer, Zahlerwechsel und Verlängerung genutzt werden kann. Dabei wird abhängig vom laufenden Prozess die passende Funktion des Signaturdienstes aufgerufen.

Im monatlichen Ablauf wurde zudem die Erfolgsseite nach der Signatur überarbeitet. Bisher wurde dort immer angezeigt, dass der Vertrag aktiviert wurde. Der Text wird nun für jeden Ablauf passend angepasst.

**Qualitätssicherung (automatisierte Tests)**

Die automatisierten Tests für die Stornierung eines Vertrags im Status „Aktiv“ wurden umgesetzt. Sie prüfen, dass das Stornierungsdatum dem Vortag entspricht, Stornierungsgrund und Kommentar gespeichert und validiert werden und der Vertrag den Status „Storniert“ erhält. Außerdem wird kontrolliert, dass das tatsächliche Vertragsende dem Vortag entspricht, dass die Historie einen Eintrag zur Stornierung samt Grund und Kommentar enthält und dass der Vertragsstatus im Contract Management korrekt angezeigt wird.

Die Erweiterung der Tests für Sperrung und Reaktivierung ist noch offen. Geplant ist, diese auch für Commercial Customer und Commercial Fleet Customer abzudecken und die E-Mails für Sperrung und Reaktivierung in den jeweiligen Tests zu validieren.

**Hinweis zu Contract Review Profiles**

Die Möglichkeit, Contract Review Profiles auch für Transporter (Van) anzulegen, wurde nicht umgesetzt, da das zugehörige Vorhaben geschlossen wurde. Die Anlage ist derzeit weiterhin nur für Pkw möglich.