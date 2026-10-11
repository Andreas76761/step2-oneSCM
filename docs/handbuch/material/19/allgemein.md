# Material zu 19 Ohne Unterkapitel-Zuordnung

Kapitel 19 IT Architektur. 41 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 260.2] Batch-Job-Verwaltung

Beim Herunterladen von Dateien aus der Batch-Job-Verwaltung wurde die Dateiendung doppelt angehängt, zum Beispiel „.dat.dat" oder „.csv.csv". Dies wurde korrigiert, sodass heruntergeladene Dateien nur noch ihre ursprüngliche Endung tragen.

Zudem funktionierte die Sortierung der Spalte „Modification Date" nicht. Die Sortierung folgt nun der vom Benutzer gewählten Richtung (aufsteigend oder absteigend).

Für Administratoren steht die Suche nach Dateien eines Batch Jobs zur Verfügung, die in S3 abgelegt sind. Klickt ein Administrator in der Job-Liste auf den Namen eines Batch Jobs, öffnet sich eine neue Seite, die ausschließlich die zugehörigen herunterladbaren Dateien dieses Jobs anzeigt. Im Filterbereich sind zunächst alle Felder leer, und es werden noch keine Dateien angezeigt. Gesucht werden kann nach dem Dateinamen (enthält-Suche) sowie über ein Dropdown zum Zeitraum mit den Werten „Today", „Last week", „Last month" und „Last 3 months". Änderungen an den Filtern wirken sich nicht automatisch auf die Ergebnisse aus. Erst ein Klick auf „Search for Files" zeigt die Treffer an. Die Schaltfläche „Reset" setzt die Filter auf den Ausgangszustand zurück und aktualisiert die Ergebnisse.

Der Ergebnisbereich zeigt den Namen des gewählten Batch Jobs und eine Tabelle mit den Dateien. Die Tabelle enthält ein Kontrollkästchen, mit dem alle Dateien der aktuellen Seite aus- oder abgewählt werden können, sowie die Spalten Dateiname, Größe und Datum. Dateiname und Datum entsprechen den Angaben in S3. Übersteigt die Trefferzahl die maximale Anzahl pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, zwischen denen Administratoren wechseln können. Standardmäßig werden 10 Einträge pro Seite angezeigt. Über ein Dropdown lässt sich dieser Wert auf 10, 20, 30, 40 oder 50 ändern. Die Auswahl wird nicht gespeichert und nach einem Neuladen der Seite wieder auf 10 zurückgesetzt. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 224.2] Batch-Jobs

Die Navigation in der Batch-Job-Übersicht wurde verbessert. Wählt man einen Batch-Job beispielsweise auf der zweiten Seite der Liste aus und öffnet die Detailansicht, führt die Schaltfläche „Zurück" nun wieder auf die zweite Seite, also auf die Seite, auf der der Batch-Job ausgewählt wurde. Zudem wurde ein Fehler behoben, durch den der Batch-Job SAPInvE169EXP fehlschlug.

## [Batch 565.4] GET-Endpunkt und Push-Back-Endpunkt

Beim GET-Endpunkt (Polling) wird der finale Clearing-Status anhand der cusAebCheckID abgefragt, die in der Antwort auf den POST-Aufruf zurückgegeben wurde. Für den Push-Back-Endpunkt liegt eine eigene Spezifikation vor. Voraussetzungen sind, dass die API entwickelt und veröffentlicht wird, dass entweder ein aus dem Internet erreichbarer Endpunkt eingerichtet oder das Gorilla Gateway genutzt wird und dass die Authentifizierung über Zugangsdaten mit OAuth2 erfolgt.

## [Batch 151.2] Komfort bei der Batch-Job-Tabelle

Die Tabelle der Batch-Jobs wurde in der Bedienung verbessert. Ist die Tabelle mit den Job-Läufen geschlossen und wird ein Batch-Job gestartet, öffnet sich diese automatisch. Solange der letzte Lauf nicht beendet ist, wird der Status regelmäßig abgefragt (Short Polling). Dabei wird die Laufzeit in Sekunden mitgezählt und in der Oberfläche angezeigt. Außerdem ist die gesamte Zeile eines Batch-Jobs anklickbar und öffnet die untergeordnete Tabelle mit den Job-Läufen.

