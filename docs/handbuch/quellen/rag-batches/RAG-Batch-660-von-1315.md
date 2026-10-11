# Batch 660 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung (Customer & Partner Management)**

In der Kundenverwaltung wurden mehrere Verbesserungen und Korrekturen umgesetzt. In der Bestätigungsvorschau für Kunden ist das Adresssuchfeld nun deaktiviert. Das Feld für die Währung in den Zahlungsinformationen bietet für den deutschen Markt ausschließlich EUR zur Auswahl an.

Wenn Sie den Vor- und/oder Nachnamen eines Kunden über die Navigationsleiste der Kundenverwaltung ändern, wird der Name des Kontoinhabers im Bereich der Zahlungsinformationen automatisch angepasst. Bisher blieb dieser Name unverändert. Außerdem wurde ein Fehler behoben, durch den der Lastschriftcode nicht gespeichert wurde.

Auch der Vertragserstellungsassistent wurde angepasst: Befindet sich ein neuer Vertrag für einen neuen Kunden im Status „CREATED“ und Sie sind auf der Übersichtsseite, gelangen Sie über die Zurück-Schaltfläche des Browsers oder der Seite zurück zu den Kunden- und Zahlungsinformationen. Dort lassen sich nun alle Felder bearbeiten, einschließlich des Bereichs der Zahlungsinformationen, der zuvor nicht editierbar war.

Die Kundensuche wurde im Hinblick auf die Leistung verbessert. Zuvor benötigten wiederholte Anfragen zur Kundenfilterung mehr als zehn Sekunden. Ziel ist, dass alle Anfragen in weniger als einer Sekunde beantwortet werden.

Für Benutzer mit der Rolle NACOS steht eine Download-Funktion zur Verfügung. Sie können eine Datei „customer_export“ herunterladen. Die Anzahl der angezeigten Zeilen soll der Anzahl der ausgewählten Zeilen entsprechen, und jede Spalte lässt sich auf- und absteigend sortieren. Diese Funktionen wurden fachlich geprüft.

Zusätzlich wurde die Sanktionslistenprüfung getestet: Wird ein neuer Kunde angelegt, der nicht auf der Sanktionsliste steht, wird er in der Prüfung der MO Checks Verification als „OK“ angezeigt. Ebenfalls im Einsatz befindet sich der Negativfall beim Bearbeiten eines Kunden auf der Bearbeitungsseite.

Geplant, aber noch offen, ist eine Vorlage für E-Mail-Benachrichtigungen in den Stammdaten für den Fall, dass ein Vertrag nach dem Status „Active“ gekündigt wird. Im Admin-Bereich unter Template Management im Reiter Notification soll über „Create Template“ und „E-mail“ eine Vorlage erstellt werden können. Header und Footer sind dabei bereits definiert und werden aus den vorhandenen Vorlagen ausgewählt.

Pflichtangaben sind der Vorlagenname (maximal 25 Zeichen), der Markt (zunächst mit Deutschland vorbelegt), die Verwendung (hier „CANCELLATION“) und das Datum „Valid From“, ab dem die Vorlage gilt. Sind Pflichtfelder nicht ausgefüllt, wird das jeweilige Feld gemeldet. „Save as Draft“ ist dann möglich, „Publish“ jedoch nicht. Optional lassen sich Division (zunächst PC), Marke (zunächst Mercedes-Benz) und Sprache (zunächst Englisch) angeben. Der Inhalt folgt dem MB-Style-Guide für E-Mails.

Der Betreff lautet „Service Contract Cancelled (Contract Number: %Contract Number)“. Der Text spricht den Kunden mit Vor- und Nachnamen an und teilt mit, dass der Servicevertrag zu einem bestimmten Datum aus einem genannten Grund gekündigt wurde. Entsprechende Wartungs- und Reparaturleistungen in autorisierten Servicestellen werden dann nicht mehr übernommen. Aufgeführt werden Vertragsnummer, Fahrgestellnummer, Kennzeichen und Produkt. Das Kennzeichen erscheint nur, wenn ein Wert vorhanden ist. Es folgen ein Hinweis auf den Kundenservice, die Standardsignatur des Service Contract Teams von Mercedes-Benz Cars Germany mit marktspezifischen Kontaktdaten sowie der Hinweis zur Umwelt beim Drucken.

Mit „Send Test E-mail“ wird eine E-Mail im finalen Format (Betreff, Header, Footer und Inhalt) an den angemeldeten Benutzer gesendet. „Save as Draft“ speichert einen Entwurf, der noch nicht für Geschäftsprozesse gilt. „Publish“ veröffentlicht die endgültige Version, die entsprechend dem Datum „Valid From“ angewendet wird. Nach der Veröffentlichung wird die Vorlage für Kündigungsbenachrichtigungen verwendet und an den Kunden gesendet, wenn ein aktiver Vertrag gekündigt wird.