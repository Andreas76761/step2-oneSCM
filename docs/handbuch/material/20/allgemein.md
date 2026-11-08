# Material zu 20 Ohne Unterkapitel-Zuordnung

Kapitel 20 Länderspezifische Themen. 24 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 142.9] Marktspezifische Anzeige und Prüfungen

Für den Markt Slowakei wurden Seiten entfernt, die nicht zum slowakischen Markt gehören. Die Sichtbarkeit der Batch-Jobs wurde für Deutschland, Slowakei und Indien geprüft: Jeder Markt zeigt alle marktspezifischen sowie die globalen Batch-Jobs ohne Duplikate an. Zudem wurde die Anpassung des Feldes HTXT2 in der E169 verifiziert.

## [Batch 1220.4] Schritt 2: Marktspezifität

Hier legen Sie fest, in welchen Märkten der Coverage Code bei der Produktanlage verwendet werden kann. Dafür stehen zwei Optionen zur Verfügung.

Beim ersten Aufruf ist die Option „Current and Upcoming Markets“ vorausgewählt. Alle Märkte der Liste sind dann markiert, die Auswahlkästchen lassen sich aber nicht ändern. Rechts werden die zugehörigen Beschreibungsfelder angezeigt. Kommt später ein neuer Markt in oneSCM hinzu, wird er automatisch einbezogen. Die in Schritt 1 gespeicherte Default Short Description wird dann als Kurzbeschreibung vorbelegt. Diese Beschreibung sehen Sie auch, wenn Sie die Seite nach dem Hinzufügen des Marktes erneut bearbeiten, ebenso in anderen Bereichen der Anwendung, in denen diese Information erscheint. Geben Sie selbst eine neue Kurzbeschreibung ein, wird diese gespeichert.

Wählen Sie „Custom Markets“, bleiben zunächst alle Märkte ausgewählt, die Kästchen lassen sich nun aber einzeln an- und abwählen. Wenn Sie Märkte abwählen und auf „Confirm“ klicken, verschwinden die zugehörigen Beschreibungsfelder auf der rechten Seite. Ist kein Markt ausgewählt, bleibt „Confirm“ deaktiviert. Mindestens ein Markt muss also gewählt sein. Wählen Sie einen zuvor abgewählten Markt wieder aus, ohne zwischendurch zum vorherigen oder nächsten Schritt zu wechseln, werden die zuvor gespeicherten Werte wiederhergestellt. Das gilt auch, wenn Sie nicht auf „Confirm“ geklickt haben. Wechseln Sie zurück zu „Current and Upcoming Markets“, werden wieder alle Märkte ausgewählt. Fehlende Kurzbeschreibungen werden durch die Default Short Description ersetzt.

Die Liste der verfügbaren Märkte enthält derzeit nur Deutschland. Mit jedem weiteren von oneSCM unterstützten Markt wird sie erweitert. Das erste Kästchen der Liste dient als „Select All“ bzw. „Deselect All“. Sind alle Einträge ausgewählt, ist das Kästchen markiert und beschriftet mit „Deselect All“. Ein Klick hebt dann alle Auswahlen einschließlich dieses Kästchens auf, und die Beschriftung wechselt zu „Select All“. Sind nur einige Einträge ausgewählt, lautet die Beschriftung „Select All“ und das Kästchen zeigt einen Zwischenzustand („–“). Ein Klick wählt dann alle Einträge aus, und die Beschriftung wechselt zu „Deselect All“.

Nach der Bestätigung erscheint für jeden Markt eine Karte, und zwar pro marktspezifischer Sprache. Für die Schweiz gibt es zum Beispiel Karten für DE, FR und IT. Jede Karte enthält zwei Eingabefelder. Die Short Description ist ein Pflichtfeld mit 5 bis 200 Zeichen. Die Long Description ist optional und umfasst 5 bis 500 Zeichen. Löschen Sie den Inhalt einer Kurzbeschreibung, wird automatisch der Wert der Default Short Description eingesetzt. Wählen Sie einen Markt ab und bestätigen, werden die Karte und die zugehörigen Beschreibungen entfernt und gelöscht.

