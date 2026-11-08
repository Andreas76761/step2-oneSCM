# Batch 433 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation: Änderungen im Überblick**

Im Bereich Dokumente und Kommunikation wurden mehrere Punkte der Vorlagenverwaltung und der Vertragsdokumenterstellung überarbeitet.

**Vorlagenverwaltung für Benachrichtigungen**

Das Anlegen von Vorlagen im Bereich Benachrichtigungen funktioniert wieder. Zuvor erschien beim Versuch, im Template Management eine Header-Vorlage zu erstellen, die Fehlermeldung „Not allowed", sodass keine Vorlage angelegt werden konnte. Nun lassen sich Vorlagen erfolgreich erstellen.

In der Übersichtsseite der Vorlagenverwaltung bleibt außerdem die Auswahl im Filter erhalten. Wenn Sie über „More filters" etwa Division, Sprache und ein Produkt auswählen und den Filter anwenden, wurde die Mehrfachauswahl des Service-Contract-Produkts beim erneuten Öffnen des Filterdialogs zuvor entfernt. Erwartet wird, dass die gewählten Kriterien bis zum Zurücksetzen des Filters angezeigt werden. Dieser Punkt befindet sich im Status „Reviewed".

**Darstellung in erzeugten Vertragsdokumenten**

Bei der Erzeugung von Vertragsdokumenten wurden mehrere Darstellungsfehler behandelt. Wenn einzelne Werte einer Vertragsvorlage bei der Vertragserstellung leer blieben, waren die Ausrichtungen im Dokument nicht korrekt: Beim Modell erschien ein großes Feld, daneben eine separate Spalte. Ebenso wurde in Benachrichtigungs-E-Mails die Bezeichnung eines Label-Wert-Paares auch dann leer angezeigt, wenn kein Wert vorlag. Erwartet wird, dass die Ausrichtung stimmt und solche Label-Wert-Paare in der E-Mail nicht erscheinen.

Bei Schaltern (Toggle-Optionen), die im Dokument ausgegeben werden, wurde in der Vorschau des Vertragsdokuments im Template Management „TRUE" oder „FALSE" angezeigt. Vorgesehen sind die Werte „YES" und „NO".

Außerdem wurden Felder behandelt, die bei Verwendung einer veröffentlichten Vertragsvorlage in der Vertragserstellung nicht wie erwartet funktionierten. Dazu gehörten die ausgewählte GDPR-Einwilligung und der eingegebene Kontoinhaber (Holder name), die im erzeugten Dokument nicht erschienen. Ebenso zählten dazu Blöcke mit Leerzeichen, bei denen im Dokument der Code „&#xa0;" und eine unsaubere Ausrichtung auftraten, sowie unterschiedlich große Seitenformate von Vertragsdokument und AGB-Seite (T&C).

**Bestätigungs-E-Mail-Vorlage**

Für die Vorlage der Bestätigungs-E-Mail wurde das Datumsformat korrigiert. Zulässig ist das Format TT.MM.JJJJ (dd.mm.yyyy). Für die Vorlage selbst steht eine abschließende Prüfung an; dabei soll die Darstellung vollständig in Blau erfolgen.

**Nicht umgesetzte Vorhaben**

Zwei Punkte wurden abgebrochen und sind daher nicht Bestandteil dieser Version. Geplant war eine Master-Vorlage für eine Änderungsanfrage-E-Mail an den Endkunden, die über die Aktionen im Kundenmanagement ausgelöst werden sollte. Ebenso entfällt die Behebung des Problems, dass beim Anklicken des AGB-Links in der Vertragserstellung eine hochgeladene Vorlage mit der Meldung „Dokument nicht gefunden" quittiert wurde.