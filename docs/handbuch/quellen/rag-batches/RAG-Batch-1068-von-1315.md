# Batch 1068 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 78 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation): Korrekturen und Verbesserungen**

In diesem Release wurden zahlreiche Fehler im Bereich der Vertragserstellung behoben. Die Korrekturen betreffen die Preis- und Zahlungsplananzeige, Händlerrabatte und Kampagnen, die Dokumentenverarbeitung, die Prüfprozesse sowie die Historie und die Schnittstellen.

**Preise, Zahlungsplan und Rabatte**

Der Zahlungsplan und die Preisanzeige wurden an mehreren Stellen korrigiert. Dies gilt für die Produktkonfiguration, die Übersicht und die Bestätigung sowie für den Ablauf mit Baumuster, in dem nachträglich eine Fahrgestellnummer oder VIN ergänzt wird. Bei Verträgen mit Einmalzahlung wird der Zahlungsplan nun korrekt dargestellt. Das gilt auch für Verträge, bei denen der Händlerrabatt dem Vertragspreis entspricht. Das Enddatum des Zahlungsplans im ersten Schritt der Vertragserstellung wird richtig angezeigt. Außerdem wurden der Bruttobetrag im Zahlungsplan bei monatlicher Zahlung, die Anzeige des Händlerprovisionswerts und die Übereinstimmung der Mehrwertsteuer zwischen Dokument und Zahlungsplan beim unverbindlichen Angebot korrigiert. Bei angewendeten Kampagnen wird der Zahlungsplan angepasst. Zudem ist das Anlegen von Verträgen mit Kampagne sowie mit einer Kampagne in Kombination mit einem 100-%-Händlerrabatt wieder möglich. Das Feld für die Zahlungsdauer lädt bei Verträgen mit 100-%-Händlerrabatt jetzt korrekt. Ein doppelt angelegter interner Händlerrabatt im Reiter für Preisreduzierungen wurde behoben. Ebenso wurden die fehlende Anzeige des umverteilten Betrags bei manuell eingegebenem FRD und die fehlerhafte Fehlermeldung bei der Option „Unverbindliches Angebot per E-Mail“ im Zusammenhang mit Händlerrabatt behoben. Händlerrabatt-Informationen werden auch bei Verträgen, die ein Händler mit Rabatt erstellt hat, korrekt übermittelt.

**Fahrzeug, Auftragsnummer und Produkte**

Im Ablauf mit Baumuster werden Auftragsnummern nun korrekt geladen, und der Wert der Auftragsnummer erscheint im Fahrzeug-Reiter. Fehler bei der Vertragserstellung mit Auftragsnummer wurden behoben. Dasselbe gilt für die Validierungsmeldung mit Produktliste bei Fahrzeugen mit ISP. Der Fall, dass für Fahrzeuge trotz verfügbarer Produkte keine Produkte angezeigt wurden, wurde korrigiert. Ebenso können Verträge mit Baumuster und nachträglich ergänzter Fahrgestellnummer ohne FRD wieder fortgeführt werden. Die Aktualisierung der Fahrzeuginformationen und der Platzhalter für Produktbilder wurden ebenfalls überarbeitet.

**Aktivierung, Bestätigung und Status**

Probleme bei der Aktivierung von Verträgen wurden behoben, darunter eine 403-Exception und Fälle, in denen ein Vertrag nicht aktiviert werden konnte. Dies betrifft auch den Ablauf mit neuem Kunden und einer FIN ohne FRD. Fehler beim Anlegen von Verträgen wurden korrigiert, ebenso Fehler beim Weiterklicken nach Eingabe von Kunden- und Zahlungsdaten im BTS-Ablauf. Das Bestätigungsdatum wird nicht mehr vor der tatsächlichen Bestätigung angezeigt und wird nun korrekt aus der Backend-Antwort übernommen.

**Dokumente, Unterschrift und Kommunikation**

Mehrere Probleme rund um Dokumente wurden gelöst. Die Druckversion eines PDF-Vertrags kann hochgeladen werden, und Fehler beim Anlegen eines Vertrags mit Unterschrift per Druck wurden behoben. Beim Hochladen oder Ersetzen aus der Vertragserstellung wird nun die Uhrzeit aktualisiert. Auch der Fehler beim Ersetzen eines PDFs durch ein anderes wurde behoben. Nach dem Neuladen des Tabs kann man wieder Dokumente hochladen und Verträge sehen. Bei der Unterschriftsmethode „Druck“ sowie bei neuen Kunden und Servicevertrag enthalten die Dokumente nun SEPA-Mandat und Allgemeine Geschäftsbedingungen. Das SEPA-Dokument wird im Reiter „Kommunikation“ zusammen mit dem Servicevertrag als ein Dokument dargestellt und dem Kunden beim Druck entsprechend präsentiert. Die AGB wurden vereinheitlicht: Sie sind in der Vorschau für das erworbene Produkt verfügbar, stimmen zwischen Vorschau und Druck- bzw. Unterschriftsdokumenten überein, und im Reiter „Kommunikation“ wird immer die beim Verkauf verwendete Version angezeigt. Eine Fehlermeldung beim erneuten Senden der DSS-E-Mail wurde ebenfalls behoben.

**Prüfungen (CAS, MO)**

Bei der CAS-Prüfung wurde der Fehler für neue Privatkunden behoben, und der Grund bei positivem CAS-Ergebnis wird nun korrekt angegeben. Außerdem wurde ein Fall korrigiert, in dem ein bestehender Kunde aktiviert werden konnte, obwohl der FI-Systemstatus in der MO-Prüfung noch auf „NOK“ stand.

**Historie, Schnittstellen und Batch**

Die Historie zeigt nun fehlende Status an und stellt geänderte Objekte korrekt dar. Beim manuellen Start von I155 wird das Feld „Geändert von“ richtig aktualisiert, und der I155-Batch-Job läuft in der Integrationsumgebung wieder fehlerfrei. Bei Ereignissen an Nemesis muss die zguid nun 32 Zeichen lang sein. Für eine bestimmte Konstellation, in der kein Vertragsstamm bei Nemesis ankam, wurde das Problem behoben. Die Abweichung zwischen der geplanten Vertragsdauer in der Oberfläche und in der Kafka-Nachricht wurde beseitigt.

**Benutzer und Nutzungsbedingungen**

Für Händlerbenutzer wird das Pop-up zu den Nutzungsbedingungen beim ersten Login nun angezeigt.