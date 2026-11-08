# Batch 730 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Cost Management: Änderungen und Verbesserungen**

Im Bereich Cost Management wurden die Darstellung von Werkstattrechnungen und die Verarbeitung von Altteilsteuer-Rechnungen überarbeitet. Die Verarbeitung großer Importdateien wurde ebenfalls verbessert.

**Darstellung und Erfassung**

Nach der Verarbeitung einer i156-Datei wurde das Reparaturdatum bei den Werkstattrechnungen eines Projekts in der Benutzeroberfläche nicht korrekt angezeigt. Dieses Problem wurde behoben. Außerdem wurde die Ausrichtung der Summen bei Werkstatt- und Kundenrechnungen korrigiert.

Bei der manuellen Anlage einer Werkstattrechnung war das Feld „Damage Code“ bisher ein Freitextfeld. Es ist nun in zwei Auswahllisten aufgeteilt: „Damage Code“ und „Damage Type“. Beide Felder sind Pflichtfelder und bleiben deaktiviert, bis ein Coverage Code ausgewählt wurde. Nach der Auswahl des Coverage Codes zeigt die Liste „Damage Code“ die dazugehörigen Damage Codes mit ihrer Beschreibung. Sie enthält alle Codes des eigenen Marktes und bietet eine Suchfunktion, die Treffer im Code und in der Beschreibung findet. Ergebnisse erscheinen, sobald mindestens drei Zeichen eingegeben wurden. Das Feld „Damage Type“ ist so lange deaktiviert, bis ein Damage Code gewählt wurde. Danach werden die zugehörigen Damage Types mit Beschreibung angeboten.

**Altteilsteuer (E169)**

Bei der Altteilsteuer gab es mehrere Anpassungen. Enthält eine importierte i156-Datei eine Altteilsteuer-Position mit dem Löschkennzeichen 0, wird nun in E169 eine Gutschrift (G) erzeugt. Ein Fehler wurde behoben, durch den die Altteilsteuer seit der Einführung des Felds „createdBy“ keine Rechnungen mehr anlegen konnte. Der Text, der für die E169-Altteilsteuer-Datei erzeugt wird, wurde aktualisiert. Das Format orientiert sich an einer Beispieldatei aus dem FCM-Projekt. Der Text verweist auf den Mercedes-Benz Servicevertrag, den Buchungszeitraum und die Händlernummer und erklärt die Ermittlung der Altteilsteuer aus 10 % der Differenz zwischen aufbereitetem Teil (80er Teil) und Altteil (70er Teil).

Wird das NACOS-Feedback zu einer Altteilsteuer-Rechnung verarbeitet, wird nicht mehr nur der Status der Rechnung aktualisiert. Zusätzlich werden die Werte im Reiter „Financial Control“ angepasst. Handelt es sich um eine Gutschrift, wird das Feld „Credit Amount E169“ mit dem Nettobetrag befüllt. Handelt es sich um eine Rechnung, wird das Feld „Invoice Amount E169“ mit dem Nettobetrag befüllt. Anschließend wird die Prüfung berechnet: Stimmen Credit Amount und Invoice Amount aus I156 mit den entsprechenden E169-Werten überein, lautet das Ergebnis „OK“, andernfalls „Not OK“.

**Performance beim Import**

Der Import sehr großer I156-Dateien mit rund 85.000 Zeilen dauerte bisher mehr als eine Stunde. Hier wurde eine Verbesserung umgesetzt. Dazu wurde im Backend eine neue Schnittstelle geschaffen, die eine Liste von Vertragsnummern entgegennimmt und die Daten aller gefundenen Verträge gesammelt zurückliefert. Statt wie bisher für jede Vertragsnummer einzeln abzufragen, wird nun diese Sammelabfrage genutzt.