import { createClient } from '@/lib/supabase/server';

export default async function AppHome() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 'var(--s-7) var(--s-4)' }}>
      <h1 style={{ fontSize: 'var(--t-2xl)', margin: 0 }}>{{APP_NAME}}</h1>
      <p style={{ color: 'var(--muted)', marginTop: 'var(--s-2)' }}>
        Signed in as {data.user?.email}
      </p>
    </div>
  );
}
