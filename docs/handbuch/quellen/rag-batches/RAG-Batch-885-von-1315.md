# Batch 885 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Marktspezifische Validierungen in den Market Settings**

Im Bereich Contract Generation war vorgesehen, marktspezifische Validierungen künftig über die Marktkonfiguration zu steuern. Sobald ein neuer Markt aktiviert wird, soll das Format der Eingaben anhand der Validierung geprüft werden, die auf Ebene der Marktkonfiguration hinterlegt ist. Als Felder, die sich von Markt zu Markt unterscheiden, sind bislang die Umsatzsteuer-Identifikationsnummer, die Steuernummer und die Postleitzahl bekannt. Die Felder für reguläre Ausdrücke (Regex) sollen ausschließlich technischen Benutzern zur Verfügung stehen. Ein Regex wird zudem geprüft, bevor er in der Datenbank gespeichert wird. Die Validierungen werden nicht nach Divisions aufgeteilt. Dieses Vorhaben ist abgeschlossen.

**Anpassung der Sonderfall-Preisbestandteile (Backend und Dialog)**

Geplant war, in der Ansicht „Special Case - Components" den Sonderfall-Preis als eigenständigen Preisbestandteil zu behandeln, bei dem Benutzer die Administrationsgebühr direkt bearbeiten können. Außerdem sollten alle Deckungen je Kostenstelle angezeigt werden. Dieses Vorhaben wurde abgebrochen und daher nicht umgesetzt. Die beschriebene Funktionalität steht entsprechend nicht zur Verfügung.

**Fehlende Baumuster-Tests in der automatisierten Qualitätssicherung**

Die Testabdeckung für Baumuster ist über Kundentypen und Kombinationen von Kennungen hinweg bislang unvollständig. Einige Abläufe stützen sich derzeit auf vorhandene Fahrgestell- und Auftragsnummern für Privat- und Geschäftskunden, während andere Kombinationen, die neue Werte erfordern, fehlen oder nicht vollständig abgedeckt sind. Ziel ist es, in der automatisierten Qualitätssicherung (AQA) alle Kundentypen und Kennungskombinationen der Abdeckungsmatrix zu berücksichtigen.

Für Privatkunden (PRIVATE_CUSTOMER) und Geschäftskunden (COMMERCIAL_CUSTOMER) sind Fahrgestellnummer und Auftragsnummer bereits vorhanden. Neu sind jeweils Deal-ID, Verso-ID und Fahrgestellnummer ohne FRD. Für Geschäftskunden mit Flotte (COMMERCIAL_FLEET), private Behördenkunden (PRIVATE_GOVERNMENTAL) und gewerbliche Behördenkunden (COMMERCIAL_GOVERNMENTAL) sind alle fünf Kennungen neu: Fahrgestellnummer, Auftragsnummer, Deal-ID, Verso-ID und Fahrgestellnummer ohne FRD.

Als maßgebliche Grundlage für die Erstellung der Szenarien dient die „Full coverage matrix after all changes". Jede Zeile der Matrix soll durch mindestens einen automatisierten Test abgebildet und mit der Testdokumentation, beispielsweise in Xray, verknüpft sein. Die Arbeit gilt als abgeschlossen, wenn alle fünf Kundentypen durch automatisierte Baumuster-Tests abgedeckt sind und jeder Test genau die in der Matrix definierte Kombination aus vorhandenen und neuen Werten prüft. Fehlende Szenarien werden umgesetzt und der AQA-Suite hinzugefügt. Die Tests sind dokumentiert und lassen sich zur Abdeckungsmatrix (sowie gegebenenfalls zu Xray) zurückverfolgen. Die Ausführungsergebnisse sind in der Standardberichterstattung mit eindeutigem Bestanden-/Fehlgeschlagen-Status sichtbar. Dieses Vorhaben ist noch offen.