# 5 Fahrzeug, Produkt und Angebot vorbereiten

Dieses Kapitel beschreibt den ersten Teil der Vertragserstellung in oneSCM: Sie wählen den Kundentyp, identifizieren das Fahrzeug über eine Kennung, prüfen die Fahrzeugdaten, wählen ein Produkt, konfigurieren Laufzeit, Laufleistung und Optionen, wenden Kampagnen und Rabatte an und erzeugen ein Angebot. Die Übergabe in die Antragserstellung mit Kunden- und Zahlungsdaten beschreibt Kapitel 6; die Anlage und Pflege von Kunden Kapitel 4; die Pflege von Produkten, Preisen und Kampagnen durch den Markt Kapitel 14.

## 5.1 Vertragsarten und Einstiegspunkte

**Zweck.** Im Modul „Contract Generation“ erstellen Sie Serviceverträge für Pkw und Vans. Das Menü „Contract Generation“ in der Kopfzeile führt zu zwei Bereichen: „Contract Offering“ startet die Vertragserstellung mit der Produktauswahl; „Proposal Management“ (in älteren Oberflächenständen „Offer Management“) zeigt alle Angebote und Verträge, die den Status „Active“ noch nicht erreicht haben, und ist der Ausgangspunkt für Aktionen an bestehenden Angeboten. Aktive Verträge wechseln in das Vertragsmanagement (Kapitel 10).

**Voraussetzungen.** Sie sind mit einer Rolle angemeldet, die zur Vertragserstellung berechtigt ist. Das Menü „Contract Generation“ erscheint nur für berechtigte Benutzer. Für Ihren Markt und Ihre Sparte sind veröffentlichte Produkte mit gültiger Preisversion vorhanden (Kapitel 14). Beim ersten Aufruf akzeptieren Sie die Nutzungsbedingungen.

**Rollen.** Verträge erstellen die Rollen Dealer, Dealer+, MO (Market Operations), MPC und Key Account Manager (KAM). Händler sehen nur Angebote, Verträge und Kunden ihrer eigenen Outlet-ID (GS-ID). Alle Rollen sehen ausschließlich die Daten ihrer Sparte (Pkw oder Van); Benutzer mit beiden Sparten sehen beide. Die Rolle Dealer+ ist für besondere Verkaufssituationen vorgesehen und darf zusätzlich Produkte und Kampagnen der Vertriebsebene MO/MPC verkaufen (Kapitel 5.4). Leasingverträge, die MBLD über die Schnittstelle anlegt, sind nur für MO und MPC sichtbar; der Filter „Sales Channel“ („Retail“, „Leasing“) im Proposal Management, im Vertragsmanagement und in den MO Checks blendet sie ein, Händler erhalten diese Option nicht.

**Vertragsarten.** oneSCM unterscheidet Produkte nach ihrer Konfigurationslogik und ihrem Ablaufkriterium:

- Produkte nach Zeit und Laufleistung (zum Beispiel die Produktlinie „Excellent“): Sie wählen Laufzeit, jährliche Laufleistung und Zahlungsintervall. Der Vertrag endet mit dem geplanten Enddatum (Ablaufkriterium TIME) oder mit dem Enddatum beziehungsweise dem Erreichen der geplanten Laufleistung (TIME_OR_MILEAGE).
- Kontingentprodukte (Ablaufkriterium CONTINGENT): Der Kunde erwirbt eine Anzahl von Serviceleistungen; der Vertrag endet, wenn alle Leistungen verbraucht sind.
- Reifenprodukte und komplexe Produkte mit Reifenoption: Zusätzlich zu Laufzeit und Laufleistung konfigurieren Sie Reifenart, Reifengröße, Wetterprofil, Felge und Anzahl der Reifen.

Jedem Produkt ist ein Vertragstyp zugeordnet: „Standalone“ für die Abläufe in oneSCM, „Leasing“ für Verträge aus dem MBLD-Ablauf und „Finance“ für den Finance-Ablauf. Der Typ erscheint nach der Aktivierung im Feld „Contract Type“ auf dem Reiter „Contract“. Der Vertragsprozess selbst ist für alle Vertragsarten gleich; Kapitel 5.5 beschreibt die Besonderheiten der Konfiguration.

**Kundentypen.** Beim Start eines Vertragsangebots ist der Kundentyp „Private“ vorausgewählt. Zur Auswahl stehen außerdem „Commercial“ (Gewerbekunde), „Commercial Fleet“ (Gewerbe-Flottenkunde), „Private Governmental“ und „Commercial Governmental“ (Behördenkunden). Der Kundentyp „Leasing Commercial Customer“ ist dem MBLD-Ablauf vorbehalten. oneSCM übermittelt den Kundentyp bei der Produktabfrage, sodass nur Produkte erscheinen, die diesem Kundentyp zugeordnet sind. Bei gewerblichen Kundentypen erscheint zusätzlich das Pflichtfeld „Industry“ (Branche) mit dem Standardwert „Not Relevant“; die Auswahl begrenzt die Produktliste auf Produkte mit passender Branchenzuordnung (Kapitel 5.5). Für Behördenkunden erfassen Sie später in den Kundendaten das Feld „Affiliate“ („Embassy“ als Standardwert; bei „Commercial Governmental“ wählbar aus „Embassy“, „Army“ und „NATO“). Für Verträge, bei denen das Autohaus selbst Vertragsinhaber und Zahler ist (eigener Bestand, Vorführfahrzeuge), steht eine eigene Variante der Erstellungsabläufe zur Verfügung.

**Einstiegspunkte.** Die Produktauswahl ist von der eigentlichen Vertragserstellung entkoppelt: Sie beginnen mit der Kennung, die Ihnen gerade vorliegt, lassen sich alle passenden Produkte anzeigen und entscheiden dann, wie Sie fortfahren. Das Eingabefeld für die Kennung wird nach der Wahl des Kundentyps freigeschaltet; es trägt die Beschriftung „Baumuster | FIN/VIN | Auftragsnummer“ und zeigt darunter den Hinweis „Enter a valid Chassis Number, Order Number or Model Code“. Das System erkennt anhand des Formats selbst, um welche Kennung es sich handelt, und benennt das Feld entsprechend um. Eine Auswahl des Ablaufs über ein Dropdown ist nicht erforderlich. Je Kennung ergibt sich der weitere Ablauf:

| Phase | Kennung | Ablauf |
|---|---|---|
| Preisindikation vor Bestellung | Baumuster (Model Code, BM6) | Produkte und Preise für das Fahrzeugmodell; für ein Angebot ist eine weitere Kennung erforderlich |
| Fahrzeug im Verkaufsprozess (Retail of the Future) | OTR-Deal-ID | Fahrzeugdaten aus One Touch Retail; FIN folgt über die Systemübergabe |
| Fahrzeug bestellt (Build to Order) | Auftragsnummer (AFAB/GO) oder VerSO-Order-ID | FIN und FRD folgen über das Vehicle Management; der Vertrag wird nach der Zulassung aktiviert |
| Fahrzeug produziert, nicht zugelassen (Build to Stock) | FIN/VIN ohne Erstzulassungsdatum | Kilometerstand 0; FRD und Kennzeichen werden nach der Zulassung ergänzt |
| Fahrzeug zugelassen (Available Chassis Number) | FIN/VIN mit Erstzulassungsdatum | Vollständiger Datensatz, Vertrag kann direkt bestätigt und aktiviert werden |

In der Oberfläche stehen die unterstützten Kennungen in der Reihenfolge Order Number, FIN/VIN, Deal Id und Baumuster. Für Build to Order und Build to Stock werden die fehlenden Fahrzeugdaten nach der Bestätigung ergänzt (Kapitel 5.7). Die Regeln zu Format und Datenabruf der einzelnen Kennungen beschreibt Kapitel 5.2.

**Schritt für Schritt.**

1. Öffnen Sie „Contract Generation“ › „Contract Offering“.
2. Wählen Sie den Kundentyp; bei gewerblichen Kundentypen wählen Sie zusätzlich die Branche.
3. Geben Sie die Kennung ein. Das System lädt die Fahrzeugdaten und zeigt Marke, Division und Verkaufsbezeichnung an (Kapitel 5.2 und 5.3).
4. Ergänzen Sie fehlende Pflichtangaben wie Erstzulassungsdatum, Kilometerstand und Kennzeichen (Kapitel 5.3).
5. Wählen Sie ein Produkt (Kapitel 5.4) und konfigurieren Sie es (Kapitel 5.5 und 5.6).
6. Erstellen Sie das Angebot und übergeben Sie es in die Antragserstellung (Kapitel 5.8).

**Ergebnis und Systemstatus.** Nach der Produktauswahl liegt noch kein Vertrag vor; eine Referenznummer und der Status „Created“ entstehen erst mit der Übergabe (Kapitel 5.8). Angebote erscheinen danach im Proposal Management mit den Spalten Contract Number (als Link), Product Name, Status, Proposal Validity, Chassis Number, License Plate, Customer Name, Created On, Confirmed On, Created By und Actions. „Created By“ nennt das System, das den Vertrag angelegt hat (zum Beispiel oneSCM oder MBLD). Unter „More Filters“ filtern Sie nach Kundentyp, VAT ID, Angebotsgültigkeit, Erstellungsdatum, Bestätigungsdatum, Produktname und Sales Channel; für Datumsfilter genügt ein „Von“- oder ein „Bis“-Datum. Das Feld „Reference Number“ der Suche akzeptiert auch die externe Vertragsnummer (Kapitel 5.7). Die Spalte „Actions“ öffnet über „…“ ein Menü mit den für das Angebot zulässigen Aktionen, etwa „Update“ für fehlende Fahrzeugdaten oder „Retrigger Signature“.

**Deep Link.** Externe Systeme wie OTR verlinken direkt in die Produktauswahl. Der Link `.../contract-generation/generate/product-selection` nimmt die optionalen Parameter `customerType` (privateCustomer, commercialCustomer, commercialFleet, privateGovernmental, commercialGovernmental) und `vehicleIdentifier` (Baumuster, Auftragsnummer, Deal-ID, FIN/VIN) an. Die Felder werden vorbelegt und bleiben editierbar. Ein nicht unterstützter Kundentyp führt ohne Fehlermeldung zum Standardkundentyp „Private“; eine ungültige Kennung erzeugt die üblichen Fehlermeldungen. Sind Sie nicht angemeldet, melden Sie sich zuerst an; fehlen Berechtigungen, wird der Zugriff mit einer Fehlermeldung verweigert.

**Hinweise.**

- Die Massenerstellung von Verträgen für mehrere identische Fahrzeuge eines Flotten- oder Behördenkunden („Add Multiple Vehicles“, „Mass Creation“) ist in Kapitel 12.9 beschrieben. Sie steht für FIN/VIN mit FRD, Build to Order, Build to Stock und VerSO-Order-ID zur Verfügung, nicht für den Baumuster-Ablauf.
- Externe Systeme legen Verträge über den Edge Service an (MBLD, Online Sales). Diese Abläufe sind in Kapitel 19 beschrieben.
- Produkte und Preise für Preisindikationen können Marktbenutzer ohne Vertragsanlage auf der Seite „Product Testing“ prüfen (Kapitel 14.8).

Quellen: Batch 999.1, 999.2, 1010.1, 1019.2, 1024.2, 1041.1, 1055.1, 1057.1, 1079.4, 1090.4, 993.4, 1091.1, 1100.1, 1102.2, 894.1, 1112.1, 1097.2, 1253.1, 942.1, 988.1, 878.1, 984.3, 1102.2, 943.1, 1048.1, 1051.1, 863.2, 910.1, 918.1, 906.1, 1005.2, 1013.1, 1153.1, 1004.1, 1044.1, 1053.1, 933.2, 932.2, 986.1, 1203.1

## 5.2 Fahrzeug- und Vorgangskennungen

**Zweck.** Die Kennung identifiziert das Fahrzeug oder den Verkaufsvorgang und bestimmt, welche Fahrzeugdaten oneSCM laden kann und welche Angaben Sie selbst ergänzen. Beim Start eines Angebots können Sie das Fahrzeug über eine oder mehrere der folgenden Angaben identifizieren: Fahrgestellnummer (FIN/VIN), Auftragsnummer, Deal-ID, VerSO-Order-ID oder Baumuster.

**Formatregeln.**

| Kennung | Format | Prüfung in der Oberfläche |
|---|---|---|
| FIN/VIN (Chassis Number) | genau 17 alphanumerische Zeichen in Großbuchstaben | Kleinbuchstaben werden in Großbuchstaben umgewandelt; Sonderzeichen wie „@“, „$“, „&“, „-“ oder „#“ werden verworfen; mehr als 17 Zeichen werden abgeschnitten; bei weniger als 17 Zeichen erscheint der Hinweis, dass die Fahrgestellnummer nicht existiert |
| Auftragsnummer (Order Number, AFAB/GO) | numerisch, bis zu 10 Zeichen | Existiert zur Nummer kein Baumuster, erscheint „Enter a valid chassis number, order number or 6 digit model code“ |
| Baumuster (Model Code, BM6) | Pkw: sechs Stellen; Vans: sechs bis acht Stellen | Ein nicht veröffentlichten Produkten zugeordnetes Baumuster liefert „Your Identifier did not return any results …“ |
| OTR-Deal-ID | 36 alphanumerische Zeichen einschließlich Bindestrichen (UUID) | Erzeugt in One Touch Retail; Sie kopieren den Wert in das Feld „Contract Proposal Identifier“ |
| VerSO-Order-ID | genau 12 Ziffern | Ohne zugeordnete Auftragsnummer erscheint „Enter a valid Chassis Number, Order Number, Model Code, Deal ID or Verso Order ID“ |

Jedes Mercedes-Benz Fahrzeug besitzt eine FIN, nicht jedes Fahrzeug eine VIN. Für die Prüfung auf bestehende Verträge gelten FIN und VIN desselben Fahrzeugs als dieselbe Kennung (Kapitel 5.3). Die externe Vertragsnummer von Flottenkunden oder externen Systemen ist keine Fahrzeugkennung; sie wird ab dem Status „Waiting for Confirmation“ am Vertrag erfasst (Kapitel 5.7).