Eingaben bleiben beim Wechsel zwischen den Optionen erhalten. Sobald mindestens ein Markt ausgewählt und bestätigt wurde, werden Eingaben und Änderungen auch beim Wechsel mit „Back“ oder „Next“ gespeichert. Sind ungültige Daten eingetragen, ist „Next“ deaktiviert. Kehren Sie von einem anderen Schritt zurück, wird das fehlerhafte Feld zurückgesetzt.

Können die Märkte nicht geladen werden, bleiben der Auswahlbereich und die Beschreibungen grau. Zusätzlich erscheint die Meldung „Could not load available markets. Please exit and try again later“.

## [Batch 68.1] Marktbezogene Ansicht auf der Seite „Cross File Transfer"

Auf der Seite „Cross File Transfer" im Admin-Bereich sehen Administratoren künftig nur noch die Ergebnisse und Filteroptionen, die zu ihrem eigenen Markt gehören. Bisher konnte jeder Admin-Benutzer in beiden Tabs der Seite Ergebnisse aus allen Märkten einsehen. Diese Ansicht wird nun auf den Markt eingegrenzt, dem der jeweilige Benutzer zugeordnet ist.

Im Tab „Cross File Transfer" zeigt die Ergebnisliste standardmäßig ausschließlich Einträge des eigenen Marktes an. Auch die Filterkriterien „File Type", „Source" und „Destination" bieten beim Aufklappen der jeweiligen Auswahlliste nur noch die Optionen an, die für den Markt des Benutzers verfügbar sind.

Im Tab „File Upload" gilt dasselbe Prinzip: Die standardmäßig angezeigten Ergebnisse beziehen sich nur auf den Markt des angemeldeten Admin-Benutzers. Auch das Filterkriterium „Interfaces" soll nur die Optionen des eigenen Marktes enthalten.

Hinweis: Dieser Funktionsumfang befindet sich noch in der Abstimmung (Refinement). Noch nicht festgelegt ist, wie sich das System verhalten soll, wenn ein Benutzer eine Datei hochlädt, die einem anderen Markt zugeordnet ist. Zur Diskussion stehen, ob der Upload zwar möglich wäre, die Datei aber nicht angezeigt würde, oder ob der Upload unterbunden werden soll. Ebenso ist offen, ob eine solche Einschränkung technisch umsetzbar ist. Der Abschnitt zum Hochladen von Dateien sollte daher erst nach der Klärung dieser Punkte final formuliert werden.

## [Batch 143.2] Anpassungen für den slowakischen Markt

Seiten, die für den slowakischen Markt nicht relevant sind, wurden ausgeblendet. Die Materialnummernverwaltung im Bereich Admin ist nur noch für oneERP-Märkte sichtbar. Die Seiten „Old Part Taxes/I156" sowie „Old Part Taxes – Manual" unter Finanzverwaltung > Finanzkontrolle werden nur noch für den Markt DE angezeigt. Ebenso wurde die Funktion zum Erstellen oder Bearbeiten von Werkstattrechnungen im Reiter „Zahlung" eines Vertrags für den slowakischen Markt entfernt.

## [Batch 218.1] Steuerverwaltung für den Markt Indien (MBIL)

Bisher ist die Steuerverwaltung in oneSCM für den deutschen Markt definiert, wobei die Standardsteuer die Mehrwertsteuer (VAT) ist. Mit der Einführung des neuen Marktes MBIL (Indien) wird die Steuer über den GST-Satz (Goods and Services Tax) ermittelt, der auf den Servicevertrag anzuwenden ist. Die GST löst in Indien die Mehrwertsteuer auf Lieferungen von Waren und Dienstleistungen ab. Für Indien steht dafür ein eigenes Steuermodul zur Verfügung, in dem die neuen Steuerarten und Steuersätze definiert werden.

