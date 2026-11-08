# Batch 881 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Genehmigungsbereich für Grace-Period-Anfragen (Request Approval)**

Im Menü „Contract Generation" von oneSCM steht ein Bereich namens „Request Approval" zur Verfügung, in dem preisbezogene Anfragen geprüft und entschieden werden. Er ersetzt den bisherigen Bereich „Special Case" und fasst zwei Anfragearten in einem rollengesteuerten Arbeitsbereich zusammen, sodass kein Wechsel zwischen verschiedenen Oberflächen nötig ist. Der Bereich ist für die Rollen MPC (Market Price Controller) und Dealer sichtbar, für alle anderen Rollen ausgeblendet; ein direkter Aufruf der zugehörigen Seiten per URL wird für diese Rollen verweigert. Der MPC hat Vollzugriff (ansehen, prüfen, genehmigen, ablehnen), Dealer haben ausschließlich Lesezugriff. Voraussetzung ist unter anderem, dass in den Market Settings das Gültigkeitsintervall für die Grace-Period-Kampagne konfiguriert ist und der Benachrichtigungsdienst (Glocke) funktioniert.

Der Bereich gliedert sich in zwei Reiter. „Special Case Requests" entspricht funktional unverändert dem bisherigen Special-Case-Bereich. „Grace Period Requests" ist neu und enthält die Anfragen zu Grace-Period-Kampagnen. Beim Laden werden nur die Anfragen angezeigt, die für den jeweiligen Benutzer sichtbar sind: MPC-Benutzer sehen den Umfang ihres Marktes bzw. ihrer Division, Dealer nur Anfragen des eigenen Händlerbetriebs. Anfragen anderer Händlerbetriebe sind nicht zugänglich.

**Suche und Liste**

Oberhalb der Liste befindet sich der Bereich „Search Request" mit den Feldern Reference Number (Freitext), Customer Name (Freitext, auch Teilangaben), Submitted On (Datum) und By Status (Auswahl: All, Open, Approved, Rejected, Expired). Die Lupe startet die Suche und lädt die Liste mit den passenden Treffern neu. Die Schaltfläche mit dem X leert alle Felder und zeigt wieder die vollständige, standardmäßig sortierte Liste.

Standardmäßig werden alle Status angezeigt, die neueste Anfrage steht oben (Sortierung nach Submitted On absteigend). Die Kopfzeile zeigt die Anzahl der sichtbaren und gesamten Einträge (zum Beispiel „10 of 10") sowie eine Auswahl der Seitengröße (Standard: 10). Unterhalb der Liste ermöglichen nummerierte Seiten mit Vor- und Zurück-Pfeilen das Blättern. Die Spalten „Submitted On", „Status" und „Campaign" lassen sich auf- und absteigend sortieren.

Jede Zeile steht für eine Anfrage und enthält folgende Angaben:

Die Reference Number bzw. Group ID ist ein Link, der die Contract Detailed View des Vertrags öffnet. Der Customer Name entspricht dem im Vertrag hinterlegten Kundennamen. Die Campaign zeigt den Namen der am Vertrag gewählten Grace-Period-Kampagne (zum Beispiel „Black Friday") als Link zur Kampagnenansicht mit den Produkten. Submitted On zeigt das Datum der Anfrage im Format TT.MM.JJJJ, das dem Erstellungs- bzw. Einreichungsdatum des Angebots entspricht; in einer zweiten Zeile steht die Benutzerkennung des einreichenden Verkäufers (zum Beispiel „By STARKTO").

Der Status wird als farbiges Kennzeichen dargestellt. „Open" (grau) ist der Standardstatus und bedeutet, dass die Anfrage auf eine Entscheidung des MPC wartet. „Approved" (grün) bedeutet, dass der MPC genehmigt hat und die Kampagne auf den Vertrag angewendet wurde. „Rejected" (rot) bedeutet, dass der MPC abgelehnt hat und der ursprüngliche Preis bestehen bleibt. „Expired" (blau) bedeutet, dass die Frist ohne Entscheidung des MPC abgelaufen ist; der Vertrag läuft mit dem ursprünglichen Preis weiter, was in der Wirkung einer Ablehnung entspricht, zur Transparenz und für Auswertungen aber als eigener Status geführt wird.

Die Spalte Due Date zeigt bei offenen Anfragen die verbleibenden Tage bis zur Frist als „N Tage"-Angabe (berechnet aus Einreichung plus der in den Market Settings hinterlegten Gültigkeit). Bei drei oder mehr verbleibenden Tagen gilt die Standarddarstellung, bei 0 Tagen oder Überfälligkeit wird der Wert rot hervorgehoben. Bei genehmigten und abgelehnten Anfragen steht „-".

In der Spalte Actions sehen MPC-Benutzer bei offenen Anfragen die Schaltfläche „Review", bei genehmigten, abgelehnten und abgelaufenen Anfragen „View". Dealer sehen unabhängig vom Status immer nur „View".

**Prüfseite (Review)**

Klickt der MPC bei einer offenen Anfrage auf „Review", öffnet sich die Seite mit den Anfragedetails. Die Karte „Request Details" zeigt Reference Number bzw. Group ID, Produktname, Anzahl der Fahrzeuge, Kundenname, Submitted On, Status mit Due Date in Tagen, Vertragsbeginn, geplantes Vertragsende, Vertragsdauer, jährliche Fahrleistung und geplante Gesamtfahrleistung.

Das Panel „Other Details" hat zwei Reiter. Der Reiter „Campaign" enthält Kampagnenname, die von der Kampagne abgedeckten Produkte, die externe Kampagnen-ID, den Rabatt in Prozent, den Gültigkeitszeitraum (von – bis) und die Grace Period in Tagen. Der Reiter „Comments" zeigt die zur Anfrage gehörenden Kommentare, etwa die Notiz, die der Verkäufer oder Dealer bei der Einreichung erfasst hat (mit Benutzerkennung, Datum und Text).

Das Panel „Change Details" zeigt die Preisauswirkung: den Listenpreis (gesamt, ohne MwSt.), den Kampagnennamen als Link zur Kampagne, den Wert der Grace-Period-Kampagne als negativen Betrag (zum Beispiel „-8.000,00 EUR") sowie den Endpreis nach Grace-Period-Kampagne, also Listenpreis minus Kampagnenwert (gesamt, ohne MwSt.).

