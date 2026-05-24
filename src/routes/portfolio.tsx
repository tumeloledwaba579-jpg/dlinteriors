import { createFileRoute, Link } from "@tanstack/react-router";
import { projects } from "@/lib/projects";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — dl interiors" },
      { name: "description", content: "Selected residential interior design projects from dl interiors across Johannesburg, Pretoria and South Africa." },
      { property: "og:title", content: "Portfolio — dl interiors" },
      { property: "og:description", content: "Selected residential projects from across South Africa." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <div className="pt-32 md:pt-40">
      <header className="mx-auto max-w-7xl px-6">
        <p className="eyebrow">Portfolio</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">
          A small, careful body of work.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">
          We take on a limited number of residential commissions each year. These are recent projects we're proud of.
        </p>
      </header>

      <div className="mx-auto mt-16 max-w-7xl px-6 pb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              to="/portfolio/$slug"
              params={{ slug: p.slug }}
              className={`group block ${i % 3 === 0 ? "md:col-span-2" : ""}`}
            >
              <div className={`overflow-hidden bg-muted ${i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/5]"}`}>
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  width={1280}
                  height={1600}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl">{p.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{p.style} · {p.space} · {p.location}</p>
                </div>
                <span className="text-xs text-muted-foreground">{p.year}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