Es gibt drei GST-Arten. Die CGST (Central Goods and Services Tax) wird von der Zentralregierung erhoben, wenn Waren oder Leistungen innerhalb eines Bundesstaates gehandelt werden. Die SGST (State Goods and Services Tax) wird bei Käufen oder Verkäufen innerhalb des eigenen Bundesstaates von der jeweiligen Landesregierung erhoben. Die IGST (Integrated Goods and Services Tax) kommt zur Anwendung, wenn die Ware oder Leistung aus einem anderen Bundesstaat stammt. Sie erleichtert Transaktionen über Staatsgrenzen hinweg und sorgt für eine faire Verteilung der Einnahmen zwischen den beteiligten Gebieten.

Wird ein Servicevertrag nach dem Fahrzeugkauf verkauft, ist darauf eine GST von 18 % anzuwenden. Bei Transaktionen innerhalb eines Bundesstaates (Intra-State) setzt sich diese aus 9 % CGST und 9 % SGST zusammen. Bei Transaktionen zwischen Bundesstaaten (Inter-State) werden 18 % IGST angewendet. Welcher GST-Satz beim Anlegen eines Servicevertrags gilt, richtet sich danach, in welchem Bundesstaat der Kunde ansässig ist.

## [Batch 246.1] Steuerverwaltung: Übersicht der Steuerarten für einen Markt

Für jeden Markt muss eine Liste der Steuerarten festgelegt werden, die für diesen Markt verfügbar und anwendbar sind. Diese Liste wird von einem Administrator im Rahmen der Einführung eines Marktes definiert. Die so festgelegten Steuerarten dienen anschließend dazu, den einzelnen Arten konkrete Steuersätze und zusätzlich Gültigkeiten zuzuweisen. Hierfür gibt es auf der Seite „Tax Management" den neuen Reiter „Tax Type".

Im Ausgangszustand ist kein Filter gesetzt. Alle Filterfelder sind leer, und die Tabelle zeigt sämtliche Ergebnisse an. Im Filterbereich kann nach folgenden Kriterien gesucht werden: Beim Feld „Name" wird in der Tabelle nach Einträgen gesucht, die das eingegebene Wort enthalten. Die Felder „Tax Category", „Customer Tax Classification" und „Type" sind Dropdown-Listen, die die in der Datenbank verfügbaren Werte enthalten. Änderungen oder Auswahlen in den Filterfeldern wirken sich nicht automatisch auf die Suchergebnisse aus. Erst ein Klick auf die Schaltfläche „Search" zeigt die Ergebnisse passend zu den gewählten Filteroptionen an. Die Schaltfläche „Reset" setzt die Filterauswahl auf den Ausgangszustand zurück, aktualisiert dabei jedoch nicht die Ergebnisse. Die Schaltfläche „Create Tax Type" wird in einem separaten Epic behandelt.

Die Ergebnisse werden in einer Tabelle mit den Spalten Name, Tax Category, Customer Tax Classification, Type, Customer Classification und Actions angezeigt. Standardmäßig ist die Tabelle nach Name sortiert. Die Funktionen unter „Actions" werden in anderen Epics behandelt.

Übersteigt die Zahl der Ergebnisse die maximale Anzahl an Einträgen pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, und Administratoren können zwischen den Seiten navigieren. Standardmäßig werden maximal 10 Datensätze pro Seite angezeigt. Über ein Dropdown lässt sich die Anzahl auf 10, 20, 30, 40 oder 50 Datensätze ändern. Der zuletzt gewählte Wert wird nicht dauerhaft gespeichert; nach einer Aktualisierung der Seite gilt wieder der Standardwert von 10 Datensätzen pro Seite. Die Gestaltung entspricht der Mercedes-Benz Workbench sowie dem vom Kunden validierten UI-Design.

## [Batch 551.4] Marktspezifische Kundenlogik in eigenen Services

