# Batch 1184 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Sonderfälle für B2B/VAN-Kunden (Vertragsberechnung)**

Ein Sonderfall liegt vor, wenn ein Flottenkunde das endgültige Produkt verhandelt, also den Preis und/oder abweichende Konfigurationsoptionen wie Laufleistung oder Laufzeit. Händler, Key-Account-Manager oder weitere vertriebsseitige Rollen verhandeln mit dem Kunden, erfassen ein bis maximal 100 Fahrzeuge im System und stellen für den Vertrag eine Sonderfall-Anfrage an einen MPC-Benutzer. Dieser lehnt die Anfrage ab oder passt den Preis an. Werden Änderungen vorgenommen, ist ein zweiter MPC-Prüfer zur Freigabe erforderlich (Vier-Augen-Prinzip). Anschließend geht die Anfrage an den Anfragenden zurück.

**Benachrichtigung und Übersichtsseite**

Sobald zu einem Vertrag ein Angebot erstellt und ein Sonderfall ausgelöst wurde, erhalten ausschließlich MPC-Benutzer eine Benachrichtigung. Über das Glockensymbol öffnet sich ein Seitenpanel mit den offenen Sonderfällen. Ein Klick auf einen Sonderfall führt zur Übersichtsseite der Sonderfälle. Fälle, die noch bearbeitet werden müssen, sind mit blauen Punkten markiert.

Die Übersichtsseite steht unter „Contract Generation – Special Cases“ nur MPC-Benutzern zur Verfügung, und zwar nur denjenigen, die nicht selbst die Anfragenden sind. Standardmäßig steht die älteste Anfrage in der obersten Zeile, nicht bearbeitete Fälle werden zuerst angezeigt. Die Liste ist paginiert und lässt sich nach dem Einreichungsdatum und nach dem Status sortieren. Gesucht werden kann nach Vertragsnummer und Kundenname (jeweils alphanumerisch). Gefiltert werden kann nach Anfragetyp (Preisänderung sowie Laufleistung oder Laufzeit, Mehrfachauswahl) und nach Status (Offen, In Prüfung, Genehmigt, Abgelehnt). Jede Anfrage zeigt Vertragsnummer, Kundenname, Anfragetyp, Status und Fälligkeitsdatum. Das Fälligkeitsdatum richtet sich nach der Marktkonfiguration und gibt an, bis wann offene bzw. in Prüfung befindliche Anfragen bearbeitet werden können. In der Aktionsspalte steht „Prüfen“ zur Verfügung, womit die Anfrage geöffnet und angenommen, abgelehnt oder geändert werden kann, sowie „Ansehen“ für den reinen Lesezugriff.

Die Status bedeuten im Einzelnen: „Offen“ heißt, die Anfrage wartet auf den ersten MPC-Prüfer. Lehnt dieser ab, geht die Information an den Vertrag zurück. „In Prüfung“ bedeutet, dass der erste Prüfer Änderungen vorgenommen hat und ein zweiter Prüfer die Anfrage bewerten muss. „Genehmigt“ bedeutet, dass beide Prüfer die Anfrage freigegeben haben. „Abgelehnt“ bedeutet, dass einer der beiden Prüfer sie abgelehnt hat. Bei Genehmigung oder Ablehnung werden die Daten mit den geänderten Preisen an die Vertragserstellung (Generation) übermittelt. Wenn ein MPC nach einer in der Marktkonfiguration festgelegten Anzahl von Tagen nicht reagiert hat, wird die Anfrage abgelehnt. Abgelehnte oder erledigte Benachrichtigungen werden nach einer ebenfalls marktspezifisch konfigurierten Zeit per Soft Delete entfernt.

**Preisänderung: erster Prüfer (MPC 1)**

Beim Öffnen einer Anfrage zur Preisänderung sieht der Benutzer alle Daten sowie die ursprünglichen Kommentare des Anfragenden, jeweils mit Datum und Benutzernamen. Die Fahrzeugdaten lassen sich in einem Dialog einsehen, der die von der Vertragserstellung gelieferten Daten für maximal 100 Einträge zeigt. Bei mehr als einem Fahrzeug wird die Anzahl angezeigt. Bevor Änderungen möglich sind, muss der Benutzer „Prüfen“ wählen.