## [Batch 163.2] Batch-Jobs für alle Märkte in einer Ansicht

Administrator- und MO-Benutzer sehen künftig alle Batch-Jobs aller Märkte in derselben Ansicht. Die Berechtigungen unterscheiden sich dabei nach Rolle: Administratoren können die Jobs ansehen, ausführen, planen und die zugehörigen Dateien herunterladen. MO-Benutzer können lediglich die Batch-Jobs und deren Job-Läufe einsehen.

Gibt es in einem Markt mehrere Batch-Jobs für denselben Zweck, zum Beispiel die CFDM-Batch-Jobs, bleibt der Name in allen Märkten gleich („CFDM Batch"). Die Unterscheidung erfolgt über die Spalte mit der Markt-ID. Diese Funktion wurde für die Märkte Slowakei, Indien und Deutschland geprüft.

## [Batch 239.2] Batch-Job-Seite: Aktualisieren- und Zurück-Schaltfläche

Auf der Batch-Job-Seite gab es bislang weder eine Schaltfläche zum Aktualisieren noch eine Zurück-Schaltfläche. Nun wird nach dem Start eines Batch-Jobs eine Aktualisieren-Schaltfläche angeboten, mit der sich der aktuelle Ausführungsstatus des Batch-Jobs abrufen lässt. Außerdem wurde eine Zurück-Schaltfläche ergänzt: Wird über „Ansehen“ eine Datei zum Download geöffnet, gelangt man damit wieder zur ursprünglichen Batch-Job-Seite.

## [Batch 261.1] Batch-Job-Verwaltung: Dateien eines Batch-Jobs aus S3 suchen

Administratoren können nach Dateien suchen, die ein bestimmter Batch-Job erzeugt oder verwendet hat, und diese anschließend herunterladen. Dazu wählen sie in der Job-Liste den gewünschten Job aus. Ein Klick auf den Namen des Batch-Jobs öffnet eine neue Seite. Diese zeigt ausschließlich die herunterladbaren Dateien, die zum ausgewählten Batch-Job gehören.

Im Ausgangszustand der Seite „Dateisuche" sind alle Filterfelder leer, und im Ergebnisbereich wird noch keine Datei angezeigt. Im Filterbereich kann nach dem Dateinamen und nach einem Zeitraum gesucht werden. Die Suche nach dem Dateinamen arbeitet nach dem Prinzip „enthält". Der Zeitraum wird in einem Dropdown-Feld mit Einfachauswahl festgelegt. Zur Auswahl stehen „Today", „Last week", „Last month" und „Last 3 months". Änderungen in den Filterfeldern wirken sich nicht automatisch auf die Suchergebnisse aus. Erst ein Klick auf die Schaltfläche „Search for Files" zeigt die Ergebnisse passend zu den gewählten Filtern an. Mit der Schaltfläche „Reset" werden alle Filterfelder in den Ausgangszustand zurückgesetzt, also geleert. Dabei werden auch die Ergebnisse aktualisiert.

Der Ergebnisbereich zeigt den Namen des ausgewählten Batch-Jobs an. Darunter listet eine Tabelle die zugehörigen Dateien aus S3 auf. Die Tabelle enthält eine Spalte mit Kontrollkästchen, den Dateinamen, die Größe und das Datum, wie es in S3 hinterlegt ist. Das Kontrollkästchen in der Kopfzeile markiert alle auf der Seite aufgelisteten Dateien, wenn es aktiviert wird. Wird es deaktiviert, wird die Markierung aller Dateien auf der Seite aufgehoben.

Übersteigt die Zahl der Treffer die maximale Anzahl an Einträgen pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, und Administratoren können zwischen den Seiten navigieren. Standardmäßig werden bis zu 10 Datensätze pro Seite angezeigt. Über ein Dropdown-Feld lässt sich die Anzahl auf 10, 20, 30, 40 oder 50 ändern. Der zuletzt gewählte Wert wird nicht gespeichert. Nach dem Aktualisieren der Seite gelten wieder 10 Datensätze pro Seite.

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 277.3] Batch-Job-Verwaltung: Run Now

