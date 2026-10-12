# Batch 823 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management – Änderungen und Verbesserungen**

Im Bereich Contract Management wurden mehrere Anpassungen umgesetzt, die den Umgang mit Vertragskündigungen, Verlängerungen und Fehlermeldungen betreffen.

**Kündigung aktivierter Verträge**

Der Ablauf zur Kündigung eines bereits aktivierten Vertrags wurde überarbeitet. Im Pop-up-Fenster „Cancel Contract“ wird das Attribut „Mileage at Cancellation (Km)“ nicht mehr erfasst. Außerdem kann pro Vorgang nur noch ein einzelner Vertrag gekündigt werden. Die Möglichkeit, über „Select All“ mehrere Verträge gleichzeitig auszuwählen und zu kündigen, entfällt.

Ob eine Kündigung gestartet werden kann, hängt vom Vorhandensein einer VEGA-Werkstattrechnung ab. Existiert für den ausgewählten Vertrag keine solche Rechnung, steht im Dropdown-Menü „Action“ die Option „Cancel Contract“ zur Verfügung, und der Benutzer kann den Kündigungsprozess über „Action >> Cancel Contract“ fortsetzen. Liegt dagegen eine aktive Werkstattrechnung vor, erscheint beim Klick auf „Cancel Contract“ die Meldung „Contract Cancellation cannot be initiated as the contract has an active workshop invoice“.

Für die Schnittstelle i155 gilt: Bei der Aktivierung eines Vertrags ist im Feld RC05, Position 62, standardmäßig der Wert „1“ gesetzt. Wird der Vertrag innerhalb von 14 Tagen nach der Aktivierung gekündigt, wird bei der Erzeugung der i155 der Wert in RC05, Position 62 auf „2“ aktualisiert.

**Verlängerung von Verträgen**

Bei der kurzfristigen (Short Term) und der langfristigen (Long Term) Verlängerung kann der Market-Operations-Benutzer nun einen Kommentar erfassen. Das Feld „Comments“ entspricht dem Kommentarfeld, das bereits aus dem Ablauf „Terminate Early“ und weiteren Abläufen bekannt ist. Es ist optional und auf 100 Zeichen begrenzt. Es kann genutzt werden, um Anmerkungen oder beispielsweise die Microsoft-Dynamics-Fallnummer zu hinterlegen.

**Fehlerbehebungen und Oberflächenanpassungen**

Die Vertragstabelle im Contract Management, die zuvor nicht geladen wurde und stattdessen eine Fehlermeldung anzeigte, wurde korrigiert. Zudem wurden unter dem Titel „UI Adaptations Brabus“ Anpassungen an der Benutzeroberfläche vorgenommen. Weitere Details dazu liegen nicht vor.

Darüber hinaus wurden Probleme im Zusammenhang mit der Mercedes-Me-Funktion behandelt. Zum einen betrifft dies die Anzeige der Meldung zum Telefonnummernformat („Please enter a valid phone number“), die auch bei ausgeschaltetem Mercedes-Me-Schalter erschien. Zum anderen wurde die fehlerhafte Fehlermeldung der Mercedes-Me-Funktionalität korrigiert.