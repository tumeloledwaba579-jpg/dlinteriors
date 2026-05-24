import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getProject, projects } from "@/lib/projects";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.project;
    return {
      meta: [
        { title: `${p?.title ?? "Project"} — dl interiors` },
        { name: "description", content: p ? `${p.style} ${p.space.toLowerCase()} in ${p.location}. ${p.challenge}` : "Interior design project by dl interiors." },
        { property: "og:title", content: `${p?.title} — dl interiors` },
        { property: "og:description", content: p?.narrative ?? "" },
        { property: "og:url", content: `/portfolio/${params.slug}` },
        { property: "og:type", content: "article" },
        ...(p?.image ? [{ property: "og:image", content: p.image }] : []),
      ],
      links: [{ rel: "canonical", href: `/portfolio/${params.slug}` }],
      scripts: p ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          image: p.image,
          datePublished: `${p.year}-01-01`,
          author: { "@type": "Organization", name: "dl interiors" },
        }),
      }] : [],
    };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <article className="pb-24">
      {/* Hero image */}
      <div className="relative h-[78svh] min-h-[520px] w-full overflow-hidden">
        <img src={project.image} alt={project.title} width={1920} height={1200} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/70" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16">
          <p className="eyebrow">{project.style} · {project.location}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[1.05] md:text-7xl">{project.title}</h1>
        </div>
      </div>

      {/* Meta */}
      <section className="mx-auto mt-16 max-w-7xl px-6">
        <div className="grid gap-8 border-y border-border py-8 md:grid-cols-4 md:gap-12">
          <div><p className="eyebrow">Location</p><p className="mt-2 font-serif text-xl">{project.location}</p></div>
          <div><p className="eyebrow">Space</p><p className="mt-2 font-serif text-xl">{project.space}</p></div>
          <div><p className="eyebrow">Style</p><p className="mt-2 font-serif text-xl">{project.style}</p></div>
          <div><p className="eyebrow">Year</p><p className="mt-2 font-serif text-xl">{project.year}</p></div>
        </div>
      </section>

      {/* Narrative */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-12 px-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow">The brief</p>
        </div>
        <div className="md:col-span-7 space-y-6 text-lg leading-relaxed">
          <p>{project.challenge}</p>
          <p>{project.solution}</p>
          <p className="italic text-muted-foreground">{project.narrative}</p>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto mt-20 max-w-7xl space-y-6 px-6">
        {project.gallery.map((src: string, i: number) => (
          <div key={i} className={`overflow-hidden bg-muted ${i % 2 === 0 ? "aspect-[16/10]" : "grid gap-6 md:grid-cols-2 bg-transparent"}`}>
            {i % 2 === 0 ? (
              <img src={src} alt={`${project.title} — view ${i + 1}`} loading="lazy" width={1920} height={1200} className="h-full w-full object-cover" />
            ) : (
              <>
                <img src={src} alt={`${project.title} — view ${i + 1}`} loading="lazy" width={1280} height={1600} className="aspect-[4/5] w-full object-cover" />
                {project.gallery[i + 1] && (
                  <img src={project.gallery[i + 1]} alt={`${project.title} — view ${i + 2}`} loading="lazy" width={1280} height={1600} className="aspect-[4/5] w-full object-cover" />
                )}
              </>
            )}
          </div>
        ))}
      </section>

      {/* Palette + materials */}
      <section className="mx-auto mt-24 grid max-w-7xl gap-16 px-6 md:grid-cols-2">
        <div>
          <p className="eyebrow">Palette</p>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {project.palette.map((c: { name: string; hex: string }) => (
              <div key={c.hex}>
                <div className="aspect-square w-full" style={{ backgroundColor: c.hex }} />
                <p className="mt-2 text-xs">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.hex}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Key materials</p>
          <ul className="mt-6 space-y-3 font-serif text-2xl">
            {project.materials.map((m: string) => <li key={m} className="border-b border-border pb-3">{m}</li>)}
          </ul>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <h2 className="font-serif text-3xl md:text-4xl">Related projects</h2>
          <Link to="/portfolio" className="text-xs uppercase tracking-[0.2em] hover:underline underline-offset-8">All work →</Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {related.map((p) => (
            <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }} className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src={p.image} alt={p.title} loading="lazy" width={1280} height={1600} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
              </div>
              <h3 className="mt-4 font-serif text-xl">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.style}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 flex max-w-7xl items-center justify-between gap-6 border-t border-border px-6 pt-10">
        <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:underline underline-offset-8">
          <ArrowLeft size={14} /> Back to portfolio
        </Link>
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] text-background hover:bg-primary transition-colors">
          Start your project <ArrowRight size={14} />
        </Link>
      </section>
    </article>
  );
}
