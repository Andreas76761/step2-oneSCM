# Batch 112 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Abschlussabrechnung zum Vertragsende: Manuelle Erstellung von MDCR-Belegen im Bereich Revenue**

Im Modul Revenue steht ein einheitlicher Belegtyp für die finanzielle Schlussabrechnung eines Vertrags zur Verfügung, und zwar sowohl bei regulärem Vertragsende als auch bei vorzeitiger Beendigung. Er gilt für Leasing- und Nicht-Leasing-Verträge. Ein solcher Beleg bildet die endgültige Abrechnung ab, entweder als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden). Er gleicht die Differenz zwischen dem tatsächlich Verbrauchten bzw. Geschuldeten und dem Vereinbarten aus. Typische Beispiele sind eine Kilometerüberschreitung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe im Leasing oder eine Vertragsstrafe bei vorzeitiger Beendigung. FDCR-Belege werden von oneSCM bereits automatisch auf Basis des Endabrechnungsprofils des jeweiligen Produkttyps erstellt. In manchen Märkten wird dieser Mechanismus jedoch nicht genutzt, und die Berechnung erfolgt manuell außerhalb von oneSCM. Dafür gibt es die manuelle Erstellung eines MDCR-Belegs (Manual Final Document Contract Review). Die Berechnung selbst findet weiterhin außerhalb von oneSCM statt, da jeder Vertragstyp und Markt eigene Regeln hat. oneSCM erfasst und exportiert lediglich den bereits berechneten Betrag.

**Wer MDCR-Belege erstellen kann**

MDCR-Belege werden von berechtigten Anwendern der Rollen MO/MPC im Bereich „Finanzbelege“ eines Vertrags manuell angelegt. Es gibt keine neue Rolle oder Berechtigung. Maßgeblich sind die bestehenden Berechtigungen für die manuelle Belegerstellung. Anwender ohne diese Berechtigung können keinen MDCR-Beleg erstellen.

**Felder bei der Erstellung**

Im Erstellungsformular wählen Sie zunächst den Belegtyp „Rechnung“ oder „Gutschrift“. Für Gutschriften gibt es keine zusätzliche Einschränkung. Als Belegempfänger wählen Sie in einem Dropdown den Eigentümer bzw. Zahler des Vertrags aus. Das Feld ist ein Pflichtfeld und verhält sich wie beim manuellen Beleg vom Typ MANU. Die SAP-Debitorennummer wird automatisch aus dem gewählten Belegempfänger übernommen und ist nicht editierbar. Optional können Sie eine Belegreferenz angeben. Zur Auswahl stehen Finanzbelege des Vertrags im Status „FI-Beleg erstellt“ oder in einem späteren Status (zum Beispiel bezahlt oder in einer Mahnstufe). Angezeigt wird die Rechnungsnummer des FI-Systems. Der Kundenbelegtyp ist immer „MDCR (Manual Final Document Contract Review)“ und kann nicht geändert werden.

Das Belegdatum wählen Sie über einen Kalender. Es muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen (jeweils einschließlich). Weder ein Datum vor Vertragsbeginn noch ein Datum in der Zukunft kann gespeichert werden. Nach der Erstellung wird das Belegdatum nicht mehr editierbar angezeigt. Nettobetrag, Steuerbetrag und Gesamtbetrag werden als nicht editierbare Felder dargestellt.

Die Felder „Beleg von“ und „Beleg bis“ sind optional, da ein MDCR-Beleg keinen Abrechnungszeitraum darstellt. Der Beleg kann auch mit beiden leeren Feldern gespeichert werden. Wenn Sie Daten eintragen, müssen sie zwischen Vertragsbeginn und heutigem Datum liegen. Sind beide Daten angegeben, darf „Beleg von“ nicht nach „Beleg bis“ liegen.

**Belegposition und Beträge**

Ein MDCR-Beleg enthält genau eine Position, eine zweite Position kann nicht hinzugefügt werden. Die Steuerklassifizierung ist ein Dropdown, das mit der Steuerklassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt ist. Sie können einen anderen Wert gemäß den bestehenden Revenue-Regeln wählen. Den extern berechneten Nettobetrag tragen Sie in einem Pflichtfeld ein, das nur numerische Werte akzeptiert. Der Steuerbetrag ist deaktiviert und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag.

Im Pflichtfeld „FI-Beleg-Positionstext“ beschreiben Sie in Freitext die Berechnung, beispielsweise „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Der Text darf maximal 255 Zeichen lang sein, wie beim MANU-Beleg. Ein leerer oder zu langer Text verhindert das Speichern.

**Validierung und Abbruch**

Fehlen Pflichtangaben oder sind Angaben ungültig, wird der Beleg nicht erstellt, und eine Meldung nennt das betroffene Feld. Es wird dann weder ein Export noch eine Übertragung an MBLD ausgelöst. Wenn Sie die Erstellung vor dem Speichern abbrechen, entstehen weder ein Finanzbeleg noch ein Exportsatz oder eine MBLD-Übertragung.

**Verarbeitung und Export**

Ein MDCR-Beleg durchläuft den üblichen Belegstatus-Ablauf: Erstellt, Akzeptiert, Exportiert, FI-Beleg erstellt und anschließend Bezahlt bzw. Mahnstufe. Die Statuswechsel folgen den bestehenden Regeln für Finanzbelege, der Standardablauf kann nicht umgangen werden. Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei werden unter anderem der Kundenbelegtyp „MDCR“, der Belegempfänger, die SAP-Debitorennummer sowie Netto-, Steuer- und Gesamtbetrag und die Steuerklassifizierung übergeben. Der Positionstext steht im Positionssatz, der Kopftext bleibt leer. Es werden dort also weder Berechnungstexte noch eine Genesis-Nummer oder andere Werte eingetragen.

**Übermittlung an MBLD**

Bei Leasingverträgen (Vertriebskanal = Leasing, Belegtyp = MDCR), insbesondere bei MBLD-Verträgen, wird der MDCR-Beleg zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand dieser beiden Kriterien, das Übertragungsergebnis wird gemäß den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Belege von Nicht-Leasing-Verträgen werden ausschließlich über den E169/CoFiCo/SWT-Export verarbeitet und nie an MBLD gesendet.

**Darstellung und Verträglichkeit mit dem automatischen Prozess**

Erstellte MDCR-Rechnungen sind auf der Seite „Finanzbelege“ sichtbar und können dort in einer Detailansicht betrachtet werden. Automatisch erzeugte MDCR-Rechnungen und -Gutschriften auf Basis des Endabrechnungsprofils bleiben unverändert unterstützt. Die manuelle Erstellung beeinträchtigt den automatischen Prozess nicht, und beide Varianten verwenden den Kundenbelegtyp „MDCR“.

**Hinweis zum Entwicklungsstand**

Die Funktion befindet sich noch in Entwicklung. Die API zur Auswahl und Übertragung der Belege an MBLD existiert derzeit noch nicht, und die Zuständigkeit dafür ist noch nicht formell zugewiesen.