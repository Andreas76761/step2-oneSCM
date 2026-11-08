# Batch 602 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Aufteilung nach Geschäftsbereichen PC und Van in Kundenverwaltung sowie Dokumenten- und Kommunikationsverwaltung**

Das System unterstützt nun eine organisatorische Aufteilung nach den Geschäftsbereichen Van und PC. Zuvor gab es in der Anwendung keine Rollen für diese beiden Bereiche. Damit Benutzer in beiden Bereichen weiterhin gut arbeiten können, wird der Datenzugriff per Berechtigung je Geschäftsbereich eingeschränkt. Die Einschränkung des Datenzugriffs und der Ansicht in der Benutzeroberfläche gilt für alle Rollen. Händler sehen und erreichen nur Daten, die zur Organisationseinheit des jeweiligen Händlers gehören und zugleich den bereichsspezifischen Berechtigungen entsprechen.

Dafür wurden zwei neue Rollen eingeführt: PC und Van. Benutzer mit der Rolle PC erhalten nur Zugriff auf PC-Daten und sehen in der Benutzeroberfläche ausschließlich die Optionen des PC-Bereichs. Benutzer mit der Rolle Van haben nur Zugriff auf Van-Daten und sehen nur die Optionen des Van-Bereichs. Ist einem Benutzer sowohl die Rolle PC als auch die Rolle Van zugewiesen, kann er auf die Daten und Ansichtsoptionen beider Bereiche zugreifen. Auch interne Benachrichtigungen sind an die Rollen gebunden: Ein PC-Benutzer sieht nur Benachrichtigungen des PC-Bereichs, ein Van-Benutzer nur die des Van-Bereichs, und ein Benutzer mit beiden Rollen kann alle bereichsbezogenen Benachrichtigungen einsehen. Ein PC-Benutzer kann keine interne Benachrichtigung für Van auslösen, ein Van-Benutzer keine für PC.

In der Kundenverwaltung haben Benutzer mit einer bereichsspezifischen Rolle nur Zugriff auf Kunden, die Serviceverträge im jeweiligen Zuständigkeitsbereich besitzen. Beim Anlegen eines Servicevertrags gilt eine Besonderheit: Nachdem der Benutzer die erforderlichen Daten im Reiter „Private Customer Details“ eingegeben hat, werden bereits vorhandene Kunden mit passenden Angaben angezeigt und sind auswählbar, unabhängig von der Einschränkung durch die Datenberechtigung. Hat ein Kunde einen Vertrag im Bereich des Benutzers, kann dieser die Kundendetails im Reiter der Kundenverwaltung einsehen, sieht dort jedoch nur die Serviceverträge seines eigenen Geschäftsbereichs.

In der Vorlagenverwaltung gilt dies für Dokumente und E-Mails gleichermaßen. Der vorhandene Filter im Bereich „more filters“ zeigt nur noch die Geschäftsbereiche als auswählbar an, die dem Benutzer zugewiesen sind (Van, PC oder Van und PC). Zusätzlich enthält die Vorlagentabelle eine neue sortierbare Spalte für den Geschäftsbereich. Beim Erstellen einer Dokument- oder E-Mail-Vorlage ist das Feld für den Geschäftsbereich nur für die dem Benutzer zugewiesenen Bereiche auswählbar. Nicht zugewiesene Bereiche werden zwar angezeigt, aber ausgegraut dargestellt.

Die Berechtigungen und Einschränkungen sind für die Rollen Dealer, Dealer+, MO, MPC und HQ Admin jeweils für die Kunden- und Partnerverwaltung sowie für Dokumente und Kommunikation zu prüfen.

**Duplikaterkennung bei Kunden**

Zum Thema Duplikate wurde das Verhalten des Dialogs angepasst, der beim Anlegen eines Kunden mit gleichem Nachnamen, gleicher Adresse und gleicher IBAN erscheint. Die Rohdaten enthalten hierzu keine weiteren Angaben, sodass sich über die genaue Funktionsweise an dieser Stelle keine näheren Aussagen treffen lassen.