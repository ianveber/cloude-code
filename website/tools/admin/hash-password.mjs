#!/usr/bin/env node
/**
 * Makes the two lines the admin needs: a password hash and a session secret.
 *
 *   node tools/admin/hash-password.mjs            (asks for the password, hidden)
 *   node tools/admin/hash-password.mjs "geslo"    (password as the argument)
 *
 * Put the printed lines into website/.env.admin for local use, and into the
 * Vercel project's environment variables for the live site. The password
 * itself is never stored anywhere.
 */

import { randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';
import { hashPassword } from '../../api/_lib/auth.mjs';

async function ask() {
  if (process.argv[2]) return process.argv[2];
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const question = (q) => new Promise((resolve) => rl.question(q, resolve));
  /* hide the typed characters */
  const write = rl._writeToOutput;
  rl._writeToOutput = (str) => {
    if (/geslo/i.test(str)) write.call(rl, str);
  };
  const pw = await question('Geslo za urejanje: ');
  process.stdout.write('\n');
  const again = await question('Še enkrat isto geslo: ');
  process.stdout.write('\n');
  rl.close();
  if (pw !== again) {
    console.error('Gesli se ne ujemata.');
    process.exit(1);
  }
  return pw;
}

const password = await ask();
if (String(password).length < 12) {
  console.error('Geslo naj ima vsaj 12 znakov.');
  process.exit(1);
}

console.log('\n# Kopirajte v website/.env.admin (lokalno) in v Vercel → Settings → Environment Variables (produkcija):');
console.log(`ADMIN_PASSWORD_HASH=${hashPassword(password)}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString('base64url')}`);
