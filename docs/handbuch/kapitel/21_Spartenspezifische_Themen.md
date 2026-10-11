# 21 Spartenspezifische Themen

Dieses Kapitel beschreibt, wie oneSCM die Divisionen Pkw und Van trennt. Es zeigt, welche Daten und Optionen eine Division umfasst und wie sich Fahrzeugsuche, Produkte, Preisparameter, Antrag, Signatur, Aktivierung, Verwaltung und Finanzfolgen je Division unterscheiden. Die Abschnitte gelten für beide Divisionen, soweit nicht anders angegeben. Unklare oder widersprüchliche Aussagen aus dem Material stehen am Kapitelende im Klärungsbedarf.

## 21.1 Spartenprofil und Abgrenzung Pkw/Van

**Zweck.** Dieser Abschnitt erklärt, wie die Division in oneSCM den Datenzugriff und die Ansicht begrenzt. Die Einschränkung wirkt in der Vertragserstellung und Vertragsverwaltung, in der Vertragskalkulation, im Vehicle Management und auf der Seite „Product Testing“. Die Modulliste ist in den Quellen nicht einheitlich, siehe Klärungsbedarf.

**Voraussetzungen.** Ihrem Benutzer sind die Divisionsrollen PC, Van oder beide Rollen zugewiesen.

**Rollen.** Die Divisionsrollen gelten für die Rollen Dealer, Dealer+, MO, MPC und HQ Admin.

- Benutzer mit der Rolle PC greifen nur auf Daten der Division Pkw zu und sehen nur die Optionen dieser Division.
- Benutzer mit der Rolle Van greifen nur auf Daten der Division Van zu und sehen nur die Optionen dieser Division.
- Benutzer mit beiden Rollen greifen auf die Daten und Ansichtsoptionen beider Divisionen zu.
- Händler sehen zusätzlich nur Daten ihrer Organisationseinheit, und zwar innerhalb ihrer divisionsspezifischen Berechtigung.
- Ist einem MPC oder MO nur die Division Van zugewiesen, sieht er in den relevanten Modulen ausschließlich Van-Daten.

**Ergebnis und Systemstatus.** Sie sehen in der Oberfläche nur die Daten und Optionen Ihrer Division. Verwenden Sie in der Generierung eine Kennung, die zu einer anderen Division gehört, zeigt das System einen klaren Fehlerzustand an. Daran erkennen Sie, warum keine Ergebnisse zurückgegeben werden.

**Besonderheiten je Sparte.**

- **Pkw.** Die Division heißt in der Oberfläche „Passenger Cars“. Die Optionen dieser Division erscheinen nur für Benutzer mit der Rolle PC.
- **Van.** Die Division heißt „Van“. Die Optionen dieser Division erscheinen nur für Benutzer mit der Rolle Van.
- **Kampagnen.** Die Auswahl der Division ist bei Kampagnen ein Pflichtfeld. Besitzt ein Benutzer nur die Rolle Van, zeigt die Auswahl nur die Division Van. Die Kampagnentabelle enthält die Spalte „Division“. Der Filter „Division“ erscheint nur, wenn ein Benutzer für beide Divisionen berechtigt ist. Eine gewählte Division filtert die Tabelle, die Sortierung bleibt aktiv.

**Hinweise.**

- Die Dokumentation „Roles and entitlements“ beschreibt die Rollen und Berechtigungen im Detail. Die Quellen dazu sind Batch 1170.1.
- Die Batch-Jobs benötigen keine Anpassung an die Divisionsaufteilung.

**Fehlerbehebung.** Erhalten Sie keine Ergebnisse, prüfen Sie zuerst, ob die verwendete Kennung zu Ihrer Division gehört. Der Fehlerzustand nennt den Grund.

Quellen: Batch 1170.1, 939.1, 189.2, 181.1, 1144.4

## 21.2 Fahrzeugdaten und Kennungen je Sparte

**Zweck.** Dieser Abschnitt beschreibt, wie die Division die Fahrzeugsuche, die Zuordnung der Fahrzeugdaten und die Leasingabläufe bestimmt. Die Kennungen und ihre Formatregeln beschreibt Kapitel 5.2.

