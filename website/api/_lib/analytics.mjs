/**
 * First-party page-view counting for IHG. No third party, no IP addresses,
 * no names: a hit is a path, a referrer host, a device class, a country
 * code and a short session id that the visitor's browser holds for half an
 * hour, only after they allow analytics in the cookie banner.
 *
 * Storage: Upstash Redis over REST when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN (or Vercel's KV_REST_API_URL / KV_REST_API_TOKEN)
 * are set; a JSON file under data/ when running locally; otherwise nothing
 * is kept and the dashboard says so.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PREFIX = 'ihg:';
const KEEP_DAYS = 400;

/* Today in Ljubljana, as YYYY-MM-DD. */
export function localDay(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Ljubljana' }).format(date);
}

export function lastDays(n, end = new Date()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(localDay(new Date(end.getTime() - i * 86400000)));
  return out;
}

export function createAnalytics({ root, env = process.env } = {}) {
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  if (url && token) return upstash(url.replace(/\/+$/, ''), token);
  if (root && !env.VERCEL) return local(root);
  return none();
}

/* ── shaping ──────────────────────────────────────────────────────────── */

function emptyDay(date) {
  return { date, views: 0, sessions: 0, pages: {}, refs: {}, devices: {}, countries: {} };
}

function summarize(days) {
  const totals = { views: 0, sessions: 0 };
  const pages = {};
  const refs = {};
  const devices = {};
  const countries = {};
  for (const d of days) {
    totals.views += d.views;
    totals.sessions += d.sessions;
    for (const [k, v] of Object.entries(d.pages)) pages[k] = (pages[k] ?? 0) + v;
    for (const [k, v] of Object.entries(d.refs)) refs[k] = (refs[k] ?? 0) + v;
    for (const [k, v] of Object.entries(d.devices)) devices[k] = (devices[k] ?? 0) + v;
    for (const [k, v] of Object.entries(d.countries)) countries[k] = (countries[k] ?? 0) + v;
  }
  const top = (obj, n = 25) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([key, views]) => ({ key, views }));
  return { totals, pages: top(pages, 50), refs: top(refs), devices, countries: top(countries, 20) };
}

/* ── Upstash ──────────────────────────────────────────────────────────── */

function upstash(url, token) {
  async function pipeline(commands) {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(commands),
    });
    if (!res.ok) throw new Error(`Analitika (Upstash): ${res.status}`);
    const rows = await res.json();
    return rows.map((r) => r.result);
  }

  return {
    mode: 'upstash',
    configured: true,
    async record(hit) {
      const day = `${PREFIX}d:${hit.day}`;
      const cmds = [
        ['HINCRBY', day, 'views', 1],
        ['HINCRBY', day, `p:${hit.path}`, 1],
        ['HINCRBY', day, `dev:${hit.device}`, 1],
        ['EXPIRE', day, KEEP_DAYS * 86400],
      ];
      if (hit.ref) cmds.push(['HINCRBY', day, `r:${hit.ref}`, 1]);
      if (hit.country) cmds.push(['HINCRBY', day, `c:${hit.country}`, 1]);
      if (hit.sid) cmds.push(['PFADD', `${PREFIX}s:${hit.day}`, hit.sid], ['EXPIRE', `${PREFIX}s:${hit.day}`, KEEP_DAYS * 86400]);
      await pipeline(cmds);
    },
    async query(n = 30) {
      const dates = lastDays(n);
      const cmds = dates.flatMap((d) => [
        ['HGETALL', `${PREFIX}d:${d}`],
        ['PFCOUNT', `${PREFIX}s:${d}`],
      ]);
      const rows = await pipeline(cmds);
      const days = dates.map((date, i) => {
        const day = emptyDay(date);
        const flat = rows[i * 2] ?? [];
        for (let j = 0; j < flat.length; j += 2) fold(day, flat[j], Number(flat[j + 1]));
        day.sessions = Number(rows[i * 2 + 1] ?? 0);
        return day;
      });
      return { configured: true, mode: 'upstash', days, ...summarize(days) };
    },
  };
}

function fold(day, field, value) {
  if (field === 'views') day.views = value;
  else if (field.startsWith('p:')) day.pages[field.slice(2)] = value;
  else if (field.startsWith('r:')) day.refs[field.slice(2)] = value;
  else if (field.startsWith('dev:')) day.devices[field.slice(4)] = value;
  else if (field.startsWith('c:')) day.countries[field.slice(2)] = value;
}

/* ── local JSON file ──────────────────────────────────────────────────── */

