# Batch 818 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management: Anpassungen und Neuerungen**

**Kundenreiter für B2B-Verträge**

Der Reiter „Kunde" in der Vertragsdetailansicht war bisher ausschließlich auf Privatkunden (B2C) ausgelegt. Er wurde nun so angepasst, dass er auch die Informationen für Geschäftskunden (B2B) darstellt. Voraussetzung ist, dass der Vertrag aktiv ist und für ein B2B-Szenario angelegt wurde. Mitarbeitende im MO/MPC-Bereich sehen die Angaben dann im Workflow des Vertragsmanagements.

Der Kundenname wird je nach Kundentyp unterschiedlich angezeigt: Bei Privatkunden erscheinen Vor- und Nachname (zum Beispiel George Michael), bei Geschäftskunden der Firmenname (zum Beispiel Adidas GmbH).

Der Reiter gliedert sich in zwei Bereiche. Der erste Bereich, „Kundendetails", enthält den Kundentyp (Commercial bei B2B-Verträgen, Private bei B2C-Verträgen), die Kundennummer, den Kundennamen, die USt-IdNr. des Unternehmens, Straße, Adresse, Hausnummer, Postleitzahl, Ort, Land, Mobilnummer, Telefonnummer, E-Mail-Adresse, die Finanzsystem-ID und die Steuerklassifizierung.

Der zweite Bereich, „Ansprechpartner-Details", ist für die Anzeige mehrerer Kontaktpersonen ausgelegt. Alle bei der Vertragserstellung hinterlegten Kontakte werden untereinander aufgelistet, mit den Spalten Rolle, Vorname, Nachname, Telefonnummer, E-Mail-Adresse und Sprache. Direkt unter der Überschrift steht der Hinweis „Results" mit der Angabe, wie viele von wie vielen Datensätzen angezeigt werden („Displaying X of Y records"). Pro Seite werden zehn Datensätze angezeigt; bei mehr als zehn Kontakten erscheint am Seitenende eine Seitennavigation. Die Spaltenüberschriften sind anklickbar, um die Reihenfolge der angezeigten Datensätze zu sortieren.

**Verbesserungen im Vertragsmanagement**

Im Rahmen des Release wurden verschiedene Verbesserungen gesammelt, die den Funktionsumfang, die Abläufe und das Design des Vertragsmanagements insgesamt weiterentwickeln. Außerdem wurden Anpassungen an den Abläufen bei Statusänderungen von Verträgen umgesetzt.

**Noch offene Prüfpunkte zur Änderungshistorie**

Für die Historientabelle eines Vertrags stehen noch Prüfungen aus. Dabei soll kontrolliert werden, dass die Tabelle korrekt aktualisiert wird nach einem Wechsel des Zahlers und einer Übertragung, nach kurz- und langfristigen Verlängerungen, nach Änderungen des Vertragsstatus sowie nach der Umstellung des Zahlungsintervalls von monatlich auf einmalig.

**Hinweis zur Kilometerstandsabfrage (nicht umgesetzt)**

Die geplante Anpassung der Kilometerstandsermittlung (MIC-Handling) bei vorzeitiger Beendigung, Eigentumsübertragung und Vertragsprüfung wurde abgebrochen und ist daher nicht Bestandteil dieses Release.