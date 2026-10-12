# Batch 58 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Schadenscode in Schadensfällen berücksichtigt jetzt den Deckungscode**

Bei der Erfassung eines Schadensfalls wird der Schadenscode nun korrekt in Abhängigkeit vom Deckungscode (Coverage Code) behandelt. Zuvor wurde der Deckungscode bei der Auswahl bzw. Verarbeitung des Schadenscodes im Schadensfall nicht berücksichtigt. Diese Korrektur ist im Bereich Revenue Management umgesetzt und abgeschlossen.

**Neuer Belegtyp MDCR für die manuelle Schlussabrechnung von Verträgen (in Vorbereitung)**

Für Leasing- und Nicht-Leasing-Verträge wird im Modul Revenue ein neuer, manuell erstellbarer Finanzbeleg vom Typ MDCR (Manual Financial Document Contract Review) eingeführt. Er dient dazu, die finanzielle Schlussabrechnung eines Vertrags bei Vertragsende oder vorzeitiger Beendigung zu erfassen, etwa bei Mehrkilometern, bei der Endabrechnung nach vorzeitiger Fahrzeugrückgabe oder bei einer Vertragsstrafe. Die Berechnung des Betrags erfolgt weiterhin außerhalb von oneSCM. Der Beleg erfasst lediglich den bereits ermittelten Betrag. Dieses Vorhaben befindet sich noch in der Qualitätssicherung und ist noch nicht abgeschlossen. Die Beschreibung kann sich daher noch ändern.

Erstellt wird der Beleg manuell durch berechtigte Benutzer (MO/MPC) im Bereich „Finanzbelege“ des jeweiligen Vertrags. Eine neue Rolle ist dafür nicht erforderlich, es gelten die bestehenden Berechtigungen zur manuellen Belegerstellung. Der Beleg kann entweder als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) angelegt werden. Die Auswahl erfolgt bei der Erstellung.

Folgende Angaben werden bei der Erstellung gemacht: Als Belegempfänger wird der Eigentümer bzw. Zahler des Vertrags ausgewählt. Die SAP-Debitorennummer wird automatisch aus dem gewählten Belegempfänger übernommen und kann nicht bearbeitet werden. Optional kann eine Belegreferenz gewählt werden. Zur Auswahl stehen MDCR-Finanzbelege ab dem Status „FI-Beleg erstellt“ und später, etwa bezahlt oder in einer Mahnstufe, angezeigt wird die Rechnungsnummer des Finanzsystems. Der Kundenbelegtyp ist stets MDCR. Das Belegdatum liegt zwischen dem Vertragsbeginn und dem heutigen Tag. Nettobetrag, Steuerbetrag und Gesamtbetrag werden als nicht bearbeitbare Felder angezeigt.

Ein MDCR-Beleg enthält genau eine FI-Belegposition. Dort wird die Steuerklassifizierung ausgewählt, die mit der des gewählten Eigentümers bzw. Zahlers vorbelegt ist. Der extern berechnete Nettobetrag wird manuell als Pflichtangabe eingetragen, der Steuerbetrag wird anhand von Nettobetrag und Steuerklassifizierung automatisch berechnet. Zusätzlich ist ein Positionstext als Freitext Pflicht (maximal 255 Zeichen, wie bei MANU-Belegen), der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder „Beleg von“ und „Beleg bis“ sind optional, da ein MDCR-Beleg keinen Abrechnungszeitraum darstellt. Falls sie befüllt werden, liegen die Daten zwischen Vertragsbeginn und heute.

**Ablauf und Export**

MDCR-Belege durchlaufen den üblichen Belegzyklus: Erstellt, Akzeptiert, Exportiert, FI-Beleg erstellt, anschließend Bezahlt bzw. Mahnstufe. Der Export an das Finanzsystem erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei ist der Positionstext befüllt, der Kopftext bleibt leer. MDCR-Rechnungen sind auf der Seite „Finanzbelege“ sichtbar und können dort in der Ansicht angezeigt werden.

Für Leasingverträge von MBLD (Vertriebskanal Leasing und Belegtyp MDCR) wird der MDCR-Beleg zusätzlich per API an MBLD übermittelt. MDCR-Belege von Nicht-Leasing-Verträgen werden ausschließlich über den Standard-Export an das Finanzsystem übertragen und nie an MBLD gesendet.