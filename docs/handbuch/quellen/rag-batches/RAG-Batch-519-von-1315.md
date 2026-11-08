# Batch 519 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Automatische Übermittlung der Schlussrechnung nach Vertragskündigung**

Wird ein Leasingvertrag über die Edge-Schnittstelle gekündigt, wird die Schlussrechnung bislang manuell in oneSCM von einem Mitarbeiter der Market Operations erstellt. An den Kunden, der die Kündigung ausgelöst hat, wird dabei nichts zurückgemeldet. Er erfährt den Endbetrag also nur, wenn er aktiv nachfragt oder Daten abruft. Mit der neuen Funktion entfällt diese manuelle Mitteilung: Sobald die Schlussrechnung ausgestellt ist, sendet oneSCM sie automatisch an das externe System des Kunden (Konsumenten). Dabei ist oneSCM der aufrufende Client und das System des Konsumenten der Server. Das ist die Umkehrung der Richtung aller bisherigen Edge-Vertragsschnittstellen. Der Konsument stellt dafür den Endpunkt POST /api/v1/contract-final-invoices bereit. Der Aufruf erfolgt asynchron. Die Vertragsversion ist 1.0, die Spezifikationsrevision 1.1.

**Ablauf aus Sicht der Anwender**

Der Konsument kündigt den Vertrag mit dem Status TERMINATED über PUT /contract/v2/leasing. Der Contract Service speichert die Kündigung samt der Kennung des auslösenden Konsumenten und informiert Revenue Management. Anschließend legt ein Mitarbeiter der Market Operations die Schlussrechnung wie gewohnt manuell an und setzt dabei zusätzlich das Kontrollkästchen für die Schlussabrechnung. Weitere Schritte sind für ihn nicht nötig. Neue Benutzerrollen werden nicht benötigt.

Die Rechnung wird erst dann übermittelt, wenn sie erstmals den Status FI_DOCUMENT_CREATED erreicht, der nach außen als ISSUED erscheint. Eine gespeicherte Rechnung kann noch den Status CREATED oder ACCEPTED haben, ggf. freigegeben werden müssen und noch keine Nummer des FI-Systems besitzen. Ein früheres Senden würde ein noch änderbares oder nicht freigegebenes Finanzdokument liefern. Rechnungen in den Status CREATED, ACCEPTED, EXPORTED, ERROR oder CANCELLED lösen daher keine Übermittlung aus.

**Wann eine Rechnung übermittelt wird**

Die Übermittlung erfolgt nur, wenn alle sieben Bedingungen erfüllt sind: Die Kündigung wurde über PUT /contract/v2/leasing mit einer gespeicherten, stabilen Konsumentenkennung angenommen. Der Vertrag hat den Status TERMINATED. Der Vertriebskanal des Vertrags ist LEASING. Der Mitarbeiter hat bei der manuellen Anlage das Kontrollkästchen für die Schlussabrechnung gesetzt. Die Rechnung hat in Revenue Management den Typ MANU und den Dokumenttyp INVOICE. Die Rechnung erreicht erstmals FI_DOCUMENT_CREATED. Und für diese Rechnung existiert noch kein Ereignis.

Die Schlussrechnung wird bewusst nicht allein am Typ MANU erkannt, da dieser auch andere manuell erstellte Finanzdokumente umfasst. Das Kontrollkästchen wirkt nur bei Leasingverträgen. Gutschriften, die durch die Kündigung entstehen, stornierte Rechnungen sowie Zahlungs- oder Mahnvorgänge lösen dieses Ereignis in Version 1 nicht aus.

**Inhalt der Übermittlung**

Die Nachricht ist ein unveränderlicher Schnappschuss im JSON-Format (application/json; charset=utf-8, maximal 64 KiB). Sie enthält Schemaversion, eine eindeutige Ereignis-ID, den Ereignistyp CONTRACT_FINAL_INVOICE_ISSUED und den Zeitpunkt des Ereignisses. Zu den Vertragsdaten gehören Vertragsnummer, Status, Kündigungsdatum, optional der Kündigungsgrund, der Kilometerstand bei Kündigung, Marktkennzeichen und Division. Die Rechnungsdaten umfassen Rechnungs-ID, oneSCM-Rechnungsnummer, Rechnungsnummer des FI-Systems, Zweck FINAL_SETTLEMENT, Dokumenttyp INVOICE, Status ISSUED, Rechnungsdatum, Abrechnungszeitraum, Währung, Netto-, Steuer- und Bruttobetrag, Steuersatz und Steuerklassifikation. Optional sind Zahlungsreferenz, Rechnungsreferenz und Beschreibung.

