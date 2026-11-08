# Batch 989 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Marktspezifische Einstellungen**

Mit den Markteinstellungen können MPC-Anwender Daten im regionalen Format darstellen und die Standardparameter des Systems an die Anforderungen ihres Marktes anpassen. Die Einstellungen sind auf zwei Seiten verteilt: die Seite „General Settings“ und die Seite „Feature Settings“. Über die Schaltfläche „Restore“ werden alle Konfigurationen auf die Standardwerte zurückgesetzt. Mit „Update“ werden die aktuellen Eingaben gespeichert und die Änderungen an Formaten und anderen Einstellungen in der gesamten Anwendung wirksam. „Update“ ist nur dann aktiv, wenn sich die aktuelle Auswahl von der bestehenden Konfiguration unterscheidet.

**General Settings: Tab „Format“**

Links befinden sich die Auswahlfelder und weiteren Einstellungen, rechts eine Vorschau, die die Wirkung der Änderungen direkt zeigt. Für die Uhrzeit stehen das 12-Stunden- und das 24-Stunden-Format zur Verfügung, standardmäßig ist das 24-Stunden-Format eingestellt. Die Vorschau zeigt die aktuelle Uhrzeit im gewählten Format. Für das Datum stehen die Formate MM DD YYYY, MM DD YY, YY MM DD und YYYY MM DD zur Auswahl, der Standard ist DD MM YYYY. Als Trennzeichen können Schrägstrich, Punkt, Bindestrich oder Leerzeichen gewählt werden, standardmäßig wird der Punkt verwendet. Die Vorschau zeigt das aktuelle Datum mit dem gewählten Trennzeichen.

Beim Namensformat können Sie zwischen „Vorname, Nachname“ und „Nachname, Vorname“ wählen, Standard ist „Vorname, Nachname“. Die Vorschau zeigt Vor- und Nachname des Benutzers im gewählten Format. Für das Währungsformat gibt es mehrere Darstellungsvarianten für Tausender- und Dezimaltrennzeichen, etwa 1 234 567.89 oder 1 234 567,89. Standard ist 1.234.567,89. Die Vorschau stellt die Zahl 123456789 im gewählten Format dar. Die Anzahl der Dezimalstellen kann auf keine, eine oder zwei Dezimalstellen festgelegt werden, Standard sind zwei. Auch hier zeigt die Vorschau die Zahl 123456789 mit der gewählten Anzahl an Dezimalstellen, zusätzlich gibt es eine Preisvorschau (1.234.567,89).

Die Währung wird über ein Dropdown mit den verfügbaren Währungen ausgewählt. Aktuell ist die Auswahl mehrfach möglich, sie soll jedoch zunächst als Einzelauswahl umgesetzt und beibehalten werden, bis Logik und Ablauf für die Anzeige desselben Wertes in mehreren Währungen, für Umrechnungen und für den Wechsel zwischen Währungen abgestimmt sind. Bei der Sprache wird eine Liste der verfügbaren Sprachen angezeigt, Standard ist Englisch, und die Vorschau zeigt die gewählte Sprache. Das Feld „Last update by“ zeigt Name, Datum und Uhrzeit der letzten Änderung des aktuellen Tabs.

**General Settings: Tab „Timers & Reminders“**

Die Eingabefelder für Tage akzeptieren Werte von 0,01 bis 999,99, sodass auch Bruchteile eines Tages möglich sind. Für Monate gilt derselbe Bereich von 0,01 bis 999,99. Bei Jahren sind Werte von 0,01 bis 99,99 zulässig. Alle Standardwerte entnehmen Sie dem Vorschaubereich. Wird ein Standardwert in einem Feld geändert, aktualisiert sich die Vorschau. In den Tooltips stehen die Platzhalter X und Y für die Werte, die der Benutzer im jeweiligen Feld eingegeben hat, und werden entsprechend ersetzt.

Bei den Aufbewahrungsfristen für Kundendaten werden die personenbezogenen Daten von Kunden, die ein Angebot erhalten, aber innerhalb der Gültigkeit nicht unterschrieben haben, X Monate nach Ablauf des Angebots gelöscht. Bei Kunden mit aktiven Verträgen werden die Daten X Jahre nach Beendigung des letzten aktiven Vertrags gelöscht.

