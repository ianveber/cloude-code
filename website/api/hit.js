/* Vercel entry for the page-view beacon. The consent script posts here only
   after the visitor allowed analytics. Logic in api/_lib/analytics.mjs. */
import { createAnalytics, createHitHandler } from './_lib/analytics.mjs';

const handle = createHitHandler({ analytics: createAnalytics({ env: process.env }) });

export default function handler(req, res) {
  return handle(req, res);
}
