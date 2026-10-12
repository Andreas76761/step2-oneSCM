# Batch 783 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Langzeitverlängerung (Long Term Prolongation) – neu gestaltete Oberfläche**

Die Langzeitverlängerung wird in der Vertragsverwaltung nun als assistentengestützter Ablauf (Wizard) angeboten, der Anwenderinnen und Anwender Schritt für Schritt durch alle relevanten Konfigurationsmöglichkeiten führt. Zuvor erfolgte die Verlängerung über die Option „Verlängern“ mit anschließender Auswahl zwischen Lang- und Kurzzeitverlängerung. Änderungen, die sich auf den Vertrag auswirken, sind während des gesamten Vorgangs sichtbar. Die Funktion steht für Basisprodukte (ohne Contingent), für Reifenprodukte (Limited und Unlimited) sowie für komplexe Produkte mit Reifenoption (Limited und Unlimited) zur Verfügung.

Um die Verlängerung zu starten, wählt der MO/MPC einen aktiven Vertrag aus und öffnet im Aktionsmenü den Eintrag „Long Term Prolongation“. Das System öffnet den Wizard und ruft im Hintergrund über den Contract-Microservice beim Product-Microservice die verfügbaren Konfigurationen und die zugehörigen Preise ab.

**Schritt 1: Verlängerungsdetails**

Hier stehen ein Startdatum (Auswahl der nächstmöglichen Wirksamkeitstage), die Gesamtlaufzeit inklusive Verlängerung und die Jahreslaufleistung zur Auswahl. Die Optionen für Laufzeit und Laufleistung stammen aus dem Product-Microservice. Die Gesamtlaufleistung in km wird automatisch berechnet und ist schreibgeschützt. Das Zahlungsintervall entspricht dem des ursprünglichen Servicevertrags. Zusätzlich gibt es ein Kommentarfeld für freie Eingaben. Wurde der Servicevertrag für ein Leasing abgeschlossen, ist bei Service- und Reifenprodukten die Jahreslaufleistung schreibgeschützt und die Gesamtlaufleistung konfigurierbar. Die Felder müssen der Reihe nach von oben nach unten ausgefüllt werden. Sind sie vollständig, wird die Produktkarte aktualisiert.

Bei Reifenprodukten werden zusätzlich Werte aus dem Vertrag schreibgeschützt angezeigt. Bei Unlimited-Produkten sind das Wetterprofil, Stahlfelge, Radgröße und Reifenlieferant, bei Limited-Produkten Wetterprofil, Reifenanzahl, Reifentyp und Reifengröße. Diese Attribute erscheinen auch auf der Produktkarte. Bei komplexen Produkten enthält die Produktkarte die Reifenattribute zusätzlich zu den Details des Basisprodukts.

Die Produktkarte eines Serviceprodukts zeigt Produktname (gegebenenfalls mit ISP-Symbol), Preis pro Intervall und Gesamtpreis, die Gesamtlaufleistung sowie die enthaltenen und optionalen Deckungen (jeweils Familie und Einträge).

**Schritt 2: Deckungen**

Links werden die enthaltenen Deckungen angezeigt, vorausgewählt und schreibgeschützt. Rechts stehen die optionalen Deckungen, die vorausgewählt und schreibgeschützt sind, sofern sie zuvor gewählt wurden. Falls verfügbar, können weitere optionale Deckungen ausgewählt werden. Dadurch aktualisiert sich der Produktpreis, und die Deckungen erscheinen unter den optionalen Deckungen.

**Schritt 3 (nur bei komplexen Produkten): Reifenoption**

Dieser Schritt erscheint nur, wenn das gewählte Produkt ein komplexes Produkt mit Reifenoption ist oder Reifenoption und Deckungen unterstützt. Andernfalls geht der Wizard direkt zur Übersicht und Bestätigung über.

