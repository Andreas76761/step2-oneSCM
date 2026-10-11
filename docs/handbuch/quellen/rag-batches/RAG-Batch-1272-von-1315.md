# Batch 1272 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 79 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Behobene Fehler und Verbesserungen**

In der Domäne Contract Calculation wurden zahlreiche Fehler behoben und Verbesserungen umgesetzt, die die Vertragsgenerierung, die Produktverwaltung, die Preisversionen und die Kampagnen betreffen.

**Vertragsgenerierung und Berechnung**

Bei der Vertragsgenerierung werden nun Basisdeckungen zurückgegeben, und Kampagnen, darunter Sticker-Price-Kampagnen, werden korrekt angezeigt. Die Preise auf den Produktkarten werden nach einer geänderten Konfiguration aktualisiert. Die Erstellung eines Reifenvertrags bleibt nicht mehr in Schritt 1 hängen. Bei der Massenerstellung werden Fahrzeuge, die noch verarbeitet werden, nicht mehr gelöscht. Für Kunden des Typs „Private Governmental“ wird das Branchen-Dropdown nicht mehr angezeigt. Außerdem wurde ein Tooltip ergänzt, der den vollständigen Kampagnennamen zeigt. Eine fehlerhafte FIN/VIN-Eingabe in der Vertragsgenerierung führt auf der Pre-Prod-Umgebung nicht mehr zu einem 500-Fehler.

Korrigiert wurden zudem die Berechnungen: Die Berechnung von Servicerträgen mit der Option „Complex Tire“ ist nun korrekt, und bei Complex-Tire-Produkten wird die Berechnung der stets enthaltenen optionalen Deckungen berücksichtigt. Die Preise subventionierter Verträge werden auf der Übersichts- und der Bestätigungsseite richtig dargestellt. Die Rabattierung der Händlerprovision funktioniert wieder wie vorgesehen. Im Fehlerfall bei der Post-Activation wird ein Tooltip mit einer Fehlermeldung angezeigt.

**Prolongation**

Bei der Prolongation enthält die API-Antwort für Reifenverträge nun die Preismatrix. Optionale Deckungen für deaktivierte Produkte werden standardmäßig hinzugefügt. Der Inflationsfaktor sowie der Preis eines Vertrags mit optionalen Deckungen werden korrekt berechnet.

**Produktverwaltung**

In der Produktverwaltung lassen sich Produkte wieder anlegen. Beim Anlegen eines VAN-Produkts sind die erlaubten Vertragsänderungen verfügbar und erscheinen auch in der Produktzusammenfassung. Stets enthaltene Deckungen werden in Schritt 4 angezeigt. Produkte werden nun auch über die Baumuster-Kennung gefunden. Bei der Produktsuche über mehrere Felder werden feldspezifische Fehlermeldungen ausgelöst. Der Lieferantenname wird beim Bearbeiten korrekt aktualisiert. Im Produkttest wird die Ist-Laufleistung auf 0 gesetzt, wenn der Schalter „FRD unavailable“ aktiviert ist. Ein Navigationsfehler wird nun auch angezeigt, wenn man einen Schritt zurückgeht. Der Schritt „Payment & Commission“ in PV bricht nach dem Ändern der maximalen Laufzeit nicht mehr ab.

Beim Relative Base Cluster wurden mehrere Punkte behoben: Der Preisfaktor ist bearbeitbar, der Standardfaktor 1 wird bei aktiviertem Schalter angewendet, Feldfehler werden beim Ein- und Ausschalten korrekt dargestellt, und ein Cluster kann nicht mehr mit leeren Relative-Base-Cluster-Feldern gespeichert werden. In der Sonderfall-Prüfung wird der MPC-Rabatt nicht mehr nur für ein einzelnes Fahrzeug angewendet, und die Steuerbeschreibung zum Listenpreis im Prüfdialog ist korrekt.

**Preise und Preisversionen**

Der Preisversions-Stepper wurde in mehreren Punkten korrigiert. Nach dem Anlegen eines Clusters mit optionaler Fahrzeuggruppe erscheint kein leerer Bildschirm mehr. Die Inflationsrate einer aktiven Preisversion kann nicht mehr bearbeitet werden, und die Inflationstabelle ist nicht mehr nur von der linken Seite aus scrollbar. Die Bearbeitung eines Clusters ist nicht mehr möglich, solange sich eine Preisversion in der Prüfung befindet. Die Schaltfläche „Erstellen“ ist für unbegrenzte Reifencluster aktiv, und die Löschhinweise für Preisversionen und Cluster zeigen die richtige Meldung.

**Kampagnen**

Bei Kampagnen funktionieren die Sortierung nach Produkt sowie die Filter nach Status „Approved“ und „Created“ jetzt wie vorgesehen. Der maximal zulässige Sticker-Price-Wert wurde korrigiert. Die Kampagnenerstellung gelingt auch mit der maximalen Namenslänge, und die Schaltfläche „Weiter“ bleibt beim Hochladen eines Dokuments mit Maximalwert aktiv. Überlaufender Text in der Kampagnenzusammenfassung sowie in Kampagnen und Produkten wurde behoben.

**Fahrzeugverwaltung, Fahrzeuggruppen und weitere Bereiche**

Die Schaltfläche „Suchen“ in der Fahrzeugverwaltung bleibt nicht mehr deaktiviert, wenn alle Pflichtfelder ausgefüllt sind. Bei Fahrzeuggruppen liefert die Sortierung keine Fehler mehr, und bei der Namensvalidierung wird nur noch eine Fehlermeldung angezeigt. Bei den Vega-Codes wurde die Fehlausrichtung beim Anlegen von Deckungs- und Branchencodes behoben. Im Batch-Bereich wurde der doppelt vorhandene Job „syncFullProductsJob“ bereinigt.