Anschließend werden alle Preisbestandteile angezeigt. Überschrieben werden können Grundpreis, Optionspreise, Verwaltungsgebühr und Zahlungsintervallgebühr. Nicht editierbar und ausgegraut sind Branchenfaktor, technische Optionen, Verkaufsprovision, Kampagnentyp-Rabatt und Händlerrabatt. Sobald ein Preisbestandteil geändert wird, berechnet das System den Kundenpreis sofort neu, und zwar pro Fahrzeug und für die Gesamtzahl der Fahrzeuge, jeweils monatlich und insgesamt. Es gelten dieselben Validierungen wie im Produkt. Die Berechnung erfolgt zusätzlich zu bereits im Produkt gewährten Rabatten, und Preisänderungen und Rabatte können gemeinsam angewendet werden.

Im Rabattbereich wählt der Benutzer den Rabattart (Betrag oder Prozent) und gibt den Wert ein. Wird ein Rabatt angewendet, ist die Angabe einer Kostenstelle verpflichtend. Zusätzlich kann ein Kommentar mit bis zu 500 alphanumerischen Zeichen erfasst werden. Auch hier wird der Kundenpreis neu berechnet. Prozentuale Rabatte werden in absolute Beträge umgerechnet und als solche gespeichert.

Lehnt der Benutzer ab, bleiben alle Preisbestandteile unverändert, und der Anfragende erhält den Status „Abgelehnt“. Wählt er „Bearbeiten und Fortfahren“, werden Preise, Kostenstelle und Kommentar gespeichert, der Status wechselt auf „In Prüfung“, und die Anfrage geht an den zweiten MPC-Prüfer. Ohne Änderungen ist die Schaltfläche zum Fortfahren deaktiviert. Nach dem Fortfahren kann MPC 1 die Anfrage nur noch ansehen.

**Preisänderung: zweiter Prüfer (MPC 2)**

Der zweite Prüfer sieht alle Daten einschließlich der vom ersten Prüfer berechneten Listen- und Kundenpreise sowie die Kommentare des Anfragenden und des ersten Prüfers. Auch hier muss zunächst „Prüfen“ gewählt werden. Der Benutzer kann bearbeiten, genehmigen oder ablehnen. Beim Bearbeiten gilt dasselbe Verhalten wie beim ersten Prüfer, statt „Fortfahren“ erscheint jedoch die Schaltfläche „Aktualisieren“.

Bei Genehmigung oder Ablehnung erscheint eine abschließende Übersicht inklusive eventueller Kommentare. Dort kann der Benutzer zurückgehen und bearbeiten oder fortfahren; ein Tooltip weist darauf hin, welche Aktion die Anfrage ausführen wird. Wird bearbeitet, ist erneut ein Freigabeprozess nötig. Beim Fortfahren werden die Preise geändert und mit allen Details, einschließlich Kostenstelle und Kommentaren, an die Vertragserstellung gesendet. Nach Abschluss dieser Schleife kann der Benutzer den Endstatus einsehen, und die Daten gehen mit allen Details an den Anfragenden zurück.

**Laufzeit oder Laufleistung**

Für Anfragen zu Laufzeit oder Laufleistung gelten für beide Prüfer dieselben Abläufe wie bei der Preisänderung. Der Benutzer sieht alle Daten und die ursprünglichen Kommentare des Händlers, muss vor Änderungen „Prüfen“ wählen und kann die Fahrzeugdaten einsehen. Dabei wird stets die angefragte Konfiguration angezeigt.

**Allgemeine Regeln**

Nur MPC-Benutzer haben Zugriff auf diese Seiten, wobei Benutzername, Rollen und Berechtigungen geprüft werden. Derselbe Benutzer darf bei einer Anfrage nicht gleichzeitig erster und zweiter Prüfer sein, und der Anfragende kann nicht selbst als Prüfer auftreten. Sobald Änderungen vorgenommen wurden, ist immer eine zweite Freigabe erforderlich.