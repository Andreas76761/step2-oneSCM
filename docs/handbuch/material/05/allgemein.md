# Material zu 5 Ohne Unterkapitel-Zuordnung

Kapitel 5 Fahrzeug, Produkt und Angebot vorbereiten. 26 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 885.3] Fehlende Baumuster-Tests in der automatisierten Qualitätssicherung

Die Testabdeckung für Baumuster ist über Kundentypen und Kombinationen von Kennungen hinweg bislang unvollständig. Einige Abläufe stützen sich derzeit auf vorhandene Fahrgestell- und Auftragsnummern für Privat- und Geschäftskunden, während andere Kombinationen, die neue Werte erfordern, fehlen oder nicht vollständig abgedeckt sind. Ziel ist es, in der automatisierten Qualitätssicherung (AQA) alle Kundentypen und Kennungskombinationen der Abdeckungsmatrix zu berücksichtigen.

Für Privatkunden (PRIVATE_CUSTOMER) und Geschäftskunden (COMMERCIAL_CUSTOMER) sind Fahrgestellnummer und Auftragsnummer bereits vorhanden. Neu sind jeweils Deal-ID, Verso-ID und Fahrgestellnummer ohne FRD. Für Geschäftskunden mit Flotte (COMMERCIAL_FLEET), private Behördenkunden (PRIVATE_GOVERNMENTAL) und gewerbliche Behördenkunden (COMMERCIAL_GOVERNMENTAL) sind alle fünf Kennungen neu: Fahrgestellnummer, Auftragsnummer, Deal-ID, Verso-ID und Fahrgestellnummer ohne FRD.

Als maßgebliche Grundlage für die Erstellung der Szenarien dient die „Full coverage matrix after all changes". Jede Zeile der Matrix soll durch mindestens einen automatisierten Test abgebildet und mit der Testdokumentation, beispielsweise in Xray, verknüpft sein. Die Arbeit gilt als abgeschlossen, wenn alle fünf Kundentypen durch automatisierte Baumuster-Tests abgedeckt sind und jeder Test genau die in der Matrix definierte Kombination aus vorhandenen und neuen Werten prüft. Fehlende Szenarien werden umgesetzt und der AQA-Suite hinzugefügt. Die Tests sind dokumentiert und lassen sich zur Abdeckungsmatrix (sowie gegebenenfalls zu Xray) zurückverfolgen. Die Ausführungsergebnisse sind in der Standardberichterstattung mit eindeutigem Bestanden-/Fehlgeschlagen-Status sichtbar. Dieses Vorhaben ist noch offen.

## [Batch 1061.6] Baumuster- und Deal-ID-Abläufe

Im Baumuster-Ablauf lässt sich ein Vertrag nicht mehr dadurch anlegen, dass dasselbe Baumuster als zusätzlicher Identifikator hinzugefügt wird. Das Modal zum Hinzufügen eines Identifikators schließt sich nun bereits nach dem ersten Klick auf „Proceed“.

## [Batch 1082.1] Suchfunktion für Baumuster

Auf der Seite „Search Baumuster" wurde die Darstellung der Ergebnisliste korrigiert. Die Auswahlkästchen sind nun an dem Inhalt der jeweiligen Tabellenzeile zentriert ausgerichtet. Die Abstände zwischen den Zeilen bleiben über die gesamte Liste hinweg gleich, sodass sich die Zeilen auch am Seitenende nicht mehr unterschiedlich weit voneinander entfernen. Beides entspricht nun der Adobe-Designvorlage.

## [Batch 1182.2] Zwei Bestellnummern für dieselbe FIN/VIN

Es kann vorkommen, dass einer Fahrzeugidentifikationsnummer (FIN/VIN) zunächst in VeDoc eine Bestellnummer zugewiesen wird, die sich nach einiger Zeit ändert. Das System speichert in diesem Fall sowohl die alte als auch die aktualisierte Bestellnummer. Der Vertrag wird über diese Änderung nicht informiert. Bis diese Behandlung umgesetzt ist, wird das bestehende Problem übergangsweise dadurch behoben, dass die alte Bestellnummer aus der Datenbank gelöscht wird.

## [Batch 602.2] Duplikaterkennung bei Kunden

Zum Thema Duplikate wurde das Verhalten des Dialogs angepasst, der beim Anlegen eines Kunden mit gleichem Nachnamen, gleicher Adresse und gleicher IBAN erscheint. Die Rohdaten enthalten hierzu keine weiteren Angaben, sodass sich über die genaue Funktionsweise an dieser Stelle keine näheren Aussagen treffen lassen.

