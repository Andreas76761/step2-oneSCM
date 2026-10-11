# Batch 977 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Servicevertrag für Reifenprodukte**

Im Bereich Contract Generation können Händler, Mercedes-Benz Niederlassungen (MO) und MPC nun auch Serviceverträge für Reifenprodukte anbieten und erzeugen. Kundinnen und Kunden erhalten damit einen sorgenfreien Reifenservice. Voraussetzung ist, dass das Reifenprodukt angelegt und konfiguriert ist. Reifenprodukte stehen für alle Kundentypen (B2C und B2B) sowie für jede zugewiesene Branche zur Verfügung. Technische Optionen können nicht hinzugefügt werden. Optionale Deckungen, Händlerrabatte und Kampagnen werden unterstützt, ebenso die Händlerprovision.

**Angebot und Konfiguration**

Das Vertragsangebot wird mit einer der gewünschten Kennungen gestartet. Anschließend wird die Vertragskalkulation aufgerufen, die alle passenden Produkte liefert, darunter auch das Reifenprodukt. Nach der Auswahl werden die zugehörigen Felder konfiguriert: Vertragslaufzeit, Jahresfahrleistung, Zahlungsintervall und Anzahl der Reifensätze. Bei der Anzahl wird die Empfehlung aus der Matrix für Laufzeit und Fahrleistung vorbelegt, die die Vertragskalkulation in ihrer Antwort liefert. Die Anzahl ist stets ein Vielfaches von 2. Dazu erscheint der Hinweis „We recommend x tires“, wobei x die empfohlene Reifenanzahl ist. Bei gewerblichen Kunden kommt die Branche hinzu. Optionale Deckungen können hinzugefügt werden, sofern verfügbar. Händlerrabatt und Kampagne sind optional. Eine Kennung wird nur dann ergänzt, wenn die ursprüngliche Kennung ein Baumuster war.

Die Felder werden in fester Reihenfolge freigeschaltet: Die Laufzeit aktiviert die Fahrleistung, die Fahrleistung das Zahlungsintervall, und das Zahlungsintervall aktiviert die Anzahl der Reifen und belegt sie mit der Empfehlung vor. Ist die Anzahl festgelegt, werden Händlerrabatt, Kampagnen und das Hinzufügen einer Kennung freigeschaltet. Nach Abschluss der Konfiguration werden unter den Technischen Optionen Reifentyp (MO, MOE, MOE-S) und Reifengröße angezeigt. Beide Angaben stammen aus der Produktantwort von Stream 1.

**Produktvergleich und Angebotsversand**

Wird ein Reifenprodukt mit einem anderen fahrzeugbezogenen Produkt verglichen, muss jedes Produkt einzeln konfiguriert werden, damit der Preis ermittelt wird. Dies entspricht dem Vorgehen beim Kontingent. Die Angebotsvorlage wurde so angepasst, dass sie die verfügbaren Attribute aus der Produktkonfiguration und dem Vergleich verwendet.

**Antrag und Unterschrift**

Beim Fortfahren mit dem Antrag werden je nach gewähltem Kundentyp die Kundendaten erfasst und auf Dubletten geprüft. Danach werden Kunden- und Zahlungsinformationen erfasst und die Übersicht aufgerufen. Im erstellten Antrag entspricht der Vertragsbeginn wie bei fahrzeugbezogenen Produkten dem FRD. Das geplante Vertragsende ergibt sich aus Vertragsbeginn plus Laufzeit. Der Kilometerstand bei Vertragsbeginn und bei Verkaufsdatum beträgt jeweils 0 km, wenn die Kennung Fahrgestellnummer mit vorhandenem FRD oder Auftragsnummer ist oder das Angebot über BTS gestartet wurde.

Der Produktabschnitt enthält zusätzliche Platzhalter für die Anzahl der Reifen (die in der Produktkonfiguration gewählte Anzahl), den Reifentyp und die Reifengröße. Beide Angaben entsprechen der Anzeige in der Produktkonfiguration und stammen aus der Vertragskalkulation. Die Antragsvorlage enthält diese Platzhalter. Die Unterschrift erfolgt per eSignature, DSS oder Druck und Upload.

**Prüfungen und Aktivierung**

Nach der Unterschrift werden die CAS-Prüfung, die FI-Systemprüfungen und alle weiteren definierten Standardprüfungen durchgeführt. Sind alle Prüfungen erfolgreich, wird der Vertrag manuell oder automatisch aktiviert. Eine Aktivierung ohne FRD ist auch bei Build to Order (BTS) nicht möglich.

Bei der Aktivierung wird die i155 erzeugt. Im Satz RC10 wird unter „External Contract Info“ an Position 71 (4000) die Reifenart und -größe linksbündig ausgegeben. Reihenfolge, Formatierung und Abstände sind noch abzustimmen. Der Text lautet: „Bitte beachten Sie, dass dieses Fahrzeug mit Rädern der Größe 17 Zoll und dem Reifentyp MOE (Runflat) ausgeliefert wurde. Diese Angaben sind das Maximum, dass für die Abwicklung von Leistungen im Servicevertrag verwendet werden darf.“ Größe und Typ sind dynamische Felder, die mit den Angaben aus dem Produkt befüllt werden.

Im Satz RC20 zeigt Position 175 immer „1“. Die Positionen 165 bis 169 enthalten den Startwert des Kontingents, wobei die letzte Stelle eine Dezimalstelle ist. Bei einem Vertrag über 4 Reifen (2 Sätze) steht dort 00040. Die Positionen 170 bis 174 enthalten den aktuellen Verbrauch. Der Standardwert ist 00000. Hat der Kunde 3 von 4 Reifen in Anspruch genommen, lautet der Wert 00030. Auch bei gerader Reifenanzahl im Vertrag kann also eine ungerade Anzahl in Anspruch genommen werden. Die Reifendeckungen werden in die Datei aufgenommen. Zusätzlich wird eine Benachrichtigung mit den Vertragsinformationen an Revenue gesendet. Nach der Aktivierung gehen die relevanten Informationen auch an Nemesis und Controlling.

**Detailansicht des Vertrags**

In der Proposal-Verwaltung (früher Contract-Generation-Startseite) wird im Reiter „Proposal“ (früher „Vertrag“) die Reifendeckung ergänzt. Der Platzhalter „Anzahl der Reifen“ zeigt die im Vertrag enthaltene Reifenanzahl als gerade Zahl, ohne den Begriff „Sätze“. Ein Zähler „Enthaltene Anzahl Reifen / Verbrauchte Reifen (in Anspruch genommen)“ zählt nur die Reifen, nicht Service oder Einlagerung. Im Winter werden die Winterreifen in Anspruch genommen und der Zähler verändert. Beim Rückwechsel im Frühjahr bleibt er unverändert, weil dann die ursprünglichen Reifen verwendet werden. Entspricht die Anzahl der in Anspruch genommenen Reifen der enthaltenen Anzahl, wird der Vertrag nicht beendet, sondern läuft weiter. Im Reiter „Fahrzeug“ wird zusätzlich der Platzhalter „Reifentyp / Reifengröße“ mit den auf Vertragsebene erfassten Angaben angezeigt.

Design und Grafik folgen den Vorgaben der Mercedes-Benz Workbench UI/UX.