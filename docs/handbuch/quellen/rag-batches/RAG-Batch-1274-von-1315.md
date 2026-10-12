# Batch 1274 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 77 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation (Contract Calculation) – Behobene Fehler und Verbesserungen**

In diesem Release wurden zahlreiche Fehler in der Vertragskalkulation behoben, die vor allem die Produktverwaltung, Preisversionen, Fahrzeuggruppen und Kampagnen betreffen.

**Produktverwaltung und Preisversionen**
Preise von Produkten mit stets enthaltenen optionalen Leistungen werden nun korrekt berechnet. Optionale Deckungen werden im Cluster der Preisversion richtig angezeigt. Abgelaufene Preisversionen lassen sich wieder bearbeiten und duplizieren. Wird die Bearbeitung der Branchenkostenabhängigkeit in einer Preisversion abgebrochen, behält diese ihren ursprünglichen Wert. Ungültige Kombinationen aus Kostendefinition und Abhängigkeit für die gewählte Branche werden berücksichtigt, und Änderungen an einer Branche im Produkt werden in der Preisversion übernommen. Im Schritt „Zahlung und Provision“ erscheint nun der korrekte Hinweistext. Außerdem werden die Create-/Edit-Preisversion-Schnittstellen nicht mehr ausgelöst, solange das Zahlungsformular ungültig ist. Beim Abruf von Produkten tritt kein interner Serverfehler mehr auf. In der Produktzusammenfassung wird der Kundentyp angezeigt. Ein MBLD-Vertrag kann trotz PC-/Van-Rolle angelegt werden. In der Leasing-Produktsuche werden Preise nicht mehr gerundet.

Bei Limits wurde die Fehlermeldung zum Limitnamen aussagekräftiger gestaltet. Beim Bearbeiten bestehender Fahrzeuglimits werden die Werte wieder angezeigt. Wird das Dialogfenster zur Limit-Erstellung nach einem Fehler abgebrochen, funktioniert das Limit-Dropdown weiterhin. Im Auswahldialog für Bilder wird das Vorschaubild angezeigt, und die Kurzbeschreibung des Deckungscodes erscheint beim Überfahren des Vorschaubilds. Beim Konfigurieren von Deckungen bleibt das Dropdown für Kostenstelle/Sales Level beim Wechsel der Deckung nicht mehr geöffnet.

**Blueprints**
Beim Ändern der Vertriebsabhängigkeit in Schritt 1 wird der Schritt nicht mehr zurückgesetzt, und ein Fortfahren ist nicht mehr möglich. Nach einem Wechsel der Division werden die Deckungen zurückgesetzt. Die Zusammenfassung kann nicht mehr erreicht werden, ohne Deckungen auszuwählen.

**Vega-Codes und Fahrzeugverwaltung**
Branchenmärkte werden im Dropdown-Filter der Vega-Codes übersetzt. Das Aktualisieren und Deaktivieren von Deckungscodes funktioniert wieder, und Vega-Codes werden nicht mehr automatisch gelöscht. Beim Anlegen einer Gruppe für technische Optionen tritt kein Fehler „Authentication forbidden“ mehr auf. Die Logik „Alle müssen übereinstimmen“ liefert Daten in der Modellcode-Tabelle. Bei Anwendung der SA-Code-Filter werden keine Suchfilter mehr fälschlich angewendet.

**Fahrzeuggruppen**
Van-Fahrzeuggruppen können angelegt werden, und beim Anlegen tritt kein Fehler „Authentication forbidden“ mehr auf. Die Filterung nach Produkt wählt nicht mehr stets die erste verfügbare Preisversion aus. Ergebnisse der Übersicht bleiben nach der Rückkehr aus dem Anlageprozess nicht mehr bestehen. Passende technische Optionen erscheinen in der Übersichtstabelle. Der Bereich „Weitere Filter“ entspricht der Darstellung im Rest der Anwendung. Modellcodes verschwinden beim Anwenden von SA-Code-Filtern nicht mehr dauerhaft.

**Kampagnen**
Beim Bearbeiten einer Kampagne werden in Schritt 2 wieder Daten angezeigt, ebenso nach dem Zurück- und Weiterwechsel mit gewählter Preisversion bzw. gewähltem Cluster. Zukünftige Preisversionen und Cluster erscheinen in Schritt 2. Der Kundentyp wird in Zusammenfassung und Ansicht korrekt dargestellt. Die Eingabe eines Gesamtrabatts mit der Eingabetaste löst keinen Fehler mehr aus, und der rabattierte Preis kann den Preis im Preiscluster nicht mehr überschreiten.

**Vertragsverwaltung und Vertragserstellung**
Bei der Langzeitverlängerung wird der Monatspreis korrekt angezeigt, und es tritt kein Fehler „Authentication forbidden“ mehr auf. Im Reiter „Kunde“ werden Daten angezeigt, und der Reiter „Fahrzeug“ lädt ohne Berechtigungsfehler. Reifenprodukte und neue Produkte erscheinen im Vertragsvorschlag. Die Suche nach siebenstelligen Modellcodes funktioniert. Beim Aktualisieren von BTS- oder BTO-Verträgen tritt kein interner Serverfehler mehr auf. Außerdem wurde der fehlerhafte Batch-Job CeproImport repariert.