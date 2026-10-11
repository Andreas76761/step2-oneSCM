# Batch 918 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung mit Deal ID (Retail of the Future)**

Mit dieser Funktion können Sie ein Preisangebot erstellen und einen Servicevertrag anlegen, wobei eine Deal ID als zentrales Identifikationsmerkmal dient. Kunden können so beim Kauf eines neuen Fahrzeugs über den Ablauf „Retail of the Future" einen Servicevertrag abschließen. Die Deal ID ist ein eindeutiger Code, der von Retail of the Future erzeugt wird. Sie gilt für alle Kundentypen, Branchen, Verkäufer und Geschäftsbereiche (Pkw und Vans). Der Deal ID können bereits ein Modellcode (BM6) mit SA-Codes oder, falls das Fahrzeug schon produziert und im Bestand verfügbar ist, eine Fahrgestellnummer zugeordnet sein. Voraussetzung ist, dass das jeweilige Produkt die Vertragserstellung über die Deal ID unterstützt.

**Vertragsbeginn und Validierung**

Nach der Anmeldung im System starten Sie einen Vertragsvorschlag. Dort wählen Sie den Kundentyp und optional die Branche und geben die Deal ID als Identifikator ein. Die Eingabe wird bereits im Frontend geprüft: Die Deal ID muss aus 36 alphanumerischen Zeichen bestehen und einen Bindestrich enthalten. Weicht die Länge von 36 Zeichen ab, erscheint die Fehlermeldung „Enter a valid Chassis Number, Order Number, Model Code or Deal ID". Besteht die Deal ID die Prüfung, ruft das System über den Vehicle-Microservice die Fahrzeugdaten und über den Products-Microservice passende Produkte, Konfigurationen und Preise ab.

**Produktkonfiguration**

Das System zeigt die verfügbaren Produkte an. Sie konfigurieren gegebenenfalls Kampagnen, optionale Deckungen und den Händlerrabatt. Auf Grundlage der gewählten Konfiguration wird ein Zahlungsplan erzeugt. Anschließend prüft das System, ob der Kunde bereits vorhanden ist (Dublettenprüfung). Kunden- und Zahlungsdaten erfassen Sie, sofern sie nicht bereits vorliegen.

**Übersichts- und Bestätigungsseite**

Sobald die Übersichtsseite erreicht ist, ist der Vertrag angelegt und es wurde eine Referenznummer vergeben. Nicht verfügbare Informationen werden wie im Build-to-Order-Ablauf als „Not yet Available" angezeigt. Im Tab „Vehicle Information" gibt es einen neuen Platzhalter „Deal Id". Wurde der Vorschlag mit einer Deal ID erstellt, wird deren Wert angezeigt. Wurde er mit Modellcode, Bestellnummer oder Fahrgestellnummer erstellt, erscheint dort ein „-". Auch die Dokumentvorlage wurde um die Deal ID erweitert.

Auf dieser Seite können Sie die Erstellung bestätigen, den Ablauf über das „X" abbrechen, eine Vorschau des Vertragsentwurfs ansehen, zum vorherigen Schritt mit den Kunden- und Zahlungsdaten zurückkehren oder Felder über „Edit" bearbeiten, soweit diese Funktion aktiviert ist. Bei der Bestätigung öffnet sich ein Dialog, in dem Sie die Signaturart auswählen. Nach der Auswahl erscheint die zugehörige Meldung und der Vertragsstatus wechselt auf „Waiting for Confirmation". Sobald die Signatur erfasst wurde und die CAS-Prüfung negativ ausfällt, wird der Status auf „Confirmed" gesetzt.

**Umgang mit der Fahrgestellnummer**

Enthält die Deal ID bereits eine Fahrgestellnummer, werden zusätzlich Erstzulassungsdatum (FRD) und Kennzeichen benötigt. Stellt der Vehicle-Microservice die Fahrgestellnummer bereit, wird der Vertrag automatisch aktualisiert. Auf der Landing Page des Proposal Managements ist dann die Schaltfläche „Update" aktiv. Ein Klick darauf öffnet einen Dialog zur Erfassung der fehlenden Daten, danach wird der Aktivierungsprozess fortgesetzt. Enthält die Deal ID noch keine Fahrgestellnummer, bleibt die Schaltfläche „Update" deaktiviert, bis der Vehicle-Microservice die Fahrgestellnummer liefert; der Prozess wird dann fortgesetzt. Sind alle erforderlichen Daten (Kennzeichen, FRD) erfasst und alle Prüfungen in Ordnung, aktiviert das System den Vertrag, erzeugt i155 und benachrichtigt den Revenue-Microservice sowie Nemesis.

**Weitere Anpassungen der Oberfläche**

In der Vehicle-Ansicht der Vertragsdetails im Proposal Management und im Contract Management gibt es neue Platzhalter für „Deal ID" und „Created On"; das Datum wird gemäß den Market Settings dargestellt. Die Platzhalter „Tire Type" und „Chassis Type" rücken in die nächste Zeile. Auf der Hauptseite wird ein Link zur OTR-Seite ergänzt, ähnlich dem Link „Access Xentry Portal". Grafik und Design entsprechen den Vorgaben des Mercedes-Benz Workbench.