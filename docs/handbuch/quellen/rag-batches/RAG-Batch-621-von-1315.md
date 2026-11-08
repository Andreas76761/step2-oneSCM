# Batch 621 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 32 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung**

Der FI-System-Status von Kunden wird jetzt in oneSCM gespeichert. Sobald oneERP die Statusdaten für Privat- und Geschäftskunden übermittelt, werden sie in der oneSCM-Datenbank abgelegt. Damit können Kunden, die vom FI-System gesperrt wurden, an weiteren Geschäftsvorgängen wie Vertragsverkauf oder Abrechnung gehindert werden. Der Status ist ausschließlich für MO-Benutzer in der Oberfläche sichtbar. Auf der Kundendetailseite finden Sie den FI-System-Status im Bereich „FI Receivables".

MO-Benutzer werden über Änderungen des FI-System-Status benachrichtigt, damit sie die nötigen Maßnahmen ergreifen können. In der Navigationsleiste erscheint dazu ein Glockensymbol mit der Anzahl der Benachrichtigungen. Die Anzeige zählt bis 9; bei mehr Benachrichtigungen wird „9+" dargestellt. Ein Klick auf die Glocke öffnet rechts das Benachrichtigungscenter, das über die Art der anstehenden Aufgaben informiert. Jede Benachrichtigung ist mit der zugehörigen Seite verlinkt, und Benachrichtigungen, die eine Aktion erfordern, sind mit einem blauen Punkt markiert. Das Center lässt sich über das X schließen, wodurch Sie zur vorherigen Ansicht zurückkehren. Wurde eine Benachrichtigung nur angesehen, ohne dass eine Aktion erfolgte, wird sie nicht mehr am Glockensymbol angezeigt, kann aber später wieder aufgerufen werden. Als gelesen gilt sie und wird aus dem Panel entfernt, sobald Sie die Kundenvorschau oder die Kundendetailseite öffnen. Mit der Benachrichtigung wird automatisch auch eine E-Mail an Market Operation versendet.

Eine einzelne Benachrichtigung lautet „Customer <Kundenname> is <Status>" und enthält den Link „Go to Customer". Bei mehreren Benachrichtigungen erscheint „Multiple customers are <status>" mit dem Link „Go to Customers". Für Privat- und Geschäftskunden werden unterschiedliche Benachrichtigungen angezeigt. Ist der Kunde archiviert oder gesperrt, gelangen Sie bei einer Einzelbenachrichtigung zur Ergebnisseite der Kundenverwaltung, wobei der betreffende Kunde vorausgewählt und seine Details in der Vorschau geöffnet sind. Über „See All Information" gelangen Sie zur Kundendetailseite.

Auch bei ausgesetzten Verträgen werden MO-Benutzer über das Glockensymbol benachrichtigt, ebenfalls mit automatischer E-Mail an Market Operation. Eine einzelne Benachrichtigung lautet „Contract <Referenznummer> is <Status>" mit dem Link „Go to Contract", mehrere Benachrichtigungen lauten „Multiple Contracts are <status>" mit dem Link „Go to Contracts". Bei einer Einzelbenachrichtigung öffnet der Link die Vertragsdetailseite mit aktiviertem Historie-Tab, bei mehreren die Ergebnisseite der Vertragsverwaltung. Diese Benachrichtigungen gelten als gelesen und werden entfernt, sobald Sie die Vertragsdetailseite öffnen.

Für die Vertragserstellung gilt: Archivierte Kunden werden wie Neukunden behandelt, Verträge gesperrter Kunden werden an die MO-Prüfungen weitergeleitet, und bei allen anderen Status ändert sich der Ablauf nicht. MO wird dabei per E-Mail und interner Benachrichtigung informiert.

**Korrekturen bei MO-Prüfungen und CAS**

In den MO-Prüfungen wurden mehrere Fehler behoben. Der FI-System-Status wird nun korrekt auf „Gesperrt" gesetzt und bei bereits gesperrten Bestandskunden richtig dargestellt. Der SAP-Debitorenstatus wird nach der automatischen Übernahme des Werts aus oneERP korrekt auf „Ok" gesetzt. Außerdem wechselt der Status bei Kunden mit möglichem Treffer, die im CAS auf der Sperrliste stehen, nun zu „CAS check Positive", und der Vertrag erhält den Blacklist-Status für im CAS gesperrte Kunden. Ist die CAS-Prüfung negativ (Blacklist), werden die Kundendaten nicht mehr an das FI-System (NACOS und oneERP) gesendet. Beim Klick auf den Lastschriftcode und weiter zum Kunden öffnet sich die Kundenseite nun korrekt.

**Mercedes me und Eingabefelder**

Bei ungültiger Mobilnummer erscheint die Meldung „Validation error from Mercedes me '+**********77' is not a valid mobile number." Der Feature-Toggle für Mercedes me wurde entfernt. Werden Änderungen auf Kundenebene vorgenommen und ist der Schalter zur Aktualisierung aktiviert, erhalten Sie einen Hinweis, dass Vor- und Nachname in Mercedes me nicht aktualisiert werden; ein Tooltip am Schalter weist ebenfalls darauf hin. Die Felder für Vor- und Nachname akzeptieren nur englische und deutsche Zeichen. Die Fehlermeldung bei ungültiger Postleitzahl wird nicht mehr nur eine Sekunde lang angezeigt, die Meldung zur E-Mail-Validierung wurde präzisiert, und die Sprachoptionen Italienisch und Französisch wurden aus der Sprachauswahl entfernt.

**Kundendaten und IBAN**

Händler können die IBAN eines bestehenden Kunden während der Vertragserstellung nicht mehr direkt ändern. MO-Benutzer können Änderungen an Geschäftskunden auch dann speichern, wenn die IBAN geändert wurde, und können Geschäftskundendaten während der Vertragserstellung wieder aktualisieren. Beim Bearbeiten von Kundendaten bei Verträgen im Status „CREATED" erscheint kein Authentifizierungsfehler mehr. Ein Fehler in der Dublettenprüfung für Kunden wurde behoben.

**Händlerverwaltung**

Beim Bearbeiten des Markttyps eines Händlers tritt der Fehler „Authentication forbidden" nicht mehr auf. Die Bearbeitung von Marktyp und Ländercode-ID ist möglich, und Ländercode-IDs werden beim Datei-Upload übernommen. Benutzer mit der MPC-Rolle können Händlerdateien hochladen, ohne einen Authentifizierungsfehler zu erhalten. Zudem wurde eine fehlende englische Übersetzung für die Meldung zur nicht autorisierten Outlet-ID ergänzt.