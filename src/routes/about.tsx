import { createFileRoute, Link } from "@tanstack/react-router";
import designer from "@/assets/designer.jpg";
import lounge from "@/assets/project-lounge.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — dl interiors" },
      { name: "description", content: "An independent residential interior design studio led from Johannesburg, working across South Africa." },
      { property: "og:title", content: "About — dl interiors" },
      { property: "og:description", content: "An independent residential interior design studio led from Johannesburg." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const process = [
  { step: "01", title: "Discovery", body: "We meet in your home, listen carefully, and understand how you live before we draw a single line." },
  { step: "02", title: "Concept", body: "We present a complete design direction — palette, materials, planning, references — for you to react to." },
  { step: "03", title: "Refinement", body: "Together we evolve the design, choose every finish, and confirm the budget and timeline." },
  { step: "04", title: "Procurement", body: "We manage every order, every maker and every delivery so you don't have to." },
  { step: "05", title: "Install & Reveal", body: "We hand over a finished home, styled and ready to live in — often in a single day." },
];

const credentials = [
  "10+ years in South African residential design",
  "Full-service from concept to install",
  "Member, IID South Africa",
  "Featured in Visi & House and Leisure",
];

function AboutPage() {
  return (
    <div className="pt-32 md:pt-40">
      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow">About the studio</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-7xl">
              A small studio, shaping homes with <em className="italic text-primary">unhurried care.</em>
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-base leading-relaxed text-muted-foreground">
              dl interiors was founded on a simple idea: that the homes we love most are the ones designed slowly,
              with materials chosen by hand and rooms planned around the people who live in them.
            </p>
          </div>
        </div>
      </section>

      {/* Portrait */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-12 px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden bg-card">
            <img src={designer} alt="Founding designer portrait" loading="lazy" width={1024} height={1280} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="eyebrow">Founder</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">A practice built on listening.</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              After a decade designing for some of South Africa's most respected residential studios, the
              founder of dl interiors set out to build a smaller, more personal practice — one that
              could give every project the attention it deserves.
            </p>
            <p>
              The work is rooted in warmth, restraint, and a respect for the way light moves through a
              Highveld home. We believe great interiors are felt before they are noticed.
            </p>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <p className="eyebrow mb-4">Credentials</p>
            <ul className="grid gap-2 text-sm md:grid-cols-2">
              {credentials.map((c) => <li key={c} className="text-foreground/80">— {c}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <p className="eyebrow">How we work</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl md:text-5xl">A clear, calm process — from first conversation to the day you move back in.</h2>
        <div className="mt-12 grid gap-px overflow-hidden border border-border md:grid-cols-5">
          {process.map((p) => (
            <div key={p.step} className="bg-background p-8">
              <p className="font-serif text-2xl text-primary">{p.step}</p>
              <h3 className="mt-6 font-serif text-xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote image */}
      <section className="relative mt-32 h-[60svh] min-h-[420px] w-full overflow-hidden">
        <img src={lounge} alt="Interior detail" loading="lazy" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/55" />
        <div className="relative z-10 mx-auto flex h-full max-w-4xl items-center px-6 text-center">
          <blockquote className="font-serif text-3xl leading-snug md:text-5xl">
            "We design for how a home will feel on an ordinary Tuesday — not just how it photographs on the day we finish."
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <h2 className="font-serif text-4xl md:text-5xl">Like what you see?</h2>
        <Link to="/contact" className="mt-8 inline-block rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] text-background hover:bg-primary transition-colors">
          Start a conversation
        </Link>
      </section>
    </div>
  );
}