**Fahrgestellnummer (FIN/VIN).** Nach der Erkennung ruft oneSCM beim Vehicle Management die Fahrzeugdaten ab: Erstzulassungsdatum (FRD), letzte Service-Laufleistung, Marke, Division und Verkaufsbezeichnung. Das Vehicle Management nutzt dafür VeDoc und die digitale Serviceakte (DSB), sodass bei der Produktauswahl aktuelle Service- und Laufleistungsinformationen vorliegen. Gelieferte Werte werden schreibgeschützt angezeigt; fehlende Werte erfassen Sie manuell (Kapitel 5.3). Mit dem Schalter „Erstzulassungsdatum nicht verfügbar“ („FRD unavailable“) kennzeichnen Sie ein produziertes, noch nicht zugelassenes Fahrzeug (Build to Stock); der Kilometerstand steht dann schreibgeschützt auf 0. Für eine Fahrgestellnummer, der gerade ein Erstzulassungsdatum zugewiesen wurde, steht Build to Stock nicht mehr zur Verfügung.

**Auftragsnummer (Build to Order).** Das Vehicle Management fragt über die Order-API Fahrgestellnummer und Baumuster zur Auftragsnummer ab. Liegt eine Fahrgestellnummer vor, wird sie schreibgeschützt angezeigt; sonst steht im Feld „Not Available“. Das Baumuster erscheint schreibgeschützt; daraus ermittelt das System Marke, Division und Verkaufsbezeichnung. Der Händler ist nicht das erste Eingabesystem für eine Fahrgestellnummer, die zu einer Auftragsnummer oder Deal-ID gehört: Das Vehicle Management fragt die fehlende Fahrgestellnummer wiederholt bei den angebundenen Systemen ab und übernimmt sie in den Vertrag, sobald sie vorliegt. Bis dahin ist die Aktivierung gesperrt; Händler und Marktorganisation ergänzen am Vertrag ausschließlich FRD und Kennzeichen (Kapitel 5.7). Die Auftragsnummer wird beim Start des Angebots gespeichert und im Reiter „Fahrzeug“ der Übersicht angezeigt.

**OTR-Deal-ID.** Kunde und Händler wählen das Fahrzeug in One Touch Retail (OTR) aus; OTR erzeugt die Deal-ID. Anhand der Deal-ID fordert die Vertragserstellung die Fahrzeugdaten bei der Produktdomäne an, die sie aus oneSCM oder durch Abruf bei OTR liefert: BM6, Marke, Division, Verkaufsbezeichnung, SA-Codes sowie, falls vorhanden, FIN/VIN. Liefert OTR mehrere Fahrzeuge zur Deal-ID, verarbeitet das System auch diesen Fall. Da sich die Fahrzeugkonfiguration in OTR ändern kann, fragt ein automatischer Lauf regelmäßig die aktuellen Daten für Deal-IDs ab, deren Vertrag noch nicht aktiviert ist, darunter FIN/VIN, Erstzulassungsdatum und Kennzeichen; sobald eine Fahrgestellnummer vorliegt, wird sie an den Vertrag übergeben. Ist OTR nicht erreichbar, erhalten Sie eine Fehlermeldung. Mit einer Deal-ID stehen Technische Optionen und der Sonderfall zur Verfügung. Ein Vertrag lässt sich mit einer Fahrgestellnummer sowohl mit als auch ohne zugeordnete Deal-ID anlegen; die Deal-ID wird an die Dokumente übergeben. OTR liefert zur Deal-ID auch den Kundentyp; stimmt er nicht mit dem zu Beginn gewählten Kundentyp überein, stoppt der Ablauf bei „Create Proposal“ mit der Meldung „The selected customer type ({CT_selected}) does not match the customer type associated with Deal ID. Please restart the proposal process and select the correct customer type.“ Starten Sie das Angebot dann mit dem passenden Kundentyp neu. Bei anderen Kennungen findet diese Prüfung nicht statt.

**VerSO-Order-ID.** Die VerSO-Order-ID ist ein von VERSO erzeugter zwölfstelliger Code (Testbeispiel: 675506378906) und gilt für alle Kundentypen, Branchen und Sparten. Voraussetzung ist, dass ihr eine Auftragsnummer zugeordnet ist. oneSCM ruft über den Fahrzeug-Microservice die Fahrzeugdaten und über den Produkt-Microservice Produkte, Konfigurationen und Preise ab. VerSO-Order-ID und zugehörige Auftragsnummer werden beide im Vertrag gespeichert, in der Oberfläche angezeigt und an die Dokumente übergeben: in „Übersicht und Bestätigung“ unter „Vehicle Information“ als „Order Number (VerSO)“ und „Order Number (AFAB/GO)“, in der Vertragsdetailansicht auf dem Reiter „Vehicle“. Fehlt ein Wert, erscheint „-“. Die Übersicht verhält sich wie bei der Auftragsnummer; nicht verfügbare Angaben zeigen „Not yet Available“. Enthält die Auftragsnummer eine Fahrgestellnummer, aktualisiert das System den Vertrag automatisch, sobald der Fahrzeug-Microservice sie liefert.

**Baumuster (Model Code).** Mit dem Baumuster ermitteln Sie Produkte und Preise, bevor eine Fahrzeugkennung vorliegt. Marke, Division und Verkaufsbezeichnung werden anhand des Baumusters geladen; der Kilometerstand steht auf 0, ein Erstzulassungsdatum gilt als nicht verfügbar. Für Vans ist ein Baumuster allein nicht eindeutig: Nach der Eingabe ermittelt die Fahrzeugdomäne die verfügbaren Motorarten (D für Diesel, E für Elektro, B für Benzin). Gibt es nur eine Motorart, ist sie vorausgewählt und schreibgeschützt; bei mehreren wählen Sie aus einem Dropdown. Anhand von Baumuster und Motorart werden die Fahrzeuggruppen und die verfügbaren Produkte abgerufen; links erscheinen Marke „Mercedes-Benz“, Sparte „Vans“ und die Liste der Fahrzeuggruppen. Bei der Verkaufsbezeichnung bietet das System alle Werte an, die zu Baumuster und Motortyp passen. Das Van-Baumuster darf sechs bis acht Stellen haben. Um aus einem Baumuster-Angebot einen Vertrag zu erstellen, ergänzen Sie über „Add Identifier“ eine Fahrgestellnummer, Auftragsnummer, Deal-ID oder VerSO-Order-ID (Kapitel 5.8). Dasselbe Baumuster lässt sich dort nicht als zusätzliche Kennung verwenden. Verträge, die über ein Baumuster erstellt wurden, führen das BM6 am Ende des Angebotsprozesses als Fahrzeugkennung.

**Kennung wechseln.** Rechts neben dem Eingabefeld steht die Schaltfläche „X“. Sie löscht die Fahrzeugdetails und die Produktliste, behält den gewählten Kundentyp und gibt das Feld für eine neue Kennung frei. Ein Wechsel des Baumusters aktualisiert die Produktliste.

**Ergebnis.** Nach erfolgreicher Erkennung zeigt das System Marke, Division und Verkaufsbezeichnung als reine Ausgabefelder sowie die geladenen Fahrzeugdaten an und ruft die passenden Produkte ab (Kapitel 5.4). Liefert die Kennung kein Ergebnis, erscheint die Meldung „Your Identifier did not return any results. Please check and adjust your input if needed and try again. Enter a valid Chassis Number, Order Number, or Model Code.“ (Kapitel 5.3).

**Besonderheiten je Sparte.** Der Baumuster-Ablauf mit Motorart und Fahrzeuggruppe gilt nur für Vans; für Pkw genügt das sechsstellige Baumuster. Für Vans sind Baumuster mit sieben und acht Stellen zulässig.

**Hinweise.**

- Verträge über Deal-ID oder Auftragsnummer erhalten die Fahrgestellnummer über die Systemübergabe; eine manuelle Erfassung in oneSCM ist nicht vorgesehen (Kapitel 22.2).
- Die Deal-ID erscheint beim Bearbeiten der Fahrzeugdetails im eigenen Feld, nicht im Feld „Order Number“.
- Die VerSO-Order-ID und die Deal-ID stehen auch in den Dokumentvorlagen als Druckvariablen zur Verfügung (Kapitel 7.4).

Quellen: Batch 891.3, 1039.1, 1010.1, 1005.2, 24.1, 1175.2, 948.1, 948.2, 1160.2, 3.2, 1153.1, 1088.1, 1044.1, 1043.1, 906.1, 1091.1, 1101.2, 998.3, 1013.1, 1113.4, 7.4, 1111.1, 1060.1, 1061.6, 1062.1, 1097.2, 1110.1, 1176.3, 1.5, 1070.2

## 5.3 Fahrzeugdaten, Pflichtfelder und Validierungsregeln

**Zweck.** Die Fahrzeugdaten entscheiden darüber, welche Produkte oneSCM anbietet und zu welchem Preis. Vor der Produktabfrage prüft das System die Eingaben formal, gleicht sie mit den Fahrzeugsystemen ab und stellt sicher, dass das Fahrzeug für einen Servicevertrag infrage kommt.

**Pflichtfelder bei einer Fahrgestellnummer.**

| Feld | Regel |
|---|---|
| Fahrgestellnummer | 17 Zeichen, alphanumerisch, Großbuchstaben (Kapitel 5.2) |
| Erstzulassungsdatum (FRD) | Format TT.MM.JJJJ, manuell oder über die Datumsauswahl; darf nicht in der Zukunft liegen; entfällt bei eingeschaltetem Schalter „Erstzulassungsdatum nicht verfügbar“ (Build to Stock) |
| „Actual Mileage (km)“ | numerisch, bis zu sieben Stellen, höchstens 999.999 km; bei Build to Stock schreibgeschützt 0 |
| Kennzeichen | alphanumerisch, bis zu elf Zeichen, deutsche Sonderzeichen und genau ein Bindestrich zulässig, keine Leerzeichen-Fehler; Pflichtfeld, sobald Fahrgestellnummer und Erstzulassungsdatum vorliegen; bei Build to Stock und Build to Order wird es nach der Zulassung ergänzt |

Erst wenn alle Pflichtfelder gefüllt sind, validiert das System die Eingaben und ruft Produkte ab. Fehlt ein Pflichtfeld, stehen weder Fahrzeuginformationen noch Produkte zur Verfügung, und eine Hinweismeldung nennt das Feld, zum Beispiel „First Registration Date is not filled“. Das Erstzulassungsdatum erscheint nach der Auswahl im Format Tag.Monat.Jahr. Die Kilometerangabe lautet in oneSCM einheitlich „km“.

**Schreibgeschützte und manuelle Werte.** Liefert das Vehicle Management zur Fahrgestellnummer ein Erstzulassungsdatum oder eine Laufleistung, werden diese Werte schreibgeschützt angezeigt und können nicht über andere Bereiche der Seite geändert werden. Nur wenn kein Wert geliefert wird, geben Sie ihn selbst ein; ein in VeDoc hinterlegtes Erstzulassungsdatum überschreibt eine abweichende manuelle Eingabe. Marke, Division und Verkaufsbezeichnung sind immer Ausgabefelder.

**Kilometerstandsprüfung.** Erfassen Sie den Kilometerstand manuell, vergleicht oneSCM ihn mit dem zuletzt bekannten Kilometerstand aus Gewährleistung, Kulanz und Servicehistorie. Liegt der Wert darunter, erscheint eine Fehlermeldung mit dem letzten bekannten Kilometerstand („Minimum value is xxxxx. Mileage should be greater than or equal to the last known serviced mileage: xxxxx“), und es werden weder Produkte noch Preise berechnet. Ist der Wert gleich oder höher, werden die Produkte ermittelt. Wird die Fahrgestellnummer gewechselt, setzt das System die Mindestlaufleistungsprüfung zurück. Der Kilometerstand bei Vertragsbeginn entspricht dem Kilometerstand zum Verkaufsdatum; bei Build to Stock und Build to Order beträgt er 0.

**Fahrzeugeignung und Produktverfügbarkeit.** Nach der Validierung sucht oneSCM Produkte, die zur Kennung, zum Fahrzeugalter (ab Erstzulassung), zur Laufleistung und zur Servicehistorie passen. Produkte, die zum Fahrzeug passen, aber wegen Laufleistung, Fahrzeugalter oder durchgeführter Services nicht zulässig sind, werden ausgegraut mit dem Hinweis „Product Unavailable“ angezeigt; beim Überfahren mit der Maus sehen Sie die enthaltenen Leistungen und den Grund. Solche Produkte lassen sich nicht auswählen, und eine zusätzliche Kennung kann für sie nicht erfasst werden. Produkte, deren maximale Laufleistung bei Vertragsbeginn unter dem erfassten Kilometerstand liegt, werden nicht angeboten (bei 120.000 km zum Beispiel keine Produkte mit Höchstgrenze 100.000 km). Liefert die Suche gar kein Ergebnis, erscheint die Standardmeldung „Your Identifier did not return any results. Please check and adjust your input if needed and try again. Enter a valid Chassis Number, Order Number, or Model Code.“ Ist das Baumuster veröffentlichten Produkten zugeordnet, erfüllt das Fahrzeug aber deren Anforderungen nicht, ergänzt das System die Meldung um einen Zusatz:

| Prüfung | Zusatz |
|---|---|
| Fahrzeugalter über dem Höchstalter des Produkts | „Alternatively, check the vehicle's FRD.“ |
| Laufleistung über der Obergrenze des Produkts (eine zu niedrige Laufleistung wird nicht geprüft) | „Alternatively, check the vehicle's mileage.“ |
| Im DSB ist eine Servicemaßnahme erfasst | „Alternatively, check for performed services.“ |
| Services entsprechen nicht den Mercedes-Benz Standards | „Alternatively, check the order of performed services.“ |

Treffen mehrere Gründe zu, fasst das System sie zusammen, zum Beispiel „… Alternatively, check for Mileage, FRD, or performed Services.“ Prüfen Sie in diesen Fällen Kennung, Erstzulassungsdatum und Laufleistung und passen Sie die Eingabe an.

