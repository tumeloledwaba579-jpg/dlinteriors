import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import hero from "@/assets/hero-1.jpg";
import designer from "@/assets/designer.jpg";
import lounge from "@/assets/project-lounge.jpg";
import kitchen from "@/assets/project-kitchen.jpg";
import bedroom from "@/assets/project-bedroom.jpg";
import bath from "@/assets/project-bath.jpg";
import dining from "@/assets/project-dining.jpg";
import office from "@/assets/project-office.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "dl interiors — Residential Interior Design, Johannesburg & Pretoria" },
      { name: "description", content: "Full turnkey and consultation interior design across residential, corporate, hospitality and retail projects in South Africa." },
      { property: "og:title", content: "dl interiors — Interior Design Studio" },
      { property: "og:description", content: "Full turnkey interior design across South Africa." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const categories = [
  { title: "Current Projects", image: lounge, tag: "In progress" },
  { title: "Residential", image: bedroom, tag: "Homes & apartments" },
  { title: "Kitchens", image: kitchen, tag: "Bespoke joinery" },
  { title: "Bathrooms", image: bath, tag: "Sculptural calm" },
  { title: "Corporate & Hospitality", image: office, tag: "Studios, lodges, offices" },
  { title: "International", image: dining, tag: "Beyond South Africa" },
];

const serviceGroups = [
  {
    title: "Small to Medium Projects",
    body: "From a single room through to medium-sized luxury homes, hospitality, retail and corporate spaces.",
  },
  {
    title: "Large Scale Projects",
    body: "Corporate interiors, boutique hotels, restaurants, clubs, large residences and game lodges.",
  },
  {
    title: "Construction & Renovations",
    body: "We outsource and project-manage builds, liaising with architects and contractors to your brief.",
  },
  {
    title: "Hard Finishes",
    body: "Tile layouts and choices, ceiling design, bathroom layout, sanitary ware, lighting design.",
  },
  {
    title: "Soft Finishes",
    body: "Fabrics, window treatments, headboards, ottomans, chairs, sofas — layered with intent.",
  },
  {
    title: "Custom Furniture",
    body: "Sofas, chairs, tables, TV units and home theatres — designed uniquely to your lifestyle.",
  },
  {
    title: "Accessories & Art",
    body: "For the perfect finish we hand-pick antiques, rugs, art and framing.",
  },
  {
    title: "Specifying & Sourcing",
    body: "We specify and source anything the home requires — cutlery, crockery, linen and beyond.",
  },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img src={hero} alt="Elegant interior with layered lighting and natural materials" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow text-background/80">Interior Design Studio</p>
          <h1 className="mt-6 font-serif text-6xl leading-[1] text-background md:text-8xl lg:text-9xl">
            dl <em className="italic">interiors</em>
          </h1>
          <p className="mt-6 max-w-xl text-sm uppercase tracking-[0.28em] text-background/85">
            Residential · Corporate · Hospitality · Retail
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-foreground">
              Get in touch
            </Link>
            <a href="tel:+27114476016" className="inline-flex items-center gap-2 rounded-full bg-background/95 px-8 py-3.5 text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-background">
              <Phone size={13} /> 011 447 6016
            </a>
          </div>
        </div>
      </section>

      {/* PROFILE */}
      <section id="profile" className="mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <div className="overflow-hidden bg-card aspect-[4/5]">
              <img src={designer} alt="Founding designer portrait" loading="lazy" width={1024} height={1280} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="eyebrow">Profile</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
              An interior design practice with a <em className="italic text-primary">quietly prestigious</em> reputation.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                dl interiors works across residential, corporate, hospitality and retail projects.
                The studio offers a full turnkey service as well as focused consultation on
                specific rooms, and collaborates fluently with architects, garden designers
                and specialist trades.
              </p>
              <p className="italic text-foreground/80">
                Efficient and professional service with a deep commitment to well-researched,
                innovative design and hands-on personal care. Every scheme is directed at the
                client's specific needs — through extensive client and designer dialogue.
              </p>
              <p>
                Over the years the studio has developed a trusted network of highly skilled
                builders, upholsterers, curtain makers and paint specialists — an
                infrastructure that quietly holds every project together.
              </p>
            </div>
            <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] hover:underline underline-offset-8">
              More about the studio <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO CATEGORIES */}
      <section className="bg-card py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="eyebrow">Our Portfolio</p>
            <h2 className="mt-3 font-serif text-4xl md:text-6xl">Selected work, by category.</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground">
              A body of work spanning private homes, corporate spaces, hotels and international commissions.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link key={c.title} to="/portfolio" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={c.image} alt={c.title} loading="lazy" width={1200} height={900} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-background/75">{c.tag}</p>
                    <h3 className="mt-1 font-serif text-3xl text-background">{c.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] underline underline-offset-8">
              View the full portfolio <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="eyebrow">Services</p>
          <h2 className="mt-3 font-serif text-4xl md:text-6xl">
            From consultation only <span className="text-primary">|</span> to full turnkey projects.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Including large and small renovations. The studio scales its involvement to suit each commission — from a single room to a full estate.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden border border-border md:grid-cols-2 lg:grid-cols-4">
          {serviceGroups.map((s, i) => (
            <div key={s.title} className="bg-background p-8">
              <p className="font-serif text-xl text-primary">0{i + 1}</p>
              <h3 className="mt-4 font-serif text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] hover:underline underline-offset-8">
            Explore all services <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="get-in-touch" className="bg-foreground py-28 md:py-36 text-background">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="eyebrow text-background/70">Get in touch</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">
            Let's begin the <em className="italic text-accent">conversation.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-background/70">
            Tell us about your project — residential, corporate or hospitality — and we'll be in touch within a day.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact" className="rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.22em] text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Contact the studio
            </Link>
            <a href="tel:+27114476016" className="inline-flex items-center gap-2 rounded-full border border-background/40 px-8 py-4 text-xs uppercase tracking-[0.22em] hover:bg-background hover:text-foreground transition-colors">
              <Phone size={13} /> 011 447 6016
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
