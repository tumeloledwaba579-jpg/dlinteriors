import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card, Input, Label, Textarea } from "./ui";

type T = { id: string; author: string; role: string; quote: string; sort_order: number; published: boolean };
const empty: Omit<T, "id"> = { author: "", role: "", quote: "", sort_order: 0, published: true };

export function AdminTestimonials() {
  const [items, setItems] = useState<T[]>([]);
  const [editing, setEditing] = useState<T | null>(null);
  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems((data as T[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.author || !editing.quote) return alert("Author and quote required");
    const { id, ...rest } = editing;
    const op = id ? supabase.from("testimonials").update(rest).eq("id", id) : supabase.from("testimonials").insert(rest);
    const { error } = await op;
    if (error) return alert(error.message);
    setEditing(null); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("testimonials").delete().eq("id", id); load(); };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl">{editing.id ? "Edit testimonial" : "New testimonial"}</h2>
          <div className="flex gap-2"><Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn><Btn onClick={save}>Save</Btn></div>
        </div>
        <Card>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Author</Label><Input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></div>
            <div><Label>Role / Location</Label><Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="Westcliff, Johannesburg" /></div>
            <div className="md:col-span-2"><Label>Quote</Label><Textarea rows={4} value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} /></div>
            <div><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            <div className="flex items-center gap-2 mt-6"><input id="pt" type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /><label htmlFor="pt" className="text-sm">Published</label></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{items.length} testimonial{items.length === 1 ? "" : "s"}</p>
        <Btn onClick={() => setEditing({ id: "", ...empty } as T)}>+ New testimonial</Btn>
      </div>
      <div className="grid gap-3">
        {items.map(t => (
          <div key={t.id} className="flex items-start gap-4 border border-border bg-card p-4">
            <div className="flex-1"><p className="font-serif italic text-lg">"{t.quote}"</p><p className="mt-2 text-xs text-muted-foreground">— {t.author}{t.role && `, ${t.role}`} {!t.published && "· Draft"}</p></div>
            <Btn variant="ghost" onClick={() => setEditing(t)}>Edit</Btn>
            <Btn variant="danger" onClick={() => remove(t.id)}>Delete</Btn>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No testimonials yet.</p>}
      </div>
    </div>
  );
}
