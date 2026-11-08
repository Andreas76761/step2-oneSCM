# Batch 559 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Neue Märkte Tschechien und Schweiz

Mit dieser Erweiterung werden die Märkte Tschechien (CZ) und Schweiz (CH) im System freigeschaltet. Dafür werden die Märkte in den Anfragen an die Google-API, GSSN, MercedesMe und SWIFT berücksichtigt. Ebenso werden sie im Finanzsystem CoFiCo und im Signatur-Job für DSS unterstützt. Zusätzlich wird die Validierung von Kundendaten für beide Märkte angepasst.

Die Validierungsmuster für Postleitzahl, Umsatzsteuer-Identifikationsnummer und Steuernummer werden aus der Marktkonfiguration geladen, und zwar getrennt für CZ und CH. Beim Anlegen oder Ändern eines Kunden im jeweiligen Markt werden diese Felder gegen das zugehörige Muster geprüft. Entsprechen alle Angaben dem Muster, wird der Kunde erfolgreich angelegt bzw. aktualisiert. Entspricht eine Angabe nicht dem Muster, schlägt das Anlegen fehl, und es erscheint eine Fehlermeldung, die auf das ungültige Format des betreffenden Feldes (Postleitzahl, USt-ID oder Steuernummer) hinweist. Auch das Anlegen von Händlerbetrieben und Lieferanten ist für beide Märkte möglich. Dabei gelten ebenfalls die Vorgaben der jeweiligen Marktkonfiguration, bei Händlerbetrieben mit einer gültigen Outlet-ID bzw. GSSN-Outlet-ID und bei Lieferanten mit einer gültigen Postleitzahl.

Gewerbliche Kunden aus dem öffentlichen Sektor

Für gewerbliche Kunden der Kategorie „Behörde/Öffentlicher Sektor“ (Affiliation Public Sector) wird die Anfrage künftig wie bei einem normalen gewerblichen Kunden gesendet. Die Identifikationsnummer vom Typ Z_IDEN mit dem Wert „publicAuthorities“ wird dabei nicht mehr übermittelt. Diese Prüfung gilt auch für Privatkunden, damit dieser Wert in Sonderfällen nicht versehentlich an oneERP gesendet wird.

Interne Benachrichtigung bei Freigabe von Preisversionen und Kampagnen (in Planung)

Vorgesehen ist, dass Benutzer mit den Rollen MPC und MO intern benachrichtigt werden, sobald eine Preisversion oder Kampagne zur Freigabe ansteht. Der Ablauf entspricht den übrigen internen Benachrichtigungen: Sendet ein Benutzer eine Kampagne oder Preisversion zur Prüfung, erscheint beim Prüfer am Glockensymbol in der Kategorie „Produkte und Preise“ die Meldung, dass mehrere Kampagnen bzw. Preisversionen geprüft werden müssen. Per Klick gelangt der Prüfer auf die passende Seite, also die Produktübersicht oder die Kampagnenübersicht. Die Seite ist bereits auf die zu prüfenden Objekte gefiltert, und diese sind zur schnellen Orientierung mit einem blauen Punkt markiert.

Lehnt der Prüfer ein Objekt ab, steht ihm ein optionales Kommentarfeld zur Verfügung. Der Ablehnungskommentar wird in der Historie des Objekts angezeigt. Nachdem der Prüfer seine Aktion durchgeführt hat, wird dies ebenfalls über das Glockensymbol zurückgemeldet, mit dem Hinweis, dass die Kampagnen bzw. Preisversionen den jeweiligen Status der Aktion erhalten haben.