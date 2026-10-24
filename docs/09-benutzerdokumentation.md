# 09 Benutzerdokumentation

Stand: Version 0.66 (24.10.2026). oneSCM Handbook Studio erstellt aus vielen Quellen ein geprüftes, freigegebenes Benutzerhandbuch für oneSCM – und beantwortet Fragen über alle Quellen mit Belegen (Bereich **oneSCM_Metadaten**). Installation und Betrieb: [08 Installation und Betrieb](08-installation-betrieb.md).

## 1. Grundlagen

- **Anmelden:** Im Einzelplatz-Betrieb wählen Sie oben links einen Demo-Benutzer; im Team-Betrieb melden Sie sich mit dem Firmenkonto an.
- **Rechte:** *Lesen* (ansehen, Fragen stellen, Befragungen beantworten), *Bearbeiten* (einlesen, schreiben, Labels, Testfragen), *Entscheiden* (Widersprüche, Entscheidungen der Agenten), *Freigeben* (Kapitel freigeben), *Administration* (Einstellungen, Benutzer, Projekte).
- **Projekte:** Oben links wählen Sie das Projekt (z. B. ein Handbuch je Land oder Produkt). Alle Daten gehören zu einem Projekt.
- **Suche:** `/` öffnet die Suche über Kapitel, Quellen, Begriffe und Bilder.
- **Menü nach Arbeitsablauf:** oneSCM_Metadaten · 1 Sammeln · 2 Schreiben · 3 Prüfen · 4 Veröffentlichen · Verwaltung.
- **Navigation:** Jeder Eintrag hat ein Icon. Mit der Schaltfläche oben rechts neben dem Namen klappen Sie die Navigation auf die Icons ein; der Name erscheint dann beim Überfahren. Unter „Darstellung“ (unten links) wählen Sie hell, dunkel oder wie im System.

## 2. oneSCM_Metadaten – Wissen einlesen, ordnen, befragen

