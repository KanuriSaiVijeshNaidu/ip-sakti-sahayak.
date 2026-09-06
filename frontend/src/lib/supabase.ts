import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://aqosnjagwmliqzndzwwg.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'sb_publishable_73gYVyuH3sCsBNiIBcicbw_8Jd2WTGH';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ── Supabase Cloud Auth & Profile Helpers ─────────────────────────────────────

export async function sendOtpToGmail(email: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) throw error;
  return data;
}

export async function verifyGmailOtp(email: string, token: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: token.trim(),
    type: "email",
  });
  if (error) throw error;
  return data;
}

export async function setSupabaseUserPassword(password: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.auth.updateUser({
    password: password.trim(),
  });
  if (error) throw error;
  return data;
}

export async function signInWithSupabasePassword(email: string, password: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: password.trim(),
  });
  if (error) throw error;
  return data;
}

export async function fetchSupabaseUserProfile(identifier: string) {
  if (!supabase) return null;
  const clean = identifier.trim().toLowerCase();
  try {
    const { data, error } = await supabase
      .from("ayurlex_users")
      .select("*")
      .or(`username.eq.${clean},email.eq.${clean}`)
      .limit(1);
    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.warn("[Supabase] fetchUserProfile error:", err);
  }
  return null;
}

export async function upsertSupabaseUserProfile(user: {
  username: string;
  email: string;
  name: string;
  role: string;
  institution?: string;
  registrationNumber?: string;
  passwordHash?: string;
  device?: string;
}) {
  if (!supabase) return null;
  try {
    const payload: Record<string, any> = {
      username: user.username.trim().toLowerCase(),
      email: user.email.trim().toLowerCase(),
      name: user.name.trim(),
      role: user.role,
      institution: user.institution || "Ayurvedic Medical Community",
      registration_number: user.registrationNumber || "AYUR-VERIFIED",
      is_logged_in: true,
      last_login: new Date().toISOString(),
    };
    if (user.passwordHash) {
      payload.password_hash = user.passwordHash;
    }
    const { data, error } = await supabase
      .from("ayurlex_users")
      .upsert(payload, { onConflict: "email" })
      .select();
    if (!error && data) {
      return data[0];
    }
  } catch (err) {
    console.warn("[Supabase] upsertUserProfile error:", err);
  }
  return null;
}

export async function signOutFromSupabase() {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {}
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("ayurlex_user_profile");
  }
}