Administratoren können einen Job manuell auslösen, woraufhin er sofort zu laufen beginnt. Das wird benötigt, wenn die Ausführung eines Jobs fehlgeschlagen ist und er erneut gestartet werden muss.

Dazu suchen Sie den Job in der Jobliste und wählen in der Spalte „Action" die Option „Run Now". Es erscheint ein Bestätigungs-Popup mit dem Titel „Run Now" und dem Text: „Are you sure you want to start this job now? Please confirm that you would like to run the batch job now. This action cannot be undone." Mit „Cancel" schließen Sie die Bestätigungsmeldung und kehren zur Jobtabelle zurück. Mit „Run Now" lösen Sie den Batch-Job aus, die Meldung wird geschlossen und Sie werden zur Rechnungstabelle weitergeleitet.

Während ein Batch-Job läuft, gilt eine Einschränkung: Befindet sich derselbe Batch bereits in Ausführung, ist die Option „Run Now" deaktiviert. Ein Tooltip weist darauf hin, dass der Batch bereits läuft und nicht erneut ausgelöst werden kann. Gestaltung und Grafiken entsprechen der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 1310.3] Batch-Jobs und Monitoring

Es gibt ein neues Dashboard, auf dem alle Läufe von Batch-Jobs überwacht werden können. Dafür wurde eine API zum Abruf aller Batch-Job-Läufe geschaffen. Sie ist nach allen Feldern sortierbar, paginiert und über das Filterkriterium „jobName“ durchsuchbar. Sie liefert eine Liste von BatchDashboardEntryDto-Objekten. Zudem wurde die Prüfung laufender Jobs verbessert; laufende Jobs werden nun anhand der Execution-ID statt der Instance-ID verifiziert.

## [Batch 162.3] Sprache der Benutzeroberfläche in Batch-Jobs

Die in der Benutzeroberfläche gewählte Sprache wird über den HTTP-Header X-Language übermittelt, analog zum bereits vorhandenen Header X-Market. Dieser Header ist beim Auslösen eines Batch-Jobs verpflichtend. Der Wert wird vom Service normalisiert und geprüft und anschließend als Parameter „language“ an den Batch-Job übergeben. Einzelne Verarbeitungsschritte der Jobs können die Sprache bei Bedarf auslesen.

## [Batch 239.3] Verbesserungen bei Batch-Jobs und Suche

Bei den Batch-Jobs wurden Indexoperationen ergänzt. Dabei wurde behoben, dass das Filtern nach einer nicht vorhandenen oneSCM-Rechnungsnummer dazu führte, dass alle Shards fehlschlugen. Zudem wurde die Textsuche nach vollständigen und unvollständigen Vertragsnummern korrigiert, bei der das Zeichen „/“ Probleme verursachte.

## [Batch 253.2] Batch Jobs Management: „Run Now“

Bisher konnte ein Batch-Job-Lauf auch dann gestartet werden, wenn der Job in einer anderen Sitzung deaktiviert worden war. Dieses Verhalten wurde behoben.

## [Batch 261.2] Batch-Job-Verwaltung: Einen Job aktivieren

Administratoren können einen Job aktivieren, damit er aktiv wird und zum geplanten Datum und zur geplanten Uhrzeit ausgeführt wird. Dazu suchen sie in der Job-Liste nach einem Job mit dem Status „Disabled" und wählen in der Spalte „Action" die Option „Enable". Diese Option steht nur bei Jobs mit dem Status „Disabled" zur Verfügung.

Nach der Auswahl erscheint ein Bestätigungsdialog mit dem Titel „Enable". Der Text lautet: „Are you sure you want to Enable this job? This action will make the job active and will run at the scheduled date and time. Please confirm that you would like to Enable the job."

