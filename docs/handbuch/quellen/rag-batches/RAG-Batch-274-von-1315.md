# Batch 274 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Änderungen und Verbesserungen**

**Rechnungsfreigabe und Rechnungsverwaltung**

Wird eine Rechnung erstellt, deren Betrag den definierten Schwellenwert überschreitet, erhält sie zunächst den Status „Created“ und muss von einem Benutzer freigegeben werden. Bisher konnte jeder Benutzer eine Rechnung akzeptieren, auch der Ersteller selbst. Dies ist nun nicht mehr möglich: Die Freigabe muss durch einen anderen Benutzer erfolgen als den, der die Rechnung angelegt hat.

Das Verhalten der Aktualisieren-Aktion auf der Seite „Edit Invoice“ wurde korrigiert. Auch die Erfolgsmeldungen wurden überarbeitet. Wird eine Rechnungsposition bearbeitet, erscheint die Erfolgsmeldung nicht mehr mit der ID der Position. Sie wird nur noch angezeigt, wenn die Rechnung selbst über die Schaltfläche „Update“ aktualisiert wird, und enthält die OneSCM-Rechnungsnummer. Die Benachrichtigungen zu den Aktionen „Accept“, „Cancel“ und „Delete“ in den Rechnungstabellen enthielten bislang die interne Datenbank-ID der Rechnung. Sie zeigen nun die OneSCM-Rechnungsnummer an.

**Gutschriften und Korrekturrechnungen**

Beim Erstellen einer Gutschrift wird die Rechnungsreferenz nun mit der Rechnungsnummer des FI-Systems befüllt. Außerdem wurde die Erfassung von Positionen für Korrekturrechnungen angepasst: Das Datum „Invoice To“ muss immer nach dem Datum „Invoice From“ liegen. Zuvor ließ sich „Invoice To“ auf ein früheres Datum setzen.

**Rechnungsdatum und Zahlungsplan**

Beim Anlegen einer Kundenrechnung unter den Zahlungsdetails eines Vertrags war das Rechnungsdatum deaktiviert und nicht bearbeitbar. Das Feld ist nun aktiv. Auswählbar sind Daten zwischen dem Startdatum des Vertrags und dem aktuellen Datum.

Außerdem wurde ein Fehler bei der Erzeugung des Zahlungsplans behoben. Lag das Vertragsstartdatum auf dem 31. eines Monats, endete der Zahlungsplan zwei Tage vor dem Vertragsende. Der Zahlungsplan wird nun korrekt generiert.

**Bedienung der Oberfläche**

Das Mehrfachauswahl-Dropdown, etwa der Filter „Invoice Status“, funktionierte nach einem Klick auf das X-Symbol zum Zurücksetzen der Auswahl nicht mehr richtig: Die Suche lieferte danach immer alle Rechnungen, und erst ein Neuladen der Seite stellte die Filterfunktion wieder her. Beim Klick auf das X wird die Auswahl nun geleert, und die Suche funktioniert weiterhin wie erwartet. Dieses Verhalten betraf die gesamte Anwendung.

In den Tabellen der Kundenrechnungen (Vertrag, Reiter „Payment Details“) sowie unter „Admin Section“ > „Invoices“ bleibt die Spalte „Actions“ beim horizontalen Scrollen rechts fixiert, während sich die übrigen Spalten verschieben lassen.

**Rollen und Berechtigungen**

Aus Sicherheitsgründen muss jedem in OneSCM angemeldeten Benutzer eine Rolle zugewiesen sein, die den Zugriff auf die jeweiligen Ressourcen bestimmt. Es gibt fünf Rollen: Admin, HQ PM, MPC PM, Market Operations und Dealer. Jeder Rolle sind eine oder mehrere Berechtigungen (Entitlements) zugeordnet, die festlegen, was ein Benutzer in der Anwendung tun darf.

Für Revenue Management und Cost Management (Reiter „Payment“) gelten drei Berechtigungen. Mit „revenuemgmt_payment_view“ können der Bereich „Price Information“, die Kundenrechnungen und die Werkstattrechnungen ausschließlich angezeigt werden; diese Berechtigung haben HQ PM, MPC PM, Market Operations und Dealer. Mit „revenuemgmt_price_maintain“ lässt sich der Bereich „Price Information“ bearbeiten. Mit „revenuemgmt_invoice_manage“ können Kundenrechnungen gelesen, erstellt, aktualisiert und gelöscht werden. Beide zuletzt genannten Berechtigungen sind der Rolle Market Operations zugeordnet.

Für die „Admin Section“ gilt im Bereich „Invoices“: Die Berechtigung „adminmgmt_invoice_view“ erlaubt es, Rechnungen anzuzeigen und zu durchsuchen, Details einzusehen und den Verlauf einer Rechnung zu betrachten; sie ist der Rolle MPC PM zugeordnet. Die Berechtigung „adminmgmt_invoice_status_change“ umfasst zusätzlich das Bearbeiten, Akzeptieren und Ablehnen von Rechnungen sowie das Bestätigen von Korrekturen („Confirm fixes“) und ist der Rolle Market Operations zugeordnet.

Im Bereich „Tax Management“ erlaubt „adminmgmt_tax_view“ das Anzeigen und Durchsuchen von Steuercodes. Sie ist den Rollen HQ PM, MPC PM und Market Operations zugeordnet. „adminmgmt_tax_maintain“ ermöglicht zusätzlich das Anlegen neuer Steuercodes und ist der Rolle MPC PM zugeordnet.

Im Bereich „Job Management“ erlaubt „adminmgmt_jobmgmt_view“ das Anzeigen und Durchsuchen von Batch-Jobs, das Suchen nach Dateien und das Herunterladen von Dateien. Diese Berechtigung haben Admin, MPC PM und Market Operations. „adminmgmt_jobmgmt_manage“ umfasst dieselben Funktionen und zusätzlich das manuelle Auslösen eines Jobs, das Konfigurieren des Schedulers sowie das Aktivieren und Deaktivieren eines Batch-Jobs. Sie ist der Rolle Admin zugeordnet.

Im Bereich „Finance Control“ ermöglicht „adminmgmt_financecontrol_view“ das Anzeigen der Details im Reiter „Finance Control“. Diese Berechtigung haben MPC PM und Market Operations.