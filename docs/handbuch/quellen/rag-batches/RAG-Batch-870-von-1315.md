# Batch 870 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation: Standardsprache in den Markteinstellungen**

In den Markteinstellungen steht Ihnen ein neuer Parameter zur Verfügung: die Standardsprache (Default Language). Er baut auf der bestehenden Funktionalität auf und ergänzt sie um ein einzelnes neues Steuerelement. Vorgesehen ist die Funktion für MPC- und HQ-Administratoren, die als Market Admin die primäre Sprache ihres Marktes festlegen, damit nachgelagerte Domänen diese kennen.

Wie bisher wählen Sie die Sprachen Ihres Marktes unter Markteinstellungen › Allgemeine Einstellungen › Format im vorhandenen Mehrfachauswahlfeld für die Sprachen aus. Über die ebenfalls unveränderte Aktion „Generate Default Templates“ können Sie anschließend Standardvorlagen in den ausgewählten Sprachen erzeugen. Beide Funktionen bleiben unverändert erhalten.

Neu ist ein Einzelauswahl-Dropdown „Default Language“ unterhalb der Sprachauswahl. Es bietet ausschließlich die Sprachen zur Auswahl an, die dem Markt aktuell zugewiesen sind. Sind beispielsweise Englisch und Deutsch zugewiesen, werden genau diese beiden Sprachen angeboten. Wählen Sie dort eine Sprache aus, wird sie beim Speichern als Parameter auf Marktebene hinterlegt. Ist keine Standardsprache ausgewählt, lässt sich die Einstellung nicht speichern.

Die Standardsprache muss immer eine der zugewiesenen Sprachen sein. Entfernen Sie eine Sprache aus der Auswahl des Marktes, die zugleich als Standardsprache festgelegt ist, ist die Standardsprache nicht mehr gültig. Sie müssen dann vor dem Speichern eine neue Standardsprache auswählen.

Der Parameter wird derzeit vom Bereich Products verwendet. Products liest die Standardsprache des Marktes und legt Produkte sowie zugehörige Informationen in dieser Sprache an. Ist für einen Markt etwa Deutsch als Standardsprache hinterlegt, werden Produkte und zugehörige Informationen in Deutsch erstellt.

Für PI17 ist die Bereitstellung der Standardsprache für Products der einzige Zweck des Parameters. Weitere Verwendungen sind für spätere PIs vorgesehen. Nicht Bestandteil dieser Funktion sind andere Verwendungen der Standardsprache als die Produkterstellung, Regeln zu verpflichtenden Dokumentsprachen, Rückfalllösungen je Sprache für Dokumente sowie der Umgang mit der Sprache von Bestätigungen. Ebenso bleiben das bestehende Mehrfachauswahlfeld für Sprachen und das Verhalten von „Generate Default Templates“ unverändert.