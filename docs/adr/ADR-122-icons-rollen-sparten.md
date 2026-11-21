# ADR-122 Lucide-Icons für Rollen, Sparten und Label-Gruppen

**Status:** akzeptiert, umgesetzt in Etappe 70. Entscheidung des Auftraggebers vom 25.10.2026. Ändert E-11 (Emoji gemäß Masterprompt §2) und hebt die Ausnahme „Rollen- und Spartenzeichen aus den Stammdaten“ in ADR-111 auf.

## Kontext
Seit ADR-111 zeigt die Oberfläche einheitliche Lucide-Icons statt Emoji. Bewusst ausgenommen blieben die Zeichen der Stammdaten: Rollen (🏪 🌍 ✅ 🏢 👥), Sparten (🚘 🚐 🚛 🚌 🔄 ❓) und die Label-Gruppen von oneSCM_Metadaten. Diese Emoji erschienen in Badges, Filtern und Auswahllisten, in Exporten („🏪 Dealer · 🚛 Truck“) und im generierten Kapiteltext („- 🏢 HQ (…)“). Je nach System sahen sie unterschiedlich aus.

## Entscheidung
- **Stammdaten tragen den Namen eines Lucide-Icons** statt eines Emoji:

  | Bereich | Zuordnung |
  |---|---|
  | Rollen | Dealer → `store`, Markt → `globe`, MO → `badge-check`, HQ → `building-2`, Alle → `users` |
  | Sparten | PKW → `car`, VAN → `van`, Truck → `truck`, Bus → `bus`, Alle → `layers`, Ungeklärt → `circle-help` |
  | Label-Gruppen | Gliederung `folder-tree`, Rollen `users`, Navigation `compass`, Domäne `puzzle`, Kundengruppe `briefcase`, Systeme `plug`, Inhaltstyp `file-text`, Sparte `car`, Qualität `tag`, Version `bookmark`, Status `circle-dot`, Sprache `languages`, Markt `map`, Detaillevel `search`, Zu prüfen `triangle-alert` |

  Beim Start überschreibt der Abgleich der Stammdaten (`ON CONFLICT … DO UPDATE`) die Zeichen auch in bestehenden Datenbanken.
- **Oberfläche:** Die Komponente `RefIcon` zeichnet das Icon (`aria-hidden`, Farbe wie der Text). Badges behalten Farbe und Textlabel (US-010). Unbekannte Namen zeigen ein neutrales Etikett. In Auswahllisten (`<option>`) steht nur der Name, denn dort sind keine Grafiken möglich.
- **Texte und Exporte nennen nur den Namen:** Die Badge-Zeile im Export lautet z. B. „Dealer · Truck“. Der Kapitelgenerator schreibt „- HQ (zentrale Produkt-, Preis- und Systempflege)“.
- **Bestehende Kapitelversionen** bleiben unverändert, denn freigegebene Versionen sind unveränderlich. Neu generierte Fassungen enthalten keine Emoji mehr.

## Begründung
- Ein Icon-Satz für die ganze App: gleiches Aussehen auf allen Systemen, barrierefrei ausgeblendet, kein Zeichensalat in Word, PDF und Übersetzungen.
- Farbe und Text bleiben, die Bedeutung hängt weiter nicht an der Farbe (E-11, WCAG 1.4.1).

## Folgen
- Tests T-387 und E2E T-388; NFR-157. Die Tests, die die alten Emoji festhielten (Referenzdaten, Markdown-Badges, T-201, T-202), prüfen jetzt Namen bzw. SVG-Icons.
