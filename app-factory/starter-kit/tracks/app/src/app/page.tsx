/**
 * Public landing page.
 *
 * Deliberately touches NOTHING — no Supabase client, no cookies, no session.
 * It must render for an anonymous visitor on a misconfigured deploy, because a
 * 500 on the front page is how an outage looks to everyone who has never
 * signed in.
 */
export default function Landing() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 'var(--s-8) var(--s-4)' }}>
      <h1 style={{ fontSize: 'var(--t-2xl)', margin: 0 }}>{{APP_NAME}}</h1>
      <p style={{ color: 'var(--muted)', marginTop: 'var(--s-3)', fontSize: 'var(--t-lg)' }}>
        {{APP_DESCRIPTION}}
      </p>
      <p style={{ marginTop: 'var(--s-6)' }}>
        <a className="btn" href="/login" style={{ textDecoration: 'none' }}>Sign in</a>
      </p>
    </div>
  );
}