Als Kündigungsdatum wird das vom Konsumenten gewünschte Wirksamkeitsdatum übermittelt, nicht das Verarbeitungsdatum. Es wird im ISO-Format yyyy-MM-dd ausgegeben, auch wenn die interne Schnittstelle das Format dd.MM.yyyy verwendet. Die Rechnungs-ID wird als Ziffernfolge übertragen, damit keine Genauigkeit verloren geht. Beträge sind mit Dezimalarithmetik zu verarbeiten, nie mit Binärfließkommazahlen, und der Bruttobetrag muss innerhalb der Rundungsregel der Währung der Summe aus Netto und Steuer entsprechen. Aus Gründen der Datenminimierung enthält die Nachricht weder Kundennamen, Postanschrift, SAP-Debitorennummer, Kommentare noch Angaben zum Ersteller. Die Vertragsnummer dient dem Konsumenten als Zuordnungsschlüssel. Ein PDF wird in Version 1 nicht übermittelt, sondern nur Metadaten der Rechnung.

**Technischer Ablauf und Zustellgarantie**

Revenue Management legt das Ereignis in derselben Transaktion wie den qualifizierenden Statuswechsel der Rechnung in einer Outbox-Tabelle ab. Ein separater Publisher sendet die festgeschriebenen Einträge nach dem Commit an OneKafka, das ausschließlich intern genutzt und dem Konsumenten nie zugänglich gemacht wird. Der Edge Service liest das Ereignis, ermittelt das konfigurierte Ziel und ruft den Endpunkt des Konsumenten auf. Edge bleibt dabei ein reiner Integrationsadapter ohne eigene Datenbank und ohne Rolle als führendes Rechnungssystem. Ein Fehler bei der Zustellung macht weder die Kündigung noch die manuelle Rechnungserstellung rückgängig, und Revenue Management führt innerhalb der Rechnungstransaktion keinen ausgehenden Netzwerkaufruf aus.

Die Zustellung erfolgt mindestens einmal (at least once). Die Reihenfolge ist nicht garantiert. Der Konsument muss deshalb Duplikate erkennen. Bei jedem Wiederholungsversuch und jeder erneuten Zustellung bleiben Ereignis-ID, Idempotency-Key und die Bytes der Nachricht identisch, nur der Header X-OneSCM-Delivery-Attempt wird erhöht.

Für die Authentifizierung nutzt Edge OAuth 2.0 Client Credentials mit einer eigenen Client-Identität je Umgebung und Konsument. Die Verbindung erfolgt über HTTPS mit TLS 1.2 oder neuer und zwingender Zertifikatsprüfung. Weiterleitungen werden nie befolgt, damit keine Zugangsdaten an einen nicht freigegebenen Host gelangen. Die Ziel-URL stammt ausschließlich aus freigegebener Konfiguration, nie aus Anfragedaten. Die Header umfassen Authorization, Content-Type, Accept, Idempotency-Key und X-OneSCM-Delivery-Attempt, empfohlen sind X-Correlation-Id und optional traceparent.

**Antworten des Konsumenten und Verhalten von Edge**

Bei erster dauerhafter Annahme antwortet der Konsument mit 202 und dem Status ACCEPTED. Ein exaktes Duplikat beantwortet er mit 200 und ALREADY_ACCEPTED, ohne die fachlichen Wirkungen zu wiederholen. Dieselbe Ereignis-ID mit abweichendem Inhalt führt zu 409 IDEMPOTENCY_CONFLICT. Fehler werden als application/problem+json mit stabilem maschinenlesbarem Code sowie eventId und correlationId geliefert.

Jede 2xx-Antwort wertet Edge als Erfolg und bestätigt das interne Ereignis. Bei 400, 404, 405, 409, 410, 413, 415 und 422 wird nicht wiederholt, das Ereignis geht in die Dead Letter Topic (DLT) und löst einen Alarm aus. Bei 401 erneuert Edge einmalig das Token und versucht es erneut, eine zweite 401 führt zu DLT und Alarm. Bei 403 wird nicht wiederholt, es folgen DLT sowie ein Sicherheits- bzw. Konfigurationsalarm. Bei 408, 425 und 429 wird wiederholt, wobei ein gültiger Retry-After-Wert beachtet wird. Bei 500, 502, 503 und 504 sowie bei DNS-, Verbindungs-, TLS-, Reset- und Timeout-Fehlern wird nach dem Backoff-Plan wiederholt. Sonstige 3xx- und 4xx-Antworten werden weder befolgt noch wiederholt, sondern führen zu DLT und Alarm.

**Wiederholungen, Fehlerbehandlung und Wiederanstoß**

Es sind bis zu neun Versuche vorgesehen, und zwar ungefähr sofort, nach 1 Minute, 5 Minuten, 15 Minuten, 1 Stunde, 3, 6, 12 und 24 Stunden jeweils ab dem vorherigen Versuch, mit begrenztem Zufallsanteil (Jitter). Ein gültiger Retry-After-Wert kann die nächste Wartezeit ersetzen, höchstens jedoch 24 Stunden. Der Verbindungs-Timeout beträgt 3 Sekunden, der Antwort-Timeout 15 Sekunden. Nach Ausschöpfung der Versuche landet das Ereignis in der DLT, es wird ein Betriebsalarm ausgelöst, und ein berechtigter Mitarbeiter kann es manuell erneut anstoßen, wobei die ursprüngliche Ereignis-ID erhalten bleibt. Edge schließt ein Quellereignis erst ab, wenn eine 2xx-Antwort vorliegt und das Zustellergebnis dauerhaft festgehalten wurde. Im ungünstigsten Fall entsteht dadurch ein Duplikat, aber kein unprotokollierter Erfolg.

