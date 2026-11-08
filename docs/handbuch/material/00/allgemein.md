# Material zu 0 Ohne Unterkapitel-Zuordnung

Kapitel 0 Ohne Zuordnung. 52 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 10.1] Fahrgestellnummer bei auftragsbasierten Verträgen

Verträge, die auf Basis einer Bestellung erzeugt werden, werden künftig automatisch um die Fahrgestellnummer ergänzt, sobald diese vorliegt. So sind die für den Händler verpflichtenden Vertragsinformationen vollständig. Erstellt die Vertragsgenerierung einen Vertrag anhand einer Bestellnummer und existiert noch keine Fahrgestellnummer, wird der Vertrag später aktualisiert, sobald die Nummer verfügbar ist. In diesem Fall wird in Global Order ein neuer Zeitpunkt für die nächste Prüfung der Fahrgestellnummer festgelegt. Ist die Fahrgestellnummer bereits vorhanden, wenn die Vertragsgenerierung die Bestellnummer übermittelt, wird sie direkt in der Antwort mitgeliefert. Die Prüfung erfolgt zu drei Terminen: zuerst am Enddatum der Produktionsperiode (Periodentyp „Tag“), dann am Übernahmedatum und schließlich am zweiten Enddatum, das in den Bestelldaten angegeben ist.

## [Batch 142.7] Behördenkunden

Der Ablauf zur Erzeugung von Zahlungsplänen und die zugehörigen Abläufe wurden so erweitert, dass auch Behördenkunden (Governmental Customers) unterstützt werden. Die Erzeugung des Zahlungsplans für diese Kundengruppe wurde geprüft.

## [Batch 218.2] Steuerarten (Tax Types): Übersicht und Suche

Die Übersicht der Steuerarten zeigt zunächst alle Einträge an, da anfangs kein Filter gesetzt ist und alle Filterfelder leer sind. Gesucht werden kann nach dem Namen (Treffer, wenn der Name das eingegebene Wort enthält) sowie über Auswahllisten, die ihre Werte aus der Datenbank beziehen, nach Tax Category, Customer Tax Classification und Type. Änderungen an den Filtern wirken sich nicht automatisch auf die Ergebnisse aus. Die Ergebnisse werden erst nach Klick auf „Search“ angezeigt. „Reset“ setzt die Filterauswahl auf den Ausgangszustand zurück, aktualisiert die Ergebnisse dabei aber nicht.

Die Ergebnistabelle enthält die Spalten Name (Standardsortierung), Tax Category, Customer Tax Classification, Type, Customer Classification und Actions. Übersteigt die Trefferzahl die maximale Anzahl pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, zwischen denen Admin-Benutzer wechseln können. Standardmäßig werden 10 Datensätze pro Seite angezeigt. Über eine Auswahlliste lässt sich der Wert auf 10, 20, 30, 40 oder 50 ändern. Die zuletzt gewählte Einstellung wird nicht gespeichert und nach einem Neuladen der Seite auf 10 zurückgesetzt.

## [Batch 231.2] Steuerverwaltung: Anpassung des Gültigkeitsendes beim Löschen eines Steuersatzes

Wird ein Steuersatz gelöscht, werden die verbleibenden Steuersätze so angepasst, dass keine Lücke im Gültigkeitszeitraum entsteht. Der vorhergehende Steuersatz übernimmt dazu das Gültigkeitsende des gelöschten Satzes.

Wird der letzte Steuersatz gelöscht, verlängert sich der vorherige Satz entsprechend. Gilt beispielsweise Steuersatz 1 vom 01.01.2020 bis 31.12.2024 und Steuersatz 2 vom 01.01.2025 bis 31.12.2099, so gilt nach dem Löschen von Steuersatz 2 der Steuersatz 1 vom 01.01.2020 bis 31.12.2099.

Wird ein mittlerer Steuersatz gelöscht, gilt dieselbe Regel. Hat Steuersatz 1 die Gültigkeit 01.01.2020 bis 31.12.2024, Steuersatz 2 die Gültigkeit 01.01.2025 bis 30.06.2025 und Steuersatz 3 die Gültigkeit 01.07.2025 bis 31.12.2099, so gilt nach dem Löschen von Steuersatz 2 der Steuersatz 1 vom 01.01.2020 bis 30.06.2025. Steuersatz 3 bleibt unverändert.

## [Batch 249.11] Vergleichsbeispiel

Als Vergleich kann eine Beispieldatei aus dem System FMS21 herangezogen werden. Dort heißt die entsprechende Datei E125.

