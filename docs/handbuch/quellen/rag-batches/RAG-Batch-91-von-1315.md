# Batch 91 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von MDCR-Finanzdokumenten (Final Document Contract Review)**

Im Modul Revenue steht ein neuer Dokumenttyp für die finanzielle Schlussabrechnung eines Vertrags zur Verfügung. Er wird bei Vertragsende oder bei vorzeitiger Beendigung verwendet, und zwar sowohl für Leasing- als auch für Nicht-Leasing-Verträge. Ein solches Dokument bildet eine abschließende Abrechnung ab, entweder als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden). Es gleicht die Differenz zwischen dem tatsächlich Verbrauchten bzw. Geschuldeten und dem Vereinbarten aus. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Strafzahlung bei vorzeitiger Vertragsbeendigung. Die Berechnung des Betrags erfolgt außerhalb von oneSCM, da jeder Vertragstyp und jeder Markt eigene Regeln hat. oneSCM dient lediglich dazu, den bereits berechneten Betrag zu erfassen und zu exportieren. Bisher wurden FDCR-Dokumente automatisch auf Basis des Endsaldo-Profils des jeweiligen Produkttyps erzeugt. Diese automatische Erstellung bleibt unverändert bestehen und wird durch die manuelle Erstellung nicht beeinträchtigt. Automatisch und manuell erstellte Dokumente verwenden beide den Kundendokumenttyp „MDCR“.

**Wer das Dokument erstellen darf und wie die Erstellung beginnt**

Berechtigte Benutzer aus den Rollen MO und MPC erstellen das Dokument im Bereich „Finanzdokumente“ des jeweiligen Vertrags, nachdem sie den Abrechnungsbetrag extern berechnet haben. Es gibt keine neue Rolle und keine neue Berechtigung. Es gelten die bestehenden Berechtigungen für die manuelle Dokumenterstellung. Benutzer ohne diese Berechtigungen können kein MDCR-Dokument anlegen. Wird der Erstellungsvorgang vor dem Speichern abgebrochen, entsteht weder ein Finanzdokument noch ein Exportdatensatz noch eine Übertragung an MBLD.

**Die Felder des Erstellungsformulars**

Als Dokumenttyp wählen Sie „Rechnung“ oder „Gutschrift“. Für Gutschriften gibt es keine zusätzliche Einschränkung. Als Dokumentempfänger wählen Sie den Eigentümer bzw. Zahler des Vertrags aus. Das Auswahlfeld verhält sich wie bei manuellen Dokumenten (MANU) und ist ein Pflichtfeld. Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen und kann nicht geändert werden.

Das Feld „Dokumentreferenz“ ist optional und verhält sich ebenfalls wie bei MANU. Zur Auswahl stehen nur Finanzdokumente des Vertrags, die mindestens den Status „FI-Dokument erstellt“ erreicht haben (also auch bezahlte Dokumente oder solche mit Mahnstufe). Angezeigt wird jeweils die Rechnungsnummer aus dem FI-System. Der Kundendokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und kann nicht geändert werden.

Das Dokumentdatum wählen Sie im Kalender. Es muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen (jeweils einschließlich). Nach der Erstellung ist es nicht mehr änderbar. Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR-Dokument keinen Abrechnungszeitraum darstellt. Das Dokument kann auch ohne beide Angaben gespeichert werden. Wenn Sie Daten eingeben, müssen diese zwischen Vertragsbeginn und heutigem Tag liegen. Wenn beide Daten angegeben werden, darf „Dokument von“ nicht nach „Dokument bis“ liegen.

Nnetto-, Steuer- und Gesamtbetrag werden als nicht editierbare Felder angezeigt.

**Die Dokumentposition**

Ein MDCR-Dokument enthält genau eine Position. Eine zweite Position kann nicht hinzugefügt werden. Für diese Position erfassen Sie folgende Angaben:

Die Steuerklassifizierung ist als Auswahlfeld vorbelegt mit der Steuerklassifizierung des gewählten Eigentümers bzw. Zahlers. Sie können einen anderen Wert gemäß den bestehenden Revenue-Regeln wählen. Der Nettobetrag ist ein Pflichtfeld und akzeptiert nur numerische Werte. Er entspricht dem extern berechneten Abrechnungsbetrag. Der Steuerbetrag ist gesperrt und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag.

Der Positionstext ist ein Pflichtfeld mit Freitext und maximal 255 Zeichen, wie bei MANU. Er soll die Berechnung beschreiben, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“.

Wenn Pflichtfelder fehlen oder Angaben ungültig sind, wird das Dokument nicht erstellt. Sie erhalten dann eine Meldung, die das betroffene Feld nennt, und es wird weder ein Export noch eine Übertragung an MBLD ausgelöst.

**Verarbeitung, Export und Übertragung an MBLD**

MDCR-Dokumente durchlaufen den üblichen Lebenszyklus: Erstellt, Akzeptiert, Exportiert, FI-Dokument erstellt, Bezahlt bzw. Mahnstufe. Die Statuswechsel folgen den bestehenden Regeln für Finanzdokumente und können nicht umgangen werden. Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei werden der Kundendokumenttyp „MDCR“, der Dokumentempfänger, die SAP-Debitorennummer sowie Netto-, Steuer- und Gesamtbetrag und die Steuerklassifizierung nach der üblichen Struktur übertragen. Der Positionstext ist in der Positionszeile enthalten, der Kopftext bleibt leer. Dort werden weder Berechnungstexte noch eine Genesis-Nummer oder andere Werte eingetragen.

Für Leasingverträge (Vertriebskanal = Leasing, Dokumenttyp = MDCR), insbesondere für MBLD-Verträge, wird das Dokument zusätzlich per API an MBLD gesendet. Das Ergebnis der Übertragung wird gemäß den bestehenden Regeln für Integration und Fehlerbehandlung festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über den Standardexport E169/CoFiCo/SWT verarbeitet und nie an MBLD gesendet.

Erstellte MDCR-Rechnungen sind auf der Seite „Finanzdokumente“ sichtbar und können dort in der Ansichtsdarstellung geöffnet werden.