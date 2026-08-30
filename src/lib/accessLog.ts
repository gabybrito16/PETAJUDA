import { supabase } from "./supabase";

export async function logPageAccess(page: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return;

  const { error: logError } = await supabase.from("access_logs").insert({
    user_id: user.id,
    email: user.email ?? null,
    page,
    accessed_at: new Date().toISOString(),
  });

  if (logError) {
    console.warn("Access log error:", logError.message);
  }
}
