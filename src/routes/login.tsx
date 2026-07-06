import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Login — dl interiors" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) nav({ to: "/admin" });
  }, [user, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setMsg("Account created. Check your email to confirm, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/admin" });
      }
    } catch (err: any) {
      setMsg(err.message ?? "Something went wrong");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 pt-32 pb-20 bg-background">
      <div className="w-full max-w-md border border-border bg-card p-10">
        <p className="eyebrow">Studio Admin</p>
        <h1 className="mt-3 font-serif text-4xl">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="login-email" className="eyebrow block">Email</label>
            <input id="login-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground" />
          </div>
          <div>
            <label htmlFor="login-password" className="eyebrow block">Password</label>
            <input id="login-password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground" />
          </div>
          {msg && <p className="text-xs text-destructive" role="alert">{msg}</p>}
          <button disabled={busy} type="submit"
            className="w-full rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] text-background disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background">
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm">
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
        <div className="mt-8 border-t border-border pt-6">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}
