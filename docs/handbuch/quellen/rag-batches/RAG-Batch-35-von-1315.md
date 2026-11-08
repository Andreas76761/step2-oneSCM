# Batch 35 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von Abschlussdokumenten (MDCR) im Revenue-Modul**

Im Revenue-Modul steht ab sofort ein einheitlicher Dokumenttyp zur Verfügung, mit dem die finanzielle Position eines Vertrags bei Vertragsende oder vorzeitiger Beendigung abgeschlossen wird. Er gilt sowohl für Leasing- als auch für Nicht-Leasing-Verträge. Das Dokument bildet eine Schlussabrechnung ab, entweder als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden). Es gleicht die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem Vertraglich Vereinbarten aus, zum Beispiel bei einer Kilometerüberschreitung, einer vorzeitigen Fahrzeugrückgabe oder einer Vertragsstrafe bei vorzeitiger Beendigung. Die Berechnung erfolgt weiterhin außerhalb von oneSCM. Das System dient ausschließlich dazu, den bereits berechneten Betrag zu erfassen und zu exportieren. Bisher mussten für solche Fälle uneinheitlich benannte manuelle Dokumente verwendet werden, was zu Unklarheiten zwischen den Teams führte.

Automatisch erzeugte Dokumente dieser Art, die auf dem Endabrechnungsprofil des jeweiligen Produkttyps beruhen, bleiben unverändert bestehen. In einigen Märkten wird der Endsaldo-Mechanismus jedoch nicht genutzt, sodass die Berechnung manuell erfolgt. Für diese Fälle lassen sich manuelle Abschlussdokumente (MDCR, Manual Final Document Contract Review) anlegen. Beide Varianten verwenden den Kundendokumenttyp „MDCR“.

**Erstellung und Berechtigungen**

Die Erstellung erfolgt durch berechtigte Benutzer der Rollen MO/MPC im Bereich „Finanzdokumente“ des Vertrags. Es wird weder eine neue Rolle noch eine neue Berechtigung eingeführt. Es gelten die bestehenden Berechtigungen für die manuelle Dokumenterstellung. Benutzer ohne diese Berechtigungen können kein MDCR-Dokument anlegen. Wird der Erstellungsvorgang vor dem Speichern abgebrochen, entstehen weder ein Finanzdokument noch ein Exportdatensatz oder eine Übermittlung an MBLD.

**Felder des Erstellungsformulars**

Als Dokumenttyp wählen Sie „Rechnung“ oder „Gutschrift“ (Pflichtfeld). Für Gutschriften gilt keine zusätzliche Einschränkung. Als Dokumentempfänger wählen Sie den Eigentümer bzw. Zahler des Vertrags (Pflichtfeld, Verhalten wie bei MANU-Dokumenten). Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen und ist nicht änderbar.

Die Dokumentreferenz ist optional und verhält sich wie bei MANU-Dokumenten. Auswählbar sind nur Finanzdokumente des Vertrags mit dem Status „FI Doc Created“ oder einem späteren Status (z. B. bezahlt oder Mahnstufe). Angezeigt wird jeweils die Rechnungsnummer des FI-Systems. Der Kundendokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und kann nicht geändert werden.

Das Dokumentdatum muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen (jeweils einschließlich). Es ist nach der Erstellung nicht mehr editierbar. Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt. Das Dokument kann auch ohne beide Angaben gespeichert werden. Wenn Sie Daten eintragen, müssen sie zwischen Vertragsbeginn und heutigem Tag liegen, und „Dokument von“ darf nicht nach „Dokument bis“ liegen.

Netto-, Steuer- und Gesamtbetrag werden als nicht editierbare Felder angezeigt. Es ist genau eine FI-Dokumentposition zulässig, eine zweite Position kann nicht hinzugefügt werden. Die Steuerklassifizierung wird mit der Klassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt und kann gemäß den bestehenden Revenue-Regeln aus den verfügbaren Werten geändert werden. Der Nettobetrag ist ein Pflichtfeld, akzeptiert nur numerische Werte und enthält den extern berechneten Abschlussbetrag. Der Steuerbetrag ist deaktiviert und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag.

Der Positionstext der FI-Dokumentposition ist ein Pflichtfeld mit Freitext und maximal 255 Zeichen (wie bei MANU). Er soll die Berechnung nachvollziehbar beschreiben, zum Beispiel: „12.500 km gefahren − 10.000 km vertraglich = 2.500 km × 0,15 EUR/km = 375,00 EUR“.

Sind Pflichtfelder leer oder Angaben ungültig, wird das Dokument nicht erstellt. Sie erhalten eine Meldung, die das betroffene Feld benennt, und es wird weder ein Export noch eine Übermittlung an MBLD ausgelöst. Das erstellte MDCR-Dokument ist in der Ansicht „Finanzdokumente“ sichtbar.

**Lebenszyklus und Export**

MDCR-Dokumente durchlaufen den üblichen Lebenszyklus: Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt → Bezahlt bzw. Mahnstufe. Die Statusübergänge folgen den bestehenden Regeln für Finanzdokumente, und die Standardprüfungen können nicht umgangen werden.

Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei werden der Kundendokumenttyp „MDCR“, der Dokumentempfänger, die SAP-Debitorennummer sowie Netto-, Steuer- und Gesamtbetrag und die Steuerklassifizierung gemäß der üblichen Struktur exportiert. Der Positionstext wird im Positionssatz der Exportdatei übermittelt. Der Kopftext bleibt leer. Es werden dort keine Berechnungstexte, Genesis-Nummern oder andere Werte eingetragen.

**Übermittlung an MBLD**

Für Leasingverträge (Vertriebskanal = Leasing/MBLD, Dokumenttyp = MDCR) wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand dieser beiden Kriterien, und das Ergebnis der Übertragung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über E169/CoFiCo/SWT exportiert und nie an MBLD gesendet.

Hinweis: Laut den vorliegenden Informationen existiert die API zur Auswahl und Übermittlung an MBLD derzeit noch nicht, und die Zuständigkeit des Edge-Service-Teams ist noch nicht formal geklärt.