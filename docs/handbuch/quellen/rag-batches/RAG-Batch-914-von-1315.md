# Batch 914 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Deal ID in der Massenanlage**

Die Massenanlage von Verträgen unterstützt jetzt die Deal ID als gültige Fahrzeugkennung. Vertriebsmitarbeitende können damit zusätzlich zu den bisherigen Kennungen eine weitere Möglichkeit nutzen, um das Onboarding für Endkunden zu starten. Die Massenanlage folgt damit derselben Logik wie die Anlage eines einzelnen Vertrags. Es gelten dieselben Rollen wie im bisherigen Ablauf.

Voraussetzung für die Nutzung ist, dass der Kundentyp „Fleet Customer" ist und die Massenanlage für das ausgewählte Produkt aktiviert wurde. Bei der Verwendung einer Deal ID werden ausschließlich fahrzeugbezogene Daten berücksichtigt. Sonderpreise oder Kundeninformationen, die mit einer Deal ID verknüpft sind, werden ignoriert. Die Deal ID wird sowohl beim Start der Massenanlage als auch in der Liste der zu validierenden Fahrzeuge als Kennung akzeptiert. Ihr Format muss den Validierungsregeln der Benutzeroberfläche entsprechen.

Der Ablauf gestaltet sich wie folgt: Sie starten die Vertragsanlage und rufen die passenden Produkte ab. Dabei können Sie auch eine Deal ID als Kennung verwenden. Anschließend wählen Sie ein Produkt aus und konfigurieren es. Ist für das konfigurierte Produkt die Massenanlage aktiviert, können Sie diese auswählen. Die Deal ID gilt dann als Referenzfahrzeug für die Validierung. In der Fahrzeugtabelle der Massenanlage können Sie die Einträge anschließend mit der Deal ID als Kennung befüllen. Die Benutzeroberfläche prüft dabei zunächst das Format der Deal ID. Ist das Format korrekt, wird die Deal ID als gültige Kennung akzeptiert.

Sobald die Deal IDs in der Tabelle erfasst sind, sendet das System alle Fahrzeuge, auch die über eine Deal ID identifizierten, zur Validierung an den Vehicle Microservice und den Product Microservice. Verläuft die Validierung erfolgreich, werden die Fahrzeuge als gültig und für die Massenanlage zulässig markiert. Schlägt sie fehl, wird das betroffene Fahrzeug als ungültig gekennzeichnet. Sie müssen den Eintrag dann korrigieren oder entfernen, bevor Sie fortfahren können.

Nachdem Sie die endgültige Fahrzeugliste bestätigt haben, gelangen Sie zu den Kunden- und Zahlungsinformationen, einschließlich der Prüfung auf doppelte Kunden. Danach geht es mit der Massenanlage der Servicevereinbarungen weiter. Für alle Fahrzeuge der Liste werden Serviceverträge erzeugt, unabhängig davon, ob sie über Fahrgestellnummer, Bestellnummer oder Deal ID identifiziert wurden. Dabei wird dieselbe Vertragsdokumentvorlage verwendet wie bei allen anderen Verträgen.

Die Aktivierung erfolgt nach dem bestehenden VdZ-Aktivierungsablauf, einschließlich der dort vorgesehenen Logik und Prüfungen. Wird ein Vertrag aktiviert, der mit einer Deal ID angelegt wurde, enthält die Aktivierungsbenachrichtigung an den Kunden die Deal ID sowie, sofern vorhanden, die dem Fahrzeug während der Verarbeitung zugeordnete Fahrgestellnummer.