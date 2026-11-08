# Batch 1254 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise Contract Calculation für das Benutzerhandbuch**

**Fahrzeugverwaltung und Technische Optionen**

Beim Anlegen einer TO-Gruppe (Technical Option Group) in der Fahrzeugverwaltung unter den Technischen Optionen bleibt die Schaltfläche zum Absenden so lange deaktiviert, bis alle Pflichtfelder ausgefüllt sind. Damit verhält sich das Formular wie der Rest der Anwendung, und die Validierung ist klarer. Die Fehlermeldung zur Gruppenbezeichnung bleibt unverändert.

Die Prüfung des Gruppennamens berücksichtigt nun auch die Division. Zuvor wurde beim Anlegen einer Gruppe für die Division Vans mit dem Namen „22“ die Fehlermeldung „Technical option group name 22 already exists“ ausgelöst, obwohl nur für die Division Passenger eine Gruppe mit diesem Namen existierte. Künftig gilt die Eindeutigkeit des Namens je Division.

Außerdem wurde die Listenansicht in der Fahrzeugverwaltung angepasst. Die Bezeichnungen in der Anwendung wurden vereinheitlicht: Statt „Dependency Definition“ lautet die Beschriftung nun „Cost Dependency“.

Beim Import aus CePro werden E-Performance-Fahrzeuge von AMG nun ebenfalls mit 4Matic berücksichtigt. Betroffen waren mehrere Baumuster, die fälschlich mit „Hybrid“ auf „true“ statt „false“ geführt wurden.

**Produkte, Preisversionen und Cluster**

Beim Anlegen eines Produkts mit einer Preisversion werden die Informationen auf den Registerkarten „Optional Coverages“ und „Technical Options“ so dargestellt, dass sie auf einen Blick erfassbar sind. Der seitliche Scrollbalken soll dadurch entfallen.

Wird in der Preisversion bei den Technischen Optionen für die Kostendefinition „No cost“ gewählt, erscheint die betreffende Reifen-Option nicht als gültige Auswahl im Dialog „Add TO Groups“. Gibt es beim Bearbeiten eines Clusters keine TO-Gruppen, die hinzugefügt werden können, wird statt eines leeren Dialogs die Meldung „There are no TO groups created which can be added to this cluster“ angezeigt.

**Vertragserstellung und Kilometerstände**

Rechnungen können nicht mehr mit einem tatsächlichen Kilometerstand erstellt werden, der unter dem zuletzt bekannten Kilometerstand liegt. Zudem sind Kilometerstände über 999.999 nicht zulässig, da sonst die Vertragserstellung blockiert würde.

**Kampagnenverwaltung**

Bei der Kampagnendefinition wurde die maximal zulässige Stellenzahl für Rabattbeträge von fünf auf sieben erhöht. Das gilt für den Rabatttyp „Fixed Amount“ im Feld „Amount“ sowie für den Rabatttyp „Percentage“ im Feld „Maximum Amount“. Damit sind nun auch Werte wie 10.000,47 oder 1.000.000 möglich.

Im Schritt „Manage Campaigns“ der Vertragserstellung werden Kampagnen, die für das gewählte Fahrzeugmodell oder die gewählte Kombination aus Laufleistung und Laufzeit den Preis nicht senken, nicht mehr zur manuellen Auswahl angeboten. Zuvor wurde beispielsweise eine Kampagne für das Modell CLA auch bei einem GLB angezeigt.

Für Kampagnen in der Nachlaufphase (Grace Period) ist nun mindestens die Aktion „Deactivate“ verfügbar, damit Marktnutzer eine Kampagne jederzeit vorzeitig beenden können. Bisher waren hier nur „View“ und „Duplicate“ möglich. Offen bleibt, wie mit noch offenen Anfragen zu Kampagnen in der Nachlaufphase umzugehen ist (vorgeschlagen wird die automatische Ablehnung) und ob auch „Edit“ angeboten werden soll.

Im zweiten Schritt der Kampagnenerstellung, in dem das rabattierte Produkt und die Fahrzeuggruppen ausgewählt werden, sind die Fahrzeuggruppen für alle Kampagnentypen alphabetisch aufsteigend sortiert. Dadurch lassen sich gesuchte Gruppen schneller finden.

Bei Sticker-Price-Kampagnen zeigt die Zusammenfassungsseite nur noch Fahrzeuggruppen an, für die in der Kampagne ein Rabatt konfiguriert wurde.

**Geplante Änderungen**

Für die Zukunft ist vorgesehen, Nutzer beim Bearbeiten von Produkten per Hinweis darauf aufmerksam zu machen, dass Änderungen, etwa an Kontingenten oder an den Mindest- und Höchstgrenzen für Reifen, die Preisgestaltung beeinflussen können. Vorgesehen ist eine doppelte Bestätigung mit dem Hinweis, dass die Aktion die aktuellen Preiseinstellungen beeinträchtigen kann. Zudem soll ein Punkt in der Preisgestaltung mit einem roten Warnzeichen markiert werden, wenn Minimal- und Maximalwerte nicht zusammenpassen.

Ebenfalls in Arbeit ist die Übermittlung der jährlichen Laufleistung an den Vertrag für den MBLD-Fall. Dieser Punkt befindet sich derzeit noch in der Testphase.