# Batch 585 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**SEPA-Anbindung an CoFiCo (Direct Debit)**

Mit diesem Thema wird die Integration für die SEPA-Erstellung umgesetzt, damit für die CoFiCo-Märkte das Lastschriftverfahren (Direct Debit) genutzt werden kann. Bisher kann der aktuelle Ablauf keine CoFiCo-Mandatsreferenz anfordern, und es gibt keine Zahlungsart-Logik für Direct Debit. Künftig wird die bestehende POST-Anfrage an CoFiCo angepasst, aber nicht ersetzt. Sie enthält dann die SEPA-Mandatsdaten, sodass die für die Mandatserstellung erforderlichen Bankinformationen im regulären Kommunikationsablauf übermittelt werden. Diese Informationen werden erst gesendet, nachdem das SEPA-Mandat unterschrieben wurde. Ein separat unterschriebenes SEPA-Dokument muss nicht an CoFiCo übertragen werden. Das Unterschriftsdatum wird aus dem SEPA-Signaturereignis übernommen und im Format JJJJMMTT als `dateSignature` gesendet. Das Verhalten der bestehenden Anfragen ohne SEPA bleibt unverändert, und die SEPA-spezifischen Felder bleiben dort leer. Attribute wie `paymentMethod` und `bankCountry` werden anhand einer marktspezifischen Zuordnung ermittelt.

Verwendet wird die Funktion von Marktbetreuung (Market Operations, MO), MPC-Anwendern sowie Händlern bzw. Händlern+, also von Benutzern, die Verträge anlegen, Zahlungsinformationen konfigurieren, Dokumenten- und Mandatsprüfungen überwachen und den Direct-Debit-Code im Kundenmanagement pflegen können. Dabei können der bestehende SEPA-Dokumenten- und Signaturprozess von oneSCM sowie die vorhandenen Funktionen für IBAN/SWIFTRef und die MO-Prüfungen weiterverwendet werden, gegebenenfalls mit marktspezifischen Abweichungen.

**Direct Debit für den Markt MBCZ**

Für den Markt MBCZ wird Direct Debit als Zahlungsart für Privat- und Gewerbekunden verfügbar. Die Zahlungsarten werden wie folgt zugeordnet: Kreditkarte mit dem Zahlungsartcode M, Direct Debit (Lastschrift) mit dem Code P und Banküberweisung mit dem Code B. In allen drei Fällen gilt die Zahlungsbedingung FB30.

Die IBAN wird über SWIFTRef validiert, sofern der Dienst verfügbar ist. Ist SWIFTRef nicht erreichbar, können die Bankdaten manuell eingegeben werden. Bei Bestandskunden mit hinterlegten Bankdaten wird die IBAN bei der Vertragserstellung schreibgeschützt angezeigt und kann auf dieser Ebene nicht geändert werden.

**Ablauf für neue Kunden und Bestandskunden ohne hinterlegte IBAN**

Der Ablauf entspricht weitgehend dem bestehenden SEPA-Prozess und gilt für CoFiCo-Märkte ohne Abweichungen, darunter Tschechien. Zunächst wird die Angebotserstellung gestartet und bei Bedarf ein neuer Kunde angelegt. Auf der Seite für die Zahlungsinformationen wird Direct Debit gewählt, wodurch das IBAN-Feld aktiviert wird. Die IBAN wird eingegeben und per SWIFT geprüft; ist das System nicht verfügbar, werden die Daten manuell erfasst. Anschließend wird der Vertrag erstellt, und das SEPA-Mandatsdokument wird zusammen mit dem Vertragsangebot erzeugt.

