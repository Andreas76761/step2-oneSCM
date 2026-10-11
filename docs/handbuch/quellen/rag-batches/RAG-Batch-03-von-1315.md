# Batch 3 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeugverwaltung (Vehicle Management): Änderungen und Anpassungen**

Im Bereich Fahrzeugverwaltung wurden zuletzt mehrere Themen rund um Vertragserstellung, Produktverwaltung und Fahrzeuggruppen bearbeitet.

**Vertragserstellung**

Bei der Vertragserstellung wurden zwei Fehler behoben. Zum einen löste die Eingabe eines achtstelligen Baumusters eine Fehlermeldung aus. Zum anderen zeigte der BM6-Ablauf für Transporter (Vans) bei der Verkaufsbezeichnung nur einen einzigen statischen Wert an, obwohl je nach BM6 und Motortyp mehrere Werte möglich sind. Beide Punkte sind abgeschlossen.

Ein weiterer Fehler betraf die Abfrage verfügbarer Produkte bei der Vertragserstellung für MBIL, bei der ein 500er-Fehler auftrat. Die Bearbeitung dieses Punktes wurde abgebrochen.

**Produktverwaltung**

Derzeit können Produkte mit der Verkaufslogik „FRD Not Related“ und dem Ablaufkriterium „Contingent“ angelegt werden, zum Beispiel auf Basis der Vorlage „Maintenance Contingent“ in der Vorproduktionsumgebung. Solche Produkte erscheinen im Vertragserstellungsprozess jedoch nur bei Suche mit einem Baumuster, nicht aber bei Suche mit einer FIN oder VIN. Ziel ist, dass Contingent-basierte Produkte auch mit der Verkaufslogik „FRD Not Relevant“ verkauft werden können. Die Umsetzung ist derzeit pausiert (Status „On Hold“).

Außerdem ist geplant, Daten für die Anzeige kompatibler Produkte bereitzustellen (Teil 2). Dabei sind zwei Prüfungen vorgesehen. Die erste Prüfung greift, wenn das Fahrzeugalter (bei FRD-basierter Logik) das für das Produkt zulässige Höchstalter überschreitet. Die zweite greift, wenn die Laufleistung des Fahrzeugs das Maximum für das Produkt überschreitet. In beiden Fällen erscheint die Meldung, dass die eingegebene Kennung keine Ergebnisse geliefert hat. Anwender werden gebeten, ihre Eingabe zu prüfen und anzupassen und eine gültige Fahrgestellnummer, Auftragsnummer oder einen gültigen Baumustercode einzugeben. Alternativ sollen sie je nach Fall den FRD bzw. die Laufleistung des Fahrzeugs prüfen. Dieses Vorhaben befindet sich im Dev Backlog.

Zudem ist die Neuberechnungslogik für Flottenkonditionen als Vorhaben angelegt. Eine inhaltliche Beschreibung liegt noch nicht vor; der Status ist offen.

**Fahrzeuggruppen**

Bei der Pflege von Fahrzeuggruppen für Pkw und Vans wurde die automatische Namensvergabe auf Basis von Filtern im Bearbeitungsablauf angepasst. Zuvor ließ sich der Schalter „System-Generated Vehicle Group Name & Description“ nach dem Anlegen einer Fahrzeuggruppe beim Bearbeiten nicht mehr umschalten, sondern blieb im ursprünglichen Zustand. Künftig kann der Schalter auch beim Bearbeiten aktiviert oder deaktiviert werden. Aus Konsistenzgründen gilt im Anlegeprozess: Wenn ein Name automatisch generiert wurde und der Benutzer zum ersten Schritt zurückkehrt, sind die Felder „Vehicle group name“ und „Vehicle group details“ mit dem generierten Namen und der generierten Beschreibung befüllt. Dieser Punkt ist abgeschlossen.

Außerdem wurde ein Darstellungsfehler behoben: Eine lange, zusammenhängende Zeichenfolge ragte aus dem vorgesehenen Beschreibungsbereich einer Fahrzeuggruppe heraus. Ebenfalls abgeschlossen ist die Korrektur, bei der Fahrzeuggruppen ein Cluster fehlte.

**Massenanlage und Validierung**

Die Massenanlage in der Fahrzeugverwaltung wurde angepasst, damit die Produktberechtigung für Fahrzeuge geprüft wird, die von der Generation-Domäne übermittelt werden. Das System nimmt eine Liste von Fahrzeugen mit Fahrgestell- und Auftragsnummern entgegen und prüft jedes Fahrzeug darauf, ob das Produkt samt Konfiguration anwendbar ist, ob ein gültiger FRD vorliegt (falls zutreffend) und ob Daten zur tatsächlichen Laufleistung vorhanden sind (falls zutreffend). Der Berechtigungsstatus wird an die Generation-Domäne zurückgemeldet, sodass die Liste bei Bedarf korrigiert und erneut gesendet werden kann.

Nach Abschluss der Validierung aller Fahrzeuge erhält die Generation-Domäne den Endstatus der Liste, einschließlich der eindeutigen ID der Tabelle auf der Backend-Seite und eines Fortschrittszählers. Zusätzlich wird über die Benachrichtigungsdomäne eine interne Benachrichtigung an die vorgesehenen Nutzergruppen (Händler, MO und MPC) versendet, über die die Ergebnistabelle erreichbar ist. Sonderfälle, die die Generation-Domäne anstößt, werden verarbeitet, ohne die Validierung der übrigen Fahrzeuge zu unterbrechen. Eine korrigierte Liste wird als neue Validierungsanfrage behandelt und führt zu einem neuen Ergebnis und einer neuen Benachrichtigung. Dieser Punkt ist abgeschlossen.

**Batch-Verarbeitung**

Schließlich wurde ein Fehler im Batch-Job CeproImport behoben, der zuvor fehlschlug. Auch dieser Punkt ist abgeschlossen.