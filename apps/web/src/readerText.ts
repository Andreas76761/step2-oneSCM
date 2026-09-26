// Beschriftungen der Leseransicht und des Drucks in der Lesesprache (ADR-074): was Leserinnen und Leser sehen, folgt der
// gewählten Sprache; Bedienelemente der Redaktion (Verweise bearbeiten, Entwürfe einblenden) bleiben deutsch.
// Deutsch, Englisch, Französisch, Spanisch, Italienisch vollständig; übrige Projektsprachen lesen die englischen Texte.
import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react';

const de = {
  tip: 'Tipp', warning: 'Achtung', note: 'Hinweis',
  stepsDone: '{done} von {total} Schritten erledigt',
  fbQuestion: 'War dieses Kapitel hilfreich?', yes: 'Ja', no: 'Nein', fbMissing: 'Was hat gefehlt oder war unklar? (optional)',
  fbPlaceholder: 'z. B. Schritt 3 passt nicht zur aktuellen Maske', fbSend: 'Rückmeldung senden', fbThanks: 'Danke für Ihre Rückmeldung', fbThanksNo: ' – die Redaktion kümmert sich darum',
  seeAlso: 'Siehe auch', faqRelated: 'Häufige Fragen dazu', allFaq: 'Alle häufigen Fragen',
  langMissing: 'Dieses Kapitel ist noch nicht in {lang} übersetzt – Sie lesen die deutsche Fassung.',
  langOutdated: 'Die {lang}-Übersetzung gehört zu einer älteren Fassung – Sie lesen die aktuelle deutsche Fassung.',
  untranslatedOne: '1 Absatz ist noch nicht übersetzt und erscheint deutsch.', untranslatedMany: '{n} Absätze sind noch nicht übersetzt und erscheinen deutsch.',
  requestTranslation: 'Übersetzung anfordern', requested: '✓ Übersetzung angefordert – die Redaktion ist informiert.',
  bookmark: '☆ Merken', bookmarked: '★ Gemerkt', addNote: '📝 Notiz hinzufügen', editNote: 'Notiz bearbeiten', noteLabel: 'Ihre Notiz zu diesem Kapitel',
  notePlaceholder: 'z. B. für die Inventur im Dezember', save: 'Speichern', cancel: 'Abbrechen', deleteNote: 'Notiz löschen', noteSaved: 'Notiz gespeichert.', noteDeleted: 'Notiz gelöscht.',
  noteHint: 'Nur für Sie sichtbar; das Kapitel wird dabei gemerkt.', allBookmarks: 'Alle Lesezeichen und Notizen',
  newChapter: 'Dieses Kapitel ist neu für Sie.', changedChapter: 'Dieses Kapitel wurde seit Ihrem letzten Lesen geändert.',
  otherOne: '1 weiteres Kapitel ist neu für Sie oder wurde seit Ihrem letzten Lesen geändert – im Inhalt markiert.',
  otherMany: '{n} weitere Kapitel sind neu für Sie oder wurden seit Ihrem letzten Lesen geändert – im Inhalt markiert.',
  tagNew: 'Neu', tagChanged: 'Geändert', untranslatedTag: 'noch nicht übersetzt',
  contents: 'Inhalt', bookmarks: '★ Lesezeichen', recent: 'Zuletzt gelesen', faqLink: '❓ Häufige Fragen', glossHint: 'Unterstrichene Begriffe erklären sich per Klick oder Maus.',
  toc: 'Inhaltsverzeichnis', language: 'Sprache', translatedCount: '{n} übersetzt', search: 'Im Handbuch suchen', searchPlaceholder: 'z. B. Lieferschein drucken', clearSearch: 'Suche leeren', searchResults: 'Suchergebnisse',
  found: '{n} Kapitel gefunden', notFound: 'Nichts gefunden zu „{q}“ – anderes Wort versuchen',
  hits: '{n} Treffer für „{q}“ markiert.', noHits: '„{q}“ kommt in diesem Kapitel nicht vor.', removeMark: 'Markierung entfernen',
  chooseChapter: 'Wählen Sie links ein Kapitel.', chapter: 'Kapitel', draft: 'Entwurf', draftBanner: 'Entwurf – noch nicht freigegeben',
  printSeeAlso: 'Siehe auch:', chapterN: 'Kapitel {n}', faqTitle: 'Häufige Fragen', glossary: 'Glossar',
  printMissing: '(noch nicht übersetzt – deutsche Fassung)', printOutdated: '(Übersetzung veraltet – deutsche Fassung)', draftSuffix: ' (Entwurf)',
  manual: 'Benutzerhandbuch', workingState: 'Arbeitsstand', version: 'Version {v}', forRole: 'für {role}', asOf: 'Stand', chapters: 'Kapitel', published: 'Veröffentlicht',
  notice: 'Hinweis', includesDrafts: 'enthält nicht freigegebene Entwürfe', cover: 'Deckblatt', printToc: 'Inhaltsverzeichnis des Handbuchs', pageOf: 'Seite {page} von {pages}', quote: '„{x}“',
};
export type ReaderTextKey = keyof typeof de;
type Texts = Record<ReaderTextKey, string>;

