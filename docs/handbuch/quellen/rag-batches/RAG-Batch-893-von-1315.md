# Batch 893 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zusätzliche Prüfung (Additional Verification) bei der Vertragsaktivierung**

In manchen Märkten und Divisionen sind über die Systemprüfungen hinaus weitere Kontrollen erforderlich, die meist manuell und außerhalb des Systems stattfinden. Damit ein Vertrag erst aktiviert wird, wenn alle notwendigen Prüfungen bestanden sind (systemseitig und offline), lässt sich in den MO Checks eine zusätzliche, konfigurierbare Prüfung einrichten. Sie verhindert die automatische Aktivierung, bis die Offline-Prüfungen durchgeführt wurden und die Prüfung bestätigt wurde. Danach kann der Aktivierungsprozess fortgesetzt werden. Das Prinzip ähnelt der Prüfung auf Steuerbefreiung, die ebenfalls offline kontrolliert und anschließend validiert wird.

**Konfiguration**

Die Funktion wird von Benutzern mit der Rolle MPC unter Market Settings → Feature Settings → MO Checks aktiviert. Dort steht im Bereich „Perform Additional Checks“ der Schalter „Additional Verification“ zur Verfügung. Er ist standardmäßig ausgeschaltet und kann je Division getrennt eingestellt werden (Passenger Cars bzw. Vans). Ist der Schalter eingeschaltet, wird in den MO Checks ein zusätzlicher Validierungsschritt ergänzt. Ist er ausgeschaltet, hat die Funktion keine Auswirkungen, und die zusätzliche Prüfung wird bei der Aktivierung nicht berücksichtigt.

**Darstellung in den MO Checks**

In den MO Checks erscheint ein neuer Abschnitt „Additional Checks“, der immer am Ende der Liste steht. Er enthält das Feld „Additional Verification“. Bei eingeschaltetem Schalter hat dieses Feld den Status „Pending“, wird orange dargestellt und kann vom Benutzer bearbeitet, also bestätigt werden. Bei ausgeschaltetem Schalter lautet der Status „Not Applicable“; das Feld wird grau dargestellt und ist schreibgeschützt.

**Auswirkungen auf die Vertragsaktivierung**

Ist „Perform Additional Checks“ eingeschaltet, ist die zusätzliche Prüfung verpflichtend. Wird ein Vertrag angelegt, steht sie zunächst auf „Pending“, und die Aktivierung des Vertrags ist blockiert, bis die Prüfung ausdrücklich beantwortet wurde. Setzt der Benutzer den Wert auf „YES“, lautet der Status „OK“ und die Aktivierung ist zulässig, sofern alle übrigen Prüfungen ebenfalls in Ordnung sind. Setzt er den Wert auf „NO“, lautet der Status „Not OK“, und das System verhindert die Aktivierung. Ein Wechsel von „NO“ auf „YES“ ist möglich; der Status wird dann „OK“ und der Vertrag kann aktiviert werden.

Ist „Perform Additional Checks“ ausgeschaltet, wird die zusätzliche Prüfung beim Anlegen eines Vertrags automatisch auf „Not Applicable“ gesetzt, aus der Validierung ausgeschlossen und bei der Aktivierung nicht berücksichtigt.

Unabhängig von dieser Funktion gilt weiterhin die allgemeine Regel: Ist mindestens eine Validierungsprüfung als „Not OK“ gekennzeichnet, wird die Vertragsaktivierung blockiert, unabhängig vom Ergebnis der übrigen Prüfungen.

**Voraussetzungen**

Voraussetzung ist, dass die Marktkonfiguration die Einstellung je Division (Passenger Cars und Vans) unterstützt und das MO-Checks-Framework bereits in die Vertragsaktivierung integriert ist. Benutzer mit der Rolle MPC benötigen Zugriff auf die Marktkonfiguration sowie die Berechtigung, die MO Checks einzusehen und zu aktualisieren.