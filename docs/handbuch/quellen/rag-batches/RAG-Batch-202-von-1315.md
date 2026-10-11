# Batch 202 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vereinheitlichte Kopfbereiche bei Rechnungen**

Die Kopfbereiche der Rechnungsmasken im Reiter „Zahlung" der Vertragsverwaltung wurden vereinheitlicht. Ziel ist, dass Benutzer ein Attribut in allen Rechnungsarten an derselben Stelle finden. So steht zum Beispiel der Dokumenttyp (Document Type) immer als erstes Feld in der ersten Zeile. Dafür wurden einzelne Felder neu angeordnet und einige Felder aus dem Kopfbereich entfernt. Die Änderung betrifft sowohl die Erfassungsmasken als auch die Ansichts- und Bearbeitungsmasken folgender Rechnungsarten: Kundenrechnung (manuelle Erstellung), Preisminderung, Händlerprovision, Werkstattrechnung, SIVECO-Rechnung und Kundenerstattung. Im Admin-Bereich gilt sie zusätzlich für internationale Werkstattrechnungen, deren Erstellung ebenfalls angepasst wurde.

Die Änderungen sind für mehrere Benutzergruppen relevant. Benutzer der Marktorganisation mit vollen Rechten (anlegen, lesen, ändern, löschen) auf Kundenrechnungen, Admin-Rechnungen und internationale Admin-Rechnungen sehen die neue Anordnung ebenso wie MPC-Benutzer, die Kundenrechnungen lesen und Admin-Rechnungen ändern dürfen. Auch HQ- und Admin-Benutzer mit Leserechten auf Admin-Rechnungen sind betroffen. Admin-Benutzer mit vollen Rechten auf internationale Admin-Rechnungen erhalten die angepasste Maske für internationale Werkstattrechnungen.

**Aufbau der Erfassungsmasken**

Beim Anlegen einer Kundenrechnung stehen in der ersten Zeile Dokumenttyp, Rechnungsempfänger, SAP-Debitorennummer und Rechnungsreferenz. In der zweiten Zeile folgen Rechnungstyp und Rechnungsdatum, in der dritten Zeile der Rechnungskopftext. Die vierte Zeile enthält Nettobetrag, Steuerbetrag und Gesamtbetrag. Die Felder „Tatsächliche Laufleistung (km)" und „Währung" entfallen hier.

Bei der Preisminderung beginnt die erste Zeile mit Dokumenttyp, Partnernummer (Vega-ID), Rechnungsempfänger und SAP-Debitorennummer. Die zweite Zeile enthält Rechnungsreferenz, Rechnungstyp und Rechnungsdatum. Danach folgen in der dritten Zeile der Rechnungskopftext und in der vierten Zeile die drei Beträge. Auch hier entfallen Laufleistung und Währung.

Die Händlerprovision hat in der ersten Zeile Dokumenttyp, Partnernummer (Vega-ID), Rechnungsempfänger und SAP-Debitorennummer, in der zweiten Zeile Rechnungsreferenz, Rechnungstyp und Rechnungsdatum. Es folgen der Rechnungskopftext und die Zeile mit Netto-, Steuer- und Gesamtbetrag.

Bei der Werkstattrechnung stehen in der ersten Zeile Dokumenttyp, Partnernummer (Vega-ID), SAP-Debitorennummer und Werkstattname. Die zweite Zeile enthält Werkstattrechnungsnummer, Werkstattrechnungstyp, Rechnungsdatum und Reparaturdatum. In der dritten Zeile erscheinen die tatsächliche Laufleistung (km) und die Währung. Danach folgen der Rechnungskopftext und die Zeile mit den drei Beträgen.

Die SIVECO-Rechnung beginnt mit Dokumenttyp, Markt für internationale Schadenfälle, Werkstattrechnungstyp und Werkstattrechnungsnummer. Die zweite Zeile enthält Rechnungsdatum, Reparaturdatum, tatsächliche Laufleistung (km) und Währung. Es folgen der Rechnungskopftext sowie Netto-, Steuer- und Gesamtbetrag.

Bei der Kundenerstattung stehen in der ersten Zeile Dokumenttyp, Kundenname, SAP-Debitorennummer des Kunden und Partnernummer (Vega-ID). Die zweite Zeile zeigt Werkstattname, SAP-Debitorennummer des Händlers, Werkstattrechnungsnummer und Werkstattrechnungstyp. In der dritten Zeile folgen Rechnungsdatum, Reparaturdatum, tatsächliche Laufleistung (km) und Währung. Anschließend erscheinen der Rechnungskopftext und die drei Beträge.

