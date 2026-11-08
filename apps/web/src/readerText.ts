// Beschriftungen der Leseransicht und des Drucks in der Lesesprache (ADR-074, ADR-078): was Leserinnen und Leser sehen, folgt
// der gewählten Sprache; Bedienelemente der Redaktion (Verweise bearbeiten, Entwürfe einblenden) bleiben deutsch.
// Alle neun Projektsprachen vollständig; eine unbekannte Sprache liest die englischen Texte.
import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react';

const de = {
  tip: 'Tipp', warning: 'Achtung', note: 'Hinweis',
  stepsDone: '{done} von {total} Schritten erledigt',
  fbQuestion: 'War dieses Kapitel hilfreich?', yes: 'Ja', no: 'Nein', fbMissing: 'Was hat gefehlt oder war unklar? (optional)',
  fbPlaceholder: 'z. B. Schritt 3 passt nicht zur aktuellen Maske', fbSend: 'Rückmeldung senden', fbThanks: 'Danke für Ihre Rückmeldung', fbThanksNo: ' – die Redaktion kümmert sich darum',
  seeAlso: 'Siehe auch', faqRelated: 'Häufige Fragen dazu', allFaq: 'Alle häufigen Fragen',
  langMissing: 'Dieses Kapitel ist noch nicht {into} übersetzt – Sie lesen die deutsche Fassung.',
  langOutdated: 'Die Übersetzung {into} gehört zu einer älteren Fassung – Sie lesen die aktuelle deutsche Fassung.',
  untranslatedOne: '1 Absatz ist noch nicht übersetzt und erscheint deutsch.', untranslatedMany: '{n} Absätze sind noch nicht übersetzt und erscheinen deutsch.',
  requestTranslation: 'Übersetzung anfordern', requested: 'Übersetzung angefordert – die Redaktion ist informiert.',
  bookmark: 'Merken', bookmarked: 'Gemerkt', addNote: 'Notiz hinzufügen', editNote: 'Notiz bearbeiten', noteLabel: 'Ihre Notiz zu diesem Kapitel',
  notePlaceholder: 'z. B. für die Inventur im Dezember', save: 'Speichern', cancel: 'Abbrechen', deleteNote: 'Notiz löschen', noteSaved: 'Notiz gespeichert.', noteDeleted: 'Notiz gelöscht.',
  noteHint: 'Nur für Sie sichtbar; das Kapitel wird dabei gemerkt.', allBookmarks: 'Alle Lesezeichen und Notizen',
  newChapter: 'Dieses Kapitel ist neu für Sie.', changedChapter: 'Dieses Kapitel wurde seit Ihrem letzten Lesen geändert.',
  otherOne: '1 weiteres Kapitel ist neu für Sie oder wurde seit Ihrem letzten Lesen geändert – im Inhalt markiert.',
  otherMany: '{n} weitere Kapitel sind neu für Sie oder wurden seit Ihrem letzten Lesen geändert – im Inhalt markiert.',
  tagNew: 'Neu', tagChanged: 'Geändert', untranslatedTag: 'noch nicht übersetzt',
  contents: 'Inhalt', bookmarks: 'Lesezeichen', recent: 'Zuletzt gelesen', faqLink: 'Häufige Fragen', glossHint: 'Unterstrichene Begriffe erklären sich per Klick oder Maus.',
  toc: 'Inhaltsverzeichnis', language: 'Sprache', translatedCount: '{n} übersetzt', search: 'Im Handbuch suchen', searchPlaceholder: 'z. B. Lieferschein drucken', clearSearch: 'Suche leeren', searchResults: 'Suchergebnisse',
  found: '{n} Kapitel gefunden', notFound: 'Nichts gefunden zu „{q}“ – anderes Wort versuchen',
  hits: '{n} Treffer für „{q}“ markiert.', noHits: '„{q}“ kommt in diesem Kapitel nicht vor.', removeMark: 'Markierung entfernen',
  chooseChapter: 'Wählen Sie unter „Inhalt“ ein Kapitel.', chapter: 'Kapitel', draft: 'Entwurf', draftBanner: 'Entwurf – noch nicht freigegeben',
  printSeeAlso: 'Siehe auch:', chapterN: 'Kapitel {n}', faqTitle: 'Häufige Fragen', glossary: 'Glossar',
  continueWith: 'Weiter mit', draftWatermark: 'ENTWURF',
  printMissing: '(noch nicht übersetzt – deutsche Fassung)', printOutdated: '(Übersetzung veraltet – deutsche Fassung)', draftSuffix: ' (Entwurf)',
  manual: 'Benutzerhandbuch', workingState: 'Arbeitsstand', version: 'Version {v}', forRole: 'für {role}', asOf: 'Stand', chapters: 'Kapitel', published: 'Veröffentlicht',
  notice: 'Hinweis', includesDrafts: 'enthält nicht freigegebene Entwürfe', cover: 'Deckblatt', printToc: 'Inhaltsverzeichnis des Handbuchs', pageOf: 'Seite {page} von {pages}', quote: '„{x}“',
  faqFilter: 'Fragen filtern', faqPlaceholder: 'z. B. Passwort', faqEmpty: 'Noch keine veröffentlichten Fragen.', faqPartly: 'Einige Fragen sind noch nicht übersetzt und erscheinen deutsch.',
  requestReason: 'Wofür brauchen Sie die Übersetzung? (optional)', requestReasonPlaceholder: 'z. B. für neue Kolleginnen und Kollegen im Lager', sendRequest: 'Anfordern',
};
export type ReaderTextKey = keyof typeof de;
type Texts = Record<ReaderTextKey, string>;

