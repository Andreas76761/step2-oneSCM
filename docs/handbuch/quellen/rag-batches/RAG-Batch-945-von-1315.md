# Batch 945 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Detaillierte Preisinformationen und Preishistorie im Reiter „Zahlung"**

Im Bereich „Preisinformationen" des Reiters „Zahlung" wird die Darstellung der Preise neu gestaltet. Bisher gab es für Angebote im Status „Wartet auf Bestätigung", „Aktiviert" oder „Abgelehnt" sowie für Verträge aus dem Vertragsmanagement keine klare Aufschlüsselung des Endpreises. Künftig sehen Sie dort eine detaillierte Aufstellung aller Preisbestandteile zum Zeitpunkt der Vertragserstellung. Zusätzlich wird eine Historie aller Preisänderungen geführt, die durch Vertragsänderungen ausgelöst wurden. Die Daten dafür werden bei jedem Vertragsangebot und bei jeder Einleitung einer Langzeitverlängerung (Long Term Extension) aus der Kalkulation abgerufen.

Oberhalb der Preistabelle bleiben folgende Angaben in dieser Reihenfolge erhalten: Zahlungsart, Zahlungsintervall, Zahlungsdauer und Sammelrechnungen. Folgende Angaben entfallen aus dem Bereich: Gesamtbruttobetrag, Gesamtnettobetrag, Gesamtsteuerbetrag, Mehrwertsteuersatz, Bruttobetrag und Nettobetrag pro Intervall, Händlerprovisionen, Kampagnenname, Kampagnenbetrag und Händlerrabatt.

Neu hinzu kommen zwei Tabellen: die Preisbestandteil-Tabelle mit der Aufschlüsselung der Preiskomponenten und eine Tabelle mit den finalen Kilometerpreisen für Minderkilometer und Mehrkilometer. Für jeden Preisbestandteil wird der Nettopreis angezeigt. Für den Endpreis und die Kilometerpreise werden sowohl Netto- als auch Bruttowert dargestellt. Der Bruttogesamtpreis wird berechnet, indem der Steuersatz auf die Summe aller Nettowerte der Aufschlüsselung angewendet wird. Aus Gründen der Konsistenz erfolgt die Berechnung je Intervallpreis und wird anschließend mit der Anzahl der Zahlungsintervalle multipliziert.

**Aufbau und Verhalten der Preistabelle**

In der Standardansicht zeigt die Tabelle die Preise zum Zeitpunkt der Vertragserstellung. Wird eine Langzeitverlängerung durchgeführt, wird die Historientabelle aktualisiert: Die jeweils letzte Preisänderung steht in der zweiten Spalte, in den weiteren Spalten folgen die früheren Preise. Die erste Spalte enthält die Kategorien bzw. Preisbestandteile. Die Spaltenüberschrift eines Ereignisses enthält den Namen des Ereignisses und das Datum der Anwendung, zum Beispiel „Calculation Sales (29.05.2025)". Die Reihenfolge der Preisversionen reicht vom neuesten zum ältesten Preis. Gibt es mehrere Preisversionen, sind die ersten beiden Spalten (Kategorie und Preisbestandteil) fixiert, und die übrigen Spalten lassen sich horizontal scrollen. Bei nur einer Preisversion wird die Spalte nicht in voller Breite dargestellt.

Eine Vertragsänderung, die die Preisbestandteile nicht verändert, wird nicht in die Tabelle aufgenommen. Das betrifft Änderungen, bei denen die aktuellen Preise unverändert bleiben und keine Preisbestandteile hinzukommen oder entfallen.

Die Tabelle enthält die Spalten Kategorie und Preisbestandteil sowie je Ereignis eine Spalte, die in zwei Unterspalten den Intervallpreis und den Gesamtpreis ausweist.

**Kategorie „Technischer Tarif"**

Diese Kategorie enthält den Basispreis, der immer angezeigt wird und dessen Bezeichnung statisch ist. Dazu kommen die Produktoptionen. Hier setzt sich die Bezeichnung aus dem festen Text und dem Namen der Option zusammen, zum Beispiel „Product Option: Car Wash". Jede dem Vertrag hinzugefügte Produktoption ist sichtbar. Sind keine Produktoptionen vorhanden, erscheint nur der Eintrag „Product Option: -". Wird eine Produktoption erst bei einer Vertragsänderung hinzugefügt, erscheint sie in der Tabelle, und für die ursprüngliche Preisberechnung wird als Intervall- und Gesamtpreis ein Strich „-" angezeigt. Technische Optionen funktionieren genauso, etwa „Technical Option: Ceramic Breaks", bzw. „Technical Option: -", wenn keine vorhanden sind. Der Branchenfaktor wird als „Industry Factor" mit dem Namen des Faktors dargestellt, zum Beispiel „Industry Factor: Taxi". Der Inflationsfaktor erscheint als „Inflation Factor" mit dem Wert, zum Beispiel „Inflation: 5%". Beide Zeilen werden immer angezeigt; ohne Wert steht für Intervall- und Gesamtpreis ein Strich.

**Kategorie „Gebühren und Faktoren"**

Diese Kategorie umfasst die Zeilen „Sales Commission", „Administration Fee" und „Payment Markup" mit jeweils statischer Bezeichnung. Sie werden immer angezeigt und enthalten für Intervall- und Gesamtpreis jeweils den Nettowert oder, falls kein Wert vorhanden ist, einen Strich.

**Kategorie „Rabatte"**

Für Kampagnen wird der Rabattwert je Intervall und gesamt ausgewiesen. Die Bezeichnung besteht aus dem festen Text und dem Kampagnennamen, zum Beispiel „Campaign: Campaign1". Werden mehrere Kampagnen angewendet, erscheint jede in einer eigenen Zeile. Ist keine Kampagne angewendet, wird nur „Campaign: -" angezeigt. Kampagnen, die erst bei einer Vertragsänderung hinzukommen, werden in die Tabelle aufgenommen; für die ursprüngliche Preisberechnung steht dort ein Strich. Die Zeilen „Dealer Discount" und „Special Case Discount" werden immer angezeigt, mit einem Strich bei fehlendem Wert.

**Kategorie „Endpreise für Kunden"**

Diese Kategorie wird immer vollständig angezeigt. „Net Total" enthält den Gesamtnettowert der Preisbestandteile in der Tabelle, also Optionen, Gebühren und angewendete Rabatte. „Tax" weist den auf den Nettogesamtwert angewendeten Steuerbetrag je Intervall und gesamt aus, wobei der Steuersatz in der Bezeichnung steht, zum Beispiel „Tax: 19%". „Gross Total" zeigt den Bruttowert des Endpreises.

**Tabelle Preis pro Kilometer**

Unterhalb der Preisbestandteil-Tabelle zeigt eine weitere Tabelle für jede Preisversion den Netto- und Bruttowert pro Kilometer für Minderkilometer und Mehrkilometer.

**Sichtbarkeit nach Rolle**

Benutzer mit den Rollen MO und MPC sehen die gesamten Daten beider Tabellen. Benutzer mit Händlerrollen sehen nur den unteren Teil der Preisbestandteil-Tabelle, nämlich die Kategorien „Rabatte" und „Endpreise für Kunden", sowie die Tabelle mit dem Preis pro Kilometer.

Die Gestaltung muss den Vorgaben des Mercedes-Benz Workbench entsprechen.