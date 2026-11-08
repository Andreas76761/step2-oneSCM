# Batch 512 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Edge Service**

Im Edge Service wird derzeit daran gearbeitet, dass ein Vertrag über die Leasing-Schnittstelle (v2/leasing) auf den Status „CONFIRMED" gesetzt werden kann. Dies ist bislang nicht möglich und befindet sich in Entwicklung. Abgeschlossen ist dagegen die Korrektur der API-Dokumentation zum Feld „salesLevel": Die Beschreibung widersprach der tatsächlich implementierten Zuordnung. Dokumentiert ist nun, dass der Wert 1 für HQ/MPC steht.

Geplant, aber noch nicht begonnen, ist eine Anpassung der Berechtigungen für externe Systeme wie das Leasing. Wenn ein Ablauf Fahrzeugdaten lesen muss und nichts mit Produktinformationen zu tun hat, soll künftig die Berechtigung EXT_EDGE_VEHICLE_R statt EXT_EDGE_PRODUCT_R verwendet werden. Dabei ist auch die hasClaim-API zu prüfen.

Darüber hinaus sind mehrere Optimierungen der Edge-Implementierung vorgesehen, die noch nicht begonnen wurden. Bei allen gilt: Die externe API bleibt unverändert, das heißt Anfrage- und Antwortstrukturen, Statuscodes und Endpunktpfade ändern sich nicht. Verbessert wird ausschließlich der dahinterliegende Code. Die Prüfung durch die Qualitätssicherung (AQA) erfolgt antwortbasiert: Die verbesserte Implementierung läuft neben der bisherigen, und Antworten, Statuscodes und nachgelagerte Aufrufe werden bei identischer Anfrage verglichen. Vertragstests legen alle Anfrage- und Antwortstrukturen fest, sodass sich die externe API nicht versehentlich ändern kann.

Der Endpunkt zur Abfrage des Kontosaldos eines Vertrags (GET /contract/v1/balance) wird an die gemeinsamen Konventionen angepasst. Er wird von Partnern und vom OneSCM-Frontend genutzt, um den offenen Saldo anzuzeigen, und ist damit auch für Kunden über Partnerkanäle sichtbar. Da ein Drittel der Änderungen an diesem Endpunkt Fehlerkorrekturen waren, ist die Optimierung sinnvoll. Kann der Saldo nicht abgerufen werden, soll künftig eine klare Fehlermeldung erscheinen und kein leerer Wert oder Null. Dieser Fehlerfall wird gezielt getestet, weil ein angezeigter Saldo von Null schwerer wiegen würde als ein Fehler.

Auch der Endpunkt zur Preisermittlung bei Verlängerungsangeboten (POST /prolongation) wird auf die gemeinsamen Konventionen umgestellt. Ihn nutzen Leasingpartner und die Verlängerungsmasken im OneSCM-Frontend. Er verwendet bisher die ältere Fehler- und Datumsbehandlung. Künftig sehen Partner hier dasselbe Fehlerformat und dieselbe Datumsbehandlung wie überall sonst. Dieser Bereich ist der stabilste im Edge Service und gilt als risikoarm. Er kann zurückgestellt werden, falls anderswo Kapazität benötigt wird.

Schließlich werden die beiden eingehenden Callback-Endpunkte überarbeitet: das TraCS-Ergebnis des Adressabgleichs (POST /v1/tracs/onescm_address-match-final-result) und der Callback zur digitalen Signatur aus dem Dokumentenmanagement (GET /document-management/dss). Beide folgen künftig den gemeinsamen Konventionen. Ein Callback, der nicht verarbeitet werden kann, wird mit ausreichenden Details aufgezeichnet, sodass er untersucht und erneut eingespielt werden kann. Bisher wird ein solcher Callback nirgends festgehalten. Dadurch könnte ein Ergebnis oder eine abgeschlossene Signatur den Vertrag nie erreichen, und der Vertrag würde ohne erkennbaren Grund unbegrenzt warten. Die Verträge dieser Schnittstellen werden von den aufrufenden Systemen vorgegeben und bleiben unverändert. Da diese Systeme nicht ohne Weiteres zu einer Wiederholung aufgefordert werden können, müssen Änderungen vor der Freigabe besonders sorgfältig geprüft werden.

**Benutzeroberfläche**

Für das Marktumfeld MBD soll die deutsche Übersetzung angepasst werden. In der Zahlungserstellung und im Zahlungsplan wird „One Time" künftig mit „Einmalzahlung" übersetzt. Zusätzlich soll geprüft werden, ob der Begriff noch an anderen Stellen vorkommt, um ihn dort ebenfalls zu ändern. Diese Anpassung ist noch offen.

Ein Ticket zur Sprachauswahl in der Vorproduktionsumgebung, bei dem für alle Märkte nur Englisch funktionierte, ist inzwischen geschlossen.

**Customer Account Center**

Das Ticket zu einer nicht auffindbaren E-Mail-Adresse des Customer Account Centers in der Vorproduktionsumgebung von MB India wurde abgebrochen und nicht weiterverfolgt.