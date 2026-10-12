# Batch 675 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kundendaten erfassen und Mercedes-me-Profildaten nutzen**

Wenn Sie als Mitarbeiter der Marktorganisation über die Navigationsleiste im Reiter „Vertragserstellung" einen Servicevertrag für einen neuen Kunden anlegen, gelangen Sie im Verlauf der Erstellung zum Schritt „Kundendetails". Dort erfassen Sie die erforderlichen Angaben: Vorname, Nachname, E-Mail-Adresse bzw. Mercedes-me-ID sowie Telefonnummer bzw. Mercedes-me-ID. Zusätzlich fragen Sie die Erlaubnis des Kunden ein, seine Mercedes-me-Profildaten verwenden zu dürfen.

Anschließend prüft das System zunächst, ob der Kunde bereits in der oneSCM-Datenbank vorhanden ist. In einem zweiten Schritt erfolgt eine Prüfung in Mercedes me. Diese zweite Prüfung findet nur statt, wenn der Kunde seine Erlaubnis erteilt hat. Dabei werden zwei Abfragen durchgeführt: eine mit der E-Mail-Adresse und eine mit der Telefonnummer. Daten aus oneSCM haben stets Vorrang vor Daten aus Mercedes me. Wird ein Attribut sowohl in oneSCM als auch in Mercedes me gefunden, gilt der Wert aus oneSCM.

**Mit Erlaubnis des Kunden**

Existiert der Kunde weder in oneSCM noch in Mercedes me, werden Sie zur Seite „Kunde anlegen" weitergeleitet. Die zuvor erfassten Kundendetails werden dort automatisch übernommen.

Existiert der Kunde in oneSCM, aber nicht in Mercedes me, erscheint ein Dialogfenster „Kundentreffer". Sie können einen der gefundenen Kunden auswählen, sofern die Angaben übereinstimmen, oder einen neuen Kunden anlegen. Wählen Sie einen Treffer aus, wird die Schaltfläche „Weiter" aktiv, und Sie gelangen zur Seite „Kunde aktualisieren". Passt keiner der Treffer zum Kunden, der den Servicevertrag wünscht, wählen Sie die Neuanlage. Auch dann wird „Weiter" aktiv, und Sie werden zur Seite „Kunde anlegen" geleitet, wo die bereits erfassten Daten vorausgefüllt sind.

Existiert der Kunde sowohl in oneSCM als auch in Mercedes me, erscheint ebenfalls das Dialogfenster „Kundentreffer" mit denselben Auswahlmöglichkeiten. Entscheiden Sie sich für einen Treffer, gelangen Sie nach Klick auf „Weiter" zur Seite „Kunde aktualisieren". Die Mercedes-me-ID wird dabei automatisch mit den Informationen aus der Mercedes-me-Schnittstelle befüllt. Wählen Sie stattdessen die Neuanlage, werden Sie zur Seite „Kunde anlegen" geleitet, auf der die vorher erfassten Daten vorausgefüllt sind.

Existiert der Kunde nicht in oneSCM, wohl aber in Mercedes me, unterscheidet das System zwei Fälle. Ergibt die Abfrage und Dublettenprüfung anhand von E-Mail-Adresse und Mobilnummer genau einen Treffer, werden die Daten aus dem Mercedes-me-Profil übernommen. Sie wechseln direkt zur Oberfläche der Kundenerfassung, in der die im Mercedes-me-Profil verfügbaren Felder vorausgefüllt werden. Werden dagegen zwei Mercedes-me-Profile gefunden, eines über die Mobilnummer und eines über die E-Mail-Adresse, erscheint das Dialogfenster „Kundentreffer", und Sie entscheiden, welches Profil verwendet werden soll. Wählen Sie einen Treffer aus und klicken auf „Weiter", gelangen Sie zur Seite „Kunde aktualisieren". Die Mercedes-me-ID sowie weitere Attribute, die in oneSCM und Mercedes me gemeinsam vorkommen, werden automatisch mit den Daten aus der Mercedes-me-Schnittstelle befüllt. Passt keiner der Treffer, wählen Sie die Neuanlage und werden mit vorausgefüllten Kundendetails zur Seite „Kunde anlegen" geleitet.

**Ohne Erlaubnis des Kunden**

Hat der Kunde der Nutzung seiner Mercedes-me-Daten nicht zugestimmt, wird ausschließlich die oneSCM-Datenbank geprüft. Ist der Kunde dort nicht vorhanden, werden Sie zur Seite „Kunde anlegen" weitergeleitet, und die erfassten Kundendetails werden automatisch übernommen. Ist der Kunde vorhanden, erscheint das Dialogfenster mit den identifizierten Kunden. Sie wählen entweder einen passenden Treffer, woraufhin Sie nach Klick auf „Weiter" zur Seite „Kunde aktualisieren" gelangen, oder die Neuanlage eines Kunden, woraufhin Sie nach Klick auf „Weiter" zur Seite „Kunde anlegen" mit vorausgefüllten Kundendetails geleitet werden.

**Nutzen und technische Grundlage**

Durch diese Funktion werden bereits in oneSCM vorhandene Kunden vor einer Neuanlage erkannt, sodass weniger doppelte Kundendatensätze entstehen. Für Kunden, die in oneSCM neu sind, aber bereits ein Mercedes-me-Profil besitzen, werden die Profildaten importiert, sodass Sie weniger Felder manuell ausfüllen müssen. Für die Anbindung an Mercedes me werden die Schnittstellen „searchUserV2" und „getUserProfileV2" des User Profile Service verwendet.