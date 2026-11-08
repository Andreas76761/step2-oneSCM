# 23 FAQ, Troubleshooting und Support

Dieses Kapitel beantwortet häufige Fragen nach Prozessphase und beschreibt bekannte Fehler mit Markt- und Releasebezug. Es zeigt, wie Sie bei Bedienfragen, Datenabweichungen und Störungen vorgehen, welche Angaben ein Supportfall benötigt und welche Wege für die Eskalation gelten. Die Aussagen beschreiben den heutigen Funktionsstand von oneSCM. Details zu Schnittstellen und Batch-Jobs finden Sie in Kapitel 19.

## 23.1 Häufig gestellte Fragen nach Prozessphase

Die Fragen sind nach Prozessphase geordnet. Fehlerbilder mit Symptom, Ursache und Lösung stehen in den Abschnitten 23.2 und 23.3.

### Vertragserstellung

**Welche Produkte zeigt das System für die Modellreihe 243 an?**

Das System zeigt bei der Vertragserstellung Produkte für die Modellreihe 243 an. Für technische Optionen lassen sich Dezimalstellen eingeben.

**Wie navigieren Sie im Vertragserstellungs-Assistenten?**

Auf der Übersichtsseite der Vertragserstellung navigieren Sie vor und zurück, ohne dass ein Fehler auftritt. Der Umschalter für die globale Sammelrechnung in Schritt 3 des Assistenten aktualisiert seinen Status.

**Wie wirken die Schalter für die globale Rechnungsstellung?**

Der Umschalter für die globale Sammelrechnung in Schritt 3 zeigt seinen aktuellen Status an. Die Schaltfläche für globale Sammelrechnungen ist bei der Vertragserstellung nicht editierbar. Die Vertragserstellung setzt keinen zweiten Schalter für die globale Rechnungsstellung voraus.

**Was passiert bei einer falschen Auftragsnummer?**

Das System zeigt eine eindeutige Fehlermeldung an. Der Zylinderwert eines Fahrzeugs wird in der Anfrage übermittelt.

**Welche Regeln gelten für Vor- und Nachnamen?**

Frontend und Backend prüfen Vor- und Nachnamen nach denselben Regeln.

**Was zeigt der Tooltip bei Verträgen im Status „Created“?**

Der Tooltip zeigt die Informationen zur Umverteilung an.

### Aktivierung

**Wann erzeugt das System den Zahlungsplan?**

Nach der Aktivierung eines Vertrags erzeugt das System einen Zahlungsplan.

**Welchen Kundenstatus setzt das System bei der Aktivierung?**

Bei temporären Privatkunden wechselt der Kundenstatus bei der Vertragsaktivierung auf „Aktiv“. Bei Verträgen mit abweichendem Halter und Zahler setzt das System den Kundenstatus korrekt.

### Verlängerung und Prolongation

**Ist nach einer Verlängerung eine weitere Verlängerung möglich?**

Ja. Nach einer ersten Verlängerung lässt sich der Vertrag erneut verlängern.

**Welche Preise gelten bei Verträgen, die aus dem Intervall „One Time“ verlängert werden?**

Die Preise dieser Verträge stimmen.

**Welcher Wert erscheint bei der Prolongation für ein deaktiviertes Produkt?**

Das System zeigt den korrekten Wert an.

**Wie übermittelt das System eine vorzeitige Abrechnung?**

Bei der vorzeitigen Abrechnung Early Settlement übermittelt das System korrekte Werte an das Revenue-System.

**Kann ein Kunde im Bestätigungsstatus aktualisiert werden?**

Ja. Ein Kunde im Bestätigungsstatus lässt sich aktualisieren.

### Aussetzung und Ablehnung

**Wie ist die E-Mail bei einer Vertragsaussetzung aufgebaut?**

