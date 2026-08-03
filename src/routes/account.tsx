import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your account — dl interiors" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const PROVIDER_LABELS: Record<string, string> = {
  email: "Email & password",
  google: "Google",
  apple: "Apple",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border py-4 last:border-0">
      <span className="eyebrow">{label}</span>
      <span className="text-sm break-all">{value}</span>
    </div>
  );
}

function AccountPage() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  useEffect(() => {
    if (!user) return;
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    setFullName(typeof meta.full_name === "string" ? meta.full_name : "");
    setPhone(
      typeof meta.phone === "string" && meta.phone
        ? meta.phone
        : user.phone ?? "",
    );
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-dvh flex items-center justify-center pt-32 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const providers = (user.identities ?? []).map(
    (i) => PROVIDER_LABELS[i.provider] ?? i.provider,
  );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setErr(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim(), phone: phone.trim() },
    });
    if (error) setErr(error.message);
    else setMsg("Details saved.");
    setBusy(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
  };

  return (
    <div className="min-h-dvh bg-background px-6 pt-32 pb-24">
      <div className="mx-auto max-w-2xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Your account</p>
            <h1 className="mt-2 font-serif text-4xl">Account details</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
              >
                Studio admin
              </Link>
            )}
            <button
              type="button"
              onClick={signOut}
              className="rounded-full border border-foreground/80 px-4 py-2 text-xs uppercase tracking-[0.18em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="mt-10 border border-border bg-card p-8">
          <h2 className="eyebrow">Sign-in details</h2>
          <div className="mt-4">
            <Row label="Email" value={user.email ?? "—"} />
            <Row
              label="Email status"
              value={
                user.email_confirmed_at ? "Confirmed" : "Not confirmed yet"
              }
            />
            <Row
              label="Sign-in method"
              value={providers.length ? providers.join(", ") : "—"}
            />
            <Row
              label="Member since"
              value={new Date(user.created_at).toLocaleDateString()}
            />
            <Row
              label="Last sign in"
              value={
                user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "—"
              }
            />
            <Row label="Role" value={isAdmin ? "Administrator" : "Member"} />
          </div>
        </section>

        <section className="mt-6 border border-border bg-card p-8">
          <h2 className="eyebrow">Your details</h2>
          <form onSubmit={save} className="mt-5 space-y-5">
            <div>
              <label htmlFor="acct-name" className="eyebrow block">
                Full name
              </label>
              <input
                id="acct-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>
            <div>
              <label htmlFor="acct-phone" className="eyebrow block">
                Phone number
              </label>
              <input
                id="acct-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+27 …"
                className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>
            {err && (
              <p className="text-xs text-destructive" role="alert">
                {err}
              </p>
            )}
            {msg && (
              <p
                className="text-xs text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                {msg}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] text-background disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              {busy ? "Saving…" : "Save details"}
            </button>
            <p className="text-xs text-muted-foreground">
              Your email address can't be changed here — contact the studio if
              it needs updating.
            </p>
          </form>
        </section>

        <div className="mt-8">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
