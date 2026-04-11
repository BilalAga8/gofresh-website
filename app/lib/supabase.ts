import { createClient } from "@supabase/supabase-js";

if (typeof globalThis.location === "undefined") {
  (globalThis as Record<string, unknown>).location = { href: "", search: "", hash: "", origin: "", pathname: "/" };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: false,
    persistSession: typeof globalThis.window !== "undefined",
  },
});
