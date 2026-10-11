# Material zu 14 Ohne Unterkapitel-Zuordnung

Kapitel 14 Marktrolle, Produkt- und Preispflege sowie Administration. 15 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 1104.3] Marktkonfiguration und Erinnerungen

Die Logik der Erinnerungsfelder in der Marktkonfiguration wurde neu gestaltet. Dies betrifft „First Reminder (Days)“ und „Second Reminder (Days)“ sowie die beiden entsprechenden Felder unter „Contract End Date Reminders“. Alle vier Felder sind optional. Ist kein Wert eingetragen, wird keine Erinnerung versendet. Ist ein Wert eingetragen, wird die Erinnerung nach der angegebenen Anzahl von Tagen versendet.

## [Batch 694.4] Marktkonfiguration

Unter „Market Settings > Market Config > Mpay Config“ wird das Feld „Transaction Type“ nicht mehr angezeigt.

## [Batch 869.2] Marktkonfiguration

Vor dem Go-live muss das MPC in den Market Settings unter „Timers & Reminders" das Feld „Grace Period Campaign Request Validity" konfigurieren. Es nimmt eine positive ganze Zahl in Kalendertagen auf und kann je Division (PC/VAN) gepflegt werden. Der Standardwert beträgt 7 Kalendertage. Wird der Wert geändert, z. B. auf 10 Kalendertage, gilt er für alle danach eingereichten Anfragen des Marktes: Deren Fälligkeitsdatum ergibt sich aus dem Einreichungsdatum plus der konfigurierten Gültigkeit. Bereits laufende Anfragen behalten ihr zuvor berechnetes Fälligkeitsdatum.

## [Batch 1310.2] Marktkonfiguration

Im Reiter „Market Configuration“ wurden die Felder „First Name“ und „Last Name“ entfernt; die Vorlage wird entsprechend angepasst, ohne diese Felder abzufragen. Bei den Timern und Erinnerungen gilt: Die Gültigkeit des DSS-Signaturlinks (in Tagen) muss der Angebotsgültigkeit entsprechen. Weiterhin gibt es die Wartezeiten für die CAS-Antwort, die SEPA-Validierung und die SAP-Debitorennummer (jeweils in Tagen). Ein Vertrag kann nur aktiviert werden, wenn CAS, SEPA und SAP in Ordnung sind. Liegt bis zum Ablauf der Angebotsgültigkeit keine Bestätigung vor, wird der Vertrag auf „Rejected“ gesetzt. Diese Änderung wurde im Frontend und im Backend umgesetzt.

## [Batch 559.1] Neue Märkte Tschechien und Schweiz

Mit dieser Erweiterung werden die Märkte Tschechien (CZ) und Schweiz (CH) im System freigeschaltet. Dafür werden die Märkte in den Anfragen an die Google-API, GSSN, MercedesMe und SWIFT berücksichtigt. Ebenso werden sie im Finanzsystem CoFiCo und im Signatur-Job für DSS unterstützt. Zusätzlich wird die Validierung von Kundendaten für beide Märkte angepasst.

Die Validierungsmuster für Postleitzahl, Umsatzsteuer-Identifikationsnummer und Steuernummer werden aus der Marktkonfiguration geladen, und zwar getrennt für CZ und CH. Beim Anlegen oder Ändern eines Kunden im jeweiligen Markt werden diese Felder gegen das zugehörige Muster geprüft. Entsprechen alle Angaben dem Muster, wird der Kunde erfolgreich angelegt bzw. aktualisiert. Entspricht eine Angabe nicht dem Muster, schlägt das Anlegen fehl, und es erscheint eine Fehlermeldung, die auf das ungültige Format des betreffenden Feldes (Postleitzahl, USt-ID oder Steuernummer) hinweist. Auch das Anlegen von Händlerbetrieben und Lieferanten ist für beide Märkte möglich. Dabei gelten ebenfalls die Vorgaben der jeweiligen Marktkonfiguration, bei Händlerbetrieben mit einer gültigen Outlet-ID bzw. GSSN-Outlet-ID und bei Lieferanten mit einer gültigen Postleitzahl.

## [Batch 677.3] Verhalten von Dialogfenstern

Dialogfenster (Modals) in oneSCM sollen nicht mehr versehentlich geschlossen werden, wenn Anwenderinnen und Anwender außerhalb des Fensters auf den dunklen Hintergrund klicken. Dies betrifft zum Beispiel die Bearbeiten- und Löschen-Dialoge einer Fahrzeuggruppen-Karte auf der Übersichtsseite. Zuvor ging beim versehentlichen Wegklicken unter Umständen bereits eingegebene Information verloren und es entstand Verwirrung darüber, was geschehen war. Vorgesehen ist, Dialogfenster standardmäßig nicht per Klick auf den Hintergrund schließbar zu machen. Wo es erforderlich ist, können Ausnahmen definiert werden. Diese Regelung soll auch für künftige Erweiterungen gelten.