**Voraussetzungen.** Sie sind für die Division berechtigt, zu der das gesuchte Fahrzeug gehört. Für die Suche nach Pkw und Vans über die Bestellnummer benötigen Sie die Berechtigung für beide Divisionen.

**Schritt für Schritt.**

1. Öffnen Sie in der Vertragskalkulation die Fahrzeugsuche.
2. Geben Sie die FIN/VIN oder die Bestellnummer ein. Für den Modellcode gilt dieselbe Prüfung.
3. Das System ruft Marke, Division und Verkaufsbezeichnung für Fahrzeuge Ihrer Division ab.
4. Liegt das Fahrzeug in der anderen Division, erscheint eine Validierungsfehlermeldung.

**Ergebnis und Systemstatus.** Bei einem Fahrzeug Ihrer Division zeigt oneSCM Marke, Division und Verkaufsbezeichnung. Die Suche über die Bestellnummer liefert diese Angaben für beide Fahrzeugarten, wenn Sie für beide Divisionen berechtigt sind.

**Besonderheiten je Sparte.**

- **Pkw.** Die Markenstruktur im Vehicle Management umfasst die Marken Mercedes-Benz, AMG und Maybach. Unter Mercedes-Benz fallen alle regulären Pkw. Unter AMG fallen alle Fahrzeuge der Marken Mercedes-AMG und AMG. Unter Maybach fallen alle Fahrzeuge der Marken Mercedes-Maybach und Maybach.
- **Van.** Der Import von Fahrzeugdaten aus CePrO umfasst die Baureihen X, V, Citan, Vito, Viano und T. Die Produktgruppe L, Light Transporters, mit dem Sprinter ist in den Import einbezogen.
- **Leasing.** Bei Leasingverträgen wird die Division nicht im Request-Body der Edge Services übergeben. Sie ergibt sich aus dem Produkt. In der Vertragsantwort erscheinen die Werte PASSENGER_CAR für Pkw und VAN_CAR für Van. Die Edge Services beschreibt Kapitel 19.

**Hinweise.**

- Die Vertragsnummer trägt die Markenzuordnung P für Pkw, V für Van und S für Smart. Den Aufbau beschreibt Kapitel 21.4.

**Fehlerbehebung.** Erscheint eine Validierungsfehlermeldung bei einer gültigen Kennung, prüfen Sie, ob die Kennung zu Ihrer Division gehört. Ein Van-Benutzer erhält die Meldung bei einer Pkw-Kennung, ein Pkw-Benutzer bei einer Van-Kennung.

Quellen: Batch 1130.2, 7.1, 1094.2

## 21.3 Produkte und Preisparameter je Sparte

**Zweck.** Dieser Abschnitt beschreibt die Produktlinien je Division, die Regeln für die Produktkombination und die Gültigkeit von Angeboten.

**Produktlinien und Vega-Codes.** Die Produktlinie gilt für alle Produkte, unabhängig von der Division. Anhand der Produktlinie speichert oneSCM den Vega-Code in der Schnittstelle i155 im Satz RC05 an den Positionen 175 bis 176. Hat ein Produkt die Produktlinie SelectPlus, steht dort der Wert 20.

| Produktlinie | Vega-Code | Division |
|---|---|---|
| Advance | 01 | Pkw |
| Compact | 04 | Pkw |
| Compact Plus | 15 | Pkw |
| Excellent | 05 | Pkw |
| Tire | 06 | Pkw und Van |
| Maintenance | 19 | Van |
| MaintenancePlus | 24 | Van |
| Complete | 16 | Van |
| ExtendedWarranty | 18 | Van |
| SelectPlus | 20 | Van |
| WearTear | 23 | Van |

**Produktlinien je Division.** Die Division Pkw hat keine Produktlinie Basic. Blueprints dieser Linie sind der Produktlinie Excellent zugeordnet. Für Vans gilt eine eigene Liste mit den Produktlinien Maintenance, Comfort, Complete, Tire, Extended Warranty, SelectPlus und Wear/Tear. Die Tabellen der Produktlinien beider Divisionen dienen dem Material Number Board als gemeinsame Quelle.

