import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import hero from "@/assets/hero-1.jpg";
import designer from "@/assets/designer.jpg";
import { projects } from "@/lib/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "dl interiors — Residential Interior Design, Johannesburg & Pretoria" },
      { name: "description", content: "Warm, considered interior design for homes across Johannesburg, Pretoria and South Africa. Full-service residential studio." },
      { property: "og:title", content: "dl interiors — Residential Interior Design" },
      { property: "og:description", content: "Warm, considered homes across Johannesburg and Pretoria." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const differentiators = [
  { title: "Personal, not formulaic", body: "Every home begins with how you actually want to live in it — never a template." },
  { title: "Considered materials", body: "We specify natural stone, solid timber and linen-led textiles built to age beautifully." },
  { title: "End-to-end project care", body: "From concept and procurement to installation day — we hold every detail." },
  { title: "Local craftsmanship", body: "We collaborate with South African makers, joiners and ateliers on every project." },
];

const testimonials = [
  { name: "Anna & Pieter", project: "Westcliff Residence", quote: "They listened with extraordinary care. Our home now feels exactly like us — calm, warm and impossibly easy to live in." },
  { name: "Naledi M.", project: "Menlo Park Kitchen", quote: "The kitchen is now the room everyone gravitates to. Friends ask who designed it before they ask for wine." },
  { name: "Sam & Devan", project: "Saxonwold Suite", quote: "An incredibly thoughtful process. They quietly removed everything that wasn't needed." },
];

function Index() {
  const featured = projects.slice(0, 6);
  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img src={hero} alt="Sunlit luxury living room with linen sofa and travertine table" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background/80" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 md:pb-28">
          <p className="eyebrow text-foreground/70">Interior design studio · Est. Johannesburg</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] text-foreground md:text-7xl lg:text-8xl">
            Homes that quietly reflect <em className="italic text-primary">who you are.</em>
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/portfolio" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-primary">
              View our projects
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="text-xs uppercase tracking-[0.2em] underline-offset-8 hover:underline">
              Book a consultation
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-36 text-center">
        <p className="eyebrow">A studio practice</p>
        <p className="mt-6 font-serif text-3xl leading-snug md:text-5xl">
          We design full homes, individual rooms, and the small daily rituals that happen in between — with the same considered eye.
        </p>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">Recent projects</h2>
          </div>
          <Link to="/portfolio" className="hidden text-xs uppercase tracking-[0.2em] hover:underline underline-offset-8 md:inline">
            View all →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }} className="group block">
              <div className={`overflow-hidden bg-muted ${i % 5 === 0 ? "aspect-[4/5]" : "aspect-[4/5]"}`}>
                <img src={p.image} alt={p.title} loading="lazy" width={1280} height={1600} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="font-serif text-2xl">{p.title}</h3>
                <span className="text-xs text-muted-foreground">{p.year}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.style} · {p.location}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link to="/portfolio" className="text-xs uppercase tracking-[0.2em] underline underline-offset-8">View all projects</Link>
        </div>
      </section>

      {/* DESIGNER */}
      <section className="mx-auto mt-32 max-w-7xl px-6 md:mt-40">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="overflow-hidden bg-card aspect-[4/5]">
              <img src={designer} alt="Portrait of the founding designer" loading="lazy" width={1024} height={1280} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="eyebrow">The studio</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">A quietly considered approach to the homes we shape.</h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              dl interiors is an independent residential design studio working between Johannesburg
              and Pretoria. We take on a small number of projects each year so we can stay close
              to every drawing, every material sample and every install day.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:underline underline-offset-8">
              About the studio <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="mx-auto mt-32 max-w-7xl px-6 md:mt-40">
        <p className="eyebrow text-center">Why work with us</p>
        <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d, i) => (
            <div key={d.title} className="border-t border-border pt-6">
              <p className="font-serif text-2xl text-primary">0{i + 1}</p>
              <h3 className="mt-4 font-serif text-xl">{d.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mt-32 bg-card py-24 md:mt-40 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow text-center">In their words</p>
          <h2 className="mt-2 text-center font-serif text-4xl md:text-5xl">Clients</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col">
                <div className="mb-4 flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                </div>
                <blockquote className="font-serif text-xl leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="block font-medium">{t.name}</span>
                  <span className="text-muted-foreground">{t.project}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-32 text-center md:py-40">
        <p className="eyebrow">Begin a project</p>
        <h2 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">
          Ready to transform <em className="italic text-primary">your space?</em>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
          Every project starts with a conversation. Tell us a little about your home and we'll be in touch within a day.
        </p>
        <Link to="/contact" className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] text-background hover:bg-primary transition-colors">
          Book a free consultation <ArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}
