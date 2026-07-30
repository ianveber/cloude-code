/* =====================================================================
   Arhiv Heva — live data layer (Supabase)

   Builds the SAME shape the offline prototype used (`HEVA`), but every
   row comes from Postgres through RLS. Swapping data.js -> live.js is
   the only change the pages needed.

   Security note: the publishable key below is meant to be public. It
   grants nothing on its own — every table denies by default and the
   policies key off the signed-in user. Verified: with this key and no
   session, /rest/v1/buildings returns [].
   The secret key (which DOES bypass RLS) is server-side only and is
   deliberately not referenced anywhere in this folder.
   ===================================================================== */

const SUPABASE_URL  = 'https://cdmllcscbfrmkvhzidam.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_NOy76x2cv9VA2n3iOUMyTA_UisxqFuy';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const slugifyLive = s => s.toLowerCase()
  .replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const siDate = iso => {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
};

/* Redirect to the login screen unless there is a session. */
async function requireSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { location.replace('index.html'); return null; }
  return session;
}

/* Pull everything this user is allowed to see and fold it into HEVA. */
async function loadHeva() {
  const session = await requireSession();
  if (!session) return null;

  const [{ data: profile }, { data: buildings, error: bErr },
         { data: folders }, { data: documents }] = await Promise.all([
    sb.from('profiles').select('*').eq('id', session.user.id).single(),
    sb.from('buildings').select('*').eq('archived', false).order('name'),
    sb.from('folders').select('*').order('name'),
    sb.from('documents').select('*').order('created_at', { ascending: false })
  ]);
  if (bErr) throw bErr;

  const isManager = profile?.role === 'manager';
  const name = profile?.full_name || session.user.email;

  const foldersBy = new Map();
  (folders || []).forEach(f => {
    if (!foldersBy.has(f.building_id)) foldersBy.set(f.building_id, []);
    foldersBy.get(f.building_id).push(f);
  });
  const docsBy = new Map();
  (documents || []).forEach(d => {
    const k = d.folder_id || ('_' + d.building_id);
    if (!docsBy.has(k)) docsBy.set(k, []);
    docsBy.get(k).push(d);
  });

  const objekti = (buildings || []).map(b => {
    const fs = (foldersBy.get(b.id) || []).map(f => {
      const files = (docsBy.get(f.id) || []).map(d => ({
        id: d.id,
        name: d.name,
        mb: +(d.size_bytes / 1024 / 1024).toFixed(2),
        date: siDate(d.created_at),
        type: (d.name.split('.').pop() || 'pdf').toLowerCase(),
        storage_path: d.storage_path
      }));
      return {
        id: f.id,
        name: f.name,
        mb: +files.reduce((a, x) => a + x.mb, 0).toFixed(2),
        date: files[0]?.date || '—',
        files
      };
    });
    const newest = fs.flatMap(f => f.files)
      .map(f => f.date).filter(d => d !== '—')[0] || null;
    return {
      id: b.id,
      slug: b.slug || slugifyLive(b.name),
      name: b.name,
      kind: b.kind,
      updated: newest,
      folders: fs
    };
  });

  const HEVA = {
    user: {
      name,
      initials: name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join(''),
      email: session.user.email,
      role: isManager ? 'Upravitelj' : 'Stanovalec',
      isManager
    },
    storage: { usedMiB: 163.74, totalMiB: 5243 },
    objekti,
    uporabniki: [],
    dnevnik: [],
    bySlug: slug => HEVA.objekti.find(o => o.slug === slug)
  };

  // Managers additionally see the people list and the audit trail.
  // RLS returns nothing here for residents, so this is safe to always try.
  if (isManager) {
    const [{ data: profiles }, { data: memberships }, { data: log }] = await Promise.all([
      sb.from('profiles').select('*').order('role'),
      sb.from('memberships').select('*'),
      sb.from('access_log').select('*').order('created_at', { ascending: false }).limit(50)
    ]);
    const byId = new Map(objekti.map(o => [o.id, o.name]));
    const memBy = new Map();
    (memberships || []).forEach(m => {
      if (!memBy.has(m.user_id)) memBy.set(m.user_id, []);
      memBy.get(m.user_id).push(byId.get(m.building_id) || '—');
    });
    HEVA.uporabniki = (profiles || []).map(p => ({
      name: p.full_name || p.email,
      email: p.email,
      role: p.role,
      objekti: p.role === 'manager'
        ? `vsi (${objekti.length})`
        : (memBy.get(p.id) || []).join(', ') || '—'
    }));
    const pById = new Map((profiles || []).map(p => [p.id, p.full_name || p.email]));
    HEVA.dnevnik = (log || []).map(l => ({
      who: pById.get(l.user_id) || '—',
      what: (documents || []).find(d => d.id === l.document_id)?.name || '—',
      obj: byId.get(l.building_id) || '—',
      act: l.action === 'download' ? 'prenos' : 'ogled',
      when: new Date(l.created_at).toLocaleString('sl-SI')
    }));
  }

  window.HEVA = HEVA;
  return HEVA;
}

/* Record a view/download. Append-only; RLS refuses forged rows. */
async function logAccess(doc, building, action) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return;
  await sb.from('access_log').insert({
    user_id: session.user.id,
    document_id: doc?.id || null,
    building_id: building?.id || null,
    action
  });
}

/* Ask storage for a short-lived link. Returns null if the file was never
   uploaded — the metadata is seeded but the archive itself still lives
   in Chamilo. */
async function signedUrl(storagePath, seconds = 60) {
  const { data, error } = await sb.storage.from('dokumenti')
    .createSignedUrl(storagePath, seconds);
  return error ? null : data.signedUrl;
}

async function signOut() {
  await sb.auth.signOut();
  location.replace('index.html');
}
