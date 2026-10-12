# Batch 825 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsübertragung und Signatur**

Bei der Übertragung eines Vertrags stehen als Signaturoptionen nun auch die Varianten „On-Premise“ und „DSS“ zur Verfügung. Damit lässt sich die Unterschrift für den Transfer auf denselben Wegen einholen wie bei anderen Vertragsprozessen. Außerdem wurde ein Fehler behoben, durch den die verbleibende Laufleistung nach einer Übertragung nicht korrekt aktualisiert wurde.

**Vertragsstornierung nach der Aktivierung**

Der Stornierungsprozess für aktivierte Verträge wurde angepasst. Im Pop-up-Fenster „Vertrag stornieren“ entfällt das Feld „Mileage at Cancellation (Km)“. Zudem kann nur noch ein einzelner Vertrag storniert werden; die Möglichkeit, im Fenster alle Verträge auszuwählen und mehrere Verträge gleichzeitig zu stornieren, wurde entfernt.

Ob die Stornierung gestartet werden kann, hängt von den VEGA-Werkstattrechnungen ab. Liegt für den ausgewählten Vertrag keine VEGA-Werkstattrechnung vor, steht im Aktionsmenü die Option „Cancel Contract“ zur Verfügung, über die der Stornierungsprozess fortgesetzt wird. Existiert dagegen eine Werkstattrechnung, erscheint beim Klick auf diese Option die Meldung „Contract Cancellation cannot be initiated as the contract has an active workshop invoice“.

Für die Schnittstelle i155 gilt: Bei der Aktivierung eines Vertrags ist im Feld RC05, Position 62, standardmäßig der Wert „1“ gesetzt. Wird der Vertrag innerhalb von 14 Tagen nach der Aktivierung storniert, wird beim Erzeugen der i155 dieses Feld auf den Wert „2“ aktualisiert.

**Anzeige des letzten bekannten Kilometerstands im Fahrzeug-Tab**

Im Fahrzeug-Tab wurde das Feld „Actual Mileage (Km)“ in „Last Known Mileage (Km)/Date“ umbenannt. Bis zur ersten Werkstattrechnung über die Schnittstelle i156 zeigt es den Wert an, der in Schritt 1 der Vertragserstellung erfasst wurde. Sobald die erste Werkstattrechnung über i156 eingeht, wird das Feld mit dem von VEGA gesendeten Kilometerstand und dem Datum aktualisiert, an dem dieser Stand während des Werkstattservices in VEGA erfasst wurde, zum Beispiel „10.000 (Km)/16.05.2024“.

Wird der „Mileage at Contract Start (Km)“ nach der Aktivierung geändert, hat das keine Auswirkung auf diesen Wert im Fahrzeug-Tab, sofern die erste Werkstattrechnung bereits erzeugt und über i156 empfangen wurde. Das Feld „Chassis Number“ kann im Fahrzeug-Tab entfallen, da die Fahrgestellnummer bereits im statischen Vertragskopf angezeigt wird.

**Zusammenführung von Vertrags- und Produkt-Tab**

Die bisher getrennten Tabs „Contract“ und „Product“ unter „Contract Details Overview“ wurden zu einem einzigen Tab „Contract“ zusammengeführt. Dieser enthält nun alle Informationen auf Vertrags- und Produktebene. Die Änderung gilt sowohl in Contract Management als auch in Contract Generation.

Im Bereich der Vertragsinformationen werden folgende Felder in dieser Reihenfolge angezeigt: Das „Confirmation Date“ zeigt das Datum der Vertragsbestätigung. Bei digitaler Signatur ist das der Tag, an dem der Kunde das Dokument unterzeichnet hat; bei On-Premise-Signatur der Tag, an dem das unterschriebene Kundendokument in das System hochgeladen wurde. „Contract Duration (Planned)“ wird durch „Contract Real End Date“ im Format TT.MM.JJJJ ersetzt. „Contract Duration (Real)“ wird durch „Contraction Duration (Planned/Real)“ in Monaten ersetzt, zum Beispiel „12 Months/4 Months“. „Planned Total Mileage (Km)“ heißt künftig „Planned Contract Total Mileage (Km)“. Neu hinzu kommt das Feld „Planned Vehicle Total Mileage (Km)“, die Summe aus „Mileage at Contract Start (Km)“ und „Planned Total Mileage (Km)“.

