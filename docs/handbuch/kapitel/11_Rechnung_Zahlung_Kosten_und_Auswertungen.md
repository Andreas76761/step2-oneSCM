# 11 Rechnung, Zahlung, Kosten und Auswertungen

Dieses Kapitel beschreibt die Betriebsphase eines Servicevertrags nach dem Abschluss: Sie erstellen Rechnungen und Zahlungspläne, unterscheiden Rechnungsstatus und Zahlungsstatus, erfassen abweichende Rechnungsempfänger und Sammelrechnungen, verwalten Kosten und Claims, prüfen Werkstatt- und Lieferantenbezüge, erstellen Endabrechnungen, Erstattungen und Korrekturen und werten Daten über Reporting und Exporte aus. Die Verträge selbst verwalten Sie in Kapitel 10, die Pflege von Produkten und Preisen beschreibt Kapitel 14, die technische Anbindung der Schnittstellen Kapitel 19, und Fehlermeldungen mit Lösungswegen behandelt Kapitel 23.

@@S11_1@@

@@S11_2@@

@@S11_3@@

## 11.4 Kostenmanagement und Claims

**Zweck.** Das Cost Management zeigt Ihnen Kosten, Kontingente und Kontostand eines Vertrags auf Basis der Schadensdaten aus dem System VEGA. Die Daten bilden zugleich die Grundlage für Auswertungen und für die buchhalterische Sicht auf den Vertrag. Im Kostenmanagement entscheiden Market Operations, ob Kosten eines Schadens an den Kunden weitergegeben werden, und verfolgen abgelehnte Claims bis zur Gutschrift an den Lieferanten.

**Voraussetzungen.** Der Vertrag ist angelegt, und die Schnittstelle I156 übermittelt die Schadensdaten an oneSCM. Beim Einfügen eines Schadens prüft das System die Vertragsnummer und ermittelt die zugehörigen Deckungen. Ein Schaden gilt als relevant für die Kostenweiterleitung, wenn die Kostenstelle der Deckung auf „Customer“ steht.

**Rollen.** Market Operations (MO) prüft die Kosten einer Werkstattrechnung und gibt sie an den Kunden weiter. Eine zweite MO-Person akzeptiert die erstellte CCIN. Die Rolle ADMIN pflegt die Schadencodes und die Seite „Cross File Transfer“.

**Schritt für Schritt: Kosten an den Kunden weitergeben.**

1. Öffnen Sie den Vertrag und wechseln Sie auf der Seite „Payment Details“ in den Reiter „Workshop Invoice“.
2. Prüfen Sie in der Spalte „Actions“ die Werkstattrechnung. Die Aktion „Bill to Customer“ erscheint für eine VEGA Claim, eine manuelle Werkstattrechnung und eine SIVECO-Rechnung, deren Quellrechnung den Status „Processed“ oder „Exported“ hat. Sind diese Bedingungen nicht erfüllt, fehlt die Aktion, oder das Label „CCIN Created“ steht an ihrer Stelle.
3. Klicken Sie auf „Bill to Customer“. Das Bestätigungsfenster zeigt die CCIN-Vorschau mit dem Invoice Type CCIN, dem Document Type Invoice, dem Reparaturdatum als Invoice Date, dem Invoice Flow „Open Book Invoice“, der Nummer der Quellrechnung als Claim Reference, der Vertragsnummer als Contract Reference und dem Initial Status „Created“. Der Nettobetrag entspricht immer dem vollständigen Claim-Betrag.
4. Prüfen Sie die Vorschau. Mit „Cancel“ oder dem Schließen des Fensters wird keine Rechnung erstellt. Der Status der Quellrechnung bleibt unverändert, und die Aktion bleibt verfügbar.
5. Klicken Sie auf „Create“. Die CCIN erscheint im Bereich „Customer Invoice“ und braucht die Akzeptanz durch eine weitere MO-Person.

**Ergebnis und Systemstatus.** Nach dem Erstellen der CCIN hat die Quellrechnung den Status „Forwarded“. Das System speichert den bisherigen Status „Processed“ oder „Exported“, damit er bei einer Ablehnung wiederhergestellt werden kann. Der Claim-Betrag wird vom Gesamtsaldo im Reiter „Workshop Invoice“ abgezogen und im Reiter „Customer Invoice“ zum Gesamtsaldo addiert. Solange eine nicht abgelehnte CCIN zur Werkstattrechnung besteht, zeigt die Spalte „Actions“ das Label „CCIN Created“. Damit entsteht keine zweite CCIN für dieselbe Werkstattrechnung. In der Spalte „Document reference“ der Werkstattrechnung steht die oneSCM-Nummer der CCIN als Hyperlink. Der Bruttobetrag ergibt sich aus dem Nettobetrag zuzüglich Steuerbetrag, abhängig von der steuerlichen Einordnung des Kunden.