const en: Texts = {
  tip: 'Tip', warning: 'Caution', note: 'Note',
  stepsDone: '{done} of {total} steps done',
  fbQuestion: 'Was this chapter helpful?', yes: 'Yes', no: 'No', fbMissing: 'What was missing or unclear? (optional)',
  fbPlaceholder: 'e.g. step 3 does not match the current screen', fbSend: 'Send feedback', fbThanks: 'Thank you for your feedback', fbThanksNo: ' – the editorial team will look into it',
  seeAlso: 'See also', faqRelated: 'Related questions', allFaq: 'All frequently asked questions',
  langMissing: 'This chapter has not been translated into {lang} yet – you are reading the German version.',
  langOutdated: 'The {lang} translation belongs to an older version – you are reading the current German version.',
  untranslatedOne: '1 paragraph has not been translated yet and appears in German.', untranslatedMany: '{n} paragraphs have not been translated yet and appear in German.',
  requestTranslation: 'Request translation', requested: '✓ Translation requested – the editorial team has been notified.',
  bookmark: '☆ Bookmark', bookmarked: '★ Bookmarked', addNote: '📝 Add note', editNote: 'Edit note', noteLabel: 'Your note on this chapter',
  notePlaceholder: 'e.g. for the stocktaking in December', save: 'Save', cancel: 'Cancel', deleteNote: 'Delete note', noteSaved: 'Note saved.', noteDeleted: 'Note deleted.',
  noteHint: 'Only visible to you; the chapter is bookmarked as well.', allBookmarks: 'All bookmarks and notes',
  newChapter: 'This chapter is new to you.', changedChapter: 'This chapter has changed since you last read it.',
  otherOne: '1 more chapter is new to you or has changed since you last read it – marked in the contents.',
  otherMany: '{n} more chapters are new to you or have changed since you last read them – marked in the contents.',
  tagNew: 'New', tagChanged: 'Changed', untranslatedTag: 'not translated yet',
  contents: 'Contents', bookmarks: '★ Bookmarks', recent: 'Recently read', faqLink: '❓ Frequently asked questions', glossHint: 'Underlined terms explain themselves on click or hover.',
  toc: 'Table of contents', language: 'Language', translatedCount: '{n} translated', search: 'Search the manual', searchPlaceholder: 'e.g. print delivery note', clearSearch: 'Clear search', searchResults: 'Search results',
  found: '{n} chapters found', notFound: 'Nothing found for “{q}” – try another word',
  hits: '{n} matches for “{q}” highlighted.', noHits: '“{q}” does not occur in this chapter.', removeMark: 'Remove highlighting',
  chooseChapter: 'Choose a chapter on the left.', chapter: 'Chapter', draft: 'Draft', draftBanner: 'Draft – not yet approved',
  printSeeAlso: 'See also:', chapterN: 'Chapter {n}', faqTitle: 'Frequently asked questions', glossary: 'Glossary',
  printMissing: '(not translated yet – German version)', printOutdated: '(translation outdated – German version)', draftSuffix: ' (draft)',
  manual: 'User manual', workingState: 'Working version', version: 'Version {v}', forRole: 'for {role}', asOf: 'As of', chapters: 'Chapters', published: 'Published',
  notice: 'Note', includesDrafts: 'contains drafts that are not yet approved', cover: 'Cover page', printToc: 'Table of contents of the manual', pageOf: 'Page {page} of {pages}', quote: '“{x}”',
};

