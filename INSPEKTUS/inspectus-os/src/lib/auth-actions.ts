"use server";
// A "use server" file may only export async function *declarations* (not re-exported
// bindings), so we wrap the server-only helper rather than `export { signOut } from`.
import { signOut as _signOut } from "@/lib/auth";

export async function signOut() {
  await _signOut();
}
