# Batch 788 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 24 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management: Neuerungen und Korrekturen**

**Steuerverwaltung (Tax Management)**

Die Steuerverwaltung, die bisher für den indischen Markt definiert war, wurde erweitert und gilt künftig als globaler Standard für alle Märkte. Die Seite „Tax Management" befindet sich weiterhin in den Markteinstellungen. Das Feld „Finance System Document Code" akzeptiert nun acht alphanumerische Zeichen. Das Dropdown „GST Type" und seine Werte wurden aus den Steuerarten entfernt. Die Steuerart wird stattdessen aus den Markteinstellungen übernommen, und zwar unter Admin -> Market Setting -> General Settings -> Tax Type (allgemeine Regel für alle Märkte). Zur Definition des Steuersatzes gibt es nur noch einen einzigen Steuerfaktor, für GST ist dies der Tax Factor for GST.

Ein MPC-Benutzer des indischen Marktes kann nach der Anmeldung am Markt Indien den GST-Prozentsatz in der Tax-Management-Tabelle festlegen. Unter „Tax Management -> Tax Type" wird die Steuerart GST angezeigt, und es lassen sich Steuersätze anlegen und mit einem Prozentwert versehen. Der im Feld „Finance System Document Code" erfasste Wert wird in der ausgehenden Rechnungsdatei (Export SWTInvExp) mitgeliefert.

**Verlängerung (Prolongation)**

Mehrere Fehler rund um die Verlängerung von Verträgen wurden behoben. In der Verlängerung eines Vertrags werden nun alle Werte korrekt angezeigt. Die E-Mail zur Langzeitverlängerung wird nicht mehr zehnfach versendet. Bei der Verlängerung eines Vertrags für Gewerbekunden wird der Status der SEPA-Dokumentunterschrift nicht mehr fälschlich mit NOK angezeigt. Außerdem verschwindet der Fortschrittsbalken der Verlängerung nicht mehr erst nach erneutem Aufruf des Vertrags, sondern wird korrekt ausgeblendet. Für Dokumente zur Langzeitverlängerung stehen zusätzlich die Platzhalter contractMonthlyNetPrice, contractMonthlyGrossPrice und contractMonthlyVatPrice zur Verfügung.

**Vertragsübertragung und Zahlerwechsel**

Ein für einen Gewerbekunden angelegter Vertrag kann nun übertragen werden. Für den Prozess „Zahlerwechsel" (Change Payer) wird zusätzlich eine neue Kundennummer (newCustomerId) übergeben.

**I155-Datei**

Die I155-Datei lässt sich wieder aus der Vertragshistorie herunterladen. Zudem wurde ein Java-Heap-Space-Fehler behoben, der beim Herunterladen der I155-Datei in den Batch-Jobs auftrat.

**Vorzeitige Vertragsbeendigung**

Die vorzeitige Beendigung wurde anhand verschiedener Szenarien geprüft, die jeweils auch die Datumsangaben in der I155-Datei umfassen. Das Beendigungsdatum darf höchstens 90 Tage in der Vergangenheit liegen. Bei Verträgen ohne FRD muss es nach dem Aktivierungsdatum plus einem Tag liegen. Bei FRD-bezogenen Verträgen gilt FRD plus ein Tag als spätestes mögliches Beendigungsdatum, sofern der FRD weniger als 90 Tage zurückliegt. Liegt der FRD mehr als 90 Tage zurück, ist das maximal mögliche Beendigungsdatum 90 Tage ab heute zurück. Ein Beendigungsdatum, das dem FRD entspricht, wurde für FRD-bezogene Verträge ebenfalls geprüft. Werden mehrere Verträge beendet und zuerst das Beendigungsdatum gewählt, wird geprüft, welche Verträge für die Beendigung infrage kommen.

**Löschung von Verträgen**

Beim Ausführen des Jobs „DeleteContracts" wird ein Vertrag im Status „Rejected" zur Löschung markiert. Das zugehörige SEPA-Dokument wird dabei bislang nicht zur Löschung markiert; dieser Punkt ist in Verwendung, und die Unterschrift des SEPA-Dokuments wird vor der Löschmarkierung geprüft.