# Batch 47 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Abschlussdokumente zur Vertragsprüfung (MDCR) im Bereich Revenue**

Im Revenue-Modul steht für den finanziellen Abschluss eines Vertrags, sei es zum Vertragsende oder bei vorzeitiger Beendigung, der Dokumenttyp FDCR (Final Document Contract Review) zur Verfügung. Er gilt für Leasing- und Nicht-Leasing-Verträge und bildet eine Schlussabrechnung ab, entweder als Rechnung bzw. Belastung oder als Gutschrift bzw. Erstattung. Sie gleicht die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem Vereinbarten aus. Beispiele sind eine Mehrkilometer-Abrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe im Leasing oder eine Vertragsstrafe bei vorzeitiger Beendigung. FDCR-Dokumente werden von oneSCM automatisch auf Basis des Endsaldo-Profils des jeweiligen Produkttyps erzeugt. In einigen Märkten wird dieser Mechanismus jedoch nicht genutzt, und die Berechnung erfolgt außerhalb von oneSCM. Für diese Fälle gibt es das manuell erstellte Dokument MDCR (Manual Final Document Contract Review). Die Berechnung selbst findet weiterhin extern statt. oneSCM erfasst und exportiert lediglich den bereits berechneten Betrag.

**Erstellung und Berechtigung**

Ein MDCR wird von einem berechtigten Benutzer der Rollen MO bzw. MPC im Bereich „Finanzdokumente“ des jeweiligen Vertrags angelegt, sobald der Abrechnungsbetrag extern ermittelt wurde. Es wird keine neue Rolle eingeführt. Es gelten die bestehenden Berechtigungen für die manuelle Dokumenterstellung. Die bisherige Erstellung eines MANU-Dokuments passt für diesen Zweck nicht, obwohl sich beide Dokumente ähneln.

**Felder des MDCR**

Beim Anlegen wählt der Benutzer als Dokumenttyp „Rechnung“ oder „Gutschrift“ (Pflichtfeld). Für Gutschriften gibt es keine Einschränkung. Als Dokumentempfänger wird der Eigentümer bzw. Zahler des Vertrags ausgewählt (Pflichtfeld, Verhalten wie bei MANU). Die SAP-Debitorennummer ist ein nicht editierbares Textfeld und wird automatisch mit der Nummer des gewählten Dokumentempfängers befüllt. Die Dokumentreferenz ist optional und funktioniert wie bei MANU. Zur Auswahl stehen MDCR-Finanzdokumente im Status „FI Doc created“ und in späteren Status (z. B. bezahlt, Mahnstufen), angezeigt wird die Rechnungsnummer des FI-Systems. Der Kundendokumenttyp ist immer MDCR. Das Belegdatum wird über einen Kalender gewählt und muss zwischen dem Vertragsbeginn und dem heutigen Tag liegen. Nettobetrag, Steuerbetrag und Gesamtbetrag werden als nicht editierbare Felder angezeigt.

Ein MDCR enthält genau eine FI-Dokumentposition. Die Felder „Dokument von“ und „Dokument bis“ sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt. Falls Daten angegeben werden, müssen sie zwischen Vertragsbeginn und heute liegen. Die Steuerklassifizierung ist ein Auswahlfeld, das mit der Steuerklassifizierung des gewählten Eigentümers bzw. Zahlers vorbelegt wird. Der Nettobetrag ist ein numerisches Pflichtfeld, in das der extern berechnete Betrag manuell eingetragen wird. Der Steuerbetrag ist deaktiviert und wird aus Nettobetrag und Steuerklassifizierung berechnet. Der Positionstext ist ein Pflicht-Freitextfeld mit maximal 255 Zeichen (wie bei MANU) und beschreibt die Berechnung, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“.

**Lebenszyklus und Export**

Ein MDCR durchläuft den üblichen Dokumentenlebenszyklus: Erstellt, Akzeptiert, Exportiert, FI Doc erstellt, anschließend Bezahlt bzw. Mahnstufe. Der Export an das Finanzsystem erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei ist der Positionstext befüllt und der Kopftext leer.

**Weiterleitung an MBLD**

Bei MBLD-Verträgen wird ein MDCR zusätzlich per API an MBLD gesendet. Ausgewählt werden die Dokumente anhand des Vertriebskanals „Leasing“ und des Dokumenttyps MDCR. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über E169/CoFiCo/SWT exportiert und niemals an MBLD gesendet.

**Anzeige**

Ein MDCR ist im Bereich „Finanzdokumente“ sichtbar und kann dort in der Detailansicht eingesehen werden.

**Hinweis zum aktuellen Stand**

Laut den vorliegenden Angaben existiert die API zur Auswahl und Übermittlung von Dokumenten an MBLD noch nicht, und eine abgestimmte Auswahllogik dafür ist noch nicht definiert. Die Zuständigkeit des Edge-Service-Teams ist noch nicht formal zugewiesen.