# 2 Zugang, Rollen und Berechtigungen

Dieses Kapitel beschreibt, wie Sie sich an oneSCM anmelden, welche Rollen das System kennt, wie Sie Berechtigungen beantragen, wie Sie Ihren Markt-, Sparten- und Betriebskontext prüfen und wie Sie bei Zugangsproblemen vorgehen. Es gilt für alle Rollen in den Sparten Pkw (PC) und Van. Rollen und Berechtigungen werden nicht in oneSCM gepflegt, sondern im Berechtigungssystem ALICE (Gems); oneSCM liest sie bei der Anmeldung aus und steuert damit Menüs, Daten und Aktionen.

## 2.1 Login und Single Sign-on

**Zweck.** Sie melden sich mit Ihrer Konzernkennung per Single Sign-on an oneSCM an. Das System ermittelt aus ALICE und GSSN+ Ihre Rollen, Berechtigungen und Ihre Organisationszuordnung (Outlet oder Markt) und baut daraus Ihren Arbeitskontext auf.

**Voraussetzungen.**

- Ihr Benutzerkonto ist in ALICE (Gems) angelegt und mit mindestens einer oneSCM-Rolle versehen (Kapitel 2.2 und 2.3).
- Ihr Konto ist einem Händlerbetrieb (Outlet) oder einem Markt zugeordnet (Kapitel 2.4).
- Sie erreichen oneSCM über das RetailPortal oder über die Direktverlinkung.

**Schritt für Schritt.**

1. Rufen Sie oneSCM über das RetailPortal oder die Direktverlinkung auf. Die Anmeldung erfolgt per Single Sign-on mit der in ALICE angelegten Benutzerkennung; ein separates oneSCM-Kennwort gibt es nicht.
2. Bei der ersten Anmeldung akzeptieren Sie die Nutzungsbedingungen im Fenster „oneSCM - Terms of Use“ (Kapitel 2.6). Ohne Zustimmung ist oneSCM nicht nutzbar.
3. Wählen Sie Ihren Arbeitskontext:
   - Als Verkäuferin oder Verkäufer in einem Händlerbetrieb zeigt oneSCM die verfügbaren Outlet-IDs mit ihren Namen in einer Auswahlliste. Ein Autohaus kann mehrere Outlets mit jeweils eigener Outlet-ID haben. Stehen mehrere Outlets zur Verfügung, meldet das System Sie standardmäßig mit dem ersten an; Sie wechseln das Outlet später über das Benutzermenü.
   - Als Benutzerin oder Benutzer der Rollen Market Operations (MO) oder MPC zeigt oneSCM stattdessen die verfügbaren Länder als Auswahlliste. Standardmäßig meldet das System Sie mit dem in ALICE hinterlegten Mandantenland an.
4. Prüfen Sie die Login-Details im Benutzermenü. Für Händler zeigt oneSCM dort die vollständige Adresse des Outlets aus ALICE mit Straße, Hausnummer und Postleitzahl an. Hat ein Outlet mehrere Standorte, wählen Sie nach der Outlet-ID den Standort aus der zweiten Auswahlliste; gibt es nur einen Wert, ist er vorbelegt.

**Ergebnis.** Nach erfolgreicher Anmeldung öffnet oneSCM die Startseite. MPC-Anwenderinnen und -Anwender gelangen direkt auf ihr persönliches Dashboard mit Begrüßung und Kacheln zu „Manage Products and Prices“, „Manage Vehicle Groups“, „Manage Campaigns“, „Manage Templates“ und „Manage Customers“; ein Klick auf das App-Logo führt immer dorthin zurück. Der gewählte Markt bleibt in Ihrem Benutzerprofil gespeichert und ist bei der nächsten Anmeldung vorbelegt.

**Hinweise.**

- Für Händler gibt es eine zusätzliche Kennung, die sowohl beim Login als auch beim Verkauf eines Vertrags im Namen eines Händlers verwendet wird. Die Outlet-Adresse wird auch auf Vertragsebene gespeichert; bei der Erfassung von Zahlungs- und Kundendaten erscheint nach Wahl der Outlet-ID ebenfalls die Adressauswahl.
- oneSCM speichert zu jedem Vertrag, wer ihn angelegt hat: Benutzer-ID, GSSN+-Outlet-ID und Outlet-Name, bei MO und MPC zusätzlich das Land. Ein Vertrag lässt sich so später einer Benutzerin oder einem Benutzer und einem Outlet zuordnen, zum Beispiel „Benutzer T-12345, Outlet GS000999, Autohaus Muster GmbH“.
- Technisch wandelt ein Security Service das externe Zugriffstoken von ALICE in ein internes oneSCM-Token um und ergänzt es um Benutzerdetails und Berechtigungen (Entitlements). Alle oneSCM-Dienste prüfen Ihre Berechtigungen anhand dieses Tokens; was Sie in der Oberfläche nicht sehen, ist auch über Schnittstellen nicht erreichbar.

