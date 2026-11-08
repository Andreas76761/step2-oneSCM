# Batch 1196 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis zur Verwendung:** Das Ticket zur Preisversions-Duplizierung mit prozentualer Erhöhung hat den Status „Cancelled“ und die Exploration zu weiteren Märkten ist ein reines Untersuchungsthema ohne ausgelieferte Funktion. Beide sind daher nicht als Funktionen beschrieben. Der folgende Text umfasst die Funktionen, die geschlossen wurden.

**Contract Calculation: Neuerungen**

**Preisversionen bei der Kampagnenerstellung**

Beim Anlegen einer Kampagne wird in Schritt 2 auf der linken Seite künftig nicht mehr nur das Produkt mit der aktuell gültigen Preisversion angezeigt. Stattdessen erscheinen die Produkte mit jeder aktiven Preisversion sowie mit der nächsten geplanten Preisversion, jeweils einschließlich aller zugehörigen Cluster. Zu jeder Preisversion werden der Name sowie das Start- und das Enddatum des Preises angezeigt.

Wählt der Benutzer mit der Rolle MPC eine Preisversion aus, werden automatisch alle Cluster dieser Preisversion ausgewählt. Bei Bedarf lassen sich einzelne Cluster nacheinander wieder abwählen. Die gewählte Preisversion mit den ausgewählten Clustern wird anschließend auf der rechten Seite angezeigt. Dieselben Informationen finden sich auch in Schritt 3, der Kampagnenübersicht (Campaign Summary).

**Fahrzeugstatus abrufen**

Das System verbindet sich mit der Warranty-&-Goodwill-Schnittstelle und ruft den Status eines Fahrzeugs ab. Bislang wurde diese Information nicht oder nur aus DSB bzw. Vedoc übernommen. Die Statusinformationen werden an den Generierungsprozess übergeben, sodass die Generierung eines Servicevertrags gestoppt werden kann, wenn das Fahrzeug einen relevanten Status hat. Relevant sind folgende Status: HQ gesperrt (Wert „V“), gestohlen (Wert „3“), Totalschaden (Wert „8“) und verschrottet (Wert „2“). In der Antwort wird auch der jeweils von Warranty & Goodwill gelieferte Wert mitgegeben. Der Generierungsprozess verwendet diese Werte und zeigt sie in der Benutzeroberfläche an.

**Historie von Fahrzeugkilometerstand und Schäden**

Das System ermittelt den zuletzt bekannten Kilometerstand sowie die Schadenshistorie aus mehreren Schnittstellen und Quellen, speichert diese und stellt sie dem Generierungsprozess zur Verfügung. Damit sind alle kilometerbezogenen Daten im System und zu einem Vertrag für spätere Zwecke hinterlegt. Der letzte bekannte Kilometerstand ist für die Generierung wichtig, um einen Servicevertrag abzusichern, und dient außerdem späteren Folgeaktivitäten, etwa bei Produkten, die sich dem Laufleistungsende des Vertrags nähern.

Zu jedem Wert werden der letzte Kilometerstand, die Einheit (z. B. km), das Datum und die Quelle gespeichert. Als Quellen sind DSB, Warranty & Goodwill, Vega-Claims und manuelle Werkstattrechnungen vorgesehen. Die Abfrage bei DSB sowie bei Warranty & Goodwill (Fahrzeugkilometerstand) erfolgt, wenn die Generierung einen Auslöser sendet. Beide Anbindungen sind umgesetzt. Die Anbindung der Vega-Claims aus I156 und die Übernahme manueller Werkstattrechnungen, bei denen das Vertragsmanagement Kilometerstand und Fahrgestellnummer liefert, sind noch umzusetzen. Das gilt ebenso für die Warranty-&-Goodwill-Historie (history-items), bei der künftig sowohl der letzte Kilometerstand als auch die Historieneinträge an die Generierung übergeben werden. Die Anbindung der MIC-API ist zurückgestellt, das System soll dafür aber vorbereitet sein.

Die Einheit richtet sich nach dem Markt (Maßeinheit in der Marktkonfiguration). Mögliche Codes sind 0 für Kilometer und 1 für Meilen. Werden ausschließlich Meilen geliefert, rechnet das System in Kilometer um und rundet auf die nächste ganze Zahl. Beispielsweise ergeben 100 Meilen 160,9344 Kilometer, gespeichert wird der Wert 161 km.