## [Batch 125.4] Finance Management

Im Bereich Finanzbelege können die Belege in der Tabelle und auf der Detailseite eingesehen werden. Mehrere Finanzbelege lassen sich gleichzeitig herunterladen. Das Akzeptieren oder Ablehnen eines Belegs ist nicht möglich.

Im Bereich Financial Control sind die Tabellenwerte bei den Altteilsteuern (I156) und bei den manuellen Altteilsteuern sichtbar. Bei den One-ERP-Prüfungen und den Export-Counter-Prüfungen können die Tabellenwerte ebenfalls eingesehen werden. Dort ist zudem, sofern vorhanden, die Aktion „Weitere Details" verfügbar.

Bei den internationalen Finanzbelegen sind die Belege in der Tabelle und auf der Detailseite sichtbar. Erstellen, Bearbeiten, Löschen und Stornieren sind nicht möglich.

## [Batch 788.1] Steuerverwaltung (Tax Management)

Die Steuerverwaltung, die bisher für den indischen Markt definiert war, wurde erweitert und gilt künftig als globaler Standard für alle Märkte. Die Seite „Tax Management" befindet sich weiterhin in den Markteinstellungen. Das Feld „Finance System Document Code" akzeptiert nun acht alphanumerische Zeichen. Das Dropdown „GST Type" und seine Werte wurden aus den Steuerarten entfernt. Die Steuerart wird stattdessen aus den Markteinstellungen übernommen, und zwar unter Admin -> Market Setting -> General Settings -> Tax Type (allgemeine Regel für alle Märkte). Zur Definition des Steuersatzes gibt es nur noch einen einzigen Steuerfaktor, für GST ist dies der Tax Factor for GST.

Ein MPC-Benutzer des indischen Marktes kann nach der Anmeldung am Markt Indien den GST-Prozentsatz in der Tax-Management-Tabelle festlegen. Unter „Tax Management -> Tax Type" wird die Steuerart GST angezeigt, und es lassen sich Steuersätze anlegen und mit einem Prozentwert versehen. Der im Feld „Finance System Document Code" erfasste Wert wird in der ausgehenden Rechnungsdatei (Export SWTInvExp) mitgeliefert.

## [Batch 266.1] Vermeidung doppelter Steuerklassifizierungen

Bisher gab es beim Anlegen einer Steuerklassifizierung keine Einschränkungen, sodass für denselben Steuertyp mehrere Versionen erstellt werden konnten. Dies ist nun nicht mehr unbeschränkt möglich. Beim Anlegen einer neuen Steuerklassifizierung prüft oneSCM, ob bereits eine Steuerklassifizierung mit denselben Parametern existiert. Verglichen werden dabei die Finanzdokumentdefinition, der Finanzsteuer-Klassifizierungscode, die Kundenklassifizierung, der Steuertyp und die Gültigkeit. Existiert keine Steuerklassifizierung mit diesen Parametern, wird die neue Steuerklassifizierung unverändert gespeichert.

Existiert bereits eine gültige Steuerklassifizierung mit denselben Parametern, gelten für Administratoren folgende Regeln: Im Feld „Valid From“ sind nur Datumswerte in der Zukunft zulässig, frühestens der morgige Tag. Wenn Sie auf „Create“ klicken, erscheint ein Warnhinweis mit dem Text: „Already exist a tax classification with the same criteria. If you want to proceed the validity of the previous tax classification will be changed. Do you want to proceed?“ Der Hinweis bietet zwei Schaltflächen an.

Mit „Cancel“ schließen Sie den Hinweis und kehren zur Seite zum Anlegen der Steuerklassifizierung zurück, wobei alle zuvor eingegebenen Daten erhalten bleiben. Mit „Proceed“ schließen Sie den Hinweis, die Gültigkeit der bestehenden Steuerklassifizierung wird angepasst und die neue Steuerklassifizierung wird gespeichert. Die bestehende Steuerklassifizierung endet dabei einen Tag vor dem Beginn der Gültigkeit der neu angelegten.