Der Dialog bietet zwei Schaltflächen. Mit „Cancel" wird der Vorgang abgebrochen. Der Dialog schließt sich, und man gelangt zurück zur Job-Tabelle, ohne dass der Job verändert wird. Mit „Enable" wird der Status des Jobs auf „Enabled" gesetzt. Ein Job mit diesem Status läuft zum geplanten Datum und zur geplanten Uhrzeit. Auch in diesem Fall schließt sich der Dialog, und man gelangt zurück zur Batch-Job-Tabelle.

Auch hier entspricht die Oberfläche der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 271.5] Batch Job Management

Im Batch Job Management stehen Administratoren mehrere Funktionen zur Verfügung. Ein Job kann manuell gestartet werden, was insbesondere nötig ist, wenn ein Lauf fehlgeschlagen ist und erneut angestoßen werden muss. Jobs lassen sich deaktivieren und über „Run a job now“ sofort ausführen. Zudem kann nach Jobs gesucht werden, und die Tabelle bietet eine Seitennavigation, um durch die Einträge zu blättern.

## [Batch 277.2] Batch-Job-Verwaltung: Job deaktivieren

Administratoren können einen Job deaktivieren, sodass er inaktiv wird und zum geplanten Datum und zur geplanten Uhrzeit nicht mehr ausgeführt wird. Das ist erforderlich, wenn ein übergreifendes Problem mit dem Job besteht, das gelöst werden muss, bevor er wieder nach Zeitplan laufen soll.

Dazu suchen Sie in der Jobliste einen Job mit dem Status „Enabled" und wählen in der Spalte „Action" die Option „Disable". Diese Option steht ausschließlich für Jobs mit dem Status „Enabled" zur Verfügung. Anschließend erscheint ein Bestätigungs-Popup mit dem Titel „Disable" und dem Text: „Are you sure you want to Disable this job? This action will make the job inactive and will not run at the scheduled date and time until it will be enabled again manually. Please confirm that you would like to disable the job." Mit „Cancel" schließen Sie die Bestätigungsmeldung und gelangen zurück zur Jobtabelle. Mit „Disable" ändern Sie den Jobstatus auf „Disabled", der Job wird zum geplanten Zeitpunkt nicht mehr ausgeführt, die Meldung wird geschlossen und Sie kehren zur Batch-Job-Tabelle zurück. Gestaltung und Grafiken entsprechen der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 898.2] Automatische Wiederholung durch den Batch-Job

Fehlgeschlagene Prüfungen werden automatisch über den Batch-Job „MO Checks Sync“ erneut ausgeführt. Der Job läuft pro Markt und verarbeitet ausschließlich Prüfungen mit dem Status „Ausführung fehlgeschlagen“. Dazu sucht er alle Verträge mit einer solchen Prüfung und führt nur diese Prüfungen erneut aus; alle anderen Status werden ignoriert. Ist die Ausführung erfolgreich, wird der Status auf das entsprechende Ergebnis (OK, Nicht OK oder Ausstehend) aktualisiert. Besteht das technische Problem weiterhin, bleibt der Status „Ausführung fehlgeschlagen“, und die Prüfung wird beim nächsten geplanten Lauf erneut versucht.

## [Batch 919.2] BRABUS: Upgrade der Java-Version von 17 auf 21

Für BRABUS wurde die Java-Version von 17 auf 21 angehoben. Weitere Angaben, etwa zu Zielverhalten oder Auswirkungen, liegen nicht vor.

## [Batch 451.2] Benachrichtigungssymbol und Benachrichtigungscenter

In der Navigationsleiste sehen MO-Benutzer ein Glockensymbol mit der Anzahl offener Benachrichtigungen. Die Anzahl wird bis 9 angezeigt. Bei mehr als 9 Benachrichtigungen erscheint „9+“. Ein Klick auf die Glocke öffnet auf der rechten Seite das Benachrichtigungscenter, das die Art der Benachrichtigungen zeigt, die bearbeitet werden müssen. Jede Benachrichtigung ist mit der passenden Seite verlinkt, damit die Freigabe einfach und nachvollziehbar erfolgen kann. Das Center lässt sich über das X schließen, anschließend kehrt man zur vorherigen Ansicht zurück. Benachrichtigungen, die eine Aktion erfordern, sind mit einem blauen Punkt markiert. Wurde eine Benachrichtigung bereits durch eine Aktion (z. B. Annahme oder Ablehnung) erledigt, wird sie dort nicht mehr angezeigt. Benachrichtigungen bleiben bestehen, bis die zugehörige Aktion abgeschlossen ist.

