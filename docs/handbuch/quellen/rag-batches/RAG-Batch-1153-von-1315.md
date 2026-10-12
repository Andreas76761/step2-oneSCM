# Batch 1153 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Integration mit One Touch Retail (OTR) zum Abruf von Fahrzeugdaten**

Für Händler aller Divisionen (PC und VANS), die einen Servicevertrag mit einer Deal-ID anlegen, steht eine Integration mit One Touch Retail (OTR) zur Verfügung. Der Ablauf beginnt außerhalb von oneSCM: Kunde und Händler wählen in OTR das Fahrzeug aus, und in der OTR-Oberfläche wird eine Deal-ID erzeugt. Diese Deal-ID besteht aus 36 alphanumerischen Zeichen einschließlich Bindestrichen. Der Händler kopiert sie, öffnet oneSCM und fügt sie im Feld „Contract Proposal Identifier" ein.

Anhand der Deal-ID fordert die Vertragserstellung (Generation) die Fahrzeugdaten bei der Produktdomäne an. Die Produktdomäne liefert diese Daten entweder aus bereits in oneSCM vorhandenen Informationen oder durch einen Abruf bei OTR. Zu den Fahrzeugdaten gehören BM6, Marke, Division, Verkaufsbezeichnung, Fahrgestellnummer, SA-Codes sowie, falls vorhanden, VIN/FIN. Zusätzlich erhält die Vertragserstellung alle passenden Produkte und Preise. Auf dieser Grundlage kann ein Vertrag für die Deal-ID begonnen werden. Der Vertragsprozess läuft anschließend weiter, und der Kunde unterschreibt das Angebot, je nachdem, ob bereits eine Fahrgestellnummer vorliegt oder nicht.

Liefert OTR für eine Deal-ID mehrere Fahrzeuge zurück, behandelt das System auch diesen Fall. Da sich die Fahrzeugkonfiguration in OTR ändern kann, fragt die Produktdomäne regelmäßig per automatisiertem Batch-Job bei OTR die aktuellsten Fahrzeugdaten für bestehende Deal-IDs ab, die noch nicht in einem Vertrag abgeschlossen sind. Dazu zählen FIN/VIN sowie weitere in OTR verfügbare Daten wie das Datum der Erstzulassung und das Kennzeichen. Sobald im OTR-Datensatz eine Fahrgestellnummer vorhanden ist, werden die aktualisierten Daten an die Vertragserstellung übermittelt. Das Vorgehen entspricht dem bestehenden Ablauf für Bestellnummern. Ist OTR nicht erreichbar, was durch eine Verfügbarkeitsprüfung festgestellt wird, erhält die Vertragserstellung eine Fehlermeldung.

**Kampagnenverwaltung: Reaktivieren beendeter Kampagnen**

Bislang stehen bei Kampagnen mit dem Status „Finished" (beendet), unabhängig davon, ob sie noch in der Nachfrist (Grace Period) liegen oder nicht, die Aktionen Anzeigen, Bearbeiten, Duplizieren und Deaktivieren zur Verfügung. Künftig soll im Aktionsmenü zusätzlich die Aktion „Reaktivieren" für alle Kampagnen mit dem Status „Finished" oder „Deactivated" angeboten werden. Sie soll im Stil der vorhandenen Aktionen gestaltet und logisch im Dropdown-Menü der Ergebnistabelle platziert sein.

Beim Reaktivieren erzeugt das System eine neue Version bzw. Instanz der Kampagne mit dem Status „Created". Alle Felder werden mit den Daten der ursprünglichen Kampagne vorbelegt und sind bearbeitbar. Der Benutzer muss ein neues Gültig-von- und Gültig-bis-Datum angeben, bevor die reaktivierte Kampagne gespeichert oder eingereicht werden kann. Anschließend reicht er die Kampagne zur Prüfung ein, und sie durchläuft verpflichtend das Vier-Augen-Freigabeverfahren. Das System protokolliert die Reaktivierung und verknüpft dabei die ID der neuen Kampagne mit der ID der ursprünglichen, damit der Verlauf nachvollziehbar bleibt.

**Aktualisierung der Menüstruktur in Contract Generation und MO Checks**

Im Bereich Contract Generation sind die Einträge „Contract Proposal" und „Proposal Management" vorgesehen. Im Bereich MO Checks ist der Eintrag „MO Checks Verification" vorgesehen. Diese Änderungen sind zu überprüfen.

**Produkte für Leasing: Umgang mit Kampagnen**

Wird eine externe Kampagnen-ID (extCampaignId) übergeben, die zu keiner aktiven Kampagne für das angefragte Produkt passt, wird sie nicht angewendet. Wird dagegen eine gültige extCampaignId übergeben, die einer aktiven Kampagne des Produkts entspricht, wird die Kampagne auf den Preis angewendet und in der Antwort berücksichtigt.

**Begrenzung von Reifengrößen**

Bei der Preisermittlung für ein BM6-Produkt wird die Matching-Regel unabhängig von der TO- und SA-Code-Logik auf „None Must Match" überschrieben und so an die Vertragserstellung übermittelt. Dieses Verhalten ist zu überprüfen.