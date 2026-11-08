# 20 Länderspezifische Themen

Dieses Kapitel beschreibt, wie sich oneSCM je Markt unterscheidet. Es behandelt das Marktprofil mit Formaten und Pflichtangaben, die Zuordnung von Benutzern und Partnern zu Märkten, marktspezifische Produkte, Preise und Steuern, Zahlung und Finanzabgleich, die Einführung von Märkten sowie die Prüfung von Länderabweichungen. Die Pflege der Marktwerte durch die Marktrolle beschreibt Kapitel 14, die Kundenanlage Kapitel 4, die Vertragserstellung die Kapitel 5 und 6. Abschnitte, zu denen das Material keine Quellen enthält, sind ausdrücklich gekennzeichnet. Widersprüche, unklare Aussagen und geschlossene Meldungen führt der Klärungsbedarf am Kapitelende.

## 20.1 Länder- und Marktprofil

**Zweck.** Das Marktprofil bestimmt, welchen Markt der angemeldete Benutzer in oneSCM verwendet, welche Formate für Zahlen, Datum, Währung und Namen gelten und welche Pflichtangaben je Land zu erfassen sind. oneSCM richtet die Anwendung am angemeldeten Benutzer aus.

**Voraussetzungen.** Sie sind an einem Markt angemeldet. Ist Ihnen in ALICE mehr als ein Markt zugewiesen, berücksichtigt oneSCM alle zugewiesenen Märkte, siehe Abschnitt 20.2.

**Unterstützte Märkte.** oneSCM unterstützt 38 Märkte und einen globalen Markt. Die Liste umfasst Deutschland, Belgien, Russland, Frankreich, Griechenland, das Vereinigte Königreich, Italien, die Niederlande, Österreich, Portugal, Polen, Rumänien, Dänemark, Schweden, die Schweiz, Tschechien, Spanien, die Slowakei, die Türkei, Ungarn, Südafrika, Kanada, die USA mit der Gesellschaft MBUSA, Mexiko, Argentinien, Brasilien, Taiwan, China, Indien, Indonesien, Japan, Südkorea, Malaysia, Singapur, Thailand, Vietnam, Australien und Neuseeland.

**Divisionen je Markt.** Für fast alle Märkte stehen alle Divisionen zur Verfügung. Für Malaysia ist ausschließlich die Division Passenger Car verfügbar.

**Besonderheiten je Markt.**

| Markt | Regel |
|---|---|
| Deutschland | Standardsteuer ist die Mehrwertsteuer VAT. Die Seiten „Old Part Taxes“ erscheinen nur für diesen Markt. Für Mercedes me gelten die Werte Ländercode DE, Sprachregion de-DE, Typ B2C und Anwendungsfall MMCR_NEW_USER. |
| Slowakei | Gewerbekunden erfassen eine VAT-ID, eine Steuernummer oder beide Angaben. Die Regel gilt unten. Einige Seiten sind ausgeblendet. Im Reiter „Zahlung“ eines Vertrags stehen keine Funktionen für Werkstattrechnungen zur Verfügung. |
| Schweiz | Steuernummer und VAT-ID lassen sich im Schweizer Format erfassen. Für die Sprachen sind zum Beispiel Deutsch, Französisch, Italienisch und Englisch vorgesehen. |
| Indien | Die Steuer ermittelt das System über den GST-Satz, siehe Abschnitt 20.3. Für gewerbliche Kunden ist Kreditkartenzahlung auch ohne Mercedes me Konto zulässig, siehe Abschnitt 20.4. |
| Malaysia | Nur die Division Passenger Car ist verfügbar. |

**Gewerbekunden im slowakischen Markt.** Die Gewerbekunden-Typen Commercial, Commercial Fleet und Commercial Governmental können eine Umsatzsteuer-Identifikationsnummer VAT-ID, eine Steuernummer oder beide Angaben hinterlegen. Die Steuernummer besteht aus zehn Ziffern, die VAT-ID aus dem Länderkürzel SK und zehn Ziffern. Geben Sie die VAT-ID ein, übernimmt oneSCM den Wert ohne Länderkürzel in das Feld „Steuernummer“. Dieses Feld bleibt editierbar. Erfassen Sie nur die Steuernummer, bleibt das Feld „VAT-ID“ leer. Die Anfrage an CoFiCo enthält im ersten Fall beide Angaben, im zweiten Fall nur die Steuernummer im Attribut taxNumber1. Beispiel mit Testdaten: Die VAT-ID SK1234567890 ergibt die Steuernummer 1234567890.

