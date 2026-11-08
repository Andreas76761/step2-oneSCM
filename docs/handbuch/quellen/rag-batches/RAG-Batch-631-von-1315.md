# Batch 631 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung**

**Selbstverwaltung von Kundendaten durch den Endkunden**

Endkunden können ihre Daten selbst ändern. Beantragt ein Kunde eine Änderung, erhält er einen Einmal-Link sowie einen SMS-Code, mit denen er seine Angaben aktualisieren kann. Gibt der Nutzer den SMS-Code in der App korrekt ein, kann er mit der Bearbeitung seiner Daten fortfahren.

**IBAN-Validierung über die SwiftRef-API**

Die Erfassung, Validierung und Vorbefüllung der IBAN über die SwiftRef-API wird in der Vertragserstellung, in der Kundenverwaltung und im Self Service angewendet. Der Nutzer kann dazu die Schaltfläche „Add Bank Account“ auswählen. Wird eine gültige IBAN eingegeben, werden Bankname, BIC und Währung automatisch befüllt und die IBAN wird hinzugefügt. Ist die IBAN ungültig, wird eine entsprechende Validierungsmeldung angezeigt. Existiert eine IBAN bereits in oneSCM, findet keine erneute Validierung statt. Die Schaltfläche zum Bestätigen ist erst aktiv, nachdem die SEPA-Einwilligung aktiviert wurde. Nach dem Hinzufügen einer IBAN hat diese zunächst den Status „TO BE CONFIRMED“.

**Mehrere Bankkonten auf Kundenebene**

Bei Kunden mit mehreren Bankkonten kann der Nutzer ein Konto löschen, indem er das aktuelle Konto durch ein neues Konto ersetzt.

**SEPA-Lastschriftmandat: Abgleich zwischen oneSCM und OneERP**

Verfügt ein Kunde über einen Lastschriftcode (SEPA), wird die IBAN zur Prüfung an OneERP gesendet. Dies geschieht bei Bestätigung eines Servicevertrags sowie bei jeder Änderung der IBAN bzw. der Zahlungsdaten, sei es über die Kundenverwaltung oder über die Kundenoberfläche. Wird eine IBAN gelöscht oder durch eine andere ersetzt, wird ein Update an OneERP übermittelt. Wurde die IBAN in OneERP nicht gefunden, wird eine Anfrage zur Anlage des Kunden in OneERP gesendet.

**Händlerverwaltung: Mapping-Tabelle**

Bei der Erfassung manueller Werkstattrechnungen im Kostenbereich geben Market-Operation-Nutzer unter anderem die Partnernummer (Vega ID) manuell ein. Das Feld für die SAP-Debitorennummer ist so lange ausgegraut, bis eine Antwort aus der Händlerverwaltungstabelle vorliegt. Anschließend fragt das Revenue-System in der Händlerverwaltungstabelle der Kundendomäne ab, ob zur Vega ID ein Eintrag existiert.

Ist die Vega ID in der Tabelle vorhanden, werden der Werkstattname und die SAP-Debitorennummer an das Revenue-System zurückgegeben.

Ist die Vega ID in der Tabelle nicht vorhanden, werden die Details aus GSSN+ für aktive Händlerbetriebe abgerufen. Dies geschieht nur, wenn vom Revenue-System eine SAP-Debitorennummer übermittelt wird. Anschließend wird ein neuer Eintrag in der Tabelle angelegt, der Werkstattname an das Revenue-System gesendet und die übermittelte SAP-Debitorennummer gespeichert. Die SAP-Debitorennummer wird dabei manuell durch Market Operation ergänzt. Existiert die Vega ID auch in GSSN+ nicht, wird ein Ereignis an das Revenue-System gesendet und es wird kein neuer Tabelleneintrag angelegt.