**Nachvollziehbarkeit und Betrieb**

Für jeden Zustellversuch wird ein bereinigtes Ergebnisereignis erzeugt, das weder das Token noch die vollständige Nachricht enthält. Application Operations können die DLT einsehen, Ereignisse erneut anstoßen, Dashboards nutzen und erhalten Alarme bei dauerhaften Fehlern. Der Support kann anhand der Ereignis-ID Kündigung, Rechnungsausstellung, jeden Zustellversuch, die finale Antwort, den DLT-Status und einen Wiederanstoß nachverfolgen, außerdem nach Vertragsnummer, Rechnungs-ID und Konsumentenkennung. Vorgeschlagen sind 90 Tage Aufbewahrung für Idempotenzdaten beim Konsumenten und 30 Tage für DLT- und Wiederanstoßdaten, vorbehaltlich der Freigabe durch Compliance.

Ein Hauptschalter (Kill Switch) pausiert die Zustellung, ohne das Quellereignis zu verlieren. Nach der Wiederaktivierung wird mit der ursprünglichen Identität sicher zugestellt. Die Kafka-Aufbewahrungsdauer muss dafür länger sein als die längste geplante Pause. Die Konfiguration enthält Aktivierungskennzeichen, Konsumenten-ID, HTTPS-Basis-URL und Pfad, OAuth-Token-URL, Client-ID, Secret und Scope aus dem Secret Store, Zulassungslisten für Markt und Division, Timeouts, maximale Versuche und follow-redirects=false. Beim Start schlägt die Validierung bei leerer Konsumenten-ID, nicht-HTTPS-URL, fehlenden OAuth-Einstellungen, ungültigem Timeout oder nicht unterstütztem Pfad fehl. Die maximale Versuchszahl muss zur bereitgestellten Retry-Topologie passen. Zunächst ist ein Ziel konfiguriert, bei Anbindung eines zweiten Konsumenten wird daraus eine nach Konsumentenkennung geordnete Zuordnung.

**Isolation und Datenschutz**

Ein Ereignis wird ausschließlich an die Konsumentenidentität gesendet, die der API-Kündigung zugeordnet ist und für Markt und Division des Vertrags freigegeben ist. Die Zustellung eines Finanzdokuments an die falsche Organisation wäre ein Datenschutzvorfall und kein bloßer Funktionsfehler.

**Pflichten des Konsumenten**

Der Konsument authentifiziert und validiert die Anfrage, speichert oder reiht sie dauerhaft ein und antwortet erst dann, innerhalb von 10 Sekunden, mit 202. Er dedupliziert anhand von Idempotency-Key und eventId, verlässt sich nicht auf die Ankunftsreihenfolge und ignoriert unbekannte JSON-Felder. Er nutzt zutreffende Statusklassen: 4xx für dauerhafte Validierungsfehler, 5xx oder 429 bei vorübergehender Annahmeunfähigkeit. Außerdem stellt er stabile Endpunkte für Vorproduktion und Produktion sowie einen betrieblichen Ansprechpartner bereit. Er validiert das Token auf Aussteller, Zielgruppe, Ablauf, Signatur und Scope (z. B. final-invoices.write).

**Versionierung und Abgrenzung**

Der Pfad enthält die Hauptversion v1, das Nachrichtenschema trägt die Version 1.0. Das Hinzufügen optionaler Felder ist abwärtskompatibel. Das Entfernen oder Umbenennen von Feldern, Typänderungen oder geänderte Bedeutungen bestehender Aufzählungswerte erfordern /api/v2, neue Aufzählungswerte erfordern einen ausdrücklichen Kompatibilitätstest mit dem Konsumenten. Nicht Bestandteil von Version 1 sind Gutschriften, Stornierungen, Zahlungs- und Mahnaktualisierungen sowie die Übermittlung von PDF-Dokumenten. Hierfür wären eigene Ereignisverträge nötig.

**Hinweis zum Umsetzungsstand**

Die Funktion befindet sich im Dev Backlog und ist noch nicht umgesetzt. Mehrere Punkte erfordern noch Freigaben, etwa die Architekturentscheidung zur Erweiterung von Edge um einen Kafka-Listener und einen ausgehenden Callback, die verbindliche Festlegung des Kündigungsdatums und die Aufbewahrungsfristen. Zudem müssen vorab Contract Service (Konsumentenkennung, Datum, Anreicherung des Ereignisses), Revenue Management (Kontrollkästchen, Vertriebskanal-Prüfung, Outbox, Audit) und das oneSCM-Frontend angepasst werden. Der Zeitpunkt der Übermittlung hängt von der manuellen Rechnungserstellung durch den Mitarbeiter ab und kann daher relativ zur Kündigung nicht garantiert werden.