# Batch 1281 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation: Produkte und Preisversionen**

Beim Anlegen und Bearbeiten von Produkten wurden mehrere Verbesserungen vorgenommen. Im Reiter „Payment Period" lässt sich beim Bearbeiten eines bestehenden Produkts der Speichern-Button nun aktivieren, wenn die Administrationsgebühr für einmalige und monatliche Zahlungen geändert wird. Zuvor blieb der Button deaktiviert, sofern beide Optionen angehakt waren. Er wurde erst aktiv, wenn man die Option „einmalig" oder „monatlich" abwählte und danach die Gebühr änderte.

Auch das Speichern als Entwurf im Produkt-Assistenten funktioniert jetzt zuverlässig. Wer im Schritt „Vehicle Preconditions" alle erforderlichen Werte ausgefüllt hat, kann das Produkt als Entwurf speichern, ohne dass eine Fehlermeldung erscheint. Das Feld „Währung" ist dabei kein Pflichtfeld mehr. Ebenso lässt sich das Produkt als Entwurf speichern, wenn alle erforderlichen Werte im Schritt „Price Matrix Definition" eingetragen sind. Die zuvor erscheinende Meldung, der Name des Limits müsse ausgefüllt werden, tritt nicht mehr auf. Außerdem wurde ein Fehler behoben, der im vierten Schritt des Produkt-Assistenten, „Price Matrix Definition", auftrat.

Bei der Vertragserstellung werden zu einer eingegebenen, zulässigen Fahrgestellnummer nun alle passenden Produkte angezeigt, sofern für das Fahrzeug Produkte und Preise konfiguriert und zulässig sind. Zuvor wurden trotz entsprechender Konfiguration keine Produkte zurückgegeben.

Auch die Verwaltung von Preisversionen wurde erweitert. Für die aktuelle Preisversion stehen die Aktionen „Bearbeiten" und „Duplizieren" zur Verfügung. Beim Bearbeiten kann der Versionsname geändert werden. Für bereits veröffentlichte Produkte ist es nun möglich, eine neue Preisversion anzulegen. Deren Startdatum muss mindestens einen Tag nach dem aktuellen Datum liegen, vorgeschlagen wird ein Datum eine Woche in der Zukunft.

Das vorgeschlagene Startdatum richtet sich nach den vorhandenen Preisversionen. Wird die erste Preisversion angelegt oder liegt der Start der bestehenden Preisversion in der Vergangenheit, schlägt das System ein Startdatum eine Woche in der Zukunft vor. Existiert bereits eine Preisversion mit einem zukünftigen Startdatum, wird als Startdatum der Tag nach dem am weitesten in der Zukunft liegenden Starttermin vorgeschlagen.

Beim Anlegen eines neuen Clusters wird der Button „Erstellen" nur dann aktiv, wenn alle Pflichtfelder ausgefüllt sind und mindestens ein Preispunkt eingetragen ist.

In der Preisversionsübersicht wurden mehrere Darstellungsprobleme behoben. Beim Wechsel zwischen Preisversionen lautet die Beschriftung des Buttons im Bereich „Clusters" durchgehend „Create Cluster" und wechselt nicht mehr kurzzeitig zu „New Cluster". Ist in der Tabelle keine Preisversion aufgeführt, zeigt der Bereich „Clusters" keinen Button zum Anlegen eines Clusters an. Außerdem werden beim Wechsel zu einer anderen Preisversion die Produktauswahl und die Preisversionstabelle nicht mehr kurzzeitig mit den Daten des vorherigen Produkts gefüllt.