# Batch 384 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mehrere Kundenunterschriften für B2B-Kunden in Dokumentvorlagen**

In einigen Märkten müssen bei Verträgen mit gewerblichen Kunden zwei Kundenunterschriften erfasst werden. Bisher konnte in den Dokumentvorlagen nur eine einzige Kundenunterschrift ausgewählt werden. Hierfür wurden zunächst zwei Rollen für Kontaktpersonen eingeführt, Signee1 und Signee2. Die Vorlagenverwaltung wird nun erweitert, sodass die MPCs bei Vertrag und SEPA-Mandat zwischen einem einzelnen und mehreren Unterzeichnern wählen können. Unter dem Signaturtyp wird dafür der Dropdown-Wert „2 X Signee" eingeführt, und die Bezeichnung „1 X Customer" wird in „1 x Signee" umbenannt. Wählt man diesen Wert, enthält die Vorlage zwei Platzhalter, einen für Signee1 und einen für Signee2.

Ist dem Produkt eine Vorlage mit einem Unterzeichner zugeordnet, bleibt der bisherige Prozess für Vertragserstellung und Unterzeichnung unverändert. Bei einer Vorlage mit zwei Unterzeichnern müssen die Vorlage entsprechend angelegt und die Kontaktpersonen Signee1 und Signee2 für den Kunden erfasst sein. Nach der Bestätigung im Vertragserstellungsprozess erscheint ein Dialog, in dem genau eine Signaturmethode ausgewählt werden kann. Zusätzlich kann ein Ausdruck in Papierform gewählt werden. In diesem Fall wird ein Druckauftrag mit dem Service-Vertrag-PDF ohne MB-Unterschriften und ohne Entwurfswasserzeichen gesendet.

Bei der Auswahl von DSS erhält zunächst Signee1 eine E-Mail mit einem Link. Nach dem Öffnen fordert er einen OTP-Code an, erhält ihn auf seinem Mobiltelefon, gibt ihn ein und wird zur Unterschrift weitergeleitet. Anschließend durchläuft Signee2 denselben Ablauf. Das Dokument wird im DSS-Archivsystem gespeichert, und der Händler, der den DSS-Prozess gestartet hat, erhält eine E-Mail mit dem unterzeichneten Dokument und den zugehörigen Informationen.

Bei der Vor-Ort-Unterschrift unterschreibt der Kunde persönlich auf einem Gerät am Verkaufsort, etwa einem iPad mit Apple Pencil. Sobald beide Unterzeichner unterschrieben haben, wird das Dokument im DSS-Archiv gespeichert und im Reiter „Communication" angezeigt. Hat nur ein Unterzeichner unterschrieben, kann der Vertrag nicht aktiviert werden und bleibt im Status „Contract In Confirmation". Beim Ausdruck enthält das Dokument zwei Platzhalter für Kundenunterschriften, der übrige Prozess bleibt unverändert.

Dieses Vorhaben ist derzeit pausiert (On Hold). Einige Punkte sind noch offen, etwa der Signaturtyp für Privat- und Geschäftskunden, die Mockups für die Signaturarten Druck und On-Premise sowie die Prüfung der Unterschrift bei der Druckmethode. Ebenso müssen die DSS-API-Endpunkte noch angepasst werden.

**Extraktion von Dokumenttypen**

Dieses Vorhaben wurde abgebrochen (Cancelled) und wird nicht umgesetzt. Vorgesehen war, hochgeladene Dokumente automatisch zu erkennen. Dabei sollte erkannt werden, wenn ein Händler einen Servicevertrag statt eines SEPA-Mandats hochlädt, und die Seiten sollten in die richtige Reihenfolge gebracht werden, falls sie durcheinander hochgeladen werden. Dazu sollte auf allen Seiten ein QR-Code zur Erkennung des Dokumenttyps verwendet und der bisherige Händler-QR-Code durch PDF417 ersetzt werden.

**Steuernummer als Druckvariable in der Vorlagenverwaltung**

Da für gewerbliche Kunden nun eine Steuernummer geführt wird, steht dieses Attribut zusätzlich als Druckvariable in Dokument- und E-Mail-Vorlagen zur Verfügung, sodass MPCs es in den gewünschten Druckdokumenten verwenden können. Die Variable „Tax Number" liegt in der Ebene „Tax & legal details" und übernimmt ihren Wert aus der Kundenverwaltung für gewerbliche Kunden. Sie ist für die Dokumentvorlagentypen Vertrag und SEPA-Mandat sowie für den E-Mail-Vorlagentyp „Create Email" verfügbar. MPC-Nutzer können sie in neuen Vorlagen verwenden und über die Bearbeitungsfunktion auch in bestehende Vorlagen einfügen. Anschließend sollte geprüft werden, dass die Werte in Dokumenten und E-Mails korrekt ausgegeben werden. Diese Funktion ist fertiggestellt.

**Änderungen an Druckvariablen bei Langzeitverlängerung**

In der Vertragsvorlage für Verlängerungen wurden einige Druckvariablen angepasst, um sie mit der Vertragsverwaltung und den fachlichen Erwartungen in Einklang zu bringen. Die Zeile „Amount" wurde aus der Vorlage entfernt, „VAT Rate" bleibt unverändert. Die für Verlängerungen verwendeten Vorlagen enthalten die neuen Platzhalter, die per Drag & Drop verfügbar sind und Standardwerte für die Dokumentvorschau mitbringen. Dieses Vorhaben ist abgeschlossen.