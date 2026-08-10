'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { humanError } from '@/lib/humanize';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await createClient().auth.signInWithPassword({ email, password });
    if (err) {
      // humanError, never err.message: Supabase says "Invalid login
      // credentials", which is accurate and tells a person nothing.
      setError(humanError(err));
      setBusy(false);
      return;
    }
    // The destination middleware stashed when it bounced them here.
    router.push(params.get('next') || '/app');
    router.refresh();
  }

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh', padding: 'var(--s-4)' }}>
      <form onSubmit={onSubmit} className="card" style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontSize: 'var(--t-xl)', margin: '0 0 var(--s-5)' }}>Sign in</h1>

        <div className="field" style={{ marginBottom: 'var(--s-4)' }}>
          <label htmlFor="email">Email</label>
          <input
            id="email" type="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field" style={{ marginBottom: 'var(--s-5)' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password" type="password" autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" style={{ color: 'var(--bad)', fontSize: 'var(--t-sm)', margin: '0 0 var(--s-4)' }}>
            {error}
          </p>
        )}

        <button className="btn" style={{ width: '100%' }} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <p style={{ fontSize: 'var(--t-sm)', color: 'var(--muted)', margin: 'var(--s-4) 0 0', textAlign: 'center' }}>
          <a href="/reset-password" style={{ color: 'var(--accent)' }}>Forgot your password?</a>
        </p>
      </form>
    </div>
  );
}

/**
 * useSearchParams() opts a route out of static prerendering unless it sits
 * inside a Suspense boundary — without this the production build FAILS with
 * "missing-suspense-with-csr-bailout". It is not a warning; it exits 1.
 *
 * The fallback is the same card with the fields disabled, so the page does not
 * flash empty on a slow connection.
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh', padding: 'var(--s-4)' }}>
          <div className="card" style={{ width: '100%', maxWidth: 380 }}>
            <h1 style={{ fontSize: 'var(--t-xl)', margin: 0 }}>Sign in</h1>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
