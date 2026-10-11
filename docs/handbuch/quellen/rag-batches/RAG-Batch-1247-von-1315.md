# Batch 1247 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise Contract Calculation**

**Sonderfall und Massenanlage:** Der Sonderfall bei der Einzel- und Massenanlage unterstützt nun alle Zahlungsintervalle. Bisher war er nur für monatliche Zahlungen und Einmalzahlungen verfügbar. Bei der Vertragsgenerierung mit einer OTR-ID ruft das System außerdem immer die aktuellen Daten direkt aus OTR ab und verwendet nicht mehr die in oneSCM gespeicherten Daten.

**Preisaufteilung:** Bei komplexen Produkten wurde bereits der Preis nach Lieferant aufgeteilt. Zusätzlich lässt sich der Preis der Optionen komplexer Produkte nun auch nach Kunde aufteilen. Bei der Prolongation werden alle Preiskomponenten an die Vertragsgenerierung bzw. das Zahlungsintervall übergeben.

**Technische Optionen:** Für PC und VAN werden technische Optionen künftig ausschließlich auf Basis von BASE berechnet. Bisher wurden BASE und die immer enthaltenen Optionen (Always Included) herangezogen.

**Optionale Deckungen:** Optionale Deckungen, die der Benutzer nicht ausgefüllt hat (NULL), werden nicht mehr in der Anfrage an die Generierung übermittelt. Dies gilt auch unter Berücksichtigung des Family-Tags. Ein Wert von 0 bedeutet, dass die Deckung für den Kunden kostenlos ist, und wird weiterhin gesendet.

**Preisversionen und Händlerprovision:** In der Übersicht und in der Ansicht einer Preisversion werden jetzt die Werte angezeigt, die für die Händlerprovision erfasst wurden. Zuvor war nur die gewählte Provisionsart (Prozent) sichtbar. Außerdem akzeptiert die Händlerprovision nun den Wert „0“ oder NULL. Bisher war „1“ der Mindestwert, und alle Provisionswerte mussten ausgefüllt werden.

**Kampagnen und Blueprints:** In der Tabelle unter „Manage Campaigns“ steht die Spalte „External Campaign ID“ jetzt hinter der Spalte „Validity Period“. Neu hinzugekommen ist die Spalte „Campaign Type“, die nach „External Campaign ID“ folgt und anzeigt, ob es sich um eine Sales- oder After-Sales-Kampagne handelt. In der Blueprint-Übersicht gilt für Blueprint-Namen derselbe Standard wie bei Produkten. Die Oberfläche zeigt eine gekürzte Darstellung des Namens, und per Tooltip beim Darüberfahren erscheint der vollständige Name mit maximal 50 Zeichen.

**Vier-Augen-Freigabe:** Liegt das Freigabedatum vor dem vom Benutzer gewünschten Startdatum, gilt das gewünschte Startdatum. Beispiel: Wählt der Benutzer den 27.02.2026 und erfolgt die Freigabe durch MPC 2 am 25.02.2026, wird der 27.02.2026 verwendet. Bei mehreren Entwürfen, etwa Entwurf 2 und Entwurf 3, kann der neueste Entwurf nicht eingereicht werden. Die Schaltfläche „Einreichen“ ist deaktiviert und ein Tooltip erklärt dies. Eingereicht werden darf nur der älteste Entwurf.

**Lieferanten-Ereignis:** Immer wenn ein Lieferant am Produkt gespeichert oder entfernt wird, erzeugt das System ein Kafka-Ereignis im Topic „supplier-deletion-topic“.

**Noch in Planung:** Folgende Punkte sind noch nicht umgesetzt. Bei negativen Berechnungswerten, etwa bei der Prolongation vollständig subventionierter Verträge, soll der Wert zwingend auf 0 gesetzt werden. Dort beträgt der Kundenpreis des ursprünglichen Vertrags 0, und die Prolongationsformel liefert den negativen Wert. Dies entspricht der bestehenden Regel, dass eine Minderkilometer-Berechnung mit negativem Ergebnis auf 0 gesetzt wird.

**Nicht weiterverfolgt:** Die Anpassung der Validierung bei nicht passender Laufleistung in der Massenanlage, der geänderte Ablauf für komplexe Produkte mit unbegrenzten Reifen und die Validierung der Deal-ID gegen OTR wurden abgebrochen und sind nicht Teil dieser Version.