Mit jedem neuen Markt kommt marktspezifische Logik hinzu, etwa abweichende Regeln für die Kundenanlage, fachliche Prüfregeln für die Kundendatenpflege sowie ein anderes Finanzsystem mit eigenen Anfragen. Auch Adressformate, Pflichtfelder und Datenanreicherungen unterscheiden sich je Markt. Da der Kundenservice auf weitere Märkte ausgeweitet wird, steigt die Komplexität mit jedem zusätzlichen Markt. Künftig soll die gesamte marktspezifische Logik in eigenen Implementierungen je Markt gebündelt werden. Märkte ohne Sonderregeln greifen auf eine Standardimplementierung zurück. Ein neuer Markt kann so angelegt werden, ohne den Kernservice zu verändern und ohne die Logik bestehender Märkte zu beeinflussen. Das bestehende Verhalten aller aktuellen Märkte soll unverändert bleiben, was durch die vorhandene Testsuite und Regressionstests je Markt überprüft wird.

## [Batch 578.1] Partner Management: marktindividuelle Händlertabelle

Die Tabellen im Partner Management waren bisher globale Listen und haben den Markt des angemeldeten Benutzers nicht berücksichtigt. Die Händlertabelle (Dealership) ist nun als marktindividuelle Liste umgesetzt, die sich am Mandanten (Tenant) des angemeldeten Benutzers orientiert. Die Daten werden serverseitig gefiltert, sodass ausschließlich die Händler des Marktes angezeigt werden, dem der Benutzer bei der Anmeldung zugeordnet ist. Die Tabelle wird auf Marktebene gepflegt.

Auch bei der Registrierung von Händlern gilt der Marktbezug: Benutzer können einen Händler, einzeln oder per Upload, nur für den Markt registrieren, mit dem sie angemeldet sind. Es lassen sich ausschließlich Händler finden und registrieren, die dem eigenen Markt zugeordnet sind. Geben Benutzer die GS-Outlet-ID eines Händlers eines anderen Marktes ein, werden keine Daten in die Registrierungstabelle übernommen. Stattdessen erscheint ein Hinweis, dass der Benutzer bzw. der Markt keine Zugriffsberechtigung für diese Händler besitzt.

## [Batch 582.3] Marktindividuelle Lieferantentabelle im Partner Management

Bisher waren die Tabellen im Partner Management globale Listen, die den Markt des angemeldeten Benutzers nicht berücksichtigten. Die Lieferantentabelle (Supplier-Tabelle) ist nun eine marktindividuelle Liste, die sich am Mandanten (Tenant) des angemeldeten Benutzers orientiert. Dazu wird im Backend gefiltert, sodass nur die Händlerbetriebe des beim Login zugewiesenen Marktes angezeigt werden. Die Tabelle wird auf Marktebene gepflegt. Der Grund dafür ist, dass sich die Lieferanten-Kreditorennummer (Supplier Creditor) eines Marktes von der eines anderen Marktes unterscheidet.

## [Batch 711.1] Validierung des I156-Imports nach Markt

Beim Import einer I156-Datei in oneSCM wird jede Forderung (Claim) daraufhin geprüft, ob sie zum aktuellen Markt gehört. Dazu wird der VEGA-Ländercode aus dem Satztyp 10 (Positionen 1 bis 5) mit dem Marktcode des Marktes verglichen, in dem die Datei importiert wird. Stimmen beide Werte nicht überein, wird die Forderung übersprungen, und für die übersprungene Forderung erscheint eine aussagekräftige Fehlermeldung in Datadog. Die Datei selbst wird dennoch importiert. Enthält sie ausschließlich Forderungen eines anderen Marktes, werden also alle Forderungen übersprungen. Enthält sie Forderungen für den aktuellen und für andere Märkte, werden nur die Forderungen des aktuellen Marktes importiert, sofern sie auch die übrigen Importkriterien erfüllen, etwa den passenden Vertrag und die Fahrgestellnummer. Importierte Forderungen werden im zugehörigen Vertrag angezeigt. Der I156-Import ist ein Batch-Job und keiner direkten Rolle zugeordnet, unterstützt aber die Anwender im Market Operations (MO).

