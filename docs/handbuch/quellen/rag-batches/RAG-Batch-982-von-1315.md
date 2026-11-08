# Batch 982 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Eindeutige Verträge pro Fahrgestellnummer (Phase 2)

Bisher erlaubt oneSCM, dass für dieselbe Fahrgestellnummer mehr als ein Vertrag im Status „Aktiv" oder „Ausgesetzt" existieren kann. Mit dieser Erweiterung wird die Regel verschärft: Pro Fahrgestellnummer ist nur noch ein einziger aktiver Vertrag zulässig. Das System erzwingt diese Einschränkung nun selbst.

Die Prüfung berücksichtigt dabei beide Kennungen eines Fahrzeugs, also sowohl die FIN als auch die VIN. Wurde ein Servicevertrag unter Verwendung der FIN angelegt, kann für dasselbe Fahrzeug kein weiterer Vertrag mehr unter Verwendung der VIN erstellt werden. Dies gilt auch in umgekehrter Richtung. Damit wird verhindert, dass für ein und dasselbe Fahrzeug über unterschiedliche Kennungen mehrere Servicevertr­äge angelegt und aktiviert werden.

Wer als Händler, MO oder MPC einen Servicevertrag mit der FIN eines Fahrzeugs erstellt und bestätigt und anschließend für dasselbe Fahrzeug ein Vertragsangebot mit der VIN startet, erhält eine Fehlerseite. Diese weist darauf hin, dass für diese Kennung bereits ein aktiver oder ausgesetzter Vertrag vorhanden ist.

Voraussetzung für die Prüfung ist, dass die Fahrgestellnummer so zur Verfügung steht, dass sowohl FIN als auch VIN erfasst und abgeglichen werden können. Die zugehörigen Einstellungen finden sich in den Markteinstellungen auf der Registerkarte „Utility".