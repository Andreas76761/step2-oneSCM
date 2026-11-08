# Batch 789 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 53 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management: Änderungen und Verbesserungen**

Im Bereich Vertragsverwaltung wurden mehrere Fehler in der Benutzeroberfläche behoben. Nach einer Vertragsverlängerung (Prolongation) erfolgt nun die korrekte Weiterleitung. Beim Vertragsübertrag wurde ein Fehler korrigiert: Die USt-IdNr. war nicht als Pflichtfeld gekennzeichnet, führte aber beim Klick auf „Weiter“ zu einer Fehlermeldung. Außerdem wird beim Öffnen der Seite „Operative Review“ in der Vertragsprüfung kein Bad-Request-Fehler mehr ausgelöst. Auch in der Historie eines Vertrags wurde eine Darstellungskorrektur im Zusammenhang mit der Kilometer-Einheit vorgenommen, die dort zuvor nur als Platzhalter angezeigt wurde.

Für das Zielsystem VEGA wurde der Vertragstyp auf Blueprint-Ebene geändert. Alle bestehenden Verträge in beliebigem Status wurden in der Produktivumgebung von oneSCM in der Datenbank angepasst und erneut über die Schnittstelle I155 an VEGA übermittelt. Die Vertragstypen wurden dabei wie folgt umgestellt: 1P_CPLC auf 1P_FSV, 1P_SC auf 1P_MTN und 1P_TC auf 1P_TRS. Zu Dokumentationszwecken wurden eine Liste der Verträge mit dem VEGA-Vertragstyp vor und nach der Änderung sowie die zugehörige Abfrage bereitgestellt.

Auch im Hintergrund wurden Verbesserungen vorgenommen. Der Batch-Job ContractEsSyncJob schlägt in der DEV-Umgebung nicht mehr fehl. Ebenso laufen die Jobs I155ToVegaEXP und das Löschen von Verträgen in der DEV-Umgebung wieder fehlerfrei, nachdem zuvor ein fehlender Kunde Probleme verursacht hatte.

Beim Löschen von Dokumenten gilt nun eine geänderte Prüfung: Die Signatur wird ausschließlich bei SEPA-Dokumenten kontrolliert. Ist ein SEPA-Dokument signiert, wird es nicht zur Löschung übergeben, da dies über den Kundenservice erfolgt. Nicht signierte SEPA-Dokumente werden vom Vertragsservice zur Löschung markiert. Vertragsdokumente können auch dann zur Löschung gesendet werden, wenn sie signiert sind. AGB-Dokumente (T&C) werden nicht zur Löschung markiert, da sie mit Produkten verknüpft sind.

Bei der Long-Term-Verlängerung wird künftig die Benutzer-ID des Nutzers (MO) übermittelt, der den Vorgang auslöst. Zuvor wurde die ID des Nutzers verwendet, der den Vertrag erstellt hat; bei MBLD-Verträgen war dies der Kong-User. Entsprechend werden die Werte für dealerId beim Aufruf des DSS-Signatur-Endpunkts sowie die recipientId aus dem RecipientDto desselben Aufrufs angepasst.

Zudem wurde das umbenannte Reifenzähler-Feld in den Vertragsdetails geprüft. Dies betrifft Verträge, die mit einem Reifenprodukt verknüpft sind.

Darüber hinaus befinden sich zahlreiche Testfälle zu Vertragsdatenänderungen (etwa Kennzeichen, Anfangskilometer, Aktion und Zahlweise) sowie zu Vertragsenden (etwa durch Verkauf, Kundenanfrage, Diebstahl, Totalschaden oder Sonstiges, mit unterschiedlichen Kilometerständen und Fristen von bis zu bzw. mehr als 90 Tagen) derzeit in Prüfung oder noch offen. Diese sind noch nicht abgeschlossen.