# Batch 524 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 24 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Neuerungen und Änderungen im Überblick**

**Benutzeroberfläche**

Die automatisierten UI-Tests werden marktfähig gemacht, sodass Ausführung und veröffentlichte Testberichte nicht mehr auf Verhalten ausgerichtet sind, das nur für den deutschen Markt gilt. Zunächst werden Deutschland und die Slowakei berücksichtigt. Die Testausführung richtet sich nach der Markt- bzw. Länderkonfiguration, unabhängig von der gewählten Umgebung. Smoke-Tests sollen für jeden unterstützten Markt ausgeführt und veröffentlicht werden können. Die in gh-pages veröffentlichten Berichte unterscheiden den ausgeführten Markt klar, und Ergebnisse verschiedener Märkte überschreiben sich weder noch werden sie uneindeutig vermischt. Konfiguration, Ausführungsschritte und Berichtsverhalten werden dokumentiert, und die Lösung soll sich ohne Neugestaltung des Ausführungsmodells um weitere Märkte erweitern lassen. Dieses Vorhaben befindet sich derzeit noch in der Entwicklung.

Außerdem ist die Anbindung der API-E2E-Testpakete an das ONESCM Quality Dashboard geplant, derzeit noch offen. In der ersten Phase zeigt das Dashboard ausschließlich den Status, also bestanden oder fehlgeschlagen, die Anzahl der Tests, den Zeitpunkt des letzten Laufs und einen direkten Link zum jeweiligen GitHub-Actions-Lauf, in gleicher Darstellung wie die bestehenden UI-Testkarten. Vorgesehen sind sieben Services (Edge Service, Contract, Revenue Management, Document Management, Vehicle Management, Customer und Product Management) in den Umgebungen DEV und INT, insgesamt also 14 neue Karten. Ein vollständiger Allure-Bericht folgt in einer späteren zweiten Phase. Im Zuge dessen werden vier bei der Analyse entdeckte Fehler behoben: Karten neuer Testpaket-Typen wurden keinem Bereich zugeordnet und waren dadurch unsichtbar, Allure überschrieb die Schaltfläche zum Aufrufen des Laufs, Statusaktualisierungen erreichten die sichtbaren kopierten Karten nicht, und der neue Testpaket-Typ ließ sich weder über die Seitenleiste noch über die Filter-Pills filtern.

Fehlermeldungen im Frontend werden künftig automatisch ausgeblendet, wenn der Nutzer sie nicht selbst schließt oder darauf reagiert. Die Anzeigedauer beträgt neun Sekunden. Versucht der Nutzer, trotz des Fehlers fortzufahren, wird die Meldung bei jedem Versuch erneut für neun Sekunden angezeigt. Das manuelle Schließen funktioniert weiterhin wie gewohnt, und die Änderung gilt einheitlich für die betroffenen Fehlermeldungskomponenten.

Für den Markt MBD wurden zudem deutsche Übersetzungen angepasst. Im Admin-Bereich heißt „Gesundheitskontrolle“ nun „Health Check“, und „Familien-Tag“ wurde zu „Family Tag“, jeweils analog zur englischen Sprachfassung. In der Vertragshistorie lautet der Titel beim Erstellen, Aktivieren oder Ablehnen eines Vertrags nun „Antrag“ statt „Vertragsvorschlag“.

**Edge Service**

Mehrere Fehler im Edge Service wurden behoben. Die erstmalige Aktivierung eines Vertrags führte zu einem internen Serverfehler. Leasingverträge ließen sich nicht aktivieren, und bei der Aktivierung eines Leasingvertrags wurde die Zahlungsreferenz nicht übergeben. Die Suche nach Leasingverträgen löste ebenfalls einen internen Serverfehler aus. Produkte wurden mit der neuen Schnittstelle product/v2/search nicht abgerufen, und bei der Produktsuche über product/v1/search wurde der Sprachwert nicht in den Headern weitergegeben. Zudem akzeptiert der Endpunkt POST contract/v1/leasing die externalCampaignId nun als Zeichenkette statt nur als Ganzzahl.

**Customer Account Center**

Der Markt wird nun aus der URL übernommen. Außerdem wurde ein Fehler für den Markt MBSK behoben: Die slowakische Fehlermeldung wurde bei falsch eingegebenem Captcha nicht korrekt angezeigt.

**Hinweis zu nicht umgesetzten Vorhaben**

Das Vorhaben, UI-Tests gegen die lokale Entwicklungs-UI auszuführen, wurde abgebrochen. Ebenso wurde die Korrektur der Suche nach erstellten und aktiven Leasing- und Retail-Verträgen im Edge Service, die nicht alle Werte lieferte, nicht umgesetzt. Die Übernahme der Reporting-Services befindet sich noch im Entwicklungs-Backlog; Details dazu liegen noch nicht vor.