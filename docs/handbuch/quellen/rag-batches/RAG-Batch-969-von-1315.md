# Batch 969 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Wiederaufnahme abgelehnter Angebote**

Bisher gilt: Sobald ein Angebot den Status „Abgelehnt" („Rejected") erreicht hat, lässt es sich nicht mehr reaktivieren. Mit der Erweiterung der manuellen Vertragserfassung können Nutzer mit der Rolle MPC oder MO den Aktivierungsprozess abgelehnter Angebote nun wieder aufnehmen. Das soll die Kundenzufriedenheit verbessern und eine erfolgreiche Vertragsaktivierung sicherstellen.

Die Wiederaufnahme ist nur in bestimmten Fällen möglich: wenn das Angebot abgelehnt wurde, weil die in den Markteinstellungen definierte Angebotsgültigkeit abgelaufen ist, weil bereits ein bestätigtes Angebot oder ein aktivierter Vertrag für dieselbe FIN/VIN existiert, oder weil eine Anfrage zur Grace-Period-Kampagne nicht beantwortet wurde. Verträge, die wegen eines positiven CAS-Ergebnisses abgelehnt wurden, können nicht wieder aufgenommen werden.

Um ein abgelehntes Angebot wieder aufzunehmen, öffnen Sie in der Angebotsverwaltung (Proposal Management) ein Angebot mit dem Status „Abgelehnt". Entspricht der Ablehnungsgrund einem der oben genannten Fälle, steht die Schaltfläche „Status" mit der Option „Resume" zur Verfügung. Bei allen anderen Ablehnungsgründen wird das Angebot unverändert und ohne diese Schaltfläche angezeigt.

Wählen Sie „Resume", öffnet sich das Fenster „Resume Activation". Dort ist im Pflichtfeld „Reason for Request" eine Begründung einzutragen. Mit der Schaltfläche „Resume Activation" setzen Sie den Aktivierungsprozess fort. Über „Cancel" oder das „x" schließen Sie das Fenster, ohne dass Änderungen vorgenommen werden.

Nach der Wiederaufnahme wird der Status des Angebots auf den Status vor der Ablehnung zurückgesetzt, zum Beispiel „Created" oder „Waiting for Confirmation". In der Historie wird die Änderung protokolliert: geändertes Objekt (Status), Grund („Activation process restarted"), alter Wert („Rejected"), neuer Wert (der Status vor der Ablehnung), das Datum der Wiederaufnahme und die Benutzer-ID des ausführenden MPC bzw. MO. Zudem wird die Angebotsgültigkeit gemäß den aktuellen Markteinstellungen aktualisiert. Der Aktivierungsprozess läuft anschließend im vorgesehenen Ablauf weiter, wobei alle angewendeten Rabatte, Kampagnen, Optionsabdeckungen und technischen Optionen erhalten bleiben. Design und Grafiken entsprechen dem Mercedes-Benz Workbench.

**Mehrere aktive Verträge je Fahrgestellnummer und MO-Prüfung**

Bisher war pro Fahrgestellnummer (FIN/VIN) nur ein aktiver Vertrag zulässig. Wurde ein Angebot für eine Fahrgestellnummer mit aktivem Vertrag angefragt, erschien eine Fehlermeldung. Wurden mehrere Verträge angelegt, aber nicht bestätigt, setzte die Bestätigung eines Vertrags alle anderen Verträge dieser Fahrgestellnummer automatisch auf „Abgelehnt".

Künftig unterstützt das System Angebote für Fahrgestellnummern, die bereits einem aktivierten oder bestätigten Servicevertrag zugeordnet sind. So können Kunden mehrere Serviceverträge mit unterschiedlichen Leistungsumfängen abschließen, etwa zur Unterstützung des Reifenverkaufs. Dies steht Händlern, MO und MPC offen, sofern für die Fahrgestellnummer bereits ein aktivierter oder bestätigter Servicevertrag existiert.

Der Ablauf: Sie melden sich in oneSCM an und öffnen den Bereich „Contract Proposal". Dort geben Sie die Fahrgestellnummer ein und rufen die verfügbaren Produkte ab. Anschließend wählen und konfigurieren Sie ein Produkt und erfassen Kunden- und Zahlungsdaten. Nach der Datenerfassung prüfen Sie das Angebot in der Vorschau und wählen eine Signaturmethode, mit der der Kunde das Angebot unterzeichnet. Danach prüft das System, ob die Fahrgestellnummer bereits mit einem bestätigten oder aktivierten Vertrag verbunden ist.

Existiert ein solcher Vertrag, bleibt dessen Status „Confirmed" unverändert. Das System führt dann MO-Prüfungen durch und setzt ein Kennzeichen für die Kategorie-Produktprüfung (Category Product Check) mit dem Status „Not Ok". Als Grund wird „Please check compatibility with existing contract!" angezeigt, inklusive eines Hyperlinks zur Detailansicht des bestehenden Vertrags. Der neue Vertrag kann nicht automatisch aktiviert werden. Der MO prüft die Produkte auf Kompatibilität und entscheidet manuell, ob die Aktivierung fortgesetzt wird. Existiert kein bestätigter oder aktivierter Vertrag, läuft die Aktivierung weiter und das MO-Prüfkennzeichen wird auf „Ok" gesetzt.