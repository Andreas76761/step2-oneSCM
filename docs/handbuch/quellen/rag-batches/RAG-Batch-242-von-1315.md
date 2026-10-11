# Batch 242 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Steuersätze verwalten (Tax Management)**

Im Bereich „Tax Management" steht Benutzern der Marktorganisation (MPC) ein neuer Reiter „Tax Rates" zur Verfügung. Dort verwalten sie die Steuersätze ihres Marktes. Für jeden Markt wird eine Liste von Steuersätzen festgelegt, die in diesem Markt verwendet werden können.

Im Suchbereich lässt sich nach folgenden Kriterien filtern: Name (die Tabelle zeigt alle Einträge, deren Name das eingegebene Wort enthält), Financial Document Definition (Auswahl aus den verfügbaren Einträgen), Validity From und Validity To (jeweils per Kalender mit Datumsformat). Im Ausgangszustand ist kein Filter gesetzt, alle Filterfelder sind leer und die Tabelle zeigt sämtliche Ergebnisse. Änderungen an den Filtern wirken sich nicht automatisch auf die Ergebnisse aus. Erst ein Klick auf „Search" zeigt die Ergebnisse passend zu den gewählten Filteroptionen an. Mit „Reset" werden die Filter auf den Ausgangszustand zurückgesetzt; die angezeigten Ergebnisse werden dadurch nicht aktualisiert. Die Schaltfläche „Create Tax Rate" ist Teil eines separaten Funktionsumfangs.

Die Ergebnistabelle enthält die Spalten Name (Standardsortierung), Entity, Tax Type, FI Tax Code, FI Tax Code Description, Tax Factor, Validity (im Format „Validity_from - Validity_to") und Actions. Die Aktionen werden in separaten Funktionsumfängen behandelt.

Überschreitet die Zahl der Ergebnisse die maximale Anzahl pro Seite, werden sie auf mehrere Seiten verteilt, zwischen denen Admin-Benutzer navigieren können. Standardmäßig werden 10 Datensätze pro Seite angezeigt. Über ein Dropdown lässt sich der Wert auf 10, 20, 30, 40 oder 50 ändern. Die letzte Auswahl wird nicht gespeichert; nach einer Aktualisierung der Seite gilt wieder der Wert 10. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Statushistorie von Rechnungen einsehen (Cost Management)**

Benutzer der Market Operation können für eine ausgewählte Werkstattrechnung, auch für internationale Werkstattrechnungen, die Historie der Statusänderungen einsehen. Damit der Status jederzeit nachvollziehbar ist, wird jede Statusänderung einer Rechnung protokolliert. Das Protokoll enthält pro Eintrag folgende Angaben:

Das Änderungsdatum entspricht dem UTC-Zeitstempel der Aktion im Format TT.MM.JJJJ HH:mm:ss UTC. Unter „Modify by" steht bei Änderungen durch einen Batch-Job dessen Benutzername, bei Änderungen durch eine Benutzeraktion (zum Beispiel Anlegen einer manuellen Rechnung, Freigabe einer Rechnung oder Bestätigung von Korrekturen) der Benutzername des ausführenden Benutzers. „Old Value" zeigt den Status vor der Änderung; wurde die Rechnung über einen Zahlungsplan erzeugt, lautet der alte Status „-". „New Value" zeigt den Status nach der Änderung. Unter „Reason" steht bei einer Änderung durch einen Batch-Job „Automatic Change due to Batch Execution.". Bei einer Benutzeraktion, die eine Begründung erfordert, wird diese angezeigt; erfordert die Aktion keine Begründung, erscheint „-".

Die Historie öffnet sich, wenn man in der Rechnungstabelle auf den Status der Rechnung klickt oder in der Spalte „Actions" die Option „See History" wählt. In beiden Fällen erscheint ein Popup mit einer Tabelle und einer Schaltfläche „Back". Alle Spalten der Tabelle sind sortierbar. Standardmäßig ist sie nach Änderungsdatum sortiert, die neuesten Einträge stehen oben. Das Popup ist so groß, dass 10 Einträge dargestellt werden können; bei mehr Einträgen wird der Inhalt scrollbar. Über „Back" oder das „X" wird das Popup geschlossen und man gelangt zurück zur Kundenrechnungstabelle. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Zugriffsrechte für Revenue und Cost Management**

Die Rollen und Berechtigungen wurden gemäß den Abstimmungen aus Business Stream 3 angepasst. Tax Types werden vom Admin verwaltet, Tax Rates von MPC. MPC, MO, HQ und ADMIN können Tax Types und Tax Rates sehen, ebenso die Seite „Finance Control" und die Seite „Admin Invoice". Die Seite „Admin Invoice" können MPC und MO zusätzlich verwalten. Die Seite „Batch Jobs" können MPC, MO, HQ und ADMIN einsehen; verwalten dürfen sie HQ und Admin. Auch die Seite mit den Damage Codes können MPC, MO, HQ und ADMIN sehen. HQ importiert die Liste der Damage Codes, MO und MPC können marktspezifische Damage Codes anlegen. Coverage Codes werden ausschließlich von HQ verwaltet.

**Weitere Änderungen**

Bei den Admin-Rechnungen werden Werkstattrechnungen nun auch in der Funktion für die Liste der priorisierten Rechnungen (Priority-IDs) berücksichtigt. Außerdem wird beim Anlegen des Finanzdokuments im Vertragsprüfprozess der Rechnungsstatus von „CREATED" auf „ACCEPTED" geändert, und die zugehörige Methode läuft nun transaktional ab.