# Material zu 2 Ohne Unterkapitel-Zuordnung

Kapitel 2 Zugang, Rollen und Berechtigungen. 12 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 873.2] Filter „Sales Channel" und Zugriffsrechte

In den erweiterten Filteroptionen (More Filter) der Angebotsverwaltung (Contract Generation), des Vertragsmanagements und der MO-Prüfungen (MO Checks) steht der neue Filter „Sales Channel" zur Verfügung. Er bietet die Optionen „Retail" und „Leasing"; voreingestellt ist „Retail", was der bisherigen Ansicht entspricht. Die beiden Ansichten schließen sich gegenseitig aus: Bei der Auswahl „Leasing" werden ausschließlich Leasing-Verträge angezeigt. In der Angebotsverwaltung und im Vertragsmanagement stehen der Filter und die Zugriffsbeschränkung in identischer Form zur Verfügung.

Leasing-Verträge sind nur für Anwender mit der Rolle MO oder MPC sichtbar. Händler sehen die Option „Leasing" in keinem Bildschirm, Leasing-Verträge sind aus allen händlerseitigen Listen ausgeschlossen und lassen sich auch nicht über einen direkten Link (URL) öffnen. Händler können Leasing-Verträge weder einsehen noch bearbeiten oder Aktionen darauf ausführen. Dies wird auf Ebene von API und Berechtigungen serverseitig durchgesetzt und nicht nur in der Oberfläche ausgeblendet.

## [Batch 864.2] Filter „Sales Channel“ und Zugriffsbeschränkung

Im Proposal Management und im Contract Management steht im erweiterten Filter („More Filter“) das neue Feld „Sales Channel“ zur Verfügung. Es bietet in beiden Ansichten dieselben Optionen: „Retail“ (Standardvorgabe, entspricht der bisherigen Ansicht) und „Leasing“. Die Ansichten schließen sich gegenseitig aus: Bei Auswahl von „Leasing“ werden ausschließlich Leasing-Verträge angezeigt. Auch in den MO Checks gibt es den Filter „Sales Channel“ mit den Optionen „Retail“ (Standard) und „Leasing“.

Nur Benutzer mit der Rolle MO oder MPC können die Option „Leasing“ auswählen und Leasing-Verträge in den Listen sehen. Für Händler wird die Option weder im Proposal Management noch im Contract Management oder in den MO Checks angeboten. Leasing-Verträge sind aus allen händlerseitigen Listen ausgeschlossen und lassen sich auch nicht über einen direkten Link (URL) oder API-Aufruf öffnen. Diese Beschränkung wird auf Server- bzw. Berechtigungsebene durchgesetzt und ist nicht nur in der Oberfläche ausgeblendet.

## [Batch 651.5] Tests zur Vertragsrolle auf Kundenebene

Derzeit wird geprüft, dass der Kundenstatus nach der Verwendung eines Kunden bei der Vertragserstellung korrekt gesetzt wird: „Payer" nach Verwendung als Zahler, „Holder" nach Verwendung als Halter und „Holder & Payer" nach Verwendung in beiden Rollen. Die manuellen Testdurchführungen zur Vertragsrolle auf Kundenebene und zur Download-Funktion für Nacos-Benutzer sind noch offen.

## [Batch 861.2] Einstieg und Zugriff

Die Vertragsverwaltung ist für Verträge vorgesehen, die den Status „ACTIVE“ haben, nachdem sie die Stufen „CREATED“ und „CONFIRMED“ durchlaufen haben. Ein Vertrag gilt als aktiv, wenn Mercedes-Benz ihn aus operativen und finanziellen Gründen für einen Kunden bestätigt hat. In der ersten Ausbaustufe (PI1) wird ein Vertrag automatisch auf „ACTIVE“ gesetzt, sobald er den Status „CONFIRMED“ erreicht. Um einen Vertrag zu öffnen, melden Sie sich mit den entsprechenden Berechtigungen an und wählen den gewünschten Vertrag aus. Anschließend wird die Übersicht angezeigt.

Hinweis: Eine eigene Einstiegsseite der Vertragsverwaltung, über die alle aktiven Verträge angezeigt und ausgewählt werden können, wurde als Anforderung zwar beschrieben, jedoch nicht umgesetzt (Status: abgebrochen). Die Beschreibung dieser Seite sollte daher nicht als verfügbare Funktion verstanden werden.

## [Batch 326.1] Vorbereitung auf zeilenbasierte Zugriffssteuerung (RLS)

