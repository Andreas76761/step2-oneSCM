# Batch 196 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Änderungen und Hinweise zum aktuellen Stand**

**Operation-ID in der Ausgangsrechnungsdatei (umgesetzt)**
Die Struktur der Ausgangsrechnungsdatei wurde angepasst: Anstelle der Merchant Reference wird nun die Operation-ID ausgegeben. Dies gilt sowohl für die SWT-Datei als auch für die CoFiCo-Datei. Die genauen Zuordnungsregeln sind in der jeweiligen Mapping-Dokumentation zum SWT- und zum CoFiCo-Export beschrieben.

Für Rechnungen, die über MPay bezahlt wurden, gilt zusätzlich eine Regel für den Batch-Job: Rechnungen werden nur dann in den Status „Accepted" überführt, wenn der MPay-Status nicht „PENDING" lautet. Welche Operation-ID exportiert wird, richtet sich nach dem MPay-Status. Bei „Capture" wird die Operation-ID der Capture-Transaktion in die SWT- und CoFiCo-Datei übernommen, bei „Refund" die Operation-ID der Erstattung und bei „ChargeBack" die Operation-ID der Rückbuchung.

**Validierungen für die oneERP-Ausgangsdateien E167, E169 und E174 (derzeit in Abnahmetests blockiert)**
Eine Erweiterung ist vorgesehen, die Fehler bereits in oneSCM erkennt, bevor eine Datei die AIF-Lösung von oneERP erreicht. Hintergrund sind Probleme bei der Erstellung der E169-Dateien in der Anfangszeit des Betriebs. Solche Fehler erfordern aufwendige Korrekturen, etwa das Zurückrollen von Batch-Jobs oder Anpassungen in der Datenbank. Die Validierungen sollen diesen Aufwand verringern und die Ursache der Probleme beheben. Nutzen haben vor allem Admin-Benutzer der Zentrale (HQ), da sich der Aufwand zur Fehlerbehebung im AIF-Monitoring der Schnittstellen reduziert. Bislang ist diese Funktion nicht implementiert. Der Status der Umsetzung ist aktuell „Blocked BAT Testing".

Für die Datei E169 ist vorgesehen, dass immer eine Debitorennummer angegeben ist. Ob diese inhaltlich korrekt ist, wird dabei nicht geprüft. Außerdem sollen die Processing-Nummer und die oneSCM-Rechnungsnummer jeweils eindeutig sein, und die QSD5-Nummer muss angegeben und darf nicht leer sein.

Für die Datei E174 soll in den Zeilen 40 und 50 stets ein Profitcenter angegeben sein. Zudem sind eine Auftragsnummer und ein Positionstext erforderlich, und auch hier muss die QSD5-Nummer angegeben sein.

Für die Datei E167 müssen Steuerkennzeichen, eine Kreditorennummer und eine oneSCM-Rechnungsnummer angegeben und nicht leer sein. Auch hier ist die QSD5-Nummer verpflichtend.

**Behobene Probleme**
Im E169-Exportfile für oneERP fehlte bei Gutschriften die SAP-Debitorennummer. Dieses Problem wurde bearbeitet und geschlossen. Ebenfalls abgeschlossen wurde eine Anpassung der Synchronisierung beim Start der Anwendung, damit zu Beginn der Synchronisierung bereits alles bereitsteht.

**Nicht weiterverfolgte Vorhaben**
Vier Vorhaben wurden abgebrochen und sind daher in oneSCM nicht verfügbar: die Behandlung von Deferred Logic in SWT, die Zahlungsart Banküberweisung für Behördenkunden mit Versand der Rechnungen an oneERP, die Aktualisierung der Hauptnavigation für Revenue & Cost Management sowie ein weiteres, nicht näher beschriebenes Vorhaben im Bereich Revenue Management. Für diese Punkte lagen keine inhaltlichen Beschreibungen vor.