# Batch 707 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Altteilsteuer bei manuell erfassten Werkstattrechnungen**

Wird eine Altteilsteuer von Vega über die Schnittstelle I156 übermittelt, erfasst oneSCM sie auf der Seite „Financial Control". Enthält eine per Papierbeleg bearbeitete, manuell erstellte Werkstattrechnung ebenfalls eine Altteilsteuer, wird diese nun gesondert behandelt. Beim Anlegen einer Werkstattrechnung unter „Payment-Bereich → Werkstattrechnung → Rechnung erstellen" stehen dem MO-Benutzer dafür die zusätzlichen Freitextfelder „Old Part Tax - Base" und „Old Part Tax" zur Verfügung. Dort trägt er die Beträge entsprechend dem Papierbeleg manuell ein. Dabei ist zu beachten, dass es unterschiedliche Belegarten gibt: Der Wert kann zu einer Rechnung oder zu einer Gutschrift gehören.

Die Rechnung durchläuft weiterhin den gewohnten Ablauf. Sie erhält zunächst den Status „Created" und wechselt nach der üblichen MO-Freigabe in den Status „Accepted". Bei externen Werkstätten wird sie anschließend per E167-Export an oneERP übertragen, bei internen Werkstätten erhält sie wie bisher den Status „Processed". Die in den beiden Altteilsteuer-Feldern erfassten Beträge dienen ausschließlich der Information in oneSCM. Sie werden nicht an oneERP übermittelt; der E167-Export enthält nur den beim Erstellen der Rechnung erfassten Nettobetrag ohne Altteilsteuer-Werte. Die Altteilsteuer für diese Fälle wird manuell im Finanzsystem bearbeitet, wobei die Werte aus oneSCM als Grundlage dienen.

Damit diese Angaben auch für Prüfungen (Audit) zur Verfügung stehen, gibt es auf der Seite „Financial Control" einen neuen Reiter „Old Part Tax - Manual". Der bisherige Reiter für die Altteilsteuer wurde in „Old Part Tax/I156" umbenannt. Sobald eine manuelle Werkstattrechnung mit Beträgen in den Feldern „Old Part Tax - Base" und „Old Part Tax" erstellt wurde, legt das System im neuen Reiter automatisch einen eigenen Datensatz mit dem Status „Processed" an.

Dieser Datensatz enthält folgende Angaben: die oneSCM-Rechnungsnummer als Link zur Ansicht der oneSCM-Werkstattrechnung, die Werkstattrechnungsnummer aus der Werkstattrechnung, das oneSCM-Rechnungsdatum, den Status, die Vertragsnummer als Link zum Vertrag sowie die Werkstatt-ID (Vega-Händler-ID). Hinzu kommen die Beträge für Altteilsteuer-Basis und Altteilsteuer, getrennt nach Gutschriftsbetrag und Rechnungsbetrag: Bei der Belegart „Gutschrift" werden die Werte als Gutschriftsbetrag angezeigt, bei der Belegart „Rechnung" als Rechnungsbetrag. Die Liste ist standardmäßig nach dem oneSCM-Rechnungsdatum absteigend sortiert, sodass der neueste Eintrag oben steht.

Für die Suche stehen folgende Kriterien zur Verfügung: die oneSCM-Rechnungsnummer (Textfeld, nur Zahlen, unscharfe Suche), das oneSCM-Rechnungsdatum (Datumsfeld), die Werkstattrechnungsnummer (Textfeld, nur Zahlen, unscharfe Suche) sowie die Werkstatt-ID.

**Weitere Änderungen in der Domäne Cost Management**

Zusätzlich wurde die Suche nach Schadencodes um weitere Filter erweitert. Außerdem wurde ein Problem behoben, bei dem der Filter für die Rechnungsart „CLAI" im Admin-Bereich keine Ergebnisse lieferte.