# Batch 907 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Neuerungen im Bereich Contract Generation**

**Lakh-Preisformat in den Markteinstellungen**

Für Märkte mit abweichenden Preisschreibweisen wurde ein zusätzliches Preisformat eingeführt. Im indischen Markt werden Preise in Lakh angegeben, beispielsweise als 1,00,000.00. Dieses Format stand bisher im System nicht zur Verfügung. Das Preisformat wählen Sie im Administrationsbereich unter „Market Setting", dort in den „General Settings" im Abschnitt „Format". Im Dropdown-Feld „Price Format" steht nun zusätzlich der Wert 1,00,000 zur Verfügung, der als Lakh-Format bezeichnet wird und für den indischen Markt vorgesehen ist. Damit können Märkte ihre Preise in Lakh pflegen. Nach der Auswahl des Formats werden die Preise bei der Erstellung eines Vertrags entsprechend dargestellt. Im indischen Markt erscheint ein Preis somit beispielsweise als 5,00,000 INR. Die Funktion richtet sich an die Rolle MPC.

**Sonderfall (Special Case) abhängig von der Produktkonfiguration**

Ob für ein Produkt eine Sonderfallanfrage („Special Case") gestellt werden kann, lässt sich nun auf Produktebene steuern. Ein Marktnutzer kann festlegen, dass nur bestimmte Produkte eine solche Anfrage erlauben. Der Markt kann damit gezielt entscheiden, für welche Produkte ein Sonderfall angeboten wird. Die Rollen entsprechen den bisherigen.

Dazu enthält jedes Produkt in seiner Definition eine Konfiguration, für welche Kundentypen eine Sonderfallanfrage zulässig ist. Das System ermittelt bei der Vertragserstellung den Kundentyp, und zwar unabhängig von der Division. Im Ablauf wählt der Vertrieb den Kundentyp aus und gibt die Kennung ein. Das System ruft anschließend über den Produkt-Microservice die verfügbaren Produkte samt Konfigurationen und Preisen ab und prüft für jedes Produkt die hinterlegte Konfiguration zur Sonderfall-Berechtigung.

Ist der Sonderfall für den jeweiligen Kundentyp erlaubt, wird die Sonderfallfunktion aktiviert. Ist er nicht erlaubt, wird die Funktion ausgeblendet oder deaktiviert. Der Schritt 5 im Contract-Generation-Ablauf, die Sonderfallanfrage, ist daher nur sichtbar, wenn der passende Kundentyp ausgewählt wurde und das Produkt eine Sonderfallanfrage zulässt. Vertriebsmitarbeitende sehen so nur die Optionen, die ihnen zur Verfügung stehen, und ungültige Sonderfallanfragen werden verhindert. Dies stellt sicher, dass die Vorgaben der Produktsteuerung und der Preisgestaltung eingehalten werden. Änderungen an der Benutzeroberfläche waren hierfür nicht erforderlich.

**Weitere Themen in Planung**

Für die Erweiterung der VdZ-Integration um P.EN-Daten sowie für die Verbesserung der Sticker-/Target-Price-Kampagne (Real Sticker Price) liegen derzeit noch keine näheren Beschreibungen vor. Die Themen sind offen, weitere Informationen folgen, sobald sie verfügbar sind.