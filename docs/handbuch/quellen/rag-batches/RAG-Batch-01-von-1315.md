# Batch 1 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 32 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeugverwaltung: Änderungen und Korrekturen**

In der Fahrzeugverwaltung wurden zahlreiche Fehler behoben und Abläufe angepasst, insbesondere rund um Laufleistungsprognosen, Werkstattrechnungen, Produkt- und Preiskonfiguration sowie die Vertragserstellung.

**Laufleistung und Werkstattrechnungen**

Im regulären Review-Batch-Ablauf wird nicht mehr über die Schnittstelle createMileageHistory eine weitere Laufleistungsprognose angelegt. Stattdessen wird die Schnittstelle getMileageProjection aufgerufen, die die Prognose für das jeweilige Fahrgestell automatisch berechnet. Außerdem wurde korrigiert, dass die Laufleistung einer Werkstattrechnung nicht erfasst wurde, wenn bereits eine höhere Laufleistungsprognose vorlag. Ebenfalls behoben ist, dass ein Vertrag nach der Annahme einer Werkstattrechnung nicht den Status „abgelaufen nach Laufleistung“ erhielt. Zudem wurden fehlende Anforderungen aus der Prognose ergänzt. Der Fehler, dass bei manuell erfassten Werkstattrechnungen ein falsches Datum in der Laufleistungshistorie erscheint, ist derzeit noch Gegenstand der Abnahmetests, die aktuell blockiert sind. Die korrekte Sortierung nach Datum bzw. Zeitstempel wurde bereits bestätigt.

**Preis- und Produktverwaltung**

Ein Cluster für den relativen Basispreis lässt sich nicht mehr mit einem leeren Preisfaktor einreichen. Behoben wurden außerdem ein unerwarteter Fehler beim Abrufen von Produkten sowie eine Ausnahme beim Zusammenführen von Dokumenten im Ablauf der Produkterstellung. Auch die Batch-Jobs von CePrO für PKW und Transporter (Van) laufen wieder fehlerfrei. Das Einreichen eines Preis-Clusters zur Prüfung ist derzeit nicht möglich; die Behebung ist noch nicht begonnen.

**Verträge, Vorlagen und Deckungscodes**

Bei der Erstellung eines Vertragsangebots werden Dokumente nun wieder korrekt generiert. Beim Anlegen eines Deckungscodes tritt die Fehlermeldung „Authentifizierung verboten“ im Zusammenhang mit der Marktspezifität nicht mehr auf. Technische Optionen lassen sich wieder bearbeiten.

**Erfassung und Validierung von Kennungen**

Die Eingabe einer Verso-ID löst keinen Fehler mehr aus. Bei der Massenerstellung bleibt die Validierung nicht mehr im Status „Wird verarbeitet“ hängen, wenn eine Kennung zum ersten Mal verwendet wird.

**Geplante Erweiterungen**

Noch offen und nicht umgesetzt sind eine systembasierte Umrechnung von Kilometern in Meilen, eine vollständige Integration von VerSO, eine ISP-Code-Prüfung für Modellcode und SA-Code sowie die manuelle Ergänzung der Fahrgestellnummer bei Verträgen, die über eine Deal-ID oder Order-ID erzeugt wurden.

**Nicht weiterverfolgte Punkte**

Einige gemeldete Probleme wurden abgebrochen oder geschlossen. Dazu zählen unter anderem Meldungen zur Fehleranzeige in der Laufleistungshistorie nach der Verarbeitung einer Werkstattrechnung, zu VEGA-Claims-Einträgen, zur Fehlermeldung beim Wechsel der Kostenstelle auf „Kunde“, zu fehlenden Daten nach einer MIC-Synchronisation sowie zur Anlage von Deckungscodes durch Nutzer mit Zugriff auf die Schaltfläche „Erstellen“. Ebenso geschlossen wurden Meldungen zur MO-Prüfung der Fahrgestellnummer, zu einem nicht gefundenen Fahrzeug bei der Vertragserstellung, zu ISP-Informationen mit OTR-Deal-ID, zu einem falschen Motortyp bei der AFAB-Order-ID sowie Anpassungswünsche an Tabellenüberschriften der Modellcode-Suche und an die Blueprint-Bannerinformationen im Assistenten zur Produkterstellung.