In der Fußzeile steht links die Schaltfläche „Back", die ohne Änderung zur Liste zurückführt. Rechts stehen „Reject" (rot) und „Approve" (blau).

**Genehmigen und Ablehnen**

Bei „Approve" kann der MPC vor der Bestätigung optional einen Kommentar hinzufügen, den der Dealer anschließend im Reiter „Comments" sieht. Das System wendet die Kampagne an: Der Endpreis ergibt sich aus Listenpreis minus Kampagnenwert und wird im Vertrag hinterlegt. Auf dieser Basis werden der Zahlungsplan und das Entwurfsdokument erzeugt. Die Schaltfläche „Next" im Schritt „Overview & Confirmation" des Verkäufers wird freigegeben, sodass der Vertrag im Aktivierungsprozess fortgesetzt werden kann. Der Status wechselt von Open auf Approved.

Bei „Reject" kann der MPC ebenfalls optional eine Begründung als Kommentar hinterlegen, die für den Dealer sichtbar ist. Die Kampagne wird nicht angewendet, der Vertrag behält den ursprünglichen Listenpreis. Zahlungsplan und Entwurfsdokument werden auf Basis des ursprünglichen Preises erzeugt, „Next" wird freigegeben, und der Status wechselt von Open auf Rejected.

Beide Entscheidungen sind unwiderruflich; es gibt keine Rückgängig-Funktion. Spätere Preiskorrekturen müssen über den üblichen Vertragsänderungsprozess erfolgen. Es genügt die Entscheidung eines einzelnen MPC-Benutzers (kein Vier-Augen-Prinzip). Wer zuerst entscheidet, sperrt die Anfrage: Öffnet ein weiterer MPC sie danach, sieht er die Ansichtsseite. Entscheiden zwei MPC-Benutzer nahezu gleichzeitig, wird nur die erste Entscheidung gespeichert, und der zweite Benutzer wird informiert, dass die Anfrage bereits bearbeitet wurde, und sieht die Ansichtsseite.

**Ansichtsmodus (View)**

Bei „View" erscheint dasselbe Seitenlayout wie bei „Review", jedoch schreibgeschützt und ohne die Schaltflächen „Approve" und „Reject"; in der Fußzeile steht nur „Back". Oben im Panel „Change Details" zeigt ein Banner das Ergebnis an, zum Beispiel „The request was rejected!" (rot/rosa), „The request was approved!" (blau) oder bei Ablauf „The request expired without a decision." (blau). Der Reiter „Comments" zeigt den vollständigen Kommentarverlauf, also die Notiz des Anfragenden und, falls vorhanden, den Kommentar des MPC. Kommentare sind nach dem Absenden unveränderlich (Nachvollziehbarkeit). Dealer nutzen diese Seite, um die Entscheidung und den MPC-Kommentar einzusehen, und können sie für Anfragen in jedem Status öffnen, auch für offene, dann ohne Aktionsschaltflächen.

**Benachrichtigung und Ablauf von Anfragen**

Reicht ein Verkäufer einen Vertrag mit ausgewählter Grace-Period-Kampagne ein, wird die Anfrage mit dem Status Open angelegt. Der Benachrichtigungsdienst erhält dazu ein Ereignis, und in der Glocke der MPC-Benutzer im zuständigen Markt- bzw. Divisionsumfang erscheint ein Eintrag mit dem Text „[Kundenname] — Grace Period campaign requested for contract [Reference Number]". Ein Klick führt den MPC direkt zur Prüfseite dieser Anfrage; die Seite ist über eine stabile URL mit der Anfrage-ID erreichbar, damit Links aus Benachrichtigungen gültig bleiben. Ist die Anfrage zu diesem Zeitpunkt bereits genehmigt, abgelehnt oder abgelaufen, öffnet sich die Ansichtsseite mit dem entsprechenden Banner.

Verstreicht die Frist (Einreichung plus Gültigkeit aus den Market Settings) ohne Entscheidung, wechselt die Anfrage auf Expired. Der Vertrag läuft mit dem ursprünglichen Preis weiter (Zahlungsplan und Entwurfsdokument werden erzeugt, „Next" wird freigegeben), und „Review" wird durch „View" ersetzt. Läuft dagegen die Gültigkeit des Angebots ab, solange die Anfrage offen ist, wechselt die Anfrage auf Expired und der Vertrag auf Rejected; das Angebot ist damit beendet, und es steht nur noch „View" zur Verfügung.

Das Ende einer Kampagne lässt eine offene Anfrage nicht verfallen. Die Kampagnengültigkeit wird nur einmal bei Auswahl bzw. Einreichung geprüft; solange die Genehmigungsfrist läuft, kann der MPC die Anfrage auch nach Kampagnenende noch genehmigen und der Rabatt wird angewendet. Die Funktion ist für die Massenerstellung (Mass Creation) auswählbar und anwendbar.