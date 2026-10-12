# Batch 973 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kampagnen in Verträgen (Deutscher Markt)**

Für den deutschen Markt können Verkäuferinnen und Verkäufer (Händler, MO und MPC) Kundinnen und Kunden künftig eine Kampagne anbieten, die zu deren Anforderungen passt. Damit lässt sich das Interesse der Kunden im Vertragsprozess aufrechterhalten. Im deutschen Markt gibt es weder automatisch angewendete Kampagnen noch Kulanzzeit-Kampagnen (Grace Period). Es wird also keine Kampagne automatisch auf ein Produkt angewendet. Die Kampagnendaten stammen aus der Vertragskalkulation und umfassen Kampagnennamen, Werte, Rabatte, die Verkaufsbeschreibung, Ausnahmen, die Kampagnenkostenstelle, den Kampagnentyp (Sales Campaign oder After Sales Campaign) sowie die Angabe, ob eine Kampagne automatisch angewendet wird (autoApply). Aus dem Fahrzeugmanagement wird zusätzlich das Bestelldatum des Fahrzeugs übernommen und für den Vertrag gespeichert.

**Produktkonfiguration und Kampagnenauswahl**

Das Vertragsangebot wird über einen der verfügbaren Identifikatoren gestartet. Anschließend werden alle Produkte, Preise, Kampagnen und Konfigurationen abgerufen. Nach der Auswahl eines Produkts wird es über Laufzeit, Laufleistung und Zahlungsintervall konfiguriert. Sobald die Konfiguration abgeschlossen ist, wird die Schaltfläche „Kampagnen“ aktiv.

Ein Klick darauf öffnet ein Fenster mit den Produktpreisen und einer Liste der verfügbaren Kampagnen samt Namen und Preisreduzierungen. Wählt man eine Kampagne aus, klappen die von der Vertragskalkulation bereitgestellten Detailinformationen auf. Der alte Preis wird durchgestrichen, der neue Preis daneben angezeigt. Es kann immer nur eine Kampagne gleichzeitig ausgewählt werden. Wählt man eine andere Kampagne, wird die vorherige abgewählt und der Preis entsprechend angepasst.

Mit „Apply“ wird der Vorteil der gewählten Kampagne übernommen, das Fenster geschlossen und die Produktkonfiguration mit dem reduzierten Preis aktualisiert. Öffnet man die Kampagnenauswahl erneut, ist die zuvor gewählte Kampagne vorausgewählt. Mit „Cancel“ werden alle Auswahlen verworfen, und man kehrt zur Produktkonfiguration mit den ursprünglichen Preisen zurück, ohne dass eine Kampagne angewendet ist. Im Reiter „Kampagne“ der Produktkonfiguration werden Informationen zu einer angewendeten Kampagne nur bei autoApply = True angezeigt; bei autoApply = False wird der Reiter nicht dargestellt.

**Händlerrabatt**

Die Schaltfläche „Händlerrabatt“ ist aktiv, wenn das Produkt einen solchen Rabatt zulässt. Der kombinierte Wert aus Kampagne und Händlerrabatt darf den ursprünglichen Produktpreis nicht überschreiten. Übersteigt der eingegebene Rabatt den Produktpreis, erscheint eine Fehlermeldung mit dem maximal zulässigen Rabatt, und die Schaltfläche „Apply Discount“ wird deaktiviert. Wird zuerst ein Händlerrabatt angewendet und anschließend eine Kampagne gewählt, wird der bereits angewendete Händlerrabatt aufgehoben.

**Zusätzliche Konfiguration und Angebotserstellung**

Anschließend können optionale Deckungen und, falls zutreffend, technische Deckungen ergänzt werden. Wurde der Angebotsprozess mit einem Baumuster gestartet, wird auch dessen Identifikator aufgenommen.

Beim Fortsetzen des Angebots wird auf Kundendubletten geprüft. Bei Neukunden werden die Kundendaten erfasst. Das Angebot erhält den Status „Erstellt“, und es wird eine Referenznummer vergeben. Wurden eine Kampagne und/oder ein Händlerrabatt angewendet, erscheint neben dem Produktnamen ein Rabattlabel. Es enthält Details zum Händlerrabatt und zur Kampagne, jeweils in einer eigenen Spalte. Danach wird die Unterschriftsart gewählt, und das Angebot wechselt auf „Wartet auf Bestätigung“. Sobald der Kunde das Angebot unterschrieben hat, wird der Status auf „Bestätigt“ gesetzt.

Eine am Angebot angewendete Kampagne gilt so lange, wie das Angebot gültig ist. Ist ein Angebot beispielsweise 100 Tage gültig und der Kunde unterschreibt am 100. Tag, ist die Kampagne weiterhin anwendbar.

**Prüfungen nach der Bestätigung**

Nach der Bestätigung folgen die üblichen Prüfungen. Wurde eine Kampagne angewendet und ist autoApply = False, gibt es in den MO-Prüfungen zwischen den Kategorien „Produkt“ und „Kunde“ eine neue Kategorie „Preis“. Sie enthält das Feld „Kampagne“, dessen Ausgangszustand NOK ist, mit der Begründung, dass die Kampagnenbedingungen bestätigt werden müssen. Der Vertrag kann in den Status „Wartet auf Aktivierung“ wechseln, wenn alle Prüfungen in Ordnung sind. Er kann jedoch nicht automatisch aktiviert werden; eine Aktivierung ist nur manuell durch MO oder MPC möglich. Wurde keine Kampagne angewendet, läuft der Prozess wie bisher weiter.

Bei der Aktivierung des Vertrags werden die Informationen zur Kostenstelle der Kampagne und der Kampagnentyp „Sales Campaign“ an das Revenue-System gesendet. Außerdem wird die Schnittstelle 155 generiert.

**Angebots- und Vertragsverwaltung**

In der Angebotsverwaltung wird in den Angebotsdetails im Reiter „Zahlung“ im Feld „Kampagne“ bei angewendeter Kampagne der Wert samt Währung angezeigt, gemäß der Einstellung in der Marktkonfiguration. Entsprechend zeigt die Vertragsverwaltung in den Vertragsdetails im Reiter „Zahlung“ im Feld „Kampagne“ Wert und Währung der angewendeten Kampagne an. Unabhängig davon, ob eine Kampagne angewendet wurde, gibt es sowohl in den Angebotsdetails als auch in den Vertragsdetails im Reiter „Fahrzeug“ den neuen Platzhalter „Bestelldatum“, der die aus dem Fahrzeugmanagement übernommene Information anzeigt.