const en: Texts = {
  tip: 'Tip', warning: 'Caution', note: 'Note',
  stepsDone: '{done} of {total} steps done',
  fbQuestion: 'Was this chapter helpful?', yes: 'Yes', no: 'No', fbMissing: 'What was missing or unclear? (optional)',
  fbPlaceholder: 'e.g. step 3 does not match the current screen', fbSend: 'Send feedback', fbThanks: 'Thank you for your feedback', fbThanksNo: ' – the editorial team will look into it',
  seeAlso: 'See also', faqRelated: 'Related questions', allFaq: 'All frequently asked questions',
  langMissing: 'This chapter has not been translated {into} yet – you are reading the German version.',
  langOutdated: 'The translation {into} belongs to an older version – you are reading the current German version.',
  untranslatedOne: '1 paragraph has not been translated yet and appears in German.', untranslatedMany: '{n} paragraphs have not been translated yet and appear in German.',
  requestTranslation: 'Request translation', requested: 'Translation requested – the editorial team has been notified.',
  bookmark: 'Bookmark', bookmarked: 'Bookmarked', addNote: 'Add note', editNote: 'Edit note', noteLabel: 'Your note on this chapter',
  notePlaceholder: 'e.g. for the stocktaking in December', save: 'Save', cancel: 'Cancel', deleteNote: 'Delete note', noteSaved: 'Note saved.', noteDeleted: 'Note deleted.',
  noteHint: 'Only visible to you; the chapter is bookmarked as well.', allBookmarks: 'All bookmarks and notes',
  newChapter: 'This chapter is new to you.', changedChapter: 'This chapter has changed since you last read it.',
  otherOne: '1 more chapter is new to you or has changed since you last read it – marked in the contents.',
  otherMany: '{n} more chapters are new to you or have changed since you last read them – marked in the contents.',
  tagNew: 'New', tagChanged: 'Changed', untranslatedTag: 'not translated yet',
  contents: 'Contents', bookmarks: 'Bookmarks', recent: 'Recently read', faqLink: 'Frequently asked questions', glossHint: 'Underlined terms explain themselves on click or hover.',
  toc: 'Table of contents', language: 'Language', translatedCount: '{n} translated', search: 'Search the manual', searchPlaceholder: 'e.g. print delivery note', clearSearch: 'Clear search', searchResults: 'Search results',
  found: '{n} chapters found', notFound: 'Nothing found for “{q}” – try another word',
  hits: '{n} matches for “{q}” highlighted.', noHits: '“{q}” does not occur in this chapter.', removeMark: 'Remove highlighting',
  chooseChapter: 'Choose a chapter under “Contents”.', chapter: 'Chapter', draft: 'Draft', draftBanner: 'Draft – not yet approved',
  printSeeAlso: 'See also:', chapterN: 'Chapter {n}', faqTitle: 'Frequently asked questions', glossary: 'Glossary',
  continueWith: 'Continue with', draftWatermark: 'DRAFT',
  printMissing: '(not translated yet – German version)', printOutdated: '(translation outdated – German version)', draftSuffix: ' (draft)',
  manual: 'User manual', workingState: 'Working version', version: 'Version {v}', forRole: 'for {role}', asOf: 'As of', chapters: 'Chapters', published: 'Published',
  notice: 'Note', includesDrafts: 'contains drafts that are not yet approved', cover: 'Cover page', printToc: 'Table of contents of the manual', pageOf: 'Page {page} of {pages}', quote: '“{x}”',
  faqFilter: 'Filter questions', faqPlaceholder: 'e.g. password', faqEmpty: 'No published questions yet.', faqPartly: 'Some questions have not been translated yet and appear in German.',
  requestReason: 'What do you need the translation for? (optional)', requestReasonPlaceholder: 'e.g. for new colleagues in the warehouse', sendRequest: 'Send request',
};

const fr: Texts = {
  tip: 'Conseil', warning: 'Attention', note: 'Remarque',
  stepsDone: '{done} étapes sur {total} terminées',
  fbQuestion: 'Ce chapitre vous a-t-il été utile ?', yes: 'Oui', no: 'Non', fbMissing: 'Qu’est-ce qui manquait ou n’était pas clair ? (facultatif)',
  fbPlaceholder: 'p. ex. l’étape 3 ne correspond pas à l’écran actuel', fbSend: 'Envoyer le retour', fbThanks: 'Merci pour votre retour', fbThanksNo: ' – la rédaction s’en occupe',
  seeAlso: 'Voir aussi', faqRelated: 'Questions associées', allFaq: 'Toutes les questions fréquentes',
  langMissing: 'Ce chapitre n’est pas encore traduit {into} – vous lisez la version allemande.',
  langOutdated: 'La traduction {into} correspond à une version antérieure – vous lisez la version allemande actuelle.',
  untranslatedOne: '1 paragraphe n’est pas encore traduit et apparaît en allemand.', untranslatedMany: '{n} paragraphes ne sont pas encore traduits et apparaissent en allemand.',
  requestTranslation: 'Demander une traduction', requested: 'Traduction demandée – la rédaction a été informée.',
  bookmark: 'Ajouter un signet', bookmarked: 'Signet ajouté', addNote: 'Ajouter une note', editNote: 'Modifier la note', noteLabel: 'Votre note sur ce chapitre',
  notePlaceholder: 'p. ex. pour l’inventaire de décembre', save: 'Enregistrer', cancel: 'Annuler', deleteNote: 'Supprimer la note', noteSaved: 'Note enregistrée.', noteDeleted: 'Note supprimée.',
  noteHint: 'Visible uniquement par vous ; le chapitre est également ajouté aux signets.', allBookmarks: 'Tous les signets et notes',
  newChapter: 'Ce chapitre est nouveau pour vous.', changedChapter: 'Ce chapitre a été modifié depuis votre dernière lecture.',
  otherOne: '1 autre chapitre est nouveau pour vous ou a été modifié depuis votre dernière lecture – signalé dans le sommaire.',
  otherMany: '{n} autres chapitres sont nouveaux pour vous ou ont été modifiés depuis votre dernière lecture – signalés dans le sommaire.',
  tagNew: 'Nouveau', tagChanged: 'Modifié', untranslatedTag: 'pas encore traduit',
  contents: 'Sommaire', bookmarks: 'Signets', recent: 'Lu récemment', faqLink: 'Questions fréquentes', glossHint: 'Les termes soulignés s’expliquent au clic ou au survol.',
  toc: 'Table des matières', language: 'Langue', translatedCount: '{n} traduit(s)', search: 'Rechercher dans le manuel', searchPlaceholder: 'p. ex. imprimer un bon de livraison', clearSearch: 'Effacer la recherche', searchResults: 'Résultats de recherche',
  found: '{n} chapitres trouvés', notFound: 'Aucun résultat pour « {q} » – essayez un autre mot',
  hits: '{n} occurrences de « {q} » surlignées.', noHits: '« {q} » n’apparaît pas dans ce chapitre.', removeMark: 'Retirer le surlignage',
  chooseChapter: 'Choisissez un chapitre dans le « Sommaire ».', chapter: 'Chapitre', draft: 'Brouillon', draftBanner: 'Brouillon – pas encore validé',
  printSeeAlso: 'Voir aussi :', chapterN: 'Chapitre {n}', faqTitle: 'Questions fréquentes', glossary: 'Glossaire',
  continueWith: 'Suite :', draftWatermark: 'BROUILLON',
  printMissing: '(pas encore traduit – version allemande)', printOutdated: '(traduction obsolète – version allemande)', draftSuffix: ' (brouillon)',
  manual: 'Manuel utilisateur', workingState: 'Version de travail', version: 'Version {v}', forRole: 'pour {role}', asOf: 'État au', chapters: 'Chapitres', published: 'Publié le',
  notice: 'Remarque', includesDrafts: 'contient des brouillons non validés', cover: 'Page de garde', printToc: 'Table des matières du manuel', pageOf: 'Page {page} sur {pages}', quote: '« {x} »',
  faqFilter: 'Filtrer les questions', faqPlaceholder: 'p. ex. mot de passe', faqEmpty: 'Aucune question publiée pour l’instant.', faqPartly: 'Certaines questions ne sont pas encore traduites et apparaissent en allemand.',
  requestReason: 'Pourquoi avez-vous besoin de cette traduction ? (facultatif)', requestReasonPlaceholder: 'p. ex. pour les nouveaux collègues de l’entrepôt', sendRequest: 'Envoyer la demande',
};