Der Betreff lautet „Suspended Service Contract“ mit dem Platzhalter „%Contract Number“ für die Vertragsnummer. Die Anrede enthält Vor- und Nachnamen des Kunden. Die E-Mail teilt mit, dass der Servicevertrag zum Datum „%Suspension date“ gesperrt ist und Wartungs- und Reparaturleistungen in autorisierten Servicestellen dann nicht gedeckt sind. Unter „Contract Details“ stehen Vertragsnummer, Fahrgestellnummer, Kennzeichen und Produkt. Das Kennzeichen erscheint nur, wenn ein Wert vorhanden ist. Am Ende stehen der Hinweis auf den Customer Support, die Grußformel „Service Contract Team, Mercedes-Benz Cars Germany“, die marktspezifische Telefonnummer und E-Mail-Adresse sowie der Hinweis, die Umwelt vor dem Ausdrucken zu bedenken.

Den Text gestalten Sie im Template Design Editor, den Kapitel 14.4 beschreibt. Header und Footer wählen Sie per Dropdown aus.

**Wie ist die E-Mail bei einer Ablehnung aufgebaut?**

Der Betreff enthält die Bezeichnung „Service Contract Rejection“ und die Vertragsnummer über den Platzhalter „%Contract Number“. Die E-Mail bedankt sich für die Wahl einer Wartung mit einem Mercedes-Benz Servicevertrag und teilt mit, dass die Anfrage nicht weiter bearbeitet werden kann. Der Kunde wird gebeten, sich an das Customer Support Team zu wenden. Die Grußformel lautet „Service Contract Team, Mercedes-Benz Cars Germany“, ergänzt um marktspezifische Kontaktdaten. Header und Footer wählen Sie per Dropdown aus.

### Dokumente und Druck

**Kann ein Vertrag mehrfach gedruckt werden?**

Ja. Im Kommunikationsbereich lässt sich ein Vertrag erneut drucken.

**Werden hochgeladene SEPA-Dokumente angezeigt?**

Ja. Hochgeladene SEPA-Dokumente erscheinen in der Oberfläche und im E-Mail-Umschlag des DSS. Ein hochgeladenes Dokument lässt sich herunterladen.

**Wann entstehen Entwürfe von Dokumenten und E-Mails?**

Entwürfe entstehen auch dann, wenn Sie die Hauptvorlage zuerst speichern und anschließend veröffentlichen. Pro Sprache legt das System genau einen Entwurf einer E-Mail-Vorlage an.

**Welches Datum zeigt die Komponente „Gültig ab“ bei bestehenden Vorlagen an?**

Die Komponente zeigt ein gültiges Datum an.

**Ist die Bestätigungs-E-Mail signiert?**

Ja. Die Bestätigungs-E-Mail enthält das signierte Dokument.

**In welchen Sprachen lassen sich Vorlagen veröffentlichen?**

Vorlagen lassen sich auch in slowakischer Sprache veröffentlichen.

### Abrechnung und Rechnungen

**Wie oft löst das System den Refund an MPay aus?**

Das System löst den Rückerstattungsaufruf an MPay einmal aus.

**Welchen Status erhalten Rechnungen zu gekündigten Verträgen?**

Rechnungen zu gekündigten Verträgen erhalten den Status „Dokument erstellt“.

**Ist die Aktion „Correction“ für Rechnungen verfügbar?**

Ja. Die Aktion „Correction“ steht für Rechnungen im Status „FI Document Created“ zur Verfügung.

### Kunden- und Vertragsdaten

**Lassen sich Kundendaten nach der Vertragserstellung ändern?**

Ja. Sie ändern Name, E-Mail-Adresse, Telefonnummer und Adresse auf der Seite „Kunden- und Zahlungsinformationen“. Die Option zur Aktualisierung des Mercedes-me-Kontos steuert, ob das Mercedes-me-Konto mit den geänderten Daten aktualisiert wird.

**Erscheint beim Aktualisieren eines Geschäftskunden eine Authentifizierungsmeldung?**

Nein. Beim Aktualisieren eines Geschäftskunden erscheint keine Meldung „Authentifizierung verboten“. Nach dem Abbrechen schließt sich der Dialog auf der Kundenansicht.

**Wie verhält sich die Aktionsabfrage für Händlerbenutzer?**

