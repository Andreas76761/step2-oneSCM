# Batch 591 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Anbindung an das Finanzsystem CoFiCo (Slowakei)**

oneSCM unterstützt die Anlage und Synchronisierung von Kundendaten mit dem Finanzsystem CoFiCo, das in der Slowakei und weiteren europäischen Märkten eingesetzt wird. Die Lösung basiert auf derselben Struktur, die bereits für die SWT-Anbindung entwickelt wurde, und kann von jedem Markt genutzt werden, in dem oneSCM eingeführt wird. Sie dient dazu, Kundendaten automatisch mit dem Finanzsystem abzugleichen und die relevanten Attribute aus diesem System abzurufen. Dazu gehören insbesondere die SAP-Debitorennummer, der Status des Kunden und weitere Kundendetails. Die Debitorennummer ist die Grundlage für nachfolgende Prozesse im gesamten Lebenszyklus eines Servicevertrags, beispielsweise die Rechnungsstellung. Ein Lastschriftcode (Direct Debit Code) wird für den slowakischen Markt nicht benötigt; die SEPA-Behandlung wird erst umgesetzt, wenn ein neuer Markt sie erfordert.

**Kundenanlage und Ablauf**

Meldet sich ein Benutzer aus der Slowakei an (die Anmeldung erfolgt über die ALICE-API), wird der dafür vorgesehene Ablauf für den slowakischen Markt aktiviert. Dieser umfasst die angepassten Eingabefelder, die Verbindung zum Finanzsystem CoFiCo sowie die Nutzung der Google-API, um vollständige Adressdaten einschließlich der Region abzuleiten. In der Kundenverwaltung können Kunden der Typen privat, gewerblich, gewerblicher Fuhrpark, privat-staatlich und gewerblich-staatlich angelegt werden.

Für private und privat-staatliche Kunden steht unter den Adressdaten das neue Feld „Region“ zur Verfügung (Zeichenfolge, maximal 35 Stellen, aus der Google-API übernommen). Unter „Steuer- und Rechtsdaten“ gibt es zudem das Feld „Personal ID“ (alphanumerisch, 15 Stellen, Sonderzeichen wie „/“ möglich). Ob dieses Feld Pflicht- oder optionales Feld ist, richtet sich nach den Markteinstellungen: Ist es dort aktiviert, wird es in der Oberfläche angezeigt, andernfalls ist es ausgeblendet. Als Zahlungsart steht die Kreditkarte zur Verfügung. Für gewerbliche Kunden, gewerbliche Fuhrparkkunden und gewerblich-staatliche Kunden gibt es ebenfalls das Feld „Region“ sowie die Zahlungsart Kreditkarte.

**Statusverlauf und Datenübertragung**

Die Übertragung der Daten an das Finanzsystem wird über die Schaltfläche „Erstellen“ in der Kundenverwaltung ausgelöst. Zunächst hat der Kunde den Status „Temporär“, in dem Änderungen erlaubt sind. Während der Synchronisierung mit CoFiCo lautet der Status „In Bestätigung“, und Änderungen sind nicht möglich. Sobald die SAP-Daten vorliegen und mindestens ein Servicevertrag des Kunden aktiv ist, wechselt der Status auf „Aktiv“; Änderungen sind dann wieder erlaubt. Werden Daten eines aktiven Kunden geändert, wird automatisch eine Aktualisierung an CoFiCo gesendet, wobei auch die oneSCM-ID mitgeliefert wird.

**Technischer Datenaustausch**

Für einen neuen Kunden sendet oneSCM eine POST-Anfrage an CoFiCo. Auch bei Änderungen an bestehenden Kunden wird eine POST-Anfrage mit derselben CMD-Struktur verwendet. Nach der Anlage oder Aktualisierung im Finanzsystem sendet CoFiCo über eine ausgehende Schnittstelle („Outbound IF“) eine Antwort in derselben Dateistruktur an oneSCM zurück, die dort verarbeitet wird. Die dabei erhaltene SAP-Debitorennummer wird gespeichert. Für Kundenanlage und Kundenaktualisierung (mit Kundencode) wird jeweils eine JSON-Datei erzeugt.

In der Datenstruktur der Anfrage wurde zudem ein neues Feld „Währung“ ergänzt. Es steht am Ende der Struktur, entsprechend der Reihenfolge in der CMD-Datei, und wird mit dem Währungswert aus der Marktkonfiguration befüllt.