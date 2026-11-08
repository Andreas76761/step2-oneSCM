# Batch 57 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von Final-Contract-Review-Dokumenten (MDCR) im Bereich Revenue Management**

Im Revenue-Modul steht ein einheitlicher Dokumenttyp zum finanziellen Abschluss eines Vertrags zur Verfügung, der sowohl bei Vertragsende als auch bei vorzeitiger Beendigung genutzt wird, und zwar für Leasing- und Nicht-Leasing-Verträge. Ein solches Dokument bildet eine Schlussabrechnung ab, entweder als Rechnung oder als Gutschrift. Es gleicht die Differenz zwischen tatsächlich Verbrauchtem bzw. Geschuldetem und dem vertraglich Vereinbarten aus, beispielsweise bei Mehrkilometern eines Servicevertrags, beim Restsaldo nach vorzeitiger Fahrzeugrückgabe eines Leasingvertrags oder bei einer Vertragsstrafe wegen vorzeitiger Beendigung. Die Berechnung erfolgt außerhalb von oneSCM, da jeder Vertragstyp und Markt eigene Regeln hat. Das System erfasst und exportiert den bereits berechneten Betrag, berechnet ihn aber nicht selbst. Automatisch erzeugte Dokumente auf Basis des Endabrechnungsprofils bleiben weiterhin unterstützt und werden durch die manuelle Erstellung nicht verändert. Automatisch und manuell erstellte Dokumente verwenden denselben Kunden-Dokumenttyp „MDCR“.

**Erstellung und Berechtigungen**

Die manuelle Erstellung erfolgt durch berechtigte MO/MPC-Benutzer im Bereich „Finanzdokumente“ des jeweiligen Vertrags, nachdem der Abrechnungsbetrag extern ermittelt wurde. Es gibt keine neue Rolle und keine neue Berechtigung; es gelten die bestehenden Rechte zur manuellen Dokumenterstellung. Benutzer ohne diese Rechte können kein MDCR-Dokument anlegen. Das Dokument kann als Rechnung oder als Gutschrift erstellt werden, ohne zusätzliche Einschränkung für Gutschriften. Das fertig angelegte Dokument ist auf der Seite „Finanzdokumente“ sichtbar. Wird der Erstellungsvorgang vor dem Speichern abgebrochen, entstehen weder ein Dokument noch ein Exportdatensatz oder eine Übertragung an MBLD.

**Felder des Erstellungsformulars**

Der Dokumenttyp (Rechnung oder Gutschrift) wird per Auswahlliste gewählt und ist ein Pflichtfeld. Der Dokumentempfänger ist ebenfalls ein Pflichtfeld und eine Auswahlliste, die sich wie beim bestehenden manuellen Dokument (MANU) verhält; gewählt wird der Eigentümer bzw. Zahler des Vertrags. Die SAP-Debitorennummer wird automatisch mit der Nummer des gewählten Empfängers befüllt und ist nicht editierbar. Die Dokumentreferenz ist optional und verhält sich wie bei MANU. Auswählbar sind nur Finanzdokumente des Vertrags mit mindestens dem Status „FI Doc Created“ (also auch bezahlte oder gemahnte Dokumente), wobei die Rechnungsnummer des FI-Systems angezeigt wird. Der Kunden-Dokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und nicht änderbar.

Das Belegdatum wird über einen Kalender gewählt und muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen, jeweils einschließlich. Nach der Erstellung ist es nicht mehr editierbar. Nettobetrag, Steuerbetrag und Gesamtbetrag werden als nicht editierbare Felder angezeigt.

Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt. Das Dokument kann mit beiden leeren Feldern gespeichert werden. Werden Daten eingegeben, müssen sie zwischen Vertragsbeginn und heutigem Datum liegen, und „Dokument von“ darf nicht nach „Dokument bis“ liegen.

**Position, Beträge und Positionstext**

Ein MDCR-Dokument enthält genau eine FI-Dokumentposition; eine zweite Position kann nicht hinzugefügt werden. Die Steuerklassifizierung wird per Auswahlliste gewählt und mit der Steuerklassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt. Der Nettobetrag ist ein numerisches Pflichtfeld, in dem der extern berechnete Betrag manuell eingetragen wird. Der Steuerbetrag ist deaktiviert und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag.

Der Positionstext ist ein Pflichtfeld mit Freitext und maximal 255 Zeichen, wie bei MANU. Er beschreibt die Berechnung, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“.

**Validierung**

Fehlt ein Pflichtfeld oder ist ein Wert ungültig, wird das Dokument nicht erstellt. Der Benutzer erhält eine Meldung, die das betroffene Feld benennt, und es wird weder ein Export noch eine Übertragung an MBLD ausgelöst. Dies gilt etwa für fehlenden Empfänger oder Nettobetrag, fehlenden oder zu langen Positionstext sowie Datumsangaben vor Vertragsbeginn oder in der Zukunft.

**Lebenszyklus und Export**

MDCR-Dokumente durchlaufen den üblichen Lebenszyklus: Created → Accepted → Exported → FI Doc Created → Paid/Dunning Level. Es gelten die bestehenden Regeln für Statusübergänge, und die Validierungen des Standardablaufs können nicht umgangen werden. Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei stehen der Kunden-Dokumenttyp „MDCR“, der gewählte Dokumentempfänger mit SAP-Debitorennummer sowie Netto-, Steuer- und Gesamtbetrag und die Steuerklassifizierung gemäß der Standardstruktur. Der Positionstext wird im Positionsdatensatz übertragen, der Kopftext bleibt leer. Es werden dort weder Berechnungstext noch Genesis-Nummer oder andere Werte eingetragen.

**Übermittlung an MBLD**

Für Leasingverträge, insbesondere MBLD-Verträge, wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand von Vertriebskanal = Leasing und Dokumenttyp = MDCR. Das Ergebnis der Übertragung wird gemäß den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport E169/CoFiCo/SWT verarbeitet.

**Hinweis zum aktuellen Stand**

Die API zur Auswahl und Übertragung an MBLD existiert laut den Rohdaten noch nicht; die Zuständigkeit des Edge-Service-Teams ist noch nicht formal geklärt, und eine abgestimmte Auswahllogik liegt bislang nicht vor.