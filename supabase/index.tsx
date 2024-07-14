import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import clientAuthStorageInstance from "./ClientAuthStorage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: clientAuthStorageInstance,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
