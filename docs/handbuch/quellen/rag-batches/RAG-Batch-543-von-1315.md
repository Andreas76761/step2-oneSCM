# Batch 543 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: DevOps und Customer Account Center**

**DevOps**

Im Bereich DevOps wurde SecHub in die kontinuierliche Build-Pipeline integriert, um Schwachstellenscans zu automatisieren. Die Einrichtung folgt der offiziellen SecHub-Dokumentation. Die Scan-Ergebnisse sind in der Pipeline leicht zugänglich, sodass Schwachstellen nachverfolgt und behoben werden können.

Außerdem wurde Blackduck für die einzelnen Stages getrennt. Dabei gilt folgende Zuordnung: Die Phase DEVELOPMENT wird für die Integrationsumgebung (INT) verwendet, die Phase PRERELEASE für die Vorproduktionsumgebung (prePROD) und die Phase RELEASED für die Produktionsumgebung (PROD). Darüber hinaus wurde ein Datadog-Dashboard für WAF-Logs konfiguriert. Zu dessen Inhalt und Umfang liegen keine weiteren Angaben vor.

**Customer Account Center: Integration mit MPay**

Kreditkarten laufen ab, auch während der Laufzeit eines Servicevertrags, etwa bei einer Vertragsdauer von vier Jahren. Für diesen Fall wurde ein Ablauf umgesetzt, der den Kunden rechtzeitig zur Aktualisierung seiner Zahlungsdaten auffordert. Der Ablauf läuft im Hintergrund und wird von einem Market-Operations-Benutzer nachverfolgt. Er stellt sicher, dass der Vertrag über ein neues Asset samt NTR verfügt, was Voraussetzung für die Rechnungsstellung ist.

Den Auslöser bildet eine Benachrichtigung von Revenue, die auf der CIAM-ID basiert. Das System ermittelt damit den Kunden, wählt die passende E-Mail-Vorlage und versendet die E-Mail an den Kunden. Die E-Mail wird in der Historie des Vertrags angezeigt.

Der Kunde ruft über die E-Mail das Customer Account Center auf und authentifiziert sich mit Mercedes me. Anschließend sieht er seine Serviceverträge und die hinterlegte Zahlungsmethode. Die Seite zeigt unter anderem Vertragsnummer, Vertragsbeginn, Fahrgestellnummer, Zahlungsmethode, Vertragsdetails, Produkt, Kennzeichen, Kreditkartendaten und Ablaufdatum der Karte. Die Kreditkartendaten werden von Revenue geliefert und sind anonymisiert. Der Kunde kann die Zahlungsmethode ändern und über ein Kontrollkästchen alle aktuellen Verträge gleichzeitig auswählen.

Mit Klick auf „Change Payment Method“ öffnet sich ein Dialog mit dem Hinweis, dass der Kunde mit dem Speichern seiner Zahlungsmethode für den gewählten Vertrag zustimmt, dass der jeweilige Monatsbetrag bis zur Kündigung des Vertrags abgebucht und in Rechnung gestellt wird. Bestätigt der Kunde, verlässt er oneSCM und wird zu MPay weitergeleitet; dabei wird bei Revenue eine neue Zahlung initiiert. Bricht er ab, bleibt er auf der Vertragsseite.

Nach Abschluss des MPay-Prozesses erfolgt ein Callback. Bei Erfolg sieht der Kunde eine Erfolgsmeldung und bleibt auf der Vertragsseite. Bei einem Fehler erscheint eine Fehlermeldung, die er schließen muss, und er bleibt ebenfalls auf der Vertragsseite. Im Erfolgsfall meldet das System dem Vertrag, dass die neue Kreditkarte gespeichert wurde, und die neue Asset-ID samt NTR wird im Vertrag abgelegt. Danach werden keine weiteren Benachrichtigungen an den Kunden versendet.

Aktualisiert der Kunde seine Kreditkartendaten nicht, werden Erinnerungen versendet. Die Häufigkeit beträgt die Anzahl der Tage bis zum Ablauf geteilt durch drei. Vor jedem Versand prüft das System, ob der Kunde seine Daten bereits aktualisiert hat. Ist dies der Fall, werden die Benachrichtigungen beendet. Andernfalls werden sie fortgesetzt, bis Revenue meldet, dass die Karte abgelaufen ist. Als aktualisiert gelten die Kartendaten, sobald das System von MPay eine neue Asset-ID samt NTR erhalten hat.