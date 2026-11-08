# Batch 967 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Aktualisierung von Vertragsvorschlägen bei der Leasing-Integration

Die bestehende Leasing-Integration der Vertragserstellung deckte bislang nur den sogenannten Happy Flow ab, also den direkten Weg von der Erstellung bis zur Aktivierung ohne Änderungen dazwischen. Dieser Ablauf wurde um Änderungen erweitert, die vom Endkunden ausgehen und Produkt, Fahrzeug, Laufleistung oder Laufzeit betreffen. oneSCM kann nun Änderungen an bestehenden, noch nicht aktivierten Verträgen berücksichtigen, ohne dass der Vertrag storniert und neu angelegt werden muss. Dies ist insbesondere für angebundene Systeme wie MBLD relevant, deren Anforderungen damit erfüllt werden. Bei preisrelevanten Änderungen werden bereits erstellte Verträge aktualisiert.

Der Lebenszyklus eines Vertragsvorschlags richtet sich nach der Gültigkeit des Angebots und nach Konfigurationsänderungen. In den Market Settings für MBLD wird dazu das neue Feld "Proposal Validity" gepflegt, das die Gültigkeit in Tagen angibt. Läuft die Angebotsgültigkeit ab, setzt das System den Vorschlag automatisch auf den Status "Rejected". Ist das Angebot noch gültig und MBLD fordert die Stornierung des Vertrags an, wird der Vorschlag ebenfalls auf "Rejected" gesetzt, und das System gibt den Antwortstatuscode 200 zurück.

Möchte MBLD eine bereits bestätigte Konfiguration ändern, ruft MBLD über den Aggregator die Vertragskalkulation auf, um ein Preisangebot für die neue Konfiguration zu erhalten. Diese kann ein anderes Produkt und/oder andere Einstellungen enthalten. Anschließend übermittelt MBLD die neue Produktkonfiguration samt Preis über den Aggregator an die Vertragserstellung. Dort wird der bestehende Vorschlag mit den neuen Werten überschrieben, wobei die Referenznummer unverändert bleibt. Die Angebotsgültigkeit wird zurückgesetzt. Konfigurationsänderungen sind beliebig oft möglich, der Aktivierungsprozess wird am aktuellen Schritt fortgesetzt, und das System gibt den Antwortstatuscode 200 zurück. Fordert MBLD keine Änderungen an, läuft die Aktivierung wie gewohnt weiter.

Ein Vertrag kann die Status "Created", "Confirmed", "Activated" und "Rejected" annehmen. "Confirmed" gilt, sobald MBLD den Vertrag und die Konfiguration mit dem Kunden bestätigt; das Bestätigungsdatum wird in der Benutzeroberfläche angezeigt. "Activated" bedeutet, dass der Vertrag aktiviert wurde, "Rejected", dass er abgelehnt wurde.

Bei der Benutzerbehandlung gilt: Ist ein Verkäufer von MBLD in Alice vorhanden, aber nicht oneSCM zugeordnet, werden Anfragen und Vertragsaktivierungen akzeptiert. Für Verkäufer, die in Alice nicht vorhanden sind, ist das Vorgehen noch zu klären.

In der Detailansicht des Vertrags bzw. im Reiter "Vertrag" werden Informationen zum Verkäufer angezeigt: Vor- und Nachname, E-Mail-Adresse, Name des Händlers und Stadt. Wo Informationen nicht verfügbar sind, wird "-" angezeigt, wobei die Struktur unabhängig von der Quelle gleich bleiben soll. Offen ist, ob Vor- und Nachname vom externen System verpflichtend geliefert werden müssen, da die aktuelle API-Version sie nicht bereitstellt.

Für den Vertragsbeginn gilt: Bei fahrzeugbezogenen Produkten wird das Datum der Erstzulassung als Vertragsbeginn verwendet, bei vertragsbezogenen Produkten das Verkaufsdatum.