Ist die Reifenoption bereits Teil des Vertrags, wird sie vorausgewählt samt Konfigurator schreibgeschützt angezeigt. Bei Unlimited sind das Wetterprofil, Stahlfelge und Radgröße, bei Limited Wetterprofil, Reifenanzahl, Reifentyp und Reifengröße. Optionale Deckungen können weiterhin ausgewählt werden, und die Produktkarte wird entsprechend aktualisiert.

Wurde die Reifenoption nicht hinzugefügt, werden links die verfügbaren Reifenoptionen mit Konfigurator angezeigt. Es ist eine Einzelauswahl möglich, man kann sich aber auch bewusst gegen eine Reifenoption entscheiden. Die Auswahl aktualisiert Preis und Produktkarte. Rechts werden Deckungen und technische Optionen passend dazu angezeigt.

**Letzter Schritt: Übersicht und Bestätigung**

Dies ist Schritt 3 bei eigenständigen Produkten und Schritt 4 bei komplexen Produkten. Angezeigt werden Referenznummer, Produktname und Beschreibung, Intervallpreis und Gesamtpreis nach der Verlängerung sowie die Verlängerungsdetails (Typ, Startdatum, Gesamtlaufzeit, Jahreslaufleistung, Zahlungsintervall). Eine Vergleichstabelle stellt den aktuellen Stand dem Stand nach der Verlängerung gegenüber: Start- und Enddatum, Laufzeit, Jahres- und Gesamtlaufleistung, Deckungen, Zahlungsart und Beträge. Bei Reifenprodukten werden Preise und Beträge vor und nach der Verlängerung jeweils netto und brutto für Gesamt- und Intervallpreis ausgewiesen.

Bei eigenständigen Reifenprodukten erscheinen die Deckungen im reifenspezifischen Bereich, und die Deckungszeilen im ersten Tabellenteil zeigen „-“. Der reifenspezifische Bereich enthält externen Reifenlieferanten, Wetterprofil, Stahlfelge, Radgröße, Reifengröße/-typ (falls verfügbar), Anzahl der enthaltenen Reifen, technische Optionen, Deckungen sowie die Preise vor und nach der Verlängerung. Bei komplexen Produkten zeigt die Tabelle die enthaltenen und optionalen Deckungen des Basisprodukts, der reifenspezifische Bereich die Deckungen der Reifenoption.

**Bedienung des Wizards**

Mit „X“ wird der Wizard geschlossen und die Konfiguration für eine spätere Fortsetzung gespeichert. Mit „<“ gelangt man zum vorherigen Schritt. Ein Klick auf eine Schrittnummer ermöglicht die Navigation, aber nur zu bereits abgeschlossenen Schritten. Ein Schritt gilt erst als abgeschlossen, wenn alle Pflichtfelder gefüllt sind.

Im letzten Schritt steht die Option „E-Mail senden“ zur Verfügung, die Signatur per E-Mail auslöst. Es öffnet sich ein Dialog, in dem Vorname, Nachname, E-Mail-Adresse und die Sprache der Vorlage angegeben werden müssen. Erst wenn diese Pflichtfelder ausgefüllt sind, wird die Schaltfläche „Senden“ aktiv. Sie sendet das Dokument in der gewählten Sprache an die angegebene Adresse. „Schließen“ und „X“ schließen den Dialog.

**Ablauf nach dem Absenden**

Nach dem Versand zur Signatur zeigt die Vertragsdetailansicht ein Banner „In Progress“. Das Dokument wird gemäß dem neuen Vergleich vorbereitet. Sobald das Dokument signiert ist und die Signatur durch DSS validiert wurde, werden die Verlängerungsdetails auf den Servicevertrag angewendet und die Vertragsdaten aktualisiert. Zudem wird ein i155-Dokument erzeugt, das an Vega gesendet wird, und der Revenue-Microservice sowie der Nemesis-Microservice werden benachrichtigt.

Gestaltung und Grafiken entsprechen dem Mercedes-Benz Workbench.