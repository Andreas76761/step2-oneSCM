# Batch 1128 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mehrsprachige Inhalte für kundenrelevante Produktdaten**

In Märkten mit mehreren Amtssprachen, etwa der Schweiz mit Deutsch, Französisch und Italienisch, müssen kundenrelevante Inhalte in der passenden Sprache angezeigt werden. Produktnamen und Produktbeschreibungen werden Kundinnen und Kunden angezeigt und können in erzeugte Verträge und Verkaufsunterlagen übernommen werden. Fehlen Übersetzungen oder sind sie fehlerhaft, erhalten Kunden Informationen möglicherweise in der falschen Sprache. Die Funktion ermöglicht es daher, dasselbe Produkt mit Inhalten in Deutsch, Französisch, Italienisch oder weiteren marktspezifischen Sprachen zu pflegen. Sie richtet sich an Market Product Creators (MPC), die Produkte anlegen. Bisher konnten kundenrelevante Inhalte nicht in mehreren Sprachen hinterlegt werden.

**Sprachen im Markt festlegen**

In den Markteinstellungen werden pro Markt mehrere Sprachen definiert, wobei genau eine Sprache als Standardsprache gekennzeichnet wird. Das Produkt liest diese Sprachen und die Standardsprache aus den Markteinstellungen aus. Beim Anlegen und Bearbeiten eines Produkts sieht der Benutzer für jede Sprache einen eigenen Reiter und erkennt dort die Standardsprache.

**Pflege der Inhalte im Produkt**

Auf dem Reiter der Standardsprache sind die Felder „Product Name" und „Product Description" Pflichtfelder, erkennbar am blauen Sternchen. Ein Hinweis informiert darüber, dass dies die für den Markt definierte Standardsprache ist. Auswahlfelder für einen Sprachfallback werden dort nicht angezeigt. Das Feld „Additional Information" ist optional.

Auf den Reitern der übrigen Sprachen ist standardmäßig die Option „Apply default language values to this language" gewählt; die Eingabefelder sind dann ausgeblendet, und die Werte der Standardsprache werden verwendet. Wählt der Benutzer stattdessen „Add different values to this language", erscheinen die Felder „Product Name" und „Product Description" als Pflichtfelder. Sie müssen vollständig ausgefüllt sein, bevor gespeichert werden kann. Fehlt ein Wert, erscheint unter dem betroffenen Feld eine Fehlermeldung, zum Beispiel „Product Name is required" oder „Product Description is required". Der Benutzer muss die einzelnen Sprachreiter aktiv aufrufen und die Optionen bewusst auswählen.

Wechselt der Benutzer auf einem Reiter von „Add different values" zurück zu „Apply default language values", wird der zuvor eingegebene Text verworfen. Wählt er später erneut „Add different values", ist das Feld leer. Die Auswahl wird beim Speichern übernommen.

**Zusammenfassung und Übergabe an die Vertragserstellung**

Änderungen und Sprachen werden in der Produktzusammenfassung (Schritt 5) abgebildet. Dort kann der Benutzer auf eine Sprache klicken und sieht nur die Parameter, die von der Sprache betroffen sind. Die Daten werden getrennt nach Sprache übermittelt, sodass die Vertragserstellung die gewünschte Sprachversion abrufen und anzeigen kann.

**Allgemeine Regeln**

Jeder Markt hat genau eine Standardsprache. Nur diese ist verpflichtend, alle weiteren Sprachen sind optional. Fehlt eine Übersetzung, verwendet das System die Standardsprache als Rückfalllösung. Die Vertragserstellung darf nie blockiert werden, weil Übersetzungen fehlen. Das Produkt muss außerdem sicherstellen, dass stets mindestens eine Sprache vorhanden ist.

**Änderungen der Sprachen in den Markteinstellungen**

Wird eine nicht standardmäßige Sprache in den Markteinstellungen gelöscht, wird sie vom System per Soft Delete entfernt. Das Produkt sendet diese Sprache dann nicht mehr an die Vertragserstellung, die Sprachdaten bleiben aber in der Datenbank erhalten, damit sie wiederhergestellt werden können. Der entsprechende Sprachreiter ist nach dem Aktualisieren der Seite nicht mehr sichtbar. Wird die Sprache wiederhergestellt, aktualisiert das System das Produkt mit den gespeicherten Daten, und das Produkt sendet die Sprache wieder an die Vertragserstellung.

Fügt der Benutzer in den Markteinstellungen eine neue, nicht standardmäßige Sprache hinzu, weist ein Tooltip darauf hin, dass auch das Produkt angepasst werden muss. Jedes Produkt erhält dann einen zusätzlichen Reiter für die neue Sprache, während vorhandene Sprachdaten unverändert bleiben. Für die neue Sprache können die Werte automatisch erzeugt beziehungsweise die Werte der Standardsprache übernommen werden.

**Offener Sonderfall**

Ein Sonderfall ist noch zu klären: Wird die Standardsprache eines Marktes später gewechselt, zum Beispiel von Deutsch auf Englisch, und existieren für die neue Standardsprache keine Produktdaten, stellt sich die Frage, was die Vertragserstellung erhält. Diskutiert werden zwei Lösungen: eine automatische Migration, bei der die zuletzt bekannte Konfiguration (Deutsch) in die neue Sprache kopiert wird, was leere Produkte vermeidet und stabiles Verhalten ohne Risiko für die Vertragserstellung bietet, oder die Ausgabe der Fehlermeldung „No Language Configured for Product", wobei keine Inhalte an die Vertragserstellung übergeben würden.