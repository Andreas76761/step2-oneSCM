# Batch 565 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**TraCS: Gesamtarchitektur und Lokalisierung für die Schweiz und Tschechien**

Der Lieferant der bisherigen CAS-Lösung beendet den Support für diese Anwendung. Aus diesem Grund wird der Screening-Prozess auf TraCS migriert. Der gewohnte Screening-Prozess bleibt dabei erhalten. Die Schnittstelle für das Screening wird auf eine REST-API umgestellt. Dazu wird eine POST-API bereitgestellt. Als Alternative zum clientseitigen Polling ist zusätzlich eine Push-Back-API für die asynchrone Übermittlung von Ergebnissen vorgesehen. Sie wird durch eine finale Entscheidung im Clearing-Prozess ausgelöst. Bei einem potenziellen Treffer ist dadurch kein periodisches Abfragen erforderlich.

**Übermittelte Kundendaten (POST-Endpunkt)**

Die Kundendaten, die bereits heute für das Clearing gesendet werden, bleiben unverändert. Bei natürlichen Personen sind das der vollständige Vor- und Nachname sowie die Adresse mit Straße, Hausnummer, Ort, Postleitzahl und Land. Bei juristischen Personen werden der Firmenname mit Rechtsform sowie die Adresse mit Straße, Ort, Postleitzahl und Land übermittelt. Der Adresstyp wird je nach Fall als „individual“ oder „entity“ angegeben. Als Referenz-ID dient die oneSCM-Kunden-ID. Im Referenzkommentar werden derzeit die MO-E-Mail-Adressen beider Divisionen mitgesendet.

**Antwortkombinationen und Entscheidungsregeln**

Die Antwort des Systems wird anhand der Felder matchFound, wasGoodGuy und wasBadGuy ausgewertet. Sind alle drei Werte „false“, liegt kein Treffer vor und der Geschäftsvorgang kann fortgesetzt werden. Lautet die Kombination matchFound = true, wasGoodGuy = false und wasBadGuy = true, liegt ein Treffer vor und der Vorgang wird gestoppt. Bei matchFound = true, wasGoodGuy = true und wasBadGuy = false liegt kein Treffer vor und der Geschäftsvorgang wird fortgesetzt. Bei matchFound = true, wasGoodGuy = false und wasBadGuy = false muss der Clearer eingebunden werden und im TraCS-Frontend entscheiden, ob ein Treffer vorliegt. Ist eine der Bedingungen nicht erfüllt, wird dies wie bisher als potenzieller Treffer ohne finale Entscheidung behandelt. Die endgültige Klärung wird dann über den Push-Back-Endpunkt empfangen.

**GET-Endpunkt und Push-Back-Endpunkt**

Beim GET-Endpunkt (Polling) wird der finale Clearing-Status anhand der cusAebCheckID abgefragt, die in der Antwort auf den POST-Aufruf zurückgegeben wurde. Für den Push-Back-Endpunkt liegt eine eigene Spezifikation vor. Voraussetzungen sind, dass die API entwickelt und veröffentlicht wird, dass entweder ein aus dem Internet erreichbarer Endpunkt eingerichtet oder das Gorilla Gateway genutzt wird und dass die Authentifizierung über Zugangsdaten mit OAuth2 erfolgt.

**Status in oneSCM und in TraCS**

In oneSCM gelten folgende Status: GOOD_GUY steht für „OK“ (auf der Whitelist). BAD_GUY steht für „NOK“ (auf der Blacklist). RELEASED_ONCE bedeutet „OK“, der Kunde ist nicht auf der Whitelist, eine Geschäftsbeziehung ist aber in Ordnung. BLOCKED_ONCE bedeutet „NOK“, der Kunde ist nicht auf der Blacklist, eine Geschäftsbeziehung ist aber nicht in Ordnung.

In TraCS entsprechen diese Status den folgenden Bedeutungen: GOOD_GUY bedeutet „kein Treffer, Geschäft fortsetzen“. Der Kunde wird für eine künftige automatische Freigabe als „good-guy“ gespeichert. RELEASE_ONCE bedeutet ebenfalls „kein Treffer, Geschäft fortsetzen“. Die Freigabe gilt aber nur einmalig und es erfolgt keine automatische Erkennung in der Zukunft. BLOCKED_ONCE bedeutet „Treffer, Stopp“. Der Treffer ist bestätigt und der Kunde wird einmalig gesperrt, ohne künftige automatische Erkennung. BAD_GUY bedeutet „Treffer, Stopp“. Der Treffer ist bestätigt und der Kunde wird für eine künftige automatische Ablehnung als „bad-guy“ gespeichert.