Auch der Umgang mit Händlern, die in der Händlerverwaltung (Dealership Management) fehlen, wurde angepasst. Da VEGA als maßgebliche Quelle für Forderungen gilt und die Händlerverwaltung in oneSCM möglicherweise nicht aktuell ist, wird eine Forderung auch dann importiert, wenn der Händler dort nicht vorhanden ist und sich kein Händlername ermitteln lässt. Der Händlername bleibt in diesem Fall leer, und die Oberfläche zeigt stattdessen einen Bindestrich („-“) an. Wird der Händler später in der Händlerverwaltung angelegt, erscheint der Name auch in den Daten der Forderung. Ist der Händler dagegen vorhanden, wird sein Name in den Werkstattrechnungen angezeigt.

## [Batch 936.2] Eigenständige i155-Datei pro Markt

Bisher wurde die i155 ausschließlich für den deutschen Markt erzeugt. Künftig wird für jeden Markt eine separate i155-Datei generiert. Jede dieser Dateien wird einzeln per CFT an Vega übermittelt. Die Antwort von Vega, die nach der Verarbeitung der jeweiligen i155 eintrifft, wird ebenfalls pro Markt gespeichert.

## [Batch 989.1] Marktspezifische Einstellungen

Mit den Markteinstellungen können MPC-Anwender Daten im regionalen Format darstellen und die Standardparameter des Systems an die Anforderungen ihres Marktes anpassen. Die Einstellungen sind auf zwei Seiten verteilt: die Seite „General Settings“ und die Seite „Feature Settings“. Über die Schaltfläche „Restore“ werden alle Konfigurationen auf die Standardwerte zurückgesetzt. Mit „Update“ werden die aktuellen Eingaben gespeichert und die Änderungen an Formaten und anderen Einstellungen in der gesamten Anwendung wirksam. „Update“ ist nur dann aktiv, wenn sich die aktuelle Auswahl von der bestehenden Konfiguration unterscheidet.

## [Batch 1095.3] Markt-ID (Market ID)

Die Markt-ID wird nicht mehr nur im Header übergeben, sondern ist Teil der Anfrage zum Erstellen eines Vertrags, sowohl für Standard- als auch für Leasingverträge. Das Feld marketId der Vertragsentität ist ein Pflichtfeld. Beim Erstellen, Bestätigen und Aktivieren eines Leasingvertrags ist außerdem der Header „X-Market“ verpflichtend. Bei der Vertragserstellung wird zusätzlich geprüft, dass die marketId in der Anfrage nicht leer ist und als Markt im Configuration Service existiert.

## [Batch 10.5] Benutzerprofil und Marktauswahl

Im Admin-Bereich der Fahrzeugverwaltung wird die Einstellung zur Anzahl der Einträge pro Seite im Benutzerprofil gespeichert. Zudem unterstützt die Anwendung die Marktauswahl für Produkte und Fahrzeuggruppen.

## [Batch 177.4] Ablauf für Benutzer des indischen Marktes

Als MO/MPC des indischen Marktes finden Sie nach der Anmeldung in oneSCM die Seite „Financial Control – CoFiCo Check". Sobald der Batch CoFiCoInvExp ausgelöst und abgeschlossen wurde, sehen Sie den Status „Exported" und den exportierten Gesamtbetrag der Datei. Nach Eingang des Feedbacks wechselt der Status auf „Imported", und der importierte Gesamtbetrag wird angezeigt. Der Check zeigt „OK", wenn der exportierte Gesamtbetrag der importierten Summe entspricht, andernfalls „Not OK".

## [Batch 181.5] Verhalten für MO/MPC des Marktes Indien

Ein MO oder MPC des Marktes Indien findet nach der Anmeldung an oneSCM die Seite „Financial Control – SWT Check“. Sobald der Batch SWTInvExp ausgelöst und abgeschlossen wurde, wird der Status „Exported“ zusammen mit dem exportierten Gesamtbetrag angezeigt. Sobald das Feedback zum Batch eingegangen ist, wechselt der Status auf „Imported“, und der importierte Gesamtbetrag wird angezeigt. Das Prüfergebnis lautet „OK“, wenn der exportierte Gesamtbetrag der importierten Gesamtsumme entspricht, andernfalls „Not OK“.

## [Batch 1034.2] Adressdaten

