# Batch 855 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung (Contract Management)**

Die Vertragsverwaltung in oneSCM ermöglicht es, Servicevertragsdaten zentral zu speichern und jederzeit abzurufen. Grundlage ist ein einfaches Vertragsdatenmodell, das die Stammdaten eines Vertrags abbildet. Alle im Datenmodell festgelegten Datenfelder können in oneSCM gespeichert werden, und sämtliche CRUD-Operationen (Anlegen, Lesen, Ändern, Löschen) sind für die gespeicherten Vertragsdaten möglich. Das Modell konzentriert sich auf die Speicherung. Werte, die in der Oberfläche angezeigt werden sollen, müssen nicht zwingend gespeichert sein, sondern können bei Bedarf berechnet werden. So wird beispielsweise die Gesamtlaufzeit eines Vertrags aus dem gespeicherten Start- und Enddatum ermittelt. Daten wie Produkte, Fahrzeuge oder Kunden werden von den jeweiligen Domänen verwaltet und im Vertrag lediglich über ihre Kennung referenziert, etwa über die Produkt-ID oder die Fahrzeugidentifizierungsnummer (VIN). Das Datenmodell umfasst zunächst den aktuell vereinbarten MVP-Umfang und ist so angelegt, dass es später erweitert und auch strukturell angepasst werden kann.

**Vertragsübersicht (Landing Page)**

Auf der Startseite der Vertragsverwaltung werden die Verträge in einer Tabelle dargestellt. Die Tabelle kann sortiert werden. Die Anzahl der angezeigten Zeilen entspricht der Anzahl der ausgewählten Zeilen. Die Suche liefert korrekte Ergebnisse, und zwar sowohl bei Auslösen der Suche per Klick als auch bei Betätigen der Eingabetaste.

**Statusabfrage über die Schnittstelle**

Konsumierende Systeme können über die Schnittstelle den aktuellen Status eines Servicevertrags abrufen, um den Vertrag entsprechend seinem Status zu behandeln. Neben dem Status werden zwei weitere Informationen bereitgestellt: die Operationen, die im aktuellen Status möglich sind, sowie die Folgestatus, in die der Vertrag wechseln kann. Ist ein Vertrag beispielsweise aktiv, ist eine mögliche Operation die Sperrung (Suspendierung), und ein möglicher Folgestatus ist „suspended“.

**Statuswechsel und vorzeitige Beendigung**

Ein Vertrag kann angelegt, anschließend suspendiert, wieder reaktiviert und schließlich beendet werden. Die vorzeitige Beendigung steht Benutzern der Market Operations für aktive Verträge zur Verfügung, wenn sie über die erforderlichen Rechte verfügen. Sie dient dazu, einen Vertrag früher als ursprünglich geplant zu beenden, etwa bei Diebstahl des Fahrzeugs oder wenn ein Kunde dauerhaft nicht zahlen möchte. Dadurch werden die periodischen Rechnungen gestoppt und der Endkunde kann die Werkstattleistungen nicht mehr nutzen.

Die Funktion „Terminate Early“ wählen Sie im Dropdown-Menü „Status“. Über „Show All Contracts“ können Sie alle Verträge eines Kunden einsehen. Anschließend wählen Sie den gewünschten Vertrag aus und geben die Pflichtfelder „Date of Termination“, „Mileage at Termination (km)“ und „Reason“ an. Für den Grund steht eine Dropdown-Liste mit den Werten Other, Transfer, Contract Terminated by the Customer, Theft, Total loss und Sold zur Verfügung. Sie können auch mehrere Verträge eines Kunden auswählen und über das Kontrollkästchen „Apply following to selected contracts“ denselben Grund auf alle ausgewählten Verträge anwenden.

Nach dem Abschluss wechselt der Status des Vertrags automatisch von „Active“ auf „Terminated“ und wird überall, wo der Vertragsstatus angezeigt wird, als „terminated“ dargestellt. Der Kunde erhält eine E-Mail-Benachrichtigung über die Beendigung. Das System Vega wird über die vorzeitige Beendigung in der I155-Datei mit dem Status „014“ informiert. Steht die I155-Datei nicht zur Verfügung, erhält Vega die letzten Änderungen an den Verträgen nicht, was die Geltendmachung von Ansprüchen aus den Verträgen beeinträchtigen kann. Die vorgenommene Änderung wird im Reiter „History“ des Vertrags protokolliert. Nicht Teil des MVP und für einen späteren Ausbau vorgesehen sind Contingent Products.