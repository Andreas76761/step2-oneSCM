# Batch 1189 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation**

**Online-Vertriebskanal in der Produkt- und Preisbereitstellung (Get products)**

Die externe Schnittstelle, die Produkte und Preise für den Vertriebskanal „Leasing" bereitstellt, wurde erweitert und unterstützt nun auch weitere Vertriebskanäle, darunter „OnlineSales". Wird die Schnittstelle für den Vertriebskanal „OnlineSales" abgefragt, enthält die Antwort ausschließlich Produkte und Preise, die gegen die Vertriebsebene „Direct-to-customer" sowie die zugehörigen Fahrzeugvoraussetzungen „Limits for Direct-to-customer" validiert wurden. Die Preispunkte werden dabei nicht von der jährlichen Fahrleistung in eine Gesamtfahrleistung umgerechnet, sondern wie bisher auf Basis der jährlichen Fahrleistung bereitgestellt.

**Basispreis-Cluster ohne Fahrzeuggruppe**

Bislang setzte die Preisdefinition eines Preisclusters zwingend die Verknüpfung mit einer Fahrzeuggruppe voraus, die mindestens eine bestehende Fahrzeugdefinition (Baumuster) enthalten muss. Der deutsche Markt pflegt jedoch alle Preise auf Basis eines künstlichen, nicht existierenden Modells und leitet daraus per Prozentfaktor die Preistabellen der real existierenden Modelle ab. Da künftig nur noch aktuell existierende und im Verkauf befindliche Modelle aus Cepro importiert werden, kann das bisher dafür genutzte alte Baumuster nicht weiter verwendet werden.

Innerhalb einer Preisversion lässt sich daher nun ein dediziertes Basispreis-Cluster anlegen. Es benötigt keine Verknüpfung mit einer Fahrzeuggruppe und wird durch eine Markierung als Basispreis gekennzeichnet. Beim Anlegen oder Bearbeiten eines Preisclusters steht hierfür eine zusätzliche Option zur Verfügung (zum Beispiel eine Auswahlbox „Set as Base Price Cluster"). Alle anderen Preiscluster können per Faktor beziehungsweise Prozentsatz aus diesem Basispreis-Cluster abgeleitet werden. Dadurch behält der deutsche Markt seine effiziente Preisstruktur bei, ohne veraltete Fahrzeugdaten weiterführen zu müssen.

Alle übrigen Funktionen einer Preiscluster-Definition bleiben unverändert verfügbar, etwa Basisdeckung, optionale Deckungen und technische Optionen. Wird ein bestehendes Cluster so geändert, dass es keine Fahrzeuggruppe mehr hat, weist ein Warnmechanismus auf einen möglichen Datenverlust hin. Beim Kopieren einer Preisversion verhält sich das Basispreis-Cluster wie ein gewöhnliches Preiscluster: Es wird mitkopiert, und die Markierung „Basispreis-Cluster" bleibt in der neuen Preisversion korrekt gesetzt.

**Hinweis zu noch nicht abgeschlossenen Themen**

Zu den Themen „Erweiterung der Neuberechnungslogik für Van-Produkte" und „Neuberechnungslogik für Flottenkonditionen" liegen derzeit keine inhaltlichen Angaben vor. Beide Themen befinden sich noch im Status „Offen" und sind daher im Benutzerhandbuch noch nicht beschreibbar.