const es: Texts = {
  tip: 'Consejo', warning: 'Atención', note: 'Nota',
  stepsDone: '{done} de {total} pasos completados',
  fbQuestion: '¿Le ha resultado útil este capítulo?', yes: 'Sí', no: 'No', fbMissing: '¿Qué faltaba o no estaba claro? (opcional)',
  fbPlaceholder: 'p. ej. el paso 3 no coincide con la pantalla actual', fbSend: 'Enviar opinión', fbThanks: 'Gracias por su opinión', fbThanksNo: ': el equipo de redacción se ocupará de ello',
  seeAlso: 'Véase también', faqRelated: 'Preguntas relacionadas', allFaq: 'Todas las preguntas frecuentes',
  langMissing: 'Este capítulo aún no está traducido {into}: está leyendo la versión alemana.',
  langOutdated: 'La traducción {into} corresponde a una versión anterior: está leyendo la versión alemana actual.',
  untranslatedOne: '1 párrafo aún no está traducido y aparece en alemán.', untranslatedMany: '{n} párrafos aún no están traducidos y aparecen en alemán.',
  requestTranslation: 'Solicitar traducción', requested: 'Traducción solicitada: se ha informado al equipo de redacción.',
  bookmark: 'Guardar', bookmarked: 'Guardado', addNote: 'Añadir nota', editNote: 'Editar nota', noteLabel: 'Su nota sobre este capítulo',
  notePlaceholder: 'p. ej. para el inventario de diciembre', save: 'Guardar', cancel: 'Cancelar', deleteNote: 'Eliminar nota', noteSaved: 'Nota guardada.', noteDeleted: 'Nota eliminada.',
  noteHint: 'Solo visible para usted; el capítulo también se guarda.', allBookmarks: 'Todos los marcadores y notas',
  newChapter: 'Este capítulo es nuevo para usted.', changedChapter: 'Este capítulo ha cambiado desde su última lectura.',
  otherOne: 'Otro capítulo es nuevo para usted o ha cambiado desde su última lectura: marcado en el índice.',
  otherMany: 'Otros {n} capítulos son nuevos para usted o han cambiado desde su última lectura: marcados en el índice.',
  tagNew: 'Nuevo', tagChanged: 'Modificado', untranslatedTag: 'aún no traducido',
  contents: 'Índice', bookmarks: 'Marcadores', recent: 'Leído recientemente', faqLink: 'Preguntas frecuentes', glossHint: 'Los términos subrayados se explican al hacer clic o pasar el ratón.',
  toc: 'Índice de contenidos', language: 'Idioma', translatedCount: '{n} traducido(s)', search: 'Buscar en el manual', searchPlaceholder: 'p. ej. imprimir albarán', clearSearch: 'Borrar búsqueda', searchResults: 'Resultados de búsqueda',
  found: '{n} capítulos encontrados', notFound: 'No se encontró nada para «{q}»: pruebe otra palabra',
  hits: '{n} coincidencias de «{q}» resaltadas.', noHits: '«{q}» no aparece en este capítulo.', removeMark: 'Quitar resaltado',
  chooseChapter: 'Elija un capítulo en el «Índice».', chapter: 'Capítulo', draft: 'Borrador', draftBanner: 'Borrador: aún no aprobado',
  printSeeAlso: 'Véase también:', chapterN: 'Capítulo {n}', faqTitle: 'Preguntas frecuentes', glossary: 'Glosario',
  continueWith: 'Continúe con', draftWatermark: 'BORRADOR',
  printMissing: '(aún no traducido: versión alemana)', printOutdated: '(traducción desactualizada: versión alemana)', draftSuffix: ' (borrador)',
  manual: 'Manual de usuario', workingState: 'Versión de trabajo', version: 'Versión {v}', forRole: 'para {role}', asOf: 'Fecha', chapters: 'Capítulos', published: 'Publicado',
  notice: 'Nota', includesDrafts: 'contiene borradores no aprobados', cover: 'Portada', printToc: 'Índice del manual', pageOf: 'Página {page} de {pages}', quote: '«{x}»',
  faqFilter: 'Filtrar preguntas', faqPlaceholder: 'p. ej. contraseña', faqEmpty: 'Aún no hay preguntas publicadas.', faqPartly: 'Algunas preguntas aún no están traducidas y aparecen en alemán.',
  requestReason: '¿Para qué necesita la traducción? (opcional)', requestReasonPlaceholder: 'p. ej. para los nuevos compañeros del almacén', sendRequest: 'Enviar solicitud',
};

