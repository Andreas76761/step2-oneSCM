# Batch 771 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 18 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverlängerung und Preisinformationen**

Bei der Vertragsverlängerung wurden mehrere Fehler behoben. Die Konfiguration einer Vertragsverlängerung bleibt nun erhalten, wenn Sie den Bereich „Übersicht und Bestätigung“ verlassen. Nach der Verlängerung eines Leasingvertrags stehen die Verkaufswerte des Vertrags wieder zur Verfügung. Außerdem wird eine Verlängerung in der Tabelle mit den Preisinformationen jetzt korrekt dargestellt. Wenn Sie bei der Vertragserstellung das Zahlungsintervall ändern, werden die Werte der Preistabelle entsprechend aktualisiert.

Auf der Vertragsdetailseite zeigen die detaillierten Preisinformationen nun zusätzlich den Preiscluster an. Oberhalb des Abschnitts „Technischer Tarif“ werden dazu die Spalten „Preisversion“ und „Preiscluster“ ergänzt. Für jeden Eintrag, etwa den Vertragsverkauf oder die einzelnen Verlängerungen, sind der Name der Preisversion und der Name des Preisclusters sichtbar.

**Abschluss und Beendigung von Verträgen**

Ein Vertrag lässt sich nun auch dann ablaufen lassen bzw. schließen, wenn die Review-Zahlung 0 beträgt. Zuvor war dies nicht möglich, obwohl die Mail zum Vertragsende ausgelöst wurde. Nach dem Lauf des Schedulers wird der Status eines Vertrags auf „abgelaufen“ gesetzt, sofern das geplante Vertragsende und das tatsächliche Vertragsende in der Vergangenheit liegen und entweder kein Review-Profil existiert oder kein Review erforderlich ist. Zudem können Verträge, die über eine Sonderfallanfrage angelegt wurden, jetzt gekündigt werden.

**Versand von E-Mails**

Die Schaltfläche „E-Mail senden“ wird nicht mehr ausschließlich dann aktiviert, wenn das Kontrollkästchen „Alle auswählen“ gesetzt wurde.

**Schnittstelle i155 und Branchenschlüssel**

Die Branchenschlüssel werden nicht mehr über die Schnittstelle i155 an VEGA übermittelt. Die entsprechende Position im Satz RC05 (Stellen 266–269) bleibt leer.

**Zahlungsreferenz im Vertragsdatenmodell**

Neu ist das optionale Feld „Zahlungsreferenz“ auf Vertragsebene. Großkunden können damit eine interne Zahlungsreferenz hinterlegen, die auf den von MB ausgestellten Rechnungen gedruckt werden soll. Das soll die Rechnungsweiterleitung und -abwicklung effizienter und schneller machen. Die Funktion gilt nur für Geschäftskunden und für alle Divisionen sowie alle bei der Angebotserstellung verwendeten Identifikatoren. Bei Privatkunden ist die Erfassung einer Zahlungsreferenz nicht untersagt, aber unüblich.

Das Feld befindet sich in der Vertragsdetailansicht auf dem Reiter „Zahlung“. Der Standardwert ist „-“. Erlaubt sind maximal 36 alphanumerische Zeichen sowie die Sonderzeichen „-“ und „_“. Eine Eindeutigkeit ist nicht erforderlich. Gibt jemand mehr als 36 Zeichen oder nicht unterstützte Zeichen ein, wird die Eingabe abgelehnt und eine Validierungsmeldung angezeigt.

Bearbeiten dürfen die Zahlungsreferenz ausschließlich Nutzer der Marktorganisation (MO). Für alle anderen Nutzer ist das Feld schreibgeschützt. Solange der Vertrag den Status „Wartet auf Bestätigung“ hat, öffnet ein MO-Nutzer den Servicevertrag, wechselt auf den Reiter „Zahlung“ und wählt „Bearbeiten“. Er trägt die Zahlungsreferenz ein oder ändert sie, gibt einen verpflichtenden Änderungsgrund an und speichert. Danach wird der Aktivierungsprozess des Vertrags fortgesetzt. Bei der Aktivierung wird die i155 erzeugt, und die Vertragsdaten werden an Nemesis und an Revenue übermittelt.

Auch nach der Aktivierung kann ein MO-Nutzer die Zahlungsreferenz über „Bearbeiten“ auf dem Reiter „Zahlung“ ändern. Beim Speichern fragt das System nach einem Änderungsgrund und speichert Benutzer-ID, Datum und Uhrzeit sowie den Änderungsgrund.

Auch über die API wird die Zahlungsreferenz unterstützt. Sie kann als optionaler Parameter in den Anfragen POST /contract/v1/leasing, PUT /contract/v1/leasing und POST /contract/v1/online-sales mitgegeben werden. Bei GET /contract/v1/ wird sie als Teil der Vertragsdaten zurückgegeben. Der übergebene Wert wird gespeichert und in der Antwort ausgegeben.

**Übersetzungen**

Die Statusbezeichnungen „Vorzeitig beendet“ und „Abgelaufen“ wurden in der Benutzeroberfläche fehlerhaft übersetzt. Dies wurde korrigiert.