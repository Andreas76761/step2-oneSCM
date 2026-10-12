# Batch 851 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management: Änderungen und Verbesserungen**

**Erweiterung der i155-Nachricht an Vega**

Sobald ein Vertrag aktiviert wird oder nach der Aktivierung Änderungen an einem Vertrag vorgenommen werden, erzeugt das System eine i155-Nachricht. Diese wird anschließend an Vega übermittelt und enthält Informationen zum Vertrag sowie gegebenenfalls zu den vorgenommenen Änderungen. Bisher umfasste die i155 ausschließlich die in der Vega-Dokumentation definierten Pflichtfelder der Satzarten RC 01, RC 05 und RC 20.

Künftig enthält die i155 zusätzlich die optionalen Felder der Satzart RC80 sowie die externen Vertragsinformationen der Satzart RC10, sofern für die Positionen 71 bis 4000 Inhalte vorliegen. Bei den Pflichtfeldern gilt: Der Kraftstofftyp (Positionen 151 bis 152) wird aus den Fahrzeugdaten übernommen, die bei der Vertragskalkulation aus VeDOC abgerufen werden. Die Coverage-ID (Positionen 66 bis 97, rechtsbündig) wird für jede Deckung vergeben, die in der Produktdefinition zugewiesen wurde. Die IDs werden zusammen mit den Produkten übermittelt und im Vertrag gespeichert.

Die Satzart RC80 enthält folgende Angaben: den Vega-Ländercode, den OneSCM-Ländercode, die Servicevertragsnummer, den Satztyp 80, einen Zeitstempel mit Datum und Uhrzeit der Erzeugung der i155, den Vega-Sprachcode, eine Sequenznummer, ein Anzeige-Kennzeichen (Display Flag, immer mit dem Wert 1 belegt), die Kundennummer (rechtsbündig) sowie den Kundennamen (linksbündig, bestehend aus Vorname und Nachname des Vertragsinhabers, getrennt durch ein Leerzeichen). Die restlichen Positionen von 178 bis 4000 werden mit Leerzeichen aufgefüllt.

Die RC10-Informationen zu Vertrag, Fahrzeug und Kunde sowie die internen und externen Kunden- und Fahrzeuginformationen werden nur befüllt, wenn ein entsprechender Text vorhanden ist. Im aktuellen Programminkrement ist hierfür jedoch kein Inhalt vorgesehen. Die Satzarten RC15 (Stundensatz), RC16 (Arbeitsaufwandsschätzung), RC17 (Kundenrabattgruppe) und RC18 (Ölpreis) werden für Sonderfälle verwendet und sind nicht erforderlich.

**Korrekturen in der Vertragsanzeige und Vertragserstellung**

Auf der Seite Contract Management wurden mehrere Darstellungsfehler behoben. Das im ersten Schritt des Vertragserstellungs-Assistenten auf der Seite Produktauswahl eingegebene Kennzeichen wird nun im Bereich Fahrzeug angezeigt. Ebenso wird die im zweiten Schritt auf der Seite Kunden- und Zahlungsinformationen eingegebene Festnetznummer im Bereich Kunde dargestellt. Außerdem wurden die Feldbezeichnungen angepasst: Sie lauten nun wie in der Vertragserstellung „Phone Number“ (zuvor „Mobile“) und „Landline Phone Number“ (zuvor „Phone“).

Zudem wurde ein Fehler behoben, durch den neu angelegte Verträge in der Entwicklungsumgebung im Status „Waiting for Activation“ verblieben. Auch der Verifizierungsstatus wird in der Vertragsantwort nun korrekt gesetzt.

**Technische Anpassungen**

Die Schnittstellen, die die Vertragsnummer als Pfadparameter verwenden, wurden angepasst und arbeiten nun auf andere Weise mit diesem Parameter. Darüber hinaus wurden fehlgeschlagene End-to-End-Tests behoben, und die Anlage von Kunden in diesen Tests wurde angepasst.

**Noch in Bearbeitung**

Ein Test für die Reiter Dokumente und Benachrichtigungen befindet sich in Arbeit. Er prüft, ob nach der Aktivierung eines Vertrags mindestens zwei Dokumente (Servicevertrag sowie Allgemeine Geschäftsbedingungen) im Reiter Dokumente angezeigt werden und ob die Aktivierungs- und Bestätigungs-E-Mail im Reiter Benachrichtigungen heruntergeladen werden kann.