# Batch 843 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise Contract Management**

**Vertragsdaten und Laufzeit**

Das geplante Vertragsende wird jetzt taggenau berechnet und liegt immer einen Tag vor dem Ablauf der gewählten Laufzeit. Als Vertragsbeginn wird das Datum der Erstzulassung (FRD) übernommen, die Laufzeit in Monaten wählen Sie in der Produktkonfiguration (zum Beispiel 12, 24 oder 36 Monate). Beginnt ein Vertrag am 01.12.2023 und hat eine Laufzeit von 24 Monaten, endet er planmäßig am 30.11.2025. Bei 12 Monaten und gleichem Beginn ergibt sich entsprechend der 30.11.2024 statt wie zuvor der 01.12.2024. Auch Bestätigungs- und Aktivierungsdatum übernehmen beim Anlegen eines Vertrags den Wert der Erstzulassung, während das tatsächliche und das geplante Vertragsende berechnet werden. Diese Werte werden nicht mehr mit der Anfrage zur Vertragserstellung übermittelt.

Außerdem wurde ein Fehler behoben, bei dem der beim Anlegen eines Vertrags eingegebene Kilometerstand nach dem Bestätigen oder Aktivieren im Feld „Actual Mileage“ auf dem Reiter „Vehicle“ der Übersicht leer angezeigt wurde. Der eingegebene Wert wird nun korrekt dargestellt.

**Vorzeitige Beendigung**

Im Dialogfenster „Terminate Early“ wurden mehrere Anpassungen vorgenommen. In der Auswahlliste der Gründe steht die Option „Transfer“ nicht mehr zur Verfügung. Die Bezeichnung des Auswahlfelds wurde korrigiert: Statt einer technischen Meldung wird nun „Select Reason“ angezeigt. Zudem ist eine Rückdatierung nicht mehr möglich. Ein Vertrag kann also nicht mehr mit einem „Date of Termination“ beendet werden, das weit vor dem Vertragsbeginn liegt.

**E-Mails und Dokumente**

Es wurde ein Fehler behoben, bei dem nach der Aktivierung eines Vertrags nur die Bestätigungs-E-Mail, nicht aber die Aktivierungs-E-Mail zugestellt wurde. Sind in der Template-Verwaltung Vorlagen für Bestätigung und Aktivierung definiert, sollen beide E-Mails empfangen werden. Ebenso wurde das Problem behandelt, dass beim Klick auf „Sent to Email“ im Bereich „Documents & Notifications“ eines Vertrags keine E-Mail ankam. Der Benutzer soll das Dokument nun per E-Mail erhalten.

**Export**

In der Vertragsverwaltung können die Details aktiver Verträge, deren geplantes Vertragsende in den nächsten drei Monaten liegt, als CSV-Datei exportiert werden. Die Kopfzeile der Tabelle enthält die in der zugehörigen Vorgabe festgelegten Felder.

**Schnittstelle i155 zu VEGA**

Die Coverage-ID in der i155-Datei (Satzart RC20, Position 66 bis 97, 32 Stellen) war bisher für alle Deckungen mit einem festen Wert belegt, was in VEGA zu Fehlern führte und den Import von Verträgen verhinderte. Künftig erhält jede Deckung eine eindeutige, numerische, 32-stellige Coverage-ID, und zwar auch vertragsübergreifend. Die Vergabe beginnt bei 00000000000000000000000000000001 und wird für jede neu hinzugekommene ID um 1 erhöht. Wird die i155 zum ersten Mal erzeugt, erhalten beispielsweise die Coverage Codes P001, P002 und P003 die IDs ...0001, ...0002 und ...0003. Wird anschließend ein zweiter Vertrag erstmals erzeugt, erhalten dessen Deckungen die nächsten IDs, also ...0004 bis ...0006. Ändern sich später der Status oder andere Attribute eines Vertrags, enthält die i155 nur die Änderungen, die ursprünglich vergebenen Coverage-IDs bleiben unverändert.

Außerdem wird der VEGA-Vertragstyp nun korrekt ausgegeben. Er wird zusammen mit den Produktdaten übermittelt, im Vertrag gespeichert und in der i155 an Position 80 bis 90 angezeigt. Für das Produkt CompleteCare erscheint dort „P_CPLC“ statt fälschlich „P_EXC“.

Schließlich wird die erzeugte i155-Datei nun im richtigen Ablageort in Amazon S3 gespeichert, nämlich unter INT/DE/VEGA/Outgoing/i155, gemäß der festgelegten Ordnerstruktur auf AWS.