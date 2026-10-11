# Batch 1212 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsprüfung: Ansicht des Prüfprofils**

Im Bereich Contract Review können Nutzer in der Rolle MO/MPC die Konfiguration eines bereits angelegten Prüfprofils einsehen, um zu erkennen, welche Bedingungen gelten. Das Profil lässt sich auf zwei Wegen öffnen: durch Klick auf den Profilnamen auf der Seite „Review Profile" oder durch Klick auf den Profil-Hyperlink auf der Seite „Contract Review – Operative Review". In beiden Fällen öffnet sich eine reine Leseansicht. Eine Bearbeitung ist in PI5 nicht vorgesehen; die Schaltfläche „Edit" ist lediglich ein Platzhalter. Über das „X" wird die Vorschau des Profil-Setups geschlossen.

Die Ansicht zeigt zunächst das Profil-Setup mit Name des Prüfprofils, Prüfart (Review Type), Anwendungsbereich (Application Area) und Division. Darauf folgt der Bereich zu Toleranzen und Freigaben, der in zwei Abschnitte gegliedert ist.

Im Abschnitt Mehrkilometer wird angezeigt, ob dem Kunden Mehrkilometer nicht oder doch berechnet werden („No Customer Charge" bzw. „Customer Charge"). Dazu kommen die Toleranz und die maximale Berechnung, jeweils als Prozentwert oder absoluter Wert, sowie die Freigabe (Acceptance) mit den Ausprägungen „Active", „Threshold" oder „Manual". Wurde die Freigabe mit Schwellenwert festgelegt, wird zusätzlich der Schwellenwert angezeigt.

Der Abschnitt Minderkilometer ist analog aufgebaut. Hier wird angegeben, ob keine Vergütung, eine Vergütung auf Kundenwunsch oder eine Vergütung erfolgt („No Compensation", „Compensation on Customer Request", „Compensation"). Auch hier werden Toleranz und maximale Berechnung als Prozentwert oder absoluter Wert dargestellt, ebenso die Freigabe („Active", „Threshold" oder „Manual") und bei Freigabe mit Schwellenwert der entsprechende Wert.

Gestaltung und Grafik der Ansicht entsprechen der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Anbindung an OTR (Contract Calculation, Teil 1)**

Derzeit können Produkte und Preise auf Basis von Fahrgestellnummer, Baumustercode und Auftragsnummer bereitgestellt werden. Geplant war, dass ein Händler künftig eine Deal-ID eingibt und daraufhin Kundendaten sowie die zum Fahrzeug des Deals passenden Produkte und Preise erhält, um den Verkauf von Servicverträgen zu beschleunigen. Dazu sollte die Produkt- und Preisbereitstellungs-Schnittstelle von Stream 2 eine zwölfstellige Deal-ID entgegennehmen können. Die Anbindung an OTR sollte die Deal-ID in ein Baumuster oder eine Fahrgestellnummer sowie die für die Vertragserstellung in Stream 2 benötigten Kundendaten auflösen. Anschließend sollten passende Produkte und Preise samt Kundendaten an Stream 2 bereitgestellt werden. Zudem war ein Abonnement vorgesehen, um die Fahrgestellnummer zu erhalten, sobald sie verfügbar ist. Als Untersuchung sollte geprüft werden, welche Anpassungen nötig sind, um die Kundendaten auf dasselbe Datenmodell wie in Stream 2 abzubilden. Dieses Vorhaben wurde abgebrochen und ist daher nicht Bestandteil des Funktionsumfangs.

Ebenfalls abgebrochen wurde die Umsetzung automatisierter Tests mit mittlerer Priorität für diesen Bereich.