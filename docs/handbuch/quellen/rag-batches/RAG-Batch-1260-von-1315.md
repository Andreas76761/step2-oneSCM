# Batch 1260 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 18 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation (Contract Calculation)**

In der Preisberechnung wurde die Obergrenze für den Preisfaktor von 2,00 auf 5,00 angehoben, da sich auf dem deutschen Markt nicht alle Preise mit dem bisherigen Maximalwert erfassen ließen. Ebenfalls angepasst wurde die Produktlinie COMPACT_PLUS, die nun als COMPACTPLUS geführt wird. Zudem wurde ein Laufzeitzertifikat integriert, und ein Fehler beim VehicleOrder-Job wurde behoben.

Die Berechnung von Kampagnen- und Händlerrabatten wurde grundlegend überarbeitet. Bisher wurden beide Rabatte erst nach der Rundung der monatlichen Beträge angewendet. Nun wird der Kampagnenrabatt direkt auf die Summe der Nettopreisbestandteile aus den Preistabellen angewendet, also auf Grundpreis, Optionen, technische Faktoren und Zuschläge. Der Händlerrabatt folgt nach dem Kampagnenrabatt. Er kann nur noch als Betrag, nicht mehr als Prozentwert angegeben werden. Der eingegebene Betrag bleibt auf der Rechnung an den Händler erhalten, wobei der höchstmögliche Wert dem Restbetrag bis 0 entspricht.

**Produktverwaltung**

Auf der Produktansicht zeigt der Bereich der Limits nun alle definierten Attribute an, etwa Alters- und Laufleistungsgrenzen, und nicht mehr nur den Namen. Alle Benutzer mit Leseberechtigung können die konkreten Werte dadurch einsehen, ohne das Produkt im Bearbeitungsmodus öffnen zu müssen. In Schritt 5 der Produkterstellung werden die Mindest- und Höchstwerte für „Vehicle Age at Contract Start“ jetzt mit der Einheit Monate und für „Vehicle Mileage at Contract Start“ mit der Einheit km angezeigt. Dies gilt für alle verfügbaren Limits (MPC, Direct-to-Customer und Dealership).

Wenn Benutzer optionale Codes oder Body-Coverage-Codes aus der für ein Produkt verwendeten Blaupause entfernen oder hinzufügen, bleiben bereits bestehende Produkte unverändert. Die Änderungen wirken sich nur auf künftig angelegte Produkte aus. Der Benutzer erhält dazu den Hinweis, die erforderlichen Maßnahmen zu ergreifen, um die Vertreter der Märkte zu informieren.

In der Suche unter „Manage Products & Prices“ wurde das Pop-up für weitere Filter vergrößert, damit die Dropdown-Listen vollständig sichtbar sind.

**Kampagnenverwaltung**

Beim Anlegen einer Kampagne mit dem Rabatttyp „Sticker Price“ darf ein MPC-Benutzer in der Preismatrix nur noch Werte eingeben, die unter dem Monatswert des Produkts liegen. Die Navigation in Schritt 2 wurde verbessert: Kehrt man dorthin zurück, ist das zuvor bearbeitete Produkt beziehungsweise Cluster vorausgewählt, und bereits eingetragene Rabattpreise bleiben erhalten. Bisher war stattdessen das erste Element vorausgewählt, und beim Wechsel erschien ein Hinweis auf ungespeicherte Änderungen. Der Tooltip am Symbol der Preismatrix lautet nun „See original prices and discounted amount“. In der Kampagnenübersicht steht in der Rabattspalte bei Sticker-Price-Kampagnen statt eines Strichs die Angabe „Sticker Price“.

Die finanziellen Eingabefelder bei der Kampagnenerstellung wurden angepasst. Für After-Sales-Kampagnen ist die Kostenstelle ein statischer Wert pro Markt, der zentral konfiguriert wird, etwa in der Marktkonfiguration. Das Feld „Debtor Number“ entfällt, da es für diese Kampagnen nicht benötigt wird. Die „Provision Component ID“ ist ebenfalls ein statischer, zentral konfigurierter Wert pro Markt. Für Sales-Kampagnen gilt die beschriebene Logik für die Eingabefelder ebenfalls.

**Oberfläche und Suche**

Die Karten auf den Startseiten wurden überarbeitet. Symbol und Text haben nun eine feste Position, auch wenn der Text zweizeilig ist, und die Kartenhöhe wurde so vergrößert, dass alle Elemente darin Platz finden. Das Fahrzeugbild (Pkw/Transporter) unten rechts in der Anwendung wird jetzt auch auf großen Bildschirmen, etwa 24-Zoll-Monitoren, korrekt dargestellt.

Die Suche auf der Seite der TO-Gruppen wurde angepasst. Sie unterscheidet nun zwischen Groß- und Kleinschreibung und liefert auch dann Ergebnisse, wenn nur ein Teil des Namens eingegeben wird.