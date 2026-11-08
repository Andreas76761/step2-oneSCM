# Batch 1036 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Forderungen aus dem FI-System (Receivables from FI System)**

Nachdem die Preise ausgewählt und konfiguriert wurden, gelangen Sie im Bereich der Kundeninformationen zum Abschnitt „Receivables from FI System". Hier erfassen Sie die entsprechenden Angaben, um anschließend einen Vertrag generieren zu können. Der Abschnitt enthält die Felder „Partner type" (Partnertyp), „Role within the Contract" (Rolle im Vertrag) und „SAP Debitor No" (SAP-Debitorennummer). Alle drei Felder sind Pflichtfelder. Als Partnertyp ist „Private Customer" vorgesehen. Für die Rolle im Vertrag kommen „Holder", „User" und „Payer" in Betracht.

In der aktuellen Ausbaustufe (MVP) sind diese Felder vorbelegt und schreibgeschützt, sodass sie zunächst nicht geändert werden können. Der Partnertyp lautet „Private Customer", die Rolle im Vertrag „Holder", und die SAP-Debitorennummer ist mit „-" vorbelegt.

**Steuer- und Rechtsangaben (Tax & Legal Details)**

Im Anschluss an die Preisauswahl und -konfiguration erfassen Sie im Bereich der Kundeninformationen auch die steuerlichen und rechtlichen Angaben. Der Abschnitt trägt die Zwischenüberschrift „Tax & Legal Details" und umfasst drei Felder.

Die „Tax Classification" (Steuerklassifizierung) ist ein Pflichtfeld und wird über eine Auswahlliste angegeben. Zur Auswahl stehen „Diplomat", „Exempt", „Internal", „Reduced" und „Standard". Der „Tax Classification Code" ist optional und ebenfalls eine Auswahlliste mit einer maximalen Länge von einem Zeichen. Mögliche Werte sind „Regular (1)", „Exempt (Diplomats, no Tax) (0)" sowie „Reduced (living in a special Region) (2,3,4)". Die „Legal Entity" (Rechtseinheit) ist ein Pflichtfeld mit einer maximalen Länge von 20 Zeichen; als Wert ist „Passenger Cars" vorgesehen.

Auch in diesem Abschnitt sind die Felder im MVP vorbelegt und schreibgeschützt: Die Steuerklassifizierung ist auf „Standard", der Steuerklassifizierungscode auf „Regular (1)" und die Rechtseinheit auf „Passenger Cars" gesetzt.

**Navigation und Verhalten der Schaltflächen**

Sie können im Vertragserstellungs-Assistenten nur fortfahren, wenn alle Pflichtfelder ausgefüllt und validiert sind. Ist ein Pflichtfeld leer, erscheint eine Hinweismeldung (Toast) nach dem Muster „[Feldname] is not filled", zum Beispiel „Partner type is not filled" oder „Tax classification is not filled".

Mit „Back" kehren Sie zur vorherigen Seite zurück; im Abschnitt „Receivables from FI System" ist das die Seite „Product Selection". Mit „Next" gelangen Sie zur nächsten Seite; im Abschnitt „Tax & Legal Details" ist das die Seite „Data & Documents Preview".

Wenn Sie auf „Cancel" klicken, erscheint ein Hinweisdialog: „You have unsaved changes that will be lost. The changes you have made will not be updated and they will be lost. Are you sure you want to proceed?" Wählen Sie im Dialog „Cancel", kehren Sie zur aktuellen Seite zurück. Wählen Sie „Proceed", gelangen Sie zur Startseite (Landing Page).

**Gestaltung**

Die Oberfläche entspricht den Vorgaben der Mercedes-Benz Workbench sowie dem vom Kunden freigegebenen UI-Design.