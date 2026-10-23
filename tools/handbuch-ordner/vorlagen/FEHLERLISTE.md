# Fehlerliste – Kategorien und Ablauf

`FEHLERLISTE.csv` (UTF-8 mit BOM, Semikolon) sammelt alle sprachlichen und formalen Fehler aus Entwürfen, Produkten und Übersetzungen. Gepflegt vom Agenten `sprach-lektor`; Prüfer und Übersetzer melden Funde an ihn.

| Spalte | Inhalt |
|---|---|
| Nr | `F-<lfd.>` (vierstellig, z. B. `F-0001`), nie neu vergeben |
| Datum | Funddatum `TT.MM.JJJJ` |
| Fundstelle | Datei relativ zum Arbeitsordner + Abschnitt oder Zeile, z. B. `02_Kapitel/06_…/02_Entwurf/6.2_Entwurf.md, Schritt 4` |
| Fehler | Originaltext (kurz) |
| Korrektur | Vorschlag |
| Kategorie | siehe unten |
| Regel | Kennung aus `GRAMMATIK.md` (`G-…`), Zeile aus `SYNONYME.csv` (Begriff) oder `TONALITAET.md` |
| Status | `offen` · `korrigiert` (Autor hat übernommen) · `abgelehnt` (mit Begründung) · `Regel fehlt` |

## Kategorien

| Kategorie | Beschreibung | Beispiel |
|---|---|---|
| Rechtschreibung | Tipp- und Schreibfehler, Getrennt-/Zusammenschreibung | „Service Vertrag“ |
| Zeichensetzung | Kommas, Anführungszeichen, Striche | "Save" statt „Save“ |
| Grammatik | Kongruenz, Fälle, Satzbau | |
| Terminologie | Begriff laut `SYNONYME.csv`/`BEGRIFFE.md` nicht eingehalten, UI-Begriff abweichend von der Oberfläche | „Marktprüfung“ |
| Zahlen und Einheiten | Format von Zahlen, Datum, Währung, Einheit | „5Tage“ |
| Stil und Tonalität | Passiv, zu lange Sätze, falsche Anrede, Füllwörter | „Du“, Satz mit 40 Wörtern |
| Konsistenz | gleicher Sachverhalt unterschiedlich benannt oder dargestellt | |
| Format | Layout, Schrittnummern, Warnhinweis-Schema, Callouts | |
| Übersetzung | Abweichung zum deutschen Master (Zahlen, Schritte, Begriffe) | |

## Ablauf

1. Der sprach-lektor trägt jeden Fund als neue Zeile ein (Status `offen`) und ändert den Text nicht selbst.
2. Die Autorin bzw. der Autor (Agent oder Mensch) übernimmt oder lehnt ab; der sprach-lektor setzt den Status.
3. Wiederkehrende Fehler ohne passende Regel → Status `Regel fehlt` und Vorschlag unter „Vorschläge“ in `GRAMMATIK.md` bzw. neue Zeile mit Status `Vorschlag` in `SYNONYME.csv`.
4. Keine personenbezogenen Daten in der Spalte Fehler – Fundstelle genügt.

Auswertung: Zahl der Fehler je Kategorie und Kapitel im Lektoratsbericht (`03_Fehlerliste/Lektorat_<JJJJ-MM-TT>.md`).
