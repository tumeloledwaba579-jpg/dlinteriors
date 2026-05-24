import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground ${props.className ?? ""}`} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground ${props.className ?? ""}`} />;
}
export function Label({ children }: { children: React.ReactNode }) {
  return <label className="eyebrow block mb-1.5">{children}</label>;
}
export function Btn({ children, variant = "primary", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const cls =
    variant === "primary" ? "bg-foreground text-background hover:bg-primary" :
    variant === "danger" ? "border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" :
    "border border-border text-foreground hover:bg-muted";
  return <button {...rest} className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors disabled:opacity-50 ${cls} ${rest.className ?? ""}`}>{children}</button>;
}
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="border border-border bg-card p-6">{children}</div>;
}

export function ImageUpload({ value, onChange, folder = "uploads" }: { value?: string | null; onChange: (url: string | null) => void; folder?: string }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err: any) { alert(err.message); }
    finally { setBusy(false); }
  };
  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative">
          <img src={value} alt="" className="h-20 w-28 object-cover border border-border" />
          <button type="button" onClick={() => onChange(null)} className="absolute -top-2 -right-2 bg-background border border-border rounded-full px-2 text-xs">×</button>
        </div>
      ) : null}
      <label className="cursor-pointer rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-muted">
        {busy ? "Uploading…" : value ? "Replace" : "Upload image"}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.currentTarget.value = ""; }} />
      </label>
    </div>
  );
}
