import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bshsnbvopzzaeqerwfww.supabase.co";
const supabaseAnonKey = "sb_publishable_YAAkV8BIC0ObzFIihgWeEQ_99ToLTWc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);