Quellen: Batch 1103.6, 1020.2, 1214.4, 1315.1, 11.2, 984.2

## 2.2 Fachliche Rollen und technische Berechtigungen

**Zweck.** Jede Benutzerin und jeder Benutzer erhält genau die Zugriffe, die zu ihren oder seinen Aufgaben passen. Rollen und Berechtigungen werden in ALICE (Gems) definiert und zugewiesen; oneSCM steuert damit, welche Menüpunkte, Reiter, Daten und Aktionen sichtbar und ausführbar sind. Eine fachliche Rolle (zum Beispiel „Händler“) entspricht in ALICE einer oder mehreren technischen Berechtigungen (zum Beispiel „OneSCM_templatesmgmt_manage“).

**Rollen in oneSCM.**

| Rolle | Kurzbezeichnung | Aufgabe |
|---|---|---|
| Dealer | Händler | Preisinformation, Angebot, Antrag und Vertragsverwaltung für den eigenen Händlerbetrieb |
| Market Operations | MO | Fachliche Prüfung (MO Checks), Aktivierung, Stornierung und Statuspflege von Verträgen im Markt |
| MPC Product Manager | MPC, MPC PM | Produkt-, Preis-, Kampagnen- und Vorlagenpflege im Markt; in Märkten ohne MO zusätzlich alle MO-Aufgaben |
| HQ Product Manager | HQ PM, HQ | Blueprint, globale Standards, Fahrzeugstammdaten, Fahrzeuggruppen, Kampagnen sowie Produkte und Preise auf Konzernebene |
| Admin | ADMIN | Systemadministration: K/KJ-Codes im Vehicle Management, Batch Jobs, Steuerverwaltung |
| View Only | Readonly User | Reiner Lesezugriff auf alle Bereiche und Daten, für PC und Van |
| PC, Van | – | Spartenrollen, die den Datenzugriff und die Oberfläche auf die Division PC bzw. Van begrenzen |
| Lieferant | Supplier | Externer Partnerbenutzer mit Zugriff auf das Supplier Portal und die Berichte der eigenen Organisation |

**Berechtigungen in Vertragserstellung und Vertragsverwaltung.**

- Dealer, MO und MPC sehen Preise von Produkten und Verträgen, konfigurieren Produkte und Optionen, bearbeiten Kunden- und Zahlungsinformationen, legen Verträge an und bestätigen sie. Sie sehen Verträge mit ihren Status („CREATED“, „CONFIRMED“, „WAITING FOR ACTIVATION“, „ACTIVE“, „DECLINED“, „CANCELED“) sowie in der Vertragsverwaltung die Details von Verträgen im Status „Active“, „Suspended“, „Closed“ und „Terminated“.
- MO setzt den Vertragsstatus manuell, wenn Prüfungen fehlschlagen: Aktivieren oder Stornieren in der Vertragserstellung, „Suspended“, „Reactivate“, „Closed“ oder „Terminated“ in der Vertragsverwaltung. MO bearbeitet in der Vertragsverwaltung zusätzlich Kunden- und Zahlungsinformationen.
- MPC besitzt alle Berechtigungen des MO, weil in manchen Märkten kein MO existiert. MPC sieht alle Verträge des zugewiesenen Marktes unabhängig vom Status, durchsucht Produkte anhand einer Kennung, legt Verträge an, aktiviert Verträge im Status „Waiting for Activation“ oder lehnt sie ab und hat Zugriff auf die Prüfliste der MO-Verifizierung (MO Check) mit Ansicht, Lesen und vollständiger Bearbeitung.
- MO und MPC sehen und bearbeiten Kunden mit allen konfigurierbaren Feldern.
- Die Schaltfläche zum Hochladen im Reiter „Kommunikation“ steht nur in der Vertragserstellung zur Verfügung, nicht in der Vertragsverwaltung.

**Berechtigungen je Modul.**