Händlerbenutzer sehen im Vertragsmanagement die Vertragsdetails. Die Aktionsabfrage erscheint nur, wenn sie erforderlich ist.

Quellen: Batch 5.6, 142.8, 191.5, 193.2, 258.5, 360.5, 364.2, 421.3, 485.3, 494.5, 609.2, 610.3, 625.3, 650.3, 653.5, 761.4, 769.8, 778.5, 800.3, 838.4, 1052.2, 1061.9, 1179.2

## 23.2 Bekannte Fehler mit Markt- und Releasebezug

Die folgenden Einträge beschreiben das Symptom, die Ursache, soweit sie bekannt ist, und die Lösung als Sollverhalten. Prüfen Sie zuerst Ihren Markt- und Betriebskontext im Abschnitt 2.4.

### Märkte und Markt-Besonderheiten

- **Slowakei:** Das System ruft die Produkte für den Markt Slowakei ab.
- **MBSK:** HQ-Admin-Benutzer haben Zugriff auf die Seite „Financial Control“.
- **MWSI:** Die SAP-Kreditorennummer ist eine Pflichtangabe.
- **MBIL:** Verträge für Bestandskunden lassen sich bei MBIL anlegen.
- **VAN:** Die Allgemeinen Geschäftsbedingungen für VAN drucken ohne Leerseiten.
- **Affiliated Dealer:** Angeschlossene Händler haben in den Umgebungen DEV, INT und PrePROD Zugriff auf das System.
- **Händler:** Der Händler-Upload läuft ohne Serverfehler. Die Händlerdetails lassen sich auch für VEGA-IDs mit führenden Nullen abrufen. Die Registrierung von Händlern über die MO-Prüfungsseite und der Link aus der Liste der letzten fünf Verträge funktionieren.
- **Händler-Provisionsrechnungen:** Das System erfasst bei der Erzeugung von Händlerprovisionsrechnungen die Produktlinie.

**Fehlerbild: Benachrichtigungsvorlagen der Division VAN_CAR**

- **Symptom:** Ein Benutzer kann Benachrichtigungsvorlagen der Division VAN_CAR in der Notification-Anwendung nicht verwalten.
- **Ursache:** Dem Benutzer fehlte die Berechtigung für Vorlagen dieser Division.
- **Lösung:** Prüfen Sie die Berechtigung für die Division VAN_CAR. Die fachlichen Rollen beschreibt Abschnitt 2.2.

**Fehlerbild: Händler-Upload mit Serverfehler**

- **Symptom:** Der Händler-Upload endet mit einem Serverfehler 500.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Der Händler-Upload endet ohne Serverfehler.

**Fehlerbild: Market-Konfiguration beim Dienstaufruf**

- **Symptom:** Beim Aufruf eines Dienstes tritt ein Marktkonfigurationsfehler auf.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Der Dienst läuft mit der korrekten Marktkonfiguration.

### Releasebezug

- **Release Candidate 10:** Die externen Kundeninformationen für Release Candidate 10 betreffen die Positionen 71 bis 400.
- **Qualitätssicherung:** Die Einträge aus der Qualitätssicherung sind in den Abschnitten 23.1 und 23.3 beschrieben.

### Schnittstellen, Dateien und Batch-Jobs

**Fehlerbild: Batch-Job im Status „Gestartet“ trotz Ausnahme**

- **Symptom:** Ein Job löst eine Ausnahme aus, zeigt aber weiterhin den Status „Gestartet“ an.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Das System zeigt bei einem Job mit Ausnahme einen Status an, der den Fehler widerspiegelt. Die E169-Batch-Jobs verlassen den Status „Started“ nach der Verarbeitung.

**Fehlerbild: I155-Datei wird für einzelne Verträge nicht erzeugt**

