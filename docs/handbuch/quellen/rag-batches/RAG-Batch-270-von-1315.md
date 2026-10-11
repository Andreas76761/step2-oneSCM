# Batch 270 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Nemesis-Schnittstelle für Vertragsstammdaten**

Nemesis ist das System, das die buchhalterischen Finanzdaten von Serviceverträgen und integrierten Service-Seiten zum Monatsende verarbeitet. Der Schwerpunkt liegt auf Berechnungen für die Buchhaltung, etwa zur Umsatzrealisierung, zu Vertragsverbindlichkeiten und zu Rückstellungen.

oneSCM übermittelt die benötigten Daten über eine neue Schnittstelle (Webservice/REST-API) an Nemesis. Nemesis stellt dafür den Endpunkt bereit, an den oneSCM die Daten sendet. Die API liefert Informationen zu Verträgen, Vertragserlösen, Vertragsforderungen und Kundendaten. Es gibt einen gemeinsamen Endpunkt für alle Mandanten.

Ein Beispiel ist die Aktivierung eines Fahrzeugvertrags. Wird in oneSCM ein neuer Vertrag angelegt, entsteht im oneSCM-Backend ein Vertragsereignis. Dieses wird per Batch an den Nemesis-Service gesendet. Der Service leitet die Informationen an Nemesis weiter, sodass die externen Systeme die Daten zum aktivierten Vertrag erhalten.

**Vertragsereignisse**

Die vertragsbezogenen Informationen werden für jeden Servicevertrag einzeln bereitgestellt. Bestehen für ein Fahrzeug zwei Verträge, werden also zwei Ereignisse erzeugt. Ereignisse entstehen bei folgenden Auslösern: Vertragsaktivierung, Vertragsbeendigung (vorzeitig, kontingentbezogen, zum Datum, final abgerechnet, laufleistungsbezogen), Reaktivierung und Aussetzung eines Vertrags. Folgende Auslöser sind derzeit noch nicht umgesetzt: manuelle Korrekturen im FIN-Änderungsassistenten, Änderung des Vertragsbeginns, kurzfristige Verlängerung und Anpassung.

**Übermittelte Daten**

Die Vertragsdaten werden als JSON erzeugt. Sie enthalten unter anderem Länderkennzeichen, Fahrgestellnummer, VIN und FIN, die Servicevertragsnummer sowie optional eine externe Vertragsnummer für Verträge aus Altsystemen oder externen Systemen. Hinzu kommen die Angabe, ob der Vertrag subventioniert ist (wahr, wenn Subventionen vorhanden sind, sonst falsch), der Vertragstyp und die Kundenrechnungsvariante („time“ oder „timeAndMileage“). Ebenfalls enthalten sind Vertragsbeginn und geplantes Vertragsende, Start- und geplanter Endkilometerstand sowie tatsächliches Vertragsende und tatsächlicher Endkilometerstand. Weitere Felder sind Zahlungsbeginn und Zahlungsende, Vertragsstatus, Kundennummer und Endkundennummer, Produktcode, Mandantenkennung und Gesellschaftscode.

Einige Felder werden nach besonderen Regeln ermittelt:

Die Geschäftsbereiche der ersten und zweiten Ebene werden aus der Sparte des Fahrzeugs abgeleitet. Pkw entspricht „Mercedes-Benz Cars“ und Van „Mercedes-Benz Van“. Bus entspricht „Daimler Buses“. Alle übrigen Sparten werden auf der ersten Ebene als „Daimler Trucks“ und auf der zweiten Ebene als „Trucks EU/LA“ geführt. Der Geschäftsbereich der dritten Ebene wird aus den Angaben zum Fahrzeug bzw. zur Marke ermittelt.

Die Servicevertragslinie stammt aus der Produktinformation des Risikomanagementsystems. Ist sie nicht definiert, wird vorläufig die Produktlinie verwendet.

Das Kennzeichen „Gebrauchtfahrzeug“ richtet sich nach dem Fahrzeugzustandscode des Produkts. Bei „new“ oder „nearly new“ wird der Wert auf „falsch“ (neu) gesetzt, andernfalls auf „wahr“ (gebraucht). Fehlt der Zustandscode, wird die Erstzulassung mit dem Vertragsbeginn verglichen. Fehlt die Erstzulassung oder liegt sie nicht vor dem Vertragsbeginn, gilt das Fahrzeug als neu, sonst als gebraucht.

Die Fahrzeugtypbezeichnung basiert auf der Verkaufsbezeichnung. Ist diese leer, wird „*“ gesendet. Bei Pkw wird die Verkaufsbezeichnung gesendet. Bei allen anderen Sparten wird sie ohne Leerzeichen am Ende, gefolgt von einem Leerzeichen und der Antriebsformel, übermittelt. Bei Fahrzeugen anderer Hersteller wird dafür die manuell gepflegte Antriebsformel verwendet.

Das Feld „Vertrag mit Kontingent“ ist wahr, wenn ein kontingentbezogener Vertrag vorliegt, sonst falsch. Das initiale Kontingent wird über alle Deckungen geprüft und ist 0, wenn keines gesetzt ist. Vorläufig gilt der Standardwert 0. Das genutzte Kontingent wird ebenfalls über alle Deckungen geprüft und ist 0, wenn keines gesetzt ist.

Für die Rückversicherung sind derzeit feste Werte vorgesehen: Die Rückversicherung ist „None“ oder „True“, der Rückversicherungsanteil ist 0 und die Versicherungsprämie ist 0.

**Hinweis zu Abschnitt „Admin-Bereich: Prüfung, ob eine Rechnung im Status „Created“ freigegeben werden kann“**

Zu diesem Thema liegen in den Rohdaten nur die Überschrift und der Status vor, aber keine Beschreibung. Ein Handbuchtext lässt sich daraus nicht ableiten, ohne Inhalte zu erfinden. Bitte ergänzen Sie dafür die Ticketbeschreibung.