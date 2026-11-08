# 1 Einführung und Überblick

oneSCM (Service Contract Management) ist das zentrale System für Servicevertrags- und Wartungsprodukte von Mercedes-Benz Pkw und Van. Dieses Kapitel erklärt, wofür Sie oneSCM nutzen, wie das System in die Systemlandschaft eingeordnet ist, welche Rollen zusammenarbeiten, wie die fachlichen Domänen ineinandergreifen und wie der globale Standard mit lokalen Ausprägungen je Markt zusammenspielt. Lesen Sie dieses Kapitel vor den Prozesskapiteln; es nennt Ihnen die Kapitel, die für Ihre Rolle maßgeblich sind.

## 1.1 Ziele und Nutzen von oneSCM

**Zweck.** oneSCM bündelt den gesamten Lebenszyklus eines Servicevertrags in einem System: Preisinformation, Angebot, Antrag, Vertrag und Vertragsverwaltung. Sie erstellen in oneSCM Angebote für Service- und Wartungsprodukte, überführen sie in Anträge, lassen diese prüfen und aktivieren und verwalten die laufenden Verträge bis zu ihrem Ende.

**Nutzen.** Das System stellt für alle Beteiligten denselben Daten- und Prozessstand bereit. Händler, Market Operation (MO), Markt und Headquarter (HQ) arbeiten an denselben Vorgängen, sehen denselben Vertragsstatus und greifen auf dieselben Produkt-, Preis- und Kampagnendaten zu. Fahrzeug-, Kunden- und Zahlungsdaten gelangen über Schnittstellen in das System (Kapitel 19); Sie erfassen sie nicht mehrfach.

**Was Sie mit oneSCM tun.**

1. Sie rufen Preisinformationen zu Service- und Wartungsprodukten für ein konkretes Fahrzeug ab.
2. Sie erstellen ein Angebot und übergeben es an den Kunden.
3. Sie überführen das Angebot in einen Antrag mit Kunden-, Fahrzeug- und Zahlungsdaten.
4. Die Market Operation prüft den Antrag fachlich und aktiviert den Vertrag.
5. Sie verwalten den Vertrag über seine Laufzeit: Änderungen, Zahlerwechsel, Aussetzung, Verlängerung und Beendigung.

**Hinweise.** Begriffe und Abkürzungen wie MO, HQ, OTR, FIN und ZB I erklärt das Glossar (Anhang A). Die Prozesslandkarte (Kapitel 3.4) zeigt die Reihenfolge der Prozesskapitel.

Material: keine Quellen in den RAG-Batches

## 1.2 Projekthintergrund und Einordnung

oneSCM löst die Altsysteme für Serviceverträge ab und bildet den Vertragsprozess für die Sparten Pkw und Van einheitlich ab. Ein Handbuch gilt für beide Sparten; Unterschiede zwischen Pkw und Van beschreibt Kapitel 21, Unterschiede zwischen Ländern und Märkten beschreibt Kapitel 20.

Das System ist in die Systemlandschaft des Konzerns eingebettet. Auftrags- und Fahrzeugdaten stammen aus den Fahrzeug- und Auftragssystemen (unter anderem GO, AFAB, CePrO, OTR und MIC), Kunden- und Finanzdaten aus oneERP, die buchhalterische Verarbeitung erfolgt in NEMESIS, Zahlungen laufen über MPay, Berechtigungen werden in ALICE verwaltet. Den Architekturüberblick mit Systemlandkarte und Einzelsteckbriefen enthält Kapitel 19; die Übergangsarchitektur zu den Legacy-Systemen beschreibt Kapitel 19.20.

Sie erreichen oneSCM über das RetailPortal oder über eine Direktverlinkung. Zugang, Rollen und Berechtigungen beschreibt Kapitel 2, die Navigation in der Oberfläche Kapitel 3.

Material: keine Quellen in den RAG-Batches

## 1.3 Beteiligte Rollen und Aufgaben

Vier fachliche Rollen arbeiten in oneSCM zusammen. Jede Rolle hat eigene Aufgaben und eigene Handbuchkapitel.

