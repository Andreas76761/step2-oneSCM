# Batch 629 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Änderungen und Hinweise**

**Mercedes me bei der Vertragserstellung (Privatkunden)**
Für Händlerbenutzer wurde die Oberfläche der Vertragserstellung um die Funktion „Mercedes me" erweitert. Sie steht ausschließlich für Privatkunden zur Verfügung. Wie sich die Funktion verhält, hängt davon ab, ob der Benutzer in den Details des Privatkunden den Mercedes-me-Schalter aktiviert hat.

Wird der Schalter in den Privatkundendetails aktiviert, gelangt der Benutzer im nächsten Schritt zur Seite „Kunden- und Zahlungsinformationen". Dort erscheint am Seitenende der Mercedes-me-Schalter im ausgeschalteten Zustand mit der Beschriftung „Update Mercedes me account with the information above". Ändert der Benutzer auf dieser Seite in den Adressdaten das Feld „Land", wird der Schalter deaktiviert dargestellt. Die Beschriftung lautet dann „Address details can be updated only inside the same country". Ein Info-Symbol mit dem Hinweis „Updating with a different country blocks the syncronisation with Mercedes me" erläutert, dass die Aktualisierung mit einem anderen Land die Synchronisation mit Mercedes me blockiert. Hat der Kunde tatsächlich kein Mercedes-me-Konto, zeigt die Seite den Schalter im ausgeschalteten Zustand mit der Beschriftung „I have obtained the customer's consent to create an account for them". Damit bestätigt der Benutzer, dass die Einwilligung des Kunden zur Kontoerstellung vorliegt.

Wird der Schalter in den Privatkundendetails nicht aktiviert, erscheint auf der Seite „Kunden- und Zahlungsinformationen" ebenfalls der ausgeschaltete Mercedes-me-Schalter mit der Beschriftung „I have obtained the customer's consent to create an account for them".

**Löschkonzept auf Kundenebene**
Es wurde ein Löschkonzept für Kunden- und Vertragsdaten erarbeitet, das der Einhaltung der Datenschutz-Grundverordnung (DSGVO) dient, insbesondere dem „Recht auf Vergessenwerden". Es gilt für B2B- und B2C-Kunden, also gewerbliche und private. Das System soll Daten, die ihren Zweck der Verwaltung eines Servicevertrags erfüllt haben, nicht länger speichern.

Als Regel gilt: Sobald das Ende der Angebotsgültigkeit zuzüglich sechs Monate überschritten ist, werden Verträge und die zugehörigen Kundendaten endgültig gelöscht. Dabei wird auf Kundenebene geprüft, ob dem Kunden noch Verträge zugeordnet sind. Die Löschung ist über Batch-Jobs vorgesehen, die automatisch nach einem festgelegten Zeitplan laufen. Für die Angebotslöschung ist ein monatlicher Lauf vorgesehen, für abgeschlossene Verträge ein jährlicher. Nach jedem Lauf wird eine Protokolldatei der gelöschten Objekte erzeugt, die der Benutzer herunterladen kann. Sie enthält die Kunden-ID, den Objekttyp (Kunde oder Vertrag), den Status (gelöscht), gegebenenfalls das Vertragsende sowie die Gesamtzahl der gelöschten Objekte. Die Aufbewahrungsdauer dieser Protokolldatei ist in den Unterlagen uneinheitlich angegeben (ein bzw. zwei Jahre) und sollte vor Veröffentlichung geklärt werden.

Zusätzlich ist vorgesehen, Kunden, die über die Oberfläche zunächst nur weich gelöscht wurden, nach 30 Tagen endgültig zu löschen, sofern auf Kundenebene mindestens eine aktive IBAN vorhanden ist. Dokumente im Dokumentenmanagement werden gelöscht, indem sie über die Funktion „update document" auf den Status „deleted" gesetzt werden.

**Behobene Probleme**
In diesem Bereich wurden mehrere Fehler behoben und abgeschlossen: Die Neuanlage eines nicht registrierten Händlers funktionierte nicht, die Fuzzy-Suche erschien zu spät im Ablauf, und nicht alle Markteinstellungen wurden in der Anwendung übernommen. Ein gemeldetes Problem mit vertauschtem Vor- und Nachnamen in der Vertragsübersicht wurde nicht weiterverfolgt und abgebrochen.

**Noch offene Testaktivitäten**
Für Sprint 5.3 in PI5 stehen noch manuelle Tests aus. Sie betreffen die Händlerzuordnungstabelle zur manuellen Werkstattrechnung, den SEPA-Lastschriftcode zwischen oneSCM und oneERP, das Anlegen und Aktualisieren von Kunden in oneERP, den B2B-Vertragserstellungsablauf in der Oberfläche, die B2B-Vorlagenverwaltung sowie den Dokumenten-Upload in Mercedes me.