Bei internationalen Werkstattrechnungen im Admin-Bereich stehen in der ersten Zeile Dokumenttyp, Markt, SAP-Debitorennummer des Markts und Vertragsnummer. Die zweite Zeile enthält Fahrgestellnummer, Division, Partnernummer (Vega-ID) und Werkstattname. In der dritten Zeile folgen SAP-Debitorennummer der Werkstatt, Werkstattrechnungsnummer, Werkstattrechnungstyp und Rechnungsdatum. Die vierte Zeile zeigt Reparaturdatum, tatsächliche Laufleistung (km) und Währung. Danach folgen der Rechnungskopftext und die Zeile mit Netto-, Steuer- und Gesamtbetrag. In den Erfassungsmasken sind die Pflichtfelder wie bisher gekennzeichnet.

**Aufbau der Ansichts- und Bearbeitungsmasken**

In den Ansichts- und Bearbeitungsmasken steht in der ersten Zeile durchgängig die Identifikations- und Übertragungsinformation: oneSCM-Rechnungsnummer, Rechnungsnummer im FI-System, Bearbeitungsnummer und Übertragungsdatum ins FI-System. Bei der Preisminderung ist die Reihenfolge leicht abweichend: oneSCM-Rechnungsnummer, Bearbeitungsnummer, Übertragungsdatum ins FI-System und Rechnungsnummer im FI-System.

Bei der Kundenrechnung folgen in der zweiten Zeile Dokumenttyp, Rechnungsempfänger, SAP-Debitorennummer und Rechnungsreferenz, in der dritten Zeile Rechnungstyp und Rechnungsdatum, in der vierten Zeile der Rechnungskopftext. Die letzte Zeile enthält Nettobetrag, Steuerbetrag, Gesamtbetrag und Rechnungsstatus. Entfernt wurden hier Rechnungszeitraum, tatsächliche Laufleistung (km) und Währung.

Bei der Preisminderung zeigt die zweite Zeile Dokumenttyp, Partnernummer (Vega-ID), Rechnungsempfänger und SAP-Debitorennummer. Die dritte Zeile enthält Rechnungsreferenz, Rechnungstyp und Rechnungsdatum, die vierte den Rechnungskopftext und die fünfte die drei Beträge samt Rechnungsstatus. Rechnungszeitraum, Laufleistung und Währung entfallen.

Bei der Händlerprovision stehen in der zweiten Zeile Dokumenttyp, Partnernummer (Vega-ID), Werkstattname und SAP-Debitorennummer. Es folgen Rechnungsreferenz, Rechnungstyp und Rechnungsdatum, dann der Rechnungskopftext und schließlich die Beträge mit dem Rechnungsstatus.

Bei der Werkstattrechnung zeigt die zweite Zeile Dokumenttyp, Partnernummer (Vega-ID), SAP-Debitorennummer und Werkstattname. Die dritte Zeile enthält Werkstattrechnungsnummer, Werkstattrechnungstyp, Rechnungsdatum und Reparaturdatum. Danach erscheinen Laufleistung und Währung, anschließend der Rechnungskopftext und zuletzt die drei Beträge samt Rechnungsstatus.

Bei der SIVECO-Rechnung stehen in der zweiten Zeile Dokumenttyp, Markt für internationale Schadenfälle, SAP-Debitorennummer und Werkstattrechnungsnummer. Die dritte Zeile enthält Werkstattrechnungstyp, Rechnungsdatum, Reparaturdatum und tatsächliche Laufleistung (km). Es folgen die Währung, der Rechnungskopftext und die Zeile mit Netto-, Steuer- und Gesamtbetrag.

Bei der Kundenerstattung zeigt die zweite Zeile Dokumenttyp, Kundenname, SAP-Debitorennummer des Kunden und Partnernummer (Vega-ID). Die dritte Zeile enthält Werkstattname, SAP-Debitorennummer der Werkstatt, Werkstattrechnungsnummer und Werkstattrechnungstyp. In der vierten Zeile stehen Rechnungsdatum, Reparaturdatum, Laufleistung und Währung. Danach folgen der Rechnungskopftext und die drei Beträge.

Ziel der Änderung ist, dass die Felder in der Ansicht in der beschriebenen Reihenfolge erscheinen und Benutzer sich über alle Rechnungsarten hinweg schneller zurechtfinden.