| Rolle | Aufgaben | Kapitel |
|---|---|---|
| Dealer (Autohaus) | Preisinformation, Angebot, Antrag, Antragsverwaltung, Vertragsverwaltung im Autohaus | 4 bis 8 und 10 |
| MO (Market Operation) | Fachliche Prüfung der Anträge, Sonderfreigaben, Aktivierung, Vertragsverwaltung | 9 und 10 |
| Markt | Produkt-, Preis- und Kampagnenpflege, marktspezifische Einstellungen, Administration | 14 |
| HQ (Headquarter) | Blueprint, globale Standards, zentrale Stammdaten wie Coverage Codes und Industry Codes | 15 |

**So finden Sie Ihren Einstieg.**

1. Stellen Sie fest, welche fachliche Rolle Ihnen zugeordnet ist. Ihre technische Rolle sehen Sie nach der Anmeldung (Kapitel 2.2); fehlende Rechte beantragen Sie über ALICE (Kapitel 2.3 und 19.16).
2. Prüfen Sie Ihren Markt-, Sparten- und Betriebskontext (Kapitel 2.4). Er bestimmt, welche Produkte, Preise und Vorgänge Sie sehen.
3. Lesen Sie die Prozesskapitel Ihrer Rolle gemäß der Tabelle. Die Lesepfade je Rolle stehen im Vorspann (V.2).

**Besonderheiten je Rolle.** Händler arbeiten im Kontext ihres Betriebs und sehen die Vorgänge dieses Betriebs. Die Market Operation arbeitet marktweit und prüft die Anträge aller Händler des Marktes; Sonderfreigaben lösen stets eine MO-Prüfung aus (Kapitel 6.5 und 9). Der Markt pflegt die Stammdaten, mit denen Händler und MO arbeiten. Das HQ setzt mit dem Blueprint den Rahmen für alle Märkte. Die vollständigen Rollen-, Status- und Scopematrizen enthält Anhang D.

Material: keine Quellen in den RAG-Batches

## 1.4 Rollen im oneSCM-Ökosystem

Neben den vier fachlichen Rollen in oneSCM wirken weitere Stellen und Systeme am Vertragsprozess mit.

- **Kunden** (Privatkunden, Geschäftskunden, von Key-Account-Managern betreute Großkunden und Flotten) erhalten Angebote und Vertragsdokumente und zahlen über die hinterlegten Zahlwege. Die Kundengruppen und ihre Besonderheiten beschreiben Kapitel 4 und 12.
- **Werkstätten und Lieferanten** erbringen die vertraglichen Leistungen; Werkstattrechnungen fließen in die Kostenbetrachtung und in die Kilometerstandshistorie des Vertrags ein (Kapitel 11.5).
- **Berechtigungsadministration** (ALICE-Autohaus-Admin, Markt und HQ) schaltet Rollen frei und pflegt das Rollenmodell (Kapitel 2 und 19.16).
- **Support** nimmt technische Störungen entgegen; fachliche Fragen klärt die Market Operation (Kapitel 23).
- **Umsysteme** liefern und empfangen Daten: Fahrzeug- und Auftragssysteme, oneERP, NEMESIS, MPay sowie Versicherer, Lieferanten und POS-Kanäle (Kapitel 19).

Die Zusammenarbeit folgt einem festen Muster: Der Händler legt an, die Market Operation prüft und aktiviert, der Markt stellt Produkte, Preise und Kampagnen bereit, das HQ gibt den globalen Rahmen vor, und die Umsysteme liefern die Daten, auf denen jeder Schritt aufsetzt. Welche Rolle welche Schaltflächen und Statuswechsel auslösen darf, zeigt Anhang D.

Material: keine Quellen in den RAG-Batches

## 1.5 Fachliche Domänen und ihre Zusammenarbeit

**Zweck.** oneSCM ist fachlich in Domänen gegliedert: Kunde, Fahrzeug, Produkt, Vertrag, Zahlung und Dokument. Jede Domäne verantwortet ihre Daten und Regeln; ein Servicevertrag entsteht aus dem Zusammenspiel aller Domänen.

**Wie die Domänen zusammenwirken.**

