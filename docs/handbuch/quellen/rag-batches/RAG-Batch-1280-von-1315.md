# Batch 1280 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 28 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Behobene Fehler und Verbesserungen**

In diesem Release wurden zahlreiche Fehler im Bereich Contract Calculation behoben, die vor allem die Produktverwaltung, die Preisversionen und die Vertragserstellung betreffen.

**Produktverwaltung und Produktassistent**

Beim Bearbeiten eines bestehenden Produkts zeigte die Bestätigungsmeldung nach dem Speichern teilweise den Namen des Namensparameters statt des tatsächlichen Produktnamens an. Auch nach der Änderung des Produktnamens erschien in der Meldung noch der alte Name. Beides wurde korrigiert, sodass nun der aktuelle Produktname angezeigt wird. Im Produktassistenten blieb zudem die Schaltfläche „Weiter" im Schritt „Zahlungsperioden" deaktiviert, wenn man einen Schritt zurückging und anschließend erneut vorwärts navigierte. Dieses Verhalten wurde behoben.

Beim Aktualisieren eines Entwurfsprodukts konnte der letzte Schritt im Ladezustand hängen bleiben. Dabei erschienen widersprüchliche Meldungen: eine Erfolgsmeldung zur Produkterstellung und zugleich eine Fehlermeldung, dass nicht alle Schritte ausgefüllt seien. Nun lässt sich das Produkt abschließen und in den Status „Erstellt" überführen. Außerdem wurde die Löschung von Entwurfsprodukten im Backend überarbeitet.

Beim Hochladen von Produktbildern trat zuvor ein Fehler „Access Denied" auf. Ein weiteres Problem betraf das Produktbild bei einem veröffentlichten Produkt: Das Bild wurde nach dem Speichern und Abbrechen weder auf der Seite „Basisinformationen" noch in der Produktzusammenfassung angezeigt. Das Vorschaubild bleibt nun erhalten und ist in beiden Ansichten sichtbar. Zusätzlich wurde die Anzeige des Dateinamens bei Dokumenten auf das vorherige Verhalten zurückgesetzt.

**Fahrzeugvoraussetzungen**

Im Reiter „Fahrzeugvoraussetzungen" wurden Werte im Feld für das maximale Fahrzeugalter bei Vertragsbeginn (in Monaten) falsch übernommen. So wurde beispielsweise aus der Eingabe 36 der Wert 63. Die Eingabe bleibt nun unverändert.

**Produktübersicht und Filter**

Die Antwortzeit beim Laden der Filterkriterien auf der Produktseite wurde verbessert. Außerdem schlugen die erweiterten Filter nach Status und zugewiesenen Preisen mit einer technischen Fehlermeldung fehl. Auch dies ist behoben. Zudem blieben die Filterkriterien nicht mehr korrekt erhalten, wenn zwischen den Seiten der Produktübersicht navigiert wurde. Dieses Verhalten wurde angepasst.

**Preise, Preisversionen und Cluster**

Beim Anlegen einer Preisversion war der Datumsauswähler für das Startdatum blockiert, sodass keine Termine in kommenden Monaten gewählt werden konnten. Dies wurde korrigiert. Auch das Erstellen einer Preisversion in der Preisversionsübersicht löste zuvor einen Fehler aus. In der Cluster-Übersicht der Preise war die Schaltfläche „Speichern" beim Bearbeiten eines Clusters, sowohl für zukünftige als auch für die aktuelle Preisversion, deaktiviert. Sie ist nun aktiv. Für die Felder des Relative-Base-Price-Clusters wurden einige Anpassungen vorgenommen. Außerdem wird der Schalter für den Relative-Base-Price-Cluster beim Duplizieren des ersten Clusters nun korrekt angezeigt. Ein Benutzer mit der Rolle MPC konnte zudem die Preise eines Produkts nicht einsehen. Diese Berechtigung wurde korrigiert.

**Kampagnen**

Beim Anlegen einer Kampagne im Einrichtungsschritt wird der Fall behandelt, dass das Startdatum nach dem Enddatum liegt.

**Vertragserstellung**

Die Vertragserstellung war in bestimmten Fällen blockiert, und bei der Vertragsgenerierung trat ein unerwarteter Fehler (Error 500) auf. Beides wurde behoben. In der Produktauswahl der Vertragsgenerierung wurde außerdem ein berechtigtes Produkt doppelt aufgeführt. Es erscheint nun nur noch einmal.