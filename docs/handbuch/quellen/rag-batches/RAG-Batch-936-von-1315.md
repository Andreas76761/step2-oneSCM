# Batch 936 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserzeugung: Neuerungen im Überblick**

**Trennung von Vertrags- und SEPA-Dokument sowie Van-Tests**
Die Dokumentenverarbeitung für Vertrag und SEPA-Mandat wurde so angepasst, dass beide Dokumente getrennt behandelt werden. Außerdem wurde der automatisierte Smoke-Test-Ablauf um Van-Fahrzeuge erweitert. Vans stehen für alle Kundentypen zur Verfügung, also für Privat-, Gewerbe-, Gewerbeflotten- und Behördenkunden. Der Testablauf bildet den Fall eines Gewerbeflottenkunden mit einer Van-Fahrgestellnummer ab und verwendet einen Händler mit der Rolle „isVan".

**Eigenständige i155-Datei pro Markt**
Bisher wurde die i155 ausschließlich für den deutschen Markt erzeugt. Künftig wird für jeden Markt eine separate i155-Datei generiert. Jede dieser Dateien wird einzeln per CFT an Vega übermittelt. Die Antwort von Vega, die nach der Verarbeitung der jeweiligen i155 eintrifft, wird ebenfalls pro Markt gespeichert.

**Überarbeitete Ansicht der MO-Prüfungen**
Die Ansicht „MO Checks" zeigt MO-Anwendern nun alle Prüfungen, die vor oder während der Vertragsaktivierung durchgeführt werden. So ist erkennbar, welche Prüfungen für den aktuellen Vertragsprozess relevant sind und welchen Status sie haben. Das sorgt für Einheitlichkeit und Transparenz über verschiedene Vertragsabläufe hinweg.

Sobald ein Vertrag im Ablauf der Vertragserzeugung (von „Created" bis „Active") den Status „Created" erreicht, werden auf der Seite MO Checks sämtliche Prüfungen angezeigt, unabhängig von Kundentyp, Branche oder Kennung. Die Prüfungen sind in folgende Kategorien gegliedert:

Zur Kategorie Fahrzeug gehören Erstzulassungsdatum, Laufleistung und Fahrgestellnummer. Die Preisprüfung umfasst die Kampagne. Die Produktprüfung enthält Produktvariante, Produktcode, Fahrzeugeignung und Produktkompatibilität. Die Kundenprüfung beinhaltet Kunde, Kunden-CAS-Prüfung, USt-ID, Lastschriftcode, SAP-Debitorennummer, FI-Systemstatus, Branche und Zahler-CAS-Prüfung. Die Dokumentenprüfung deckt Vertragsnummer, Dokumentenunterschrift, SEPA-Vertragsabgleich und SEPA-Dokumentenunterschrift ab. Unter Vertragserzeugung findet sich die Händlerprüfung.

In der Spalte „Status" wird für jede Prüfung der aktuelle Stand angezeigt. „N/A" bedeutet, dass die Prüfung für den aktuellen Vertragsablauf nicht zutrifft, etwa die USt-ID-Prüfung bei einem Privatkunden. „Ok" steht für eine erfolgreich abgeschlossene Prüfung, „Not ok" für eine abgeschlossene, aber fehlgeschlagene Prüfung. „Pending" zeigt an, dass die Prüfung begonnen, aber noch nicht abgeschlossen wurde. „Not yet available" bedeutet, dass die Prüfung noch nicht gestartet wurde. Prüfungen werden unabhängig von ihrer Relevanz für den aktuellen Ablauf angezeigt, wobei der Status die Einordnung erleichtert.

Dieses Verhalten gilt für den gesamten Verlauf des Vertrags: Es lässt sich bei der Anlage durch Händler, MO oder MPC beobachten, sobald der Vertrag den Status „Created" erreicht, und ebenso in den folgenden Status „Waiting for Confirmation", „Confirmed" und „Waiting for Activation". Die Oberfläche folgt dabei den Vorgaben der Mercedes-Benz Workbench.