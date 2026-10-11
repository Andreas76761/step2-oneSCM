# Batch 643 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mercedes me Profil: Adressdaten aktualisieren**

Beim Erstellen eines Servicevertrags im Bereich Vertragserstellung kann die Adresse eines Kunden in oneSCM aktualisiert und, sofern gewünscht, auch im Mercedes me Profil des Kunden nachgeführt werden. Voraussetzung ist in jedem Fall die ausdrückliche Zustimmung des Kunden. Die Aktualisierung erfolgt ausschließlich als einzelne, bewusst ausgelöste Änderung. Regelmäßige, automatische Hintergrundaktualisierungen finden nicht statt.

Im Ablauf für einen neuen Kunden fragt der Anwender zunächst die Einwilligung des Kunden zur Nutzung der Mercedes me Profildaten ab und prüft, ob der Kunde bereits mit Mercedes me synchronisiert ist, also eine CIAM-ID in der Datenbank besitzt. Ist der Kunde mit einer Mercedes me ID identifiziert und liegt die Einwilligung vor, befüllt oneSCM die Kundendatenfelder mit den Daten aus Mercedes me. Sind einzelne Adressangaben nicht mehr aktuell und stimmt der Kunde zu, dass auch sein Mercedes me Profil angepasst wird, übermittelt oneSCM die aktualisierten Daten an den Mercedes me Profildienst.

Bei einem bereits in oneSCM vorhandenen Kunden wird dieser zunächst in der Datenbank identifiziert. Anschließend prüft das System, ob bereits eine Mercedes me ID hinterlegt ist. Ist das nicht der Fall, wird der Kunde um seine Einwilligung zur Erstellung eines Mercedes me Kontos gebeten, wie im Ablauf zur Profilerstellung beschrieben. Ist eine Mercedes me ID vorhanden und muss der Bereich „Address Details“ in der Datenbank angepasst werden, wird der Kunde um seine Zustimmung gebeten, das Mercedes me Profil ebenfalls zu aktualisieren.

Die Aktualisierung wird über den Schalter „Update Mercedes me account with the information above“ bestätigt. Nur wenn dieser Schalter aktiv ist, werden Änderungen an Mercedes me gesendet. oneSCM liefert dabei Adressdaten, die mit der Google Maps API auf Qualität geprüft wurden.

Es gelten folgende Einschränkungen: Übermittelt werden ausschließlich Adressänderungen. Änderungen am Vor- oder Nachnamen sind über den User Profile Service (UPS) nicht möglich. Dafür wäre ein CIAM-Zugang erforderlich, der derzeit jedoch nicht benötigt wird. Zudem können Profilaktualisierungen nur für Kunden erfolgen, die die Vertragsrolle Halter bzw. Halter und Zahler innehaben, nicht für einen abweichenden Zahler. Die Adresse darf nur innerhalb eines Landes geändert werden. Wechselt der Kunde das Land, sendet oneSCM keine Adressaktualisierung an Mercedes me. Das Land wird im Mercedes me UPS API als Zeichenfolge im Format zweier Großbuchstaben übergeben, optional mit einem weiteren Bestandteil, etwa „DE“ oder „AE-AZ“.

Für die Aktualisierung wird der Endpunkt updateUserV2 des User Profile Service verwendet. Den Zugriff auf die Mercedes me Schnittstellen für Aktualisierungen gewährt eine dafür benannte Person im Projekt.