import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Sign in — dl interiors" },
    { name: "description", content: "Sign in to your dl interiors account using email, Google, Apple, or phone." },
    { property: "og:title", content: "Sign in — dl interiors" },
    { property: "og:description", content: "Access your dl interiors account securely." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+27");
  const [otp, setOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<"phone" | "code">("phone");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
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

  const socialSignIn = async (provider: "google" | "apple") => {
    setBusy(true); setMsg(null);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) { setMsg(result.error.message ?? `${provider === "apple" ? "Apple" : "Google"} sign-in failed`); setBusy(false); return; }
    if (result.redirected) return;
    nav({ to: "/admin" });
  };

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (phoneStep === "phone") {
        const { error } = await supabase.auth.signInWithOtp({ phone: phone.trim() });
        if (error) throw error;
        setPhoneStep("code");
        setMsg("We sent a six-digit code to your phone.");
      } else {
        const { data, error } = await supabase.auth.verifyOtp({ phone: phone.trim(), token: otp.trim(), type: "sms" });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").upsert({ user_id: data.user.id, phone: data.user.phone ?? phone.trim() }, { onConflict: "user_id" });
        }
        nav({ to: "/admin" });
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Phone sign-in failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 pt-32 pb-20 bg-background">
      <div className="w-full max-w-md border border-border bg-card p-10">
        <p className="eyebrow">Studio Admin</p>
        <h1 className="mt-3 font-serif text-4xl">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <Button type="button" variant="outline" onClick={() => socialSignIn("google")} disabled={busy}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-input bg-background px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-accent disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z"/>
            <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"/>
            <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z"/>
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"/>
          </svg>
          Continue with Google
        </Button>
        <Button type="button" variant="outline" onClick={() => socialSignIn("apple")} disabled={busy}
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-input bg-background px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-accent disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.1ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z"/></svg>
          Continue with Apple
        </Button>
        <div className="mt-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-8 grid grid-cols-2 border border-border p-1" aria-label="Sign-in method">
          <Button type="button" variant={authMethod === "email" ? "default" : "ghost"} className="rounded-sm text-xs uppercase tracking-[0.16em]" onClick={() => { setAuthMethod("email"); setMsg(null); }}>Email</Button>
          <Button type="button" variant={authMethod === "phone" ? "default" : "ghost"} className="rounded-sm text-xs uppercase tracking-[0.16em]" onClick={() => { setAuthMethod("phone"); setMsg(null); }}>Phone</Button>
        </div>
        {authMethod === "email" ? <form onSubmit={submit} className="mt-8 space-y-5">
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
          <Button disabled={busy} type="submit"
            className="w-full rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] text-background disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background">
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form> : <form onSubmit={submitPhone} className="mt-8 space-y-5">
          <div>
            <label htmlFor="login-phone" className="eyebrow block">Mobile number</label>
            <input id="login-phone" type="tel" autoComplete="tel" required value={phone} disabled={phoneStep === "code"} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 123 4567" className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground disabled:opacity-60" />
          </div>
          {phoneStep === "code" && <div>
            <label htmlFor="login-code" className="eyebrow block">Verification code</label>
            <input id="login-code" inputMode="numeric" autoComplete="one-time-code" required minLength={6} maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-foreground" />
          </div>}
          {msg && <p className="text-xs text-muted-foreground" role="status">{msg}</p>}
          <Button disabled={busy} type="submit" className="w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em]">{busy ? "…" : phoneStep === "phone" ? "Send SMS code" : "Verify and sign in"}</Button>
          {phoneStep === "code" && <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => { setPhoneStep("phone"); setOtp(""); setMsg(null); }}>Use a different number</Button>}
        </form>}
        {authMethod === "email" && <Button type="button" variant="link" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm">
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </Button>}
        <div className="mt-8 border-t border-border pt-6">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}
