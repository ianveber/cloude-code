/* GitHub storage: every save is a commit on the branch Vercel deploys, so a
   publish becomes a deploy on its own. Uses the Git Data API so an item, its
   index entry and its pictures land in one commit. Needs GITHUB_TOKEN (a
   fine-grained token with Contents: read and write on the one repository),
   GITHUB_REPO (owner/name), GITHUB_BRANCH and CMS_ROOT (the folder of the
   site inside the repository, "website"). */

export function createGithubStore({ token, repo, branch, subdir = '' }) {
  if (!token || !repo || !branch) throw new Error('GitHub shramba potrebuje GITHUB_TOKEN, GITHUB_REPO in GITHUB_BRANCH.');
  const API = 'https://api.github.com';
  const prefix = subdir ? subdir.replace(/^\/+|\/+$/g, '') + '/' : '';
  const full = (rel) => prefix + rel.replace(/^\/+/, '');

  async function gh(method, url, body, accept = 'application/vnd.github+json') {
    const res = await fetch(`${API}${url}`, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        accept,
        'x-github-api-version': '2022-11-28',
        'user-agent': 'ais-slovenia-admin',
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`GitHub ${method} ${url}: ${res.status} ${text.slice(0, 300)}`);
    }
    if (accept.includes('raw')) return res.text();
    return res.json();
  }

  const ref = () => gh('GET', `/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`);

  return {
    mode: 'github',
    info: () => ({ mode: 'github', repo, branch, root: prefix, url: `https://github.com/${repo}/tree/${branch}/${prefix}` }),

    async read(rel) {
      const text = await gh('GET', `/repos/${repo}/contents/${encodePath(full(rel))}?ref=${encodeURIComponent(branch)}`, null, 'application/vnd.github.raw+json');
      return text;
    },

    async exists(rel) {
      const r = await gh('GET', `/repos/${repo}/contents/${encodePath(full(rel))}?ref=${encodeURIComponent(branch)}`);
      return Boolean(r);
    },

    async list(dirRel) {
      const head = await ref();
      if (!head) throw new Error(`Veja ${branch} ne obstaja.`);
      const tree = await gh('GET', `/repos/${repo}/git/trees/${head.object.sha}?recursive=1`);
      const base = full(dirRel).replace(/\/+$/, '') + '/';
      return (tree?.tree ?? [])
        .filter((e) => e.type === 'blob' && e.path.startsWith(base))
        .map((e) => ({ path: e.path.slice(prefix.length), size: e.size }));
    },

    async write(files, message) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const head = await ref();
        if (!head) throw new Error(`Veja ${branch} ne obstaja.`);
        const parent = head.object.sha;
        const commit = await gh('GET', `/repos/${repo}/git/commits/${parent}`);

        const tree = [];
        for (const f of files) {
          if (f.delete) {
            tree.push({ path: full(f.path), mode: '100644', type: 'blob', sha: null });
            continue;
          }
          const isBinary = Buffer.isBuffer(f.content) || f.encoding === 'base64';
          const blob = await gh('POST', `/repos/${repo}/git/blobs`, {
            content: Buffer.isBuffer(f.content) ? f.content.toString('base64') : f.content,
            encoding: isBinary ? 'base64' : 'utf-8',
          });
          tree.push({ path: full(f.path), mode: '100644', type: 'blob', sha: blob.sha });
        }

        const newTree = await gh('POST', `/repos/${repo}/git/trees`, { base_tree: commit.tree.sha, tree });
        const newCommit = await gh('POST', `/repos/${repo}/git/commits`, {
          message,
          tree: newTree.sha,
          parents: [parent],
          author: { name: 'AIS admin', email: 'admin@ais-slovenia.si', date: new Date().toISOString() },
        });
        try {
          await gh('PATCH', `/repos/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, { sha: newCommit.sha });
        } catch (err) {
          if (attempt === 0 && /422|409/.test(err.message)) continue; /* the branch moved; retry once */
          throw err;
        }
        return { commit: newCommit.sha, url: `https://github.com/${repo}/commit/${newCommit.sha}`, message };
      }
      throw new Error('Shranjevanje ni uspelo: veja se je medtem spremenila.');
    },

    async lastCommit() {
      const head = await ref();
      if (!head) return null;
      const c = await gh('GET', `/repos/${repo}/git/commits/${head.object.sha}`);
      return c ? { sha: c.sha, date: c.author?.date, message: c.message.split('\n')[0], url: c.html_url } : null;
    },
  };
}

const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/');
