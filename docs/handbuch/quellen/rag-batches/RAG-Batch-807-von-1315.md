# Batch 807 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung (Contract Management): Neuerungen und Änderungen**

**Kilometerstandshistorie**
Im Detailbereich eines Vertrags, auf dem Tab „Fahrzeug", steht Ihnen nun eine Tabelle mit dem Namen „Mileage History" zur Verfügung. Bisher wurde dort nur der zuletzt erfasste Kilometerstand samt Datum angezeigt, und jeder neue Wert hat den vorherigen überschrieben. Jetzt bleiben alle erfassten Kilometerstände nachvollziehbar, sodass Sie sie prüfen und für Analysen nutzen können.

Die Tabelle zeigt das Erfassungsdatum, formatiert gemäß der Markteinstellung, sowie den erfassten Kilometerstand, ebenfalls gemäß der Markteinstellung formatiert und mit dem Zusatz „Km". Außerdem wird die Quelle der Information angegeben: DSB, MIC, Vega oder die Benutzer-ID der Person, die eine manuelle Rechnung erstellt hat. Der jeweils zuletzt importierte Eintrag erscheint zuerst. Jede Spalte lässt sich sortieren, und die Anzahl der angezeigten Einträge kann in Zehnerschritten gewählt werden.

Die Kilometerstände werden in der Domäne Vehicle Management gespeichert. Wird eine Schnittstellendatei i156 importiert, übermittelt Revenue die Kilometerstandsdaten an den Vertrag, der Datum, Wert und die Quelle „Vega" an das Vehicle Management weitergibt. Erstellen Sie eine manuelle Rechnung, erfasst Revenue den Kilometerstand und sendet ihn an den Vertrag. Dieser aktualisiert daraufhin die Angaben zu „Last Known Mileage (Km)/Date" auf dem Tab „Fahrzeug" und leitet Datum, Wert und die Benutzer-ID als Quelle an das Vehicle Management weiter.

**Vorzeitige Beendigung bei ausgesetztem Vertrag**
Ein Vertrag im Status „Suspended" konnte bisher nur manuell durch MO/MPC oder automatisch nach Aufhebung der Mahnstufe 3 reaktiviert werden. Nun kann ein ausgesetzter Vertrag auch direkt vorzeitig beendet werden. Wählen Sie als MO/MPC den ausgesetzten Vertrag aus und gehen Sie über „Action" auf „Terminate Early". Geben Sie den Kilometerstand ein, wählen Sie einen Grund, ergänzen Sie bei Bedarf Kommentare und fahren Sie fort. Nach Abschluss wird die Schnittstellendatei i155 erzeugt, der Abschnitt „History" aktualisiert und eine E-Mail-Benachrichtigung versendet. Relevante Daten werden außerdem an Revenue übermittelt. Dies gilt auch für Verträge mit Mahnstufe 3.

**Transfer und Zahlerwechsel**
Läuft für einen Vertrag gerade ein Transfer, ist die Funktion „Change Payer" im Aktionsmenü deaktiviert. Ebenso ist „Transfer" deaktiviert, solange ein Zahlerwechsel läuft.

**Langzeitverlängerung (Long-Term Prolongation)**
Die Auswahl der Option „Long Term Prolongation" führte zu einer Fehlermeldung; dies wurde behoben. Ebenfalls korrigiert wurde ein Fehler bei der Berechnung bzw. Anzeige der Vertragslaufzeit nach der Verlängerung und der monatlichen Rate.

**Bezeichnungen und Übersetzungen**
In beiden Domänen (CG und CM) heißt der Suchname und die Spaltenüberschrift nicht mehr „Contract Number", sondern „Reference Number" (englisch) bzw. „Referenznummer" (deutsch). Auf der Detailseite wurde die Bezeichnung „Contact" in „Reference" geändert. Zudem wurden die deutschen Übersetzungen der Benutzeroberfläche gemäß einem Übersetzungsdokument überarbeitet.

**E-Mails und Fehlermeldungen**
Vertragsbezogene Variablen werden nun auch in E-Mails in deutscher Sprache bereitgestellt. Außerdem wurde die Fehlermeldung korrigiert, die beim gleichzeitigen Beenden mehrerer Verträge fälschlicherweise angezeigt wurde.