# Batch 71 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von Final-Contract-Review-Dokumenten (MDCR) im Bereich Revenue Management**

Im Revenue-Modul steht ein neuer Dokumenttyp zur Verfügung, mit dem die finanzielle Schlussabrechnung eines Vertrags erfasst wird, und zwar sowohl bei Vertragsende als auch bei vorzeitiger Beendigung. Er gilt für Leasing- und Nicht-Leasing-Verträge. Typische Anwendungsfälle sind eine Kilometerüberschreitung bei einem Servicevertrag, eine Restabrechnung bei vorzeitiger Fahrzeugrückgabe im Leasing oder eine Vertragsstrafe bei vorzeitiger Kündigung. Die Berechnung des Betrags erfolgt weiterhin außerhalb von oneSCM nach den Regeln des jeweiligen Vertragstyps bzw. Marktes. oneSCM erfasst und exportiert den bereits berechneten Betrag. Bisher waren für solche Fälle uneinheitlich benannte manuelle Dokumente nötig, was zu Unklarheiten zwischen den Teams führte. Dokumente dieses Typs, die auf Basis des Endabrechnungsprofils automatisch erzeugt werden, bleiben unverändert unterstützt. Der automatische Endabrechnungsprozess wird durch die manuelle Erstellung nicht beeinträchtigt.

**Erstellung und Berechtigungen**

Das Dokument wird von berechtigten Benutzern der Rollen MO bzw. MPC im Bereich „Finanzdokumente“ des Vertrags manuell angelegt. Es gibt keine neue Rolle und keine neue Berechtigung, sondern es gelten die bestehenden Berechtigungen für die manuelle Dokumenterstellung. Wer diese Berechtigung nicht besitzt, kann kein MDCR-Dokument erstellen. Beim Anlegen wählen Sie als Dokumenttyp „Rechnung“ oder „Gutschrift“ aus. Für Gutschriften gibt es keine zusätzliche Einschränkung. Der Kundendokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und kann nicht geändert werden. Wenn Sie den Vorgang vor dem Speichern abbrechen, wird weder ein Dokument noch ein Export oder eine Übertragung an MBLD erzeugt.

**Felder des Erfassungsformulars**

Als Dokumentempfänger wählen Sie in einem Pflicht-Dropdown den Eigentümer bzw. Zahler des Vertrags aus. Das Verhalten entspricht dem der manuellen Dokumente (MANU). Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen, wird deaktiviert angezeigt und kann nicht geändert werden. Optional können Sie eine Dokumentreferenz angeben. Zur Auswahl stehen Finanzdokumente des Vertrags im Status „FI-Dokument erstellt“ oder in einem späteren Status (z. B. bezahlt oder Mahnstufe), wobei die Rechnungsnummer des FI-Systems angezeigt wird.

Das Belegdatum muss zwischen dem Vertragsbeginn und dem heutigen Datum liegen (jeweils einschließlich). Nach dem Anlegen ist es nicht mehr änderbar. Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein solches Dokument keinen Abrechnungszeitraum darstellt. Das Dokument kann also auch ohne diese Angaben gespeichert werden. Wenn Sie Datumswerte eintragen, müssen sie zwischen Vertragsbeginn und heute liegen, und „von“ darf nicht nach „bis“ liegen.

Pro Dokument ist genau eine FI-Dokumentposition zulässig. Sie enthält die Steuerklassifizierung, den Nettobetrag und den Positionstext. Die Steuerklassifizierung wird mit der des gewählten Eigentümers bzw. Zahlers vorbelegt und kann gemäß den bestehenden Revenue-Regeln über ein Dropdown angepasst werden. Den Nettobetrag, also den extern berechneten Betrag, geben Sie als Pflichtfeld ausschließlich numerisch ein. Der Steuerbetrag wird aus Nettobetrag und Steuerklassifizierung berechnet und deaktiviert angezeigt. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag. Netto-, Steuer- und Gesamtbetrag erscheinen als nicht editierbare Anzeigefelder.

Im Pflichtfeld „FI-Dokument-Positionstext“ beschreiben Sie in freiem Text, wie der Betrag zustande kam, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Der Text darf höchstens 255 Zeichen lang sein, wie bei MANU. Fehlen Pflichtfelder oder sind Angaben ungültig, wird das Dokument nicht gespeichert. Sie erhalten eine Meldung, die das betroffene Feld nennt, und es wird weder ein Export noch eine Übertragung an MBLD ausgelöst.

**Lebenszyklus und Export**

Das gespeicherte Dokument durchläuft den üblichen Lebenszyklus: Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt → Bezahlt bzw. Mahnstufe. Es gelten die bestehenden Regeln für Statuswechsel, und die Standardprüfungen können nicht umgangen werden. Der Export an das Finanzsystem erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei werden der Kundendokumenttyp „MDCR“, der Dokumentempfänger, die SAP-Debitorennummer sowie Netto-, Steuer- und Gesamtbetrag und die Steuerklassifizierung nach der üblichen Struktur des Finanzdokuments übergeben. Der Positionstext wird in den exportierten Positionssatz übernommen. Der Kopftext bleibt leer. Es werden dort weder ein Berechnungstext noch eine Genesis-Nummer oder andere Werte eingetragen.

**Besonderheit bei MBLD-Verträgen**

Bei Leasingverträgen von MBLD (Vertriebskanal Leasing, Dokumenttyp MDCR) wird das Dokument zusätzlich per API an MBLD übermittelt. Die Auswahl erfolgt anhand dieser beiden Kriterien, und das Ergebnis der Übertragung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport E169/CoFiCo an das Finanzsystem übergeben.

**Anzeige**

MDCR-Rechnungen sind auf der Seite „Finanzdokumente“ sichtbar und können dort in der Ansicht eingesehen werden.