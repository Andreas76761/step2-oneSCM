# Batch 63 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuell erstellte Abschlussdokumente (MDCR) im Revenue-Modul**

Im Revenue-Modul steht ein Dokumenttyp für die finanzielle Schlussabrechnung eines Vertrags zur Verfügung: der FDCR (Final Document Contract Review). Er schließt die finanzielle Position eines Vertrags bei Vertragsende oder vorzeitiger Beendigung ab, sowohl für Leasing- als auch für Nicht-Leasing-Verträge. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Beendigung. Während FDCR-Dokumente automatisch auf Basis des Endabrechnungsprofils des jeweiligen Produkttyps erzeugt werden, wird die Berechnung in manchen Märkten außerhalb von oneSCM durchgeführt. Für diese Fälle können berechtigte Benutzer das Dokument manuell als MDCR (Manual Final Document Contract Review) erstellen. oneSCM berechnet den Betrag dabei nicht, sondern erfasst und exportiert den bereits extern ermittelten Betrag.

**Wer MDCR-Dokumente erstellen kann**

Die Erstellung erfolgt durch MO/MPC-Benutzer im Bereich „Finanzdokumente“ des jeweiligen Vertrags. Es gibt keine neue Rolle und keine neue Berechtigung; es gelten die bestehenden Rechte zur manuellen Dokumenterstellung. Benutzer ohne diese Rechte können kein MDCR-Dokument anlegen.

**Felder bei der Erstellung**

Als Dokumenttyp wählen Sie „Rechnung“ oder „Gutschrift“. Für Gutschriften gibt es keine zusätzliche Einschränkung. Als Dokumentempfänger wählen Sie in einem Dropdown den Eigentümer bzw. Zahler des Vertrags; das Feld ist verpflichtend und verhält sich wie beim MANU-Dokument. Die SAP-Debitorennummer wird anhand des gewählten Empfängers automatisch befüllt und kann nicht geändert werden. Der Kundendokumenttyp ist immer „MDCR (Manual Final Document Contract Review)“ und nicht änderbar.

Optional können Sie eine Dokumentreferenz angeben. Zur Auswahl stehen nur Finanzdokumente des Vertrags im Status „FI Doc Created“ oder später (zum Beispiel bezahlt oder in einer Mahnstufe); angezeigt wird die Rechnungsnummer des FI-Systems. Das Dokumentdatum muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen (jeweils einschließlich); Zukunftsdaten und Daten vor Vertragsbeginn werden nicht akzeptiert. Nach der Erstellung ist das Datum nicht mehr bearbeitbar.

Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt. Das Dokument kann mit beiden leeren Feldern gespeichert werden. Werden Daten eingegeben, müssen sie zwischen Vertragsbeginn und heutigem Tag liegen, und „von“ darf nicht nach „bis“ liegen.

**Position, Beträge und Steuern**

Ein MDCR enthält genau eine FI-Dokumentposition; eine zweite Position kann nicht hinzugefügt werden. Den Nettobetrag, den Sie extern berechnet haben, tragen Sie als Pflichtfeld ein (nur numerische Werte). Die Steuerklassifizierung wird mit der Klassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt und kann gemäß den bestehenden Revenue-Regeln angepasst werden. Der Steuerbetrag wird anhand von Nettobetrag und Steuerklassifizierung berechnet und ist nicht editierbar. Der Gesamtbetrag ergibt sich aus Netto- plus Steuerbetrag. Netto-, Steuer- und Gesamtbetrag werden als nicht editierbare Felder angezeigt.

Zusätzlich ist ein Positionstext (FI Doc Position Text) verpflichtend. Er ist ein Freitextfeld mit höchstens 255 Zeichen und soll die Berechnung nachvollziehbar beschreiben, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Ein leerer oder zu langer Text verhindert das Speichern.

**Validierung und Abbruch**

Fehlen Pflichtfelder oder sind Angaben ungültig, wird das Dokument nicht erstellt, und eine Meldung weist auf das betroffene Feld hin. Es werden dann weder ein Export noch eine Übertragung an MBLD ausgelöst. Wenn Sie den Erstellungsvorgang vor dem Speichern abbrechen, wird weder ein Dokument noch ein Exportdatensatz noch eine MBLD-Übertragung erzeugt.

**Ablauf, Export und Übertragung an MBLD**

Ein MDCR durchläuft den üblichen Dokumentenlebenszyklus: Erstellt, Akzeptiert, Exportiert, FI-Dokument erstellt, anschließend Bezahlt bzw. Mahnstufe. Die bestehenden Regeln für Statusübergänge gelten unverändert und können nicht umgangen werden. Der Export an das Finanzsystem erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei wird der Kundendokumenttyp „MDCR“ zusammen mit Dokumentempfänger, SAP-Debitorennummer, Netto-, Steuer- und Gesamtbetrag sowie Steuerklassifizierung exportiert. Der Positionstext wird in den Positionsdatensatz übernommen, während der Kopftext leer bleibt.

Für Leasingverträge, bei denen zusätzlich MBLD als nachgelagertes System beteiligt ist, werden MDCR-Dokumente über eine API an MBLD übermittelt. Ausgewählt werden sie anhand des Vertriebskanals „Leasing“ und des Dokumenttyps „MDCR“. Das Ergebnis der Übertragung wird nach den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden nie an MBLD gesendet und ausschließlich über den Standardexport an das Finanzsystem verarbeitet.

**Sichtbarkeit und bestehende Prozesse**

MDCR-Rechnungen sind auf der Seite „Finanzdokumente“ sichtbar und können in der Ansicht eingesehen werden. Automatisch erzeugte Dokumente aus dem Endabrechnungsprozess bleiben unverändert unterstützt; die manuelle Erstellung beeinträchtigt diesen Prozess nicht. Sowohl automatisch als auch manuell erstellte Dokumente verwenden den Kundendokumenttyp „MDCR“.