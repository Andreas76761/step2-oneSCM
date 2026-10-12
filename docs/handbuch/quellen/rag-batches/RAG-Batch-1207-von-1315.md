# Batch 1207 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Technische Optionsgruppen**

Administratoren der Zentrale (HQ) können Ausstattungscodes zu technischen Optionsgruppen (TO-Gruppen) zusammenfassen. Die Märkte können diese Gruppen bepreisen, und Händler können sie im Verkaufsprozess für Serviceverträge verwenden. Die Gruppen werden zentral definiert. Alle Märkte sehen daher dieselben TO-Gruppen, wenn sie im Reiter „Technische Optionen" Preiscluster anlegen.

Über die Schaltfläche „Create TO Group" öffnen Sie den Erstellungsprozess. Dort wählen Sie zunächst eine Division aus der Auswahlliste. Der Gruppenname ist ein Pflichtfeld und muss zwischen 3 und 30 Zeichen lang sein, wobei alle Zeichen erlaubt sind. Sobald die Höchstlänge erreicht ist, lassen sich keine weiteren Zeichen eingeben. Die Gruppenbeschreibung muss mindestens 20 und darf höchstens 2000 Zeichen umfassen. Sonderzeichen sind erlaubt, und auch hier ist bei Erreichen der Höchstlänge keine weitere Eingabe möglich.

Anschließend fügen Sie Ausstattungscodes hinzu. Das erste Eingabefeld wird standardmäßig angezeigt und ist ein Pflichtfeld. Jeder Code besteht aus genau drei alphanumerischen Zeichen und wird automatisch in Großbuchstaben umgewandelt. Auch hier lassen sich über die Länge von drei Zeichen hinaus keine weiteren Zeichen eingeben. Über die Schaltfläche „New Equipment Code" erscheint ein weiteres, leeres Eingabefeld. Hinzugefügte Felder können Sie mit der Papierkorb-Schaltfläche wieder entfernen. Insgesamt sind maximal 15 Ausstattungscodes möglich.

Mit „Create" speichern Sie die Angaben und kehren zur Übersichtsseite zurück. Dort steht bei der Standardsortierung die zuletzt angelegte Gruppe an erster Stelle. Mit „Cancel" kehren Sie zur Übersicht zurück, ohne etwas zu speichern.

**Branchen einem Produkt zuordnen**

Wenn MPC-Benutzer auf der Produktübersicht die Schaltfläche „Create New Product" wählen, können sie im dritten Schritt die „Applicable Industries" für das Produkt auswählen. Dadurch lassen sich später Preisaufschläge für diese Branchen definieren. Die Auswahlliste bietet folgende Werte: „Select all Industries" wählt alle Branchen der Liste aus, wobei die einzelnen Auswahlfelder dann deaktiviert sind. „Not Relevant" bewirkt, dass der Händler im Verkaufs-Frontend Preise ohne branchenbezogene Aufschläge erhält. Außerdem stehen die Branchennamen zur Auswahl, die für den jeweiligen Mandanten gelten. Division und Blueprint werden im selben Schritt festgelegt.

„Cancel" ist immer aktiv und schließt den Assistenten zur Produktanlage. „Next" wird erst aktiv, wenn für alle Felder eine Auswahl getroffen wurde, und führt zur nächsten Seite. Die Gestaltung folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Branchenpreise (Industry Pricing)**

Bisher konnten Preise für Basis- und optionale Deckungen definiert werden. Nun können MPC-Benutzer zusätzlich Aufschläge für die einem Produkt zugeordneten Branchen festlegen, sodass diese nach der Geschäftslogik bepreist und für jeden Vertrag ausgewählt werden können. Dafür gibt es im Prozess zur Cluster-Definition den neuen Reiter „Industry Surcharges". Er besteht aus zwei Schritten. Sind einem Produkt keine Branchen zugeordnet, wird dieser Ablauf ausgeblendet.

Im ersten Schritt legen Sie Version und Startdatum fest. Der Versionsname ist ein Pflichtfeld mit 3 bis 100 Zeichen, Sonderzeichen sind zulässig. Wird die Länge unterschritten oder überschritten, erscheint die Meldung „Min. 3 and max. 100 characters allowed. Please correct your input and try again". Das Startdatum muss in der Zukunft liegen. Vorgeschlagen wird standardmäßig ein Datum eine Woche nach dem heutigen Tag. Es lässt sich bis auf einen Tag nach dem heutigen Datum zurücksetzen. Existieren bereits Versionen mit zukünftigem Startdatum, liegt das vorgeschlagene Startdatum einen Tag nach dem Startdatum der letzten Version. „Cancel" schließt den Assistenten, „Next" führt zur nächsten Seite. „Next" ist immer aktiv. Sind Pflichtfelder oder Bereiche nicht ausgefüllt, werden sie beim Klick rot markiert und geöffnet. Die Preisversion kann erstellt werden, sobald alle Pflichtfelder und Bereiche ausgefüllt sind.

Im zweiten Schritt definieren Sie die Aufschlagsmatrix. Beim Anlegen einer Preisversion können Sie für jede Branche Aufschläge festlegen. Das ist nicht verpflichtend. Ist mindestens eine Branche nicht vollständig definiert, zeigt die Preisversion in der Liste ein Warnsymbol. Öffnen Sie eine solche Version, gelangen Sie direkt zu Schritt 2 und zur ersten nicht vollständig definierten Branche. Diese Angaben bestimmen die Preismatrix und wie die Werte zur Berechnung des Aufschlags einer Branche herangezogen werden.

Die Branchen erscheinen alphabetisch sortiert. Die Aufschlagsstruktur öffnen Sie über das Akkordeon der jeweiligen Branche. Es kann immer nur ein Eintrag geöffnet sein. Beim Öffnen eines anderen werden die Eingaben gespeichert. Die Auswahl einer Branche ist verpflichtend. Bei der Aufschlagsdefinition können Sie aber „No Surcharge" wählen. Dann sind alle übrigen Felder deaktiviert, die Branche gilt als vollständig definiert und ist kostenfrei.

Für jede Branche definieren Sie die Aufschlagsart. Der Wert in jeder Zelle gibt an, wie sich der Aufschlag für den Kunden zusammensetzt, wenn er diese Branche wählt. Bei „Percentage" wird ein Prozentsatz auf den Listenpreis aufgeschlagen, berechnet aus der vom Kunden gewählten Laufzeit und Laufleistung bzw. dem gewählten Kontingent. Bei „Amount" wird ein Gesamtbetrag für die jeweilige Branche zur Liste addiert, und zwar für die gewählte Laufzeit und Laufleistung bzw. das gewählte Kontingent.

Über die Abhängigkeitsdefinition legen Sie in einer Auswahlliste fest, ob für jede Laufzeit, für Laufleistung, für Laufzeit und Laufleistung, für das Kontingent oder unabhängig von den Vertragsoptionen unterschiedliche Preise definiert werden können. Der Preisfaktor hat keinen Einfluss auf die Branchenaufschläge.