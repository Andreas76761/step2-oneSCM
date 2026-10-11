# Batch 882 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Grace-Period-Kampagne bei der Vertragserstellung**

Mit der Grace-Period-Kampagne kann ein Verkäufer bereits bei der Erstellung eines Vertragsangebots eine vordefinierte Preisreduzierungskampagne anwenden. Die Kampagne gewährt einen Zeitraum, in dem der reduzierte Preis noch von einem MPC-Prüfer formal genehmigt werden muss. Die Funktion gilt für alle Kundentypen (B2C, B2B, Fleet) und für beide Fahrzeugdivisionen (PC und VAN). Voraussetzung ist, dass für die gewählte Kampagne in der Produktverwaltung eine Grace Period definiert ist.

**Konfiguration im Markt**

Vor dem Go-live konfiguriert der MPC unter Market Settings > Timers & Reminders das Feld „Grace Period Campaign Request Validity". Der Wert ist eine positive ganze Zahl in Kalendertagen und kann je Division (PC/VAN) festgelegt werden. Der Standardwert beträgt 7 Tage. Wird der Wert geändert, gilt er für alle danach eingereichten Anfragen: Das Fälligkeitsdatum ergibt sich aus dem Einreichungszeitpunkt plus der konfigurierten Gültigkeit. Bereits laufende Anfragen behalten das zuvor berechnete Fälligkeitsdatum.

**Auswahl im Schritt „Special Request"**

Der Verkäufer durchläuft den üblichen Ablauf der Vertragserstellung bis zum Schritt „Special Request". Sind für das Produkt Grace-Period-Kampagnen verfügbar, werden sie als Optionsfelder mit Einfachauswahl angezeigt. Jeder Eintrag zeigt Kampagnenname, Reduktionsbetrag (netto), verbleibende Tage zur Anwendung, Rabattwert und Gültigkeitszeitraum (von–bis). Gibt es keine verfügbare Kampagne, erscheint im Kampagnenbereich ein entsprechender Hinweis.

Zusätzlich wird das Kontrollkästchen „Don't add campaigns" angezeigt, sobald mindestens eine Kampagne verfügbar ist. Der Verkäufer muss aktiv entscheiden, entweder eine Kampagne auszuwählen oder dieses Kontrollkästchen zu aktivieren. Es gibt keine implizite Vorauswahl. Ohne diese Entscheidung lässt sich der Schritt nicht abschließen, und eine Validierungsmeldung fordert zur aktiven Auswahl auf. Wird „Don't add campaigns" gewählt, wird keine Kampagne angewendet, und der Vertrag läuft mit dem regulären Preis und einem generierten Zahlungsplan weiter.

Grace-Period-Kampagne und Special Case schließen sich auf demselben Vertrag gegenseitig aus. Wählt der Verkäufer eine Kampagne, wird der Bereich Special Case ausgegraut und deaktiviert. Ist umgekehrt bereits ein Special Case gewählt, sind die Optionsfelder der Kampagnen deaktiviert. Hebt der Verkäufer die Auswahl wieder auf, wird der jeweils andere Bereich wieder aktiviert.

**Angebot und Übersicht**

Nach Auswahl einer Kampagne wird der Preis auf der Produktkarte ausgeblendet, und es wird kein Zahlungsplan erzeugt. Dieses Verhalten entspricht der aktuellen Umsetzung des Special Case und bleibt bestehen, bis die Anfrage genehmigt, abgelehnt oder abgelaufen ist. Der Verkäufer vervollständigt das Angebot, ergänzt die Kundendaten und erstellt das Angebot. Der MPC wird über den Benachrichtigungsdienst (Glocke) über die neue Anfrage informiert. Die Anfrage ist über den Deep Link in der Benachrichtigung oder direkt im MPC-Bereich einsehbar. Dabei wird ein Datensatz mit dem Fälligkeitsdatum angelegt, das sich aus dem Einreichungszeitpunkt plus der in den Market Settings hinterlegten Gültigkeit ergibt.

Im Schritt „Overview & Confirmation" (Vertragsstatus „Created") wird der Produktpreis nicht angezeigt, die Vorschau ist deaktiviert, der Zahlungsplan wird nicht dargestellt, und die Schaltfläche „Next" ist deaktiviert.

**Genehmigung, Ablehnung und Ablauf**

Der MPC-Prüfer sieht die Anfrage im Bereich MPC Approval mit allen relevanten Details und dem Fälligkeitsdatum. Er öffnet sie über „Review" und entscheidet innerhalb der konfigurierten Gültigkeit.

Bei einer Genehmigung wechselt der Status der Anfrage auf „Confirmed". Der Endpreis ergibt sich aus dem Listenpreis abzüglich des Rabattwerts der Kampagne. Der aktualisierte Preis wird in „Overview & Confirmation" angezeigt, der Zahlungsplan wird mit diesem Preis erzeugt, das Entwurfsdokument wird generiert, und „Next" wird aktiviert. In der Spalte „Actions" erscheint für die Anfrage „View" statt „Review".

Bei einer Ablehnung wechselt der Status auf „Rejected". Der ursprüngliche Preis wird am Vertrag wiederhergestellt und angezeigt, der Zahlungsplan wird mit dem ursprünglichen Preis erzeugt, das Entwurfsdokument wird generiert, und „Next" wird aktiviert.

Verstreicht die in den Market Settings konfigurierte Gültigkeit ohne Aktion des Prüfers, löst das System den Ablauf aus, und der Status wechselt auf „Expired". Auch hier wird der ursprüngliche Preis wiederhergestellt, der Zahlungsplan erzeugt, das Entwurfsdokument generiert und „Next" aktiviert. Der Verkäufer wird über den bestehenden Benachrichtigungsmechanismus informiert.

**Vertragsaktivierung und Stornierung**

Wird ein Vertrag mit genehmigter Kampagne aktiviert, werden mehrere Ereignisse veröffentlicht. An Revenue gehen Vertrags-ID, Kampagnen-ID, Rabattwert und Endpreis nach Kampagne. An Products geht ein Ereignis zur Aktualisierung der Total Expense um den von der Kampagne betroffenen Betrag. An Nemesis und Reporting werden Vertrags-ID, Kampagnenstatus, Kampagnen-ID, Rabattwert und Endpreis übermittelt. Diese Ereignisse an Nemesis und Reporting werden auch bei Genehmigung, Ablehnung und Ablauf der Kampagne gesendet. Zusätzlich wird das Dokument i155 erzeugt.

Wird ein Vertrag mit genehmigter und aktivierter Kampagne innerhalb der Widerrufsfrist storniert, wird ein Rückbuchungsereignis an Products gesendet. Es enthält Vertrags-ID, Kampagnen-ID, einen Rückbuchungskennzeichner und den Betrag, der aus der Total Expense entfernt wird.

Gestaltung und Grafik müssen den Vorgaben der Mercedes-Benz Workbench UI/UX entsprechen.