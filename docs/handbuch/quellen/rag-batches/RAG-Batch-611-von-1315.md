# Batch 611 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kundenverwaltung (Customer & Partner Management): Änderungen und Verbesserungen**

**Bearbeitung von Ansprechpartnerdaten im Kundenstatus „In Confirmation"**

Bei gewerblichen Kunden konnten die Daten des Ansprechpartners bislang im Status „In Confirmation" nicht geändert werden. Lediglich Marktorganisationen (MO) durften dort ausgewählte Finanzdaten, nämlich SAP-Debitor, Lastschrift und FI-Status, aktualisieren. Waren Ansprechpartner- oder Adressdaten falsch erfasst, ließen sich diese daher nicht korrigieren. Nun können MO, Händler und MPCs die Ansprechpartnerdaten in allen Kundenstatus bearbeiten. Für die Status „Temporary", „Active" und „Inactive" bleibt der bisherige Ablauf unverändert; eine Prozessänderung betrifft ausschließlich den Status „In Confirmation".

Um die Daten zu ändern, öffnen Sie den gewerblichen Kunden in der Kundenverwaltung, wählen „Kunde bearbeiten" und anschließend die Bearbeitung des Ansprechpartners. Dort können Sie die Angaben anpassen und speichern. Es gelten dieselben Datenvalidierungen wie bei der bisherigen Bearbeitung.

Nach dem Speichern wird die Änderung in der Kundenhistorie protokolliert und an den zugehörigen Vertrag weitergegeben. Alle Dokumente werden automatisch mit den aktualisierten Daten neu erzeugt und stehen im Reiter „Kommunikation" des Vertrags zur Verfügung. Die Neuerstellung der Dokumente wird zusätzlich in der Vertragshistorie vermerkt.

Der weitere Ablauf hängt von der Signaturmethode des Vertrags ab. Befindet sich ein verknüpfter Vertrag im Status „Waiting for Confirmation" und ist als Signaturmethode DSS gewählt, wird die bestehende Umschlag-ID automatisch storniert und eine neue DSS-Umschlag-ID erzeugt. Der Kunde erhält daraufhin eine neue E-Mail zur Unterschrift mit den aktuellen Daten. Nach erfolgreicher Signatur wird wie bisher ein Ereignis an das FI-System ausgelöst. Bei der Signaturmethode „Print" druckt der Händler die neu erzeugten Dokumente erneut aus und übergibt sie dem Kunden zur Unterschrift. Bei „OnPremise" wird das neu erzeugte Dokument geöffnet, der Kunde scannt den QR-Code mit seinem Gerät und unterschreibt.

**Ansprechpartner bei mehreren Firmenkunden**

Ein Ansprechpartner kann gleichzeitig für mehrere B2B-Unternehmen hinterlegt sein. Wenn Sie die Daten eines solchen Ansprechpartners bei einem bestimmten Unternehmen ändern, wirkt sich die Änderung nur auf dieses Unternehmen aus. Andere Unternehmen, bei denen dieselbe Person als Ansprechpartner geführt wird, bleiben unverändert.

**Weitere Verbesserungen**

Die Ergebnisse der Dublettenprüfung für gewerbliche Kunden wurden überarbeitet. Zudem wurden mehrere Fehler behoben: Der Marktname konnte zuvor nicht aktualisiert werden, beim Aktualisieren eines MME-Profils trat ein Fehler auf, bei der Vertragserstellung für gewerbliche Kunden erschien eine Fehlermeldung wegen verweigerter Authentifizierung, beim Anlegen eines neuen Kunden wurde die Anfrage nicht korrekt gelesen, und die Abfrage für den SEPA-Update-Batch lieferte keine Kundendaten.