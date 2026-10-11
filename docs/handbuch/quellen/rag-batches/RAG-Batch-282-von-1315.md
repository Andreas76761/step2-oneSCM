# Batch 282 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungsintervall ändern und vorzeitige Abrechnung (Early Settlement) bei bestehenden Verträgen**

Bei der Konfiguration eines Produkts wird auch das Zahlungsintervall festgelegt. Im MVP stehen dafür „Monatlich" (Monthly) und „Einmalig" (One-Time) zur Auswahl. Wenn ein Kunde das Intervall nachträglich ändern möchte, etwa weil bei der Erfassung ein Fehler passiert ist, oder wenn er alle verbleibenden Zahlungen vorzeitig begleichen will (Early Settlement), wendet er sich an das Market-Operations-Team. Eine Änderung des Zahlungsintervalls wirkt sich auf den Zahlungsplan des Vertrags aus.

Eine Änderung von „Einmalig" auf „Monatlich" ist nicht zulässig. Der bestehende Vertrag muss in diesem Fall beendet und ein neuer Vertrag angelegt werden, da der Preis neu berechnet werden muss. Bei monatlicher Zahlung können zusätzliche Gebühren anfallen. Zulässig ist ausschließlich die Änderung von „Monatlich" auf „Einmalig".

**Bearbeitung in oneSCM**

Das Zahlungsintervall wird in den Vertragsdetails im Reiter „Payment" bearbeitet. Über die Schaltfläche „Edit" wechselt ein Market-Operation-Benutzer in den Bearbeitungsmodus. Ist das Zahlungsintervall auf „Einmalig" gesetzt, ist das Feld gesperrt und dient nur der Anzeige. Ist es auf „Monatlich" gesetzt, kann das Feld bearbeitet werden und der Benutzer kann es auf „Einmalig" umstellen. Die Darstellung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Speichern**

Beim Speichern einer Änderung von „Monatlich" auf „Einmalig" erscheint ein Hinweisdialog mit der Meldung: „You changed the Payment Interval! This will result in recreating the Payment Plan. Would you like to proceed?" Wählt der Benutzer „No", schließt sich der Dialog und die Bearbeitungsansicht bleibt geöffnet. Bei „Proceed" schließt sich der Dialog und das System verfährt abhängig vom Status der Rechnungsanforderungen im Zahlungsplan.

Wurde noch keine Position des Zahlungsplans an das FI-System übermittelt, befinden sich also alle Rechnungsanforderungen des Plans im Status „Planned", „Created" oder „Accepted" (manuell erstellte ausgenommen), wird automatisch ein neuer Zahlungsplan mit genau einer Rechnungsanforderung für die gesamte Vertragslaufzeit erzeugt. Deren Nettobetrag ist die Summe aller bisherigen Nettobeträge, der Steuerbetrag wird neu berechnet. „period_from" entspricht dem ältesten und „period_to" dem spätesten Wert des alten Zahlungsplans, was in etwa Start- und Enddatum des Vertrags entspricht. Die neue Rechnung erhält den Status „Planned".

Wurde mindestens eine Rechnungsanforderung bereits an das FI-System übermittelt, befindet sie sich also im Status „Exported", „FI Document Created" oder einem späteren Status („Paid", „Cancelled", „Error"), wird der Zahlungsplan nicht neu erstellt. Beim Speichern ändern sich die Felder der Rechnungsanforderungen nicht. Die Rechnungen im Status „Planned" und „Created" (manuell erstellte ausgenommen) werden für den nächsten Lauf des Batch-Jobs zur monatlichen Rechnungserstellung berücksichtigt, und zwar anhand des Kriteriums Zahlungsintervall „Einmalig".

**Hinweise zu einzelnen Status**

Sobald eine Rechnung als „Exported" markiert ist, kann der Zahlungsplan nicht mehr neu erstellt werden; die verbleibenden Rechnungen werden vom Batch-Job abgeholt. Befinden sich alle Rechnungen noch im Status „Planned", wird der Zahlungsplan neu erstellt.

Für den Status „Accepted" gelten zwei Fälle. Liegt eine akzeptierte Rechnung zusammen mit einer exportierten Rechnung vor (im Fall eines Early Settlement), wird die akzeptierte Rechnung regulär abgerechnet und im Exportlauf E169 an Nacos gesendet. Die Rechnungen im Status „Planned" werden mit dem nächsten Batch-Lauf ebenfalls erfasst, dieser Datensatz selbst bleibt jedoch unverändert. Liegen ausschließlich Rechnungen im Status „Planned" und „Accepted" vor, wird der Zahlungsplan neu erstellt. Bei einem Early Settlement (Wechsel von „Monatlich" auf „Einmalig") ist keine Neuberechnung nötig, da der Kunde dem im Vertrag berechneten Preis bereits zugestimmt hat.

**Abbrechen**

Wurde im Bearbeitungsmodus nichts geändert, wechselt der Bereich beim Klick auf „Cancel" zurück in die reine Anzeige. Wurde mindestens ein Feld geändert, erscheint ein Dialog mit dem Titel „You have unsaved changes!" und der Meldung, dass beim Fortfahren alle Änderungen verloren gehen und gefragt wird, ob wirklich geschlossen werden soll. Bei „Yes" werden der Dialog und die Bearbeitungsansicht geschlossen und alle Änderungen verworfen. Bei „No" schließt sich nur der Dialog und die Bearbeitungsansicht bleibt geöffnet.

**Weitere Funktionen rund um Rechnungspositionen und Zahlungsdetails**

Im Zusammenhang mit dem Revenue Management und dem Vertragsmanagement sind weitere Funktionen vorgesehen. Dazu gehört die Anzeige der korrekten Details im Bereich der Zahlungsdetails eines Vertrags. Für Rechnungspositionen gibt es das Bearbeiten einer Rechnung mit Aktualisierung der Rechnungsposition sowie die Funktionen „Abbrechen" und „Zurück" beim Bearbeiten. Die Funktion zur Anzeige der Rechnungsdetails einer Rechnungsposition ist noch offen. Weitere Einzelheiten zu diesen Funktionen liegen in den vorliegenden Informationen nicht vor.