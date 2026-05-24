import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card, Input, Label, Textarea } from "./ui";

type C = { id: number; email: string; phone: string; address: string; instagram: string; pinterest: string };

export function AdminContact() {
  const [c, setC] = useState<C | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("contact_info").select("*").eq("id", 1).single().then(({ data }) => setC(data as C));
  }, []);

  if (!c) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const save = async () => {
    const { id, ...rest } = c;
    const { error } = await supabase.from("contact_info").update(rest).eq("id", 1);
    setMsg(error ? error.message : "Saved.");
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Email</Label><Input value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Address</Label><Textarea rows={2} value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} /></div>
          <div><Label>Instagram URL</Label><Input value={c.instagram} onChange={(e) => setC({ ...c, instagram: e.target.value })} placeholder="https://instagram.com/…" /></div>
          <div><Label>Pinterest URL</Label><Input value={c.pinterest} onChange={(e) => setC({ ...c, pinterest: e.target.value })} placeholder="https://pinterest.com/…" /></div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <Btn onClick={save}>Save</Btn>
          {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
        </div>
      </Card>
    </div>
  );
}
