# Material zu 21 Ohne Unterkapitel-Zuordnung

Kapitel 21 Spartenspezifische Themen. 16 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 189.2] Aufteilung nach Divisionen PC und Van

Für die Aufteilung der Organisation in die Divisionen PC und Van wurden im Bereich Revenue Management Anpassungen vorgenommen, damit Benutzer beider Divisionen eine passende Anwendung vorfinden. Zuvor kannte die Anwendung keine Rollen für die Divisionen PC oder Van. Der Zugriff auf Daten wird nun je Division per Berechtigung eingeschränkt, ebenso die Ansicht in der Benutzeroberfläche. Dies gilt für alle Rollen. Händler sehen nur Daten, die zur Organisationseinheit des Händlers gehören und zu ihrer divisionsspezifischen Berechtigung passen.

Dafür gibt es zwei neue Rollen. Benutzer mit der Rolle PC greifen nur auf PC-Daten zu und sehen in der Oberfläche nur PC-Optionen. Benutzer mit der Rolle Van greifen nur auf Van-Daten zu und sehen nur Van-Optionen. Sind einem Benutzer beide Rollen zugewiesen, hat er Zugriff auf Daten und Ansichtsoptionen beider Divisionen. Die Zugriffsbeschränkungen wurden für die Rollen Dealer, Dealer+, MO, MPC und HQ Admin in den Bereichen Revenue Management und Cost Management geprüft.

Für die Batch-Jobs ist im Zusammenhang mit der Divisionsaufteilung keine Anpassung vorgesehen. Sie müssen derzeit nicht an die Aufteilung angepasst werden.

## [Batch 939.1] Aufteilung der Contract Generation nach Divisionen (PC/Van)

Mit der Aufteilung der Organisation in die Divisionen PC und Van wurde die Contract Generation so angepasst, dass Benutzer in beiden Divisionen ein passendes Arbeitsumfeld vorfinden. Bisher kannte die Anwendung keine Rollen für die Divisionen PC oder Van. Nun wird der Datenzugriff per Berechtigung je Division eingeschränkt. Zusätzlich wird die Ansicht der Benutzeroberfläche entsprechend begrenzt. Diese Einschränkungen gelten für alle Rollen. Für Händler sind Ansichten und Zugriffe zudem auf die Daten beschränkt, die zur Organisationseinheit des Händlers gehören, und zwar unter Berücksichtigung der divisionsspezifischen Berechtigung.

Dafür wurden zwei neue Rollen eingeführt: PC und Van. Benutzer mit der Rolle PC können ausschließlich auf PC-Daten zugreifen und sehen in der Oberfläche nur die Optionen der PC-Division. Benutzer mit der Rolle Van haben nur Zugriff auf Van-Daten und sehen nur die Optionen der Van-Division. Sind einem Benutzer beide Rollen zugewiesen, kann er die Daten und Ansichtsoptionen beider Divisionen nutzen. Die Zugriffsbeschränkungen betreffen die Bereiche Contract Generation und Contract Management und sind für die Rollen Dealer, Dealer+, MO, MPC und HQ Admin vorgesehen.

## [Batch 181.1] Divisionsbezogene Zugriffsrechte

In oneSCM richtet sich der Datenzugriff nach den Divisionen, die einem Benutzer zugewiesen sind. Das gilt für die Rollen HQ Admin, MPC und MO. Ist einem Benutzer nur die Division VAN zugewiesen, sieht er in den relevanten Modulen ausschließlich VAN-Daten und kann nur mit diesen arbeiten. Hat ein Benutzer nur Zugriff auf die Division PC, sind entsprechend nur PC-Daten sichtbar und bearbeitbar. Sind einem MPC oder MO sowohl die PC- als auch die VAN-Rolle zugewiesen, kann der Benutzer in allen Modulen die Daten beider Divisionen einsehen.

## [Batch 1144.4] Auswahl und Anzeige der Division

Die Auswahl einer Division ist bei Kampagnen ein Pflichtfeld. Besitzt ein Benutzer ausschließlich die Rolle Vans, werden die Division-Optionen entsprechend dieser Berechtigung angezeigt. In der Tabelle wird zusätzlich eine Spalte „Division“ dargestellt. Der Division-Filter erscheint nur, wenn der Benutzer sowohl die Berechtigung für VAN als auch für PC besitzt; Benutzer mit nur einer der beiden Berechtigungen sehen ihn nicht. Wird eine Division ausgewählt, filtert das die Tabellendaten entsprechend, und die Sortierung funktioniert weiterhin.

