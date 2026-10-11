# Batch 852 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Rollen und Berechtigungen in der Vertragserstellung und Vertragsverwaltung**

Die Anwendung stellt ein belastbares Konzept für die Verwaltung von Benutzerrollen und Berechtigungen bereit, damit jeder Nutzer entsprechend seiner Aufgaben und Autorisierungsstufe die passenden Zugriffe und Rechte erhält. Rollen und Berechtigungen werden im Drittsystem (Alice / Gems) definiert. In oneSCM sind die Rollen Dealer, Market Operations und MPC PM vorgesehen.

Für die Vertragserstellung stehen folgende Berechtigungen zur Verfügung: Dealer, Market Operations und MPC PM dürfen Preise von Produkten und Verträgen einsehen, Produkte und Optionen ansehen und konfigurieren, Kunden- und Zahlungsinformationen bearbeiten sowie Verträge anlegen und bestätigen. Außerdem dürfen sie Verträge mit ihrem Status einsehen (CREATED, CONFIRMED, WAITING FOR ACTIVATION, ACTIVE, DECLINED, CANCELED). Ausschließlich Market Operations darf den Vertragsstatus manuell setzen, wenn Prüfungen fehlschlagen, also einen Vertrag aktivieren oder stornieren.

In der Vertragsverwaltung dürfen Dealer, Market Operations und MPC PM die Details von Verträgen einsehen, die den Status Active, Suspended, Closed oder Terminated haben. Market Operations darf zusätzlich Kunden- und Zahlungsinformationen bearbeiten und den Vertragsstatus manuell auf Suspended, Reactivate, Closed oder Terminated setzen.

**Startseite der Vertragsverwaltung**

Die Startseite der Vertragsverwaltung zeigt die Verträge mit den zugehörigen Informationen an. Der Kundenname wird für alle aufgelisteten Verträge angezeigt. Die Suche funktioniert über die Kriterien Vertragsnummer, Kundenname und Fahrgestellnummer; der gesuchte Vertrag wird mit seinen Informationen angezeigt. Tritt bei der Suche ein Fehler auf, erscheint eine aussagekräftige Hinweismeldung (Toast-Meldung) anstelle einer unspezifischen Fehlermeldung.

**Tabellen und Seitenauswahl**

Bei Ergebnistabellen mit mehr als zehn Einträgen wurde die Blätterfunktion korrigiert. Wählt man auf Seite 2 im Auswahlfeld für die Einträge pro Seite einen Wert, der größer ist als die Gesamtzahl der Einträge (zum Beispiel 40 bei 33 Einträgen), zeigt die Tabelle nun höchstens so viele Ergebnisse an, wie der gewählte Wert vorgibt, und springt auf Seite 1. Bei 34 Treffern und einer Auswahl von 40 werden somit alle 34 Einträge angezeigt.

**Vertragsdetails und Fahrzeugdaten**

Im Reiter „Vertragsdetails“ werden die geplante Gesamtlaufleistung und die tatsächliche Laufleistung bei Vertragsende berechnet. Beide Werte ergeben sich aus der in der Produktkonfiguration gewählten Kilometerzahl pro Jahr multipliziert mit der Vertragslaufzeit.

Im Reiter „Fahrzeug“ wird das FRD angezeigt. Das FRD ist ein Pflichtfeld im Bereich der Fahrzeugeingabe und muss angegeben werden, damit die verfügbaren Produkte generiert werden können. Nachdem das Produkt ausgewählt und konfiguriert wurde und der Vertrag alle vorherigen Schritte durchlaufen hat und aktiviert wurde, wird das FRD im System gespeichert und im Reiter „Fahrzeug“ dargestellt.

**Vertragsablauf**

Wird das Vertragsende erreicht, wird der Vertrag auf den Status „Expired“ gesetzt und die Schnittstelle i155 wird ausgelöst.