| Menüpunkt | Wofür | So geht’s |
|---|---|---|
| **Übersicht** | Stand des Bestands je Format, Labels, gespeicherte Fragen | – |
| **Einlesen** | Dateien aufnehmen: Markdown, HTML/Confluence, Word, PowerPoint, PDF (gescannte Seiten per Texterkennung), Untertitel (VTT/SRT), Video (MP4), Jira-Exporte, ZIP | Dateien hineinziehen; je Datei erscheinen Ergebnis und Hinweise. Video: Untertitel mit gleichem Namen im ZIP mitliefern oder Transkription einrichten |
| **Triage** | Agent TRIAGE: nach jedem Einlesen Pflichtlabels je Chunk (Version, Status, Domäne, Rolle, Sprache, Sparte, Markt, Detaillevel, zu prüfen) und Vorschläge für Kapitel und Unterkapitel – auch neue Unterkapitel mit Kennung „neu“ | Vorschläge prüfen → „Übernehmen“ oder „Verwerfen“ bzw. „Alle Vorschläge übernehmen“; neue Unterkapitel „Bestätigen“; Filter „zu prüfen“; Labels, die Sie selbst setzen, überschreibt TRIAGE nicht |
| **Inhalts-Dashboard** | Chunks, Wörter und Labels je Kapitel und Domäne, Anteil je Pflichtgruppe, Detaillevel | – |
| **Quellen je Überschrift** | Gliederung jeder Datei mit ihren Chunks; zusammengeführte Überschriften über alle Dateien | Überschrift wählen → Chunks dieser Überschrift |
| **Chunks** | Textabschnitte mit Fundstelle (Zeile, Folie, Seite, Zeitmarke) und Labels | filtern nach Format, Datei, Überschrift, Label; Labels setzen |
| **Dubletten (alle Formate)** | gleiche und ähnliche Abschnitte über Dateien und Formate, Unterschiede markiert | je Paar „A führend“, „B führend“ oder „kein Duplikat“ |
| **Kapitel ↔ Quellen** | welche Quellen zu welchem Gliederungspunkt gehören, mit Vorschlägen | Vorschlag prüfen und übernehmen |
| **Wissensnotizen** | eigene Erkenntnisse (Frage, Antwort, Screenshot) als Quelle | Notiz anlegen – sie wird wie eine Quelle durchsucht |
| **Fragen & Antworten** | **Frage an alle Quellen**: Antwort nur aus den sechs besten Belegen, jeder Satz mit Beleg [n]. Synonyme, Übersetzungen und Abkürzungen aus Terminologie und Stammdaten erweitern die Frage („Abfrage erweitert um …“); fehlt ein Fachbegriff in den Quellen, gibt es keine Antwort und die App nennt ihn („in den Quellen nicht gefunden: …“) | Frage eingeben, optional eingrenzen (Format, Datei, Überschrift, Label) → „Fragen“; „Als Frage & Antwort übernehmen“ speichert mit Belegen; „Erneut fragen“ vergleicht mit dem neuen Stand; Export CSV/Excel/JSON |
| **Rückfragen** | Fragenkatalog (z. B. Review-Cockpit, CSV, Text) einlesen und alle Fragen mit Belegen beantworten | Datei einlesen → „Alle mit Belegen beantworten“ → einzeln übernehmen, exportieren |
| **Antwortqualität** | Testfragen mit erwarteten Quellen und Stichworten; Lückenfragen (richtig ist „keine Aussage“) | Satz aus CSV/Excel/JSON oder aus Fragen & Antworten anlegen → Verfahren wählen (v2 Standard, v1 zum Vergleich) → „Prüflauf starten“ → Kennzahlen (bestanden, Treffer@1/@6, MRR, nDCG@6, Beleg richtig, Lücken richtig), Vergleich mit dem vorigen Lauf |
| **Expertenbefragung** | Wissenslücken an Fachleute geben | Befragung aus Rückfragen oder Prüflauf anlegen → Fachleute antworten in der App (Recht „Lesen“) oder per Excel → „Als Frage & Antwort übernehmen“ (Label „Prüfen“) |
| **Zugriffsmatrix** | Zugriffsstufe je Rolle und Menüpunkt in oneSCM (V/L/–) | Stufe setzen, CSV ein- und ausgeben |
| **Zuordnung** | Domäne → Gliederungspunkt → Ordner | Zuordnung pflegen |
| **Labels** | Labelkatalog (Gliederung, Rolle, Sparte, Markt, Navigation, Qualität …) | Labels anlegen, umbenennen, ausblenden, löschen (admin) |

**Belege lesen:** Jeder Beleg nennt Datei, Überschriftenpfad und Fundstelle („Seite 3“, „Folie 2“, „bei 01:31“, „Zeile 10“). Ohne passende Stelle antwortet die App „Die Quellen enthalten dazu keine Aussage“ – eine Lücke, die Sie in die Expertenbefragung geben können.

## 3. Sammeln

- **Quellen:** alle eingelesenen Dateien mit Revisionen; Original herunterladen; Verbindungen zu Git und Confluence.
- **Quellenänderungen:** Update-Eingang – geänderte Quellen absatzweise übernehmen.
- **Textcluster, Widersprüche, Dopplungen:** Ergebnis der Qualitätsanalyse. Widersprüche entscheidet, wer das Recht „Entscheiden“ hat; Dopplungen bekommen ein Zielkapitel.

## 4. Pipeline, Backlog, Intern

Kommende Funktionen und interne Themen – getrennt vom Handbuch.

- **Pipeline:** Jira-Tickets in Bearbeitung, noch nicht produktiv, je Kapitel und Unterkapitel der aktuellen Gliederung. Spalten: Ticket, Titel, Erstelldatum, Stream, Produktionsdatum, Status (Jira), Dokumentation.
  - **Aus Jira-Tickets abgleichen:** liest die unter „Quellen“ eingelesenen Jira-Exporte aus.

    | Ticket | Ergebnis |
    |---|---|
    | offen/Backlog | Backlog |
    | in Bearbeitung, Test, blockiert | Pipeline |
    | erledigt, Produktionsdatum in der Zukunft | bleibt in der Pipeline |
    | erledigt, Produktionsdatum erreicht | „produktiv – ins Handbuch übernehmen“ |
    | abgebrochen | abgebrochen |
    | Bug | kein Eintrag |

    Die Gliederung kommt aus dem Kapitel, das das Ticket schon nutzt, sonst als **Vorschlag** aus dem Titel – bitte prüfen.
  - **Bearbeiten:** Gliederung, Stream, Produktionsdatum und die **Dokumentation** (Markdown) vorab schreiben. Ein von Hand geändertes Produktionsdatum überschreibt der nächste Abgleich nicht.
  - **Ins Handbuch übernehmen:** erst, wenn das Ticket produktiv ist. Die Dokumentation wird als Quelle des Kapitels eingelesen (Evidenz unbestätigt); bestätigen, generieren und freigeben wie gewohnt.
  - Stream und Produktionsdatum liest der Jira-Import aus den Feldern „Stream“ und „Production Date“/„Produktionsdatum“/„Go-Live Date“. Fehlen sie im Export, tragen Sie sie von Hand ein.