const fr: Texts = {
  tip: 'Conseil', warning: 'Attention', note: 'Remarque',
  stepsDone: '{done} étapes sur {total} terminées',
  fbQuestion: 'Ce chapitre vous a-t-il été utile ?', yes: 'Oui', no: 'Non', fbMissing: 'Qu’est-ce qui manquait ou n’était pas clair ? (facultatif)',
  fbPlaceholder: 'p. ex. l’étape 3 ne correspond pas à l’écran actuel', fbSend: 'Envoyer le retour', fbThanks: 'Merci pour votre retour', fbThanksNo: ' – la rédaction s’en occupe',
  seeAlso: 'Voir aussi', faqRelated: 'Questions associées', allFaq: 'Toutes les questions fréquentes',
  langMissing: 'Ce chapitre n’est pas encore traduit en {lang} – vous lisez la version allemande.',
  langOutdated: 'La traduction en {lang} correspond à une version antérieure – vous lisez la version allemande actuelle.',
  untranslatedOne: '1 paragraphe n’est pas encore traduit et apparaît en allemand.', untranslatedMany: '{n} paragraphes ne sont pas encore traduits et apparaissent en allemand.',
  requestTranslation: 'Demander une traduction', requested: '✓ Traduction demandée – la rédaction a été informée.',
  bookmark: '☆ Ajouter un signet', bookmarked: '★ Signet ajouté', addNote: '📝 Ajouter une note', editNote: 'Modifier la note', noteLabel: 'Votre note sur ce chapitre',
  notePlaceholder: 'p. ex. pour l’inventaire de décembre', save: 'Enregistrer', cancel: 'Annuler', deleteNote: 'Supprimer la note', noteSaved: 'Note enregistrée.', noteDeleted: 'Note supprimée.',
  noteHint: 'Visible uniquement par vous ; le chapitre est également ajouté aux signets.', allBookmarks: 'Tous les signets et notes',
  newChapter: 'Ce chapitre est nouveau pour vous.', changedChapter: 'Ce chapitre a été modifié depuis votre dernière lecture.',
  otherOne: '1 autre chapitre est nouveau pour vous ou a été modifié depuis votre dernière lecture – signalé dans le sommaire.',
  otherMany: '{n} autres chapitres sont nouveaux pour vous ou ont été modifiés depuis votre dernière lecture – signalés dans le sommaire.',
  tagNew: 'Nouveau', tagChanged: 'Modifié', untranslatedTag: 'pas encore traduit',
  contents: 'Sommaire', bookmarks: '★ Signets', recent: 'Lu récemment', faqLink: '❓ Questions fréquentes', glossHint: 'Les termes soulignés s’expliquent au clic ou au survol.',
  toc: 'Table des matières', language: 'Langue', translatedCount: '{n} traduit(s)', search: 'Rechercher dans le manuel', searchPlaceholder: 'p. ex. imprimer un bon de livraison', clearSearch: 'Effacer la recherche', searchResults: 'Résultats de recherche',
  found: '{n} chapitres trouvés', notFound: 'Aucun résultat pour « {q} » – essayez un autre mot',
  hits: '{n} occurrences de « {q} » surlignées.', noHits: '« {q} » n’apparaît pas dans ce chapitre.', removeMark: 'Retirer le surlignage',
  chooseChapter: 'Choisissez un chapitre à gauche.', chapter: 'Chapitre', draft: 'Brouillon', draftBanner: 'Brouillon – pas encore validé',
  printSeeAlso: 'Voir aussi :', chapterN: 'Chapitre {n}', faqTitle: 'Questions fréquentes', glossary: 'Glossaire',
  printMissing: '(pas encore traduit – version allemande)', printOutdated: '(traduction obsolète – version allemande)', draftSuffix: ' (brouillon)',
  manual: 'Manuel utilisateur', workingState: 'Version de travail', version: 'Version {v}', forRole: 'pour {role}', asOf: 'État au', chapters: 'Chapitres', published: 'Publié le',
  notice: 'Remarque', includesDrafts: 'contient des brouillons non validés', cover: 'Page de garde', printToc: 'Table des matières du manuel', pageOf: 'Page {page} sur {pages}', quote: '« {x} »',
};

