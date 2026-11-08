# Batch 859 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung in oneSCM**

Der Bereich Vertragsverwaltung (Contract Management) soll Nutzern eine umfassende und benutzerfreundliche Oberfläche bieten, um die Details eines bestimmten Vertrags aufzurufen und zu verwalten. Vorgesehen ist, dass Nutzer wichtige Vertragsinformationen einfach einsehen und bei Bedarf weitere Maßnahmen für einen konkreten Vertrag durchführen können, etwa den Vertrag aussetzen, beenden, kündigen oder reaktivieren. Die Zielgruppe sind Power User (die genaue Rollendefinition ist noch offen). Die Daten stammen aus oneSCM und stehen nach der Erstellung eines Vertrags zur Verfügung. Die Oberfläche soll den Vorgaben des Mercedes-Benz Workbench entsprechen und dem vom Kunden freigegebenen UI-Design folgen.

**Dauerhaft angezeigter Kopfbereich**

Auf allen Seiten des Bereichs Vertragsverwaltung wird ein permanenter Kopfbereich angezeigt. Die dort dargestellten Informationen richten sich nach der jeweiligen Vertragsnummer. Er enthält folgende Angaben:

Der Kundenname wird als Link dargestellt, der die Details des Partners öffnet, unabhängig davon, ob es sich um einen Privat- oder Geschäftskunden handelt. Der Name stammt aus der Eingabe bei der Vertragserstellung in oneSCM bzw. aus MercedesMe und erscheint auf allen Unterseiten. Es kann sich um einen Händler oder eine Privatperson handeln.

Der Vertragsstatus richtet sich nach der Vertragsnummer.

Die Vertragslaufzeit wird in einem Feld zusammengefasst und zeigt Startdatum, Enddatum sowie die dazwischenliegende Dauer in Monaten. Das Datumsformat ist TT.MM.JJJJ, die Darstellung kann marktspezifisch sein. Die Angaben stammen aus der Vertragserstellung in oneSCM.

Der Produktname wird nach dem MVP als Link zum Servicevertrag mit Produktnamen und Produktabdeckungen angezeigt. Er umfasst drei bis 50 Zeichen, stammt aus der Vertragserstellung und hängt von der Vertragsnummer ab.

Die Verkaufsbezeichnung wird als vorbefülltes Textfeld angezeigt, stammt ebenfalls aus der Vertragserstellung und hängt von der Vertragsnummer ab.

Die Fahrgestellnummer (FIN/VIN) ist alphanumerisch und 17 Zeichen lang. Auch sie stammt aus der Vertragserstellung.

**Hinweis zum Stand der Funktionen**

Die Beschreibungen zur eigentlichen Vertragsdetail-Ansicht sowie zur Suchseite, auf der Verträge gesucht, angezeigt und ausgewählt werden können, enthalten in den vorliegenden Angaben keine näheren fachlichen Details über die Zielbeschreibung hinaus; die zugehörigen Arbeiten wurden abgebrochen. Konkrete Funktionsweisen dieser Bereiche lassen sich daher aus den Daten nicht ableiten.