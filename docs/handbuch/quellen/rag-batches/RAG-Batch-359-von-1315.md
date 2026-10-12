# Batch 359 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Documents & Communications: Neuerungen im Template Management**

**Neuer Reiter „Reports" im Template Management (in Entwicklung)**

Das Template Management erhält einen neuen Reiter „Reports", mit dem sich Berichtsvorlagen für Partner, zum Beispiel Lieferanten, erstellen und pflegen lassen. Bisher sind die erzeugten Berichte fest im System hinterlegt und können von Anwendern der Märkte nicht angepasst werden. Künftig können MPC-Anwender die Berichtsfelder und die Formatierung an die Anforderungen einzelner Partner anpassen. Die Vorlagen lassen sich im Format .CSV und .XML erstellen und später zur Erzeugung unterschiedlicher Berichte verwenden, etwa von Umsatz- und Kostenberichten.

Der Reiter ist wie die übrigen Bereiche des Template Managements aufgebaut. Die Suche und die Filter bieten Berichtsname, Berichtstyp, Markt und Sprache; über „Weitere Filter" kann zusätzlich nach Status gefiltert werden. Die Ergebnistabelle zeigt Berichtsname, Berichtstyp, Sprache, letzte Änderung, Änderung durch, Status, Markt und Aktionen. Die Aktionen entsprechen denen der Dokumentvorlagen. Auch Löschen, Löschen mehrerer ausgewählter Vorlagen und die Suchfunktion stehen wie in den anderen Reitern zur Verfügung.

**Einrichtung und Gestaltung einer Berichtsvorlage**

Jeder Berichtsvorlage muss ein Berichtstyp zugewiesen werden. Da je nach Lieferant, sogar bei unterschiedlichen Deckungen desselben Lieferanten, eine andere Version eines Berichtstyps nötig sein kann, wird die Logik mit „Use Case" hier nicht verwendet. Auf der Lieferantenseite werden in den jeweiligen Berichtsbereichen später nur die Vorlagenversionen angezeigt, die zum passenden Berichtstyp gehören.

Im Kopfbereich der Vorlage sind alle Felder Pflichtfelder: Berichtsname, Markt, Berichtstyp und Sprache. Nach den Akzeptanzkriterien ist zudem „Valid From" anzugeben, und die Vorlage kann ohne die Pflichtfelder nicht gespeichert werden. Pflichtfelder lassen sich nicht entfernen.

Im Bereich „Report Design" legen Sie die Spalten fest. Der Spaltenname bildet die Überschrift der Spalte, der Spaltenwert enthält die dieser Überschrift zugeordnete Druckvariable. Mit der Schaltfläche „Add Column" fügen Sie einen neuen Eintrag mit Spaltenüberschrift und Spaltenwert hinzu. Die konfigurierten Spalten lassen sich per Umordnen in ihrer Reihenfolge ändern. „Preview" zeigt eine Vorschau der Vorlage. „Save as Draft" speichert die Vorlage, ohne sie nutzbar zu machen. „Publish" stellt die Version für die Lieferantenkonfiguration und die Berichtserzeugung bereit.

Im Editor stehen ausschließlich Druckvariablen zur Verfügung; Schleifen und Blöcke entfallen. Die bisherigen Druckvariablen aus den anderen Bereichen des Template Managements bleiben erhalten. Zusätzlich sind neue Gruppen von Druckvariablen für die Rechnungsstellung vorgesehen. Wie viele Gruppen es geben wird, wie sie heißen und welche Druckvariablen sie enthalten, ist noch offen.

**Bearbeiten, Klonen und Löschen**

Wie bei den Dokumentvorlagen kann eine Vorlage über „Erstellen" neu angelegt oder aus einer Standardvorlage geklont und anschließend bearbeitet werden. Vorlagen lassen sich ansehen und bearbeiten, und zwar derzeit jederzeit, sowohl im Status „Draft" als auch im Status „Published". Eine Vorlage im Status „Draft" kann gelöscht werden. Eine veröffentlichte Vorlage kann nur gelöscht werden, wenn sie nicht verwendet wird. Verwendete Vorlagen können nicht gelöscht werden; das System verhindert das Löschen und weist darauf hin.

Für jeden Berichtstyp werden Standardvorlagen bereitgestellt, die die verpflichtenden Überschriften samt Werten für einen Bericht enthalten.

**Weitere Änderungen (abgeschlossen)**

Behoben wurde ein Fehler, bei dem sich das Fenster mit der Liste möglicher Treffer nicht öffnete, wenn in oneErp Kundendaten zu mehreren Kunden vorlagen.

Außerdem wurde die Sprache von Fehlermeldungen auf Englisch umgestellt. Neu hinzugekommen sind Druckvariablen für Mehr- und Minderkilometer, jeweils ohne und mit Mehrwertsteuer.