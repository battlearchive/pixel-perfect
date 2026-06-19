// Service-role Supabase client. Server-only — the *.server.ts extension blocks
// this module from client bundles. Never import from a file that runs in the
// browser. Inside .functions.ts handlers, load it with `await import(...)`.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.MY_SUPABASE_URL;
const serviceKey = process.env.MY_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase.server] Missing MY_SUPABASE_URL or MY_SUPABASE_SERVICE_ROLE_KEY. " +
      "Admin writes will fail until both are set as project secrets.",
  );
}

export const supabaseAdmin: SupabaseClient = createClient(url ?? "", serviceKey ?? "", {
  auth: { persistSession: false, autoRefreshToken: false },
});