- **Backlog:** Tickets, deren Bearbeitung noch nicht begonnen hat. Sie wechseln beim nächsten Abgleich in die Pipeline.
- **Intern:** Reiter Testing, Reporting, Systeme, Migration, Rollout, Other. Einträge erscheinen nie im Handbuch, Export, Release oder in Übersetzungen.
- Personenbezogene Daten werden wie bei Wissensnotizen abgewiesen oder auf Wunsch pseudonymisiert. Eigene Einträge lassen sich löschen; Jira-Einträge setzen Sie auf „abgebrochen“.
- **Arbeitsordner:** `abgleich --app …` schreibt die Einträge nach `09_Pipeline/<Kapitel>/<Unterkapitel>/<Ticket>.md`, `10_Backlog/` und `11_Intern/<Thema>/`.

## 5. Agenten

| Menüpunkt | Wofür | So geht’s |
|---|---|---|
| **Aufgaben & Entscheidungen** | Der ORCHESTRATOR steuert alle Agenten: offene Aufgaben je Agent, Entscheidungen, die ein Mensch trifft | „Plan erstellen / verfeinern“ → Plan mit Schritten; Entscheidungen mit dem Recht „Entscheiden“ beantworten – der Orchestrator führt sie beim nächsten Plan aus; eigene Aufgaben anlegen |
| **GOAL – Ziel-Abgleich** | Stand aller Funktionen gegen das Ziel, mit Empfehlungen | Ziel und Sollwerte einstellen → „Abgleich ausführen“; nicht erfüllte Kriterien werden Aufgaben |

**Detaillierung je Kapitel:** In der Kapitelsteuerung wählen Sie je Kapitel die Detaillevel, die der Kapitelgenerator übernimmt. HappyPath erscheint im Standardablauf, Edge unter „Fehlerbehebung“; Intern und inPrüfung sind im Standard ausgeschlossen.

## 6. Schreiben

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

## 7. Prüfen

