# Batch 1170 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Aufteilung des Produktmanagements nach den Divisionen PC und Van

Mit der organisatorischen Trennung in die Divisionen PC und Van unterstützt oneSCM nun einen Zugriffsbereich, der nach Division getrennt ist. Bislang kannte die Anwendung keine Rollen für die PC- oder die Van-Division. Damit Anwenderinnen und Anwender in beiden Divisionen weiterhin eine gute Nutzererfahrung haben, wird der Datenzugriff per Berechtigung auf die jeweilige Division (PC oder Van) beschränkt. Diese Einschränkung gilt sowohl für die Daten als auch für die Darstellung in der Benutzeroberfläche und wird auf alle Rollen angewendet. Händleransichten und Händlerzugriffe sind auf Daten begrenzt, die zur Organisationseinheit des Händlers gehören, und berücksichtigen zusätzlich die divisionsspezifische Berechtigung.

Zu diesem Zweck wurden zwei neue Rollen eingeführt: PC und Van. Benutzer mit der Rolle PC können ausschließlich auf PC-Daten zugreifen und sehen in der Benutzeroberfläche nur die Optionen der PC-Division. Benutzer mit der Rolle Van haben nur Zugriff auf Van-Daten und sehen nur die Optionen der Van-Division. Ist einem Benutzer sowohl die Rolle PC als auch die Rolle Van zugewiesen, kann er auf die Daten und Ansichtsoptionen beider Divisionen zugreifen.

Die divisionsbezogene Zugriffssteuerung ist für die Rollen Dealer, Dealer+, MO, MPC und HQ Admin vorgesehen und wird in den Bereichen Contract Calculation und Vehicle Management berücksichtigt. Die Rollen gelten auch auf der Seite „Product Testing“. Wird in der Generierung eine ID verwendet, die zu einer anderen Division gehört, zeigt das System einen klaren Fehlerzustand an. Auf diese Weise erfahren Benutzer bzw. Händler, warum keine Ergebnisse zurückgegeben werden.

Weitere Informationen zu den Rollen und Berechtigungen finden sich in der Dokumentation „Roles and entitlements“.