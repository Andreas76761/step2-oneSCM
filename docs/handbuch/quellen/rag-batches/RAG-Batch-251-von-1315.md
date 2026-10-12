# Batch 251 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Nemesis-Integration: Anzeige funktionaler Fehler**

Nemesis erhält von oneSCM Ereignisse zu Kunden, Verträgen, Erlösen und Händlerrechnungen. Die Daten werden am Ende des Tages geprüft und verarbeitet. Sind Informationen unvollständig oder fehlerhaft, entsteht ein funktionaler Fehler. Diese Fehler können im Admin-Bereich unter dem Menüpunkt „NEMESIS" eingesehen werden. Der Bereich steht ausschließlich Market-Operation-Benutzern (2nd Level Support) zur Verfügung. Jeder funktionale Fehler wird in einer eigenen Zeile dargestellt.

Die Fehlerprotokolle liefert Nemesis derzeit als Excel-Datei pro Monat über CFT. Diese Datei wird von oneSCM ausgelesen, und ihr Inhalt wird in der Oberfläche angezeigt. Als Zielbild ist vorgesehen, dass Nemesis die Fehlerprotokolle täglich bereitstellt, da oneSCM täglich Ereignisse sendet, die täglich verarbeitet werden. Dadurch soll die zeitliche Lücke zwischen Verarbeitung und Rückmeldung entfallen. Dafür sind ein abgestimmtes Dateiformat und die Übertragung per CFT erforderlich, und oneSCM muss die Datei als Grundlage für die Ansicht verarbeiten.

**Suche**

Die Fehler lassen sich nach folgenden Kriterien suchen:

Erstes Auftreten (Datum, Einfachauswahl), Vertragsnummer (Textfeld, erlaubt sind Buchstaben, Ziffern und der Schrägstrich, ohne Beachtung der Groß- und Kleinschreibung, mit unscharfer Suche), Status (Dropdown mit Mehrfachauswahl, das die eindeutigen Status aus der Fehlertabelle anbietet) sowie Fehlercode (Textfeld mit unscharfer Suche).

Mit der Schaltfläche „Search" wird der Ergebnisbereich mit den gefilterten Datensätzen gefüllt. Mit „Cancel" werden alle Änderungen verworfen. Änderungen oder Auswahlen in den Filterfeldern wirken sich nicht automatisch auf die Suchergebnisse aus.

**Ergebnisbereich**

Im Ergebnisbereich werden die Fehler mit folgenden Angaben angezeigt: Änderungsdatum, Vertragsnummer, FIN, Fehlercode, Fehlergrund, Häufigkeit des Auftretens, erstes Auftreten und Status. Zusätzlich gibt es eine Auswahlbox, die nur bei Fehlern mit dem Status „Unresolved" verfügbar ist. Alle Spalten außer „Actions" sind sortierbar. Standardmäßig wird alphabetisch nach dem Änderungsdatum sortiert. Pro Seite werden standardmäßig 10 Einträge angezeigt. Die Anzahl kann auf 10, 20, 30, 40 oder 50 geändert werden.

**Aktionen**

Mit „Resend" werden alle vier Ereignisse (Kunde, Vertrag, Erlös und Kosten) mit den aktuellen Daten erneut gesendet. „Acknowledge" wird verwendet, wenn der Fehler nicht manuell behoben werden kann und der Benutzer ihn aktuell nicht korrigieren kann.

**Validierungen vor dem Erstellen von Nemesis-Ereignissen**

Die geplante Funktion, Ereignisse bereits in oneSCM vor dem Versand an Nemesis zu validieren, um funktionale Fehler möglichst zu vermeiden, wurde nicht umgesetzt (Status: abgebrochen). Es gibt daher keine solchen Prüfungen, und die zugehörige Fehlerprotokollierung in Datadog und in der Datenbank ist nicht verfügbar.

**Technische Absicherung von Schnittstellen**

Für Schnittstellen, deren Logik nicht mit leeren Werten arbeiten kann, wurden die zugehörigen Datenobjekte (DTOs) im Backend um Pflichtfeldprüfungen (NotNull) ergänzt. Ein Beispiel ist die Schnittstelle zur Erstellung eines Zahlungsplanentwurfs für einen Vertrag, die ein Erstzulassungsdatum und ein geplantes Vertragsende benötigt.