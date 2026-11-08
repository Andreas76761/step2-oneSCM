# Batch 922 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation: Neuerungen und Änderungen**

**Anpassung der Produktauswahl und Produktkonfiguration (in Entwicklung)**
Die Produktauswahlseite und die Produktkonfigurationsseite im Vertrag werden angepasst, damit sie mit den neu überarbeiteten Schnittstellen aus dem Bereich M&M zusammenarbeiten. Die Abfrage der verfügbaren Produkte in der Vertragserstellung wird hierfür aufgeteilt. Die Arbeiten an dieser Änderung sind noch nicht abgeschlossen. Weitere Details zur Bedienung liegen derzeit nicht vor.

**History Service (abgeschlossen)**
Für die Vertragserstellung wurde ein History Service auf Architekturebene umgesetzt. Nähere Angaben zu Funktionsumfang und Bedienung liegen in den vorliegenden Informationen nicht vor.

**Aktive Bestätigung von Prüfungen vor der Wiederaufnahme (MO/MPC)**
In den MO Checks werden die Validierungsergebnisse mit dem Status „Ok", „Not Ok" oder „Pending" und gegebenenfalls einem Fehlergrund angezeigt. Der Status „Pending" betrifft dabei ausschließlich das Steuerbefreiungszertifikat (Tax Exempt Certificate). Eine aktive Bestätigung ist nur erforderlich, wenn ein Dokument in der MO-Prüfung als „Not Ok" oder „Pending" gekennzeichnet ist. Betroffen sind folgende Dokumente und Ereignisse: die Unterschrift des Servicevertrags und des SEPA-Dokuments (jeweils bei der Unterschriftsmethode „Print"), der Dokumenttyp Servicevertrag und SEPA-Dokument, der Abgleich der Vertragsnummer bei Servicevertrag und SEPA-Dokument, das Steuerbefreiungszertifikat, die Laufleistung, die Branche sowie die Kampagne. Bei Kampagnen gilt dies nur, wenn sie vom Verkäufer ausgewählt wurde; automatisch angewendete Kampagnen sind ausgenommen.

Als MO/MPC werden Sie in den MO Checks darüber informiert, wenn Dokumente als „Not Ok" markiert sind oder Ihre Aufmerksamkeit erfordern. Sie können diese Dokumente offline prüfen und Ihre Entscheidung anschließend aktiv bestätigen, indem Sie sie freigeben oder ablehnen. Dadurch wird der Aktivierungsprozess des Vertrags nur dann fortgesetzt, wenn die Dokumente akzeptabel sind, oder der Vertrag wird mit einer nachvollziehbaren Begründung formal abgelehnt.

Bei Dokumenten mit dem Status „Not Ok" oder „Pending" erscheinen neben dem Fehlergrund zwei neue Schaltflächen: ein Daumen nach oben und ein Daumen nach unten. Mit dem Daumen nach oben bestätigen Sie, dass das Dokument akzeptabel ist. Es öffnet sich ein Pop-up, in dem Sie eine Begründung für die Freigabe eingeben. Nach dem Absenden wird der Kommentar im Verlaufsbereich (History) gespeichert, das Dokument als „Acknowledged & Approved" markiert und der Status auf „OK" gesetzt. Anschließend können Sie die Vertragsaktivierung manuell fortsetzen.

Mit dem Daumen nach unten lehnen Sie das Dokument als nicht akzeptabel ab. Auch hier öffnet sich ein Pop-up, in dem Sie eine Begründung für die Ablehnung eingeben. Der Kommentar wird im Verlaufsbereich gespeichert, und das Dokument erhält den Status „Not Ok". Der Vertragsstatus wird auf „Rejected" gesetzt, der Prozess kann nicht fortgesetzt werden, und eine Vertragsaktivierung ist nicht möglich. Ob die Statusänderung des Vertrags manuell oder automatisch erfolgt, ist in den vorliegenden Informationen noch nicht abschließend geklärt.

Nach Ihrer Bestätigung oder Ablehnung wird der Status entsprechend aktualisiert. Der Daumen wird grün dargestellt, wenn das Dokument freigegeben wurde, und rot, wenn es nicht freigegeben wurde. Wenn Sie mit dem Mauszeiger über den Daumen fahren, werden der hinzugefügte Kommentar, die Benutzer-ID der Person, die den Kommentar erfasst hat, sowie Datum und Uhrzeit im Format TT.MM.JJJJ HH:MM:SS angezeigt, wie in den Markteinstellungen festgelegt. Die Gestaltung der Oberfläche entspricht den Vorgaben des Mercedes-Benz Workbench.