- **Anleitungs-Check:** Ist das Kapitel leicht zu befolgen? Zwölf Prüfpunkte als **Muss** (10 Punkte) oder **Soll** (5 Punkte) mit Korrektur per Klick. Die Administration legt fest, ob ein Mindestwert und/oder „alle Muss-Punkte erfüllt“ Bedingung für Einreichen und Freigabe sind.
- **Rückmeldungen:** Rückmeldungen der Leserinnen und Leser aus Leseransicht und Online-Hilfe auswerten.
- **Kapitelbewertung:** je Kapitel fünf Kriterien mit Ampel (grün ab 80, gelb ab 60) – Sprache, Ziel (Anleitungs-Check), Tonalität, Quellenabgleich, Fakten – und eine Gesamtampel. Im Detail steht jede Aussage mit Einstufung: belegt, unbelegt, Widerspruch oder fehlend. „Funde in die Fehlerliste“ übernimmt die Warnungen der Stilprüfung.
- **Fehlerliste:** Nr, Fundstelle, Fehler, Korrektur, Kategorie, Regel und Status (offen, korrigiert, abgelehnt mit Begründung, Regel fehlt). Steht ein Fund nicht mehr im Kapitel, wird er beim nächsten Übernehmen „korrigiert“. „FEHLERLISTE.csv“ lädt die Liste herunter; „FEHLERLISTE.csv einlesen“ übernimmt Änderungen aus dem Arbeitsordner nach einer Vorschau.
- **Überarbeitung:** Änderungen aus Word und dem KI-Lektorat als Vorschläge prüfen. Unter „Export“ erzeugt Word mit „Prüffassung für Word“ eine Lesefassung mit „Fertig, wenn …“ je Kapitel; die in Word bearbeitete Datei laden Sie hier hoch. „KI-Lektorat starten“ schlägt je Absatz eine bessere Fassung vor. Je Vorschlag stehen drei Spalten nebeneinander: Stand, Vorschlag (entfernte Wörter durchgestrichen, neue unterstrichen) und Neu (änderbar). „Übernehmen“ schreibt in einen Entwurf des Kapitels – die freigegebene Version bleibt bis zur nächsten Freigabe gültig. Wurde der Absatz inzwischen geändert, wird der Vorschlag „veraltet“. Der interne Kommentar steht in keinem Export.
- **Prüferprofile:** ein Kapitel mit vier Blicken prüfen – fachlich (Widersprüche, unbelegte Aussagen, Zahlen ohne Quelle), Redaktion (Stil, Anleitungs-Check), Compliance (personenbezogene Daten, Zusagen wie „garantiert“, folgenreiche Aktion ohne Warnhinweis) und Endanwender (Lesbarkeit, lange Sätze, Fachjargon, Abkürzungen). Je Profil stehen Wert und Ampel (grün ab 80, gelb ab 60) und die Funde mit Absatz, Zitat und Vorschlag. Mit „Zusätzlich KI-Dienst je Profil“ ergänzt ein lokaler KI-Dienst Funde. Frühere Prüfungen stehen im Verlauf.
- **Schreibstil, Terminologie:** Stilregeln mit gelber Markierung und Umformulierung; ist LanguageTool eingerichtet (Hinweis oben auf der Seite), kommen Funde zu Grammatik, Kommasetzung und Groß-/Kleinschreibung mit der Kennung „LanguageTool:“ und Korrektur per Klick hinzu. Unter „Schreibstil › Regeln › Regelsätze“ schaltet die Administration zusätzliche Regelsätze zu: „Regelbasiertes Schreiben“ für deutsche Anleitungen (eine Handlung je Schritt, Bedingung vor Handlung, direkt auffordern), „Simplified Technical English“ für englische Texte und eigene Vale-Stile (Regeldateien `.yml` oder ein ZIP mit dem Stilordner; nicht unterstützte Regeln werden genannt). Ihre Funde stehen als „Regelsatz“ mit dem Namen des Satzes; einzelne Regeln lassen sich abschalten. Fachbegriffe und Synonyme mit fester Übersetzung.
  - **Hausregeln:** „…“ statt "…", Gedankenstrich, Menüpfad mit ›, Zahlen bis zwölf ausschreiben, Tausenderpunkt, Leerzeichen vor Einheit und %, Datum TT.MM.JJJJ, „oneSCM“ – „Automatisch korrigieren“ übernimmt alle eindeutigen Korrekturen.
  - **Sprache des Textes** im Textfeld wählen: Englisch prüft zusätzlich a/an, „I“ und Rechtschreibung. Übersetzungen zeigen je Absatz die Sprachprüfung.
  - **Regeln** (Administration): Zielgruppe für die Lesbarkeit, erlaubte Begriffe (werden nie gemeldet, Liste einlesbar), eigene Formulierungen je Sprache (z. B. Dealer → Händler auf Deutsch, Händler → Dealer auf Englisch).
  - **Lesbarkeit** je Kapitel im Anleitungs-Check und im Schreibstil: Flesch, LIX, Ø Wörter je Satz, lange Sätze, Passiv mit Sollwerten der Zielgruppe.
  - **Tonalität:** Unter Schreibstil › Regeln › Tonalität legen Sie den Ton je Produktart (Vorgabe aus TONALITAET.md: Handbuch sachlich, Releaseletter und Quick Guide knapp, Schulung freundlich, Interne Dokumente formell) und je Rolle fest. Beim Prüfen wählen Sie Produktart und Rolle; die Regel „Tonalität“ meldet z. B. Werbesprache, Verkürzungen oder strenge Formulierungen, und die KI-Vorschläge treffen den gewählten Ton. Im Kapitel gilt das Rollenprofil für Absätze genau einer Rolle.
  - **Terminologie:** „nicht übersetzen“ – der Begriff steht in jeder Sprache unverändert (z. B. Begriffe der Oberfläche).
  - **Terminologie:** „UI-Begriff erlaubt“ – die zu vermeidende Variante ist in Menüpfaden (**Vertragserstellung › MO Checks**) und in Anführungszeichen („MO Checks“) erlaubt; im Fließtext meldet die Stilprüfung sie und schlägt den bevorzugten Begriff vor (z. B. „MO-Prüfungen“). `SYNONYME.csv` aus dem Arbeitsordner lässt sich unter „Stammdaten › Glossar“ importieren; Zeilen mit Status „offen“ oder „Vorschlag“ werden übersprungen.
