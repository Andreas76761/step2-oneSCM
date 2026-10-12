# Batch 938 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Provisionsbehandlung bei Verkäufern ohne Provision**

Bisher konnten bei der Erstellung eines Servicevertrags durch einen Benutzer mit MO- bzw. MPC-Berechtigung eine eventuelle Provision und der Vertrag selbst nicht dem Benutzer zugeordnet werden, sobald ein Händlerrabatt angeboten wurde. Eine Zuordnung war nur an einen Händler möglich. Dieses Verhalten wurde angepasst.

Das System erkennt nun, ob einem Produkt eine Provision zugeordnet ist. Wird ein solches Produkt in einem Servicevertrag verwendet, der von einem MO- oder MPC-Benutzer erstellt wurde und diesem selbst zugeordnet ist, wird die Händlerprovision bei der Aktivierung des Vertrags aus der an Revenue gesendeten Nachricht entfernt. Das gilt auch für Nemesis, sofern dies zutrifft. Ist der Vertrag hingegen einem Händler zugeordnet, werden die relevanten Provisionsinformationen wie gewohnt an Revenue und gegebenenfalls an Nemesis übermittelt. Die Regelung gilt für alle Divisionen, alle Kundentypen und alle Abläufe der Vertragserstellung.

Der Ablauf sieht beispielsweise so aus: Ein MO- oder MPC-Benutzer meldet sich an und startet ein Vertragsangebot. Er wählt das Produkt aus, konfiguriert es und erstellt das Angebot. Anschließend weist er das Angebot sich selbst zu, wobei kein Händlerrabatt angewendet wurde. Sobald die Unterschrift vorliegt und alle relevanten Prüfungen bestanden sind, wird der Vertrag aktiviert. Dabei werden an Revenue keine provisionsbezogenen Informationen übermittelt.

Wendet der MO- oder MPC-Benutzer dagegen einen Händlerrabatt an und weist den Vertrag einem Händler zu, werden bei der Aktivierung die Provisionsinformationen an Revenue gesendet. Dasselbe gilt, wenn ein Händler selbst einen Vertrag mit Provisionsprodukt erstellt und aktiviert.

**Markteinstellungen: Links und Darstellung auf der Startseite**

Die bislang fest hinterlegten Kachelnamen und Links auf der Startseite werden aus dem Programmcode herausgenommen und in die Markteinstellungen verlagert. Benutzer mit MPC-Rolle können dort konfigurieren, wie und was auf der Startseite für Händler oder für bestimmte Benutzer wie MPC-MO angezeigt wird. Dazu erfassen sie den Namen der Kachel und den Link zur jeweiligen Seite.