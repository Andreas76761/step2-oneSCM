# Batch 1061 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 69 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation): Behobene Fehler und Verbesserungen**

In diesem Release wurden zahlreiche Fehler in der Vertragserstellung behoben, die vor allem die Massenanlage, die Sonderfälle, die Reifenprodukte und die Preisdarstellung betreffen.

**Massenanlage und Sonderfälle**

Die Massenanlage erstellt keine Servicverträge mehr für Fahrzeuge, die zuvor aus der Massenanlage-Liste gelöscht wurden. Eine Massenanlage mit 99 Einträgen löst keine Bad-Request-Fehlermeldung mehr aus. Auch für Produkte mit ausgewählten optionalen Deckungen können Verträge nun per Massenanlage erstellt werden. Zudem werden Deal-ID-Werte im Bereich der Massenanlage nicht mehr abgeschnitten dargestellt. Auf der Seite der Sonderfälle funktionieren die Filterung sowie die Suche nach Referenznummer in der Sonderfall-Tabelle jetzt zuverlässig.

**Reifenprodukte und optionale Deckungen**

Beim Aktivieren eines Vertrags mit einem komplexen Reifenprodukt tritt kein Fehler mehr auf. Die optionalen Deckungen für komplexe Produkte werden nicht mehr doppelt angezeigt. Der Preis der Reifenoptionen beim komplexen Reifenprodukt wird korrekt dargestellt, und beim Hinzufügen einer Reifenoption zum komplexen unbegrenzten Reifenprodukt wird der Preis nun aktualisiert. Außerdem zeigt die Übersichts- und Bestätigungsseite im Bereich der Produktoptionen für Reifenprodukte wieder die entsprechenden Inhalte an. Ein interner Serverfehler beim Zugriff auf den Zahlungs-Tab von Verträgen, die mit Reifenprodukten erstellt wurden, wurde ebenfalls behoben.

**Preise, Rabatte und Steuern**

Wenn Technikoptionen oder optionale Deckungen abgewählt werden, wird der Preis wieder auf den Ausgangszustand zurückgesetzt. Das Gleiche gilt, wenn eine Kampagne abgewählt wird: Der Preis wird dann aktualisiert. Der Bereich der Preisaufschlüsselung lässt sich bei Verträgen, die über eine Auto-Apply-Kampagne erstellt wurden, wieder auf- und zuklappen. Rabattierte Preise werden in der Übersicht und Bestätigung bei mehreren Fahrzeugen nun angezeigt. Der Händlerrabatt wird in der Produktkonfiguration bzw. im Vertrag gespeichert, und der maximale Händlerrabatt weicht nicht mehr geringfügig vom Netto-Vertragspreis ab. Die Preisinformation funktioniert wieder. In der Vertragsverwaltung werden die monatlichen Preise bei gesetzter GST-Steuerart nicht mehr mit der Steuerart VAT ausgewiesen. Die Preisformatierung wird in der Konfiguration nicht mehr fälschlich auf Kilometerwerte angewendet. Zudem werden die PricePerKm-Platzhalter korrekt übermittelt.

**Vertragsvorschlag, Laufzeit und Laufleistung**

Die Laufleistungsvalidierung im Bereich des Vertragsvorschlags wurde korrigiert. Eine neue Laufzeit bzw. Laufleistung kann nun freigegeben werden, ohne dass die Preiskomponenten bearbeitet werden müssen. Die Produktkonfigurations-Assistenten enthalten für den Deal-ID-Ablauf wieder alle Schritte.

**Baumuster- und Deal-ID-Abläufe**

Im Baumuster-Ablauf lässt sich ein Vertrag nicht mehr dadurch anlegen, dass dasselbe Baumuster als zusätzlicher Identifikator hinzugefügt wird. Das Modal zum Hinzufügen eines Identifikators schließt sich nun bereits nach dem ersten Klick auf „Proceed“.

**Signatur, Benachrichtigung und Dokumente**

Das Signatur-Modal erscheint nicht mehr, wenn der Schalter „Signature required“ ausgeschaltet ist. Das Ein- und Ausschalten der Signatur- und Benachrichtigungsschaltflächen setzt die Seitenposition nicht mehr zurück. Der Zugriff auf den E-Mail-Bereich ist bei Verträgen, bei denen Signatur und Benachrichtigung deaktiviert sind, wieder fehlerfrei möglich. Wird ein Vertrag ohne Signatur aktiviert, kann der Servicevertrag jetzt heruntergeladen werden. Die i155-Datei wird in der Historie der Vertragsverwaltung angezeigt.

**Aktivierung, Zahlung und Bestätigung**

Beim Aktivieren eines Vertrags tritt kein interner Serverfehler mehr auf, ebenso wenig beim Zugriff auf einen Vertrag vor der Aktivierung oder auf den Zahlungs-Tab. Verträge im Status „In Confirmation“ lassen sich auch bei digitalen Zahlungen wieder öffnen. Ein Fehler wegen eines Direct-Debit-Nullwerts bei der Vertragserstellung wurde behoben. Ein fehlender Steuerbefreiungsnachweis verhindert den Übergang von „Waiting for Confirmation“ zu „Confirmed“ nicht mehr. Die Bezeichnungen der Zahlungsmethoden wurden korrigiert.

**Weitere Korrekturen**

Das Feld „Last updated by“ wird wieder angezeigt. Der Schalter „Assign to myself“ funktioniert auch nach dem ersten Umschalten weiterhin. Der Tooltip zeigt bei Verträgen im Status „Created“ die Informationen zur Umverteilung an. Die Vorschau der MO-Prüfungen wird in der Kundenverwaltung wieder erzeugt. Verträge für Bestandskunden können bei MBIL wieder angelegt werden, und ein Konsolenfehler, der die Vertragserstellung verhinderte, wurde behoben. Außerdem wurde der Fehler im Batch-Job ReportingContractDataBulkUpdate beseitigt, und die Anfrage „available“ ruft nicht mehr alle verfügbaren Produkte, sondern nur noch die zum jeweiligen Identifikator passenden ab.