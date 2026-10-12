# Batch 1148 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation (Contract Calculation): Neuerungen und Änderungen**

**Verlängerung komplexer Produkte (Unlimited-Tire-Option)**

Bisher konnten komplexe Produkte nicht verlängert werden. Mit dieser Funktion können Anwender der Rollen MO und MPC ein komplexes Produkt verlängern. Der ursprüngliche Vertrag wird dabei auf Grundlage der Benutzerauswahl und der Produktkonfiguration verlängert.

Die Verlängerung läuft aus fachlicher Sicht in zwei Schritten ab. Bei einer kurzfristigen Verlängerung (Short Term) bietet die Produktdomäne einen Monatspreis an. Dabei gelten dieselben Bedingungen wie im regulären Prozess. Bei einer langfristigen Verlängerung (Long Term) stellt die Produktdomäne der Vertragsdomäne die Preise und die Spezifikation des komplexen Produkts zur Verfügung.

Welche Preise angeboten werden, hängt von der Preisregel ab, die am komplexen Produkt hinterlegt ist. Ist das Produkt mit „Pricing at sales date" gekennzeichnet, werden die Preise zum Verkaufsdatum ermittelt, und zwar auf Basis der Kalkulation des Servicevertrags mit komplexer Reifenoption. Ist das Produkt mit „Pricing at Prolongation date" gekennzeichnet, werden die Preise zum Verlängerungsdatum ermittelt. In beiden Fällen werden die Preise an die Vertragsdomäne übergeben.

Folgende Anforderungen sind abgedeckt: Komplexe Produkte können verlängert werden. Die Produktdomäne liefert Preise und Konfiguration an die Vertragsdomäne, entsprechend der Produkteinrichtung und den im Vertragsablauf gewählten Optionen. Die Reifenoption wird vom System als optionaler Deckungscode (Optional Coverage Code) behandelt.

**Neuberechnung bei vorzeitiger Ablösung (Early Settlement)**

Wenn ein Kunde das Zahlungsintervall ändern möchte, berechnet das System den vom Kunden noch zu zahlenden Restbetrag neu. Der Umfang sieht vor, dass ein Benutzer (MO/MPC) das Zahlungsintervall eines Vertrags auf „One Time" (Einmalzahlung) umstellen kann. Anschließend werden der Bruttobetrag je Intervall und der Nettobetrag je Intervall neu berechnet.

Die Daten werden dazu als Payload an die Vertragsdomäne gesendet. Die Payload enthält die neu berechneten Werte für den Bruttobetrag je Intervall und den Nettobetrag je Intervall. Die Vertragsdomäne soll die gesendeten Datenobjekte korrekt verarbeiten. Dies ist noch mit dem Team Brabus abzustimmen.

**Nicht umgesetzte Vorhaben**

Zwei ursprünglich geplante Vorhaben wurden abgebrochen und sind daher nicht Bestandteil dieses Releases. Das erste ist eine Prolongation-API für Leasing, die für die Verlängerung von Verträgen im Bereich MBLD vorgesehen war. Das zweite sind Tests und Anpassungen der Online-Sale-API, über die der Online-Verkauf Produkte aus der Produktdomäne für den Online-Shop abrufen sollte.