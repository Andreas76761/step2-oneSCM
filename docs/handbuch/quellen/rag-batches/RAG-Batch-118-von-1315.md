# Batch 118 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Unterstützung marktspezifischer Übersetzungen für Schadencodes**

Bislang unterstützen Schadencodes nur eine einzige Übersetzung pro Sprache. Dieselbe deutsche Übersetzung gilt damit für alle Märkte, etwa für Deutschland, die Schweiz und Österreich. Deckungscodes und ISPs nutzen dagegen bereits die Kombination aus Markt und Sprache und erlauben unterschiedliche Übersetzungen je Markt. Dieses bewährte Vorgehen wird nun auch auf Schadencodes übertragen. Damit können Märkte Übersetzungen an ihren jeweiligen Kontext und ihre Sprachvariante anpassen, zum Beispiel Französisch in Frankreich im Unterschied zu Französisch in der Schweiz. Die Umsetzung befindet sich derzeit noch in Arbeit (Status: offen).

In der ersten Phase zeigt die Benutzeroberfläche Schadencodes künftig im Format Markt und Sprache an, einheitlich zu den Deckungscodes und ISPs. Benutzer können die Übersetzung eines hochgeladenen Schadencodes für eine bestimmte Kombination aus Markt und Sprache bearbeiten. Bisher ließen sich nur manuell angelegte Schadencodes ändern. Die Bearbeitung beschränkt sich auf den Übersetzungstext, der Wert des Schadencodes und die Division können nicht geändert werden. Existiert für eine Kombination aus Markt und Sprache keine eigene Übersetzung, wird die englische Übersetzung als Standard angezeigt.

Auch der Dateiupload wird erweitert. Das Hochladen der Schadencodedateien bleibt Aufgabe der Zentrale (HQ-Administratoren). Die Märkte pflegen ihre Übersetzungen selbst. Bisher werden beim Upload alle vorhandenen nicht manuell angelegten Schadencodes gelöscht und neu importiert, wodurch manuelle Änderungen der Märkte verloren gehen. Künftig gilt eine intelligente Aktualisierung:

Ist ein Schadencode in der hochgeladenen Datei nicht mehr enthalten und wurde nicht manuell angelegt, wird er gelöscht. Ist er in der Datei enthalten und wurde für einen bestimmten Markt manuell bearbeitet, bleibt die manuell geänderte Übersetzung erhalten. Wurde er nicht manuell bearbeitet, wird die Übersetzung aus der Datei übernommen. Ist ein Schadencode in der Datei neu, wird er mit der Übersetzung aus der Datei für alle Märkte hinzugefügt. Manuell bearbeitete Übersetzungen werden dafür vom System gekennzeichnet, damit sie beim nächsten Upload nicht überschrieben werden. Angesichts von mehr als 100.000 Schadencodes wäre eine manuelle Übersetzung je Markt ohne diese Logik nicht praktikabel.

Für eine zweite Phase sind marktspezifische Uploads vorgesehen. Eine Datei kann dann auf einen einzelnen Markt begrenzt werden, zum Beispiel nur für Deutschland, sodass ausschließlich die Übersetzungen dieses Marktes betroffen sind. Ebenso soll ein Massenupload übersetzter Schadencodes auf Marktebene möglich werden, etwa um britisches und amerikanisches Englisch zu unterscheiden.

**Hinweise zum aktuellen Stand**

Auf der Pre-Prod-Umgebung tritt derzeit ein Fehler auf: Beim Bearbeiten einer Schadencode-Übersetzung erscheint die Meldung „No damage code found for given damage code.“ Außerdem gilt für Beschreibungen derzeit eine Mindestlänge von 5 Zeichen. Diese soll in einer separaten Änderungsanforderung auf 2 Zeichen reduziert werden.

Zwei weitere Punkte im Bereich Revenue Management wurden abgebrochen und werden nicht umgesetzt. Sie betrafen die Erstellung eines Zahlungsplans bei Deckungen mit Kostenträger „Supplier“, die von VEGA ausgeschlossen sind, sowie ein fehlerhaft zugeordneter neuer Mapping-Typ für SMWT-MTNWT.