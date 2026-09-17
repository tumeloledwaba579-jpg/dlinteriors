import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminTestimonials } from "@/components/admin/AdminTestimonials";
import { AdminContact } from "@/components/admin/AdminContact";
import { AdminPages } from "@/components/admin/AdminPages";
import { AdminInquiries } from "@/components/admin/AdminInquiries";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { useAccessRequests } from "@/components/admin/AdminAccessRequests";

function PendingBadge() {
  const { pending } = useAccessRequests();
  if (!pending.length) return null;
  return (
    <span className="ml-2 rounded-full bg-foreground px-2 py-0.5 text-[10px] text-background">
      {pending.length}
    </span>
  );
}



export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — dl interiors" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "pages" | "projects" | "services" | "testimonials" | "contact" | "inquiries" | "users";

function AdminPage() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("pages");

  useEffect(() => {
    if (loading) return;
    if (!user) nav({ to: "/login" });
    // Non-admins get no hint that this area exists.
    else if (!isAdmin) nav({ to: "/account", replace: true });
  }, [user, isAdmin, loading, nav]);

  if (loading || !user || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center pt-32">Loading…</div>;
  }


  const tabs: { id: Tab; label: string }[] = [
    { id: "pages", label: "Pages" },
    { id: "projects", label: "Projects" },
    { id: "services", label: "Services" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact info" },
    { id: "inquiries", label: "Inquiries" },
    { id: "users", label: "Users" },
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
          {tab === "pages" && <AdminPages />}
          {tab === "projects" && <AdminProjects />}
          {tab === "services" && <AdminServices />}
          {tab === "testimonials" && <AdminTestimonials />}
          {tab === "contact" && <AdminContact />}
          {tab === "inquiries" && <AdminInquiries />}
          {tab === "users" && <AdminUsers />}

        </div>
      </div>
    </div>
  );
}
