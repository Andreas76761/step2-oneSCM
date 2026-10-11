# Batch 578 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Partner Management: marktindividuelle Händlertabelle**

Die Tabellen im Partner Management waren bisher globale Listen und haben den Markt des angemeldeten Benutzers nicht berücksichtigt. Die Händlertabelle (Dealership) ist nun als marktindividuelle Liste umgesetzt, die sich am Mandanten (Tenant) des angemeldeten Benutzers orientiert. Die Daten werden serverseitig gefiltert, sodass ausschließlich die Händler des Marktes angezeigt werden, dem der Benutzer bei der Anmeldung zugeordnet ist. Die Tabelle wird auf Marktebene gepflegt.

Auch bei der Registrierung von Händlern gilt der Marktbezug: Benutzer können einen Händler, einzeln oder per Upload, nur für den Markt registrieren, mit dem sie angemeldet sind. Es lassen sich ausschließlich Händler finden und registrieren, die dem eigenen Markt zugeordnet sind. Geben Benutzer die GS-Outlet-ID eines Händlers eines anderen Marktes ein, werden keine Daten in die Registrierungstabelle übernommen. Stattdessen erscheint ein Hinweis, dass der Benutzer bzw. der Markt keine Zugriffsberechtigung für diese Händler besitzt.

**Partner Management: marktindividuelle Markttabelle**

Auch für die Markttabelle ist vorgesehen, dass sie als marktindividuelle Liste geführt wird, abhängig vom Mandanten des angemeldeten Benutzers. Die Markttabelle wird für die Erstellung internationaler Rechnungen benötigt. Benutzer können weiterhin andere Märkte anlegen als den Markt, mit dem sie angemeldet sind. Es werden weiterhin alle Märkte angezeigt, die Liste richtet sich jedoch nach dem Anmeldemarkt des Benutzers.

Hintergrund ist, dass sich die SAP-Debitorennummer eines Marktes je nach betrachtendem Markt unterscheidet, da die Märkte unterschiedliche FI-Systeme verwenden. Bisher werden die Nummern aus Sicht des Marktes Deutschland gepflegt. Aus Sicht eines anderen Marktes weicht die Debitorennummer ab. So unterscheidet sich zum Beispiel die SAP-Debitorennummer für Luxemburg aus Sicht der Slowakei von der Nummer in Deutschland. Der Status dieser Änderung ist als „Geschlossen“ geführt; die Umsetzung wird hier daher nicht als abgeschlossene Funktion beschrieben.

**Zahlungsreferenz in Übersicht und Bestätigungsseite**

Behoben wurde ein Fehler, bei dem die Zahlungsreferenz (Payment Reference) in der Übersicht und auf der Bestätigungsseite nicht gespeichert wurde.