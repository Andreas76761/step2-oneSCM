# Batch 976 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Konfiguration des Kontingentprodukts**

Das Kontingentprodukt ermöglicht es Kunden, eine bestimmte Anzahl an Serviceleistungen ohne festgelegte Laufzeit zu erwerben. Das System unterstützt Vertriebsmitarbeitende dabei, Kontingent-Servicevertragsverträge zu konfigurieren, und empfiehlt auf Basis von Laufzeit und Fahrleistung die jeweils passenden Optionen für den Kunden. Voraussetzung ist, dass Produkt-Setup und Konfiguration für den Markt vorhanden sind und die „productConfigurationLogic“ für das Kontingentprodukt entsprechend ausgelegt ist. Das Produkt steht für B2C und B2B zur Verfügung, mit optionalen Deckungen, Händlerrabatten, Kampagnen und Provisionen.

**Start des Angebots**

Das Vertragsangebot wird über eine beliebige gewünschte Kennung gestartet. Anschließend wird die Vertragsberechnung aufgerufen, die alle passenden Produkte liefert, darunter auch das Kontingentprodukt. Dieses enthält eine Preismatrix, in der für 1 bis 6 Services jeweils ein Betrag für 12, 24 und 36 Monate hinterlegt ist. Der zum Fahrzeug gehörende K/JX-Code-Wert wird über die Kennung ermittelt und auf Vertragsebene gespeichert. Danach wird das Produkt ausgewählt und seine Felder werden konfiguriert.

**Konfiguration ab Laufzeit und Fahrleistung**

Bei dieser Variante beginnt die Konfiguration mit Laufzeit und Fahrleistung. Nach Eingabe beider Werte zeigt das System im Dropdown „Anzahl Services“ die empfohlene Anzahl an. Die Vertriebsmitarbeitenden können die Empfehlung übernehmen oder eine andere verfügbare Anzahl wählen. Entscheiden sie sich für eine andere Anzahl, blendet das System als rein visuellen Hinweis, ohne die Auswahl einzuschränken, eine „empfohlene Laufzeit“ und eine „empfohlene Fahrleistung“ ein, zum Beispiel 48 Monate bzw. 40.000 km bei 4 Services. Die Empfehlungen richten sich nach der K/JX-Code-Matrix, die vom Produktbereich bereitgestellt wird.

**Konfiguration ab Anzahl der Services**

Alternativ beginnt die Konfiguration mit der Anzahl der Services. Nach deren Auswahl zeigt das System anhand der K/JX-Codes die empfohlene Laufzeit im Dropdown „Vertragslaufzeit“ und die empfohlene Fahrleistung im Dropdown „Jahresfahrleistung“ an. Die Vertriebsmitarbeitenden können die Empfehlung übernehmen oder abweichende Werte wählen. Bei abweichender Laufzeit oder Jahresfahrleistung erscheint wiederum als bloßer Hinweis die „empfohlene Anzahl an Services“, zum Beispiel 2 Services bei 24 Monaten und 10.000 km.

**Info-Symbol mit Empfehlungen**

In beiden Varianten steht neben der Anzahl der Services ein Info-Symbol. Beim Überfahren mit der Maus werden die Empfehlungen auf Basis der K/JX-Code-Werte angezeigt: 1 Service entspricht 12 Monaten und dem K/JX-Code-Wert, 2 Services entsprechen 24 Monaten und dem K/JX-Code-Wert multipliziert mit der Anzahl der Services, und bei N Services gilt die maximal definierte Laufzeit in Monaten bei dem K/JX-Code-Wert multipliziert mit N. Die Legende enthält stets die Empfehlung für die maximal definierte Anzahl an Services. Kann das Kontingentprodukt beispielsweise bis zu 8 Services umfassen, werden 8 Empfehlungen angezeigt, von 1 Service mit 12 Monaten bis 8 Services mit 96 Monaten und dem K/JX-Code-Wert multipliziert mit 8.

**Zahlungsintervall, Preis und Zusatzkonfiguration**

