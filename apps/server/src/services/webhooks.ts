// Ausgehende Webhooks (ADR-028): Abos je Projekt, HMAC-signierte Zustellung über die Jobqueue mit Wiederholung.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { audit, WEBHOOK_EVENTS, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { badRequest, notFound } from '../problem.js';

export const SIGNATURE_HEADER = 'x-onescm-signature';

/** Signatur: HMAC-SHA256 über `<Zeitstempel>.<Rumpf>` – schützt vor Veränderung und Wiedereinspielung */
export function sign(secret: string, timestamp: string, body: string) {
  return `sha256=${createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')}`;
}

export function verifySignature(secret: string, timestamp: string, body: string, signature: string, toleranceSec = 300) {
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > toleranceSec) return false;
  const expected = Buffer.from(sign(secret, timestamp, body));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

const PRIVATE_V4 = [/^10\./, /^127\./, /^169\.254\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./, /^0\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./];
const isPrivate = (ip: string) => (isIP(ip) === 4 ? PRIVATE_V4.some((r) => r.test(ip)) : /^(::1|fc|fd|fe80|::ffff:(10|127|192\.168|169\.254)\.)/i.test(ip) || ip === '::');

/** Ziel-URL prüfen: https, keine Zugangsdaten, kein internes Netz (SSRF) – außer INTEGRATIONS_ALLOW_INSECURE (Tests, abgeschottete Netze) */
export async function assertSafeUrl(raw: string, allowInsecure: boolean, resolve = true) {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw badRequest('Ungültige URL.');
  }
  if (url.protocol !== 'https:' && !(allowInsecure && url.protocol === 'http:')) throw badRequest('Nur https-URLs sind erlaubt.');
  if (url.username || url.password) throw badRequest('Die URL darf keine Zugangsdaten enthalten.');
  if (allowInsecure || !resolve) return url;
  const host = url.hostname.replace(/^\[|\]$/g, '');
  const addresses = isIP(host) ? [host] : (await lookup(host, { all: true }).catch(() => [])).map((a) => a.address);
  if (!addresses.length) throw badRequest(`Host ${host} ist nicht auflösbar.`);
  if (addresses.some(isPrivate)) throw badRequest('Ziele im internen Netz sind nicht erlaubt.');
  return url;
}

function subDto(r: Row, deliveries?: Row[]) {
  return {
    id: r.id, url: r.url, events: parseJson<string[]>(r.events, []), active: !!r.active, description: r.description ?? null,
    createdBy: r.created_by, createdAt: r.created_at,
    ...(deliveries ? { recent: deliveries.map(deliveryDto) } : {}),
  };
}
function deliveryDto(d: Row) {
  return { id: d.id, event: d.event, status: d.status, attempts: d.attempts, responseCode: d.response_code ?? null, error: d.error ?? null, createdAt: d.created_at, deliveredAt: d.delivered_at ?? null };
}

function validEvents(events: unknown) {
  const list = Array.isArray(events) ? [...new Set(events.map(String))] : [];
  if (!list.length) throw badRequest(`Mindestens ein Ereignis angeben (${WEBHOOK_EVENTS.join(', ')} oder *).`);
  const unknown = list.filter((e) => e !== '*' && !(WEBHOOK_EVENTS as readonly string[]).includes(e));
  if (unknown.length) throw badRequest(`Unbekannte Ereignisse: ${unknown.join(', ')}.`);
  return list;
}

export async function listWebhooks(ctx: Ctx) {
  const subs = await ctx.db.all('SELECT * FROM webhook_subscriptions WHERE project_id = ? ORDER BY created_at', ctx.projectId);
  return Promise.all(subs.map(async (s) => subDto(s, await ctx.db.all('SELECT * FROM webhook_deliveries WHERE subscription_id = ? ORDER BY created_at DESC LIMIT 5', s.id))));
}

export async function createWebhook(ctx: Ctx, input: { url?: string; events?: string[]; description?: string }, user: User) {
  const url = String(input.url ?? '').trim();
  await assertSafeUrl(url, ctx.config.integrations.allowInsecure);
  const events = validEvents(input.events);
  const id = newId('wh');
  const secret = `whsec_${randomBytes(24).toString('base64url')}`;
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'INSERT INTO webhook_subscriptions (id, project_id, url, events, secret, active, description, created_by, created_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)',
      id, ctx.projectId, url, json(events), secret, input.description?.trim().slice(0, 200) || null, user.id, now(),
    );
    await audit(ctx, user.id, 'webhook.created', 'webhook', id, { url, events });
  });
  // Geheimnis nur in dieser Antwort
  return { ...subDto((await ctx.db.get('SELECT * FROM webhook_subscriptions WHERE id = ?', id))!, []), secret };
}

export async function updateWebhook(ctx: Ctx, id: string, input: { url?: string; events?: string[]; active?: boolean; description?: string }, user: User) {
  const r = await ctx.db.get('SELECT * FROM webhook_subscriptions WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Webhook ${id}`);
  const url = input.url !== undefined ? String(input.url).trim() : r.url;
  if (input.url !== undefined) await assertSafeUrl(url, ctx.config.integrations.allowInsecure);
  const events = input.events !== undefined ? validEvents(input.events) : parseJson<string[]>(r.events, []);
  const active = input.active !== undefined ? (input.active ? 1 : 0) : r.active;
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE webhook_subscriptions SET url = ?, events = ?, active = ?, description = ? WHERE id = ?', url, json(events), active,
      input.description !== undefined ? input.description.trim().slice(0, 200) || null : r.description, id);
    await audit(ctx, user.id, 'webhook.updated', 'webhook', id, { url, events, active: !!active });
  });
  return subDto((await ctx.db.get('SELECT * FROM webhook_subscriptions WHERE id = ?', id))!);
}

