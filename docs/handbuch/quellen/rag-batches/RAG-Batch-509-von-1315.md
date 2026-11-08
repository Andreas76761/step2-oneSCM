# Batch 509 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Block-Vorlagen erstellen**

Im Bereich Template Management können Sie auf dem Reiter „Notification" über „Create Templates" und anschließend „Blocks" wiederverwendbare Block-Vorlagen anlegen. Blöcke sind statische Inhalte, zum Beispiel ein Rechtstext, und lassen sich in anderen Vorlagen, etwa E-Mail-Vorlagen, erneut einsetzen. So sparen Sie Zeit bei der Erstellung weiterer Vorlagen. Da Blöcke statisch sind, werden keine Druckvariablen benötigt.

Auf der Seite zur Erstellung einer Block-Vorlage füllen Sie zunächst den Bereich „Template Setup" aus. Der Vorlagenname ist ein Pflichtfeld (Textfeld, maximal 56 Zeichen, zum Beispiel ein Datenschutztext). Der Markt ist ein Pflicht-Dropdown, dessen Werte sich nach Ihrer Benutzerrolle richten und das mit „Germany" vorbelegt ist. Das Feld „Valid From" ist ebenfalls ein Pflichtfeld mit Datumsauswahl im Format TT.MM.JJJJ. Es akzeptiert nur das heutige oder ein zurückliegendes Datum, keine zukünftigen Daten. Wird eine neuere Version erstellt, gilt die alte Version als veraltet und steht nicht mehr zur Verfügung.

Im Bereich „Template Details" stehen optionale Dropdown-Felder bereit. Bei der Marke ist im MVP-Umfang Mercedes-Benz verfügbar, Smart folgt nach dem MVP. Bei der Division ist im MVP „PC" (Passenger Car) verfügbar, „VAN" folgt später. Die Sprache richtet sich nach der Marktrolle des Benutzers, im MVP steht Englisch zur Verfügung.

Den Inhalt des Blocks gestalten Sie im WYSIWYG-Editor, in den Sie Text eintippen oder einfügen können. Der Editor folgt den Layout-Vorgaben: Fließtext in MB Corpo S, Schriftgröße 16 px, Zeilenhöhe 20 px. Nach der Erstellung steht der Block anhand seiner Parameter im Bereich „Blocks" des WYSIWYG-Editors zur Wiederverwendung bereit.

Am Ende der Seite stehen drei Schaltflächen zur Verfügung. Mit „Save as Draft" speichern Sie die Vorlage als Entwurf; dafür muss lediglich der Vorlagenname ausgefüllt sein. Der Entwurf bleibt 30 Tage lang bearbeitbar und wird danach gelöscht. „Publish" erstellt die Vorlage. Mit „Cancel" verlassen Sie die Seite: Haben Sie bereits Daten in ein Feld oder in den Editor eingegeben, erscheint eine Warnung vor Datenverlust. Dort können Sie den Dialog mit „Cancel" schließen oder mit „Proceed" fortfahren; dann werden die Daten nicht gespeichert und Sie gelangen zur vorherigen Seite. Wurden keine Daten eingegeben, kehren Sie direkt zur vorherigen Seite zurück.

**Test-E-Mail nach dem Erstellen einer E-Mail-Vorlage senden**

Nachdem Sie eine E-Mail-Vorlage erstellt haben, können Sie vor der Veröffentlichung eine Test-E-Mail an sich senden, um zu prüfen, wie die Vorlage aussieht, und sie bei Bedarf anzupassen. Dazu melden Sie sich im Template Management an, wählen den Reiter „Notification" und starten die Erstellung einer Vorlage. Anschließend konfigurieren Sie das Template Setup, geben den E-Mail-Betreff ein, wählen Header und Footer aus und verfassen den Textkörper, wahlweise mit oder ohne dynamische Druckvariablen.

Mit „Send Test E-mail" öffnen Sie einen Dialog, in dem Sie die Empfängeradresse festlegen. Vorbelegt ist die E-Mail-Adresse des angemeldeten Benutzers, Sie können aber auch eine andere Adresse eingeben. Das Adressfeld wird geprüft: Die Adresse muss ein „@" und eine Endung enthalten, andernfalls erscheint die Fehlermeldung „Please provide a valid e-mail address". Ein Pop-up informiert Sie, an welche Adresse die Test-E-Mail gesendet wird. Mit „Send" wird die E-Mail verschickt, es erscheint die Meldung „E-mail send successfully, please check you inbox!" und der Dialog schließt sich. Mit „Cancel" schließt sich der Dialog ohne Meldung und Sie kehren zu der Seite zurück, von der aus Sie „Send Test E-mail" gewählt haben.

Beim Versand werden verwendete Druckvariablen in Betreff und Text durch die entsprechenden Daten ersetzt. Aus „Dear <First Name> <Last Name>" wird zum Beispiel „Dear Max Musterman". Ein Betreff wie „Service Contract confirmation (Contract Number: %Contract Number)" wird zu „Service Contract confirmation ( 5A2F43KL/DE23PE)".

**Word-Dokumente als statische Vorlage hochladen (in Exploration)**

Geplant ist, dass Marktvertreter statische Dokumente, etwa Allgemeine Geschäftsbedingungen, die von der Rechtsabteilung bereitgestellt werden, im Word-Format von ihrem PC als statische Vorlage hochladen können. Dadurch lassen sich diese Dokumente bei Bedarf im Prozess verwenden. Zudem steht eine eingefrorene, von der zuständigen Rechtsabteilung freigegebene Fassung der Bedingungen zur Verfügung, und Sie sparen Zeit, weil die Vorlage nicht von Grund auf neu erstellt werden muss. Solche Dokumente werden von der Rechtsabteilung erstellt, sind inhaltlich unveränderlich und markt- bzw. länderspezifisch. Diese Funktion befindet sich noch in der Explorationsphase.