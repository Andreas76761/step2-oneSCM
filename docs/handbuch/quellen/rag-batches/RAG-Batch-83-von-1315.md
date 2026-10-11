# Batch 83 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von Final Document Contract Review (MDCR) Dokumenten im Revenue Management**

Im Revenue-Modul steht ab sofort ein neuer, manuell erstellbarer Finanzdokumenttyp zur Verfügung: das MDCR (Manual Final Document Contract Review). Er dient dazu, die finanzielle Endabrechnung eines Vertrags abzubilden, sei es zum Vertragsende oder bei vorzeitiger Beendigung, und zwar sowohl für Leasingverträge als auch für Nicht-Leasingverträge. Ein solches Dokument stellt eine Schlussabrechnung dar, entweder als Rechnung oder als Gutschrift. Es gleicht die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem Vereinbarten aus. Typische Beispiele sind eine Kilometerüberschreitung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe im Leasing oder eine Vertragsstrafe bei vorzeitiger Kündigung. Die Berechnung des Betrags erfolgt außerhalb von oneSCM. Das System stellt lediglich einen einheitlichen Dokumenttyp sowie den Erstellungs- und Exportprozess bereit, um den bereits berechneten Betrag zu erfassen und weiterzugeben.

Das automatisch erzeugte FDCR-Dokument auf Basis des Endabrechnungsprofils des jeweiligen Produkttyps bleibt unverändert bestehen. Die manuelle Erstellung ist für Fälle gedacht, in denen die Berechnung außerhalb von oneSCM erfolgt. Der automatische Endabrechnungsprozess wird dadurch nicht beeinträchtigt. Automatisch und manuell erzeugte Dokumente verwenden beide den Kundendokumenttyp „MDCR".

**Wer kann MDCR-Dokumente erstellen?**

Die Erstellung erfolgt durch berechtigte Benutzer der Rollen MO bzw. MPC im Bereich „Finanzdokumente" des jeweiligen Vertrags, nachdem sie den Abrechnungsbetrag extern berechnet haben. Es wird keine neue Rolle oder Berechtigung eingeführt; es gelten die bestehenden Berechtigungen für die manuelle Dokumenterstellung. Benutzer ohne diese Berechtigung können kein MDCR-Dokument anlegen.

**Felder im Erstellungsformular**

Als Dokumentart wählen Sie „Rechnung" (Belastung des Kunden) oder „Gutschrift" (Erstattung an den Kunden); dieses Feld ist ein Pflichtfeld. Für Gutschriften gibt es keine zusätzliche Einschränkung. Als Dokumentempfänger wählen Sie in einem Dropdown den Eigentümer bzw. Zahler des Vertrags aus; das Verhalten entspricht dem der MANU-Dokumente, und die Angabe ist verpflichtend. Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen und ist nicht editierbar.

Optional können Sie eine Dokumentreferenz angeben. Zur Auswahl stehen Finanzdokumente des Vertrags, die mindestens den Status „FI Doc Created" erreicht haben (also auch bezahlte Dokumente oder solche in Mahnstufen); angezeigt wird jeweils die Rechnungsnummer des FI-Systems. Der Kundendokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)" gesetzt und kann nicht geändert werden.

Das Dokumentdatum wählen Sie per Kalender zwischen dem Vertragsbeginn und dem heutigen Tag (jeweils einschließlich). Es kann weder vor dem Vertragsbeginn noch in der Zukunft liegen und ist nach der Erstellung nicht mehr änderbar. Netto-, Steuer- und Gesamtbetrag werden als nicht editierbare Felder angezeigt.

**Dokumentposition**

Pro MDCR-Dokument ist genau eine Position zulässig; eine zweite Position kann nicht hinzugefügt werden. Die Position enthält folgende Angaben:

Die Felder „Dokument von" und „Dokument bis" sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt. Sie können leer bleiben. Werden Daten eingegeben, müssen sie zwischen Vertragsbeginn und heutigem Tag liegen, und „Dokument von" darf nicht nach „Dokument bis" liegen.

Die Steuerklassifizierung wird mit der Steuerklassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt. Sie können einen anderen Wert gemäß den bestehenden Revenue-Regeln wählen. Auf dieser Grundlage wird der Steuerbetrag berechnet.

Der Nettobetrag ist ein numerisches Pflichtfeld und enthält den extern berechneten Abrechnungsbetrag. Der Steuerbetrag ist deaktiviert und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag.

Der FI-Dokument-Positionstext ist ein Pflichtfeld mit Freitext und maximal 255 Zeichen (wie bei MANU). Hier beschreiben Sie die Berechnung, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR".

**Validierung und Abbruch**

Fehlen Pflichtfelder oder sind Angaben ungültig, wird das Dokument nicht erstellt, und Sie erhalten eine Meldung, die das betroffene Feld benennt. Dabei wird weder ein Export noch eine Übertragung an MBLD ausgelöst. Wenn Sie den Erstellungsvorgang vor dem Speichern abbrechen, wird kein Dokument angelegt und kein Exportdatensatz oder MBLD-Versand erzeugt.

**Lebenszyklus und Export**

MDCR-Dokumente durchlaufen den üblichen Lebenszyklus: Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt → Bezahlt bzw. Mahnstufe. Die Statuswechsel folgen den bestehenden Regeln für Finanzdokumente, und die Standardprüfungen können nicht umgangen werden. Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei wird der Kundendokumenttyp „MDCR" übergeben, ebenso Dokumentempfänger, SAP-Debitorennummer, Netto-, Steuer- und Gesamtbetrag sowie die Steuerklassifizierung. Der Positionstext ist im exportierten Positionsdatensatz enthalten, der Kopftext bleibt leer. Es werden dort also weder Berechnungstexte noch Genesis-Nummern oder andere Werte eingetragen.

Das erstellte MDCR-Dokument ist auf der Seite „Finanzdokumente" sichtbar und kann dort in der Ansicht betrachtet werden.

**Übermittlung an MBLD**

Für Leasingverträge, insbesondere MBLD-Verträge, wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt über die Kombination aus Vertriebskanal „Leasing" und Dokumenttyp „MDCR". Das Ergebnis der Übertragung wird gemäß den bestehenden Integrations- und Fehlerbehandlungsregeln erfasst. MDCR-Dokumente von Nicht-Leasingverträgen werden ausschließlich über den Standardexport E169/CoFiCo/SWT an das Finanzsystem übergeben und nie an MBLD gesendet.

**Hinweis zum Entwicklungsstand**

Nach den vorliegenden Informationen existiert die API zur Auswahl und Übermittlung an MBLD noch nicht; die Zuständigkeit des Edge-Service-Teams ist noch nicht formal zugewiesen. Die Auswahllogik für die MBLD-Übermittlung ist hier jedoch wie oben beschrieben festgelegt.