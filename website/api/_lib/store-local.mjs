/* Local storage: the files under the website folder. Used by the dev server
   (node build.mjs --serve --admin) and by the smoke test. */

import { readFile, writeFile, mkdir, rm, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export function createLocalStore({ root, onChange }) {
  const abs = (rel) => {
    const p = path.resolve(root, rel);
    if (!p.startsWith(path.resolve(root) + path.sep)) throw new Error(`Pot zunaj projekta: ${rel}`);
    return p;
  };

  return {
    mode: 'local',
    info: () => ({ mode: 'local', root, repo: null, branch: null }),

    async read(rel) {
      try {
        return await readFile(abs(rel), 'utf8');
      } catch (err) {
        if (err.code === 'ENOENT') return null;
        throw err;
      }
    },

    async exists(rel) {
      return existsSync(abs(rel));
    },

    async list(prefix) {
      const dir = abs(prefix);
      if (!existsSync(dir)) return [];
      const out = [];
      const walk = async (d, relBase) => {
        for (const entry of await readdir(d, { withFileTypes: true })) {
          const rel = path.posix.join(relBase, entry.name);
          if (entry.isDirectory()) await walk(path.join(d, entry.name), rel);
          else {
            const s = await stat(path.join(d, entry.name));
            out.push({ path: rel, size: s.size });
          }
        }
      };
      await walk(dir, prefix.replace(/\\/g, '/'));
      return out;
    },

    /** files: [{ path, content, encoding? }] or [{ path, delete: true }] */
    async write(files, message) {
      for (const f of files) {
        const target = abs(f.path);
        if (f.delete) {
          await rm(target, { force: true });
          continue;
        }
        await mkdir(path.dirname(target), { recursive: true });
        const data = Buffer.isBuffer(f.content) ? f.content : f.encoding === 'base64' ? Buffer.from(f.content, 'base64') : f.content;
        await writeFile(target, data);
      }
      if (onChange) await onChange({ message, files: files.map((f) => f.path) });
      return { commit: null, message };
    },

    async lastCommit() {
      return null;
    },
  };
}
