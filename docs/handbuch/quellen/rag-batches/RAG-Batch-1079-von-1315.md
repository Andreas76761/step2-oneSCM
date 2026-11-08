# Batch 1079 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung und Vertragsnummern**

Bei der Vertragserstellung wird der Ablauf nun so abgesichert, dass bei einem Fehler, der den Prozess blockiert, weder ein Kunde noch ein Vertrag angelegt wird. Zuvor konnte es vorkommen, dass nach dem Ausfüllen der Kunden- und Zahlungsinformationen und dem Klick auf „Weiter" ein Fehler auftrat (Dokument nicht gefunden) und ein erneuter Klick anschließend die Meldung auslöste, dass bereits ein Konto mit diesen Namens- und Kontaktdaten existiert. Ebenso wurde behoben, dass ein Vertrag trotz erfolgreicher Bestätigungsmeldungen nicht in der Vertragserstellung gefunden werden konnte und die Vorschau (dritter Schritt des Assistenten) nicht erschien. Nach dem Ausfüllen der Kunden- und Zahlungsinformationen wird nun eine Vertragsnummer vergeben, die Vorschauseite öffnet sich, und der Vertrag lässt sich über die Suche auf der Startseite der Vertragserstellung finden. Auch ein Fehler, bei dem die Vertragserstellung nach dem Ausfüllen aller Pflichtfelder mit dem Statuscode 400 (Bad Request) abgelehnt wurde, wurde bearbeitet.

Die Vertragsnummer folgt einem festen Format aus drei Teilen. Der erste Teil besteht aus 8 alphanumerischen Zeichen (26 Buchstaben und 10 Ziffern), ist eindeutig, wird fortlaufend mit zufälliger Generierung vergeben und an das Finanzsystem übermittelt, zum Beispiel 0000001A oder X780002T. Darauf folgt ein Schrägstrich als Trennzeichen. Der dritte Teil besteht aus 6 alphanumerischen Zeichen, die den Vertragstyp in OneSCM festlegen: dem Ländercode nach ISO 3166 ALPHA-2 (zum Beispiel DE für Deutschland), den letzten zwei Ziffern des aktuellen Jahres (zum Beispiel 23), der Markenzuordnung mit einem Zeichen (P für Passenger Cars, V für Van, S für Smart) und dem Produkttyp mit einem Zeichen (A für Advance, C für Compact, E für Excellent). Eine vollständige Vertragsnummer lautet damit beispielsweise 0000001A/DE23PE.

**Eingabe des Kennzeichens**

Das Kennzeichenfeld soll bis zu 11 alphanumerische Zeichen zulassen, einschließlich deutscher Sonderzeichen. Ein Bindestrich muss an beliebiger Stelle innerhalb dieser Zeichen eingegeben werden können, wobei das elfte Zeichen auch der Bindestrich sein kann. Eingaben wie „BILL-B001" funktionierten zuvor nicht und wurden sowohl in der Oberfläche als auch in der Verarbeitung im Hintergrund korrigiert.

**Registerkarte „Payment"**

Die Registerkarte, die bisher „Payment Detail" hieß, heißt nun „Payment". Sie zeigt nur noch die benötigten Felder an: Payment Duration, Payment Interval und Payment Rate per Interval. Die bisher angezeigten Felder Gesamtbruttopreis, Gesamtnettobetrag, Gesamtsteuerbetrag, Mehrwertsteuersatz sowie Brutto- und Nettobetrag pro Intervall entfallen.

**Startseite der Vertragserstellung**

Die Tabelle auf der Startseite der Vertragserstellung wurde überarbeitet. Sie enthält die Spalten Customer Name, Contract Number (als Link), Product Name, Chassis Number, Created On, Created By und Status. Der Produktname zeigt im MVP „Excellent" an, statt wie zuvor eine Produktkennung wie „PRO-123". Die Spalte „FRD" heißt jetzt „Created On" und zeigt das Erstellungsdatum des Vertrags. Die Spalte „Mileage" entfällt. Neu ist die Spalte „Created By", die angibt, welches System den Vertrag erstellt hat; im MVP wird „OneSCM" angezeigt. Die Spalte „Status" zeigt weiterhin die Status CREATED, DECLINED, WAITING FOR ACTIVATION und CANCELED.

**Vertragsverwaltung**

Auf der Startseite der Vertragsverwaltung öffnet ein Klick auf „More Filters" nun ein Pop-up mit den verfügbaren Optionen, anhand derer eine Suche, etwa nach dem Status eines Vertrags, durchgeführt werden kann. Außerdem wird ein Vertrag, sobald er aktiv ist, in die nächste erzeugte Schnittstellendatei i155 aufgenommen, und die zugehörigen Informationen werden im Bereich „History" der Vertragsverwaltung angezeigt.

**Schnittstelle i155**

In der Schnittstelle i155 wurde der Kilometerstand zu Beginn der Deckung bislang abgeschnitten dargestellt: Ein Startwert von 8.000 km erschien beispielsweise als 80. Nun wird der Startkilometerstand so ausgegeben, wie er in der Vertragserstellung festgelegt wurde, rechtsbündig in den Positionen 98 bis 104 des betroffenen Satzes.