import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

// Verify a Supabase access token (passed as Authorization: Bearer ...) and
// confirm the user has the 'admin' role in the public.profiles table.
// Throws when not authorized. Returns the user id on success.
export async function assertSupabaseAdmin(): Promise<string> {
  const authHeader = getRequestHeader("authorization") ?? getRequestHeader("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) throw new Error("Unauthorized");

  const url = process.env.MY_SUPABASE_URL;
  const serviceKey = process.env.MY_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Server is not configured");

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) throw new Error("Unauthorized");

  const { data: profile, error: profErr } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profErr) throw new Error("Unauthorized");
  if (!profile || profile.role !== "admin") throw new Error("Forbidden");

  return userData.user.id;
}

// Server-side check used by the /admin route guard.
export const checkIsAdmin = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await assertSupabaseAdmin();
    return { isAdmin: true as const };
  } catch {
    return { isAdmin: false as const };
  }
});
