# Batch 1211 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverlängerung mit Optionen**

Händler können für bestehende Verträge Preise anfragen, um Langzeitverlängerungen mit Optionen durchzuführen. Eine Verlängerung ist während der Laufzeit eines Vertrags möglich, bevor dieser abgelaufen ist. Fahrzeugvoraussetzungen müssen bei einer Verlängerungsanfrage nicht mehr geprüft werden. Dabei können Produktoptionen sowohl erweitert als auch reduziert werden. Eine Verlängerung kann die Laufzeit, die Laufleistung oder beides betreffen. Ebenso können neue Optionen hinzugefügt oder mit den genannten Änderungen kombiniert werden. Soll die Laufzeit verlängert, die Gesamtlaufleistung aber beibehalten werden, wählt man eine längere Gesamtlaufzeit und eine niedrigere jährliche Laufleistung, wobei die daraus resultierende Gesamtlaufleistung mindestens der bisherigen entsprechen muss.

Das System stellt alle möglichen Verlängerungsoptionen der Produktoptionen bereit, jeweils mit Netto-, Brutto- und Gesamtpreisen für alle im Produkt vorgesehenen Zahlungsarten. Berechnet werden Verlängerungen für monatliche Zahlung oder Einmalzahlung. Bei der Preisberechnung wird keine Händlerprovision berücksichtigt, es werden keine Marktkampagnen angewendet und es können keine Händlerrabatte gewährt werden. Der zahlungsabhängige Aufschlag ist weiterhin im Preis enthalten.

Für Produkte im Status „Deleted“ wird keine Verlängerung angeboten. Stattdessen erscheint die Meldung: „The product you are trying to extend is no longer part of Mercedes-Benz portfolio. Please try to create a new contract.“ Bei Produkten im Status „Deactivated“ dient je nach Konfiguration des Produkts entweder die ursprüngliche oder die „neue“ Preisversion als Berechnungsgrundlage.

Bei einer Verlängerung mit Ergänzung preisrelevanter Optionen erfolgt die Verlängerung während der Laufzeit des Vertrags. Im Produkt ist dafür die „originale“ Preisversion für Verlängerungen hinterlegt, und es werden alle Produktoptionen angeboten, die zum Zeitpunkt der Verlängerung im Produkt verfügbar sind. Ein Beispiel: Ein Kunde schließt einen Vertrag mit 20.000 km Jahreslaufleistung und 24 Monaten Laufzeit zum Preis von 2400 ab, das entspricht einer monatlichen Rate von 100. Für 17 Monate wurden bereits Rechnungen erstellt, 7 Monate sind noch offen. In der ursprünglichen Preismatrix kostet eine der möglichen Optionen für die Variante mit 20.000 km und 24 Monaten 75. Der neue Preis inklusive Option beträgt (100 + 75 × 7) / (17 + 7) = 2421,88. Die neue Rate bei Wahl dieser Option ergibt sich aus [100 + (2421,88 − 2400)] / 7. Neben diesem Fall sind auch die Verlängerung von Vertrag und Option sowie die verlängerung mit Entfernen einer Option vorgesehen.

**Preise für Optionen bearbeiten**

Bisher konnten Preise nur für Basisdeckungen definiert werden. Nun können MPC-Anwender die Preisstruktur der in einem Produkt enthaltenen optionalen Deckungen bearbeiten und diese nach ihrer neuen Geschäftslogik bepreisen.

Bei Preisversionen gilt: Versionen mit einem Startdatum in der Zukunft lassen sich vollständig bearbeiten. Die aktuelle Preisversion kann nur teilweise bearbeitet werden, vergangene Preisversionen lassen sich nur ansehen. Beim Duplizieren wird eine neue Preisversion mit den bestehenden Konditionen erstellt, einschließlich aller Konfigurationen der optionalen Preise und der Preise in den Clustern.

Bei Clustern gilt entsprechend: In zukünftigen Preisversionen sind Preiscluster vollständig bearbeitbar. In aktuellen Preisversionen kann nur der Name eines Clusters geändert werden, in vergangenen Preisversionen sind Cluster nur einsehbar. Beim Duplizieren eines Clusters werden die vorhandenen Preiswerte der Preistabelle für Optionen übernommen.

Bei vollständiger Bearbeitung einer Preisversion können für jede Option die Kostendefinition, die Abhängigkeitsdefinition und die Steuerklassifizierung geändert werden. Eine geänderte Steuerklassifizierung lässt sich ohne Warnung oder Dialog speichern. Wird dagegen eine Kosten- oder Abhängigkeitsdefinition geändert, wird die Preismatrix in allen vorhandenen Clustern dieser Preisversion zurückgesetzt. Nach dem Speichern erhalten alle Cluster, in denen dadurch mindestens eine optionale Deckung eine leere Preismatrix hat, ein Warnsymbol mit dem Hinweis „One or more optionals are missing prices“. Zusätzlich wird ein Warnsymbol auf dem Reiter „Optional Coverages“ der Cluster sowie an der betroffenen Option innerhalb dieses Reiters angezeigt.

**Contract Review: Profil löschen**

MPC-Anwender können ein Profil für die Vertragsprüfung löschen, wenn es nicht mehr von Produkten laufender Verträge verwendet wird, um nicht benötigte Profile aufzuräumen. Die Löschaktion steht auf der Übersichtsseite der Profile in der Spalte „Aktion“ zur Verfügung. Sie ist nur aktiviert, wenn alle Verträge, deren Produkt das betreffende Profil nutzt, den Status „CLOSED“ haben; andernfalls ist sie deaktiviert. Beim Auslösen erscheint ein Dialog mit der Frage „Are you sure you want to delete the current Profile? This action cannot be reverted“. „Proceed“ löscht das Profil, „Cancel“ bricht den Vorgang ab. Die Gestaltung entspricht dem Mercedes-Benz Workbench und dem vom Kunden validierten UI-Design.

**Contract Review: Profil bearbeiten**

MPC-Anwender können die in einem Profil definierten Regeln aktualisieren, sodass Änderungen für die Vertragsprüfung gelten. Die Bearbeitung lässt sich auf zwei Wegen starten: Auf der Profilseite wählt man in der Spalte „Aktion“ beim gewünschten Profil „Edit“, oder man öffnet ein bestehendes Profil in der Detailansicht und klickt auf „Edit“.

Beim Anlegen eines Profils wird eine eindeutige Profil-ID vergeben. Diese wird auf Vertragsebene gespeichert, und bei einer Vertragsprüfung werden die Regeln herangezogen, die unter dieser ID definiert sind. Nach dem Starten der Bearbeitung kann jeder Parameter geändert und die Änderung gespeichert werden. Bei einer Vertragsprüfung gelten stets die Regeln, die zum Zeitpunkt der Prüfung definiert sind.

Sobald „Edit“ gedrückt wurde, wird das Symbol durch ein „X“ zum Abbrechen der Bearbeitung und ein Häkchen zum Bestätigen der Änderungen ersetzt. Beim Klick auf das Häkchen erscheint ein Dialog mit der Meldung „Are you sure you want to edit the setup for current Profile? Any change of the settings will have impact on the Contract Review“. „Proceed“ speichert die Änderungen, „Cancel“ verwirft das Speichern. Auch hier entspricht die Gestaltung dem Mercedes-Benz Workbench und dem vom Kunden validierten UI-Design.