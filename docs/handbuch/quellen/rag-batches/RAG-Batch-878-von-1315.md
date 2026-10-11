# Batch 878 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung mit dem Autohaus als Kunde**

In bestimmten Situationen muss ein Servicevertrag mit dem Autohaus selbst als Kunde angelegt werden. Das Autohaus ist dann Eigentümer des Vertrags und zahlt ihn auch selbst, zum Beispiel bei Verträgen auf den eigenen Bestand oder auf Vorführfahrzeuge. Bisher gab es dafür keinen eigenen Ablauf. Ein Autohaus konnte nur dann als Vertragskunde hinterlegt werden, wenn es manuell wie ein gewöhnlicher Geschäftskunde erfasst wurde. Eine Verknüpfung mit dem angemeldeten Standort, eine Automatisierung oder spezielle Prüfungen gab es nicht. Mit der neuen Funktion steht Autohäusern eine eigene Variante der bestehenden Erstellungsabläufe zur Verfügung.

**Aktivierung im Dialog zur Dublettenprüfung**

Der Verkäufer meldet sich in oneSCM an und wählt den Standort aus, für den er tätig ist. Anschließend legt er wie gewohnt ein Angebot an: Er wählt den Kundentyp „Geschäftskunde“, erfasst die Fahrzeugkennung und die zugehörigen Informationen und konfiguriert das Produkt. Dieser Ablauf entspricht dem Standardprozess und gilt für die Divisionen PC und VAN. Möglich ist er über alle fünf Erstellungswege: verfügbare Fahrgestellnummer, Build-to-Stock, Auftragsnummer (Build-to-Order), Deal-ID und Verso-ID.

Klickt der Verkäufer auf „Create Proposal“, öffnet sich der bekannte Dialog zur Dublettenprüfung. Er enthält nun einen neuen Schalter, als Bezeichnung ist „Dealership is the customer“ vorgesehen. Der Schalter ist standardmäßig ausgeschaltet; dann läuft der Prozess unverändert wie bisher. Schaltet der Verkäufer ihn ein, wird das Autohaus, also der Standort, für den er angemeldet ist, zum Kunden des Vertrags. Der Schalter wird nur bei Angeboten für Geschäftskunden angezeigt, nicht bei Privatkunden oder staatlichen Kunden. Nur Händler können ihr eigenes Autohaus als Kunden zuweisen. Ein Mitarbeiter des MPC kann das nicht, da er keinem Autohaus angehört; in diesem Fall erscheint der Schalter nicht.

**Automatische Übernahme der Kundendaten und festgelegte Zahlungsart**

Im folgenden Kundenschritt werden die Kundenfelder automatisch aus den Stammdaten des Autohauses befüllt, etwa Name, Adresse und Kennungen. Die übernommenen Daten sind editierbar. Das Autohaus ist zugleich Vertragsinhaber und Zahler. Voraussetzung ist, dass sich der Standort einem Geschäftskunden-Stammsatz zuordnen lässt. Fehlt das Autohaus als Kunde, muss es angelegt und mit dem Finanzsystem synchronisiert werden.

Unabhängig von der Konfiguration des Produkts oder des Marktes gilt für Angebote mit eingeschaltetem Schalter immer die Zahlungsart „Post Activation“ und das Zahlungsintervall „One Time“. Der Zahlungsplan wird entsprechend als einzelne Rate nach der Aktivierung erzeugt. Die Zahlungsmethode richtet sich weiterhin nach der Produktdefinition.

**Neue MO-Prüfung „Vehicle Registration Document“**

Mit dem Fortfahren wird das Angebot erstellt, es gelten die üblichen Status. Für Verträge, die mit eingeschaltetem Schalter entstehen, wird zusätzlich eine neue MO-Prüfung angelegt, und zwar in der Kategorie „Dealership Checks“ mit der Prüfung „Vehicle Registration Document“. Ihr Standardstatus ist NOT OK. In der Prüfung steht der Link „Go to Document“, der in die Detailansicht des Vertrags auf den Reiter „Communication“ führt. Bei Verträgen, die ohne den Schalter erstellt wurden, gibt es diese Prüfung und die Kategorie nicht.

**Dokument hochladen und prüfen lassen**

Sobald der Vertrag den Status „Waiting for Confirmation“ erreicht hat, öffnet der Verkäufer in der Detailansicht des Vertrags den Reiter „Communication“ und lädt dort das Dokument „Vehicle Registration Document“ hoch, ein neuer Dokumenttyp. Mit dem Upload wechselt die Prüfung automatisch von NOT OK auf PENDING.

Anschließend öffnet das MO bzw. das MPC den Bildschirm „MO Checks Verification“, prüft das hochgeladene Dokument und setzt die Prüfung per aktiver Bestätigung auf OK oder NOT OK. Das Verfahren ist identisch mit dem bei bestehenden Prüfungen. Dazu gehört die Pflichtabfrage, einen Grund zu hinterlegen, der mit Benutzer und Zeitstempel gespeichert wird. Als Prüfer fungiert in den meisten Fällen das MO, in Ausnahmefällen oder kleineren Märkten das MPC; beide sind vom Autohaus unabhängig.

Wird die Prüfung mit NOT OK bestätigt, zeigt die dritte Spalte der Prüfung den Link „Go to Document“, der zum Reiter „Communication“ führt. Der Vertrag kann dann nicht aktiviert werden und bleibt in „Waiting for Activation“ bzw. seinem aktuellen Status. Lädt der Verkäufer ein neues Dokument hoch, springt die Prüfung wieder auf PENDING, und das MO muss erneut prüfen und bewerten. Dieser Kreislauf kann sich wiederholen, bis die Prüfung auf OK gesetzt wird. Wird die Prüfung mit OK bestätigt, entfällt der Link „Go to Document“, und die Aktivierung ist freigegeben. Der Vertrag kann aktiviert werden, sobald alle weiteren Aktivierungsvoraussetzungen erfüllt sind. Wie bei jeder anderen blockierenden MO-Prüfung muss die Prüfung also OK bzw. OK acknowledged sein.

Zusammengefasst durchläuft die Prüfung folgende Stationen: NOT OK bei der Erstellung, PENDING nach dem Dokumenten-Upload, danach entweder OK acknowledged, wenn der Prüfer das Dokument freigibt, oder NOT OK acknowledged, wenn er es ablehnt. Im Fall der Ablehnung wird der Link „Go to Document“ angezeigt.

**Weitere Funktionen und Aktivierung**

Die Funktion unterstützt auch Massenerstellung (Mass Creation) und Sonderfälle (Special Case). Bei der Massenerstellung erhält jeder Vertrag das Autohaus als Kunden und Zahler, die festgelegte Zahlungsart und die Prüfung „Vehicle Registration Document“. Im Schritt „Special Request“ stehen Sonderfallanfragen wie bei jedem anderen Geschäftskundenvertrag zur Verfügung. Kampagnen und Kampagnen mit Karenzzeit (Grace Period) können ebenfalls angefragt werden.

Nach der Aktivierung werden die Vertragsinformationen wie bei jedem aktivierten Vertrag an Revenue und Nemesis weitergegeben. Der Vertrag wird außerdem in den nächsten i155-Export aufgenommen.