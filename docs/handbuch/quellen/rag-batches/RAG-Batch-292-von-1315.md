# Batch 292 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Revenue Management: Datenmodell für Erlöse

Hinweis: Dieses Vorhaben wurde abgebrochen (Status „Cancelled"). Die folgenden Angaben beschreiben den ursprünglich geplanten Zielzustand und sind nicht als verfügbare Funktion zu verstehen.

Für den Bereich Revenue Management war in oneSCM ein neues Datenmodell für Erlöse vorgesehen. Der Ausgangszustand war eine Neuentwicklung ohne bestehende Vorgängerlösung („Greenfield"). Ziel war es, ein übergeordnetes, konzeptionelles Datenmodell zu definieren. Es sollte alle Attribute festlegen, die benötigt werden, um in oneSCM Erlöse für Verträge zu erzeugen.

Vorgesehen war, dass Kundinnen und Kunden den Zahlungsplan bereits im Angebot einsehen können. Auf Angebotsebene sollte der Zahlungsplan jedoch nicht gespeichert werden, sondern nur als Entwurf zur Anzeige dienen. In der Datenbank sollten ausschließlich Zahlungspläne abgelegt werden, bei denen ein Vertragsobjekt aktiviert wird.

Jede Rechnungsanforderung (Invoice Request) sollte einen oder mehrere Zahlungsplanpositionen enthalten können, die sich aus den Rechnungsmonaten ableiten. Rechnungsanforderungen sollten über einen monatlichen Scheduler erzeugt werden; für Korrekturen war zusätzlich die manuelle Anlage über die Benutzeroberfläche vorgesehen.

Nachdem ein Erlös in oneSCM erzeugt wurde, sollte er im von NACOS definierten Datenformat (E125) an das Finanzsystem übermittelt werden, im MVP-Umfang an NACOS. Die Rückmeldung des Finanzsystems sollte am Erlös erfasst werden können, sodass dessen Status aktualisiert wird.

Weiterführende Details waren in der zugehörigen Confluence-Dokumentation zum Revenue Data Model hinterlegt. Akzeptanzkriterien, Testfälle und Risiken wurden in den vorliegenden Angaben nicht ausgefüllt.