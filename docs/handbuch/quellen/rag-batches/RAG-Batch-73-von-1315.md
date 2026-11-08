# Batch 73 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Abschlussabrechnung (MDCR) im Bereich Revenue Management**

Im Modul Revenue steht ein Dokumenttyp zur Verfügung, mit dem die finanzielle Position eines Vertrags zum Vertragsende oder bei vorzeitiger Beendigung abgeschlossen wird. Er gilt für Leasing- und Nicht-Leasing-Verträge. Das Dokument bildet eine Schlussabrechnung ab, entweder als Rechnung oder als Gutschrift. Es gleicht die Differenz zwischen tatsächlich verbrauchten bzw. geschuldeten und vertraglich vereinbarten Leistungen aus, zum Beispiel bei einer Kilometerüberschreitung in einem Servicevertrag, einem Restsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder einer Vertragsstrafe bei vorzeitiger Beendigung. Die Berechnung erfolgt außerhalb von oneSCM, da jeder Vertragstyp und jeder Markt eigene Regeln hat. Das System erfasst und exportiert lediglich den bereits berechneten Betrag.

Während FDCR-Dokumente in oneSCM auf Basis des Endsaldo-Profils des jeweiligen Produkttyps automatisch erzeugt werden, kann in Märkten ohne Endsaldo-Mechanismus nun ein manuelles Dokument (MDCR, Manual Final Document Contract Review) angelegt werden. Das bisherige manuelle Dokument (MANU) eignet sich dafür nicht, auch wenn es ähnlich ist. Die automatische Erzeugung bleibt unverändert, und beide Varianten verwenden den Kundendokumenttyp „MDCR“.

**Anlage und Berechtigungen**

Ein berechtigter MO/MPC-Benutzer legt das Dokument im Bereich „Finanzdokumente“ des Vertrags an, nachdem er den Abrechnungsbetrag extern berechnet hat. Es gibt keine neue Rolle oder Berechtigung. Es gelten die vorhandenen Rechte für die manuelle Dokumentanlage. Benutzer ohne diese Rechte können kein MDCR-Dokument erstellen. Bricht der Benutzer den Vorgang vor dem Speichern ab, wird kein Dokument angelegt, und es entstehen weder ein Exportdatensatz noch eine Übertragung an MBLD.

**Felder des Erfassungsformulars**

Als Dokumenttyp wählt der Benutzer „Rechnung“ (Belastung des Kunden) oder „Gutschrift“ (Erstattung an den Kunden). Für Gutschriften gibt es keine zusätzliche Einschränkung. Der Kundendokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und nicht änderbar.

Der Dokumentempfänger ist ein Pflichtfeld. Er wird über ein Dropdown ausgewählt, das sich wie im MANU-Ablauf verhält, und bezeichnet den Eigentümer bzw. Zahler des Vertrags. Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen, ist deaktiviert und kann nicht manuell geändert werden.

Die Dokumentreferenz ist optional und verhält sich ebenfalls wie bei MANU. Auswählbar sind nur Finanzdokumente des Vertrags im Status „FI Doc Created“ oder einem späteren Status (zum Beispiel bezahlt oder Mahnstufen). Angezeigt wird die Rechnungsnummer des FI-Systems.

Das Belegdatum muss zwischen dem Vertragsbeginn und dem heutigen Datum liegen (jeweils einschließlich). Datumsangaben vor Vertragsbeginn oder in der Zukunft werden nicht gespeichert. Nach der Anlage wird das Belegdatum nicht mehr editierbar angezeigt.

Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt. Das Dokument kann auch mit beiden leeren Feldern gespeichert werden. Werden Datumswerte angegeben, müssen sie zwischen Vertragsbeginn und heutigem Datum liegen. Sind beide Daten gefüllt, darf „Dokument von“ nicht nach „Dokument bis“ liegen.

Nettobetrag, Steuerbetrag und Gesamtbetrag werden als nicht editierbare Felder angezeigt. Der Nettobetrag ist ein Pflichtfeld, akzeptiert nur numerische Werte und enthält den extern berechneten Abrechnungsbetrag. Die Steuerklassifizierung ist ein Dropdown, das mit der Steuerklassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt ist. Der Benutzer kann gemäß den bestehenden Revenue-Regeln einen anderen Wert wählen. Der Steuerbetrag ist deaktiviert und wird anhand von Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag.

**FI-Dokumentposition**

Pro MDCR-Dokument ist genau eine Position zulässig, eine zweite kann nicht hinzugefügt werden. Nettobetrag und Positionstext gehören zu dieser einen Position. Der Positionstext ist ein Pflichtfeld mit Freitext und höchstens 255 Zeichen, wie bei MANU. Er beschreibt die Berechnung, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Ein leerer oder zu langer Text verhindert das Speichern.

Fehlen Pflichtfelder oder sind Angaben ungültig, wird das Dokument nicht angelegt. Der Benutzer erhält eine Meldung, die das betroffene Feld nennt, und es wird weder ein Export noch eine Übertragung an MBLD ausgelöst.

**Lebenszyklus und Export**

Das MDCR-Dokument durchläuft den üblichen Lebenszyklus: Erstellt, Akzeptiert, Exportiert, FI-Dokument erstellt, Bezahlt bzw. Mahnstufe. Die Statuswechsel folgen den bestehenden Regeln für Finanzdokumente, und die Standardprüfungen können nicht umgangen werden. Das Dokument ist auf der Seite „Finanzdokumente“ sichtbar.

Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei werden unter anderem Kundendokumenttyp „MDCR“, Dokumentempfänger, SAP-Debitorennummer, Netto-, Steuer- und Gesamtbetrag sowie die Steuerklassifizierung übergeben. Der Positionstext wird im exportierten Positionssatz übertragen. Der Kopftext bleibt leer. Es werden dort weder Berechnungstexte noch Genesis-Nummern oder andere Werte eingetragen.

**Übermittlung an MBLD**

Bei Leasingverträgen (Vertriebskanal = Leasing, Dokumenttyp = MDCR), insbesondere bei MBLD-Verträgen, wird das Dokument zusätzlich über eine API an MBLD gesendet. Die Auswahl erfolgt anhand von Vertriebskanal und Dokumenttyp. Das Übertragungsergebnis wird nach den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über den E169/CoFiCo/SWT-Export verarbeitet und nie an MBLD gesendet.

Hinweis zum aktuellen Stand: Die Auswahllogik für die Weiterleitung an MBLD ist bislang nicht abgestimmt, und die API zur Übermittlung existiert noch nicht. Die Zuständigkeit des Edge-Service-Teams ist noch nicht formal festgelegt.