- **Symptom:** Die automatische Erzeugung der I155-Datei für die Übermittlung an VEGA bricht mit einer Ausnahme ab. Die Datei fehlt für die betroffenen Verträge.
- **Ursache:** Die gespeicherten Vertragsdaten im JSON-Format enthalten Felder, die das aktuelle Vertragsobjekt nicht kennt, zum Beispiel das Feld totalNetListPrice für den Gesamtnettolistenpreis. Die Verarbeitung betraf insbesondere Datensätze des Satztyps 05.
- **Lösung:** Unbekannte Felder in den gespeicherten Vertragsdaten führen nicht zum Abbruch. Die I155-Datei entsteht auch für Verträge mit älteren oder zusätzlichen Feldern.

**Weitere Schnittstellen- und Job-Eigenschaften**

- Die Jobs E169, E167 und E174 folgen einheitlichen Namenskonventionen. Das Stoppen des Jobs E169 funktioniert wie vorgesehen.
- Ein Batch-Job lässt sich manuell starten. Das Löschen eines Job-Zeitplans funktioniert.
- Jobs laufen mit der korrekten Benutzerkennung.
- Aufträge vom Typ MB werden an E169 NACOS und oneERP exportiert. E169-Dateien lassen sich in der Umgebung INT importieren.
- Die Buchungsschlüssel in der Datei E167 für oneERP stehen in der korrekten Reihenfolge, auch für die Altteilesteuer.
- Der Download der Datei i156 über den Cross File Transfer funktioniert. Der Begriff „CrossFileTransfer“ wird in der deutschen Benutzersprache korrekt angezeigt.
- Die Erzeugung der oneSCM-Rechnungsnummern funktioniert korrekt.
- Der Transformationsjob für Vertrags-Deltas behandelt Löschfälle korrekt. Die Löschlogik für Umsatz- und Kostendaten ist korrekt. Ein nicht numerischer Textwert in einem Zahlenfeld führt nicht zu einem Deserialisierungsfehler. Das Feld annual_vehicle_mileage_txt passt für Altsystem-Verträge.
- Die Anfrage „available“ liefert nur die Produkte, die zum jeweiligen Identifikator passen.
- Die Produktauswahl funktioniert nach der Einführung neuer Felder.

### Preise, Anbindungen und Nachweise

- Der Total Price Outcome in der Preisinformation im Vergleich zeigt korrekte Werte an.
- Die Anbindung an Nemesis sendet Anfragen ohne den Fehler „Bad Request“ mit POST 400. Ein leerer Startkilometerstand führt bei einem Nemesis-Ereignis nicht zu einem Validierungsfehler.
- Der Refund an MPay wird einmal ausgelöst.
- Die Mercedes-me-Meldung zum Telefonnummernformat erscheint nur bei eingeschaltetem Mercedes-me-Schalter.
- Die Vorschau der MO-Prüfungen in der Kundenverwaltung wird erzeugt.

Quellen: Batch 142.8, 191.5, 192.5, 193.2, 205.3, 254.3, 258.5, 315.5, 360.5, 364.2, 542.1, 625.3, 653.5, 698.5, 769.8, 778.5, 823.4, 838.4, 1052.2, 1061.9, 1078.1, 1302.5, 1304.4

## 23.3 Bedienfrage, Datenabweichung und Störung

Dieser Abschnitt beschreibt Bedienfragen, Datenabweichungen und Störungen, die in den Quellen belegt sind.

### Bedienfragen

**Wo finden Sie die Vertragshistorie?**

In der Vertragsdetailansicht des Vertragsmanagements zeigt die Historie die Veha-Historie und die Änderungshistorie des Vertrags an.

**Wie verhalten sich die Felder „Last updated by“ und „Assign to myself“?**

Das Feld „Last updated by“ wird angezeigt. Der Schalter „Assign to myself“ funktioniert auch nach dem ersten Umschalten.

**Wie wirken Filter und Suche in den Materialnummern?**

Beim Zurücksetzen der Filter in der Übersicht der Materialnummern erscheint keine aufklappbare Zeile. Die Suche nach einem Unterbereich überschreibt das Suchergebnis nicht. Die Übersicht zeigt alle verfügbaren Materialnummern an.

**Wie sortieren Sie die Spalten der Rechnungsseite im Admin-Bereich?**

