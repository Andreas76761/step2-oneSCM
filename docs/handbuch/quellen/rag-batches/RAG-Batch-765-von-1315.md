# Batch 765 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsanpassung: Verkürzung von Laufzeit und Fahrleistung**

Mit der Funktion „Vertragsanpassung" (Contract Adaptation) erweitert oneSCM die bisherige Langzeitverlängerung um die Möglichkeit, die Laufzeit und/oder die Gesamtfahrleistung eines Vertrags zu reduzieren. Der bisherige Prozess „Langzeitverlängerung" wird dafür in „Vertragsanpassung" umbenannt und unterstützt künftig sowohl die Verlängerung als auch die Verkürzung eines Vertrags. Damit können berechtigte Benutzer Vertragsparameter anpassen, wenn sich geschäftliche Anforderungen ändern, ohne dass dabei vertragliche, finanzielle oder operative Inkonsistenzen entstehen. Die Funktion befindet sich derzeit noch in Entwicklung.

**Voraussetzungen**

Die Vertragsanpassung steht nur für Verträge aus dem Vertriebskanal Leasing (MBLD) zur Verfügung und nur für Produkte, die in ihrer Konfiguration ausdrücklich eine Verkürzung von Laufzeit und/oder Fahrleistung unterstützen. Dafür erhält die Produktkonfiguration einen neuen Parameter. Zusätzlich muss der Vertrag den Status „Aktiv" haben, und es darf keine andere Vertragsaktion in Bearbeitung sein. Bereits hinzugefügte optionale Zusatzleistungen können nicht entfernt werden. Die Funktion ist für alle Märkte verfügbar. Vertragserstellung und Aktivierung bleiben unverändert; bei der Vertragserstellung wird lediglich der neue Produktparameter berücksichtigt. Sind die Voraussetzungen nicht erfüllt, etwa bei Verträgen anderer Vertriebskanäle oder bei Produkten ohne Unterstützung der Verkürzung, steht die Verkürzungsfunktion nicht zur Verfügung. Auch vollständig im Voraus bezahlte Verträge (Einmalzahlung, auch bei vorzeitiger Abrechnung) können nicht verkürzt werden; in diesem Fall ist die Vertragsanpassung im Aktionsmenü nicht auswählbar.

**Regeln für Laufzeit und Fahrleistung**

Das neue Vertragsende darf nicht in der Vergangenheit liegen. Die neue Gesamtlaufzeit muss kürzer sein als die bisherige. Sie kann jedoch unverändert bleiben, wenn gleichzeitig die Gesamtfahrleistung reduziert wird. Auch Mischfälle sind möglich, beispielsweise eine verlängerte Laufzeit bei reduzierter Gesamtfahrleistung. Eine Verkürzung kann ausschließlich noch nicht bezahlte, zukünftige Zeiträume betreffen. Bei vierteljährlicher Zahlung und sieben Quartalen insgesamt, von denen drei bezahlt sind, kann die Verkürzung somit erst ab dem vierten Quartal wirken.

Die neue Gesamtfahrleistung muss niedriger sein als die aktuell geplante Vertragsfahrleistung, darf aber bei gleichzeitiger Laufzeitverkürzung auch unverändert bleiben. Ebenso sind Mischfälle mit erhöhter Fahrleistung bei verkürzter Laufzeit möglich. Die neue Gesamtfahrleistung muss außerdem über dem zuletzt erfassten Kilometerstand des Fahrzeugs liegen. Beträgt dieser beispielsweise 45.000 km und die geplante Fahrleistung 100.000 km, wird eine Reduzierung auf 80.000 km akzeptiert, eine Reduzierung auf 40.000 km dagegen abgelehnt und mit einer entsprechenden Meldung quittiert. Zu beachten ist, dass dabei das Risiko besteht, dass der letzte bekannte Kilometerstand nicht verfügbar oder veraltet ist.

Aus finanzieller Sicht dürfen durch eine Anpassung keine negativen Kundenzahlungen, keine negativen Vertragswerte und keine negativen Rechnungsbeträge entstehen. Würde sich durch die Neuberechnung eine negative Kundenrate ergeben, wird die Rate auf 0 gesetzt.

**Ablauf in der oneSCM-Oberfläche**

Sind alle Voraussetzungen erfüllt, wird im Aktionsmenü der Eintrag „Langzeitverlängerung" als „Contract Adaptation" angezeigt. Nach dem Aufruf werden zunächst die passenden Gültigkeitsdaten und Preise abgerufen. Anschließend kann der Benutzer eine neue Laufzeit und eine neue Fahrleistung auswählen. Zur Auswahl stehen nur die jeweils möglichen Optionen für Verkürzung und/oder Verlängerung. Der Vorher-Nachher-Vergleich des Vertrags funktioniert wie bei der Langzeitverlängerung und wird mit den entsprechenden Werten befüllt. Eine Unterschrift entfällt, da ausschließlich der Vertriebskanal Leasing unterstützt wird. Die Änderungen werden auf Vertragsebene übernommen und die Vertragsdaten in der Oberfläche aktualisiert. Im Preis-Tab wird eine zusätzliche Spalte mit den relevanten Informationen ergänzt, die beim Aufruf der Vertragsdetailansicht sichtbar ist. Der angepasste Vertrag wird in die nächste erzeugte i155-Datei aufgenommen.

**Anpassung über die Schnittstelle (MBLD)**

Eine Vertragsanpassung kann auch über die API durch MBLD angestoßen werden. Die Anfrage liefert nur die tatsächlich möglichen Optionen für eine Verkürzung von Laufzeit und/oder Fahrleistung zurück. Der Prozess arbeitet wie die Langzeitverlängerung, erlaubt aber zusätzlich die Reduzierung der ursprünglichen Fahrleistung und/oder Laufzeit. Unterschrift und Dokumente entfallen. Die Änderungen werden auf Vertragsebene übernommen, die Vertragsdaten in der Oberfläche aktualisiert, der Preis-Tab um eine Spalte ergänzt und der Vertrag in die nächste i155-Datei aufgenommen.

**Zusammenspiel mit bisherigen Verlängerungen und mehreren Anpassungen**

Verträge, die zuvor per Langzeitverlängerung verlängert wurden, können weiterhin verkürzt werden. Auch mehrere Anpassungen nacheinander sind möglich. Jede Anpassung, auch eine Verkürzung nach einer Verlängerung oder eine Verlängerung nach einer Verkürzung, wird auf Grundlage der jeweils aktuellen Vertragswerte berechnet. Der Vertrag bleibt dabei gültig. Alle früheren Anpassungen bleiben in der Vertragshistorie gespeichert und nachvollziehbar. Bereits vorhandene Kurzzeit- und Langzeitverlängerungen bleiben unverändert bestehen; zusätzlich wird ein neuer Anpassungseintrag angelegt.

Hinweis: Ob eine Verkürzung nach einer Kurzzeit- oder Langzeitverlängerung stets die aktuellen Vertragswerte verwendet, ist laut Vorlage noch zu klären.