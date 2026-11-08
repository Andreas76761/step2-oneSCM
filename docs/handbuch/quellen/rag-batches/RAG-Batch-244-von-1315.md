# Batch 244 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Fehlerbehandlung für NEMESIS-Ereignisse**

Für die Übermittlung von Daten an NEMESIS gibt es in oneSCM jetzt eine Behandlung von Validierungsfehlern. NEMESIS prüft die von oneSCM gesendeten Ereignisse auf Daten und deren Beziehungen untereinander und meldet dabei fachliche Fehler. Ein Teil dieser Fehler lässt sich vermeiden, wenn die Daten bereits vor dem Versand geprüft werden. oneSCM validiert deshalb die Ereignisse zu Kunde, Vertrag, Umsatz und Kosten, bevor sie erzeugt werden. Erfüllen die Daten die Anforderungen nicht, wird das jeweilige Ereignis nicht an NEMESIS gesendet. Stattdessen wird der Fehler in Datadog und in der Datenbank protokolliert und in der Benutzeroberfläche angezeigt. Die Validierung behebt die Ursache nicht selbst: Ein Benutzer muss die Daten in Vertrag, Kunde, Umsatz oder Kosten korrigieren.

Geprüft werden unter anderem Pflichtfelder (zum Beispiel Ländercode, Fahrgestellnummer, Vertragsnummer, Kundennummer, Vertragsstart und geplantes Vertragsende), gültige Ländercodes gemäß Marktkonfiguration, die Länge der Fahrgestellnummer (17 Zeichen) und das Fehlen von Sonderzeichen. Außerdem werden Datumsformate, die zeitliche Reihenfolge von Vertragsdaten sowie Kilometerstände geprüft. Bei Umsatzereignissen werden zusätzlich Währung, Zahlungsart und Beträge kontrolliert. Bei Kostenereignissen muss das Reparaturdatum innerhalb der Vertragslaufzeit liegen.

Die Fehler verwalten Sie im Admin-Bereich unter dem Menüpunkt NEMESIS. Der Bereich steht der Rolle Market Operation User (2nd Level Support) zur Verfügung und enthält je einen Reiter für die Ereignisse Vertrag, Kunde, Umsatz und Kosten. Die Suchkriterien gelten für alle Reiter gleichzeitig. Sie können nach dem Datum des ersten Auftretens (Einzelauswahl), nach der Vertragsnummer, nach der Fehlerart und nach dem Status suchen. Die Vertragsnummer ist ein Textfeld, das Buchstaben, Ziffern und Schrägstriche zulässt, die Groß- und Kleinschreibung nicht unterscheidet und eine unscharfe Suche unterstützt. Die Fehlerart wählen Sie aus einer Liste, zum Beispiel fachliche Fehler oder Validierungsfehler. Beim Status ist eine Mehrfachauswahl möglich. Änderungen an den Filtern wirken sich erst aus, wenn Sie auf „Search“ klicken. Mit „Cancel“ verwerfen Sie alle Änderungen.

Die Ergebnisliste zeigt Fehler mit Checkbox, Vorfallsdatum, Fehlerart, Vertragsnummer, Fehlergrund und Status an. Die Checkbox ist nur bei Fehlern mit dem Status „Unresolved“ verfügbar. Standardmäßig werden alle Fehler mit diesem Status angezeigt. Alle Spalten lassen sich sortieren, standardmäßig wird absteigend nach dem Vorfallsdatum sortiert, sodass die neuesten Einträge oben stehen. Pro Seite werden 10 Einträge angezeigt, wählbar sind 10, 20, 30, 40 oder 50.

Nachdem Sie die Daten korrigiert haben, können Sie die Ereignisse erneut senden. Die Schaltfläche „Resend“ ist deaktiviert, solange kein Fehler ausgewählt ist. Bei Auswahl werden die eindeutigen Verträge der markierten Fehlerzeilen ermittelt, und für jeden dieser Verträge werden alle vier Ereignisse (Kunde, Vertrag, Umsatz und Händlerrechnungen) mit den aktuellen Daten erneut an NEMESIS gesendet.

**Technische Änderung**

Bei allen Services wurde die Konfiguration entfernt, die einen Betrieb im DEBUG-Modus ermöglichte. Für Anwender ergeben sich dadurch keine funktionalen Änderungen.

**Hinweis zum Export an Nacos**

Zum Eintrag über den Export von Provisionen und Händlerrabatten (E174) für eigene Einzelhandelsbetriebe und Affiliates an Nacos liegen in den Rohdaten keine Beschreibungsinhalte vor. Eine Beschreibung für das Handbuch kann daher nicht erstellt werden. Bitte ergänzen Sie dazu die Details.