## [Batch 457.2] Anzeige und Bedienung des Benachrichtigungscenters

In der Navigationsleiste zeigt ein Glockensymbol die Anzahl der offenen Benachrichtigungen an. Die Anzeige steigt bis 9. Bei mehr als neun Benachrichtigungen erscheint „9+". Ein Klick auf das Glockensymbol öffnet auf der rechten Seite das Benachrichtigungscenter. Dort sehen Sie, welche Benachrichtigungen Ihre Bearbeitung erfordern. Jede Benachrichtigung ist mit der zugehörigen Seite verlinkt, damit die Freigabe einfach und klar erfolgen kann. Benachrichtigungen, die eine Aktion erfordern, sind mit einem blauen Punkt gekennzeichnet. Über das X schließen Sie das Benachrichtigungscenter und kehren zur vorherigen Ansicht zurück. Wurde eine Benachrichtigung bereits durch eine Aktion erledigt, etwa durch Genehmigen oder Ablehnen, wird sie dort nicht mehr angezeigt. Benachrichtigungen bleiben bestehen, bis die zugehörige Aktion durchgeführt wurde.

## [Batch 461.2] Glockensymbol und Benachrichtigungsübersicht

In der Navigationsleiste sehen MO-Nutzer ein Glockensymbol mit der Anzahl offener Benachrichtigungen. Die Anzahl steigt bis 9. Bei mehr als 9 Benachrichtigungen wird "9+" angezeigt. Ein Klick auf die Glocke öffnet rechts das Benachrichtigungscenter, das die Art der Benachrichtigungen zeigt, die bearbeitet werden müssen. Jede Benachrichtigung ist mit der passenden Seite verlinkt, um die Freigabe einfach und klar zu gestalten. Handlungsbedürftige Benachrichtigungen sind mit einem blauen Punkt markiert. Das Center lässt sich über das X schließen, danach kehrt der Nutzer zur vorherigen Seite zurück. Wurde eine Benachrichtigung bereits durch eine Aktion (z. B. Annahme oder Ablehnung) erledigt, wird sie dort nicht mehr angezeigt. Benachrichtigungen bleiben bestehen, bis die zugehörige Aktion durchgeführt wurde.

## [Batch 208.4] Abnahmekriterien

oneSCM kann Kafka-Ereignisse von oneERP über die Schnittstelle empfangen, lesen und verarbeiten. Ist das Nettofälligkeitsdatum gesetzt, das Ausgleichsdatum aber nicht, bleibt der Rechnungsstatus unverändert. Sind Nettofälligkeitsdatum und Ausgleichsdatum gesetzt, wird der Status nach der beschriebenen Regel aktualisiert. Ist das Ausgleichsdatum gesetzt und die Mahnstufe größer als 0, wird der Status ebenfalls nach der Regel aktualisiert.

## [Batch 574.6] Benachrichtigungen

Bei der Massenanlage führte der Sprung aus einer Benachrichtigung auf eine falsche Seite; dies wurde behoben. Zudem wurde korrigiert, dass lange Kundennamen in Benachrichtigungen den vorgesehenen Platz überschritten.

## [Batch 276.2] Dateien eines Jobs suchen

Um erzeugte oder verwendete Dateien eines Jobs zu finden und herunterzuladen, wählen Administratoren den gewünschten Job in der Jobliste aus. Ein Klick auf den Namen des Batch-Jobs öffnet eine neue Seite. Sie zeigt ausschließlich die herunterladbaren Dateien, die zu diesem Job gehören.