Ein Beispiel: Eine bestehende Steuerklassifizierung TAX1 ist vom 01.01.2022 bis 31.12.2050 gültig. Wird eine neue Klassifizierung TAX2 mit Gültigkeit ab 15.01.2024 bis 31.12.2099 angelegt, endet TAX1 anschließend am 14.01.2024. Auch bei mehreren bestehenden Klassifizierungen wird die Gültigkeit entsprechend angepasst, sodass am Ende jeweils nur eine Steuerklassifizierung gültig ist.

Damit ist sichergestellt, dass Administratoren neue Steuerklassifizierungen anlegen können, dass immer nur eine Steuerklassifizierung gleichzeitig gültig ist, dass die neue Steuerklassifizierung ein Startdatum in der Zukunft hat und dass die Gültigkeit der alten Steuerklassifizierung automatisch angepasst wird, wenn eine weitere angelegt wird.

## [Batch 266.3] Suche in der Steuerverwaltung

Die Steuerverwaltung ist um Suchmöglichkeiten erweitert worden. Sie können nun nach der Finanzdokumentdefinition sowie nach der Kunden-Steuerklassifizierung suchen. Beide Funktionen befinden sich derzeit im Status „In Use“.

## [Batch 638.1] Mercedes me Profil anlegen und aktualisieren

Bei der Erstellung eines Servicevertrags für einen Kunden wechselt der Benutzer über die Navigationsleiste in den Bereich „Contract Generation". Im Schritt „Customer Details" erfasst er die erforderlichen Angaben wie Vorname, Nachname sowie E-Mail-Adresse bzw. Mercedes me ID und Telefonnummer bzw. Mercedes me ID. Außerdem fordert er die Zustimmung des Kunden zur Nutzung der Mercedes me Profildaten an. Anschließend prüft das System zunächst in der oneSCM-Datenbank, ob der Kunde bereits existiert. Danach erfolgt eine Prüfung in Mercedes me, und zwar mit zwei API-Aufrufen, einmal mit der E-Mail-Adresse und einmal mit der Telefonnummer. Diese Prüfung findet nur statt, wenn der Kunde seine Zustimmung erteilt hat.

## [Batch 768.3] Aufbau der Profilverwaltung

Der MPC findet die Funktion unter „Market Settings / Contract Review Profiles“. Dort stehen drei Reiter zur Verfügung. Der erste Reiter ist der Standardeinstieg und listet alle angelegten Prüfprofile auf. Der zweite Reiter „Regular Review“ ist neu. Der dritte Reiter, bisher „Operative Review“, heißt künftig „Final Review“. Dort ändert sich nur die Reihenfolge der Felder, die Funktionalität bleibt gleich. Das gilt auch für das Anlegen eines Final-Profils im ersten Reiter.

## [Batch 820.5] Operative Review und Review-Profile

In der Operative Review wird beim „Price per Kilometer" und beim „Payment Amount" nun jeweils der Nettopreis angezeigt, ergänzt um den Hinweis „Excl. VAT". Zuvor wurde beim Preis pro Kilometer der Bruttopreis angezeigt. Beim Anlegen eines Review-Profils ist das Feld „Review Type" standardmäßig auf „Final" gesetzt und schreibgeschützt. Das Gleiche gilt für „Review Type" im Bereich „Search Reviews" der Operative-Review-Seite. In der Tabelle wird der Wert in der Schreibweise „Final" statt „FINAL" angezeigt. Außerdem wurde die fehlerhafte Anzeige des Review-Typs korrigiert, und die GET-Anfrage der Seite wird nicht mehr doppelt ausgeführt. Ein Fehler beim Aufruf eines Vertrags mit leerem Profil wurde ebenfalls behoben.

## [Batch 976.5] Info-Symbol mit Empfehlungen

In beiden Varianten steht neben der Anzahl der Services ein Info-Symbol. Beim Überfahren mit der Maus werden die Empfehlungen auf Basis der K/JX-Code-Werte angezeigt: 1 Service entspricht 12 Monaten und dem K/JX-Code-Wert, 2 Services entsprechen 24 Monaten und dem K/JX-Code-Wert multipliziert mit der Anzahl der Services, und bei N Services gilt die maximal definierte Laufzeit in Monaten bei dem K/JX-Code-Wert multipliziert mit N. Die Legende enthält stets die Empfehlung für die maximal definierte Anzahl an Services. Kann das Kontingentprodukt beispielsweise bis zu 8 Services umfassen, werden 8 Empfehlungen angezeigt, von 1 Service mit 12 Monaten bis 8 Services mit 96 Monaten und dem K/JX-Code-Wert multipliziert mit 8.

