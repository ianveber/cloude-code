import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (e) {
            // In a Server Component, set() always throws ("Cookies can only be modified in a
            // Server Action or Route Handler") — expected; middleware refreshes the session,
            // so swallow that one. But do NOT hide a genuine write failure in a Server Action:
            // that would silently drop the session and bounce the user back to /prijava.
            const msg = e instanceof Error ? e.message : "";
            if (!msg.includes("Cookies can only be modified")) throw e;
          }
        },
      },
    }
  );
}
