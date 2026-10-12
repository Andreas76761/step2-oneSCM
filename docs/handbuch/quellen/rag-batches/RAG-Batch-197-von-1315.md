# Batch 197 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Änderungen**

**MPay: Zahlung per UPI und NetBanking**

Die MPay-Funktionen in oneSCM wurden erweitert. Nutzer können Rechnungen jetzt auch per UPI oder NetBanking bezahlen. Beide Zahlungsarten werden ausschließlich in Indien verwendet. Für beide Verfahren erzeugt oneSCM aus der Rechnung heraus einen Zahlungslink. Die Erzeugung ist nicht in die Vertragserstellung integriert. Die Angaben im Zahlungslink, insbesondere der Rechnungsbetrag, entsprechen den Angaben in der Rechnung. Öffnet der Kunde die HPP-URL, sieht er eine Maske mit Eingabefeldern. Dort bezahlt er mit seinen UPI-Zugangsdaten bzw. mit seinem NetBanking-Konto. In beiden Fällen wird der Status der Rechnung empfangen und verarbeitet.

Rechnungen, die per UPI oder NetBanking bezahlt wurden, werden je nach Markt an SWT und/oder CoFiCo exportiert. Die Zahlart in der H-Zeile folgt dabei diesen Zuordnungsregeln: Karte wird als „Z“ übermittelt, NetBanking als „Y“ und UPI als „Z“.

**MPay: Rückbuchung (Chargeback)**

oneSCM kann nun Rückbuchungen bei MPay-Transaktionen verarbeiten. Erkennt ein Kunde eine Transaktion nicht als seine eigene an, kann er seine Bank informieren und die Stornierung verlangen. Die Bank bucht die Transaktion zurück und der Kunde erhält sein Geld erstattet. oneSCM wird über das Benachrichtigungssystem über die Rückbuchung informiert.

Sobald die Rückbuchungsinformation eingeht, bleibt der Status der Rechnung unverändert. Der MPay-Status wird auf „Chargeback“ gesetzt. Zusätzlich erzeugt oneSCM automatisch eine Gutschrift mit denselben Angaben wie die zurückgebuchte Rechnung, etwa Zahler und Betrag. Die Gutschrift hat nach der Erstellung den Status „Created“ und muss vom MO freigegeben werden. Rechnung und Gutschrift werden per Batch-Jobs verarbeitet und an das FI-System gesendet.

**Weitere Themen im Bereich Revenue Management**

Der Import des E169-Feedbacks in das S3-Verzeichnis per manuellem Vorgang befindet sich derzeit noch in der Entwicklung. Hintergrund ist, dass das oneERP-Team sein Customizing überarbeiten muss und deshalb den Rechnungs-Feedback derzeit nicht senden kann. Dieses Feedback wird jedoch für den NEMESIS-Prozess benötigt. Damit nachfolgende Prozesse ausgeführt werden können, soll die Feedback-Datei, die aus einem Tabellenauszug von oneERP erstellt wurde, manuell importiert werden.

Folgende Punkte wurden abgeschlossen: die Vereinheitlichung der Verarbeitungsnummer bei Rechnung und Gutschrift (E169), eine Korrektur im Zusammenhang mit dem Entfernen einer Rechnung aus der Datenbank bei einem Zahlungsplan, die Korrektur der fehlenden Rechnungsstatusaktualisierung nach einem CFDM-Trigger, die Korrektur eines Ereignisses mit der Händlernummer 20000, das gesendet wurde, obwohl kein Händler definiert war (BE), die Korrektur der Filter im Admin-Bereich für Rechnungen, die keine Werte zurückgegeben haben, sowie die Korrektur eines E2E-Tests (BE).

Nicht umgesetzt wurden die Anpassung des Zahlungsplans bei Vertragskündigung sowie eine Anpassung der Benutzeroberfläche bei den Planvorschauen. Mit dieser Anpassung sollte ein Hinweis ergänzt werden, dass sich bei Sammelrechnungen minimale Abweichungen im Cent-Bereich ergeben können, weil oneERP die Steuer nicht je Rechnungsposition, sondern auf Basis der Summe berechnet. Der vorgesehene Hinweistext lautete: „Steuerbeträge können bei Sammelrechnungen minimal abweichen – maßgeblich für die Rechnungsstellung sind die Steuerbeträge zum Zeitpunkt der Ausführung des Rechnungslaufes im Abrechnungssystem.“ Beide Punkte wurden abgebrochen.