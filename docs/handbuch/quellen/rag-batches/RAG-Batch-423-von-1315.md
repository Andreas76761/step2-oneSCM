# Batch 423 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**E-Mail-Benachrichtigung bei Ergänzung fehlender Vertragsdaten (Fahrgestellnummer, Datum der Erstzulassung, Kfz-Kennzeichen)**

Händler verkaufen Serviceverträge für Fahrzeuge, die bestellt, aber noch nicht produziert, ausgeliefert oder zugelassen sind. Der Servicevertrag wird erst aktiv, sobald das Fahrzeug auch im Mercedes-System zugelassen ist. Wird ein bestehender Vertrag anschließend um die Fahrgestellnummer, das Datum der Erstzulassung (FRD) oder das Kfz-Kennzeichen ergänzt, übermittelt die Vertragsgenerierung die aktualisierten Daten zu der vorhandenen Vertragsnummer. Daraufhin wird eine E-Mail an den Vertragsinhaber versendet. Ihr Inhalt stammt aus einer Vorlage, die Benutzer zuvor in den Stammdaten anlegen, und wird mit den Daten befüllt, die bei der Aktualisierung des Vertrags eingegangen sind. Die E-Mail wird nur versendet, wenn der Vertrag nach der Aktualisierung durch den Händler den Status „Aktiv“ hat.

**Vorlage anlegen**

Melden Sie sich mit Ihren Zugangsdaten an und öffnen Sie den Administrationsbereich. Wechseln Sie dort zur Vorlagenverwaltung und zum Reiter „Benachrichtigungen“. Die Vorlagen für Kopf- und Fußzeile müssen bereits definiert sein. Klicken Sie anschließend auf „Vorlage erstellen“ und wählen Sie „E-Mail“.

Auf der Seite zur Vorlagenerstellung sind folgende Pflichtfelder auszufüllen: der Vorlagenname (Textfeld, maximal 25 Zeichen, zum Beispiel „Template-Updating info“), der Markt (Auswahlfeld, mit „Deutschland“ vorbelegt), das Feld „Verwendet für“ (Auswahlfeld, hier „UPDATING“ auswählen, da die Vorlage für Änderungen nach dem Aktivstatus eines Vertrags gedacht ist) sowie „Gültig ab“ (Datum, ab dem die Vorlage für den Geschäftsprozess gelten soll). Sind Pflichtfelder nicht ausgefüllt, weist das System auf das jeweilige Feld hin. „Als Entwurf speichern“ bleibt dann aktiv, „Veröffentlichen“ jedoch nicht.

Optional können Sie Division, Marke und Sprache angeben. Für das MVP ist als Division PC und als Marke Mercedes-Benz auszuwählen; Van beziehungsweise Smart sollen erst nach dem MVP berücksichtigt werden. Die Sprache richtet sich nach der Marktrolle des Benutzers und ist im MVP Englisch.

**E-Mail-Inhalt**

Der Inhalt wird gemäß dem MB Style Guide für E-Mails erstellt und besteht aus Betreffzeile, Kopfzeile, Text und Fußzeile. Der Betreff lautet „Service Contract Activation (Contract Number: %Contract Number)“. Die Anrede nennt Vor- und Nachname des Empfängers. Der Text bedankt sich für die Entscheidung für einen Mercedes-Benz Servicevertrag, teilt die erfolgreiche Aktivierung mit und verweist auf die angehängten Dokumente, den Fahrzeugvertrag sowie die Allgemeinen Geschäftsbedingungen. Anschließend folgen die aktualisierten Vertragsdetails.

Die Fahrzeugdaten umfassen Fahrgestellnummer, Kennzeichen, Datum der Erstzulassung, Marke, Laufleistung und Modell. Die Produktdaten umfassen Servicevertragsprodukt, Laufleistung bei Beginn, Vertragslaufzeit, jährliche Laufleistung, Vertragsbeginn, Gesamtlaufleistung und Vertragsende. Darauf folgt der Zahlungsplan, der auf den Daten aus dem Revenue Management basiert. Er listet je Rate Nummer, Zeitraum, Produkt, Zahlungsart sowie Netto-, Steuer- und Bruttobetrag auf und schließt mit den Gesamtbeträgen. Im Beispiel sind es zwölf monatliche Raten zu je 100,00 netto, 19,00 Steuer und 119,00 brutto, insgesamt 1200,00 netto, 228,00 Steuer und 1428,00 brutto.

Der Text nennt außerdem, dass die Beträge ab dem Vertragsbeginn per Lastschrift eingezogen werden, mit den Angaben zum Zahlungsempfänger (Mercedes-Benz Group AG, Deutschland), der Gläubiger-Identifikationsnummer und der SEPA-Mandatsreferenz. Bei Fragen wird auf das Kundenservice-Team verwiesen. Die Grußformel stammt vom Service Contract Team von Mercedes-Benz Cars Germany. Telefonnummer und E-Mail-Adresse werden marktspezifisch eingetragen. Der Hinweis, vor dem Drucken die Umwelt zu bedenken, schließt die E-Mail ab. Platzhalter wie Vorname, Nachname oder Vertragsnummer werden beim Versand dynamisch befüllt. Bei variablen Datenzeilen gilt: Sind Daten vorhanden, werden sie angezeigt, andernfalls wird die Zeile entfernt.

**Testen, speichern und veröffentlichen**

Mit „Test-E-Mail senden“ wird eine E-Mail im selben Format wie für den Kunden, also mit Betreff, Kopfzeile, Inhalt und Fußzeile, an den angemeldeten Benutzer gesendet. So sehen Sie, wie die Nachricht später beim Kunden aussieht. Mit „Als Entwurf speichern“ sichern Sie eine Vorlage, die noch nicht für Geschäftsprozesse gilt. Mit „Veröffentlichen“ geben Sie die endgültige Version frei. Sie wird anschließend entsprechend den Angaben zu „Verwendet für“ und „Gültig ab“ angewendet. Inhalte, Sprache und Markenauftritt müssen zum jeweiligen Markt passen.