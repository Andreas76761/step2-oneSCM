# Batch 604 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Änderungen und Verbesserungen**

Bei der Prüfung von Kunden (CAS-Prüfung) wird die zuständige Clearing-Gruppe nun aus den Markteinstellungen übernommen. Dort ist unter dem Namen der Customer-CAS-Clearing-Gruppe standardmäßig „CAS.CL_MBVD_GC“ hinterlegt. Die Zuweisung ist notwendig, weil bei einem möglichen Treffer genau diese Gruppe den Datensatz erhält und für die weitere Untersuchung und Klärung verantwortlich ist.

Neu ist außerdem das Feld „Kontovermerk“ (englisch „Account Note“), das aus dem FI-System stammt und für alle bekannten Kundenarten gilt: privat, privat-behördlich, gewerblich, gewerblicher Fuhrpark und gewerblich-behördlich. Das Feld erscheint im Bereich „Receivables from FI System“ der Zahlungsinformationen, jeweils neben der SAP-Debitorennummer, überall dort, wo diese Forderungen angezeigt werden. Das betrifft den Vertragsvorschlag (Kunden- und Zahlungsinformationen sowie Übersicht und Bestätigung), die Vorschlagsverwaltung (Reiter „Kunde“), die Vertragsverwaltung (Reiter „Kunde“) sowie die Kundenverwaltung (Vorschau, Ansicht, Bearbeiten, der Reiter „Historie“ und der FI-System-Status). Der Wert wird immer als vollständige Bezeichnung angezeigt. Er kommt stets mit genau einem Wert aus dem FI-System, am häufigsten „S – Sofortzahler“, ist nicht von der Zahlungsart abhängig und kann von keinem Benutzer bearbeitet werden. Eine Änderung erfolgt ausschließlich durch eine Aktualisierung aus oneERP. Mögliche Werte sind:

- SB – Schlechtzahler (Kunde wurde gemahnt / Einzug ist fehlgeschlagen)
- SI Insolvenz – insolventer Kunde
- SJ RA Stuttgart – juristischer Kunde, wird verklagt
- SJ RA Sachman – juristischer Kunde, verklagt uns
- K – Kreditkonto, Zahlung auf Rechnung
- KB – Lastschrifteinzug/SEPA
- S – Sofortzahler
- ZZ – ehemaliger Jurist, Vorgang abgeschlossen

Für die Auswirkungen auf Verträge ist vorgesehen: Kommt bei der Vertragserstellung initial einer der Werte SB, SI oder SJ aus oneERP, wird der Vertrag abgelehnt. Kommt bei einem bestehenden Vertrag eine Aktualisierung mit SB oder SI, wird der Vertrag gesperrt. Für eine Aktualisierung mit SJ muss das Vorgehen noch mit der Rechtsabteilung geklärt werden. Die vertragsbezogenen Auswirkungen lassen sich erst nach Umsetzung einer zugehörigen Abhängigkeit testen.

Bei der Kundensuche und dem Kundenabgleich gab es mehrere Korrekturen. Die Suche nach einem aktiven Gewerbekunden liefert wieder Ergebnisse. Beim gewerblichen Kundenabgleich werden Kunden vom Typ MBLD/MBFS nicht mehr angezeigt und sind im Vertragsvorschlag nicht mehr auswählbar, da Verträge für diese Kundentypen über eine Schnittstelle (API) angelegt werden. Im Synchronisationsabgleich wurde zudem ein falsch verwendetes Telefonnummernfeld korrigiert.

Auch bei der Synchronisation zwischen oneERP und oneSCM wurde eine Anpassung vorgenommen. In oneERP sind die Felder zum Datum und zur Uhrzeit der letzten Änderung in deutscher Zeitzone hinterlegt, während oneSCM das GMT-Datumsformat verwendet. Damit die Synchronisation korrekt funktioniert, wird nun das GMT-Datumsformat verwendet.

Weitere Fehler wurden behoben: Eine aktualisierte SAP-Debitorennummer erscheint nun in der Kundenhistorie. Der Status „SAP Debtor Number – Not OK“ bleibt nicht mehr bestehen, nachdem der Vorgang abgeschlossen ist. Bei der Vertragserstellung wird in den Kundeninformationen jetzt die fehlende Validierungsmeldung für die Mobilnummer angezeigt, ebenso der zuvor fehlende Validierungstext zur Steuernummer. Außerdem ließ sich ein Vertrag mit einem Gewerbekunden nicht anlegen, weil die Steuernummer als Pflichtfeld markiert war; auch dieses Problem wurde behoben.