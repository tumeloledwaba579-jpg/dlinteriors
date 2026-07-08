import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { projects as staticProjects } from "@/lib/projects";
import { supabase } from "@/integrations/supabase/client";

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
  const [items, setItems] = useState(staticProjects.map(p => ({ slug: p.slug, title: p.title, location: p.location, style: p.style, space: p.space, year: p.year, image: p.image })));
  const [active, setActive] = useState<string>("All");

  useEffect(() => {
    supabase.from("projects").select("slug,title,location,style,space,year,cover_image,sort_order").eq("published", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setItems(data.map(d => ({ slug: d.slug, title: d.title, location: d.location, style: d.style, space: d.space, year: d.year, image: d.cover_image ?? "" })));
    });
  }, []);

  const filters = useMemo(() => {
    const spaces = Array.from(new Set(items.map(i => i.space).filter(Boolean)));
    return ["All", ...spaces];
  }, [items]);

  const visible = active === "All" ? items : items.filter(i => i.space === active);

  return (
    <div className="pt-24 md:pt-32">
      <header className="mx-auto max-w-7xl px-6 text-center">
        <h1 className="font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
          Portfolio
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          A selection of recent residential commissions across South Africa.
        </p>
      </header>

      {/* Filter chips — Lynne Blumberg style */}
      <div className="mx-auto mt-8 max-w-7xl px-6 md:mt-10">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {filters.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                className={`rounded-md border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors md:px-5 md:py-2.5 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 pb-16 md:mt-10 md:px-6">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-1.5 lg:grid-cols-4">

          {visible.map((p) => (
            <Link
              key={p.slug}
              to="/portfolio/$slug"
              params={{ slug: p.slug }}
              className="group relative block overflow-hidden bg-muted"
              aria-label={p.title}
            >
              <div className="aspect-[4/3] w-full">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="p-3 md:p-4">
                  <p className="font-serif text-sm text-background md:text-base">{p.title}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-background/80">{p.space}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