## [Batch 1286.2] Phase 2: Playwright-Tests, Xray, Test Plans und Allure

In Phase 2 wird der gesamte Ablauf Ende zu Ende umgesetzt. Freigegebene Gherkin-Features werden aus Xray exportiert, die KI erzeugt daraus Playwright-Step-Definitions, und die Tests laufen auf DEV, INT und PRE-PROD. Die Ergebnisse werden nach Xray zurückgespielt, und zwar als Test Executions, die je Release-fixVersion Test Plans zugeordnet sind. Zusätzlich wird Allure in das bestehende QA-Dashboard auf GitHub Pages integriert.

Sprint 17.1 umfasst den Export, die Generierung der Step Definitions und den ersten Lauf auf DEV mit einer Test Execution samt Zuordnung der Test-Keys (8 SP, Marius). Sprint 17.2 (13 SP) bringt die Läufe auf INT und PRE-PROD mit je einer Test Execution pro Umgebung, einen an die fixVersion gebundenen Test Plan, die korrekte Gruppierung der Tests je Epic in Test Sets sowie den vollständigen Nachweis der Kette von Epic über Phase 1, Xray und Phase 2 bis zu Test Plan und Allure (Marius und Lorand). In Sprint 17.3 veröffentlicht Lorand die Allure-Ergebnisse im QA-Dashboard (5 SP). Die Allure-Reporter-Integration in Playwright (3 SP) ist Marius zugewiesen, aber noch keinem Sprint zugeordnet. Insgesamt sind es 29 Story Points in drei Sprints plus 3 ungeplante.

Erfolgreich ist Phase 2, wenn die KI-generierten Step Definitions kompilieren und laufen, pro Umgebung Test Executions mit korrekter Test-Key-Zuordnung entstehen, der Test Plan die Ergebnisse aller Umgebungen mit fixVersion bündelt, die Test-Set-Rückverfolgbarkeit aus Phase 1 erhalten bleibt, Allure-Berichte im bestehenden Dashboard sichtbar sind und ein Epic durchgängig durch beide Phasen verfolgt wurde.

## [Batch 1287.2] Autonomes QA-Framework, Phase 2 (abgebrochen)

Für die zweite Phase des autonomen QA-Frameworks war vorgesehen, aus fachlich freigegebenen Testfallbeschreibungen im Gherkin-Format automatisch Playwright-Tests zu erstellen, diese gegen die Zielumgebungen DEV, INT und PRE-PROD auszuführen und die Ergebnisse nach Xray zu übertragen. KI-Agenten sollten die Testimplementierungen schreiben, Entwicklerinnen und Entwickler sollten diese prüfen, korrigieren und verifizieren. Die Korrekturen sollten in die Wissensbasis und den Prompt-Kontext zurückfließen, damit sich die Genauigkeit der KI schrittweise einem Zielwert von 98 Prozent annähert. Der Ablauf sollte manuell oder künftig über einen Jira-Statuswechsel ausgelöst werden, nicht durch Git-Ereignisse wie Push oder Pull Request.

Die Pipeline umfasste mehrere Schritte: das Laden der freigegebenen Gherkin-Dateien aus Xray, die KI-gestützte Erstellung der Step Definitions, die Testausführung, die Übertragung der Ergebnisse als JUnit-XML nach Xray (eine Test Execution pro Umgebung und Lauf), einen Test Plan pro Release als durchgängig nachvollziehbares Artefakt, eine Lernschleife sowie eine Fehlerbehandlung mit Audit-Trail, Jira-Kommentar und erneutem Auslösen. Die Infrastruktur für Playwright war bereits umgesetzt, der Xray-Ergebnisimport befand sich in Arbeit. Als Erfolgskriterien waren unter anderem eine vollständig korrekte Zuordnung in Xray und eine Gesamtlaufzeit von unter einer Stunde pro Epic definiert. Der Status ist jedoch „Cancelled“, die Umsetzung wird also nicht weiterverfolgt.

## [Batch 129.5] Geprüfte Funktionen

Geprüft wurden zudem die Rückgabe der Gültigkeitsdaten durch den Revenue Service nach Ablauf der Angebotsgültigkeit, die Umbenennung des Begriffs „Invoice“ in „Financial Document“ bzw. „Document“, die Suchfilter der Batchjobs sowie die Seite, Reiter und Aktionen des Cross File Transfer.

## [Batch 326.5] Lifecycle-Richtlinien für Speicher-Buckets

