# Batch 991 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Optionale Deckungen im Produktvergleich**

Im Vertragsangebot können Händler, Market-Operation-Nutzer (MO) und MPC-Nutzer nach Eingabe eines Identifiers passende Produkte mit Preisen, Konfigurationen sowie enthaltenen und optionalen Deckungen abrufen. Aus dieser Auswahl lassen sich zwei oder drei Produkte in einer Vergleichstabelle gegenüberstellen. Die Tabelle zeigt nun zusätzlich alle für die verglichenen Produkte verfügbaren optionalen Deckungen. Für jede Deckung wird ein „ab“-Preis angezeigt, und die Deckung kann direkt ausgewählt werden. Sobald eine oder mehrere optionale Deckungen gewählt sind, aktualisiert sich die Preiskonfiguration und der Zusatz „ab“ entfällt.

Wählt der Nutzer über die Schaltfläche „Auswählen“ ein Produkt aus, gelangt er in die Produktdetailansicht. Dort sind die Konfigurationsfelder vorbelegt, die Händlerprovision wird unter Einbeziehung der gewählten Deckungen aktualisiert, und der Zahlungsplan kann aktiviert werden. Die ausgewählten optionalen Deckungen erscheinen unterhalb der Produktbeschreibung. Öffnet der Nutzer die Funktion „Optionale Deckungen hinzufügen“, sind die im Vergleich gewählten Deckungen bereits angehakt. So kann dem Endkunden ein vollständiges Angebot präsentiert werden. Die Gestaltung folgt der Mercedes-Benz Workbench.

**Vertrag im Namen eines Händlers erstellen**

Bisher konnten angemeldete Nutzer Verträge nur im eigenen Namen anlegen. Nun können Market-Operation- und MPC-Nutzer Serviceverträge erstellen und einem bestimmten Händler zuweisen, sodass dieser die Provisionen erhält und die Nachbetreuung des Kunden übernimmt.

Der Ablauf beginnt mit der Anmeldung als MO- oder MPC-Nutzer, der Auswahl des Kundentyps und der Eingabe des Identifiers, gegebenenfalls ergänzt um einen weiteren Identifier (Baumuster-Fall). Nach Auswahl und Konfiguration des passenden Produkts folgt die Erfassung der Kunden- und Zahlungsinformationen. Am Ende dieses Bereichs steht ein neuer Abschnitt „Dealer Information“, der nur für MO- und MPC-Nutzer sichtbar ist, nicht für Händler. Er enthält die Pflichtfelder E-Mail-Adresse (mit Formatprüfung), Name des Autohauses und Stadt. Die beiden letztgenannten sind Auswahllisten, sofern mehrere Optionen vorhanden sind. Das Feld für den Namen des Verkäufers ist ausgegraut. Nach Eingabe der E-Mail-Adresse werden über Alice alle zugehörigen Outlet-Hauptnamen (Autohausnamen) abgerufen.

Anschließend wird der Vertrag erzeugt und erhält eine Vertragsnummer. Die berechnete Provision sowie ein erfasster Händlerrabatt werden dem ausgewählten Verkäufer zugeordnet. Der Vertrag ist für den Verkäufer und die Outlet-ID, zu der er gehört, sichtbar: vor der Aktivierung in der Vertragserstellung (Contract Generation), danach im Vertragsmanagement. Danach wird der Vertrag auf „Wartet auf Bestätigung“ gesetzt. Nach Erfassung der Unterschrift erhält er den Status „Bestätigt“. Wählt der Kunde die gedruckte Vertragsversion, übernimmt der Händler das Scannen und Hochladen der Dokumente in oneSCM. Bei der Aktivierung werden E-Mail-Benachrichtigungen an die erstellende MO, den zugewiesenen Händler und den Endkunden versendet. Zusätzlich erhält das Revenue-Team eine Benachrichtigung mit den Händlerdaten für Provisionen und Rabatte. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Zahlungsplan-Vorschau mit Tooltip**

In der Vorschau des Zahlungsplans während der Vertragserstellung wurden umverteilte Monate bisher mit dem Wert 0 dargestellt. Zum besseren Verständnis der Umverteilung erscheint nun über den Zellen mit dem Bruttobetrag von 0 EUR ein Tooltip mit dem Text „This month's payment is reallocated to the rest of the Payment Plan“.