Die Sortierung nach aufsteigender und absteigender Reihenfolge funktioniert in allen Spalten der Rechnungsseite.

**Wie zeigt das System das Datum „Heruntergeladen am“ an?**

Die Anzeige aktualisiert sich unmittelbar nach dem Herunterladen einer Datei. Der Zeitstempel folgt der Zeitzone UTC.

**Lassen sich Dokumente über eine Gruppen-ID abrufen?**

Ja. Dokumente werden auch für eine Gruppen-ID abgerufen.

**Funktioniert die Mercedes-me-Suche?**

Ja. Die Mercedes-me-Suche funktioniert.

### Datenabweichungen

- **Symptom:** Die Prüfung im MO zeigt Kundendetails an, die nicht mit den Daten im Kundenbereich übereinstimmen.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Die MO-Prüfungen zeigen die Kundendetails aus dem Kundenbereich an.

- **Symptom:** Der CAS-Status im MO wird nach einem Kundenereignis nicht aktualisiert. Ein FI-Systemstatus „NOK“ wird im MO falsch gedeutet.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Der CAS-Status aktualisiert sich nach einem Kundenereignis. Der FI-Systemstatus „NOK“ wird im MO korrekt interpretiert.

- **Symptom:** Vertrags- und Kundendaten stammen aus unterschiedlichen Tenants.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Vertrags- und Kundendaten stimmen im Tenant überein.

- **Symptom:** Ein temporärer Kunde wird ohne Referenznummer geführt.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Ein temporärer Kunde führt eine Referenznummer.

- **Symptom:** Beim Erfassen von Kundendetails für Geschäftskunden treten gelegentlich Fehler auf.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Das Erfassen von Kundendetails für Geschäftskunden gelingt.

- **Symptom:** Benachrichtigungen und E-Mails erscheinen auf Englisch, obwohl Deutsch als Sprache gewählt ist. Die Oberfläche springt auf Englisch zurück.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Benachrichtigungen und E-Mails erscheinen in der gewählten Sprache. Die Oberfläche bleibt in der gewählten Sprache.

### Störungen

- **Symptom:** Die Vertragstabelle im Contract Management lädt nicht und zeigt eine Fehlermeldung an.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Die Vertragstabelle lädt.

- **Symptom:** Beim Aufruf eines Vertrags erscheint die Meldung „Customer/Contract not found“.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Der Aufruf eines Vertrags zeigt den Vertrag an.

- **Symptom:** Beim Drucken von Vertragsdokumenten erscheint die Meldung „query did not return a unique result: 2“.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Vertragsdokumente lassen sich drucken. Im Kommunikationsbereich lässt sich ein Vertrag erneut drucken.

- **Symptom:** Anfragen über Swagger lassen sich nicht ausführen.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Anfragen über Swagger lassen sich ausführen.

- **Symptom:** Beim ersten Klick auf „Aktualisieren“ antwortet der Lieferant mit Statuscode 500.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Der Klick auf „Aktualisieren“ liefert ein Ergebnis ohne Fehler.

- **Symptom:** Ein Konsolenfehler verhindert die Vertragserstellung.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Die Vertragserstellung läuft ohne Konsolenfehler. Verträge für Bestandskunden lassen sich anlegen.

- **Symptom:** Die Anfrage „Get product“ wird in der Produktivumgebung doppelt gleichzeitig ausgelöst.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Die Anfrage „Get product“ wird einmal ausgelöst.

- **Symptom:** Auf der Seite mit den Nutzungsbedingungen kommen Anwender nicht in die App.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Anwender gelangen über die Nutzungsbedingungen in die App.

- **Symptom:** Die Links zu Impressum und Datenschutzerklärung in oneSCM funktionieren nicht.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Die Links zu Impressum und Datenschutzerklärung öffnen die jeweilige Seite.

- **Symptom:** Die Historie in der Vertragsdetailansicht zeigt einen Fehler an.
- **Ursache:** Nicht beschrieben.
- **Lösung:** Die Historie zeigt die Veha-Historie und die Änderungshistorie des Vertrags an.