## [Batch 251.4] Aktionen

Mit „Resend" werden alle vier Ereignisse (Kunde, Vertrag, Erlös und Kosten) mit den aktuellen Daten erneut gesendet. „Acknowledge" wird verwendet, wenn der Fehler nicht manuell behoben werden kann und der Benutzer ihn aktuell nicht korrigieren kann.

## [Batch 271.4] Steuerklassifizierung

Beim Anlegen einer neuen Steuerklassifizierung kann der Nutzer die Aktion abbrechen. Der dabei angezeigte Toast-Hinweistext wurde angepasst. Außerdem wurde ein Fehler in der Methode getTaxFactor behoben, die bei leerer Datenbank nicht funktionierte.

## [Batch 272.3] Tax Management: Tabellenfunktionen und Suche

Im Tax Management stehen mehrere Funktionen zur Verfügung, die bereits im Einsatz sind. In den Ergebnistabellen können Sie durch die Ergebnisse blättern und die Anzahl der angezeigten Datensätze ändern. Außerdem lässt sich das Tax Management anhand verschiedener Kriterien durchsuchen.

## [Batch 273.2] Steuerverwaltung

In der Steuerverwaltung (Tax Management) steht die Funktion zum Anlegen einer neuen Steuerklassifizierung zur Verfügung, einschließlich einer Schaltfläche zum Abbrechen des Vorgangs.

## [Batch 282.5] Abbrechen

Wurde im Bearbeitungsmodus nichts geändert, wechselt der Bereich beim Klick auf „Cancel" zurück in die reine Anzeige. Wurde mindestens ein Feld geändert, erscheint ein Dialog mit dem Titel „You have unsaved changes!" und der Meldung, dass beim Fortfahren alle Änderungen verloren gehen und gefragt wird, ob wirklich geschlossen werden soll. Bei „Yes" werden der Dialog und die Bearbeitungsansicht geschlossen und alle Änderungen verworfen. Bei „No" schließt sich nur der Dialog und die Bearbeitungsansicht bleibt geöffnet.

## [Batch 302.3] Inspektor – ein Enterprise-Data-Framework-Produkt

Zu diesem Thema liegen noch keine inhaltlichen Angaben vor. Beschreibung, Ziele und Nutzen sind bislang nicht ausgearbeitet. Der Zielzustand verweist lediglich auf eine Seite im internen Confluence mit dem Titel „Kombinator – Sources“. Eine Beschreibung für das Benutzerhandbuch kann daher erst erfolgen, wenn weitere Informationen vorliegen.

## [Batch 307.6] Testunterstützung

Für Testzwecke auf der INT-Umgebung wurden Dateien anonymisiert und den zuständigen Personen bereitgestellt.

## [Batch 341.1] Automatisierte Bereitstellung von Infrastrukturänderungen

Bisher haben die DevOps-Mitarbeitenden Workflows manuell gestartet, um Terraform-Änderungen in der Entwicklungsumgebung und in den höheren Umgebungen bereitzustellen. Dieser Ablauf wurde automatisiert. Änderungen, die in den Main-Branch übernommen werden, werden nun automatisch in der Entwicklungsumgebung (DEV) ausgerollt. Für die Umgebungen INT und PROD stehen Workflows zur Verfügung, die auf Basis einer manuellen Freigabe ausgelöst werden. Diese Workflows stellen neben den Terraform-Änderungen auch die Modulskripte (zum Beispiel für Lambda und Glue) bereit. Die Skripte werden dazu vor dem Anwenden der Terraform-Änderungen in den S3-Bucket der jeweiligen höheren Umgebung übertragen. Das Runbook wurde entsprechend der Umsetzung aktualisiert.

## [Batch 430.2] Behobener Fehler bei den weiteren Filtern

In den „Weiteren Filtern“ der Übersichtsseite wurde ein Fehler behoben: Zuvor wurde ein ausgewähltes Servicevertragsprodukt nicht in der Ergebnistabelle berücksichtigt. Erwartet wird, dass jede Auswahl aus der Produktliste in der Ergebnistabelle abgebildet wird.

## [Batch 506.6] Seitenaufteilung der Tabelle

Übersteigt die Zahl der Ergebnisse die maximale Anzahl pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, zwischen denen Admin-Benutzer blättern können. Standardmäßig werden 10 Einträge pro Seite angezeigt. Über eine Auswahlliste können Sie alternativ 20, 30, 40 oder 50 Einträge pro Seite einstellen. Die zuletzt gewählte Anzahl wird nicht gespeichert und nach einer Aktualisierung der Seite wieder auf 10 zurückgesetzt.

