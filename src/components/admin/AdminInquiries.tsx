import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Btn } from "./ui";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  budget: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export function AdminInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Inquiry[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleRead = async (i: Inquiry) => {
    await supabase.from("contact_submissions").update({ read: !i.read }).eq("id", i.id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry? This cannot be undone.")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    load();
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const unread = items.filter((i) => !i.read).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {items.length} inquir{items.length === 1 ? "y" : "ies"}
        {unread > 0 && <span className="ml-2 text-foreground">· {unread} unread</span>}
      </p>
      {items.length === 0 && <p className="text-sm text-muted-foreground">No inquiries yet.</p>}
      <div className="grid gap-3">
        {items.map((i) => {
          const isOpen = open === i.id;
          return (
            <div key={i.id} className={`border p-4 ${i.read ? "border-border bg-card" : "border-primary/40 bg-card"}`}>
              <button className="flex w-full items-start justify-between gap-4 text-left" onClick={() => setOpen(isOpen ? null : i.id)}>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg">
                    {i.name} {!i.read && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary-foreground align-middle">New</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {i.email}{i.phone && ` · ${i.phone}`}{i.project_type && ` · ${i.project_type}`}
                    {i.budget && ` · ${i.budget}`}
                  </p>
                  {!isOpen && <p className="mt-1 truncate text-sm text-muted-foreground">{i.message}</p>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(i.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </button>
              {isOpen && (
                <div className="mt-4 space-y-4">
                  <p className="whitespace-pre-wrap text-sm">{i.message}</p>
                  <div className="flex flex-wrap gap-2">
                    <a href={`mailto:${i.email}?subject=Re: your inquiry`} className="rounded-full border border-foreground/80 px-4 py-2 text-xs uppercase tracking-[0.18em]">Reply by email</a>
                    {i.phone && <a href={`tel:${i.phone}`} className="rounded-full border border-foreground/80 px-4 py-2 text-xs uppercase tracking-[0.18em]">Call</a>}
                    <Btn variant="ghost" onClick={() => toggleRead(i)}>{i.read ? "Mark unread" : "Mark read"}</Btn>
                    <Btn variant="danger" onClick={() => remove(i.id)}>Delete</Btn>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