const it: Texts = {
  tip: 'Suggerimento', warning: 'Attenzione', note: 'Nota',
  stepsDone: '{done} di {total} passi completati',
  fbQuestion: 'Questo capitolo è stato utile?', yes: 'Sì', no: 'No', fbMissing: 'Cosa mancava o non era chiaro? (facoltativo)',
  fbPlaceholder: 'ad es. il passo 3 non corrisponde alla schermata attuale', fbSend: 'Invia riscontro', fbThanks: 'Grazie per il riscontro', fbThanksNo: ': la redazione se ne occuperà',
  seeAlso: 'Vedi anche', faqRelated: 'Domande correlate', allFaq: 'Tutte le domande frequenti',
  langMissing: 'Questo capitolo non è ancora tradotto {into}: state leggendo la versione tedesca.',
  langOutdated: 'La traduzione {into} si riferisce a una versione precedente: state leggendo la versione tedesca attuale.',
  untranslatedOne: '1 paragrafo non è ancora tradotto e appare in tedesco.', untranslatedMany: '{n} paragrafi non sono ancora tradotti e appaiono in tedesco.',
  requestTranslation: 'Richiedi traduzione', requested: 'Traduzione richiesta: la redazione è stata informata.',
  bookmark: 'Salva', bookmarked: 'Salvato', addNote: 'Aggiungi nota', editNote: 'Modifica nota', noteLabel: 'La vostra nota su questo capitolo',
  notePlaceholder: 'ad es. per l’inventario di dicembre', save: 'Salva', cancel: 'Annulla', deleteNote: 'Elimina nota', noteSaved: 'Nota salvata.', noteDeleted: 'Nota eliminata.',
  noteHint: 'Visibile solo a voi; il capitolo viene anche salvato.', allBookmarks: 'Tutti i segnalibri e le note',
  newChapter: 'Questo capitolo è nuovo per voi.', changedChapter: 'Questo capitolo è stato modificato dall’ultima lettura.',
  otherOne: '1 altro capitolo è nuovo o è stato modificato dall’ultima lettura: segnalato nell’indice.',
  otherMany: 'Altri {n} capitoli sono nuovi o sono stati modificati dall’ultima lettura: segnalati nell’indice.',
  tagNew: 'Nuovo', tagChanged: 'Modificato', untranslatedTag: 'non ancora tradotto',
  contents: 'Indice', bookmarks: 'Segnalibri', recent: 'Letti di recente', faqLink: 'Domande frequenti', glossHint: 'I termini sottolineati si spiegano con un clic o passandoci sopra.',
  toc: 'Sommario', language: 'Lingua', translatedCount: '{n} tradotto/i', search: 'Cerca nel manuale', searchPlaceholder: 'ad es. stampare bolla di consegna', clearSearch: 'Cancella ricerca', searchResults: 'Risultati della ricerca',
  found: '{n} capitoli trovati', notFound: 'Nessun risultato per «{q}»: provate un’altra parola',
  hits: '{n} occorrenze di «{q}» evidenziate.', noHits: '«{q}» non compare in questo capitolo.', removeMark: 'Rimuovi evidenziazione',
  chooseChapter: 'Scegliete un capitolo nell’«Indice».', chapter: 'Capitolo', draft: 'Bozza', draftBanner: 'Bozza: non ancora approvata',
  printSeeAlso: 'Vedi anche:', chapterN: 'Capitolo {n}', faqTitle: 'Domande frequenti', glossary: 'Glossario',
  continueWith: 'Prosegua con', draftWatermark: 'BOZZA',
  printMissing: '(non ancora tradotto: versione tedesca)', printOutdated: '(traduzione non aggiornata: versione tedesca)', draftSuffix: ' (bozza)',
  manual: 'Manuale utente', workingState: 'Versione di lavoro', version: 'Versione {v}', forRole: 'per {role}', asOf: 'Aggiornato al', chapters: 'Capitoli', published: 'Pubblicato',
  notice: 'Nota', includesDrafts: 'contiene bozze non approvate', cover: 'Copertina', printToc: 'Indice del manuale', pageOf: 'Pagina {page} di {pages}', quote: '«{x}»',
  faqFilter: 'Filtra domande', faqPlaceholder: 'ad es. password', faqEmpty: 'Nessuna domanda pubblicata finora.', faqPartly: 'Alcune domande non sono ancora tradotte e appaiono in tedesco.',
  requestReason: 'Per cosa vi serve la traduzione? (facoltativo)', requestReasonPlaceholder: 'ad es. per i nuovi colleghi del magazzino', sendRequest: 'Invia richiesta',
};