**Ablehnung der CCIN.** Lehnt eine MO-Person die CCIN ab, erhält sie den Status „Rejected“. Die Quellrechnung kehrt in ihren Ausgangsstatus zurück, also zu „Exported“, wenn sie „Exported“ war, oder zu „Processed“, wenn sie „Processed“ war. Die Aktion „Bill to Customer“ wird in der Zeile wieder angeboten. Manuelle Korrekturen sind dafür nicht erforderlich.

**Besonderheiten je Rolle.** Die automatische CCIN-Erstellung beim VEGA-Import findet statt, wenn die Kostenstelle der Deckung auf „Customer“ steht, und zwar nur für Management-Verträge. Bei der Aktion „Bill to Customer“ entscheidet dagegen die MO-Person bewusst, ob der Kunde belastet wird. Sie prüft die Rechnungsdetails und die CCIN-Vorschau, bevor sie die Kundenabrechnung auslöst.

**Sparte und Markt.** Material: keine Quellen in den RAG-Batches

**Abgelehnte Claims und Schadencodes.** Ein Claim, den VEGA ablehnt und der in oneSCM importiert wird, blendet das System in der Oberfläche aus. Lehnt VEGA den gesamten Claim ab, erscheint er nicht mehr. Das Kontingent wird dabei zurückgebucht: Im abgelehnten Claim hat das Kontingent das umgekehrte Vorzeichen. Betrug das Kontingent in der vorherigen Entscheidung +2, lautet es in der neuen Entscheidungsnummer -2. Lehnt VEGA nur einen einzelnen Schadencode ab, bleiben die übrigen Schadencodes sichtbar. Das Kontingent wird in diesem Fall ebenso behandelt wie bei einem vollständig abgelehnten Claim.

**Ablehnung eines Claims nach Erstellung eines SCIN.** Wird ein Claim abgelehnt, nachdem bereits ein SCIN erstellt wurde, hängt das Vorgehen vom Status des SCIN ab. Hat der SCIN den Status „Planned“ oder „Accepted“, storniert das System ihn. Es entstehen weder ein neuer SCIN noch eine Gutschrift. Ist der SCIN „Exported“ oder befindet er sich in einem späteren Status wie „FI Doc Created“, „Paid“ oder „Dunning Level“, bleibt sein Status unverändert. Stattdessen erstellt das System eine Gutschrift im Status „Planned“, die das Lieferantenkonto ausgleicht. Bei einem exportierten SCIN entspricht der Betrag der Gutschrift dem ursprünglichen SCIN-Betrag mit negativem Vorzeichen. Das Feld „Document Reference“ setzt die Gutschrift in eine Eltern-Kind-Beziehung zum ursprünglichen SCIN.

**Kontingentverwaltung aus Schadensmeldungen.** Übermittelt VEGA über die Schnittstelle I156 Kontingentdaten, wertet das Cost Management sie aus. Jede Inanspruchnahme einer Leistung aus dem Vertrag speichert VEGA. Die Informationen stehen in der I156 bei Satzart 20 in den Feldern „Sign“ und „Wheel Consums“. Das Feld „Sign“ enthält ein Plus, wenn ein weiteres Kontingent verbraucht wurde, und ein Minus, wenn ein verbrauchtes Kontingent zurückgenommen wurde. Das Feld „Wheel Consums“ umfasst vier Stellen, wobei die letzte Stelle die Nachkommastelle bildet. Damit erkennen Sie, wie viele Leistungen für einen Kontingentvertrag erbracht wurden. Ist das Vorzeichen ein Plus und der Wert größer als 0, erhöht die Vertragsverwaltung die Zahl der verbrauchten Kontingente um diesen Wert. Ist das Vorzeichen ein Minus, verringert sie die Zahl entsprechend. Die Kontingentdetails werden gemeinsam mit der Vertragsnummer übermittelt.

