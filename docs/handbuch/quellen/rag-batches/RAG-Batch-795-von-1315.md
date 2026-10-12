# Batch 795 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 38 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung (Contract Management) – Änderungen und Korrekturen**

**Dokumente und Kommunikation**

Im Vertragsdetail kann über den Reiter „Kommunikation“ und die Schaltfläche „Hochladen“ ein Dokument hochgeladen werden. Dabei wird im Dialog der Dokumententyp ausgewählt. Die Auswahl enthält die Einträge „Novation Document + SEPA Mandate“ und „Novation Document“ nicht mehr. Zur Verfügung stehen Service Contract + SEPA Mandate, Terms and Conditions, SEPA Document, Vehicle Registration Document, Company Registration, Tax Exempt Certificate und Other Documents. Außerdem wurde die Fehlerbehandlung beim Hochladen von Dokumenten verbessert. Behoben wurden zudem Probleme, durch die Dokumente in der Oberfläche nicht sichtbar waren, ein signiertes Dokument sich nicht herunterladen ließ und der E-Mail-Name im Reiter „Kommunikation“ falsch angezeigt wurde. Auch die Fehlermeldung „404“ in der Oberfläche der Vertragsverwaltung wurde korrigiert.

**Prolongation und Long Term Extension**

Der Prolongationsprozess wurde in mehreren Punkten überarbeitet. Die Prolongationsinformation bzw. die Vorschau wurde korrigiert. Im Prolongationsprozess wurde „Payment Method“ in „Payment Interval“ geändert. Der Versand des Angebots per E-Mail bei der Long-Term-Prolongation funktioniert wieder. Der Fehler „Authentification forbidden“ wurde behoben, ebenso der Fehler „Validation Failed for Argument“, der bei der Durchführung einer Prolongation auftrat. Eine Prolongation wird nun auch dann durchgeführt, wenn das zugehörige Produkt deaktiviert ist. Für aktive Verträge, deren zugehöriges Produkt gelöscht wurde, werden Aktionen wieder angezeigt. Optionale Coverages werden jetzt auf der Detailseite der Prolongation dargestellt. Der Prolongationsprozess lässt sich außerdem auf PrePROD testen.

Wird eine Long-Term-Prolongation signiert und angewendet, heißt das Dokument im Reiter „Kommunikation“ nun Long_Term_Prolongation_Vertragsnummer.pdf statt Long_Term_Extension_Vertragsnummer.pdf. Wenn für denselben Vertrag mehrere Prolongationen durchgeführt werden, überschreibt das zuletzt erstellte Dokument das vorherige nicht mehr. Alle Dokumente bleiben einsehbar und herunterladbar. Zur Unterscheidung wird das Signaturdatum im Dateinamen ergänzt, z. B. Long_Term_Extension_XUTIAX19_DE25PE_JJJJ_MM_TT.pdf. Beim Starten einer Long-Term-Extension werden die Coverages auf der rechten Seite standardmäßig eingeklappt dargestellt. Das gilt für Included Coverages und Optional Coverages. Die Nutzerin oder der Nutzer kann sie bei Bedarf aufklappen.

**Vertragsübertragung, Kündigung und Aktivierung**

Bei der Vertragsübertragung ist die VAT ID kein Pflichtfeld mehr. Das entspricht der Vertragserstellung, bei der ebenfalls nur eines der Felder verpflichtend ist. Unternehmen ohne VAT ID können damit für eine Vertragsübertragung verwendet werden.

Bei einer Kündigung enthält die i155-Datei nun korrekte Datumsangaben. Wird z. B. am 14. März ein Vertrag gekündigt, der am 12. März begonnen hat, zeigt das Feld Elimination Date (RC05, Pos. 107–114) den 12. März als Wirksamkeitsdatum der Kündigung. Das Feld Status Change Date (RC05, Pos. 140–147) zeigt den 14. März als Datum der Änderungsanforderung. Außerdem wird die i155-Datei nun auch für die Anzahl der Reifenschäden (Tire Claims) eines Vertrags erzeugt. Auf den Umgebungen DEV und INT lässt sich ausschließlich zu Testzwecken über eine Property die Prüfung auf bestehende Schadensfälle deaktivieren. Damit kann ein Vertrag innerhalb der Kulanzfrist auch dann gekündigt werden, wenn ein Schadensfall offen ist.

Nach der Aktivierung eines Vertrags wird die Bestellnummer nun angezeigt, und der Verlauf enthält den zuvor fehlenden Status. Die Suche nach Bestellnummern in Verträgen filtert wieder korrekt. Zudem wurde ein Authentifizierungsfehler („Authentication forbidden“) behoben, der beim Anlegen eines Vertrags im Kundenmanagement auftrat.

**Fahrzeug und Anzeige**

Im Reiter „Fahrzeug“ wurde die Anzeige „Last Known Mileage (Km)/Date“ entfernt. Die Überschrift „Mileage History“ heißt nun „Vehicle Mileage History“. Die Spalte „Date“ wurde in „Mileage Reading Date“ umbenannt, die Spalte „Mileage“ in „Mileage (Km)“. Die Fahrgestellnummer wird korrekt angezeigt. Das Datumsformat des Felds „Planned Contract End Date“ im Verlauf wurde korrigiert, ebenso die falsche Weiterleitung bei der Produktkompatibilitätsprüfung. Deutsche Sonderzeichen werden wieder richtig dargestellt. Die Reiternamen und das Design in Proposal Management und Contract Management wurden angeglichen.

**Schnittstellen**

Im Kafka-Producer „contractReviewProcess“ wird nun zusätzlich die gssnOutletId (dealerId) an Revenue gesendet.