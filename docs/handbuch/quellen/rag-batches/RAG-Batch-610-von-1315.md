# Batch 610 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungsdaten bestehender Verträge ändern**

Mitarbeiter des Managements (MO) können die Zahlungsdaten eines Kunden jetzt ändern und dabei mit dem Finanzsystem (FI) abgleichen. Das ist nötig, wenn ein Kunde seine IBAN ändern möchte. Die Änderung ist für Verträge im Status „Waiting for Activation“ und „Active“ möglich. Bei aktiven Verträgen sind SAP und SEPA vorhanden. Bei Verträgen, die auf die Aktivierung warten, können SAP und SEPA vorhanden sein, müssen es aber nicht. Typische Anlässe sind der Wunsch eines Kunden, die Zahlungsdaten nach der Aktivierung zu ändern, oder ein Fehler bei der Vertragserstellung, bei dem falsche Zahlungsdaten angegeben wurden.

Um die Daten zu ändern, öffnet der MO im Customer Management den Bereich der Zahlungsdaten und klickt auf die Schaltfläche zum Ändern. Es öffnet sich ein Dialogfenster, in dem die neue IBAN eingegeben wird. Das System validiert die IBAN über den Swift-Service und füllt die übrigen erforderlichen Angaben, soweit möglich, automatisch aus. Die Bank-ID für das FI-System wird aus der oneERP-Datei aus dem Feld „BankIdentification“ übernommen. Ist Swift nicht erreichbar, gibt der MO die Angaben manuell ein. Mit der Bestätigung des Dialogs ersetzt das System die alte IBAN durch die neue und löscht die alte IBAN aus oneSCM. Die Änderung kann mit oder ohne Direct-Debit-Code abgeschlossen werden.

Prüft das System, dass noch kein Direct-Debit-Code vorhanden ist, erscheint ein Hinweis, dass die SEPA-Dokumente zur Unterschrift versendet wurden. Das System sendet die Dokumente dann über den DSS-Signaturprozess an den Kunden. Die Frist für die Unterschrift beträgt 30 Tage. Der Kunde erhält eine E-Mail mit der Bitte, die Dokumente digital zu unterschreiben. Darin steht, dass der Umschlag nach 30 Tagen abläuft. Solange der Kunde nicht unterschrieben hat, erinnert ihn das System regelmäßig. Der Abstand entspricht einem Drittel der Frist, bei 30 Tagen also alle 10 Tage.

Unterschreibt der Kunde innerhalb der Frist, erzeugt das System in oneERP per SEPA-Anfrage einen Direct-Debit-Code. Dieser wird gespeichert und an den Vertrag übermittelt. Der Vertrag gibt ihn an die Abrechnung weiter. Das neue SEPA-PDF wird dem Vertrag und der Kundenhistorie bereitgestellt. Mit dem Direct-Debit-Code kann der Kunde abgerechnet werden. Unterschreibt der Kunde innerhalb von 30 Tagen nicht, wird der Umschlag storniert und der Kunde erhält eine E-Mail über die Stornierung. Der Vertrag wird dann automatisch ausgesetzt.

**Fehlermeldung bei Nichterreichbarkeit von GSSN**

Wird in der Händlerverwaltung ein Händler bearbeitet oder hochgeladen und der externe Dienst GSSN antwortet nicht, erscheint nun die Meldung „GSSN service unavailable“. Zuvor wurde irreführend „Authentication forbidden!“ angezeigt. Die Meldung zeigt dem Benutzer jetzt klar, dass das externe System nicht antwortet.

**Weitere Korrekturen**

Die Validierung von Vor- und Nachnamen ist zwischen Frontend und Backend nun einheitlich. Außerdem ändern Aufrufe von GSSN die Namen für Märkte nicht mehr.