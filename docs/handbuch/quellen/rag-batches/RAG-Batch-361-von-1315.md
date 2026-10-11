# Batch 361 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Documents & Communications**

In der Verwaltung der Systembenachrichtigungen steht für E-Mail-Vorlagen nun die Funktion „Send Test Email" zur Verfügung. Sie richtet sich an Benutzer mit den Rollen MO, HQ Admin und Admin. Beim Anlegen einer neuen E-Mail-Vorlage erscheint die Schaltfläche neben „Save as Draft" und „Publish". Solange Pflichtfelder fehlen, ist sie deaktiviert, und sie wird aktiv, sobald alle Pflichtfelder ausgefüllt sind. Ein Klick öffnet das Fenster „Send Test Email". Dort ist das Feld für die E-Mail-Adresse bereits mit der Adresse des angemeldeten Benutzers vorbelegt. Die Funktion entspricht der bekannten Testversand-Funktion im Reiter „Emails". Wird eine bestehende E-Mail-Vorlage geöffnet, ist die Schaltfläche stets verfügbar und aktiviert und funktioniert auf dieselbe Weise.

Auch an der Seite „System Notifications" wurden Korrekturen vorgenommen. Das Filterkriterium „Division" wird nun korrekt formatiert dargestellt. In der Tabelle wurde die zuvor fehlende Spalte „Market" ergänzt, und die maximale Länge des Betreffs wurde auf 256 Zeichen festgelegt.

Im Kundenbereich wurden zwei Fehler behoben. Das Sortieren nach der Umsatzsteuer-Identifikationsnummer (VAT ID) führte bisher zu einer Fehlermeldung, und beim Anlegen eines neuen Geschäftskunden trat ein Fehler auf. Beide Probleme sind erledigt.

Für die Druckvariablen sind Umbenennungen vorgesehen, um die Bezeichnungen konsistent zu halten. Die bisherige Druckvariable „ordernumber" soll in „Order Number (AFAB/GO)" mit dem Platzhalter „AFAB/GOID" umbenannt werden. Die Druckvariable „DealID" bleibt unverändert, ihre Kategorie erhält jedoch die Bezeichnung „Deal ID". Diese Änderung befindet sich noch in der Qualitätsprüfung.

Außerdem wurde im Zusammenhang mit E-Mail-Vorlagen eine Änderung des Platzhalters für die Zahlungsart geprüft. Der Platzhalter „paymentMethod" sollte durch „paymentType" ersetzt werden, und zwar für die Anwendungsfälle Aktivierung bzw. Aktualisierung sowie für den Wechsel des Zahlers (Change payer for holder bzw. Change payer for payer). Diese Anforderung wurde nicht weiterverfolgt und ist abgeschlossen bzw. eingestellt.

Ebenfalls nicht umgesetzt wurde die geplante automatische Antwort auf Kundenantworten an No-Reply-Postfächer. Vorgesehen war, dass Kunden, die auf eine E-Mail aus einem konfigurierten No-Reply-Postfach antworten, automatisch eine Nachricht erhalten, dass das Postfach nicht überwacht wird und keine Antwort zu erwarten ist. Die Nachricht sollte nach Möglichkeit in der Sprache der ursprünglichen E-Mail versendet werden, andernfalls auf Englisch. Außerdem sollte sie Marktkontaktdaten enthalten und für jede eingehende Kundenantwort erneut ausgelöst werden. Dafür war ein neuer Anwendungsfall „Autoreply Email" im E-Mail-Bereich der Vorlagenverwaltung vorgesehen. Dieses Vorhaben wurde eingestellt, die Funktion steht daher nicht zur Verfügung.

Abschließend wurden verschiedene Prüfungen im Bereich Dokumente und E-Mail-Vorlagen durchgeführt und abgeschlossen. Sie betrafen E-Mail-Vorlagen mit Zahlungsreferenzen, die Massenerstellung von Vorlagenverträgen sowohl im Bereich E-Mail als auch im Bereich Dokumente sowie die Anzeige von Start- und Enddatum bei gruppierten internen Benachrichtigungen für Werkstattrechnungen und für Sonderfallanfragen.