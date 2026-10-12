# Batch 1022 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsübersicht in der Vertragserstellung (Contract Generation)**

Die Übersichtsseite eines Vertrags öffnen Sie, indem Sie auf der Startseite der Vertragserstellung auf die Vertragsnummer klicken. Sie ermöglicht es der Marktorganisation, die Vertragsdetails einzusehen und bei Bedarf weitere Aktionen auszuführen. Die Seite entspricht weitgehend der Vertragsübersicht aus dem Vertragsmanagement, weist aber einige Unterschiede auf.

Im Kopfbereich finden Sie eine Zurück-Schaltfläche, die Sie zur Startseite der Vertragserstellung zurückbringt, sowie die Nummer des geöffneten Vertrags. Außerdem steht dort ein Status-Dropdown mit den Optionen „Aktivieren" (ACTIVATE) und „Stornieren" (CANCEL) zur Verfügung. Darunter bleibt ein feststehender Kopfbereich sichtbar, der den Kundennamen, den Vertragsstatus (Created, Declined, Waiting for Activation oder Canceled), die Vertragslaufzeit in Monaten (z. B. 04.04.2023 – 03.04.2027, 48 Monate), den Namen des gewählten Produkts, die Verkaufsbezeichnung des Fahrzeugs und die Fahrgestellnummer anzeigt.

Die weiteren Informationen sind auf mehrere Registerkarten verteilt. Die Registerkarte „Vertragsdetails" zeigt die jährliche Fahrleistung, den Kilometerstand bei Vertragsbeginn, die geplante Gesamtfahrleistung, das Vertragsbeginn- und das geplante Vertragsende sowie die geplante Vertragslaufzeit in Monaten. Die Registerkarte „Fahrzeugdetails" enthält Marke, Sparte, Modell, Baumuster, Fahrgestellnummer, FIN, VIN, Datum der Erstzulassung (FRD), Kennzeichen und aktuellen Kilometerstand. Unter „Kundendetails" sehen Sie Kundentyp, Kundennummer (über die Kunden-ID vergeben und für jeden Kunden eindeutig), Kundenname, Umsatzsteuer-Klassifizierung, vollständige Adresse (Straße, Adresszusatz, Hausnummer, Postleitzahl, Ort, Land) sowie Mobil- und Festnetznummer und E-Mail-Adresse.

Die Registerkarte „Produktdetails" nennt die Vertriebspartner-ID (GSSN+), das Bestätigungsdatum und das Quellsystem bzw. den Kanal, etwa OneSCM. In den „Zahlungsdetails" werden Zahlungsdauer, Zahlungsintervall (z. B. monatlich) und die Rate pro Intervall inklusive Mehrwertsteuer angezeigt; der Teil zur Rechnungsstellung ist hier ausgenommen. Die Registerkarte „Historie" umfasst ausschließlich die Änderungshistorie der Vertragsstatus, nicht die VEGA-Historie, da ein Vertrag erst nach der Aktivierung an VEGA übermittelt wird. Angezeigt werden der alte Status (z. B. Created, Declined, Waiting for Activation), der neue Status (z. B. Active, Cancelled), das Datum der Statusvergabe und der Benutzername.

Die Registerkarte „Dokumente & Benachrichtigungen" ist für PI2 vorgesehen. Im Dokumentenbereich steht ein Link zum Herunterladen des Vertrags bereit; die Allgemeinen Geschäftsbedingungen können gedruckt oder per E-Mail versendet werden. Im Benachrichtigungsbereich erscheinen die Aktivierungs-E-Mail mit Datum, Status und den Aktionen Drucken und erneut Senden sowie die Bestätigungs-E-Mail mit Datum, Status und der Aktion Drucken.

Für die erste Produktversion (MVP) sind die Angaben in den Registerkarten nicht bearbeitbar. Weitere Aktionen werden nach dem MVP festgelegt. Die Gestaltung folgt dem Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Status „Declined" in der Vertragserstellung**

Damit jederzeit nachvollziehbar ist, welche Verträge nicht aktiviert wurden und warum, wird jedem erstellten Vertrag ein eindeutiger Status zugewiesen. Voraussetzung für einen Wechsel zu „Declined" ist, dass sich der Vertrag im Status „Created" befindet. Mögliche Auslöser sind die Ablehnung durch den Kunden oder der Ablauf der Gültigkeit, der im MVP eine Stunde beträgt.

Zwischen den Status „Created" und „Confirmed" gelten folgende Regeln: Schließt der Kunde den Browser oder endet die Browser-Sitzung, geschieht nichts, und der Vertrag bleibt im Status „Created". Ist die Sitzung aktiv und bestätigt der Kunde den Vertrag nicht innerhalb einer Stunde nach der Erstellung (ausschließlich für den MVP), wird der Vertrag auf „Declined" gesetzt. Dasselbe gilt, wenn der Kunde den Assistenten zur Vertragserstellung abbricht. Eine Benachrichtigung des Kunden erfolgt dabei nicht.

Auf der Startseite der Vertragserstellung werden Verträge im Status „Created" als „Created", abgelehnte Verträge als „Declined" und bestätigte Verträge als „Waiting for Activation" angezeigt. Wechselt ein Vertrag seinen Status, wird die Anzeige auf der Startseite entsprechend aktualisiert.