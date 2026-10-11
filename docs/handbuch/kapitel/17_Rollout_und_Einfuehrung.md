# 17 Rollout und Einführung

Dieses Kapitel beschreibt, wie oneSCM in weitere Märkte eingeführt wird. Es behandelt die Zielmärkte und den Einführungsumfang, den Playground-Markt als Einstieg für Rollout-Kandidaten, die Marktvorbereitung mit der fachlichen Abnahme sowie Schulung und Begleitung nach der Einführung. Die technische Anbindung der Systeme beschreibt Kapitel 19, die Übernahme von Bestandsdaten Kapitel 18 und die länderbezogene Einführung Kapitel 20.5.

## 17.1 Zielmärkte und Einführungsumfang

**Zweck.** Dieses Unterkapitel beschreibt den Stand der Einführung in Deutschland und die Vorbereitung der Reporting-Module auf weitere Märkte.

**Voraussetzungen.** Material: keine Quellen in den RAG-Batches.

**Rollen.** Material: keine Quellen in den RAG-Batches.

**Schritt für Schritt.** Material: keine Quellen in den RAG-Batches.

**Ergebnis und Systemstatus.** oneSCM ist in Deutschland produktiv. Die Reporting-Module sind auf weitere Markteinführungen vorbereitet. Dazu ist das DCS verallgemeinert, der Reporting Service und die ETL-Prozesse sind angepasst. Für jeden neuen Markt stehen das UDM und die Datenprodukte mit den Daten dieses Markts bereit, und die Infrastruktur unterstützt den Markt. Die Vorbereitung betrifft die Märkte Slowakei und Indien.

**Besonderheiten je Rolle, Sparte und Markt.** Markt: Slowakei und Indien sind in der Vorbereitung der Reporting-Module benannt. Rollen und Sparten: Material: keine Quellen in den RAG-Batches.

**Hinweise.** Den Stand je Land und die Marktprofile beschreibt Kapitel 20.1. Die technischen Einzelheiten der Datenplattformen beschreibt Kapitel 19.19.

**Fehlerbehebung.** Material: keine Quellen in den RAG-Batches.

Quellen: Batch 307.5

## 17.2 Voraussetzungen für Zugang, Konfiguration und Schulung

**Zweck.** Der Playground-Markt ist eine eigene Demo- und Testumgebung für Rollout-Kandidaten. Darin erkunden Sie die Fähigkeiten des Systems frühzeitig und testen sie praktisch.

**Voraussetzungen.** Für die Nutzung des Playground-Markts richten Sie keinen marktspezifischen Tenant ein. Sie implementieren und konfigurieren keine eigenen Schnittstellen, weil die bereits vorhandenen deutschen Schnittstellen mitgenutzt werden. Zugang und Anmeldung: Material: keine Quellen in den RAG-Batches.

**Rollen.** Das HQ-Rollout-Team und Marktvertreter der Rollout-Kandidaten nutzen den Playground-Markt. Schulungsrollen: Material: keine Quellen in den RAG-Batches.

**Schritt für Schritt.** Material: keine Quellen in den RAG-Batches.

**Ergebnis und Systemstatus.** Der Playground-Markt verhält sich funktional und auf Schnittstellenebene wie der deutsche Markt. Die Schnittstellenkonfigurationen und Datenstrukturen für die Kommunikation mit externen Systemen sind identisch. Intern speichert der Playground-Markt alle Daten in einem separaten Tenant. Die technische und datenseitige Trennung vom deutschen Tenant bleibt erhalten, während das Verhalten nach außen identisch ist.

**Besonderheiten je Rolle, Sparte und Markt.** Markt: Der Playground-Markt ist einem Land zugeordnet, das für die Alice-Konfiguration und die GSSN-Anbindung verwendet wird. Flat Files erhalten eigene Namen und Kennungen und werden an einem dedizierten S3-Speicherort abgelegt. Rollen: HQ-Rollout-Team und Marktvertreter der Rollout-Kandidaten. Sparte: Material: keine Quellen in den RAG-Batches.

**Hinweise.** Der Playground-Markt bietet einen schnellen und aufwandsarmen Einstieg für Bewertung und Tests. Marktspezifische Anforderungen werden in einem eigenen Markt-Tenant abgebildet. Der Playground-Markt beschleunigt die Markteinführung und ermöglicht eine frühe Validierung sowie die frühzeitige Zustimmung der Beteiligten. Schulung: Material: keine Quellen in den RAG-Batches.

**Fehlerbehebung.** Material: keine Quellen in den RAG-Batches.

Quellen: Batch 1300.1

## 17.3 Marktvorbereitung und fachliche Abnahme

**Zweck.** Die fachliche Abnahme prüft einen Markt anhand definierter Abnahmekriterien. Dieses Unterkapitel nennt die Kriterien, die für Kundentyp, Händlerverwaltung, Protokoll und Mercedes me vorliegen.

