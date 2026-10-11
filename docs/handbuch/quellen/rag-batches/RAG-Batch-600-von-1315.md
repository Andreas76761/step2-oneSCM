# Batch 600 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Unterstützung neuer Märkte**

oneSCM unterstützt die Anbindung neuer Märkte jetzt generisch. Bisher mussten für jeden neu integrierten Markt neue Werte in den Datenstrukturen für Marktcodes und Sprachcodes ergänzt werden. Das ist nicht mehr nötig. Für Nutzerinnen und Nutzer eines neuen Marktes stehen in der Dokumentenverwaltung, im Kundenbereich, in der Benachrichtigung und im Customer-Self-Service Listen aller möglichen Märkte und Sprachen zur Verfügung. Konfigurationen werden marktspezifisch geladen, Kundennummern werden je Markt validiert, und das Finanzsystem wird aus den Markteinstellungen ermittelt. Dokumente werden im Speicher nach Märkten gruppiert, und Vorlagen lassen sich nach Markt filtern. Daten wie neue Vorlagen oder neue Kunden können in den genannten Bereichen angelegt werden, ohne dass dafür Codeänderungen erforderlich sind.

**Geplante Anpassungen für den Markt MBIL**

Für den Markt MBIL sind weitere Anpassungen vorgesehen, die sich noch in Planung befinden oder noch nicht umgesetzt sind.

Datenschutzerklärung: Bisher öffnet sich nach einem Klick auf den Link „Datenschutzerklärung" in der Fußzeile von oneSCM ein Dokument auf dem Bildschirm. Dafür müssen die Marktverantwortlichen bei der Ersteinrichtung des Marktes die marktspezifischen Datenschutzdokumente hochladen. Künftig soll der Link stattdessen auf die marktspezifische Datenschutzseite von Mercedes-Benz weiterleiten. Für MBIL ist das die Seite https://www.mercedes-benz.co.in/passengercars/content-pool/tool-pages/legal/privacy-statement.html.

Suche nach Geschäftskunden: In der Kundenverwaltung kann bei Geschäftskunden bisher über die Umsatzsteuer-Identifikationsnummer (VAT ID) gesucht werden. Da diese im Markt MBIL nicht verwendet wird, soll der Suchfilter dort auf die GST-Nummer umgestellt werden. Bei einer Suche mit einer GST-Nummer sollen alle Kunden mit derselben GST angezeigt werden.

Prüfung auf Kundendubletten: Die bestehende Unscharfsuche (Fuzzy-Logik) zur Vermeidung von Dubletten soll um MBIL-spezifische Merkmale erweitert werden. Bei Geschäftskunden treten PAN und GST an die Stelle von Umsatzsteuer-Identifikationsnummer bzw. Steuernummer. Zusätzlich wird das Attribut Region berücksichtigt, da die Region Teil der Adresse ist. Die Dublettenprüfung berücksichtigt dabei ausschließlich die GST und verlangt eine exakte Übereinstimmung. Möchte ein bestehender Kunde mit GST 123XXX in Maharashtra für einen zweiten Servicevertrag einen Standort in Neu-Delhi hinterlegen, muss er eine andere GST-Nummer (z. B. 456XXX) angeben. Da diese abweicht, wird in oneSCM ein neuer Kunde angelegt und per Anlage-Anfrage (POST) an SWT übermittelt.

Ändert ein bestehender Kunde mit GST 123 lediglich seine Adresse nach Neu-Delhi, erlaubt oneSCM die Bearbeitung von GST und Adresse und sendet eine Aktualisierungsanfrage (POST) an SWT. Da das Buchhaltungssystem Änderungen am Feld der Steuernummer wie der GST nicht zulässt, wird in SWT ein neuer Kunde angelegt, und die neue SAP-Nummer wird als Antwort zur selben oneSCM-Nummer an oneSCM zurückgemeldet. Die GST ist dabei ein Pflichtfeld und kann vom MO-Benutzer bearbeitet werden. Die SAP-Debitorennummer wird automatisch anhand der SWT-Antwort aktualisiert.

Bei Privatkunden erfolgt die Dublettenprüfung anhand der PAN, die ein Pflichtfeld und eindeutig ist. Die Änderungen an der Fuzzy-Logik gelten auch für den Vertragsübertragungsprozess.

Beim Erzeugen eines Vertrags für einen neuen Privat-, Geschäfts- oder Flottenkunden sowie bei der Vertragsübertragung auf einen neuen Kunden zeigt das System den Kundendialog an, wenn Treffer in der Datenbank gefunden werden. Wählt der Benutzer einen Treffer aus, werden die Kundendaten vorausgefüllt. Wird kein passender Datensatz gefunden und werden PAN oder GST und Region eines bereits in oneSCM vorhandenen Kunden eingetragen, gibt das System auf der Seite zur Kundenanlage die Fehlermeldung „An Account with name & contact details already exists" aus.