## [Batch 526.2] User Interface

Beim Info-Banner wurden zwei Punkte korrigiert. Das Banner wird nach einem Neustart des Systems nicht mehr angezeigt, wenn der entsprechende Bereich in den ursprünglichen Einstellungen deaktiviert war. Außerdem wird bei aktiviertem Info-Banner immer ein Footer bereitgestellt.

## [Batch 530.3] DevOps: Betriebliche Verbesserungen

Im Bereich DevOps wurden Anpassungen an den Health Checks des Configuration Service vorgenommen, die Integration von Fehlern bei ECS-Deployments in CloudWatch umgesetzt und ein Wochenend-Shutdown für niedrigere Umgebungen eingeführt. Weitere Details liegen hierzu nicht vor.

## [Batch 618.8] Hinweis zum Einsatz

Laut den Angaben soll diese Funktion noch nicht in der Produktivumgebung ausgerollt werden.

## [Batch 631.3] Mehrere Bankkonten auf Kundenebene

Bei Kunden mit mehreren Bankkonten kann der Nutzer ein Konto löschen, indem er das aktuelle Konto durch ein neues Konto ersetzt.

## [Batch 675.3] Ohne Erlaubnis des Kunden

Hat der Kunde der Nutzung seiner Mercedes-me-Daten nicht zugestimmt, wird ausschließlich die oneSCM-Datenbank geprüft. Ist der Kunde dort nicht vorhanden, werden Sie zur Seite „Kunde anlegen" weitergeleitet, und die erfassten Kundendetails werden automatisch übernommen. Ist der Kunde vorhanden, erscheint das Dialogfenster mit den identifizierten Kunden. Sie wählen entweder einen passenden Treffer, woraufhin Sie nach Klick auf „Weiter" zur Seite „Kunde aktualisieren" gelangen, oder die Neuanlage eines Kunden, woraufhin Sie nach Klick auf „Weiter" zur Seite „Kunde anlegen" mit vorausgefüllten Kundendetails geleitet werden.

## [Batch 723.1] Import der i156-Datei

Beim Import der i156-Datei wird nun deren Struktur geprüft, damit keine fehlerhaften Daten in oneSCM gelangen. Die erste Prüfung vergleicht die im Satz vom Typ 01 angegebenen Satzanzahlen mit den tatsächlich in der Datei enthaltenen Zeilen. Der Satz vom Typ 01 enthält die Anzahl der gesendeten Sätze der Typen 10, 20, 50, 60 und 70. Diese Werte werden jeweils mit der Summe der Zeilen des entsprechenden Satztyps abgeglichen. Weichen die Zahlen voneinander ab, wird die Datei nicht importiert und ein Fehler in DataDog protokolliert.

Die zweite Prüfung betrifft die Zeilenlänge: Jede Zeile muss genau 600 Zeichen umfassen. Andernfalls wird die Datei ebenfalls nicht importiert und ein Fehler in DataDog protokolliert. Die dritte Prüfung sucht nach NULL-Zeichen in einer Zeile. Wird ein solches Zeichen gefunden, wird ein Fehler für den betroffenen Schadenfall in DataDog protokolliert und dieser Schadenfall übersprungen.

## [Batch 745.2] Hinweise und Einschränkungen

Ist die i156 aus irgendeinem Grund nicht verfügbar, stehen keine aktualisierten Informationen zur Anzeige bereit. Da die Datei nur einmal pro Woche oder gemäß Planung der Architekten erzeugt und verarbeitet wird, sind die angezeigten Daten mindestens eine Woche alt. Enthält ein Eintrag in der i156 einen Fehler, wird dieser Datensatz nicht in oneSCM übernommen; die Daten müssen dann manuell nachgepflegt werden. Jobs, die auf gemeinsamen Daten arbeiten, dürfen nicht gleichzeitig laufen. Während des Imports der i156 darf beispielsweise der Job für die i155 nicht gestartet werden.

## [Batch 771.3] Versand von E-Mails

Die Schaltfläche „E-Mail senden“ wird nicht mehr ausschließlich dann aktiviert, wenn das Kontrollkästchen „Alle auswählen“ gesetzt wurde.

## [Batch 783.3] Schritt 2: Deckungen