const nl: Texts = {
  tip: 'Tip', warning: 'Let op', note: 'Opmerking',
  stepsDone: '{done} van {total} stappen voltooid',
  fbQuestion: 'Was dit hoofdstuk nuttig?', yes: 'Ja', no: 'Nee', fbMissing: 'Wat ontbrak of was onduidelijk? (optioneel)',
  fbPlaceholder: 'bijv. stap 3 komt niet overeen met het huidige scherm', fbSend: 'Feedback versturen', fbThanks: 'Bedankt voor uw feedback', fbThanksNo: ' – de redactie gaat ermee aan de slag',
  seeAlso: 'Zie ook', faqRelated: 'Gerelateerde vragen', allFaq: 'Alle veelgestelde vragen',
  langMissing: 'Dit hoofdstuk is nog niet {into} vertaald – u leest de Duitse versie.',
  langOutdated: 'De vertaling {into} hoort bij een oudere versie – u leest de actuele Duitse versie.',
  untranslatedOne: '1 alinea is nog niet vertaald en verschijnt in het Duits.', untranslatedMany: '{n} alinea’s zijn nog niet vertaald en verschijnen in het Duits.',
  requestTranslation: 'Vertaling aanvragen', requested: 'Vertaling aangevraagd – de redactie is op de hoogte gebracht.',
  bookmark: 'Bladwijzer', bookmarked: 'Bladwijzer gezet', addNote: 'Notitie toevoegen', editNote: 'Notitie bewerken', noteLabel: 'Uw notitie bij dit hoofdstuk',
  notePlaceholder: 'bijv. voor de inventaris in december', save: 'Opslaan', cancel: 'Annuleren', deleteNote: 'Notitie verwijderen', noteSaved: 'Notitie opgeslagen.', noteDeleted: 'Notitie verwijderd.',
  noteHint: 'Alleen zichtbaar voor u; het hoofdstuk krijgt ook een bladwijzer.', allBookmarks: 'Alle bladwijzers en notities',
  newChapter: 'Dit hoofdstuk is nieuw voor u.', changedChapter: 'Dit hoofdstuk is gewijzigd sinds u het laatst las.',
  otherOne: '1 ander hoofdstuk is nieuw voor u of gewijzigd sinds u het laatst las – gemarkeerd in de inhoud.',
  otherMany: '{n} andere hoofdstukken zijn nieuw voor u of gewijzigd sinds u ze laatst las – gemarkeerd in de inhoud.',
  tagNew: 'Nieuw', tagChanged: 'Gewijzigd', untranslatedTag: 'nog niet vertaald',
  contents: 'Inhoud', bookmarks: 'Bladwijzers', recent: 'Recent gelezen', faqLink: 'Veelgestelde vragen', glossHint: 'Onderstreepte begrippen worden uitgelegd bij klikken of aanwijzen.',
  toc: 'Inhoudsopgave', language: 'Taal', translatedCount: '{n} vertaald', search: 'Zoeken in de handleiding', searchPlaceholder: 'bijv. pakbon afdrukken', clearSearch: 'Zoekopdracht wissen', searchResults: 'Zoekresultaten',
  found: '{n} hoofdstukken gevonden', notFound: 'Niets gevonden voor ‘{q}’ – probeer een ander woord',
  hits: '{n} treffers voor ‘{q}’ gemarkeerd.', noHits: '‘{q}’ komt niet voor in dit hoofdstuk.', removeMark: 'Markering verwijderen',
  chooseChapter: 'Kies een hoofdstuk onder ‘Inhoud’.', chapter: 'Hoofdstuk', draft: 'Concept', draftBanner: 'Concept – nog niet vrijgegeven',
  printSeeAlso: 'Zie ook:', chapterN: 'Hoofdstuk {n}', faqTitle: 'Veelgestelde vragen', glossary: 'Woordenlijst',
  continueWith: 'Verder met', draftWatermark: 'CONCEPT',
  printMissing: '(nog niet vertaald – Duitse versie)', printOutdated: '(vertaling verouderd – Duitse versie)', draftSuffix: ' (concept)',
  manual: 'Gebruikershandleiding', workingState: 'Werkversie', version: 'Versie {v}', forRole: 'voor {role}', asOf: 'Stand', chapters: 'Hoofdstukken', published: 'Gepubliceerd',
  notice: 'Opmerking', includesDrafts: 'bevat nog niet vrijgegeven concepten', cover: 'Titelpagina', printToc: 'Inhoudsopgave van de handleiding', pageOf: 'Pagina {page} van {pages}', quote: '‘{x}’',
  faqFilter: 'Vragen filteren', faqPlaceholder: 'bijv. wachtwoord', faqEmpty: 'Nog geen gepubliceerde vragen.', faqPartly: 'Sommige vragen zijn nog niet vertaald en verschijnen in het Duits.',
  requestReason: 'Waarvoor hebt u de vertaling nodig? (optioneel)', requestReasonPlaceholder: 'bijv. voor nieuwe collega’s in het magazijn', sendRequest: 'Aanvraag versturen',
};

const pl: Texts = {
  tip: 'Wskazówka', warning: 'Uwaga', note: 'Informacja',
  stepsDone: 'Wykonano {done} z {total} kroków',
  fbQuestion: 'Czy ten rozdział był pomocny?', yes: 'Tak', no: 'Nie', fbMissing: 'Czego brakowało lub co było niejasne? (opcjonalnie)',
  fbPlaceholder: 'np. krok 3 nie pasuje do obecnego ekranu', fbSend: 'Wyślij opinię', fbThanks: 'Dziękujemy za opinię', fbThanksNo: ' – redakcja się tym zajmie',
  seeAlso: 'Zobacz także', faqRelated: 'Powiązane pytania', allFaq: 'Wszystkie najczęściej zadawane pytania',
  langMissing: 'Ten rozdział nie został jeszcze przetłumaczony {into} – czytasz wersję niemiecką.',
  langOutdated: 'Tłumaczenie {into} dotyczy starszej wersji – czytasz aktualną wersję niemiecką.',
  untranslatedOne: '1 akapit nie został jeszcze przetłumaczony i jest wyświetlany po niemiecku.', untranslatedMany: 'Akapity jeszcze nieprzetłumaczone i wyświetlane po niemiecku: {n}.',
  requestTranslation: 'Poproś o tłumaczenie', requested: 'Poproszono o tłumaczenie – redakcja została powiadomiona.',
  bookmark: 'Dodaj zakładkę', bookmarked: 'Zakładka dodana', addNote: 'Dodaj notatkę', editNote: 'Edytuj notatkę', noteLabel: 'Twoja notatka do tego rozdziału',
  notePlaceholder: 'np. na inwentaryzację w grudniu', save: 'Zapisz', cancel: 'Anuluj', deleteNote: 'Usuń notatkę', noteSaved: 'Notatka zapisana.', noteDeleted: 'Notatka usunięta.',
  noteHint: 'Widoczna tylko dla Ciebie; rozdział zostanie też dodany do zakładek.', allBookmarks: 'Wszystkie zakładki i notatki',
  newChapter: 'Ten rozdział jest dla Ciebie nowy.', changedChapter: 'Ten rozdział zmienił się od Twojej ostatniej lektury.',
  otherOne: '1 inny rozdział jest dla Ciebie nowy lub zmienił się od ostatniej lektury – oznaczony w spisie treści.',
  otherMany: 'Inne rozdziały nowe lub zmienione od ostatniej lektury: {n} – oznaczone w spisie treści.',
  tagNew: 'Nowy', tagChanged: 'Zmieniony', untranslatedTag: 'jeszcze nieprzetłumaczony',
  contents: 'Spis treści', bookmarks: 'Zakładki', recent: 'Ostatnio czytane', faqLink: 'Najczęściej zadawane pytania', glossHint: 'Podkreślone pojęcia są objaśniane po kliknięciu lub najechaniu kursorem.',
  toc: 'Spis treści', language: 'Język', translatedCount: 'przetłumaczono: {n}', search: 'Szukaj w podręczniku', searchPlaceholder: 'np. drukowanie dowodu dostawy', clearSearch: 'Wyczyść wyszukiwanie', searchResults: 'Wyniki wyszukiwania',
  found: 'Znalezione rozdziały: {n}', notFound: 'Nic nie znaleziono dla „{q}” – spróbuj innego słowa',
  hits: 'Zaznaczone trafienia dla „{q}”: {n}.', noHits: '„{q}” nie występuje w tym rozdziale.', removeMark: 'Usuń zaznaczenie',
  chooseChapter: 'Wybierz rozdział w „Spisie treści”.', chapter: 'Rozdział', draft: 'Wersja robocza', draftBanner: 'Wersja robocza – jeszcze niezatwierdzona',
  printSeeAlso: 'Zobacz także:', chapterN: 'Rozdział {n}', faqTitle: 'Najczęściej zadawane pytania', glossary: 'Słowniczek',
  continueWith: 'Dalej:', draftWatermark: 'WERSJA ROBOCZA',
  printMissing: '(jeszcze nieprzetłumaczone – wersja niemiecka)', printOutdated: '(tłumaczenie nieaktualne – wersja niemiecka)', draftSuffix: ' (wersja robocza)',
  manual: 'Podręcznik użytkownika', workingState: 'Wersja robocza', version: 'Wersja {v}', forRole: 'dla roli {role}', asOf: 'Stan na', chapters: 'Rozdziały', published: 'Opublikowano',
  notice: 'Informacja', includesDrafts: 'zawiera niezatwierdzone wersje robocze', cover: 'Strona tytułowa', printToc: 'Spis treści podręcznika', pageOf: 'Strona {page} z {pages}', quote: '„{x}”',
  faqFilter: 'Filtruj pytania', faqPlaceholder: 'np. hasło', faqEmpty: 'Brak opublikowanych pytań.', faqPartly: 'Niektóre pytania nie zostały jeszcze przetłumaczone i są wyświetlane po niemiecku.',
  requestReason: 'Do czego potrzebujesz tłumaczenia? (opcjonalnie)', requestReasonPlaceholder: 'np. dla nowych współpracowników w magazynie', sendRequest: 'Wyślij prośbę',
};