**Verkaufsregeln.** Produkte mit sich überschneidender Basisabdeckung lassen sich nicht gemeinsam wählen. Gewerbliche Kunden und Privatkunden können mehrere Produkte ohne Überschneidung der Basisabdeckung wählen, sowohl in der Division Van als auch in der Division Pkw. Produkte mit überlappenden optionalen oder zusätzlichen Karosserieabdeckungen erscheinen bei der Vertragserstellung in beiden Divisionen.

**Sonderfälle je Division.** Ein MPC mit der Division Van prüft Sonderfälle nur für Vans. Ein MPC mit der Division Pkw prüft Sonderfälle nur für Pkw.

**Angebotsgültigkeit.** Die Gültigkeit eines Angebots, im System Offer Validity genannt, pflegen Sie in den Markteinstellungen getrennt für jede Division. Der kleinste Wert beträgt 0,05 Tage, das entspricht etwa einer Stunde. Empfohlen ist ein Höchstwert von 95 Tagen. Höhere Werte sind einstellbar, können aber bei der Anbindung an DSS zu Problemen führen. Die Gültigkeit gilt für die Kundentypen Privat, Privat Behörden, Gewerbe, Gewerbe Flotte und Gewerbe Behörden sowie für den Vertriebskanal Retail. Ist die Gültigkeit für Pkw auf 95 Tage und für Van auf 55 Tage eingestellt, erhält jedes Produkt die Gültigkeit seiner Division.

**Besonderheiten je Sparte.**

- **Pkw.** Die Regeln zur Produktkombination und zur Sonderfallprüfung gelten für Pkw wie für Vans.
- **Van.** Für die Produktlinie Maintenance stehen Marketingbilder bereit. Der Bildspeicher enthält die Bilder für Van-Maintenance. Sie stehen bei der Blueprint-Erstellung sowie bei der Produkterstellung und -bearbeitung zur Auswahl. Die Bilder Vans-1.png und Vans-6.png stehen nicht zur Verfügung.

**Hinweise.**

- Die Auswahl der Produkte im Angebot beschreibt Kapitel 5.4.
- Die Pflege von Blueprints und Bildern beschreibt Kapitel 14.8.

Quellen: Batch 1094.2, 1249.2, 1162.4, 891.2, 941.1, 1246.6

## 21.4 Antrag, Signatur und Aktivierung je Sparte

**Zweck.** Dieser Abschnitt beschreibt die Markteinstellungen, die für Antrag, Signatur und Aktivierung je Division gelten, die Zahlung per Banküberweisung sowie den Aufbau der Vertragsnummer.

**Voraussetzungen.** Sie benötigen eine Berechtigung für die Markteinstellungen der Division. Wer nur Pkw-Berechtigungen besitzt, sieht nur den Reiter „Passenger Cars“. Wer nur Van-Berechtigungen besitzt, sieht nur den Reiter „Vans“. Wer beide Berechtigungen besitzt, sieht beide Reiter.

**Schritt für Schritt.**

1. Öffnen Sie die „Market Settings“ Ihres Marktes.
2. Wählen Sie den Reiter „Passenger Cars“ oder „Vans“.
3. Ändern Sie die Einstellung. Sie gilt nur für die Division, in der Sie sie ändern. Konfigurationen einer Division werden nicht in die andere übernommen.

**Ergebnis und Systemstatus.** Die allgemeinen Einstellungen gelten für beide Divisionen gemeinsam. Dazu zählen Zeit und Datum, Name, Zahlen und Preise, Sprachen sowie der Kilometerstand. Funktionsspezifische Einstellungen wie die Timer und Erinnerungen gelten je Division. Für die Vertragserstellung hinterlegen Sie je Division die Gültigkeit des Angebots, die erste und zweite Erinnerung, die Wartezeit bis zur Vertragsaktivierung und die Prüfungsfrist für Kampagnen, jeweils in Tagen. Welche Frist gilt, bestimmt die Division des Produkts. Die Fristen der Vertragsverwaltung beschreibt Kapitel 21.5.

**Besonderheiten je Sparte.**