**Sichtbarkeit je Markt.** Im slowakischen Markt sind Seiten ausgeblendet, die nicht zu diesem Markt gehören. Die Materialnummernverwaltung im Bereich Admin erscheint nur für oneERP-Märkte. Die Seiten „Old Part Taxes/I156“ und die zugehörige Manual-Variante stehen unter Finanzverwaltung und dann Finanzkontrolle nur für Deutschland zur Verfügung. Die Berechtigungen je Seite beschreibt Abschnitt 14.6.

**Formate je Markt.** Pro Markt gibt es genau eine Konfiguration. MPC-PM-Benutzer legen sie fest. Alle anderen Benutzer sehen die Felder entsprechend der Konfiguration ihres Marktes. Die Konfiguration umfasst:

- Zeitformat im 24-Stunden-Format oder im 12-Stunden-Format mit PM, optional mit Sekunden
- Datumsformat mit der Reihenfolge Jahr, Monat, Tag, Monat, Tag, Jahr oder Tag, Monat, Jahr sowie einem der Trennzeichen Bindestrich, Schrägstrich oder Punkt
- Währungen als Mehrfachauswahl aus der Liste des Feldes „Currency“ in den Kundendetails
- Namensformat „First Name, Last Name“ oder „Last Name, First Name“
- Zahlenformat 1.000,0, 1,000.0 oder 1’000.0
- Nachkommastellen ohne Dezimalstelle, mit einer oder mit zwei Dezimalstellen
- Sprachen als Mehrfachauswahl aus der Liste des Feldes „Language“ in den Kundendetails

Die Pflege der Markteinstellungen beschreibt Abschnitt 14.2.

**Pflichtangaben für Mercedes me je Land.** Ein Mercedes me Profil legen Sie direkt aus der Vertragserstellung an. Es kann nur für Kunden angelegt werden, die in mindestens einem Vertrag die Vertragsrolle „Holder“ innehaben.

**Schritt für Schritt.**

1. Erfassen Sie im Schritt „Kundendetails“ Vorname und Nachname sowie die E-Mail-Adresse oder die Mercedes me ID und die Telefonnummer oder die Mercedes me ID.
2. Holen Sie die Zustimmung des Kunden ein, seine Mercedes me Profildaten zu verwenden.
3. oneSCM prüft zuerst, ob der Kunde in der oneSCM-Datenbank vorhanden ist. Mit der Zustimmung folgt die Prüfung in Mercedes me über zwei Abfragen, eine mit der E-Mail-Adresse und eine mit der Telefonnummer.
4. Wählen Sie einen Kundentreffer oder legen Sie einen neuen Kunden an, und ist der Kunde nicht mit einer Mercedes me ID erfasst, aktivieren Sie am Ende der Seite den Schalter mit der Beschriftung „I have obtained the customer's consent to create an account for them.“ Nur mit aktiviertem Schalter übermittelt oneSCM die Daten an Mercedes me.
5. Nach dem Anlegen des Profils befüllt oneSCM das Feld „Mercedes me ID“ im Bereich „Kundendetails“.

**Ergebnis und Systemstatus.** Wird zu einem vorhandenen oneSCM-Datensatz ein passendes Mercedes me Profil gefunden, ergänzt oneSCM den Datensatz um die Profil-ID. Hat der Kunde ein Mercedes me Profil, aber keine Mercedes me ID im Datensatz, übernimmt oneSCM die gefundene ID. Dafür ist ein Abruf des Profils aus Mercedes me erforderlich.

**Pflichtfelder und Einwilligungen.**

- Die Pflichtfelder ermittelt oneSCM über den Endpunkt getProfileFields. Sie hängen von countryCode, locale, type und useCase ab.
- Zu den Kontodaten gehören E-Mail-Adresse und Telefonnummer. Der Kunde wählt eine davon als Benutzernamen. Beide sind in Mercedes me Pflichtfelder.
- Vorname, Nachname und Land sind Pflichtfelder. Für das Land ist der Ländercode zu übermitteln.
- Sprache, Straße, Hausnummer, Postleitzahl und Ort sind optional und sollten an Mercedes me übergeben werden.
- Die Zustimmung zu den Nutzungsbedingungen ist verpflichtend.
- Einwilligungen in Marketinginformationen und in die Erhebung weiterer Daten sind nicht verpflichtend.
- Bankdaten sind nicht verpflichtend.

**Hinweise.**