const cs: Texts = {
  tip: 'Tip', warning: 'Pozor', note: 'Poznámka',
  stepsDone: 'Hotovo {done} z {total} kroků',
  fbQuestion: 'Byla tato kapitola užitečná?', yes: 'Ano', no: 'Ne', fbMissing: 'Co chybělo nebo nebylo jasné? (nepovinné)',
  fbPlaceholder: 'např. krok 3 neodpovídá aktuální obrazovce', fbSend: 'Odeslat zpětnou vazbu', fbThanks: 'Děkujeme za zpětnou vazbu', fbThanksNo: ' – redakce se tím bude zabývat',
  seeAlso: 'Viz také', faqRelated: 'Související otázky', allFaq: 'Všechny časté dotazy',
  langMissing: 'Tato kapitola zatím není přeložena {into} – čtete německou verzi.',
  langOutdated: 'Překlad {into} patří ke starší verzi – čtete aktuální německou verzi.',
  untranslatedOne: '1 odstavec zatím není přeložen a zobrazuje se německy.', untranslatedMany: 'Odstavce, které zatím nejsou přeloženy a zobrazují se německy: {n}.',
  requestTranslation: 'Požádat o překlad', requested: 'O překlad bylo požádáno – redakce byla informována.',
  bookmark: 'Přidat záložku', bookmarked: 'Záložka přidána', addNote: 'Přidat poznámku', editNote: 'Upravit poznámku', noteLabel: 'Vaše poznámka k této kapitole',
  notePlaceholder: 'např. pro inventuru v prosinci', save: 'Uložit', cancel: 'Zrušit', deleteNote: 'Smazat poznámku', noteSaved: 'Poznámka uložena.', noteDeleted: 'Poznámka smazána.',
  noteHint: 'Viditelná jen pro vás; kapitola se zároveň přidá do záložek.', allBookmarks: 'Všechny záložky a poznámky',
  newChapter: 'Tato kapitola je pro vás nová.', changedChapter: 'Tato kapitola se od vašeho posledního čtení změnila.',
  otherOne: '1 další kapitola je pro vás nová nebo se od posledního čtení změnila – označeno v obsahu.',
  otherMany: 'Další kapitoly, které jsou nové nebo se od posledního čtení změnily: {n} – označeno v obsahu.',
  tagNew: 'Nové', tagChanged: 'Změněno', untranslatedTag: 'zatím nepřeloženo',
  contents: 'Obsah', bookmarks: 'Záložky', recent: 'Naposledy čtené', faqLink: 'Časté dotazy', glossHint: 'Podtržené pojmy se vysvětlí po kliknutí nebo najetí myší.',
  toc: 'Obsah', language: 'Jazyk', translatedCount: 'přeloženo: {n}', search: 'Hledat v příručce', searchPlaceholder: 'např. tisk dodacího listu', clearSearch: 'Vymazat hledání', searchResults: 'Výsledky hledání',
  found: 'Nalezené kapitoly: {n}', notFound: 'Pro „{q}“ nebylo nic nalezeno – zkuste jiné slovo',
  hits: 'Označené výskyty „{q}“: {n}.', noHits: '„{q}“ se v této kapitole nevyskytuje.', removeMark: 'Odstranit zvýraznění',
  chooseChapter: 'Vyberte kapitolu v části „Obsah“.', chapter: 'Kapitola', draft: 'Koncept', draftBanner: 'Koncept – zatím neschváleno',
  printSeeAlso: 'Viz také:', chapterN: 'Kapitola {n}', faqTitle: 'Časté dotazy', glossary: 'Slovníček',
  continueWith: 'Pokračujte:', draftWatermark: 'KONCEPT',
  printMissing: '(zatím nepřeloženo – německá verze)', printOutdated: '(překlad je zastaralý – německá verze)', draftSuffix: ' (koncept)',
  manual: 'Uživatelská příručka', workingState: 'Pracovní verze', version: 'Verze {v}', forRole: 'pro roli {role}', asOf: 'Stav k', chapters: 'Kapitoly', published: 'Zveřejněno',
  notice: 'Poznámka', includesDrafts: 'obsahuje neschválené koncepty', cover: 'Titulní strana', printToc: 'Obsah příručky', pageOf: 'Strana {page} z {pages}', quote: '„{x}“',
  faqFilter: 'Filtrovat otázky', faqPlaceholder: 'např. heslo', faqEmpty: 'Zatím nejsou zveřejněny žádné otázky.', faqPartly: 'Některé otázky zatím nejsou přeloženy a zobrazují se německy.',
  requestReason: 'K čemu překlad potřebujete? (nepovinné)', requestReasonPlaceholder: 'např. pro nové kolegy ve skladu', sendRequest: 'Odeslat žádost',
};

