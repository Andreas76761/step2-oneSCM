# Batch 586 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 21 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnermanagement**

Im Bereich Kunden- und Partnermanagement wurden mehrere Erweiterungen und Fehlerbehebungen umgesetzt. Für die DATIX-Integration steht ein Kundendatenexport zur Verfügung. Außerdem wurde die Benutzeroberfläche im Zuge der Trennung von PC (Private Customer) und VAN angepasst. Die Anpassungen berücksichtigen, ob ein Benutzer über eine PC-Rolle oder eine VAN-Rolle verfügt, und betreffen die Marktkonfiguration, das Finanzmanagement, das Admin-Management, das Produktmanagement sowie die Vertragserstellung, das Vertragsmanagement und die MO-Prüfungen. Zusätzlich wurde das Datenmodell samt Logik für Lieferantendetails erweitert.

Bei der Erstellung und Pflege von Kunden gelten künftig Längenbegrenzungen für Namensfelder: Der Firmenname darf höchstens 70 Zeichen, der Vorname und der Nachname jeweils höchstens 35 Zeichen umfassen. Das gilt sowohl im Dialog zur Kundenanlage als auch bei Aktualisierungen der Kundeninformationen im Kundenmanagement.

Für Gewerbekunden (Commercial, Commercial Fleet und Commercial Governmental) werden Kunden- und Zahlungsinformationen im Vertragserstellungsprozess nun in zwei getrennten Schritten erfasst, damit die verfügbaren Zahlungsoptionen besser abgebildet werden. Der erste Schritt, die Kundeninformationsseite, enthält die Bereiche Kundeninformationen, Zahlungsreferenz, Adressdaten, Steuer- und Rechtsangaben (USt-IdNr., Steuernummer, Steuerklassifizierung und Rechtsform), Kontaktpersonen, Präferenzen und Händlerdaten. Mit „Weiter“ wird der Kunde in oneSCM angelegt und erhält eine Nummer. Dabei wird auch der Wert im Feld „Account Note“ geprüft, damit im nächsten Schritt die passenden Zahlungsarten angezeigt werden können. Der zweite Schritt, die neue Seite für Zahlungsinformationen, enthält die Zahlungsart (Lastschrift mit Bankdaten; die Überweisung ist für eine spätere Umsetzung vorgesehen) sowie die Forderungsdaten aus dem FI-System mit SAP-Debitorennummer, FI-System-Status und Account Note. Die Zahlungsinformationen werden in der Datenbank als eigenes Objekt behandelt.

Zu den behobenen Fehlern zählen:
- Nach der Selbstzuweisung eines Vertrags wurden fälschlicherweise Hinweismeldungen (Toasts) zu Kunden- und Zahlungsdaten ausgelöst.
- Privatkunden für MBSK ließen sich nicht aktualisieren.
- Bei Kunden in der Slowakei traten Probleme mit Mpay auf.
- Gewerbekunden wurden nicht in den Status „In Confirmation“ versetzt.
- Bei der Händleranlage war die Schaltfläche zum Erstellen aktiv, obwohl die GssnOutletId inaktiv war.
- Ein Namensabgleich-Problem eines Kunden in oneERP wurde bereinigt.
- Beim Batch-Job „CustomerSepaMandateRetryJob“ wurde kein Lastschriftcode von oneERP empfangen; auch dieses Thema wurde abgeschlossen.
- Weitere Mängel, die während einer Präsentation zu CoFiCo aufgefallen waren, wurden behoben.

Die CoFiCo-Integration (API-POST zur Anlage und Aktualisierung von Privatkunden für PC/VAN) wurde abgeschlossen. Voraussetzung dafür sind gepflegte Produkte, ausgefüllte Markteinstellungen sowie vorhandene Vorlagen für E-Mails und Dokumente.

Geplant, aber noch nicht umgesetzt, sind zwei Vorhaben. Zum einen soll die Variable „expiryCriteria“ als Druckvariable für Dokumente bereitgestellt werden. Jedes Produkt hat ein oder mehrere Ablaufkriterien für die Beendigung eines Vertrags, etwa zeitliche Kriterien, die für mehr Transparenz in den Kundendokumenten angezeigt werden sollen. Die Variable soll für Dokumente und Benachrichtigungen einheitlich nutzbar sein und zunächst in den Vorlagen für Angebot und Preisinformation verwendet werden; eine Verwendung bei der Verlängerung wird noch geprüft. Zum anderen sollen Kunden und Verträge über eine API für den Vertriebskanal Online Sales angelegt werden können. Kunden in oneSCM-Märkten sollen Serviceverträge über den von Mercedes-Benz bereitgestellten Online Store (SCOS) abschließen können, wobei Kunden- und Zahlungsdaten per API an oneSCM übermittelt werden. Die Daten müssen vollständig sein, damit ein Kundendatensatz mit Referenznummer entstehen kann. Wie im bestehenden Retail-Prozess sind folgende Prüfungen vorgesehen: Die Kundenadresse wird mit der Google-API geprüft, eine Dublettenprüfung löst ab einer Übereinstimmung von 80 % eine interne Benachrichtigung an die MO zur manuellen Klärung aus, die IBAN wird über die SWIFT-REF-API geprüft, und ein vorhandenes SEPA-Mandat wird mit oneERP abgeglichen.