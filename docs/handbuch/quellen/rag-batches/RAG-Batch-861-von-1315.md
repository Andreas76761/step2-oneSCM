# Batch 861 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung in oneSCM**

Der Bereich Vertragsverwaltung bietet eine übersichtliche und benutzerfreundliche Oberfläche, über die Sie die Details eines bestimmten Vertrags einsehen und verwalten können. Er richtet sich an Power User (die Zielgruppe ist noch zu bestätigen). Die Daten stehen in oneSCM zur Verfügung, sobald ein Vertrag angelegt wurde. Voraussetzung für die Anzeige der Daten ist daher, dass der Vertrag erstellt wurde und ausgewählt werden kann. Wenn es erforderlich ist, können Sie einen Vertrag zudem aktiv bearbeiten, zum Beispiel aussetzen, beenden, stornieren oder reaktivieren. Die Gestaltung folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Einstieg und Zugriff**

Die Vertragsverwaltung ist für Verträge vorgesehen, die den Status „ACTIVE“ haben, nachdem sie die Stufen „CREATED“ und „CONFIRMED“ durchlaufen haben. Ein Vertrag gilt als aktiv, wenn Mercedes-Benz ihn aus operativen und finanziellen Gründen für einen Kunden bestätigt hat. In der ersten Ausbaustufe (PI1) wird ein Vertrag automatisch auf „ACTIVE“ gesetzt, sobald er den Status „CONFIRMED“ erreicht. Um einen Vertrag zu öffnen, melden Sie sich mit den entsprechenden Berechtigungen an und wählen den gewünschten Vertrag aus. Anschließend wird die Übersicht angezeigt.

Hinweis: Eine eigene Einstiegsseite der Vertragsverwaltung, über die alle aktiven Verträge angezeigt und ausgewählt werden können, wurde als Anforderung zwar beschrieben, jedoch nicht umgesetzt (Status: abgebrochen). Die Beschreibung dieser Seite sollte daher nicht als verfügbare Funktion verstanden werden.

**Aufbau der Übersicht**

Die Übersicht gliedert sich in drei Bereiche. Der Kopfbereich enthält eine Zurück-Schaltfläche, die Sie zur Vertragsauswahl führt. Außerdem zeigt er die Vertragsnummer an, die bei der Vertragserstellung in BS2 vergeben wurde, sowie den aktuellen Kontostand aus der Schnittstelle i156 als „Current balance Account“. Ein farbiger Punkt kennzeichnet den Kontostand: Grün steht für einen positiven Betrag, Grau für den Betrag 0 und Rot für einen negativen Betrag. Über das Statusfeld ändern Sie den Status des aktuellen Vertrags; zur Auswahl stehen „Terminate Early“, „Reactivation“ und „Suspend“.

Darunter befindet sich ein permanenter Kopfbereich, der auf allen Seiten der Vertragsverwaltung sichtbar bleibt. Er zeigt den Kundennamen, den Vertragsstatus, die Vertragslaufzeit mit Start- und Enddatum sowie der Differenz zwischen beiden, den Produktnamen, die Verkaufsbezeichnung und die Fahrgestellnummer.

Der dritte Bereich sind die Registerkarten der Vertragsdetails: Contract, Vehicle, Customer, Contract, Payment, History und Documents.

**Registerkarte „Contract“: Vertragsdaten**

Auf der Registerkarte „Contract“ werden folgende Informationen angezeigt:

Die jährliche Fahrleistung (Annual Vehicle Mileage) ergibt sich aus der Gesamtfahrleistung geteilt durch die Vertragslaufzeit. Der Kilometerstand bei Vertragsbeginn (Mileage at Contract Start) wird im MVP mit „0“ angezeigt. Die geplante Gesamtfahrleistung (Planned Total Mileage) beruht auf der Gesamtfahrleistung, die bei der Vertragserstellung festgelegt wurde; sie wird aus den Kilometern pro Jahr multipliziert mit der Vertragslaufzeit berechnet. Die tatsächliche Fahrleistung bei Vertragsende (Real Mileage at Contract End) wird als Kilometer pro Jahr multipliziert mit der Vertragslaufzeit dargestellt. Bei allen Fahrleistungsangaben wird die marktspezifische Einheit ergänzt: in Deutschland „Km“, in Großbritannien „Mi“.

Das Vertragsstartdatum (Contract Start Date) entspricht dem Erstellungsdatum des Vertrags. Das geplante Vertragsende (Contract Planned End Date) errechnet sich aus dem Startdatum zuzüglich der Vertragslaufzeit. Beide Datumsangaben erscheinen im marktspezifischen Format TT.MM.JJJJ.

Die Vertragslaufzeit wird in Monaten angegeben, mit dem Zusatz „months“ hinter der Zahl. Sie wird sowohl als geplante Laufzeit (Contract Duration, Planned) als auch als tatsächliche Laufzeit (Contract Duration, Real) angezeigt; beide basieren auf der bei der Vertragserstellung festgelegten Laufzeit.

**Bearbeitung und Nachvollziehbarkeit**

Für alle Felder gibt es eine Versionierung. Die Bearbeitungsmöglichkeit für mehrere Felder steht erst nach dem MVP zur Verfügung. Dies betrifft die jährliche Fahrleistung, den Kilometerstand bei Vertragsbeginn, die tatsächliche Fahrleistung bei Vertragsende, Start- und Enddatum sowie die tatsächliche Vertragslaufzeit. Alle Änderungen werden mit einer Begründung gespeichert und im Änderungsprotokoll beziehungsweise im Bereich „History“ angezeigt. Änderungen werden außerdem für die Erzeugung der Schnittstelle i155 gekennzeichnet.