| Modul | Dealer | MO | MPC | HQ | Admin |
|---|---|---|---|---|---|
| Contract Offering (unter Contract Generation) | Anlegen, Ansehen, Ändern, Löschen | Ansehen | Anlegen, Ansehen, Ändern, Löschen | – | – |
| Manage Products & Prices | Ansehen | – | Pflege im Markt | Anlegen, Ansehen, Ändern, Löschen | – |
| Manage Campaigns | – | Ansehen | Pflege im Markt | Anlegen, Ansehen, Ändern, Löschen | – |
| Vehicle Management, Manage Vehicle Groups | – | – | – | Anlegen, Ansehen, Ändern, Löschen | K/KJ-Codes: Anlegen, Ansehen, Ändern, Löschen |
| Vorlagenverwaltung (Manage Templates) | – | – | Voller Zugriff („OneSCM_templatesmgmt_manage“) | Voller Zugriff („OneSCM_templatesmgmt_manage“) | – |
| Request Approval (Special Case, Grace Period) | Lesen, nur eigener Händlerbetrieb | – | Ansehen, Prüfen, Genehmigen, Ablehnen | – | – |
| Finanzdokumente: manuelle Dokumenterstellung (MANU, MDCR) | – | Anlegen | Anlegen | – | – |
| Partner Reports (Partner Management) | – | – | Einsehen, Herunterladen, erneut Versenden | Einsehen, Herunterladen, erneut Versenden | – |
| Batch Jobs, Steuerverwaltung | – | – | – | – | Zugriff |

Das Modul „Contract Offering“ ist der Nachfolger des Moduls „Product Testing“ und gehört zu Contract Generation, nicht zu Product Management.

**Sichtbarkeit von Daten nach Rolle.**

- Händler sehen ausschließlich Daten der eigenen Organisationseinheit (Outlet). Vor jeder Änderung an einem Objekt, etwa an Kunden, Adressen, Zahlungsdetails, Einwilligungen, Dokumenten oder Benachrichtigungen, prüft das System, ob die Outlet-ID im Sicherheitskontext der angemeldeten Person mit der Outlet-ID der Anfrage übereinstimmt.
- Leasing-Verträge sind nur für MO und MPC sichtbar. Der Filter „Sales Channel“ unter „More Filter“ in Contract Generation, Contract Management und MO Checks bietet „Retail“ (Vorgabe) und „Leasing“; Händler sehen die Option „Leasing“ nicht, und Leasing-Verträge sind aus allen händlerseitigen Listen ausgeschlossen. Diese Beschränkung gilt serverseitig, also auch für direkte Links und Schnittstellenaufrufe.
- In der Preisbestandteil-Tabelle sehen MO und MPC alle Zeilen; Händler sehen nur die Kategorien „Rabatte“ und „Endpreise für Kunden“ sowie die Tabelle mit dem Preis pro Kilometer.
- Der Reiter „Partner Reports“ neben „Dealership“, „Market“ und „Supplier“ erscheint nur für Rollen, deren Berechtigung den Zugriff umfasst.
- Lieferantenbenutzer sind einer Partner-Kreditorennummer zugeordnet und sehen im Supplier Portal ausschließlich die Berichte der eigenen Organisation; die Trennung ist auf Schnittstellenebene durchgesetzt. Partnerbenutzer werden in ALICE angelegt, im Security Service als eigene Benutzergemeinschaft getrennt von internen Benutzern geführt und erhalten eine eigene oneSCM-Lieferantenrolle.

**Spartenrollen PC und Van.** Mit der Rolle PC sehen Sie ausschließlich PC-Daten und in der Oberfläche nur die Optionen der Division PC; mit der Rolle Van entsprechend nur Van-Daten und Van-Optionen. Sind Ihnen beide Rollen zugewiesen, arbeiten Sie in beiden Divisionen. Die Einschränkung gilt für alle fachlichen Rollen, auch für View Only. Für die Antragserstellung im Van-Geschäft benötigen Händler die Rolle oneSCM.DealerVAN.

**Rolle View Only.** Die Rolle richtet sich an Stakeholder, die sich in oneSCM informieren und Daten entnehmen, ohne Aktionen auszulösen. Alle Informationen werden vollständig angezeigt; Funktionen zum Anlegen, Bearbeiten, Löschen, Hochladen oder Versenden sind ausgeblendet oder nicht auslösbar.

**Funktionstrennung bei Freigaben.** In Freigabeprozessen, etwa bei Preisversionen und bei MPC-Anfragen mit zweiter Freigabe, unterscheidet oneSCM die Rolle des Antragstellers von der des Prüfers. Wer eine Preisversion anlegt, bearbeitet oder einreicht, ist Antragsteller des nächsten Schritts; wer validiert oder bestätigt, ist Prüfer. Dieselbe Person darf in einem Schritt nicht zugleich Antragsteller und Prüfer sein und nicht erster und zweiter Prüfer derselben Anfrage. Nach jeder Änderung ist erneut eine zweite Freigabe erforderlich. Das System erzwingt diese Trennung anhand von Benutzername, Rollen und Berechtigungen.

