# Batch 1018 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation: Zahlungsplan-Vorschau und Bearbeitung in der Detailansicht**

**Vorschau des Zahlungsplans im Schritt „Overview & Confirmation"**

Im Schritt „Overview & Confirmation" des Vertragsgenerierungs-Assistenten werden alle relevanten Informationen zu Fahrzeug, Kunde und Produkt angezeigt, die Bestandteil des Vertrags werden. Händler können dort vor der Vertragsbestätigung durch den Kunden eine Vorschau des Zahlungsplans einsehen. Der Plan wird im Anschluss an den Abschnitt „Payment Information" angezeigt. Dieselbe Darstellung finden Sie in der Detailansicht eines Vertrags aus der Vertragsgenerierung im Reiter „Payment".

Voraussetzung ist, dass Fahrzeugdaten erfasst, das Produkt ausgewählt und konfiguriert sowie die Kundendaten eingetragen wurden. Anschließend werden automatisierte Prüfungen durchgeführt, der Vertrag wird generiert, es wird eine Vertragsnummer vergeben und der Vertrag erhält den Status „Created". Der Zahlungsplan wird vom Revenue Management erzeugt und zurückgemeldet. Liegt das Datum der Erstzulassung (FRD) in der Vergangenheit, liefert die Vertragskalkulation zwei Preislisten: eine für die gewählte Vertragslaufzeit, die auf den Produktkarten angezeigt wird, und eine für die Restlaufzeit des Vertrags, die nicht angezeigt, sondern an das Revenue Management zur Erstellung des Zahlungsplans übergeben wird.

Der Abschnitt „Plan Preview" ist schreibgeschützt und bietet weder Filter- noch Sortierfunktion. Die Tabelle enthält die folgenden Spalten: die laufende Nummer der Rate, den Zeitraum im Format TT.MM.JJJJ - TT.MM.JJJJ (zum Beispiel 12.04.2023 - 13.05.2023), das für den Vertrag gewählte Produkt (zum Beispiel „Excellent"), die Zahlungsart (monatlich oder einmalig) sowie die Beträge netto, Steuer und brutto. Beträge werden mit zwei Nachkommastellen und der Währung EUR dargestellt, etwa 100,00 EUR netto, 19,00 EUR Steuer und 119,00 EUR brutto.

Unterhalb der Tabelle werden Zwischensummen je Vertragsjahr ausgewiesen, jeweils mit Netto-, Steuer- und Bruttobetrag, sowie eine Gesamtsumme über alle Jahre. Die Kopfzeile mit den Spaltennamen und die Fußzeile mit den Summen bleiben fixiert. Im Tabellenbereich werden zehn Datensätze angezeigt; bei mehr Einträgen scrollen Sie bis zum letzten Eintrag, eine Seitennavigation gibt es nicht. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden validierten UI-Design.

Zum Prüfen starten Sie die Vertragsgenerierung und rufen den Schritt „Overview & Confirmation" auf. Der Zahlungsplan muss dort entsprechend Zeitraum und Preis des Vertrags erscheinen. Dasselbe gilt für Verträge im Status „Created", „Confirmed" oder „Waiting for Activation": Im Reiter „Payment" der Detailansicht wird der Plan ebenfalls angezeigt.

**Bearbeitbare Felder in der Detailansicht**

Benutzer aus Market Operation, MPC und dem Händlerbereich können Verträge, die noch nicht aktiviert wurden, in der Detailansicht ändern. Dazu wählen Sie den Vertrag aus, öffnen den gewünschten Reiter und klicken auf „Edit". Sobald die Änderungen vorgenommen wurden, ersetzen zwei Schaltflächen die Edit-Schaltfläche: „Cancel" verwirft die Änderungen, „Confirm" übernimmt die neuen Werte, speichert sie im System und löst weitere Folgeaktionen aus. Wurde im Status „Waiting for Activation" bereits die Unterschrift des Kunden erfasst, sind die Bearbeitungsfunktionen deaktiviert. Änderungen ohne Versionierung sind nur im Status „Created" möglich; die Originalwerte werden dann überschrieben.

Im Reiter „Contract" lässt sich der Kilometerstand bei Vertragsbeginn ändern. Bei Verträgen mit dem Produkt „Excellent" darf er 10.000 km nicht überschreiten, und er muss kleiner als der Stand bei Vertragsende sein. Die Änderung ist nur im Status „Created" möglich; bei „Confirmed" oder „Waiting for Activation" ist die Bearbeitung deaktiviert. Das Startdatum darf nicht vor dem FRD liegen und überschreibt den bisherigen Wert. Die reale Vertragsdauer richtet sich nach den Statuswechseln und wird aktualisiert, sobald ein neuer Status gesetzt wird.

Im Reiter „Vehicle" kann das Kennzeichen geändert werden. Es ist auf 11 alphanumerische Zeichen einschließlich Bindestrich begrenzt. Der bestehende Wert wird überschrieben und die Kennzeichen-Information im permanenten Header aktualisiert. Das FRD kann überschrieben werden, ist aber bei Verträgen mit dem Produkt „Excellent" schreibgeschützt.

Im Reiter „Customer" entfällt die Edit-Schaltfläche. Die Kundennummer wird als Hyperlink dargestellt und führt zur Detailansicht des Kunden in Customer Management. Kundendaten sind nicht editierbar und werden im Vertrag überschrieben. Im Reiter „Product" ist die Edit-Schaltfläche ausgegraut, da sie möglicherweise erst künftig genutzt wird.

Im Reiter „Payment" kann das Zahlungsintervall nur von „Monthly" auf „One Time" umgestellt werden. Dabei wird das Revenue Management veranlasst, die nächste Rechnung mit dem Restbetrag zu erzeugen, und der Betrag pro Intervall wird auf den noch zu zahlenden Restbetrag aktualisiert.

Eine gleichzeitige Bearbeitung durch zwei Benutzer ist nicht möglich. Versucht ein zweiter Benutzer, dasselbe Feld zu ändern, erscheint vor dem Speichern ein Hinweis, dass das Objekt geändert wurde und der Vertrag neu geladen werden soll. Geänderte Werte müssen an die weiterverarbeitenden Domänen (Revenue, Customer & Partner, Vega) weitergegeben werden. Auch hier gelten die Mercedes-Benz Workbench und das vom Kunden validierte UI-Design.