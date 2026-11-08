# Batch 1017 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Marktkampagnen bei der Vertragserstellung**

Wenn Product Management eine Kampagne definiert hat und diese automatisch anwendbar ist, wird sie bei der Vertragserstellung für den Endkunden berücksichtigt. Händler starten dazu auf der Startseite der Vertragserstellung einen neuen Vertrag und wählen den gewünschten Ablauf: verfügbare Fahrgestellnummer, Build to Stock oder nicht verfügbare Fahrgestellnummer. Anschließend geben sie die Fahrzeugdaten ein und füllen dabei alle Pflichtfelder aus. Das System fragt daraufhin in der Domäne Contract Calculation die Fahrzeuginformationen und die passenden Produkte ab und zeigt die Antwort an. Zusätzlich zum Produktnamen werden Kampagnenname, Kampagnengültigkeit, Kampagnenzahler (Kostenstelle), der Basispreis netto und brutto (ursprünglicher Preis ohne Kampagne), die Kampagnenreduktion netto und brutto sowie der Preis inklusive Kampagne netto und brutto bereitgestellt.

**Darstellung in der Produktauswahl**

Die Produktkarten folgen dem validierten UI-Design. Der Basispreis wird durchgestrichen angezeigt, darunter steht der neue Preis inklusive Kampagne. Am Preis befindet sich ein Tooltip. Beim Darüberfahren zeigt er den Namen der aktiven Kampagne (zum Beispiel „Black Friday Campaign Active“), die Reduktion in Prozent (zum Beispiel 10 %) sowie den Wert der Reduktion (zum Beispiel 10 % = 150 EUR). Wird ein Händlerrabatt angewendet, erscheint dieser ebenfalls im Tooltip, und die Kampagnenreduktion wird mit dem Händlerrabatt zu einer Gesamtsumme addiert.

**Produktkonfiguration und Händlerrabatt**

Nach der Auswahl konfigurieren Händler das Produkt mit Laufzeit, Jahreslaufleistung und Zahlungsintervall. Unterhalb des Zahlungsintervalls steht der Link „Händlerrabatt“ zur Verfügung. Er öffnet ein Modal, in dem ein Rabatt als Prozentwert und/oder als Betrag erfasst werden kann; mehrere Eingaben sind möglich. Im Modal werden Name und Beschreibung der angewendeten Kampagne schreibgeschützt angezeigt. „Anwenden“ übernimmt den Rabatt, „Abbrechen“ verwirft den Rabatt.

Dabei gilt: Die Summe aus Marktkampagnen-Reduktion und Händlerrabatt muss kleiner als der Vertragspreis sein. Ein Beispiel: Bei einem Vertragswert von 1.200 EUR und einer Kampagnenreduktion von 200 EUR ergibt sich ein Preis von 1.000 EUR. Ein Rabatt von 50 % senkt ihn auf 500 EUR, ein zusätzlicher Betragsrabatt von 499 EUR auf 1 EUR. Die 200 EUR Kampagnenreduktion trägt der Markt, die Händlerrabatte von 500 EUR und 499 EUR trägt der Händler, und der Endkunde zahlt den Vertragspreis von 1 EUR. Erreicht oder überschreitet die Summe aus Kampagnenreduktion und Händlerrabatt den Vertragswert, erscheint die Fehlermeldung „Sum of Market Campaign Reduction and Dealer Discount cannot exceed the Contract Value“, und die Schaltfläche „Anwenden“ wird deaktiviert.

Zurück in der Produktauswahl und -konfiguration wird wieder der Basispreis durchgestrichen mit dem neuen Preis darunter angezeigt.

**Kunden- und Zahlungsinformationen, Vertragserzeugung**

Anschließend werden die Kunden- und Zahlungsinformationen erfasst. Sobald alle Pflichtfelder gefüllt sind, wird die Schaltfläche „Weiter“ aktiviert. Beim Klicken führt das System automatisierte Prüfungen durch, erzeugt den Vertrag, vergibt eine Vertragsnummer, setzt den Vertrag auf den Status „Created“ und stößt die Erzeugung des Zahlungsplans durch das Revenue Management an.

**Übersicht und Bestätigung**

Im Kopfbereich der Übersicht und Bestätigung werden der durchgestrichene Basispreis und darunter der reduzierte Preis (Kampagne plus gegebenenfalls Händlerrabatt) angezeigt. Die angewendeten Rabatte erscheinen als Tooltip, auch wenn nur eine Kampagne aktiv ist. Beim Darüberfahren werden der Name der aktiven Kampagne („Kampagnenname“ Campaign Active), die prozentuale Kampagnenreduktion, der entsprechende Betrag in EUR, ein Abschnitt zum Händlerrabatt mit Prozentsatz und Gegenwert, der vom Händler gewährte Betrag sowie die Gesamtsumme aus Kampagnenreduktion und Händlerrabatten angezeigt.

**Bestätigung und Aktivierung**

Bei der Bestätigung wird die Signatur über den Digital Signature Service (DSS) angestoßen. Der Vertrag wird auf „Confirmed“ und danach auf „Waiting for Activation“ gesetzt. Ist eine der automatisierten Prüfungen nicht in Ordnung, wird Market Operations markiert, die über das weitere Vorgehen entscheidet. Der Vertrag bleibt dann so lange in „Waiting for Activation“, bis Market Operations einen weiteren Status vergibt.

Sind alle automatisierten Prüfungen in Ordnung und alle Informationen erfasst, folgt die Vertragsaktivierung. Geprüft werden Fahrzeug, Produkt und Preis, FRD, die erfasste DSS-Signatur, die Verfügbarkeit einer SAP-Debitorennummer für den Kunden sowie die Verfügbarkeit von Zahlungsinformationen für den Markt, damit dessen Kampagnenkosten abgedeckt werden können. Danach wird die i155 erzeugt und das Revenue Management informiert. Übermittelt werden die Zahlerinformationen des Marktes mit Beträgen netto und brutto (Kostenstelle, SAP-Debitorennummer und Provisioning Component, die bei der Kampagnendefinition manuell eingetragen wird) sowie die Zahlerinformationen des Kunden mit Beträgen netto und brutto. Abschließend wird eine E-Mail-Benachrichtigung an den Kunden gesendet.

**Hinweise zu Summenregeln**

Die Summe der angewendeten Marktkampagnen muss kleiner als der Vertragswert sein, andernfalls wäre der Markt Zahler des Vertrags. Ebenso muss die Summe der angewendeten Rabatte kleiner als der Vertragswert sein, sonst wäre der Händler Zahler. Übersteigt die Summe aus Rabatten und Marktkampagnen den Vertragswert, wären Markt und Händler die Zahler. Diese Fälle sind für PI4 zur Behandlung vorgesehen.

**Gestaltung**

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden validierten UI-Design.