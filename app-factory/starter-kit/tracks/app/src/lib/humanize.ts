/**
 * humanize.ts — the words users actually see.
 *
 * The house rule is that no technical jargon reaches the interface. "Queued",
 * "409", "RLS policy violation" and "row-level security" are all facts about
 * OUR implementation, and putting them on screen makes a person feel stupid
 * about something that was never theirs to understand.
 *
 * Log the jargon. Show the sentence.
 */
export const STATE_LABELS: Record<string, string> = {
  idle: 'Ready',
  queued: 'Working…',
  claimed: 'Working…',
  processing: 'Working…',
  running: 'Working…',
  succeeded: 'Done',
  done: 'Done',
  failed: "Didn't work",
  error: "Didn't work",
  healthy: 'Everything running',
};

export function humanState(raw: string | null | undefined): string {
  if (!raw) return 'Ready';
  return STATE_LABELS[raw.toLowerCase()] ?? 'Ready';
}

/** Turn any error into something worth reading. Never surface a raw code. */
export function humanError(err: unknown): string {
  const msg = String((err as { message?: string })?.message ?? err ?? '');
  if (/invalid login credentials/i.test(msg)) return "That email and password don't match.";
  if (/email not confirmed/i.test(msg)) return 'Check your email and confirm your address first.';
  if (/rate limit|too many/i.test(msg)) return 'Too many tries. Wait a minute and try again.';
  if (/row-level security|permission denied|insufficient/i.test(msg)) return "You don't have access to that.";
  if (/fetch|network|failed to fetch/i.test(msg)) return "Couldn't reach the server. Check your connection.";
  return 'Something went wrong. Try again.';
}