function local(root) {
  const file = path.join(root, 'data', 'analytics.json');
  let data = null;
  let timer = null;

  async function load() {
    if (data) return data;
    if (existsSync(file)) {
      try {
        data = JSON.parse(await readFile(file, 'utf8'));
      } catch {
        data = null;
      }
    }
    if (!data || typeof data !== 'object' || !data.days) data = { days: {} };
    return data;
  }

  function save() {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, JSON.stringify(data));
    }, 300);
  }

  return {
    mode: 'local',
    configured: true,
    async record(hit) {
      const d = await load();
      const day = (d.days[hit.day] ??= { views: 0, pages: {}, refs: {}, devices: {}, countries: {}, sids: {} });
      day.views += 1;
      day.pages[hit.path] = (day.pages[hit.path] ?? 0) + 1;
      day.devices[hit.device] = (day.devices[hit.device] ?? 0) + 1;
      if (hit.ref) day.refs[hit.ref] = (day.refs[hit.ref] ?? 0) + 1;
      if (hit.country) day.countries[hit.country] = (day.countries[hit.country] ?? 0) + 1;
      if (hit.sid) day.sids[hit.sid] = 1;
      /* keep the file bounded */
      const keys = Object.keys(d.days).sort();
      while (keys.length > KEEP_DAYS) delete d.days[keys.shift()];
      save();
    },
    async query(n = 30) {
      const d = await load();
      const days = lastDays(n).map((date) => {
        const src = d.days[date];
        const day = emptyDay(date);
        if (src) {
          day.views = src.views;
          day.pages = { ...src.pages };
          day.refs = { ...src.refs };
          day.devices = { ...src.devices };
          day.countries = { ...src.countries };
          day.sessions = Object.keys(src.sids ?? {}).length;
        }
        return day;
      });
      return { configured: true, mode: 'local', days, ...summarize(days) };
    },
    async flush() {
      clearTimeout(timer);
      if (data) {
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, JSON.stringify(data));
      }
    },
  };
}

/* ── nothing configured ───────────────────────────────────────────────── */

function none() {
  return {
    mode: 'none',
    configured: false,
    async record() {},
    async query(n = 30) {
      const days = lastDays(n).map(emptyDay);
      return { configured: false, mode: 'none', days, ...summarize(days) };
    },
  };
}

/* ── the hit endpoint (shared by Vercel and the local server) ─────────── */

const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|facebookexternalhit|embedly|quora|outbrain|vkshare|W3C_Validator|puppeteer/i;
const PATH_RE = /^\/[a-z0-9\-._~/]*$/i;
const SID_RE = /^[a-z0-9]{8,32}$/i;
const rate = new Map();

export function createHitHandler({ analytics, secret = process.env.ADMIN_SESSION_SECRET || randomBytes(16).toString('hex') }) {
  /* Without a session id from the browser (the cookieless mode), a visit is a
     code from the day, the address and the browser. It changes every day,
     is never stored on its own and cannot be turned back into an address. */
  const dailyCode = (ip, ua, day) => createHash('sha256').update(`${secret}|${day}|${ip}|${ua}`).digest('hex').slice(0, 16);

  return async function handle(req, res) {
    const done = (status) => {
      res.writeHead(status, { 'cache-control': 'no-store', 'x-robots-tag': 'noindex' });
      res.end();
    };
    if (req.method !== 'POST') return done(405);
    if (BOT_RE.test(String(req.headers['user-agent'] ?? ''))) return done(204);

    /* a few hits a second per address is plenty for a human */
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '').split(',')[0].trim();
    const now = Date.now();
    const r = rate.get(ip) ?? { n: 0, at: now };
    if (now - r.at > 60000) Object.assign(r, { n: 0, at: now });
    r.n += 1;
    rate.set(ip, r);
    if (r.n > 90) return done(204);
    if (rate.size > 5000) rate.clear();

    let body = req.body;
    if (body === undefined || body === null) {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 2048) return done(204);
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks).toString('utf8');
    }
    let hit;
    try {
      hit = typeof body === 'string' ? JSON.parse(body || '{}') : body;
    } catch {
      return done(204);
    }
    const p = String(hit?.p ?? '');
    if (!PATH_RE.test(p) || p.length > 200 || p.startsWith('/admin') || p.startsWith('/api')) return done(204);
    const w = Number(hit?.w) || 0;
    const country = String(req.headers['x-vercel-ip-country'] ?? '').slice(0, 2).toUpperCase() || '';
    let ref = String(hit?.r ?? '')
      .toLowerCase()
      .replace(/^www\./, '')
      .slice(0, 100);
    if (!/^[a-z0-9.-]+$/.test(ref)) ref = '';
    const day = localDay();
    const sid = SID_RE.test(String(hit?.s ?? '')) ? String(hit.s) : dailyCode(ip, String(req.headers['user-agent'] ?? ''), day);

    try {
      await analytics.record({
        day,
        path: p.replace(/\/index\.html$/, '/').replace(/([^/])$/, '$1/'),
        device: w && w < 768 ? 'phone' : w && w < 1100 ? 'tablet' : 'desktop',
        ref,
        country,
        sid,
      });
    } catch (err) {
      console.error('[hit]', err.message);
    }
    return done(204);
  };
}
