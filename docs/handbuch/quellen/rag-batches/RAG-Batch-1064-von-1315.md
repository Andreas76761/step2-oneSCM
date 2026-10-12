# Batch 1064 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 74 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung: Verbesserungen und Fehlerbehebungen**

Im Bereich der Vertragserstellung wurden zahlreiche Fehler behoben, die vor allem Sonderfälle (Special Cases), die Produktkonfiguration und die Preisdarstellung betrafen.

**Sonderfälle**

Verträge mit einer Sonderfallanfrage lassen sich nun auch dann anlegen, wenn eine automatisch angewendete Kampagne (Auto-apply) hinterlegt ist. Ein Vertrag, dessen Sonderfall manuell abgelehnt wurde, bleibt nicht mehr im Status „Created“ blockiert. Nach der Bestätigung eines Sonderfalls wird in der Übersicht der korrekte monatliche Preis angezeigt. Außerdem kann derselbe MPC den Sonderfall nach der Bestätigung nicht mehr erneut prüfen. Sonderfallanfragen sind jetzt auch für abweichende Konfigurationen von Laufleistung und Laufzeit möglich. Bei der Prüfung werden die Listenpreise korrekt angezeigt. Der Status „IN REVIEW“ erscheint im Benachrichtigungsbereich in der richtigen Form, und das Feld „Industry“ wird nach der Anfrage eines Sonderfalls deaktiviert. Beim Aufruf des Bereichs „Special cases“ wird zudem nicht mehr fälschlich der Bereich „Proposal management“ hervorgehoben.

**Vertragsdaten, Dokumente und Fristen**

Das Fälligkeitsdatum richtet sich nun nach dem in den Market Settings hinterlegten Wert für die Angebotsgültigkeit. Im PDF-Entwurf werden die Zahlungsplanwerte korrekt ausgegeben. Für Verträge mit Gewerbekunden können Dokumente nun erzeugt werden. Auf der Übersichtsseite gibt das Feld „Division“ nicht mehr den internen Enum-Wert aus. Bei Ausfall des DMS wird eine passende Fehlermeldung angezeigt, und statt eines Fehlers werden die Produkte wieder korrekt abgerufen. Auch die elektronische Signatur funktioniert wieder. Die Meldung zu fehlenden Produkten bei der Erstellung eines MBLD-Vertrags erscheint in der richtigen Sprache, und für MBLD-Verträge wird nun ein Kampagnenwert geliefert. Ein fehlgeschlagener CAS-Check auf INT wurde behoben, und ein positiver CAS-Treffer steht für Automatisierungstests zur Verfügung.

**Produktkonfiguration und Preise**

Beim Bearbeiten der Produktoptionen werden Informationen nun korrekt aktualisiert, und Nutzer werden beim Klick auf den entsprechenden Bereich nicht mehr blockiert. Im Optionen-Dialog werden Preise korrekt dargestellt. Bei Reifenprodukten werden die Preise nach einer Änderung der Reifenanzahl aktualisiert. Wird das Zahlungsintervall zunächst auf „OneTime“ und danach auf „Monthly“ gestellt, erscheint der richtige Monatspreis. Das Zahlungsintervall lässt sich wieder auswählen. Optionale Deckungen werden der Liste hinzugefügt, und ihr Familien-Tag wird richtig angezeigt. Ein Händlerrabatt kann den Preis ohne Mehrwertsteuer nicht mehr übersteigen. Das Feld „Vehicle group“ ist nur noch aktiv, wenn mehrere Einträge zur Auswahl stehen. Die Option „FRD unavailable“ wird beim Auswählen auf dem Konfigurationsbildschirm nicht mehr deaktiviert.

**Zusätzlicher Identifier und Baumuster-Ablauf**

Im Baumuster-Ablauf (BM Flow) ist die Vertragslaufzeit nach Hinzufügen eines zusätzlichen Identifiers verfügbar und nicht mehr leer. Die jährliche Laufleistung bleibt nach dem Hinzufügen des Identifiers und einer Änderung der Laufzeit erhalten, ebenso nach dem Durchlaufen mehrerer Laufzeiten. Bei einem gültigen zusätzlichen Identifier wird die ursprüngliche Produktkonfiguration nicht mehr zurückgesetzt. Zudem erscheint die Fehlermeldung, dass die Vertragslaufzeit nicht in der Vergangenheit liegen darf, wie vorgesehen.

**Vertragsverwaltung, Kampagnen und Navigation**

Bei der Auswahl eines Beendigungsdatums bleiben alle zuvor gewählten Verträge in der Auswahl erhalten. Im Dialog erscheint die Meldung für nicht berechtigte Verträge. Im Kunden-Tab werden die Kundendetails nicht mehr doppelt angezeigt. In der Kampagnenverwaltung werden zugewiesene Preisversionen auf der Ansichtsseite korrekt dargestellt. Das Admin-Dropdown-Menü in der Navigation ragt nicht mehr über den Bildschirmrand hinaus. Außerdem wurde ein sporadisch fehlschlagender Unit-Test im Product List Service behoben.