# 09 Benutzerdokumentation

Stand: Version 0.44 (24.10.2026). oneSCM Handbook Studio erstellt aus vielen Quellen ein geprüftes, freigegebenes Benutzerhandbuch für oneSCM – und beantwortet Fragen über alle Quellen mit Belegen (Bereich **oneSCM_Metadaten**). Installation und Betrieb: [08 Installation und Betrieb](08-installation-betrieb.md).

## 1. Grundlagen

- **Anmelden:** Im Einzelplatz-Betrieb wählen Sie oben links einen Demo-Benutzer; im Team-Betrieb melden Sie sich mit dem Firmenkonto an.
- **Rechte:** *Lesen* (ansehen, Fragen stellen, Befragungen beantworten), *Bearbeiten* (einlesen, schreiben, Labels, Testfragen), *Entscheiden* (Widersprüche), *Freigeben* (Kapitel freigeben), *Administration* (Einstellungen, Benutzer, Projekte).
- **Projekte:** Oben links wählen Sie das Projekt (z. B. ein Handbuch je Land oder Produkt). Alle Daten gehören zu einem Projekt.
- **Suche:** `/` öffnet die Suche über Kapitel, Quellen, Begriffe und Bilder.
- **Menü nach Arbeitsablauf:** oneSCM_Metadaten · 1 Sammeln · 2 Schreiben · 3 Prüfen · 4 Veröffentlichen · Verwaltung.

## 2. oneSCM_Metadaten – Wissen einlesen, ordnen, befragen

| Menüpunkt | Wofür | So geht’s |
|---|---|---|
| **Übersicht** | Stand des Bestands je Format, Labels, gespeicherte Fragen | – |
| **Einlesen** | Dateien aufnehmen: Markdown, HTML/Confluence, Word, PowerPoint, PDF (gescannte Seiten per Texterkennung), Untertitel (VTT/SRT), Video (MP4), Jira-Exporte, ZIP | Dateien hineinziehen; je Datei erscheinen Ergebnis und Hinweise. Video: Untertitel mit gleichem Namen im ZIP mitliefern oder Transkription einrichten |
| **Quellen je Überschrift** | Gliederung jeder Datei mit ihren Chunks; zusammengeführte Überschriften über alle Dateien | Überschrift wählen → Chunks dieser Überschrift |
| **Chunks** | Textabschnitte mit Fundstelle (Zeile, Folie, Seite, Zeitmarke) und Labels | filtern nach Format, Datei, Überschrift, Label; Labels setzen |
| **Dubletten (alle Formate)** | gleiche und ähnliche Abschnitte über Dateien und Formate, Unterschiede markiert | je Paar „A führend“, „B führend“ oder „kein Duplikat“ |
| **Kapitel ↔ Quellen** | welche Quellen zu welchem Gliederungspunkt gehören, mit Vorschlägen | Vorschlag prüfen und übernehmen |
| **Wissensnotizen** | eigene Erkenntnisse (Frage, Antwort, Screenshot) als Quelle | Notiz anlegen – sie wird wie eine Quelle durchsucht |
| **Fragen & Antworten** | **Frage an alle Quellen**: Antwort nur aus den sechs besten Belegen, jeder Satz mit Beleg [n] | Frage eingeben, optional eingrenzen (Format, Datei, Überschrift, Label) → „Fragen“; „Als Frage & Antwort übernehmen“ speichert mit Belegen; „Erneut fragen“ vergleicht mit dem neuen Stand; Export CSV/Excel/JSON |
| **Rückfragen** | Fragenkatalog (z. B. Review-Cockpit, CSV, Text) einlesen und alle Fragen mit Belegen beantworten | Datei einlesen → „Alle mit Belegen beantworten“ → einzeln übernehmen, exportieren |
| **Antwortqualität** | Testfragen mit erwarteten Quellen und Stichworten; Lückenfragen (richtig ist „keine Aussage“) | Satz aus CSV/Excel/JSON oder aus Fragen & Antworten anlegen → „Prüflauf starten“ → Kennzahlen (bestanden, Treffer@1/@6, MRR, Beleg richtig, Lücken richtig), Vergleich mit dem vorigen Lauf |
| **Expertenbefragung** | Wissenslücken an Fachleute geben | Befragung aus Rückfragen oder Prüflauf anlegen → Fachleute antworten in der App (Recht „Lesen“) oder per Excel → „Als Frage & Antwort übernehmen“ (Label „Prüfen“) |
| **Zugriffsmatrix** | Zugriffsstufe je Rolle und Menüpunkt in oneSCM (V/L/–) | Stufe setzen, CSV ein- und ausgeben |
| **Zuordnung** | Domäne → Gliederungspunkt → Ordner | Zuordnung pflegen |
| **Labels** | Labelkatalog (Gliederung, Rolle, Sparte, Markt, Navigation, Qualität …) | Labels anlegen, umbenennen, ausblenden |

