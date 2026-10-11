# Batch 116 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Berechnung von SCIN/CCIN-Belegen bei Änderungen an Schadensfällen (Claims)**

Durchläuft ein Schadensfall (Claim) im Laufe seines Lebenszyklus mehrere Entscheidungen, zum Beispiel eine Betragsänderung oder eine Ablehnung, berechnet oneSCM künftig für jeden Folgebeleg (SCIN, Supplier Credit Invoice/Note) den korrekten Differenzbetrag. So bleibt das Lieferantenkonto ausgeglichen. Die Funktion unterstützt Market-Operations-Teams bei der Prüfung von Lieferantenbelegen, stellt sicher, dass Lieferanten korrekte Gutschriften bzw. Rechnungen erhalten, und erleichtert den Finanzteams die Abstimmung der Lieferantenkonten. Bisher erzeugt das System für jede empfangene Entscheidungsnummer einen eigenen SCIN, unabhängig davon, ob mehrere Entscheidungen in derselben Datei eintreffen oder ein früherer SCIN bereits exportiert wurde. Es findet keine Differenzberechnung zwischen alten und neuen Claim-Werten statt, und zusammengehörige SCINs werden in der Oberfläche nicht als Eltern-Kind-Beziehung dargestellt.

**Mehrere Entscheidungen in derselben Datei**

Enthält eine I156-Datei mehrere Entscheidungsnummern für denselben Claim, denselben Coverage Code und denselben Damage Code, wird nur die jeweils letzte Entscheidung berücksichtigt. Zwischenbelege werden nicht erzeugt, frühere Entscheidungen werden vollständig ignoriert. Lautet die letzte Entscheidung auf 0 EUR und ist der Damage Code abgelehnt, entsteht gar kein SCIN. Beträgt die letzte Entscheidung beispielsweise 150 EUR, wird genau ein SCIN über 150 EUR im Status „Planned“ angelegt, ohne Differenzberechnung, als hätte die erste Entscheidung nie existiert. Liegen drei Entscheidungen vor, wird nur die dritte verwendet.

**Entscheidungen in unterschiedlichen Dateien**

Trifft derselbe Claim in einer späteren I156-Datei (etwa in einer anderen Woche) erneut ein, existiert in der Regel bereits ein SCIN aus der vorherigen Entscheidung. Welche Aktion folgt, hängt vom Status dieses SCINs zum Zeitpunkt der neuen Entscheidung ab.

Der Differenzbetrag wird nach folgender Formel berechnet: Betrag des neuen SCINs = neuer Claim-Wert minus Summe aller bestehenden SCIN-Beträge für denselben Claim und Damage Code. Ist das Ergebnis kleiner als null, wird eine Gutschrift (Credit Note) im Status „Planned“ mit dem errechneten Betrag erstellt. Ist es größer als null, wird eine Rechnung (Invoice) im Status „Planned“ erstellt.

**Szenario 1: Ablehnung eines Claims**

Wird ein Claim abgelehnt, nachdem bereits ein SCIN erstellt wurde, hängt das Vorgehen vom Status ab. Befindet sich der SCIN im Status „Planned“ oder „Accepted“, wird er storniert; es wird weder ein neuer SCIN noch eine Gutschrift erzeugt. Ist der SCIN bereits „Exported“ oder befindet er sich in einem späteren Status (FI Doc Created, Paid, Dunning Level), bleibt sein Status unverändert. Stattdessen wird automatisch eine entsprechende Gutschrift im Status „Planned“ erstellt, um das Lieferantenkonto auszugleichen. Bei einem exportierten SCIN entspricht der Gutschriftsbetrag dem ursprünglichen SCIN-Betrag (negativ). Die Gutschrift wird über das Feld „Document Reference“ mit dem ursprünglichen SCIN in eine Eltern-Kind-Beziehung gesetzt.

**Szenario 2: Betrag erhöht oder verringert**

Ändert sich der Claim-Betrag und befindet sich der bestehende SCIN im Status „Planned“ oder „Accepted“, wird der alte SCIN storniert und ein neuer SCIN im Status „Planned“ mit dem neuen Betrag angelegt. Bei einem alten Betrag von 1000 EUR und einem neuen Betrag von 800 EUR (bzw. 1200 EUR) entsteht also ein neuer SCIN über 800 EUR (bzw. 1200 EUR). Der neue SCIN erhält über das Feld „Document Reference“ eine Eltern-Kind-Beziehung zum alten SCIN.

Ist der bestehende SCIN „Exported“ oder in einem späteren Status (FI Doc Created, Paid, Dunning Level), bleibt er unverändert. Zusätzlich wird ein SCIN Delta im Status „Planned“ erstellt, das nur den Differenzbetrag abdeckt. Bei einer Erhöhung von 1000 auf 1200 EUR beträgt das SCIN Delta +200 EUR (Rechnung/Belastung an den Lieferanten), bei einer Verringerung auf 800 EUR -200 EUR (Gutschrift an den Lieferanten). Auch das SCIN Delta wird über „Document Reference“ mit dem ursprünglichen SCIN verknüpft.

Das Feld „Document Reference“ ermöglicht in der Oberfläche die aufklappbare Eltern-Kind-Ansicht, ähnlich der bereits auf der INT-Umgebung vorhandenen Funktionalität.

**Szenario 3: Mehrere aufeinanderfolgende Änderungen nach dem Export**

Treffen nach dem Export eines SCINs mehrere Entscheidungen ein, löst jede neue Entscheidung eine neue Differenzberechnung aus. Befindet sich das SCIN Delta noch im Status „Planned“, wird es storniert und ersetzt. Wurde es bereits exportiert, wird ein neues Delta-SCIN erstellt. Die Summe aller bestehenden SCINs, einschließlich früherer Deltas, fließt dabei stets in die Berechnung ein.

Ein Beispiel: Entscheidung 1 über 1000 EUR führt bei einer bisherigen Summe von 0 zu einem SCIN über 1000 EUR. Entscheidung 2 über 800 EUR führt bei einer Summe von 1000 zu einer Gutschrift über 200 EUR. Entscheidung 3 über 1200 EUR führt bei einer Summe von 800 (1000 abzüglich 200) zu einer Rechnung über 400 EUR. Damit entspricht die Summe aller Belege wieder dem aktuellen Claim-Wert von 1200 EUR.