# Batch 1266 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Überarbeitung der Benutzeroberfläche in Contract Calculation**

In mehreren Bereichen von oneSCM wurde die Benutzeroberfläche vereinheitlicht, damit Bedienelemente überall gleich aussehen und sich gleich verhalten. Das betrifft vor allem die Schaltflächen in den Assistenten, die Filter und die Tabellen.

**Assistenten und Navigation**

In den Assistenten zum Anlegen von Produkten, Fahrzeuggruppen (Passenger Cars) und Kampagnen sind die Schaltflächen nun einheitlich gestaltet. „Abbrechen" wird durch ein „X"-Symbol dargestellt und ist immer eine sekundäre Schaltfläche. Beim Überfahren mit der Maus erscheint ein Tooltip mit der Beschriftung „Cancel". „Zurück" wird durch ein „<"-Symbol dargestellt, ist ebenfalls immer sekundär und zeigt den Tooltip „Back". Die Zurück-Schaltfläche erscheint erst ab dem zweiten Schritt. „Weiter" wird durch ein „>"-Symbol dargestellt, ist immer primär und zeigt den Tooltip „Next". Im letzten Schritt des Assistenten ersetzt die Schaltfläche zum Erstellen die Schaltfläche „Weiter". Sie trägt ein Haken-Symbol, ist immer primär und zeigt den Tooltip „Create".

Beim Bearbeiten eines Produkts gelten ähnliche Regeln. Der Tooltip der Abbrechen-Schaltfläche lautet hier „Back to Products". Hat der Benutzer ungespeicherte Änderungen, wird anstelle von „Weiter" eine primäre Speichern-Schaltfläche mit Haken-Symbol angezeigt, deren Tooltip „Update" lautet. Solange diese angezeigt wird, ist die Zurück-Schaltfläche ausgeblendet. Die endgültige Gestaltung der Bearbeitungsansicht war laut den Angaben noch mit dem zuständigen Ansprechpartner abzustimmen.

Beim Anlegen eines Clusters gibt es ebenfalls eine Abbrechen-Schaltfläche mit „X"-Symbol und dem Tooltip „Back to Prices" sowie eine primäre Schaltfläche mit Haken-Symbol und dem Tooltip „Create". Auf der Seite mit den Preisversionen beim Zuweisen von Preisen sowie in der Ansicht einer Fahrzeuggruppe (Passenger Cars) gibt es eine sekundäre Zurück-Schaltfläche mit „<"-Symbol und dem Tooltip „Back".

**Weitere Anpassungen in der Oberfläche**

In der Produkt- und Preistabelle ist die Aktion „Assign Prices" bzw. „Manage Prices" nun schneller erreichbar. Der Tooltip mit den Zusatzinformationen wird nur noch angezeigt, wenn der Benutzer mit der Maus über die Beschriftung der Aktion fährt, und nicht mehr bereits vorher. Der klickbare Bereich entspricht dem Bereich, der den Tooltip auslöst.

In der Übersicht der Fahrzeuggruppen (Passenger Cars und Vans) wurde das Fahrzeugsymbol gemäß Mockup an den unteren Bildschirmrand verschoben und ist statisch. Beim Anlegen einer Fahrzeuggruppe für Vans wird der ausgewählte Tab mit schwarzer Beschriftung und blauem Symbol dargestellt.

**Filter**

In den Hauptbereichen finden Benutzer meist eine Tabelle mit Filteroptionen. Diese wurden vereinheitlicht. In den Bereichen Produkte und Fahrzeugverwaltung haben die Schaltflächen keine Textbeschriftungen mehr; die Beschriftungen erscheinen stattdessen als Tooltips beim Überfahren mit der Maus. In den Produkten sind die Schaltflächen an den Filtern ausgerichtet, in der Fahrzeugverwaltung sowie in den Fahrzeuggruppen (Passenger Cars und Vans) stehen sie direkt neben dem Filter.

**Tabellen**

In der Produkttabelle steht die Spalte „Produktname" nun an erster Stelle, und die Produktnamen sind Hyperlinks. Sie ersetzen die Aktion „Anzeigen" im Aktionsmenü „…", die entfernt wurde, damit die Tabelle zu anderen Bereichen von oneSCM konsistent ist.