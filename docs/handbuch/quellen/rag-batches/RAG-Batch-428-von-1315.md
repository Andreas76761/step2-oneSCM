# Batch 428 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Digitale Signatur: neue DSS-Funktionen (Stufe 2)**

Beim Verkauf eines Vertrags kann der Verkäufer das Vertragsdokument künftig auf mehreren Wegen unterschreiben lassen. Zur Auswahl stehen die elektronische Signatur per DSS mit E-Mail und Einmalpasswort (OTP), die elektronische Signatur vor Ort auf dem Gerät des Händlers, auf dem oneSCM läuft (mit Unterschrift per Zeichnen), sowie das Ausdrucken des Dokuments.

Im Vertragserstellungsprozess bestätigt der Händler, die Marktorganisation (MO) oder das MPC auf der Übersichtsseite den nächsten Schritt mit der Schaltfläche „Bestätigen“. Daraufhin erscheint ein Fenster, in dem genau eine Signaturmethode ausgewählt werden kann. Zusätzlich lässt sich ein Ausdruck auf Papier wählen. In diesem Fall wird ein Druckauftrag mit dem Service-Vertrag als PDF gesendet, und zwar ohne MB-Signaturen und ohne Entwurfs-Wasserzeichen.

Bei der DSS-Variante erhält der Kunde per E-Mail einen Link. Nach dem Öffnen fordert er einen OTP-Code an, den er auf seinem Mobiltelefon erhält. Nach Eingabe des korrekten Codes wird er zur Unterschrift des Dokuments weitergeleitet. Das signierte Dokument wird im DSS-Archivierungssystem gespeichert. Der Händler, der den Vorgang gestartet hat, erhält eine E-Mail mit dem signierten Dokument und den zugehörigen Informationen.

Bei der Vor-Ort-Variante unterschreibt der Kunde persönlich auf einem Gerät am Verkaufspunkt, zum Beispiel einem Apple iPad mit Apple Pencil. Danach wird das Dokument im DSS-Archiv gespeichert und im Reiter „Kommunikation“ angezeigt. Hierfür ist eine Integration von DSS On Premise in oneSCM erforderlich.

Wählt der Benutzer „Dokument drucken“, öffnet sich der Druckauftrag, und das Dokument wird mit MB-Signaturen gedruckt. Elektronisch signierte Dokumente liegen im DSS-Archiv und erscheinen nach erfolgreicher Signatur im Reiter „Kommunikation“.

**Systeminterne Benachrichtigungen (Teil 1: erweiterte Funktionen inklusive Zuweisung)**

Das System sendet automatisch Benachrichtigungen zu Aktionen, die Aufmerksamkeit erfordern, an Benutzer der Marktorganisation. Der Benutzer, der die Aktion ausgelöst hat, ist davon ausgenommen. Die Benachrichtigung enthält Details zur zu prüfenden Aktion und einen Link zur betreffenden Aufgabe.

Neu ist die Möglichkeit, eine Aufgabe einer bestimmten Person zuzuweisen. Dadurch wird die Zuständigkeit klar geregelt. Zuweisen können Benutzer der Marktorganisation oder des MPC, und zwar an andere Benutzer der Marktorganisation oder des MPC. Ein Beispiel ist die Überschreitung eines Schwellenwerts bei manuellen Rechnungen: Das System benachrichtigt einen Benutzerpool, und ein Benutzer weist die Aufgabe dann jemandem zu.

Zum Zuweisen klickt der Benutzer auf „@unassigned“ und gibt einen Namen ein. Ein Dropdown schlägt während der Eingabe passende Personen vor, gesucht wird nach Vor- und Nachname oder Benutzer-ID. Die Suche beginnt nach drei Zeichen, Sonderzeichen sind nicht zulässig.

Nach der Zuweisung sieht nur die zugewiesene Person die Benachrichtigung. Sie erhält außerdem eine E-Mail, die sie über die Zuweisung informiert, mit den relevanten Details und einem Link. Über „Go to Invoice“ gelangt sie zur Rechnungsseite, die sie freigeben muss, oder zur Kampagne.

**Benachrichtigungsvorlage: Kündigung aus dem Transfer-Prozess**

Wenn im Transfer-Prozess eines Service-Vertrags der neue Kunde bei der CAS-Prüfung positiv getroffen wird, informiert das System die Benutzer der Marktorganisation automatisch per E-Mail. Die CAS-Prüfung für den neuen Kunden wird im Transfer-Prozess durchgeführt, ausgelöst durch die Initiierung des Transfers aus dem Vertragsmanagement. Bei einem positiven Treffer wird der betroffene Vertrag automatisch in den Status „TERMINATED (014)“ (vorzeitige Beendigung) versetzt. Die E-Mail geht an die Marktorganisation und nicht an den Kunden und enthält den vorgesehenen Text.