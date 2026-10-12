# Batch 1098 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation – Änderungen im Überblick**

**Angebotsgültigkeit und Statuslogik**
Die Logik der Angebotsgültigkeit wurde angepasst. Bisher wurde der Wert der Angebotsgültigkeit für die Varianten „Available Chassis Number", „Build to Stock" und „Build to Order" gesetzt, sobald sich der Vertrag im Status „CREATED" befand. Der zugehörige Scheduler startete bei „Available Chassis Number" ebenfalls im Status „CREATED", bei „Build to Stock" und „Build to Order" dagegen erst im Status „Waiting for Activation". Nun gilt für alle drei Varianten einheitlich: Der Wert der Angebotsgültigkeit wird zugewiesen, sobald sich der Vertrag im Status „Waiting for Confirmation" befindet, und der Scheduler startet ebenfalls in diesem Status.

**Zahlungsplan, Kampagnen und Zahlungsabwicklung**
Für MBLD-Serviceverträge werden Zahlungspläne nicht mehr bei der Vertragsaktivierung auf Basis des FRD (bei FRD-bezogenen Produkten) oder des Erstellungsdatums (bei nicht FRD-bezogenen Produkten) erzeugt. Stattdessen gilt für alle Zahlungspläne das Erstellungsdatum als Startdatum. Ändert MBLD die Produktkonfiguration oder etwas anderes, das den ursprünglichen Preis beeinflusst, wird der Zahlungsplan mit dem aktuellen Wert und unter Berücksichtigung des Erstellungsdatums neu erzeugt.

Bei Produkten, auf die automatisch eine Kampagne angewendet wird („Auto Apply"), können keine weiteren Kampagnen hinzugefügt werden. Die Bereiche „Campaigns" bzw. „Manage Campaigns" werden in diesem Fall daher gar nicht mehr angezeigt, auch nicht ausgegraut.

Im MPay-Ablauf wird das Zahlungsfeld nicht mehr angezeigt, nachdem die Kartendaten eingegeben wurden und das Angebot den Status „Waiting for Confirmation" erhalten hat. Zuvor blieb das Feld sichtbar, sodass dem Link erneut gefolgt oder der QR-Code erneut gescannt werden konnte.

Für Kampagnen in einer Kulanzfrist (Grace Period) gilt: Bei der Vertragserstellung werden die Preise ohne Kampagnen-ID berechnet, auch wenn die Kampagnen-ID in der Anfrage zur Vertragserstellung mitgesendet wird. Die Preise mit Kampagnen-ID werden erst angewendet, nachdem die Kampagne genehmigt wurde.

**Kundensuche und Fahrzeugdaten**
Die Suche nach Kunden per E-Mail-Adresse wird auf den jeweiligen Markt begrenzt. Sucht ein MO oder MPC nach einem Händler per E-Mail, erhält er nur Händlerbetriebe aus dem aktuellen Markt.

Wird über ein Kafka-Ereignis ein Vertrag mit einem bestimmten Fahrgestell übermittelt, werden der zuletzt bekannte Kilometerstand und das zugehörige Datum für alle Verträge mit demselben Fahrgestell aktualisiert. Hat ein Vertrag den Status „Aktiv" noch nicht erreicht und ist der geplante Kilometerstand erreicht, wird der Vertrag abgelehnt. Ist der Vertrag aktiv und der geplante Kilometerstand erreicht, läuft der Vertrag ab.

**Fußzeile**
Die Fußzeile wurde angepasst. „Privacy Policy External" und „General Legal Notice" werden dort nicht mehr aufgeführt, bleiben aber in den Markteinstellungen erhalten. Die Fußzeile enthält nun vier Bereiche: Imprint, Privacy Policy, Terms of Use und Licenses.

**Noch nicht umgesetzt (On Hold)**
Für über Edge erstellte Online-Sales-Verträge ist vorgesehen, dass bei der Kundensuche ein exakter Treffer anhand folgender Merkmale zurückgegeben wird: Vorname, Nachname, Mobilnummer, E-Mail-Adresse, IBAN, Personal ID (bei privaten Kunden in Märkten, in denen dieses Feld verpflichtend ist) sowie USt-IdNr. bzw. Steuernummer (bei gewerblichen Kunden). Dafür soll die API für die exakte Suche mit Vorname, Nachname, E-Mail-Adresse und Telefonnummer verwendet werden. Wird zusätzlich die IBAN für den exakten Treffer benötigt, ist eine weitere API erforderlich. Diese Anforderung ist derzeit pausiert.