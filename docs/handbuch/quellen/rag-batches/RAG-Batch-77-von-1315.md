# Batch 77 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Erstellung von Abschlussdokumenten zur Vertragsprüfung (MDCR)**

Im Modul Revenue Management steht ab sofort ein einheitlicher Dokumenttyp zur Verfügung, mit dem die finanzielle Schlussabrechnung eines Vertrags erfasst wird, und zwar bei Vertragsende ebenso wie bei vorzeitiger Beendigung. Er gilt sowohl für Leasingverträge als auch für Nicht-Leasingverträge. Ein solches Dokument bildet eine Abschlussabrechnung in Form einer Rechnung oder einer Gutschrift ab. Sie gleicht die Differenz zwischen dem tatsächlich Verbrauchten bzw. Geschuldeten und dem Vertraglich Vereinbarten aus. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe im Leasing oder eine Vertragsstrafe bei vorzeitiger Beendigung. Der Betrag wird weiterhin außerhalb von oneSCM berechnet. Das System dient dazu, den bereits ermittelten Betrag zu erfassen und zu exportieren. Eine automatische Berechnung findet nicht statt.

Automatisch erzeugte Abschlussdokumente auf Basis des Endsaldo-Profils bleiben unverändert bestehen. In Märkten oder Fällen, in denen dieser Mechanismus nicht genutzt wird, können berechtigte Benutzer das Dokument nun manuell anlegen. Automatisch und manuell erstellte Dokumente verwenden denselben Kunden-Dokumenttyp „MDCR“.

**Erstellung und Berechtigungen**

Die Erstellung erfolgt im Bereich „Finanzdokumente“ des jeweiligen Vertrags durch Benutzer der Rollen MO bzw. MPC. Es wird keine neue Rolle und keine neue Berechtigung eingeführt. Es gelten die bereits vorhandenen Berechtigungen zur manuellen Dokumenterstellung. Benutzer ohne diese Berechtigungen können kein MDCR-Dokument anlegen. Das Dokument wird erst beim Speichern erzeugt. Wird der Vorgang vorher abgebrochen, entstehen weder ein Finanzdokument noch ein Exportdatensatz oder eine Übertragung an MBLD.

**Felder im Erstellungsformular**

Als Dokumenttyp wählen Sie „Rechnung“ (Belastung des Kunden) oder „Gutschrift“ (Erstattung an den Kunden). Für Gutschriften gibt es keine zusätzliche Einschränkung. Der Dokumenttyp ist ein Pflichtfeld.

Im Feld „Dokumentempfänger“ wählen Sie den Eigentümer bzw. Zahler des Vertrags aus. Es verhält sich wie bei MANU-Dokumenten und ist ein Pflichtfeld. Ohne Empfänger lässt sich das Dokument nicht speichern. Die SAP-Debitorennummer wird nach der Auswahl automatisch mit der Nummer des gewählten Empfängers befüllt. Das Feld ist deaktiviert und nicht manuell änderbar.

Optional können Sie eine Dokumentreferenz angeben. Auch dieses Feld verhält sich wie bei MANU. Zur Auswahl stehen nur Finanzdokumente des Vertrags, die mindestens den Status „FI-Dokument erstellt“ erreicht haben (also auch bezahlte Dokumente oder solche in einer Mahnstufe). Angezeigt wird jeweils die Rechnungsnummer des FI-Systems.

Der Kunden-Dokumenttyp ist fest auf „MDCR (Manual Final Document Contract Review)“ gesetzt und kann nicht geändert werden.

Das Belegdatum wählen Sie per Kalender. Es muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen (jeweils einschließlich). Datumsangaben vor Vertragsbeginn oder in der Zukunft werden nicht gespeichert. Nach der Erstellung wird das Belegdatum nicht mehr editierbar angezeigt. Nettobetrag, Steuerbetrag und Gesamtbetrag werden als nicht editierbare Felder dargestellt.

Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR-Dokument keinen Abrechnungszeitraum abbildet. Das Dokument kann auch ohne diese Angaben gespeichert werden. Wenn Sie Datumswerte eintragen, müssen sie zwischen Vertragsbeginn und heutigem Tag liegen. Sind beide Daten angegeben, darf „Dokument von“ nicht nach „Dokument bis“ liegen.

**FI-Dokumentposition**

Pro Dokument ist genau eine Position zulässig; eine zweite Position kann nicht hinzugefügt werden. Sie enthält folgende Angaben:

Die Steuerklassifizierung wird mit der Steuerklassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt. Sie können einen anderen Wert aus dem Auswahlfeld wählen, gemäß den bestehenden Revenue-Regeln. Die gewählte Steuerklassifizierung dient der Berechnung des Steuerbetrags.

Der Nettobetrag ist ein Pflichtfeld und nimmt nur numerische Werte an. Hier tragen Sie den extern berechneten Abschlussbetrag ein. Der Steuerbetrag ist deaktiviert und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Gesamtbetrag ergibt sich aus Nettobetrag plus Steuerbetrag.

Der Positionstext ist ein Pflichtfeld mit Freitext und höchstens 255 Zeichen (wie bei MANU). Hier beschreiben Sie die Berechnung, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Das Dokument kann weder mit leerem noch mit zu langem Text gespeichert werden.

Sind Pflichtfelder leer oder Angaben ungültig, wird das Dokument nicht erstellt. Sie erhalten eine Meldung, die das betroffene Feld nennt, und es wird weder ein Export noch eine Übertragung an MBLD ausgelöst.

**Verarbeitung und Export**

MDCR-Dokumente durchlaufen den üblichen Dokumentenlebenszyklus: Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt → Bezahlt bzw. Mahnstufe. Es gelten die bestehenden Regeln für Statusübergänge, und die Standardprüfungen können nicht umgangen werden.

Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei wird der Kunden-Dokumenttyp „MDCR“ exportiert, ebenso Dokumentempfänger und SAP-Debitorennummer. Netto-, Steuer- und Gesamtbetrag sowie die Steuerklassifizierung werden gemäß der Standardstruktur von Finanzdokumenten übergeben. Der Positionstext wird in den Positionsdatensatz der Exportdatei übernommen. Der Kopftext bleibt leer; es werden dort weder Berechnungstexte noch Genesis-Nummern oder andere Werte eingetragen.

**Übertragung an MBLD**

Für Leasingverträge, also bei Vertriebskanal Leasing/MBLD und Dokumenttyp MDCR, wird das Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand dieser beiden Kriterien. Das Übertragungsergebnis wird nach den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Dokumente von Nicht-Leasingverträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport E169/CoFiCo/SWT verarbeitet.

**Anzeige**

MDCR-Rechnungen sind auf der Seite „Finanzdokumente“ sichtbar und können dort in der Ansicht betrachtet werden.