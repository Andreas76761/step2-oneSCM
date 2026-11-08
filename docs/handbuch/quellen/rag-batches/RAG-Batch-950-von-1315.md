# Batch 950 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation: Neuerungen und Änderungen**

Bei der Vertragserstellung für Online-Verkäufe (ohne Leasing) unterscheidet die externe Schnittstelle zum Anlegen eines Vertrags künftig zwischen den Zahlungsarten mPay und SEPA. Für den Online-Shop wird dazu eine Mme-ID benötigt, und die Merchant-ID wird bereitgestellt. Außerdem sind Benachrichtigungs-Webhooks für oneSCM definiert. Bei Einmalzahlungen (oneShot) werden die Merchant-Referenz-ID und die Transaktions-ID (NTR) übermittelt. Bei monatlichen Zahlungen werden Merchant, Asset-ID und NTR übermittelt.

Die Preise eines Servicevertrags werden bereits bei der Vertragserstellung auf Vertragsebene gespeichert. Dies betrifft den Produktpreis, gegebenenfalls den Händlerrabatt mit der Outlet-ID, den Kampagnenpreis mit Kostenstelle sowie Sonderfälle mit Kostenstelle. Sonderfälle werden in einer späteren Ausbaustufe berücksichtigt. Alle Preise werden jeweils als Netto-, Brutto- und Mehrwertsteuerwert übermittelt.

Diese Speicherung ist relevant für Fahrzeuge im Build-to-Order- und Build-to-Stock-Ablauf. Kommt der Kunde mit gültiger FRD und gültigem Kennzeichen erneut zum Händler, sendet die Vertragsdomäne die gespeicherten Preise zur Neuberechnung an die Produktdomäne. Die neu berechneten Preise werden anschließend an die Revenue-Domäne weitergeleitet, die daraus den korrekten Zahlungsplan erstellt. Auf dieser Grundlage kann die Vertragsaktivierung mit den aktualisierten Finanzdaten fortgesetzt werden. Die gespeicherten Preise werden dabei entsprechend der FRD auf die Vertragslaufzeit verteilt.

Zusätzlich wurde eine Anpassung an der Artifactory-Konfiguration für Brabus umgesetzt. Weitere inhaltliche Details liegen hierzu nicht vor. Außerdem wurden die Änderungswünsche des Programminkrements PI10 für die Contract Generation gesammelt und abgeschlossen.