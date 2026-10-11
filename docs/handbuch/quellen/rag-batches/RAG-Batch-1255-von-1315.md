# Batch 1255 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Neuerungen im Bereich Contract Calculation**

**Produktverwaltung und Produktdefinition**

Die Produktstruktur wurde um Ablaufkriterien (Expiry Criteria) erweitert. In Schritt 3 „Sales and Contract Configurations“ lautet die Beschriftung nun „Select the Expiry Criteria“. In Schritt 8, der Produktzusammenfassung, heißt die Angabe im Bereich „Blueprint Setup“ jetzt „Expiry Criteria“ statt „Regular Expiry Criteria“. Die dort gewählten Optionen bleiben dabei erhalten. Im Bereich „Sales and Contract Configurations“ gibt es zusätzlich das Feld „Selected Expiry Criteria“. Es steht direkt nach „Applicable Industries“ und zeigt die Optionen, die Sie in Schritt 3 für das Produkt ausgewählt haben.

Das Feld „Additional Information“ in der Produktdefinition ist künftig optional. Bisher waren hier mindestens 10 und höchstens 50 Zeichen verpflichtend. Ob künftig auch weniger als 10 Zeichen eingegeben werden dürfen und ob die Obergrenze von 50 Zeichen angehoben wird (auf dasselbe Maximum wie beim Feld „Product Description“), war zum Zeitpunkt der Beschreibung noch nicht abschließend festgelegt.

Die Formatierungsmöglichkeiten der Produktbeschreibung sollen erweitert werden, insbesondere um Absätze und Hyperlinks. Bisher sind die Möglichkeiten im Textfeld sehr begrenzt, und die Formatierung wird bei der Vertragserstellung nicht berücksichtigt.

**Preisverwaltung**

Die Preis-Cluster (Price Clusters) werden alphabetisch sortiert. Das erleichtert die Suche, vor allem bei Produkten mit sehr vielen Clustern. In Deutschland sind es im Bereich Passenger Car etwa 100 Cluster pro Produkt.

Ein Preis-Cluster lässt sich über zwei Wege aufrufen: über eine Preisversion oder über die Fahrzeuggruppe. Bisher waren die Felder auf der Detailseite nur beim Weg über die Preisversion bearbeitbar. Künftig verhalten sich beide Wege einheitlich, und die Datenfelder des Preis-Clusters sind in beiden Fällen bearbeitbar. Das gilt auch für den „Pricing Factor“, der bisher in beiden Varianten schreibgeschützt war.

Das Limit für den Industry-Faktor in Prozent lag bisher bei 100 %. Es soll auf mindestens 200 % angehoben werden, damit sich z. B. der in der Van-Sparte in Deutschland für Taxi verwendete Faktor von 150 % abbilden lässt. Für Industry sind laut Beschreibung ein Maximalwert von 999 und ein Minimalwert von 0 vorgesehen.

**Verwaltung von Kampagnen**

Das Feld „External Campaign ID“ lässt beim Anlegen oder Bearbeiten einer Kampagne künftig keine Leerzeichen mehr zu.

**VEGA-Codes**

Die Ansicht „View“ für Coverage Codes und Industry Codes im Admin-Bereich unter „VEGA Codes“ wird an die Übersichtsseite („Overview“) angeglichen. Dazu werden die Beschriftungen „Market and Language“, „Coverage Name“ und „Family Tag“ ergänzt. Außerdem entspricht die Reihenfolge der Märkte in der Ansicht künftig der Reihenfolge auf der Übersichtsseite.

**Geplant, aber noch nicht umgesetzt**

Für die Zuordnung von Industries zu veröffentlichten Produkten sind Änderungen vorgesehen. Wenn Sie eine Industry mit einem Produkt verknüpfen, für das bereits Preise existieren, soll nach dem Speichern der Seite ein Warnhinweis erscheinen: „Prices should be assigned to the Industry in order to use the Industry“. Beim Veröffentlichen eines Produkts soll ebenfalls eine Warnung erscheinen, wenn es Objekte ohne Preise gibt. Bisher deaktiviert das System das Produkt bei der Verknüpfung, meldet „Product was successfully updated“ und erlaubt das Veröffentlichen auch ohne Preise für die neu verknüpfte Industry.

Wird eine Industry von einem veröffentlichten Produkt gelöst, soll dies künftig nur ab der aktuellen Preisversion gelten, und die Meldung wird entsprechend angepasst. Die Preise, die der Industry in der aktuellen Preisversion zugeordnet sind, bleiben unverändert erhalten und werden nicht gelöscht.

Außerdem ist geplant, das Startdatum zukünftiger Preisversionen auch dann änderbar zu machen, wenn das Produkt den Status „published“ hat. Bisher muss das Produkt dafür deaktiviert werden. Das ist im Produktivbetrieb nicht praktikabel, da ein deaktiviertes Produkt nicht verkauft werden kann.