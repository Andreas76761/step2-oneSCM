# Batch 605 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Änderungen und Verbesserungen**

Im Bereich der Kunden- und Partnerverwaltung wurden zahlreiche Anpassungen vorgenommen. Dazu gehört, dass Aktualisierungsanfragen an oneERP nicht mehr gesendet werden, wenn in oneSCM keine Änderungen vorgenommen wurden. Außerdem wurde der Fehler „There is no customer with id“ bei Geschäftskunden behoben. Auch die Prüfung über das CAS, die bei Treffern und Nicht-Treffern (False Positive/Positive) im Status „Pending“ verblieb, wurde korrigiert. Ein Systemfehler im Finanzbereich (FI) bei einem Vertrag wurde ebenfalls beseitigt.

Bei den Kundendaten wurde ein Problem gelöst, bei dem eine falsche E-Mail-Adresse nicht bearbeitet werden konnte, weil sie mit einer Mercedes-me-ID verknüpft war. Für Geschäftskunden wird die IBAN auf der Übersichts- und der Bestätigungsseite nun anonymisiert dargestellt. Bei den Kontaktpersonen bleiben die Aktionen beim Scrollen nicht mehr auf dem Bildschirm stehen.

Für die Zahlungsarten wurde die GET-Anfrage an oneERP für MPay und Banküberweisung angepasst. Private Kunden, die per Kredit- oder Debitkarte zahlen, sowie gewerbliche Kunden, Flottenkunden und staatliche Geschäftskunden, die per Banküberweisung zahlen, werden in oneERP anhand von Name und Adresse (bereits Bestandteil der Anfrage) sowie neu anhand von Mobiltelefonnummer und E-Mail-Adresse identifiziert. Ziel ist, dass diese Kunden jeweils eine SAP-Debitorennummer aus oneERP erhalten. Für Testzwecke wurde zudem die Zahlungsart Kreditkarte für den indischen Markt auf der Entwicklungs- und der Integrationsumgebung aktiviert.

Bei der Händlerverwaltung wurde das Registrierungsfenster überarbeitet. In der deutschen Oberfläche wird „Gläubernummern“ in „SAP Kreditorennummer“ geändert, und die Schaltfläche „Senden“ heißt künftig „Erstellen“; entsprechend soll auch in der englischen Oberfläche „Create“ verwendet werden. Zudem wurde die Bedienung bei der Eingabe der GSSN-ID verbessert: Bisher wurde der Wert schon während der Eingabe gegen GSSN+ geprüft, was zu einem Fehler führte, das Feld markierte und die weitere Eingabe verhinderte. Für Händler des Typs „Affiliated Dealership“ ist die SAP-Debitorennummer künftig kein Pflichtfeld mehr.

Bei der Vertragserstellung wurde die Anzeige der Sammelrechnungs-Schalter angepasst. Bei neuen Privat- und Geschäftskunden wird nur der Schalter für die globale Sammelrechnung angezeigt, nicht jedoch der Schalter für Vertrags-Sammelrechnungen. Bei bestehenden Kunden wird dagegen nur der Schalter für Vertrags-Sammelrechnungen angezeigt, nicht die globale Sammelrechnung.

Darüber hinaus wurden Änderungen in Bezug auf Artifactory an der Benutzeroberfläche und an den Explorern umgesetzt.