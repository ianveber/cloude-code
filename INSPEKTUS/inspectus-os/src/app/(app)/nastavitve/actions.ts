"use server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

export async function setRole(formData: FormData) {
  if (!isSupabaseConfigured()) return; // seed mode: no-op (server actions bypass UI guards)
  const id = String(formData.get("id") || "");
  const role = String(formData.get("role") || "");
  if (!id || (role !== "admin" && role !== "member")) return;
  try {
    const supabase = await createClient();
    // RLS only lets an admin update other profiles; members are blocked at the DB.
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) return; // leave the roster unchanged rather than implying success
    revalidatePath("/nastavitve");
  } catch {
    // ignore — roster simply re-renders unchanged
  }
}