- Die Pflichtfelder können je Land abweichen. Die Abfrage erfolgt bei jedem Anlegen über den Endpunkt getProfileFields.
- Für die Profilanlage nutzt oneSCM die Endpunkte getProfileFields und createUserV2 mit dem Anwendungsfall MMCR_NEW_USER.
- Die Kundenanlage mit Trefferprüfung beschreibt Abschnitt 4.2 und 4.3.
- Die Angaben zu Mercedes me stimmen im Ablauf überein. Die Rollenbezeichnung und einzelne Formulierungen weichen ab und sind im Klärungsbedarf geführt.

Quellen: Batch 1308.1, 581.1, 143.2, 142.9, 552.2, 650.1, 989.1, 644.1, 638.2, 640.1

## 20.2 Lokale Rollen und Zugangsvarianten

**Zweck.** Der Markt des angemeldeten Benutzers begrenzt, welche Partnerdaten er sieht und pflegen kann. Dazu gehören die Händlertabelle, die Lieferantentabelle und die Registrierung von Händlern.

**Voraussetzungen.** Sie sind mit Ihrem Markt angemeldet. Mehrere Märkte können Ihnen in ALICE zugewiesen sein, etwa Indien und Deutschland. oneSCM berücksichtigt in diesem Fall alle zugewiesenen Märkte.

**Rollen.** Die Partnertabellen werden auf Marktebene gepflegt. Die Rollen und Berechtigungen beschreiben Kapitel 2.2 und Abschnitt 14.6.

**Schritt für Schritt: Händler für den eigenen Markt registrieren.**

1. Öffnen Sie im Partner Management die Händlertabelle.
2. Registrieren Sie einen Händler einzeln oder per Upload. Gefunden und registriert werden ausschließlich Händler, die Ihrem Markt zugeordnet sind.
3. Geben Sie die GS-Outlet-ID des Händlers ein. Gehört der Händler einem anderen Markt, übernimmt oneSCM keine Daten in die Registrierungstabelle. Stattdessen erscheint ein Hinweis, dass der Benutzer oder der Markt keine Zugriffsberechtigung für diesen Händler besitzt.

**Ergebnis und Systemstatus.** Die Händlertabelle zeigt ausschließlich Händler des Marktes, dem der Benutzer bei der Anmeldung zugeordnet ist. Die Filterung erfolgt serverseitig. Die Lieferantentabelle orientiert sich am Mandanten des angemeldeten Benutzers. Die Lieferanten-Kreditorennummer unterscheidet sich je Markt, deshalb wird die Tabelle je Markt geführt.

**Händlertyp.** Im Dialog zum Registrieren oder Bearbeiten eines Händlers wählen Sie im Dropdown „Type“ entweder „Dealership“ oder „Market“. Bei „Dealership“ heißt das folgende Feld „Vega ID“, bei „Market“ heißt es „Country Code ID“. Die Country Code ID besteht aus fünf Ziffern, für Deutschland zum Beispiel 20000. In der Ergebnistabelle der Händlerverwaltung trägt die Spalte die Bezeichnung „Vega/Country Code ID“.

**Besonderheiten je Markt.** Als Beispiel für eine Mehrmarktzuordnung nennt oneSCM die Kombination Indien und Deutschland. Eine vollständige Übersicht der marktspezifischen Sichtbarkeiten liegt nicht vor. Die Marktbegrenzung der Seite „Cross File Transfer“ im Admin-Bereich wird im Klärungsbedarf geführt.

**Hinweise.**

- Die Partnertabellen filtern nach dem Markt. Ein Benutzer, der einen anderen Markt benötigt, muss dafür einen zusätzlichen Markt in ALICE zugewiesen bekommen.
- Die Partnerpflege nach Händlerbeziehungen und Eigentümerwechseln beschreibt Abschnitt 4.7.

Quellen: Batch 1308.1, 578.1, 582.3, 1268.5, 68.1

## 20.3 Lokale Produkte, Preise und Kampagnen

**Zweck.** Produkte, Preisversionen, Steuern und Kampagnenfristen gelten je Markt. Der Markt bestimmt, welche Produkte Sie sehen und welche Angaben in der Preisermittlung gelten.

**Voraussetzungen.** Die Produkte und Preisversionen sind für den Markt veröffentlicht. Die Pflege dieser Werte beschreibt Kapitel 14.

**Marktspezifität der Coverage Codes.** Im Schritt 2 der Anlage eines Coverage Codes legen Sie fest, in welchen Märkten der Code bei der Produktanlage verwendet werden kann. Zwei Optionen stehen zur Verfügung:

- „Current and Upcoming Markets“ ist beim ersten Aufruf vorausgewählt. Alle Märkte sind markiert, die Auswahlkästchen lassen sich nicht ändern. Kommt ein neuer Markt hinzu, wird er automatisch einbezogen.
- „Custom Markets“ markiert zunächst alle Märkte. Sie können einzelne Märkte ab- und anwählen. Mindestens ein Markt muss ausgewählt sein, sonst bleibt „Confirm“ deaktiviert.