## [Batch 731.2] Übersicht und Suche

Die Übersichtsseite zeigt alle in oneSCM verfügbaren Schadencodes und ermöglicht die gezielte Suche. Als Hauptkriterien stehen Schadencode, Schadenstyp (Einfachauswahl), Beschreibung des Schadencodes und Beschreibung des Schadenstyps zur Verfügung. Über „Weitere Filter“ lässt sich zusätzlich nach Division (Mehrfachauswahl) und Markt (Dropdown mit Mehrfachauswahl) eingrenzen. Wählen Sie beispielsweise den Markt DE, werden nur die für DE spezifischen Schadencodes angezeigt. Wählen Sie „General (ALL)“, erscheinen die Schadencodes, die für alle Märkte verfügbar sind.

Mit der Schaltfläche „Search“ wird das Filterfenster geschlossen, und alle gewählten Optionen erscheinen im Filterbereich als Tags im Format „Filtername: gewählte Option“. Jedes Tag besitzt ein „X“, mit dem sich die jeweilige Auswahl entfernen lässt. Mit „Cancel“ werden alle Änderungen verworfen. Änderungen in den Filterfeldern wirken sich nicht automatisch auf die Suchergebnisse aus.

Der Ergebnisbereich zeigt für jeden Schadencode Division, Markt, Damage Reference, Schadencode, Schadenstyp, Beschreibung des Schadencodes, Beschreibung des Schadenstyps und Aktionen. Die Aktionen werden in anderen Epics umgesetzt. Alle Spalten außer „Aktionen“ sind sortierbar, standardmäßig wird alphabetisch nach der Spalte Division sortiert. Pro Seite werden standardmäßig 10 Einträge angezeigt; wählbar sind 10, 20, 30, 40 und 50.

## [Batch 225.5] NACOS: E174 und E169

Die E174-Schnittstelle wurde gemäß dem NACOS-Feedback angepasst. Als Gruppenname wird der Wert „E174-SC“ übernommen. Die Business Division hat die Länge 4 (Position 75 bis 78) und lautet entweder „268V“ oder „268C“: „268C“ gilt für Pkw, „268V“ für Transporter (Van). Das Feld „Reserve for additional BSSEG Fields“ umfasst 10 Zeichen. Außerdem wurde der fehlerhafte Revenue-Bereich in der Datei E174_AfterSales korrigiert.

Bei E169 wurden die Rechnungstypen geändert: EXTSUB wird zu ESUB und EXTSER zu ESER.

## [Batch 315.2] Preisinformationen für MBD-Vans

Für das Reporting zu MBD-Vans stehen jetzt der Vertragsnettopreis und der Vertragsnettopreis pro Kilometer zur Verfügung. In den UDMs heißen die Felder „contract_net_price“ und „contract_net_price_per_km“. Im Datenprodukt Revenue, Tabelle base_sc_revenue_contract, heißen sie „contract_net_price_amt“ und „contract_net_price_per_km_amt“. Bei den Altsystemen stammt der Vertragsnettopreis aus den Bestandsberichten von ICON und Asset (Feld „CustomerNetPrice2“; Sirius ist nicht betroffen). Der Nettopreis pro Kilometer stammt aus dem DDECost-Bericht von ICON, Asset und Sirius (Feld „realPriceCentPerMile“). Aus oneSCM wird der Nettopreis pro Kilometer nicht geliefert.

## [Batch 496.4] Optionale Angaben

Optional können Sie Division, Marke und Sprache festlegen. Als Division wählen Sie im MVP „PC"; „Van" soll nach dem MVP folgen. Als Marke wählen Sie im MVP „Mercedes-Benz"; „Smart" ist für die Zeit nach dem MVP vorgesehen. Die Sprache richtet sich nach der Marktrolle des Benutzers; im MVP wird Englisch angezeigt.

## [Batch 552.4] Händlerregistrierung bei mehreren Warranty-IDs

Für einen Händlerstandort können in GSSN+ mehrere externe Schlüssel (Warranty-IDs) vorliegen, etwa je eine pro Division (PC und VAN). Der Schlüssel ist unabhängig von der Division stets derselbe. Haben alle vorhandenen Warranty-IDs denselben Wert, wird der Händler registriert. Unterscheiden sich die Werte, erscheint eine Fehlermeldung, und die Registrierung des Händlers ist nicht möglich.