Quellen: Batch 191.5, 192.5, 193.2, 273.3, 360.5, 625.3, 653.5, 823.4, 838.4, 847.2, 1052.2, 1061.9, 1302.5

## 23.4 Informationen für einen Supportfall

Material: keine Quellen in den RAG-Batches

Quellen: keine Quellen in den RAG-Batches

## 23.5 Support- und Eskalationswege

Eine Lambda-Funktion prüft regelmäßig die von oneSCM genutzten AWS-Dienste. Für die Prüfung gelten festgelegte Schwellenwerte für Alarme. Bei einer Dienststörung benachrichtigt das angebundene Incident-Response-System das zuständige Team.

Für den Support sind die täglichen Aufgaben gebündelt und mit klaren Handlungsanweisungen versehen.

Quellen: Batch 542.1, 546.3

## 23.6 Bestätigte Workarounds und Ergebnisprüfung

Material: keine Quellen in den RAG-Batches

Quellen: keine Quellen in den RAG-Batches

## Verschiebung in andere Kapitel

| Inhalt | Zielkapitel | Batch |
|---|---|---|
| E-Mail-Vorlagen für Aussetzung und Ablehnung, Platzhalter, Header und Footer, Entwürfe, Gültig ab, Sprachen der Vorlagen, Vorlagen in der Slowakei | 14.4 Vorlagenverwaltung und Template Management | 421.3, 485.3, 494.5, 360.5, 364.2 |
| Konsolenfehler in den Markteinstellungen im Bereich Dokumente | 14.2 Marktspezifische Einstellungen | 1304.4 |
| Marktkonfiguration beim Aufruf eines Dienstes | 14.2 Marktspezifische Einstellungen | 191.5 |
| Produktabruf bei verfügbarer Anfrage im Produktmanagement | 14.8 Produktdefinition, Anlage und Veröffentlichung | 193.2 |
| Erstattung und Refund an MPay | 11.6 Endabrechnung, Erstattung und Korrekturen | 142.8 |
| Revenue-Auswertungen, Löschlogik für Umsatz- und Kostendaten, Sortierung und Auswertung der Rechnungsseite, Massenaktualisierung der Vertragsdaten | 11.7 Reporting, Filter und Exporte | 193.2, 315.5, 1061.9 |
| Darstellung des Rechnungsstatus in der Kundenrechnungsansicht | 11.2 Rechnungsstatus und Zahlungsstatus unterscheiden | 273.3 |
| Batch-Jobs, Job-Zeitpläne, Benutzerkennung der Jobs, manuelle Starts, Export und Import der Dateien E167, E169 und E174, Job-Namen, NACOS-ROBO-Job | 19.22 Schnittstellenbetrieb und Fehlerbehandlung | 192.5, 193.2, 205.3, 254.3, 258.5, 315.5, 625.3, 1302.5, 1304.4 |
| Buchungsschlüssel für oneERP und Altteilesteuer | 19.11 oneERP Kunden- und Finanzintegration | 205.3, 542.1 |
| Übermittlung der I155-Datei an VEGA | 19.9 VEGA Vertrag, Coverage und Claim | 1078.1 |
| Infrastruktur mit ECS, Lambda, Kafka, DynamoDB, IAM, Lambda-Secrets, Volume-Mount, Datenbankmigration, Terragrunt und Zertifikatserneuerung, Konfiguration ohne DEBUG-Modus | 19.1 Architekturüberblick und Systemlandkarte | 244.2, 273.3, 542.1, 546.2 |
| Health Checks, Monitore, JVM-Metriken, Dashboards, tägliche Support-Aufgaben | 19.22 Schnittstellenbetrieb und Fehlerbehandlung | 542.1, 546.3 |
| Übernahme anonymisierter Produktivdaten in PRE-PROD, lokale Simulation von AWS-Diensten, Sicherheitsbefunde in der Entwicklungsumgebung | 16.1 Datenschutz und sichere Beispieldaten | 315.5, 542.1 |
| Testautomatisierung mit Copilot, Produktlimits im End-to-End-Test, Anmeldung im Git-Runner | 16.4 Testnachweise und produktiver Funktionsstand | 364.2, 546.2, 1304.4 |
| Speichern der Signatur beim Erstellen | 7.5 Digitale Unterschrift | 546.2 |
| Nutzungsbedingungen, Impressum und Datenschutzerklärung | 2.1 Login und Single Sign-on | 1052.2 |
| Pflichtangaben und Rollen je Markt, SAP-Kreditorennummer bei MWSI, Zugriff auf Financial Control bei MBSK | 2.2 Fachliche Rollen und technische Berechtigungen | 698.5 |
| Erfassung des Kennzeichens und des Erstzulassungsdatums, SAP-Debitorennummern | 5.3 Fahrzeugdaten, Pflichtfelder und Validierungsregeln | 769.8, 1052.2 |
| Vorname und Nachname, Validierung im Frontend und Backend, Erfassung und Status der Kundendaten | 4.3 Kundendaten und Pflichtangaben prüfen | 610.3, 823.4 |
| Mercedes-me-Konto und Mercedes-me-Suche | 10.2 Vertrags-, Kunden- und Zahlungsdaten ändern | 653.5 |
| Partner Number Vega ID, Händlerfelder und Händlerdetails | 4.7 Partner- und Dealerbeziehungen | 192.5, 625.3 |
| Vertragshistorie mit Veha-Historie und Änderungshistorie | 10.8 Änderungshistorie und Nachvollziehbarkeit | 847.2 |
| Auftragsnummer und Zylinderwert | 5.2 Fahrzeug- und Vorgangskennungen | 5.6 |
| MO-Prüfungen in der Kundenverwaltung, Prüfstatus, CAS-Status und FI-Systemstatus | 9.3 Prüfstatus, Gründe und offene Prüfungen | 1052.2, 1061.9 |
| Aktionsabfrage für Händlerbenutzer | 12.5 Dealer-Zuordnung und Weiterbearbeitung | 800.3 |
| Navigation auf der Übersichtsseite der Vertragserstellung und Status des Umschalters für die globale Sammelrechnung in Schritt 3 | 6.6 Übersicht und Abschlusskontrolle | 650.3 |

