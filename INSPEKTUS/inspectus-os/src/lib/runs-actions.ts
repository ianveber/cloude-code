"use server";
// A "use server" file may only export async function *declarations* (not re-exported
// bindings), so we wrap saveRun rather than `export { saveRun } from`.
import { saveRun as _saveRun } from "@/lib/runs";
import type { RunInput } from "@/lib/runs";

export async function saveRun(input: RunInput) {
  return _saveRun(input);
}
