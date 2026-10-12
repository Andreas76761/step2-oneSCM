# Batch 54 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von Schlussabrechnungen zur Vertragsprüfung (MDCR)**

Im Modul Revenue steht ab sofort der Dokumenttyp MDCR (Manual Final Document Contract Review) zur Verfügung. Er dient dazu, die finanzielle Schlussabrechnung eines Vertrags manuell zu erfassen, entweder bei Vertragsende oder bei vorzeitiger Beendigung. Er kann sowohl für Leasing- als auch für Nicht-Leasing-Verträge verwendet werden. Ein solches Dokument bildet eine Abschlussabrechnung als Rechnung oder Gutschrift ab und gleicht die Differenz zwischen dem tatsächlich Verbrauchten bzw. Geschuldeten und dem vertraglich Vereinbarten aus. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Beendigung. Die Berechnung selbst erfolgt außerhalb von oneSCM, da jede Vertragsart und jeder Markt eigene Regeln hat. oneSCM erfasst und exportiert lediglich den bereits berechneten Betrag. Die automatisch erzeugten Dokumente dieses Typs auf Basis des Endabrechnungsprofils bleiben unverändert erhalten und werden durch die manuelle Erstellung nicht beeinträchtigt. Beide Varianten verwenden den Kundendokumenttyp „MDCR“.

**Wer das Dokument erstellen kann**

Die Erstellung erfolgt durch berechtigte Benutzer der Rollen MO/MPC im Bereich „Finanzdokumente“ des jeweiligen Vertrags. Es gibt keine neue Rolle und keine neue Berechtigung. Es gelten die bereits vorhandenen Berechtigungen für die manuelle Dokumenterstellung. Benutzer ohne diese Berechtigungen können kein MDCR-Dokument anlegen.

**Felder und Eingaben**

Beim Erstellen wählen Sie zunächst den Dokumenttyp „Rechnung“ oder „Gutschrift“. Für Gutschriften gibt es keine zusätzliche Einschränkung. Als Dokumentempfänger wählen Sie den Eigentümer bzw. Zahler des Vertrags aus; das Feld ist ein Pflichtfeld und verhält sich wie beim Dokumenttyp MANU. Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen und kann nicht geändert werden. Optional können Sie eine Dokumentreferenz angeben. Zur Auswahl stehen nur Finanzdokumente des Vertrags im Status „FI Doc Created“ oder in einem späteren Status (zum Beispiel bezahlt oder Mahnstufen), jeweils mit der Rechnungsnummer des FI-Systems. Der Kundendokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und nicht änderbar.

Das Belegdatum muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen (jeweils einschließlich). Ein Datum vor Vertragsbeginn oder in der Zukunft ist nicht zulässig. Nach der Erstellung wird das Belegdatum nicht mehr editierbar angezeigt. Die Felder „Dokument von“ und „Dokument bis“ sind optional, da eine MDCR keinen Abrechnungszeitraum darstellt. Das Dokument kann auch ohne beide Angaben gespeichert werden. Wenn Sie Daten eingeben, müssen diese ebenfalls zwischen Vertragsbeginn und heute liegen, und „Dokument von“ darf nicht nach „Dokument bis“ liegen.

Die Steuerklassifizierung wird anhand des gewählten Eigentümers bzw. Zahlers vorbelegt. Sie können einen anderen Wert aus den nach den bestehenden Revenue-Regeln verfügbaren Optionen auswählen. Den Nettobetrag, den Sie extern berechnet haben, tragen Sie manuell ein. Er ist ein Pflichtfeld und akzeptiert nur numerische Werte. Der Steuerbetrag wird anhand von Nettobetrag und Steuerklassifizierung berechnet und deaktiviert angezeigt. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag. Nettobetrag, Steuerbetrag und Gesamtbetrag werden als nicht editierbare Anzeigefelder dargestellt, soweit zutreffend.

Zu einer MDCR ist genau eine FI-Dokumentposition zulässig. Eine zweite Position kann nicht hinzugefügt werden. Nettobetrag und Positionstext gehören zu dieser einen Position. Der Positionstext ist ein Pflichtfeld als Freitext mit maximal 255 Zeichen, wie bei MANU. Er soll die Berechnung nachvollziehbar beschreiben, zum Beispiel: „12.500 km gefahren − 10.000 km vertraglich vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Ein leerer oder zu langer Text verhindert das Speichern.

**Speichern, Abbrechen und Validierung**

Fehlen Pflichtangaben oder sind Angaben ungültig, wird das Dokument nicht erstellt. Sie erhalten eine Meldung, die das betroffene Feld nennt, und es werden weder Export noch Übermittlung an MBLD ausgelöst. Wenn Sie den Erstellungsvorgang vor dem Speichern abbrechen, wird kein Dokument angelegt und es entsteht weder ein Exportdatensatz noch eine MBLD-Übermittlung. Gespeicherte MDCR-Rechnungen sind auf der Seite „Finanzdokumente“ sichtbar.

**Ablauf und Export**

Ein MDCR-Dokument durchläuft den üblichen Dokumentenlebenszyklus: Created → Accepted → Exported → FI Doc Created → Paid bzw. Mahnstufe. Jeder Statuswechsel folgt den bestehenden Regeln für Finanzdokumente, und die Standardprüfungen können nicht umgangen werden. Der Export an das FI-System erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei werden Kundendokumenttyp „MDCR“, Dokumentempfänger, SAP-Debitorennummer, Netto-, Steuer- und Gesamtbetrag sowie die Steuerklassifizierung nach der üblichen Struktur exportiert. Der Positionstext steht im exportierten Positionsdatensatz. Der Kopftext bleibt leer; es werden dort weder Berechnungstext noch Genesis-Nummer oder andere Werte eingetragen.

**Übermittlung an MBLD**

Für Leasingverträge (Vertriebskanal = Leasing/MBLD und Dokumenttyp = MDCR) wird das MDCR-Dokument zusätzlich über eine API an MBLD gesendet. Die Auswahl erfolgt anhand dieser beiden Kriterien, und das Ergebnis der Übertragung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über E169/CoFiCo/SWT exportiert und niemals an MBLD gesendet.

**Hinweis zum Stand**

Laut den vorliegenden Angaben existiert die API zur Auswahl und Übermittlung an MBLD noch nicht, und die Zuständigkeit des Edge-Service-Teams ist noch nicht formal geklärt. Das Ticket befindet sich im Teststatus.