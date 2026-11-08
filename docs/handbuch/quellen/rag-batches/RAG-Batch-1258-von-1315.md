# Batch 1258 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Änderungen und Verbesserungen**

**Preisberechnung bei langfristigen Verlängerungen**
Bei einer langfristigen Verlängerung eines Vertrags, dessen erster Zulassungstag (FRD) in der Vergangenheit liegt, wurde der Preis optionaler Deckungen bisher falsch berechnet. Der Betrag aus der Preismatrix wurde nur für 10 Monate herangezogen, obwohl die Vertragslaufzeit 12 Monate beträgt. Ein Beispiel: 120 EUR bei 12 Monaten ergeben 10 EUR pro Monat, über 10 Monate also nur 100 EUR. Nun wird der Betrag aus der Preismatrix für 12 Monate zugrunde gelegt und auf die 10 Monate verteilt: 120 EUR bei 10 Monaten ergeben 12 EUR pro Monat, über 10 Monate also 120 EUR. Dasselbe Vorgehen gilt für optionale Deckungen, deren Preismatrix pro Monat hinterlegt ist. Es gilt auch für Fälle ohne FRD in der Vergangenheit: Wird bei der Verlängerung eine neue optionale Deckung hinzugefügt (nur Laufleistung), wird die gesamte Vertragslaufzeit berechnet.

**Produktanlage und Produktverwaltung**
In Schritt 4 der Produktanlage wurde bisher in der Deckungstabelle ein grünes Häkchen sowohl für enthaltene Deckungen als auch für optionale Deckungen verwendet, die von der Preisberechnung ausgeschlossen wurden. Das führte zu Verwirrung. Die Kennzeichnung wurde überarbeitet, sodass klarer erkennbar ist, welche Positionen in die Preisberechnung einbezogen und welche ausgeschlossen sind.

In der Übersicht „Manage Products & Prices“ steht im Menü der Spalte „Actions“ nun unabhängig vom Produktstatus und vom Benutzer die Aktion „View“ zur Verfügung. Sie erscheint als erster Eintrag in der Liste. Außerdem wurde der Begriff „Bundle“ aus der Benutzeroberfläche entfernt.

**Blueprints**
Beim Erstellen eines Blueprints für Contingent-Produkte (Ablaufkriterium „Contingent“) war die Auswahl der Basisdeckungen im zweiten Schritt bisher eine Mehrfachauswahl. Sie ist nun eine Einfachauswahl. Zudem wurde der Contingent Blueprint erweitert; die Darstellung wurde gegenüber dem bisherigen Stand angepasst.

**Fahrzeugalter**
Das Feld „Vehicle Age“ wird nun in Monaten geführt, wobei 1 Jahr 12 Monaten entspricht. Die Berechnung erfolgt im Backend auf Monatsbasis.

**Technische Optionen**
Der Name von Fahrzeuggruppen darf künftig maximal 100 Zeichen lang sein. Außerdem wurde die Seite „Technical Options“ angepasst: Die Bereiche „Select TO Groups“ und „Technical Options Group Information“ sollen aneinander ausgerichtet sein.

**Branchenbezeichnungen (Industry Codes)**
Im Admin-Bereich unter „VEGA Codes“ im Reiter „Industry Codes“ muss der Name einer Branche beim Anlegen eines Industry Codes eindeutig sein. Dies wurde sowohl im Frontend als auch im Backend umgesetzt.

**Kampagnenverwaltung**
In der Übersicht „Manage Campaigns“ gibt es eine neue Spalte „Products“. Sie zeigt die Produkte an, für die die jeweilige Kampagne angelegt wurde. Außerdem wurde im Aktionsmenü die Aktion „Reactivate“ entfernt, und zwar für Kampagnen mit dem Status „Deactivated“, deren Gültigkeitsende (Valid To) vor dem aktuellen Datum liegt.

**Rückmeldung an die Generierung**
Das System übermittelt nun den Grund in der Antwort an die Generierung. Hintergrund ist, dass Produkte für ein Fahrzeug teilweise nicht mehr angezeigt wurden, weil das Fahrzeug inzwischen in Betrieb war, die entsprechenden Daten in DSB aber zunächst noch nicht vorlagen.