# Batch 1113 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 22 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Preiserfassung auf Vertragsebene**

Sobald die Vertragserstellung gestartet wurde und alle Pflichtfelder ausgefüllt sind, ruft das System die Vertragskalkulation auf, um die Preise zu ermitteln. Diese liefert vier Werte: die Standarddauer (die für das Produkt definierte Standardlaufzeit), die Zahlungsdauer (die tatsächliche Anzahl der Monate für die Neuverteilung der Zahlung beim Produkttyp Excellent), den Standardpreis (der Preis für die Standarddauer) sowie den Dauerpreis (der Preis für die tatsächliche Anzahl der Monate gemäß Zahlungsdauer). Die Vertragserstellung speichert diese Laufzeiten und Preise auf Vertragsebene. Bei einem Zahlungsplan erfolgt die Anfrage mit Zahlungsdauer und Dauerpreis. Sobald der Vertrag aktiviert und die Benachrichtigung an Revenue gesendet wurde, werden dort Standarddauer, Zahlungsdauer und Dauerpreis bereitgestellt.

**Aktivierung und Statuswechsel**

Ein Vertrag im Status „Waiting for Activation“ kann von Market Operations nicht mehr manuell aktiviert werden, wenn die DSS-Signatur nicht bestätigt wurde, der Kunde den Vertrag also nicht unterschrieben hat. Versucht ein Mitarbeiter dennoch die manuelle Aktivierung, erscheint die Toast-Meldung „Customer signature missing“.

Fordert ein Händler für einen Kunden bzw. Vertrag eine Karenzzeit (Grace Period) an, wird die Anfrage an MPC gesendet. Der Status wechselt dabei von „Created“ auf „Confirmed“. Die Grace-Period-Anfrage wird aus dem Vertragsmanagement versendet, sobald der Vertrag auf „Confirmed“ gesetzt ist. Danach wartet die Vertragserstellung bis zu sieben Tage auf die Antwort. Während dieser Zeit oder bis eine Antwort (Accepted oder Rejected) vorliegt, können Market Operations den Vertrag nicht manuell aktivieren. Geht innerhalb der sieben Tage keine Antwort ein, wird mit der Aktivierung fortgefahren, die Anfrage entfernt und die manuelle Aktivierung für Market Operations wieder ermöglicht. Die Benachrichtigung zur Grace-Period-Anfrage enthält zusätzlich den Namen des Händlers und die User-ID.

Die Wartezeit, nach der ein Vertrag ohne weiteren Fortschritt Richtung Aktivierung auf „Rejected“ gesetzt wird, wurde von einer Stunde auf 24 Stunden verlängert. Dies gilt für die Umgebungen DEV, INT und PrePROD.

**Oberfläche und Felder**

Die Übersichts- und Bestätigungsseite (Schritt 3 der Vertragserstellung) wurde im Bereich „Customer & Payment Information“ an Schritt 2 angeglichen. In den Kundendetails entfällt die private USt-IdNr., da sie für den Markt DE nicht erforderlich ist, und die Festnetznummer wird als Pflichtfeld ergänzt. Bei den Steuer- und Rechtsangaben entfallen der Tax Classification Code und die Legal Entity (für den Markt DE nicht erforderlich). Bei den Forderungen aus dem FI-System heißt „Partner Type“ nun „Customer Type“. Außerdem wurde der Reiter „Payment Details“ in „Payment“ umbenannt. Im Status „Waiting for Activation“ sind das Vertragsstartdatum (Contract Details, Reiter Contract) und das Datum der Erstzulassung (Contract Details, Reiter Vehicle) für keinen Benutzer mehr editierbar. Zudem wurden Platzhalter für Zahlungsplan und Preisinformationen angepasst.

**Build-to-Stock-Verträge**

Wurde ein Vertrag über den Build-to-Stock-Ablauf angelegt und erfasst der Händler die fehlenden Informationen, wird die Seite der Vertragserstellung aktualisiert und die Update-Schaltfläche des Vertrags entfernt. Das Fahrzeugmanagement erhält die erfassten Informationen (Erstzulassungsdatum und Kennzeichen zur Fahrgestellnummer). Wird Build to Stock erneut für eine Fahrgestellnummer verwendet, der gerade ein Erstzulassungsdatum zugewiesen wurde, ist der Ablauf für diese Fahrgestellnummer nicht mehr verfügbar.

**Schnittstellen und Technik**

Das Kennzeichen wird in der Schnittstelle i155 im Satz RC05, Position 177–186, linksbündig übertragen, sofern es bei der Vertragserstellung oder später im Vertragsmanagement erfasst wurde; zuvor blieb das optionale Feld mit Leerzeichen gefüllt. Die Filterlogik für Kunden-ID und Zahler-ID in der API getContract wurde geändert. In getAvailableProduct ist nun die Kampagnenbeschreibung enthalten. Der Contract-API-Wrapper wurde angepasst; dies betraf unter anderem Fehlerbehandlung, Statusabfrage, Felddefinitionen und die Unterscheidung von Pflicht- und Optionalfeldern. Bei Änderung des Produktmoduls wird der Edge-Service-Contract-E2E-Prozess ausgelöst.

Im Hintergrund wurden weitere Verbesserungen umgesetzt: Ein Health Check wurde implementiert, der Vertrags-Cache nutzt statt Caffeine nun Redis, der ProductCard-Prozess wurde überarbeitet, und der Job checkContractUpdateJob bricht bei einem Fehler in einem einzelnen Vertrag nicht mehr ab.