**Kostenweiterleitung bei Management-Verträgen.** Für ausgewählte Kundengruppen, etwa Militärangehörige, bietet oneSCM den Management-Vertrag an. Er sieht eine geringe monatliche oder einmalige Gebühr vor. Im Schadenfall stellt Mercedes-Benz die Rechnung nicht dem Kunden in Rechnung, sondern leitet sie direkt an den Kunden weiter. Händler und MO-Personen können diese Verträge anlegen. Das System erkennt Schäden, bei denen der Kunde die Kosten trägt, und berechnet die darin enthaltene Altteilsteuer an den Kunden weiter. Der Prozess beginnt mit dem Import des Schadens über die Schnittstelle I156. Anschließend legt oneSCM einen Vega-Schadeneintrag mit dem Status „Processed“ an.

**Garantie- und Kulanzdaten.** Die Warranty & Goodwill Claim Service API liefert Claim-Daten aus VEGA. Als Eingabe dient die Fahrzeug-Identnummer (FIN). Wird stattdessen eine VIN verwendet, validiert das System sie zunächst über VeDOC und ermittelt daraus die FIN. Erst mit der FIN ruft das System die API auf. Die API erfasst oder erzeugt keine Altteilsteuern. Die wöchentlich von VEGA bereitgestellte Datei i156 liefert diese Daten und dient zugleich als Alternative zur API. Ist die API oder der Service nicht verfügbar, zeigt das System keine Daten an.

**Schadencodes verwalten.** Im Admin-Bereich steht die Seite „VEGA Codes“ mit dem Reiter „Damage codes“ zur Verfügung. Dort zeigen Sie Schadencodes an, suchen nach ihnen, legen sie an und löschen sie.

**Cross File Transfer für die Schnittstelle I156.** Im Admin-Bereich bildet die Seite „Cross File Transfer“ die Überwachung und den Dateiupload in einer gemeinsamen Seite ab. Der Reiter „Cross File Transfer“ enthält die Überwachung, der Reiter „Files Upload“ den Dateiupload. Die Funktion steht Benutzern mit der Rolle ADMIN zur Verfügung. Im Reiter „Cross File Transfer“ zeigt die Spalte „Total Number of Items“ vor der Spalte „Status“ die Anzahl der Claims aus der Datei. Bei einem Eintrag mit dem Status „Completed“ steht in Klammern zusätzlich die Anzahl der übersprungenen Claims, zum Beispiel „1000 (450 skipped)“. Bei den Status „Skipped“ und „Failed“ zeigt die Spalte nur die Anzahl der Claims aus der Datei. Kann die Datei nicht gelesen werden, steht dort „N/A“. Über das Symbol „…“ in der Spalte „Actions“ öffnen Sie bei Einträgen der I156 die Optionen „Details“ und „Statistics“.

Die Seite „Statistics“ zeigt die Details des jeweiligen Uploads unter dem Titel „File“ gefolgt vom Dateinamen. Sie filtern nach „Contract Number“, „Workshop Invoice Number“ und „Chassis Number“ als Texteingaben sowie nach „Status“ als Mehrfachauswahl. Mit „Search“ führen Sie die Suche aus, mit „Reset“ setzen Sie sie zurück. Die Ergebnistabelle zeigt die Spalten „Contract No.“, „Workshop Invoice No.“, „Chassis Number“, „Status“, „Reason“ und „Old Part Tax“ mit den Werten Yes oder No. Jede Spalte sortieren Sie auf- oder absteigend. Die Werte „Contract No.“ und „Workshop Invoice No.“ führen zur jeweiligen Vertragsseite beziehungsweise Rechnungsseite.

**Übersichtsansicht des Kostenmanagements.** Material: keine Quellen in den RAG-Batches

**Fehlerbehebung.** Das System verwirft einen Claim und protokolliert den Fehler in Datadog, wenn das Produkt kein Kontingentprodukt ist, wenn die Anzahl der Kontingente das im Vertrag erlaubte Maximum überschreitet oder wenn die Anzahl kleiner als 0 ist. Bei einer Claim-Korrektur darf der übermittelte Wert die noch verfügbaren Kontingente nicht übersteigen. Hat ein Vertrag maximal 4 Kontingente, davon 2 verbraucht, verwirft das System einen Claim mit 3 Kontingenten. Ist die Garantie- und Kulanz-API nicht verfügbar, zeigt das System keine Daten an. Die i156 bleibt als Datenquelle erhalten.

Quellen: Batch 140.1, 211.1, 116.4, 726.1, 183.1, 708.1, 748.1, 731.1, 161.1, 742.1

@@S11_5@@

@@S11_6@@

@@S11_7@@

@@S11_8@@

## Verschiebung in andere Kapitel

@@VERSCHIEBUNG@@

## Klärungsbedarf

@@KLAERUNG@@

## Vorschläge zur Gliederung

@@GLIEDERUNG@@
