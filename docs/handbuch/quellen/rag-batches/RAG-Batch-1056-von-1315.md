# Batch 1056 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 26 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation: Testumfang und Funktionen im Überblick**

Im Bereich Contract Generation wurden die Funktionen in Testplänen für Sprint 5.2 zusammengefasst, die von den Teams „Explorers" und „Brabus" verantwortet werden. Der Testumfang richtet sich nach den Funktionen, die zu Beginn des Sprints geplant sind. Da eine geplante Funktion nicht zwangsläufig im selben Sprint fertiggestellt wird, wird der Testumfang während des Sprints angepasst und am Ende anhand der Epics festgelegt, die im Sprint abgeschlossen und auf der Entwicklungsumgebung (DEV) bereitgestellt wurden. Die Testfälle werden in xRay geschrieben und vor dem Erreichen der Integrationsumgebung (INT) manuell ausgeführt. Fehler werden erfasst und in der DEV-Umgebung durch Nachtests bestätigt. Fehlgeschlagene Schritte werden erneut ausgeführt und entweder als bestanden bestätigt oder zumindest als Fehler klar dokumentiert und besprochen, bevor in die INT-Umgebung übernommen wird.

Zum Testumfang gehören unter anderem die Prüfung notwendiger Operationen anhand der Organisations-ID, der Baumuster-Ablauf, das Bearbeiten von Vertragsdaten im Status „Waiting for Activation", der Statuswechsel von „DSS_Created" nach „Confirmed", die Entkopplung der Produktauswahl von der Vertragserstellung anhand von Kundentyp und Identifikator, das unverbindliche Angebot in der Produktauswahl (Drucken oder Versand per E-Mail) sowie die Startseite zum Anlegen eines Vertrags. Manuelle Testausführungen betreffen außerdem zusätzliche Filteroptionen in der Produktauswahl, den Abruf von Produkten und Preisen pro Kilometer, den Ablauf „Build to Order", den Ablauf vom Fahrzeugidentifikator zur Vertragserstellung, das Auslösen von DSS sowie den Abruf des Kilometerstands aus MIC und VEGA.

**Verträge für Geschäftskunden**

Händler sowie Nutzer der Market Operations (MO) und des MPC können Verträge für Geschäftskunden (B2B) mit denselben Identifikatoren anlegen wie für Privatkunden. Ebenso können sie Händlerrabatte und Marktkampagnen auf Verträge für Geschäftskunden anwenden, wie es bei Privatkunden möglich ist. Schlägt die Prüfung der Umsatzsteuer-Identifikationsnummer fehl, kann ein Vertrag nicht automatisch aktiviert werden.

**Bestätigung und DSS-Signatur**

Ein erzeugter Vertrag bleibt so lange im Status „Waiting for Confirmation", bis die DSS-Signatur bestätigt wurde. Auf der Startseite der Vertragserstellung wird der Vertrag zunächst mit dem Status „CREATED" aufgeführt. Wird die DSS-Signatur nicht innerhalb der für den DSS-Markt geltenden Wartezeit bestätigt, wird der Vertrag abgelehnt.

**Kilometerstand**

Geben Händler oder MO-Nutzer eine Fahrgestellnummer ein, wird der Kilometerstand automatisch abgerufen. Sie können außerdem einen Kilometerstand manuell eingeben und mit der Vertragserstellung fortfahren, ohne dass geprüft wird, ob der Wert der Realität entspricht. Geben sie jedoch manuell einen Wert ein, der kleiner ist als der zuvor erfasste Wert, erscheint eine Fehlermeldung.

**Vertragserstellung mit Identifikatoren und ISP**

Händler und MO-Nutzer können Verträge über Fahrgestellnummer, Auftragsnummer, Deal-ID oder Baumuster anlegen. Hat der verwendete Identifikator keinen ISP, wird nach der Eingabe die Produktliste ohne Hinweis angezeigt. Nach der Auswahl eines beliebigen Produkts läuft die Vertragserstellung wie gewohnt weiter. Hat der Identifikator (Fahrgestellnummer, Auftragsnummer oder Deal-ID) einen bestimmten ISP, wird die Produktliste aus Stream 1 mit einer Informationsmeldung angezeigt. Auch hier können Nutzer nach der Produktauswahl normal fortfahren. Wird ein Vertrag über ein Baumuster angelegt, das möglicherweise einen ISP hat, erscheint die Produktliste mit einer Warnmeldung, und die Vertragserstellung kann ebenfalls wie gewohnt fortgesetzt werden.

**Ablauf bis zum Status „Confirmed"**

Händler und MO-Nutzer können einen Vertrag über eine Deal-ID oder Auftragsnummer starten, Produkte auswählen und konfigurieren, Kundendaten erfassen, den Vertrag bestätigen und so den Status „Confirmed" erreichen.

**Übersicht und Bestätigung bei fehlenden Daten**

Fehlen die Fahrgestellnummer oder FRD-bezogene Daten, unterscheidet sich die Ansicht in Übersicht und Bestätigung für Händler und Market Operations. Felder, die wegen fehlender Fahrgestellnummer, FED, fehlendem Kilometerstand, fehlender geplanter Vertragslaufzeit oder fehlendem Vertragsbeginn nicht erfasst werden können, werden dann nicht mit Werten dargestellt.