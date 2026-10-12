# Batch 862 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Schnittstelle I155 für den deutschen Markt**

Für den deutschen Markt steht in der Vertragsverwaltung nun die Schnittstelle I155 zur Verfügung. Über diese Schnittstelle werden Servicevertragsdaten und die zugehörigen Deckungen (Coverages) zwischen dem System OneSCM und dem System VEGA übertragen. Die Übertragung erfolgt mandantenübergreifend, wobei die Daten nach Codepages getrennt werden. Sobald sich in OneSCM etwas am Fahrzeugvertrag oder an den Deckungen ändert, werden sämtliche Vertragsinformationen und Deckungen über die Schnittstelle I155 an VEGA gesendet. Für diese Funktion gab es zuvor keinen Vorgängerzustand, sie wurde von Grund auf neu entwickelt. Eine I155-Datei existiert bereits in iCON für andere Märkte.

**Erzeugung und Übertragung der Datei**

Die I155-Datei wird gemäß der bereitgestellten Dokumentation für den deutschen Markt erzeugt. Die Erzeugung kann manuell durch das Auslösen des zugehörigen Jobs oder automatisch erfolgen; für die automatische Variante ist das Zeitintervall noch festzulegen. Als Beispiel ist vorgesehen, die Datei täglich um 22 Uhr zu erzeugen und täglich um 1 Uhr per CFT-Transfer an VEGA zu senden. Der CFT-Transfer wird dabei zeitgesteuert eingeplant. Welche Felder für die nächste Erzeugung der Datei markiert und berücksichtigt werden, wird noch bereitgestellt.

**Rückmeldung von VEGA**

Nachdem die Datei erfolgreich an VEGA gesendet und dort verarbeitet wurde, soll ein Bericht an OneFCM zurückgeschickt werden. Dieser bestätigt entweder, dass alles in Ordnung ist, oder benennt gegebenenfalls konkrete Probleme. Damit ist die Bestätigung durch VEGA, dass die Verarbeitung erfolgreich war, Teil der Abnahmekriterien.

**Hinweise und Ausblick**

Steht die I155-Datei nicht zur Verfügung, erhält VEGA die zuletzt vorgenommenen Änderungen an Verträgen nicht. Für die zukünftige Weiterentwicklung ist vorgesehen, dass zu einem bestimmten Vertrag eine Versionierung verfügbar sein soll. Sie soll das geänderte Objekt, das geänderte Attribut, den alten und den neuen Wert, die Art der Änderung, das Änderungsdatum sowie die Person, die die Änderung vorgenommen hat, anzeigen.

Weiterführende Informationen finden sich in der Dokumentation im VEGA-Wiki, in der Prozessdokumentation sowie in einem Beispiel auf der Confluence-Seite des Projekts.