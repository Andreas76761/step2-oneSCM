# Batch 899 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Produktvergleich in der Vertragserstellung**

Während der Vertragserstellung können Sie Produkte oder Produktkonfigurationen miteinander vergleichen, um dem Kunden Unterschiede bei Preis, Konfiguration und Leistungsumfang aufzuzeigen und ihn bei der Auswahl des passendsten Produkts zu unterstützen. Die frühere Vergleichsfunktion war im Zuge der Neugestaltung des Produktkonfigurationsmoduls deaktiviert worden. Sie steht nun in der neuen Konfigurationsarchitektur wieder zur Verfügung und wurde überarbeitet. Sie ist für jeden Vertriebsmitarbeiter verfügbar, wobei die abrufbaren Produkte und Konfigurationen von der jeweiligen Rolle abhängen. Möglich ist der Vergleich verschiedener Produkte oder verschiedener Konfigurationen desselben Produkts. Preise und Konfigurationsoptionen werden dabei abhängig von Ihren Auswahlen dynamisch aktualisiert.

**Voraussetzungen und unterstützte Kategorien**

Für den Vergleich verschiedener Produkte müssen mindestens zwei Produkte verfügbar sein, für den Vergleich verschiedener Konfigurationen desselben Produkts mindestens eines. Verglichen werden können nur Produkte mit demselben Produkt-Blueprint und derselben Ablauflogik. Unterstützt werden Servicever­träge ohne Kontingent (Ablauf nach Zeit bzw. Laufleistung), Serviceverträge mit Kontingent (Ablauf nach Nutzung bzw. Anzahl der Services) sowie Reifenverträge mit begrenzten oder unbegrenzten Reifenprodukten.

**Ablauf der Auswahl**

Sie starten die Vertragserstellung, indem Sie den Kundentyp wählen und die Fahrzeugkennung eingeben. Das System ruft die verfügbaren Produkte ab und zeigt oberhalb der Produktkarten die Schaltfläche zum Vergleichen an. Ist nur ein Produkt verfügbar, wird ausschließlich der Vergleich unterschiedlicher Konfigurationen desselben Produkts angeboten. Sind mehrere Produkte verfügbar, stehen sowohl „Compare Different Products“ als auch „Compare Different Configurations“ zur Auswahl.

Nach Ihrer Wahl blendet das System Auswahlpunkte auf den Produktkarten und Vergleichsplätze ein. Beim Vergleich unterschiedlicher Produkte gibt es bis zu drei Plätze, beim Vergleich unterschiedlicher Konfigurationen einen Platz. Jedes ausgewählte Produkt belegt den nächsten freien Platz. Ein viertes Produkt lässt sich nicht auswählen. Wählbare Elemente können wieder abgewählt werden.

Sobald ein Produkt ausgewählt ist, werden Produkte mit abweichendem Blueprint oder abweichender Ablauflogik deaktiviert und mit blauem Farbton dargestellt. Zusätzlich erscheint ein blauer Hinweis mit dem Text „You can compare only products with the same configuration“. Mit dem „X“ brechen Sie den Vergleich ab und kehren zur Produktauswahl zurück. Mit dem Häkchen öffnen Sie die Vergleichsansicht, sobald die erforderliche Anzahl an Produkten ausgewählt ist.

**Aufbau der Vergleichsansicht**

Die Vergleichsansicht gliedert sich in Kopfbereich, Produktkonfiguration, technische Optionen, enthaltene Leistungen, optionale Leistungen, Kampagnen und Rabatte. Bei Reifenverträgen kommt der Bereich „Allgemeine Informationen“ hinzu.

Der Kopfbereich bleibt beim Scrollen fixiert. Jede Produktspalte zeigt Produktname, Produktpreis und eine Info-Schaltfläche. Bei Privatkunden wird der Bruttopreis (inkl. MwSt.) angezeigt, beim Darüberfahren erscheinen Nettopreis und MwSt.-Betrag. Bei Geschäftskunden wird der Nettopreis (exkl. MwSt.) angezeigt, beim Darüberfahren erscheinen Bruttopreis und MwSt.-Betrag. Die Tooltips zeigen außerdem Produktbild und Produktbeschreibung. Der Preis aktualisiert sich bei jeder Konfigurationsänderung.

**Produkte mit Ablauf nach Zeit und/oder Laufleistung**

In der Produktkonfiguration stehen Auswahllisten für Zahlungsart, Zahlungsintervall, Vertragslaufzeit und jährliche Laufleistung zur Verfügung. Jede Liste zeigt die für das jeweilige Produkt wählbaren Werte. Handelt es sich beim Kunden um einen Geschäftskunden (Commercial, Commercial Fleet oder Commercial Governmental), erscheint zusätzlich die Auswahlliste „Branche“.

Bei den technischen Optionen hängt das Verhalten von der Fahrzeugkennung ab. Ist die Kennung ein Baumuster (BM6), werden die Namen der Optionen mit ihren Preisen je Spalte aufgelistet. Mehrfachauswahl ist möglich, soweit mehrere Optionen vorhanden sind, und die Auswahl verändert den Produktpreis. Bei jeder anderen Kennung wird lediglich mit einem Häkchen bzw. einem X angezeigt, ob eine Option verfügbar ist, eine Auswahl ist nicht möglich.

Bei den enthaltenen Leistungen werden die Leistungen aller verglichenen Produkte aufgelistet. Ein Häkchen kennzeichnet eine enthaltene, ein X eine nicht enthaltene Leistung. Über die „i“-Schaltfläche wird beim Darüberfahren die Beschreibung angezeigt, sofern vorhanden.

