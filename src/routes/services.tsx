import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Layout, Palette, Sparkles, Leaf, ClipboardCheck, type LucideIcon } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — dl interiors" },
      { name: "description", content: "Full interior design, space planning, styling, color consultation and project management for residential clients in South Africa." },
      { property: "og:title", content: "Services — dl interiors" },
      { property: "og:description", content: "Full-service residential interior design from Johannesburg & Pretoria." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const ICONS: Record<string, LucideIcon> = { Home, Layout, Palette, Sparkles, Leaf, ClipboardCheck };

function ServicesPage() {
  const header = useSiteContent("services.header");
  const cards = useSiteContent("services.cards");
  const timeline = useSiteContent("services.timeline");
  const cta = useSiteContent("services.cta");

  return (
    <div className="pt-32 md:pt-40">
      <header className="mx-auto max-w-7xl px-6">
        <p className="eyebrow">{header.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">{header.heading}</h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">{header.intro}</p>
      </header>

      <section className="mx-auto mt-20 max-w-7xl px-6">
        <div className="grid gap-px overflow-hidden border border-border md:grid-cols-2 lg:grid-cols-3">
          {cards.items.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Home;
            return (
              <div key={i} className="bg-background p-8 md:p-10">
                <Icon className="text-primary" size={28} strokeWidth={1.25} />
                <h2 className="mt-6 font-serif text-2xl">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <div className="mt-6 space-y-1 text-xs text-muted-foreground">
                  {s.for && <p><span className="text-foreground/70">Ideal for:</span> {s.for}</p>}
                  {s.from && <p><span className="text-foreground/70">Investment:</span> {s.from}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-32 max-w-7xl px-6">
        <p className="eyebrow">{timeline.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl md:text-5xl">{timeline.heading}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {timeline.phases.map((p, i) => (
            <div key={i} className="border-t border-border pt-4">
              <p className="font-serif text-xl text-primary">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 font-serif text-lg">{p.phase}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.duration}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="eyebrow">{cta.eyebrow}</p>
        <h2 className="mt-4 font-serif text-4xl md:text-6xl leading-tight">
          {cta.headingLead} <em className="italic text-primary">{cta.headingItalic}</em>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground">{cta.body}</p>
        <Link to="/contact" className="mt-10 inline-block rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] text-background hover:bg-primary transition-colors">
          {cta.buttonLabel}
        </Link>
      </section>
    </div>
  );
}
