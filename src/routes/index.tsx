import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";

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

function Index() {
  const hero = useSiteContent("home.hero");
  const profile = useSiteContent("home.profile");
  const cats = useSiteContent("home.categories");
  const svc = useSiteContent("home.services");
  const cta = useSiteContent("home.contactCta");

  return (
    <>
      <section className="relative h-[85svh] min-h-[520px] w-full overflow-hidden md:min-h-[640px]">
        <img src={hero.image} alt="" width={1920} height={1080} fetchPriority="high" decoding="async" sizes="100vw" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow text-background/80">{hero.eyebrow}</p>
          <h1 className="mt-6 font-serif text-5xl leading-[1] text-background sm:text-6xl md:text-8xl lg:text-9xl">
            {hero.titleLead} <em className="italic">{hero.titleItalic}</em>
          </h1>
          <p className="mt-5 max-w-xl text-xs uppercase tracking-[0.24em] text-background/85 sm:text-sm sm:tracking-[0.28em]">{hero.tagline}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-12">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-foreground sm:px-8 sm:py-3.5">
              {hero.primaryCta}
            </Link>
            {hero.phoneLabel && (
              <a href={`tel:${hero.phoneTel}`} className="inline-flex items-center gap-2 rounded-full bg-background/95 px-6 py-3 text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-background sm:px-8 sm:py-3.5">
                <Phone size={13} /> {hero.phoneLabel}
              </a>
            )}
          </div>
        </div>
      </section>


      <section id="profile" className="mx-auto max-w-7xl px-6 py-16 md:py-36">
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-14">
          <div className="md:col-span-5">
            <div className="mx-auto aspect-[4/5] max-w-xs overflow-hidden bg-card sm:max-w-sm md:max-w-none">
              <img src={profile.portrait} alt="Founding designer portrait" loading="lazy" decoding="async" width={1024} height={1280} sizes="(max-width: 768px) 80vw, 40vw" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="md:col-span-7">
            <p className="eyebrow">{profile.eyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
              {profile.headingLead} <em className="italic text-primary">{profile.headingItalic}</em> {profile.headingTail}
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              {profile.paragraphs.map((p, i) => (
                <p key={i} className={i === 1 ? "italic text-foreground/80" : ""}>{p}</p>
              ))}
            </div>
            <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] hover:underline underline-offset-8">
              {profile.linkLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-card py-16 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="eyebrow">{cats.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-6xl">{cats.heading}</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground">{cats.intro}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 md:gap-6 lg:grid-cols-3">
            {cats.items.map((c) => (
              <Link key={c.title} to="/portfolio" className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-muted md:aspect-[4/3]">
                  <img src={c.image} alt={c.title} loading="lazy" decoding="async" width={1200} height={900} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-background/75">{c.tag}</p>
                    <h3 className="mt-1 font-serif text-2xl text-background md:text-3xl">{c.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>


          <div className="mt-14 text-center">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] underline underline-offset-8">
              {cats.linkLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-16 md:py-32">
        <div className="max-w-3xl">
          <p className="eyebrow">{svc.eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-6xl">
            {svc.headingLead} <span className="text-primary">|</span> {svc.headingItalic}
          </h2>
          <p className="mt-5 text-base text-muted-foreground">{svc.intro}</p>
        </div>


        <div className="mt-16 grid gap-px overflow-hidden border border-border md:grid-cols-2 lg:grid-cols-4">
          {svc.items.map((s, i) => (
            <div key={i} className="bg-background p-8">
              <p className="font-serif text-xl text-primary">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 font-serif text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] hover:underline underline-offset-8">
            {svc.linkLabel} <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section id="get-in-touch" className="bg-foreground py-28 md:py-36 text-background">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="eyebrow text-background/70">{cta.eyebrow}</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">
            {cta.headingLead} <em className="italic text-accent">{cta.headingItalic}</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-background/70">{cta.body}</p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact" className="rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.22em] text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              {cta.primaryCta}
            </Link>
            {cta.phoneLabel && (
              <a href={`tel:${cta.phoneTel}`} className="inline-flex items-center gap-2 rounded-full border border-background/40 px-8 py-4 text-xs uppercase tracking-[0.22em] hover:bg-background hover:text-foreground transition-colors">
                <Phone size={13} /> {cta.phoneLabel}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
