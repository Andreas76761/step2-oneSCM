# Batch 264 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Änderungen und Neuerungen**

**Chargenjobs: Übersicht der letzten Läufe**
In der Chargenjob-Übersicht wurden bisher nur die Details des jeweils letzten Laufs angezeigt. Wenn ein Lauf fehlschlug und der nächste erfolgreich war, konnten Administratoren die Details des fehlgeschlagenen Laufs nicht mehr einsehen. Künftig sehen Administratoren für jeden Job die letzten fünf Läufe samt Details.

Jeder Chargenjob wird in einer Zeile dargestellt, mit Jobname, Jobstatus, Markt-ID, letzter Laufzeit und nächster Laufzeit. Die letzte Laufzeit wird aktualisiert, sobald ein neuer Lauf endet. Die nächste Laufzeit wird aktualisiert, wenn der Lauf planmäßig erfolgte oder wenn der Zeitplan geändert wird. In der Spalte „Aktionen“ steht die neue Aktion „View“ zur Verfügung, die den Bereich „Search/Download file“ öffnet. Die bisherige Weiterleitung beim Klick auf den Jobnamen entfällt.

Hinter dem Jobnamen erscheint eine Schaltfläche zum Aufklappen, sofern der Job mindestens einen Lauf hat. Beim Aufklappen wird eine Liste der letzten fünf Läufe angezeigt. Da bei jedem Aufklappen eine Schnittstelle aufgerufen wird, wurde angemerkt, dass es sinnvoll wäre, die Schaltfläche auch für Jobs ohne Lauf anzuzeigen und für diesen Fall eine eigene Darstellung vorzusehen.

Die Tabelle der Läufe enthält folgende Spalten: Job-ID zur Identifikation des Jobs, Startzeit (UTC) und Endzeit (UTC) jeweils im Format dd.MM.yyyy hh:mm:ss sowie die Dauer im Format hh:mm:ss. Der Status lautet „Success“ bei erfolgreichem Lauf und „Error“ bei einem fehlerhaften Lauf. Die Spalte „User ID“ zeigt den Benutzer, der den Lauf gestartet hat. Bei geplanten Läufen steht dort „SYSTEM“. In der Spalte „Aktionen“ ist die Funktion „See logs“ vorgesehen.

**Chargenjobs: Fehler- und Warnprotokolle (offen)**
Geplant ist, dass Administratoren die Fehler- und Warnmeldungen eines Chargenjob-Laufs einsehen können. Treten bei einem Lauf Fehler oder Warnungen auf, sollen diese zur späteren Prüfung gespeichert werden. Über die Chargenjob-Seite und die Option „See Logs“ gelangt man zu den Protokollen eines bestimmten Laufs. Es öffnet sich eine neue Seite mit einem Suchbereich und einem Ergebnisbereich.

Im Suchbereich kann nach Zeitstempel, Kritikalität und Nachricht gesucht werden. Die Kritikalität (Error/Warning) wird über ein Dropdown mit Mehrfachauswahl gewählt und zeigt nur die Werte, die in der Datenbank vorhanden sind. Bei der Nachricht wird gesucht, ob sie einen bestimmten Text enthält. Die Ergebnisse zeigen Zeitstempel, Kritikalität und Nachricht. Administratoren sollen alle von einem Lauf erzeugten Protokolle einsehen und nach Zeitstempel, Kritikalität oder Nachricht suchen können.

**Vertragserstellung: Steuerklassifizierung**
Beim Erstellen eines Vertrags, im Schritt 2 „Customer & Payment Information“, war das Feld „Tax Classification“ bisher fest vorgegeben. Nun werden die Werte aus der Steuerverwaltung übernommen. Sind für einen Markt dort nur zwei Optionen hinterlegt, werden im Feld auch nur diese beiden angezeigt. Die gewählte Steuerklassifizierung wirkt sich auf die Rechnungserstellung aus. Händler können so die für ihren Markt verfügbaren Werte auswählen.

**Rechnung bearbeiten: Datumsauswahl**
In der Maske „Edit Invoice“ zeigte die Datumsauswahl die gesperrten Tage nicht korrekt an, sodass ungültige Daten gewählt werden konnten und anschließend eine Fehlermeldung erschien. Dieses Problem wurde behoben.

**Technische Anpassungen**
Die Paketstruktur aller Anwendungen wurde neu geordnet, da die Anwendungen größer geworden sind und verschiedene Domänen umfassen. Auf oberster Ebene steht nun ein Paket mit dem Namen des Streams (zum Beispiel gssn, db, s3, i156, e169). Darunter liegen die üblichen Pakete wie rest, service und weitere.

**Nicht umgesetzte Vorhaben**
Die Änderung des Routings im Batch-Job-Service, bei der andere Microservices über das Gateway aufgerufen werden sollten (inklusive Übernahme des Kong-Autorisierungs-Headers), wurde abgebrochen. Ebenfalls abgebrochen wurde das Vorhaben zum Thema „Contract is suspended“, zu dem keine inhaltlichen Angaben vorliegen.