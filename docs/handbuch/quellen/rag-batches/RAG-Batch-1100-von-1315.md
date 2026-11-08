# Batch 1100 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

**Angebotsverwaltung und Profil**

In der Angebotsverwaltung wurde die Position der Funktion „Signatur erneut anstoßen“ angepasst. Die Schaltfläche befindet sich nicht mehr direkt in der Spalte „Aktion“. Stattdessen zeigt diese Spalte nun drei Punkte („…“) an. Ein Klick darauf öffnet ein Auswahlmenü mit den Aktionen, die für das Angebot ausgeführt werden können. Derzeit enthält dieses Menü nur die Aktion „Retrigger Signature“. In den Profileinstellungen wird das Feld „Adresse“ außerdem vollständig ausgeblendet, wenn für den Benutzer keine Adressdaten vorliegen. Bei der Abfrage verfügbarer Produkte wird der Markt (marketTenant) nicht mehr gesondert übermittelt, da er bereits im Header enthalten ist. Die Produktversion wurde erhöht, damit nun auch die Produktlinie Van berücksichtigt wird.

**Technische Optionen**

Die bisherige Bezeichnung „Technical Coverages“ wurde durchgängig in „Technical Options“ (technische Optionen) umbenannt. Dies betrifft die Preisübersicht, die Angebotsvorschau unter „Overview and Confirmation“ sowie die Platzhalter für Vertragsdokumente. Aus „technicalCoverages“ wurde „technicalOptions“, aus „contractTechnicalCoverages“ wurde „contractTechnicalOptions“ und aus „contractTechnicalCoveragesAfterProlongation“ wurde „contractTechnicalOptionsAfterProlongation“.

Wird ein Vertragsangebot über Fahrgestell- bzw. Bestellnummer angelegt, zeigt die Preisübersicht enthaltene technische Optionen ohne Preise an. In der Angebotsvorschau werden die Preise der technischen Optionen ebenfalls nicht angezeigt.

Beim Ablauf über das Baumuster werden Produktdauer, Laufleistung und Zahlungsintervall konfiguriert. Anschließend können technische Optionen hinzugefügt werden. Das dazugehörige Fenster listet die möglichen Optionen ohne Preise auf. Sobald eine oder mehrere Optionen ausgewählt werden, wird der Produktpreis entsprechend aktualisiert. Im Reiter „Technical Options“ werden Informationen zur Deckung angezeigt, jedoch keine Preise. Sobald eine Kennung (Fahrgestellnummer oder Baumuster) eingegeben wurde, wird geprüft, ob bereits technische Optionen vorhanden sind. Ist das der Fall, können technische Optionen vorerst nicht mehr hinzugefügt oder entfernt werden.

**Reifeninformationen**

Wird ein Reifenprodukt gewählt und wurde als Kennung die Fahrgestell- oder Bestellnummer verwendet, erscheinen Reifengröße und Reifentyp nicht mehr unter den technischen Optionen, sondern im Abschnitt „Technical Specification“ an derselben Position. Der Reiter „Technical Options“ wird deaktiviert, wenn keine technischen Optionen hinzugefügt wurden. Reifengröße und Reifeninformationen erscheinen außerdem als „Technical Specification“ im Preisangebot. In der Auswahlliste für die Reifenanzahl lautet die Beschriftung nun „Number of Tires*“ statt „Number of Tire Sets*“.

**Schnittstelle i155**

Die Abdeckungen in der i155-Schnittstelle wurden für Reifen- und Kontingentprodukte angepasst. Hat ein Produkt die Produktlinie „Tires“, werden Deckungen der Kategorie „BASE“, die als Kontingent geltend gemacht werden können, mit der Anzahl der enthaltenen Reifen im Satz RC20 übermittelt. Bei Deckungen der Kategorie „OPTIONAL“, die nach „Duration and Mileage“ (Dauer und Laufleistung) geltend gemacht werden können, wird RC20 entsprechend als „Duration and Mileage“ konfiguriert. Die Positionen 165 bis 169 sowie 170 bis 174 von RC20 werden dabei jeweils mit „00000“ belegt.

**Aktivierung von Verträgen und MO-Prüfung**

Die automatische Aktivierung von Serviceverträgen wurde vorübergehend deaktiviert. Auch wenn alle Prüfungen auf Vertragsebene erfolgreich sind, wird ein Vertrag nicht mehr automatisch aktiviert. Die Aktivierung ist nur manuell möglich. Verträge bleiben so lange im Status „Waiting for Activation“, bis MO/MPC sie manuell aktiviert.

Zusätzlich wurde ein täglich laufender Scheduler eingerichtet. Er aktiviert automatisch Verträge im Status „Waiting for Activation“, deren Verifizierungsstatus „OK“ ist. Verträge, bei denen in den MO-Prüfungen noch Positionen auf „NOK“ stehen, werden nicht automatisch aktiviert.

Für Serviceverträge mit gewerblichen Kunden wird in der MO-Prüfung standardmäßig eine neue Position gesetzt. Sie liegt im Abschnitt „Customer Check“, trägt die Bezeichnung „Industry“, hat den Standardstatus „NOK“ und den Grund „Check Industry“. Hintergrund ist, dass das Branchenkonzept noch nicht vollständig entwickelt und freigegeben ist. Bei einem „NOK“ in dieser Position ist nur die manuelle Aktivierung zulässig, auch wenn die Prüfung auf „NOK“ steht. Eine automatische Aktivierung ist nicht erlaubt.

**Kennzeichenprüfung**

Das Kennzeichen wird nur noch im Ablauf zur Erstellung mit verfügbarer Fahrgestellnummer validiert.