Um die Möglichkeit einer zeilenbasierten Zugriffssteuerung (Row-Level Security, RLS) vorzubereiten, wurden die Tabellen der Data Products erweitert. Anhand bestimmter Spalten lässt sich künftig erkennen, ob ein Benutzer einen Datensatz lesen darf. Dafür werden drei Felder benötigt: aq_country_cd für die Einschränkung nach Märkten, legal_entity_div_cd für die Einschränkung nach Divisionen und aq_veh_model_series_cd für die Einschränkung nach Modellreihen. Das Feld aq_country_cd war bereits in allen Tabellen vorhanden. Die beiden anderen Felder wurden ergänzt, und zwar in den Data Products SC Cost, SC VAN Cost und SC Revenue. Die jeweiligen Basistabellen der Vertragsdaten (base_sc_cost_contract bzw. base_sc_revenue_contract) sind bei legal_entity_div_cd ausgenommen. Beim ISP Data Product wurde das Feld aq_veh_model_series_cd neu in das Unified Data Model (UDM) aufgenommen, sofern es dort noch nicht enthalten war. Der Inhalt wird aus der FIN abgeleitet, und zwar aus den ersten drei Stellen nach dem WMC. Anschließend wurde das Feld in die Tabelle des Data Products übernommen. Die zugehörige Dokumentation in Confluence (UDM-, Mapping- und Data-Product-Dokumentation) wird bei Bedarf aktualisiert. Alle Tabellen der Data Products enthalten nun die drei Felder mit befüllten Inhalten. Die Daten sollen aktuell, vollständig und konsistent sein und sowohl für Legacy- als auch für oneSCM-Verträge zur Verfügung stehen.

## [Batch 744.6] Zugriff und Hinweise

Die Detailansicht erreichen Sie, indem Sie die Kostenverwaltung aufrufen und einen bestimmten Vertrag öffnen. Dort wechseln Sie zu den „Payment Details“, wählen die „Workshop Invoice No“ aus und gelangen in die „Detail View“, in der die beschriebenen Werte angezeigt werden.

Bitte beachten Sie, dass die Datei i156 einmal pro Woche erzeugt und verarbeitet wird. Die angezeigten Informationen können daher mindestens eine Woche alt sein. Steht die i156 aus irgendeinem Grund nicht zur Verfügung, werden keine aktualisierten Informationen angezeigt. Zudem dürfen Jobs, die gemeinsame Daten betreffen, nicht gleichzeitig laufen; während des Imports der i156 kann beispielsweise der Job für die i155 nicht gestartet werden.

Die Gestaltung der Oberflächen entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 1214.4] Dashboard für MPC-Anwender

MPC-Anwender gelangen nach der Anmeldung nun direkt auf ihr persönliches Dashboard, damit sie Informationen auf einen Blick sehen und Aktionen schneller ausführen können. Das Dashboard ist die Startseite nach dem Login; auch ein Klick auf das App-Logo führt dorthin. Es zeigt eine Begrüßung mit dem Namen des Benutzers sowie Kacheln als Verknüpfungen zu den bestehenden Seiten: Manage Products and Prices, Manage Vehicle Groups, Manage Campaigns, Manage Templates und Manage Customers.

## [Batch 623.1] Händlerverwaltung (Dealership Management)

Die Validierung der SAP-Debitorennummer wurde angepasst. Bisher war die Nummer auf genau zehn Ziffern beschränkt. Künftig darf das Feld nicht leer sein und muss aus maximal zehn numerischen Ziffern bestehen. Damit werden auch Märkte unterstützt, deren SAP-Nummern kürzer sind, etwa Polen mit acht Ziffern. Beim Upload einer Händlerliste werden Namen mit einer Länge von bis zu 300 Zeichen unterstützt. Umlaute, Sonderzeichen und Großschreibung sind zulässig, zum Beispiel „Autohaus Bortenlänger GmbH und Co. KG". Als eindeutiger Wert gilt nur noch die GSSN-ID; die Eindeutigkeitsprüfung für andere Felder entfällt. Die Änderung ist erfolgreich umgesetzt, wenn oneSCM die Datei zum Upload zulässt. Ein Fehler, bei dem der Upload eines Händlers mit einem 400-Fehler des Servers scheiterte, wurde ebenfalls behoben.

