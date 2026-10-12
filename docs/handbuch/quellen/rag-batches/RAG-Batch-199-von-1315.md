# Batch 199 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise Revenue Management**

Im Bereich Revenue Management wurden mehrere Anpassungen an den Exporten zu OneERP sowie an der Verwaltung von Schadencodes und Rechnungsstatus vorgenommen. Beachten Sie, dass einzelne Punkte noch in Prüfung oder nicht umgesetzt sind (siehe unten).

**Umstellung von NACOS auf OneERP**

Da NACOS außer Betrieb genommen wurde und OneERP nun das Finanzsystem für den deutschen Markt ist, werden die NACOS-Batch-Jobs SAPInvE167EXP, SAPInvE169EXP und SAPInvE174EXP aus der Batch-Job-Liste entfernt. Administratoren finden diese Jobs im Bereich Admin unter „Batch Jobs“ daher nicht mehr. Auch der zugehörige Programmcode wurde bereinigt. Die Funktionen der OneERP-Exporte sollen dadurch nicht beeinträchtigt werden. Dazu wurden die OneERP-Batch-Jobs erneut getestet und die exportierten Dateien geprüft.

**Anpassungen an den Exporten**

Beim Export E174 für Händlerrabatte und Händlerprovisionen an OneERP wurden die Texte und Zuordnungen angepasst. Im Kopfsatz (Satzart „1“) richtet sich der Belegkopftext nach dem Rechnungstyp: Bei Händlerrabatten lautet er „SC Dealer Subsidies_MMYY“, bei Händlerprovisionen „SC Commissions_MMYY“. MMYY steht dabei für den zweistelligen Monat und die letzten zwei Stellen des Jahres.

Im Positionssatz (Satzart „2“) gelten folgende Regeln für den Positionstext. Bei Zeilen mit Buchungsschlüssel „40“ lautet der Text „Auftragsnummer_Kundenname“, zum Beispiel „7322102411_Michael Retzlaff“. Als Kundenname gilt der Vertragsinhaber, an den der Vertrag verkauft wurde. Wird die Grenze von 50 Zeichen überschritten, wird der Kundenname entsprechend gekürzt. Bei Zeilen mit Buchungsschlüssel „50“ lautet der Text „OwnR_SUBV_Produkt_Auftragsnummer“, zum Beispiel „OwnR_SUBV_Select Plus_7322102411“. Ist der Text länger als 50 Zeichen, bleiben die festen Bestandteile und die Auftragsnummer erhalten, und der Produktname wird gekürzt, sodass die Gesamtlänge 50 Zeichen beträgt.

Auch das Erlösgebiet (Revenue Area) wird neu bestimmt. Bei Zeilen mit Buchungsschlüssel „40“ wird die VEGA-ID des Händlers verwendet und um eine „0“ ergänzt. Bei Zeilen mit Buchungsschlüssel „50“ richtet sich das Erlösgebiet nach dem Produkt: Complete 268000, Select Plus 268010, Select 268020, Best Basic 268030, Extend Plus 268030 und Extend 268060.

Für den Export E174 bei Verkaufskampagnen wurde das Erlösgebiet (Retail-ID) für Verkäufe (Zeile 40) von 269010 auf 201050 geändert. Das gilt ausschließlich für Verkaufskampagnen.

Für den Export E167 wurde ein Reifen-Profitcenter ergänzt. Beim Export E169 wurde die Vergabe der Verarbeitungsnummer korrigiert, sodass dieselbe Nummer für mehrere oneSCM-Rechnungsnummern verwendet werden kann. Sammelrechnungen sind davon ausgenommen. Außerdem wurde der Ausgangsdatei für CoFiCo der Zusatzbetrag 1 hinzugefügt. Ein Problem, bei dem der Batch-Job OneERPInvE167EXP fehlschlug, wurde abgebrochen und nicht weiterverfolgt.

**Schadencodes**

Bei der Verwaltung von Schadencodes wurden mehrere Fehler behoben. Schadencodes wurden beim Import fehlerhaft übernommen. Nach dem Hochladen neuer Schadencodes erschienen Daten in der Benutzeroberfläche in der falschen Spalte. Außerdem trat beim Sortieren nach dem Coverage Code in den Schadencodes ein Fehler auf. Diese Probleme sind behoben.

**Rechnungsstatus und Rechnungsverarbeitung**

Auch bei Rechnungen gab es Korrekturen. Eine SWT-Eingangsdatei konnte nicht verarbeitet werden, weil die Rechnung nicht gefunden wurde. Der Status von Kundenrechnungen wechselte nach dem Lauf des Batch-Jobs „CFDMBatch“ nicht von „Planned“ auf „Accepted“. Der Status interner Werkstattrechnungen änderte sich nach der Freigabe durch einen MO-Benutzer nicht auf „Processed“. Diese Fehler wurden behoben.

**Kreditkartenwechsel über MPay (in Prüfung)**

Kunden sollen während der Laufzeit eines Servicevertrags die hinterlegte Kreditkarte ändern können, sodass Rechnungen ohne Unterbrechung über die neue Karte bezahlt werden. Voraussetzung ist, dass mindestens ein Vertrag des Kunden aktiv ist. Der Kunde ruft dazu das Customer Account Center über einen Link in einer E-Mail auf. Dort werden die Kartendaten (die letzten vier Ziffern sowie Ablaufmonat und -jahr) angezeigt, die zuvor anhand der CIAM-ID aus den MPay-GPP-Vaults abgerufen werden.

Nach Eingabe neuer Kartendaten wird in MPay eine neue Zahlung mit dem Betrag 0 ausgelöst, um nur die Kartendaten zu erfassen. Man erhält eine neue Asset-ID samt NTR, die auf Vertragsebene gespeichert werden. Künftige Rechnungen werden über die neue Karte eingezogen.

Die Anforderungen wurden im Laufe des Program Increments angepasst. Eine erste Schnittstelle nimmt eine Liste von Verträgen entgegen und liefert je Vertrag maskierte Kartenwerte, Asset-IDs, Vertragsnummer und Zahlungsmethode. Eine zweite Schnittstelle nimmt eine Liste von Verträgen, die CIAM-ID (Kundenreferenz), die Zahlungsmethode und die Währung entgegen und liefert die URL zum Kartenwechsel, deren Gültigkeit und die Vertragsliste zurück. Nach dem Kartenwechsel in MPay liefert die erste Schnittstelle die Daten der neuen Karte. Diese Funktion befindet sich derzeit im Status „Blocked BAT Testing“ und ist noch nicht freigegeben.