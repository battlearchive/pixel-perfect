import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public Supabase config — anon key is publishable and safe to ship in the browser bundle.
const SUPABASE_URL = "https://vopdbewohrocrswijxvu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcGRiZXdvaHJvY3Jzd2lqeHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMzg4MzksImV4cCI6MjA5NjkxNDgzOX0.pC9jxGMgC_MqTLDrsfI0PpizBlKPRBK3qfIFnehvndU";

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Persist sessions in localStorage on the browser. SSR will see no session
    // and that's fine — auth-gated routes use `ssr: false`.
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
    detectSessionInUrl: typeof window !== "undefined",
    storageKey: "battle-archive-auth",
  },
});

export const isSupabaseConfigured = true;