1. Die Domäne **Kunde** stellt die Kundendaten bereit (Kapitel 4). Kunden werden in oneSCM gesucht oder angelegt; führendes System für Kunden- und Finanzdaten ist oneERP (Kapitel 19.11).
2. Die Domäne **Fahrzeug** liefert Fahrzeugdaten über Baumuster, FIN/VIN oder Auftragskennungen und prüft die Eignung des Fahrzeugs für ein Produkt (Kapitel 5).
3. Die Domäne **Produkt** stellt Produkte, Preisversionen, Kampagnen und Fahrzeuggruppen bereit, die der Markt auf Basis der HQ-Blueprints pflegt (Kapitel 14 und 15).
4. Die Domäne **Vertrag** führt Angebot, Antrag und Vertrag mit ihren Status, Prüfungen und Änderungen (Kapitel 6 bis 10).
5. Die Domäne **Zahlung** verarbeitet Zahlpläne, Rechnungen und Zahlungen mit den Umsystemen NEMESIS und MPay (Kapitel 11).
6. Die Domäne **Dokument** erzeugt Angebots- und Vertragsdokumente in der Sprachvariante des Marktes (Kapitel 7.4).

**Schnittstellen für externe Domänen.** Externe Domänen, die Verträge nicht über die Oberfläche anlegen, nutzen den Contract Wrapper. Er stellt mindestens zwei Endpunkte bereit; einer davon erstellt einen Vertrag mit kunden- und kundenproduktbezogenen Daten und legt dabei auch den Kunden an. Das Verhalten entspricht dem der Benutzeroberfläche: Dieselben Prüfungen und Ergebnisse gelten für Verträge aus der Oberfläche und aus der Schnittstelle. Die APIs des Contract Wrappers werden nicht öffentlich bereitgestellt; die technischen Integrationswege beschreibt Kapitel 19.21.

**Qualitätssicherung je Domäne.** Die automatisierten Sanity-Tests sind nach Domänen aufgeteilt. Die Test-Status-Ansicht zeigt die Ergebnisse je Domäne mit einem Domänen-Dropdown und Filtern mit Mehrfachauswahl (Kapitel 16.4).

**Hinweise.** In den Testumgebungen DEV, INT und prePROD akzeptiert das System Benutzerkonten mit E-Mail-Adressen der Domänen mercedes-benz.com, globallogic.com und extaccount.com. Für Tests mit anderen Adressdomänen wenden Sie sich an den Support (Kapitel 23.5).

Quellen: Batch 1011.4, 532.3, 582.2

## 1.6 Globaler Standard und lokale Ausprägungen

**Zweck.** oneSCM folgt einem globalen Standard, dem Blueprint des HQ (Kapitel 15.2). Der Blueprint legt Produkte, Prozesse und Regeln fest, die in allen Märkten gleich gelten. Märkte konfigurieren innerhalb dieses Rahmens ihre lokalen Ausprägungen: Produkte, Preise, Kampagnen, Sprachvarianten und marktspezifische Einstellungen (Kapitel 14).

**Standard und Abweichung.** Länderspezifische Abweichungen vom Blueprint sind nur gültig, wenn sie im Länderabweichungsregister dokumentiert und freigegeben sind (Kapitel 20.6). Was in Ihrem Markt vom Standard abweicht, finden Sie im Länder- und Marktprofil (Kapitel 20.1). Spartenunterschiede zwischen Pkw und Van beschreibt Kapitel 21.

**Beispiel: Zahlungszeitpunkt als globaler Standard.** Das System unterstützt für Serviceverträge sowohl Zahlungen vor der Aktivierung (Prepaid, „Pre-Activation“) als auch nach der Aktivierung (Postpaid, „Post-Activation“). Beide Varianten sind Teil des globalen Standards und werden je Markt konfiguriert. So lassen sich marktspezifische, regulatorische und kommerzielle Anforderungen abbilden, ohne den Standard zu verlassen. Die Funktion gilt für alle Kundentypen, Divisionen, Branchen und Identifikatoren. Welche Variante in Ihrem Markt gilt, entnehmen Sie dem Marktprofil (Kapitel 20.1); die Zahlpläne beschreibt Kapitel 11.

