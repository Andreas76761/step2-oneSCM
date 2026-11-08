# Batch 1154 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 21 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Preismatrix bei MBLD: Randzellen werden automatisch befüllt**

Bei MBLD werden die Preise der Servicevertragsprodukte als Gesamtlaufleistung dargestellt. Lücken in der Preismatrix werden durch lineare Interpolation gefüllt. Bisher wurde nur dann interpoliert, wenn eine Zelle innerhalb derselben Spalte sowohl in einer vorhergehenden als auch in einer nachfolgenden Zelle einen gültigen Preis hatte. Zellen ohne gültige Werte davor und danach blieben leer. Diese Randzellen werden nun nach festen Regeln befüllt. Für jede Laufleistungsspalte gilt: Der erste verfügbare Preispunkt wird in alle darüberliegenden Zellen derselben Spalte übernommen (obere Randlücken). Der letzte verfügbare Preispunkt wird in alle darunterliegenden Zellen derselben Spalte übernommen (untere Randlücken).

**Kurzzeitverlängerung: Monatspreis**

Bei einer Kurzzeitverlängerung wurde bisher keine Berechnung durchgeführt. Das System stellt dem Vertrag nun den Monatspreis bereit, auch wenn die Zahlungsweise nicht monatlich ist. Der Monatspreis wird auf Basis aller Zahlungsintervalle und der Verwaltungsgebühr aus der Produktkonfiguration berechnet und bei der Kurzzeitverlängerung an den Vertrag übergeben.

**Kampagnen: Verkaufsebene**

Beim Anlegen einer Kampagne steht ein neues Pflichtfeld „Sales Level“ zur Verfügung. Es ist als Mehrfachauswahl per Checkbox umgesetzt und bietet die Optionen „Direct-to-Customer“, „Dealerships“ und „MPCs/MOCs“. Bei bestehenden oder neu angelegten Kampagnen können einzelne oder mehrere Optionen an- oder abgewählt werden. Berechnung und Anwendbarkeit einer Kampagne richten sich nach der gewählten Verkaufsebene und werden für unterschiedliche Benutzergruppen geprüft, etwa für Händlerbenutzer bei der Verkaufsebene „Dealerships“ und für MPC-Benutzer bei Kampagnen, die nicht für MPCs/MOCs gelten.

**Kampagnenverwaltung**

In der Kampagnenübersicht unter „Manage Campaigns“ werden standardmäßig nur Kampagnen mit dem Status „Upcoming“ und „Active“ angezeigt. Kampagnen in der Nachfrist (Grace Period) mit dem Status „Finished“ können wie aktive Kampagnen deaktiviert werden. Die Eindeutigkeitslogik der externen Kampagnen-ID wurde erweitert: Dieselbe externe ID kann für mehrere Kampagnen verwendet werden, sofern sich diese weder zeitlich noch in der Fahrzeuggruppe überschneiden. Außerdem wurde die Kampagnenansicht überarbeitet, da sie zuvor viele Produkte und Fahrzeuggruppen anzeigte, für die die Kampagne nicht gilt.

Bei Sticker-Price-Kampagnen mit dem Kampagnenwert 0 erfolgt keine Übermittlung an die Vertragserstellung.

**Produkte und Preisversionen**

Wird unter „Manage Vehicle Groups“ ein Produkt ausgewählt, werden alle Preisversionen mit ihrem Status in Klammern angezeigt, zum Beispiel aktuelle, kommende und abgelaufene Versionen. Im Produkterstellungsablauf wurde die Preismatrix für Kontingentprodukte angepasst. Die Interpolations- und Rundungslogik für kontingentbasierte Reifenprodukte wird validiert. Die Bezeichnung „Non must match“ wurde in „None must match“ umbenannt. Für die Division Passenger Cars wurde die Produktlinie „Basic“ aus den HQ-Blueprints entfernt.

**Verlängerung bei MBLD**

Bei der Verlängerung von MBLD-Verträgen werden die Preise und die Gesamtlaufleistung an das Vertragsmanagement übermittelt. Geprüft wird, dass die übermittelten Daten nach der Verlängerung alle erforderlichen Felder enthalten, jeweils nach Auswahl einer gültigen Laufleistung und Laufzeit, etwa 20.000 km bei 48 Monaten, 45.000 km bei 48 Monaten oder 70.000 km bei 60 Monaten.