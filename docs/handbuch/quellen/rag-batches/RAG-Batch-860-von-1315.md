# Batch 860 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kundendaten im Vertragsmanagement**

Im Bereich Vertragsmanagement können Benutzer mit entsprechenden Berechtigungen (Power User) die Details eines bestimmten Kunden einsehen. Voraussetzung ist, dass der Vertrag zuvor angelegt wurde, denn nur dann kann er ausgewählt werden und seine Daten werden angezeigt. Nach der Anmeldung mit den passenden Rechten öffnen Sie den gewünschten Vertrag und rufen den Bereich „Customer“ auf. Die Informationen stammen aus oneSCM und stehen nach der Erstellung eines Vertrags zur Verfügung.

Im Bereich „Customer“ werden folgende Angaben angezeigt: Kundentyp, Kundennummer, Kundenname, Umsatzsteuer-Klassifizierung (VAT Classification), Straße, Adresszusatz, Hausnummer, Postleitzahl, Ort, Land, Mobilnummer, Telefonnummer, E-Mail-Adresse und Finanzsystem-ID. Das Vertragsmanagement soll Benutzern eine umfassende und benutzerfreundliche Oberfläche bieten, um Vertragsinformationen übersichtlich einzusehen. Darüber hinaus sollen bei Bedarf Aktionen für einen bestimmten Vertrag möglich sein, zum Beispiel das Aussetzen, Beenden, Stornieren oder Reaktivieren. Die Gestaltung richtet sich nach der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Suche nach Verträgen (nicht umgesetzt)**

Die ursprünglich geplanten Suchfunktionen im Vertragsmanagement wurden nicht realisiert, die Tickets dazu wurden abgebrochen. Vorgesehen war, dass Power User Verträge über die Fahrgestellnummer, die Kundennummer oder die Vertragsnummer suchen, um den Vertrag anzuzeigen, auszuwählen, zu bearbeiten und weitere Schritte wie eine Statusänderung durchzuführen.

Für die Fahrgestellnummer war ein Textfeld mit alphanumerischen Zeichen und höchstens 17 Stellen geplant. Für die Kundensuche war ein Textfeld mit Zeichenketten von maximal 100 Zeichen vorgesehen, wobei die Sprache marktspezifisch ist und im MVP Deutschland (DE) gilt. Für die Vertragsnummer sollten maximal 15 alphanumerische Zeichen erlaubt sein, zum Beispiel DEPE035F/000001. Der zugrunde liegende Aufbau der Vertragsnummer war als Vorschlag in Confluence hinterlegt und noch nicht freigegeben. Die Stellen 1 und 2 bilden den Marktcode nach ISO 3166 ALPHA-2 (zum Beispiel DE). Stelle 3 steht für die Marke bzw. Division (P für Passenger Cars, V für Vans, S für Smart). Stelle 4 bezeichnet den Produkttyp (A für Advance, C für Compact, E für Excellent). Die Stellen 5 bis 8 enthalten eine alphanumerische laufende Nummer. Stelle 9 ist der Trenner „/“, und die Stellen 10 bis 15 enthalten die numerische Vertragsversion.

Für alle drei Suchvarianten waren dieselben Ergebnisse vorgesehen: Bei einem exakten Treffer wird das Ergebnis mit der Vertragsnummer zurückgegeben. Existiert der gesuchte Wert nicht, bleibt die Ergebnisliste leer. Wird das vorgegebene Format nicht eingehalten, erscheint eine Fehlermeldung.