**Schritt für Schritt.**

1. Öffnen Sie im Coverage Code den Schritt 2 zur Marktspezifität.
2. Wählen Sie „Current and Upcoming Markets“ oder „Custom Markets“.
3. Wählen Sie bei „Custom Markets“ die gewünschten Märkte aus und bestätigen Sie mit „Confirm“.
4. Geben Sie für jeden Markt eine Kurzbeschreibung ein. Pro Markt und Sprache erscheint eine Karte. Die Kurzbeschreibung umfasst 5 bis 200 Zeichen, die Langbeschreibung optional 5 bis 500 Zeichen.
5. Lassen Sie eine Kurzbeschreibung leer, übernimmt oneSCM die Default Short Description aus Schritt 1.

**Ergebnis und Systemstatus.** Wählen Sie einen Markt ab und bestätigen Sie, verschwinden die zugehörige Karte und ihre Beschreibungen. Eingaben bleiben beim Wechsel zwischen den Optionen erhalten, auch beim Wechsel mit „Back“ oder „Next“. Wählen Sie wieder „Current and Upcoming Markets“, werden alle Märkte ausgewählt. Können die Märkte nicht geladen werden, bleiben der Auswahlbereich und die Beschreibungen grau, und die Meldung „Could not load available markets. Please exit and try again later“ erscheint.

**Fahrzeugverwaltung.** Die Ergebnisse erscheinen automatisch, sobald Sie ein Produkt und eine Preisversion auswählen. Das gilt auch nach einem Wechsel der Preisversion. Hat ein Produkt nur eine Preisversion, ist diese vorausgewählt. Die Schaltfläche „Search“ benötigen Sie nur, wenn Sie die Liste mit einem Suchbegriff durchsuchen möchten.

**Marktauswahl und Einstellungen.** Die Anwendung unterstützt die Marktauswahl für Produkte und Fahrzeuggruppen. Die Anzahl der Einträge pro Seite in der Fahrzeugverwaltung wird im Benutzerprofil gespeichert.

**Kampagnenanfragen.** Vor dem Produktivstart konfiguriert der MPC unter Market Settings, Reiter Timers & Reminders, das Feld „Grace Period Campaign Request Validity“. Der Wert ist eine positive ganze Zahl in Kalendertagen und lässt sich je Division festlegen, PC oder VAN. Der Standardwert beträgt 7 Tage. Die Änderung gilt für alle danach eingereichten Anfragen. Das Fälligkeitsdatum ergibt sich aus dem Einreichungszeitpunkt plus der Gültigkeit. Bereits laufende Anfragen behalten ihr Fälligkeitsdatum.

**Steuerarten und Steuersätze.** Für jeden Markt gibt es eine Liste der Steuerarten, die dort verfügbar und anwendbar sind. Ein Administrator legt die Liste bei der Einführung eines Marktes fest. Auf der Seite „Tax Management“ pflegen Sie die Steuerarten im Reiter „Tax Type“. Die Steuersätze mit ihren Gültigkeiten pflegen MPC-Benutzer im Reiter „Tax Rates“ des Revenue Management.

- Im Reiter „Tax Type“ filtern Sie nach Name, Tax Category, Customer Tax Classification und Type. Die Ergebnisse erscheinen erst nach einem Klick auf „Search“. „Reset“ setzt die Filter zurück, aktualisiert die Ergebnisse aber nicht.
- Im Reiter „Tax Rates“ filtern Sie nach Name, Financial Document Definition sowie nach „Validity From“ und „Validity To“. Die Tabelle zeigt Name, Entity, Tax Type, FI Tax Code, FI Tax Code Description, Tax Factor, Validity und Actions.
- Beide Tabellen zeigen standardmäßig 10 Datensätze je Seite. Über ein Dropdown wählen Sie 10, 20, 30, 40 oder 50. Nach einem Neuladen gilt wieder 10.

**Steuer in Indien.** Für den Markt Indien ermittelt das System die Steuer über den GST-Satz. Die GST löst die Mehrwertsteuer auf Lieferungen von Waren und Dienstleistungen ab. Ein eigenes Steuermodul definiert die Steuerarten und Steuersätze. Welcher GST-Satz gilt, richtet sich nach dem Bundesstaat, in dem der Kunde ansässig ist.

