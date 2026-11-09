// Leseransicht (ADR-054): Rückmeldungen der Leserinnen und Leser („War das hilfreich?“) für die Redaktion.
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { Ico } from '../components/icons';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Card, ErrorBox, errorText, useApp, useLoad } from '../components/ui';
import { formatDate } from '../format';

/** Leser-Rückmeldungen für die Redaktion (im Anleitungs-Check) */
export function FeedbackCard({ canEdit }: { canEdit: boolean }) {
  const { notify } = useApp();
  const fb = useLoad<any[]>('/feedback?status=open');
  const items = (fb.data ?? []).filter((f) => !f.helpful || f.comment);
  return (
    <Card title={`Rückmeldungen von Leserinnen und Lesern (${items.length} offen)`}>
      <ErrorBox error={fb.error} />
      {fb.data && !items.length ? <p className="small">Keine offenen Rückmeldungen. Leser antworten in der <Link to="/lesen">Leseransicht</Link> auf „War dieses Kapitel hilfreich?“.</p> : (
        <ul className="plain feedback-list">
          {items.map((f) => (
            <li key={f.id}>
              <Ico icon={f.helpful ? ThumbsUpIcon : ThumbsDownIcon} /> <span className="sr-only">{f.helpful ? 'hilfreich' : 'nicht hilfreich'}:</span>
              <Link to={`/lesen/${f.chapterId}`}><strong>{f.title ?? f.chapterId}</strong></Link>
              {f.comment && <> – „{f.comment}“</>}
              <span className="small muted"> · {f.createdBy}, {formatDate(f.createdAt)}</span>
              {canEdit && <DoneButton id={f.id} title={f.title ?? f.chapterId} onDone={() => { notify('Als erledigt markiert.'); fb.reload(); }} />}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function DoneButton({ id, title, onDone }: { id: string; title: string; onDone: () => void }) {
  const { notify } = useApp();
  return (
    <button className="btn small" aria-label={`Rückmeldung zu ${title} erledigt`} onClick={async () => {
      try {
        await api('PATCH', `/feedback/${id}`, { status: 'done' });
        onDone();
      } catch (e) {
        notify(errorText(e), 'error');
      }
    }}>Erledigt</button>
  );
}
