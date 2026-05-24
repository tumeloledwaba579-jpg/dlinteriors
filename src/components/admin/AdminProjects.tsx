import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card, ImageUpload, Input, Label, Textarea } from "./ui";

type Project = {
  id: string; slug: string; title: string; location: string; style: string; space: string; year: string;
  cover_image: string | null; palette: { name: string; hex: string }[]; materials: string[];
  challenge: string; solution: string; narrative: string; published: boolean; sort_order: number;
};
type Img = { id: string; project_id: string; url: string; sort_order: number };

const empty: Omit<Project, "id"> = {
  slug: "", title: "", location: "", style: "", space: "", year: "",
  cover_image: null, palette: [], materials: [], challenge: "", solution: "", narrative: "",
  published: true, sort_order: 0,
};

export function AdminProjects() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [imgs, setImgs] = useState<Img[]>([]);

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order").order("created_at", { ascending: false });
    setItems(((data as unknown) as Project[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const loadImgs = async (pid: string) => {
    const { data } = await supabase.from("project_images").select("*").eq("project_id", pid).order("sort_order");
    setImgs((data as Img[]) ?? []);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title) return alert("Slug and title are required");
    const { id, ...rest } = editing;
    if (id) {
      const { error } = await supabase.from("projects").update(rest).eq("id", id);
      if (error) return alert(error.message);
    } else {
      const { data, error } = await supabase.from("projects").insert(rest).select().single();
      if (error) return alert(error.message);
      setEditing((data as unknown) as Project);
      return load();
    }
    setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return alert(error.message);
    load();
  };

  const addImage = async (url: string | null) => {
    if (!url || !editing?.id) return;
    const { error } = await supabase.from("project_images").insert({ project_id: editing.id, url, sort_order: imgs.length });
    if (error) return alert(error.message);
    loadImgs(editing.id);
  };
  const delImage = async (id: string) => {
    await supabase.from("project_images").delete().eq("id", id);
    if (editing?.id) loadImgs(editing.id);
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl">{editing.id ? "Edit project" : "New project"}</h2>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </div>
        <Card>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><Label>Slug (URL)</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} /></div>
            <div><Label>Location</Label><Input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>
            <div><Label>Style</Label><Input value={editing.style} onChange={(e) => setEditing({ ...editing, style: e.target.value })} /></div>
            <div><Label>Space</Label><Input value={editing.space} onChange={(e) => setEditing({ ...editing, space: e.target.value })} /></div>
            <div><Label>Year</Label><Input value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} /></div>
            <div><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            <div className="flex items-center gap-2 mt-6"><input id="pub" type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /><label htmlFor="pub" className="text-sm">Published</label></div>
          </div>
          <div className="mt-4"><Label>Cover image</Label><ImageUpload value={editing.cover_image} onChange={(url) => setEditing({ ...editing, cover_image: url })} folder="projects" /></div>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3"><Label>The brief / challenge</Label><Textarea rows={3} value={editing.challenge} onChange={(e) => setEditing({ ...editing, challenge: e.target.value })} /></div>
            <div className="md:col-span-3"><Label>The solution</Label><Textarea rows={3} value={editing.solution} onChange={(e) => setEditing({ ...editing, solution: e.target.value })} /></div>
            <div className="md:col-span-3"><Label>Narrative</Label><Textarea rows={3} value={editing.narrative} onChange={(e) => setEditing({ ...editing, narrative: e.target.value })} /></div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <Label>Materials (one per line)</Label>
              <Textarea rows={5} value={editing.materials.join("\n")} onChange={(e) => setEditing({ ...editing, materials: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} />
            </div>
            <div>
              <Label>Palette (name #hex per line)</Label>
              <Textarea rows={5} value={editing.palette.map(p => `${p.name} ${p.hex}`).join("\n")} onChange={(e) => {
                const palette = e.target.value.split("\n").map(line => {
                  const m = line.trim().match(/^(.+?)\s+(#[0-9a-fA-F]{3,8})$/);
                  return m ? { name: m[1].trim(), hex: m[2] } : null;
                }).filter(Boolean) as { name: string; hex: string }[];
                setEditing({ ...editing, palette });
              }} />
            </div>
          </div>
        </Card>

        {editing.id && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl">Gallery</h3>
              <ImageUpload value={null} onChange={addImage} folder={`projects/${editing.id}`} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {imgs.map(img => (
                <div key={img.id} className="relative">
                  <img src={img.url} alt="" className="aspect-[4/3] w-full object-cover border border-border" />
                  <button onClick={() => delImage(img.id)} className="absolute top-1 right-1 bg-background border border-border rounded-full px-2 text-xs">×</button>
                </div>
              ))}
              {imgs.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No gallery images yet.</p>}
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{items.length} project{items.length === 1 ? "" : "s"}</p>
        <Btn onClick={() => { setEditing({ id: "", ...empty } as Project); setImgs([]); }}>+ New project</Btn>
      </div>
      <div className="grid gap-3">
        {items.map(p => (
          <div key={p.id} className="flex items-center gap-4 border border-border bg-card p-4">
            <div className="h-16 w-24 bg-muted overflow-hidden">{p.cover_image && <img src={p.cover_image} className="h-full w-full object-cover" alt="" />}</div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-lg">{p.title}</p>
              <p className="text-xs text-muted-foreground">/{p.slug} · {p.location} · {p.year} {!p.published && "· Draft"}</p>
            </div>
            <Btn variant="ghost" onClick={() => { setEditing(p); loadImgs(p.id); }}>Edit</Btn>
            <Btn variant="danger" onClick={() => remove(p.id)}>Delete</Btn>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No projects yet. Click "+ New project" to add your first.</p>}
      </div>
    </div>
  );
}