Die Seite besteht aus einem Filterbereich und einem Ergebnisbereich. Im Ausgangszustand sind alle Filterfelder leer, und es werden noch keine Dateien angezeigt. Gefiltert werden kann nach dem Dateinamen, wobei die Suche nach dem Prinzip „enthält“ arbeitet, sowie nach einem Zeitraum. Der Zeitraum wird in einem Dropdown mit Einfachauswahl gewählt. Zur Verfügung stehen „Today“, „Last week“, „Last month“ und „Last 3 months“. Änderungen an den Filtern wirken sich nicht automatisch auf die Ergebnisse aus. Erst ein Klick auf die Schaltfläche „Search for Files“ zeigt die Dateien an, die der gewählte Job in S3 erzeugt hat und die zu den gewählten Filtern passen. Die Schaltfläche „Reset“ setzt alle Filter auf den Ausgangszustand zurück, also auf leere Felder, und aktualisiert dabei auch die Ergebnisse.

Im Ergebnisbereich steht der Name des ausgewählten Batch-Jobs. Darunter listet eine Tabelle die Dateien des Jobs mit den Spalten Kontrollkästchen, Dateiname, Größe und Datum. Der Dateiname entspricht dem Namen der Datei in S3, das Datum dem in S3 angegebenen Datum. Das Kontrollkästchen in der Kopfzeile markiert alle auf der Seite aufgeführten Dateien. Wird es wieder abgewählt, werden auch alle Markierungen aufgehoben.

Übersteigt die Zahl der Treffer die maximale Anzahl pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, zwischen denen Administratoren wechseln können. Standardmäßig werden 10 Einträge pro Seite angezeigt. Über ein Dropdown lässt sich dieser Wert auf 10, 20, 30, 40 oder 50 ändern. Die Auswahl wird nicht gespeichert und nach dem Neuladen der Seite auf 10 zurückgesetzt.

## [Batch 788.4] I155-Datei

Die I155-Datei lässt sich wieder aus der Vertragshistorie herunterladen. Zudem wurde ein Java-Heap-Space-Fehler behoben, der beim Herunterladen der I155-Datei in den Batch-Jobs auftrat.

## [Batch 1277.9] Allgemeines und Import

Die Karten der Startseite sind in anderen Sprachen als Englisch nun korrekt ausgerichtet. Fehler beim CePro-Import, einschließlich des Fehlschlagens des Import-Batch-Jobs auf der INT-Umgebung, wurden behoben.

## [Batch 1315.4] Prüfung der USt-IdNr. im B2B-Prozess

Im B2B-Ablauf erfasst oneSCM Firmenname, Rechtsform, USt-IdNr. und Firmenadresse. Für die USt-IdNr. gilt eine länderspezifische Prüfung; für Deutschland sind das genau 11 alphanumerische Zeichen ohne Leerzeichen, zum Beispiel DE123456789. Bisher prüften die Märkte (Belgien, Frankreich, Schweden, Dänemark) vor der Aktivierung Firmenname, Adresse und USt-IdNr. auf externen Webseiten wie dem VIES-Portal der EU-Kommission. Daher wurde ein Validierungsdienst für die USt-IdNr. innerhalb von oneSCM umgesetzt. Er soll prüfen, ob die USt-IdNr. existiert und gültig ist, und die zugehörigen Angaben zu Firmenname, Rechtsform, Adresse und Steuersätzen liefern. In oneAPI HUB wurde keine passende API gefunden, weshalb externe Angebote wie die VIES-Schnittstelle und Vatify betrachtet wurden.

## [Batch 519.10] Pflichten des Konsumenten

Der Konsument authentifiziert und validiert die Anfrage, speichert oder reiht sie dauerhaft ein und antwortet erst dann, innerhalb von 10 Sekunden, mit 202. Er dedupliziert anhand von Idempotency-Key und eventId, verlässt sich nicht auf die Ankunftsreihenfolge und ignoriert unbekannte JSON-Felder. Er nutzt zutreffende Statusklassen: 4xx für dauerhafte Validierungsfehler, 5xx oder 429 bei vorübergehender Annahmeunfähigkeit. Außerdem stellt er stabile Endpunkte für Vorproduktion und Produktion sowie einen betrieblichen Ansprechpartner bereit. Er validiert das Token auf Aussteller, Zielgruppe, Ablauf, Signatur und Scope (z. B. final-invoices.write).

