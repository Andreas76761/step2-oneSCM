# Batch 627 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Händlerinformationen im Bereich „Kunden- und Zahlungsinformationen"**

Im Bereich „Kunden- und Zahlungsinformationen" wird ein neuer Abschnitt mit dem Namen „Händlerinformationen" ergänzt. Bisher waren an dieser Stelle keine Angaben zum Händler hinterlegt. Der Abschnitt dient dazu, Details zum Verkäufer anzuzeigen, wenn die Marktorganisation einen Servicevertrag im Auftrag eines bestimmten Händlers verkauft. Das Feld „E-Mail" akzeptiert ausschließlich Eingaben im E-Mail-Format. Das Feld „Händlername" bietet eine Auswahlliste mit allen möglichen Varianten aus GSSN. Das Feld „Stadt" bietet eine Auswahlliste mit allen möglichen Varianten aus GSSN, die zum gewählten Händler gehören. Der Verkäufername wird ausgegraut dargestellt, da er aus dem Quellsystem (Alice/GSSN) übernommen wird. Die Felder gelten ausschließlich auf Vertragsebene und nicht in der Kundenverwaltung. Die Felder werden gegen die geltenden Regeln validiert. Änderungen werden an die zuständige Domäne zurückgemeldet.

**Kundenhistorie in der Kundenverwaltung**

In der Kundenverwaltung steht nun eine Kundenhistorie zur Verfügung, in der alle historienbezogenen Informationen zu einem Kunden in einer einzigen Tabelle geführt werden. Sie ermöglicht es Benutzern der Marktorganisation (MO) und des MPC nachzuvollziehen, wann welche Attribute eines Kunden von wem geändert wurden. Das unterstützt das Incident-Management und erleichtert die Analyse bei Dateninkonsistenzen zwischen den Schnittstellen.

Den Zugang finden Sie über die Kundenverwaltung: Wählen Sie dort zunächst Privat- oder Geschäftskunden aus, danach den gewünschten Kunden, und öffnen Sie die Kundendetailseite über die Schaltfläche „Bearbeiten" bzw. „Alle Informationen anzeigen". Dort befindet sich neben dem Reiter „Verträge" der neue Reiter „Historie". Der Reiter „Verträge" zeigt alle mit dem Kunden verknüpften Serviceverträge, ähnlich wie die neuesten Serviceverträge in der Kundenvorschau. Der Reiter „Historie" zeigt alle Änderungen an diesem Kunden.

Die Tabelle enthält die Spalten „Geänderes Objekt", „Geändertes Attribut", „Alter Wert", „Neuer Wert", „Art der Änderung", „Änderungsdatum" und „Geändert von". Als geändertes Objekt erscheint der Kunde. Berücksichtigt werden alle Attribute der Kundendetailseite, etwa Vorname, Nachname, Straße oder IBAN. Die Art der Änderung ist „Add" oder „Update". Das Datum wird im Format TT.MM.JJJJ HH:MM:SS angezeigt, zum Beispiel 03.11.2023 18:48:23. In der Spalte „Geändert von" steht entweder ein System wie oneERP oder die Benutzer-ID der Person, die die Änderung vorgenommen hat. Sind keine Werte vorhanden, wird „-" angezeigt. Die Spalten lassen sich sortieren, standardmäßig sind die Einträge vom neuesten zum ältesten sortiert.

Über eine Auswahlliste legen Sie fest, wie viele Datensätze pro Seite angezeigt werden. Standard sind 10 Einträge, alternativ stehen 20, 30, 40 und 50 zur Verfügung. Zusätzlich steht eine Seitennavigation bereit. Gestaltung und Darstellung entsprechen dem Mercedes-Benz Workbench und dem mit dem Kunden abgestimmten UI-Design.

**Hinweis zum Filter „Kundentyp"**

Der Vorschlag, den Filter „Kundentyp" auf der Startseite der Kundenverwaltung zu entfernen, wurde nicht umgesetzt. Der Filter ist weiterhin vorhanden, auch wenn die Startseite bereits die Reiter „Privatkunden" und „Geschäftskunden" bietet.