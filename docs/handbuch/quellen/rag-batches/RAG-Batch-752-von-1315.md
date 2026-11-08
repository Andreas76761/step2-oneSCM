# Batch 752 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 19 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsmanagement: Änderungen und Korrekturen**

Im Bereich Vertragsmanagement wurden zahlreiche Fehler behoben und Abläufe verbessert. Die Änderungen betreffen vor allem Verlängerungen, Kündigungen, Zahlungsinformationen und den Dokumentenbezug.

Bei der Vertragsverlängerung wurden mehrere Probleme beseitigt. Wird bei einer komplexen Reifenverlängerung die Reifenoption mit optionalen Deckungen aktualisiert, wird der Reifenpreis nun korrekt angezeigt und nicht mehr der volle Preis. Der Versand der Verlängerungs-E-Mail aus der Übersicht ist an die Option „Benachrichtigung erforderlich“ geknüpft; diese Änderung wurde im Abnahmetest (BAT) bestätigt. Außerdem wird im Zahlungs-Tab der Verlängerungszeitraum nun nicht mehr fehlerhaft dargestellt.

Bei Kündigungen zeigt das Datums-Widget jetzt die Kündigungspufferfrist an. Ein flackerndes Informationsbanner wurde ebenfalls behoben. Die Kündigung auf Basis des Schadenservice-Typs „12“ ist noch offen und wurde bislang nicht umgesetzt.

Im Bereich Zahlung und Dokumente wurden die Fehlermeldungen beim Hinzufügen einer Zahlungsreferenz zu einem Vertrag sowie die Änderung der Zahlungsart für Verträge bearbeitet. Bei vorzeitiger Ablösung war der Dokumentname in der Kommunikationshistorie leer; auch dieses Problem wurde bearbeitet. Gleiches gilt für ein Problem mit einem umbenannten Fahrzeugregistrierungsdokument. Bei der Unterschrift vor Ort wurde ein Fehler im optimistischen Sperren (Optimistic Locking) korrigiert.

Für die I155-Schnittstelle wurde ein Fehler behoben: Nach Ausführung des Jobs i155ToVegaEXPAllContracts wurde keine I155-Datei erstellt. Ein neuer Auslöser für die Erstellung eines I155-Updates ist noch offen. Für zugewiesene Händlerbetriebe wurden zudem Datenbankänderungen vorgenommen.

Einige Punkte wurden nicht weiterverfolgt: Der fehlende Ablauf-Eintrag im Historien-Tab und die nicht mehr bereitgestellte Reifenoption aus einem komplexen Produktvertrag nach der Verlängerung wurden abgebrochen.

Noch offen sind die Themen „Suspension: Manuell vs. Automatisch“ und „Contract Transfer Revival“. Für beide liegen bislang nur Vorlagen ohne inhaltliche Beschreibung vor, sodass sich zu Umfang und Verhalten noch keine Aussagen treffen lassen.

Zusätzlich befindet sich ein Grundgerüst für automatisierte End-to-End-Tests im Entwicklungs-Backlog. Es soll Playwright-Tests in den Umgebungen DEV, INT, PRE-PROD und LOCAL ausführen. Vorgesehen sind die Überführung freigegebener Testfälle aus Gherkin in Playwright-Schritte mit Übergabe an Xray, eine Git-Struktur für die erzeugten Tests, Umgebungskonfigurationen über .env-Dateien und die Variable TEST_ENV sowie die Zuordnung der Module zu den passenden Testsuiten. Hinzu kommen eine CI-Anbindung über GitHub Actions mit verpflichtender Prüfung vor dem Zusammenführen sowie Berichte über Allure und JUnit-XML-Ergebnisse für Xray. Wünschenswert wären eine Toleranz gegenüber instabilen Tests (Wiederholungen) und die lokale Ausführung.