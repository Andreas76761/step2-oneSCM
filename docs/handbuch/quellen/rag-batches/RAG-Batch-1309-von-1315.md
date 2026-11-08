# Batch 1309 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 20 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Neue Benutzerrollen und Organisationsbereiche**

Für die Architektur des Systems wurden mehrere Neuerungen rund um Rollen und Zugriffsrechte umgesetzt. Neu ist die Rolle „View Only“, die schreibgeschützten Zugriff auf alle Komponenten und Daten der Anwendung bietet. Benutzer mit dieser Rolle können Seiten aufrufen und Informationen einsehen, aber keine Daten anlegen, ändern oder löschen. Die Rolle steht sowohl für den Bereich PC als auch für den Bereich Van zur Verfügung und ist mit reinen Ansichts- und Leseberechtigungen für sämtliche Anwendungskomponenten ausgestattet. Weitere Informationen zu Rollen und Berechtigungen finden sich in der entsprechenden Dokumentation im Confluence.

Im Zusammenhang mit der Aufteilung in die Divisionen PC und Van unterstützt das System außerdem einen organisatorischen Geltungsbereich nach Division. Dafür wurden zwei neue Rollen eingeführt: PC und Van. Benutzer mit der Rolle PC sehen ausschließlich PC-Daten und in der Benutzeroberfläche nur die Optionen der Division PC. Benutzern mit der Rolle Van stehen nur Van-Daten und die Van-Optionen der Oberfläche zur Verfügung. Ist einem Benutzer beides zugewiesen, hat er Zugriff auf die Daten und Ansichtsoptionen beider Divisionen. Die Einschränkung von Datenzugriff und Oberflächenansicht gilt für alle Rollen. Die Sicht und der Zugriff von Händlern sind auf Daten begrenzt, die der Organisationseinheit des Händlers gehören und den divisionsspezifischen Berechtigungen entsprechen.

**Verbesserungen in der Bedienung**

Links in der Navigationsleiste sowie die Navigationsschaltflächen im Dashboard öffnen sich nun in einem neuen Tab. Ein Flyout wird zudem geschlossen, wenn Sie außerhalb des Containers klicken. Die in oneSCM gewählte Sprache wird im gesamten System vorausgewählt, und die bevorzugte Sprache aus Alice wird in oneSCM berücksichtigt.

Für Workshop-Rechnungen wurde die Verwaltung der drei Formulare auf der Seite zur Rechnungserstellung technisch umgestellt: Statt des bisherigen Stores wird ein Formularservice verwendet. Der Ablauf bei der Erstellung einer Workshop-Rechnung bleibt dabei unverändert.

In der Vorproduktionsumgebung (PreProd), nicht jedoch in der Produktion, können mehrere Verträge pro Fahrgestellnummer aktiviert werden.

**Technische Verbesserungen im Hintergrund**

Im Backend wurde ein Problem mit dem Optimistic Lock im Config Service behoben, und die Performance des SyncEsCostJob wurde verbessert. Für die kundenseitige Oberfläche wurde die CI/CD-Pipeline vorbereitet, und die Anbindung wurde auf CodeArtifacts migriert. Im Bereich der automatisierten Qualitätssicherung wurden Tests für den Vertragsablauf vorbereitet und umgesetzt sowie eine Strategie bzw. Architektur zur Erstellung von Testdaten umgesetzt. Außerdem wurden die End-to-End-Tests korrigiert.

Die geplante Anzeige der Release-Version in der Benutzeroberfläche wurde nicht umgesetzt. Die Bereinigung der automatisierten Tests befindet sich derzeit in der Analyse.