„Real Mileage at Contract End (Km)“ zeigt den Kilometerstand zum Vertragsende, wenn der Vertrag beendet (Terminated) oder abgelaufen bzw. geschlossen (Expired/Closed) ist. Bei aktiven oder ruhenden (Suspended) Verträgen erscheint „-“. „Number of Services (Total/Remaining)“ zeigt bei nicht kontingentierten Produkten „-“. Bei kontingentierten Produkten wird unter „Total“ die Gesamtzahl der geplanten Services und unter „Remaining“ die Anzahl der verbleibenden Services angezeigt.

Das Feld „Industry“ zeigt einen Wert, wenn der Vertrag für einen gewerblichen Kunden erstellt wurde, zum Beispiel Local Tradeperson, Courier oder Traffic Management, wie bei der Vertragserstellung festgelegt. „Contract Type“ zeigt Standalone, Bundle oder Leasing, und „Category“ zeigt New oder Used je nach Fahrzeugkategorie. Für diese drei Felder wird vorerst nur der Feldname angezeigt; die Daten folgen ab PI7. „Salesman“ zeigt die Verkäuferinformation im Format Vorname Nachname. „Contracting Workshop (GSSN+)“ zeigt die GSSN-Nummer. „Source System/Channel“ nennt das Quellsystem, in dem der Vertrag erstellt wurde, zum Beispiel oneSCM bei Verträgen aus der oneSCM-Anwendung.

Im Anschluss an die Vertragsinformationen werden die Produktabdeckungen aufgeführt, also die verpflichtenden und optionalen Deckungen des Vertrags. Angezeigt werden Coverage Code, Coverage Type, Coverage Name und Price. Der Coverage Type lautet „Included“ für verpflichtende und „Optional“ für optionale Deckungen. Der Preis wird bei verpflichtenden Deckungen als „n/a“ dargestellt. Bei optionalen Deckungen erscheint bei monatlichem Zahlungsintervall der monatliche Preis, bei Einmalzahlung der Einmalpreis. Enthält ein Vertrag mehr als 10 Deckungen, wird eine Seitennavigation eingeblendet. Standardmäßig werden 10 Deckungen auf der ersten Seite angezeigt; alternativ kann eine Anzeige mit 10 oder 20 Einträgen gewählt werden.

**Reale Laufleistung bei Vertragsende**

Das Feld „Real Mileage at Contract End (Km)“ zeigte bisher die Summe aus „Mileage at Contract Start (Km)“ und „Planned Total Mileage (Km)“. Nun bleibt es bei aktiven oder ruhenden Verträgen leer und wird als „-“ dargestellt. Ein Wert wird erst gesetzt, wenn der Vertrag beendet oder abgelaufen ist. Bei einer vorzeitigen Beendigung entspricht er dem „Mileage at Termination (Km)“, der im Prozess „Terminate Early“ erfasst wird. Bei Vertragsablauf entspricht er dem Prognosewert zum Zeitpunkt des Ablaufs, sofern keine MIC-API zur Erfassung des tatsächlichen Kilometerstands verfügbar ist.

**Vertragsdauer bei vorzeitiger Beendigung oder Stornierung**

Bisher entsprach die Vertragsdauer dem bei der Vertragserstellung festgelegten geplanten Start- und Enddatum und blieb auch bei vorzeitiger Beendigung oder Stornierung unverändert. Nun wird die Vertragsdauer bei „Terminate Early“ oder „Cancel Contract“ mit dem tatsächlichen Enddatum des Vertrags aktualisiert.

**Vega-Historie**

Die Vega-Historie wird nun auch dann aktualisiert, wenn keine i155 erzeugt wurde.