Im Abschnitt „Address“ geben Sie die Adresse des Kunden an. Bitte beachten Sie die vorgegebene Reihenfolge der Eingabefelder: Zuerst wählen Sie das Land, danach folgen Postleitzahl, Stadt, Straße, Hausnummer und eine zusätzliche Adresszeile. Das Feld „Country“ ist eine Auswahlliste mit Ländern, zum Beispiel Germany. Pflichtfelder sind Country, Post Code, City, Street und House Number. Die Postleitzahl (zum Beispiel 70565) und die Stadt (zum Beispiel Stuttgart) erfassen Sie als Text, wobei für die Stadt maximal 40 Zeichen zulässig sind. Für die Straße (zum Beispiel Am Wallgraben) sind maximal 60 Zeichen möglich, für die Hausnummer maximal 30 Zeichen. Optional können Sie in „Street Line 2“ ergänzende Angaben machen, die die Adresse vervollständigen, etwa ein Haus-Postfach oder den Namen des Postempfängers; auch hier sind maximal 60 Zeichen erlaubt.

## [Batch 256.1] Steuersätze verwalten (Tax Management)

Im Bereich Revenue Management können Benutzer der Marktgesellschaft (MPC) die Steuersätze für ihren Markt verwalten. Für jeden Markt wird eine Liste von Steuersätzen definiert, die in diesem Markt verwendet werden dürfen. Dafür steht auf der Seite „Tax Management" der neue Reiter „Tax Rates" zur Verfügung.

Im Ausgangszustand ist kein Filter gesetzt. Alle Filterfelder sind leer, und die Tabelle zeigt sämtliche Ergebnisse an. Gesucht werden kann nach dem Namen (die Tabelle wird nach Einträgen durchsucht, deren Name das eingegebene Wort enthält), nach der Financial Document Definition (Auswahl aus den verfügbaren Werten) sowie nach „Validity From" und „Validity To". Bei den beiden Gültigkeitsfeldern erfolgt die Eingabe über einen Kalender im vorgegebenen Datumsformat. Änderungen oder Auswahlen in den Filterfeldern wirken sich nicht automatisch auf die Ergebnisse aus. Erst ein Klick auf „Search" zeigt die Ergebnisse passend zu den gewählten Filtern an. Die Schaltfläche „Reset" setzt die Filterauswahl auf den Ausgangszustand zurück, aktualisiert dabei aber nicht die Ergebnisliste. Die Schaltfläche „Create Tax Rate" ist Teil eines separaten Funktionsumfangs zum Anlegen von Steuersätzen.

Die Ergebnisse erscheinen in einer Tabelle mit den Spalten Name, Entity, Tax Type, FI Tax Code, FI Tax Code Description, Tax Factor, Validity und Actions. Standardmäßig wird nach Name sortiert. Die Gültigkeit wird im Format „Validity_from - Validity_to" dargestellt. Die Aktionen werden in anderen Funktionsumfängen behandelt. Übersteigt die Zahl der Treffer die maximale Anzahl an Einträgen pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, und Admin-Benutzer können zwischen den Seiten navigieren. Standardmäßig werden bis zu 10 Datensätze pro Seite angezeigt. Über ein Dropdown lässt sich dieser Wert auf 10, 20, 30, 40 oder 50 ändern. Die zuletzt gewählte Einstellung wird nicht gespeichert und nach einem Neuladen der Seite auf 10 zurückgesetzt. Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 552.2] Anpassungen für den Markt Schweiz (MBCH)

Steuernummer und Umsatzsteuer-Identifikationsnummer (VAT-ID) lassen sich nun im Schweizer Format erfassen. Zuvor war dies nicht möglich. Außerdem wird die Meldung zur Kundenaktualisierung nicht mehr angezeigt, wenn tatsächlich keine Kundeninformationen geändert wurden.

## [Batch 650.1] Configuration Service

Mit dem Configuration Service lässt sich die Darstellung von Angaben in der Anwendung für einen bestimmten Markt festlegen. Die Einstellungen können von MPC-PM-Benutzern vorgenommen werden. Pro Markt steht genau eine Konfiguration zur Verfügung. Alle anderen Benutzer sehen die Felder anschließend entsprechend der Konfiguration ihres Marktes.

