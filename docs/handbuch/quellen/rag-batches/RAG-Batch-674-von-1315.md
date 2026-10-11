# Batch 674 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Aktualisierung von Mercedes-me-Profildaten (Customer & Partner Management)**

Hinweis: Das zugrunde liegende Vorhaben hat den Status „Cancelled". Die hier beschriebene Funktion wurde daher nicht umgesetzt und steht im System nicht zur Verfügung. Die folgende Beschreibung gibt den geplanten Zielzustand wieder.

Geplant war, dass oneSCM Adressänderungen an das Mercedes-me-Profil eines Kunden übermitteln kann. Die Funktion war als Neuentwicklung vorgesehen, einen Vorgängerzustand gab es nicht. Sie sollte im Bereich der Vertragserstellung zum Einsatz kommen, und zwar in zwei Szenarien.

Im ersten Szenario legt ein Benutzer einen Servicevertrag für einen neuen Kunden an. Im Verlauf des Prozesses holt er die Einwilligung des Kunden zur Nutzung seiner Mercedes-me-Profildaten ein. Zudem prüft er, ob der Kunde bereits mit Mercedes me synchronisiert ist, also ob in der Datenbank eine CIAM-ID vorliegt. Ist der Kunde über seine Mercedes-me-ID identifiziert und hat er eingewilligt, befüllt oneSCM die Kundendatenfelder mit den Daten aus Mercedes me. Sind einzelne Adressangaben nicht mehr aktuell und stimmt der Kunde zusätzlich zu, auch sein Mercedes-me-Profil zu aktualisieren, sendet oneSCM die geänderten Daten an den Profildienst von Mercedes me.

Im zweiten Szenario legt der Benutzer einen Vertrag für einen Bestandskunden an. Der Kunde wird zunächst in der Datenbank identifiziert, danach wird geprüft, ob bereits eine Mercedes-me-ID hinterlegt ist. Ist das nicht der Fall, wird der Kunde um seine Einwilligung zur Erstellung eines Mercedes-me-Kontos gebeten; dieser Ablauf wird in einem eigenen Vorhaben behandelt. Ist eine Mercedes-me-ID vorhanden und muss der Bereich „Adressdaten“ in der Datenbank angepasst werden, wird der Kunde um Einwilligung gebeten, auch das Mercedes-me-Profil zu aktualisieren.

Dabei gelten folgende Einschränkungen. Über den Dienst UPS kann oneSCM ausschließlich Adressänderungen übermitteln. Änderungen von Vor- oder Nachnamen sind darüber nicht möglich, weil dafür ein CIAM-Zugang erforderlich wäre, der zum damaligen Zeitpunkt nicht benötigt wurde. Profilaktualisierungen sind nur für Kunden vorgesehen, die als Vertragsrolle Halter bzw. Halter und Zahler innehaben, nicht für einen abweichenden Zahler.

Als Voraussetzungen waren festgelegt: Der Schalter „Update Mercedes me account with the information above“ muss aktiviert sein. Es sollten nur einzelne Aktualisierungen mit eindeutiger Zustimmung des Kunden erfolgen, keine regelmäßigen automatischen Hintergrundaktualisierungen. oneSCM liefert Adressdaten, die zuvor mit der Google Maps API auf Qualität geprüft wurden. Außerdem darf eine Adresse nur innerhalb eines Landes geändert werden. Wechselt der Kunde das Land, sendet oneSCM keine Adressaktualisierung. Das Land wird in der UPS-API von Mercedes me als Zeichenkette übergeben, zum Beispiel „DE“ oder „AE-AZ“.

Für die Aktualisierung des Profils sollte der Schreibzugriff „updateUserV2“ der Nutzerprofil-API verwendet werden. Der Zugriff auf die Mercedes-me-Schnittstellen sollte von einer dafür benannten Person freigegeben werden.

Als Abnahmekriterien galten: Adressänderungen werden an das Mercedes-me-Profil gesendet, wenn ein neuer Kunde eine Mercedes-me-ID besitzt und seine daraus befüllten Adressfelder angepasst werden müssen. Dasselbe gilt für Bestandskunden mit Mercedes-me-ID, deren Adressdaten in oneSCM geändert wurden. Übermittlungen erfolgen nur bei Kunden, die ihre Einwilligung über den aktivierten Schalter erteilt haben. Ein Mercedes-me-Profil haben nur Kunden mit der Vertragsrolle Halter in mindestens einem Vertrag. Ändert ein Kunde das Land, werden keine Aktualisierungen an Mercedes me gesendet.