- **Evidenz:** Herkunft jedes Absatzes.
- **Freigabe:** einreichen, mehrstufig freigeben; das Qualitätsgate zeigt, was noch fehlt.

## 8. Veröffentlichen

- **Leseransicht:** Handbuch lesen, suchen, Lesezeichen, „Weiter mit …“, Drucken mit Deckblatt im Firmen-Layout. Unter **Einstellungen → Layout** wählt die Administration den Stil für Leseransicht, Druck und Online-Hilfe. „Handbuch-Kapitel“ übernimmt Farben, Schriften, Balken und Hinweisboxen der Designvorlage samt Anpassung; im dunklen Modus bleiben die Textfarben der App.
- **Export:** Markdown, HTML, PDF, Word, PowerPoint – gefiltert nach Rolle, Sparte, Markt; Quick Guide, One Pager, Kurzfassung (Management, je Kapitel ein Absatz), Lesefassung. Mit **Stand (Release)** blendet der Export Kapitel aus, deren „gültig ab“ später liegt (Zukunfts-Inhalte); das Ergebnis nennt sie.
  - **Designvorlagen** (Format HTML, Auswahl „Design“):
    - **Quick Reference Guide:** A4 quer, kompakt, Profil Quick Guide.
    - **Handbuch-Kapitel (Fachdokumentation):** A4 hoch, ausführlich.
  - Die Karte „Designvorlagen“ unten auf der Seite zeigt mit „Muster ansehen“ jede Vorlage mit fiktiven Inhalten. „Für den Export wählen“ stellt Format, Design und Profil ein.
  - **Barrierefreiheit:** Nach jedem PDF-Export zeigt „Barrierefreiheit (PDF)“ neun Prüfungen: getaggt, Strukturbaum, Sprache, Titel, Fenstertitel, Lesezeichen, Überschriften, Alternativtexte, Tabellenköpfe. PDF im Design besteht sie; das Standard-PDF ist nicht getaggt. Eine vollständige PDF/UA-Prüfung erledigt ein Prüfwerkzeug wie PAC oder veraPDF.
  - **PDF im Design:** Ist auf dem Server ein Browser eingerichtet (Hinweis „PDF im Design ist eingerichtet“), wählen Sie Format PDF und das Design. Das PDF entsteht direkt, „Muster als PDF“ lädt das Muster herunter.
  - **Word im Design:** Format Word (.docx) und das Design wählen; „Muster als Word“ lädt das Muster. Das Dokument hat Formatvorlagen (Überschrift 1/2) und lässt sich in Word weiterbearbeiten. Die Prüffassung gibt es nur im Standard-Design.
  - **PowerPoint im Design:** Format PowerPoint (.pptx) und das Design wählen; „Muster als PowerPoint“ lädt das Muster. Der Foliensatz hat eine Titelfolie mit Überblick (Quick Reference Guide) bzw. Kennzahlen (Handbuch-Kapitel) und je Abschnitt eigene Folien; lange Inhalte laufen auf „(Fortsetzung)“ weiter.
  - Sonst öffnen Sie die HTML-Datei im Browser und speichern sie über „Drucken → Als PDF speichern“. Kopf- und Fußzeilen mit Seitenzahl und Stand erscheinen dabei auf jeder Seite.
  - Marke, Logo und Fußzeile kommen aus **Einstellungen → Layout**. Dort gibt es auch „Zusatz unter der Marke“, „Dokumentart in der Kopfzeile“ und „Wichtige Links und Ansprechpartner“ (Markdown).
  - **Designvorlagen anpassen** (Einstellungen, Administration):
    - Je Vorlage Hauptfarbe, Akzentfarbe und Warnfarbe festlegen.
    - Die Kontrastanzeige verlangt für Textfarben mindestens 4,5 : 1 und für Rahmen und Icons 3 : 1; sonst ist „Anpassung speichern“ gesperrt.
    - Dazu die Schrift der Überschriften und des Textes (mit Serifen oder serifenlos) sowie das Logo (rechts, links, ohne).
    - Die Vorschau zeigt das Muster sofort mit den Änderungen. „Auf Standard zurücksetzen“ stellt die Gestaltung des Musters wieder her.
