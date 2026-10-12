# Batch 1183 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Preisberechnung für Gebrauchtfahrzeuge**

Für Gebrauchtfahrzeuge steht eine eigene Preislogik zur Verfügung, die getrennt von der Logik für Neufahrzeuge angewendet wird. Sie berücksichtigt, dass Fahrzeuge, die nach marktspezifischer Definition als „Gebraucht" gelten, andere Eigenschaften haben: Sie weisen eine höhere Wahrscheinlichkeit für Verschleiß auf, benötigen unter Umständen Ersatzteile oder zusätzliche Ausstattung, und der vom Kunden gezahlte Preis weicht oft deutlich vom Preis eines Neufahrzeugs ab. Genutzt wird die Funktion von MO, MPC und Händlern.

**Einrichtung im Produkt-Blueprint**

In der Blueprint-Einrichtung steht ein Dropdown-Feld „Sales Logic" zur Verfügung. Es bietet die Optionen „FRD Related", „FRD Not Related" und „Used Car Related". Die Auswahl treffen Sie über Product Management → Manage Product Blueprints → Create Blueprint → Sales Logic. Nach der Einrichtung wird die gewählte Berechnungslogik auf der Blueprint-Zusammenfassungsseite deutlich angezeigt.

Im Schritt „Vehicle Preconditions", in dem Grenzwerte für die drei Personas MPC/MOC, Händler und Direct-to-Customer festgelegt werden, kommen zwei zusätzliche Eingabefelder hinzu: „Maximum Vehicle Age at Contract End" und „Maximum Vehicle Mileage at Contract End". Sie verhindern, dass ein Produkt mit einer Laufzeit verkauft wird, die über das definierte Alter bzw. die definierte Laufleistung hinausgeht. Sobald das Epic ONESCM-31107 in Kraft tritt, löst es die speziell für „Used Car Related" entwickelte Obergrenzenlogik ab.

**Geltungsbereich und Voraussetzungen**

Die Gebrauchtwagenlogik gilt ausschließlich für den Grundpreis (Base Price) der Divisionen PC und VAN. Alle übrigen Preisbestandteile, etwa technische Optionen, optionale Absicherungen und Branchenfaktoren, verwenden weiterhin die bestehenden Kostenabhängigkeitseinstellungen. Für die Berechnung sind das Erstzulassungsdatum (FRD) und der aktuelle Kilometerstand erforderlich. Fehlt eines von beiden, kann die Berechnung nicht durchgeführt werden.

**Auswahl von Laufleistung und Laufzeit**

Zur Ermittlung der Werte wird die hinterlegte Grundpreismatrix herangezogen. Entspricht der aktuelle Kilometerstand einem Wert der Matrix (gemäß der definierten Schrittweite), wird dieser Wert verwendet; bei 30.000 also 30.000. Entspricht er keinem Wert, gilt der nächsthöhere Matrixwert; bei 24.000 wird somit 30.000 verwendet. Für die Laufzeit gilt dasselbe Prinzip: Bei 24 Monaten wird 24 Monate verwendet, bei 14 Monaten der nächsthöhere Matrixwert, hier 24 Monate. Die Laufleistung im neuen Vertrag muss mindestens dem aktuellen Kilometerstand entsprechen.

**Berechnung des Grundpreises**

Der Grundpreis ergibt sich aus der Differenz zweier Matrixpreise. Als Beispiel dient ein Kunde mit einem gut zwei Jahre alten Fahrzeug und einer durchschnittlichen Jahresfahrleistung von über 40.000, der einen Servicevertrag über drei Jahre bzw. 60.000 pro Jahr abschließt. Zunächst wird der Gesamtpreis (A) für fünf Jahre (zwei Jahre bisherige Nutzung plus drei Jahre gewünschte Laufzeit) bei 60.000 ermittelt, im Beispiel 36.000 Euro. Anschließend wird der Wert der bisherigen Nutzungsdauer (B) für zwei Jahre bei 40.000 bestimmt, im Beispiel 9.600 Euro. Der Grundpreis ist A minus B, also 36.000 − 9.600 = 26.400 Euro. Der berechnete Grundpreis darf unter keinen Umständen null oder negativ sein.

Die neu konfigurierte Jahresfahrleistung des Produkts wird mit der vom Kunden gewünschten Vertragslaufzeit multipliziert und ergibt die insgesamt zustehende Laufleistung für den Vertragszeitraum. Im Beispiel sind das 60.000 × 3 = 180.000.

**Hinweis zum Status**

Die Anforderungen der Fachseite für diese Funktion sind noch nicht abschließend eingearbeitet; die Beschreibung ist daher gegebenenfalls noch zu aktualisieren.