# Batch 654 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Pflichtfelder bei der Erfassung von Kunden- und Zahlungsinformationen**

Auf der Seite „Customer & Payment" werden alle Pflichtfelder künftig mit einem Sternchen (*) gekennzeichnet. Die Schaltfläche „Weiter" ist von Anfang an aktiv. Wird sie gedrückt, obwohl noch nicht alle Pflichtfelder ausgefüllt sind, werden alle nicht ausgefüllten Pflichtfelder hervorgehoben. Unter jedem betroffenen Feld erscheint die Fehlermeldung „This field is mandatory. Please enter valid content". Solange nicht alle Pflichtfelder korrekt ausgefüllt sind, gelangen Sie nicht weiter zur Übersicht und Bestätigung. Dies gilt für Händler, MPC-Nutzer und Endkunden, die den Vorgang über eine Drittanbieter-App durchführen. Sind alle Pflichtfelder korrekt ausgefüllt und validiert, werden beim Klick auf „Weiter" nacheinander folgende Schritte ausgelöst: Alle automatisierten Prüfungen werden durchgeführt, eine Vertragsnummer wird vergeben, der Vertrag und der Kunde werden angelegt, und der Zahlungsplan für den Vertrag wird über das Revenue-System abgerufen.

**Adressvalidierung bei der Vertragserstellung**

Sobald die Pflichtfelder der Adresse im Vertragsassistenten ausgefüllt sind, werden sie über die Domäne Customer & Partner Management mithilfe der Google-API geprüft. Die Schaltfläche „Weiter", die die Vertragserstellung auslöst, wird erst aktiviert, wenn die Pflichtfelder der Adresse validiert sind. Bei der Prüfung gelten folgende Regeln: Ist die Postleitzahl nicht plausibel, erscheint die Meldung „Please insert a valid Post Code". Ist der Ort nicht gültig, wird „Please insert a valid City" angezeigt. Bei einem nicht plausiblen Straßennamen lautet die Meldung „Please insert a valid Street name". In allen drei Fällen bleibt „Weiter" deaktiviert, bis das Feld gültig ist. Ist die Hausnummer plausibel, werden Sie in einem Pop-up gebeten, die Hausnummer zu bestätigen („Please confirm the House Number"), und können „Ja" oder „Nein" wählen. Bei „Ja" wird der eingegebene Wert gespeichert und als gültig betrachtet. Bei „Nein" erscheint die Meldung „Please insert a valid House Number", und „Weiter" bleibt deaktiviert. Dabei werden Ihnen Vorschläge angezeigt, die Sie aktiv bestätigen oder umsetzen müssen.

Wird die Kundenadresse geändert, nachdem der Vertrag erstellt und die Vertragsnummer vergeben wurde, aber bevor der Vertrag auf den Status „Bestätigt" gesetzt wird, wird die Adressvalidierung erneut durchgeführt. Die neuen Daten überschreiben dabei die bestehenden Daten.

**Globale Sammelrechnung im Vertragsassistenten**

Wenn Sie einen Vertrag für einen neuen Kunden erstellen und in Schritt 3 des Assistenten über die Zurück-Schaltfläche zu Schritt 2 wechseln, lässt sich die globale Sammelrechnung weiterhin bearbeiten. Sie können den Schalter an dieser Stelle ändern, ohne in die Kundenverwaltung wechseln zu müssen, da der Vertrag noch nicht bestätigt wurde. Auch der Hinweistext zum Schalter für die globale Sammelrechnung im Bereich „Präferenzen" in Schritt 2 wurde für neue Kunden angepasst.

Wenn Sie hingegen einen neuen Servicevertrag für einen bestehenden Kunden anlegen, kann die globale Sammelrechnung nicht bearbeitet werden. Ein Tooltip weist darauf hin, dass die Einstellung im Bereich Kundenverwaltung (Customer Management) vorgenommen wird.

**Rollen und Berechtigungen**

Für die Rollen Market Operation und MPC PM wird geprüft, dass Kunden angezeigt und bearbeitet werden können. Ebenso wird geprüft, dass Kunden gelesen werden können und dabei alle konfigurierbaren Felder und Eingaben ausgefüllt werden können.