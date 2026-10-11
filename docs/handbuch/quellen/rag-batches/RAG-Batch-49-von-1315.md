# Batch 49 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von Final-Contract-Review-Belegen (MDCR) im Bereich Revenue Management**

Im Modul Revenue steht ab sofort ein einheitlicher Belegtyp zur Verfügung, mit dem die finanzielle Endabrechnung eines Vertrags erfasst wird, und zwar entweder bei Vertragsende oder bei vorzeitiger Beendigung. Er gilt sowohl für Leasing- als auch für Nicht-Leasing-Verträge. Ein solcher Beleg bildet eine Schlussabrechnung ab (Rechnung bzw. Belastung oder Gutschrift bzw. Erstattung). Er gleicht die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem Vertraglich Vereinbarten aus, etwa bei einer Kilometerüberschreitung eines Servicevertrags, einem Endsaldo nach vorzeitiger Fahrzeugrückgabe im Leasing oder einer Vertragsstrafe bei vorzeitiger Beendigung. Der Betrag wird weiterhin außerhalb von oneSCM berechnet, da jeder Markt und Vertragstyp eigene Regeln hat. oneSCM erfasst und exportiert den bereits berechneten Betrag.

Automatisch erzeugte Belege dieser Art auf Basis des Endsaldo-Profils bleiben unverändert unterstützt. Die manuelle Erstellung ist für Märkte und Fälle gedacht, in denen die Berechnung außerhalb von oneSCM erfolgt. Beide Varianten verwenden denselben Kundenbelegtyp „MDCR“ (Manual Final Document Contract Review).

**Erstellung des Belegs**

Der Beleg wird von berechtigten Benutzern der Rollen MO/MPC im Bereich „Finanzbelege“ des Vertrags angelegt, nachdem der Abrechnungsbetrag extern ermittelt wurde. Es gibt keine neue Rolle oder Berechtigung. Es gelten die bestehenden Rechte zur manuellen Belegerstellung. Benutzer ohne diese Rechte können keinen MDCR-Beleg erstellen.

Als Belegart wählen Sie „Rechnung“ (Belastung des Kunden) oder „Gutschrift“ (Erstattung an den Kunden). Für Gutschriften gibt es keine zusätzliche Einschränkung. Als Belegempfänger wählen Sie den Eigentümer bzw. Zahler des Vertrags; das Feld ist ein Pflichtfeld und verhält sich wie beim manuellen Beleg (MANU). Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen und ist nicht änderbar. Optional können Sie einen Referenzbeleg auswählen. Zur Auswahl stehen Finanzbelege des Vertrags mit dem Status „FI Doc created“ oder einem späteren Status (z. B. bezahlt oder Mahnstufen); angezeigt wird jeweils die Rechnungsnummer des FI-Systems. Der Kundenbelegtyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und kann nicht geändert werden.

Das Belegdatum wählen Sie über einen Kalender. Es muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen (jeweils einschließlich); frühere oder zukünftige Daten werden abgelehnt. Nach der Erstellung ist das Belegdatum nicht mehr änderbar. Die Felder „Beleg von“ und „Beleg bis“ sind optional, da ein MDCR-Beleg keinen Abrechnungszeitraum darstellt. Der Beleg kann also ohne diese Angaben gespeichert werden. Werden Daten eingetragen, müssen sie ebenfalls zwischen Vertragsbeginn und heute liegen, und „Beleg von“ darf nicht nach „Beleg bis“ liegen.

**Belegposition und Beträge**

Ein MDCR-Beleg enthält genau eine FI-Belegposition; eine zweite Position kann nicht hinzugefügt werden. Die Steuerklassifizierung wird anhand des gewählten Eigentümers bzw. Zahlers vorbelegt und kann gemäß den bestehenden Revenue-Regeln aus den verfügbaren Werten angepasst werden. Den Nettobetrag, also den extern berechneten Abrechnungsbetrag, tragen Sie als Pflichtangabe ein; erlaubt sind nur numerische Werte. Der Steuerbetrag ist gesperrt und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Netto- plus Steuerbetrag. Netto-, Steuer- und Gesamtbetrag werden als nicht editierbare Anzeigefelder dargestellt.

Zusätzlich ist ein Positionstext als Pflichtfeld einzugeben. Er beschreibt die Berechnung, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Der Text ist ein Freitext mit maximal 255 Zeichen (wie beim MANU-Beleg). Ist er leer oder zu lang, kann der Beleg nicht gespeichert werden.

Fehlen Pflichtangaben oder sind Angaben ungültig, wird der Beleg nicht erstellt, und Sie erhalten eine Meldung, die das betroffene Feld benennt. Es wird dann weder ein Export noch eine Übertragung an MBLD ausgelöst. Wenn Sie den Vorgang vor dem Speichern abbrechen, wird kein Beleg, kein Exporteintrag und keine Übertragung erzeugt. Der gespeicherte MDCR-Beleg ist in der Ansicht der Finanzbelege sichtbar.

**Verarbeitung, Export und Übertragung an MBLD**

Der Beleg durchläuft den üblichen Belegzyklus: Erstellt → Akzeptiert → Exportiert → FI-Beleg erstellt → Bezahlt bzw. Mahnstufe. Die Statusübergänge folgen den bestehenden Regeln für Finanzbelege und lassen sich nicht umgehen. Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei werden unter anderem der Kundenbelegtyp „MDCR“, der Belegempfänger, die SAP-Debitorennummer, Netto-, Steuer- und Gesamtbetrag sowie die Steuerklassifizierung übernommen. Der Positionstext steht im Positionssatz, der Kopftext bleibt leer. Es werden also weder Berechnungstext noch Genesis-Nummer oder andere Werte in den Kopftext geschrieben.

Für Leasingverträge, also MBLD-Verträge, wird der MDCR-Beleg zusätzlich per API an MBLD gesendet. Ausgewählt werden die Belege dabei anhand des Vertriebskanals „Leasing“ und des Belegtyps „MDCR“. Das Ergebnis der Übertragung wird gemäß den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Belege von Nicht-Leasing-Verträgen werden nicht an MBLD gesendet, sondern ausschließlich über den Standardexport E169/CoFiCo/SWT an das Finanzsystem übermittelt.