| Fall | Satz |
|---|---|
| Servicevertrag nach dem Fahrzeugkauf | 18 Prozent GST insgesamt |
| Transaktion innerhalb eines Bundesstaates, Intra-State | 9 Prozent CGST und 9 Prozent SGST |
| Transaktion zwischen Bundesstaaten, Inter-State | 18 Prozent IGST |

Die CGST erhebt die Zentralregierung, die SGST die Landesregierung des eigenen Bundesstaates. Die IGST gilt, wenn die Leistung aus einem anderen Bundesstaat stammt.

**Besonderheiten je Markt.** Die Produktverfügbarkeit folgt dem Markt. Für Malaysia ist nur die Division Passenger Car verfügbar, siehe Abschnitt 20.1. In Deutschland ist die Mehrwertsteuer die Standardsteuer, für Indien gilt die GST.

**Hinweise.**

- Die Anlage und Veröffentlichung von Produkten beschreibt Abschnitt 14.8, die Preisversionen Abschnitt 14.9, die Fahrzeuggruppen Abschnitt 14.11 und die Kampagnen Abschnitt 14.13.
- Die Produktauswahl im Angebot beschreibt Kapitel 5.4.

Quellen: Batch 1220.4, 1268.5, 10.5, 882.2, 246.1, 256.1, 218.1

## 20.4 Zahlung, Dokumente und Signatur je Land

**Zweck.** Zahlungsarten, Rechnungsbezüge und der Finanzabgleich unterscheiden sich je Markt. Dieser Abschnitt beschreibt die Besonderheiten der Zahlung und des Finanzabgleichs.

**Zahlungsarten für gewerbliche Kunden in Indien.** Für gewerbliche Kunden im Markt Indien ist die Zahlung per Kreditkarte zulässig, auch ohne Mercedes me Konto. Die Lastschrift ist im indischen Markt keine verfügbare Zahlungsart. Der Schritt „Kunden- und Zahlungsinformationen“ lässt sich damit bei der Anlage eines Servicevertrags für gewerbliche Kunden durchlaufen.

**Finanzabgleich für den Markt Indien.** Nach der Anmeldung als MO oder MPC des Marktes Indien erscheinen die Seiten „CoFiCo Check“ und „SWT Check“ im Bereich Financial Control.

| Seite | Batch | Status nach dem Export | Status nach dem Feedback |
|---|---|---|---|
| CoFiCo Check | CoFiCoInvExp | Exported, mit exportiertem Gesamtbetrag | Imported, mit importiertem Gesamtbetrag |
| SWT Check | SWTInvExp | Exported, mit exportiertem Gesamtbetrag | Imported, mit importiertem Gesamtbetrag |

**Schritt für Schritt: Finanzabgleich prüfen.**

1. Lösen Sie den Batch CoFiCoInvExp beziehungsweise SWTInvExp aus und warten Sie, bis die Verarbeitung beendet ist.
2. Öffnen Sie die Seite „CoFiCo Check“ beziehungsweise „SWT Check“. Sie sehen den Status „Exported“ und den exportierten Gesamtbetrag der Datei.
3. Sobald das Feedback eingegangen ist, wechselt der Status auf „Imported“, und der importierte Gesamtbetrag erscheint.
4. Das Prüfergebnis lautet „OK“, wenn der exportierte Gesamtbetrag der importierten Summe entspricht. Andernfalls lautet es „Not OK“.

**Markttabelle für Rechnungen.** Die Markttabelle für internationale Rechnungen ist marktindividuell und richtet sich nach dem Mandanten des angemeldeten Benutzers. Die Pflege der SAP-Debitorennummern je Markt ist im Klärungsbedarf geführt.

**Dokumente und Signatur je Land.** Zu Vertragsdokumenten, Sprachvarianten und digitalen Signaturen je Land enthält das Material keine Quellen in den RAG-Batches. Material: keine Quellen in den RAG-Batches

**Ergebnis und Systemstatus.** Der Status im Finanzabgleich zeigt, ob die exportierten Beträge mit den importierten Beträgen übereinstimmen. Die Auswertungen des Finanzabgleichs beschreibt Abschnitt 11.7.

**Besonderheiten je Markt.** Zur Zahlungsfunktion MPay im Markt Tschechien ist kein Verhalten als Handbuchinhalt beschrieben. Die Meldung ist im Klärungsbedarf geführt.

**Hinweise.**

- Die Anbindung an die FI-Systeme beschreiben die Abschnitte 19.12 für CoFiCo und 19.13 für SWT.
- Die Zahlungsdaten im Vertrag beschreibt Kapitel 7.

Quellen: Batch 1096.4, 177.4, 181.5

## 20.5 Länderbezogene Einführung und Migration

