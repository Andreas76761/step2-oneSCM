# Batch 632 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 28 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung**

Im Bereich der Kunden- und Partnerverwaltung stehen mehrere Neuerungen und Verbesserungen zur Verfügung, die vor allem die Verwaltung von Bankverbindungen und Geschäftskunden betreffen.

Auf Kundenebene können nun mehrere Bankkonten hinterlegt werden. Bei einem aktiven Kunden lässt sich ein neues Konto hinzufügen. Wird beim Anlegen eines neuen Kontos zwar jedes Feld ausgefüllt, SEPA aber deaktiviert, bleibt die Schaltfläche zum Erstellen deaktiviert. Ein Konto kann gelöscht werden, indem eine andere IBAN als Ersatz für die bisherige gewählt wird. Über die Schaltfläche „Konfigurieren" kann eine IBAN entweder mit allen Verträgen verknüpft werden, oder es wird gezielt nach einem Vertrag gesucht und die IBAN mit diesem verknüpft. Wählt man ein anderes Konto aus, wirkt sich dies auch auf die Vertragserstellung aus.

Für gewerbliche B2B-Kunden können ein einzelnes oder mehrere Bankkonten erfasst werden. Ansprechpartner lassen sich über ein Pop-up-Fenster anlegen, in dem alle Felder ausgefüllt werden, sowie bearbeiten oder löschen. Die Prüfungen von USt-IdNr. und IBAN sind implementiert. Nach der Vertragsaktivierung werden für gewerbliche Kunden Nemesis-Events erzeugt. In der Kundensuche innerhalb der Vertragserstellung kann über den Firmennamen gesucht werden.

Bei der Pflege gewerblicher Kunden gelten zudem folgende Anpassungen: Derselbe Ansprechpartner soll nicht zweimal angelegt werden können. Die Prüfung des Firmennamens soll auch Großbuchstaben und Rechtsformzusätze wie AG, KG, Co. KG, GmbH & Co. KG, UG, GbR, KGaA und SE akzeptieren. Ein gewerblicher Kunde soll nicht ohne Ansprechpartner angelegt oder bearbeitet werden können; die Schaltfläche „Weiter" ist ohne Ansprechpartner deaktiviert. Der Kontoinhaber soll nicht frei eingegeben werden können, sondern automatisch mit dem Firmennamen befüllt werden und nicht editierbar sein.

Das Attribut „Customer Type" wird künftig im Bereich „Customer Details" statt unter den Forderungen aus dem FI-System angezeigt, da die Daten in oneSCM erfasst werden und eher der Kundenidentifikation dienen. Die Änderung betrifft die Seiten zum Anlegen (über die Vertragserstellung), Bearbeiten und Ansehen von Privat- und Geschäftskunden.

Das Anlegen neuer Kunden ist für Händler und Marktbetreuer nur noch über den Prozess der Vertragserstellung möglich. Im Bereich „Customer Management" entfällt die Schaltfläche zum Erstellen eines Kunden. Auf dem Reiter „Commercial Customer" werden alle Kunden des jeweiligen Marktes angezeigt. Die Kundenansicht bleibt über die Navigation „Contract Generation" erreichbar.

Weitere Verbesserungen betreffen die Telefonnummer, deren Format erweitert wurde, sowie die Privatkundensuche, bei der anstelle der SAP-Debitorennummer der Lastschriftcode als Filter verfügbar ist. Außerdem wurde die Bezeichnung „sepaMandateValidity" in „sepaMandateStatus" geändert. Jeder Microservice nutzt künftig den zentralen History-Service anstelle eigener Log-Tabellen.

Behoben wurden mehrere Fehler: Kundendetails sind aus der Vertragserstellung und -verwaltung wieder einsehbar, die Dublettenprüfung funktioniert nicht mehr nur bei E-Mail-Adressen mit der Endung mercedes-benz.com, gewerbliche Kunden werden nach Änderungen korrekt aktualisiert, der Export-Job für Kunden läuft fehlerfrei, und neue Kunden erscheinen in der Exportdatei. Auch die Vertragserstellung mit Halter und Zahler für einen bestehenden Kunden als Halter funktioniert wieder.