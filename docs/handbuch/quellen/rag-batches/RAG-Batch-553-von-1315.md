# Batch 553 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Customer & Partner Management**

Die Schnittstelle, über die oneSCM neue Kunden an CoFiCo übermittelt, wurde um drei Felder erweitert. Sie werden beim Anlegen eines Kunden aus den im Kundenstamm gepflegten Daten befüllt und als Teil der bestehenden Anlageanfrage übertragen.

Das erste Feld ist der Sprachschlüssel (languageKey). Er enthält die bevorzugte Sprache des Kunden als zweistelligen ISO-Sprachcode, zum Beispiel EN, und beschreibt damit die Kommunikationssprache des Kunden. Ist beim Kunden eine Sprache gepflegt, wird der entsprechende Code bei der Anlage in CoFiCo übertragen. Je nach Markt sind unterschiedliche Sprachen vorgesehen, etwa Englisch und Tschechisch für MBCZ oder Französisch, Italienisch, Deutsch und Englisch für MBCH.

Das zweite Feld ist die Zahlungsbedingung (termsPayment). Sie wird aus der Zahlungskonfiguration des Kunden in oneSCM entnommen und als CoFiCo-Zahlungsbedingungsschlüssel übermittelt, beispielsweise FB30. Die Zuordnung hängt von Markt und Zahlungsart ab: Für MBCZ, MBCH und MBSK ist etwa bei Kreditkarte mit Vorauszahlung der Schlüssel FB01 vorgesehen, bei Kreditkarte mit Nachzahlung, Lastschrift und Überweisung dagegen FB30. Ist beim Kunden eine Zahlungsbedingung zugeordnet, wird der Schlüssel bei der Anlage in CoFiCo übertragen.

Das dritte Feld ist das Kundenattribut 4 (customerAttribute4). Es kennzeichnet die Art eines staatlichen bzw. behördlichen Kunden und basiert auf der in oneSCM gepflegten Kundenklassifizierung. Private staatliche Kunden werden mit dem Wert G1 übertragen, gewerbliche staatliche Kunden mit dem Wert G3. Das Feld ist nur relevant, wenn eine solche Klassifizierung gepflegt ist.

Die bestehenden Abläufe zur Kundenanlage bleiben unverändert. Durch die Erweiterung sollen keine Einschränkungen oder Fehlfunktionen entstehen.

Für Kunden mit Sitz in Deutschland wurde außerdem eine zusätzliche Prüfregel der USt-IdNr. vorgesehen (derzeit in Klärung und noch nicht umgesetzt). Der bekannte Platzhalterwert „DE123456789“ ist keine gültige Steuernummer und kann bislang gespeichert werden, da außer der Prüfung über VIES keine gesonderte Validierung stattfindet. In Einzelfällen wurde dieser Wert dadurch sogar an oneERP übertragen. Künftig soll das Speichern eines deutschen Kundendatensatzes mit dieser USt-IdNr. blockiert werden. Stattdessen erscheint eine Fehlermeldung, die darauf hinweist, dass „DE123456789“ ein Platzhalterwert ist und nicht für produktive Kundendaten verwendet werden darf, und die zur Eingabe einer gültigen Umsatzsteuer-Identifikationsnummer auffordert. Der Datensatz wird erst gespeichert, wenn eine gültige USt-IdNr. hinterlegt ist. Dies gilt auch für bestehende Kundendatensätze, die den Platzhalter enthalten: Beim Bearbeiten und Speichern muss die USt-IdNr. zuvor korrigiert werden. Andere USt-IdNrn., die die bestehenden Prüfungen bestehen, lassen sich weiterhin wie gewohnt speichern.

Zusätzlich wurde ein Fehler behoben, durch den sich Lieferanten für die Schweiz nicht anlegen ließen.