Links werden die enthaltenen Deckungen angezeigt, vorausgewählt und schreibgeschützt. Rechts stehen die optionalen Deckungen, die vorausgewählt und schreibgeschützt sind, sofern sie zuvor gewählt wurden. Falls verfügbar, können weitere optionale Deckungen ausgewählt werden. Dadurch aktualisiert sich der Produktpreis, und die Deckungen erscheinen unter den optionalen Deckungen.

## [Batch 849.3] Änderungen in der Vertragshistorie

Alle Änderungen können im Reiter „History" nachvollzogen werden. Dort werden folgende Angaben angezeigt: das geänderte Objekt („Modified Object", hier: Contract), das geänderte Attribut („Modified Attribute", also der Name des Feldes, z. B. Payment Interval), der alte und der neue Wert (z. B. Monthly und One Time), die Art der Änderung („Type of Modification", also die Bezeichnung des Bereichs des Attributs, z. B. Payment), der im Pop-up eingegebene Grund, das Änderungsdatum im Format TT.MM.JJJJ HH:MM:SS sowie die ändernde Person mit Vor- und Nachnamen.

## [Batch 852.3] Tabellen und Seitenauswahl

Bei Ergebnistabellen mit mehr als zehn Einträgen wurde die Blätterfunktion korrigiert. Wählt man auf Seite 2 im Auswahlfeld für die Einträge pro Seite einen Wert, der größer ist als die Gesamtzahl der Einträge (zum Beispiel 40 bei 33 Einträgen), zeigt die Tabelle nun höchstens so viele Ergebnisse an, wie der gewählte Wert vorgibt, und springt auf Seite 1. Bei 34 Treffern und einer Auswahl von 40 werden somit alle 34 Einträge angezeigt.

## [Batch 854.3] Vertragsansicht

Die Detailansicht eines Vertrags gliedert sich in die Bereiche Übersicht, Kunde, Fahrzeug, Vertrag und Produktdetails, die jeweils die zugehörigen Angaben des Vertrags anzeigen. Zusätzlich gibt es einen Verlaufsbereich mit Detailinformationen.

## [Batch 859.3] Hinweis zum Stand der Funktionen

Die Beschreibungen zur eigentlichen Vertragsdetail-Ansicht sowie zur Suchseite, auf der Verträge gesucht, angezeigt und ausgewählt werden können, enthalten in den vorliegenden Angaben keine näheren fachlichen Details über die Zielbeschreibung hinaus; die zugehörigen Arbeiten wurden abgebrochen. Konkrete Funktionsweisen dieser Bereiche lassen sich daher aus den Daten nicht ableiten.

## [Batch 899.8] Synchronisierung der Werte

Für alle Produkttypen gilt: Wählen Sie in einer Spalte einen Konfigurationswert, versucht das System, denselben Wert in den anderen Spalten zu setzen und die Preise zu aktualisieren. Ist der Wert in einer anderen Spalte nicht verfügbar oder existiert das Attribut dort nicht, wird „n/a“ angezeigt, und Sie müssen manuell eine andere Option aus der Auswahlliste wählen. Möchten Sie einen Wert ändern, können Sie in der Auswahlliste eine andere Option wählen, ohne dass sie auf die übrigen Spalten übertragen wird. Die Konfigurationen der Produkte dürfen sich somit unterscheiden.

## [Batch 917.4] Regeln für die Fahrzeugeingabe

Die erste Zeile ist das Hauptfahrzeug und schreibgeschützt. Die Zeilen 2 bis 100 sind für weitere Fahrzeuge vorgesehen. Fahrzeuge können manuell eingegeben, per Copy & Paste aus einer externen Quelle eingefügt oder per Excel-Upload hinzugefügt werden. Sobald eine Zeile vollständig ist, wird automatisch eine neue ergänzt. Werden mehr als 99 zusätzliche Fahrzeuge angegeben, werden die überzähligen verworfen.

## [Batch 917.6] Löschen von Zeilen

Das Löschen einer einzelnen Zeile entfernt den gesamten Datensatz. „Delete All Containing Error“ entfernt alle Zeilen mit Warnsymbol. In beiden Fällen wird die Mass-Creation-ID aktualisiert.

## [Batch 929.6] Deckungen

