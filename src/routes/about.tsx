import { createFileRoute, Link } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/site-content";

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

function AboutPage() {
  const intro = useSiteContent("about.intro");
  const founder = useSiteContent("about.founder");
  const process = useSiteContent("about.process");
  const quote = useSiteContent("about.quote");
  const cta = useSiteContent("about.cta");

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow">{intro.eyebrow}</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-7xl">
              {intro.headingLead} <em className="italic text-primary">{intro.headingItalic}</em>
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-base leading-relaxed text-muted-foreground">{intro.intro}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-12 px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden bg-card">
            <img src={founder.portrait} alt="Founding designer portrait" loading="lazy" width={1024} height={1280} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="eyebrow">{founder.eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">{founder.heading}</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            {founder.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {founder.credentials.length > 0 && (
            <div className="mt-10 border-t border-border pt-6">
              <p className="eyebrow mb-4">{founder.credentialsLabel}</p>
              <ul className="grid gap-2 text-sm md:grid-cols-2">
                {founder.credentials.map((c) => <li key={c} className="text-foreground/80">— {c}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-32 max-w-7xl px-6">
        <p className="eyebrow">{process.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl md:text-5xl">{process.heading}</h2>
        <div className="mt-12 grid gap-px overflow-hidden border border-border md:grid-cols-5">
          {process.steps.map((p, i) => (
            <div key={i} className="bg-background p-8">
              <p className="font-serif text-2xl text-primary">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-6 font-serif text-xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mt-32 h-[60svh] min-h-[420px] w-full overflow-hidden">
        <img src={quote.image} alt="" loading="lazy" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/55" />
        <div className="relative z-10 mx-auto flex h-full max-w-4xl items-center px-6 text-center">
          <blockquote className="font-serif text-3xl leading-snug md:text-5xl">
            &ldquo;{quote.quote}&rdquo;
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <h2 className="font-serif text-4xl md:text-5xl">{cta.heading}</h2>
        <Link to="/contact" className="mt-8 inline-block rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] text-background hover:bg-primary transition-colors">
          {cta.buttonLabel}
        </Link>
      </section>
    </div>
  );
}