const es: Texts = {
  tip: 'Consejo', warning: 'Atención', note: 'Nota',
  stepsDone: '{done} de {total} pasos completados',
  fbQuestion: '¿Le ha resultado útil este capítulo?', yes: 'Sí', no: 'No', fbMissing: '¿Qué faltaba o no estaba claro? (opcional)',
  fbPlaceholder: 'p. ej. el paso 3 no coincide con la pantalla actual', fbSend: 'Enviar opinión', fbThanks: 'Gracias por su opinión', fbThanksNo: ': el equipo de redacción se ocupará de ello',
  seeAlso: 'Véase también', faqRelated: 'Preguntas relacionadas', allFaq: 'Todas las preguntas frecuentes',
  langMissing: 'Este capítulo aún no está traducido al {lang}: está leyendo la versión alemana.',
  langOutdated: 'La traducción al {lang} corresponde a una versión anterior: está leyendo la versión alemana actual.',
  untranslatedOne: '1 párrafo aún no está traducido y aparece en alemán.', untranslatedMany: '{n} párrafos aún no están traducidos y aparecen en alemán.',
  requestTranslation: 'Solicitar traducción', requested: '✓ Traducción solicitada: se ha informado al equipo de redacción.',
  bookmark: '☆ Guardar', bookmarked: '★ Guardado', addNote: '📝 Añadir nota', editNote: 'Editar nota', noteLabel: 'Su nota sobre este capítulo',
  notePlaceholder: 'p. ej. para el inventario de diciembre', save: 'Guardar', cancel: 'Cancelar', deleteNote: 'Eliminar nota', noteSaved: 'Nota guardada.', noteDeleted: 'Nota eliminada.',
  noteHint: 'Solo visible para usted; el capítulo también se guarda.', allBookmarks: 'Todos los marcadores y notas',
  newChapter: 'Este capítulo es nuevo para usted.', changedChapter: 'Este capítulo ha cambiado desde su última lectura.',
  otherOne: 'Otro capítulo es nuevo para usted o ha cambiado desde su última lectura: marcado en el índice.',
  otherMany: 'Otros {n} capítulos son nuevos para usted o han cambiado desde su última lectura: marcados en el índice.',
  tagNew: 'Nuevo', tagChanged: 'Modificado', untranslatedTag: 'aún no traducido',
  contents: 'Índice', bookmarks: '★ Marcadores', recent: 'Leído recientemente', faqLink: '❓ Preguntas frecuentes', glossHint: 'Los términos subrayados se explican al hacer clic o pasar el ratón.',
  toc: 'Índice de contenidos', language: 'Idioma', translatedCount: '{n} traducido(s)', search: 'Buscar en el manual', searchPlaceholder: 'p. ej. imprimir albarán', clearSearch: 'Borrar búsqueda', searchResults: 'Resultados de búsqueda',
  found: '{n} capítulos encontrados', notFound: 'No se encontró nada para «{q}»: pruebe otra palabra',
  hits: '{n} coincidencias de «{q}» resaltadas.', noHits: '«{q}» no aparece en este capítulo.', removeMark: 'Quitar resaltado',
  chooseChapter: 'Elija un capítulo a la izquierda.', chapter: 'Capítulo', draft: 'Borrador', draftBanner: 'Borrador: aún no aprobado',
  printSeeAlso: 'Véase también:', chapterN: 'Capítulo {n}', faqTitle: 'Preguntas frecuentes', glossary: 'Glosario',
  printMissing: '(aún no traducido: versión alemana)', printOutdated: '(traducción desactualizada: versión alemana)', draftSuffix: ' (borrador)',
  manual: 'Manual de usuario', workingState: 'Versión de trabajo', version: 'Versión {v}', forRole: 'para {role}', asOf: 'Fecha', chapters: 'Capítulos', published: 'Publicado',
  notice: 'Nota', includesDrafts: 'contiene borradores no aprobados', cover: 'Portada', printToc: 'Índice del manual', pageOf: 'Página {page} de {pages}', quote: '«{x}»',
};