Da in den Buckets die Versionierung aktiviert ist, wurden bisher ältere Versionen und Dateien nicht ausreichend bereinigt. Die Lifecycle-Regeln wurden daher vereinheitlicht. Im Raw Bucket und im Bucket der Datadog-Integration (Forwarder) werden sowohl aktuelle als auch nicht aktuelle Versionen nach 90 Tagen gelöscht. Für die Buckets trusted, refined, refined-archive, gluescripts, dataproduct, dataproduct-archive und data-catalog gilt in allen drei Umgebungen eine Ablauffrist von 90 Tagen für nicht aktuelle Versionen, während die aktuellen Versionen erhalten bleiben. Für die Konfigurations- und Status-Buckets (Config-, Flowlog-, Terraform- und Canary-Buckets) werden keine Lifecycle-Richtlinien angewendet. In der Dev-IAC nicht benötigte Buckets wurden entfernt.

## [Batch 874.7] Abgrenzung

Nicht Teil dieser Funktion sind Änderungen der Fahrgestellnummer nach der Aktivierung sowie Abläufe, die nicht auf Auftragsnummer oder Baumuster mit Auftragsnummer beruhen, etwa die Verwendung einer verfügbaren Fahrgestellnummer, bei der die Fahrgestellnummer selbst der Identifikator ist.

## [Batch 922.2] History Service (abgeschlossen)

Für die Vertragserstellung wurde ein History Service auf Architekturebene umgesetzt. Nähere Angaben zu Funktionsumfang und Bedienung liegen in den vorliegenden Informationen nicht vor.

## [Batch 991.3] Zahlungsplan-Vorschau mit Tooltip

In der Vorschau des Zahlungsplans während der Vertragserstellung wurden umverteilte Monate bisher mit dem Wert 0 dargestellt. Zum besseren Verständnis der Umverteilung erscheint nun über den Zellen mit dem Bruttobetrag von 0 EUR ein Tooltip mit dem Text „This month's payment is reallocated to the rest of the Payment Plan“.

## [Batch 1082.3] Texte und Auswahlwerte

Im Text „IF System" wurde die Bezeichnung zu „FI System" geändert. Außerdem wurde die Abkürzung „inc." durch „incl" ersetzt. In der Auswahlliste der Produktauswahl lautet der Zahlungsintervall-Eintrag nun „Onetime" statt „yearly". Zur Auswahl stehen damit „Onetime" und „Monthly".

## [Batch 1114.7] Erneutes Öffnen der Kundensuche

In der Vertragserstellung steht eine Schaltfläche zur Verfügung, mit der sich das Kundensuchfenster erneut öffnen lässt.

## [Batch 1178.5] Meldung an CONTRACT

Sobald das System aus GO oder AFAB einen befüllten Liefertermin erhalten hat, informiert es das CONTRACT-System. Übermittelt werden die Kennung des Auftrags und der abgerufene Liefertermin. Vor der Übergabe wandelt das System das Datumsformat des jeweiligen Vorsystems in das Datumsformat des Marktes um, sodass CONTRACT das Datum entsprechend den Markteinstellungen erhält. Wurde der Liefertermin für einen Auftrag einmal erfolgreich an CONTRACT übermittelt, ruft das System diesen Termin in späteren Läufen nicht erneut ab und sendet ihn nicht erneut. Regelungen für nachträgliche Aktualisierungen sind hier nicht festgelegt.

## [Batch 47.6] Anzeige

Ein MDCR ist im Bereich „Finanzdokumente“ sichtbar und kann dort in der Detailansicht eingesehen werden.

## [Batch 829.2] Hinweis zu „Payment Interval not visible while editing“

Zu diesem Eintrag liegen in den Rohdaten nur die Überschrift und der Status „Geschlossen“ vor, jedoch keine Beschreibung. Ohne weitere Angaben kann ich dafür keinen Handbuchtext formulieren, ohne Inhalte zu erfinden. Bitte liefern Sie die Beschreibung nach, falls ein Abschnitt dazu gewünscht ist.

## [Batch 1144.3] Automatische Benennung anhand von Filtern

Name und Beschreibung können anhand der gesetzten Filter automatisch generiert werden. Dafür steht ein Schalter zur Verfügung, der sich ein- und ausschalten lässt und einen definierten Standardzustand hat. Schalten Sie die automatische Benennung aus und bearbeiten den Namen, können Sie einen eigenen Namen vergeben.

