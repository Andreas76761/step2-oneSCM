# Batch 966 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Speicherung von Produktinformationen im Vertrag**

Wenn ein Vertragsvorschlag angelegt und daraus ein Vertrag erzeugt wird, werden bestimmte Informationen aus den Produkten übernommen. Bisher prüfte das System bei einem bevorstehenden Vertragsablauf, ob das zugehörige Produkt noch existiert. Fehlte das Produkt, entstanden zwischen dem Produkt-Microservice und dem Vertrags-Microservice ein hohes Datenaufkommen und Fehler. Um dies zu vermeiden, werden nun alle erforderlichen Produktinformationen direkt im Vertrag gespeichert. Dadurch kann der Vertrag unabhängig vom weiteren Schicksal des Produkts im Produkt-Microservice problemlos weiterverarbeitet werden, etwa beim Ablauf oder bei der Kündigung. Zugleich kann der Produkt-Microservice Produkte löschen, ohne die Funktion bestehender Verträge zu beeinträchtigen. Zu beachten ist: Bei der Vertragsprüfung muss das zugewiesene Profil mit dem Produkt verknüpft sein, das zum Vertrag gehört.

**Nicht umgesetzte Vorhaben: Signatureinstellung pro Markt und Produkt**

Geplant war, in der Marktkonfiguration je Markt und je Produkt festzulegen, ob der Signaturschritt im Ablauf der Vertragserstellung (Contract Generation) angewendet wird. Hintergrund ist, dass einige Märkte bestimmte Produkte ohne Kundenunterschrift verkaufen. Bislang erfordern alle Produkte und Verträge eine Kundensignatur. Künftig sollte ein Produkt den Ablauf ohne Signaturschritt durchlaufen können, unabhängig von der Art der Signatur, um die Schritte im Ablauf zu reduzieren. Nutzen sollten dies dieselben Anwender wie bisher, nämlich die Marktbenutzer (MPC). Dieses Vorhaben wurde abgebrochen und steht daher nicht zur Verfügung.

**Nicht umgesetzte Vorhaben: Vertragserstellung für mehrere Produkte gleichzeitig**

Ebenfalls abgebrochen wurde die geplante Erweiterung, mit der sich in einem Vorgang Verträge für mehrere Produkte erstellen lassen, beispielsweise für ein Complete-Produkt zusammen mit einem Reifenprodukt. Kunden- und Finanzdaten sollten dabei nur einmal erfasst und für beide Verträge verwendet werden, um Zeit und Aufwand im Ablauf zu verringern. Der Ablauf unterstützt weiterhin jeweils nur ein Produkt. Vorgesehen war diese Funktion für Händler, MO und MPC.