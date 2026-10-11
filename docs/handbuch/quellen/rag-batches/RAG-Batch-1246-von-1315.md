# Batch 1246 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Preismatrizen: Bereich und Schrittweite**

Bisher werden die Preismatrizen eines Produkts über Bereiche konfiguriert, und zwar für die Laufzeit (minimale und maximale Monate sowie Schrittweite) und für die Laufleistung (minimale und maximale Laufleistung sowie Schrittweite). Das war nicht für alle Märkte ausreichend, denn manche Märkte verkaufen nur eine einzige gültige Kombination, etwa die Schweiz mit ausschließlich vier Jahren Laufzeit und 120.000 km Gesamtlaufleistung. Preismatrizen konnten bisher nicht mit gleichen Werten für Minimum und Maximum angelegt werden. Künftig sind auch Matrizen mit nur einem Wert möglich. Dies gilt für alle Matrixarten, bei denen Schrittweiten eine Rolle spielen, also für Contingent-Produkte sowie für Reifen und Reifenkomponenten.

Die Eingabe der Schrittweite richtet sich dynamisch nach den eingegebenen Werten. Sind Minimum und Maximum gleich, ist das Feld für die Schrittweite optional und kann leer bleiben. Die Konfiguration lässt sich dann ohne Fehlermeldung speichern, zum Beispiel bei 12 zu 12 oder 24 zu 24 Monaten. Sind Minimum und Maximum verschieden, ist die Schrittweite ein Pflichtfeld. Das Maximum muss dann ein exaktes Vielfaches der Schrittweite ab dem Minimum sein. Andernfalls erscheint die Meldung „Maximum duration must be an exact multiple of the step starting with minimum duration“, und das Speichern wird verhindert. Das gilt beispielsweise für 12 bis 30 Monate bei einer Schrittweite von 12 oder für 12 bis 24 Monate bei einer Schrittweite von 5. Gültige Kombinationen wie 12 bis 24, 12 bis 36 (jeweils Schrittweite 12) oder 24 bis 48 (Schrittweite 6) werden akzeptiert. Bei der Laufleistung gilt weiterhin eine absolute Untergrenze: Wird etwa ein Minimum von 5.000 km und ein Maximum von 9.000 km eingegeben, erscheint die Meldung „Minimum value is 10.000“, und das Speichern wird blockiert.

**Produktverwaltung: Aussagekräftigere Fehlermeldung bei nicht veröffentlichbaren Produkten**

Ein Produkt kann nicht veröffentlicht werden, solange die Preisversion nicht freigegeben ist. Bisher lautete die Fehlermeldung lediglich „{Produktname} could not be published“. Das führte auf Marktseite mehrfach zu Verwirrung, weil den Nutzern nicht auffiel, dass ihre Preisversion noch freigegeben werden muss. Künftig soll die Meldung den Grund nennen: „{Produktname} could not be published, because {Grund}“.

**Kampagnenverwaltung: Entfall der „Provision Component“**

Das Feld „Provision Component“ war bisher für den Kampagnentyp „Sales“ ein Pflichtfeld. Es wurde nur für NACOS benötigt und wird von keinem der FI-Systeme mehr gebraucht. Daher wird es für keinen Kampagnentyp mehr angezeigt und vollständig aus der Datenstruktur der Kampagnen entfernt.

**Bestellnummern-Ablauf für Produkte**

Bei Bestellnummern der Typen GO, AFAB, VERSO und OTR, zu denen in den Bestellnummerndaten eine Fahrgestellnummer vorliegt, die in VEDOC noch nicht vorhanden ist, werden die Produkte angezeigt. Vor der Aktivierung prüft der Vertrag die Kompatibilität von Produkt und Preis. Anlass war ein Fall, in dem eine OTR-ID zwar eine FIN/VIN enthielt, diese aber in oneSCM nicht auffindbar war, da sie in VEDOC noch fehlte.

**Technische Korrektur: Länge der Motor-Seriennummer**

Bei der Synchronisation eines Fahrzeugs aus VEDOC trat ein Fehler auf, weil ein Wert für die Motor-Seriennummer für das Datenbankfeld mit 14 Zeichen zu lang war. Die zulässige Länge dieses Feldes wird erhöht.

**Austausch der Van-Bilder im Bildspeicher**

In allen Umgebungen (DEV, INT, PRE-PROD und PROD) werden die beiden Bilder „Vans-1.png“ und „Vans-6.png“ aus dem Bereich der Marketingbilder für Vans gelöscht und durch neue Bilder ersetzt. Die neuen Bilder gelten für die Division Vans und die Produktlinie Maintenance und stehen bei der Blueprint-Erstellung sowie bei der Produkterstellung und -bearbeitung zur Verfügung. Auf PROD verwendet kein Blueprint und kein Produkt die gelöschten Bilder.

**Vega-Codes und Art der Deckung**

Die Art der Deckung (Coverage) wird künftig in den Vega-Codes definiert.

**Verbindung zwischen Sales Logic und Grenzwerten**

Das System hält eine Verbindung zwischen der Sales Logic (FRD-bezogen und nicht FRD-bezogen) und den Grenzwerten der Fahrzeugvoraussetzungen aufrecht. Sind die Grenzwerte für die gewählte Sales Logic nicht mehr anwendbar, werden sie auf den Standardwert zurückgesetzt.

**Änderung der Administrationsgebühr**

Die Administrationsgebühr wird künftig auf alle Rechnungen verteilt, genau wie die übrigen Kosten.