## [Batch 1270.4] Übersichtsseiten und Suche

Auf den Übersichtsseiten für Fahrzeuggruppen und Produkte werden die Einträge standardmäßig nach Erstellung bzw. letzter Änderung sortiert, wobei die neuesten zuerst erscheinen. Die Suche nach Verträgen über Kunde oder Zahler wurde technisch verbessert.

## [Batch 1284.3] Weitere Anpassungen

Zahlungsoptionen können nur noch gespeichert werden, wenn mindestens eine der beiden Varianten, Einmalzahlung oder monatliche Zahlung, aktiviert ist. Sind beide deaktiviert, ist das Speichern nicht möglich. Außerdem wurde in der Übersichtsseite ein überflüssiges Leerzeichen im Namen der Schaltfläche „Create Vehicle Group“ entfernt.

## [Batch 374.3] Neue Druckvariablen für Preis pro Kilometer

Auf Produktebene stehen in Dokumenten und E-Mails zwei neue Druckvariablen bereit: der Preis pro Kilometer bei Mehrkilometern und der Preis pro Kilometer bei Minderkilometern. Die Werte werden aus dem Vertrag übernommen. In der Vorschau wird als Standardwert 0,50 € angezeigt, wobei die Währung aus den Markteinstellungen stammt.

## [Batch 629.3] Behobene Probleme

In diesem Bereich wurden mehrere Fehler behoben und abgeschlossen: Die Neuanlage eines nicht registrierten Händlers funktionierte nicht, die Fuzzy-Suche erschien zu spät im Ablauf, und nicht alle Markteinstellungen wurden in der Anwendung übernommen. Ein gemeldetes Problem mit vertauschtem Vor- und Nachnamen in der Vertragsübersicht wurde nicht weiterverfolgt und abgebrochen.

## [Batch 945.6] Kategorie „Endpreise für Kunden"

Diese Kategorie wird immer vollständig angezeigt. „Net Total" enthält den Gesamtnettowert der Preisbestandteile in der Tabelle, also Optionen, Gebühren und angewendete Rabatte. „Tax" weist den auf den Nettogesamtwert angewendeten Steuerbetrag je Intervall und gesamt aus, wobei der Steuersatz in der Bezeichnung steht, zum Beispiel „Tax: 19%". „Gross Total" zeigt den Bruttowert des Endpreises.

## [Batch 1098.4] Fußzeile

Die Fußzeile wurde angepasst. „Privacy Policy External" und „General Legal Notice" werden dort nicht mehr aufgeführt, bleiben aber in den Markteinstellungen erhalten. Die Fußzeile enthält nun vier Bereiche: Imprint, Privacy Policy, Terms of Use und Licenses.

## [Batch 1163.4] Preisanzeige und Nettopreise

Anwender können über einen Umschalter wählen, ob der Monatspreis oder der Gesamtpreis angezeigt wird. Nettopreise lassen sich manuell eingeben, per Copy-and-paste übernehmen oder über die Excel-Upload- und -Download-Funktion pflegen.

Auf der Seite „Discounted Products & Vehicles“ wurde der Hinweistext angepasst: Statt „All input prices are in EUR/month (without VAT)“ lautet er nun „All input prices are Net Prices in EUR (without VAT)“. Die Funktion „Define over all discount“ steht auf dieser Seite nicht mehr zur Verfügung. Ebenso entfällt die Augensymbol-Funktion zur Anzeige von Originalwert und rabattiertem Preis. Voraussetzung ist, dass das Produkt verfügbar ist.

## [Batch 1196.1] (ohne Überschrift)

**Hinweis zur Verwendung:** Das Ticket zur Preisversions-Duplizierung mit prozentualer Erhöhung hat den Status „Cancelled“ und die Exploration zu weiteren Märkten ist ein reines Untersuchungsthema ohne ausgelieferte Funktion. Beide sind daher nicht als Funktionen beschrieben. Der folgende Text umfasst die Funktionen, die geschlossen wurden.

## [Batch 53.3] Hinweis zur Datengrundlage

Für den zweiten Punkt enthielten die Rohdaten keine Beschreibung. Der Platzhalter im Beschreibungsfeld wurde nicht aufgelöst. Die Angaben stützen sich daher allein auf die Überschrift. Nähere Informationen, etwa zu Auswirkungen auf bestehende Importabläufe, liegen nicht vor und sollten vor der Veröffentlichung ergänzt werden. Auch die Formulierung, dass Einträge zuvor als Konflikt galten, ist eine Annahme aus der Überschrift und sollte fachlich bestätigt werden.

