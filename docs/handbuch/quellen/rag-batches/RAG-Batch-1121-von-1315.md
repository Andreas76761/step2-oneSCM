# Batch 1121 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mehrsprachige Inhalte für kundenrelevante Angaben in Kampagnen**

In Märkten mit mehreren Amtssprachen, etwa der Schweiz, müssen Inhalte, die Kundinnen und Kunden sehen, in der passenden Sprache vorliegen. Dazu gehören Produktnamen, Produktbeschreibungen, Kampagnennamen und die Verkaufsbeschreibungen von Kampagnen. Diese Angaben werden Anwendern angezeigt und können in erzeugte Verträge und Verkaufsunterlagen einfließen. Fehlen Übersetzungen oder sind sie fehlerhaft, erhalten Kunden unter Umständen Informationen in der falschen Sprache. Mit der Funktion können dasselbe Produkt und dieselbe Kampagne in mehreren marktspezifischen Sprachen gepflegt werden, zum Beispiel Deutsch, Französisch oder Italienisch. Vorgesehen ist sie für die Anwender, die Produkte anlegen. Bisher werden kundenrelevante Angaben nicht in mehrere Sprachen übersetzt.

**Sprachen in den Markteinstellungen**

In den Markteinstellungen werden pro Markt mehrere Sprachen festgelegt, wobei genau eine Sprache als Standardsprache gilt. Das Produkt liest diese Sprachen und die Standardsprache aus den Markteinstellungen aus. Beim Anlegen oder Bearbeiten einer Kampagne sehen Anwender dann für jede aktive Sprache einen eigenen Reiter und erkennen die Standardsprache. Die Standardsprache darf nicht gelöscht oder aufgehoben werden, ohne dass eine neue Standardsprache bestimmt wird, sodass stets mindestens eine gültige Standardsprache vorhanden ist.

**Pflege der Inhalte je Sprache**

Nur die Standardsprache ist verpflichtend, alle anderen Sprachen sind optional. Eine Kampagne oder ein Produkt kann nur gespeichert werden, wenn die Pflichtfelder im Reiter der Standardsprache vollständig ausgefüllt sind. Pflichtfeld ist der Kampagnenname (bzw. beim Produkt der Produktname), die Verkaufsbeschreibung ist optional.

Für jeden Reiter einer Nicht-Standardsprache wählen Anwender aktiv, ob die Werte der Standardsprache übernommen werden („Apply default language values to this language“) oder ob abweichende Werte erfasst werden („Add different values for Languages selected“). Bei abweichenden Werten müssen vor dem Speichern alle Pflichtfelder dieser Sprache ausgefüllt sein. Wechselt man von abweichenden Werten zurück zur Übernahme der Standardwerte, wird der zuvor eingegebene, nun ausgeblendete Text beim Speichern verworfen, sodass kein Entwurfstext in der Datenbank verbleibt. Die Kampagnenzusammenfassung spiegelt die Änderungen wider. Dort können Anwender auf eine Sprache klicken und sehen nur die Parameter, die von der Sprache betroffen sind.

**Änderungen an den Sprachen im Markt**

Wird in den Markteinstellungen eine neue Nicht-Standardsprache hinzugefügt, weist ein Hinweistext darauf hin, dass auch das Produkt angepasst werden muss. Jedes Produkt erhält dann automatisch einen zusätzlichen Reiter für die neue Sprache, der zunächst auf die Übernahme der Standardwerte eingestellt ist. Bereits vorhandene Sprachdaten bleiben unverändert.

Wird eine Nicht-Standardsprache aus den Markteinstellungen gelöscht, wird sie vom System nur „weich“ gelöscht. Ihre Daten bleiben für eine mögliche Wiederherstellung in der Datenbank erhalten, sie werden aber nicht mehr an die Vertragserzeugung übermittelt. Wird die Sprache später wiederhergestellt, aktualisiert das System das Produkt mit den gespeicherten Daten, und die Sprache wird wieder übermittelt.

**Übergabe an die Vertragserzeugung**

Beim Veröffentlichen eines Produkts oder einer Kampagne wird ein Datenpaket (JSON) erzeugt, in dem die Inhalte nach Sprachcode getrennt und gekennzeichnet sind. So kann die Vertragserzeugung die gewünschte Sprache auswählen und anzeigen. Das Produkt stellt dabei sicher, dass immer mindestens eine Sprache vorhanden ist.

Die Vertragserstellung wird nie blockiert, weil Übersetzungen fehlen. Fehlt die angeforderte Kundensprache, verwendet das System als Rückfallebene die Werte der Standardsprache. Ändert sich die Standardsprache eines Marktes, etwa von Deutsch auf Englisch, und liegt noch keine englische Übersetzung vor, kopiert das System die Daten aus der zuletzt gültigen Standardkonfiguration (hier Deutsch) in die neue Standardsprache. Damit werden leere Datenpakete vermieden. Dahinter steht die Abwägung, dass eine falsche Sprache besser ist als gar kein Produkt.