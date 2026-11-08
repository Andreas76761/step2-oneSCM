# Batch 1228 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Produktverwaltung in der Vertragskalkulation**

Beim Anlegen eines Produkts stehen Ihnen mehrere Möglichkeiten zur Verfügung. Sie können den Vorgang abbrechen oder das Produkt als Entwurf speichern. Wenn Sie ein Produkt als Entwurf speichern, zurückgehen und anschließend abbrechen, bleibt das Produkt erhalten und erhält den Status „Draft". Auch bei fehlerhaften oder unvollständigen Eingaben in den einzelnen Schritten der Produktanlage wird das Verhalten des Systems berücksichtigt und geprüft.

Bestehende Produkte können Sie in den Status-Ausprägungen Draft, Created, Ready und Deactivated bearbeiten. Ob Ihre Änderungen an den Produktdaten gespeichert werden, richtet sich nach dem jeweiligen Status des Produkts. Wenn Sie ein Produkt löschen, erscheint es anschließend nicht mehr in der Produkttabelle.

**Automatischer Wechsel in den Status „Ready"**

Produkte wechseln automatisch in den Status „Ready", sobald die Mindestanforderungen erfüllt sind. Dadurch können Sie ein Produkt veröffentlichen, nachdem Sie alle benötigten Preise konfiguriert haben. Voraussetzung ist, dass im Produkt mindestens eine Preisgültigkeit angelegt wurde. Zusätzlich muss mindestens eine dieser Preisgültigkeiten einen Preiscluster enthalten, in dem wiederum mindestens ein Preispunkt definiert ist. Sind diese Bedingungen erfüllt, vergibt das System den Status „Ready" selbstständig.

**Produkte veröffentlichen**

Vor der Veröffentlichung eines Produkts prüft das System, ob das Produkt veröffentlicht werden kann. Außerdem ist vorgesehen, dass ein laufender Veröffentlichungsprozess abgebrochen werden kann.

**Preise zuweisen**

In der Produktübersicht steht das Symbol „Assigned price" zur Verfügung. Ist für ein Produkt keine Preisgültigkeit aktiv, wird das Symbol im „Ghost"-Zustand angezeigt. Sowohl über das Symbol „Assign price" als auch über die entsprechende Aktionsschaltfläche gelangen Sie direkt zur Preisversion.

**Produktübersicht: Suchen und Sortieren**

Die Produktübersicht zeigt die vorhandenen Produkte an. Sie können die Produkte aufsteigend oder absteigend sortieren. Außerdem können Sie gezielt nach Produkten suchen, entweder direkt über die Suche oder über die erweiterten Filteroptionen („More filter"). In beiden Fällen werden die passenden Produkte korrekt dargestellt.

**Technische Grundlage: Elastic Search**

Für eine schnelle und effiziente Aufbereitung und Darstellung von Daten in der Benutzeroberfläche wird in oneSCM eine Elastic-Search-Instanz eingesetzt. Sie speichert die DTOs, die in der oneSCM-Oberfläche verwendet werden, und unterstützt das Suchen, Sortieren, Blättern (Pagination) und Filtern. Die Daten in Elastic Search werden regelmäßig mit den Daten aus der Datenbank des jeweiligen Systems aktualisiert.