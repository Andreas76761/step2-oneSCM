# Batch 869 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Grace-Period-Kampagne: Definition und Beantragung bei der Vertragserstellung**

Mit der Grace-Period-Kampagne kann ein Verkäufer bei der Erstellung eines Vertragsangebots eine vordefinierte Preisreduktionskampagne anwenden. Die Kampagne gewährt einen Zeitraum, in dem der reduzierte Preis noch von einem MPC-Prüfer formal genehmigt werden muss. Händler bzw. Verkäufer stellen die Anfrage, das MPC entscheidet, ob sie genehmigt oder abgelehnt wird. Die Funktion gilt für alle Kundentypen (B2C, B2B, Fleet) und für beide Fahrzeugdivisionen (PC und VAN). Voraussetzung ist, dass für die gewählte Kampagne in der Produktverwaltung (Product Management) eine Grace Period hinterlegt ist. Eine Grace-Period-Kampagne und ein Sonderfall (Special Case) schließen sich auf demselben Vertrag gegenseitig aus.

**Marktkonfiguration**

Vor dem Go-live muss das MPC in den Market Settings unter „Timers & Reminders" das Feld „Grace Period Campaign Request Validity" konfigurieren. Es nimmt eine positive ganze Zahl in Kalendertagen auf und kann je Division (PC/VAN) gepflegt werden. Der Standardwert beträgt 7 Kalendertage. Wird der Wert geändert, z. B. auf 10 Kalendertage, gilt er für alle danach eingereichten Anfragen des Marktes: Deren Fälligkeitsdatum ergibt sich aus dem Einreichungsdatum plus der konfigurierten Gültigkeit. Bereits laufende Anfragen behalten ihr zuvor berechnetes Fälligkeitsdatum.

**Vertragserstellung und Produktkonfiguration**

Der Verkäufer startet die Vertragserstellung und wählt das Produkt. Der Standardprozess läuft bis zum Schritt „Special Request". Dort werden die verfügbaren Grace-Period-Kampagnen als Radiobuttons angezeigt, sodass nur eine Kampagne ausgewählt werden kann. Zu jeder Kampagne werden Kampagnenname, Reduktionsbetrag (netto), verbleibende Tage zur Anwendung, Rabattwert (netto) sowie Gültigkeit von/bis angezeigt. Ist für das Produkt keine Grace-Period-Kampagne verfügbar, erscheint im Kampagnenbereich ein Hinweis, dass keine Kampagne verfügbar ist.

Die gegenseitige Ausschließlichkeit wird in der Oberfläche in beide Richtungen durchgesetzt: Wählt der Verkäufer eine Grace-Period-Kampagne, wird der Bereich „Special Case" ausgegraut und alle Felder werden deaktiviert. Ist bereits ein Sonderfall gewählt, sind die Radiobuttons der Kampagnen deaktiviert. Wird die Auswahl wieder aufgehoben, ist der jeweils andere Bereich wieder aktiv.

Sobald mindestens eine Grace-Period-Kampagne verfügbar ist, wird zusätzlich das Kontrollkästchen „Don't add campaigns" angezeigt. Der Verkäufer muss aktiv entweder eine Kampagne auswählen oder dieses Kontrollkästchen aktivieren; eine Vorauswahl gibt es nicht. Ohne aktive Entscheidung kann der Schritt nicht abgeschlossen werden, und es erscheint eine Validierungsmeldung, die eine Auswahl verlangt. Wird „Don't add campaigns" gewählt, wird keine Kampagne angewendet und der Vertrag läuft mit dem regulären Preis und einem generierten Zahlungsplan weiter.

Wird eine Grace-Period-Kampagne ausgewählt, wird der Preis auf der Produktkarte ausgeblendet und kein Zahlungsplan erzeugt. Dieses Verhalten entspricht der bestehenden Umsetzung beim Sonderfall. Der Zustand bleibt bestehen, bis die Anfrage genehmigt, abgelehnt oder abgelaufen ist.

**Angebotserstellung, Übersicht und Bestätigung**

Der Verkäufer vervollständigt das Angebot, ergänzt die Kundendaten und erstellt das Angebot. Das MPC wird über den Benachrichtigungsdienst (Glocke) über die neue Anfrage informiert. Die Anfragen sind im eigenen MPC-Bereich einsehbar, entweder über den Deep Link in der Benachrichtigung oder direkt über den MPC-Bereich. Dabei wird ein Anfragedatensatz angelegt, dessen Fälligkeitsdatum sich aus dem Einreichungszeitpunkt plus der in den Market Settings festgelegten Gültigkeit ergibt.

Im Schritt „Overview & Confirmation" (Vertragsstatus „Created") wird der Produktpreis nicht angezeigt, die Vorschau ist deaktiviert, kein Zahlungsplan wird gezeigt und die Schaltfläche „Next" ist deaktiviert. Auch das entspricht dem Verhalten beim Sonderfall.

**Genehmigung, Ablehnung und Ablauf**

Eine offene Anfrage (Status „Open") kann der Prüfer im MPC-Bereich über „Review" öffnen und anschließend genehmigen oder ablehnen.

Bei einer Genehmigung wechselt der Status der Anfrage auf „Confirmed". Der Endpreis ergibt sich aus dem Listenpreis abzüglich des Rabattwerts der Kampagne. Der aktualisierte Preis wird in „Overview & Confirmation" angezeigt, der Zahlungsplan wird auf Basis des neuen Preises erzeugt, das Entwurfsdokument wird generiert und „Next" wird aktiviert. In der Spalte „Actions" erscheint für diese Anfrage „View" statt „Review".

Bei einer Ablehnung wechselt der Status auf „Rejected". Der ursprüngliche Preis wird am Vertrag wiederhergestellt und angezeigt, der Zahlungsplan wird mit dem ursprünglichen Preis erzeugt, das Entwurfsdokument wird generiert und „Next" wird aktiviert.

Verstreicht die in den Market Settings konfigurierte Gültigkeit ohne Aktion des Prüfers, löst das System den Ablauf aus und setzt den Status auf „Expired". Der ursprüngliche Preis wird wiederhergestellt, der Zahlungsplan erzeugt, das Entwurfsdokument generiert und „Next" aktiviert. Der Verkäufer wird über den bestehenden Benachrichtigungsmechanismus über den Ablauf informiert.

**Vertragsaktivierung**

Wird ein Vertrag mit genehmigter Grace-Period-Kampagne aktiviert, werden mehrere Ereignisse veröffentlicht. An Revenue werden Vertrags-ID, Kampagnen-ID, Rabattwert und Endpreis nach Kampagne übermittelt. An Products wird ein Ereignis gesendet, das die Gesamtausgaben (Total Expense) um den von der Kampagne betroffenen Betrag aktualisiert. Zudem wird das Dokument i155 erzeugt. Nemesis und Reporting erhalten bei kampagnenbezogenen Vertragsereignissen (Aktivierung, Genehmigung, Ablehnung, Ablauf) Ereignisse mit Vertrags-ID, Kampagnenstatus, Kampagnen-ID, Rabattwert und Endpreis.

**Stornierung innerhalb der Widerrufsfrist**

Wird ein aktivierter Vertrag mit angewendeter Grace-Period-Kampagne innerhalb der Widerrufsfrist storniert, wird ein Storno-Ereignis an Products gesendet. Es enthält Vertrags-ID, Kampagnen-ID, ein Storno-Kennzeichen und den Betrag, der aus den Gesamtausgaben (Total Expense) entfernt wird.

**Hinweis zur Gestaltung**

Design und Grafik müssen den Vorgaben der Mercedes-Benz Workbench UI/UX entsprechen.