Links stehen die enthaltenen Deckungen. Sie sind vorausgewählt und nicht editierbar und werden mit Name, Familienkennzeichen und Beschreibung angezeigt. Die Liste ist bei Bedarf scrollbar. Gibt es keine, erscheint ein entsprechender Hinweis. Rechts stehen die optionalen Deckungen mit Name, Produkt und Beschreibung. Die Auswahl einer Deckung aktualisiert den Preis auf der Produktkarte. Mit „Don’t add Optional Coverages“ werden alle übrigen optionalen Deckungen ausgegraut. Sind keine optionalen Deckungen vorhanden, wird ein Hinweis angezeigt, und der Schritt ist standardmäßig blau, ohne dass eine Auswahl nötig ist. Übernommene Deckungen erscheinen mit ihrer Familie auf der Produktkarte.

## [Batch 1079.3] Registerkarte „Payment"

Die Registerkarte, die bisher „Payment Detail" hieß, heißt nun „Payment". Sie zeigt nur noch die benötigten Felder an: Payment Duration, Payment Interval und Payment Rate per Interval. Die bisher angezeigten Felder Gesamtbruttopreis, Gesamtnettobetrag, Gesamtsteuerbetrag, Mehrwertsteuersatz sowie Brutto- und Nettobetrag pro Intervall entfallen.

## [Batch 1096.7] Technische Anpassung

Der Typ des Versionsfelds im gemeinsamen Modul wurde angepasst.

## [Batch 1100.6] Kennzeichenprüfung

Das Kennzeichen wird nur noch im Ablauf zur Erstellung mit verfügbarer Fahrgestellnummer validiert.

## [Batch 1116.3] Anpassung der Leasing-Integration

Zur Anpassung der Leasing-Integration liegen derzeit keine inhaltlichen Angaben vor.

## [Batch 1126.1] (ohne Überschrift)

Hinweis: Die Rohdaten enthalten nur wenige belastbare Details. Der folgende Text beschränkt sich daher auf das, was aus den Angaben hervorgeht.

## [Batch 1178.6] Hinweis zur Zuordnung

Pro Fahrgestell gibt es genau eine Auftragsnummer. Dadurch ist die Zuordnung eines Liefertermins zu einem Fahrzeug eindeutig.

## [Batch 1188.6] Copy-and-Paste-Funktion

Für Matrixtabellen und andere Tabellenformate mit Upload- und Download-Funktion steht nun eine Copy-and-Paste-Funktion zur Verfügung. Inhalte können direkt kopiert und eingefügt werden, ohne dass ein Upload nötig ist, was Zeit spart. Die Funktion gilt nur für Stream 1 (Produkt).

## [Batch 1224.2] Produkterstellung allgemein

Über die Schaltfläche „Create Product“ öffnet sich ein Pop-up, mit dem die Erstellung beginnt. Der Prozess besteht aus sieben Schritten. In jedem Schritt können Benutzer zum vorherigen und zum nächsten Schritt navigieren und den Prozess verlassen. Ab Schritt 2 lässt sich das Produkt als Entwurf speichern, sobald die jeweils erforderlichen Pflichtangaben vorliegen (in Schritt 2 etwa ein gültiger Produktname). Jeder Schritt enthält eine Infobox, die über eine Schaltfläche am unteren Rand aufgerufen wird. Sie ist in allen Schritten zunächst geöffnet, bis der Benutzer sie schließt, wird beim Darüberfahren blau, zeigt im geöffneten Zustand ein „X“ und lässt sich durch Klicken auf die Schaltfläche schließen. Sie öffnet sich über allen anderen Inhalten der Seite. Die Inhalte unterscheiden sich je nach Schritt.

## [Batch 1224.9] Schritt 7 – Product Summary

Die Zusammenfassung zeigt alle in den vorherigen Schritten festgelegten Informationen. Die Infobox „Your product at a glance“ erklärt, dass die Seite einen Überblick über alle konfigurierten Details gibt und nach dem Erstellen Preise zugewiesen werden können. Mit „Save as Draft“ lässt sich die Konfiguration unterbrechen und das Produkt später fertigstellen. Beim Einreichen erscheint ein Dialog: „Go to products“ führt zur Produktübersicht, in der das neu erstellte Produkt oben angezeigt wird. „Assign Prices“ führt zur Seite für die Preiszuweisung des Produkts, auf der der übliche Prozess fortgesetzt werden kann.

## [Batch 1229.2] Produkterstellungsassistent

Der Produkterstellungsassistent umfasst alle Schritte der Produkterstellung. Für diesen Bereich liegen in den vorliegenden Informationen keine weiteren Details für die Anwender vor.

## [Batch 1244.1] Abgeschlossene Änderung: Regel für die 4-Augen-Freigabe