## [Batch 565.3] Antwortkombinationen und Entscheidungsregeln

Die Antwort des Systems wird anhand der Felder matchFound, wasGoodGuy und wasBadGuy ausgewertet. Sind alle drei Werte „false“, liegt kein Treffer vor und der Geschäftsvorgang kann fortgesetzt werden. Lautet die Kombination matchFound = true, wasGoodGuy = false und wasBadGuy = true, liegt ein Treffer vor und der Vorgang wird gestoppt. Bei matchFound = true, wasGoodGuy = true und wasBadGuy = false liegt kein Treffer vor und der Geschäftsvorgang wird fortgesetzt. Bei matchFound = true, wasGoodGuy = false und wasBadGuy = false muss der Clearer eingebunden werden und im TraCS-Frontend entscheiden, ob ein Treffer vorliegt. Ist eine der Bedingungen nicht erfüllt, wird dies wie bisher als potenzieller Treffer ohne finale Entscheidung behandelt. Die endgültige Klärung wird dann über den Push-Back-Endpunkt empfangen.

## [Batch 873.6] Hinweise zum Umfang

Das Leasing-Backend besteht bereits; diese Erweiterung macht es im Retail-UI zugänglich und regelt den Zugriff darauf. „Sales Channel" ist ein neues, gespeichertes und abfragbares Feld am Vertrag. Eine Anlage von Leasing-Verträgen im Retail-UI, Änderungen an der MBLD-/Edge-Schnittstelle über das für Bestätigung und Aktivierung Nötige hinaus sowie Änderungen an der Händleroberfläche gehören nicht zum Umfang.

## [Batch 874.6] Fahrgestellnummer nach Erfassung der FRD

Sobald der Fahrgestellnummer eine FRD zugeordnet ist, ist die Fahrgestellnummer für den weiteren Lebenszyklus des Vertrags eingefroren. Liefert der Fahrzeug-Microservice danach eine abweichende Nummer, wird diese weder übernommen noch überschrieben; die gespeicherte Fahrgestellnummer bleibt der zuletzt validierte Wert.

## [Batch 1315.2] Historie und Datenhaltung

Bisher gab es in oneSCM keinen globalen Historienservice. Ein neuer Microservice kann nun Änderungen an beliebigen Objekten in oneSCM speichern und auflisten.

Außerdem wurde ein Fehler behoben, bei dem im Batch-Betrieb zu Kundeninformationen ein neuer Eintrag angelegt wurde, statt den bestehenden zu aktualisieren.

## [Batch 125.6] Admin-Bereich

In der Verwaltung der Materialnummern können die Tabellenwerte eingesehen werden. Materialnummern lassen sich weder neu anlegen noch bearbeiten oder löschen. Bei den Batch-Jobs können die Jobs und ihre Detailansichten angesehen werden. Dateien lassen sich, sofern vorhanden, aus der Detailansicht herunterladen. Im Bereich Cross File Transfer sind unter „CFT" die Tabellenwerte sichtbar, und die Aktionen „Weitere Details" und „Statistik" stehen, sofern vorhanden, zur Verfügung. Unter „File Upload" können keine Dateien hochgeladen werden. Die Tabellenwerte sind jedoch sichtbar, und die Dateien lassen sich aus der Tabelle herunterladen.

## [Batch 142.5] Externe Händlerprovision in der E169

Die Schnittstelle E169 wurde für externe Händlerprovisionen mit dem Exporttyp ESER entsprechend der fachlichen Anforderung angepasst.

## [Batch 534.2] DevOps

Im Bereich DevOps wurde die bisherige AWS-Lambda-Funktion für Benutzerbenachrichtigungen durch Delivery Channels ersetzt. Der Aufbau einer eigenen, wiederverwendbaren Notification-Service-Lambda (für MIM) wurde nicht weiterverfolgt. Zudem wurde eine Prüfung auf Schwachstellen für ECR und Sechub eingerichtet.

