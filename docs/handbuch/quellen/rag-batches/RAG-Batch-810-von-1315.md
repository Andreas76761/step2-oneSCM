# Batch 810 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 21 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management: Neuerungen und Verbesserungen**

**Automatischer Ablauf von Verträgen nach Laufleistung**

Servicevertäge konnten bisher nur auf ausdrücklichen Wunsch des Kunden oder mit Erreichen des geplanten Vertragsendes beendet werden. Neu ist, dass ein Servicevertrag automatisch ausläuft, sobald die vorab festgelegte Laufleistung erreicht ist. Damit endet der Vertrag entsprechend der tatsächlichen Nutzung, und unnötige Kosten oder Leistungen über die geplante Laufleistung hinaus werden vermieden. Da fahrzeugbezogene Produkte und Servicevorträge sowohl laufleistungs- als auch laufzeitbasiert sind, beendet diejenige Bedingung den Vertrag, die zuerst eintritt.

Grundlage sind die Laufleistungsangaben aus den Service-Claims, die über die Schnittstelle i156 importiert werden. Bei jedem Service erfasst die Werkstatt den Kilometerstand zum Servicedatum und übermittelt ihn zusammen mit dem Claim. Sobald der Claim durch Revenue importiert wurde, erhält die Vertragsdomäne den Kilometerstand und das Datum der Erfassung. Beide Werte werden in der Vertragsdetailansicht auf dem Reiter „Fahrzeug" unter „Last Known Mileage (Km)/Date" angezeigt.

Der empfangene Kilometerstand wird mit der geplanten Gesamtlaufleistung des Vertrags (Planned Contract Total Mileage, Km) verglichen. Liegt er darunter, läuft der Vertrag unverändert weiter. Ist er gleich oder höher, wird der Vertragsstatus auf „Expired" gesetzt. In diesem Fall wird eine i155-Nachricht mit dem Vega-Code „003" an Vega gesendet, der Verlauf (History) wird mit einem entsprechenden Grund aktualisiert und eine Vertragsüberprüfung (Contract Review) wird ausgelöst. Außerdem werden Ereignisse für Reporting und Nemesis erzeugt. Eine E-Mail-Benachrichtigung an den Kunden auf Basis der zugehörigen Vorlage ist vorgesehen; die Vorlage und die Berücksichtigung des Grundes als Druckvariable waren zum Zeitpunkt der Ticketerstellung noch offen. Ebenso war noch nicht abschließend geklärt, wie Revenue darüber informiert wird, dass der Kunde die Restlaufzeit des Vertrags zu zahlen hat. Werden Laufleistungs- und Enddatumsbedingung gleichzeitig erfüllt, gilt die zuerst erreichte Bedingung.

Zu beachten ist das Risiko, dass Kunden die im Vertrag enthaltene Laufleistung überschreiten können, was Kosten durch Mehrkilometer verursacht und dazu führen kann, dass Service über die vereinbarte Laufleistung hinaus beansprucht wird.

**Einschränkung von Funktionen nach Produktkonfiguration**

Kurzfristige Verlängerung, langfristige Verlängerung und Vertragsübertragung waren bisher für aktive Verträge unabhängig von der Produktkonfiguration möglich. Nun richten sich diese Funktionen nach den Berechtigungen, die auf Produktebene festgelegt sind. Ist die kurzfristige oder die langfristige Verlängerung im Produkt nicht ausgewählt, wird die jeweilige Funktion in der Prolongation deaktiviert, andernfalls ist sie aktiviert. Sind beide Verlängerungsarten deaktiviert, entfällt die Option „Prolongation" im Aktionsmenü der Vertragsdetailansicht. Die Vertragsübertragung wird im Aktionsmenü beziehungsweise in der Vertragsdetailansicht ebenfalls nur angeboten, wenn sie in der Produktkonfiguration ausgewählt ist.

**Weitere Verbesserungen**

Ein Vertrag im Status „Suspended" kann jetzt auch vorzeitig beendet werden (Early Termination), nicht mehr nur reaktiviert. Das ist beispielsweise sinnvoll, wenn ein Kunde nach drei Monaten weiterhin nicht zahlt und der Markt entscheiden möchte, den Vertrag vorzeitig zu beenden.

Der Vertragsstatus wird in der Oberfläche nun sofort aktualisiert, sobald er sich ändert. Zuvor wurde der Status zwischengespeichert, sodass die Anzeige verzögert war. Dies gilt für alle in oneSCM verfügbaren Status.

Bei Stornierung eines Vertrags wird das tatsächliche Enddatum jetzt in der Vertragsdauer (Planned/Real) aktualisiert. Außerdem wurde der Fehler behoben, dass die vorzeitige Beendigung bei mehreren Verträgen gleichzeitig nicht funktionierte, ebenso das Problem bei der vorzeitigen Ablösung (Early Settlement) von monatlicher Zahlung auf Einmalzahlung. Ein Fehler, durch den beim Ablauf eines Vertrags keine VEGA-Exportdatei erzeugt wurde, wenn der VEGA-Batch lief, wurde ebenfalls korrigiert.

Zudem wurden mehrere technische Korrekturen vorgenommen: Das Länderkennzeichen des Vertrags (contractCountry) wird nun im Review-Profil-Ereignis mitgegeben, ein Cast-Fehler bei Vertragsereignissen für Nemesis wurde behoben, ein Timeout von 15 Sekunden bei der Vertragserzeugung wurde beseitigt, und die Frontend-Begrenzung des Kommentarbereichs wurde an die Begrenzung im Backend angeglichen.