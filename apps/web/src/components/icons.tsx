// Einheitliche Icons (ADR-111): Lucide-SVG statt Emoji – für Screenreader ausgeblendet, Farbe wie der umgebende Text
import {
  BadgeCheckIcon, BookmarkIcon, BriefcaseIcon, Building2Icon, BusIcon, CarIcon, CircleDotIcon, CircleHelpIcon, CompassIcon, FolderTreeIcon,
  LanguagesIcon, LayersIcon, MapIcon, PlugIcon, PuzzleIcon, SearchIcon, StoreIcon, TagIcon, TruckIcon, UsersIcon, VanIcon,
  CaptionsIcon, CircleCheckIcon, CircleXIcon, FileArchiveIcon, FileTextIcon, FileTypeIcon, FileVideoCameraIcon, FolderIcon, GlobeIcon,
  OctagonAlertIcon, PresentationIcon, TicketIcon, TriangleAlertIcon, type LucideIcon, type LucideProps,
} from 'lucide-react';

/** Icon vor einem Text (Schaltfläche, Kennzeichen, Zeile) */
export function Ico({ icon: I, size = 16, ...rest }: { icon: LucideIcon } & LucideProps) {
  return <I className="ico" aria-hidden="true" size={size} {...rest} />;
}

const FORMAT: Record<string, LucideIcon> = {
  markdown: FileTextIcon, html: GlobeIcon, docx: FileTypeIcon, pptx: PresentationIcon, pdf: FileTextIcon, mp4: FileVideoCameraIcon,
  subtitles: CaptionsIcon, jira: TicketIcon, zip: FileArchiveIcon,
};
/** Dateiformat einer Quelle (Markdown, HTML, Word, PowerPoint, PDF, Video, Untertitel, Jira, ZIP) */
export const FormatIcon = ({ format }: { format: string }) => <Ico icon={FORMAT[format] ?? FolderIcon} />;

/** erfüllt / nicht erfüllt */
export const OkMark = ({ ok }: { ok: boolean }) => <Ico icon={ok ? CircleCheckIcon : CircleXIcon} className={`ico ${ok ? 'ok' : 'fail'}`} />;
/** Warnung bzw. Blocker */
export const WarnIcon = () => <Ico icon={TriangleAlertIcon} />;
export const BlockerIcon = () => <Ico icon={OctagonAlertIcon} />;

// Rollen, Sparten und Label-Gruppen (ADR-122): Die Stammdaten tragen den Namen eines Lucide-Icons, die Oberfläche zeichnet es.
const REF: Record<string, LucideIcon> = {
  store: StoreIcon, globe: GlobeIcon, 'badge-check': BadgeCheckIcon, 'building-2': Building2Icon, users: UsersIcon,
  car: CarIcon, van: VanIcon, truck: TruckIcon, bus: BusIcon, layers: LayersIcon, 'circle-help': CircleHelpIcon,
  'folder-tree': FolderTreeIcon, compass: CompassIcon, puzzle: PuzzleIcon, briefcase: BriefcaseIcon, plug: PlugIcon, 'file-text': FileTextIcon,
  tag: TagIcon, bookmark: BookmarkIcon, 'circle-dot': CircleDotIcon, languages: LanguagesIcon, map: MapIcon, search: SearchIcon,
  'triangle-alert': TriangleAlertIcon,
};
/** Icon einer Rolle, Sparte oder Label-Gruppe; unbekannte Namen (z. B. alte Zeichen) zeigen ein neutrales Etikett */
export function RefIcon({ name, size = 14 }: { name?: string | null; size?: number }) {
  return <Ico icon={(name && REF[name]) || TagIcon} size={size} />;
}
