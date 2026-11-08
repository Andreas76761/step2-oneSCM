# Batch 1179 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation: Neuerungen und Korrekturen**

**Inflationsaufschlag in Marktkonfiguration und Preisversionen**

Neu eingeführt wurde der Inflationsaufschlag als zusätzliche Preiskomponente. Er deckt das Risiko inflationsbedingter Kostensteigerungen über die Laufzeit eines Vertrags ab. Dazu wendet das System geschätzte künftige Inflationsraten automatisch auf die Vertragspreise an, sodass inflationsgeschützte Preise berechnet werden. Die Funktion richtet sich an die Rolle MPC.

In den Markteinstellungen pflegen Anwender die Inflationsraten für das jeweilige Jahr in einer Tabelle. Aus diesen Angaben berechnet das System anhand einer hinterlegten Formel den Inflationsfaktor. Erlaubt sind Werte mit zwei Nachkommastellen, die Inflationsrate wird in Prozent angegeben. Es lassen sich das aktuelle und das kommende Jahr hinzufügen, und ein kommendes Jahr kann wieder gelöscht werden. Bereits vergangene Jahre werden ausgegraut und können nicht mehr geändert werden. Wird ein Wert des laufenden Jahres bearbeitet, zeigt das System einen Hinweis mit doppelter Bestätigung an, dass eine Preisversion betroffen sein kann. Eine Änderung wirkt sich nicht auf die aktive Preisversion aus, sondern nur auf kommende Preisversionen.

Beim Anlegen einer Preisversion können Anwender den Inflationsaufschlag per Auswahl aktivieren oder deaktivieren. Ist er aktiviert, übernimmt das System die Inflationsdaten aus der Marktkonfiguration und zeigt die vollständige Tabelle der je Produkt angewendeten Inflationsraten an. Ist er deaktiviert, werden diese Daten nicht angezeigt. Anwender wählen außerdem, die Inflationsraten welchen Jahres angewendet werden sollen. Ist für das gewählte Jahr keine Inflation hinterlegt, erscheint die Fehlermeldung „No Inflation Factor for Selected Year. Please set in Market Configuration“. Die Inflationsmatrix richtet sich nach dem Start der Laufzeit der Preisversion und den Laufzeiten der Produkt-Preismatrix in Monaten. Das System interpoliert dabei zwischen den Laufzeiten aus den Markteinstellungen und denen der Preisversion bzw. des Produkts. Die Inflation einer Preisversion kann innerhalb der Preisversion nicht bearbeitet werden. Wird eine Preisversion dupliziert, übernimmt das System die jeweils aktuellste Einstellung aus der ursprünglichen Preisversion.

Bei der Konfiguration optionaler Deckungen können Anwender den Inflationsfaktor von der Preisberechnung ausschließen, genauso wie bei den übrigen Ausschlussoptionen.

Bei der Preisermittlung multipliziert das System den Gesamtpreis des Fahrzeugs mit dem Inflationsfaktor. Der Inflationsfaktor wird zudem in den Payload aufgenommen, der immer dann aktualisiert wird, wenn eine neue Preiskomponente oder ein preisrelevanter Faktor zu einem Produkt hinzukommt. Die Preisversion wird im Frontend als mehrstufiger Assistent (Step-Wizard) geführt.

**Behobene Fehler**

Behoben wurde ein Fehler im Frontend, bei dem für technische Optionen keine Dezimalstellen eingegeben werden konnten und die Anfrage nicht gelesen werden konnte. Ebenfalls korrigiert wurde ein Problem in der Vertragserstellung, bei dem für die Modellreihe 243 keine Produkte angezeigt wurden.

**Dokumentation und technische Änderungen**

Für die Programmierschnittstellen, insbesondere die Edge-APIs, wurde eine umfassende Dokumentation erstellt und geprüft. Sie behandelt auch Fehlercodes und Beispielanfragen. Zudem wurde eine Änderung am Artifactory vorgenommen, für die in den vorliegenden Daten keine weiteren Details genannt sind.

Die geplante Erweiterung der Deckungen um Lieferanteninformationen und ein Kennzeichen „Non-Vega“ je Deckung wurde nicht umgesetzt, da sie abgebrochen wurde.