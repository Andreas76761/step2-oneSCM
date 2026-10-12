# Batch 905 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungsarten je Markt festlegen (Market Settings)**

Bisher werden die verfügbaren Zahlungsarten anhand des Kundentyps festgelegt. Mit der neuen Funktion können autorisierte Benutzer, die die Market Settings verwalten, die unterstützten Zahlungsarten stattdessen für jeden Markt individuell konfigurieren. Dadurch werden Produktkonfiguration, Produktangebot, Vertragsbedingungen und Zahlungsabwicklung automatisch an die lokalen Anforderungen und Vorschriften des jeweiligen Marktes angepasst. Voraussetzung ist, dass die Market Settings zentral verwaltet und versioniert werden, dass der Product Microservice die Konfiguration auf Marktebene nutzt und dass die Abläufe für Vertragserstellung und -aktivierung von der Produkt- und Marktkonfiguration gesteuert werden.

**Digitale Zahlungsarten in der MPay-Konfiguration**

Unter Market Settings / Feature Settings / MPay Configuration steht ein neues Feld "Supported Payments" zur Verfügung. Es ist als Dropdown mit Mehrfachauswahl gestaltet. Zur Auswahl stehen MPay Credit Card, MPay UPI und MPay Netbanking, wobei UPI und Netbanking speziell für Indien vorgesehen sind. Die getroffene Auswahl wird für den Markt gespeichert und kann anschließend als Zahlungsart vor oder nach der Aktivierung genutzt werden.

**Zahlungsarten in den General Settings**

Unter Market Settings / General Settings / Payment gibt es ein weiteres neues Feld, das nach den Divisionen PC und VAN getrennt ist. Auch hier sind mehrere Werte gleichzeitig wählbar. Oben wird ein Hinweis angezeigt, dass die Einstellungen im gesamten Markt gelten und dass die digitalen Zahlungsoptionen im Bereich "Supported Payments" der MPay Configuration bearbeitet werden können. Der hervorgehobene Link "Mpay Configuration" führt direkt zu Market Settings / Feature Settings / MPay Configuration. Ist dort noch keine Konfiguration hinterlegt, wird die Option "Digital Payment" ausgegraut und kann nicht ausgewählt werden.

Die Zahlungsarten sind in zwei Kategorien unterteilt. Bei der Kategorie "Post Activation" erfolgt die Zahlung, nachdem der Vertrag aktiviert wurde. Sie umfasst Direct Debit, das standardmäßig ausgewählt ist (auch bei einer Wiederherstellung), sowie Bank Transfer und Digital Payment, das die in der MPay Configuration gewählten Typen enthält. Bei der Kategorie "Pre Activation" muss die Zahlung erfolgen, damit der Vertrag überhaupt aktiviert werden kann. Hier steht Digital Payment zur Verfügung, ebenfalls mit den in der MPay Configuration gewählten Typen.

**Auswirkungen auf Produkte und Verträge**

Marktbenutzer können alle oder nur eine Teilmenge der verfügbaren Zahlungsarten auswählen. Die gewählten Zahlungsarten werden an den Product Microservice übergeben und begrenzen die Zahlungskonfiguration auf Produktebene. Bei der Vertragserstellung werden nur Zahlungsarten angezeigt und zur Auswahl angeboten, die sowohl in den Market Settings als auch in der Produktkonfiguration erlaubt sind. Die Zahlungsabwicklung richtet sich nach der konfigurierten Kategorie: Bei einer Pre-Activation-Zahlungsart muss die Zahlung abgeschlossen sein, bevor der Vertrag aktiviert werden kann. Bei einer Post-Activation-Zahlungsart wird die Zahlungsabwicklung nach der Aktivierung gemäß den Regeln für nachgelagerte Zahlungen eingeplant.

**Änderungen der Market Settings**

Werden die Zahlungseinstellungen eines Marktes geändert, gelten die Änderungen ausschließlich für neu erstellte Serviceverträge. Bereits bestehende Verträge behalten ihre ursprüngliche Zahlungskonfiguration. Der Product Microservice erkennt Konfigurationsänderungen und wendet sie konsistent auf künftige Produkt- und Vertragskonfigurationen an.