**Ausgeschlossene Fahrzeuge.** Anhand der Kennung prüft oneSCM, ob das Fahrzeug gesperrt, gestohlen, verschrottet oder als Totalschaden eingestuft ist. Trifft ein Zustand zu, erscheint eine Fehlerseite mit „Your identifier did not return any available results“ und der Meldung „This vehicle is excluded from buying a service contract - Error …“: „Error V“ für gesperrt, „Error 3“ für gestohlen, „Error 2“ für verschrottet, „Error 8“ für Totalschaden; mehrere Zustände werden durch Schrägstriche getrennt (zum Beispiel „Error 2 / Error 3“). Ein Vertrag kann dann nicht erstellt werden. Bei einer Fahrgestellnummer erfolgt die Prüfung sofort. Bei einer Auftragsnummer oder einem Baumuster mit bereits zugeordneter Fahrgestellnummer gilt dasselbe; liegt noch keine Fahrgestellnummer vor, läuft der Vertrag bis zum Status „Confirmed“, und nach Eingang der Fahrgestellnummer prüft das System den Status „gesperrt“: Ein gesperrtes Fahrzeug führt zur Ablehnung des Vertrags und zu einer Benachrichtigung an die Zentrale; andernfalls wird die Aktivierung fortgesetzt.

**Ein aktiver Vertrag pro Fahrgestellnummer.** In der Produktivumgebung ist je Fahrgestellnummer nur ein Vertrag im Status „Active“ oder „Suspended“ zulässig; FIN und VIN desselben Fahrzeugs zählen dabei als eine Kennung. Starten Sie ein Angebot für ein Fahrzeug mit aktivem oder ausgesetztem Vertrag, erscheint eine Fehlerseite mit dem Hinweis, dass keine Produkte angezeigt werden können, weil das Fahrzeug bereits einem aktiven oder ausgesetzten Vertrag zugeordnet ist. Solange kein solcher Vertrag existiert, können mehrere Angebote angelegt werden; sobald eines aktiviert wird, setzt das System alle übrigen Verträge in den Status „Created“, „Waiting for Confirmation“, „Confirmed“ oder „Waiting for Activation“ auf „Rejected“, vermerkt in der Historie „Vehicle already assigned to an Active / Suspended Contract“ und benachrichtigt den Kunden per E-Mail. Bei Auftragsnummer oder Baumuster ohne Fahrgestellnummer erfolgt die Prüfung, sobald die Fahrgestellnummer zugeordnet ist. Als Alternative zu einem zweiten Vertrag steht die Langzeitverlängerung zur Verfügung (Kapitel 10). Eine bereits für einen anderen Vertrag verwendete Auftragsnummer wird mit einer Ausnahme abgewiesen.

**Fehlerbehebung.**

- Ungültige Kombinationen aus Fahrgestellnummer, Erstzulassungsdatum und Laufleistung, bereits für eine Vertragserstellung verwendete Daten oder ein nicht gefundenes Fahrzeug führen zu einer Hinweismeldung (Toast), nicht zu einer allgemeinen Meldung „Bad Request“.
- Eine ungültige Fahrgestellnummer löst eine einzige Fehlermeldung aus; die Validierungsmeldung zur Kennung erscheint nur einmal.
- Wechseln Sie zu einer Kennung ohne Erstzulassungsdatum, erscheint die Fehlermeldung im FRD-Eingabefeld; das Kennzeichen bleibt Pflichtfeld, wenn Sie zwischen Kennungen mit und ohne FRD wechseln.
- Bei Fahrgestellnummern ohne FRD löst das System die Produktabfrage aus, und die Produkte bleiben anklickbar, auch wenn Sie mehrfach zwischen Eingaben wechseln.
- Die Prüfungen aus diesem Kapitel wiederholt oneSCM beim Erstellen des Antrags (Kapitel 5.8 und 6.4) und bei der Aktivierung; eine Aktivierung ist nur mit einer in VeDoc validierten Fahrgestellnummer möglich.

Quellen: Batch 1039.1, 1038.1, 1101.2, 1012.1, 1073.1, 1067.1, 1115.1, 1254.3, 1070.3, 1080.1, 523.2, 1010.1, 1074.1, 1114.4, 933.2, 917.5, 1112.1, 1070.2, 14.2, 1043.1, 951.1, 964.1, 1142.5, 1249.5, 3.3, 1261.3, 1063.1, 974.1, 1054.3, 990.1, 982.1, 1075.1, 1069.2, 1030.1

## 5.4 Produkte und Leistungsumfang auswählen

**Zweck.** Nach der Fahrzeugeingabe zeigt oneSCM die Produkte an, die für das Fahrzeug, den Kundentyp und Ihre Rolle verfügbar sind. Sie vergleichen Produkte, prüfen ihren Leistungsumfang und wählen das Produkt, das Sie konfigurieren und anbieten möchten.

**Welche Produkte erscheinen.** Die Produkte und Preise liefert die Vertragskalkulation (Contract Calculation) aus der Produkt- und Preisbereitstellung von oneSCM. Angezeigt werden ausschließlich veröffentlichte Produkte („Published“) mit gültiger, aktiver Preisversion, die

- der Fahrzeuggruppe des Baumusters zugeordnet sind,
- zum gewählten Kundentyp und, bei Gewerbekunden, zur gewählten Branche passen,
- für die Vertriebsebene Ihrer Rolle freigegeben sind („Direct-to-Customer“, „Dealerships“, „MPCs/MOCs“) und deren Alters- und Laufleistungsgrenzen für diese Vertriebsebene das Fahrzeug einhält,
- die Prüfungen zu Fahrzeugalter, Laufleistung und Servicehistorie bestehen (Kapitel 5.3).

Die Liste kann je Rolle unterschiedlich ausfallen: Ein MPC- oder MO-Benutzer sieht beispielsweise vier Produkte, ein Händler zwei. Die Rolle Dealer+ sieht und verkauft Produkte der Vertriebsebenen Dealerships und MPC/MO; sind für ein Produkt unterschiedliche Grenzen oder Kombinationen aus Laufleistung und Laufzeit je Vertriebsebene hinterlegt, gelten für Dealer+ die Werte für MO/MPC. Die Reihenfolge der Produkte richtet sich nach der „Sales priority“ des Produkts (niedrige Zahl zuerst); ohne Priorität oder bei gleicher Priorität alphabetisch. Jedes berechtigte Produkt erscheint genau einmal. Produkte mit der Verkaufslogik „FRD Not Related“ und dem Ablaufkriterium „Contingent“ erscheinen nur bei der Suche über das Baumuster, nicht bei FIN oder VIN; nutzen Sie für Contingent-Produkte daher den Einstieg über das Baumuster.

**Fahrzeuge mit Integriertem Service-Paket (ISP).** Besitzt das Fahrzeug ein ISP (zum Beispiel EQE und EQS mit Servicekosten für sechs Jahre und bis zu 90.000 km), zeigt oneSCM die vom Markt konfigurierten ISP-Produkte mit dem Hinweis „This vehicle has an ISP.“; sie sind in der Regel günstiger, Nicht-ISP-Produkte bleiben wählbar. Ohne ISP erscheinen die Nicht-ISP-Produkte ohne Hinweis. Bei einem Baumuster kann das System ein ISP nicht sicher feststellen; ist ein ISP möglich, erscheint die Warnung „This vehicle might have an ISP. Please check vehicle details and select a corresponding product“, und Sie prüfen die Fahrzeugdetails manuell. Das ISP-Symbol und die Produktinformation öffnen sich durch Anklicken.

**Produktkarten.** Die Produkte erscheinen als Karten in Reihen zu je drei; bei mehr Produkten scrollen Sie. Jede Karte zeigt Produktbild, gegebenenfalls ein Label („Recommended“, „New“), den Produktnamen (zum Beispiel „Excellent“) und den „ab“-Preis mit dem kleinstmöglichen Preis und dem Zusatz „Total (inkl. MwSt.)“. Der „ab“-Preis ergibt sich aus der kürzesten Laufzeit und der niedrigsten Laufleistung. Für gewerbliche Kundentypen zeigt die Karte den Nettopreis; beim Überfahren erscheinen Bruttopreis und Mehrwertsteuer. Beim Überfahren der Karte sehen Sie Produktname und die ersten sieben enthaltenen Leistungen (Coverages) mit ihrer Kurzbeschreibung; Optionen, die zu 100 % enthalten sind, zählen zu den „Included Coverages“, optionale Deckungen der Produktvorlage, die das Produkt nicht nutzt, erscheinen nicht. Ein angewendeter Rabatt zeigt den ursprünglichen Preis durchgestrichen mit Prozentsymbol. Über die blaue Schaltfläche „>“ oder einen Klick auf die Karte öffnen Sie die Detailansicht. Oberhalb der Karten stehen „Compare Products“ und „More Filters“; mit „X“ brechen Sie die Vertragserstellung ab (nach einer Rückfrage, dass ungespeicherte Änderungen verloren gehen).

**Weitere Filter.** „More Filters“ öffnet ein Fenster mit eingeklappten Kategorien, die Sie einzeln ausklappen und kombinieren:

- „Preisspanne“: Zahlungsoption „Einmalig“ oder „Monatlich“ (vorausgewählt ist die Option der Produktkonfiguration) und Grenzen „Von“ und „Bis“ in EUR (Punkt als Tausender-, Komma als Dezimaltrennzeichen).
- „Jährliche Laufleistung“: alle Laufleistungsoptionen, die für Produkte der Sparte des Fahrzeugs definiert sind (zum Beispiel 10.000 bis 100.000 km), Mehrfachauswahl.
- „Laufzeit“: alle definierten Vertragslaufzeiten (zum Beispiel 6 bis 84 Monate), Mehrfachauswahl.
- „Leistungsumfang“: Wartung, Allgemeiner Verschleiß, Fahrzeugverschleiß, Teilegarantie, Fahrzeuggarantie, Restgarantie, Mehrfachauswahl.

Innerhalb einer Kategorie und zwischen den Kategorien gilt die UND-Verknüpfung: Es erscheinen nur Produkte, die alle gewählten Bedingungen erfüllen. „Cancel“ schließt ohne Anwendung, „Reset“ setzt die Auswahl zurück, „Apply“ wendet die Filter an; die gewählten Filter erscheinen als Labels unter den Fahrzeugangaben.

**Detailansicht.** Der Kopfbereich zeigt die Schritte des Assistenten, beginnend mit „Product Selection“. Darunter sehen Sie Produktbild, Name, Label, Beschreibung, den Bereich „Included Coverages“ mit Kurzbeschreibungen und den Preis, zunächst als „ab“-Preis, nach der Konfiguration als Monats- und Gesamtpreis. Rechts bleibt die Produktkarte während der gesamten Konfiguration sichtbar. Die Konfiguration mit Laufzeit, Laufleistung, Zahlungsintervall, Branche, optionalen Deckungen, Technischen Optionen, Reifenoptionen und Zahlungsplan beschreibt Kapitel 5.5; Kampagnen, Händlerrabatt und Provision Kapitel 5.6. Im unteren Teil stehen Registerkarten:

- „Product“ mit den Unterreitern „Included Coverages“ (alle standardmäßig enthaltenen Deckungen mit Kurz- und, sofern vorhanden, Langbeschreibung) und „Optional Coverages“ (wählbare Deckungen mit Kurzbeschreibung, „Starting From“-Preis und Langbeschreibung); ohne optionale Deckungen entfällt der zweite Unterreiter. Deckungen sind zu Familien (Family-Tags) gruppiert, die Reihenfolge lautet enthalten, optional, Karosserie.
- „Technical Option“ mit Beschreibung und Preis, nur wenn für Produkt und Kennung eine Technische Option verfügbar ist.
- „Campaigns“ mit den anwendbaren Marktkampagnen (Kapitel 5.6); ohne Kampagne entfällt der Reiter.
- „Payment Plan“ mit dem theoretischen Zahlungsplan (Kapitel 5.5).
- „Dealer Information“ mit der Händlerprovision (Kapitel 5.6).

Beschreibungen erscheinen in der Sprache des angemeldeten Benutzers; hat der Markt für diese Sprache eine Übersetzung gespeichert, wird sie verwendet, sonst der HQ-Vorschlag. Fehlt eine Langbeschreibung, wird sie nicht durch die Kurzbeschreibung ersetzt. Die Steuerbezeichnung („inkl. MwSt.“ oder „inkl. GST“) richtet sich nach der Steuerart der Markteinstellungen (Kapitel 14.2).

Am Ende der Seite stehen „Back to Products“ (zurück zur Produktübersicht, die abgerufenen Produkte bleiben erhalten), „T&C“ (druckbare Geschäftsbedingungen des Produkts), „Print“ und „Email“ für die unverbindliche Preisinformation sowie „Next“ beziehungsweise „Create Contract“ für die Übergabe (Kapitel 5.8). Bei komplexen Produkten mit Reifenoption stehen die Geschäftsbedingungen des Basisprodukts und der Reifenoption gemeinsam bereit; beide werden dem Angebot beigefügt.

**Produkte vergleichen.** Stehen mindestens zwei Produkte zur Verfügung, ist „Compare Products“ aktiv; bei einem einzigen Produkt bietet das System nur den Vergleich verschiedener Konfigurationen desselben Produkts an. Sie wählen zwischen „Compare Different Products“ (bis zu drei Plätze) und „Compare Different Configurations“ (ein Platz). Auf den Karten erscheinen Auswahlpunkte mit den Plätzen 1 bis 3; ein viertes Produkt lässt sich nicht wählen. Sobald ein Produkt gewählt ist, werden Produkte mit abweichender Produktvorlage (Blueprint) oder Ablauflogik blau eingefärbt und deaktiviert, mit dem Hinweis „You can compare only products with the same configuration“. Mit „X“ brechen Sie ab, mit dem Häkchen öffnen Sie die Vergleichsansicht. Öffnen Sie während der Auswahl die Produktdetails und kehren zurück, beginnt der Vergleich von vorn.