**Voraussetzungen.** Allgemeine Voraussetzungen der Marktvorbereitung: Material: keine Quellen in den RAG-Batches.

**Rollen.** Die Rolle MO erhält bei einem Händlerwechsel die Benachrichtigung zur Aktualisierung der FI-Systemdaten. MO trägt die Werte anschließend ein und speichert sie.

**Schritt für Schritt.** Material: keine Quellen in den RAG-Batches.

**Ergebnis und Systemstatus.** Die fachliche Abnahme prüft folgende Kriterien:

- Kundentyp „Commercial Fleet“: Der Kundentyp steht bei der Erstellung von Dokumenten und E-Mails sowie im Suchfilter zur Verfügung. Dokumente und E-Mails stehen bei der Erstellung und Aktivierung eines Vertragsangebots sowie bei Aktionen der Vertragsverwaltung zur Verfügung.
- Händlerwechsel: Bei einem Eigentümerwechsel wird der bestehende Händler in der Händlerverwaltung aktualisiert. Die Historie speichert die Änderung mit Zeitstempel. Die Felder für die SAP-Debitorennummer und die Kreditorennummer sind leer, und MO wird benachrichtigt.
- Protokoll bei Änderungen ohne Eigentümerwechsel: Die Option „View Log“ ist verfügbar und zeigt die korrekten Änderungen mit Zeitstempel.
- Mercedes me: Bei erteilter Einwilligung werden Kundendaten zur Profilerstellung an Mercedes me gesendet. Die Mercedes me ID wird nach der Profilerstellung in oneSCM eingetragen. Adressänderungen werden an das Mercedes me Profil gesendet, wenn der Kunde seine Einwilligung über den aktiven Schalter „Update Mercedes me account with the information above“ erteilt hat. Ändert der Kunde das Land, werden keine Aktualisierungen an Mercedes me gesendet.

**Besonderheiten je Rolle, Sparte und Markt.**

- Markt, Szenario 1 für Deutschland: Der bestehende Händler wird bei einem Eigentümerwechsel auf inaktiv gesetzt, und seine Historie wird im einklappbaren Bereich gespeichert. Der neu angelegte Händler erhält eine Historie mit allen definierten Elementen. MO aktualisiert anschließend die FI-Systemdaten.
- Markt, Szenario 2 für den Rest der Welt, im Material als ROW bezeichnet: Die Daten werden in der Händlerverwaltung aktualisiert. Die Historie speichert den alten Wert, den neuen Wert und den Zeitstempel. Die Felder für die SAP-Debitorennummer und die Kreditorennummer sind leer, MO wird benachrichtigt und trägt die Werte ein.
- Rolle Holder: Ein Mercedes me Profil haben nur Kunden, die bei mindestens einem Vertrag die Rolle „Holder“ innehaben. Aktualisierungen werden nur für Kunden gesendet, die ihre Einwilligung über den aktiven Schalter gegeben haben.
- Sparte: Material: keine Quellen in den RAG-Batches.

**Hinweise.** Die Abnahmekriterien beschreiben Prüfziele. Die Abläufe der Händlerverwaltung beschreibt Kapitel 4.7, die Kundendaten und das Mercedes me Profil Kapitel 4.3. Die Besonderheiten für Flottenkunden beschreibt Kapitel 12.2.

**Fehlerbehebung.** Material: keine Quellen in den RAG-Batches.

Quellen: Batch 380.5, 594.6, 659.3

## 17.4 Schulung und Übergabe in den Betrieb

**Zweck.** Material: keine Quellen in den RAG-Batches.

**Voraussetzungen.** Material: keine Quellen in den RAG-Batches.

**Rollen.** Material: keine Quellen in den RAG-Batches.

**Schritt für Schritt.** Material: keine Quellen in den RAG-Batches.

**Ergebnis und Systemstatus.** Material: keine Quellen in den RAG-Batches.

**Besonderheiten je Rolle, Sparte und Markt.** Material: keine Quellen in den RAG-Batches.

**Hinweise.** Material: keine Quellen in den RAG-Batches.

**Fehlerbehebung.** Material: keine Quellen in den RAG-Batches.

Quellen: keine Quellen in den RAG-Batches

## 17.5 Begleitung nach Einführung und offene Punkte

**Zweck.** Material: keine Quellen in den RAG-Batches.

**Voraussetzungen.** Material: keine Quellen in den RAG-Batches.

**Rollen.** Material: keine Quellen in den RAG-Batches.

**Schritt für Schritt.** Material: keine Quellen in den RAG-Batches.

**Ergebnis und Systemstatus.** Material: keine Quellen in den RAG-Batches.

**Besonderheiten je Rolle, Sparte und Markt.** Material: keine Quellen in den RAG-Batches.

**Hinweise.** Material: keine Quellen in den RAG-Batches.

**Fehlerbehebung.** Material: keine Quellen in den RAG-Batches.

Quellen: keine Quellen in den RAG-Batches

## Verschiebung in andere Kapitel

