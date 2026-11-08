# Batch 1159 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vier-Augen-Freigabe bei der Erstellung von Preisversionen**

Für das Erstellen und Bearbeiten von Preisversionen gilt in allen Märkten ein verpflichtender Vier-Augen-Freigabeprozess. Sobald eine Preisversion samt zugehörigen Clustern angelegt oder geändert wurde, muss sie diesen Prozess durchlaufen. Dadurch wird sichergestellt, dass mindestens zwei unterschiedliche Personen jede Preisversion und ihre Cluster prüfen, bevor sie aktiv wird. Die Funktion richtet sich an MO/MPC-Anwender. Sie ermöglicht den Märkten kontrollierte Prüfungen, schützt vor unberechtigten Änderungen und hält alle Aktionen und Entscheidungen zur Nachvollziehbarkeit und Compliance in einem Protokoll fest.

**Rollen und Ablauf**

Im Prozess gibt es die Rolle des Antragstellers und die des Prüfers. Antragsteller ist jeder Benutzer, der eine Preisversion anlegt, bearbeitet oder zur Prüfung einreicht. Prüfer ist, wer einen Antrag validiert oder bestätigt. Pro Schritt dürfen Antragsteller und Prüfer nicht dieselbe Person sein. Das System erzwingt diese Funktionstrennung in jeder Prüf- und Antragsphase.

Die Rollen wechseln dynamisch: Der Ablauf ist sequenziell, und wer die jeweils letzte Aktion (Anlegen, Bearbeiten oder Einreichen) ausgeführt hat, wird zum Antragsteller für den nächsten Schritt. Der nächste Validierende wird zum Prüfer. Sobald dieser handelt, wird er wiederum zum Antragsteller für den folgenden Schritt. Diese Kette setzt sich bis zur Freigabe fort.

**Erstellen und Bearbeiten**

Der Antragsteller legt eine neue Preisversion mit mindestens einem Cluster an oder bearbeitet eine bestehende Preisversion bzw. einen Cluster. Eine Preisversion kann nur eingereicht werden, wenn sie mindestens einen Cluster enthält. Über die Schaltfläche „Submit for Review“ auf der Cluster-Übersichtsseite wird der Entwurf zur Freigabe eingereicht. Dadurch wechselt der Status in der Spalte „4 Eye“ auf „In Review“.

Ein blauer Punkt zeigt neue oder geänderte Elemente kaskadierend an. Auf Produktebene erscheint er, wenn Preisversionen neu angelegt oder geändert wurden oder wenn ein zugehöriger Cluster hinzugefügt oder bearbeitet wurde. Auf Preisversionsebene erscheint er, wenn die Preisversion selbst neu oder geändert ist oder einer ihrer Cluster hinzugefügt oder bearbeitet wurde. Auf Clusterebene erscheint er bei hinzugefügten oder bearbeiteten Clustern.

**Prüfung**

Der Prüfer sieht auf Produktebene einen blauen Punkt bei Produkten, die geprüft werden müssen. Beim Öffnen der Seite zur Preisverwaltung sieht er blaue Punkte bei den relevanten Preisversionen und Clustern. So kann er sich gezielt auf die Änderungen konzentrieren. Er hat zwei Möglichkeiten:

Er kann die Preisversion freigeben („Approve“), womit der Prozess endet. Alternativ kann er die Preisversion oder einen Cluster bearbeiten. Dann wechselt die Schaltfläche „Approve“ zu „Submit for Review“, und die Preisversion wird erneut eingereicht. Das wiederholt sich, bis die Preisversion freigegeben ist.

Wichtig: Die Schaltfläche „Approve“ bleibt auch dann aktiv, wenn der Prüfer nicht die gesamte Preisversion oder alle Cluster geprüft hat. Das System geht davon aus, dass Prüfer vor der Freigabe die gebotene Sorgfalt walten lassen.

**Statusanzeige und Protokoll**

In der Übersichtstabelle der Preisversionen gibt es die neue Spalte „4 Eye“ mit dem Workflow-Status. „-“ bedeutet, dass sich der Entwurf in Bearbeitung befindet und noch nicht eingereicht wurde. „In Review“ bedeutet, dass die Preisversion den Vier-Augen-Prozess durchläuft. „Approved“ bedeutet, dass der Prozess abgeschlossen und die Preisversion freigegeben ist. Ein Augen-Symbol zum jeweiligen Status öffnet ein vollständiges Protokoll mit Statusänderungen, Benutzer-IDs und Zeitstempeln.

**Abgleich des Startdatums**

Liegt das vorgeschlagene Startdatum bei der abschließenden Bestätigung bereits in der Vergangenheit, setzt das System es automatisch auf das Freigabedatum. Die aktive Version bleibt so lange gültig, bis die neue Version bestätigt ist. Nach der Bestätigung wird das Startdatum der neuen Preisversion aktualisiert, ebenso das Ablaufdatum der bisherigen Version. Das bei der Einrichtung eingegebene Startdatum wird bis zur Bestätigung nicht in der Übersichtstabelle angezeigt.

**Umgang mit bestehenden Preisversionen**

Aktive Preisversionen erhalten standardmäßig den Status „Approved“, geplante Preisversionen den Status „In Review“. Eine Preisversion gilt als aktiv, wenn ihr Startdatum heute oder in der Vergangenheit liegt, ihr Ablaufdatum leer oder in der Zukunft liegt und ihr 4-Eye-Status „Approved“ lautet.

**Vertragslaufzeit in Monaten (Berechnung von Verträgen)**

Bei der Definition der Vertragslaufzeit darf die maximale Anzahl an Monaten höchstens drei Zeichen umfassen. Das System akzeptiert für die Vertragslaufzeit numerische Eingaben mit bis zu drei Zeichen, und zwar sowohl für die Division PC als auch für die Division VAN. Bei einer numerischen Eingabe mit mehr als drei Zeichen wird eine Fehlermeldung angezeigt.