**So gehen Sie mit Standard und Ausprägung um.**

1. Orientieren Sie sich an den Prozesskapiteln; sie beschreiben den globalen Standard.
2. Prüfen Sie Kapitel 20 für Ihren Markt und Kapitel 21 für Ihre Sparte auf Abweichungen.
3. Melden Sie Verhalten, das weder dem Standard noch einer dokumentierten Abweichung entspricht, über den Supportweg (Kapitel 23.5).

Quellen: Batch 903.1

## Klärungsbedarf

- Batch 867.1 und 957.1: Die zugeordneten Meldungen enthalten ausschließlich die unausgefüllte Standardvorlage (Platzhaltertexte wie „Definition of epic“); fachliche Inhalte zu Domänen, Rollen oder Abläufen liegen nicht vor. Kein Handbuchinhalt; in das Klärungsregister (Anhang F) aufnehmen und nach inhaltlicher Pflege der Meldungen erneut prüfen.
- Batch 582.2: Die unterstützten E-Mail-Domänen in den Testumgebungen (globallogic.com, mercedes-benz.com, extaccount.com) sind technische Testumgebungsinformationen und keine fachlichen Domänen. Zu klären, ob der Hinweis in Kapitel 1.5 bleibt oder nach Kapitel 2.1 (Login) beziehungsweise 16.4 (Testnachweise) wandert, und ob die Liste der Domänen vollständig ist.
- Batch 1011.4: Der Contract Wrapper für externe Domänen ist eine technische Schnittstelle. Zu klären, welche externen Domänen ihn nutzen und ob die Beschreibung in Kapitel 19.21 (Technische Integrationswege) oder 19.18 (Weitere Systeme und Dienste) führend sein soll; in Kapitel 1.5 bleibt dann ein Verweis.
- Batch 532.3: Die Aufteilung der Sanity-Tests nach Domänen beschreibt ein internes Werkzeug der Qualitätssicherung. Zu klären, ob die Test-Status-Ansicht für Handbuchleser zugänglich ist; andernfalls gehört der Abschnitt nach Kapitel 16.4 oder entfällt.
- Batch 264.5: Die Neuordnung der Paketstruktur der Anwendungen nach Streams (gssn, db, s3, i156, e169) ist eine Entwicklungsinformation ohne Bezug zur Bedienung. Nicht in Kapitel 1 verwendet; Verweis in Kapitel 19.1 oder 19.23 prüfen. Zu klären, ob die Stream-Namen den Schnittstellen in Kapitel 19 zugeordnet werden sollen.
- Batch 903.1: Die Quelle nennt Prepaid und Postpaid als globalen Standard „für alle Kundentypen, Divisionen, Branchen und Identifikatoren“. Zu klären, in welchen Märkten welche Variante aktiv ist und ob die Konfiguration je Markt oder je Produkt erfolgt (Abgleich mit Kapitel 11 und 20).
- Unterkapitel 1.1 bis 1.4: Für Ziele, Projekthintergrund und Rollen liegen keine Quellen in den RAG-Batches vor; die Texte stützen sich auf Gliederung und Quick-Guide. Fachliche Freigabe der Rollenbeschreibungen und der Kapitelzuordnung durch Markt und HQ erforderlich.

## Vorschläge zur Gliederung

- Kapitel 1.5 um einen Abschnitt „Integrationswege für externe Domänen“ ergänzen oder den Contract Wrapper als eigenes Unterkapitel in Kapitel 19 (19.21 oder 19.18) führen, da das Material ausschließlich Schnittstellenverhalten beschreibt.
- Kapitel 1.6 um ein Unterkapitel „Konfigurierbare Standardfunktionen je Markt“ erweitern, das Funktionen wie Prepaid/Postpaid, Sprachvarianten und Zahlwege als Katalog listet und auf Kapitel 14 und 20 verweist.
- Prüfen, ob Kapitel 1 ein Unterkapitel „Umgebungen (DEV, INT, prePROD, PROD)“ erhält oder ob diese Information nach Kapitel 2.1 beziehungsweise 16.4 gehört.