Für die 4-Augen-Freigabe gilt nun eine Regel zum Startdatum: Liegt das Freigabedatum vor dem vom Benutzer gewünschten Startdatum, wird das gewünschte Startdatum übernommen. Wählt der Benutzer beispielsweise den 27.02.2026 als Startdatum und erfolgt die Freigabe durch MPC 2 bereits am 25.02.2026, gilt weiterhin der 27.02.2026. Existieren mehrere Entwürfe, etwa Entwurf 2 und Entwurf 3, darf der neueste Entwurf nicht eingereicht werden. Die Schaltfläche zum Einreichen ist dann deaktiviert, und ein Tooltip erläutert den Grund. Eingereicht werden darf ausschließlich der älteste Entwurf.

## [Batch 1246.8] Verbindung zwischen Sales Logic und Grenzwerten

Das System hält eine Verbindung zwischen der Sales Logic (FRD-bezogen und nicht FRD-bezogen) und den Grenzwerten der Fahrzeugvoraussetzungen aufrecht. Sind die Grenzwerte für die gewählte Sales Logic nicht mehr anwendbar, werden sie auf den Standardwert zurückgesetzt.

## [Batch 1257.5] Price Matrix Preview

In der Vorschau der Price Matrix wurde eine kleine Anpassung vorgenommen: Der linke Pfeil verläuft nun von oben nach unten.

## [Batch 1268.4] Ladeanzeigen

Beim Öffnen der Preisseite eines Produkts dauerte das Laden der Produkte im Dropdown fünf bis sieben Sekunden. Das Dropdown zeigt nun einen Ladezustand an, damit erkennbar ist, dass die Einträge geladen werden. Dasselbe gilt für den fünften Schritt der Produkterstellung: Nach dem Anlegen eines neuen Limit-Presets dauerte es vier bis sechs Sekunden, bis der neue Eintrag in der Dropdown-Liste erschien. Auch hier wird jetzt ein Ladezustand angezeigt.

## [Batch 1269.2] Produktübersicht und Produktsuche

Die Suche nach Produktnamen in der Produktübersicht wurde erweitert. Sie müssen den Namen eines Produkts nicht mehr vollständig oder von Beginn an eingeben. Es genügt eine Teilzeichenfolge, die am Anfang, in der Mitte oder am Ende des Produktnamens steht, damit das passende Produkt in der Ergebnisliste erscheint.

## [Batch 1278.5] Kontingentpreise

Für Kontingentprodukte ist das Herunterladen und Hochladen der Preismatrix nun möglich. Nach dem Anlegen eines Kontingentpreises sind die Tabellenwerte nicht mehr verschoben, und der Upload einer Matrix aktiviert die Schaltfläche „Speichern“.

## [Batch 1280.3] Fahrzeugvoraussetzungen

Im Reiter „Fahrzeugvoraussetzungen" wurden Werte im Feld für das maximale Fahrzeugalter bei Vertragsbeginn (in Monaten) falsch übernommen. So wurde beispielsweise aus der Eingabe 36 der Wert 63. Die Eingabe bleibt nun unverändert.

## [Batch 1282.3] Fahrzeugvoraussetzungen

Es wurde ein Fehler in der Logik behoben, die prüft, ob die Grenzwerte innerhalb der Produktwerte liegen. Dadurch ließen sich Fahrzeugvoraussetzungen teils nicht speichern, und der Assistent konnte nicht fortgesetzt werden, obwohl das Produktlimit korrekt gesetzt war.

## [Batch 1300.2] Weitere Themen

Zu den Themen „Crowdin Integration – Market translation“ und „Architecture topics PI15“ enthalten die vorliegenden Rohdaten keine inhaltlichen Angaben, die sich für das Benutzerhandbuch verwenden ließen. Sie werden deshalb hier nicht beschrieben.

## [Batch 1314.2] Fehlerbehandlung und Abbruchkonzept

Für die Fehlerbehandlung wurde ein Konzept erarbeitet, das mehrere Teams betrifft. Es sollte klären, an welchen Stellen die Ausführung von Code abgebrochen werden muss und wo eine Zeitüberschreitungsbehandlung (Timeout) erforderlich ist. Falls nötig, sollten Abbruch und Timeout-Behandlung auch umgesetzt werden. In den Unterlagen wird zudem das Ziel genannt, nicht reagierende Anwendungsteile zu stoppen und erneute Versuche (Retries) zu steuern. Für drei Teams ist diese Arbeit abgeschlossen, eine weitere Variante des Konzepts wurde abgebrochen.

