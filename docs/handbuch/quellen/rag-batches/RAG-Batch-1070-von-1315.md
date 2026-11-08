# Batch 1070 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 79 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung: Behobene Fehler und Verbesserungen**

In diesem Release wurden zahlreiche Fehler in der Vertragserstellung behoben und das Verhalten der Anwendung an mehreren Stellen verbessert. Fehler, die im Rahmen der Qualitätssicherung gemeldet, aber nicht weiterverfolgt wurden, sind hier nicht aufgeführt.

**Fahrgestellnummer, Bestellnummer und Identifikatoren**

Die Eingabe einer ungültigen Fahrgestellnummer löst nicht mehr mehrere Fehlermeldungen aus. Ebenso wird beim Eingeben einer Fahrgestellnummer keine Fehlermeldung zum Sicherheitskontext mehr angezeigt. Verträge lassen sich nun auch dann mit einer Bestellnummer anlegen, wenn dieser noch keine Fahrgestellnummer zugeordnet ist. Wird die Fahrgestellnummer geändert, wird die zuvor abgerufene Mindestlaufleistungsprüfung korrekt zurückgesetzt. Für Identifikatoren, zu denen keine ISP-Angaben vorliegen, erscheint kein Serverfehler mehr. Außerdem wurden die ISP-Hinweise verbessert: Ein fehlerhafter Hinweis bei bestimmten konfigurierten ISP-Einstellungen wurde korrigiert, die Prüfung, ob für alle Identifikatoren ISP-Angaben vorhanden sind, funktioniert zuverlässig, und für Baumuster mit konfiguriertem ISP wird der Hinweis nun ausgelöst. Produkte lassen sich zudem über den Baumuster-Ablauf auswählen.

**Produktauswahl und Eingabefelder**

Wird ein Produkt mit anderen Werten erneut ausgewählt, aktualisiert sich der Bereich der Produktoptionen. Die Validierung des Kennzeichenfelds wird bei der Produktauswahl nicht mehr ignoriert. Der Abruf verfügbarer Produkte wird nicht mehr mehrfach ausgelöst. Das Datum der Erstzulassung (FRD) kann nicht mehr in der Zukunft liegen. Der Maximalwert der Laufleistung wird nun formatiert dargestellt, und die Anzeige des letzten Serviceintervalls (Laufleistung) wurde korrigiert. Der Bereich mit den Kundeninformationen wird nun bereitgestellt. Produktbilder im SVG-Format werden im Schritt „Übersicht und Bestätigung“ angezeigt, und ein fälschlich dargestellter Rabatt in diesem Schritt wurde korrigiert.

**Verträge ändern, verlängern und aktivieren**

Verträge vom Typ „Build to Order“ können wieder aktualisiert werden. Beim Öffnen eines Vertrags im Status „Erstellt“ tritt kein Fehler „404 Not Found“ mehr auf. Ein Fehler wegen gleichzeitiger Änderungen am Vertragsobjekt in der Datenbank wurde behoben. Bei der langfristigen Verlängerung bleiben die Felder nicht mehr leer, wenn die Schaltfläche zum Öffnen der Einrichtung vor dem vollständigen Laden angeklickt wird. Die Navigation zurück zum Vertragsangebot funktioniert nun korrekt. Wenn ein Händler bereits registriert ist und ein Händlerrabatt angewendet wird, wird der Vertrag nun automatisch aktiviert. Außerdem wurde der Fehler behoben, dass ein Vertrag im Status „Warten auf Aktivierung“ steht, ohne dass ein Eintrag in der Prüfliste der MO-Verifizierung vorhanden ist.

**Signatur und Dokumente**

Bei der Signatur vor Ort („On Premise“) tritt kein interner Serverfehler mehr auf. Der Signaturtyp wird für Druckdokumente nun korrekt aktualisiert. Die Laufleistung auf dem Druckdokument stimmt jetzt mit dem angezeigten Wert überein. Ebenso wurden Betragsabweichungen in der Vertragsvorschau (PDF) und in der Vertragsbestätigungs-E-Mail korrigiert.

**Kulanzzeit-Kampagnen**

Eine Kulanzzeit-Kampagne kann nicht mehr durch die MO genehmigt werden; dies wurde sowohl im Frontend als auch im Backend korrigiert. Ein störender Leerraum auf der Seite der Kulanzzeit-Kampagne wurde entfernt. Wird für einen Vertrag, für den bereits eine Kampagnenanfrage versendet wurde, erneut ein Produkt ausgewählt, erscheint kein Kulanzzeit-Fehler mehr. Der Hinweis zur Kulanzzeit verschwindet nach sieben Tagen wie vorgesehen.

**Benachrichtigungen, Ereignisse und Schnittstellen**

E-Mails vor und nach Ablauf der Angebotsgültigkeit werden nun ausgelöst. Beim Wechsel des Zahlungsintervalls von monatlich auf einmalig wird das Vertragsereignis (Nemesis) erzeugt. Das Ereignis zur Verkaufsprovision wird an Revenue gesendet. Die Coverage-ID in der I155-Datei ist wie erwartet eindeutig. Aufrufe des Historien-Services in Swagger funktionieren wieder.

**Oberfläche, Zugriff und Berechtigungen**

Die Seiten für Angebots- und Vertragsverwaltung zeigen ihre Daten wieder an, und das Angebotsmanagement stellt Daten korrekt dar. Der Ablauf der Vertragserstellung funktioniert wieder. Die Schaltfläche zum Hochladen im Reiter „Kommunikation“ der Vertragsverwaltung wurde entfernt, da sie nur in der Vertragserstellung vorgesehen ist. Benutzer mit der Rolle MPC haben Zugriff auf die Prüfliste der MO-Verifizierung. Der Zugriff von ADMIN-Benutzern auf die Vertragserstellung wurde korrigiert.