const pt: Texts = {
  tip: 'Dica', warning: 'Atenção', note: 'Nota',
  stepsDone: '{done} de {total} passos concluídos',
  fbQuestion: 'Este capítulo foi útil?', yes: 'Sim', no: 'Não', fbMissing: 'O que faltou ou não ficou claro? (opcional)',
  fbPlaceholder: 'p. ex. o passo 3 não corresponde ao ecrã atual', fbSend: 'Enviar feedback', fbThanks: 'Obrigado pelo seu feedback', fbThanksNo: ' – a equipa editorial vai tratar do assunto',
  seeAlso: 'Ver também', faqRelated: 'Perguntas relacionadas', allFaq: 'Todas as perguntas frequentes',
  langMissing: 'Este capítulo ainda não foi traduzido {into} – está a ler a versão alemã.',
  langOutdated: 'A tradução {into} pertence a uma versão anterior – está a ler a versão alemã atual.',
  untranslatedOne: '1 parágrafo ainda não foi traduzido e aparece em alemão.', untranslatedMany: '{n} parágrafos ainda não foram traduzidos e aparecem em alemão.',
  requestTranslation: 'Pedir tradução', requested: 'Tradução pedida – a equipa editorial foi informada.',
  bookmark: 'Marcar', bookmarked: 'Marcado', addNote: 'Adicionar nota', editNote: 'Editar nota', noteLabel: 'A sua nota sobre este capítulo',
  notePlaceholder: 'p. ex. para o inventário de dezembro', save: 'Guardar', cancel: 'Cancelar', deleteNote: 'Eliminar nota', noteSaved: 'Nota guardada.', noteDeleted: 'Nota eliminada.',
  noteHint: 'Visível apenas para si; o capítulo também fica marcado.', allBookmarks: 'Todos os marcadores e notas',
  newChapter: 'Este capítulo é novo para si.', changedChapter: 'Este capítulo foi alterado desde a sua última leitura.',
  otherOne: 'Mais 1 capítulo é novo para si ou foi alterado desde a sua última leitura – assinalado no índice.',
  otherMany: 'Mais {n} capítulos são novos para si ou foram alterados desde a sua última leitura – assinalados no índice.',
  tagNew: 'Novo', tagChanged: 'Alterado', untranslatedTag: 'ainda não traduzido',
  contents: 'Índice', bookmarks: 'Marcadores', recent: 'Lido recentemente', faqLink: 'Perguntas frequentes', glossHint: 'Os termos sublinhados são explicados ao clicar ou passar o rato.',
  toc: 'Índice', language: 'Idioma', translatedCount: '{n} traduzido(s)', search: 'Pesquisar no manual', searchPlaceholder: 'p. ex. imprimir guia de remessa', clearSearch: 'Limpar pesquisa', searchResults: 'Resultados da pesquisa',
  found: '{n} capítulos encontrados', notFound: 'Nada encontrado para «{q}» – tente outra palavra',
  hits: '{n} ocorrências de «{q}» realçadas.', noHits: '«{q}» não ocorre neste capítulo.', removeMark: 'Remover realce',
  chooseChapter: 'Escolha um capítulo no «Índice».', chapter: 'Capítulo', draft: 'Rascunho', draftBanner: 'Rascunho – ainda não aprovado',
  printSeeAlso: 'Ver também:', chapterN: 'Capítulo {n}', faqTitle: 'Perguntas frequentes', glossary: 'Glossário',
  continueWith: 'Continue com', draftWatermark: 'RASCUNHO',
  printMissing: '(ainda não traduzido – versão alemã)', printOutdated: '(tradução desatualizada – versão alemã)', draftSuffix: ' (rascunho)',
  manual: 'Manual do utilizador', workingState: 'Versão de trabalho', version: 'Versão {v}', forRole: 'para {role}', asOf: 'Data', chapters: 'Capítulos', published: 'Publicado',
  notice: 'Nota', includesDrafts: 'contém rascunhos não aprovados', cover: 'Capa', printToc: 'Índice do manual', pageOf: 'Página {page} de {pages}', quote: '«{x}»',
  faqFilter: 'Filtrar perguntas', faqPlaceholder: 'p. ex. palavra-passe', faqEmpty: 'Ainda não há perguntas publicadas.', faqPartly: 'Algumas perguntas ainda não foram traduzidas e aparecem em alemão.',
  requestReason: 'Para que precisa da tradução? (opcional)', requestReasonPlaceholder: 'p. ex. para os novos colegas do armazém', sendRequest: 'Enviar pedido',
};

const TEXTS: Record<string, Texts> = { de, en, fr, es, it, nl, pl, cs, pt };
/** Sprachname in der Sprache selbst, wie er in einer Auswahlliste steht (großgeschrieben: „Français“, „Čeština“) */
export const NATIVE_NAMES: Record<string, string> = {
  de: 'Deutsch', en: 'English', fr: 'Français', es: 'Español', it: 'Italiano', nl: 'Nederlands', pl: 'Polski', cs: 'Čeština', pt: 'Português',
};

/**
 * Zielsprache grammatisch im Satz („nicht {into} übersetzt“), je Beschriftungssprache (ADR-127): Präposition und die passende
 * Form des Sprachnamens – „ins Englische“, „into English“, „en anglais“, „al inglés“, „in het Engels“, „na język angielski“,
 * „do angličtiny“. Unbekannte Sprachen: Name aus Intl.DisplayNames mit neutraler Wendung.
 */