Bei den Angebotserinnerungen erhält der Kunde eine erste Erinnerung X Tage vor Ablauf seines Angebots und eine zweite Erinnerung Y Tage vor Ablauf. Ebenso werden Kunden mit aktivem Vertrag über das Vertragsende X Tage vor Ablauf und ein zweites Mal Y Tage vor Ablauf erinnert. Die Widerrufsfrist legt fest, dass Kunden, die einen Vertrag unterschrieben haben, X Tage Zeit haben, davon zurückzutreten.

Unter den Vertrags-Timeouts gilt: Kunden, die ein Angebot anfragen, haben X Tage Zeit für ihre Entscheidung, der Link zur Unterschrift über DSS ist Y Tage gültig. Für die CAS-Antwort, die SEPA-Validierung und die SAP-Debitorennummer wartet das System X, Y beziehungsweise Z Tage, bevor es zu einem Timeout kommt. Sobald ein Vertrag unterschrieben ist und alle Pflichtprüfungen bestätigt sind, wartet das System X Tage auf eine manuelle Prüfung, bevor der Vertrag automatisch aktiviert wird. Beantragt ein Händler während der Kulanzfrist die Freigabe einer Kampagne, hat das Market Performance Center X Tage Zeit zu antworten; andernfalls läuft der Vertrag ohne die Kampagne weiter. Ist eine manuelle Vertragsprüfung nötig, hat Market Operations X Tage Zeit dafür. Danach wird der Vertrag ohne Kosten für den Kunden geschlossen.

**General Settings: Tab „Market Configuration“**

Unter den Kundeneinstellungen wählen Sie die im jeweiligen Markt vorkommenden Rechtsformen für Geschäftskunden aus; standardmäßig sind alle ausgewählt. Für Deutschland sind alle Rechtsformen hinterlegt, für andere Märkte ist die Vorgehensweise noch offen. Der Name der CAS-Clearing-Gruppe legt die Clearing-Gruppe fest, die zur Abfrage des Critical Account System über dessen API verwendet wird. Der Standardwert ist CAS.CL_MBVD_GC.

Bei der Erstellung von Geschäftskundensegmenten können maximal 10 Segmente angelegt werden. Das erste Segment ist verpflichtend und kann nicht gelöscht werden, ab dem zweiten Segment ist das Löschen über das Papierkorb-Symbol möglich. Standardmäßig sind vier Segmente vorhanden: FleetStars1+ (Flottengröße bis 5), FleetStars5+ (bis 20), FleetStars20+ (bis 100) und FleetStars100+ (mehr als 100).

Im Bereich „Customer and Operations Communication“ wird die Syntax der eingegebenen E-Mail-Adresse geprüft. Diese Adresse wird in der Kommunikation mit dem Kunden als Absender- und Antwortadresse, für operative Benachrichtigungen der Anwendung sowie für technische Probleme und Mitteilungen verwendet. Eine Standardadresse ist noch nicht festgelegt. In den Marketing-Einstellungen aktivieren Sie über einen Schalter die Erfassung von Marketing-Einwilligungen; dabei werden die Kanäle für Produktinformationen, personalisierte Angebote und Werbeaktionen ausgewählt. Die Vorschau wird entsprechend den vorgenommenen Änderungen aktualisiert.

**Feature Settings: Tab „New Invoice Configuration“**

Hier wurden Bezeichnungen und Texte der Eingabefelder und Bereiche aktualisiert. Neu ist der Schwellenwert für Rechnungen: Er akzeptiert Werte von 0,01 bis 9.999,99, der Standardbetrag ist 100 in der Standardwährung EUR. Sind mehrere Währungen ausgewählt, gibt es für jede Währung ein eigenes Eingabefeld. Ist für den Markt nur eine Währung konfiguriert, ist das Dropdown deaktiviert. Die Vorschau zeigt die ausgewählten und definierten Werte. Der Schwellenwert legt fest, ab welchem Betrag alle manuell erstellten Rechnungen einen manuellen Freigabeprozess durchlaufen.