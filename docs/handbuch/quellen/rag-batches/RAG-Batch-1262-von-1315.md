# Batch 1262 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation: Änderungen und Hinweise**

In der Preisberechnung wurde die Reihenfolge der Rechenschritte angepasst. Die monatliche Zahlungsgebühr wird nun erst nach der Händlerprovision und den optionalen Deckungen hinzugerechnet. Zuvor wurde sie vor diesen Bestandteilen addiert. Damit ist sichergestellt, dass die Preisbestandteile für Händlerprovision und optionale Deckungen nicht von der monatlichen Gebühr beeinflusst werden.

Bei der Produktdefinition wurde eine fehlerhafte Anzeige in der Preismatrix-Definition korrigiert. Der angezeigte Wert für die maximale Fahrzeugkilometerleistung bei Vertragsende war zuvor nicht korrekt und konnte zu Verwirrung führen. Das Risiko bestand darin, dass Produkte mit einer zu kleinen Preismatrix angelegt wurden. Die tatsächliche Obergrenze ergibt sich aus der kürzesten Laufzeit in Jahren (beispielsweise 24 Monate entsprechen 2 Jahren), multipliziert mit der maximalen jährlichen Kilometerleistung. Bei 2 Jahren und 40.000 km sind das 80.000 km. Als kurzfristige Lösung wird nun dieser korrekte Wert angezeigt. Für die Zukunft wird vorgeschlagen, die Erzeugung der Preismatrix zu ändern: Die maximale Jahreskilometerleistung soll standardmäßig für alle Laufzeiten gelten, ergänzt um eine optionale, explizit festlegbare Obergrenze für die Gesamtfahrleistung des Fahrzeugs, die die Preismatrix begrenzt.

Weitere Anpassungen und Anforderungen betrafen die Produktdefinition und die Produktvorlagen (Blueprints). Folgende Punkte wurden bearbeitet und abgeschlossen:

Beim Anlegen eines Produkts muss es möglich sein, sowohl bei den anwendbaren Rabatten als auch bei den erlaubten Vertragsänderungen alle Optionen abzuwählen. Es kann Produkte geben, bei denen keine Rabatte oder gar keine Änderungen zulässig sein sollen. Bei Vertriebsebene und Vertriebskanal bleibt die Fehlermeldung dagegen sinnvoll, da ein Produkt auf mindestens einer Ebene und in mindestens einem Kanal verfügbar sein muss.

Im Bereich der Fahrzeugvoraussetzungen wurde vorgeschlagen, Bezeichnungen zu ändern. Die Verträge „Compact“ und „Excellent“ sind fahrzeugbezogen und starten immer mit der Erstzulassung des Fahrzeugs bei einem Kilometerstand von 0. Eine Prüfung des Fahrzeugalters oder der Laufleistung zum Vertragsstart wäre daher wenig sinnvoll. Die Bezeichnungen „Vehicle Age Contract Start“ und „Vehicle Mileage & Contract Start“ sollen in „Vehicle Age at Contract Sales“ bzw. „Vehicle Mileage at Contract Sales“ umbenannt werden. Dies entspricht auch der Funktionsweise, da die Grenzen Alter und Laufleistung zum Zeitpunkt des Vertragsverkaufs prüfen.

Für die Übersichtsseite der Produktvorlagen wurde angeregt, eine Such- und Filterleiste zu ergänzen. Sie ist die einzige Übersichtsseite ohne diese Funktion. Mit Blick auf eine möglicherweise größere Anzahl von Vorlagen, etwa für Pkw und Transporter, privat und gewerblich, Standalone, Leasing und Reifen, soll die Leiste für Konsistenz sorgen und künftig für alle Übersichtsseiten Standard sein. Vorgesehene Kriterien sind der Vorlagenname (Suche), der Geschäftsbereich (Filter), die Produktlinie (Filter) und der VEGA-Vertragstyp (Suche).

Ein Fehlverhalten bei der Erstellung von Produktvorlagen wurde ebenfalls gemeldet: Wird zunächst der Geschäftsbereich Pkw gewählt und es werden Pkw-Deckungscodes ausgewählt, und wechselt man anschließend zurück und stellt den Geschäftsbereich auf Transporter um, bleiben die zuvor gewählten Pkw-Deckungscodes ausgewählt. Dadurch ließ sich eine Transporter-Vorlage mit Pkw-Deckungscodes anlegen.

Bei der Preisfindung wurde ein Fehler gemeldet: Legt man innerhalb eines Preiscluster eine neue Fahrzeuggruppe an und kehrt danach zum Preiscluster zurück, ist die zuvor manuell befüllte Preismatrix leer, und die bereits eingetragenen Preise gehen verloren.

Für die Optionspreise wurde die Frage aufgeworfen, ob für optionale Deckungen die Kostendefinition „Total Amount“ (Gesamtbetrag) benötigt wird. Aktuell lässt sich diese nicht auswählen, sodass Preise in der Preismatrix immer auf einen Monat oder ein Jahr bezogen sind. Bei einer Option wie 24 Monate/10.000 km müsste daher der halbe Gesamtpreis eingetragen werden.

Beim Bearbeiten der Deckungen im Produktanlageprozess wurde beobachtet, dass eine optionale Deckung, die auf „Always included“ gesetzt wurde, nach erneutem Öffnen des Dialogs „Edit Coverages“ nicht mehr aus den Basisdeckungen entfernt werden kann. Es wurde nachgefragt, ob dieses Verhalten beabsichtigt ist.

Folgende Punkte wurden als Fragen oder Beobachtungen erfasst und nicht umgesetzt (Status: abgebrochen):

Wird ein Deckungscode aus einer Produktvorlage entfernt, bleibt er in bereits auf Basis dieser Vorlage erstellten Produkten verfügbar und ist im dritten Schritt des Bearbeitungsablaufs weiterhin sichtbar und editierbar, etwa hinsichtlich „Always Included“. Dasselbe gilt für hinzugefügte Deckungscodes. Offen blieb, ob eine aktualisierte Vorlage auch die darauf basierenden Produkte aktualisieren soll, da sonst neue Produktoptionen die Erstellung eines neuen Produkts samt Preisgestaltung erfordern würden.

Wird ein Deckungscode deaktiviert, bleibt er in Produktvorlagen und darauf basierenden Produkten enthalten. Im Dropdown der Basisdeckungen ist er zwar nicht mehr auswählbar, kann aber aus der Vorlage nicht entfernt werden, da die Auswahl dort nicht änderbar ist. Der Umgang mit solchen Fällen wurde als offene Frage festgehalten.

Beim Bearbeiten eines bestehenden Deckungscodes kann die Deckungskategorie geändert werden, nicht aber der Deckungscode samt Präfix (zum Beispiel „P“). Wird die Kategorie etwa von Basis auf optional umgestellt, der Code beginnt aber weiter mit „P“, kommt es im Prozess zu einem Fehler.