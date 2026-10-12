# Batch 983 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Technische Option in der Vertragserstellung**

Fahrzeuge können bei Serviceverträgen zusätzlich zu den enthaltenen Leistungen optionale Leistungen erhalten, damit das Rundum-sorglos-Erlebnis erweitert wird. Mit der Technischen Option erkennt das System, ob ein Fahrzeug mit einer solchen Ausstattung versehen ist, und zeigt sie zusätzlich zu den enthaltenen Leistungen an. Ein Beispiel sind die Keramikbremsen bei einigen AMG-Fahrzeugen. Ist ein Fahrzeug entsprechend ausgestattet, wird diese Ausstattung in den Servicevertrag aufgenommen. Die Technische Option kann von Händlern, MO und MPC angeboten werden. Sie steht für Privat- und Gewerbekunden sowie für alle Branchentypen zur Verfügung. Name, Beschreibung und Preis (netto, brutto und Mehrwertsteuerbetrag) stammen aus der Vertragsdomäne. Gestaltung und Grafik folgen dem UI/UX-Ablauf der Mercedes-Benz Workbench.

**Angebot mit vorhandener Fahrgestellnummer**

Sie starten die Angebotserstellung, indem Sie eine Fahrgestellnummer eingeben. Das System ruft die passenden Produkte, optionalen Leistungen und, falls vorhanden, die Technische Option ab. Erkennt die Produktdomäne, dass für die Fahrgestellnummer eine Technische Option erforderlich ist, liefert sie das Produkt samt Preiskonfiguration. Der Preis des Produkts enthält dann die Technische Option. Dieser Preis wird in der Preiskonfiguration angezeigt und für den Vertrag verwendet.

Nach der Auswahl des Produkts gelangen Sie in die Produktdetailansicht. Dort gibt es einen zusätzlichen Reiter „Technical Option“ mit Beschreibung und Preis der verfügbaren Technischen Option. Der Reiter erscheint nur bei Produkten und Fahrgestell-, Baumuster- oder Auftragsnummern, für die eine Technische Option verfügbar ist.

Anschließend konfigurieren Sie das Produkt (Laufzeit, Laufleistung, Zahlungsintervall). Optional können Sie weitere optionale Leistungen, einen Rabatt und eine Kampagne hinzufügen. In der Produktbeschreibung der Leistungen erscheint eine dritte Spalte, in der die enthaltenen Technischen Optionen aufgeführt werden, sobald sie hinzugefügt wurden. Die Preisofferte wird für die Technische Option angepasst.

Danach legen Sie den Vertrag an und erfassen Kunden- und Zahlungsinformationen. In der Übersicht und Bestätigung wird die Technische Option neben den optionalen Leistungen aufgeführt. Die Vertragsvorschau berücksichtigt die Technische Option über eine angepasste Vorlage. Nach der Unterschrift wird die Vertragsaktivierung fortgesetzt. Sobald der Vertrag erstellt ist, muss die Technische Option in der Schnittstelle i155 ergänzt werden.

**Angebot mit Auftragsnummer**

Hat der Auftrag bereits eine Fahrgestellnummer, läuft der Ablauf wie bei vorhandener Fahrgestellnummer. Das gilt auch, wenn der Auftrag noch keine Fahrgestellnummer hat, da Vertragskalkulation und Fahrzeugverwaltung bereits über die SA-Codes verfügen und erkennen können, ob eine Technische Option vorliegt.

**Angebot mit Baumuster**

Sie starten mit der Eingabe eines Baumusters. Das System ruft die passenden Produkte, optionalen Leistungen und, falls vorhanden, Technische Optionen ab. Erkennt die Produktdomäne, dass für das Baumuster eine Technische Option erforderlich ist, liefert sie die Produktkonfiguration ohne die Technische Option. Deren Preis wird separat bereitgestellt und im Reiter „Technical Option“ angezeigt. Er dient als Grundlage für weitere Erläuterungen, die der Händler dem Endkunden gibt.

Nach der Konfiguration des Produkts (Laufzeit, Laufleistung, Zahlungsintervall) und dem optionalen Hinzufügen von Leistungen, Rabatt und Kampagne steht die Schaltfläche „Add Technical Option“ zur Verfügung, sofern für das Baumuster eine Technische Option möglich ist. Sie öffnet ein Modalfenster mit der Überschrift „Technical Options“. Es zeigt den monatlichen bzw. einmaligen Vertragspreis wie auf der Produktauswahlseite und den Hinweis „Select the Technical Option you want to add to this product. You can select multiple options“. Jede Technische Option wird mit einem Auswahlkästchen, einer von Stream 1 gepflegten Kurzbeschreibung und dem von Stream 1 gelieferten Preis dargestellt. Wählen Sie Optionen aus, werden die Preise im Fenster um die Preise der Optionen erhöht.

Mit „Cancel“ schließen Sie das Fenster und kehren zur vorbefüllten Produktauswahlseite zurück. Mit „Apply“ werden die Details aktualisiert, und die Preise auf der Produktdetailseite werden angepasst. In der Produktauswahl werden unter der Produktübersicht drei Spalten angezeigt: enthaltene Leistungen, optionale Leistungen und Technische Option. Auch das „X“ oben rechts schließt das Fenster.

In diesem Stand lässt sich das vollständige Angebot mit oder ohne Technische Optionen erstellen. Möchte der Kunde mit der Vertragserstellung fortfahren, muss ein Identifikator ergänzt werden. Bei einer Fahrgestellnummer folgen Sie dem Ablauf für vorhandene Fahrgestellnummern, bei einer Auftragsnummer dem Ablauf für Auftragsnummern, jeweils mit Technischer Option.

**Unterstützte Abläufe**

Die Technische Option wird bei der regulären Vertragserstellung mit Fahrgestellnummer (mit oder ohne FRD) sowie bei Build to Order unterstützt. Zur Erfassung der Technischen Option muss außerdem der Ablauf über das Baumuster angepasst werden.