- **Banküberweisung für Privatkunden.** Der Schalter „Allow Bank Transfer for Private Customers“ steht im Reiter „Payment“ des Bereichs Utility und gilt je Division. Er ist standardmäßig ausgeschaltet. Ist er ausgeschaltet, wird das Kontrollkästchen „Private“ unter Bank Transfer vor und nach der Aktivierung nicht angezeigt. Die Auswahl „All“ wählt dann alle Kundentypen außer Privat aus. Ist der Schalter eingeschaltet, können Sie „Private“ auswählen. Die Banküberweisung für Privatkunden ist damit für diesen Markt und diese Division aktiviert. Wird der Schalter ausgeschaltet, nachdem „Private“ ausgewählt war, wird die Auswahl automatisch deaktiviert und ausgeblendet. Bereits angelegte Verträge mit Banküberweisung bleiben unverändert. Die Änderung gilt nur für Verträge, die danach angelegt werden.
- **Kundenfeld Company Registration Number.** Ein Schalter unter „General Settings“ im Bereich „Customer“ steuert die Sichtbarkeit des Feldes für Gewerbekunden. Der Schalter gilt je Division und nur für die zugeordnete Division. Das Feld selbst beschreibt Kapitel 4.3.
- **Pkw, Liefertermin.** Für Pkw fragt der Job „GetDeliveryDateGlobalOrder“ GO anhand der Auftragsnummer ab. Ist das Feld „DateTo“ im Element „TargetDeliveryDate“ befüllt, meldet das System den Liefertermin an CONTRACT. Ist es leer, erfolgt in diesem Lauf keine Meldung. Die folgenden Läufe fragen den Auftrag erneut ab, bis ein Liefertermin vorliegt.

**Hinweise.**

- Die Vertragsnummer vergibt oneSCM, sobald der Vertrag nach den automatischen Prüfungen den Status „Created“ erhält. Sie besteht aus zwei Teilen, getrennt durch einen Schrägstrich. Der erste Teil hat acht alphanumerische Zeichen und wird an die Finanzsysteme übermittelt. Der zweite Teil hat sechs alphanumerische Zeichen. Er enthält den Ländercode nach ISO 3166 Alpha-2, die letzten zwei Ziffern des aktuellen Jahres, die Markenzuordnung P, V oder S sowie den Produkttyp A, C oder E. Ein Beispiel ist 0000001A/DE23PE. Die vollständige Nummer übermittelt oneSCM an alle Domänen und externen Systeme außer NACOS. Sie wirkt sich auf die Schnittstelle i155 im Satz RC05 an den Positionen 13 bis 27 aus.
- Die Feature-Einstellungen umfassen die Signatur mit der eSignature On Premise und der DSS-Signatur. Beide Verfahren bieten die Option, eine Papierkopie zu drucken, sowie das Drucken des Dokuments.
- Die Konfiguration der digitalen Zahlung über MPay bleibt in den MPay-Konfigurationen. Der Reiter „Payment“ verlinkt dorthin.

Quellen: Batch 941.1, 883.4, 883.2, 581.2, 1030.2, 1178.3

## 21.5 Verwaltung und Finanzfolgen je Sparte

**Zweck.** Dieser Abschnitt beschreibt die Materialnummern je Division, die Exportwerte für die Finanzschnittstellen, das Reporting für Vans und die Verwaltungsfristen je Division.

**Voraussetzungen.** Der Bereich „Material Numbers Management“ liegt im HQ-Konfigurationsmenü. Er ist nur für HQ Admins sichtbar und steht nur in Märkten zur Verfügung, in denen oneERP als FI-System eingeführt ist.

**Schritt für Schritt.**

1. Öffnen Sie im HQ-Konfigurationsmenü den Bereich „Material Numbers Management“.
2. Wählen Sie zuerst den Geschäftsbereich. Das Feld „Produktlinie“ zeigt danach nur die Produktlinien dieses Geschäftsbereichs.
3. Pflegen Sie je Kombination aus Division und Produktlinie den Typ Invoice, der verpflichtend ist, sowie die optionalen Typen MOT und OldPartTax.
4. Bearbeiten oder löschen Sie eine Materialnummer nur, solange ihr Gültigkeitsbeginn in der Zukunft liegt. Die Aktionen „Bearbeiten“ und „Löschen“ erscheinen nur in diesem Fall. Eine Materialnummer lässt sich nur löschen, wenn sie nicht in Verwendung ist. Bearbeitbar sind Materialnummer, „Valid From“ und „Valid To“.