**Zweck.** Dieser Abschnitt beschreibt, wie ein Markt in oneSCM eingeführt wird und welche Einstellungen dabei gelten.

**Voraussetzungen.** Die Steuerarten und die Marktkonfiguration sind für den Markt festgelegt, siehe Abschnitt 20.3 und Abschnitt 14.2.

**Einführung eines Marktes.**

- Ein Administrator legt die Liste der Steuerarten fest, die im Markt verfügbar und anwendbar sind. Danach erhalten die Steuerarten Steuersätze und Gültigkeiten.
- Die Konfiguration des Marktes, etwa Formate und Sprachen, legt der MPC fest, siehe Abschnitt 14.2.
- Bei einer Auswahl von „Current and Upcoming Markets“ beim Coverage Code wird ein neu hinzukommender Markt automatisch einbezogen. Die gespeicherte Default Short Description dient als Kurzbeschreibung.

**Einführung des Marktes Indien.** Mit der Einführung des Marktes Indien wird die Steuer über die GST ermittelt, die in Indien die Mehrwertsteuer ablöst. Für Indien steht ein eigenes Steuermodul zur Verfügung, siehe Abschnitt 20.3.

**Feature-Toggle für die Slowakei.** Für Verträge im Markt Slowakei steht in der Produktivumgebung ein Feature-Toggle bereit. Welche Funktion er steuert, ist im Klärungsbedarf geführt.

**Ergebnis und Systemstatus.** Ein neuer Markt erscheint in der Liste der Märkte. Die Steuerarten legt ein Administrator fest, die Formate und die Kampagnenfristen legt der MPC fest.

**Hinweise.**

- Die Einführung von Rollen, Berechtigungen und Organisationsstrukturen beschreibt Kapitel 17.
- Die Übernahme von Bestandsdaten beschreibt Kapitel 18.

Quellen: Batch 246.1, 218.1, 1220.4, 528.2

## 20.6 Länderabweichungsregister und Qualität

**Zweck.** Die Prüfung der Länderabweichungen stellt sicher, dass marktspezifische Einstellungen nur ihren Markt betreffen und die Sichtbarkeit je Markt richtig ist.

**Länderabweichungsregister.** Ein Register der Länderabweichungen ist im Material nicht beschrieben. Material: keine Quellen in den RAG-Batches für das Register selbst. Die Abweichungen vom Blueprint beschreibt Abschnitt 14.3. Eingestellte oder geschlossene Meldungen führt das Klärungsregister im Anhang F.

**Prüfung der Sichtbarkeit von Batch-Jobs.** Die Sichtbarkeit der Batch-Jobs wird für die Märkte Deutschland, Slowakei und Indien geprüft. Jeder Markt zeigt alle marktspezifischen Batch-Jobs sowie die globalen Batch-Jobs ohne Duplikate.

**Ergebnis und Systemstatus.** Die Batch-Jobs eines Marktes erscheinen nur dort, wo sie für den Markt gelten. Globale Batch-Jobs erscheinen in allen Märkten.

**Hinweise.**

- Die Sichtbarkeit von Seiten und Funktionen je Markt beschreibt Abschnitt 14.6.
- Die Regressionstests je Markt sind Gegenstand des Klärungsbedarfs.

Quellen: Batch 142.9

## Verschiebung in andere Kapitel

