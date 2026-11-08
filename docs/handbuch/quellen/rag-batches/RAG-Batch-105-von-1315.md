# Batch 105 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von Final-Contract-Review-Dokumenten (MDCR) im Bereich Revenue Management**

Im Revenue-Modul steht ein neuer Dokumenttyp zur Verfügung, mit dem sich die finanzielle Schlussabrechnung eines Vertrags erfassen lässt, entweder zum Vertragsende oder bei vorzeitiger Beendigung. Er gilt sowohl für Leasing- als auch für Nicht-Leasing-Verträge. Typische Anwendungsfälle sind eine Mehrkilometer-Abrechnung bei einem Servicevertrag, der Endabrechnungssaldo bei vorzeitiger Fahrzeugrückgabe im Leasing oder eine Vertragsstrafe bei vorzeitiger Beendigung. Der Betrag wird nicht in oneSCM berechnet, sondern außerhalb des Systems, da je Vertragsart und Markt unterschiedliche Regeln gelten. Das Dokument dient dazu, den bereits berechneten Betrag einheitlich zu erfassen und an das Finanzsystem zu übergeben. Automatisch erzeugte Dokumente auf Basis des Endabrechnungsprofils bleiben unverändert bestehen und tragen ebenfalls den Kundendokumenttyp „MDCR".

**Erstellung und Berechtigungen**

Das Dokument wird im Bereich „Finanzdokumente" des jeweiligen Vertrags manuell angelegt. Dies können Benutzer mit der Rolle MO bzw. MPC tun. Es gibt keine neue Rolle oder Berechtigung; es gelten die bestehenden Berechtigungen für die manuelle Erstellung von Finanzdokumenten. Wer diese Berechtigung nicht besitzt, kann kein MDCR-Dokument anlegen. Bricht der Benutzer den Vorgang vor dem Speichern ab, wird kein Dokument erzeugt und es entstehen weder ein Exportsatz noch eine Übertragung an MBLD.

**Felder im Erstellungsformular**

Als Dokumenttyp wählen Sie „Rechnung" (Belastung des Kunden) oder „Gutschrift" (Erstattung an den Kunden); dieses Pflichtfeld ist ein Dropdown. Für Gutschriften gibt es keine zusätzliche Einschränkung. Als Dokumentempfänger, ebenfalls ein Pflichtfeld, wählen Sie den Eigentümer bzw. Zahler des Vertrags; das Verhalten entspricht dem der manuellen Dokumente vom Typ MANU. Ohne Dokumentempfänger lässt sich das Dokument nicht speichern. Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen, wird deaktiviert angezeigt und kann nicht geändert werden.

Optional können Sie eine Dokumentreferenz angeben. Zur Auswahl stehen nur Finanzdokumente des Vertrags, die mindestens den Status „FI-Beleg erstellt" erreicht haben (also auch bezahlte Dokumente oder solche in einer Mahnstufe). Angezeigt wird jeweils die Rechnungsnummer des FI-Systems. Der Kundendokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)" gesetzt und nicht änderbar.

Das Belegdatum wählen Sie im Kalender. Es muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen, jeweils einschließlich. Ein früheres oder zukünftiges Datum verhindert das Speichern. Nach der Erstellung wird das Belegdatum nicht mehr editierbar angezeigt. Die Felder „Dokument von" und „Dokument bis" sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt. Das Dokument kann mit beiden leeren Feldern gespeichert werden. Werden Daten eingetragen, müssen sie zwischen Vertragsbeginn und heute liegen, und bei Angabe beider Daten darf „von" nicht nach „bis" liegen.

**Positionsdaten und Beträge**

Ein MDCR enthält genau eine FI-Dokumentposition; eine zweite Position kann nicht hinzugefügt werden. Die Steuerklassifizierung ist ein Dropdown, das mit der Steuerklassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt ist und gemäß den bestehenden Revenue-Regeln geändert werden kann. Der Nettobetrag ist ein Pflichtfeld, akzeptiert nur numerische Werte und enthält den extern berechneten Betrag. Der Steuerbetrag ist deaktiviert und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag. Netto-, Steuer- und Gesamtbetrag werden als nicht editierbare Anzeigefelder dargestellt.

Im Pflichtfeld „FI-Dokument-Positionstext" beschreiben Sie als Freitext die Berechnung, etwa „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR". Der Text darf maximal 255 Zeichen umfassen. Ein leerer oder zu langer Text verhindert das Speichern.

Fehlen Pflichtfelder oder sind Angaben ungültig, wird das Dokument nicht erstellt. Sie erhalten eine Meldung, die das betroffene Feld nennt, und es wird weder ein Export noch eine Übertragung an MBLD ausgelöst.

**Lebenszyklus und Export**

Ein MDCR durchläuft den üblichen Lebenszyklus von Finanzdokumenten: Erstellt, Akzeptiert, Exportiert, FI-Beleg erstellt, Bezahlt bzw. Mahnstufe. Die Statusübergänge folgen den bestehenden Regeln, und die Standardprüfungen lassen sich nicht umgehen. Der Export an das Finanzsystem erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei werden unter anderem der Kundendokumenttyp „MDCR", der Dokumentempfänger, die SAP-Debitorennummer, die Beträge und die Steuerklassifizierung übergeben. Der Positionstext steht im Positionssatz der Exportdatei, während der Kopftext leer bleibt. Dort werden weder Berechnungstexte noch Genesis-Nummern oder andere Werte eingetragen.

**Übertragung an MBLD**

Bei Leasingverträgen, also bei Vertrieb über den Kanal Leasing/MBLD, wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand der Kriterien Vertriebskanal = Leasing und Dokumenttyp = MDCR. Das Ergebnis der Übertragung wird gemäß den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport an das Finanzsystem verarbeitet.

**Anzeige**

Das erstellte MDCR ist auf der Seite „Finanzdokumente" sichtbar und kann dort in der Ansicht für MDCR-Rechnungen eingesehen werden.