## Klärungsbedarf

- **Eingestellte Vorhaben, Batch 364.2:** Der Satz zur Verteilung der Raten über die Restlaufzeit in den Vorlagen für Preisinformationen und die Druckvariable „ExternalCustomerID“ sind eingestellt. Die Klärung entscheidet, ob ein Hinweis in Kapitel 14.4 aufzunehmen ist.
- **Nicht weiterverfolgte Meldungen, Batch 364.2:** Die Quelle nennt fehlende Werte in der Erinnerungs-E-Mail vor Ablauf der Angebotsgültigkeit und eine nicht auffindbare Preisinformationsvorlage Transporter in deutscher Sprache. Ein Sollverhalten ist nicht beschrieben.
- **Geschlossene Meldung, Batch 364.2:** Die Meldung zur Aktualisierung der Preisinformationsvorlage nach der Bearbeitung ist geschlossen. Das Sollverhalten ist nicht beschrieben.
- **Berechtigungsfehler, Batch 364.2:** Für den AccessDenied-Fehler bei der Dokumentenerstellung in der Document-Management-Anwendung nennt die Quelle kein Ergebnis der Untersuchung.
- **Geschlossene Meldung, Batch 241.3:** Die Meldung zum Statuscode 500 bei erneuter Anlage eines Steuersatzes mit gleichen Daten ist geschlossen. Das Sollverhalten und die Art der Anpassung fehlen.
- **Geschlossene Meldung, Batch 1078.1:** Die Meldung zur I155-Datei ist geschlossen. Die technische Anpassung ist nicht beschrieben. Abschnitt 23.2 beschreibt nur das Sollverhalten.
- **Ergebnisstand fehlt, Batch 315.5:** Die Quelle nennt für die Validierung der Trennung von Batch-Jobs keinen Ergebnisstand.
- **Unklarer Eintrag, Batch 823.4:** „UI Adaptations Brabus“ ohne Details. Der Inhalt der Anpassungen ist nicht beschrieben.
- **Unklare Angabe, Batch 542.1:** Die Quelle nennt Inspector als Scanner und Sechub als Ausweichlösung. Die Regel für den Wechsel fehlt.
- **Unklare Angabe, Batch 625.3:** Der NACOS-ROBO-Job samt Dateien und Ablauf wurde überarbeitet. Eine Beschreibung des Ablaufs fehlt.
- **Widerspruch zur globalen Rechnungsstellung, Batch 258.5, 625.3, 650.3:** Batch 258.5 nennt einen entfernten zweiten Schalter, der die Vertragserstellung verhinderte. Batch 650.3 beschreibt einen Umschalter in Schritt 3. Batch 625.3 nennt eine Schaltfläche, die bei der Vertragserstellung nicht editierbar ist. Der Text folgt diesen Angaben. Das Zusammenspiel ist zu prüfen.
- **Pflicht des Kennzeichens, Batch 1052.2, 769.8:** Batch 1052.2 nennt eine Vertragsaktivierung ohne Kennzeichen als Fehler. Batch 769.8 nennt Fehler bei Kfz-Kennzeichen. Eine Aussage zur Pflicht bei der Aktivierung fehlt.
- **Unklare Angabe, Batch 1052.2:** Die Quelle nennt Verträge mit fehlerhafter Dokumentenbehandlung, ohne den Fehler zu beschreiben.
- **Unklare Angabe, Batch 273.3:** Die Quelle nennt einen Speicherort eines Ordners im S3-Ablagesystem, ohne das Sollverhalten zu beschreiben.
- **Unklare Begriffe, Batch 610.3:** Die Quelle nennt „GSSN“ ohne Erläuterung. Die Auswirkung auf die Namen für Märkte ist nur als Aussage vorhanden.
- **Fehlender Wortlaut, Batch 5.6:** Der Wortlaut der Fehlermeldung bei falscher Auftragsnummer ist nicht angegeben.
- **Doppelte Quellen und uneinheitliche Bezeichnungen, Batch 421.3, 485.3, 494.5:** Batch 421.3 und Batch 485.3 beschreiben denselben Text der Suspendierungs-E-Mail mit abweichender Formulierung. Batch 421.3 und Batch 485.3 nennen den MB Style Guide, Batch 494.5 den Mercedes-Benz E-Mail-Styleguide. Die Anrede lautet in Batch 421.3 „Dear %First Name, %Last name“, in Batch 494.5 mit Klammern um die Platzhalter.
- **Releasebezug, Batch 838.4:** Die Quellen nennen nur Release Candidate 10. Weitere Releases mit Fehlerbildern fehlen.

## Vorschläge zur Gliederung

- Die Abschnitte 23.4 und 23.6 haben keine Quellen in den RAG-Batches. Zusammenführen zu einem Abschnitt „Supportfall und Ergebnisprüfung“ ist sinnvoll, sobald Material vorliegt.
- Abschnitt 23.5 stützt sich auf zwei Batches. Die Betriebs- und Support-Routinen gehören in ein eigenes Unterkapitel in Kapitel 19, zum Beispiel mit Monitoring und Incident-Response.
- Abschnitt 23.2 nach Markt und Release gliedern und Releasebezeichnungen ergänzen, da die Quellen nur Release Candidate 10 nennen.
- Das Klärungsregister in Abschnitt 16.7 und Anhang F.1 aufnehmen. Eingestellte und geschlossene Meldungen wie in den Batches 364.2, 241.3 und 1078.1 gehören dorthin und nicht in den Fließtext.
- Die Dubletten Batch 421.3 und Batch 485.3 im Kapitel 14.4 zusammenführen.
- Abschnitt 23.3 in Bedienfragen, Datenabweichungen und Störungen trennen, wie es die Überschrift vorgibt. Die Störungen brauchen eigene Fehlermeldungstexte, sobald die Quellen sie liefern.
