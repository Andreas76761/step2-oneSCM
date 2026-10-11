# Batch 667 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung (Customer & Partner Management)**

Der Zugriff auf die Kunden- und Partnerverwaltung ist rollenbasiert geregelt. Benutzer mit den Rollen Admin, MPC Product Manager, Dealer oder Market Operation können den Bereich nutzen, um die Aufgaben ihres jeweiligen Tätigkeitsfelds auszuführen. Dafür sind folgende Berechtigungen vorgesehen: Der Admin erhält OneSCM_partmgmt_partner_manage, der MPC Product Manager OneSCM_custpartmgmt_custpart_manage, der Dealer OneSCM_custmgmt_cust_maintain und die Market Operation OneSCM_custpartmgmt_custpart_manage. Eine Übersicht der Berechtigungen der einzelnen Benutzer finden Sie auf der Confluence-Seite „Roles and entitlements".

**Kundenverwaltung**

In der Kundenverwaltung steht eine Suche mit Filterfunktionen zur Verfügung. Sie können eine erweiterte Suche mit mehreren Suchbegriffen durchführen und dabei zusätzliche Filteroptionen verwenden. Die aktuelle Suche lässt sich zurücksetzen. Wird ein Suchfeld fehlerhaft befüllt, zeigt das System für jedes Feld die passende Validierungsmeldung an, und die Schaltfläche „Suchen" kann erst wieder angeklickt werden, wenn die Eingaben korrekt sind. Beim Bearbeiten eines Kunden werden geänderte Benutzerinformationen korrekt aktualisiert.

Die Direct-Debit-Nummer (Debitorennummer) wird in der Ergebnistabelle der Suche nun für alle Datensätze angezeigt, bei denen sie im Bereich der Zahlungsinformationen hinterlegt wurde. Zuvor wurde sie trotz Speicherung nicht angezeigt, und auch die Filterung danach lieferte kein Ergebnis, da die Schnittstelle keinen Wert zurückgab. Die Suche und der Filter nach der Direct-Debit-Nummer liefern nun den richtigen Eintrag, und die Schnittstelle gibt die hinterlegte Debitorennummer korrekt zurück.

Die private Umsatzsteuer-Identifikationsnummer (VAT-ID, Financial Identification Number) ist ein optionales Feld. Es wird für den deutschen Markt nicht verwendet und soll in der Benutzeroberfläche nicht mehr sichtbar sein.

In der Kundenvorschau wurde die Meldung korrigiert, die für Kunden ohne aktive Verträge angezeigt wird. Außerdem war die Vorschau zuvor verkleinert und schwer lesbar, wenn Sie sie nach einer Suche aus der Ergebnisliste heraus geöffnet haben. Die Vorschau soll dieselben Abmessungen haben wie auf der vollständigen Ergebnisseite.

**Partnerverwaltung**

In der Partnerverwaltung können Sie den Vorgang zur Anlage eines Partners abbrechen.

**Anbindung der Business-Partner-Schnittstelle**

Für den Test der Business-Partner-API wurde eine Firewall-Freischaltung eingerichtet. Sie steht im Zusammenhang mit der Schnittstelle zwischen NACOS und oneERP zur Synchronisation von Kundendaten. Der ursprünglich angegebene Link zur Test-API war nicht mehr aktuell; als aktualisierte Referenz wurde die Übersichtsseite der Business-Partner-API (OP_API_BUSINESS_PARTNER_SRV) auf api.sap.com genannt.