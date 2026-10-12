# Batch 1278 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 86 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: Contract Calculation – Behobene Fehler und Verbesserungen**

In diesem Release wurden im Bereich Contract Calculation zahlreiche Fehler behoben und die Bedienung an vielen Stellen verbessert. Die folgenden Abschnitte fassen die Änderungen nach Themen zusammen. Tickets, die abgebrochen wurden, sind hier nicht als Änderung aufgeführt.

**Produktverwaltung und Produkterstellung**

Beim Anlegen und Bearbeiten von Produkten wurden mehrere Probleme beseitigt. Betrags- und Prozentfelder lassen sich nun auch dann weiter bearbeiten, wenn zuvor ein Maximalwert überschritten wurde. Das Aktualisieren eines Produkts funktioniert wieder. Außerdem wurde die Validierung des Produktnamens korrigiert: Der Name wird nun auch dann richtig gespeichert, wenn zum nächsten Schritt gewechselt wird. Auch das Ändern des Namens eines veröffentlichten Produkts löst keine Fehlermeldung mehr aus. Im Schritt „Gebühren und Provisionen“ tritt beim Anlegen eines Produkts kein Fehler mehr auf. Beim Bearbeiten von Entwurfsprodukten wurden mehrere Probleme gelöst, unter anderem blieb zuvor die Schaltfläche „Weiter“ in den Gebühren und Provisionen deaktiviert. Optionale Deckungen können beim Erstellen eines Produkts nun auf „Inklusive“ gesetzt werden. Die Deckungen werden in Schritt 2 jetzt angezeigt, und die Beschriftungen und Texte in diesem Schritt wurden korrigiert. Die Eingabe der Anzahl der Tage in Schritt 5 der Produkterstellung wurde überarbeitet; bei veröffentlichten Produkten ist das Feld nicht mehr editierbar. Zudem werden lange, zusammenhängende Wörter in der Beschreibung im Überblicksschritt korrekt dargestellt. Die Felder für einmalige und monatliche Zahlungen waren zuvor leer, obwohl „Weiter“ aktiviert war; auch dies wurde behoben. Außerdem werden Aktionen für gelöschte Produkte nun sinnvoll behandelt, und die Antwortzeiten bei der Produktabfrage wurden verbessert.

**Produktbilder und Blueprints**

Produktbilder werden nun gespeichert und aktualisiert, und ihre Ladezeit, die zuvor etwa 15 bis 20 Sekunden betrug, wurde verkürzt. Fehlende Blueprint-Bilder wurden korrigiert. Beim Bearbeiten eines Blueprints wird zudem ein doppelter Name korrekt als Fehler erkannt.

**Preisversionen, Cluster und Preismatrizen**

Bei Preisversionen kann nun ein Cluster angelegt werden, auch wenn das Ablaufdatum dem aktuellen Datum entspricht. In geklonten Clustern werden zugewiesene Fahrzeuggruppen nicht mehr fälschlich angezeigt. Beim Duplizieren eines Clusters tritt kein Fehler mehr für die Fahrzeuggruppe auf, und auch beim Bearbeiten eines Clusters erscheint keine Fehlermeldung mehr. Im Bearbeitungsdialog eines Clusters wurde die Validierung der Preismatrix-Felder korrigiert, sodass die Schaltfläche zum Erstellen nur noch bei gültigen Eingaben aktiv ist. Das Hochladen einer xlsx-Datei mit der Preismatrix auf der Cluster-Seite funktioniert wieder. Außerdem wurde eine falsche Preismatrix bei einzelnen Preisdefinitionen korrigiert. Beim Anlegen von Optionspreisen wurde die zu große Preistabelle für laufzeit- und laufleistungsabhängige Preise angepasst.

**Kontingentpreise**

Für Kontingentprodukte ist das Herunterladen und Hochladen der Preismatrix nun möglich. Nach dem Anlegen eines Kontingentpreises sind die Tabellenwerte nicht mehr verschoben, und der Upload einer Matrix aktiviert die Schaltfläche „Speichern“.

**Fahrzeugverwaltung und Fahrzeuggruppen**

Bei Van-Fahrzeuggruppen enthält die Tabelle der nicht zugewiesenen Modellcodes nun die entsprechenden Daten. Auf der Ansicht einer Fahrzeuggruppe wird das Fahrzeugbild angezeigt, und die überflüssige Schaltfläche zum Bearbeiten der Gruppe wurde entfernt. Doppelte Namen von Fahrzeuggruppen werden bereits im ersten Schritt erkannt. Das Laden von Fahrzeuggruppen funktioniert wieder zuverlässig. Auch die Fehlermeldung beim Anlegen einer TO-Gruppe wurde überarbeitet. Beim ISP-Template wurde ein falsches Feldformat korrigiert, und doppelte ISP-Codes werden nicht mehr angezeigt.

**Contract Review Profile**

Beim Contract Review Profile wurden mehrere Verbesserungen umgesetzt. Prozent- und Kilometersymbole werden nun auch nach der ersten Werteingabe dargestellt, und in der Ansicht fehlt das Prozentzeichen nicht mehr. Die Felder für Schwellenwert, Laufleistung und Prozentlimit haben jetzt passende Eingabebeschränkungen. Das Anlegen eines Profils mit Dezimalzahlen funktioniert, und die Prüfung auf doppelte Namen berücksichtigt die Groß- und Kleinschreibung. Das Produkt-Dropdown lädt wieder, und die Ansicht eines Profils ist verfügbar. In der Anlege-, Bearbeitungs- und Ansichtsfunktion werden die Tabs nun korrekt dargestellt. Das Löschen eines Profils für einen geschlossenen Vertrag wurde ebenfalls korrigiert. Im Dialog zum Anlegen eines Limits ist die Schaltfläche „Erstellen“ bei leeren Feldern nicht mehr aktiv.

**Kampagnen**

Beim Anlegen einer Kampagne akzeptiert das Namensfeld nicht mehr mehrere Leerzeichen und besitzt eine Zeichenbegrenzung. Die Fehlermeldung zur Debitorennummer wurde korrigiert, und der Statusfilter auf der Seite „Kampagnen verwalten“ arbeitet nun korrekt.

**Berechnung, Verträge und Verlängerungen**

Bei der Vertragserstellung wird ein eingegebener Händlerrabatt nicht mehr auf Basis des Gesamtpreises inklusive Mehrwertsteuer berechnet. Die Berechnungsformel für Verlängerungen nur nach Laufleistung wurde korrigiert, ebenso ein Fehler bei der Langzeitverlängerung für Verträge mit dem Produkt Auto-Product. Der Preis bei Kurzzeitverlängerungen berücksichtigt nun den Rabatt. Außerdem wurde ein Fehler behoben, bei dem der Vertrag eine Benutzer-ID statt der Outlet-ID übermittelte, und eine Betragsabweichung wurde korrigiert.

**Rollen, Preisansichten und Oberfläche**

Die Begrenzung der Produktansicht für MPC/MO und Händler funktioniert nun. Preise können für MO-Benutzer eingesehen werden. Nach der Anmeldung als MPC wird das MPC-Dashboard als Startseite angezeigt. Der Zustand des Tutorials bleibt jetzt erhalten. In der Template-Verwaltung laden zusätzliche Filter nicht mehr erst nach etwa 20 Sekunden.