# Batch 754 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 32 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management: Änderungen und Verbesserungen**

In der Vertragsverwaltung wurden zahlreiche Fehler behoben und Abläufe verbessert, insbesondere bei Vertragsverlängerungen, vorzeitigen Vertragsbeendigungen und der Preisdarstellung.

**Vertragsverlängerung**

Bei der Verlängerung von Verträgen wurden mehrere Darstellungs- und Funktionsprobleme beseitigt. Bei der Langzeitverlängerung wird in der E-Mail nun der korrekte Verlängerungszeitraum angezeigt, und der Vergleichsaufruf der Langzeitverlängerung funktioniert wieder. Bei der Kurzzeitverlängerung erscheint die Zahlungsdauer in der Übersicht nicht mehr doppelt. Optionale Zusatzleistungen, die im Verlängerungsprozess hinzugefügt werden, werden nun auf dem Zahlungs-Tab sowie in den enthaltenen Leistungen auf der Produktkarte angezeigt (M&M). Zudem ist es wieder möglich, im Verlängerungsprozess ausschließlich optionale Zusatzleistungen hinzuzufügen, ohne Laufleistung oder Laufzeit zu ändern.

**Vorzeitige Vertragsbeendigung**

Bei der vorzeitigen Beendigung wurde die Validierung der Laufleistung für Beendigungen mit einem Datum in der Vergangenheit überarbeitet, sowohl im Backend als auch im Frontend. Außerdem wurde ein Fehler behoben, durch den ein vorzeitig beendeter Vertrag einen leeren Zahlungsplan und eine endlos laufende Ladeanimation unter der Zahlungsdauer aufwies. Eine weitere Verbesserung ist geplant: Im Dialog zur vorzeitigen Beendigung soll die Laufleistung künftig bereits eingegeben werden können, bevor die Pflichtfelder auf der rechten Seite des Dialogs ausgefüllt sind. Bislang ist die Eingabe erst danach möglich.

**Vertragsstatus, Stornierung und Kampagnen**

Ein Vertrag, der vom Kunden unterschrieben wurde und dessen CAS-Prüfung erst nach einer automatischen Ablehnung und anschließender Wiederaufnahme positiv zurückgemeldet wird, wird nun automatisch auf „Bestätigt“ gesetzt, sobald die Vertragsdokumente (gegebenenfalls einschließlich SEPA) unterschrieben sind und die CAS-Prüfung erfolgreich ist. Ein Fehler, der die Stornierung eines Vertrags verhinderte, wurde behoben.

Wird ein Vertrag mit zugewiesener Kampagne innerhalb der Widerrufsfrist storniert, soll künftig ein Ereignis zur Rückbuchung des Kampagnenbetrags an das Produktmanagement gesendet werden. Dort wird der Betrag von den Gesamtausgaben abgezogen, sodass das Kampagnenbudget wieder dem Stand vor der Aktivierung entspricht. Bei Verträgen ohne Kampagne wird kein solches Ereignis gesendet.

**Preise, Rechnungen und Laufleistung**

In der Preisinformationsübersicht werden nun Nettowerte statt Bruttopreise angezeigt. Auch die Preisaufschlüsselung auf der Vertragsdetailseite zeigt wieder die korrekten Preise. Ein Fehler bei in der Vergangenheit erstellten Rechnungen wurde behoben. Manuelle Werkstattrechnungen erscheinen jetzt in der Laufleistungshistorie des Fahrzeugs, und eine falsche Laufleistung zum Verkaufsdatum bei einem aktiven Vertrag wurde korrigiert. Die Servicehistorie liefert für Fahrzeuge im Status „Build to Stock“ keinen Fehler mehr.

**Dokumente, E-Mails und Anzeige**

Der Produktname wird im Dokument für LTE nun aktualisiert. Beim Versand einer E-Mail mit LTE-Details tritt kein Fehler mehr auf. Ein Fahrzeugschein wurde zuvor fälschlich unter dem Servicevertrag angezeigt, was korrigiert wurde. Die Zahlungsreferenz wird in der Benutzeroberfläche wieder angezeigt. Ein Fehler bei der Darstellung von Felgen in der Vertragsverwaltung wurde behoben und befindet sich in der Abnahme (BAT bestätigt).

**Benutzerrechte und Schnittstellen**

Händlerbenutzer, denen mehrere Händlerstandorte zugeordnet sind, sehen nun alle Verträge dieser Standorte. Außerdem wurden Probleme bei den Schnittstellen behoben: Zum einen wurde ein Fehler beim Export aller Verträge an Vega beseitigt. Zum anderen wird bei NEMESIS kein Fehlerereignis mehr erzeugt, wenn das Vertragsereignis erfolgreich übermittelt wurde. Zwei Verträge, die zuvor reaktiviert werden mussten, wurden ebenfalls bearbeitet.

**Geplante Verbesserungen**

Ist das Namensformat auf „Nachname, Vorname“ eingestellt (unter Market Settings > Market Config > General Settings > Format), soll es künftig nur für Privatkunden und private staatliche Kunden gelten, nicht aber für gewerbliche Kunden, da diese einen Firmennamen und einen zusätzlichen Firmennamen haben.

Die Vertragshistorie soll überarbeitet werden (Inhalt noch in Arbeit). Vorgesehen ist, die Abschnitte antichronologisch zu sortieren, wobei bei Abschnitten mit Start- und Enddatum das Startdatum maßgeblich ist. Bei Zeiträumen soll in der Klammer zuerst das Startdatum und dann das Enddatum stehen. Unter „Geändert von“ soll nur noch ein Benutzer erscheinen, wenn dieser aktiv eine Handlung durchgeführt hat.