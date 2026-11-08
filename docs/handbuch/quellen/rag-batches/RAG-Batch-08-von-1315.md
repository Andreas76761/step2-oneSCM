# Batch 8 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 25 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeugverwaltung (Vehicle Management)**

In der Fahrzeugverwaltung wurden zahlreiche Verbesserungen und Fehlerbehebungen umgesetzt. Sie betreffen vor allem die Fahrzeuggruppen, die TO-Gruppen, den CePro-Import und den Admin-Bereich.

**Fahrzeuggruppen**

Beim Anlegen einer Fahrzeuggruppe für Personenwagen bleibt die Schaltfläche „Weiter“ nun in jedem Schritt aktiv, auch wenn noch nicht alle Pflichtfelder ausgefüllt sind. Versucht die MPC-Benutzerin oder der MPC-Benutzer fortzufahren, erscheinen unter jedem noch auszufüllenden Feld entsprechende Fehlermeldungen. Damit entspricht der Ablauf dem bereits bestehenden Vorgehen im Bereich Vans.

Im Bereich Vans wird beim Anlegen einer Fahrzeuggruppe bereits im ersten Schritt geprüft, ob der Gruppenname schon vergeben ist. Ist das der Fall, erscheint eine Validierungsmeldung am Eingabefeld, und die Gruppe kann nicht mit diesem Namen angelegt werden. Außerdem werden das Produkt und die Preisversion, die auf der vorherigen Seite ausgewählt wurden, im ersten Schritt der Anlage nun vorausgewählt.

Bei der Auswahl der Filterkriterien wird für Felder, die in der Datenbank keinen Wert enthalten, nun „N/A“ angezeigt. Nach diesem Wert kann sortiert und gefiltert werden. Dadurch lassen sich auch Fahrzeuggruppen mit nicht zugeordneten Fahrzeugen anlegen. Beim Anlegen und Bearbeiten werden nach der Auswahl einer Klasse nur noch die dazugehörigen Baureihen angeboten. Außerdem wurde ein Fehler behoben, bei dem die Weitere-Filter-Funktion beim Anlegen einer Fahrzeuggruppe nicht korrekt funktionierte.

Ein weiterer Fehler betraf die Tabellenanzeige: Wer eine Fahrzeuggruppe ansah, dann über die Zurück-Funktion des Browsers statt über die bereitgestellte Zurück-Schaltfläche zurückkehrte und anschließend eine andere Gruppe öffnete, sah zunächst den Tabelleninhalt der vorherigen Gruppe. Dies wurde korrigiert.

Bei den Schnittstellen zum Löschen, Klonen und Aktualisieren von Fahrzeuggruppen sowie zum Zuweisen eines Clusters zu einer Fahrzeuggruppe ist die Angabe einer Preis-ID in der Anfrage nicht mehr erforderlich. Das gilt für Personenwagen und Vans gleichermaßen.

**TO-Gruppen**

Bei der Anlage einer TO-Gruppe wird nun ein doppelter Gruppenname erkannt. Zudem lässt das Feld „Gruppenname“ keine Sonderzeichen mehr zu. Die Sortierung nach Gruppenname und Division funktioniert jetzt korrekt.

**Vertragserstellung und ISP-Codes**

Bei der Vertragserstellung wurde für Fahrzeuge, die sicher einen ISP besitzen, fälschlich der Hinweis „vehicle might have ISP“ angezeigt. Dieser Fehler wurde behoben. Ebenfalls korrigiert wurden der nicht funktionierende Upload von ISP-Codes sowie das falsche Datumsformat in der Tabelle der ISP-Codes. Darüber hinaus wurde ein Fehler beim Aktualisieren des DAMAGES-Codes behoben.

**Fahrzeugdaten und CePro-Import**

Die Marke AMG kann nun wie Maybach als Marke angezeigt werden. Dadurch lassen sich Fahrzeuge für Märkte gezielt filtern, insbesondere um AMG-Modelle ohne Performance-Motor von normalen Fahrzeugen zu unterscheiden. Beim CePro-Import wurden fehlerhafte Daten korrigiert: Fahrzeuge mit 4Matic und Hybridmotor wurden zuvor nicht richtig übernommen. Außerdem wurde ein Fehler behoben, durch den der CePro-Import-Batch-Job fehlschlug und weitere Tests auf der Preprod-Umgebung blockierte.

**Admin-Bereich**

Im Admin-Bereich der Fahrzeugverwaltung werden die Einträge der Tabelle „Engine Series“ nun aufsteigend nach der Spalte „Engine Series“ sortiert. HQ-Administratoren können so schnell erkennen, welche Einträge vorhanden sind oder fehlen, ohne alle sechs Seiten einzeln öffnen zu müssen.