**Hinweise.**

- Fehlende Menüpunkte oder Reiter deuten auf eine fehlende Rolle hin, nicht auf einen Fehler. Prüfen Sie Ihre Rollen in ALICE und beantragen Sie fehlende Berechtigungen (Kapitel 2.3).
- Mehrere Märkte oder Sparten erfordern mehrere Rollenzuordnungen. Nach einer Rollenänderung melden Sie sich erneut an, damit oneSCM die neuen Berechtigungen übernimmt.
- Die vollständige Berechtigungsmatrix je Rolle steht in Anhang D.

Quellen: Batch 852.1, 1002.1, 491.1, 1309.1, 1134.1, 1162.5, 1070.8, 229.5, 654.4, 1314.3, 945.8, 881.1, 873.2, 864.2, 556.1, 555.1, 1315.1, 1159.2, 1184.6, 35.2, 47.2, 54.2, 57.2, 71.2, 73.2, 77.2, 83.2, 86.2, 91.2, 102.2, 105.2, 112.2

## 2.3 Berechtigungsantrag und Freigabe

**Zweck.** Sie erhalten eine oneSCM-Rolle ausschließlich über einen Berechtigungsantrag in ALICE. Berechtigungen werden nicht per E-Mail oder Zuruf vergeben; jede Rolle wird beantragt, geprüft und freigegeben, und die Freigabe ist nachvollziehbar dokumentiert.

**Rollen.** Antragstellende sind die Nutzerinnen und Nutzer selbst oder deren Führungskraft. Im Autohaus gibt der ALICE-Autohaus-Admin die Rollen frei. Für Markt- und HQ-Rollen entscheidet die zuständige Markt- bzw. HQ-Organisation nach dem Rollenmodell.

**Schritt für Schritt.**

1. Ermitteln Sie anhand Ihrer Aufgaben die benötigte Rolle (Kapitel 2.2 und Anhang D), zum Beispiel oneSCM.DealerVAN für die Antragserstellung im Van-Geschäft.
2. Stellen Sie den Berechtigungsantrag in ALICE für Ihr Benutzerkonto. Geben Sie Markt, Sparte und Händlerbetrieb (Outlet) an, für die Sie arbeiten.
3. Der zuständige Admin prüft und gibt frei. Den Status Ihres Antrags sehen Sie in ALICE.
4. Melden Sie sich nach der Freigabe erneut an oneSCM an. Erst dann übernimmt oneSCM die neuen Rollen in Ihren Sicherheitskontext.

**Ergebnis.** Die neuen Menüpunkte, Reiter und Aktionen sind nach der Anmeldung sichtbar. Benötigen Sie Zugriff auf mehrere Märkte oder beide Sparten, beantragen Sie je Markt bzw. Sparte eine Rollenzuordnung.

**Hinweise.** Details zu ALICE als Berechtigungsmanagement stehen in Kapitel 19.16.

Material: keine Quellen in den RAG-Batches

## 2.4 Markt-, Sparten- und Betriebskontext prüfen

**Zweck.** Ihr Arbeitskontext bestimmt, welche Produkte, Preise, Kampagnen und Verträge oneSCM Ihnen zeigt. Ein falscher Kontext bedeutet falsche Produkte und Preise. Prüfen Sie daher nach jeder Anmeldung Markt, Sparte und Händlerbetrieb.

**Was den Kontext bildet.**

- **Markt (Land):** MO und MPC wählen bei der Anmeldung das Land; vorbelegt ist das in ALICE hinterlegte Mandantenland. oneSCM speichert den zuletzt gewählten Markt im Benutzerprofil und belegt ihn auf allen Seiten vor.
- **Sparte (Division):** Die Rollen PC und Van begrenzen Daten und Oberfläche auf die jeweilige Division (Kapitel 2.2). Mit beiden Rollen wählen Sie die Division in der Oberfläche.
- **Betrieb (Outlet):** Händler arbeiten im Kontext ihres Outlets. Mit mehreren Outlets wählen Sie das aktive Outlet im Benutzermenü; die Login-Details zeigen die Adresse des Outlets aus ALICE. Daten anderer Händlerbetriebe sind nicht zugänglich.

**Schritt für Schritt.**

