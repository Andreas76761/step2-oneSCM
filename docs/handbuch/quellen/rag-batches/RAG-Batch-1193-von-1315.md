# Batch 1193 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Flottenkonditionen für Produkte mit eigener Zeitgültigkeit und Nutzungslimit**

Bisher laufen Kampagnen für einen bestimmten Zeitraum und enden automatisch nach dem Datum „Gültig bis“. Weder der Geldbetrag, der für eine Kampagne aufgewendet wird, noch die Anzahl der Verträge, auf die der Kampagnenrabatt angewendet wird, ist begrenzt. Beides ist erst nach Ablauf der Gültigkeit bekannt. Mit dem Geschäft für Kunden, die Verträge für eine ganze Fahrzeugflotte abschließen, ändert sich der Charakter einer Kampagne. Flottenkonditionen enthalten zusätzlich oder ergänzend zum Gültigkeitszeitraum Grenzen, etwa einen maximalen Gesamtbetrag oder eine maximale Anzahl an Verträgen, auf die der Kampagnenrabatt angewendet werden darf.

Dafür soll es möglich sein, Ablaufkriterien auf Basis zählbarer Größen zu definieren. Das Limit kann entweder ein Gesamtbetrag (zum Beispiel 50.000 EUR) oder eine maximale Anzahl an Verträgen bzw. Fahrzeugen (zum Beispiel 50 Verträge) sein. Es soll als alleinige Begrenzung der Kampagne oder zusätzlich zum bestehenden Gültigkeitszeitraum festgelegt werden können. Die Kampagne muss erfassen können, ob die festgelegte Vertragsanzahl erreicht ist oder ob die Summe der auf Verträge angewendeten Kampagnenrabatte das definierte Limit erreicht. Wird das Limit überschritten, wird die Kampagne nicht mehr angeboten.

Als Alternative wird diskutiert, Flottenkonditionen über ein eigenes Produkt abzubilden, das Flottenpreise und ein spezielles Abruflimit enthält. Dieses Limit ist eine Obergrenze für die Anzahl an Verträgen bzw. Fahrzeugen, die zu den definierten Konditionen verkauft werden dürfen. Ein solches Produkt benötigt eine Erweiterung, um das Limit zu setzen und die mit dem Produkt verkauften Verträge zu zählen. Dabei muss festgelegt werden, bei welchem Vertragsstatus gezählt wird, da eine einfache Preisanfrage den Zähler voraussichtlich nicht erhöhen soll. Berücksichtigt werden sollen nur unterzeichnete Verträge. Bei der Fehlerbehandlung muss ein noch nicht unterzeichneter Vertrag, der bei der Aktivierung das Limit überschreiten würde, konsequent abgelehnt werden. Welche der beiden Varianten umgesetzt wird, ist noch Gegenstand der Abstimmung.

Die Funktion richtet sich an die für die Einrichtung von Produkten und Preisen verantwortlichen MPC-Anwender. Der Status dieser Anforderung ist derzeit offen.

**Produktdefinition nach Kundentypen**

OneSCM unterscheidet bislang zwei Kundentypen: Privat und Gewerblich. Der Kundentyp wird im Modul zur Vertragserstellung ausgewählt, vor allem damit die jeweils gültigen gesetzlichen Steuersätze angewendet werden. Auf Ebene der Produkteinrichtung gibt es bisher keine kundentypspezifische Konfiguration; alle vorhandenen Produkte stehen sowohl privaten als auch gewerblichen Kunden zur Verfügung.

Neu eingeführt wird der dritte Kundentyp „Commercial Fleet“. Damit sollen KAM-Anwender, die überwiegend gewerbliche Flottenkunden betreuen, deren besondere Anforderungen an Preise, Laufleistungen und individuelle Produktkonfigurationen besser abbilden können. Es lassen sich so flottenspezifische Produkte anlegen, und auf Sonderwünsche kann flexibler reagiert werden. Die Funktion ist für die neue Rolle KAM MPC vorgesehen.

Im Modul „Manage Products & Prices“ erscheint, sobald die Basisinformationen des Produkts erfasst sind und die Seite „Sales and Contract Configurations“ erreicht wird, das neue Feld „Customer Type“. Es bietet eine Mehrfachauswahl, mit der ein oder mehrere Kundentypen gewählt werden können: Privat, Gewerblich und Commercial Fleet. Standardmäßig sind in der Seite „Sales and Contract Configurations“ alle Kundentypen ausgewählt. Der gewählte Kundentyp wird außerdem in der Produktzusammenfassung angezeigt, und es sollen weitere Filter hinzukommen.

Im Modul zur Vertragserstellung werden dadurch nur noch die Produkte angezeigt, die dem jeweils gewählten Kundentyp zugeordnet sind. Diese Anforderung ist abgeschlossen.