export async function deleteWebhook(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get('SELECT id FROM webhook_subscriptions WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Webhook ${id}`);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM webhook_deliveries WHERE subscription_id = ?', id);
    await ctx.db.run('DELETE FROM webhook_subscriptions WHERE id = ?', id);
    await audit(ctx, user.id, 'webhook.deleted', 'webhook', id, {});
  });
}

export async function listDeliveries(ctx: Ctx, subscriptionId: string) {
  return (await ctx.db.all('SELECT * FROM webhook_deliveries WHERE subscription_id = ? ORDER BY created_at DESC LIMIT 100', subscriptionId)).map(deliveryDto);
}

/** Testereignis „ping“ an ein Abo */
export async function pingWebhook(ctx: Ctx, subscriptionId: string, user: User) {
  const sub = await ctx.db.get('SELECT id FROM webhook_subscriptions WHERE id = ? AND project_id = ?', subscriptionId, ctx.projectId);
  if (!sub) throw notFound(`Webhook ${subscriptionId}`);
  const id = newId('whd');
  const payload = { id, event: 'ping', occurredAt: now(), projectId: ctx.projectId, actor: user.id, entity: { type: 'webhook', id: subscriptionId }, data: {} };
  await ctx.db.tx(async () => {
    await ctx.db.run("INSERT INTO webhook_deliveries (id, subscription_id, event, payload, status, created_at) VALUES (?, ?, 'ping', ?, 'pending', ?)", id, subscriptionId, json(payload), now());
    await ctx.jobs.enqueue('webhook-deliver', { deliveryId: id }, 1);
  });
  ctx.jobs.wake();
  return deliveryDto((await ctx.db.get('SELECT * FROM webhook_deliveries WHERE id = ?', id))!);
}

/** Zustellung erneut anstoßen (z. B. nach Behebung beim Empfänger) */
export async function redeliver(ctx: Ctx, deliveryId: string) {
  const d = await ctx.db.get('SELECT d.* FROM webhook_deliveries d JOIN webhook_subscriptions s ON s.id = d.subscription_id WHERE d.id = ? AND s.project_id = ?', deliveryId, ctx.projectId);
  if (!d) throw notFound(`Zustellung ${deliveryId}`);
  await ctx.db.tx(async () => {
    await ctx.db.run("UPDATE webhook_deliveries SET status = 'pending', error = NULL WHERE id = ?", deliveryId);
    await ctx.jobs.enqueue('webhook-deliver', { deliveryId }, 5);
  });
  ctx.jobs.wake();
  return deliveryDto((await ctx.db.get('SELECT * FROM webhook_deliveries WHERE id = ?', deliveryId))!);
}

/** Job `webhook-deliver`: POST mit Signatur; Fehler lösen die Wiederholung der Jobqueue aus */
export async function deliverWebhook(ctx: Ctx, payload: { deliveryId: string }) {
  const d = await ctx.db.get(
    'SELECT d.*, s.url, s.secret, s.active FROM webhook_deliveries d JOIN webhook_subscriptions s ON s.id = d.subscription_id WHERE d.id = ?', payload.deliveryId,
  );
  if (!d || d.status === 'delivered') return;
  if (!d.active) {
    await ctx.db.run("UPDATE webhook_deliveries SET status = 'failed', error = 'Abo deaktiviert' WHERE id = ?", d.id);
    return;
  }
  const body = d.payload as string;
  const timestamp = String(Math.floor(Date.now() / 1000));
  await ctx.db.run('UPDATE webhook_deliveries SET attempts = attempts + 1 WHERE id = ?', d.id);
  let code: number | null = null;
  try {
    await assertSafeUrl(d.url, ctx.config.integrations.allowInsecure);
    const res = await fetch(d.url, {
      method: 'POST',
      redirect: 'manual', // keine Weiterleitung ins interne Netz
      signal: AbortSignal.timeout(10_000),
      headers: {
        'content-type': 'application/json', 'user-agent': 'oneSCM-Handbook-Studio-Webhook/1',
        'x-onescm-event': d.event, 'x-onescm-delivery': d.id, 'x-onescm-timestamp': timestamp, [SIGNATURE_HEADER]: sign(d.secret, timestamp, body),
      },
      body,
    });
    code = res.status;
    if (res.status < 200 || res.status >= 300) throw new Error(`Empfänger antwortete mit ${res.status}`);
    await ctx.db.run("UPDATE webhook_deliveries SET status = 'delivered', response_code = ?, error = NULL, delivered_at = ? WHERE id = ?", code, now(), d.id);
  } catch (e) {
    await ctx.db.run('UPDATE webhook_deliveries SET response_code = ?, error = ? WHERE id = ?', code, (e as Error).message.slice(0, 500), d.id);
    throw e;
  }
}

export async function failWebhookDelivery(ctx: Ctx, payload: { deliveryId: string }, error: string) {
  await ctx.db.run("UPDATE webhook_deliveries SET status = 'failed', error = ? WHERE id = ?", error.slice(0, 500), payload.deliveryId);
}