1. Öffnen Sie nach der Anmeldung das Benutzermenü und prüfen Sie Markt bzw. Outlet und die angezeigte Adresse.
2. Wechseln Sie bei Bedarf das Outlet oder den Markt über die Auswahlliste im Benutzermenü. Hat ein Outlet mehrere Standorte, wählen Sie zusätzlich den Standort.
3. Prüfen Sie in der jeweiligen Arbeitsliste, dass nur die erwarteten Vorgänge erscheinen. Im Bereich „Request Approval“ unter „Contract Generation“ sehen MPC-Benutzer zum Beispiel die Anfragen ihres Marktes bzw. ihrer Division, Händler nur die Anfragen des eigenen Händlerbetriebs.

**Ergebnis.** Ist Ihr Konto keinem Händlerbetrieb oder Markt zugeordnet, zeigt oneSCM nach der Anmeldung ein Pop-up. Weitere Aktionen sind erst möglich, wenn das Konto in ALICE einem Outlet oder Markt zugeordnet ist (Kapitel 2.3 und 2.5).

**Besonderheiten je Rolle.**

- **Verkauf im Namen eines Händlers:** Verkauft eine Mitarbeiterin oder ein Mitarbeiter der Marktorganisation (MO) einen Servicevertrag im Auftrag eines Händlers, erfasst sie oder er den Händler im Abschnitt „Dealer Details“ auf der Seite für Kunden- und Zahlungsinformationen. „Händlername“ und „Stadt“ sind Auswahllisten mit den Werten aus GSSN, der Verkäufername wird ausgegraut aus ALICE/GSSN übernommen, das Feld „E-Mail“ akzeptiert nur gültige E-Mail-Formate. Der Abschnitt gilt nur auf Vertragsebene, nicht in der Kundenverwaltung; in den Status „Waiting for Confirmation“ und „In Confirmation“ sind keine Änderungen möglich. Änderungen werden in der Kundenhistorie festgehalten.
- **Händlerverwaltung:** Die Händlerverwaltung führt die Outlets mit ihrer GSSN-ID als eindeutigem Schlüssel; die Händlerdetails stammen aus ALICE und enthalten die GSSN-ID des Verkäufers. Die SAP-Debitorennummer besteht aus bis zu zehn Ziffern, Händlernamen aus bis zu 300 Zeichen einschließlich Umlauten und Sonderzeichen.

**Hinweise.** Der Kontext steuert auch die Auswertungen: Die Daten der Data Products sind nach Markt, Division und Modellreihe gekennzeichnet, sodass Lesezugriffe nach Markt und Division eingeschränkt werden können.

Quellen: Batch 881.1, 1309.1, 1020.2, 1103.6, 1315.1, 11.2, 623.1, 626.1, 627.1, 326.1

## 2.5 Fehlende Berechtigungen und Zugangsprobleme

**Zweck.** Dieser Abschnitt hilft Ihnen, Zugangsprobleme einzuordnen und zu beheben: fehlende Rollen, fehlender Kontext, verweigerte Seitenaufrufe und technische Störungen.

**Typische Situationen und ihre Ursache.**

| Verhalten | Ursache | Vorgehen |
|---|---|---|
| Fehlerseite mit dem Hinweis, dass Sie nicht autorisiert sind | Ihrem Konto ist keine oneSCM-Rolle oder Berechtigung zugewiesen | Rolle über ALICE beantragen (Kapitel 2.3), danach erneut anmelden |
| Pop-up nach der Anmeldung, weitere Aktionen gesperrt | Ihr Konto ist keinem Händlerbetrieb (Outlet) oder Markt zugeordnet | Zuordnung in ALICE über den Autohaus-Admin bzw. die Marktorganisation ergänzen lassen |
| Ein Menüpunkt oder Reiter fehlt, zum Beispiel „Vertragserstellung“, „Request Approval“ oder „Partner Reports“ | Die zugehörige Rolle fehlt; oneSCM blendet Bereiche ohne Berechtigung aus | Rolle prüfen und beantragen (Kapitel 2.2 und 2.3) |
| Ein direkter Link (URL) auf eine Seite wird verweigert (HTTP 403) | Die Seite ist für Ihre Rolle nicht freigegeben, etwa „Request Approval“ für andere Rollen als MPC und Dealer oder Leasing-Verträge für Händler | Kein Fehler; die Beschränkung gilt serverseitig. Bei fachlichem Bedarf Rolle beantragen |
| Sie sehen keine oder nicht alle Verträge | Falscher Markt, falsches Outlet oder fehlende Spartenrolle | Kontext im Benutzermenü prüfen und wechseln (Kapitel 2.4) |
| Nach einer Rollenänderung sind neue Funktionen nicht sichtbar | Der Sicherheitskontext wird bei der Anmeldung aufgebaut | Abmelden und erneut anmelden |
| Anmeldung am Supplier Portal schlägt fehl, Sie bleiben auf der Anmeldeseite | Ungültige Zugangsdaten oder fehlende oneSCM-Lieferantenrolle | Zugangsdaten prüfen; Freischaltung des Partnerbenutzers in ALICE über die zuständige Stelle veranlassen |
| Fehlermeldung beim Laden einer Liste, zum Beispiel in „Partner Reports“, mit dem Hinweis, es später erneut zu versuchen | Der Speicherdienst ist vorübergehend nicht verfügbar | Später erneut versuchen; bei Fortbestehen Supportfall melden |