**Ergebnis und Systemstatus.** Die Ergebnistabelle zeigt Materialnummer, Division, Produktlinie, Materialnummerntyp, Gültigkeit und Aktionen. Angezeigt werden nur Materialnummern, deren Gültigkeitszeitraum den heutigen Tag einschließt. Hat eine Kombination mehrere Gültigkeiten, klappen Sie die Zeile auf. Der Unterbereich zeigt dann Materialnummer, Gültigkeit, Änderungsdatum, Bearbeiter und Aktionen. Sind keine Materialnummern vorhanden, erscheint der Text „There are no Material number available“.

**Besonderheiten je Sparte.**

- **Pkw.** Der Export E174 führt für Pkw in der Spalte Business Division den Wert 268C. Die Business Division hat die Länge 4 und steht an den Positionen 75 bis 78.
- **Van.** Der Export E174 führt für Vans in der Spalte Business Division den Wert 268V. Für das Reporting zu MBD-Vans stehen der Vertragsnettopreis und der Vertragsnettopreis pro Kilometer zur Verfügung. In den UDMs heißen die Felder contract_net_price und contract_net_price_per_km. Im Datenprodukt Revenue, Tabelle base_sc_revenue_contract, heißen sie contract_net_price_amt und contract_net_price_per_km_amt. Der Vertragsnettopreis stammt bei den Altsystemen aus dem Feld CustomerNetPrice2 der Bestandsberichte von ICON und Asset. Sirius ist nicht betroffen. Der Nettopreis pro Kilometer stammt aus dem Feld realPriceCentPerMile des DDECost-Berichts von ICON, Asset und Sirius. oneSCM liefert den Nettopreis pro Kilometer nicht.
- **Materialnummern für Van.** Die Auswahl der Produktlinien enthält für die Division Van den Wert SIVECO. SIVECO folgt nicht der Struktur Division, Produktlinie, Materialnummer und ist deshalb als eigener Wert aufgeführt.

**Hinweise.**

- Die Exporte E174 und E169 verwenden den Gruppennamen E174-SC. Das Feld „Reserve for additional BSSEG Fields“ umfasst 10 Zeichen.
- Die Datei E174_AfterSales führt den Revenue-Bereich in der aktuellen Fassung.
- Im Export E169 lauten die Rechnungstypen ESUB und ESER. Sie ersetzen EXTSUB und EXTSER.
- Die Fristen der Vertragsverwaltung hinterlegen Sie je Division. Dazu zählen die Widerrufsfrist, der Zeitraum für die manuelle Vertragsprüfung, die Wartezeit bei Übertragungen, die Wartezeit bei einem Wechsel des Zahlers sowie die erste und zweite Erinnerung, jeweils in Tagen. Der Zeitraum für die Erstellung von Werkstattrechnungen ist ein verpflichtendes Feld und wird in Monaten angegeben. Für die Datenlöschung gelten Fristen für abgelehnte Verträge in Tagen, für stornierte Verträge in Tagen und für Verträge nach ihrem Abschluss in Jahren.
- Die Pflege von Blueprints und zentralen Stammdaten beschreibt Kapitel 15.

**Fehlerbehebung.** Eine Materialnummer lässt sich nicht löschen, wenn sie in Verwendung ist oder bereits gültig ist. Erfolg und Fehler zeigt das System als Toast-Meldung an.

Quellen: Batch 210.2, 210.4, 191.4, 225.5, 315.2, 941.1

## 21.6 Spartenplanung, Tests und Freigaben

**Material: keine Quellen in den RAG-Batches.**

Dieser Abschnitt behandelt die Abstimmung der Sparten, die Tests je Division und die Freigaben. Zu diesem Unterkapitel sind keine Abschnitte zugeordnet.

Quellen: keine

## Verschiebung in andere Kapitel