Folgende Einstellungen stehen zur Verfügung:

Das Zeitformat wird per Einzelauswahl festgelegt, entweder als 24-Stunden-Format [hh:mm] oder als 12-Stunden-Format [hh:mm PM]. Über ein Kontrollkästchen lässt sich zusätzlich festlegen, ob auch Sekunden angezeigt werden (hh:mm:ss). Das Datumsformat wird ebenfalls per Einzelauswahl bestimmt, wobei die Reihenfolgen [yyyy mm dd], [mm dd yyyy] und [dd mm yyyy] zur Verfügung stehen. Als Datumstrennzeichen können [-], [/] oder [.] gewählt werden.

Für die Währung ist eine Mehrfachauswahl möglich. Es wird dieselbe Liste verwendet wie im Auswahlfeld „Currency“ in den Customer Details, und es werden die im jeweiligen Markt zulässigen Währungen festgelegt. Das Namensformat wird per Einzelauswahl bestimmt, entweder [First Name, Last Name] oder [Last Name, First Name]. Beim Zahlenformat stehen [1.000,0], [1,000.0] und [1’000.0] zur Auswahl. Die Anzahl der Nachkommastellen wird ebenfalls per Einzelauswahl festgelegt: [No decimal], [1 Decimal] oder [2 Decimals]. Die Sprachen eines Marktes werden per Mehrfachauswahl bestimmt, und zwar aus derselben Liste wie im Auswahlfeld „Language“ in den Customer Details. Für die Schweiz sind beispielsweise Deutsch, Französisch, Italienisch und Englisch vorgesehen.

## [Batch 882.2] Konfiguration im Markt

Vor dem Go-live konfiguriert der MPC unter Market Settings > Timers & Reminders das Feld „Grace Period Campaign Request Validity". Der Wert ist eine positive ganze Zahl in Kalendertagen und kann je Division (PC/VAN) festgelegt werden. Der Standardwert beträgt 7 Tage. Wird der Wert geändert, gilt er für alle danach eingereichten Anfragen: Das Fälligkeitsdatum ergibt sich aus dem Einreichungszeitpunkt plus der konfigurierten Gültigkeit. Bereits laufende Anfragen behalten das zuvor berechnete Fälligkeitsdatum.

## [Batch 1263.3] Genehmigungsschwelle

Die Genehmigungsschwelle („Approval Threshold") für die Vertragsprüfung wird nun mit der Währung des Landes angezeigt, zu dem der Vertrag gehört, z. B. 1.000 EUR. Format, Trennzeichen und Konformität richten sich wie bei Währungsfeldern nach der Markt-Konfiguration (Market Config).

## [Batch 519.7] Wiederholungen, Fehlerbehandlung und Wiederanstoß

Es sind bis zu neun Versuche vorgesehen, und zwar ungefähr sofort, nach 1 Minute, 5 Minuten, 15 Minuten, 1 Stunde, 3, 6, 12 und 24 Stunden jeweils ab dem vorherigen Versuch, mit begrenztem Zufallsanteil (Jitter). Ein gültiger Retry-After-Wert kann die nächste Wartezeit ersetzen, höchstens jedoch 24 Stunden. Der Verbindungs-Timeout beträgt 3 Sekunden, der Antwort-Timeout 15 Sekunden. Nach Ausschöpfung der Versuche landet das Ereignis in der DLT, es wird ein Betriebsalarm ausgelöst, und ein berechtigter Mitarbeiter kann es manuell erneut anstoßen, wobei die ursprüngliche Ereignis-ID erhalten bleibt. Edge schließt ein Quellereignis erst ab, wenn eine 2xx-Antwort vorliegt und das Zustellergebnis dauerhaft festgehalten wurde. Im ungünstigsten Fall entsteht dadurch ein Duplikat, aber kein unprotokollierter Erfolg.

## [Batch 528.2] User Interface

Für Verträge auf dem Markt Slowakei (SK) wurde ein Feature-Toggle für die Produktivumgebung bereitgestellt.

