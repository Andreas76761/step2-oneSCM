# Batch 874 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Aktualisierung der Fahrgestellnummer bei Verträgen mit Auftragsnummer**

Bei Verträgen, die mit einer Auftragsnummer angelegt wurden, wird die Fahrgestellnummer künftig nicht mehr nur bei der ersten Zuordnung übernommen. Das gilt auch für Verträge, die zunächst mit einem Baumuster erstellt wurden und denen später eine Auftragsnummer als Identifikator hinzugefügt wurde. In diesem Fall beginnt die Berechtigung für diesen Ablauf genau in dem Moment, in dem die Auftragsnummer dem Vertrag als Identifikator zugewiesen wird. Ändert sich die Fahrgestellnummer in OTR, übermittelt der Fahrzeug-Microservice die aktuelle Nummer, und der Vertrag übernimmt sie und speichert sie im gesamten Vertrag. Die zuletzt gelieferte Fahrgestellnummer überschreibt alle früheren Werte, die lediglich als vorläufige Arbeitswerte gelten. Dadurch bildet der Vertrag stets das Fahrzeug ab, das in OTR tatsächlich zugeordnet ist. Diese freie Überschreibung ist nur so lange möglich, bis die FRD hinzugefügt wird.

**Erneute Prüfung bei Erfassung von FRD und Kennzeichen**

Ergänzt der Vertriebsmitarbeiter bei einem bestätigten Vertrag die FRD und das Kennzeichen, führt das System die Fahrgestellnummernprüfung erneut aus. Dazu fragt es den Fahrzeug-Microservice mit der Auftragsnummer ab und erhält die aktuell zugeordnete Fahrgestellnummer. Anschließend wird geprüft, ob das aktuelle Produkt, die Produktkonfiguration und der Preis zur gelieferten Fahrgestellnummer passen. Berücksichtigt werden dabei alle Merkmale, die der ursprünglichen Produkt- und Preiskonfiguration zugrunde lagen: Produkt-ID, Produktkonfiguration, Branche (falls vorhanden), Kundentyp, Vertriebskanal, Kampagnen (falls vorhanden), optionale Deckungen, technische Deckungen, Händlerrabatte und Sonderfall. Dieser Zeitpunkt ist die letzte Gelegenheit, zu der sich die Fahrgestellnummer ändern kann.

**Fahrgestellnummer geändert und alles passt**

Hat sich die Fahrgestellnummer geändert und stimmen Produkt, Produktkonfiguration und Preis weiterhin überein, wird die neue, validierte Fahrgestellnummer im gesamten Vertrag gespeichert und ersetzt alle bisherigen Werte. Die Änderung wird im Reiter „Historie“ des Vertrags mit altem Wert, neuem Wert sowie Datum und Uhrzeit festgehalten und ist damit unabhängig von der E-Mail nachvollziehbar. Bei der Erstellung der i155 wird stets die zuletzt validierte Fahrgestellnummer verwendet, niemals ein überholter Wert.

Der Kunde wird über die Änderung in der regulären Aktivierungs-E-Mail informiert. Die bestehende Vorlage enthält dafür einen bedingten Abschnitt, der nur dann erscheint, wenn die Fahrgestellnummer bei der erneuten Prüfung nach Erfassung der FRD geändert wurde. Der Hinweis teilt unmissverständlich mit, dass sich die Fahrgestellnummer des Fahrzeugs geändert hat, und nennt sowohl die bisherige als auch die neue Nummer. Es entsteht keine zusätzliche E-Mail und kein neuer Versandzeitpunkt; die Aktivierungs-E-Mail wird weiterhin einmalig zum üblichen Aktivierungszeitpunkt versendet.

**Fahrgestellnummer geändert und etwas passt nicht**

Passen Produkt, Produktkonfiguration oder Preis nicht zur neuen Fahrgestellnummer, wird der Vertrag abgelehnt. Als Ablehnungsgrund wird die konkrete Ursache angegeben und nicht pauschal ein einheitlicher Grund. Dabei werden die bereits bestehenden, differenzierten Gründe der Identifikatorvalidierung wiederverwendet:

Weicht die Produkt-ID oder Produktlinie ab, lautet der Grund „Produkt(linien)-Abweichung“. Weicht die Produktkonfiguration ab, etwa bei Deckungen, optionalen Deckungen, technischen Optionen, Kampagnen, Rabatten oder Sonderfall, lautet der Grund „Konfigurationsabweichung“, gegebenenfalls näher bezeichnet nach Deckung, optionaler Deckung oder technischen Optionen. Unterscheidet sich der Nettopreis nach der Neuberechnung, lautet der Grund „Preisabweichung“. Treffen mehrere Abweichungen zugleich zu, wird der erste beziehungsweise primäre Fehler gemäß der bestehenden Prüfreihenfolge als Ablehnungsgrund angezeigt; alle fehlgeschlagenen Dimensionen werden zu Prüfzwecken protokolliert. Die Fahrgestellnummer wird in diesem Fall nicht stillschweigend in einen aktivierbaren Zustand überschrieben, und der Vertrag kann nicht aktiviert werden.

**Fahrgestellnummer unverändert**

Liefert die erneute Abfrage dieselbe Fahrgestellnummer, werden dieselben Prüfungen wie bisher durchgeführt. Das Verhalten der bestehenden Validierung bei der FRD-Erfassung ändert sich nicht, und die Aktivierungs-E-Mail enthält keinen zusätzlichen Hinweis und entspricht der bisherigen.

**Fahrgestellnummer nach Erfassung der FRD**

Sobald der Fahrgestellnummer eine FRD zugeordnet ist, ist die Fahrgestellnummer für den weiteren Lebenszyklus des Vertrags eingefroren. Liefert der Fahrzeug-Microservice danach eine abweichende Nummer, wird diese weder übernommen noch überschrieben; die gespeicherte Fahrgestellnummer bleibt der zuletzt validierte Wert.

**Abgrenzung**

Nicht Teil dieser Funktion sind Änderungen der Fahrgestellnummer nach der Aktivierung sowie Abläufe, die nicht auf Auftragsnummer oder Baumuster mit Auftragsnummer beruhen, etwa die Verwendung einer verfügbaren Fahrgestellnummer, bei der die Fahrgestellnummer selbst der Identifikator ist.