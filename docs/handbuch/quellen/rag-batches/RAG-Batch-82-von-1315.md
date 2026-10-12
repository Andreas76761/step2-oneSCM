# Batch 82 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Abschlussrechnung bzw. Abschlussgutschrift im Revenue-Modul: Das Dokument MDCR

Im Revenue-Modul steht künftig ein einheitlicher, manuell erstellbarer Finanzdokumenttyp zur Verfügung, mit dem sich die finanzielle Schlussabrechnung eines Vertrags erfassen lässt: das MDCR (Manual Financial Document Contract Review). Es kann sowohl für Leasingverträge als auch für Nicht-Leasingverträge verwendet werden, und zwar zum Vertragsende oder bei vorzeitiger Beendigung. Typische Anwendungsfälle sind eine Kilometerüberschreitung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe im Leasing oder eine Vertragsstrafe bei vorzeitiger Kündigung. Das Dokument bildet die Differenz zwischen dem tatsächlich Verbrauchten bzw. Geschuldeten und dem Vertraglich Vereinbarten ab. Bisher mussten dafür uneinheitlich benannte, manuell erstellte Dokumente genutzt werden, was teamübergreifend zu Unklarheiten führte.

Wichtig: Die Berechnung des Betrags findet außerhalb von oneSCM statt, da jede Vertragsart und jeder Markt eigene Regeln hat, etwa Preis pro Kilometer, Strafprozentsätze, Kilometerlimits oder Datenbankberechnungen im Leasing. oneSCM dient ausschließlich dazu, den bereits berechneten Betrag zu erfassen und zu exportieren.

Das MDCR wird von Benutzern der Rollen MO und MPC im Bereich der Finanzdokumente eines Vertrags angelegt, sobald sie den Abschlussbetrag extern ermittelt haben. Es gibt keine neue Benutzerrolle; es gelten die bestehenden Berechtigungen für die manuelle Dokumenterstellung.

Beim Anlegen wählen Sie, ob das MDCR als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) erstellt wird. Für Gutschriften besteht keine Einschränkung. Anschließend tragen Sie den extern berechneten Nettobetrag sowie einen Positionstext ein, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder für den Rechnungszeitraum („Dokument von“ und „Dokument bis“) sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt.

Das MDCR durchläuft den üblichen Dokumentenlebenszyklus (Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt usw.) und wird über den Standard-Exportjob E169/CoFiCo exportiert. Der Positionstext wird dabei in die exportierte Position der Exportdatei übernommen.

Für MBLD-Verträge gilt eine Besonderheit: MDCR-Dokumente werden zusätzlich anhand der Kriterien Vertriebskanal „Leasing“ und Dokumenttyp „MDCR“ ausgewählt und per API an MBLD übermittelt. MDCR-Dokumente von Nicht-Leasingverträgen werden nicht an MBLD gesendet. Durch diese klaren Routing-Regeln ist sichergestellt, dass Endsaldo-Daten aus dem Leasing verlässlich bei MBLD ankommen.

Die Funktion ist das Revenue-Gegenstück zu einer entsprechenden Funktionalität, welche die Dokumenttyp-Definition sowie die Feld-, Lebenszyklus-, Export- und Routing-Regeln bereitstellt, auf die der manuelle Erstellungsprozess aufbaut. Die manuelle Dokumenterstellung für Standard-Kundenrechnungen und -gutschriften im Bereich der Finanzdokumente eines Vertrags bleibt unverändert bestehen.

Hinweis zur Redaktion: In den Rohdaten wird der Dokumenttyp teils als FDCR (Final Document Contract Review), überwiegend aber als MDCR bezeichnet. Der Text verwendet durchgängig MDCR; bitte die korrekte Bezeichnung vor Veröffentlichung abstimmen. Die Überschrift des Tickets („Hard gate fail - missing required fields“) sowie die Abschnitte zu Akzeptanzkriterien, Testfällen und Risiken enthalten keine Angaben und konnten daher nicht berücksichtigt werden.