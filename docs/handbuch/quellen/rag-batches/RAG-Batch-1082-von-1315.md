# Batch 1082 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 18 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation – Änderungen und Korrekturen**

**Suchfunktion für Baumuster**
Auf der Seite „Search Baumuster" wurde die Darstellung der Ergebnisliste korrigiert. Die Auswahlkästchen sind nun an dem Inhalt der jeweiligen Tabellenzeile zentriert ausgerichtet. Die Abstände zwischen den Zeilen bleiben über die gesamte Liste hinweg gleich, sodass sich die Zeilen auch am Seitenende nicht mehr unterschiedlich weit voneinander entfernen. Beides entspricht nun der Adobe-Designvorlage.

**Eingaben im Fahrzeugformular**
Die Eingabefelder im Fahrzeugformular prüfen die Eingaben nun strenger. Das Feld „Laufleistung" nimmt keine Buchstaben und keine Sonderzeichen wie @ oder & mehr an, auch dann nicht, wenn sie vom Benutzer eingegeben werden. Das Feld „Fahrgestellnummer" zeigt alle Buchstaben ausschließlich als Großbuchstaben an. Sonderzeichen wie @, $ oder % werden dort ebenfalls nicht mehr dargestellt, selbst wenn sie eingegeben werden.

Für die Laufleistung wurde außerdem die Darstellung des Trennzeichens angepasst, beispielsweise bei der Schreibweise 10.000. Die Anpassung wurde sowohl im Frontend als auch im Backend umgesetzt.

**Texte und Auswahlwerte**
Im Text „IF System" wurde die Bezeichnung zu „FI System" geändert. Außerdem wurde die Abkürzung „inc." durch „incl" ersetzt. In der Auswahlliste der Produktauswahl lautet der Zahlungsintervall-Eintrag nun „Onetime" statt „yearly". Zur Auswahl stehen damit „Onetime" und „Monthly".

**Schnittstellenmeldung I155**
Die Meldung I155 wird nun nur noch für aktive Verträge erzeugt. Zuvor wurde sie für alle Status generiert. Für Verträge mit dem Status CREATED oder CONFIRMED wird sie nicht mehr gesendet.

**Weitere Anpassungen im Backend**
Für Vertragsvorschläge, die über die API angelegt werden, wird die Angebotsgültigkeit aus den Markteinstellungen übernommen. Für MBLD erfolgt keine automatische Ablehnung mehr. Zudem wurde das Verhalten für den Fall angepasst, dass eine Produktversion nicht mehr verfügbar ist. Diese Änderungen befinden sich im Status „BAT Confirmed".

**Noch in Arbeit bzw. geplant**
Derzeit im BAT-Test befindet sich das Rückgängigmachen einer früheren Änderung, wodurch Ablehnungsbenachrichtigungen an Kunden und Händler wieder aktiviert werden.

Noch offen sind zwei Vorhaben. Zum einen soll für Reportingzwecke im Vertragserstellungsprozess das neue Feld „Salesman ID" ergänzt werden. Nach der Bereitstellung soll dieses Feld für bereits bestehende Verträge initial befüllt werden. Zum anderen soll auf der Übersichts- und Bestätigungsseite im Bereich „Produktoptionen" bei Vorschlägen im Status „Created" die Vertragslaufzeit angezeigt werden. Bisher zeigt das Feld „Laufzeit" dort „Noch nicht verfügbar", solange das Vertragsstartdatum noch nicht feststeht. Künftig soll in diesem Fall die gewählte Laufzeit in Monaten erscheinen. Ist das Startdatum bekannt, bleibt die Anzeige des Zeitraums von Vertragsbeginn bis geplantem Vertragsende unverändert. Beim Sonderfall einer Änderung von Laufleistung oder Laufzeit, der noch nicht bestätigt ist, kann weiterhin „Noch nicht verfügbar" angezeigt werden, da die Laufzeit in diesem Ablauf möglicherweise noch geprüft wird.

Ebenfalls in Klärung (Refinement) befindet sich die Unterstützung der Massenanlage für alle Kundentypen.