# Batch 820 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 35 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsübertragung und Zahlerwechsel**

Bei der Übertragung eines Vertrags (einmalige Zahlung) steht nun ein eigener Abschnitt für Zahlungsdetails zur Verfügung. Beim Wechsel des Zahlers für einen aktiven Vertrag wurde eine eigene Seite bereitgestellt. Die Schaltfläche „Change Payer" wird für Gewerbekunden nicht mehr angezeigt. Wenn im Prozess des Zahlerwechsels auf der Seite „Payer & Payer Information" Pflichtfelder nicht ausgefüllt sind, wird beim Weiterleiten zur Seite „Overview & Confirmation" nun eine entsprechende Fehlermeldung angezeigt. Die Übersichts- und Bestätigungsseite wird zudem von oben geladen.

Bei der Einrichtung einer Vertragsübertragung kann im Kalender nur noch ein zukünftiges Wirksamkeitsdatum ausgewählt werden. Zuvor konnte jedes beliebige Datum gewählt werden.

**Vertragsverlängerung**

Bei Verlängerungen ist als Zahlungsintervall ausschließlich „Monatlich" möglich. Dies gilt unabhängig vom ursprünglich im Vertrag definierten Zahlungsintervall und sowohl für kurz- als auch für langfristige Verlängerungen. Die Zahlungsmethode ist standardmäßig auf „Monatlich" gesetzt und schreibgeschützt. Ein Wechsel von „Monatlich" auf „Einmalig" ist während der Verlängerung nicht mehr möglich.

**Vertragsbeendigung und Kilometerstand**

Wird eine Vertragsbeendigung manuell durch den Mitarbeiter (MO) angestoßen, wird der Kilometerstand wie folgt behandelt. Stehen die Werte aus MIC und DSB zur Verfügung, gilt: Ist der DSB-Wert größer als der MIC-Wert, ist das Feld „Mileage" ein Eingabefeld. Der eingegebene Wert muss mindestens dem DSB-Wert entsprechen. Ist er kleiner, erscheint eine Fehlermeldung und die Beendigung wird nicht fortgesetzt. Ist der DSB-Wert kleiner als der MIC-Wert, wird der MIC-Wert schreibgeschützt im Feld angezeigt. Sind MIC und DSB nicht verfügbar, ist „Mileage" ein Eingabefeld. Der manuell eingegebene Wert muss mindestens dem Kilometerstand des Fahrzeugs zu Vertragsbeginn entsprechen. Dann werden die Daten übernommen und die Beendigung fortgesetzt, andernfalls erscheint eine Fehlermeldung und der Vorgang wird nicht fortgesetzt. Behoben wurde außerdem ein Fehler, durch den der DBS-Kilometerstand bei der Beendigung nicht abgerufen wurde, obwohl er vorhanden war. Zudem wurde ein Fehler behoben, der das Stornieren von Verträgen verhinderte, sowie ein Fehler beim Stornieren eines Vertrags. Ebenfalls korrigiert wurde die Datumsauswahl im Stornierungsprozess: Die Auswahl über den Kalender und die Eingabe per Tastatur wurden hinsichtlich der 14-Tage-Frist ab Aktivierung des Vertrags sowie hinsichtlich der Rückdatierung angepasst, und es werden die korrekten Fehlermeldungen angezeigt.

**Suspendierung**

Im Pop-up-Fenster zur Suspendierung eines Vertrags wird der Grund nicht mehr als Freitext erfasst. Stattdessen gibt es ein verpflichtendes Dropdown-Feld „Reason for Suspension" mit den Werten „Payment Overdue" und „Other". „Payment Overdue" ist vorausgewählt. Wird „Other" gewählt, muss zusätzlich ein Kommentar erfasst werden. In allen anderen Fällen ist das Textfeld „Comments" optional.

**Operative Review und Review-Profile**

In der Operative Review wird beim „Price per Kilometer" und beim „Payment Amount" nun jeweils der Nettopreis angezeigt, ergänzt um den Hinweis „Excl. VAT". Zuvor wurde beim Preis pro Kilometer der Bruttopreis angezeigt. Beim Anlegen eines Review-Profils ist das Feld „Review Type" standardmäßig auf „Final" gesetzt und schreibgeschützt. Das Gleiche gilt für „Review Type" im Bereich „Search Reviews" der Operative-Review-Seite. In der Tabelle wird der Wert in der Schreibweise „Final" statt „FINAL" angezeigt. Außerdem wurde die fehlerhafte Anzeige des Review-Typs korrigiert, und die GET-Anfrage der Seite wird nicht mehr doppelt ausgeführt. Ein Fehler beim Aufruf eines Vertrags mit leerem Profil wurde ebenfalls behoben.

**Vertragsdetails und Zahlungsregisterkarte**

In der detaillierten Vertragsansicht fehlte eine Aktionsschaltfläche, die wieder verfügbar ist. Für Verträge mit einer Provision im Status „Confirmed" oder „Waiting for Activation" soll im Angebotsmanagement unter „Contract Overview" auf der Registerkarte „Payment" das neue Feld „Dealer Commission" mit dem Betrag aus der Produktauswahl angezeigt werden. Diese Funktionen befinden sich derzeit noch in Prüfung.

**Technische Anpassungen**

Der Kafka-Listener und -Producer für die Kontingentanzahl wurden aktualisiert. Der Producer sendet an das Topic „contingent_count" und verwendet die Felder coverageCode, damageCode und vegaApplicationNr. Die Fehlerbehandlung für Nemesis wurde angepasst, der S3-Bucket-Pfad für I155 korrigiert und ein 403-Fehler in der INT-Umgebung behoben. Zusätzlich wurden manuelle Tests zur Berechnung von Mehr- und Minderkilometern unter Berücksichtigung von Toleranz und Höchstbetrag durchgeführt.