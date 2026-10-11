# Batch 673 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mercedes me Profil anlegen und aktualisieren**

Im Bereich Customer & Partner Management können Sie im Rahmen der Vertragserstellung ein Mercedes me Profil für Kundinnen und Kunden anlegen oder bestehende Profildaten aktualisieren. Sie starten dazu in der Navigationsleiste im Reiter „Contract Generation", wenn Sie einen Servicevertrag für einen Kunden erstellen möchten. Im Schritt „Customer Details" erfassen Sie die erforderlichen Angaben wie Vorname, Nachname sowie E-Mail-Adresse bzw. Mercedes me ID und Telefonnummer bzw. Mercedes me ID. Zudem holen Sie die Erlaubnis des Kunden ein, dessen Mercedes me Profildaten zu verwenden.

Zunächst prüft oneSCM in der eigenen Datenbank, ob der Kunde bereits existiert. Anschließend erfolgt eine Prüfung in Mercedes me. Diese besteht aus zwei Abfragen, einmal mit der E-Mail-Adresse und einmal mit der Telefonnummer, und wird nur durchgeführt, wenn der Kunde seine Erlaubnis erteilt hat.

**Neues Mercedes me Profil erstellen**

Ist der Kunde noch nicht mit einer Mercedes me ID identifiziert und Sie wählen entweder einen gefundenen Kunden aus (es erscheint die Seite zum Aktualisieren des Kunden) oder legen einen neuen Kunden an (es erscheint die Seite zum Erstellen des Kunden), finden Sie am Ende dieser Seite einen Schalter. Dessen Beschriftung soll lauten: „I have obtained the customer's consent to create an account for them." Wünscht der Kunde ein Mercedes me Profil, aktivieren Sie diesen Schalter. Die in oneSCM erfassten Daten werden dann an Mercedes me übermittelt, und dort wird ein Profil angelegt. Sobald das Profil erstellt ist, wird das Feld „Mercedes me ID" im Bereich „Customer Details" automatisch mit der neuen ID befüllt.

Wurde ein passender Datensatz gefunden, der Kunde besitzt aber noch kein Mercedes me Konto, soll nach der Erstellung die Mercedes me ID ergänzt werden. Entsprechend soll bei einem gefundenen Mercedes me Profil mit passendem oneSCM-Datensatz der bestehende Datensatz um die gefundene Profil-ID erweitert werden.

Ein Mercedes me Profil kann nur für Kunden angelegt werden, die bei mindestens einem Vertrag die Vertragsrolle „Holder" innehaben. Eine Mercedes me ID darf zudem nicht für zwei verschiedene Kunden verwendet werden.

Welche Felder für die Profilerstellung verpflichtend sind, kann je nach Land variieren. Sie werden über die Schnittstelle „getProfileFields" ermittelt, die dafür unter anderem Ländercode, Sprachraum (Locale) und Kundentyp benötigt. Für Deutschland gelten im MVP die Werte DE, de-DE und B2C. Als Use Case wird MMCR_NEW_USER verwendet. Das Profil selbst wird über die Schnittstelle „createUserV2" erzeugt.

Verpflichtend sind in den Kontodaten (Core Profile) die E-Mail-Adresse oder die Telefonnummer (der Kunde kann eine davon als Benutzernamen wählen), Vorname, Nachname und das Land (als Ländercode) sowie in der Datenschutz- und Marketing-Einwilligung die Zustimmung zu den Nutzungsbedingungen. Sprache, Straße, Hausnummer, Postleitzahl und Ort sind optional, sollten aber an Mercedes me übergeben werden. Die weiteren Marketing- und Datenerhebungs-Einwilligungen sind nicht verpflichtend. Bankdaten sind derzeit weder verpflichtend noch relevant.

**Mercedes me Profil aktualisieren**

Beim Anlegen eines Servicevertrags für einen neuen Kunden holen Sie zunächst dessen Einwilligung zur Nutzung der Mercedes me Profildaten ein und prüfen, ob der Kunde bereits mit Mercedes me synchronisiert ist, also eine CIAM-ID in der Datenbank hat. Ist der Kunde mit einer Mercedes me ID identifiziert und stimmt zu, füllt oneSCM die Kundendatenfelder mit den Mercedes me Daten. Müssen Adressangaben aktualisiert werden, weil sie nicht mehr aktuell sind, und stimmt der Kunde auch der Aktualisierung seines Mercedes me Profils zu, sendet oneSCM die geänderten Daten an den Profildienst von Mercedes me.

Bei einem bestehenden Kunden wird dieser zunächst in der Datenbank identifiziert, und es wird geprüft, ob bereits eine Mercedes me ID vorliegt. Ist das nicht der Fall, fragen Sie die Einwilligung zur Erstellung eines Mercedes me Kontos ab, wie oben beschrieben. Ist eine Mercedes me ID vorhanden und muss der Bereich „Address Details" in der Datenbank angepasst werden, holen Sie die Einwilligung des Kunden ein, auch das Mercedes me Profil zu aktualisieren.

Wichtig: oneSCM kann ausschließlich Adressänderungen an den Profildienst (UPS) senden. Änderungen von Vor- oder Nachnamen sind darüber nicht möglich, dafür wäre ein CIAM-Zugang nötig, der derzeit nicht erforderlich ist. Profilaktualisierungen sind nur für Kunden mit der Vertragsrolle „Holder" und „Holder-Payer" möglich, nicht für abweichende Zahlungspflichtige. Die Aktualisierung erfolgt über die Schnittstelle „updateUserV2".

Folgende Voraussetzungen gelten: Der Schalter „Update Mercedes me account with the information above" muss aktiviert sein. Es handelt sich ausschließlich um einzelne Aktualisierungen mit eindeutiger Zustimmung des Kunden, regelmäßige automatische Hintergrundaktualisierungen finden nicht statt. oneSCM liefert Adressdaten, die zuvor mit der Google Maps API geprüft wurden. Die Adresse darf nur innerhalb eines Landes geändert werden. Wechselt der Kunde das Land, sendet oneSCM keine Adressänderungen an Mercedes me. Das Land wird im Format zweier Großbuchstaben als Zeichenkette übergeben, beispielsweise „DE" oder „AE-AZ".