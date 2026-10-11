# Batch 655 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Vertragserstellung und Kundensuche**

**Automatische Adressprüfung bei der Vertragserstellung**

Bei der Vertragserstellung werden die eingegebenen Kundenadressen automatisch geprüft. Bisher wurden die Adressfelder nur formal kontrolliert, also hinsichtlich der erlaubten Zeichen und der Länge. Nun werden die Pflichtfelder der Adresse nach dem Ausfüllen über die Domäne Customer & Partner Management mithilfe der Google-API validiert. Die Prüfung erhöht Genauigkeit, Effizienz und Compliance, verringert das Risiko menschlicher Fehler und sorgt für eine einheitliche Validierung aller geprüften Daten. Sie verhindert zudem, dass fehlerhafte Adressdaten erfasst werden.

Der Anwender erhält Vorschläge, die er selbst bestätigen oder korrigieren muss. Die Schaltfläche „Next“, mit der die Vertragserstellung fortgesetzt wird, ist erst aktiv, wenn die Adress-Pflichtfelder erfolgreich validiert wurden. Ist die Postleitzahl nicht plausibel, erscheint die Meldung „Please insert a valid Post Code“. Ist die Stadt nicht gültig, wird „Please insert a valid City“ angezeigt. Ist die Straße nicht plausibel, lautet die Meldung „Please insert a valid Street name“. In allen drei Fällen bleibt „Next“ deaktiviert, bis das Feld gültig ist. Bei der Hausnummer erscheint ein Pop-up mit der Aufforderung „Please confirm the House Number“ und den Optionen „YES“ und „NO“. Bei „YES“ wird der eingegebene Wert gespeichert und als gültig betrachtet. Bei „NO“ erscheint die Meldung „Please insert a valid House Number“, und „Next“ bleibt deaktiviert. Wird die Kundenadresse nach der Vertragserstellung und der Vergabe der Vertragsnummer, aber vor dem Setzen des Vertrags auf den Status „CONFIRMED“ geändert, wird die Adressvalidierung wiederholt und die neuen Daten überschreiben die bisherigen.

**Prüfung auf doppelte Kunden (Fuzzy Search)**

Aktuell erfolgt die Suche nach bestehenden Kunden bei der Vertragserstellung über eine exakte Übereinstimmung. Die Suche im Kundenauswahlfenster arbeitet mit Nachname, Vorname, E-Mail-Adresse und Telefonnummer bzw. Mercedes-me-ID. Untersucht wurde, wie sich doppelt angelegte Kunden in oneSCM durch zwei Ebenen einer unscharfen Suche mit einem Schwellenwert von 80 % auf ein Minimum reduzieren oder ganz vermeiden lassen. Kunden sollen dabei ab einer Ähnlichkeit von 80 % identifiziert werden. Auch Tippfehler in Angaben wie Vor- und Nachname sollen dazu führen, dass ein bereits vorhandener Kunde erkannt wird.

**Behobene Fehler in Vertragserstellung und Kundensuche**

Bei bestehenden Kunden war die Vertragserstellung nicht mehr möglich, wenn im Prozess die Schaltfläche „Back“ verwendet wurde. Nach der Rückkehr zur Produktauswahl und dem erneuten Wechsel zur Seite „Customer & Payment Information“ erschienen zwei identische Fehlermeldungen, und „Next“ blieb deaktiviert, obwohl alle Pflichtfelder gefüllt waren. Verträge lassen sich nun auch dann erstellen, wenn „Back“ bei bestehenden Kunden genutzt wurde. Bei neuen Kunden trat das Problem nicht auf.

Wurde ein Kunde mit Mercedes-me-Profil aus den Suchergebnissen ausgewählt und der Vertrag aktiviert, wurde die Mercedes-me-ID in der Kundenverwaltung nicht gespeichert. Dieses Problem wurde behoben.

Außerdem überschrieb ein leeres Telefonnummernfeld im Mercedes-me-Profil die vom Anwender eingegebene Telefonnummer, sodass sie erneut erfasst werden musste. Leere Felder aus Mercedes me überschreiben eingegebene Daten nun nicht mehr. Die Angaben werden mit den verfügbaren Mercedes-me-Daten und der Eingabe des Anwenders vorbelegt.

Schließlich konnte der Anwender nicht fortfahren, wenn die Berechtigung zur Nutzung von Informationen aus Mercedes me aktiviert war, der Kunde dort aber nicht gefunden wurde. Stattdessen erschien eine Fehlermeldung. Jetzt kann der Vorgang auch dann fortgesetzt werden, allerdings ohne Daten aus Mercedes me.

**Sammelrechnung auf Kundenebene („Global Collective Invoices“)**

Für die Sammelrechnung auf Kundenebene gibt es den Schalter „Global Collective Invoices“. Er ist in der Vertragserstellung und in der Kundenverwaltung verfügbar, und ein Tooltip daneben erläutert die Funktion.

Bei einem neuen Kunden kann ein Vertrag mit aktivierter Einstellung angelegt werden. Beim nächsten Vertrag für denselben Kunden bleibt die Einstellung erhalten. Wird ein Vertrag dagegen mit deaktiviertem Schalter erstellt, gilt beim nächsten Vertrag für diesen Kunden wieder die Standardeinstellung.

Bei einem bestehenden Kunden, für den „Global Collective Invoices“ aktiviert ist, wird der Schalter in allen künftigen Verträgen als aktiviert angezeigt. Ist der Schalter dagegen deaktiviert und bleibt es, gilt die Einstellung nur für den aktuellen Vertrag.

In der Kundenverwaltung ist der Schalter auch in der Vorschau eines bestehenden Kunden sichtbar. Der Tooltip zeigt sowohl auf der Seite der Kundenverwaltung als auch in der Vorschau den korrekten Text an.