- **Textvarianten:** ein Kapitel in drei Fassungen nebeneinander – Endanwender (was zu tun ist), Fachtext (vollständig mit Rollen und Quellenstatus) und Kurzfassung für das Management (etwa ein Viertel der Länge) – mit Wortzahl und Download als Markdown. Die Kurzfassung entsteht aus Zweck, Ergebnis, Warnhinweisen und Ablauf; mit „Kurzfassung mit KI-Dienst“ formuliert ein lokaler KI-Dienst sie, ohne neue Zahlen hinzuzufügen.
- **Textbausteine:** wiederkehrende Absätze einmal pflegen. „Wiederkehrende Absätze“ zeigt gleich lautende Absätze in mehreren Kapiteln; „Als Textbaustein anlegen“ übernimmt einen davon. „Gleiche Absätze verknüpfen“ verbindet die Kapitel mit dem Baustein, „In Kapitel einfügen“ setzt ihn ans Ende eines Abschnitts. Nach einer Änderung („Neue Fassung speichern“) sind die Kapitel „veraltet“; „In Kapitel aktualisieren“ übernimmt die Fassung in die Entwürfe – freigegebene Versionen bleiben bis zur nächsten Freigabe gültig. In der Werkstatt trägt ein verknüpfter Absatz das Kennzeichen „🧩 Textbaustein“; wer seinen Text ändert, löst die Verknüpfung.
- **Vorher/Nachher:** zwei Fassungen eines Bildes aus dem Bildarchiv wählen und mit dem Schieberegler vergleichen (links Nachher, rechts Vorher). Anlass, Änderung, Wirkung und Ticket belegen die Änderung. „Als Bild ins Archiv“ legt die Gegenüberstellung als Bild ab; den angezeigten Verweis fügen Sie in ein Kapitel ein.
- **Klickstrecke als BPMN:** unter „Bildarchiv“ eine gespeicherte Klickstrecke wählen und „Als BPMN 2.0“ herunterladen – für Prozessmodelle in Camunda Modeler oder bpmn.io.
- **Veröffentlichung:** Handbuch-Release mit Online-Hilfe und Übersetzungen. Kapitel mit späterem „gültig ab“ als die Versionsnummer kommen erst in ein späteres Release. Unter „Änderungen anzeigen“ steht der **Projektvergleich** mit dem Vorgänger (neue Funktionen, geänderte Bilder, abgelöste Funktionen, Tickets der Version); „Releaseletter-Entwurf erzeugen“ legt daraus einen Letter an.
- **Übersetzungen:** Kapitel in die Landessprachen (auch Deutsch und Französisch für die Schweiz); Platzhalter- und Strukturvergleich, Länge, deutsche Wörter im Zieltext, Datum und Kennungen.
  - **Übersetzungsspeicher:** Freigegebene Absätze werden beim nächsten Mal sofort übernommen („Speicher 100 %“); „Vorschläge aus dem Speicher“ zeigt ähnliche Treffer ab 75 %. Pflege, Export und Import unter **Übersetzungsspeicher** (Datei wie `SPEICHER.csv`).
  - **Glossar je Sprache:** feste Übersetzungen der Terminologie, Export für Übersetzer und Rückimport.
  - **Übersetzungsbüro:** XLIFF 1.2 oder Excel herunterladen, die Rückgabe einlesen → „Prüfen“ → „Übernehmen“.
  - **Länderreview:** Prüferin bzw. Prüfer und Markt wählen → „Länderreview anfordern“. Mit „automatisch – Ansprechperson des Marktes“ geht das Review an die Ansprechperson, die die Administration unter „Einstellungen → Ansprechpersonen je Markt“ hinterlegt hat; ihre Vertretung kann ebenso prüfen. Offene Reviews stehen bei der Ansprechperson und der Vertretung unter „Meine Länderreviews“. Die Prüferin erfasst Fehler nach MQM (gering 1, schwer 5, kritisch 10 Punkte) und gibt frei (bis 5 Punkte je 1 000 Wörter) oder „zurück an Übersetzung“. Ein angefordertes Review muss vor der Freigabe der Übersetzung bestanden sein. Prüferin bzw. Prüfer und Vertretung erhalten beim Anfordern einen Hinweis unter „Aufgaben & Hinweise“ (und per E-Mail bzw. Webhook, falls eingerichtet); „öffnen“ führt direkt zur Übersetzung. Das Ergebnis des Reviews geht als Hinweis an die Person, die es angefordert hat.
  - **Rückübersetzung:** „Stichprobe rückübersetzen“ prüft 10 % der Sicherheitshinweise gegen das Deutsche.
  - **Schweiz:** Deutsch (Schweiz) entsteht per Klick nach Regeln aus dem Deutschen (ss statt ß, «…»); Französisch (Schweiz) übernimmt die freigegebene französische Fassung.
  - Hinweis, wenn ein Bild keine Fassung in der Zielsprache hat; Exporte zeigen Inhaltsverzeichnis, Versionszeile und Hinweisarten in der Zielsprache.
