# Batch 557 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Markt Südkorea (MBKR) aktivieren**

Mit diesem Vorhaben wird oneSCM für den Markt Südkorea (MBKR) freigeschaltet. Dazu müssen Drittsysteme angebunden und marktspezifische Anforderungen umgesetzt werden. Das Vorhaben befindet sich derzeit noch im Dev Backlog und ist daher noch nicht umgesetzt.

Der Markt MBKR wird in den Anfragen an die Google API, an GSSN und an MercedesMe berücksichtigt. Dasselbe gilt für das Finanzsystem SWT und für den DSS-Signaturjob. Jede dieser Anfragen enthält dabei die korrekte MBKR-Marktkennung, und die Antworten werden erfolgreich verarbeitet. Für Kundendaten gelten zudem MBKR-spezifische Validierungsregeln. SWIFT- und VIES-Anfragen sind für MBKR nicht erforderlich, da es in Südkorea kein IBAN-System gibt und das Land nicht zur EU gehört. Offen ist noch, ob für die Business Registration Number ein weiteres System angebunden werden muss.

Die Kundenart wird im Feld customerAttribute4 hinterlegt. Der Wert „G1“ steht für einen gewerblichen staatlichen Kunden (Commercial Governmental Customer), der Wert „G3“ für einen privaten staatlichen Kunden (Private Governmental Customer). Die südkoreanische Business Registration Number (BRN) entspricht der USt-IdNr. und wird im Feld taxNumber1 gespeichert. Sie besteht aus 10 Ziffern, wird üblicherweise mit zwei Bindestrichen im Format XXX-XX-XXXXX geschrieben und ist eine Pflichtangabe, die eindeutig sein muss. In der Suchmaske wird für dieses Feld ein marktspezifisches UI-Label angezeigt, ähnlich wie bei der UID in der Schweiz. Noch offen ist, wie die Eingabe in der Oberfläche zugelassen wird und in welchem Format die Nummer an SWT übermittelt wird.

Bei den Zahlungsarten wird die Auswahl von KCP oder Kreditkarte auf die Zahlungsart „C“ abgebildet. Dieser Punkt (C oder Z) muss noch abschließend geklärt werden.

Für die Namen gilt eine eigene Regelung. In der oneSCM-Oberfläche steht nur ein einziges Namensfeld zur Verfügung, in das der vollständige koreanische Name (Name und Nachname zusammen) eingetragen wird. Beim Export wird dieser Wert in das Feld „Name1“ der SWT-Anfrage übernommen. Zusätzlich gibt es ein Feld für den romanisierten Namen. Das System wandelt den koreanischen Namen in eine romanisierte Schreibweise um. Gibt es mehrere mögliche Varianten, wird eine Auswahlliste angezeigt, aus der der Händler eine Variante wählen und bei Bedarf noch anpassen kann. Der final gewählte oder bearbeitete Name wird in der POST-Anfrage an SWT im Feld „Name3“ übermittelt. In Verträgen und Dokumenten wird der romanisierte Name vorerst nicht angezeigt, da unklar ist, ob er dort benötigt wird. Möglicherweise wird er auch für die Sanktionslistenprüfung in TraCS gebraucht; das wird noch geklärt.

Bei Mercedes Me ist die QR-Code-Authentifizierung (Mme ID Retail) in Südkorea nicht verfügbar und nicht ausgerollt. Für MBKR kann daher nur in Mercedes Me gesucht werden, oder es können Mercedes-Me-Profile angelegt werden.

**Vertragsdetails: Schalter für gesammelte Finanzdokumente bei digitalen Zahlungsarten bearbeitbar**

Zu diesem bereits abgeschlossenen Punkt liegen in den Rohdaten nur die Überschrift und der Status vor. Aus der Überschrift geht hervor, dass der Schalter für gesammelte Finanzdokumente (Collective financial documents) in den Vertragsdetails bearbeitbar ist, wenn als Zahlungsart eine digitale Zahlungsart gewählt ist. Weitere Details, etwa welche Zahlungsarten dazu zählen, sind nicht angegeben und werden hier nicht ergänzt.