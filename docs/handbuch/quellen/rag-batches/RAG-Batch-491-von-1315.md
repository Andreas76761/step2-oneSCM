# Batch 491 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vorlagenverwaltung: Rollen und Berechtigungen**

Benutzer mit der Rolle MPC Product Manager oder HQ Product Manager erhalten vollen Zugriff auf die Vorlagenverwaltung. Sie können Vorlagen einsehen und verwalten und damit alle Aufgaben erledigen, die zu ihrem Tätigkeitsbereich im Zusammenhang mit Vorlagen gehören. Dafür ist jeweils die Berechtigung „OneSCM_templatesmgmt_manage" vorgesehen, die beiden Rollen zugewiesen wird.

**Stammdaten-Vorlage: E-Mail-Benachrichtigung bei Vertragsreaktivierung**

Sie können eine Benachrichtigungsvorlage erstellen, deren E-Mail-Inhalt speziell für Verträge gilt, die über den Prozess „Reaktivierung" im Vertragsmanagement wieder aktiviert werden. Die E-Mail wird an den Vertragshalter gesendet, und zwar mit dem Inhalt, der in der Vorlage festgelegt ist. Der Umfang dieser Funktion beschränkt sich auf das erfolgreiche Anlegen der Vorlage. Der tatsächliche E-Mail-Versand mit den erstellten Vorlagen wird im Rahmen des Vertragsmanagements geprüft.

Voraussetzung ist, dass Sie angemeldet sind und im Administrationsbereich unter „Template Management" den Reiter „Benachrichtigung" geöffnet haben. Außerdem müssen Vorlagen für Kopf- und Fußzeile bereits definiert sein. Über „Create Template" und anschließend „E-Mail" gelangen Sie zur Seite für die Vorlagenerstellung.

Dort erfassen Sie zunächst die Pflichtangaben. Dazu gehört der Vorlagenname (Textfeld mit maximal 25 Zeichen, zum Beispiel „Template-Reaction"). Hinzu kommt der Markt, der für das MVP mit Deutschland vorbelegt ist und künftig je nach Land angezeigt werden soll. Im Feld „Verwendet für" wählen Sie aus den Werten der verschiedenen Geschäftsprozesse hier „REACTIVATION" aus. Schließlich legen Sie über „Gültig ab" das Datum fest, ab dem die Vorlage für den Geschäftsprozess gelten soll. Sind Pflichtfelder nicht ausgefüllt, wird das betreffende Feld benannt. „Als Entwurf speichern" bleibt dann verfügbar, „Veröffentlichen" ist jedoch nicht aktiv.

Optional können Sie weitere Angaben machen. Die Division ist im MVP auf PC festgelegt, Van folgt nach dem MVP. Bei der Marke wählen Sie im MVP Mercedes-Benz, Smart folgt später. Die Sprache richtet sich nach der Marktrolle des Benutzers, im MVP wird Englisch angezeigt.

Anschließend erfassen Sie den eigentlichen E-Mail-Inhalt. Alle Inhalte werden gemäß dem MB Style Guide für E-Mails erstellt. Der Betreff lautet „Service Contract Reactivated - %Contract Number". Die Vertragsnummer wird erst beim Versand an den Kunden eingesetzt und entsprechend der jeweiligen Vertragsnummer aktualisiert. Kopf- und Fußzeile wählen Sie aus einer Dropdown-Liste der verfügbaren Werte aus. Im Template-Design-Editor geben Sie den Text der E-Mail ein. Werte mit vorangestelltem „%" sind Druckvariablen, die Sie per Drag-and-drop einfügen.

Der vorgesehene Text beginnt mit der Anrede „Dear %First Name %Last name". Er bedankt sich dafür, dass sich der Kunde für einen Mercedes-Benz Service Contract entschieden hat. Er bestätigt den Zahlungseingang für den ausgesetzten Vertrag und teilt mit, dass der Vertrag reaktiviert wurde. Der Kunde kann damit die entsprechenden Wartungs- und Reparaturleistungen wieder in allen autorisierten Servicebetrieben nutzen. Außerdem enthält der Text den Hinweis, überfällige oder ausbleibende Zahlungen zu vermeiden, um Unterbrechungen der Leistungen auszuschließen. Es folgen die Vertragsdetails: Vertragsnummer (zum Beispiel DEPE001A), Fahrgestellnummer, Kennzeichen, Produkt (zum Beispiel Excellent) und Reaktivierungsdatum. Das Kennzeichen wird nur angezeigt, wenn ein Wert vorhanden ist, andernfalls entfällt das Feld in der E-Mail. Bei Fragen verweist die E-Mail an das Customer Support Team. Sie endet mit der Grußformel „Yours sincerely, Service Contract Team, Mercedes-Benz Cars Germany", den marktspezifischen Angaben zu Telefonnummer und E-Mail-Adresse sowie dem Hinweis, vor dem Ausdrucken die Umwelt zu bedenken.

Mit der Schaltfläche „Send Test E-mail" senden Sie sich selbst eine Test-E-Mail im identischen Format, das auch der Kunde erhält, also mit Betreff, Kopfzeile, Fußzeile und Inhalt. So sehen Sie vorab, wie die E-Mail beim Empfänger aussieht.

Mit „Save as Draft" speichern Sie eine Entwurfsversion, die noch nicht für Geschäftsprozesse gilt. Mit „Publish" veröffentlichen Sie die endgültige Version. Sie ist dann für die Prozesse einsatzbereit und wird entsprechend dem Datum „Gültig ab" angewendet. Die erstellte Vorlage wird anschließend auf der Übersichtsseite der Vorlagen angezeigt.

**Prüfkriterien**

Eine veröffentlichte Vorlage muss ab dem Datum „Gültig ab" angewendet und an den Kunden gesendet werden. Eine Test-E-Mail muss dem Benutzer in derselben Form zugestellt werden, wie sie der Kunde erhält. Ein gespeicherter Entwurf darf auch dann nicht im Prozess angewendet werden, wenn das Datum „Gültig ab" erreicht ist. Solange nicht alle Pflichtfelder erfasst sind, darf die Schaltfläche „Veröffentlichen" nicht verfügbar sein.