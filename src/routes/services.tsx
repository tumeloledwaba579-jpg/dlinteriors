import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Layout, Palette, Sparkles, Leaf, ClipboardCheck } from "lucide-react";

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

const services = [
  {
    icon: Home,
    title: "Full Interior Design",
    body: "End-to-end design from concept through procurement to install day — typically for new homes, full renovations or complete refurnishings.",
    for: "Homeowners taking on a whole house or major renovation.",
    from: "From R85,000",
  },
  {
    icon: Layout,
    title: "Space Planning & Layout",
    body: "Floor plans, joinery design and furniture layouts that resolve how rooms actually work — flow, function, light, and proportion.",
    for: "Renovations, extensions or rooms that simply don't sit right.",
    from: "From R18,000",
  },
  {
    icon: Sparkles,
    title: "Styling & Curation",
    body: "We restyle existing rooms, source new pieces and curate a refreshed look using what you have alongside considered additions.",
    for: "Homes that need a refresh, not a renovation.",
    from: "From R12,000",
  },
  {
    icon: Palette,
    title: "Color & Material Consultation",
    body: "A focused engagement to develop a cohesive palette and material strategy across your home — paints, finishes, fabrics and timber.",
    for: "Clients self-managing a build who need a guiding eye.",
    from: "From R8,500",
  },
  {
    icon: Leaf,
    title: "Sustainably-led Design",
    body: "Built around durable, locally sourced and naturally derived materials — designed to last decades, not seasons.",
    for: "Homes built to last and tread lightly.",
    from: "Included in all services",
  },
  {
    icon: ClipboardCheck,
    title: "Project Management",
    body: "On-site coordination with contractors, joiners and suppliers — we keep the build moving and the details correct.",
    for: "Anyone who wants their project handed over fully resolved.",
    from: "Scoped per project",
  },
];

const phases = [
  { phase: "Discovery", duration: "1–2 weeks" },
  { phase: "Concept", duration: "3–4 weeks" },
  { phase: "Refinement", duration: "2–3 weeks" },
  { phase: "Procurement", duration: "8–14 weeks" },
  { phase: "Install & Reveal", duration: "1–2 days" },
];

function ServicesPage() {
  return (
    <div className="pt-32 md:pt-40">
      <header className="mx-auto max-w-7xl px-6">
        <p className="eyebrow">Services</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">
          Considered design, at every scale of project.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">
          We work with private clients across full home design, individual rooms, and focused consulting engagements.
        </p>
      </header>

      <section className="mx-auto mt-20 max-w-7xl px-6">
        <div className="grid gap-px overflow-hidden border border-border md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="bg-background p-8 md:p-10">
                <Icon className="text-primary" size={28} strokeWidth={1.25} />
                <h2 className="mt-6 font-serif text-2xl">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <div className="mt-6 space-y-1 text-xs text-muted-foreground">
                  <p><span className="text-foreground/70">Ideal for:</span> {s.for}</p>
                  <p><span className="text-foreground/70">Investment:</span> {s.from}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process timeline */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <p className="eyebrow">A typical project</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl md:text-5xl">From first conversation to handover — usually 4 to 6 months.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {phases.map((p, i) => (
            <div key={p.phase} className="border-t border-border pt-4">
              <p className="font-serif text-xl text-primary">0{i + 1}</p>
              <p className="mt-3 font-serif text-lg">{p.phase}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.duration}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="eyebrow">Begin</p>
        <h2 className="mt-4 font-serif text-4xl md:text-6xl leading-tight">
          Every project starts with <em className="italic text-primary">a conversation.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground">
          Tell us about your home, your timeline and what's important to you — we'll come back to you within a day.
        </p>
        <Link to="/contact" className="mt-10 inline-block rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] text-background hover:bg-primary transition-colors">
          Book a free consultation
        </Link>
      </section>
    </div>
  );
}
