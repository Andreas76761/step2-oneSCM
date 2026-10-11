# Batch 809 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reifenprodukt im Vertragsmanagement**

Sobald ein Vertrag mit Reifenprodukt aktiviert wird, zeigt die Vertragsdetailansicht die zugehörigen Reifeninformationen an. Im Reiter „Vertrag" werden die Reifenleistungen in die Leistungstabelle aufgenommen. Der Platzhalter „Number of Tires" zeigt die Anzahl der im Vertrag enthaltenen Reifensätze (als gerade Zahl) an. Zusätzlich gibt es einen Zähler, der die enthaltene Reifenanzahl den bereits in Anspruch genommenen Reifen gegenüberstellt. Gezählt werden ausschließlich die Reifen, nicht Service oder Einlagerung. Wird im Winter ein Satz Winterreifen beansprucht, erhöht sich der Zähler. Werden im Frühjahr wieder die ursprünglichen Reifen montiert, bleibt der Zähler unverändert. Im Reiter „Fahrzeug" erscheint der Platzhalter „Tire Type / Tire Size" mit den auf Vertragsebene erfassten Angaben.

Die Inanspruchnahme wird über die Schnittstelle i156 verarbeitet. Importiert werden Revenue Claims, die in RC20 an Position 198 das Zeichen „+" oder „-" enthalten. Der Wert aus RC20, Position 199 bis 202, wird dabei an den Vertrag übergeben. Der Vertrag gleicht Vertragsnummer, Fahrgestellnummer (FIN/VIN) und Leistung mit den Vertragsdaten ab. Stimmen nicht alle Merkmale überein, wird der Claim nicht importiert und eine Logdatei versendet. Der Empfänger ist noch festzulegen. Stimmen alle Merkmale überein, aktualisiert das System den Zähler in der Vertragsdetailansicht. „Included Number of Tires" zeigt die bei der Vertragserstellung enthaltene Reifenanzahl, „Used Tires" die genutzte Anzahl. Der aus i156 übernommene Wert wird je nach Vorzeichen addiert oder abgezogen, und die Oberfläche wird aktualisiert.

Ein Beispiel: Bei einem Vertrag über 8 Reifen führt ein Claim über 3 Reifen mit „+" zu 3 genutzten Reifen. Ein zweiter Claim über 2 Reifen mit „+" erhöht den Stand auf 5. Ein dritter Claim über 4 Reifen mit „-" senkt ihn auf 1.

Nach jeder Aktualisierung erzeugt das System eine aktualisierte i155 und sendet sie an Vega. In RC10 (externe Vertragsinformationen) werden dieselben Werte wie bei der Aktivierung übermittelt. An Position 71 (Länge 4000) steht Reifenart und -größe linksbündig, Reihenfolge, Formatierung und Abstände sind noch abzustimmen. Der Text lautet: „Bitte beachten Sie, dass dieses Fahrzeug mit Rädern der Größe 17 Zoll und dem Reifentyp MOE (Runflat) ausgeliefert wurde. Diese Angaben sind das Maximum, dass für die Abwicklung von Leistungen im Servicevertrag verwendet werden darf." Größe und Typ sind dynamische Felder, die aus den Produktdaten befüllt werden. In RC20 steht an Position 175 immer „1". Die Positionen 165 bis 169 enthalten den Kontingentstartwert, wobei die letzte Stelle eine Dezimalstelle ist. Bei 4 Reifen (2 Sätzen) lautet der Wert 00040. Die Positionen 170 bis 174 enthalten den aktuellen Verbrauch, Standardwert 00000, danach der Wert aus i156, RC20, Position 199 bis 202. Auch bei einer geraden Reifenanzahl im Vertrag kann eine ungerade Anzahl beansprucht werden. Die Reifenleistungen werden in die Datei aufgenommen.

**Verhalten des Vertrags nach der Aktivierung**

Eine Kündigung nach Aktivierung läuft wie bei allen anderen Produkten ab und beachtet die in der Market Config gesetzten Grenzen. Suspendierung (einschließlich Mahnstufe 3) und Reaktivierung bleiben unverändert. Eine Beendigung ist auf Kundenwunsch und bei Erreichen der geplanten Laufzeit möglich. Beim Erreichen der geplanten Endlaufleistung oder der vollständigen Nutzung der Reifensätze ist keine Beendigung möglich, der Vertrag bleibt aktiv. Vertragsprüfung, Vertragsübertragung und Vertragsverlängerung (kurz- und langfristig) sind nicht möglich und deaktiviert.

Für den Fall, dass Vega mehr Claims sendet, als im Vertrag enthalten sind, oder die Zuordnung fehlschlägt, ist eine Fehlerbehandlung vorgesehen: Ein Fehler wird in Data Dog protokolliert. Ist die Anzahl der Reifen bereits ausgeschöpft und kommen weiter Claims mit „+", erhält der MO im Notification Center die Meldung „Kontingent überschritten, bitte Vertrag XXXXXXXX/XXXXXX überprüfen".

**Weitere Änderungen im Vertragsmanagement**

Der Reiter „Notifications" heißt jetzt „Emails". Der Zusatzfilter „Order Number" im Vertragsmanagement wurde entfernt.

Im Verlängerungsprozess werden Preise nun mit einem Tooltip versehen. Bei Privatkunden wird der Bruttopreis angezeigt, und der Tooltip enthält den Nettopreis und den Mehrwertsteuerbetrag. Bei Gewerbekunden wird der Nettopreis angezeigt, und der Tooltip enthält den Bruttopreis und den Mehrwertsteuerbetrag.

Geplant, aber noch nicht umgesetzt, ist eine zusätzliche Spalte „Kennzeichen" in der Vertragsliste bzw. auf der Startseite des Vertragsmanagements.