# Batch 168 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen im Überblick**

**Markteinstellung zur Steuerung der Nemesis-Ereignisse**

Bisher hat oneSCM sämtliche buchhaltungsrelevanten Ereignisse automatisch an Nemesis übermittelt. Mit der neuen Markteinstellung können HQ-Administratoren nun produktbezogen festlegen, ob diese Ereignisse erzeugt werden. Damit lässt sich das System an unterschiedliche buchhalterische Anforderungen oder Produkttypen anpassen.

Auf der Seite für die Markteinstellungen steht eine Liste der Produkte des Marktes zur Verfügung. Dort wählen HQ-Administratoren in einem Dropdown die Produkte aus, für die Ereignisse an Nemesis gesendet werden sollen. Ist ein Produkt nicht ausgewählt, werden dafür weder Vertragsstamm-Ereignisse noch Umsatz- bzw. Nicht-Vega-Kosten-Ereignisse noch Kundenereignisse erzeugt. Ist ein Produkt ausgewählt, erzeugt oneSCM alle vier Ereignisarten. Die Einstellungen lassen sich speichern, sodass das System die getroffene Auswahl beibehält. Jede Änderung wird mit Zeitstempel und Benutzerkennung protokolliert. Die Konfiguration ist für die Bereiche PC und Van getrennt umgesetzt: Es gibt zwei separate Seiten bzw. Reiter für Nemesis, wobei jeder Reiter ein Dropdown mit den zur jeweiligen Division gehörenden Produkten enthält.

**Verbesserte Betragsplausibilitätsprüfung mit Fehlerinformationen aus der Rückmeldedatei**

Die Betragsplausibilitätsprüfung für oneERP wurde verbessert, damit Abweichungen bei Rechnungen klar erkennbar sind. Sie richtet sich an MO, MPC und Administratoren, die Probleme bei der Rechnungsvalidierung schnell erkennen und beheben möchten, um korrekte Finanzdaten sicherzustellen.

Nach dem Export einer Datei an das FI-System erscheint der Eintrag auf der Seite „Financial Control“ und zeigt den exportierten Betrag an. Nach dem Versand wartet das System eine definierte Zeit (zum Beispiel zwei Stunden) auf die Rückmeldung. Ist die Rückmeldung nach Ablauf dieser Frist unvollständig, wird die Prüfung als „Not OK“ markiert.

Hat ein Eintrag den Status „Waiting“ oder „Not OK“, können die Details über die Spalte „Action“ im Dialog „More Details“ eingesehen werden. Die betroffenen Rechnungen werden dort in zwei Kategorien dargestellt. „Missing Feedback“ enthält Rechnungen, für die keine Rückmeldung eingegangen ist. „Mismatch Amount“ enthält Rechnungen, für die zwar eine Rückmeldung vorliegt, deren Beträge aber nicht übereinstimmen. In beiden Kategorien werden die Vertragsnummer mit Link zum Vertrag und die oneSCM-Rechnungsnummer mit Link zur Rechnung angezeigt. Enthält eine Kategorie keine Einträge, wird sie nicht angezeigt, und die Darstellung passt sich automatisch an.

**Behobene Störung: Zahlungsdauer wird nicht geladen und Rechnungen werden nicht erzeugt**

Ein Fehler, bei dem die Zahlungsdauer nicht geladen wurde und dadurch keine Rechnungen erzeugt wurden, wurde behoben.

**Verbesserte Zahlungsplanerstellung (in Vorbereitung)**

Bisher konnte es vorkommen, dass ein Vertrag bei der Aktivierung trotz fehlerhafter Daten aktiviert wurde, obwohl kein Zahlungsplan vorhanden war. Die Kommunikation zwischen Vertragserstellung bzw. Vertragsverwaltung und Revenue wird deshalb geändert. Die Zahlungsplanerstellung erfolgt künftig nicht mehr über ein Kafka-Ereignis, sondern über eine REST-API. Liefert die Erstellung des Zahlungsplans nicht den Status 200 zurück, wird der Vertrag nicht aktiviert, und eine Fehlermeldung informiert die Benutzer über das Problem. Diese Funktion befindet sich derzeit noch im Test und ist noch nicht freigegeben.