| Batch | Inhalt | Zielkapitel |
|---|---|---|
| Batch 23.2 | Vehicle Service History, Greenfield-Eintrag ohne inhaltliche Angaben | Kapitel 19.6, DSB Kilometerstandsinformationen |
| Batch 307.5 | DCS, Reporting Service, ETL-Prozesse, UDM und Datenprodukte | Kapitel 19.19, Datenplattformen und Reporting |
| Batch 380.5 | Kundentyp „Commercial Fleet“ in Dokumenten, E-Mails und Suchfilter | Kapitel 12.2, Flotten- und besondere Kundenkonstellationen |
| Batch 594.6 | Händlerwechsel, Historie, SAP-Debitoren- und Kreditorennummer | Kapitel 4.7, Partner- und Dealerbeziehungen |
| Batch 659.3 | Mercedes me Profil, Mercedes me ID und Adressaktualisierung | Kapitel 4.3, Kundendaten und Pflichtangaben prüfen |
| Batch 1300.1 | Flat Files, S3-Speicherort, Tenant-Trennung, Alice-Konfiguration und GSSN-Anbindung | Kapitel 19.21, Technische Integrationswege, und Kapitel 19.16, ALICE |

## Klärungsbedarf

Das Material enthält keine eingestellten oder geschlossenen Meldungen.

1. Batch 307.5: Das Material bezeichnet die Einführungen in der Slowakei und in Indien als vorgesehen und beschreibt zugleich deren Vorbereitung. Unklar ist, ob diese Märkte bereits produktiv sind oder nur vorbereitet werden. Ob weitere Märkte zum Einführungsumfang gehören, geht aus dem Material nicht hervor.
2. Batch 1300.1: Der Abschnitt nennt die Verwendung der deutschen VEGA-Tenant-ID und zugleich einen separaten Tenant für alle Daten des Playground-Markts. Unklar ist, wie beide Aussagen zusammenpassen.
3. Batch 1300.1: Der Satz zur Aufnahme des Playground-Landes mit der Aussage „nie oder erst als eines der letzten Länder“ lässt offen, ob das Land überhaupt in oneSCM aufgenommen wird. Der Name des Landes fehlt.
4. Batch 380.5: Die Kriterien sind als Sollzustand mit dem Wort „sollte“ formuliert, und der Abschnitt trägt die Überschrift „Vorgesehene Abnahmekriterien“. Unklar ist, ob die Verfügbarkeit des Kundentyps „Commercial Fleet“ in allen genannten Bereichen heute gegeben ist.
5. Batch 594.6: Szenario 1 setzt den bestehenden Händler bei einem Eigentümerwechsel auf inaktiv. Szenario 2 beschreibt nur die Aktualisierung der Händlerdaten. Unklar ist, ob der Händler im Szenario 2 aktiv bleibt.
6. Batch 659.3: Die Bedingungen für Adressaktualisierungen sind in einem verschachtelten Satz formuliert. Unklar ist, ob der Ausschluss bei einem Länderwechsel auch für die erste Übermittlung eines bereits vorhandenen Profils gilt.
7. Batch 23.2: Der Greenfield-Eintrag zu Vehicle Service History enthält weder Zielzustand noch Abnahmekriterien. Ein Handbuchabschnitt lässt sich daraus nicht ableiten. Der Eintrag ist dem Kapitel 17 ohne Unterkapitel zugeordnet.

## Vorschläge zur Gliederung

- 17.2: Der Titel nennt Zugang, Konfiguration und Schulung, das Material beschreibt aber nur den Playground-Markt. Vorschlag: Titel „Playground-Markt für Rollout-Kandidaten“, Zugang über Kapitel 2 und Schulung über Unterkapitel 17.4.
- 17.4 und 17.5: Zu beiden Unterkapiteln liegen keine Quellen vor. Vorschlag: Inhalte mit dem HQ-Rollout-Team abstimmen oder die Unterkapitel zusammenführen, bis Material vorliegt.
- 17.5: Der Titel nennt „offene Punkte“. Die Stilregeln ordnen offene Punkte dem Klärungsregister in Anhang F zu. Vorschlag: Titel „Begleitung nach Einführung“, offene Punkte über das Klärungsregister in Unterkapitel 16.7 führen.
- 17.1: Vorschlag, die Einführungsmärkte mit Status in einer Übersicht zu führen und auf Kapitel 20.1 zu verweisen. Die technischen Reporting-Details sind in Kapitel 19.19 besser aufgehoben.
- 17.3: Vorschlag, Fachkriterien in den Fachkapiteln 4, 12 und 17 zu beschreiben, sodass Unterkapitel 17.3 den Abnahmeprozess und die Prüfzuständigkeiten beschreibt.
- Greenfield-Einträge wie Batch 23.2 sollten erst mit Inhalt in die Gliederung übernommen werden.

Quellen: Batch 23.2, 307.5, 380.5, 594.6, 659.3, 1300.1