Die Vergleichsansicht zeigt je Produkt eine Spalte mit den Zeilen Bild, Produktname (schreibgeschützt, gegebenenfalls mit Auszeichnung), Allgemeine Informationen, Preis, Vertragslaufzeit, jährliche Laufleistung, Anzahl der Services (nur Kontingentprodukte), Zahlungsintervall, Beschreibung und Leistungsumfang; die ersten Zeilen bleiben beim Scrollen sichtbar. Der Preis zeigt zunächst den Startpreis und aktualisiert sich, sobald Laufzeit, Laufleistung oder Anzahl der Services und Zahlungsintervall gewählt sind. Wählen Sie einen Wert erstmals in einer Spalte, übernimmt das System ihn in die übrigen Spalten, soweit dort verfügbar; spätere Änderungen gelten nur für die jeweilige Spalte, nicht verfügbare Merkmale zeigen „n/a“. Optionale Deckungen wählen Sie im Vergleich je Produkt einzeln oder mehrfach; der Preis aktualisiert sich entsprechend. Ein Häkchen zeigt eine enthaltene, ein „X“ eine nicht enthaltene Leistung. Wird ein Reifenprodukt mit einem anderen Produkt verglichen, konfigurieren Sie jedes Produkt einzeln, damit der Preis ermittelt wird. Im Fußbereich führt „<“ beziehungsweise „Back“ zur Produktauswahl zurück, „Print“ erzeugt nach Auswahl der Dokumentsprache das Vergleichsdokument, „Email“ versendet es, und „Select“ übernimmt die gesamte Konfiguration des gewählten Produkts in den Konfigurator; der Zahlungsplan wird erzeugt, und Sie gelangen zum Bereich „Zahlungsplan“.

**Unverbindliche Preisinformation.** An drei Stellen erzeugen Sie eine unverbindliche Preisinformation als PDF: nach der Anzeige der Produkte, nach der Konfiguration von Laufzeit, Laufleistung und Zahlungsintervall sowie nach Anwendung eines Händlerrabatts. Im Baumuster-Ablauf sind „Drucken“ und „E-Mail senden“ bereits nach der Konfiguration aktiv und bleiben es nach dem Hinzufügen einer Kennung; ändern Sie die Konfiguration, wird die Datei aktualisiert.

1. Öffnen Sie die Detailansicht des Produkts oder die Vergleichsansicht.
2. Wählen Sie „Print“, um das Dokument zu drucken oder herunterzuladen; bei mehreren Sprachen wählen Sie die Dokumentsprache.
3. Wählen Sie „Email“, um das Dokument zu versenden. Bei Privatkunden erfassen Sie Vorname, Nachname und E-Mail-Adresse, bei gewerblichen Kunden Vorname und Nachname der Kontaktperson, Firmenname und E-Mail-Adresse; alle Felder werden formal geprüft. „Send Email“ wird erst mit gültigen Angaben aktiv. Absenderadresse ist die E-Mail-Adresse des Verkäufers aus der Anmeldung.
4. Nach dem Versand erscheint „Email successfully sent“.

Das Dokument trägt die Überschrift „Price Information“, das Erstellungsdatum, die Verkäuferangaben, die Fahrzeugdaten aus der Vertragserstellung, Produktname, Beschreibung, Deckungen mit Bildern, Konditionen und Preise sowie den Hinweis, dass die Preisinformation unverbindlich ist und nur Gesprächszwecken dient. Beim Vergleich von zwei oder drei Produkten enthält es eine Vergleichstabelle mit allen Leistungen der verglichenen Produkte; bei einem einzelnen Produkt nur dessen Leistungen. Die Allgemeinen Geschäftsbedingungen aller enthaltenen Produkte werden beigefügt. Bei Reifenprodukten enthält die Vorlage die gewählte Reifenspezifikation. Das PDF wird bei jeder Erzeugung mit den zuletzt eingegebenen Daten aktualisiert.

**Ergebnis.** Mit „Select“ beziehungsweise dem Klick auf die Karte ist das Produkt zur Konfiguration ausgewählt. Wählen Sie ein Produkt mit anderen Werten erneut, aktualisiert sich der Bereich der Produktoptionen.

**Hinweise.**

- Die Schaltfläche „Next“ bleibt ausgegraut, bis das Produkt konfiguriert und der Preis berechnet ist.
- Ein Baumuster-Angebot bietet keine Kampagnenanfrage und keinen Sonderfall an; beides steht erst nach Eingabe einer konkreten Kennung zur Verfügung (Kapitel 5.6 und 5.8).

Quellen: Batch 1009.1, 1038.1, 1110.1, 929.2, 1040.1, 1235.2, 1236.1, 1230.3, 992.1, 1253.1, 1185.1, 1280.7, 943.1, 1047.1, 1054.1, 1270.3, 1224.7, 1239.3, 3.3, 1001.1, 1056.5, 1053.1, 8.4, 1063.1, 1261.3, 948.2, 1008.1, 1111.2, 1071.1, 995.1, 983.2, 975.2, 884.5, 1107.2, 1051.1, 940.1, 929.3, 875.4, 899.1, 899.3, 899.9, 899.10, 1007.1, 1007.2, 1007.3, 977.3, 1069.3, 1006.2, 425.3, 482.2, 1105.1, 1111.1, 958.1, 1070.3, 1044.1

## 5.5 Laufzeit, Laufleistung und Optionen konfigurieren

**Zweck.** In der Produktkonfiguration legen Sie die Vertragsparameter fest, aus denen oneSCM den Preis und den Zahlungsplan berechnet. Die Auswahlwerte stammen aus der Produktdefinition und der Preisversion der Vertragskalkulation.

**Aufbau des Konfigurators.** Der Kopfbereich zeigt die Schritte Produktkonfiguration, Technische Optionen, Deckungen, Rabatte, Sonderanfrage und Zahlungsplan. Erledigte Schritte sind blau mit Häkchen markiert und lassen sich erneut öffnen; noch nicht erreichbare Schritte sind ausgegraut, bis die Voraussetzungen erfüllt sind. Im Fußbereich stehen „Back to Products“, „Mass Creation“ (Kapitel 12.9), „T&C“, „Dealer Information“ und „Next“.

**Grundkonfiguration.** Die Felder werden in fester Reihenfolge freigeschaltet:

1. Wählen Sie die „Vertragslaufzeit“ in Monaten (zum Beispiel 6, 12, 24, 36). Für Vans sind Laufzeiten bis zu 120 Monaten möglich.
2. Wählen Sie die „jährliche Laufleistung“. Die angebotenen Laufleistungen können sich je Laufzeit unterscheiden.
3. Wählen Sie das „Zahlungsintervall“. Es wird erst nach Laufzeit und Laufleistung aktiv. Zur Auswahl stehen „Onetime“ (einmalig) und „Monthly“ (monatlich); für Gewerbekunden können je Markt zusätzlich vierteljährlich, halbjährlich und jährlich konfiguriert sein. Ist auf Produktebene eine Laufzeitstufe von sechs Monaten festgelegt, sind jährliche Optionen nicht wählbar.
4. Bei gewerblichen Kundentypen wählen Sie die „Branche“ („Industry“). Das Feld ist mit der zu Beginn gewählten Branche vorbelegt; Branchen, die für das Produkt gelten, sind wählbar, die übrigen deaktiviert. Ist dem Produkt keine Branche zugeordnet, zeigt das Feld schreibgeschützt „-“. Ist eine Branche zugeordnet, aber nicht gewählt, lässt sich der Schritt nicht verlassen. Für eine deaktivierte Branche kehren Sie zur ersten Seite zurück und wählen die Branche dort.

Sobald die Vertragsattribute gewählt sind, zeigt die Detailansicht Monats- und Gesamtpreis an, und der Zahlungsplan wird berechnet. Beim Ändern der Laufzeit setzt das System die abhängigen Werte zurück; die Jahreslaufleistung bleibt erhalten, wenn Sie im Baumuster-Ablauf eine Kennung hinzufügen und die Laufzeit wechseln.

**Regeln zu Laufzeit und Laufleistung.**

- Bei fahrzeugbezogenen Produkten wie „Excellent“ beginnt der Vertrag mit dem Erstzulassungsdatum. Das System bietet daher nur Laufzeiten an, die länger sind als der Zeitraum von der Erstzulassung bis zum Anfragedatum. Beispiel: Erstzulassung 10. Januar 2022, Anfrage 7. Dezember 2023, Abstand 23 Monate; angeboten wird die kleinste Laufzeit über 23 Monaten, „12 Monate“ steht nicht mehr zur Auswahl. Kontingentprodukte sind von dieser Regel ausgenommen.
- Liegt die Summe aus Erstzulassungsdatum und Laufzeit vor dem Erstellungsdatum, erscheint „Contract duration cannot be made in the past“, und „Next“ ist deaktiviert. Ohne FRD-Bezug ist jede Laufzeit möglich; die Zählung beginnt mit der Erstellung des Vertrags.
- Das geplante Vertragsende liegt taggenau einen Tag vor Ablauf der Laufzeit: Ein Vertrag ab 01.12.2023 mit 24 Monaten endet am 30.11.2025. Die geplante Gesamtlaufleistung ergibt sich aus Laufzeit mal jährlicher Laufleistung.
- Es werden nur Kombinationen angeboten, bei denen die geplante Gesamtlaufleistung nicht unter dem Kilometerstand zum Verkaufszeitpunkt liegt. Beispiel: 100.000 km zum Verkaufszeitpunkt, 36 Monate und 20.000 km ergeben 60.000 km und sind nicht zulässig.
- Liegt das Erstzulassungsdatum in der Vergangenheit, muss die Vertragslaufzeit dazu passen; bei laufleistungsabhängigen Wartungsprodukten mit FRD-Bezug beträgt die Startlaufleistung 0.
- Ohne Erstzulassungsdatum (Build to Stock, Build to Order, Deal-ID, Baumuster) nutzt der Zahlungsplan den aktuellen Tag als Startdatum; Vertragsbeginn und Laufzeit zeigen in der Übersicht „Not yet available“, bis das FRD vorliegt (Kapitel 5.7).

**Kontingentprodukte.** Beim Kontingentprodukt wählen Sie statt der jährlichen Laufleistung die „Anzahl Services“; das Zahlungsintervall wird aktiv, sobald Vertragslaufzeit und Anzahl der Services gewählt sind. Die Preismatrix enthält je Anzahl der Services (zum Beispiel 1 bis 6) einen Betrag je Laufzeit (zum Beispiel 12, 24, 36 Monate). Den zum Fahrzeug gehörenden K/JX-Code-Wert ermittelt das System über die Kennung und speichert ihn am Vertrag. Es empfiehlt auf dieser Basis passende Kombinationen, ohne die Auswahl einzuschränken:

- Beginnen Sie mit Laufzeit und Laufleistung, zeigt das Dropdown „Anzahl Services“ die empfohlene Anzahl. Wählen Sie eine andere Anzahl, blendet das System als Hinweis die „empfohlene Laufzeit“ und „empfohlene Fahrleistung“ ein (zum Beispiel 48 Monate und 40.000 km bei 4 Services).
- Beginnen Sie mit der Anzahl der Services, zeigen die Dropdowns die empfohlene Laufzeit und Fahrleistung; bei abweichender Wahl erscheint die „empfohlene Anzahl an Services“ (zum Beispiel 2 Services bei 24 Monaten und 10.000 km).
- Neben der Anzahl der Services steht ein Info-Symbol. Beim Überfahren sehen Sie die Empfehlungen je Anzahl: 1 Service entspricht 12 Monaten und dem K/JX-Code-Wert, 2 Services 24 Monaten und dem doppelten Wert, bis zur maximal definierten Anzahl (bei bis zu 8 Services also 8 Empfehlungen bis 96 Monate). Der Hinweis erscheint auch bei Auftragsnummern als Kennung.

Die geplante Gesamtfahrleistung ergibt sich aus dem K/JX-Code-Wert multipliziert mit den Jahren der Vertragslaufzeit; die geplante Fahrzeugfahrleistung aus der Gesamtfahrleistung plus Kilometerstand zum Verkaufsdatum. Vertragsbeginn, Verkaufsdatum und Erstellungsdatum entsprechen einander. In der Übersicht erscheint die Anzahl der enthaltenen Services in den Produktoptionen. Kontingentprodukte stehen für Privat- und Gewerbekunden mit optionalen Deckungen, Händlerrabatt, Kampagnen und Provision zur Verfügung.

**Reifenprodukte.** Für Reifenprodukte stehen zusätzliche Felder bereit: „Reifenart“ (zum Beispiel MO, MOE, MOE-S), „Reifengröße“, „Wetterprofil“ (Ganzjahresreifen oder Sommer/Winter), „Felge“ und „Anzahl der Reifen“. Die Werte liefert die Vertragskalkulation. Wählen Sie zuerst eine Reifenart, zeigt die Reifengröße nur passende Werte, und umgekehrt. Reifentyp und Reifenanzahl werden erst nach Auswahl des Wetterprofils aktiv; der Assistent zeigt den je Wetterprofil und Felge verfügbaren Größenbereich an. Die Anzahl der Reifen ist stets ein Vielfaches von 2 und mit der Empfehlung aus der Matrix für Laufzeit und Fahrleistung vorbelegt („We recommend x tires“); sie wird nach dem Zahlungsintervall freigeschaltet. Für Felgen enthält die Auswahlliste die Option „Nicht enthalten“. Nach der Konfiguration erscheinen Reifenart, Reifengröße und Wetterprofil im Bereich „Technische Spezifikation“ neben den enthaltenen Leistungen; Ausdruck und E-Mail der Preisinformation enthalten die Reifenspezifikation. Ändern Sie die Auswahl, passt sich der Preis an. Bei einem Baumuster als Kennung liefert das System alle passenden Reifenprodukte; im ersten Konfigurationsschritt wählen Sie zusätzlich die Fahrzeuggruppe (schreibgeschützt, wenn nur eine verfügbar ist) und die Radgröße. Nach der Eingabe einer Fahrgestell- oder Auftragsnummer entfallen die Dropdowns für Reifenart und Reifengröße, und die „Technische Spezifikation“ wird aus den Produkt- und Fahrzeugdaten befüllt. Bei Reifenprodukten übermittelt oneSCM den aktuellen Fahrzeugkilometerstand, nicht den Kilometerstand zum Verkaufsdatum.

**Optionale Deckungen.** Enthält das Produkt optionale Deckungen (zum Beispiel Pannenhilfe, Sicherheitsinspektion, Reifenservice), ist die Schaltfläche „Add Optional Coverages“ nach Abschluss der Grundkonfiguration aktiv.

1. Klicken Sie auf „Add Optional Coverages“. Das Fenster „Optional Coverages“ zeigt den monatlichen oder einmaligen Vertragspreis und den Hinweis „Select the coverages you want to add to this product. You can select multiple options“.
2. Wählen Sie Deckungen über die Kontrollkästchen; jede Deckung zeigt Kurzbeschreibung und Preis. Der Preis im Fenster erhöht sich um die gewählten Deckungen.
3. Mit „Apply“ übernehmen Sie die Auswahl; „Cancel“ oder „X“ schließen das Fenster ohne Änderung.

