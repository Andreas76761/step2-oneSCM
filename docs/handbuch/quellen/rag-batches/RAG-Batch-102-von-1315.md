# Batch 102 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von Abschlussdokumenten (MDCR) im Bereich Revenue Management**

Im Modul Revenue steht ab sofort ein neuer, manuell erstellbarer Finanzdokumenttyp zur Verfügung: das MDCR (Manual Final Document Contract Review). Es dient dazu, die finanzielle Schlussabrechnung eines Vertrags zu erfassen, entweder zum Vertragsende oder bei vorzeitiger Beendigung, und zwar sowohl für Leasing- als auch für Nicht-Leasing-Verträge. Typische Anwendungsfälle sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe eines Leasingvertrags oder eine Vertragsstrafe bei vorzeitiger Kündigung. Die Berechnung des Betrags erfolgt weiterhin außerhalb von oneSCM, da jede Vertragsart und jeder Markt eigene Regeln hat. oneSCM stellt lediglich einen einheitlichen Dokumenttyp bereit, mit dem der bereits berechnete Betrag erfasst und exportiert wird. Automatisch erzeugte Abschlussdokumente auf Basis des Endabrechnungsprofils bleiben unverändert bestehen und verwenden ebenfalls den Kundendokumenttyp „MDCR“.

**Wer kann MDCR-Dokumente erstellen?**

Die Erstellung erfolgt durch berechtigte Benutzer der Rollen MO bzw. MPC im Bereich „Finanzdokumente“ des jeweiligen Vertrags. Es wird keine neue Rolle und keine neue Berechtigung eingeführt. Es gelten die bereits vorhandenen Berechtigungen für die manuelle Dokumenterstellung. Benutzer ohne diese Berechtigungen können kein MDCR-Dokument anlegen.

**Felder und Eingaben**

Als Dokumentart wählen Sie, ob das MDCR als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) erstellt wird. Für Gutschriften gibt es keine zusätzliche Einschränkung. Der Kundendokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und kann nicht geändert werden.

Als Dokumentempfänger wählen Sie in einem Pflichtfeld den Eigentümer bzw. Zahler des Vertrags aus; das Verhalten entspricht dem der manuellen Dokumente (MANU). Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen, ist deaktiviert und kann nicht geändert werden. Optional können Sie eine Dokumentreferenz angeben. Zur Auswahl stehen nur Finanzdokumente des Vertrags, die mindestens den Status „FI Doc Created“ erreicht haben (also auch bezahlte Dokumente oder solche in einer Mahnstufe). Angezeigt wird jeweils die Rechnungsnummer des FI-Systems.

Das Belegdatum muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen (jeweils einschließlich). Ein Datum vor Vertragsbeginn oder in der Zukunft ist nicht zulässig. Nach der Erstellung wird das Belegdatum nicht mehr editierbar angezeigt. Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt. Das Dokument kann auch ohne diese Angaben gespeichert werden. Werden Daten eingetragen, müssen sie zwischen Vertragsbeginn und heutigem Tag liegen, und „Dokument von“ darf nicht nach „Dokument bis“ liegen.

Ein MDCR enthält genau eine FI-Dokumentposition; eine zweite Position kann nicht hinzugefügt werden. In dieser Position erfassen Sie die Steuerklassifizierung, den Nettobetrag und den Positionstext. Die Steuerklassifizierung wird anhand des gewählten Eigentümers bzw. Zahlers vorbelegt und kann gemäß den bestehenden Revenue-Regeln aus der Auswahlliste geändert werden. Der Nettobetrag ist ein Pflichtfeld, akzeptiert nur numerische Werte und entspricht dem extern berechneten Abschlussbetrag. Der Steuerbetrag ist deaktiviert und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag. Nettobetrag, Steuerbetrag und Gesamtbetrag werden als nicht editierbare Anzeigefelder dargestellt.

Der FI-Dokument-Positionstext ist ein Pflichtfeld für Freitext mit maximal 255 Zeichen, wie bei MANU. Er dient dazu, die Berechnung nachvollziehbar zu beschreiben, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Ein leerer oder zu langer Text verhindert das Speichern.

**Validierung und Abbruch**

Fehlen Pflichtangaben oder sind Eingaben ungültig, wird das Dokument nicht erstellt, und Sie erhalten eine Meldung, die das betroffene Feld benennt. In diesem Fall wird weder ein Export noch eine Übermittlung an MBLD ausgelöst. Wenn Sie die Erstellung vor dem Speichern abbrechen, entstehen weder ein Finanzdokument noch ein Exportdatensatz oder eine MBLD-Übermittlung.

**Statusverlauf und Export**

Ein MDCR durchläuft den üblichen Dokumentenlebenszyklus: Created → Accepted → Exported → FI Doc Created → Paid/Dunning Level. Dabei gelten die bestehenden Regeln für Statusübergänge, und die Standardprüfungen können nicht umgangen werden. Der Export an das Finanzsystem erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei wird der Kundendokumenttyp „MDCR“ übergeben, ebenso der Dokumentempfänger und die SAP-Debitorennummer sowie Nettobetrag, Steuerbetrag, Gesamtbetrag und Steuerklassifizierung gemäß der Standardstruktur. Der Positionstext wird im Positionsdatensatz der Exportdatei mitgeliefert, während der Kopftext leer bleibt. Dort werden weder Berechnungstexte noch Genesis-Nummern oder andere Werte eingetragen.

**Besonderheit für MBLD-Verträge**

Für Leasingverträge von MBLD werden MDCR-Dokumente zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand der Kriterien Vertriebskanal = Leasing und Dokumenttyp = MDCR. Das Ergebnis der Übermittlung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport E169/CoFiCo/SWT verarbeitet.

**Anzeige**

Erstellte MDCR-Rechnungen sind auf der Seite „Finanzdokumente“ sichtbar und können dort in der Ansicht betrachtet werden.

**Hinweis zum aktuellen Stand**

Laut den vorliegenden Informationen existiert die API zur Auswahl und Übermittlung von Dokumenten an MBLD noch nicht, und die Auswahllogik dafür ist noch nicht verbindlich abgestimmt. Die Zuständigkeit des zuständigen Teams ist noch nicht formal zugewiesen. Dieser Teil sollte vor Veröffentlichung des Handbuchtexts auf seinen tatsächlichen Stand geprüft werden.