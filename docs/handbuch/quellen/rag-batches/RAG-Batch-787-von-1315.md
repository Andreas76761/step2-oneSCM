# Batch 787 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverlängerung (Prolongation) für MBLD-Verträge**

Die Prolongationslogik in oneSCM wurde für MBLD-Verträge erweitert. Service-Verträge für MBLD werden auf Basis einer erweiterten Preismatrix, ohne Kundenunterschrift und ohne Erzeugung oder Versand von Dokumenten und Benachrichtigungen angelegt. Diese Besonderheiten gelten nun auch, wenn ein MBLD-Vertrag über das oneSCM-Frontend oder über die API verlängert wird. Das Frontend nutzen Mitarbeitende von Market Operations (MO) bzw. des MPC, die API nutzt MBLD selbst. Für Retail-Verträge bleibt die bisherige Logik unverändert, und auch die Benutzeroberfläche bleibt wie bei Retail.

**Voraussetzungen**

Die Funktion steht zur Verfügung, wenn für MBLD ein Service-Vertrag angelegt wurde, der Vertragstyp „Leasing" ist und der Vertragsstatus „Aktiv" lautet. Die Nutzerin oder der Nutzer benötigt die Rolle MO bzw. MPC. Eine Kurzzeitverlängerung (Short Term Extension) ist für MBLD nicht verfügbar. Bei aktiven Retail-Verträgen stehen dagegen weiterhin Kurzzeit- und Langzeitverlängerung zur Verfügung, sofern das Produkt sie unterstützt.

**Ablauf der Langzeitverlängerung**

Ausgangspunkt ist eine Offline-Anfrage: Die MBLD-Vertretung sendet per E-Mail eine Anfrage an MO/MPC, einen bestimmten Vertrag langfristig zu verlängern. Die zuständige Person öffnet die Detailansicht des Service-Vertrags und wählt im Menü „Actions" den Punkt „Prolongation". Bei einem MBLD-/Leasing-Vertrag steht auf der Prolongationsseite ausschließlich die Langzeitverlängerung (Long Term Prolongation) zur Verfügung.

Wählt der Nutzer die Langzeitverlängerung, ruft der Vertrags-Microservice beim Produkt-Microservice die verfügbaren Verlängerungsoptionen ab. Dabei werden Vertragsdaten wie Vertragstyp, Vertriebskanal, Laufzeit, Preis, bezahlte bzw. exportierte Rechnungen, Zahlungsintervall und optionale Deckungen übermittelt. Der Produkt-Microservice liefert passende Produkte und Konfigurationen zurück.

Anschließend konfiguriert der Nutzer die Verlängerung in der Oberfläche. Das Startdatum ist schreibgeschützt und entspricht dem nächsten Wirksamkeitstag. Der Preis ist schreibgeschützt, zunächst mit „-" vorbelegt, und wird aktualisiert, sobald Laufzeit und Laufleistung gewählt sind. Die Gesamtlaufzeit (Total Period) wird aus einer Auswahlliste gewählt, deren Werte aus dem Produktservice stammen. Auch die Gesamtlaufleistung (Total Mileage) wird aus einer Auswahlliste gewählt, deren Werte aus dem Produktservice stammen. Die jährliche Laufleistung (Annual Mileage) ist schreibgeschützt und wird nach der Auswahl berechnet. Sie wird mit vollständigen Dezimalstellen angezeigt, etwa „20.000" oder „23.333". Das Zahlungsintervall wird aus dem Vertrag übernommen und ist schreibgeschützt. Im Feld „Comments" kann ein Freitext erfasst werden. Optionale Deckungen können, sofern verfügbar, ausgewählt werden; der Preis wird dabei neu berechnet.

Für Leasing-Verträge gilt zudem: Die Laufleistung wird als Gesamtlaufleistung konfiguriert, wofür die erweiterte Preismatrix von M&M bereitgestellt wird. Welche Preisversion gilt (Stand Verkaufsdatum oder Stand Verlängerungszeitpunkt), hängt von der Einstellung auf Produktebene ab. Zusätzlich gibt es das Feld „Signature required". Es ist schreibgeschützt und bei „Leasing" nicht angehakt, bei „Standalone" angehakt. Ist es nicht angehakt, erfordert die Verlängerung keine Unterschrift und kann sofort abgeschlossen werden.

**Übersicht und Bestätigung**

Auf der Übersichtsseite vergleicht das System die aktuelle mit der zukünftigen Vertragskonfiguration. Von dort stehen folgende Möglichkeiten zur Verfügung: Der Vergleich kann mit dem aktuellen Stand per E-Mail versendet werden. Wer auf eine andere Seite navigiert, speichert die Konfiguration für die spätere Verwendung, ohne dass Änderungen angewendet werden. „Go Back" führt zurück zur Konfiguration, wo Laufzeit, Gesamtlaufleistung und gegebenenfalls optionale Deckungen angepasst werden können. „Close" führt zur Startseite des Vertragsmanagements zurück und speichert die Konfiguration ebenfalls für später, ohne Änderungen anzuwenden.

Mit „Confirm" wird die Langzeitverlängerung angewendet. Dabei wird keine Unterschrift verlangt, es wird kein Dokument erzeugt und es wird keine E-Mail-Benachrichtigung versendet. Der Vertrag wird um die neue Laufzeit, Laufleistung und gegebenenfalls gewählte optionale Deckungen aktualisiert, der Zahlungsplan wird neu erstellt, Revenue wird benachrichtigt, i155 wird erzeugt und die Vertragshistorie wird aktualisiert. Zum Abschluss bestätigt die MO/MPC-Person der MBLD-Vertretung offline per E-Mail, dass die Anfrage erledigt wurde. Dafür wird weder eine Vorlage benötigt noch werden automatische E-Mails versendet.

**Hinweis**

Da bei MBLD-Verlängerungen kein Dokument erzeugt wird, findet sich im Dokumenten-Tab kein Nachweis über die Zustimmung von MBLD. Der einzige Nachweis, dass die Verlängerung durchgeführt wurde, ist der Eintrag in der Vertragshistorie.