const it: Texts = {
  tip: 'Suggerimento', warning: 'Attenzione', note: 'Nota',
  stepsDone: '{done} di {total} passi completati',
  fbQuestion: 'Questo capitolo è stato utile?', yes: 'Sì', no: 'No', fbMissing: 'Cosa mancava o non era chiaro? (facoltativo)',
  fbPlaceholder: 'ad es. il passo 3 non corrisponde alla schermata attuale', fbSend: 'Invia riscontro', fbThanks: 'Grazie per il riscontro', fbThanksNo: ': la redazione se ne occuperà',
  seeAlso: 'Vedi anche', faqRelated: 'Domande correlate', allFaq: 'Tutte le domande frequenti',
  langMissing: 'Questo capitolo non è ancora tradotto in {lang}: state leggendo la versione tedesca.',
  langOutdated: 'La traduzione in {lang} si riferisce a una versione precedente: state leggendo la versione tedesca attuale.',
  untranslatedOne: '1 paragrafo non è ancora tradotto e appare in tedesco.', untranslatedMany: '{n} paragrafi non sono ancora tradotti e appaiono in tedesco.',
  requestTranslation: 'Richiedi traduzione', requested: '✓ Traduzione richiesta: la redazione è stata informata.',
  bookmark: '☆ Salva', bookmarked: '★ Salvato', addNote: '📝 Aggiungi nota', editNote: 'Modifica nota', noteLabel: 'La vostra nota su questo capitolo',
  notePlaceholder: 'ad es. per l’inventario di dicembre', save: 'Salva', cancel: 'Annulla', deleteNote: 'Elimina nota', noteSaved: 'Nota salvata.', noteDeleted: 'Nota eliminata.',
  noteHint: 'Visibile solo a voi; il capitolo viene anche salvato.', allBookmarks: 'Tutti i segnalibri e le note',
  newChapter: 'Questo capitolo è nuovo per voi.', changedChapter: 'Questo capitolo è stato modificato dall’ultima lettura.',
  otherOne: '1 altro capitolo è nuovo o è stato modificato dall’ultima lettura: segnalato nell’indice.',
  otherMany: 'Altri {n} capitoli sono nuovi o sono stati modificati dall’ultima lettura: segnalati nell’indice.',
  tagNew: 'Nuovo', tagChanged: 'Modificato', untranslatedTag: 'non ancora tradotto',
  contents: 'Indice', bookmarks: '★ Segnalibri', recent: 'Letti di recente', faqLink: '❓ Domande frequenti', glossHint: 'I termini sottolineati si spiegano con un clic o passandoci sopra.',
  toc: 'Sommario', language: 'Lingua', translatedCount: '{n} tradotto/i', search: 'Cerca nel manuale', searchPlaceholder: 'ad es. stampare bolla di consegna', clearSearch: 'Cancella ricerca', searchResults: 'Risultati della ricerca',
  found: '{n} capitoli trovati', notFound: 'Nessun risultato per «{q}»: provate un’altra parola',
  hits: '{n} occorrenze di «{q}» evidenziate.', noHits: '«{q}» non compare in questo capitolo.', removeMark: 'Rimuovi evidenziazione',
  chooseChapter: 'Scegliete un capitolo a sinistra.', chapter: 'Capitolo', draft: 'Bozza', draftBanner: 'Bozza: non ancora approvata',
  printSeeAlso: 'Vedi anche:', chapterN: 'Capitolo {n}', faqTitle: 'Domande frequenti', glossary: 'Glossario',
  printMissing: '(non ancora tradotto: versione tedesca)', printOutdated: '(traduzione non aggiornata: versione tedesca)', draftSuffix: ' (bozza)',
  manual: 'Manuale utente', workingState: 'Versione di lavoro', version: 'Versione {v}', forRole: 'per {role}', asOf: 'Aggiornato al', chapters: 'Capitoli', published: 'Pubblicato',
  notice: 'Nota', includesDrafts: 'contiene bozze non approvate', cover: 'Copertina', printToc: 'Indice del manuale', pageOf: 'Pagina {page} di {pages}', quote: '«{x}»',
};

const TEXTS: Record<string, Texts> = { de, en, fr, es, it };
/** Sprachname in der Sprache selbst (für Hinweise wie „nicht in English übersetzt“) */
export const NATIVE_NAMES: Record<string, string> = {
  de: 'Deutsch', en: 'English', fr: 'français', es: 'español', it: 'italiano', nl: 'Nederlands', pl: 'polski', cs: 'čeština', pt: 'português',
};
const LOCALES: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR', es: 'es-ES', it: 'it-IT', nl: 'nl-NL', pl: 'pl-PL', cs: 'cs-CZ', pt: 'pt-PT' };

/** Texte einer Sprache: vollständig übersetzte Sprachen direkt, übrige Englisch, Deutsch als Standard */
export function readerTexts(lang: string) {
  const texts = TEXTS[lang] ?? (lang === 'de' ? de : en);
  const t = (key: ReaderTextKey, vars: Record<string, string | number> = {}) =>
    texts[key].replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
  /** Sprache der Beschriftungen (für das lang-Attribut) */
  const uiLang = TEXTS[lang] ? lang : lang === 'de' ? 'de' : 'en';
  return { t, lang, uiLang, locale: LOCALES[lang] ?? 'de-DE', date: (d: string | number | Date) => new Date(d).toLocaleDateString(LOCALES[lang] ?? 'de-DE') };
}
export type ReaderTexts = ReturnType<typeof readerTexts>;

const ReaderTextContext = createContext<ReaderTexts>(readerTexts('de'));
export const useReaderText = () => useContext(ReaderTextContext);
export function ReaderTextProvider({ lang, children }: { lang: string; children: ReactNode }) {
  const value = useMemo(() => readerTexts(lang), [lang]);
  return createElement(ReaderTextContext.Provider, { value }, children);
}
