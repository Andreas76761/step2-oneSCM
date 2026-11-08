# Batch 618 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kundendatenmodell für Großkunden und Flotten (B2B)**

Mit dieser Erweiterung von oneSCM wird die Verwaltung gewerblicher Kunden (Customer Type „Commercial“) für den B2B-Bereich verbessert. Ursprünglich war geplant, große Unternehmen über ein Haupt-/Tochtergesellschaftskonzept abzubilden. Dieser Ansatz wurde jedoch bewusst vereinfacht: Tochtergesellschaften sind für die Behandlung von B2B-Kunden nicht mehr erforderlich. Die Funktion richtet sich hauptsächlich an das Market-Operations-Team. Sie ist als Basis-Ablauf zu verstehen und noch keine vollständige End-to-End-Kundenverwaltung für Flotten. Weitere Anwendungsfälle sollen in kommenden Planungsintervallen besprochen und umgesetzt werden.

**Steuernummer in der Vertragserstellung**

Bei der Erfassung eines gewerblichen Kunden steht in den Kundendetails nun das Attribut „Steuernummer“ zur Verfügung. Die Schaltfläche „Weiter“ wird erst aktiv, wenn alle Pflichtfelder ausgefüllt sind. Anschließend öffnet sich die Seite mit den Kunden- und Zahlungsdetails. Es muss entweder eine USt-IdNr. (VAT ID) oder eine Steuernummer angegeben werden. Die Prüfung der USt-IdNr. bleibt unverändert und ist an das System VIES angebunden. Die Steuernummer darf höchstens 14 Zeichen lang sein und folgt dem Format (F)FF/BBB(B)/UUU(U)P. Dabei stehen (F)FF für die letzten zwei oder drei Ziffern der Finanzamtsnummer, BBB(B) für die drei- oder vierstellige Bezirksnummer des zuständigen Finanzamts, UUU(U) für die individuelle Unterscheidungsnummer des Steuerpflichtigen (in NRW vierstellig) und P für die aus den vorherigen Ziffern berechnete Prüfziffer. Ein Beispiel ist 12/345/67890. Bei einem falschen Format erscheint die Fehlermeldung „Invalid Tax Number, expected format is (F)FF/BBB(B)/UUU(U)P Example: 12/345/67890“.

**Dublettenprüfung**

Das System prüft, ob in oneSCM bereits ein Kunde mit derselben USt-IdNr. oder Steuernummer existiert, und zeigt passende Kunden an. Wird ein vorhandener Kunde ausgewählt, läuft der bisherige Prozess weiter. Im Fenster für passende Kunden wurde die Bezeichnung „VAT ID“ in „Tax Number/VAT ID“ umbenannt. Die Dublettenprüfung auf der Seite mit den Kunden- und Zahlungsdetails wurde auf ein späteres Planungsintervall (PI10) verschoben.

**Kunden- und Zahlungsdetails**

Im Bereich „Tax & Legal Details“ wird die Steuernummer angezeigt. Sie ist aus der vorherigen Seite vorbefüllt und bearbeitbar. Wird dort die Steuernummer oder die USt-IdNr. geändert, gelten dieselben Prüfungen wie oben beschrieben.

Im Bereich „Payment Information“ gibt es oben einen neuen Abschnitt „Payment Reference“. Jeder Kunde hat nur eine Zahlungsreferenz, die nicht an eine IBAN gebunden ist. Das Feld ist optional, vom Typ Text und auf 230 Zeichen begrenzt. Ein Tooltip erklärt: „Individual Reference that will be displayed on invoices.“ Die Angabe wird an Revenue und von dort an das FI-System übermittelt, erscheint auf der Kundenrechnung und wird von Revenue im Kopftext (HTXT01) ausgegeben. Die IBAN steht in einem eigenen Abschnitt unter dem Titel „Bank Details“.

**Mehrere Kontaktpersonen**

Es können nun mehrere Kontaktpersonen erfasst werden. In der Rollenauswahl stehen die Werte „Signee1“ und „Signee2“ zur Verfügung. Die Schaltfläche „Kontaktperson hinzufügen“ bleibt auch nach dem ersten Signee aktiv. Der Ablauf nach dem Klick sowie die Validierungen und Attribute bleiben unverändert. Mindestens ein Signee ist verpflichtend, Signee2 ist optional. Die Rolle kann zweimal vergeben werden, sofern es sich nicht um doppelte Einträge handelt. Zur Dublettenprüfung werden die E-Mail-Adressen verglichen: Die E-Mail-Adresse von Signee2 darf nicht mit der von Signee1 übereinstimmen, andernfalls erscheint eine Fehlermeldung. Mehrere Kontaktpersonen sind in folgenden Situationen möglich: bei der Vertragserstellung mit neuem Kunden, bei der Vertragserstellung mit bestehendem Kunden sowie in der Kundenverwaltung beim Anlegen und beim Bearbeiten eines gewerblichen Kunden.

**Änderungen in der Kundenverwaltung**

Die Steuernummer ist in der Vorschau der Kundenverwaltung sichtbar. Steuernummer und Zahlungsreferenz stehen in der Ansicht und auf der Bearbeitungsseite gewerblicher Kunden zur Verfügung. Market-Operations-Mitarbeitende können auf der Bearbeitungsseite weitere Kontaktpersonen hinzufügen, wobei dieselben Regeln wie beim Anlegen und Bearbeiten über die Kundenverwaltung gelten.

**Synchronisation mit OneERP**

Werden USt-IdNr. oder Steuernummer in oneSCM erfasst, werden die Daten zum Beispiel bei Anlage oder Aktualisierung eines gewerblichen Kunden mit dem System OneERP synchronisiert. Handelt es sich um eine Steuernummer, wird als Steuertyp „taxNumber“ und die Steuernummer selbst übermittelt. Handelt es sich um eine USt-IdNr., wird als Steuertyp „vat ID“ und die USt-IdNr. übermittelt.

**Hinweis zum Einsatz**

Laut den Angaben soll diese Funktion noch nicht in der Produktivumgebung ausgerollt werden.