# Batch 1279 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 82 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: Vertragskalkulation (Contract Calculation)**

In diesem Release wurden zahlreiche Fehler in der Vertragskalkulation behoben und das Verhalten mehrerer Funktionen verbessert. Die Änderungen betreffen vor allem die Produktverwaltung, die Preismatrix, Cluster, Kampagnen sowie die Vertragserzeugung und -aktivierung.

**Produkte und Blueprints**

Bei der Anlage und Bearbeitung von Produkten wurden mehrere Probleme behoben. Produkte lassen sich in der Verwaltung von Produkten und Preisen wieder bearbeiten. Beim Bearbeiten eines Produkts wird der Bildpfad nun auch im zweiten Schritt gespeichert. SVG-Bilder an Produkten und Blueprints werden beim Bearbeiten im Übersichtsschritt korrekt angezeigt. Außerdem ist ein Klick auf das Bild auf der Zusammenfassungsseite bei der Produkterstellung nun korrekt umgesetzt. Beim Hochladen eines Marketingbilds tritt kein Zugriffsfehler (Access denied) mehr auf. Die Admin-Fee-Werte werden beim Erstellen und Bearbeiten eines Produkts gespeichert. Referenzwerte werden nach dem Deaktivieren nicht mehr beibehalten. Auch die Checkbox „Fahrzeuge mit Alter unter …“ in den Fahrzeugvoraussetzungen beim Bearbeiten eines Produkts funktioniert wieder korrekt. Darüber hinaus wurden die Anzeige der maximalen Laufleistung und des maximalen Alters in Schritt 4 der Produktkalkulation sowie ein Darstellungsfehler beim kompakten Produkt auf der Zusammenfassungsseite (Schritte der Gesamtlaufzeit) korrigiert. Die Blueprint-Parameter in Schritt 1 der Produkterstellung werden nicht mehr vermischt. Wird ein Blueprint-Name im Blueprint-Bereich geändert, aktualisiert sich der Name in der Produktübersichtstabelle. Die Eindeutigkeitsprüfung des Blueprint-Namens berücksichtigt nun auch zusätzliche Leerzeichen. Der Blueprint-Hauptfilter in der Produktübersicht benötigt keine Übersetzung mehr. Zudem wurde die Benachrichtigung nach dem Speichern eines Produkts mit dem richtigen Namen versehen. Im Bereich „Enthaltene Deckungen“ ist die Schaltfläche „Speichern“ nach dem Speichern nicht mehr aktiv. Wurden alle Preise eines Produkts gelöscht, zeigt das Symbol nicht mehr fälschlich zugewiesene Preise an. Preisversionen verschwinden nach der Veröffentlichung nicht mehr.

**Deckungscodes**

Ein neuer Deckungscode kann nun auch mit dem Namen eines zuvor gelöschten Deckungscodes angelegt werden. Beim Anlegen eines Deckungscodes lässt sich die Übersicht nicht mehr mit ungültigen Pflichtangaben in Kurz- und Langbeschreibung erreichen. Darüber hinaus wurde ein Thema zu Deckungscodes bei Rechnungen internationaler Werkstätten bearbeitet.

**Preismatrix und Cluster**

In der Preismatrix wurden mehrere Validierungen verbessert. Fehler bei den Maximalwerten in der Preismatrixdefinition wurden behoben, ebenso die ungültige Maximalprüfung für den Preisfaktor 2 in Clustern, auch nach dem Upload einer Preismatrix-Datei. Buchstaben und Sonderzeichen können in der Preismatrix nicht mehr eingegeben werden. Bei Kontingentprodukten wird die letzte Spalte der Preismatrixdefinition korrekt angezeigt. Wird die Preismatrix eines Produkts geändert, werden bestehende Preiscluster aktualisiert. Bei Clustern wurde die Anlage eines Preisclusters, die zuvor blockiert war, wieder ermöglicht. Die Fahrzeuggruppen-Karte wird auf der Seite zur Cluster-Erstellung angezeigt. Beim Duplizieren eines Clusters wechselt der Vorgang nicht mehr in die Cluster-Bearbeitung, wenn zuvor die Fahrzeuggruppen-Erstellung ausgelöst und anschließend zurücknavigiert wurde.

**Kampagnen**

Bei der Verwaltung und Erstellung von Kampagnen gab es mehrere Verbesserungen. Beim Erstellen einer Kampagne kann man nicht weitergehen, ohne alle Pflichtfelder auszufüllen. Doppelte Cluster werden vermieden. Im zweiten Schritt werden Produkte und Fahrzeuge auch ohne ausgewähltes Cluster korrekt behandelt. Die Ladebalken der drei Schritte unterscheiden sich nun. Der Betrag wird in Schritt 3 und nach dem Erstellen der Kampagne nicht mehr aufgerundet. Numerische Felder beginnen nicht mehr mit einer 0. Die Werte der Verkaufsebene beeinflussen die im zweiten Schritt angezeigten Produkte korrekt. Beim Bearbeiten einer Kampagne erscheint die richtige Erfolgsmeldung. Kampagnen mit dem Status „Beendet“ lassen sich duplizieren. Eine Kampagne, die in der Übersicht als deaktiviert erschien und nicht aktiviert werden konnte, lässt sich wieder aktivieren. Außerdem wurde das Nummerierungsformat in der Kampagnenverwaltung und -übersicht korrigiert.

**Rabatte, Preise und Rechnungen**

Die Rabattberechnung wurde korrigiert, wenn der Rabatt den Preis übersteigt, ebenso das Ergebnis bei einem Händlerrabatt von 100 %. Die Beträge im Preisinfo-Bereich stimmen nun mit dem Rechnungsbetrag überein.

**Vertragserzeugung und Vertragsaktivierung**

Ein Fehler bei der Vertragserzeugung nach Einführung der Produktauswahlfelder wurde behoben. Die Service-Vertrags-ID wird wie erwartet zurückgegeben. Die Aktivierung eines Vertrags führt nicht mehr zu einer NullPointerException, und die Meldung, ein signierter Vertrag sei bereits aktiv, wurde behoben. Die Karenzzeit (Grace Period) funktioniert wieder. I155-Dateien werden im BatchJob angezeigt.

**Stabilität**

Fehler und Warnungen in der Produktverwaltungsanwendung in der Vorproduktionsumgebung sowie eine Exception im NemesisWebClient auf der Entwicklungsumgebung wurden behoben.