const INTO: Record<string, { forms: Record<string, string>; other: (name: string) => string }> = {
  de: { forms: { de: 'ins Deutsche', en: 'ins Englische', fr: 'ins Französische', es: 'ins Spanische', it: 'ins Italienische', nl: 'ins Niederländische', pl: 'ins Polnische', cs: 'ins Tschechische', pt: 'ins Portugiesische' }, other: (n) => `in die Sprache „${n}“` },
  en: { forms: { de: 'into German', en: 'into English', fr: 'into French', es: 'into Spanish', it: 'into Italian', nl: 'into Dutch', pl: 'into Polish', cs: 'into Czech', pt: 'into Portuguese' }, other: (n) => `into ${n}` },
  fr: { forms: { de: 'en allemand', en: 'en anglais', fr: 'en français', es: 'en espagnol', it: 'en italien', nl: 'en néerlandais', pl: 'en polonais', cs: 'en tchèque', pt: 'en portugais' }, other: (n) => `en ${n}` },
  es: { forms: { de: 'al alemán', en: 'al inglés', fr: 'al francés', es: 'al español', it: 'al italiano', nl: 'al neerlandés', pl: 'al polaco', cs: 'al checo', pt: 'al portugués' }, other: (n) => `al ${n}` },
  it: { forms: { de: 'in tedesco', en: 'in inglese', fr: 'in francese', es: 'in spagnolo', it: 'in italiano', nl: 'in olandese', pl: 'in polacco', cs: 'in ceco', pt: 'in portoghese' }, other: (n) => `in ${n}` },
  nl: { forms: { de: 'in het Duits', en: 'in het Engels', fr: 'in het Frans', es: 'in het Spaans', it: 'in het Italiaans', nl: 'in het Nederlands', pl: 'in het Pools', cs: 'in het Tsjechisch', pt: 'in het Portugees' }, other: (n) => `in het ${n}` },
  pl: { forms: { de: 'na język niemiecki', en: 'na język angielski', fr: 'na język francuski', es: 'na język hiszpański', it: 'na język włoski', nl: 'na język niderlandzki', pl: 'na język polski', cs: 'na język czeski', pt: 'na język portugalski' }, other: (n) => `na język ${n}` },
  cs: { forms: { de: 'do němčiny', en: 'do angličtiny', fr: 'do francouzštiny', es: 'do španělštiny', it: 'do italštiny', nl: 'do nizozemštiny', pl: 'do polštiny', cs: 'do češtiny', pt: 'do portugalštiny' }, other: (n) => `do jazyka ${n}` },
  pt: { forms: { de: 'para alemão', en: 'para inglês', fr: 'para francês', es: 'para espanhol', it: 'para italiano', nl: 'para neerlandês', pl: 'para polaco', cs: 'para checo', pt: 'para português' }, other: (n) => `para ${n}` },
};

/** Name einer Sprache in der Beschriftungssprache (Intl), sonst der Code */
function displayName(code: string, ui: string) {
  try {
    return new Intl.DisplayNames([ui], { type: 'language' }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** „ins Englische“ / „into Swedish“: Zielsprache `code` als Satzteil in der Beschriftungssprache `ui` */
export function intoLanguage(code: string, ui: string) {
  const f = INTO[ui] ?? INTO.en;
  if (f.forms[code]) return f.forms[code];
  // Sprache mit Region (fr-ch): Form der Grundsprache mit dem Land – „ins Französische (Schweiz)“
  const [base, region] = code.split('-');
  if (region && f.forms[base]) {
    let land = region.toUpperCase();
    try {
      land = new Intl.DisplayNames([INTO[ui] ? ui : 'en'], { type: 'region' }).of(land) ?? land;
    } catch {
      /* Kürzel genügt */
    }
    return `${f.forms[base]} (${land})`;
  }
  return f.other(displayName(code, INTO[ui] ? ui : 'en'));
}

/** Sprachname für Auswahllisten und Deckblatt: Eigenbezeichnung (großgeschrieben), für weitere Sprachen über Intl */
export function languageLabel(code: string) {
  const n = NATIVE_NAMES[code] ?? displayName(code, code);
  return n === code ? code : n.charAt(0).toLocaleUpperCase(code) + n.slice(1);
}
const LOCALES: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR', es: 'es-ES', it: 'it-IT', nl: 'nl-NL', pl: 'pl-PL', cs: 'cs-CZ', pt: 'pt-PT' };

/** Texte einer Sprache: vollständig übersetzte Sprachen direkt, übrige Englisch, Deutsch als Standard */
export function readerTexts(lang: string) {
  // Sprache mit Region (de-ch, fr-ch – Etappe 48): Beschriftungen der Grundsprache, in der Schweiz ohne „ß“
  const [base, region] = lang.split('-');
  const texts = TEXTS[lang] ?? TEXTS[base] ?? en;
  const swiss = base === 'de' && region === 'ch';
  const t = (key: ReaderTextKey, vars: Record<string, string | number> = {}) => {
    const out = texts[key].replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
    return swiss ? out.replace(/ß/g, 'ss') : out;
  };
  /** Sprache der Beschriftungen (für das lang-Attribut) */
  const uiLang = TEXTS[lang] ? lang : TEXTS[base] ? base : 'en';
  /** Zielsprache als Satzteil in der Beschriftungssprache („ins Englische“) */
  const into = (code: string) => intoLanguage(code, uiLang);
  const locale = LOCALES[lang] ?? (region && LOCALES[base] ? `${base}-${region.toUpperCase()}` : LOCALES[base] ?? 'de-DE');
  return { t, into, lang, uiLang, locale, date: (d: string | number | Date) => new Date(d).toLocaleDateString(locale) };
}
export type ReaderTexts = ReturnType<typeof readerTexts>;

const ReaderTextContext = createContext<ReaderTexts>(readerTexts('de'));
export const useReaderText = () => useContext(ReaderTextContext);
export function ReaderTextProvider({ lang, children }: { lang: string; children: ReactNode }) {
  const value = useMemo(() => readerTexts(lang), [lang]);
  return createElement(ReaderTextContext.Provider, { value }, children);
}