- Kapitel 4.3, Kundendaten und Pflichtangaben prüfen: Batch 1034.2 mit Adressdaten, Reihenfolge der Eingabefelder und Zeichenlängen für Stadt, Straße, Hausnummer und Zusatzzeile.
- Kapitel 4.7, Partner- und Dealerbeziehungen: Batch 594.2 mit Eigentümerwechsel in Deutschland, Vorgänger, Nachfolger, Historie und Benachrichtigung von Market Operations.
- Kapitel 9.8, Contract Review: Profile und Übersicht: Batch 1263.3 mit der Genehmigungsschwelle in der Währung des Vertragslandes.
- Kapitel 10.1, Verträge suchen und Details prüfen: Batch 855.2 mit Sortierung der Vertragsübersicht, Zeilenanzahl und Suche per Klick und per Eingabetaste.
- Kapitel 11.4, Kostenmanagement und Claims: Batch 711.1 mit der Prüfung der Forderungen je Markt beim I156-Import und dem Import bei fehlendem Händler.
- Kapitel 14.2, Marktspezifische Einstellungen: Batch 650.1 mit dem Configuration Service für Formate und Sprachen je Markt sowie Batch 989.1 mit den Seiten General Settings und Feature Settings und den Schaltflächen Restore und Update.
- Kapitel 14.6, Marktbezogene Sichtbarkeit und Berechtigungen: Batch 68.1 mit dem Cross File Transfer sowie Batch 143.2 und 142.9 mit der Sichtbarkeit von Seiten je Markt.
- Kapitel 14.8, Produktdefinition, Anlage und Veröffentlichung: Batch 1220.4 mit Schritt 2 zur Marktspezifität des Coverage Codes.
- Kapitel 14.9, Preisversionen, Cluster und Faktorgrenzen: Batch 1268.5 mit den Ergebnissen der Fahrzeugverwaltung nach Auswahl von Produkt und Preisversion.
- Kapitel 14.11, Fahrzeuggruppen und Van-Baumuster-Clustering: Batch 10.5 mit der Marktauswahl für Fahrzeuggruppen.
- Kapitel 14.13, Kampagnenanlage und Rabattpflege: Batch 882.2 mit der Gültigkeit der Kampagnenanfragen in Kalendertagen je Division.
- Kapitel 19.1, Architekturüberblick und Systemlandkarte: Batch 1310.6 mit der lokalen Entwicklungsumgebung sowie Batch 551.4 mit der marktspezifischen Logik in eigenen Implementierungen, siehe Klärungsbedarf.
- Kapitel 19.9, VEGA, Vertrag, Coverage und Claim: Batch 936.2 mit der i155-Datei je Markt, siehe Klärungsbedarf.
- Kapitel 19.12, CoFiCo, und Kapitel 19.13, SWT, FI-Anbindung: Batch 177.4 und 181.5 mit der Anzeige der Status Exported und Imported im Finanzabgleich.
- Kapitel 19.21, Technische Integrationswege: Batch 1095.3 mit der Markt-ID als Pflichtfeld der Vertragsanfrage und dem Header X-Market bei Leasingverträgen.
- Kapitel 19.22, Schnittstellenbetrieb und Fehlerbehandlung: Batch 519.7 mit Wiederholungen, Zeitabständen, Timeouts und Wiederanstoß.

Quellen: Batch 1034.2, 594.2, 1263.3, 855.2, 711.1, 650.1, 989.1, 68.1, 143.2, 142.9, 1220.4, 1268.5, 10.5, 882.2, 1310.6, 551.4, 936.2, 177.4, 181.5, 1095.3, 519.7

## Klärungsbedarf

