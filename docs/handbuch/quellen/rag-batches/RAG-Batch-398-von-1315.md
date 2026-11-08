# Batch 398 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 23 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation: Änderungen und Hinweise zum Release**

**Vorlagen und Benachrichtigungen**

Vorlagen und Benachrichtigungen wurden an die aktuellen BDS-Standards angepasst. Zuvor orientierten sie sich an einem veralteten Standard. Ziel der Umstellung war, alle Benachrichtigungen und Dokumente auf den neuen Stand zu bringen. Außerdem wurde die E-Mail-Benachrichtigung so angepasst, dass sie in den fünf in Deutschland am häufigsten genutzten E-Mail-Clients wie vorgesehen dargestellt wird. Dazu zählen Web.de, GMX, Gmail, Outlook und Yahoo. Bei Privat- und Gewerbekunden liegt Gmail in Deutschland vorn, gefolgt von Web.de und Outlook. Im B2B-Bereich ist Web.de der meistgenutzte Anbieter, gefolgt von GMX und Gmail. Behoben wurden zudem ein Fehler, durch den Markt und Division nicht korrekt aus der Auswahlliste geladen wurden, sowie ein Problem mit ungültigen Zeichen in der Vorlage für Gewerbekunden. Außerdem wurde eine Korrektur umgesetzt, die sich auf die Erstellung von Vertragsvorlagen bezieht, die gleichzeitig für die Aktivierung und für Preisinformationen verwendet werden.

**Überarbeitung der Oberfläche und Navigation**

Die Bedienelemente wurden in mehreren Bereichen vereinheitlicht. In der Kundenverwaltung entfallen auf der Seite zur Ansicht eines Privatkunden die Reiter für Privat- und Gewerbekunden. Die Schaltfläche „Abbrechen" trägt ein X-Symbol, ist stets eine sekundäre Schaltfläche und zeigt beim Darüberfahren einen Tooltip mit der Bezeichnung „Abbrechen". „Bearbeiten" ist mit einem Stift-Symbol gekennzeichnet und zeigt ebenfalls einen Tooltip. In der Ansicht eines Privatkunden ist sie eine primäre Schaltfläche.

Beim Anlegen eines Gewerbekunden gelten dieselben Regeln für „Abbrechen" und „Bearbeiten", wobei „Bearbeiten" dort eine sekundäre Schaltfläche ist. Zusätzlich gibt es „Erstellen" mit einem Haken-Symbol als primäre Schaltfläche mit Tooltip. Im letzten Schritt des Assistenten ersetzt sie die Schaltfläche „Weiter".

In der Vorlagenverwaltung gilt dies für das Erstellen von Dokumenten und Benachrichtigungen. „Abbrechen" ist sekundär und mit einem X versehen. „Vorschau" ist sekundär und mit einem Augen-Symbol gekennzeichnet. „Veröffentlichen" ist primär und mit einem Haken-Symbol markiert. Alle drei Schaltflächen zeigen beim Darüberfahren einen Tooltip mit ihrer Bezeichnung.

**Geplante und in Prüfung befindliche Funktionen**

Eine interne Benachrichtigung zum Status „Gesperrt" (Suspend) war vorgesehen, wurde aber abgebrochen und ist daher nicht Teil dieses Releases. Sie sollte Benutzer der Vertragsverwaltung (MO/MPC) informieren, wenn ein Vertrag gesperrt wird. Ein solcher Status kann entweder durch eine manuelle Sperr-Aktion in der Vertragsverwaltung oder durch einen Batch-Job mit dem FI-System entstehen.

Die Erweiterung der Stammdatenvorlage für Servicevertragsvorlagen wird derzeit getestet. Geprüft wird, ob Benutzer eine Vertragsvorlage mit den neuen Druckvariablen als Entwurf speichern und veröffentlichen können. Außerdem wird kontrolliert, ob der Preis, die Liste der enthaltenen und optionalen Leistungen sowie die ISP-Details in der Vorlage angezeigt werden.

Ebenfalls im Test ist das Hochladen unterschriebener Serviceverträge oder anderer Dokumente. Geprüft wird, dass der Händler (MO/Dealer) direkt nach der Vertragserstellung sowie im Dokumenten-Reiter Dokumente hochladen kann. Nur Vertragsdokumente, nicht aber Angebote, enthalten einen QR-Code für den Händler am oberen und einen für den Kunden am unteren Rand. Ein Scan des oberen Codes führt zu den Vertragsdetails. Der untere Code soll es dem Kunden ermöglichen, vor Ort zu unterschreiben. Wird ein Dokument mit nicht lesbarer Unterschrift hochgeladen, erscheint es in den MO-Prüfungen als „NOT OK".

Die Dokumentenaktionen bei der Erstellung wurden geprüft. Benutzer können jeden Dokumenttyp herunterladen und jeden Dokumenttyp außer dem Servicevertrag löschen. Andere Dokumente lassen sich durch Hochladen eines neuen Dokuments ersetzen, wobei das System den ausgewählten Dokumenttyp automatisch ausfüllt.

Weitere Tests, darunter der Testplan für Sprint 5.4 und die manuelle Testausführung für die B2B-Vorlagenverwaltung, sind noch offen.