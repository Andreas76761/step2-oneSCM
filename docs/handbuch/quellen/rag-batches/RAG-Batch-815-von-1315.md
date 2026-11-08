# Batch 815 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung (Contract Management)**

In der Vertragsverwaltung wurden mehrere Korrekturen und Erweiterungen umgesetzt. Wird ein Vertrag beendet, zeigt die Oberfläche nun nicht mehr fälschlicherweise die Schaltfläche „Action“ an. Außerdem wurde die Übertragung eines Vertrags (Transfer) überarbeitet, da sie zuvor nicht korrekt funktionierte. Beim Wechsel des Zahlers (Change payer) gilt nun eine Datumsbeschränkung für Zeitpunkte nach dem letzten Verfügbarkeitstag des Vertrags.

Neu geregelt ist auch die Anzeige des Kilometerstands im Reiter „Vehicle“. Bisher zeigten die Angabe „Mileage at Contract Start (Km)“ im Reiter „Contract“ und der „Actual Mileage (Km)“ im Reiter „Vehicle“ denselben Wert, nämlich den Wert aus dem Feld „Actual Mileage“ in Schritt 1 der Vertragserstellung. Das Feld im Reiter „Vehicle“ heißt künftig „Last Known Mileage (Km)/Date“. Bis zum Eingang der ersten Werkstattrechnung über die Schnittstelle i156 aus VEGA zeigt es weiterhin den in Schritt 1 erfassten Wert. Sobald die erste Werkstattrechnung eingeht, wird das Feld mit dem aus VEGA übermittelten Kilometerstand und dem Datum aktualisiert, an dem dieser Stand bei der Werkstattleistung erfasst wurde, zum Beispiel „10.000 (Km)/16.05.2024“. Technisch geschieht dies, indem nach dem Import von i156 der neue letzte Service-Kilometerstand an die Vertragsverwaltung gesendet und dort verarbeitet wird. Wird der „Mileage at Contract Start (Km)“ nach der Aktivierung geändert, bleibt der Kilometerstand im Reiter „Vehicle“ unverändert, sofern die erste Werkstattrechnung bereits über i156 eingegangen ist. Das Feld „Chassis Number“ kann im Reiter „Vehicle“ entfallen, da die Fahrgestellnummer bereits im statischen Kopfbereich der Vertragsdetails angezeigt wird.

**Nicht umgesetzte Vorhaben**

Einige geplante Themen wurden nicht weiterverfolgt und sind abgebrochen worden. Dazu gehören ein Test zur Übertragung von Einmalzahlungsverträgen, die vorgesehene CAS-Prüfung des neuen Eigentümers bei Einmalzahlungsverträgen sowie die Übertragung von Verträgen zwischen Geschäftskunden (B2B-Transfer). Ebenfalls abgebrochen wurde die Behebung eines internen Serverfehlers, der beim Aufrufen des Reiters „History“ auftrat.

**Noch offen**

Offen ist die Prüfung in der Vertragserstellung, ob die Verlaufstabelle (History) nach einer Änderung des Vertragsstatus korrekt aktualisiert wird. Das betrifft die Status „Rejected“, „Waiting for Activation“, „Waiting for Confirmation“ und „Confirmed“.