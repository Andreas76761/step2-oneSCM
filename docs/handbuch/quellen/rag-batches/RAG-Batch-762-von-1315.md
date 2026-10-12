# Batch 762 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 33 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsmanagement – Neuerungen und Korrekturen**

Im Bereich der Vertragsverlängerungen wurden mehrere Fehler behoben. Bei einer Kurzzeitverlängerung ohne Kilometererweiterung zeigt die Vergleichstabelle bei der Vertragserstellung nun die korrekten Werte an. Ebenso werden die jährlichen und die gesamten Kilometerwerte nach einer Kurzzeitverlängerung im Vertragsmanagement wieder korrekt ausgegeben. Bei Langzeitverlängerungen werden die Preiskomponenten nun aktualisiert. Wird eine Verlängerung durchgeführt, erscheinen die Änderungen jetzt auch in der Benutzeroberfläche. Darüber hinaus wurde eine Fehlfunktion bei der Verlängerung allgemein behoben, und die Protokolleinträge zu Verlängerungsstornierungen werden nun im Bereich „Historie“ angezeigt.

Auch bei der Darstellung und Pflege von Vertragsdaten gab es Verbesserungen. Die Deckungen (Coverages) werden nun korrekt angezeigt. Wird der Kundenname im Vertragsmanagement aktualisiert, wird die Änderung jetzt korrekt übernommen. Zudem wurde die Kündigungsmeldung vereinheitlicht, sodass sie für alle Kundentypen gleich lautet.

Für die Massenerstellung von Verträgen gilt künftig: Bevor der Batch-Lauf zur Erstellung der einzelnen Verträge einer Gruppe gestartet wird, wird für MO bzw. MPC geprüft, ob ein Händlerrabatt gewährt werden darf. Zuvor war diese Prüfung bei ausgewählter Massenerstellung nicht möglich.

Darüber hinaus wurde ein Berechtigungsproblem im Markt Slowakei (SK) behoben: Der MPC für diesen Markt konnte zuvor auf Batch-Jobs anderer Märkte zugreifen, denen er nicht zugeordnet ist.

Zum Thema Dokumente sind weitere Anpassungen vorgesehen: Service-Vertrag, Langzeitverlängerung, SEPA, AGB und Zahlungsplan sollen nach der Aktivierung nicht gelöscht, sondern nur ersetzt werden können. Fahrzeugschein, Steuerbefreiungsnachweis, Handelsregisterauszug und sonstige Dokumente sollen dagegen löschbar sein. In der Benutzeroberfläche wird dafür die Löschfunktion für den Dokumenttyp „Sonstige Dokumente“ ermöglicht.

Weitere Themen wurden im Zuge der Qualitätssicherung bearbeitet und abgeschlossen, darunter die Wiederaktivierung von Verträgen nach Bezahlung von Rechnungen in der Mahnstufe (sofern die Anzahl der Rechnungen in der Mahnstufe unter der in den Markteinstellungen erlaubten Anzahl liegt), die Sichtbarkeit von Kurzzeitverlängerungen in der Zahlungstabelle, die Filterung nach „Erstellt von“, die Anzeige von Validierungsfehlern sowie das Anlegen von Steuerarten für ermäßigte und befreite Sätze. Einzelne Punkte wurden nicht weiterverfolgt, etwa die Aufnahme VAN-bezogener Verträge in die I155-Datei oder ein Fehler im Zahlungsreiter bei vollständig subventionierten Verträgen.