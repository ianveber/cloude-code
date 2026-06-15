"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setRole(formData: FormData) {
  const id = String(formData.get("id") || "");
  const role = String(formData.get("role") || "");
  if (!id || (role !== "admin" && role !== "member")) return;
  const supabase = await createClient();
  // RLS only lets an admin update other profiles; members are blocked at the DB.
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/nastavitve");
}
