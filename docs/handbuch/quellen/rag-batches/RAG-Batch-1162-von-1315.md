# Batch 1162 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 31 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Neuerungen und Funktionen**

**VEGA-Codes und Coverage Codes**
Das Modul VEGA Codes befindet sich im Bereich Product Management und ist nicht Teil des Admin-Bereichs. Die Rollen HQ, MPC und MO verfügen dort über vollständige CRUD-Rechte. Beim Anlegen eines Coverage Codes steht in der Kategorie-Auswahl die Option "Tire Option" zur Verfügung, und zwar sowohl für die Division Van als auch für die Division Passenger Cars. Für diese Kategorie gelten feste Regeln: Der Code muss genau vier Zeichen lang sein und standardmäßig mit "T" beginnen, zum Beispiel T001. Ist der Code kürzer als vier Zeichen, erscheint die Fehlermeldung "Must be at least 4 characters long." Ein bereits vorhandener Code wird vom System abgelehnt, und es erscheint die Meldung "Coverage Code for this division is already existing. Please change it and try again." Voraussetzung für das Anlegen ist ein MPC- oder HQ-Zugriff. Außerdem lässt sich der VEGA-Vertragstyp in Blueprints bearbeiten, sofern ein Blueprint mit mindestens einem veröffentlichten Produkt vorhanden ist.

**Auswahl von Baumustern und Preis-Clustering für Van**
Für die Baumuster-Auswahl und das Preis-Clustering bei Vans (TKZ-Bezeichnung, einschließlich marktspezifischer Ausschlüsse) stehen SA-Codes zur Verfügung. Voraussetzung ist, dass eine Produkt- und Preisversion vorhanden ist. Es lassen sich mehrere SA-Codes gleichzeitig auswählen, und die SA-Codes müssen bei der Filterung eindeutig sein. Die Anzahl der Modelltypen im Bereich "Results" passt sich der Auswahl der SA-Codes an. In der Vorschau wird die Anzahl der Modelltypen unter den SA-Codes dagegen nicht angezeigt. Modellcodes müssen entweder 6- oder 7-stellige Zahlen sein.

**AFAB-API und Fahrzeugstammdaten für Vans**
Wird die AFAB-API aufgerufen, werden die Fahrzeugstammdaten für Vans aus dem Van-spezifischen Bestellsystem abgerufen. Das gilt sowohl für den Kundentyp "Gewerblich" als auch für den Kundentyp "Privat". Voraussetzung ist ein verfügbares Produkt.

**Verkaufsbeschränkung für nicht kompatible Produkte**
Produkte mit sich überschneidender Basisabdeckung können von Kunden nicht gemeinsam gewählt werden. Gewerbliche Kunden können mehrere Produkte ohne Überschneidung der Basisabdeckung auswählen, in den Divisionen Van und Passenger Cars. Private Kunden können ebenfalls mehrere Produkte ohne Überschneidung der Basisabdeckung wählen. Produkte mit überlappenden optionalen oder zusätzlichen Karosserieabdeckungen werden bei der Vertragserstellung angezeigt, ebenfalls in beiden Divisionen.

**Rollen und Berechtigungen**
Der Admin-Benutzer hat CRUD-Rechte auf die K/KJ-Codes unter Vehicle Management, während ihm die CRUD-Rechte für Contract Offering entzogen wurden. Der HQ-Benutzer hat CRUD-Rechte für Vehicle Management, Manage Vehicle Groups, Manage Campaigns sowie Manage Products & Prices. Der MO-Benutzer kann Contract Offering und Manage Campaigns ausschließlich ansehen. Der Dealer hat CRUD-Rechte für Contract Offering, kann das Modul Manage Products & Prices aber nur ansehen.

Das frühere Modul "Product Testing" wurde in "Contract Offering" umbenannt und unter Contract Generation verschoben. Es ist nicht mehr Teil von Product Management. Die Berechtigungen lauten: Dealer und MPC mit CRUD-Rechten, MO mit Leserechten.