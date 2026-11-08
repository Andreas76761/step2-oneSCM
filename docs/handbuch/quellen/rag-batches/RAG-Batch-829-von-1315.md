# Batch 829 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management**

**Langfristige Verlängerung: automatische Genehmigung bzw. Ablehnung**

Bisher gab es für die kurzfristige Verlängerung weder eine manuelle noch eine automatische Genehmigung. Reicht ein Benutzer des Mobility Operations (MO) für einen aktiven, nicht kontingentierten Vertrag eine langfristige Verlängerung ein, startet das System automatisch den DSS-Prozess und wartet auf die Unterschrift des Kunden. Damit die vom Kunden gewünschten Änderungen anschließend ohne manuelles Zutun übernommen werden, wird die langfristige Verlängerung nun automatisch genehmigt oder abgelehnt. Das System schließt den DSS-Prozess selbstständig ab und entscheidet anhand der Rückmeldung des DSS-Prozesses, ob die Verlängerung genehmigt oder abgelehnt wird. Die Vertragsinformationen werden entsprechend aktualisiert.

Unterzeichnet der Vertragsinhaber den Anhang innerhalb der DSS-Wartezeit (konfigurierbar, zum Beispiel 30 Tage) und bevor der Vertrag sein geplantes Vertragsende erreicht, gilt die Verlängerung als erfolgreich übernommen. Der Kunde erhält dazu eine E-Mail-Benachrichtigung. Zudem wird eine i155-Datei mit dem aktualisierten geplanten Vertragsende und der aktualisierten Laufleistung erzeugt. Das Revenue Management wird vom Contract Management informiert, damit es Rechnungen für das gewählte Zahlungsintervall (monatlich oder einmalig) erstellt. Dabei werden folgende Angaben übermittelt: das im ersten Schritt der Verlängerung gewählte Startdatum, der Nettobetrag, der Bruttobetrag, der Zahlungszeitraum (vom Start der langfristigen Verlängerung bis zum geplanten Vertragsende) sowie die Zahlungsart (monatlich oder einmalig, wie im ursprünglichen Vertrag festgelegt). In der Historie wird der Eintrag „Prolongation Successful“ vermerkt. Als Benutzer wird „System“ angezeigt, da es sich um einen automatischen Vorgang handelt.

Wird der Anhang dagegen nicht vor dem geplanten Vertragsende unterzeichnet, etwa weil der Vertrag in weniger als der konfigurierten DSS-Wartezeit ausläuft, schlägt die Verlängerung fehl. Der Vertrag erhält den Status „Expired“, und es wird eine i155-Datei mit diesem Status und dem tatsächlichen Vertragsende erzeugt. In der Historie wird „Prolongation Failed“ eingetragen, ebenfalls mit dem Benutzer „System“, da der Vertrag automatisch durch Zeitablauf abläuft. Außerdem wird eine Vertragsprüfung (Contract Review) für die abschließende Endabrechnung (Mehr- bzw. Minderkilometer) angestoßen, nach deren Durchführung der Vertrag auf „Closed“ gesetzt wird. Sobald der Vertrag den Status „Expired“ hat, wird der DSS-Prozess angewiesen, den Unterschriftsprozess des Kunden abzubrechen.

Nicht Teil dieser Funktion sind der Versand einer E-Mail-Benachrichtigung mit der Aufforderung, den DSS vor Vertragsablauf zu unterzeichnen, sowie die Beendigung eines Vertrags nach Laufleistung, da hier eine Abhängigkeit zu MIC besteht.

**Hinweis zu „Payment Interval not visible while editing“**

Zu diesem Eintrag liegen in den Rohdaten nur die Überschrift und der Status „Geschlossen“ vor, jedoch keine Beschreibung. Ohne weitere Angaben kann ich dafür keinen Handbuchtext formulieren, ohne Inhalte zu erfinden. Bitte liefern Sie die Beschreibung nach, falls ein Abschnitt dazu gewünscht ist.