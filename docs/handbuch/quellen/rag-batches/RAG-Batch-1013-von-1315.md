# Batch 1013 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation: Build-to-Stock-Ablauf**

Bisher konnten Händler einen Servicevertrag nur für Fahrzeuge erstellen, die bereits einen Halter haben und genutzt werden können, also über eine Fahrgestellnummer, ein Erstzulassungsdatum und einen Kilometerstand verfügen. Mit dem neuen Build-to-Stock-Ablauf können Händler Serviceverträge auch für Fahrzeuge verkaufen, die auf Lager stehen (beim Händler oder bei Mercedes-Benz) und noch nicht zugelassen sind. Der Vertrag wird aktiv, sobald das Fahrzeug zugelassen ist und die Zulassung auch im Mercedes-System vorliegt. Voraussetzung ist, dass das Fahrzeug eine Fahrgestellnummer hat, aber noch kein Erstzulassungsdatum, da es noch nicht auf einen Halter zugelassen wurde. Als Kilometerstand gilt standardmäßig 0.

**Vertragserstellung**

Der Händler startet die Vertragserstellung und wählt in der Ablaufauswahl die Option „Build to Stock“. Anschließend gibt er die Fahrgestellnummer als Pflichtfeld ein. Der Kilometerstand ist mit 0 km vorbelegt. Mit der Fahrgestellnummer wird eine Anfrage an die Vertragsberechnung gesendet. Die Antwort enthält die zu den Eingabedaten passenden Preise, Kampagnen und Produkte; dabei werden die Fahrgestellnummer, ein Kilometerstand von 0 und der Neuwagenstatus berücksichtigt.

Der Händler wählt das Produkt aus und konfiguriert es (Laufzeit, jährliche Fahrleistung, Zahlungsintervall). Optional kann er eine Rabatt- und/oder Karenzzeitkampagne anwenden. Danach erfasst er die Kunden- und Zahlungsinformationen mit allen Pflichtfeldern und gelangt zur Übersicht und Bestätigung.

**Übersicht und Bestätigung**

Dort werden die automatischen Prüfungen durchgeführt, mit Ausnahme der Prüfung des Erstzulassungsdatums. Es wird eine Vertragsnummer vergeben, und der Vertrag wird mit einer neuen Vorlage erzeugt, die kein Erstzulassungsdatum, kein Startdatum und kein Kennzeichen enthält. Der Vertrag erhält den Status „Erstellt“, und der Kunde wird benachrichtigt. In der Anzeige bleiben Erstzulassungsdatum und Kennzeichen leer. Beim Vertragsbeginn und bei der Laufzeit erscheint der Hinweis „Will be updated when FRD is available“. Mit der Bestätigung wird die DSS-Erfassung ausgelöst, und der Vertrag erhält den Status „Bestätigt“.

**Vervollständigung nach der Zulassung**

Sobald der Halter das Fahrzeug zugelassen hat und das Erstzulassungsdatum vorliegt, bittet er den Händler, den Servicevertrag zu vervollständigen. Der Händler ruft die Landingpage der Vertragserstellung auf, sucht den Vertrag und klickt in der Spalte „Aktion“ auf „Update“. Es öffnet sich ein Dialogfenster mit den beiden Pflichtfeldern Erstzulassungsdatum und Kennzeichen. „Cancel“ schließt das Fenster und bricht die Aktualisierung ab, „Update“ übernimmt die Angaben in den Vertrag. Das Vertragsstartdatum wird dabei nicht manuell erfasst, sondern automatisch aus dem Erstzulassungsdatum aktualisiert.

**Aktivierung**

Mit „Update“ wechselt der Vertrag in den Status „Wartet auf Aktivierung“. Dadurch werden die Abfrage der SEPA-Mandatsgültigkeit und der SAP-Debitorennummer ausgelöst. Weitere automatische Prüfungen sind in diesem Schritt nicht mehr erforderlich. Ist eine der Prüfungen nicht in Ordnung, wird dies an die Market Operations gemeldet, und der Vertrag bleibt im Status „Wartet auf Aktivierung“, bis die Market Operations eine Entscheidung getroffen haben. Sind alle Prüfungen in Ordnung, wird der Vertrag aktiviert und erhält den Status „Aktiv“. Anschließend wird die i155-Meldung erzeugt und an Vega gesendet, und der Vertrag wird im Vertragsmanagement angezeigt. Laut den Abnahmekriterien werden zudem eine Benachrichtigung an das Revenue Management sowie eine Benachrichtigung an den Kunden mit der neuen Vorlage versendet. Als Voraussetzungen für die Aktivierung nennen sie, dass DSS erfasst, die CAS-Prüfung in Ordnung, die SAP-Debitorennummer vorhanden und die SEPA-Mandatsgültigkeit in Ordnung ist.

**Gestaltung**

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.