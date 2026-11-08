# Batch 1167 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Sonderfall-Verlängerung (Prolongation) im Bereich Contract Calculation**

Verträge, die als Sonderfall (Special Case) angelegt wurden, lassen sich nun verlängern. Bisher war das nicht möglich. Die Funktion richtet sich an Market Operator und MPC-Nutzer. Sie sehen bei der Verlängerung die Preise, die sich aus der Konfiguration des jeweiligen Produkts ergeben.

Bei einer kurzfristigen Verlängerung (Short Term Extension) bietet die Produktdomäne den Monatspreis an. Es gelten dieselben Bedingungen wie im regulären Prozess. Bei einer langfristigen Verlängerung (Long Term Extension) bietet die Produktdomäne die Preise nach einer festgelegten Formel an und übergibt sie an die Vertragsdomäne. Welche Berechnung gilt, hängt von der Produktkennzeichnung ab. Ist das Produkt mit „Pricing at Contract Sales Date“ gekennzeichnet, ergibt sich der Basispreis aus dem neuen Preismatrixwert zum Verkaufsdatum, abzüglich des alten Preispunkts aus der Matrix zum Verkaufsdatum, zuzüglich des Sonderfallpreises und zuzüglich weiterer Reduzierungen und Rabatte, die im Verlängerungsprozess angewendet werden. Ist das Produkt mit „Pricing at Prolongation“ gekennzeichnet, wird stattdessen der neue Preismatrixwert aus der aktuellen Matrix verwendet, abzüglich des alten Preispunkts aus der aktuellen Matrix, zuzüglich des Sonderfallproduktpreises und der weiteren Reduzierungen und Rabatte.

Ein Rechenbeispiel verdeutlicht das Prinzip: Der ursprüngliche Sonderfallpreis beträgt 1800, einschließlich aller auf dem Vertrag gespeicherten Reduzierungen. Der angefragte Preispunkt für Laufzeit und Laufleistung zum Zeitpunkt der Verlängerung liegt bei 3150. Der ursprüngliche Preispunkt des Sonderfalls für Laufzeit und Laufleistung beträgt 2200, je nach Verlängerungsdatum bzw. Verkaufsdatum. Die Differenz (Delta) beträgt somit 950. Der bei der Verlängerung angebotene Preis ergibt sich aus Delta plus ursprünglichem Sonderfallpreis und beträgt 2750.

Bei einer Verlängerung kann keine erneute Sonderfallanfrage ausgelöst werden.

Beachten Sie: Je nach Aufbau der Preismatrizen und aufgrund der Formel können negative Preise entstehen.

**Sonderfall-Filter für SA-Codes bei Modelltypen (VAN)**

Der SA-Code-Filter bleibt erhalten und wurde um eine Matching-Logik erweitert, wie sie bereits für technische Optionen existiert. Zuvor konnten Nutzer keine Modelltypen auswählen, die nicht die eingeschlossenen SA-Codes enthalten. Der Filter bietet nun die Einstellung „Include SA Code/s“ oder „Exclude SA Code/s“.

Bei „Include SA Code/s“, dem Standardverhalten, zeigt das System nur Modelltypen an, die die angegebenen SA-Codes enthalten. Das ist hilfreich, wenn Modelle mit bestimmten Merkmalen gesucht werden. Bei „Exclude SA Code/s“ zeigt das System nur Modelltypen an, die keinen der angegebenen SA-Codes enthalten. So lassen sich Modelle mit unerwünschten Merkmalen ausblenden. Ohne Regel („No Rule“) werden alle relevanten Modelltypen ohne Ein- oder Ausschlüsse angezeigt.