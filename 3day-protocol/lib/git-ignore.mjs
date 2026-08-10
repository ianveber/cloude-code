/**
 * git-ignore.mjs — "would git carry this file?"
 *
 * F2: the secret scan flagged every .env* file except .env.example. But
 * `provision` writes real keys into .env.local by design — that is where a
 * Next.js app keeps them locally, and Vercel holds them as env vars in
 * production. Flagging it meant every correctly-provisioned app failed its own
 * security gate, which trains people to ignore the gate.
 *
 * The right question is not what a file is called. It is whether the file can
 * escape through the repository:
 *
 *   gitignored .env.local  → cannot be committed → not a finding
 *   unignored  .env        → one `git add -A` from a public leak → finding
 *
 * So the rule follows git, and the dangerous case stays dangerous.
 */

import { spawnSync } from 'node:child_process';

/**
 * Partition paths by whether git ignores them.
 * Fails SAFE: if git cannot answer, nothing is treated as ignored, so the scan
 * still sees every file. An unavailable tool must never silence a check.
 *
 * @param {string} runDir
 * @param {string[]} absPaths
 * @returns {{ignored: Set<string>, gitAvailable: boolean}}
 */
export function partitionIgnored(runDir, absPaths) {
  if (absPaths.length === 0) return { ignored: new Set(), gitAvailable: true };

  const res = spawnSync('git', ['check-ignore', '--stdin'], {
    cwd: runDir,
    input: absPaths.join('\n') + '\n',
    encoding: 'utf8',
  });

  // git check-ignore exits 0 when at least one path is ignored, 1 when none
  // are, and >1 on a real error (including "not a git repository").
  if (res.error || (res.status !== 0 && res.status !== 1)) {
    return { ignored: new Set(), gitAvailable: false };
  }

  const ignored = new Set(
    (res.stdout || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean),
  );
  return { ignored, gitAvailable: true };
}

/** True when git would refuse to track this path. */
export function isIgnored(runDir, absPath) {
  return partitionIgnored(runDir, [absPath]).ignored.has(absPath);
}
