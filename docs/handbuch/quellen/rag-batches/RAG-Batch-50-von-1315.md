# Batch 50 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Korrekturen**

Im Bereich Revenue Management wird die Behandlung von Folgerechnungen nach einer vorzeitigen Abrechnung korrigiert. Wird nach einer vorzeitigen Abrechnung (Early Settlement) eine Verlängerung des Vertrags durchgeführt, fehlte bisher die geplante Rechnung. Dieses Verhalten wird behoben. Die Korrektur befindet sich derzeit noch in der Entwicklung.

**Neues manuelles Abschlussdokument (MDCR) für Leasing- und Nicht-Leasing-Verträge**

Für den Abschluss der finanziellen Position eines Vertrags, sei es bei Vertragsende oder bei vorzeitiger Beendigung, steht im Revenue-Modul künftig ein manuell erstellbares Finanzdokument vom Typ MDCR (Manual Final Document Contract Review) zur Verfügung. Es ist sowohl für Leasing- als auch für Nicht-Leasing-Verträge nutzbar. Typische Anwendungsfälle sind eine Kilometerüberschreitung bei einem Servicevertrag, die Endabrechnung bei vorzeitiger Fahrzeugrückgabe eines Leasingvertrags oder eine Vorfälligkeitsentschädigung. Die Berechnung des Betrags erfolgt weiterhin außerhalb von oneSCM, da jeder Vertragstyp und jeder Markt eigene Regeln hat. Das Dokument dient dazu, den bereits berechneten Betrag zu erfassen und zu exportieren. Bislang mussten für solche Fälle uneinheitlich benannte manuelle Dokumente verwendet werden, was zu Unklarheiten führte.

Ein MDCR-Dokument wird von berechtigten Benutzern der Rollen MO oder MPC im Bereich „Finanzdokumente“ des jeweiligen Vertrags erstellt. Dafür werden die vorhandenen Berechtigungen zur manuellen Dokumenterstellung verwendet; eine neue Rolle wird nicht eingeführt.

**Erfassung der Dokumentdaten**

Bei der Erstellung wählen Sie als Dokumenttyp „Rechnung“ oder „Gutschrift“ aus. Eine gutschriftsbezogene Einschränkung gibt es nicht. Als Dokumentempfänger wählen Sie den Eigentümer bzw. Zahler des Vertrags aus; die Auswahl verhält sich wie bei manuellen Dokumenten (MANU). Die SAP-Debitorennummer wird automatisch aus dem gewählten Empfänger übernommen und kann nicht bearbeitet werden. Optional können Sie eine Dokumentreferenz angeben. Zur Auswahl stehen MDCR-Finanzdokumente im Status „FI Doc created“ und in späteren Status (z. B. bezahlt oder Mahnstufen); angezeigt wird die Rechnungsnummer des Finanzsystems. Der Kundendokumenttyp ist immer MDCR. Das Belegdatum liegt zwischen dem Vertragsbeginn und dem heutigen Tag. Nettobetrag, Steuerbetrag und Gesamtbetrag werden als nicht bearbeitbare Felder angezeigt.

Ein MDCR-Dokument enthält genau eine FI-Dokumentposition. Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR keinen Abrechnungszeitraum abbildet. Falls Sie Daten angeben, müssen diese zwischen dem Vertragsbeginn und dem heutigen Tag liegen. Die Steuerklassifizierung ist mit der des gewählten Eigentümers bzw. Zahlers vorbelegt und kann über ein Dropdown geändert werden. Den extern berechneten Nettobetrag tragen Sie manuell ein; er ist ein Pflichtfeld. Der Steuerbetrag wird aus Nettobetrag und Steuerklassifizierung berechnet und kann nicht bearbeitet werden. Zusätzlich ist ein Positionstext als Freitext verpflichtend (maximal 255 Zeichen, wie bei MANU). Er beschreibt die Berechnung, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“.

**Ablauf, Export und Weitergabe an MBLD**

MDCR-Dokumente durchlaufen den üblichen Dokumentenlebenszyklus: Erstellt, Akzeptiert, Exportiert, FI Doc created und anschließend Bezahlt bzw. Mahnstufe. Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei ist der Positionstext befüllt, der Headertext bleibt leer. Nach der Erstellung sind MDCR-Rechnungen auf der Seite „Finanzdokumente“ sichtbar und lassen sich in der Ansichtsansicht einsehen.

Bei Leasingverträgen (Vertriebskanal Leasing und Dokumenttyp MDCR) wird das MDCR-Dokument zusätzlich per API an MBLD übermittelt. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über E169/CoFiCo/SWT exportiert und niemals an MBLD gesendet.