Außerdem wurden mehrere betriebliche Störungen bearbeitet und abgeschlossen. Dazu zählen Alarme zu Ausfällen der Anwendungen gateway-app, security-app und onescm-fe in der Produktionsumgebung sowie der security-app in der Vorproduktionsumgebung. Behoben wurden zudem ein Fehler beim Anlegen eines neuen Kunden und ein Problem, bei dem das AQA-Team von einem neuen Branch nicht mehr in Git pushen konnte.

## [Batch 594.5] Änderungsprotokoll bei Änderungen ohne Eigentümerwechsel

Der bestehende Batch-Job DealershipSyncWithGssnDataJob prüft Änderungen an der Adresse (Straße, Straßenschlüssel, Land), am Namenszusatz, an der Zugehörigkeit (Affiliate) und an der Vertriebsebene. Werden diese Daten geändert, werden sie zu Historisierungszwecken protokolliert. Das Protokoll ist in der Spalte „Aktionen“ über die neue Option „View Log“ erreichbar. Beim Klick darauf öffnet sich ein Modal, das das geänderte Objekt, den alten Wert, den neuen Wert und den Zeitstempel anzeigt.

## [Batch 616.5] Abschluss und Rückmeldung

Nach Abschluss des MPay-Vorgangs erfolgt eine Rückmeldung (Callback) an oneSCM. Meldet der Callback „OK“, sieht der Kunde eine Erfolgsmeldung. Ist der Callback nicht erfolgreich, erscheint eine Fehlermeldung. Beide Meldungen entsprechen dem vorgesehenen Design der Benutzeroberfläche.

## [Batch 740.6] Satzart HDRPAR (199 Zeichen)

Dieser Satz enthält die Verarbeitungsnummer, den festen Wert „R00“ (aus dem FCM-Projekt) und den SAP-Debitor. Der Debitor ist die VEGA-Händler-ID aus den Partnerdaten (r10.DealerCode). Für Testzwecke dient die Dummy-ID 21714. Das restliche Feld (174 Zeichen) bleibt leer.

## [Batch 862.2] Erzeugung und Übertragung der Datei

Die I155-Datei wird gemäß der bereitgestellten Dokumentation für den deutschen Markt erzeugt. Die Erzeugung kann manuell durch das Auslösen des zugehörigen Jobs oder automatisch erfolgen; für die automatische Variante ist das Zeitintervall noch festzulegen. Als Beispiel ist vorgesehen, die Datei täglich um 22 Uhr zu erzeugen und täglich um 1 Uhr per CFT-Transfer an VEGA zu senden. Der CFT-Transfer wird dabei zeitgesteuert eingeplant. Welche Felder für die nächste Erzeugung der Datei markiert und berücksichtigt werden, wird noch bereitgestellt.

## [Batch 898.4] Ausführungshistorie

Wie bei allen bestehenden Batch-Jobs wird zu jeder Ausführung ein Eintrag gespeichert. Er enthält die eindeutige Job-ID, Start- und Endzeit im oben genannten Format, die Dauer der Ausführung, den Status (abgeschlossen, fehlgeschlagen oder gestoppt) sowie die Benutzer-ID desjenigen, der den Job ausgelöst hat.

## [Batch 1160.3] Produkte für Leasing und Online-Vertrieb

Die Antwort der Edge-Services für Leasingprodukte enthält nun die Währung. Sie wird je Produkt in den priceConfigurations der Endpunkte /product/v1/online-sales/searches und /product/v1/leasing/searches ausgegeben. Voraussetzung ist, dass Produkte mit gültigen Preisen vorhanden sind.

## [Batch 1287.1] (ohne Überschrift)

**Hinweis zur Einordnung:** Die vorliegenden Rohdaten betreffen überwiegend interne Architektur- und Testautomatisierungsthemen und keine Funktionen, die Anwenderinnen und Anwender im Alltag bedienen. Die folgenden Absätze geben den Stand sachlich wieder.

