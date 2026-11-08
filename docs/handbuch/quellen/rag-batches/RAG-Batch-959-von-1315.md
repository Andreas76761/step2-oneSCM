# Batch 959 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Sonderfälle für Flottenkunden (B2B/VAN) in der Vertragserstellung**

Bisher konnten Angebote nur für Privatkunden und Gewerbekunden erstellt werden; für Flottenkunden gab es keine Ausnahmen. Mit der neuen Funktion können Key Account Manager, Händler sowie Mitarbeitende im MO und MPC Flottenkunden individuell konfigurierte Produkte und Preise anbieten und den gesamten Ablauf von der Initialisierung über die Konfiguration und Genehmigung bis zur Vertragsaktivierung effizient abwickeln. Voraussetzung ist, dass Produkte und Sonderkonfigurationen für gewerbliche Flottenkunden verfügbar sind und der neue Kundentyp „Commercial Fleet" (gewerbliche Kunden, die Flotten verwalten) existiert. Die Sonderfall-Funktion steht für alle Abläufe zur Verfügung: Fahrgestellnummer/VIN/FIN mit vorhandenem FRD, Build to Order, Build to Stock sowie BM6-Kennung.

**Angebot anlegen und Produkt konfigurieren**

Zu Beginn wählen Sie als Kundentyp „Commercial Fleet". Optional können Sie eine Branche angeben (Standard: „Not Relevant"). Anschließend geben Sie eine Kennung ein, zum Beispiel Auftragsnummer, Fahrgestellnummer, VIN oder FIN, und ergänzen weitere Angaben. Danach rufen Sie die verfügbaren Produkte ab, wählen das gewünschte Produkt und konfigurieren es. Optional können Sie ein Preisangebot erzeugen, optionale Deckungen hinzufügen und, bei BM6-Kennung, technische Optionen ergänzen.

**Voraussetzungen für die Schaltfläche „Request Special Case"**

Gibt es auswählbare Kampagnen, die nicht ausgewählt wurden, ist die Schaltfläche deaktiviert. Eine Ausnahme bildet die Grace-Period-Kampagne, die gesondert behandelt wird. Bei einer BM6-Kennung bleibt die Schaltfläche deaktiviert, bis eine gültige Kennung (Auftragsnummer oder Fahrgestellnummer) eingegeben und validiert wurde. Ist das Produkt konfiguriert, wird sie aktiviert. Für Privat- und Gewerbekunden steht die Option nicht zur Verfügung, da der Kundentyp nicht „Commercial Fleet" ist.

Wurde eine Grace-Period-Kampagne angewendet, ist „Request Special Case" zwar aufrufbar, ein Banner weist jedoch darauf hin, dass die Kampagne zuerst entfernt werden muss. Die Schaltfläche „Make Request" ist bis dahin ausgegraut. Nach dem Entfernen der Kampagne steht der volle Funktionsumfang zur Verfügung.

**Kundenentscheidung und Sonderfall-Anfrage**

Akzeptiert der Kunde die Standardkonfiguration und den Standardpreis, wird das reguläre B2B-Vertragsangebot erstellt und aktiviert. Andernfalls kann der Händler das Fenster „Request Special Case" öffnen. Dort wählt er als mögliche Konfiguration entweder einen neuen Preis oder eine neue Laufleistung/Laufzeit. Wird eine Variante gewählt und konfiguriert, wird die andere verworfen. Ein Kommentar ist verpflichtend (maximal 500 alphanumerische Zeichen), etwa: „Customer is expanding fleet and has a budget of 500 Euro/year for the selected configuration."

Im Fenster stehen folgende Aktionen zur Verfügung: Über „X" oder „Cancel" wird das Fenster ohne Speichern geschlossen. „Configure Product" ist bei neuer Laufleistung/Laufzeit aktiv und bei neuem Preis ausgegraut. „Make Request" speichert die Anfrage; sie wird gesendet, sobald der Vertrag den Status „Created" erreicht. Werden nach der ersten Anfrage Änderungen vorgenommen, ersetzt „Update" die Schaltfläche „Make Request" und überschreibt die vorherige Anfrage, sodass stets die zuletzt gespeicherte Konfiguration gilt.

Beim Sonderfall „Neuer Preis" wird die zuvor erstellte Produktkonfiguration schreibgeschützt angezeigt, und der Händler begründet die Anfrage im Kommentarfeld. Beim Sonderfall „Neue Laufleistung/Laufzeit" werden die konfigurierbaren Produkteinstellungen angezeigt; „Make Request" wird abhängig von der Auswahl zwischen Standard- und Sonderkonfiguration aktiviert oder deaktiviert. Gespeichert werden rabattbezogene Daten: Händler-ID, Rabattwerte, Kampagnen-ID, Kampagnenwert bzw. -prozentsatz und Kostenstelle. Danach wird das Fenster geschlossen, und Sie kehren zur Produktkonfiguration zurück.

**Einschränkungen nach einer Sonderfall-Anfrage**

Sobald eine Anfrage konfiguriert wurde, können bereits konfigurierte optionale Deckungen und technische Optionen nicht mehr geändert werden. Ein Preisangebot kann weder erstellt noch gedruckt oder per E-Mail versendet werden. Es wird kein Zahlungsplan angefordert, der Reiter „Payment Plan" entfällt, und der Produktpreis wird ausgeblendet.

