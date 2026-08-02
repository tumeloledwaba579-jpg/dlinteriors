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
        const admin = await checkAdmin(s.user.id);
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
