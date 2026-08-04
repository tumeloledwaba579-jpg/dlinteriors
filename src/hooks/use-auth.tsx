import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

async function checkAdmin(userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}

async function ensureProfile(user: User) {
  const { data } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (data) return;

  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  await supabase.from("profiles").insert({
    user_id: user.id,
    display_name:
      typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof metadata.name === "string"
          ? metadata.name
          : "",
    avatar_url:
      typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
    phone: user.phone ?? (typeof metadata.phone === "string" ? metadata.phone : null),
  });
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // stays true until BOTH the session and the role lookup have resolved
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const resolve = async (s: Session | null) => {
      if (!active) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const [admin] = await Promise.all([
          checkAdmin(s.user.id),
          ensureProfile(s.user),
        ]);
        if (!active) return;
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      if (active) setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      // defer supabase calls out of the auth callback to avoid deadlock
      setTimeout(() => resolve(s), 0);
    });

    supabase.auth.getSession().then(({ data }) => resolve(data.session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const refreshRole = async () => {
    if (!user) return false;
    const admin = await checkAdmin(user.id);
    setIsAdmin(admin);
    return admin;
  };

  return { session, user, isAdmin, loading, refreshRole };
}
