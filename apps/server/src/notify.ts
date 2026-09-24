// Benachrichtigungskanäle (ADR-019): In-App immer; zusätzlich Webhook (z. B. Teams/Slack/Mattermost-kompatibel)
// und E-Mail per SMTP, wenn konfiguriert. Zustellung asynchron über die Jobqueue (Wiederholung bei Fehlern).
import nodemailer, { type Transporter } from 'nodemailer';

export interface NotifyConfig {
  webhookUrl: string | null;
  /** SMTP-URL (smtp://user:pass@host:587); `json` = keine Zustellung, nur Protokoll (Test/Entwicklung) */
  smtpUrl: string | null;
  mailFrom: string;
  /** Basis-URL der Web-UI für Links in Nachrichten */
  appUrl: string | null;
}

export function notifyFromEnv(): NotifyConfig {
  return {
    webhookUrl: process.env.NOTIFY_WEBHOOK_URL || null,
    smtpUrl: process.env.SMTP_URL || null,
    mailFrom: process.env.MAIL_FROM || 'oneSCM Handbook Studio <noreply@example.com>',
    appUrl: process.env.APP_URL || null,
  };
}

export interface OutgoingMessage {
  to?: string | null;
  subject: string;
  text: string;
  link: string | null;
  type: string;
  projectId: string;
  userId: string;
}

export class Notifier {
  private transport: Transporter | null = null;
  /** im Modus `json` versendete E-Mails (für Tests und Entwicklung) */
  readonly sentMails: { to: string; subject: string; text: string }[] = [];

  constructor(readonly cfg: NotifyConfig) {
    if (cfg.smtpUrl) this.transport = cfg.smtpUrl === 'json' ? nodemailer.createTransport({ jsonTransport: true }) : nodemailer.createTransport(cfg.smtpUrl);
  }

  get channels() {
    return { webhook: !!this.cfg.webhookUrl, email: !!this.transport };
  }

  private absolute(link: string | null) {
    return link && this.cfg.appUrl ? `${this.cfg.appUrl.replace(/\/+$/, '')}${link}` : link;
  }

  async webhook(m: OutgoingMessage) {
    if (!this.cfg.webhookUrl) return false;
    const url = this.absolute(m.link);
    const res = await fetch(this.cfg.webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // `text` wird von gängigen Chat-Webhooks direkt angezeigt; die übrigen Felder für eigene Auswertungen
      body: JSON.stringify({ text: url ? `${m.text}\n${url}` : m.text, type: m.type, projectId: m.projectId, userId: m.userId, link: url }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook antwortete mit HTTP ${res.status}`);
    return true;
  }

  async email(m: OutgoingMessage) {
    if (!this.transport || !m.to) return false;
    const url = this.absolute(m.link);
    const text = `${m.text}${url ? `\n\n${url}` : ''}\n\n– oneSCM Handbook Studio`;
    // Kopfzeilen nur aus festen Werten; Betreff ohne Zeilenumbrüche (keine Header-Injektion)
    const subject = m.subject.replace(/[\r\n]+/g, ' ').slice(0, 200);
    await this.transport.sendMail({ from: this.cfg.mailFrom, to: m.to, subject, text, disableFileAccess: true, disableUrlAccess: true });
    if (this.cfg.smtpUrl === 'json') this.sentMails.push({ to: m.to, subject, text });
    return true;
  }
}