**Belege lesen:** Jeder Beleg nennt Datei, Überschriftenpfad und Fundstelle („Seite 3“, „Folie 2“, „bei 01:31“, „Zeile 10“). Ohne passende Stelle antwortet die App „Die Quellen enthalten dazu keine Aussage“ – eine Lücke, die Sie in die Expertenbefragung geben können.

## 3. Sammeln

- **Quellen:** alle eingelesenen Dateien mit Revisionen; Original herunterladen; Verbindungen zu Git und Confluence.
- **Quellenänderungen:** Update-Eingang – geänderte Quellen absatzweise übernehmen.
- **Textcluster, Widersprüche, Dopplungen:** Ergebnis der Qualitätsanalyse. Widersprüche entscheidet, wer das Recht „Entscheiden“ hat; Dopplungen bekommen ein Zielkapitel.

## 4. Schreiben

- **Kapitelsteuerung:** je Kapitel und Unterkapitel eine kurze **Kapitelanweisung** – „Worauf es ankommt“, „Wichtige Themen“ (je Zeile eines, müssen vorkommen) und „Nicht beschreiben“. Sie gilt mit Vorrang: Der Kapitelgenerator lässt Quellen zu „Nicht beschreiben“ weg und meldet wichtige Themen ohne Quelle als Lücke, KI-Vorschläge und Anleitungs-Check beachten sie, die Werkstatt zeigt sie oben. Quellenbindung und Datenschutz gehen ihr vor.
  - **Handbuch-Varianten:** Über „Gliederung“ wählen Sie die Kapitel einer Variante und geben ihnen eine eigene Anweisung; sie gilt zusätzlich zur Anweisung der Quellkapitel.
  - **Fehlendes Kapitel oder Unterkapitel ergänzen:** Titel eingeben (mit Nummer wird es danach eingeordnet), optional „gültig ab“. Später eingelesene Quellen mit derselben Überschrift gehören dazu.
  - **Gültig ab:** Version bzw. Release je Kapitel, Unterkapitel und Label (Label unter „Labels: Version und Ablösen“, Administration). Steht im Export unter der Kapitelüberschrift.
  - **Veraltete Funktion ablösen:** Nachfolger neu anlegen oder vorhandenen wählen, „Nachfolger gültig ab“ und Hinweis eintragen → „Ablösen und in die Historie legen“. Das Alte erscheint nicht mehr im Handbuch, sondern im Anhang „Historie: abgelöste Funktionen“ (gültig von–bis, ersetzt durch). Bei Labels können Chunks, Fragen & Antworten und Bilder übertragen werden. „Zurückholen“ macht es rückgängig.
- **Kapitel-Assistent:** neues Kapitel aus Zweck, Voraussetzungen, Schritten und Ergebnis – mit Kapitelvorlagen.
- **Kapitelgenerator:** Kapitel aus den bestätigten Quellen erzeugen; Lücken werden markiert.
- **Kapitelwerkstatt:** Absätze bearbeiten, verschieben, KI-Vorschläge (mit Beleg je Satz) annehmen, Anleitungs-Check und Schreibstil direkt im Kapitel.
- **Draft Manual:** Gesamtentwurf mit farbiger Kennzeichnung von Dopplungen, Lücken, Widersprüchen und Warnungen; Handbuch-Varianten je Rolle, Sparte, Markt.
- **Bilder:** aus Textstellen ASCII-Bilder, Klickstrecken, Prozessbilder und Infografiken; Screenshots markieren (Pfeile, Rahmen, Unschärfe, Zuschnitt).
- **Bildarchiv:** jedes Bild mit fester Bildnummer (B-0001 …), Merkmalen (Sprache, Rollen, Sparten, Märkte, Release, Reiter) und Prüfregeln – auch für die Bildunterschrift (höchstens 200 Zeichen und zwei Sätze, ohne „Hier sieht man …“).
  - **Neue Fassung** (Datei oder Strg+V) ersetzt das Bild überall; **Platzhalter** reservieren eine Nummer.
  - **Varianten einer Maske** verknüpfen: Export, Releases und Übersetzungen zeigen automatisch die Fassung in passender Sprache, Rolle, Sparte und Markt.
  - **Klickstrecke aus Screenshots:** Stationen aus Archivbildern, parallele Wege 3a/3b; das Ergebnis liegt als Bild im Archiv.
  - **Datenschutz im Bild:** Namen, User-IDs, Adressen, FIN und weitere personenbezogene Daten werden nach dem Einlesen automatisch erkannt (lokale Texterkennung) und verpixelt – im Archiv, im Export und in Übersetzungen. Mit dem Schalter „Personenbezogene Daten unkenntlich machen“ machen Sie es rückgängig oder wieder an; einzelne Stellen schalten Sie in der Liste aus. Eigene Stellen ziehen Sie mit der Maus im Bild auf (oder geben sie in Prozent an) und bestätigen mit „Stelle unkenntlich machen“. Das Original bleibt unverändert; „Original ansehen“ und der Download „Original (ohne Unkenntlichmachung)“ gibt es nur mit dem Recht *Bearbeiten*.
  - **Labels und Kapitel:** je Bild mehrere Labels (Domäne, Rolle, Gliederung, weitere) und Kapitel über „+ hinzufügen“, entfernen mit ×. Die Sprache pflegen Sie unter „Merkmale“.
  - **Bildabdeckung je Kapitel** und **Deckungsmatrix** (je Reiter, Maske, Kapitel oder Gliederungspunkt × Sprache/Rolle/Sparte) zeigen fehlende Bilder.