- **Releaseletter:** „Übersetzen (DE → EN)“ bzw. „EN → DE“ legt einen geprüften Entwurf in der anderen Sprache an.
- **Release-Abgleich, Releaseletter:** Jira-Tickets gegen den Bestand prüfen; Releaseletter mit Prüfregeln.
  - **Einstufung je Ticket** (Berechtigung „Entscheiden“): genehmigt, in Prüfung, intern oder Background. Intern und Background fließen nicht in Kapitel; Background zählt nur in der Lückenanalyse und erscheint in keinem Releaseletter. Ohne Einstufung gilt Bug = intern, sonst „in Prüfung“.
  - **Aus Projektvergleich erzeugen:** Releaseletter-Entwurf aus zwei Handbuch-Releases.
- **Kontexthilfe:** Hilfe-Widget für oneSCM (F1 je Maske).

## 9. Typische Arbeitsabläufe

1. **Wissen aufbauen:** Einlesen → Chunks mit Labels → Fragen & Antworten → Antwortqualität prüfen → Lücken in die Expertenbefragung → Antworten als Frage & Antwort (Label „Prüfen“) → später durch Quellen belegen.
2. **Kapitel erstellen:** Kapitelanweisung festlegen (Kapitelsteuerung) → Quellen einlesen → Qualitätsanalyse (Widersprüche, Dopplungen) → Kapitelgenerator oder Kapitel-Assistent → Kapitelwerkstatt → Anleitungs-Check → Freigabe → Export/Veröffentlichung.
3. **Screenshots pflegen:** Bild ins Archiv (oder Platzhalter) → Datenschutz im Bild prüfen (erkannte Stellen, ggf. eigene Stellen) → Merkmale, Labels und Kapitel → Varianten verknüpfen → Klickstrecke → Deckungsmatrix auf Lücken prüfen → neue Fassung bei neuem Release.

## 10. Datenschutz

Personenbezogene Daten (Namen, E-Mail, FIN, Kennzeichen …) erkennt die Datenschutzprüfung – in Texten und, mit eingerichteter Texterkennung, auch in Bildern; dort werden sie verpixelt, das Original bleibt erhalten. Die Daten gehen nie an externe Dienste. Gesichter und Unterschriften erkennt die App nicht – markieren Sie sie als eigene Stelle. Fragen mit personenbezogenen Daten werden bei externem KI-Dienst nicht gestellt. Befragungen erfassen Fachbereich oder Rolle, keine Personennamen.
