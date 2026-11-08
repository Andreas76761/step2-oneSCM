# Batch 607 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kundentyp „Behördenkunde“ inkl. Datenmodell und oneERP-Synchronisation**

In oneSCM können künftig auch Behördenkunden verwaltet werden. Dabei wird zwischen privaten Behördenkunden und gewerblichen Behördenkunden unterschieden. Beide Kundentypen stehen bei der Vertragserstellung im Vertragsvorschlag in der Auswahlliste „Kundentyp“ zur Verfügung.

**Private Behördenkunden**

Auf der Seite „Kunden- und Zahlungsinformationen“ gibt es im Bereich „Kundeninformationen“ das neue Pflichtfeld „Zugehörigkeit“ (Affiliation). Es handelt sich um eine Auswahlliste mit Einfachauswahl. Zur Auswahl stehen „Botschaftsangehöriger“ (englisch: Embassy official), „Militärangehöriger“ (englisch: Military personnel) und „NATO-Angehöriger“ (englisch: NATO personnel). Der gewählte Wert wird an oneERP übermittelt und dort synchronisiert. Das entsprechende oneERP-Feld heißt IdentificationCategory (Z_IDEN).

Als Zahlungsarten stehen wie bei normalen Privatkunden IBAN oder Kreditkarte zur Verfügung. Die Übersichts- und Bestätigungsseite zeigt die Angaben entsprechend an.

Im Vertragsmanagement wird die Zugehörigkeit im Reiter „Kunde“ angezeigt, in der Kundenverwaltung ebenfalls. Der angezeigte Wert ist jeweils „Embassy official“, „Military personnel“ oder „NATO personnel“. Die Anzeige im Vertragsmanagement wird laut den vorliegenden Angaben in einem separaten Vorhaben durch ein anderes Team umgesetzt.

**Gewerbliche Behördenkunden**

Auch hier gibt es im Bereich „Kundeninformationen“ das neue Pflichtfeld „Zugehörigkeit“ als Auswahlliste mit Einfachauswahl. Die Optionen sind „Öffentliche Institutionen“ (englisch: Public-sector), „Botschaft“ (Embassy), „Militär“ (Army) und „NATO“. Der Wert wird ebenfalls an oneERP gesendet und synchronisiert, und zwar in das Feld IdentificationCategory (Z_IDEN).

Im Bereich „Zahlungsinformationen“ stehen für gewerbliche Behördenkunden die Zahlungsarten Lastschrift und Überweisung zur Verfügung. Die Lastschrift ist unverändert wie bei allen Kunden. Die Überweisung wird per Optionsfeld (Radiobutton) ausgewählt. Zusätzlich werden Forderungsinformationen aus dem Finanzsystem berücksichtigt, darunter der Wert „Account Note“. Er kann sich bei der Synchronisation mit oneERP von „ungleich K“ auf „K“ ändern, nachdem bestimmte Aktionen erfolgt sind. Die Behandlung dieser Änderungen ist für einen späteren Release (PI12) vorgesehen.

Die Zugehörigkeit wird auch bei gewerblichen Behördenkunden im Vertragsmanagement im Reiter „Kunde“ und in der Kundenverwaltung im Bereich „Kundeninformationen“ angezeigt, mit den Werten „Public-Sector“, „Embassy“, „Army“ oder „NATO“. Die Übersichts- und Bestätigungsseite zeigt die Angaben ebenfalls an.

**Noch ausstehende Erweiterungen**

Die folgenden Punkte waren in den Unterlagen als Teil von PI12 geplant, gemeinsam mit einem weiteren Team. Bis dahin erfolgen entsprechende Änderungen nur manuell durch das Mitarbeiterteam (MO). Sie sind in den Angaben teilweise durchgestrichen und daher nicht als verbindlich zu betrachten. Vorgesehen war eine Anzeige des Überweisungsstatus auf der Prüfseite „MO Checks“ mit den Werten „Pending“, „Ok“ und „Not Ok“. Außerdem sollte eine automatische E-Mail an das zuständige regionale Accounting-Team gesendet werden. Nach einer Frist von 48 Arbeitsstunden sollte ein Abgleich mit oneERP erfolgen: Wechselt der Wert dort auf „K“, wird der Status „Ok“, andernfalls „Not Ok“. In den Status „Pending“ oder „Not Ok“ sollte das Feld „Account Note“ vom MO manuell geändert werden können.