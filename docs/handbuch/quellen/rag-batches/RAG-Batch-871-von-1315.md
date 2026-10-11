# Batch 871 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**MO-Prüfungen: Verbesserungen bei Bestätigung, Download und „Alle OK"-Ansicht**

In der MO-Prüfungsübersicht (MO Checks Verification) stehen mehrere Verbesserungen zur Verfügung, die die tägliche Arbeit mit Vertragsprüfungen erleichtern. Sie betreffen die aktive Bestätigung einzelner Prüfungen, den Download der Ergebnisliste sowie die Sichtbarkeit vollständig geprüfter Verträge, und zwar sowohl vor als auch nach der Aktivierung.

**Aktive Bestätigung von Prüfungen**

Die Prüfungen Campaign, Additional Verification, Mileage und Industry können direkt in der Oberfläche aktualisiert bzw. bestätigt werden. Dazu klicken Sie in der jeweiligen Prüfzeile unmittelbar auf die Bestätigung; ein separates Menü ist nicht erforderlich. Alle übrigen Prüfungen bleiben reine Ansichtsfelder und bieten keine Bestätigungsaktion an.

Nach dem Klick öffnet sich ein Bestätigungsdialog, bevor etwas gespeichert wird. Der Dialog zeigt den genauen Statuswechsel und passt seine Beschriftung an die Richtung an. Beim Wechsel von „Not Ok" auf „Ok" lautet der Titel „Set to OK" und der Übergang „Not Ok › Ok". Beim Wechsel von „Ok" auf „Not Ok" lautet der Titel „Set to Not Ok" und der Übergang „Ok › Not Ok". Der Dialog nennt den Text „The status for <Check> will be changed" und fragt nach den Gründen der Änderung. Mit „Cancel" bleibt alles unverändert und es wird nichts aufgezeichnet. Mit „Proceed" wird die Änderung übernommen, allerdings erst, wenn im Kommentarfeld ein Grund eingetragen wurde. Dies gilt für beide Richtungen.

Jede Änderung wird als neue, unveränderliche Version für die Nachvollziehbarkeit gespeichert, mit Angabe, wer die Änderung wann (in UTC) von welchem auf welchen Status vorgenommen hat und aus welchem Grund. Es wird nichts überschrieben, die gesamte Historie bleibt erhalten. In der Prüfungsvorschau wird stets nur die letzte Version angezeigt, also der aktuelle Status und der letzte Grund; der letzte Benutzer und der Zeitstempel erscheinen beim Darüberfahren mit der Maus. Frühere Versionen sind ausschließlich über die Audit-Historie abrufbar.

Die Bedingung für die Fortsetzung der Aktivierung bleibt unverändert: Sie wird nur fortgesetzt, wenn jede zutreffende Prüfung eines Vertrags den Status OK, OK_ACKNOWLEDGED oder NOT_APPLICABLE hat. Solange mindestens eine Prüfung offen ist (etwa NOT_OK, PENDING, NOT_YET_AVAILABLE, NOT_OK_ACKNOWLEDGED oder EXECUTION_FAILED), ist die Aktivierung blockiert. Der Bestätigungsmechanismus im Backend bleibt ebenfalls unverändert.

**Download der vollständigen gefilterten Liste**

Der Download exportiert nun die gesamte gefilterte Ergebnismenge und nicht mehr nur die aktuell sichtbare Seite. Maßgeblich sind die Filter, die auf dem Bildschirm gesetzt sind, zum Beispiel Division, Status, Domäne, Prüfstatus oder Datumsbereiche. Es wird also kein ungefilterter Gesamtauszug der Tabelle erzeugt.

Die Exportdatei enthält eine Zeile pro Vertragsreferenznummer und einzelner Prüfung. Hat ein Vertrag beispielsweise zwölf zutreffende Prüfungen, entstehen zwölf Zeilen. Jede Zeile enthält Prüfungsname, Kategorie und Status zusammen mit der Referenznummer und den übrigen bereits vorhandenen Exportspalten. Das erleichtert Berichte und Audits, ohne dass Sie manuell durch die Ergebnisseiten blättern müssen.

**Vollständig geprüfte Verträge: „Alle OK"-Filter**

Das Standardverhalten ändert sich nicht: Verträge, bei denen alle Prüfungen OK, OK_ACKNOWLEDGED oder NOT_APPLICABLE sind, werden in der Standardansicht weiterhin ausgeblendet, sodass Ihre tägliche Ansicht auf Verträge mit Handlungsbedarf fokussiert bleibt. Neu ist ein eigener „Alle OK"-Filter (All OK), der per Klick zur Verfügung steht, neben bzw. innerhalb des bestehenden Prüfstatus-Filters. Damit lassen sich vollständig geprüfte Verträge bei Bedarf anzeigen, ohne die passende Filterkombination selbst zusammenstellen zu müssen. Das Datenmodell bleibt dabei unverändert; die bereits mögliche Abfrage nach den OK-Verträgen wird lediglich zu einer leicht auffindbaren Filteroption.

**„Alle OK"-Filter nach der Aktivierung**

Der „Alle OK"-Filter funktioniert auch für Verträge, die bereits den Status ACTIVE erreicht haben, und ist nicht auf Status vor der Aktivierung (Created, Waiting for Confirmation, Confirmed, Waiting for Activation) beschränkt. Er gilt für den gesamten bestehenden Statusumfang der Übersicht, einschließlich ACTIVE und SUSPENDED. Es sind keine neuen Vertragsstatus nötig. So können Sie etwa für ein Audit prüfen, ob die Prüfungen eines bereits aktivierten Vertrags tatsächlich alle OK bzw. nicht zutreffend sind oder ob eine vor der Aktivierung bestätigte Prüfung weiterhin korrekt abgebildet ist, und zwar ohne die Ansicht oder Abfrage zu wechseln. In der Standardansicht ohne „Alle OK"-Filter bleiben auch aktive Verträge mit ausschließlich erfolgreichen Prüfungen ausgeblendet, konsistent zum Verhalten vor der Aktivierung.