**Kunden- und Zahlungsdaten, Anlage des Vertrags**

Anschließend erfassen Sie wie gewohnt die B2B-Kunden- und Zahlungsinformationen und gelangen zu „Overview and Confirmation". Dort wird das Angebot erstellt und eine Referenznummer vergeben. Die Informationen zur Sonderfall-Anfrage werden über den Notification Service an das MPC gesendet. Bei einem neuen Preis umfasst dies die Produktkonfiguration, Preisdetails einschließlich Rabatten, Kampagnen und optionaler Deckungen sowie die Kommentare. Bei neuer Laufleistung/Laufzeit werden die Sonderkonfiguration und die Rabattdetails übermittelt: Händler-Outlet-ID (bei Händlerrabatt), Händlerrabattbeträge (netto, brutto, Steuer), Kampagnen-ID, Kampagnenwert oder -prozentsatz, Kostenstelle der Kampagne sowie ebenfalls die Kommentare.

**Offene Anfrage**

Solange die Anfrage nicht beantwortet ist, bleibt der Vertrag im Status „Created". Bei neuem Preis werden die verfügbaren Werte für Laufleistung, Laufzeit und Jahreslaufleistung angezeigt. Bei neuer Laufleistung/Laufzeit wird die Jahreslaufleistung angezeigt, während Laufzeit und Laufleistung als „Not yet available" gekennzeichnet sind, da bei einer neuen Laufzeit auch die Laufzeit selbst eine Sonderlaufzeit ist. Bei Kennungen ohne FRD (Auftragsnummer oder Fahrgestellnummer ohne FRD) wird zusätzlich die verfügbare Fahrgestellnummer angezeigt. Die Schaltfläche „Confirmation" und die Vertragsvorschau sind ausgegraut, sodass der Vertrag nicht zur Signaturauswahl fortschreiten kann und kein Vertragsangebot erstellt wird. Die Genehmigung muss, wenn der Ablauf von einem MPC orchestriert wird, von unterschiedlichen MPC-Benutzerkennungen erfolgen.

**Nach der Beantwortung**

Wurde die Anfrage beantwortet und hat der Händler die Konditionen übernommen, werden die Vertragsinformationen mit dem Nettopreis aktualisiert; beim Überfahren mit der Maus erscheinen Brutto- und Steuerwert. Die Aufschlüsselung der einzelnen Rabatte (Händler, Kampagne, MPC) wird nicht angezeigt. Angezeigt werden Laufleistung, Laufzeit und Jahreslaufleistung. Bei Kennungen ohne FRD gilt: Die Laufleistung zeigt die verfügbare Information, 0 oder „Not yet available"; die Laufzeit zeigt die verfügbare Information bzw. „Not yet available", wenn kein FRD existiert. Der Zahlungsplan wird auf Basis von FRD und Laufzeit angefordert und bei Bedarf bei einer Neuverteilung angepasst. Die Vorschau wird aktiviert und erzeugt die Dokumentvorlage mit den verfügbaren Daten, und die Schaltfläche „Confirmation" ermöglicht den Übergang zur Signatur.

**Aktivierung**

Sie wählen die gewünschte Signaturmethode, danach werden alle erforderlichen Prüfungen durchgeführt und der Vertrag auf „Waiting for Confirmation" gesetzt. Gibt es im MO nicht erfolgreiche Prüfungen, werden diese markiert und gegebenenfalls die automatische Aktivierung blockiert.

Bei Kennungen ohne FRD gilt zusätzlich: Sind Fahrgestellnummer und FRD vorhanden, wird der Aktivierungsablauf fortgesetzt. Fehlen beide, bleibt der Vertrag auf „Waiting for Confirmation", wenn keine Signatur erfasst wurde, bzw. wechselt auf „Confirmed", wenn die Signatur vorliegt. Sobald Fahrgestellnummer, FRD und Kennzeichen erfasst sind, wird der Zahlungsplan entsprechend der Vertragslaufzeit angefordert und aktualisiert: Es werden Laufzeitpreis und Werte vom Produkt abgerufen, an Revenue zur Erstellung des Zahlungsplans gesendet, und der erhaltene Plan wird in den Vertrag übernommen. Danach werden alle Prüfungen erneut durchgeführt.

**Abschluss der Aktivierung**

Sind alle Prüfungen erfolgreich und wird der Vertrag aktiviert, wird die i155 erzeugt und eine Benachrichtigung an Nemesis gesendet. Revenue erhält eine Benachrichtigung mit den relevanten Details: Preis, Händlerrabatt-Informationen (falls angewendet), Kampagnendetails (falls zutreffend) und Angaben zum MPC-Sonderpreis (falls angewendet).

**Hinweis zur Kennung Baumuster (BM6)**

Wird zunächst nur ein Baumuster als Kennung eingegeben, ist die Option „Request Special Case" nicht verfügbar. Erst nach Eingabe einer gültigen Kennung wie Fahrgestellnummer oder Auftragsnummer können Sie Produkt und Preis abgleichen, verfügbare Kampagnen anwenden, optional einen Händlerrabatt vergeben und anschließend die Sonderfall-Anfrage aktivieren.