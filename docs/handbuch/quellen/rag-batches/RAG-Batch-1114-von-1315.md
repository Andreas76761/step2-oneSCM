# Batch 1114 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation): Änderungen und Neuerungen**

**Eingeschränkte Ansicht für Händler**
In der Kunden- und Partnerverwaltung sowie in den Masken zur Vertragserstellung sieht ein angemeldeter Händler nur noch die Verträge, die er selbst angelegt hat. Arbeitet der Benutzer für zwei verschiedene Standorte (Outlets) desselben Händlerbetriebs, werden die Verträge beider Standorte angezeigt.

**Statuswechsel des Kunden im Vertragslebenszyklus**
Bisher blieb ein Kunde im Status „inaktiv“, auch wenn für ihn ein neuer Servicevertrag bestätigt wurde. Künftig ändert sich der Kundenstatus entlang des Vertragsverlaufs. Wird für einen inaktiven Kunden, der in der Kundensuche erscheint und vom Benutzer ausgewählt wurde, ein Servicevertrag angelegt, wechselt der Kunde in den Status „temporär“. Sobald der Vertrag bestätigt wird, erhält der Kunde den Status „in Bestätigung“. Anschließend werden vorerst Testdaten für die SAP-Debitorennummer und den Lastschriftcode bereitgestellt. Liegen diese vor, wechselt der Vertrag vom Status „wartet auf Aktivierung“ in den Status „aktiv“, sofern alle weiteren in der Vertragserstellung definierten Bedingungen erfüllt sind. Sobald der Vertrag aktiv ist, wird auch der Kunde auf „aktiv“ gesetzt. Zusätzlich wird beim Anlegen eines Vertrags ein entsprechendes Ereignis an die Kundenverwaltung gesendet.

**Dokumenten-ID**
Beim Erstellen eines Vertragsdokument-Eintrags wird die Datei-ID im Format „Service_Contract_{Vertragsnummer}“ vergeben. Dasselbe Format wird als Dokument-ID verwendet, wenn die Schnittstelle zur Dokumentenerzeugung aufgerufen wird. Alle Stellen, die bisher die Datei-ID mit der Vertragsnummer gleichgesetzt haben, wurden entsprechend angepasst.

**Laufzeiten abhängig von der Erstzulassung**
Bislang schränkte das eingegebene Datum der Erstzulassung die wählbaren Vertragslaufzeiten nicht ein. So konnte für ein Fahrzeug, das vor mehr als einem Jahr zugelassen wurde, weiterhin „12 Monate“ gewählt werden, obwohl die gesamte Laufzeit dann in der Vergangenheit läge (Excellent-Verträge beginnen immer mit der Erstzulassung). Der Fehler zeigte sich erst nach Eingabe aller Kunden- und Zahlungsdaten. Nun begrenzt bei fahrzeugbezogenen Produkten wie Excellent die Erstzulassung die verfügbaren Laufzeiten. Die Vertragserstellung übermittelt die Fahrgestellnummer über eine Schnittstelle an die Vertragskalkulation, die prüft, ob dafür eine Erstzulassung vorliegt. Ist sie vorhanden, wird sie zurückgegeben, schreibgeschützt angezeigt und beim Produktabgleich berücksichtigt. Liegt keine vor, bleibt das Feld editierbar, und die eingegebenen Daten fließen in den Produktabgleich ein. Die angebotenen Laufzeiten müssen länger sein als der Zeitraum von der Erstzulassung bis zum Anfragedatum. Beispiel: Bei einer Erstzulassung am 10. Januar 2022 und dem Anfragedatum 7. Dezember 2023 liegen 23 Monate dazwischen; angeboten wird dann die kleinste Laufzeit, die größer als 23 Monate ist.

**Begrenzung von Preiseingaben**
Zuvor konnten sehr hohe Preise eingegeben werden, die in der Vertragserstellung zu einer Fehlermeldung führten und die Anzeige passender Produkte für ein Fahrzeug verhinderten. Jetzt sind Preise nur noch im siebenstelligen Format mit fünf Vorkomma- und zwei Nachkommastellen zulässig, zum Beispiel 15.400,99. Damit der Wert von 99.999,99 auch bei Anwendung des Faktors nicht überschritten wird, ist der Preisfaktor auf höchstens 2 und der Wert einer Preiszelle auf höchstens 49.999,99 begrenzt.

**Kundenprüfung im Ablauf der Vertragserstellung**
Wer im ersten Schritt, der Produktauswahl, alle Pflichtfelder ausfüllt und auf „Weiter“ klickt, gelangt in den Bereich „Kundendetails“. Bricht man dort ab, kehrt man zur Produktauswahl zurück. Klickt man anschließend erneut auf „Weiter“, soll wieder der Bereich „Kundendetails“ geöffnet werden, und erst nach „Fortfahren“ geht es zu Schritt 2, „Kunden- und Zahlungsinformationen“.

**Erneutes Öffnen der Kundensuche**
In der Vertragserstellung steht eine Schaltfläche zur Verfügung, mit der sich das Kundensuchfenster erneut öffnen lässt.

**Startseite der Vertragserstellung**
Das Kennzeichen war auf der Startseite bisher nur als Suchfeld verfügbar. Es wird zusätzlich als Spalte in der Detailtabelle angezeigt, damit Benutzer besser nachvollziehen können, dass die Ergebnisse zu ihrem Kennzeichenfilter passen.