- **Kapitel 4.3, Kundendaten und Pflichtangaben prüfen:** Batch 581.2. Das Feld Company Registration Number umfasst Eindeutigkeit, maximal 15 Zeichen und die Prüfung auf Duplikate. Für Kunden vom Typ Commercial Governmental im slowakischen Markt ist es ein Pflichtfeld.
- **Kapitel 4.8, Dealer-Onboarding und Partnerprozess:** Batch 552.4. Die Händlerregistrierung verlangt identische Warranty-IDs über die Divisionen hinweg.
- **Kapitel 5.7, Angebotsgültigkeit und Änderungen:** Batch 891.2. Die Gültigkeitsdauer eines Angebots mit Mindestwert, Empfehlung und betroffenen Kundentypen.
- **Kapitel 8.3 beziehungsweise Kapitel 15.7, Technical Options, SA-Matching, Coverage- und Industry-Codes:** Batch 8.3. Die Anlage von TO-Gruppen erkennt doppelte Gruppennamen und lässt keine Sonderzeichen im Gruppennamen zu. Die Sortierung nach Gruppenname und Division ist korrekt. Die Zielzuordnung ist im Klärungsbedarf zu bestätigen.
- **Kapitel 11.1, Rechnungsstellung und Zahlpläne:** Batch 706.2. Das Feld Division bei internationalen Rechnungen im Admin-Bereich wird aus Vedoc übernommen und dient als Filter.
- **Kapitel 11.7, Reporting, Filter und Exporte:** Batch 315.2. Die Reportingfelder für den Vertragsnettopreis bei MBD-Vans.
- **Kapitel 12.3, Kampagnen und Sonderkonditionen:** Batch 1144.4. Die Division als Pflichtfeld und die Divisionsfilter bei Kampagnen.
- **Kapitel 14.2, Marktspezifische Einstellungen:** Batch 941.1. Allgemeine Einstellungen, Dokumentenverwaltung, Feature-Einstellungen und externe Systemeinstellungen.
- **Kapitel 14.4, Vorlagenverwaltung und Template Management:** Batch 493.4, 494.4, 496.4. Optionale Angaben zu Division, Marke und Sprache bei Vorlagen. Der Stand ist im Klärungsbedarf benannt.
- **Kapitel 14.5, Administrationsbereich und zulässige Aktionen:** Batch 723.2 und 731.2. Bearbeitung und Übersicht der Schadencodes im Admin-Bereich mit den Filtern Division und Markt.
- **Kapitel 14.8, Produktdefinition, Anlage und Veröffentlichung:** Batch 1246.6. Der Austausch der Van-Marketingbilder im Bildspeicher.
- **Kapitel 19.2, GO, Pkw-Auftragsinformationen:** Batch 1178.3. Der Abruf des Liefertermins im Detail.
- **Kapitel 19.15, MPay, Zahlungsintegration:** Batch 941.1. Die Konfiguration mit Händlername, Händler-ID, Benachrichtigungs-URL und Gültigkeit des Zahlungslinks in Sekunden, zwischen 1 und 15.768.000.

## Klärungsbedarf

Die folgenden Punkte beruhen auf widersprüchlichen oder unklaren Aussagen im Material. Eingestellte oder geschlossene Meldungen gehören in das Klärungsregister im Anhang F.1.

