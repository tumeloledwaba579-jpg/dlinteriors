import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card, Input, Label, Textarea } from "./ui";

type Service = {
  id: string; title: string; description: string; investment: string; features: string[];
  sort_order: number; published: boolean;
};
const empty: Omit<Service, "id"> = { title: "", description: "", investment: "", features: [], sort_order: 0, published: true };

export function AdminServices() {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setItems((data as Service[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title) return alert("Title required");
    const { id, ...rest } = editing;
    const op = id ? supabase.from("services").update(rest).eq("id", id) : supabase.from("services").insert(rest);
    const { error } = await op;
    if (error) return alert(error.message);
    setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("services").delete().eq("id", id);
    load();
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl">{editing.id ? "Edit service" : "New service"}</h2>
          <div className="flex gap-2"><Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn><Btn onClick={save}>Save</Btn></div>
        </div>
        <Card>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><Label>Investment</Label><Input value={editing.investment} onChange={(e) => setEditing({ ...editing, investment: e.target.value })} placeholder="From R150 000" /></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Features (one per line)</Label>
              <Textarea rows={5} value={editing.features.join("\n")} onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} />
            </div>
            <div><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            <div className="flex items-center gap-2 mt-6"><input id="psv" type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /><label htmlFor="psv" className="text-sm">Published</label></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{items.length} service{items.length === 1 ? "" : "s"}</p>
        <Btn onClick={() => setEditing({ id: "", ...empty } as Service)}>+ New service</Btn>
      </div>
      <div className="grid gap-3">
        {items.map(s => (
          <div key={s.id} className="flex items-center gap-4 border border-border bg-card p-4">
            <div className="flex-1"><p className="font-serif text-lg">{s.title}</p><p className="text-xs text-muted-foreground">{s.investment} {!s.published && "· Draft"}</p></div>
            <Btn variant="ghost" onClick={() => setEditing(s)}>Edit</Btn>
            <Btn variant="danger" onClick={() => remove(s.id)}>Delete</Btn>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No services yet.</p>}
      </div>
    </div>
  );
}