Danach zeigt die Produktübersicht die Spalten „Included Coverages“ und „Optional Coverages“; die Übersichts- und Bestätigungsseite übernimmt beide Bereiche. Die Nummer des Family-Tags aktualisiert sich nach jeder Änderung. Nur optionale Deckungen mit hinterlegtem Preis erscheinen. Die Händlerprovision für optionale Deckungen wird angewendet, wenn die Preisversion den Vertriebskanal „Retail“ enthält (Kapitel 5.6). Bei Management-Verträgen erfassen Sie je Deckung zusätzlich die Kostenstelle (Mercedes-Benz, Kunde oder Lieferant mit Name und Kreditorennummer); die Kostenstelle liefert die Vertragskalkulation je Deckung mit (Kapitel 12).

**Technische Optionen.** Technische Optionen bilden Ausstattungen ab, die der Servicevertrag berücksichtigt, zum Beispiel Keramikbremsen bei AMG-Fahrzeugen. Sie stehen für Privat- und Gewerbekunden, alle Branchen und die Kennungen Fahrgestellnummer (mit oder ohne FRD), Auftragsnummer, Deal-ID und Baumuster zur Verfügung; Name, Beschreibung und Preis (netto, brutto, Mehrwertsteuer) stammen aus der Vertragskalkulation.

- Bei einer Fahrgestellnummer erkennt die Produktdomäne, ob das Fahrzeug eine Technische Option erfordert, und liefert das Produkt mit einem Preis, der die Option bereits enthält. Der Reiter „Technical Option“ zeigt Beschreibung und Preis.
- Bei einem Baumuster liefert die Produktdomäne die Konfiguration ohne die Technische Option und stellt deren Preis separat im Reiter „Technical Option“ bereit. Nach der Grundkonfiguration öffnet „Add Technical Option“ das Fenster „Technical Options“ mit dem Hinweis „Select the Technical Option you want to add to this product. You can select multiple options“; jede Option zeigt Kontrollkästchen, Kurzbeschreibung und Preis. „Apply“ übernimmt die Auswahl, die Produktübersicht zeigt dann drei Spalten: enthaltene Leistungen, optionale Leistungen und Technische Option.
- Ist für das Produkt keine Technische Option verfügbar, ist der Reiter ausgegraut.

Die gewählten Technischen Optionen fließen in den Gesamtpreis der Preisinformation ein, werden an die Dokumentvorlage übergeben und in der Übersicht neben den optionalen Leistungen aufgeführt. In den Detailansichten des Angebots- und Vertragsmanagements („Coverage Details“) werden sie nicht angezeigt.

**Zahlungsplan.** Die Registerkarte „Payment Plan“ zeigt einen theoretischen Zahlungsplan, den das Revenue Management berechnet, sobald Laufzeit und Zahlungsintervall gewählt sind; vorher erscheint „Please configure the product in order to display the Payment Plan“. Der Plan wird bei jeder Änderung der Konfiguration und jedem Händlerrabatt neu angefordert. Die schreibgeschützte Tabelle enthält laufende Nummer, Zeitraum, Produkt, Zahlungsart, Intervalltyp sowie Netto-, Steuer- und Bruttobetrag mit zwei Nachkommastellen und Währung; darunter stehen Zwischensummen je Vertragsjahr und die Gesamtsumme. Zwölf Einträge sind gleichzeitig sichtbar, Kopf- und Fußzeile bleiben fixiert. Ohne Erstzulassungsdatum ist der aktuelle Tag das Startdatum des Plans, mit Erstzulassungsdatum das FRD. Liegt zwischen Erstzulassung und Vertragserstellung eine Lücke, verteilt oneSCM die Beträge der vergangenen Monate auf die verbleibenden Monate: Bei einem FRD am 15.11.2023 und einer Vertragserstellung am 10.01.2024 beträgt die Zahlungsdauer 22 Monate; die ersten zwei Raten betragen 0 EUR, es folgen 22 Raten über je 109,09 EUR bei einem Gesamtpreis von 2.400 EUR. Zellen mit 0 EUR tragen den Tooltip „This month's payment is reallocated to the rest of the Payment Plan“. Der endgültige Zahlungsplan entsteht bei der Aktivierung, wenn das FRD erst dann vorliegt; lag es bereits vor, ist er mit dem Simulations-Zahlungsplan identisch.

**Sonderfall.** Unterstützt das Produkt einen Sonderfall (abweichender Preis oder abweichende Laufzeit und Laufleistung), zeigt der Schritt „Sonderanfrage“ die Option „Request Special Case“. Sie steht erst nach Eingabe einer konkreten Kennung (Fahrgestellnummer, Auftragsnummer, VerSO-Order-ID oder Deal-ID) zur Verfügung, nicht bei einem reinen Baumuster. Solange die Anfrage offen ist, bleibt das Angebot im Status „Created“, Preis und Zahlungsplan werden ausgeblendet, und „Confirmation“ sowie die Vertragsvorschau sind gesperrt. Prüfung und Freigabe durch den MPC beschreibt Kapitel 12.4.

**Ergebnis.** Nach vollständiger Konfiguration zeigt die Detailansicht Monats- und Gesamtpreis, der Zahlungsplan ist verfügbar, und „Next“ beziehungsweise „Create Contract“ wird aktiv. Die gewählte Konfiguration und der Preis werden mit dem Angebot gespeichert.

**Hinweise.**

- Die Jahreslaufleistung bleibt gefüllt, wenn Sie das Zahlungsintervall auf „Onetime“ setzen.
- Beim Wechsel in den Baumuster-Ablauf und zurück bleiben die gewählten Zahlungsintervalle beim Vergleichen und Auswählen erhalten.
- Vorführ- und Dienstwagen gelten als Gebrauchtfahrzeuge; für sie ist nur ein reines Wartungspaket möglich.

Quellen: Batch 929.3, 1009.1, 1111.2, 1077.1, 1082.3, 1051.1, 1156.1, 1046.1, 1253.1, 988.1, 912.1, 1066.1, 1060.1, 1064.5, 1065.1, 1114.4, 1075.1, 987.3, 844.2, 1091.1, 843.1, 1047.1, 852.4, 1105.1, 1042.1, 998.1, 976.1, 976.2, 976.3, 976.4, 976.5, 976.7, 1071.1, 977.2, 958.1, 958.2, 937.4, 1089.5, 1062.1, 1046.1, 995.1, 1054.1, 1063.1, 1143.3, 934.2, 983.1, 983.2, 983.4, 983.5, 1043.1, 1101.2, 256.2, 822.3, 991.3, 959.11, 959.7, 897.1, 882.4, 1069.3

## 5.6 Preise, Kampagnen und Rabatte im Angebot

**Zweck.** oneSCM berechnet den Angebotspreis aus der Preisversion des Produkts und den gewählten Vertragsparametern. Kampagnen des Marktes und Händlerrabatte reduzieren den Kundenpreis; die Händlerprovision ist Teil des Listenpreises. Alle Preise werden mit dem Angebot gespeichert.

**Preisbildung.** Die Vertragskalkulation ermittelt für jedes berechtigte Produkt die zulässigen Preispunkte aus Laufzeit und Laufleistung (oder Kontingent) und berechnet je Zahlungsintervall Gesamtbetrag und intervallbezogenen Betrag, jeweils netto, Steuer und brutto. Bei „Onetime“ sind beide Beträge identisch; bei „Monthly“ wird der Nettopreis durch die Laufzeit in Monaten geteilt. In den Preis fließen ein:

- der Basispreis aus dem Preiscluster der Fahrzeuggruppe,
- Aufschläge für optionale Deckungen und Technische Optionen,
- der Branchenaufschlag bei gewerblichen Kunden, sofern für die Branche ein Preisfaktor hinterlegt ist; ohne Faktor gilt der Grundpreis,
- der Aufschlag je Zahlungsintervall („Markup per month“, „One time markup“) aus der Produktdefinition,
- der Inflationsaufschlag der Preisversion, sofern aktiviert,
- die Händlerprovision, die zum Listenpreis addiert wird, bevor Rabatte und Kampagnen abgezogen werden; auf sie wird Mehrwertsteuer berechnet.

Der Steuersatz richtet sich nach der Steuerklassifizierung des Kunden oder dem Standardsteuersatz des Marktes; die Bezeichnung lautet je Markteinstellung „VAT“ oder „GST“. Privatkunden sehen Bruttopreise „inkl. MwSt.“, gewerbliche Kundentypen Nettopreise mit Brutto und Steuer beim Überfahren. Beträge erscheinen mit Komma als Dezimaltrennzeichen; die oben auf der Seite angezeigten Monats- und Gesamtbeträge beruhen auf derselben Berechnung wie der Zahlungsplan. Zusätzlich liefert die Vertragskalkulation den Preis pro Kilometer für Minder- und Mehrkilometer; er wird im Vertrag gespeichert und nur in der Vertragsprüfung (Contract Review) angezeigt. Die Preise gelten zum Zeitpunkt der Vertragserstellung; hat ein Produkt mehrere Preisversionen, gilt die bei der Erstellung gültige Version (Kapitel 5.7).

**Kampagnen.** Der Reiter „Campaigns“ zeigt je Marktkampagne Name, Beschreibung, Rabatt in Prozent, den maximal rabattierbaren Betrag und den Gültigkeitszeitraum im Format TT.MM.JJJJ. Kampagnen mit dem Kennzeichen „AutoApply“ wendet das System automatisch an, bei mehreren zuerst die Kampagne mit dem höchsten Rabatt; das Gültigkeitsende erscheint in der Oberfläche. Kampagnen ohne automatische Anwendung wählen Sie manuell; ein Händlerrabatt ist auch dann möglich, ohne dass Sie die Kampagne auswählen. Kampagnendetails werden bis einschließlich zum letzten Gültigkeitstag angezeigt. Dealer+ sieht Kampagnen der Vertriebsebenen Händlerbetrieb und MO/MPC ohne Unterscheidung und kann jede davon wählen. Bei einem Baumuster als Kennung übergibt das System alle passenden Kampagnen zur manuellen Auswahl; eine automatische Anwendung erfolgt dort nicht. Nach Eingabe einer konkreten Kennung passt das System die Preise an und entfernt vorher angewendete Rabatte und Kampagnen; Sie wenden sie danach erneut an. Preise mit Kampagnenrabatt erscheinen auf der Übersichts- und Bestätigungsseite; eine Kampagne führt nie zu einem negativen Betrag. Prüfen Sie die Berechtigung des Kunden anhand der Kampagnenbeschreibung.

**Kampagnen mit Karenzzeit (Grace Period).** Eine Kampagne, deren Gültigkeit abgelaufen ist, aber in der Karenzzeit liegt, können Sie beim MPC anfragen, sofern keine Marktkampagne angewendet ist.

1. Konfigurieren Sie das Produkt und wählen Sie „Request Campaign“. Angezeigt werden alle Kampagnen mit verfügbarer Karenzzeit; die Option steht nicht vor Beginn der Karenzzeit zur Verfügung.
2. Wählen Sie die Kampagne, tragen Sie eine Begründung ein und senden Sie die Anfrage ab. Das System übermittelt Händlername, Zeitpunkt, Kampagnenname, Gültigkeit, Karenzzeit in Tagen, Fahrgestellnummer, Kennzeichen und Begründung an den MPC und bestätigt Ihnen die Übermittlung.
3. Vervollständigen Sie das Angebot mit den Kundendaten und erstellen Sie es. Bis zur Entscheidung bleibt der Preis auf der Produktkarte ausgeblendet, es wird kein Zahlungsplan erzeugt, und in „Overview & Confirmation“ sind Produktpreis, Vorschau, Zahlungsplan und „Next“ gesperrt. Das Fälligkeitsdatum der Anfrage ergibt sich aus dem Einreichungszeitpunkt plus der in den Markteinstellungen hinterlegten Gültigkeit.
4. Der MPC sieht die Anfrage über das Glockensymbol und gibt sie frei oder lehnt sie ab. Sie erhalten eine Benachrichtigung über die Entscheidung; bei Freigabe werden Wert und Preis auf der Übersichts- und Bestätigungsseite aktualisiert, und die Kampagnen-ID wird erst nach der Freigabe übermittelt. Die Benachrichtigung wird nach sieben Tagen gelöscht.

Ein Vertrag mit angefragter Grace-Period-Kampagne kann erst nach der Freigabe aktiviert werden. Beim Bearbeiten eines Vertrags wird eine nicht angefragte Kampagne in der Karenzzeit nicht automatisch angewendet. MPC-Benutzer erhalten systeminterne Benachrichtigungen, wenn sich eine Kampagne eines Servicevertrags in der Karenzzeit befindet.

**Händlerrabatt.** Über „Dealer Discount“ öffnen Sie nach der Grundkonfiguration das Fenster für den Händlerrabatt. Sie erfassen den Rabatt als Betrag mit Dezimalstellen und Komma; die Prozentoption ist aus der Oberfläche entfernt. Prozentwerte mit führender Null werden nicht akzeptiert. Die Summe aus Kampagnenrabatt und Händlerrabatt darf den Vertragswert nicht überschreiten („Sum of Market Campaign Reduction and Dealer Discount cannot exceed the contract value“); ein Rabatt in Höhe des Vertragswerts ist zulässig und ergibt einen vollständig subventionierten Vertrag. Der Händlerrabatt fließt in den Vertragsendpreis ein und wird mit der Outlet-ID des Händlers gespeichert. Die Oberfläche zeigt den ursprünglichen Preis durchgestrichen; im Reiter „Zahlung“ erscheinen Prozentsatz und Betrag des Rabatts, in der Übersicht unter „Applied Discounts“ die Details beim Überfahren. Ein Händlerrabatt bleibt für den Händler auch nach einer Freigabe durch den MPC zugänglich. Bei Verträgen mit Händlerrabatt teilen sich die Vertragskosten in den Anteil des Kunden und den des Händlers; bei der Aktivierung prüft das System, ob für den Händler eine SAP-Debitorennummer zur GSSN Outlet ID vorliegt (Kapitel 9). Wendet ein MO- oder MPC-Benutzer einen Händlerrabatt an, muss der Vertrag einem Händler zugewiesen werden; eine Zuweisung an die erstellende Rolle selbst ist dann nicht möglich.

