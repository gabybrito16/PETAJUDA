import { supabase } from "./supabase";

export async function logPageAccess(page: string) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) return;

  const { error: logError } = await supabase.from("access_logs").insert({
    user_id: session.user.id,
    email: session.user.email ?? null,
    page,
    accessed_at: new Date().toISOString(),
  });

  if (logError) {
    console.warn("Access log error:", logError.message);
  }
}
