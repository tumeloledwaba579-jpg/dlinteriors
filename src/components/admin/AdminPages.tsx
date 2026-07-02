import { useEffect, useState } from "react";
import { DEFAULTS, saveSection, fetchSection, type SectionKey, type SiteContent } from "@/lib/site-content";
import { Btn, Card, ImageUpload, Input, Label, Textarea } from "./ui";

type PageTab = "site" | "home" | "about" | "services" | "contact";

const tabs: { id: PageTab; label: string }[] = [
  { id: "site", label: "Site / Branding" },
  { id: "home", label: "Home" },
  { id: "about", label: "About page" },
  { id: "services", label: "Services page" },
  { id: "contact", label: "Contact page" },
];

export function AdminPages() {
  const [tab, setTab] = useState<PageTab>("site");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.16em] border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "site" && (
        <>
          <SectionEditor sectionKey="site.branding" title="Branding" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Studio mark (small)</Label><Input value={d.studioMark} onChange={(e) => set({ ...d, studioMark: e.target.value })} /></div>
              <div><Label>Studio name</Label><Input value={d.studioName} onChange={(e) => set({ ...d, studioName: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Tagline</Label><Input value={d.tagline} onChange={(e) => set({ ...d, tagline: e.target.value })} /></div>
              <div><Label>Header CTA label</Label><Input value={d.headerCta} onChange={(e) => set({ ...d, headerCta: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Footer about text</Label><Textarea rows={3} value={d.footerAbout} onChange={(e) => set({ ...d, footerAbout: e.target.value })} /></div>
              <div><Label>Footer credit line</Label><Input value={d.footerCredit} onChange={(e) => set({ ...d, footerCredit: e.target.value })} /></div>
            </div>
          )} />
        </>
      )}

      {tab === "home" && (
        <>
          <SectionEditor sectionKey="home.hero" title="Hero" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
              <div><Label>Tagline</Label><Input value={d.tagline} onChange={(e) => set({ ...d, tagline: e.target.value })} /></div>
              <div><Label>Title (lead)</Label><Input value={d.titleLead} onChange={(e) => set({ ...d, titleLead: e.target.value })} /></div>
              <div><Label>Title (italic)</Label><Input value={d.titleItalic} onChange={(e) => set({ ...d, titleItalic: e.target.value })} /></div>
              <div><Label>Primary CTA label</Label><Input value={d.primaryCta} onChange={(e) => set({ ...d, primaryCta: e.target.value })} /></div>
              <div><Label>Phone label (leave blank to hide)</Label><Input value={d.phoneLabel} onChange={(e) => set({ ...d, phoneLabel: e.target.value })} /></div>
              <div><Label>Phone tel: link</Label><Input value={d.phoneTel} onChange={(e) => set({ ...d, phoneTel: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Hero image</Label><ImageUpload value={d.image} onChange={(url) => set({ ...d, image: url ?? "" })} folder="home" /></div>
            </div>
          )} />

          <SectionEditor sectionKey="home.profile" title="Profile" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
              <div><Label>Link label</Label><Input value={d.linkLabel} onChange={(e) => set({ ...d, linkLabel: e.target.value })} /></div>
              <div><Label>Heading lead</Label><Input value={d.headingLead} onChange={(e) => set({ ...d, headingLead: e.target.value })} /></div>
              <div><Label>Heading italic</Label><Input value={d.headingItalic} onChange={(e) => set({ ...d, headingItalic: e.target.value })} /></div>
              <div><Label>Heading tail</Label><Input value={d.headingTail} onChange={(e) => set({ ...d, headingTail: e.target.value })} /></div>
              <div><Label>Portrait image</Label><ImageUpload value={d.portrait} onChange={(url) => set({ ...d, portrait: url ?? "" })} folder="home" /></div>
              <div className="md:col-span-2">
                <Label>Paragraphs</Label>
                <StringList value={d.paragraphs} onChange={(v) => set({ ...d, paragraphs: v })} multiline />
              </div>
            </div>
          )} />

          <SectionEditor sectionKey="home.categories" title="Portfolio categories" render={(d, set) => (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
                <div><Label>Link label</Label><Input value={d.linkLabel} onChange={(e) => set({ ...d, linkLabel: e.target.value })} /></div>
                <div className="md:col-span-2"><Label>Heading</Label><Input value={d.heading} onChange={(e) => set({ ...d, heading: e.target.value })} /></div>
                <div className="md:col-span-2"><Label>Intro</Label><Textarea rows={2} value={d.intro} onChange={(e) => set({ ...d, intro: e.target.value })} /></div>
              </div>
              <Label>Category cards</Label>
              <RowList
                items={d.items}
                onChange={(items) => set({ ...d, items })}
                blank={{ title: "", tag: "", image: "" }}
                render={(item, upd) => (
                  <div className="grid md:grid-cols-3 gap-3">
                    <div><Label>Title</Label><Input value={item.title} onChange={(e) => upd({ ...item, title: e.target.value })} /></div>
                    <div><Label>Tag</Label><Input value={item.tag} onChange={(e) => upd({ ...item, tag: e.target.value })} /></div>
                    <div><Label>Image</Label><ImageUpload value={item.image} onChange={(url) => upd({ ...item, image: url ?? "" })} folder="home/categories" /></div>
                  </div>
                )}
              />
            </div>
          )} />

          <SectionEditor sectionKey="home.services" title="Services teaser" render={(d, set) => (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
                <div><Label>Link label</Label><Input value={d.linkLabel} onChange={(e) => set({ ...d, linkLabel: e.target.value })} /></div>
                <div><Label>Heading lead</Label><Input value={d.headingLead} onChange={(e) => set({ ...d, headingLead: e.target.value })} /></div>
                <div><Label>Heading italic</Label><Input value={d.headingItalic} onChange={(e) => set({ ...d, headingItalic: e.target.value })} /></div>
                <div className="md:col-span-2"><Label>Intro</Label><Textarea rows={2} value={d.intro} onChange={(e) => set({ ...d, intro: e.target.value })} /></div>
              </div>
              <Label>Service tiles</Label>
              <RowList
                items={d.items}
                onChange={(items) => set({ ...d, items })}
                blank={{ title: "", body: "" }}
                render={(item, upd) => (
                  <div className="grid md:grid-cols-3 gap-3">
                    <div><Label>Title</Label><Input value={item.title} onChange={(e) => upd({ ...item, title: e.target.value })} /></div>
                    <div className="md:col-span-2"><Label>Body</Label><Textarea rows={2} value={item.body} onChange={(e) => upd({ ...item, body: e.target.value })} /></div>
                  </div>
                )}
              />
            </div>
          )} />

          <SectionEditor sectionKey="home.contactCta" title="Contact CTA" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
              <div><Label>Primary CTA</Label><Input value={d.primaryCta} onChange={(e) => set({ ...d, primaryCta: e.target.value })} /></div>
              <div><Label>Heading lead</Label><Input value={d.headingLead} onChange={(e) => set({ ...d, headingLead: e.target.value })} /></div>
              <div><Label>Heading italic</Label><Input value={d.headingItalic} onChange={(e) => set({ ...d, headingItalic: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Body</Label><Textarea rows={2} value={d.body} onChange={(e) => set({ ...d, body: e.target.value })} /></div>
              <div><Label>Phone label</Label><Input value={d.phoneLabel} onChange={(e) => set({ ...d, phoneLabel: e.target.value })} /></div>
              <div><Label>Phone tel: link</Label><Input value={d.phoneTel} onChange={(e) => set({ ...d, phoneTel: e.target.value })} /></div>
            </div>
          )} />
        </>
      )}

      {tab === "about" && (
        <>
          <SectionEditor sectionKey="about.intro" title="Intro" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
              <div><Label>Heading italic</Label><Input value={d.headingItalic} onChange={(e) => set({ ...d, headingItalic: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Heading lead</Label><Input value={d.headingLead} onChange={(e) => set({ ...d, headingLead: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Intro paragraph</Label><Textarea rows={3} value={d.intro} onChange={(e) => set({ ...d, intro: e.target.value })} /></div>
            </div>
          )} />

          <SectionEditor sectionKey="about.founder" title="Founder" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
              <div><Label>Heading</Label><Input value={d.heading} onChange={(e) => set({ ...d, heading: e.target.value })} /></div>
              <div><Label>Portrait</Label><ImageUpload value={d.portrait} onChange={(url) => set({ ...d, portrait: url ?? "" })} folder="about" /></div>
              <div><Label>Credentials label</Label><Input value={d.credentialsLabel} onChange={(e) => set({ ...d, credentialsLabel: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Paragraphs</Label><StringList value={d.paragraphs} onChange={(v) => set({ ...d, paragraphs: v })} multiline /></div>
              <div className="md:col-span-2"><Label>Credentials</Label><StringList value={d.credentials} onChange={(v) => set({ ...d, credentials: v })} /></div>
            </div>
          )} />

          <SectionEditor sectionKey="about.process" title="Process" render={(d, set) => (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
                <div><Label>Heading</Label><Input value={d.heading} onChange={(e) => set({ ...d, heading: e.target.value })} /></div>
              </div>
              <Label>Steps</Label>
              <RowList
                items={d.steps}
                onChange={(steps) => set({ ...d, steps })}
                blank={{ title: "", body: "" }}
                render={(step, upd) => (
                  <div className="grid md:grid-cols-3 gap-3">
                    <div><Label>Title</Label><Input value={step.title} onChange={(e) => upd({ ...step, title: e.target.value })} /></div>
                    <div className="md:col-span-2"><Label>Body</Label><Textarea rows={2} value={step.body} onChange={(e) => upd({ ...step, body: e.target.value })} /></div>
                  </div>
                )}
              />
            </div>
          )} />

          <SectionEditor sectionKey="about.quote" title="Pull quote" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Background image</Label><ImageUpload value={d.image} onChange={(url) => set({ ...d, image: url ?? "" })} folder="about" /></div>
              <div className="md:col-span-2"><Label>Quote</Label><Textarea rows={3} value={d.quote} onChange={(e) => set({ ...d, quote: e.target.value })} /></div>
            </div>
          )} />

          <SectionEditor sectionKey="about.cta" title="Closing CTA" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Heading</Label><Input value={d.heading} onChange={(e) => set({ ...d, heading: e.target.value })} /></div>
              <div><Label>Button label</Label><Input value={d.buttonLabel} onChange={(e) => set({ ...d, buttonLabel: e.target.value })} /></div>
            </div>
          )} />
        </>
      )}

      {tab === "services" && (
        <>
          <SectionEditor sectionKey="services.header" title="Page header" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Heading</Label><Input value={d.heading} onChange={(e) => set({ ...d, heading: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Intro</Label><Textarea rows={2} value={d.intro} onChange={(e) => set({ ...d, intro: e.target.value })} /></div>
            </div>
          )} />

          <SectionEditor sectionKey="services.cards" title="Service cards" render={(d, set) => (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">Icon options: Home, Layout, Palette, Sparkles, Leaf, ClipboardCheck</p>
              <RowList
                items={d.items}
                onChange={(items) => set({ ...d, items })}
                blank={{ icon: "Home", title: "", body: "", for: "", from: "" }}
                render={(s, upd) => (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div><Label>Icon</Label><Input value={s.icon} onChange={(e) => upd({ ...s, icon: e.target.value })} /></div>
                    <div><Label>Title</Label><Input value={s.title} onChange={(e) => upd({ ...s, title: e.target.value })} /></div>
                    <div className="md:col-span-2"><Label>Body</Label><Textarea rows={2} value={s.body} onChange={(e) => upd({ ...s, body: e.target.value })} /></div>
                    <div><Label>Ideal for</Label><Input value={s.for} onChange={(e) => upd({ ...s, for: e.target.value })} /></div>
                    <div><Label>Investment</Label><Input value={s.from} onChange={(e) => upd({ ...s, from: e.target.value })} /></div>
                  </div>
                )}
              />
            </div>
          )} />

          <SectionEditor sectionKey="services.timeline" title="Timeline" render={(d, set) => (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
                <div><Label>Heading</Label><Input value={d.heading} onChange={(e) => set({ ...d, heading: e.target.value })} /></div>
              </div>
              <Label>Phases</Label>
              <RowList
                items={d.phases}
                onChange={(phases) => set({ ...d, phases })}
                blank={{ phase: "", duration: "" }}
                render={(p, upd) => (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div><Label>Phase</Label><Input value={p.phase} onChange={(e) => upd({ ...p, phase: e.target.value })} /></div>
                    <div><Label>Duration</Label><Input value={p.duration} onChange={(e) => upd({ ...p, duration: e.target.value })} /></div>
                  </div>
                )}
              />
            </div>
          )} />

          <SectionEditor sectionKey="services.cta" title="Closing CTA" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
              <div><Label>Button label</Label><Input value={d.buttonLabel} onChange={(e) => set({ ...d, buttonLabel: e.target.value })} /></div>
              <div><Label>Heading lead</Label><Input value={d.headingLead} onChange={(e) => set({ ...d, headingLead: e.target.value })} /></div>
              <div><Label>Heading italic</Label><Input value={d.headingItalic} onChange={(e) => set({ ...d, headingItalic: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Body</Label><Textarea rows={2} value={d.body} onChange={(e) => set({ ...d, body: e.target.value })} /></div>
            </div>
          )} />
        </>
      )}

      {tab === "contact" && (
        <>
          <SectionEditor sectionKey="contact.header" title="Page header" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
              <div><Label>Heading italic</Label><Input value={d.headingItalic} onChange={(e) => set({ ...d, headingItalic: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Heading lead</Label><Input value={d.headingLead} onChange={(e) => set({ ...d, headingLead: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Intro</Label><Textarea rows={2} value={d.intro} onChange={(e) => set({ ...d, intro: e.target.value })} /></div>
            </div>
          )} />

          <SectionEditor sectionKey="contact.options" title="Form options" render={(d, set) => (
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Project types</Label><StringList value={d.projectTypes} onChange={(v) => set({ ...d, projectTypes: v })} /></div>
              <div><Label>Budget ranges</Label><StringList value={d.budgets} onChange={(v) => set({ ...d, budgets: v })} /></div>
            </div>
          )} />

          <SectionEditor sectionKey="contact.nextSteps" title="What happens next" render={(d, set) => (
            <div className="space-y-3">
              <div><Label>Eyebrow</Label><Input value={d.eyebrow} onChange={(e) => set({ ...d, eyebrow: e.target.value })} /></div>
              <div><Label>Steps</Label><StringList value={d.steps} onChange={(v) => set({ ...d, steps: v })} multiline /></div>
            </div>
          )} />
        </>
      )}
    </div>
  );
}

function SectionEditor<K extends SectionKey>({
  sectionKey,
  title,
  render,
}: {
  sectionKey: K;
  title: string;
  render: (data: SiteContent[K], set: (v: SiteContent[K]) => void) => React.ReactNode;
}) {
  const [data, setData] = useState<SiteContent[K]>(DEFAULTS[sectionKey]);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSection(sectionKey).then((d) => { setData(d); setLoaded(true); });
  }, [sectionKey]);

  const save = async () => {
    setSaving(true);
    try {
      await saveSection(sectionKey, data);
      setMsg("Saved.");
      setTimeout(() => setMsg(null), 2500);
    } catch (e: any) {
      setMsg(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl">{title}</h3>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
          <Btn onClick={save} disabled={saving || !loaded}>{saving ? "Saving…" : "Save"}</Btn>
        </div>
      </div>
      {render(data, setData)}
    </Card>
  );
}

function StringList({ value, onChange, multiline }: { value: string[]; onChange: (v: string[]) => void; multiline?: boolean }) {
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline ? (
            <Textarea rows={2} value={v} onChange={(e) => onChange(value.map((x, j) => j === i ? e.target.value : x))} />
          ) : (
            <Input value={v} onChange={(e) => onChange(value.map((x, j) => j === i ? e.target.value : x))} />
          )}
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-xs text-destructive px-2 mt-2">×</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ""])} className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">+ Add item</button>
    </div>
  );
}

function RowList<T>({
  items, onChange, blank, render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  blank: T;
  render: (item: T, upd: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-border bg-background p-4 relative">
          <div className="absolute top-2 right-2 flex gap-1">
            <button type="button" disabled={i === 0} onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }} className="text-xs px-2 disabled:opacity-30">↑</button>
            <button type="button" disabled={i === items.length - 1} onClick={() => { const n = [...items]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; onChange(n); }} className="text-xs px-2 disabled:opacity-30">↓</button>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-xs text-destructive px-2">×</button>
          </div>
          {render(item, (next) => onChange(items.map((x, j) => j === i ? next : x)))}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { ...blank }])} className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">+ Add row</button>
    </div>
  );
}
