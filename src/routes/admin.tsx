import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminTestimonials } from "@/components/admin/AdminTestimonials";
import { AdminContact } from "@/components/admin/AdminContact";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — dl interiors" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "projects" | "services" | "testimonials" | "contact";

function AdminPage() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("projects");
  const [grantMsg, setGrantMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center pt-32">Loading…</div>;
  }

  // First-user bootstrap: if there are no admins yet, allow self-grant
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-40 px-6 max-w-2xl mx-auto">
        <p className="eyebrow">Admin access required</p>
        <h1 className="mt-3 font-serif text-4xl">You're signed in, but not an admin.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          If this is the first account on the studio, claim admin access below. Otherwise an existing admin must grant you the role.
        </p>
        <button
          onClick={async () => {
            setGrantMsg(null);
            // Check if any admin exists
            const { count } = await supabase
              .from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
            if ((count ?? 0) > 0) {
              setGrantMsg("An admin already exists. Ask them to grant you access.");
              return;
            }
            const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
            if (error) setGrantMsg(error.message);
            else window.location.reload();
          }}
          className="mt-6 rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] text-background">
          Claim admin access
        </button>
        {grantMsg && <p className="mt-4 text-sm text-destructive">{grantMsg}</p>}
        <div className="mt-10">
          <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/login" }); }}
            className="text-xs text-muted-foreground hover:text-foreground">Sign out</button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "projects", label: "Projects" },
    { id: "services", label: "Services" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact info" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-background">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="eyebrow">Studio admin</p>
            <h1 className="mt-2 font-serif text-4xl">Manage site content</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">View site</Link>
            <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/login" }); }}
              className="rounded-full border border-foreground/80 px-4 py-2 text-xs uppercase tracking-[0.18em]">Sign out</button>
          </div>
        </header>

        <nav className="mt-10 flex flex-wrap gap-2 border-b border-border">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-xs uppercase tracking-[0.18em] border-b-2 -mb-px transition-colors ${
                tab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="mt-10">
          {tab === "projects" && <AdminProjects />}
          {tab === "services" && <AdminServices />}
          {tab === "testimonials" && <AdminTestimonials />}
          {tab === "contact" && <AdminContact />}
        </div>
      </div>
    </div>
  );
}
