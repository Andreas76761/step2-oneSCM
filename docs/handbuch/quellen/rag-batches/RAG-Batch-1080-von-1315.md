# Batch 1080 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

Bei der Erstellung eines Vertrags erfassen Sie zunächst die Fahrzeugdaten, wählen anschließend ein Produkt aus und konfigurieren es. Danach geben Sie die Kundendaten ein. Das Datum der Erstzulassung wird nach der Auswahl im Format Tag - Monat - Jahr angezeigt. Wenn eine der eingegebenen Fahrzeugangaben nicht gültig ist, etwa weil die Kombination aus Fahrgestellnummer, Erstzulassung und Laufleistung nicht passt oder bereits für eine Vertragserstellung verwendet wurde, erscheint eine passende Hinweismeldung (Toast-Meldung). Eine allgemeine Fehlermeldung „Bad Request“ soll dadurch vermieden werden. Dies gilt auch, wenn ein Fahrzeug mit der angegebenen Laufleistung nicht gefunden wird.

Nach der Fahrzeugeingabe werden die verfügbaren Produkte samt Liste der zugehörigen Deckungsumfänge (Coverage-Codes) als Coverage Details angezeigt. Auf der Seite mit den Kundendaten werden die auszufüllenden Felder übersichtlich dargestellt. Im Bereich der Zahlungsinformationen des Kunden akzeptiert das Feld für den Kontoinhaber mehrere durch Leerzeichen getrennte Wörter, zum Beispiel zwei Vornamen oder mehrere Nachnamen, wobei die zulässige Zeichenanzahl des Feldes eingehalten wird.

Die Eingaben werden geprüft. Existiert bereits einer der Werte, etwa die Umsatzsteuer-ID oder der Kunde, erscheint eine entsprechende Hinweismeldung. Sie können das betreffende Feld dann ändern und die Angaben aktualisieren. Sind alle Pflichtfelder ausgefüllt und die automatischen Prüfungen erfolgreich, wird die Vertragserstellung fortgesetzt und eine Vertragsnummer vergeben. Nach dem Klick auf „Weiter“ wird die Übersichts- und Bestätigungsseite angezeigt. Ein Vertrag wird zudem auch dann angelegt, wenn die Vorlage fehlt.

Auf der Übersichtsseite eines erstellten Vertrags sind alle Elemente wie Felder, Kontrollkästchen, Schaltflächen und Auswahllisten unabhängig vom eingestellten Zoom der Seite sichtbar. Das gilt insbesondere für das Kontrollkästchen „I have read and agree to the Terms and Conditions“, dessen Bestätigung vor der Vertragsbestätigung erforderlich ist. Bei Statusmeldungen an den Kundenservice, die über Kafka-Events versendet werden, wurden fehlerhafte Status korrigiert.

**Schnittstellendatei i155**

Für die Übermittlung wird eine i155-Datei erzeugt. Dafür gelten folgende Vorgaben; der Fokus liegt im MVP auf den Pflichtsätzen RC01, RC05 und RC20.

Der Zeitstempel in RC01, RC05 und RC20 beginnt mit Position 30, und zwischen Tag und Uhrzeit steht ein Leerzeichen. Die optionalen Satzarten RC10, RC15, RC16, RC17, RC18 und RC80 werden nicht in die Datei geschrieben. Entfallen diese, erhalten in RC01 die Positionen 71-79, 89-97, 98-106, 107-115, 116-124 und 125-133 den Wert 0.

In RC05 gilt: Das Process Indicator (Position 62) enthält für den MVP immer den Wert 1. Die Verwendung (Position 149-150) und der Kraftstofftyp (Position 151-152) enthalten jeweils *. Die Positionen 80-90 und 151-152 sind linksbündig ausgerichtet.

Für jeden Coverage-Code wird ein eigener Satz RC20 erzeugt: Maintenance (MAINTEN), General Wear & Tear (WEAR_MAIN), Vehicle Wear and Tear (WEAR_VEH), Parts Warranty (W_PT), Vehicle Warranty (W_VEH) und Residual Warranty (W_RESIDUE). In RC20 gilt außerdem:

Die Service-Vertragsnummer steht linksbündig auf den Positionen 13-27 in allen Satzarten. Der Coverage-Code auf den Positionen 62-65 enthält das Attribut aus der Produktdefinition: P001 für Maintenance, P002 für General Wear & Tear, P003 für Vehicle Wear & Tear, P004 für Parts Warranty, P005 für Vehicle Warranty und P006 für Residual Warranty. Zwischen den Positionen 62-65 und 66-97 steht kein Leerzeichen. Die Positionen 105-111 und 112-118 übernehmen den Inhalt aus RC05, Position 123-129 (geplante Endlaufleistung). Die reale Endlaufleistung der Deckung (Positionen 112-118) enthält eine Zahl, die sich aus dem Laufleistungsstand zu Vertragsbeginn plus Vertragsdauer multipliziert mit der jährlichen Fahrleistung ergibt. Beispiel: 60.000 plus 3 Jahre mal 30.000 ergibt 150.000. Das Enddatum des Deckungsplans (Positionen 127-134) ist ein Pflichtfeld und zeigt denselben Wert wie das geplante Vertragsende in RC05, Position 99-106.