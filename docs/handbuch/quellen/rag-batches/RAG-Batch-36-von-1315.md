# Batch 36 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Änderungen und geplante Architekturthemen**

Im Bereich Revenue Management wurden mehrere Korrekturen rund um Gutschriften abgeschlossen. Gutschriften vom Typ CCIN, die aus der Stornierung einer WSIN-Rechnung entstehen, werden nun korrekt im Kundenfinanzdokument angezeigt. Außerdem lässt sich eine solche CCIN-Gutschrift, die aus einer WSIN-Stornierung erzeugt wurde, jetzt annehmen. Zudem erhält eine nach einer Stornierung erzeugte Gutschrift nun eine oneSCM-Dokumentnummer.

Für die vorzeitige Ablösung (Early Settlement) aus einem Vertrag wurde die Benachrichtigungs-E-Mail angepasst: Sie enthält keinen Zahlungslink mehr, da dieser in diesem Fall nicht benötigt wird. Diese Änderung wurde im Business Acceptance Test bestätigt.

Darüber hinaus sind mehrere Architekturthemen für das Revenue Management erfasst, die sich noch im Status „Offen“ befinden. Zu den Details liegen bislang keine Angaben vor, sodass sich zu Umfang, Nutzen und Zeitplan noch keine Aussagen treffen lassen. Vorgesehen sind folgende Vorhaben:

- Es soll eine Funktion entstehen, mit der sich die Verarbeitung eingehender Dateien für verschiedene Schnittstellen abschalten lässt.
- Zwischen den Services Revenue, Payment Hub, File Scanner, Contract, Customer, Product und Configuration sollen Contract-Tests ergänzt werden.
- Alle Abläufe in Mpay sollen überprüft und verbessert werden.
- Es sollen automatisierte Unit-Tests eingeführt werden, die erzeugte Dateien validieren, und zwar sowohl deren Struktur als auch die Werte an bestimmten Positionen.
- Die Upload-Ordnerpfade und die dynamischen Anteile für Batch-Jobs sollen überarbeitet werden (Refactoring).
- Sämtliche Tests sollen überarbeitet und ausschließlich auf Spring-Boot-Integrationstests umgestellt werden.
- Es soll ein Validator für den Rechnungsstatus entstehen, der sich am jeweiligen Rechnungstyp orientiert.

Diese Architekturthemen sind noch nicht umgesetzt und haben daher derzeit keine Auswirkungen auf die tägliche Arbeit mit dem System.