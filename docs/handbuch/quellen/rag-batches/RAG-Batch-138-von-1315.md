# Batch 138 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Anpassungen**

**Nemesis-Fehlerprotokoll**

OneSCM liest und verarbeitet jetzt zusätzliche funktionale Fehlermeldungsnummern aus der Nemesis-Fehlerdatei, die bislang nicht berücksichtigt wurden. Anhand der Meldungsnummer werden die Fehler klassifiziert und auf der Nemesis-Fehlerseite unter der jeweils zugehörigen Domäne angezeigt. Dem Bereich Contract sind die Meldungen zu fehlendem oder ungültigem Ländercode, fehlendem Vertrag, abweichender FIN gegenüber dem Vertragsstamm, fehlender Vertragslaufzeit, ungültigen Kennzeichen für Vertragsverlängerung und Vertragsreduzierung, nicht gefundenem Vertragsstamm, einem Vertragsende vor der Migration bei aktivem Status sowie einem in der Zukunft liegenden Vertragsbeginn zugeordnet. Der Bereich Revenue zeigt die Meldung an, dass für einen Vertrag keine Umsatzaktualisierung erfolgt ist. Im Bereich Cost erscheint die Meldung, dass die Ist-Kosten für das Abschlussdatum nach Produktions-, Reduzierungs- bzw. Aktivierungsvorgängen nicht geladen wurden. Fehlermeldungen, die ausschließlich die Kostenverteilung (Cost Distribution) im Bereich Financial Management betreffen, werden in OneSCM nicht berücksichtigt. Dazu gehören Meldungen zu abweichenden Jahren der Kostenverteilung, fehlenden oder nicht auf 100 % summierten Prozentwerten, nicht empfangenen Kostenkurven sowie zu linearen Prozentwerten und nicht erlaubten Kostenkurven-Aktualisierungen.

**Export an CoFiCo und SWT**

Die Exportjobs für CoFiCo und SWT berücksichtigen nun auch CAMP- und DD-Rechnungen für vollständig subventionierte Verträge, die zuvor ignoriert wurden. Für alle Händlerrabatt-Rechnungen, die an CoFiCo und SWT exportiert werden, wird außerdem in der H-Zeile ab Position 66 der Text „Dealer participation in the service contract based on the agreement." ergänzt.

**Erstattung bei abgelehnten Prepaid-Verträgen**

Bei Prepaid-Verträgen werden nach dem Status „Waiting for Activation" die MO-Prüfungen durchgeführt. Sind alle Prüfungen in Ordnung, geht der Vertrag in den nächsten gültigen Aktivierungsstatus über. In diesem Fall wird er nicht abgelehnt, und es werden weder eine Erstattung noch eine Gutschrift erzeugt. Fallen die MO-Prüfungen negativ aus, wird der Vertrag abgelehnt. Wurde bereits eine Zahlung geleistet, initiiert das System nach Abschluss der Ablehnung die Erstattung des vollständig gezahlten Betrags. Wurde die Rechnung über MPay bezahlt, erfolgt die Erstattung über MPay. Im Bereich Revenue wird dafür eine Gutschrift erzeugt, deren Betrag dem ursprünglich bezahlten Rechnungsbetrag entspricht und die mit der ursprünglichen Rechnung verknüpft ist.

**Weitere Themen in Bearbeitung**

Derzeit in Prüfung beziehungsweise noch nicht abgeschlossen sind unter anderem die Verifikation des MPay-Status „Not due" bei Kunden ohne MME-Konto, die Prüfung der Zahlungsbedingung in der Exportdatei für Commercial-Government- und Commercial-Fleet-Verträge, die automatische Akzeptanz von Rechnungen und Gutschriften auf Basis eines konfigurierten Schwellenwerts sowie die Prüfung, ob der Produktname nach Ausführung des Batchlaufs COFICOINvEXP in der Exportdatei enthalten ist. Geprüft wird zudem, ob die Namen der SWT- und CoFiCo-Exportdateien die Division enthalten. Die Plausibilitätsprüfung der Finanzkontrolle mit dem E169-Export, einschließlich der Szenarien mit exakter Übereinstimmung, Abweichung und fehlender Rückmeldung, wurde abgeschlossen.

Für die Architektur ist vorgesehen, beim Anlegen eines Marktes die erforderlichen Batchjobs automatisch zu erstellen. Dazu wird die Konfiguration aus YAML-Dateien in marktspezifische Konfigurationseinstellungen überführt. Dieses Vorhaben befindet sich derzeit im Qualitätsgate.