# Batch 1092 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

**Preise, Rabatte und Kampagnen**

Bei vollständig subventionierten Verträgen, bei denen der Kunde nichts bezahlen muss, wird das Zahlungsintervall automatisch auf „einmalig“ (OneTime) gesetzt, und die Anzahl der Rechnungen beträgt 0. Als vollständig subventioniert gelten Verträge, bei denen die Summe aus Kampagnen- und Händlerrabatten dem Vertragspreis entspricht.

Im Schritt „Rabatte“ der Vertragserstellung war bisher ein Händlerrabatt nur möglich, wenn eine verfügbare Kampagne ohne automatische Anwendung („Auto Apply“ = false) zuvor ausgewählt wurde. Solche Kampagnen, etwa Verkaufssubventionen, haben teils komplexe Voraussetzungen, die oneSCM nicht automatisch prüfen kann. Deshalb muss die Verkaufsperson selbst entscheiden, ob die Kampagne für das Fahrzeug des Kunden angewendet werden darf. Darf sie die Kampagne nicht auswählen, konnte bisher auch kein Händlerrabatt gewährt werden. Diese Abhängigkeit wurde entfernt. Entsprechendes gilt für das Zusammenspiel von Kampagnen und Sonderfällen: Auch wenn eine Kampagne nicht angewendet werden darf, kann ein Sonderfall beantragt werden.

Die Preisinformation steht nun auch zur Verfügung, wenn die Verkaufsperson das Produkt über einen Baumuster-Code (Model Code) oder eine Deal-ID konfiguriert. Zuvor war diese Funktion am Ende des Konfigurationsassistenten deaktiviert; jetzt ist sie aktiviert und nutzbar.

Zu den Preisen optionaler Deckungen wurde festgelegt, dass diese ohne Mehrwertsteuer (netto) geführt werden. Auf der Oberfläche soll künftig klar erkennbar sein, ob ein Preis inklusive oder exklusive Mehrwertsteuer angezeigt wird.

**Massenanlage von Verträgen**

Wenn mehrere Serviceverträge im Rahmen der Massenanlage erstellt werden, erscheinen passende Hinweismeldungen (Toast-Meldungen). Nach der Erstellung wird mitgeteilt, dass die Angebote erfolgreich angelegt wurden. Nach dem Auslösen der Signatur erscheint die Meldung, dass der Signaturprozess für die Angebote der jeweiligen Gruppen-ID gestartet wurde.

Die Bestätigung von Prüfungen ist an die aktive Bestätigungsfunktion (Active Acknowledgement) angepasst. Fahrzeugbezogene Prüfungen werden für jedes Fahrzeug getrennt behandelt. Preis, Produkt, Kunde, Dokumente und Händler werden dagegen für alle Verträge, die zur selben Massenanlage-Deal-ID gehören, einheitlich gesetzt. Bestätigt der zuständige Mitarbeiter (MO) eine Prüfung aus diesen Kategorien, wird dieser Status auf alle Verträge derselben Gruppen-ID übertragen. Wird zum Beispiel die Branche für einen Vertrag bestätigt, gilt sie für alle Verträge der Gruppe als bestätigt.

**Dokumente und Schnittstellen**

Bei Verträgen, die mit einer Deal-ID als Angebot angelegt wurden, werden beim Erreichen des Status „Created“ nun zwei Informationen an den Dokumenten-Microservice übergeben: der Wert der Deal-ID und, sofern vorhanden, die Fahrgestellnummer. Zuvor wurde nur die Fahrgestellnummer übermittelt.

Bei Reifenprodukten werden die Wetterprofile in der Schnittstelle i155 jetzt auf Deutsch ausgegeben. Dabei gelten die Übersetzungen „Sommer“, „Sommer/Winter“ und „Allwetter“.

**Oberfläche**

Die deutschen Übersetzungen der Benutzeroberfläche für den deutschen Markt wurden gemäß einem bereitgestellten Dokument mit Screenshots und den neuen Bezeichnungen korrigiert.

**Nicht umgesetzte Vorhaben**

Folgende Anpassungen wurden geprüft, aber abgebrochen und sind daher nicht Bestandteil des aktuellen Funktionsumfangs: die automatische Aktivierung eines Vertrags, sobald alle MO-Prüfungen in Ordnung sind (die Aktivierung erfolgt weiterhin manuell), die neue Behandlung optionaler Deckungen in der Vertragserstellung (sie werden weiterhin angezeigt und sind auswählbar, auch wenn sie keinen Preis haben) sowie die Korrektur eines Problems bei der Identifikator-Validierung in der Massenanlage, bei dem nach der Anpassung eines nicht passenden Kilometerstands keine erneute Validierung möglich war.