Sobald der Kunde die Dokumente unterschrieben hat und die CAS- und Sanktionslistenprüfungen erfolgreich abgeschlossen sind, wird die bestehende POST-Anfrage mit den SEPA-Attributen an CoFiCo gesendet. Die SEPA-Attribute für die Erstellung der Mandatsreferenz werden nur übermittelt, wenn das SEPA-Dokument unterschrieben ist. In der CoFiCo-Antwort auf die Kundenanlage wird der Direct-Debit-Code, die CoFiCo-Mandatsreferenz, zurückgegeben. Existiert der Kunde bereits und wird nur eine Aktualisierung gesendet, erhält oneSCM die Mandatsreferenz beim Abgleich mit CoFiCo auf Basis der gesendeten Daten. Der erhaltene Direct-Debit-Code wird als Direct-Debit-Code des Kunden gespeichert, der Status der zugehörigen MO-Prüfung wird aktualisiert, und der Aktivierungsprozess kann fortgesetzt werden: Der Vertrag wird aktiviert, die I155 wird erzeugt und das Ereignis an Revenue gesendet.

**Ablauf für Bestandskunden mit hinterlegten Bankdaten**

Die gespeicherten Bankdaten werden in die Vertragserstellung übernommen. Die IBAN wird schreibgeschützt angezeigt, Direct Debit wird als Zahlungsart gewählt und die Signatur wird gestartet. Sobald alle Prüfungen den Status „OK“ haben, folgt der Aktivierungsprozess.

**Änderung der IBAN auf Kundenebene**

Hier gilt die gleiche Funktionalität wie in Deutschland und für oneERP. CoFiCo unterstützt mehrere IBANs und erhöht die BankId, wenn die IBAN geändert wird. Die MO wählt im Kundenmanagement die Aktualisierung der Zahlungsinformationen und gibt die neue IBAN ein. Nach der Prüfung der IBAN wird ein neues SEPA-Mandat erstellt und unterschrieben, danach wird eine Aktualisierungsanfrage mit der neuen IBAN an CoFiCo gesendet. Erfolgt die Änderung über CAC, gilt derselbe Ablauf. Offen ist noch, wie die BankId in diesem Fall übermittelt wird; dies soll am 10.09. geklärt werden.

**Kundenmanagement**

Das Feld „Direct Debit Code“ unter „Payment Information > Bank Details“ bleibt editierbar. MO und MPC können einen Direct-Debit-Code manuell hinterlegen. Zwischen dem SAP-Debitor und dem Direct-Debit-Code besteht keine Beziehung; beide Werte können unabhängig voneinander angegeben werden. Werden Bankdaten hinzugefügt oder geändert, bzw. wird der Direct-Debit-Code aktualisiert, wird ein Ereignis an den Vertrag gesendet, damit der Status der MO-Prüfung neu berechnet wird und der Aktivierungsprozess fortgesetzt werden kann.

**MO-Prüfungen**

Die Statuswerte der Dokumentenprüfung bleiben für den SEPA-Ablauf unverändert: „Noch nicht verfügbar“ (Signatur nicht gestartet), „Ausstehend“ (Dokumentensignatur läuft), „OK“ (Dokumente unterschrieben) und „NOK“ (mit Fehler unterschrieben). Bei den Kundenprüfungen gilt für den Direct-Debit-Code: Ist keine CoFiCo-Mandatsreferenz vorhanden, lautet der Status „NOK“ und es wird ein Link zum Kunden angezeigt. Ist sie vorhanden, lautet der Status „OK“. Wurde die Anfrage ohne Mandatsreferenz abgeschlossen, bleibt die Vertragsaktivierung blockiert. Vertragsaktivierung, I155-Erzeugung und das Ereignis an Revenue erfolgen erst, wenn alle erforderlichen Prüfungen einschließlich der Direct-Debit-Code-Prüfung den Status „OK“ haben.

**Offene Punkte**

Noch zu klären sind die Quelle, der Pflichtstatus und die Zuordnung der Payload-Attribute für die SEPA-Erstellung, da sie für die Vollständigkeit der Daten und den späteren Abgleich mit CoFiCo relevant sind. Ebenso ist offen, ob die IBAN-Änderung im Kundenmanagement im Umfang enthalten ist und welches CoFiCo-Antwortfeld genau verwendet wird, einschließlich der Behandlung von fehlenden, doppelten oder asynchron zurückgegebenen Mandatsreferenzen. Beispiele für die POST-Anfragen sollen dem Ticket noch beigefügt werden.