# Batch 86 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Finalabrechnung (MDCR) im Bereich Revenue Management**

Im Revenue-Modul steht ein manuell erstellbares Finanzdokument vom Typ MDCR (Manual Final Document Contract Review) zur Verfügung. Es dient dazu, die finanzielle Endabrechnung eines Vertrags festzuhalten, entweder zum Vertragsende oder bei vorzeitiger Beendigung. Der Dokumenttyp ist für Leasing- und Nicht-Leasing-Verträge nutzbar. Typische Anwendungsfälle sind eine Kilometerüberschreitung bei einem Servicevertrag, ein Endsaldo bei vorzeitiger Fahrzeugrückgabe im Leasing oder eine Vertragsstrafe bei vorzeitiger Beendigung. Die Berechnung des Betrags erfolgt weiterhin außerhalb von oneSCM. Das Dokument erfasst und exportiert lediglich den bereits berechneten Betrag. Die automatische Erstellung von Endabrechnungsdokumenten auf Basis des Endabrechnungsprofils bleibt unverändert bestehen. Automatisch und manuell erstellte Dokumente verwenden beide den Kundendokumenttyp „MDCR“.

**Berechtigung und Erstellung**

Das Dokument wird von berechtigten Benutzern (MO/MPC) im Bereich „Finanzdokumente“ des Vertrags angelegt. Dafür gelten die bereits vorhandenen Berechtigungen zur manuellen Dokumenterstellung. Eine neue Rolle oder Berechtigung wird nicht eingeführt. Benutzer ohne diese Berechtigung können kein MDCR-Dokument erstellen. Bricht man den Erstellungsvorgang vor dem Speichern ab, wird weder ein Dokument noch ein Export oder eine Übertragung an MBLD erzeugt.

**Felder im Erstellungsformular**

Als Dokumenttyp wählen Sie „Rechnung“ (Belastung des Kunden) oder „Gutschrift“ (Erstattung an den Kunden). Für Gutschriften gilt keine zusätzliche Einschränkung. Der Kundendokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und kann nicht geändert werden.

Als Dokumentempfänger, ein Pflichtfeld, wählen Sie in einer Auswahlliste den Eigentümer bzw. Zahler des Vertrags. Das Verhalten entspricht dem der manuellen Dokumente (MANU). Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen, wird deaktiviert angezeigt und lässt sich nicht manuell ändern.

Optional können Sie eine Dokumentreferenz angeben. Zur Auswahl stehen nur Finanzdokumente des Vertrags, die mindestens den Status „FI-Dokument erstellt“ erreicht haben (also auch bezahlte Dokumente oder solche in einer Mahnstufe). Angezeigt wird jeweils die Rechnungsnummer des FI-Systems.

Das Dokumentdatum muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen, jeweils einschließlich. Ein früheres Datum oder ein Datum in der Zukunft verhindert das Speichern. Nach der Erstellung wird das Datum nicht mehr editierbar angezeigt.

Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt. Das Dokument kann mit leeren Feldern gespeichert werden. Wenn Sie Daten eintragen, müssen sie zwischen Vertragsbeginn und heute liegen. Sind beide Daten angegeben, darf „Dokument von“ nicht nach „Dokument bis“ liegen.

Die Steuerklassifizierung wird mit der Klassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt. Sie können einen anderen Wert aus der Auswahlliste wählen, gemäß den bestehenden Revenue-Regeln. Auf dieser Grundlage wird der Steuerbetrag berechnet.

Der Nettobetrag ist ein Pflichtfeld und akzeptiert nur numerische Werte. Hier tragen Sie den extern berechneten Abrechnungsbetrag ein. Der Steuerbetrag ist deaktiviert und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag. Netto-, Steuer- und Gesamtbetrag werden als nicht editierbare Felder angezeigt.

Pro Dokument ist genau eine FI-Dokumentposition zulässig, eine zweite kann nicht hinzugefügt werden. Nettobetrag und Positionstext gehören zu dieser Position. Der Positionstext ist ein Pflicht-Freitextfeld mit maximal 255 Zeichen, wie bei MANU. Hier beschreiben Sie die Berechnung, zum Beispiel: „12.500 km gefahren − 10.000 km vertraglich vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“.

**Validierung**

Sind Pflichtfelder leer oder Angaben ungültig, etwa ein fehlender Dokumentempfänger, ein fehlender Nettobetrag, ein leerer oder zu langer Positionstext oder ein unzulässiges Datum, wird das Dokument nicht angelegt. Sie erhalten eine Meldung, die das betroffene Feld nennt. Export und Übertragung an MBLD werden dann nicht ausgelöst.

**Verarbeitung, Export und Anzeige**

MDCR-Dokumente durchlaufen den üblichen Dokumentenlebenszyklus: Erstellt, Akzeptiert, Exportiert, FI-Dokument erstellt und anschließend Bezahlt bzw. Mahnstufe. Es gelten die bestehenden Regeln für Statuswechsel, und die Standardprüfungen lassen sich nicht umgehen.

Der Export in das Finanzsystem erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei werden der Kundendokumenttyp „MDCR“, der Dokumentempfänger, die SAP-Debitorennummer sowie Netto-, Steuer- und Gesamtbetrag und die Steuerklassifizierung gemäß der üblichen Struktur exportiert. Der Positionstext steht im Positionssatz der Exportdatei. Der Kopftext bleibt leer, und es werden dort weder Berechnungstexte noch Genesis-Nummern oder andere Werte eingetragen.

MDCR-Dokumente sind auf der Seite „Finanzdokumente“ sichtbar und können in der Ansicht eingesehen werden.

**Übertragung an MBLD**

Für Leasingverträge, bei denen der Vertriebskanal „Leasing“ (MBLD) und der Dokumenttyp „MDCR“ ist, wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Das Ergebnis der Übertragung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung erfasst. MDCR-Dokumente von Nicht-Leasingverträgen werden nicht an MBLD übertragen, sondern ausschließlich über den Standardexport E169/CoFiCo an das Finanzsystem übermittelt.