Die optionalen Leistungen werden ebenfalls für alle verglichenen Produkte aufgelistet, mit „i“-Schaltfläche und Beschreibung, sofern vorhanden. In der Produktspalte erscheint der zugehörige Preis. Mehrfachauswahl ist möglich, soweit mehrere optionale Leistungen verfügbar sind. Nach Auswahl oder Abwahl werden die Preise aktualisiert.

Bei den Kampagnen werden alle für die verglichenen Produkte verfügbaren Kampagnen aufgelistet, ebenfalls mit „i“-Schaltfläche. Automatisch angewendete Kampagnen werden berücksichtigt, Kulanzzeit-Kampagnen (Grace Period) ausgeschlossen. Es kann jeweils eine Kampagne ausgewählt werden. Angezeigt wird je nach Konfiguration ein Wert oder ein Prozentsatz. Mit dem Anwenden einer Kampagne wird der Preis aktualisiert. Eine angewendete Kampagne lässt sich wieder entfernen, woraufhin der Preis erneut angepasst wird.

Im Bereich Rabatte geben Sie einen Rabatt in einem Eingabefeld ein, das nur numerische Werte akzeptiert. Der Rabatt wird auf den Produktpreis angewendet. Eine Fehlerbehandlung greift, wenn der eingegebene Wert zusammen mit der Kampagne den Netto-Produktpreis übersteigt.

**Produkte mit Ablauf nach Nutzung bzw. Anzahl der Services**

Hier gilt dieselbe Struktur wie zuvor beschrieben. Der einzige Unterschied: In der Produktkonfiguration ersetzt die Auswahlliste „Anzahl der Services“ die jährliche Laufleistung. Sie zeigt die für das Produkt wählbaren Werte. Alle übrigen Felder und Funktionen sind identisch.

**Reifenverträge**

Die Produktkonfiguration entspricht der bei Produkten mit Ablauf nach Zeit und/oder Laufleistung. Im Bereich „Allgemeine Informationen“ stehen Auswahllisten für Wetterprofil, Felge, Radgröße, Reifenlieferant, Anzahl der Reifen, Reifentyp und Reifengröße bereit, jeweils mit den für das Produkt wählbaren Werten. Technische Optionen, enthaltene und optionale Leistungen, Kampagnen und Rabatte funktionieren wie bei Produkten mit Ablauf nach Zeit und/oder Laufleistung, und zwar sowohl bei Baumuster-Kennung als auch bei anderen Kennungen. Die Abgrenzung zwischen begrenzten bzw. unbegrenzten Reifenprodukten und komplexen Produkten wird in einem kommenden Planungsintervall behandelt.

**Synchronisierung der Werte**

Für alle Produkttypen gilt: Wählen Sie in einer Spalte einen Konfigurationswert, versucht das System, denselben Wert in den anderen Spalten zu setzen und die Preise zu aktualisieren. Ist der Wert in einer anderen Spalte nicht verfügbar oder existiert das Attribut dort nicht, wird „n/a“ angezeigt, und Sie müssen manuell eine andere Option aus der Auswahlliste wählen. Möchten Sie einen Wert ändern, können Sie in der Auswahlliste eine andere Option wählen, ohne dass sie auf die übrigen Spalten übertragen wird. Die Konfigurationen der Produkte dürfen sich somit unterscheiden.

**Fußbereich der Vergleichsansicht**

Der Fußbereich bietet Aktionen, um zur Produktliste zurückzukehren, ein druckbares Angebot zu erzeugen, den Vergleich per E-Mail zu versenden oder mit der Vertragserstellung fortzufahren.

Mit „<“ (Zurück) verlassen Sie den Vergleichsmodus und gelangen zur Produktauswahl zurück. Die zuvor abgerufenen Produkte bleiben dabei erhalten.

Mit „Print“ öffnet sich ein Dialog, in dem Sie die Sprache des Angebotsdokuments aus einer Auswahlliste der unterstützten Sprachen wählen. Der Dialog bietet die Aktionen „Print“ und „Cancel“. Nach Auswahl der Sprache und Klick auf „Print“ erzeugt das System auf Basis der Vergleichsdaten ein druckbares Angebot mit der zur Sprache passenden Dokumentvorlage. Alle Platzhalter und Beschriftungen werden in die gewählte Sprache übersetzt. Das Dokument wird angezeigt oder heruntergeladen. „Cancel“ schließt den Dialog und führt zurück zur Vergleichsansicht.

Mit „Email“ öffnet sich ein Dialog mit den Pflichtfeldern Vorname und Nachname (alphanumerisch), E-Mail-Adresse (gültiges E-Mail-Format) und Sprache (Auswahlliste der unterstützten Sprachen). Sind nicht alle Felder korrekt ausgefüllt, zeigt das System Validierungsfehler an, und die E-Mail wird nicht gesendet. Mit „Send“ erzeugt das System das Angebotsdokument in der gewählten Sprache mit der passenden Vorlage und versendet es als Anhang an die angegebene Adresse. Anschließend schließt sich der Dialog. „Cancel“ schließt den Dialog und führt zurück zur Vergleichsansicht.

**Mit einem verglichenen Produkt fortfahren**

Möchten Sie mit einem der verglichenen Produkte fortfahren, wählen Sie die entsprechende Produktspalte (je nach Anzahl der verglichenen Produkte Spalte 2, 3 oder 4). Das System übernimmt die gesamte Konfiguration des gewählten Produkts und überträgt alle gewählten Werte in den Produktkonfigurations-Assistenten, wo sämtliche Felder vorausgefüllt sind. Der Zahlungsplan wird automatisch erzeugt, und Sie werden zum Bereich „Zahlungsplan“ des Angebotserstellungsprozesses weitergeleitet.