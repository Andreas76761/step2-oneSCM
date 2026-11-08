# Batch 362 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Documents & Communications**

**Neue Druckvariable „VersoID"**
In der Vorlagenverwaltung steht eine neue Druckvariable „VersoID" zur Verfügung. Sie dient als zusätzliche Kennung des Fahrzeugs und wird im Abschnitt mit den Fahrzeugdetails des Angebotsdokuments (Proposal Document) sowie der Preisinformation (Price Information) verwendet. Dort erscheint sie als eigene Zeile direkt unterhalb der Fahrgestellnummer, mit der Bezeichnung „Order Number (VerSO)" und dem zugehörigen Wert. Die Zeile wird nur angezeigt, wenn der Vertrag eine VersoID liefert. Ist keine VersoID vorhanden, entfällt die Zeile im Dokument.

Zusätzlich steht der bereits vorhandene Platzhalter für die Deal-ID nun auch in der Vorlage der Preisinformation im Abschnitt Fahrzeugdetails zur Verfügung. Das Dokument zeigt die Deal-ID an, sofern sie vom Vertrag bereitgeliefert wird.

**Anpassung der Bezeichnung in der Verwaltung von System-Benachrichtigungs-E-Mails**
In der Vorlagenverwaltung für System-Benachrichtigungs-E-Mails wurde die Bezeichnung „Customer Type" durch „Business Partner Type" ersetzt. Die Änderung betrifft die Tabellenspalte, den Suchreiter sowie die Erstellung und Bearbeitung von Vorlagen. Für den Business Partner Type stehen die Werte „Supplier" und „Dealership" zur Verfügung. Die Werte „Private" und „Commercial" des bisherigen Kundentyps werden hierfür weder angeboten noch angezeigt.

**In Vorbereitung: Formatierungsverbesserungen bei E-Mails und Dokumenten**
Derzeit befindet sich in Qualitätsprüfung eine Überarbeitung des Erscheinungsbilds von Dokument- und E-Mail-Vorlagen gemäß dem MB Style Guide. Bei den E-Mail-Vorlagen wird die Schrift des Kundennamens für Aktivierung und Bestätigung vergrößert. Für die Aktivierungs-E-Mail wird der Textkörper neu gegliedert: Der Satz „We are pleased to inform you that your contract is successfully activated." steht künftig in einer eigenen Zeile, die Trennlinie unter den Vertragsdetails entfällt, die Druckvariablen der Vertragsdetails sowie der Firmenname in den Abholdetails werden fett dargestellt, und im Modul der Schlussformel werden Abstände ergänzt.

**In Vorbereitung: Umgang mit großen Dateianhängen**
Ebenfalls in Qualitätsprüfung befindet sich eine Verbesserung für große Anhänge. Bisher wird die E-Mail nicht an den Kunden versendet, wenn ein Anhang für den Mailserver zu groß ist, da eine Ausnahme auftritt. Künftig wird die E-Mail in diesem Fall ohne Anhang versendet. Sie enthält stattdessen einen Link zum Customer Account Center, über den der Kunde auf das Dokument zugreifen kann.