## 5. Prüfen

- **Anleitungs-Check:** Ist das Kapitel leicht zu befolgen? Zwölf Prüfpunkte als **Muss** (10 Punkte) oder **Soll** (5 Punkte) mit Korrektur per Klick. Die Administration legt fest, ob ein Mindestwert und/oder „alle Muss-Punkte erfüllt“ Bedingung für Einreichen und Freigabe sind.
- **Rückmeldungen:** Rückmeldungen der Leserinnen und Leser aus Leseransicht und Online-Hilfe auswerten.
- **Schreibstil, Terminologie:** Stilregeln mit gelber Markierung und Umformulierung; Fachbegriffe und Synonyme mit fester Übersetzung.
  - **Hausregeln:** „…“ statt "…", Gedankenstrich, Menüpfad mit ›, Zahlen bis zwölf ausschreiben, Tausenderpunkt, Leerzeichen vor Einheit und %, Datum TT.MM.JJJJ, „oneSCM“ – „Automatisch korrigieren“ übernimmt alle eindeutigen Korrekturen.
  - **Sprache des Textes** im Textfeld wählen: Englisch prüft zusätzlich a/an, „I“ und Rechtschreibung. Übersetzungen zeigen je Absatz die Sprachprüfung.
  - **Regeln** (Administration): Zielgruppe für die Lesbarkeit, erlaubte Begriffe (werden nie gemeldet, Liste einlesbar), eigene Formulierungen je Sprache (z. B. Dealer → Händler auf Deutsch, Händler → Dealer auf Englisch).
  - **Lesbarkeit** je Kapitel im Anleitungs-Check und im Schreibstil: Flesch, LIX, Ø Wörter je Satz, lange Sätze, Passiv mit Sollwerten der Zielgruppe.
  - **Terminologie:** „nicht übersetzen“ – der Begriff steht in jeder Sprache unverändert (z. B. Begriffe der Oberfläche).
- **Evidenz:** Herkunft jedes Absatzes.
- **Freigabe:** einreichen, mehrstufig freigeben; das Qualitätsgate zeigt, was noch fehlt.

## 6. Veröffentlichen

- **Leseransicht:** Handbuch lesen, suchen, Lesezeichen, „Weiter mit …“, Drucken mit Deckblatt im Firmen-Layout.
- **Export:** Markdown, HTML, PDF, Word – gefiltert nach Rolle, Sparte, Markt; Quick Guide, One Pager, Lesefassung.
- **Veröffentlichung:** Handbuch-Release mit Online-Hilfe und Übersetzungen.
- **Übersetzungen:** Kapitel in die Landessprachen; Platzhalter- und Strukturvergleich.
- **Release-Abgleich, Releaseletter:** Jira-Tickets gegen den Bestand prüfen; Releaseletter mit Prüfregeln.
- **Kontexthilfe:** Hilfe-Widget für oneSCM (F1 je Maske).

## 7. Typische Arbeitsabläufe

1. **Wissen aufbauen:** Einlesen → Chunks mit Labels → Fragen & Antworten → Antwortqualität prüfen → Lücken in die Expertenbefragung → Antworten als Frage & Antwort (Label „Prüfen“) → später durch Quellen belegen.
2. **Kapitel erstellen:** Kapitelanweisung festlegen (Kapitelsteuerung) → Quellen einlesen → Qualitätsanalyse (Widersprüche, Dopplungen) → Kapitelgenerator oder Kapitel-Assistent → Kapitelwerkstatt → Anleitungs-Check → Freigabe → Export/Veröffentlichung.
3. **Screenshots pflegen:** Bild ins Archiv (oder Platzhalter) → Datenschutz im Bild prüfen (erkannte Stellen, ggf. eigene Stellen) → Merkmale, Labels und Kapitel → Varianten verknüpfen → Klickstrecke → Deckungsmatrix auf Lücken prüfen → neue Fassung bei neuem Release.

## 8. Datenschutz

Personenbezogene Daten (Namen, E-Mail, FIN, Kennzeichen …) erkennt die Datenschutzprüfung – in Texten und, mit eingerichteter Texterkennung, auch in Bildern; dort werden sie verpixelt, das Original bleibt erhalten. Die Daten gehen nie an externe Dienste. Gesichter und Unterschriften erkennt die App nicht – markieren Sie sie als eigene Stelle. Fragen mit personenbezogenen Daten werden bei externem KI-Dienst nicht gestellt. Befragungen erfassen Fachbereich oder Rolle, keine Personennamen.
