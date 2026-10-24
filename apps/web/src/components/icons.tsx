// Einheitliche Icons (ADR-111): Lucide-SVG statt Emoji – für Screenreader ausgeblendet, Farbe wie der umgebende Text
import {
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