**Schritt für Schritt bei einem Zugangsproblem.**

1. Prüfen Sie, ob Sie das richtige Konto nutzen und ob Markt, Sparte und Outlet im Benutzermenü stimmen (Kapitel 2.4).
2. Leeren Sie den Browser-Cache, schließen Sie den Browser und melden Sie sich erneut per Single Sign-on an.
3. Vergleichen Sie Ihre Rollen in ALICE mit den benötigten Rollen (Kapitel 2.2). Fehlt eine Rolle, stellen Sie den Berechtigungsantrag (Kapitel 2.3).
4. Besteht das Problem weiter, melden Sie einen Supportfall mit Benutzerkennung, Markt, Sparte, Zeitpunkt, der Fehlermeldung und einem Bildschirmbild (Kapitel 23.4 und 23.5). Personenbezogene Daten gehören nicht in das Bildschirmbild.

**Hinweise.**

- Der Admin ist von der Pflicht zur Zustimmung zu den Nutzungsbedingungen ausgenommen; für alle anderen Rollen ist die fehlende Zustimmung ein Grund, warum oneSCM nicht nutzbar ist (Kapitel 2.6).
- oneSCM behandelt den Fehler 403 (keine Berechtigung) in allen Diensten einheitlich. Die Meldung bedeutet stets, dass die Rolle oder der Kontext fehlt, nicht, dass das System gestört ist.
- Eine fehlerhafte Rollenkonfiguration kann den Zugang blockieren oder unbeabsichtigt zu weitreichende Rechte vergeben. Melden Sie Rechte, die Ihnen nicht zustehen, ebenfalls über den Supportweg.

Quellen: Batch 1314.3, 1315.1, 881.1, 873.2, 864.2, 555.1, 556.1, 1305.2

## 2.6 Sicherer Umgang mit Benutzerkonto und Sitzung

**Zweck.** Ihr Benutzerkonto ist persönlich. Alle Aktionen in oneSCM werden mit Ihrer Benutzer-ID und Ihrem Outlet bzw. Markt gespeichert, zum Beispiel beim Anlegen eines Vertrags oder beim Herunterladen eines Berichts. Dieser Abschnitt beschreibt die Nutzungsbedingungen, die Speicherung von Benutzer- und Profildaten und die Grundregeln für den sicheren Umgang mit Konto und Sitzung.

**Nutzungsbedingungen akzeptieren.**

1. Bei der ersten Anmeldung öffnet oneSCM das Fenster „oneSCM - Terms of Use“. Es hat keine Schaltfläche zum Schließen. Das gilt für alle Rollen einschließlich Händlerbenutzer; nur der Admin ist ausgenommen.
2. Scrollen Sie den Text bis zum Ende. Erst dann erscheint das Kontrollkästchen, mit dem Sie bestätigen, die Nutzungsbedingungen gelesen zu haben.
3. Aktivieren Sie das Kontrollkästchen. Die Schaltfläche „Accept“ wird aktiv.
4. Klicken Sie auf „Accept“. oneSCM speichert Ihre Zustimmung mit Markt-ID, Benutzer-ID, Version der Nutzungsbedingungen sowie Datum und Uhrzeit.

Beenden Sie die Sitzung oder den Browser, bevor Sie zugestimmt haben, oder läuft die Sitzung ab, fordert oneSCM Sie bei jeder weiteren Anmeldung erneut zur Zustimmung auf. Bei einer neuen Version der Nutzungsbedingungen wiederholt sich der Ablauf. Zur Einhaltung der DSGVO löscht oneSCM ältere Zustimmungen: Liegen mehr als zwei akzeptierte Versionen vor und zwischen den letzten beiden Versionen drei Jahre, wird die ältere Version einmal jährlich im Dezember gelöscht. Waren Sie länger als drei Jahre nicht angemeldet, werden Ihre Zustimmungsdaten gelöscht, und Sie akzeptieren bei der nächsten Anmeldung die aktuelle Version erneut.

