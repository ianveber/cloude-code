/* Vercel entry for the admin API. Everything is in api/_lib/handler.mjs so
   the local dev server can mount the same code. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createAdminHandler } from '../_lib/handler.mjs';
import { collectPages } from '../../build.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const handle = createAdminHandler({ root: ROOT, collectPages });

export default function handler(req, res) {
  return handle(req, res);
}