**Vollständig subventionierte Verträge.** Beträgt der Kundenbeitrag 0,00, weil Kampagne, Händlerrabatt, Subvention oder eine Kombination den gesamten Vertragswert decken, verwaltet oneSCM den Vertrag ausschließlich intern: Es werden keine Zahlungsdaten erfasst, keine Synchronisation mit dem FI-System und keine SEPA-Verarbeitung durchgeführt. Subventionierte Verträge haben das Zahlungsintervall „Onetime“. Bei einer Aftersales-Kampagne mit 100 % Rabatt sendet oneSCM keine Ereignisse an Nemesis. Verträge mit Preis 0, deren Rabatt ausschließlich aus einer automatisch angewendeten Kampagne stammt, lassen sich anlegen.

**Händlerprovision.** Ist für das Produkt eine Verkaufsprovision definiert (prozentual mit Höchstbetrag oder als Fixbetrag je Laufzeit- oder Kontingentoption), zeigt oneSCM sie dem Händler indirekt an, damit der Kunde sie nicht zufällig sieht:

1. Wählen Sie die Produktkonfiguration. Am unteren Seitenrand erscheint der Reiter „Dealer Information“.
2. Schalten Sie den Schalter „Display Dealer information on this section“ auf „ON“. Es erscheint „Commission for the current product configuration <Betrag> EUR.“ als Nettobetrag.

Nach der Erstellung zeigt der Reiter „Payment“ im Proposal Management das Feld „Dealer Commission“ für Verträge im Status „Confirmed“ oder „Waiting for Activation“. Die Provision für optionale Deckungen wird nur angewendet, wenn die Preisversion den Vertriebskanal „Retail“ enthält. Erstellt ein MO- oder MPC-Benutzer einen Vertrag mit Provisionsprodukt und weist ihn sich selbst zu, entfernt das System die Provision bei der Aktivierung aus der Nachricht an Revenue und Nemesis; ist der Vertrag einem Händler zugeordnet, werden die Provisionsinformationen übermittelt. MO und MPC können einen Vertrag einem Händler zuweisen (Abschnitt „Dealer Information“ in den Kunden- und Zahlungsinformationen mit E-Mail-Adresse, Autohaus und Stadt), damit dieser Provision und Nachbetreuung erhält (Kapitel 6).

**Gespeicherte Preise.** oneSCM speichert mit dem Angebot den Produktpreis, den Händlerrabatt mit Outlet-ID, den Kampagnenpreis mit Kostenstelle und Sonderfälle mit Kostenstelle, jeweils netto, brutto und Mehrwertsteuer, sowie Standarddauer, Zahlungsdauer, Standardpreis und Dauerpreis aus der Vertragskalkulation. Der Bereich „Preisinformationen“ des Vertrags zeigt „Total Gross Amount“, „Total Net Amount“, „Total Tax Amount“ und „VAT Rate“ als Anzeigefelder; detaillierte Preisbestandteile samt Historie erscheinen in Vertragserstellung und Vertragsverwaltung. Bei Build to Order und Build to Stock sendet die Vertragsdomäne die gespeicherten Preise zur Neuberechnung an die Produktdomäne, sobald FRD und Kennzeichen vorliegen; die Preise werden entsprechend dem FRD auf die Laufzeit verteilt (Kapitel 5.7).

**Ergebnis.** Beim Erstellen des Angebots erzeugt das System die Angebotsdokumente automatisch; die Preisinformation rufen Sie als PDF ab (Kapitel 5.4 und 7.4). Die angewendeten Kampagnen, Rabatte und die Provision sind im Angebot und im Zahlungsplan berücksichtigt.

**Hinweise.**

- Ein DEALER-Benutzer sieht nicht die gesamte Preistabelle.
- Preise sind in der Produktpflege auf 99.999,99 begrenzt, damit die Vertragserstellung passende Produkte anzeigen kann (Kapitel 14.9).
- Kampagnen können der Markt auf Fahrzeuge eines Bestellzeitraums einschränken; die Pflege beschreibt Kapitel 14.13.

Quellen: Batch 1230.3, 1230.5, 1230.6, 1235.2, 1038.1, 1261.3, 948.2, 1072.1, 912.1, 1238.2, 1156.1, 1214.3, 940.1, 1002.3, 1047.1, 1244.2, 1009.1, 1063.1, 1043.1, 1071.1, 943.1, 1004.1, 999.4, 1044.1, 1060.1, 461.4, 1073.1, 882.4, 1057.1, 1058.3, 1066.1, 1072.1, 1065.1, 1045.1, 1107.2, 950.1, 662.2, 938.1, 1050.1, 889.1, 980.1, 1065.1, 996.1, 1054.2, 820.6, 1143.3, 991.2, 1113.1, 269.1, 1062.1, 1114.5, 1117.1

## 5.7 Angebotsgültigkeit und Änderungen

**Zweck.** Jedes Angebot erhält eine Gültigkeitsdauer, innerhalb derer der Kunde den garantierten Preis annehmen kann. Bis zur Bestätigung lassen sich Konfiguration und Daten des Angebots ändern; danach sind nur noch festgelegte Felder editierbar.

**Angebot und Status.** Mit der Übergabe in die Antragserstellung (Kapitel 5.8) vergibt oneSCM eine Referenznummer und setzt den Status „Created“. Nach der Wahl der Unterschriftsart wechselt der Vertrag auf „Waiting for Confirmation“, nach erfasster Unterschrift und negativer CAS-Prüfung auf „Confirmed“ und dann auf „Waiting for Activation“ (Kapitel 6 und 8). Bis zur Aktivierung finden Sie das Angebot im Proposal Management.

**Gültigkeitsdauer.** Die Dauer in Tagen ist je Markt und Division konfiguriert (zum Beispiel 100 Tage). Das System weist sie zu, sobald der Vertrag den Status „Waiting for Confirmation“ erreicht, und startet dann die Überwachung; dies gilt einheitlich für die Abläufe Available Chassis Number, Build to Stock und Build to Order. Die Gültigkeit endet am Ende des letzten Gültigkeitstags um 23:59:59 Uhr Ortszeit, unabhängig von der Uhrzeit der Anlage. Ein Angebot, das nur mit einem Baumuster angelegt wurde, erhält zunächst keine Gültigkeit; der Countdown beginnt, sobald eine Deal-ID, Auftragsnummer, VerSO-Order-ID oder Fahrgestellnummer gespeichert ist. Die Gültigkeit wird nur einmal vergeben: Wird nach einer Deal-ID später eine Fahrgestellnummer ergänzt, bleibt das Ablaufdatum unverändert. Erreicht das Angebot vor dem Ende der Gültigkeit den Status „Confirmed“, stoppt der Countdown, und es erfolgt keine automatische Ablehnung.

Das Ablaufdatum sehen Sie im Format TT.MM.JJJJ im Feld „Proposal Validity“ auf dem Reiter „Proposal“ der Detailansicht und in der Spalte „Proposal Validity“ des Proposal Managements; die Filter „Proposal valid from/until“ grenzen die Liste ein. Im Vertragsmanagement wird das Feld nicht angezeigt. Vor dem Ablauf erhält der Kunde eine E-Mail-Erinnerung mit den verbleibenden Tagen.

**Ablauf der Gültigkeit.** Unterschreibt der Kunde nicht innerhalb der Frist oder erfolgt nach fehlgeschlagenen Prüfungen kein Aktivierungsversuch, setzt das System den Vertrag und offene Sonderfälle auf „Rejected“. Der Kunde erhält eine Nachricht über den Ablauf, der Händler eine Kopie. Mail-Signatur-Dokumente stehen nach Ablauf der Bestätigungsfrist nicht mehr zur Verfügung.

Ein abgelaufenes Angebot kann dennoch zum Vertrag werden:

- Bei digitaler Signatur (DSS oder vor Ort) prüft das System nach der Unterschrift die Gültigkeit. Ist sie abgelaufen, fragt es bei der Vertragskalkulation den aktuellen Preis für die gespeicherte Konfiguration und die Fahrzeugdaten an. Stimmt der Vertragspreis mit dem neuen Preis überein (Toleranz ±1 Euro), wird der Vertrag auf „Confirmed“ gesetzt; weicht er ab, auf „Rejected“.
- Bei gedruckter und hochgeladener Unterschrift erfolgt dieselbe Preisprüfung. Bei Abweichung markiert das System den Vertrag in den MO Checks mit „Offer Validity NOK“. MO oder MPC prüfen das Unterschriftsdatum und setzen den Vertrag über die Aktion „Confirmed“ auf „Confirmed“ (Unterschrift innerhalb der Gültigkeit) oder lehnen ihn ab (Kapitel 9).

**Änderungen vor der Bestätigung.** Im Assistenten gelangen Sie mit „Zurück“ jeweils einen Schritt zurück, von „Übersicht und Bestätigung“ zu den Kunden- und Zahlungsinformationen und von dort zur Produktauswahl. Wählen Sie ein anderes Produkt oder ändern Sie Kundendaten, überschreibt das System beim nächsten „Weiter“ die gespeicherten Daten; Referenznummer und Status „Created“ bleiben erhalten, es entstehen keine doppelten Kunden. Zahlungsinformationen eines registrierten Zahlers mit gültigem SEPA-Mandat und SAP-Debitorennummer sind nicht änderbar.

Auf der Seite „Overview and Confirmation“ ändern Sie einzelne Felder ohne Rücknavigation über die Schaltfläche „Edit“ des Abschnitts; nur die laut Konfiguration änderbaren Felder werden freigeschaltet, da andere Änderungen Preis und Produktgültigkeit beeinflussen würden:

- „Vehicle Information“: Kennzeichen (bis elf Zeichen, alphanumerisch, deutsche Sonderzeichen und Bindestrich). Die Änderung wird auf Vertragsebene und im Vertragsentwurf übernommen.
- „Product Options“: Zahlungsoption zwischen „Monthly“ und „One Time“. Das Revenue Management erzeugt den Zahlungsplan neu; er ersetzt den Plan im Vertragsentwurf.
- „Collective Invoice“: Sammelrechnung ein- oder ausschalten.
- Kundeninformationen, Adresse, Zahlungsdetails, DSGVO-Einwilligung und Marketingpräferenzen nach „Bearbeiten“ und Speichern (Kapitel 6.6).

„Edit“ wird durch „Cancel“ und „Save“ ersetzt; „Save“ speichert nach Feldvalidierung, eine Begründung ist nicht erforderlich. Versucht eine zweite Person, dasselbe Feld zu ändern, erscheint vor dem Speichern der Hinweis, dass das Objekt geändert wurde und der Vertrag neu zu laden ist. Händler und MO bearbeiten die Detailreiter zu Fahrzeug, Produkt und Kunde eines Vertrags im Status „Created“; im Status „Waiting for Activation“ ist nur noch das Kennzeichen editierbar, Dealer-Benutzer können es dort pflegen. Die externe Vertrags-ID ist ab „Waiting for Confirmation“ für Dealer, Dealer+, MO und MPC editierbar, Änderungen werden protokolliert; sie ist optional, 1 bis 36 Zeichen (Buchstaben, Ziffern, „+“, „-“, „/“), nicht eindeutig und erscheint auf danach erzeugten Prolongationsdokumenten. Kundendaten und Dokumentensignatur lassen sich in den Status „Created“, „Waiting for Confirmation“, „Confirmed“ und „Waiting for Activation“ aktualisieren beziehungsweise erneut anstoßen („Retrigger Signature“).

**Fahrzeugdaten nachtragen (Build to Order, Build to Stock, Baumuster).** Fehlen bei der Erstellung Fahrgestellnummer, Erstzulassungsdatum oder Kennzeichen, zeigt die Übersicht „Not yet available“ (in älteren Oberflächenständen „Will be updated“). Der Prozess pausiert nach der Bestätigung, bis die Daten vorliegen.

1. Das Vehicle Management liefert die Fahrgestellnummer, sobald sie bei Order-API oder OTR vorliegt; der Vertrag wird automatisch aktualisiert. Solange keine Fahrgestellnummer vorliegt, ist die Aktion „Update“ im Proposal Management ausgegraut.
2. Nach der Zulassung öffnen Sie im Proposal Management die Aktion „Update“ des Vertrags. Der Dialog enthält die Pflichtfelder Erstzulassungsdatum und Kennzeichen; „Cancel“ bricht ab, „Update“ übernimmt die Angaben. Der Vertragsbeginn wird automatisch aus dem Erstzulassungsdatum gesetzt, die Aktion „Update“ verschwindet.
3. Liegt das eingegebene Datum später als Erstzulassungsdatum plus Vertragslaufzeit, warnt ein Banner, dass das Fortfahren den Vertrag beendet; bestätigen Sie, wird der Vertrag auf „Terminated“ gesetzt, sonst übernehmen Sie ein anderes Datum.
4. Der Vertrag wechselt auf „Waiting for Activation“; die Preise werden mit den gespeicherten Werten neu berechnet und auf die Laufzeit verteilt, der endgültige Zahlungsplan entsteht, und die Prüfungen laufen erneut (Kapitel 8).

Sobald zu einem Vertrag ohne Fahrgestellnummer (Baumuster, Auftragsnummer, Deal-ID, VerSO-Order-ID) die endgültige Fahrgestellnummer vorliegt, prüft oneSCM die Verträglichkeit in vier Schritten: Weicht das Baumuster des Fahrzeugs ab, überschreibt das System den Wert im Vertrag. Weichen Produkt, Produktkonfiguration oder Preis zur Fahrgestellnummer vom Vertrag ab, lehnt das System den Vertrag ab, vermerkt in der Historie „Produkt, Konfiguration oder Preis der Fahrgestellnummer stimmt nicht mit dem Servicevertrag überein“ und benachrichtigt den Kunden; auch ein bereits bestätigter Antrag wird abgelehnt. Bestehen alle Prüfungen, können FRD und Kennzeichen aktualisiert werden, und die Aktivierung läuft weiter. Dieselbe Prüfung gilt für MBLD-Verträge über den Edge Service.