**Was oneSCM zu Ihrem Konto speichert.**

- Mit jedem Vertrag: Benutzer-ID, GSSN+-Outlet-ID und Outlet-Name, bei MO und MPC zusätzlich das Land (Kapitel 2.1).
- Im Benutzerprofil: der zuletzt gewählte Markt auf allen Seiten; auf den Seiten „Manage Products“ und „Manage Campaigns“ zusätzlich die Anzahl der Einträge pro Seite und die Spaltensortierung. Filter bleiben erhalten, bis Sie den Tab oder den Browser schließen oder im Hauptmenü zu einer anderen Seite wechseln.
- Im Supplier Portal: Zeitpunkt und Benutzername jedes Downloads in den Spalten „Last Downloaded On“ und „Downloaded By“.

**Sitzung und Token.** oneSCM authentifiziert Sie über ein internes Token, das aus Ihrer ALICE-Sitzung abgeleitet ist. Läuft die Sitzung ab, melden Sie sich erneut an; nicht gespeicherte Eingaben gehen dabei verloren. Speichern Sie Anträge daher vor längeren Unterbrechungen.

**Grundregeln.**

- Teilen Sie Ihr Konto nie mit anderen und geben Sie Ihre Zugangsdaten nicht weiter. Jede Aktion wird Ihrer Benutzer-ID zugeordnet.
- Sperren Sie Ihren Arbeitsplatz bei Abwesenheit und melden Sie sich ab, wenn Sie oneSCM an einem gemeinsam genutzten Gerät verwenden.
- Nutzen Sie für reine Informationszwecke die Rolle View Only (Kapitel 2.2), damit keine ungewollten Aktionen ausgelöst werden.
- Personenbezogene Daten gehören nicht in Kommentare, Bildschirmbilder oder Supportfälle (Kapitel 16.1).

Quellen: Batch 984.2, 1068.8, 1020.2, 11.2, 1315.1, 1134.1, 555.1

## Klärungsbedarf

