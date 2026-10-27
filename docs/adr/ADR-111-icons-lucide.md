# ADR-111 Einheitliche SVG-Icons mit Lucide

**Status:** akzeptiert, umgesetzt in Etappe 58 und 59 (Wunsch des Auftraggebers vom 24.10.2026: „verbessere die GUI, nutze professionelle Icons“). Erweitert ADR-035 (Darstellung, Dunkelmodus) und ADR-053 (Navigation nach Arbeitsablauf).

## Kontext
Navigation, Startseite und viele Schaltflächen nutzten Emoji als Icons. Emoji sehen je nach Betriebssystem und Schrift verschieden aus, sind farbig und passen nicht zum Dunkelmodus. Bei 70 Navigationseinträgen wirken sie unruhig. Einige Emoji gehörten außerdem zum zugänglichen Namen der Schaltflächen („✨ KI-Vorschlag“), sodass Screenreader sie mit vorlasen.

## Entscheidung
- **Bibliothek:** [Lucide](https://lucide.dev) (`lucide-react`, ISC-Lizenz). Die Version ist fest eingestellt (1.54.0); die App lädt keine Icons nachträglich.
  - Die Icons sind SVG-Komponenten, werden mit der Oberfläche gebaut (nur die verwendeten, Tree-Shaking) und laden nichts aus dem Netz. Die Daten bleiben lokal, die CSP bleibt unverändert.
  - Linien-Icons, Strichstärke 1,75, Farbe `currentColor`. Sie folgen damit Hell- und Dunkelmodus sowie dem aktiven Navigationspunkt.
- **Umfang Etappe 58:**
  - Navigation: alle Einträge, Gruppen „Weitere“ und „Stammdaten“, Einstellungen, Ein-/Ausklappen, Menü auf kleinen Bildschirmen.
  - Logo im Kopf; Aufgaben-Kacheln der Startseite in einer farbigen Icon-Fläche.
  - Hauptschaltflächen der Kapitelwerkstatt (Anleitungs-Check, Stil anzeigen/korrigieren, Kapitel umformulieren, KI-Vorschlag, Bild erzeugen, Als Vorlage).
  - Hauptschaltflächen der Leseransicht (hilfreich ja/nein, Kapitel bzw. Handbuch drucken, Lesezeichen als CSV).
  - Gemeinsame Bausteine: Dialog schließen, Bild einfügen.
- **Barrierefreiheit:**
  - Icons sind `aria-hidden`; der zugängliche Name ist der sichtbare Text („KI-Vorschlag“ statt „✨ KI-Vorschlag“).
  - In der eingeklappten Navigation bleibt der Name als zugänglicher Name und Tooltip erhalten.
  - Kontraste und Fokus wie bisher; geprüft mit axe in hell und dunkel.
- Bewegungen (Anheben der Kacheln) entfallen bei „Bewegung reduzieren“.

## Begründung
- Lucide ist verbreitet, wird gepflegt, deckt die benötigten Begriffe ab (über 1 500 Icons) und braucht keine Laufzeit außer React.
- Eine Bibliothek statt eigener SVGs hält die Icons einheitlich und spart Pflege.

## Folgen
- Neue Abhängigkeit `lucide-react` 1.54.0 (nur die Oberfläche).
- Tests, die Schaltflächen über ihren Namen ansprechen, nutzen den Text ohne Emoji.
- **Etappe 59:** auch die übrigen Seiten (Quellformate, Blocker und Warnungen, Hinweisarten, Screenshot-Editor, Sperren, Kommentar, Bearbeiten, Export/Import, Schließen) und die Leseransicht in allen neun Sprachen. Die Texte der Leseransicht enthalten keine Zeichen mehr; die Icons setzt die Oberfläche.
- Bewusst unverändert:
  - einfarbige Textzeichen wie ✓, ✎, ✖ und die Pfeile (sehen überall gleich aus);
  - Rollen- und Spartenzeichen, die aus den Stammdaten kommen (Daten, keine Oberfläche). **Aufgehoben in Etappe 70 (ADR-122):** auch sie sind jetzt Lucide-Icons.
