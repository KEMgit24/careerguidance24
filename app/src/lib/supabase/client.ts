import { createClient } from "@supabase/supabase-js";
import { logger } from "./../../lib/logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  logger.error(`Supabase configuration incomplete. Missing: ${missing.join(', ')}`);
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
