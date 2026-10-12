# Batch 1096 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise Contract Generation**

**Dokumente im Vertrag**

Wenn Sie in der Detailansicht eines Vertrags im Reiter „Kommunikation" ein neues Dokument hochladen, aktualisiert sich die Seite nun automatisch. Das zuletzt hochgeladene Dokument wird sofort angezeigt. Sie müssen die Seite nicht mehr manuell neu laden oder zwischenzeitlich in einen anderen Bereich wechseln. Wird ein neues Dokument mit Unterschrift hinzugefügt, werden außerdem Fehler aus der Dokumentenverwaltung bei der Prüfung des QR-Codes abgefangen, etwa wenn die QR-Nummer ungültig ist oder der QR-Code nicht erkannt wird.

**Vertragslaufzeit und Anzahl der Rechnungen**

In der Anzeige der Zahlungsdauer wird anstelle der Anzahl der Monate nun die „Anzahl der Rechnungen" angezeigt. Der Wert wird vom Backend geliefert, zum Beispiel „47", und steht sowohl vor als auch nach der Aktivierung des Vertrags zur Verfügung. Vor der Aktivierung ergibt sich die Zahl aus dem Startdatum und der Vertragslaufzeit, wobei Rechnungen mit dem Wert 0 nicht mitgezählt werden. Nach der Aktivierung wird die tatsächliche Anzahl der Rechnungen aus dem Zahlungsplan angezeigt.

**Leasing-Integration**

Wird ein Servicevertrag über den Edge-Service angelegt, begann er bisher mit dem Datum des Vertragsantrags und nicht mit dem Datum der Erstzulassung (FRD). Dadurch startete der Servicevertrag unter Umständen Monate vor dem eigentlichen Leasingvertrag. Ist das Produkt als „FRD-bezogen" eingerichtet, beginnt der Vertrag nun standardmäßig mit dem FRD des Fahrzeugs. Für diese Regel ist eine Ausnahme vorgesehen.

Übergibt das anfragende System bei der Anlage eines Leasingvertrags eine externe Kampagnen-ID im Attribut „scActionId", wird diese nun berücksichtigt. Der Wert wird als Kampagnen-ID an den Produktservice übergeben, um die Produktkonfiguration zu prüfen, und anschließend an den Vertragsservice weitergereicht. Dabei wird geprüft, ob es für das angegebene Produkt und Fahrzeug eine gültige Kampagne gibt, deren externe Kampagnen-ID mit diesem Wert übereinstimmt. Ist das der Fall, wird die Kampagne auf den Vertrag angewendet. Sie wird bei der Prüfung des Preises (Nettobetrag) als Preisreduktion berücksichtigt. Für die Preisreduktion wird ein Ertrag im Status „geplant" angelegt, dessen Daten aus der Kampagne abgeleitet werden, etwa der Rechnungsempfänger als Kostenstelle der Kampagne und die Debitorennummer. Ist die Kampagnen-ID nicht gültig, wird die Anlage des Vertrags mit einer passenden Fehlermeldung abgelehnt.

Der Status-Endpunkt liefert nun alle Status eines Vertrags zurück. Zuvor funktionierte er nur für aktive Verträge, nicht für angelegte oder bestätigte.

**Markt Indien**

Für gewerbliche Kunden auf dem Markt Indien ist die Zahlung per Kreditkarte nun zulässig, auch ohne Mercedes-me-Konto. Hintergrund ist, dass die Lastschrift auf dem indischen Markt keine verfügbare Zahlungsart ist. Damit kann der Schritt „Kunden- und Zahlungsinformationen" bei der Anlage eines Servicevertrags für gewerbliche Kunden durchlaufen werden.

**Schnittstellendatei i155**

Für Contingent- und Reifenprodukte wird der Zähler in der Datei i155 (RC20, Position 165–169) nur noch für Basisleistungen gezählt, nicht für optionale Leistungen oder Karosserieleistungen. Dazu wurde an der Leistungsentität ein zusätzliches Feld „fromOptional" eingeführt. Es gibt an, ob eine Leistung aus dem optionalen Bereich stammt. Bei der Neuerzeugung der Datei wird es genutzt, um festzulegen, ob die Leistung berücksichtigt wird.

**Auswahl von Kampagnen**

Im Auswahlfenster für Kampagnen wurde die Anzeige eines fehlerhaften Kampagnentyps korrigiert.

**Technische Anpassung**

Der Typ des Versionsfelds im gemeinsamen Modul wurde angepasst.