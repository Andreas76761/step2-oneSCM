# Batch 742 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kostenmanagement: Zusatzinformationen und Werkstattrechnungen im Überblick**

Im Bereich Kostenmanagement stehen Ihnen mehrere Informationen zu Verträgen und Fahrzeugen (FIN) zur Verfügung, die Ihnen einen besseren Überblick über Kosten und Kontostand eines ausgewählten Vertrags verschaffen. Sie dienen zugleich als Grundlage für weitere Auswertungen und für die buchhalterische Sicht auf einen Vertrag.

**Händler- und Werkstattinformationen aus GSSN+**

Nach dem Aufruf des Services GSSN+ werden zusätzliche Informationen zum Händler bzw. Lieferanten gespeichert, damit sie später in der Detailansicht angezeigt werden können. Dazu gehören die Outlet-ID, ein Namenszusatz, die Adresse (Straße, Hausnummer, Postleitzahl, Ort, Ortsteil und Land) sowie die Geokoordinaten (Breiten- und Längengrad). Quelle dieser Daten ist GSSN+. Die Anzeige dieser zusätzlichen Informationen ist erst nach dem MVP vorgesehen. Auch das endgültige Design wird erst danach festgelegt; es richtet sich nach der Mercedes-Benz Workbench und nach dem mit dem Kunden abgestimmten UI-Design. Bitte beachten Sie: Ist GSSN+ nicht verfügbar oder reagiert der Service sehr langsam, kann es sein, dass diese Inhalte nicht angezeigt werden.

**Werkstattrechnungen in der Zusammenfassung**

Werkstattrechnungen sind Kosten, die der MPC zu tragen hat. Sämtliche Kosteninformationen werden in VEGA verwaltet. Der Großteil gelangt von dort nach OneSCM, einige wenige Kosten werden manuell erfasst; dies sind die Nicht-VEGA-Kosten. In der Zusammenfassungsansicht können Sie als MPC-Nutzer für einen bestimmten Markt, Vertrag und eine bestimmte FIN folgende Angaben einsehen:

- Der Werkstattrechnungstyp zu einem Kosteneintrag zeigt an, woher die Kosteninformation stammt, und unterstützt die Auswertung in OneSCM.
- Der akzeptierte Rechnungsbetrag samt Währung hilft, den Saldo des Vertrags abzuleiten, die Kosten eines Fahrzeugs ganzheitlich zu betrachten und Auswertungen zu erstellen. Die Quelldaten stammen aus der i156-Datei. Gibt es zu derselben Forderung mehrere Entscheidungen, wird nur der Betrag der letzten Entscheidung berücksichtigt. Der Betrag wird mit „.“ als Tausendertrennzeichen und „,“ als Dezimaltrennzeichen dargestellt, gefolgt von einem Leerzeichen und der Währung, zum Beispiel 1.234,99 EUR.

So finden Sie die Angaben: Suchen Sie einen Vertrag, zu dem Kosten vorliegen, und öffnen Sie dessen Registerkarte „Payment Details“. Klicken Sie im Bereich „Invoicing“ auf „Workshop Invoice“. Dort prüfen Sie, ob der Werkstattrechnungstyp für die jeweiligen Rechnungen korrekt aufgeführt ist und ob der akzeptierte Gesamtrechnungsbetrag mit dem Wert aus der i156 übereinstimmt.

**Voraussetzungen und Datenimport**

Voraussetzung ist, dass die i156-Datei vorliegt und Fahrzeug sowie Servicevertrag in OneSCM vorhanden sind. Die i156 wird voraussichtlich einmal pro Woche oder nach Vorgabe der Architekten empfangen; Nicht-VEGA-Kosten werden nicht periodisch erfasst. Die Daten sollen jederzeit angezeigt werden können. Bei weiteren i156-Importen werden vorhandene Daten aktualisiert und beim erstmaligen Import neue Daten hinzugefügt.

**Wichtige Hinweise**

- Steht die i156 aus irgendeinem Grund nicht zur Verfügung, gibt es keine aktualisierten Informationen.
- Ist ein Eintrag in der i156 fehlerhaft, ist dieser Datensatz in OneSCM nicht verfügbar und muss manuell nachgetragen werden.
- Bei VEGA-Forderungen sind die angezeigten Informationen mindestens eine Woche alt, da die i156 nur einmal pro Woche oder nach Planung der Architekten erzeugt und verarbeitet wird.
- Jobs, die auf gemeinsame Daten zugreifen, dürfen nicht gleichzeitig laufen. Während des Imports der i156 darf beispielsweise der Job für die i155 nicht gestartet werden.