1. **Batch 217.3, Meldung geschlossen.** Die Angaben zur Business Division im Export E174 weichen für den Buchungsschlüssel 40 von Batch 225.5 ab. Die Meldung ist geschlossen. Ihre Feldregeln stehen deshalb nicht im Fließtext.
2. **Batch 169.2, Projektaufgabe.** Der Text beschreibt Aufgaben zum Löschen der Produktlinie Basic per Skript, zur Prüfung betroffener Stellen und zur Anpassung von Tests. Das ist kein Systemverhalten. Batch 1249.2 beschreibt die Löschung als erfolgt. Offen ist, ob die Einträge im HQ-Konfigurationsmenü unter „Material Numbers Management“ entfernt sind.
3. **Batch 1146.3.** Die Angabe, dass die Produktlinienliste für Vans aktualisiert werden soll, enthält keine Details. Abzugleichen sind Batch 1249.2 und Batch 191.4.
4. **Produktlinien der Division Van.** Batch 1249.2 nennt Maintenance, Comfort, Complete, Tire, Extended Warranty, SelectPlus und Wear/Tear. Batch 191.4 nennt SIVECO, aber kein Wear/Tear. Batch 1094.2 nennt Wear/Tear und MaintenancePlus, aber kein Comfort. Batch 1094.2 führt außerdem Compact Plus und MaintenancePlus, die Batch 1249.2 nicht aufführt. Ob SIVECO eine Produktlinie oder ein Sonderfall ist, bleibt offen: Batch 210.2 nennt es einen Sonderfall, Batch 191.4 führt es als Produktlinie.
5. **Rollen und Module der Divisionsbeschränkung.** Batch 181.1 nennt die Rollen HQ Admin, MPC und MO. Batch 1170.1, 939.1 und 189.2 nennen zusätzlich Dealer und Dealer+. Die Module weichen ab: Batch 189.2 nennt Revenue Management und Cost Management, Batch 939.1 nennt Contract Generation und Contract Management, Batch 1170.1 nennt Contract Calculation, Vehicle Management und Product Testing.
6. **Rollenbezeichnung.** Batch 1144.4 verwendet die Bezeichnung „Vans“, Batch 1170.1 und Batch 181.1 verwenden „Van“.
7. **Import der Produktgruppe L, Batch 7.1.** Die Erweiterung des CePrO-Imports um den Sprinter wird beschrieben. Das Material bestätigt nicht den Importstand in allen Umgebungen.
8. **Nummernbildung der Vertragsnummer, Batch 1030.2.** Der erste Teil wird zugleich als „automatisch hochgezählt“ und als „mit zufälliger Generierung“ beschrieben. Die Beispiele zeigen keine erkennbare Reihenfolge.
9. **Feature-Einstellungen, Batch 941.1.** Die Option, ohne Signatur fortzufahren, verweist auf „PI12“ ohne Beschreibung. Der Hinweis zu weiteren Informationen zur persönlichen ID im Privatkundensegment ist ohne Inhalt. Die Anforderung an die Tabelle „Inflation“ nennt kein Ergebnis. Unklar ist auch, ob die Signatureinstellungen je Division getrennt gelten.
10. **Optionale Angaben bei Vorlagen, Batch 496.4, 493.4 und 494.4.** Die Angaben beschreiben den MVP-Stand. Van und Smart sind als Ausbau nach dem MVP genannt, der heutige Stand ist daher nicht belegt. Batch 496.4 nennt keinen Dokumenttyp. Batch 1030.2 führt Smart in der Vertragsnummer bereits mit dem Kennzeichen S.
11. **Intervall des Jobs, Batch 1178.3.** Das Intervall der wiederholten Läufe ist nicht angegeben.
12. **Revenue-Bereich, Batch 225.5.** Die Werte des Revenue-Bereichs in der Datei E174_AfterSales sind im Material nicht enthalten.
13. **Aktionen der Schadencodes, Batch 731.2 und 723.2.** Batch 731.2 verweist die Aktionen auf andere Arbeitspakete, eine Beschreibung fehlt. Die Zuordnung zu Kapitel 14.5 ist zu bestätigen.

## Vorschläge zur Gliederung

- **21.6** hat keinen Quellenbestand. Das Unterkapitel sollte gestrichen oder mit Kapitel 16.4 zusammengeführt werden.
- **21.5** enthält Materialnummern je Division, die die Gliederung nicht eigens führt. Ein eigenes Unterkapitel würde die Verwaltung der Materialnummern sichtbar machen.
- **21.3** enthält eine umfangreiche Tabelle zu Produktlinien und Vega-Codes. Ein eigenes Unterkapitel dafür wäre sinnvoll.
- **21.1** und **2.2** überschneiden sich bei den Divisionsrollen. Ein Verweis von 2.2 auf 21.1 hilft beim Lesen.
- **21.4** enthält Markteinstellungen, die auch Kapitel 14.2 betreffen. Ein Verweis von 14.2 auf 21.4 wäre hilfreich.
- **Schadencodes** haben keinen klaren Bezug zu einer Sparte. Der Abschnitt sollte in Kapitel 14.5 geprüft und dort eingeordnet werden.
