# Batch 1089 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation: Neuerungen und Änderungen**

**Preisermittlung bei Produktaktualisierung und Neukonfiguration**
Bei einer Aktualisierung oder Neukonfiguration eines Produkts kann das System die Produktkonfiguration nun mit den Preisangeboten neu berechnen, die zum Zeitpunkt der ursprünglichen Vertragserstellung gültig waren. Dadurch bleibt die Preisgestaltung über die gesamte Vertragslaufzeit konsistent. Die Anfrage für verfügbare Leasingprodukte enthält dafür ein optionales Feld für die Vertragsnummer. Wird eine Anfrage mit Vertragsnummer gestellt, ermittelt das System anhand dieser Nummer das Erstellungsdatum des Vertrags und verwendet es als Preisdatum für die Berechnung. Wird zum Beispiel für einen Vertrag, der am 15.03.2026 erstellt wurde, eine Neukonfiguration angefordert, basiert die Berechnung auf den Preisen vom 15.03.2026. Existiert zur angegebenen Vertragsnummer kein Vertrag, antwortet das System mit dem Hinweis „Contract not found“ (HTTP 404).

**Dokumenten-Upload**
Die Upload-Funktion für Dokumente soll um weitere Dokumenttypen erweitert werden. Für Angebote (vor der Aktivierung) kommt der Handelsregisterauszug hinzu. Für Verträge (nach der Aktivierung) kommen der Nachweis über den Fahrzeugverkauf, die Totalschadenbestätigung und die Sterbeurkunde hinzu. Für alle neuen Dokumenttypen gilt dieselbe Lösch- und Ersetzungslogik wie für andere optionale Dokumente. Diese Erweiterung befindet sich derzeit im Dev-Backlog.

**Signaturmethoden in den Markteinstellungen**
Unter „Markteinstellungen > Feature-Einstellungen > Signaturen“ können Marktnutzer künftig alle drei Signaturoptionen aktivieren oder deaktivieren, also „Digital vor Ort“, „Digital per E-Mail (Remote)“ und „Gedruckt“. Bisher konnte nur die manuelle Druckvariante abgeschaltet werden, während beide digitalen Varianten fest aktiviert waren. Die Einstellung ist weiterhin für beide Divisionen getrennt konfigurierbar. Gespeichert werden kann nur, wenn mindestens eine Signaturoption aktiviert bleibt. In der Vertragserstellung stehen nur die in den Markteinstellungen aktivierten Optionen zur Verfügung. Bei der Vertragsverlängerung gilt: Ist die digitale Remote-Signatur aktiviert, wird ausschließlich diese angeboten. Andernfalls greift ein Ausweichprozess, bei dem der Nutzer des Marktbetriebs das Dokument herunterlädt, per E-Mail an den Kunden sendet und das unterschriebene Dokument anschließend im Reiter „Dokumente“ hochlädt.

**Felder und Platzhalter in Vertragsdokumenten**
Für Verträge mit Gewerbekunden werden im Bereich der Kundeninformationen nun die Platzhalter korrekt übergeben. Die bestehenden Platzhalter heißen jetzt „contactMobileNumber“ und „commercialVatId“. Zusätzlich wird die Rechtsform von Gewerbekunden übermittelt.

Außerdem wurden die deutschen Bezeichnungen der Druckvariablen „contractExpiry“ und „contractExpiryAfterProlongation“ angepasst. „Zeit- oder Kilometerstand“ heißt nun „Laufzeit oder Laufleistung“, und „Zeit“ heißt nun „Laufzeit“.

**Angebotserstellung und Konfiguration**
Bei Reifenprodukten enthält die Auswahlliste für die Felgen vorübergehend nur noch die Option „Nicht enthalten“. Dies ist eine Übergangslösung, bis die dafür vorgesehenen weiteren Anpassungen vollständig umgesetzt sind.

Als Änderungswunsch ist vorgesehen, dass die FIN/VIN bei der Angebotserstellung automatisch in Großbuchstaben umgewandelt wird. Bisher werden bei Eingabe in Kleinbuchstaben keine Produkte angezeigt, bei Großbuchstaben dagegen schon. Diese Änderung befindet sich im Dev-Backlog.

Offen ist zudem der Vorschlag, bei Händlerrabatten zusätzlich ein Feld für die prozentuale Eingabe anzubieten. Wird es verwendet, soll der absolute Betrag im Frontend automatisch berechnet und aktualisiert werden. Der Vorschlag beruht auf Rückmeldungen aus dem Markt ImSu.

**Preisinformationen und Kampagnen**
In der Zahlungsinformation werden Wert und Name von Auto-Apply- und Sticker-Price-Kampagnen wieder angezeigt. Zuvor erschienen sie dort nicht mehr, weil das Brabus-Team die Übernahme der Kampagneninformationen aus dem Produkt an die geänderte Umsetzung anpassen musste.

**Sonderfälle**
In der Detailansicht eines Sonderfalls werden zusätzliche Informationen zum zugehörigen Vertrag angezeigt: Produktname, Vertragsbeginn (falls vorhanden), geplantes Vertragsende (falls vorhanden), Vertragsdauer (geplant), jährliche Fahrleistung und geplante Gesamtlaufleistung.

**Marktbetriebsprüfung und Angebotsverwaltung**
In der Übersicht der Marktbetriebsprüfung lautet die deutsche Bezeichnung nun „Mandatsreferenz“ statt „Lastschriftcode“.

In der Angebotsverwaltung funktionieren die Filter für Angebotsgültigkeit, Erstellungsdatum und Aktivierungsdatum jetzt auch dann, wenn nur ein „Von“- oder nur ein „Bis“-Datum angegeben wird. Zuvor mussten beide Werte eingegeben werden, damit passende Verträge angezeigt wurden.