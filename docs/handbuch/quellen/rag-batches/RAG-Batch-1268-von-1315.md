# Batch 1268 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Änderungen im Überblick**

**NACOS-Export und Download-Bereich**

Die Datei für den ROBO JOB wurde an die Anforderungen von NACOS angepasst. Auf der Download-Seite wird nur noch der ROBO JOB bereitgestellt. In der Datei bleiben die ersten drei Zeilen leer, da der Job in NACOS die Daten erst ab der fünften Zeile liest. Die vierte Zeile enthält die Spaltenüberschriften, die fünfte Zeile die Kundendaten. Die Felder NAME1 und NAME2 werden zusammengeführt und auf maximal 33 Zeichen begrenzt. Übersteigt der Text diese Länge, wird der Rest in das Feld Name 2 übernommen.

Wird eine Datei mit Kunden nicht verarbeitet, weil die gesendeten Daten nicht in der UPDATES-Schleife enthalten sind, werden diese Kunden automatisch in den nächsten Batch an NACOS aufgenommen. Die Tabellenansicht auf der Download-Seite zeigt zusätzlich an, welcher Benutzer die Datei heruntergeladen hat.

Sobald eine Datei zum Download bereitsteht, wird automatisch eine E-Mail an NACOS versendet. Der Empfänger ist fest hinterlegt. Die E-Mail weist darauf hin, dass die Datei bereitliegt, und enthält einen Link, der direkt zur Download-Seite führt. Außerdem nennt sie Kontaktadressen für technische und fachliche Rückfragen. Die Marktadressen operationOfMarket und emailOfMarket werden zu einem späteren Zeitpunkt im Rahmen der Market Configuration umgesetzt.

Die automatisch erzeugte Kundendatei für NACOS enthält außerdem jetzt das Feld „Tax Classification“ aus dem Bereich „Tax & Legal Details“ der Kundeninformationen. NACOS benötigt diese Angabe für die Rechnungsstellung.

**Preisversionen und Blueprints**

In der Tabelle der Preisversionen wurde der Vorschaubereich an den Standard angepasst, der bereits in anderen Bereichen wie Customer Management und MO Checks verwendet wird. Die Komponente hat nun einen grauen Rahmen, und die Schaltfläche „Add Cluster“ befindet sich nicht mehr oben, sondern im unteren Bereich der Vorschau.

Beim Erstellen eines Blueprints muss der Blueprint-Name zwischen 3 und 30 Zeichen lang sein. Ob der Name bereits vergeben ist, wird geprüft, sobald das Eingabefeld verlassen wird. Dafür wurde eine neue Backend-Schnittstelle geschaffen.

**Berechnung von Kampagnen und Rabatten**

Kampagnen und Rabatte werden nicht mehr gestapelt. Bisher wurde der Händlerrabatt auf den Kampagnenrabatt angewendet, und Kampagnen wurden mit Netto- und Mehrwertsteueranteil berechnet. Jetzt werden Kampagnen unabhängig von der Reihenfolge separat vom vollen Listenpreis abgezogen. Kampagnen und Rabatte haben nur eine Netto-Komponente und werden daher vom Nettopreis eines Produkts abgezogen.

Die Kampagnen wurden außerdem überarbeitet: Market Campaigns werden nun für jeden Markt einzeln angelegt. Eine Kampagne ist nur für MPC-Benutzer des jeweiligen Marktes sichtbar und wird nur auf Produkte angewendet, die in diesem Markt verkauft werden.

Beim Anlegen einer prozentualen Rabattkampagne sind die Felder „Amount“ und „Maximum Amount“ jetzt Pflichtfelder. In „Manage Campaign“ und in der Übersicht wird bei Prozentwerten das Komma statt des Punkts als Dezimaltrennzeichen verwendet.

**Ladeanzeigen**

Beim Öffnen der Preisseite eines Produkts dauerte das Laden der Produkte im Dropdown fünf bis sieben Sekunden. Das Dropdown zeigt nun einen Ladezustand an, damit erkennbar ist, dass die Einträge geladen werden. Dasselbe gilt für den fünften Schritt der Produkterstellung: Nach dem Anlegen eines neuen Limit-Presets dauerte es vier bis sechs Sekunden, bis der neue Eintrag in der Dropdown-Liste erschien. Auch hier wird jetzt ein Ladezustand angezeigt.

**Händlerverwaltung und Fahrzeugverwaltung**

Beim Registrieren oder Bearbeiten eines Händlers gibt es im Dialog das Dropdown „Type“ mit den Optionen „Dealership“ oder „Market“. Das Feld darunter ändert sich je nach Auswahl: Bei „Dealership“ heißt es „Vega ID“, bei „Market“ „Country Code ID“. Die Country Code ID besteht aus fünf Ziffern, zum Beispiel 20000 für Deutschland. In der Ergebnistabelle der Händlerverwaltung heißt die Spalte jetzt „Vega/Country Code ID“.

In der Fahrzeugverwaltung erscheinen die Ergebnisse nun automatisch, sobald ein Produkt und eine Preisversion ausgewählt wurden. Dies gilt auch, wenn die Preisversion später gewechselt wird. Hat ein Produkt nur eine Preisversion, wird diese automatisch vorausgewählt. Die Schaltfläche „Search“ wird nur noch benötigt, wenn die Liste mit einem Suchbegriff im Suchfeld durchsucht werden soll.

**Preis-Cluster**

In den Zellen und Preisfaktoren der Pricing Cluster wird nun das Komma als Dezimaltrennzeichen akzeptiert. Bisher wurden Werte mit Komma ohne Warnung nicht gespeichert. Ist eine Eingabe falsch formatiert, etwa „10,000.00“, wird der Benutzer darauf hingewiesen oder die Eingabe wird nach Möglichkeit automatisch korrigiert. Außerdem wird automatisch ein Tausendertrennzeichen eingefügt.