Die Händlerverwaltungstabelle wurde zudem erweitert. Wenn ein Mitarbeiter der Marktorganisation im Namen eines Händlers einen Vertrag anlegt, unterstützt die Tabelle nun diesen Fall, sobald in der Generierung ein Händler zugewiesen wird. Die Händlerdetails stammen dabei aus ALICE und enthalten die GSSN-ID des Verkäufers.

Bei der Registrierung eines Händlers wurden mehrere Fehler behoben: Der Absenden-Button war dauerhaft deaktiviert, ein neuer Händler vom Typ „Market" konnte nicht angelegt werden, und Validierungsmeldungen wurden doppelt mit demselben Text angezeigt.

## [Batch 626.1] Händlerdaten im Vertrag

Auf der Seite für Kunden- und Zahlungsinformationen gibt es einen neuen Abschnitt „Dealer Details". Er wird genutzt, wenn eine Mobilitätsorganisation (MO) einen Servicevertrag im Auftrag eines bestimmten Händlers verkauft. Das Feld für die E-Mail-Adresse akzeptiert nur gültige E-Mail-Formate. Der Händlername und der Ort werden jeweils als Dropdown mit allen möglichen Varianten aus GSSN angeboten, wobei der Ort sich auf den gewählten Händler bezieht. Der Name des Verkäufers wird ausgegraut angezeigt und stammt aus Alice/GSSN. Der Abschnitt gilt ausschließlich auf Vertragsebene, nicht in der Kundenverwaltung. Die Felder werden gegen die geltenden Regeln validiert. Für die Bearbeitung gelten dieselben Regeln wie bei Kunden: In den Status „Waiting for Confirmation" und „In Confirmation" sind keine Änderungen möglich. Änderungen werden an die zuständige Domäne zurückgemeldet und in der Kundenhistorie festgehalten.

## [Batch 627.1] Händlerinformationen im Bereich „Kunden- und Zahlungsinformationen"

Im Bereich „Kunden- und Zahlungsinformationen" wird ein neuer Abschnitt mit dem Namen „Händlerinformationen" ergänzt. Bisher waren an dieser Stelle keine Angaben zum Händler hinterlegt. Der Abschnitt dient dazu, Details zum Verkäufer anzuzeigen, wenn die Marktorganisation einen Servicevertrag im Auftrag eines bestimmten Händlers verkauft. Das Feld „E-Mail" akzeptiert ausschließlich Eingaben im E-Mail-Format. Das Feld „Händlername" bietet eine Auswahlliste mit allen möglichen Varianten aus GSSN. Das Feld „Stadt" bietet eine Auswahlliste mit allen möglichen Varianten aus GSSN, die zum gewählten Händler gehören. Der Verkäufername wird ausgegraut dargestellt, da er aus dem Quellsystem (Alice/GSSN) übernommen wird. Die Felder gelten ausschließlich auf Vertragsebene und nicht in der Kundenverwaltung. Die Felder werden gegen die geltenden Regeln validiert. Änderungen werden an die zuständige Domäne zurückgemeldet.

## [Batch 993.3] Kunden-Tab für B2B

Der Kunden-Tab war bisher auf B2C ausgerichtet, wo eine Person Halter und Zahler sein kann oder Halter und Zahler zwei verschiedene Personen sind. Für B2B wurde die Ansicht angepasst, sodass Händler und MO die relevanten Vertragsinformationen sehen. Dies gilt für Contract Generation und Contract Management. Der Kunden-Tab enthält zwei Unter-Tabs.

Der Unter-Tab „Company“ zeigt Kundentyp (zum Beispiel Commercial), Kundennummer, Kundenname und Vertragsrolle. Außerdem werden die Adresse (Straße, Adresszusatz, Hausnummer, Postleitzahl, Stadt, Land), die Kontaktdaten (Mobilnummer, Festnetznummer, E-Mail-Adresse) sowie VAT Classification, VAT ID und SAP-Debitorennummer angezeigt. Der Unter-Tab „Contact Person“ enthält Vorname, Nachname, Sprache, Rolle, Telefonnummer und E-Mail-Adresse.

## [Batch 1118.2] Hinweis zu „Leasing Operator Role and functionalities"

Für dieses Thema liegen in den Rohdaten nur leere Vorlagentexte vor, also keine inhaltlichen Angaben zu Rolle, Funktionen, Nutzern, Ziel oder Verhalten. Ein Handbuchtext lässt sich daraus nicht formulieren, ohne Inhalte zu erfinden. Sobald das Ticket ausgearbeitet ist, kann der Abschnitt ergänzt werden.