**Preise bei Neuberechnung.** Wird ein bestehender Vertrag neu konfiguriert oder sein Produkt aktualisiert, berechnet oneSCM die Konfiguration mit den Preisangeboten, die zum Erstellungsdatum des Vertrags gültig waren; ein Vertrag vom 15.03.2026 behält also die Preise vom 15.03.2026. Administrationsgebühr und optionale Deckungen des Produkts bleiben unverändert.

**Händlerzuordnung ändern.** MO und MPC können einen falsch zugeordneten Händler während der Widerrufsfrist ändern, solange der Vertrag im Status „Waiting for Activation“, „Active“ oder „Suspended“ ist; vor der Aktivierung im Proposal Management, danach im Vertragsmanagement auf dem Reiter „Contract“ beziehungsweise „Dealer“. Nach Eingabe der E-Mail-Adresse werden Verkäufer, Autohaus (Auswahl bei mehreren), Stadt und GSSN-ID befüllt; beim Speichern geben Sie einen Grund an. Die Provisionsinformationen an Revenue werden nach Ablauf der Widerrufsfrist angepasst (Kapitel 10).

**Historie.** Der Reiter „History“ der Vertragsübersicht zeigt die Statuswechsel des Vertrags mit altem und neuem Status, Datum und dem Benutzernamen der angemeldeten Person. Die externe Vertrags-ID und Kundenänderungen werden mit Benutzername protokolliert.

**Hinweise.**

- Nach einer Produktänderung auf der Übersichts- und Bestätigungsseite wird kein neuer Sonderfall angelegt.
- Verträge im Status „Rejected“ werden gelöscht; Leasingverträge aktiviert der MO oder MPC über „Update“ mit Fahrgestellnummer, FRD, Kennzeichen und Vertragsbeginn (Kapitel 19).
- Beim Nachtragen des Erstzulassungsdatums bleiben die Prüfung und Anzeige bei Händlern ohne Zugehörigkeit korrekt, auch bei Verträgen, die ein MO für einen Händler bestellt hat.

Quellen: Batch 891.1, 891.4, 891.5, 891.6, 891.8, 993.2, 1098.1, 1086.2, 1053.1, 1102.2, 993.4, 1089.8, 1069.5, 1053.2, 1055.1, 1063.1, 992.2, 1083.1, 1020.1, 1012.1, 1033.1, 1112.1, 1057.1, 1052.1, 1071.1, 772.1, 1060.1, 1045.1, 1100.1, 1105.1, 1013.4, 1113.4, 1101.3, 998.3, 1112.1, 906.1, 950.1, 895.1, 910.1, 1042.1, 1089.1, 1180.2, 1244.2, 981.2, 1022.1, 1077.1, 1065.1, 873.5, 1067.1

## 5.8 Übergabe zur Antragserstellung

**Zweck.** Mit „Create Contract“ beziehungsweise „Create Proposal“ (in der deutschen Oberfläche „Angebot erstellen“) übergeben Sie das konfigurierte Produkt mit den Fahrzeugdaten in die Antragserstellung. Dort erfassen Sie Kunden- und Zahlungsinformationen und schließen den Antrag ab (Kapitel 6).

**Voraussetzungen.**

- Alle Pflichtfelder der Produktkonfiguration sind ausgefüllt; der Preis ist berechnet.
- Für ein Angebot über ein Baumuster liegt eine konkrete Kennung vor: Fahrgestellnummer, Auftragsnummer, Deal-ID oder VerSO-Order-ID. Ohne diese Kennung kann auch bei vollständig konfiguriertem Produkt kein Vertrag erstellt werden; das System fordert zur Eingabe auf.
- Bei einer Deal-ID stimmt der zu Beginn gewählte Kundentyp mit dem Kundentyp aus OTR überein (Kapitel 5.2).
- Für das Fahrzeug besteht kein aktiver oder ausgesetzter Vertrag (Kapitel 5.3).

**Kennung im Baumuster-Ablauf ergänzen.** Nach der Konfiguration erscheint unterhalb des Konfigurators die Schaltfläche „Add Identifier“. Sie öffnet ein Eingabefeld mit dem Hinweis „Enter a valid Chassis Number or Order Number“; zulässig sind Fahrgestellnummer, Auftragsnummer, Deal-ID und VerSO-Order-ID.

1. Geben Sie die Kennung ein. Das System ruft Fahrzeug- und Produktservices auf und prüft, ob das gewählte Produkt in derselben Konfiguration für die Kennung verfügbar ist.
2. Ist Produkt und Konfiguration verfügbar, bleiben Laufzeit, Laufleistung und Zahlungsintervall erhalten; der Preis wird auf Basis der Kennung aktualisiert, vorher angewendete Rabatte und Kampagnen werden entfernt und können erneut angewendet werden. Die Produktkarte zeigt statt des Baumusters die neue Kennung.
3. Ist nur das Produkt, aber nicht die Konfiguration verfügbar, setzt das System die konfigurierbaren Felder zurück, und Sie konfigurieren neu; die Schritte 2 bis 6 des Konfigurators sind wieder ausgegraut.
4. Ist das Produkt für die Kennung nicht verfügbar, erscheint das Fenster „Product Not Found“. Mit „Back to products“ kehren Sie zur Produktauswahl zurück, die Produkte zur neuen Kennung zeigt; mit „Enter Different Identifier“ oder „X“ bleibt die ursprüngliche Konfiguration bestehen, und Sie geben eine andere Kennung ein. Für die gewählte Konfiguration nicht verfügbare Produkte melden zusätzlich „Selected product not available for this configuration“.

Je Kennung gilt:

- Fahrgestellnummer: Die Nummer wird angezeigt, „Create Contract“ ist zunächst deaktiviert. Mit dem Schalter wählen Sie den Regelfall (FRD und Laufleistung schreibgeschützt aus dem Vehicle Management oder manuell) oder Build to Stock (Laufleistung 0). Erstzulassungsdatum, Kilometerstand und Kennzeichen sind Pflichtfelder (Kapitel 5.3). Die Ausschlussprüfung des Fahrzeugs erfolgt sofort. Nach Eingabe aller Pflichtfelder wird „Create Contract“ aktiv.
- Auftragsnummer oder VerSO-Order-ID: „Create Contract“ ist sofort aktiv; Fahrgestellnummer (falls vorhanden) und Baumuster werden schreibgeschützt angezeigt, der Preis wird anhand der Auftragsnummer aktualisiert. Der Ablauf Build to Order folgt.
- Deal-ID: „Create Contract“ ist aktiv; Fahrgestellnummer (falls vorhanden) und Baumuster sind schreibgeschützt, der Preis richtet sich nach der Deal-ID.

Nach dem Hinzufügen einer Kennung sind Vertragslaufzeit und Laufleistung weiterhin gefüllt, und „Drucken“ sowie „E-Mail senden“ bleiben aktiv. Ein Baumuster lässt sich nicht als zusätzliche Kennung erfassen; das Fenster schließt sich nach dem ersten Klick auf „Proceed“.

**Schritt für Schritt.**

1. Prüfen Sie Produkt, Laufzeit, Laufleistung, Zahlungsintervall, Deckungen, Kampagnen und Rabatte in der Detailansicht; nach „Create Contract“ können Sie die Konfiguration nur noch über die Rücknavigation oder die Bearbeitungsfunktionen ändern (Kapitel 5.7).
2. Klicken Sie auf „Create Contract“ beziehungsweise „Create Proposal“. Wiederholtes Klicken erzeugt keinen zweiten Vertrag.
3. Das System öffnet die Kundenidentifikation mit Dublettenprüfung (Kapitel 4). Sie wählen „Privat“ oder „Gewerblich“, erfassen die Suchangaben oder wählen einen Bestandskunden; gewerbliche Kunden identifizieren Sie über Firmenname oder USt-IdNr.
4. Erfassen Sie in Schritt 2 die Kunden- und Zahlungsinformationen (Kapitel 6.2). Bei gewerblichen Kunden ist die Branche vorbelegt. MO und MPC sehen zusätzlich den Abschnitt „Dealer Information“ zur Zuweisung an einen Händler.
5. Mit „Weiter“ startet oneSCM die automatischen Prüfungen in fester Reihenfolge: Fahrgestellnummer, Erstzulassungsdatum und Kilometerstand müssen mit den zu Beginn validierten Eingaben übereinstimmen (sonst „Please enter a valid Chassis Number“, „… First Registration Date“ oder „… Mileage“); danach folgen produkt-, preis- und kundenbezogene Prüfungen. Bei Build to Order werden FRD und Kilometerstand, ohne Fahrgestellnummer auch diese von den Prüfungen ausgenommen. Schlägt eine Prüfung fehl, erscheint eine Hinweismeldung, und es wird weder ein Kunde noch ein Vertrag angelegt.
6. Sind alle Prüfungen erfolgreich, vergibt das System die Referenznummer, setzt den Status „Created“ und öffnet „Übersicht und Bestätigung“ (Kapitel 6.6).

**Ergebnis und Systemstatus.** Der Vertrag existiert mit Referenznummer im Status „Created“ und ist über die Suche im Proposal Management auffindbar. Die Referenznummer besteht aus acht alphanumerischen Zeichen, einem Schrägstrich und sechs Zeichen für den Vertragstyp: Ländercode nach ISO 3166 ALPHA-2, zwei Ziffern des Jahres, Markensparte (P für Passenger Cars, V für Van, S für Smart) und Produkttyp (zum Beispiel E für Excellent), etwa 0000001A/DE23PE. Die Seite „Übersicht und Bestätigung“ zeigt Produkt mit Preisen, danach in dieser Reihenfolge Fahrzeuginformationen, Produktoptionen, Kundendetails, Adressdetails, Zahlungsinformationen, Steuern und Rechtliches, Forderungen aus dem FI-System, Planvorschau, Sammelrechnungen, Präferenzen, DSGVO und Marketingpräferenzen. Bei Einmalzahlung erscheint nur der Gesamtpreis. Noch nicht verfügbare Angaben zeigen „Not yet available“, der Kilometerstand bei Vertragsbeginn für Build to Stock und Build to Order 0. Über „Proposal Review“ öffnen Sie die Vorschau des Angebotsdokuments; das System wählt die zum Ablauf passende Vorlage, auch wenn Fahrgestellnummer, Kennzeichen oder Baumuster fehlen. Die weiteren Schritte Bestätigung, Unterschriftsart und Statuswechsel auf „Waiting for Confirmation“ beschreiben Kapitel 6.6 und 6.7.

**Besonderheiten je Rolle.** Händler sehen den Vertrag anschließend unter ihrer Outlet-ID; MO und MPC sehen alle Verträge des Marktes. Hat ein MO oder MPC den Vertrag einem Händler zugewiesen, ist er für diesen Händler und seine Outlet-ID sichtbar.

**Hinweise.**

- Bei einem Angebot über ein Baumuster ohne weitere Kennung bleibt das Angebot im Wartezustand ohne Gültigkeitsdauer (Kapitel 5.7).
- Aus einem Deep Link von OTR startet die Übergabe mit vorbelegter Deal-ID (Kapitel 5.1).
- Für die Massenerstellung übergeben Sie statt eines Fahrzeugs eine validierte Fahrzeugliste; Kunden- und Zahlungsinformationen gelten für alle Fahrzeuge der Gruppe (Kapitel 12.9).

Quellen: Batch 999.4, 1004.1, 909.1, 929.10, 972.1, 958.2, 1064.5, 1061.6, 1111.1, 1090.4, 1088.1, 974.1, 1062.1, 1020.1, 1027.2, 634.1, 991.2, 1054.2, 1029.1, 1029.2, 1030.1, 1005.2, 1079.1, 1080.1, 1112.1, 1075.1, 1076.1, 1105.1, 976.7, 424.1, 906.1, 910.1, 1033.1, 1051.1, 894.1

## Verschiebung in andere Kapitel

