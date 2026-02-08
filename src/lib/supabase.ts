import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 設定チェック
const isClientConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const isAdminConfigured = Boolean(supabaseUrl && supabaseServiceKey);

// Client-side (anon key, used in API routes for reads)
export const supabase: SupabaseClient | null = isClientConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Server-side (service role, used for writes and webhook)
export const supabaseAdmin: SupabaseClient | null = isAdminConfigured
  ? createClient(supabaseUrl!, supabaseServiceKey!)
  : null;

export function isSupabaseConfigured(): boolean {
  return isClientConfigured;
}

export function isSupabaseAdminConfigured(): boolean {
  return isAdminConfigured;
}
