# Batch 1263 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Änderungen und Verbesserungen**

**Deckungscodes (Coverage Codes)**
Ein Deckungscode muss künftig innerhalb einer Division eindeutig sein. Außerdem wurde die Frage geprüft, ob der Divisionsfilter auf der Seite „Coverage Codes" den Eintrag „smart" enthalten sollte. Dabei wurde angemerkt, dass „smart" eher eine Marke als eine Division sein dürfte.

**Produktanlage und Preisversionen**
In Schritt 3 der Produktanlage wurde die Option „Contract Change" aus der Auswahlliste „Allowed Modification" entfernt. In Schritt 6 ist das Kontrollkästchen nun vorausgewählt, und die Eingabefelder haben den Anfangswert 0. Die Schaltfläche „Weiter" ist aktiviert. Sind beide Kontrollkästchen abgewählt, erscheint beim Klick auf „Weiter" die Fehlermeldung „Select at least one payment periods".

Bei den Fahrzeugvoraussetzungen gilt für die Option „Allow vehicles with age less than" für die Anzahl der Tage ein Minimalwert von 1 und ein Maximalwert von 999. Dezimalstellen sind nicht zulässig.

Beim Anlegen eines neuen Kontingents in Schritt 4 (Price Matrix Definition) sind die Eingaben begrenzt: „Number of Services Included" und „Min Duration (months)" erlauben maximal zwei Ziffern (z. B. 99). „Max Duration (months)" erlaubt ebenfalls maximal zwei Ziffern (z. B. 96, da der Wert ein Vielfaches von 12 sein muss). Der Versionsname und der Clustername dürfen jeweils höchstens 30 Zeichen lang sein.

Bei der Definition der Kostenstruktur in einer Preisversion wurde das Dropdown „Tax Rate" aus der Konfiguration der optionalen Deckungen im Ablauf „Preisversion anlegen" entfernt.

**Genehmigungsschwelle**
Die Genehmigungsschwelle („Approval Threshold") für die Vertragsprüfung wird nun mit der Währung des Landes angezeigt, zu dem der Vertrag gehört, z. B. 1.000 EUR. Format, Trennzeichen und Konformität richten sich wie bei Währungsfeldern nach der Markt-Konfiguration (Market Config).

**Fahrzeugverwaltung und Schnittstellen**
Die Auftragsnummer eines Fahrgestells wird nun bei VeDoc angefragt und an die Vertragserzeugung (Contract Generation) übermittelt. Um Fehlermeldungen vom Typ 429 zu vermeiden, wird die Rate der Anfragen an VeDoc begrenzt. Erlaubt sind maximal 300 Anfragen pro Minute, und dieser Wert wird stets unterschritten.

Der MIC-Dienst darf erst verwendet werden, nachdem der Kunde den Vertrag unterzeichnet hat (Status CONFIRMED). Bis dahin ist der Abruf von Kilometerstandsdaten für ein bestimmtes Fahrzeug untersagt. Daher wurde „currentMileage" (MIC-Kilometerstand) aus der Antwort entfernt.

**Sprachliche Vereinfachungen der Oberfläche (Übersetzbarkeit ins Deutsche)**
In den Suchfiltern entfällt das Aktionswort „Search"; es bleibt nur das Suchkriterium. So wird aus „Search Products" in der Produktverwaltung „Product". In der Kundenverwaltung wird beim Privatkunden aus „Search Name" der Begriff „Name"; zu prüfen war, ob dies auch für Geschäftskunden gilt. Im Admin-Bereich wird bei den Motorbaureihen aus „Search Engine Series" der Begriff „Engine Series" und bei den Rechnungen aus „Search Processing Number" der Begriff „Processing Number".

In allen Bereichen „Search Address" (Contract Generation, Customer Management, Contract Management) wurde der einleitende Text über den Eingabefeldern gekürzt.

In Dialogfenstern (Modals) der gesamten oneSCM-Anwendung wird der Einleitungstext entfernt, wenn er keine zusätzlichen, für das jeweilige Fenster relevanten Informationen liefert. Betroffen sind der Dialog „Send Test Email" in der Page Template Management, der Dialog „Create File Type" im Cross File Transfer, der Dialog „Transfer – Different Payer" im Contract Management sowie der Dialog zur Auswahl eines Privatkunden in der Contract Generation (Customer). Beim Dialog „Create File Type" wurde zusätzlich die Hauptüberschrift von „Create" in „Create File Type" geändert.