# Batch 366 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation – Neuerungen und Änderungen**

**Vertragsdokumente und Druckvariablen**

Die Dokumentvorlagen für Bestätigungen und Angebote im Bereich VdZ wurden angepasst. Im Bereich der Fahrzeugdetails steht nun eine neue Druckvariable zur Verfügung, die die Fahrzeugreferenznummer ausweist. Sie trägt bewusst nicht die Bezeichnung „Deal-ID", obwohl es sich dabei um eine Kennung mit bis zu 36 Zeichen handelt. Zusätzlich werden in den Fahrzeugdetails die bereits vorhandenen Variablen für die Verkaufsbezeichnung (zum Beispiel „EQC 400 4MATIC"), die Auftragsnummer und die Branche angezeigt. Es erscheinen nur die jeweils zutreffenden Kategorien. Die Reihenfolge lautet: Fahrgestellnummer, Auftragsnummer, Fahrzeugverkaufsreferenz, Marke, Sparte, Verkaufsbezeichnung, technische Optionen, Branche, Datum der Erstzulassung, Kennzeichen und Laufleistung. Die Vorschau der Vorlagen wurde um diese Variablen und Werte ergänzt.

Geplant ist außerdem, im Template Management das Ablaufkriterium eines Vertrags als Druckvariable bereitzustellen. Bisher sind Ablaufkriterien auf Blueprint-Ebene vordefiniert und auf Produktebene festgelegt. In Kundendokumenten und Benachrichtigungen wird jedoch nicht angezeigt, welches Kriterium für den jeweiligen Vertrag gilt, sodass Kunden dies in den Allgemeinen Geschäftsbedingungen nachlesen müssen. Künftig soll das Kriterium direkt in Vertragsdokumente oder Kundenbenachrichtigungen eingefügt werden können. Dieses Vorhaben ist noch offen.

**SEPA-Mandat-Vorlagen**

Die SEPA-Mandat-Vorlagen für den Kontoinhaber bei Privat- und Geschäftskunden werden jeweils in der deutschen und der englischen Fassung angepasst. Diese Arbeiten sind derzeit in Verwendung.

**E-Mail-Vorlagen mit Zahlungsangaben**

Die Zahlungsangaben in den E-Mail-Vorlagen wurden für die Anwendungsfälle Aktivierung, Zahlerwechsel (Halter zu Zahler bzw. Zahler zu Zahler) und Aktualisierung des Zahlungsplans angepasst. Bei Aktivierung und Aktualisierung, jeweils für Privat- und Geschäftskunden, werden die Zahlungsdetails dynamisch nach Zahlungsart dargestellt. Bei Lastschrift erscheinen Zahlungsart, SEPA-Mandatsreferenz und Gläubiger-ID. Bei Kreditkartenzahlung werden Zahlungsart und Gültigkeit der Kreditkarte angezeigt. Bei Überweisung werden Zahlungsart und Gläubiger-ID genannt.

Beim Zahlerwechsel für den Halter wurde die Formulierung „will be collected from you selected payer" durch „will be due from your selected payer" ersetzt. Beim Zahlerwechsel von Zahler zu Zahler wurde der bisherige Satz „Going forward, starting from {{contractStartDate}} all payments and financial transactions related to this contract will be collected from your account." durch einen neuen Text ersetzt. Auch hier werden die Zahlungsdetails wie bei der Aktivierung dynamisch angezeigt.

**Dokumentenverwaltung**

Die Dokumentenverwaltung kennt bislang den Typ der erzeugten Dokumente nicht. Dadurch lässt sich bei der Verarbeitung, etwa bei einer DSGVO-Löschung, nicht unterscheiden, welches Dokument vorliegt. Das SEPA-Dokument erfordert eine eigene Behandlung, da es nicht immer gelöscht werden darf, solange ein weiterer Vertrag aktiv ist. Vorgesehen ist daher, eine Liste von Dokumenttypen zu definieren, die Typen für bestehende Dokumente zu importieren und bei jeder Dokumenterzeugung oder jedem Upload den Typ mitzuspeichern. Dieses Vorhaben befindet sich im PI-Backlog.

Zudem wird geprüft, dass sich die MO-Prüfungen im Reiter zur Vertragserzeugung befinden. Dieser Punkt ist in Verwendung.

**Behobene Probleme**

Mehrere Fehler wurden behoben oder abgeschlossen:

Verträge ließen sich wegen der Fehlermeldung „customer signature missing" nicht aktivieren. Vertragsdokumente ließen sich in einem konkreten Fall nicht hochladen. Ein hochgeladenes Vertragsdokument konnte nicht heruntergeladen werden, weil weiterhin auf das Entwurfsdokument verwiesen wurde.

In der Notification App trat beim Verwalten von Benachrichtigungsvorlagen ein Fehler wegen fehlender Berechtigung für die Sparte VAN_CAR auf. In der Dokumentenverwaltung wurde bei Anfragen zur Dokumenterzeugung eine Zugriffsverweigerung (AccessDeniedException) gemeldet. Beide Probleme sind erledigt.

Außerdem wurde behoben, dass das Benachrichtigungssymbol nicht mit der Liste der Benachrichtigungen übereinstimmte, und dass bei der Eingabe einer beliebigen IBAN eine Fehlermeldung erschien.

**Weitere offene Vorhaben**

Noch offen sind die Historisierung für das erneute Auslösen von Signaturen sowie eine systeminterne Benachrichtigung für neu aus CePrO importierte BMs. Für beide liegen bisher keine näheren Angaben vor.