| Inhalt | Zielkapitel | Batch |
|---|---|---|
| Massenerstellung: „Add Multiple Vehicles“, Validierung in drei Schritten, Mass Vehicles Draft Page, Group ID, VerSO-Order-ID in der Massenerstellung, Upload-Formate, Sonderfall für Behördenkunden | 12.9 Massenanlage und Validierung von Fahrzeuglisten | 933.2, 932.2, 902.1, 917.5, 935.3, 959.2, 935.5, 1062.1, 1091.1, 1156.1, 897.1, 1043.1, 1.5 |
| Sonderfall (Special Case): Benachrichtigung, Übersichtsseite „Contract Generation – Special Cases“, Vier-Augen-Prüfung, Status | 12.4 Sonderfreigaben | 1184.2, 959.7, 1045.1, 1090.4, 1273.6 |
| Kostenzuordnung je Deckung bei Management-Verträgen, i155-Satz RC20 | 12 (Management-Verträge) und 19.x VEGA i155 | 934.2 |
| MBLD-Anbindung (Leasing), Edge Service, Aktivierung über „Update“ mit Vertragsbeginn, Filter „Sales Channel“ | 19 Schnittstellen (MBLD) und 12.2 | 986.1, 873.5, 863.2, 1042.1, 1089.1, 984.3 |
| Online-Sales-Schnittstelle, mPay und SEPA, Harmonisierung der Endpunkte | 19.x (Online Sales) und 22.2 | 950.1, 912.2, 868.1 |
| Produkte und Preise für anfragende Systeme (API, wide/narrow Request, Antwortaufbau) | 19.x Produkt- und Preisbereitstellung | 1235.2, 1230.3, 1230.5, 1230.6, 1040.1, 1002.3 |
| Fahrzeugstammdaten: VIS/VeDoc-Prüfung, Fahrzeugtyp CAR/VAN, Datenfelder, Aufruflimits, Baumusterliste aus CePrO, Motorbaureihen, Fahrzeuginformationstabelle, Filter | 19.4 CEPRO und 19.22 Schnittstellenbetrieb; 14.11 Fahrzeuggruppen | 24.1, 22.1, 26.3, 27.3, 17.5, 1194.1, 1182.2 |
| Produktdefinition und Produktpflege: Sales Level und Limits, Verkaufsprovision, Preise für enthaltene Optionen, Ablaufkriterien, Preismatrix, Zahlungsoptionen, Sales priority, Publish/Deactivate, Produktübersicht, Assistentenverhalten, Kundentypen am Produkt, Laufzeit bis 120 Monate | 14.8 Produktdefinition, Anlage und Veröffentlichung | 1214.3, 1236.1, 1188.1, 1255.1, 1270.3, 1231.2, 1282.2, 1283.3, 1283.2, 1224.7, 1224.8, 1239.3, 1238.1, 1238.2, 1185.1, 1261.4, 1228.5, 1252.5, 1253.1, 1188.4, 3.3 |
| Preisversion: Technische Optionen, optionale Deckungen, Inflationsaufschlag, Preisgrenzen, Cluster | 14.9 Preisversionen, Cluster und Faktorgrenzen | 1201.4, 1215.1, 1156.1, 1114.5, 1143.3 |
| Kampagnenpflege: Bestellzeitraum (VehicleOrderPeriod) | 14.13 Kampagnenanlage und Rabattpflege | 1117.1 |
| Steuerart „Tax Type“ in den Markteinstellungen, Tax Management, Steuerklassifizierungen, Steuersätze | 14.2 Marktspezifische Einstellungen und 14.x Steuerverwaltung | 940.1, 788.1, 266.1, 266.3, 218.5, 264.3 |
| Produkttest („Test Product“, „Product Testing“, Probelauf bis zur PDF-Vorschau) | 14.8 und 16.4 | 1203.1, 1145.1 |
| Vertragsanpassung: Verkürzung von Laufzeit und Fahrleistung (MBLD) | 10 Vertragsänderungen | 765.1, 765.2, 765.3 |
| Langzeitprolongation: „Offer Validity“ in der Vorlage | 10.x Prolongation und 7.4 | 358.3 |
| Kundenanlage und Kundensuche im Vertragsprozess: B2B-Anlage, VIES, Steuernummer, Mercedes me, Fuzzy Search, abweichender Zahler, Kundenstatus, Adressvalidierung, Kontaktperson, Sammelrechnung | 4 Kunden anlegen und 6.2 | 634.1, 638.1, 618.2, 626.4, 629.1, 655.1, 655.2, 655.3, 654.2, 668.1, 668.3, 666.4, 653.1, 1027.2, 1114.6, 1115.1, 1034.1, 1098.3, 602.2, 626.6, 1114.7 |
| Zahlungsarten: Banküberweisung (Kontohinweise, Schweiz), Kreditkarte, mPay, Zahlungsplan-Erstellung über REST | 6.2 und 12 (Markt Schweiz), 19.x Revenue | 921.1, 883.6, 1086.2, 1083.1, 1051.1, 168.4 |
| Bestätigung, Unterschrift (DSS, Print, eSignature), Erfolgsseite, Dokumenten-Upload, Status „Confirmed“ | 6.6, 6.7 und 8 | 1032.1, 1108.1, 489.3, 489.7, 1105.1, 1097.2, 1049.1, 431.2 |
| Automatische Prüfungen, CAS-Check, MO Checks, Dealership Check | 6.4 und 9 | 1029.1, 1030.1, 1011.1, 662.2, 1105.1, 1101.3, 1091.1 |
| Benachrichtigungen an Kunden, E-Mail erneut senden, Kommunikationsreiter | 7.x Dokumente und Kommunikation | 1027.1, 429.1, 1074.1 |
| Druckvariablen (VersoID, Deal-ID, Order Number, Fahrzeugreferenz, Technische Optionen), AGB-Vorlage, Vertragsvorschau ohne Fahrzeugdaten, Übersetzungsregel für Codes | 7.4 Vertragsdokumente und Sprachvarianten | 362.1, 360.2, 366.1, 1101.2, 1052.1, 424.1, 431.2, 884.5, 875.4 |
| Vertragsübersicht und Vertragsdetailseite (Reiter, Kopfbereich, Coverage Details, Vertragslaufzeit Real, Preisinformationen) | 10.1 Vertragsübersicht | 1022.1, 857.1, 859.2, 861.3, 981.1, 835.3, 269.1 |
| Erweiterte Vertragshistorie | 10.x Historie | 944.1, 815.3 |
| Vertragssuche über API, externe Vertragsnummer in API-Aufrufen | 19.x Vertrags-API | 1028.1, 772.1 |
| Ein Vertrag pro Fahrgestellnummer: Behandlung bei Aktivierung, Markteinstellung „Utility“ | 8 Aktivierung und 14.2 | 990.1, 982.1 |
| Liefertermin-Erinnerung an Händler (Target Delivery Date), Meldung an CONTRACT | 8 Aktivierung und 19.x | 940.2, 1178.5 |
| Nemesis-Vertragsereignis, Kafka-Reporting, Data Product SC_Price_Details | 19.x und 17 Reporting | 980.1, 305.2, 307.4 |
| Chargenjobs: letzte fünf Läufe | 19.22 Schnittstellenbetrieb | 264.1 |
| Lifecycle-Richtlinien für Speicher-Buckets, History Service, Code-Optimierung | 19.22 / Anhang Technik | 326.5, 922.2, 988.3 |
| Finance Management, Financial Documents, MDCR | 11 Finanzbelege | 125.4, 47.6 |
| Operative Review, Review-Profile | 9.x Vertragsprüfung | 768.3, 820.5 |
| Fahrzeuggruppen: automatische Benennung, Baumuster-Clustering Vans | 14.11 | 1144.3, 1194.1 |
| Automatisierte Qualitätssicherung, Testpläne, Regressionstests, QA-Framework | 16.4 Testnachweise | 885.3, 1286.2, 1287.2, 1287.4, 1297.2, 961.1, 957.2, 953.7, 1056.1, 1053.2, 1058.3, 1058.6, 1054.5, 590.5, 129.5 |
| Webhook-Zustellung, DLT, Kill Switch | 19.22 Schnittstellenbetrieb | 519.8 |
| Lieferantenberichte (eingestellt) | Anhang F | 753.1 |
| Suchfunktion „Search Baumuster“, Layout | 14.11 | 1082.1 |

## Klärungsbedarf

- Zuweisung der Angebotsgültigkeit: Batch 1098.1 weist sie bei „Waiting for Confirmation“ zu, Batch 891.4 und 993.2 beim Erreichen von „Created“; Batch 993.2 nennt für Build to Order und Build to Stock eine Gültigkeit bis zum Vorliegen von FRD und Kennzeichen plus 30 Tage. Der Text folgt Batch 1098.1 (jüngerer Stand); zu bestätigen.
- Zeitbasis der Gültigkeit: Batch 891.1 nennt UTC, Batch 1086.2 das Ende des letzten Tages um 23:59:59 Uhr Ortszeit. Der Text folgt Batch 1086.2.
- Bezeichnung des Gültigkeitsfelds: „Offer Validity“ (Batch 993.2, 1053.1, 993.4) gegenüber „Proposal Validity“ (Batch 1102.2). Der Text verwendet „Proposal Validity“; Spalten- und Filterbezeichnungen im Proposal Management sind zu prüfen.
- Angebot nur mit Baumuster: Batch 910.1 beschreibt die Anlage eines Antrags mit Referenznummer und Status „Created“ ohne weitere Kennung (Prozess pausiert), Batch 909.1 und 929.10 verlangen die Kennung vor „Create Proposal“. Der Text folgt Batch 909.1; die Wartestellung nach Batch 891.5 ist nur als Hinweis aufgenommen.
- Kennzeichen als Pflichtfeld: Batch 1039.1, 1038.1, 1019.2 führen es als optional, Batch 1101.2, 917.5 und 1067.1 als Pflichtfeld bei vorhandener Fahrgestellnummer und FRD. Der Text folgt dem jüngeren Stand.
- Maximale Stellen des Kilometerstands: sieben Stellen (Batch 1039.1, 24.1) gegenüber neun Zeichen (Batch 1030.1); Obergrenze 999.999 (Batch 1254.3). Der Text nennt sieben Stellen und 999.999 km.
- Händlerrabatt in Prozent: Batch 1107.2 entfernt die Prozentoption, Batch 1073.1 und 1072.1 beschreiben Prozent- und Betragsfelder; Batch 1089.5 enthält einen Vorschlag für ein Prozentfeld ohne Umsetzung. Der Text folgt Batch 1107.2.
- Preisdarstellung: Batch 1062.1 besagt, dass alle Preise in Vertragserstellung und Vertragsverwaltung Nettowerte sind; Batch 1009.1 und 1038.1 zeigen für Privatkunden Bruttopreise „inkl. MwSt.“. Der Text unterscheidet nach Kundentyp (Batch 948.2, 1052.1).
- Format der Referenznummer: Batch 1079.1 beschreibt acht Zeichen plus Schrägstrich plus sechs Zeichen (0000001A/DE23PE), Batch 1031.2 ein achtstelliges Format (DEPE001A). Der Text folgt Batch 1079.1.
- Länge der Deal-ID: 36 Zeichen (Batch 1153.1, 1088.1, 366.1) gegenüber zwölf Stellen (Batch 1000.2, 1212.2; beide eingestellt). Der Text nennt 36 Zeichen.
- Ablaufauswahl per Dropdown (Batch 1019.2, 482.2, 461.4, 1013.2) gegenüber einem einzigen Eingabefeld mit automatischer Erkennung (Batch 1010.1, 999.2). Der Text beschreibt das einzelne Eingabefeld.
- Automatische Prüfungen für den MVP: Erstzulassung höchstens vier Monate alt, Kilometerstand höchstens 10.000 km (Batch 1030.1). Ob diese Grenzen weiterhin gelten, ist offen; nicht in den Text übernommen.
- Signaturoptionen: Batch 1112.1 entfernt „Dokument drucken“, Batch 1108.1 und 1049.1 beschreiben drei Optionen inklusive Druck. Für Kapitel 6 zu klären.
- Kampagnen-Bestellzeitraum (Batch 1117.1): Der Abschnitt ist in der Quelle als Testeintrag gekennzeichnet, der gelöscht werden soll. Nur als Hinweis auf Kapitel 14.13 aufgenommen.
- Reifenprodukte: Dynamischer Preis nach Felge und Wetterprofil (Batch 897.1) ist mit „Blocked BAT Testing“ gekennzeichnet; Felgenauswahl zeigt nur „Nicht enthalten“ (Batch 1089.5, Übergangslösung). Endgültiges Verhalten zu bestätigen.
- Lücke zwischen Erstzulassung und Vertragsabschluss: Batch 256.2 nennt bis zu sechs Monate; Grenze zu bestätigen.
- Produkttyp in der Referenznummer: Batch 1079.1 nennt A für Advance, C für Compact, E für Excellent; weitere Produktlinien (Kontingent, Reifen, Van) sind nicht belegt.
- „Created By“ im Proposal Management: Batch 1024.2 nennt das Frontend-System, Batch 1079.4 „OneSCM“ im MVP, Batch 986.1 „MBLD“. Werteliste zu bestätigen.
- Erweiterte Vertragshistorie (Batch 944.1) trägt den Status „On Hold“ in der Quelle; nicht als Verhalten beschrieben.
- Zahlungsintervall „jährlich“ bei 54 Monaten Laufzeit (Batch 1048.1): Meldung eingestellt; Verhalten offen.
- Kompatible Produkte „Teil 2“ und Check 6 (nur abgelaufene Preisversion): Batch 3.3 und 1249.5 nennen das Vorhaben ohne Umsetzung; nicht beschrieben.
- Eingestellte oder geschlossene Meldungen ohne Handbuchinhalt (Anhang F): Vertragserstellung über zwölfstellige Deal-ID (Batch 1000.2, 1212.2), VdZ-Kundendaten (Batch 900.2, 897.1), Produktbild in Schritt 3 (Batch 1077.1), Lieferantenberichte (Batch 753.1), QA-Framework Phase 2 (Batch 1287.2), DATIX-Export (Batch 961.1), Reduktion der Pflichtfelder in der Kundensuche (Batch 1115.1), MBIL-Produktabfrage (Batch 3.2), Tooltips und „Must not be null“ (Batch 1075.1), „Payment Interval not visible while editing“ (Batch 829.2), Baumuster-Suche nicht geladen (Batch 14.2), Liftgate-Daten und erste reguläre Abrechnung (Batch 1046.1), geschlossene Meldungen aus Batch 1.7, Change-Request-Sammlungen ohne Inhalt (Batch 900.3, 913.3, 934.3, 961.1, 950.1), Themenliste ohne Umsetzung (Batch 867.2), Löschung abgelaufener Angebote nach sechs Monaten (Batch 822.2, 1053.1), REST-Zahlungsplan (Batch 168.4), Online Sales (Batch 912.2), Endpunkt-Harmonisierung (Batch 868.1), Druckvariable Ablaufkriterium (Batch 366.1), Kundenreiter „Edit“ als Platzhalter (Batch 1012.1), Vertragsanpassung in Entwicklung (Batch 765.1), M&M-Schnittstellen (Batch 922.1), unterdrückte Ablehnungsbenachrichtigungen (Batch 1083.1, zeitlich begrenzt).

## Vorschläge zur Gliederung

- 5.2 in Unterkapitel je Einstiegspunkt gliedern: 5.2.1 Fahrgestellnummer mit Erstzulassung, 5.2.2 Build to Stock, 5.2.3 Build to Order (Auftragsnummer, VerSO-Order-ID), 5.2.4 OTR-Deal-ID, 5.2.5 Baumuster (Pkw und Van). Das Material beschreibt je Kennung eigene Datenabrufe, Pflichtfelder, Prüfungen und Nachtragsabläufe.
- Neues Unterkapitel „5.4a Produkte vergleichen und unverbindliche Preisinformation“: Vergleichsmodus, Vergleichsansicht, Druck und E-Mail-Versand sind in rund 15 Abschnitten beschrieben und bilden einen eigenen Arbeitsschritt.
- Neues Unterkapitel „5.5a Kontingent- und Reifenprodukte konfigurieren“: Beide Produktarten haben eigene Konfigurationsfelder und Empfehlungslogiken.
- Neues Unterkapitel „5.9 Proposal Management“ (Angebotsverwaltung): Startseite, Spalten, Filter, Aktionen „Update“ und „Retrigger Signature“ sowie die Sichtbarkeit je Rolle sind heute auf 5.1 und 5.7 verteilt.
- Technische Optionen, optionale Deckungen und Sonderfall als eigene Abschnitte innerhalb von 5.5 beibehalten; der Sonderfall-Prüfprozess bleibt in 12.4.
- Massenerstellung (12.9) als eigener Prozess bestätigt; aus Kapitel 5 wird nur verwiesen.