Im Anschluss wird das gewünschte Zahlungsintervall gewählt. Der Preis wird auf Grundlage von Laufzeit, Anzahl der Services und Zahlungsintervall angezeigt und bei Änderungen aktualisiert. Zusätzlich können optionale Deckungen, ein Händlerrabatt, Kampagnen und technische Deckungen hinzugefügt werden, sofern zutreffend. Wurde der Angebotsprozess mit einem Baumuster gestartet, wird die Kennung ergänzt.

**Fortsetzen des Angebots**

Beim Fortsetzen des Angebots wird zunächst auf Kundendubletten geprüft. Handelt es sich um einen Neukunden, werden die Kundendaten erfasst. Das Angebot erhält den Status „Erstellt“ und eine Referenznummer. Die geplante Gesamtfahrleistung des Vertrags ergibt sich aus dem K/JX-Code-Wert multipliziert mit der Anzahl der Jahre der Vertragslaufzeit. Die geplante Fahrzeugfahrleistung ist die geplante Gesamtfahrleistung des Vertrags zuzüglich des Kilometerstands zum Verkaufsdatum. Bei der „productConfigurationLogic“ „Contingent“ entsprechen Vertragsbeginn, Verkaufsdatum und Erstellungsdatum einander. Der Kilometerstand bei Vertragsbeginn und der Kilometerstand zum Verkaufsdatum entsprechen dem Wert, der zusammen mit der Kennung erfasst wurde.

In der Übersicht und Bestätigung wird die Anzahl der enthaltenen Services in den Produktoptionen angezeigt. Der Kilometerstand bei Vertragsbeginn zeigt den mit der Kennung erfassten Wert; wurden BTS- bzw. Built-to-Order-Prozesse verwendet, wird „0“ angezeigt. Anschließend wird die Unterschriftsart gewählt und das Angebot auf „Wartet auf Bestätigung“ gesetzt. Sobald der Kunde das Angebot unterzeichnet hat, wechselt der Status auf „Bestätigt“. Danach folgen die üblichen Prüfungen, der Vertrag wird aktiviert, die Informationen werden an Revenue, Nemesis und Controlling übermittelt und der Beleg 155 wird erzeugt. Dabei werden Laufzeit bzw. Fahrleistung (K/JX-Code-Wert multipliziert mit der Anzahl der Jahre der Vertragslaufzeit) sowie die Anzahl der enthaltenen Services berücksichtigt.

**Anzeige in Angebots- und Vertragsverwaltung**

In der Angebotsverwaltung unter den Angebotsdetails sowie in der Vertragsverwaltung unter den Vertragsdetails zeigt das Feld „Anzahl Services (Gesamt/Genutzt)“ künftig die Anzahl der erworbenen und der bereits genutzten Services an. Bisher wurden die verbleibenden Services angezeigt. Standardmäßig entspricht der Gesamtwert der gewählten Anzahl an Services, der Wert für genutzte Services beträgt „0“. Wird ein Servicevertrag über den i156-Import in Anspruch genommen, wird dieses Feld aktualisiert: Der Gesamtwert bleibt die bei Vertragserstellung gewählte Anzahl, der Wert für genutzte Services entspricht der Anzahl der über i156 geltend gemachten Services und wird bei jeder Inanspruchnahme überschrieben.

**Beendigung des Servicevertrags**

Die Beendigung eines Servicevertrags für das Kontingentprodukt richtet sich nach dem am Produkt konfigurierten Ablaufkriterium. Ist das Kriterium „Kontingent“ hinterlegt, kann der Vertrag nur beendet werden, indem alle enthaltenen Services aufgebraucht werden. Bei „Laufzeit“ endet der Vertrag nur durch Erreichen der geplanten Laufzeit, bei „Fahrleistung“ nur durch Erreichen der geplanten Endfahrleistung. Sind mehrere Ablaufkriterien konfiguriert, endet der Vertrag, sobald das erste Kriterium erreicht ist.

**Weitere Hinweise**

Kontingentprodukte können nicht verlängert werden und haben keine abschließende Vertragsprüfung. Die Geltendmachung genutzter Services bleibt wie bisher umgesetzt. Gestaltung und Grafiken folgen den Vorgaben der Mercedes-Benz Workbench UI-UX.