1. Marktliste, Batch 1220.4 und Batch 1308.1: Batch 1220.4 beschreibt eine Marktliste mit nur Deutschland. Batch 1308.1 nennt 38 Märkte und einen globalen Markt. Batch 142.9 bezieht sich auf die Märkte Slowakei und Indien. Welcher Stand gilt, ist nicht geklärt.
2. Divisionen, Batch 1308.1: Die Aussage „fast alle Märkte“ nennt keine Ausnahmen außer Malaysia. Die übrigen Märkte mit eingeschränkter Division sind nicht benannt.
3. Mercedes me Rollenbezeichnung, Batch 644.1 und Batch 640.1: Batch 644.1 nennt die Vertragsrolle „Holder“, Batch 640.1 die Rolle „Halter“. Batch 644.1 nennt den Reiter „Contract Generation“, Batch 640.1 die „Vertragserstellung“. Das Kapitel 5 spricht von einem Menü, Batch 644.1 von einem Reiter.
4. Mercedes me, Batch 644.1, 638.2 und 640.1: Die drei Abschnitte beschreiben denselben Ablauf. Sie sind in Teilen als Soll formuliert, etwa für die Ergänzung der Mercedes me ID. Die Pflichtfelder sollen in der Entwicklung verifiziert werden. Die Angaben zu Bankdaten lauten „nicht relevant“ in Batch 644.1 und „nicht anwendbar“ in Batch 638.2. Die Werte für Deutschland sind als MVP-Werte bezeichnet.
5. Zahlung in Tschechien, Batch 53.1: Eine Störung der Zahlungsfunktion MPay im tschechischen Markt ist als geschlossen gemeldet. Das Material beschreibt Ursache und Umfang nicht. Die Meldung gehört nicht in den Fließtext.
6. SAP-Debitorennummern je Markt, Batch 578.2: Die Änderung ist als geschlossen geführt. Das Material beschreibt die Pflege der Markttabelle und der Debitorennummern nur als Zielbild. Die Aussage, dass die Pflege bisher aus Sicht Deutschlands erfolgt, ist nicht mit einem Stand belegt.
7. Lieferantentabelle, Batch 582.3: Der Text spricht bei der Lieferantentabelle von Händlerbetrieben. Es ist unklar, ob die Filterung Lieferanten oder Händler betrifft.
8. Cross File Transfer, Batch 68.1: Die Marktbegrenzung ist in Abstimmung. Ungeklärt sind das Verhalten bei einem Upload einer Datei eines anderen Marktes und die technische Umsetzbarkeit der Einschränkung.
9. Sichtbarkeit von Partnerdaten bei Eigentümerwechsel, Batch 594.2: Die Sichtbarkeit soll sich nach dem ORG-Scope richten. Der Begriff ORG-Scope ist im Material nicht erläutert. Die Daten sind im Epic-Test auf der eigenen Seite zu simulieren. Der Stand des Epic-Tests ist nicht angegeben.
10. Feature-Toggle Slowakei, Batch 528.2: Das Material nennt das Feature nicht und beschreibt die Wirkung nicht.
11. Feld HTXT2 in E169, Batch 142.9: Das Feld und sein Zweck sind nicht beschrieben.
12. Finanzabgleich Indien, Batch 177.4 und 181.5: Beide Abschnitte beschreiben Prüfungen für MO und MPC des Marktes Indien, einmal als CoFiCo Check, einmal als SWT Check. Unklar ist, ob beide gelten oder welche Verarbeitung welcher Prüfung zugeordnet ist.
13. Schweizer Format, Batch 552.2: Das Format für Steuernummer und VAT-ID ist nicht angegeben.
14. Marktübergreifende Kundenlogik, Batch 551.4: Der Abschnitt beschreibt ein Zielbild, in dem die marktspezifische Logik je Markt gebündelt werden soll. Der Stand ist nicht belegt. Ungeklärt ist, ob das bestehende Verhalten aller Märkte durch Regressionstests je Markt überprüft wird.
15. i155 je Markt, Batch 936.2: Die Aussage beschreibt keinen belegten Stand.
16. Seitengröße in Tabellen, Batch 10.5, 246.1 und 256.1: Die Fahrzeugverwaltung speichert die Anzahl der Einträge je Seite im Benutzerprofil. Die Seiten Tax Type und Tax Rates setzen die Anzahl nach dem Neuladen zurück. Unklar ist, ob das unterschiedliche Verhalten gewollt ist.
17. Zuständigkeit für Steuern, Batch 246.1, 256.1 und 218.1: Batch 246.1 nennt einen Administrator für die Steuerarten bei der Markteinführung, Batch 256.1 nennt den MPC für die Steuersätze. Das Steuermodul für Indien wird nicht einer Rolle zugeordnet.
18. Lokale Entwicklungsumgebung, Batch 1310.6: Der Abschnitt richtet sich an Entwickler und nicht an Fachanwender. Die Zielgruppe ist im Material nicht eindeutig benannt.
19. Vertragsübersicht, Batch 855.2: Der Abschnitt formuliert das Ergebnis als Korrektur der Suche. Das beschriebene Verhalten ist im Abschnitt zur Vertragsübersicht in Kapitel 10 zu prüfen.

## Vorschläge zur Gliederung

- Abschnitt 20.4 hat für Dokumente und Signatur keine Quellen. Der Titel sollte auf Zahlung je Land gekürzt werden, Dokumente und Signaturen verweisen auf Kapitel 7.4 und 7.5.
- Abschnitt 20.6 überschneidet sich mit Abschnitt 14.3, Länderabweichungen vom Blueprint. Beide Abschnitte sollten zusammengeführt oder klar abgegrenzt werden.
- Ein eigener Abschnitt für Steuern je Markt würde Slowakei, Schweiz, Indien und die Steuerverwaltung bündeln. Heute verteilen sich diese Angaben auf Abschnitt 20.1 und Abschnitt 20.3.
- Ein eigener Abschnitt für Indien würde die Sonderregeln Steuer, Kreditkartenzahlung, Finanzabgleich, Mehrmarktzuordnung und Divisionen zusammenführen.
- Mercedes me je Land sollte in Kapitel 4 als eigener Unterabschnitt stehen, Abschnitt 20.1 verweist dann darauf.
- Abschnitt 20.2 hat wenig eigenes Material. Eine Verknüpfung mit Abschnitt 2.4, Markt-, Sparten- und Betriebskontext prüfen, ist sinnvoll.
- Abschnitt 20.5 stützt sich auf vier Abschnitte aus den RAG-Batches. Eine Verknüpfung mit Kapitel 17, Rollout und Einführung, verbessert die Lesbarkeit.
- Die Marktübersicht je Markt sollte als Tabelle in Anhang D, Rollen-, Status- und Scopematrizen, stehen.
