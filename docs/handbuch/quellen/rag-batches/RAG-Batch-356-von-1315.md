# Batch 356 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Documents & Communications**

Im Zahlungsinformations-Assistenten (Payment Information Wizard) wird eine spezifische Meldung angezeigt, wenn als Zahlungsart „Pre Activation" gewählt ist. Diese Funktion ist bereits im Einsatz.

**Rechtlicher Hinweis zur Annahme der AGB im Angebot (produktspezifisch)**

Auf dem Angebotsdokument wird oberhalb des Unterschriftsbereichs ein Hinweis angezeigt, mit dem der Kunde bestätigt, dass er mit der Unterzeichnung auch den Allgemeinen Geschäftsbedingungen (Terms and Conditions) zustimmt. Der Name des AGB-Dokuments, das dem im Vertrag verwendeten Produkt zugeordnet ist, wird dabei im Hinweistext genannt. Hierfür steht die neue Druckvariable {TermsandConditions} zur Verfügung, die sowohl in Dokumenten als auch in Benachrichtigungen verwendet werden kann. Die englische Fassung lautet: „By signing this contract, you also agree with the terms and conditions stated in {TermsandConditions}." Die deutsche und die slowakische Fassung werden vom jeweiligen Markt festgelegt. Die Märkte müssen dazu ihre Vorlagen in der Landessprache selbst anpassen, da standardmäßig die englische Vorlage verwendet wird.

Der Hinweis wird für alle Kundentypen angezeigt und ist so gestaltet, dass er für den Kunden gut sichtbar und leicht lesbar ist. Das gilt für alle Unterschriftswege: E-Signatur, E-Mail und Dokument-Upload. Das Format richtet sich nach den vorgegebenen Richtlinien, wird aber hervorgehoben dargestellt. Der Hinweis erscheint zudem auf dem Entwurf des Angebotsdokuments, der im Vertragserstellungsprozess (Contract Generation) erzeugt wird. Das Angebotsdokument, das mit der Vertragsbestätigungs-E-Mail versendet wird, enthält ebenfalls den Hinweis.

**Geänderte Benennung hochgeladener Dokumente**

Bisher wurde ein hochgeladenes AGB-Dokument beim Speichern der Vorlage automatisch umbenannt. Da AGB-Dokumente einzelnen Produkten zugeordnet sind und jedes Produkt andere Inhalte erfordern kann, entfällt diese automatische Umbenennung. Die Dokumente behalten nun ihren ursprünglichen Dateinamen. Enthält der Dateiname Leerzeichen, werden diese durch Unterstriche ( _ ) ersetzt.

Unter „Market Settings" > „Template Management" > Registerkarte „Documents" gilt beim Erstellen oder Bearbeiten einer AGB-Vorlage Folgendes: Wird als Dokumenttyp „Upload" gewählt, trägt das Dokument nach dem Speichern exakt den Namen der hochgeladenen Datei. Wird als Dokumenttyp „Edit" gewählt, lautet der Dokumentname nach dem Speichern der AGB-Name mit der Endung .pdf. Dieselbe Logik gilt, wenn das AGB-Dokument über „Product Management" > „Manage Product and Prices" angelegt wird.

Der ursprüngliche Dateiname wird an folgenden Stellen verwendet: Das AGB-Dokument, das der E-Mail zur Angebotsbestätigung (Proposal Confirmation) angehängt ist, trägt den Originalnamen. Beim Herunterladen des AGB-Dokuments im Contract-Generation-Prozess wird ebenfalls der Dokumentname verwendet. Der Tooltip des AGB-Symbols in diesem Prozess bleibt unverändert „View Terms and Conditions". Unter „Contract Management" > „Communication" > Registerkarte „Documents" zeigt die Spalte „Document Name" den Originalnamen des Dokuments an. Wird ein AGB-Dokument ersetzt, erscheint der Name des neuen Dokuments in dieser Spalte. Beim Klick auf „Send Email" steht der Dateiname der AGB im Dialog unter „Choose Attachments" zur Auswahl. Ruft der Kunde über die Aktivierungs-E-Mail den CAC-Link auf, sieht er das AGB-Dokument ebenfalls mit dem ursprünglichen Dateinamen.