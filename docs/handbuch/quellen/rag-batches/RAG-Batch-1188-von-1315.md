# Batch 1188 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Preis für dauerhaft enthaltene Optionen in der Produktdefinition**

In der Produktdefinition kann für Ausstattungs- bzw. Coverage-Codes, die als dauerhaft enthalten (zu 100 % inkludiert) geführt werden, nun ein Preis hinterlegt werden. Dies ist möglich, wenn der Benutzer eine Coverage als „immer enthalten" auswählt. Der neue Preisbestandteil wird angezeigt und im Payload mitgesendet. Er dient zunächst Reporting-Zwecken und soll künftig auch für die Preistransparenz in der Generation-Anzeige genutzt werden. Der Endpreis ergibt sich aus dem Basispreis zuzüglich der Preise der immer enthaltenen Optionen.

Künftig werden auch die bereits enthaltenen Coverages angezeigt, und der Benutzer wird darauf hingewiesen, dass er eine enthaltene Coverage bearbeitet (Standardzustand: keine Kosten). Angezeigt werden jeweils Coverage-Code und Name, wobei der Name aus den Vega-Codes für alle Auswahlarten (enthalten, optional, technisch) stammt. Beim Bearbeiten erscheint ein Pop-up mit doppelter Bestätigung, das den Benutzer darüber informiert, dass eine neue Preisversion erstellt wird. Wechselt der Benutzer eine Coverage von „optional" zu „immer enthalten" oder umgekehrt, wird die Preismatrix geleert.

**Technische Optionen beim Reifenprodukt**

Die Verwaltung der Technischen Optionen wurde angepasst. Die bisherige Tabelle wurde durch Karten ersetzt, die Funktionalität bleibt dabei unverändert. Jede Karte zeigt Gruppenname, Division, SA-Codes und den Typ der Technischen Option an. Beim Anlegen einer Technischen Option wird nach dem Hinzufügen eines SA-Codes eine Tabelle mit den Modellcodes angezeigt, die diesen SA-Code enthalten. Beim Bearbeiten passt sich die Modellcode-Tabelle automatisch an, sobald SA-Codes hinzugefügt oder entfernt werden. Für die Matching-Logik stehen die Optionen „Alle müssen übereinstimmen", „Keine darf übereinstimmen" und „Eine muss übereinstimmen" zur Auswahl.

**Aktualisierte Hauptnavigation**

Die Hauptnavigation wurde gemäß den Ergebnissen aus dem UX-Stream überarbeitet.

**Sichtbarkeit von Produkten in der Produktivumgebung**

Ein Fehler wurde behoben: Produkte wurden in der Produktivumgebung nicht angezeigt, wenn als Fahrzeugkennung die VIN (Fahrzeug-Identifizierungsnummer) verwendet wurde.

**Aktionen für Sticker- und Preiskampagnen**

Die Behandlung von Kampagnen wurde verbessert, damit Fehler im System und im Umgang mit Kampagnen vermieden werden und das abnehmende System (im Fall von oneSCM die Generation) Kampagnen korrekt verarbeiten kann. Leitgedanke ist, die Kampagne stets im besten Interesse des Kunden anzuwenden. Bei der Definition von Kampagnen finden keine Validierungen oder Regeln statt; die Validierung erfolgt ausschließlich bei der Berechnung und beim Senden der Antwort.

Es wird immer nur eine Kampagne gleichzeitig angewendet, auch bei sich überschneidenden Kampagnenzeiträumen; Kampagnen sind nicht kumulierbar. Automatisch angewendete Kampagnen haben Vorrang vor anderen Kampagnen. Sind mehrere automatisch angewendete Kampagnen gültig, wird diejenige mit dem höchsten Wert angewendet. Sind die Werte gleich, wird die zuerst erstellte Kampagne gewählt. Übersteigt der Kampagnenwert den Produktpreis, wird der Endpreis auf 0 gesetzt, negative Preise gibt es nicht.

Das System erkennt außerdem, wenn sich eine Kampagne in der Kulanzfrist (Grace Period) befindet, also das aktuelle Datum nach dem Enddatum liegt, aber noch innerhalb der Kulanztage. Ist eine Kampagne abgelaufen, aber noch in der Kulanzfrist, und gleichzeitig eine andere Kampagne gültig, wird nach dem Kundeninteresse die gültige Kampagne angewendet. Die Kulanzfrist erfordert die Zustimmung der Märkte. Der Händler kann auch die abgelaufene Kampagne auswählen und zur Genehmigung einreichen, wobei weiterhin nur eine Kampagne angewendet werden kann.

Damit Benutzer die Regeln bei der Definition einer Kampagne kennen, zeigt die Oberfläche einen Tooltip an. Dieser erklärt, dass Kampagnen nicht kumulierbar sind und die Kampagne mit dem höchsten Wert angewendet wird.

**Copy-and-Paste-Funktion**

Für Matrixtabellen und andere Tabellenformate mit Upload- und Download-Funktion steht nun eine Copy-and-Paste-Funktion zur Verfügung. Inhalte können direkt kopiert und eingefügt werden, ohne dass ein Upload nötig ist, was Zeit spart. Die Funktion gilt nur für Stream 1 (Produkt).