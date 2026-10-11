# Batch 360 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 21 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation – Neuerungen und Korrekturen**

Im Bereich Dokumente und Kommunikation wurden mehrere Verbesserungen an der Vorlagenverwaltung, den E-Mail-Vorlagen und der Dokumentenerstellung umgesetzt. Einzelne Punkte befinden sich noch in Prüfung oder Bearbeitung; sie sind unten entsprechend gekennzeichnet.

**Platzhalter und Druckvariablen**

Für E-Mail-Vorlagen steht ein Platzhalter für die Zahlungsart zur Verfügung. Zusätzlich wurde die neue Druckvariable „VersoID“ eingeführt. Die bestehenden Druckvariablen für technische Deckungen bzw. Optionen werden umbenannt: „contractTechnicalCoverages“ heißt künftig „contractTechnicalOptions“, und „contractTechnicalCoveragesProlonged“ heißt künftig „contractTechnicalOptionsAfterProlongation“. Die vom Vertrag übermittelte Bezeichnung bleibt dabei unverändert. Beide Variablen sollen in allen E-Mail-Vorlagen verfügbar sein. Diese Änderung befindet sich derzeit noch in der Qualitätsprüfung. Außerdem ist vorgesehen, neue Druckvariablen für die externe Vertragskennung und die Zahlungsreferenz anzulegen; dieser Punkt ist noch offen.

**Vorlage für den Produktvergleich**

Die Vorlage „Preisinformation“ wird für den Produktvergleich angepasst. Sie soll die Preisinformationen für Angebote enthalten, die auf ähnlichen Produktlinien beruhen. Ein Vergleich soll nur zwischen Angeboten für ähnliche Produktlinien möglich sein, etwa zwischen kontingentbasierten Produkten oder zwischen Produkten mit Laufleistung und Laufzeit. Eine Mischung dieser Typen ist nicht vorgesehen. Die Vorlage soll zusätzliche Angaben wie Zahlungsart, Kampagnenrabatte (zum Beispiel „Black Friday“ oder „Holiday Sales“, jeweils als eigene Zeile) sowie weitere Rabatte wie den Händlerrabatt enthalten. Trifft eine Angabe auf ein Produkt nicht zu, bleibt das Feld leer. Die Gültigkeit des Angebots sowie die Texte „Product comparison“ und „Product details“ entfallen, und die Elemente der Tabelle werden neu angeordnet. Dafür werden die Druckvariablen für den Gesamtpreis ohne Mehrwertsteuer, den Kampagnenbetrag, den Kampagnennamen und den Händlerrabatt angelegt. Bei Reifenprodukten werden im Bereich „Allgemeine Informationen“ reifenspezifische Angaben ergänzt.

**Massenerstellung von Verträgen**

Wenn für ein Dokument kein Kennzeichen vorliegt, wurde die entsprechende Zelle bisher nicht angezeigt. Wird nun statt „null“ eine leere Zeichenfolge übermittelt, erscheint auf den Dokumenten ein leeres Feld. Außerdem werden E-Mails zu Verträgen, die per Massenerstellung angelegt wurden, jetzt im Reiter „Kommunikation“ bereitgestellt.

**Behobene Fehler**

- Entwürfe von Dokumenten und E-Mails werden nun auch dann erstellt, wenn die Hauptvorlage zuerst gespeichert und anschließend veröffentlicht wird.
- Ein Entwurf einer E-Mail-Vorlage wird nicht mehr doppelt für dieselbe Sprache angelegt.
- Beim ersten Klick auf „Aktualisieren“ lieferte der Lieferant einen 500-Fehler; dies ist behoben.
- Die Komponente „Gültig ab“ in der Vorlagenverwaltung zeigte bei bestehenden Vorlagen „NaN“ bzw. „Invalid Date“ an; dies wurde korrigiert.
- In den Druckdialogen der Allgemeinen Geschäftsbedingungen für VAN wurden Leerseiten eingefügt; auch dies wurde behoben.
- Bei der Bestätigungs-E-Mail war das falsche Dokument unsigniert; dies wurde korrigiert.
- Dokumente werden nun auch für eine Gruppen-ID abgerufen.

**Darstellung und Systembenachrichtigungen**

Ein Hintergrundbild mit Sternenmuster und 2D-Logo wurde geprüft. Die Systembenachrichtigungen in der Vorlagenverwaltung wurden ebenfalls geprüft und sind bereits im Einsatz.