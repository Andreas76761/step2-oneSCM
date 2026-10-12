# Batch 653 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kundenstatus und Vertragserstellung**

Wird für einen Kunden mit dem Status „Inaktiv" ein neuer Servicevertrag angelegt, bleibt dieser Kunde nicht mehr dauerhaft inaktiv. Der Kunde erscheint im Kundenabgleich und wird vom Benutzer ausgewählt. Sobald der Vertrag den Status „Erstellt" erhält, wechselt der Kundenstatus auf „Temporär". Wird der Vertrag anschließend bestätigt, wechselt der Kundenstatus auf „In Bestätigung". Im nächsten Schritt werden derzeit Testdaten für die SAP-Debitorennummer und den Lastschriftcode bereitgestellt. Sobald diese vorliegen und alle übrigen bei der Vertragserstellung definierten Bedingungen erfüllt sind, geht der Vertrag vom Status „Wartet auf Aktivierung" in den Status „Aktiv" über. Mit der Aktivierung des Vertrags wird auch der Kunde auf „Aktiv" gesetzt. Die Statuswechsel von „Inaktiv" auf „Aktiv" bzw. auf „Temporär" bei der Vertragserstellung sind zudem als Prüffälle vorgesehen.

**Zahlungsinformationen**

Die Zahlungsinformationen bestehender Kunden sind nicht bearbeitbar, wenn der Kundenstatus „Aktiv" oder „In Bestätigung" lautet. Dieses Verhalten wurde in der Kundenverwaltung korrigiert, da der Bereich zuvor bei aktiven Kunden noch editierbar war. Bei der Vertragserstellung sollen die Zahlungsinformationen bearbeitbar sein, wenn ein abweichender Zahlungspflichtiger hinzugefügt wird.

**Sammelrechnungen in der Vertragserstellung und Kundenverwaltung**

Im Assistenten zur Vertragserstellung lässt sich der Schalter für die Sammelrechnung bei jedem Wechsel mit „Zurück" und „Weiter" aktivieren oder deaktivieren. Unabhängig davon, wie oft der Benutzer zwischen den Schritten wechselt, wird der Wert im Vertrag wie vorgesehen übernommen: Ein aktivierter Schalter bedeutet „Eingeschlossen", ein deaktivierter Schalter „Ausgeschlossen". In der Kundenverwaltung ist außerdem bei einem aktiven Kunden auf der Seite „Alle Informationen anzeigen" im Bearbeitungsmodus das Feld „Globale Sammelrechnungen" nun wie vorgesehen aktiviert.

**Eingeschränkte Ansicht für Händler**

Für die Rolle Händler gilt in der Kunden- und Partnerverwaltung eine eingeschränkte Ansicht. Ein Händler sieht nur Kunden und Verträge, die er unter seiner Outlet-ID angelegt hat. Er kann die Kundendaten, die er unter seiner Outlet-ID angelegt hat, vollständig ändern, mit Ausnahme der Zahlungsdetails. Die IBAN wird ihm in der Kundenverwaltung anonymisiert angezeigt. Diese eingeschränkte Ansicht gilt auch für alle Servicekontakte des jeweiligen Kunden, sofern der Händler den Vertrag angelegt hat.

**Weitere Korrekturen**

Die Anzeige „Heruntergeladen am" wird nun unmittelbar nach dem Herunterladen einer Datei aktualisiert und nicht mehr erst nach einem Neuladen der Seite. Das Zeitstempelformat (UTC) wurde korrigiert. Außerdem wurde ein Fehler behoben, bei dem Kundendaten nicht aktualisiert werden konnten, wenn man nach der Vertragserstellung zur Seite „Kunden- und Zahlungsinformationen" zurückkehrte und Daten wie Name, E-Mail, Telefonnummer oder Adresse änderte, ohne die Option zur Aktualisierung des Mercedes-me-Kontos zu aktivieren. Ebenfalls behoben wurde die nicht funktionierende Mercedes-me-Suche.

**Geplante Validierung von Kundendaten**

Derzeit sind Validierungsprüfungen für Kundendaten, wie sie das FI-System verlangt, noch nicht umgesetzt; das Vorhaben ist zurückgestellt. Vorgesehen ist, Postleitzahl, Umsatzsteuer-Identifikationsnummer und Steuernummer anhand länderspezifischer Regeln zu prüfen, und zwar sowohl bei der Vertragserstellung als auch bei der Änderung eines Kunden in der Kundenverwaltung. Bei ungültigem Format soll eine passende Fehlermeldung erscheinen, und der Kunde darf erst mit gültigen Daten gespeichert werden. Dies soll für Privat- und Geschäftskunden, Händler und gegebenenfalls Lieferanten gelten. Offen ist noch, ob eine generische Lösung sofort oder die Regeln schrittweise je Mandanten-Rollout umgesetzt werden.