- Batch 1162.5 und 1070.8 widersprechen sich beim Zugriff der Rolle Admin auf Contract Offering bzw. die Vertragserstellung: Einmal werden dem Admin die CRUD-Rechte für Contract Offering entzogen, einmal wird der Admin-Zugriff auf die Vertragserstellung hergestellt. Die Berechtigungsmatrix nennt für Admin keinen Zugriff auf Contract Offering; zu bestätigen.
- Batch 1162.5 ist in sich uneinheitlich: Im ersten Absatz hat der Dealer CRUD-Rechte für Contract Offering und der MO Leserechte; im zweiten Absatz werden Dealer und MPC mit CRUD und MO mit Leserechten genannt. Batch 852.1 gibt dem MO dagegen volle Rechte in der Vertragserstellung. Zu klären, ob „Contract Offering“ (Produkttest) und „Vertragserstellung“ dieselbe Funktion bezeichnen.
- Die Rollenbezeichnungen sind in den Quellen nicht einheitlich: „MPC PM“ und „MPC Product Manager“ (Batch 852.1, 491.1), „MPC (Market Price Controller)“ (Batch 881.1), „MPC“ und „MO“ (Batch 1002.1). Batch 1002.1 vermischt zudem die Rollen HQ PM und MPC („Bisher konnte die Rolle HQ PM Verträge weder einsehen …, mit der Änderung kann ein MPC …“). Verbindliche Rollenliste mit technischen ALICE-Namen (z. B. oneSCM.DealerVAN) fehlt im Material; Anhang D ist mit ALICE abzugleichen.
- Batch 1309.1 („View Only“) und Batch 1134.1 („Readonly User“) beschreiben dieselbe Rolle unter verschiedenen Namen; der Oberflächenname ist festzulegen.
- Batch 1304.3: Die Zusammenführung der Rollen Admin und HQ PM zu „HQ Admin“ und ein neuer Benachrichtigungstyp für Werkstattrechnungen sind geschlossene Meldungen; kein Handbuchinhalt, Eintrag im Klärungsregister (Anhang F).
- Batch 1314.3: Die Meldungen zum Admin-Zugang (Anmeldung als Admin, Zugriff in der Pre-Prod-Umgebung) sind geschlossen bzw. eingestellt; kein Handbuchinhalt.
- Batch 1315.1: Die Validierung der Outlet-ID bei Dealer-Operationen ist als Verhalten beschrieben, der Testnachweis fehlt im Material. Im Handbuch als heutiges Verhalten formuliert; zu bestätigen.
- Batch 1020.2: Die Quelle der mit dem Vertrag gespeicherten Benutzerdaten ist laut Material von der Architektur festzulegen. Das Beispiel enthält einen realen Händlernamen und eine Vertragsnummer; im Handbuch durch Testdaten ersetzt. Außerdem gilt „Deutschland als Mandantenland“ laut Material nur für den MVP; Verhalten für weitere Märkte zu prüfen.
- Batch 555.1: Benennung der Lieferantenrolle und Granularität der Berechtigungen sind im Material nicht festgelegt. Im Handbuch als „Lieferant (Supplier)“ geführt.
- Batch 1118.2: Zu „Leasing Operator Role and functionalities“ liegen nur leere Vorlagentexte vor; keine Aussage möglich. Zu klären, ob eine eigene Leasing-Rolle existiert und wie sie sich von MO/MPC (Batch 873.2, 864.2) unterscheidet.
- Batch 1305.2: Die marktübergreifende Überprüfung der Rollen in ALICE für VAN und PC setzt laut Material fachliche Spezifikationen voraus; Ergebnis nicht im Material. Nur der einheitliche Umgang mit HTTP 403 ist übernommen.
- Batch 861.2: Die Einstiegsseite der Vertragsverwaltung mit allen aktiven Verträgen ist eine eingestellte Anforderung; kein Handbuchinhalt (Anhang F). Der Abschnitt gehört inhaltlich zu Kapitel 10.
- Batch 881.1: Der Bereich „Request Approval“ ist nur für MPC und Dealer sichtbar; ob MO Zugriff hat (vgl. Batch 1002.1, MPC übernimmt MO-Aufgaben), ist zu klären.
- Batch 326.1: Die Kennzeichnung der Data Products für zeilenbasierte Zugriffssteuerung ist eine Vorbereitung; ob Lesezugriffe nach Markt, Division und Modellreihe tatsächlich eingeschränkt werden, ist zu bestätigen. Inhalt gehört eher zu Kapitel 17/19.
- Fehlzuordnungen ohne Bezug zu Kapitel 2, nicht verwendet: Batch 1293.1 (CI-Pipeline, Testauswahl), 305.5 und 526.4 (Betrieb, DevOps, AWS), 651.5 (Tests zur Vertragsrolle auf Kundenebene, Kapitel 4.4), 744.6 (Detailansicht Werkstattrechnung, Kapitel 11), 993.3 (Kunden-Tab B2B, Kapitel 4.1), 623.1 nur teilweise (Upload-Fehler und Registrierungsfehler sind erledigte Fehlermeldungen, Kapitel 4.8).
- Quick-Guide-Angaben ohne Beleg im Material: Zugang über „RetailPortal“ und „Direktverlinkung“, Rolle „oneSCM.DealerVAN“, Freigabe durch den „ALICE-Autohaus-Admin“, Empfehlung „Browser-Cache leeren“. Für Kapitel 2.1, 2.3 und 2.5 übernommen; mit dem Markt zu bestätigen.

## Vorschläge zur Gliederung

- Neues Unterkapitel „2.7 Externe Partnerzugänge (Supplier Portal)“: Das Material zu Batch 555.1 beschreibt einen eigenen Zugangsweg für Lieferanten mit eigener Benutzergemeinschaft, Rolle und Datentrennung. Alternativ Verweis auf Kapitel 11 (Lieferanten) oder 19 (Schnittstellen).
- Neues Unterkapitel „2.8 Nutzungsbedingungen und Zustimmungsnachweis“ oder Verlagerung des Abschnitts aus 2.6 nach Kapitel 16 (Datenschutz): Die Löschfristen nach DSGVO (Batch 984.2) sind kein Sicherheitsthema der Sitzung.
- Ergänzung von 2.2 um eine Berechtigungsmatrix je Modul in Anhang D mit den technischen ALICE-Berechtigungsnamen (bisher nur „OneSCM_templatesmgmt_manage“ aus Batch 491.1 bekannt).
- Die Funktionstrennung Antragsteller/Prüfer (Batch 1159.2, 1184.6) gehört fachlich zu Kapitel 14.9 bzw. 16.3 (Freigabeworkflow); in 2.2 nur als Grundsatz beschrieben.