## [Batch 883.2] Utility: Neuer Reiter „Payment"

Der Bereich Utility erhält eine Unterteilung in Reiter. Der bisherige einzelne Schalter befindet sich nun im Reiter „General", zusätzlich gibt es den neuen Reiter „Payment". Dieser folgt der bekannten Aufteilung in Passenger Cars (PC) und Vans (VAN), abhängig von den Berechtigungen des Marktes. Er enthält den Schalter „Allow Bank Transfer for Private Customers". Der Schalter ist standardmäßig ausgeschaltet und kann für jede Sparte unabhängig eingestellt werden. Damit legt der Administrator fest, ob ein Markt die Banküberweisung für Privatkunden überhaupt anbieten darf. Änderungen werden wie bei anderen Utility-Einstellungen protokolliert; angezeigt werden der Benutzer und der Zeitpunkt der Änderung. Die Konfiguration der digitalen Zahlung (MPay, Supported Payments) bleibt weiterhin in den Mpay Configurations und ist wie bisher vom Payment-Reiter aus verlinkt.

## [Batch 1178.3] Abruf aus GO (Pkw)

Wenn der Job „GetDeliveryDateGlobalOrder" läuft, fragt das System GO anhand der Auftragsnummer ab. Aus der Antwort liest es das Feld „DateTo" innerhalb des Elements „TargetDeliveryDate" aus. Dieses Feld enthält den relevanten Liefertermin. Ist das Feld befüllt, meldet das System den Termin an CONTRACT. Ist es leer, erfolgt für diesen Auftrag in diesem Lauf keine Meldung. In den folgenden geplanten Läufen fragt das System den Auftrag erneut ab, bis ein Liefertermin vorliegt und übermittelt werden kann.

## [Batch 493.4] Optionale Felder

Optional können Sie weitere Angaben machen. Im Dropdown „Division" wählen Sie den Bereich, für den die Vorlage erstellt wird; im MVP ist das PC, Van soll nach dem MVP berücksichtigt werden. Im Dropdown „Brand" wählen Sie die Marke; im MVP ist das Mercedes-Benz, Smart soll nach dem MVP folgen. Das Dropdown „Language" richtet sich nach der Marktrolle des Benutzers; im MVP wird Englisch angezeigt.

## [Batch 494.4] Optionale Felder

Zusätzlich können Sie die Division angeben, für die die Vorlage erstellt wird. Im MVP wählen Sie hier PC; Van soll nach dem MVP berücksichtigt werden. Beim Feld „Brand" wählen Sie im MVP Mercedes-Benz; Smart soll später folgen. Die Sprache richtet sich nach der Marktrolle des Benutzers und ist im MVP Englisch.

## [Batch 891.2] Konfiguration und Geltungsbereich

Die Gültigkeitsdauer (Offer Validity) wird in den Markteinstellungen hinterlegt und für jede Division getrennt gepflegt, also für PC und VAN. Der konfigurierbare Wert beträgt mindestens 0,05 Tage (etwa eine Stunde). Empfohlen wird ein Höchstwert von 95 Tagen. Zwar lassen sich auch höhere Werte einstellen, dies kann jedoch zu Problemen auf Seiten von DSS führen. Die Funktion gilt für die Kundentypen Privat, Privat Behörden, Gewerbe, Gewerbe Flotte und Gewerbe Behörden sowie für den Vertriebskanal Retail.

## [Batch 8.3] TO-Gruppen

Bei der Anlage einer TO-Gruppe wird nun ein doppelter Gruppenname erkannt. Zudem lässt das Feld „Gruppenname“ keine Sonderzeichen mehr zu. Die Sortierung nach Gruppenname und Division funktioniert jetzt korrekt.

## [Batch 210.4] Bearbeiten und Löschen

Die Aktion „Bearbeiten" ist nur sichtbar, wenn die Materialnummer erst in der Zukunft gültig wird. Es öffnet sich eine neue Seite, auf der Division und Produktlinie mit den Daten der gewählten Materialnummer vorbelegt sind. Je nach Typ wird der passende Bereich für Kunde, MOT oder Old Part Tax angezeigt. Bearbeitbar sind Materialnummer, „Valid From" und „Valid To". Erfolg und Fehler werden über Toast-Meldungen angezeigt.

Eine Materialnummer kann nur gelöscht werden, wenn sie nicht in Verwendung ist und in der Zukunft liegt. Auch hier erscheinen Toast-Meldungen für Erfolg und Fehler.

