// Ausgehende Webhooks (ADR-028): Abos je Projekt, HMAC-signierte Zustellung über die Jobqueue mit Wiederholung.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';
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

// Nicht öffentliche Bereiche (RFC 6890 u. a.): privat, Loopback, Link-Local, CGNAT, Benchmark, Multicast, reserviert
const BLOCKED = new BlockList();
for (const [net, prefix] of [['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24],
  ['192.168.0.0', 16], ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4]] as const) BLOCKED.addSubnet(net, prefix, 'ipv4');
for (const [net, prefix] of [['::', 128], ['::1', 128], ['fc00::', 7], ['fe80::', 10], ['fec0::', 10], ['ff00::', 8], ['2001:db8::', 32], ['64:ff9b::', 96], ['100::', 64]] as const) BLOCKED.addSubnet(net, prefix, 'ipv6');

/** IPv4 hinter einer IPv4-abgebildeten bzw. -kompatiblen IPv6-Adresse (::ffff:7f00:1 oder ::ffff:127.0.0.1) */
function embeddedV4(ip: string): string | null {
  const m = /^::(?:ffff:(?:0:)?)?(?:(\d+\.\d+\.\d+\.\d+)|([0-9a-f]{1,4}):([0-9a-f]{1,4}))$/i.exec(ip);
  if (!m) return null;
  if (m[1]) return m[1];
  const hi = parseInt(m[2], 16);
  const lo = parseInt(m[3], 16);
  return `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`;
}

export function isPrivateAddress(ip: string): boolean {
  const family = isIP(ip);
  if (family === 4) return BLOCKED.check(ip, 'ipv4');
  if (family !== 6) return true; // unbekanntes Format: sicherheitshalber sperren
  const v4 = embeddedV4(ip);
  return (v4 !== null && BLOCKED.check(v4, 'ipv4')) || BLOCKED.check(ip, 'ipv6');
}

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
  if (addresses.some(isPrivateAddress)) throw badRequest('Ziele im internen Netz sind nicht erlaubt.');
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
