import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-1.jpg";
import designer from "@/assets/designer.jpg";
import lounge from "@/assets/project-lounge.jpg";
import kitchen from "@/assets/project-kitchen.jpg";
import bedroom from "@/assets/project-bedroom.jpg";
import bath from "@/assets/project-bath.jpg";
import dining from "@/assets/project-dining.jpg";
import office from "@/assets/project-office.jpg";

export type CategoryItem = { title: string; tag: string; image: string };
export type ServiceTeaser = { title: string; body: string };
export type ProcessStep = { title: string; body: string };
export type ServiceCard = { icon: string; title: string; body: string; for: string; from: string };
export type Phase = { phase: string; duration: string };
export type NextStep = { label: string };

export type SiteContent = {
  "site.branding": {
    studioName: string;
    studioMark: string;
    tagline: string;
    headerCta: string;
    footerAbout: string;
    footerCredit: string;
  };
  "home.hero": {
    eyebrow: string;
    titleLead: string;
    titleItalic: string;
    tagline: string;
    primaryCta: string;
    phoneLabel: string;
    phoneTel: string;
    image: string;
  };
  "home.profile": {
    eyebrow: string;
    headingLead: string;
    headingItalic: string;
    headingTail: string;
    paragraphs: string[];
    portrait: string;
    linkLabel: string;
  };
  "home.categories": {
    eyebrow: string;
    heading: string;
    intro: string;
    items: CategoryItem[];
    linkLabel: string;
  };
  "home.services": {
    eyebrow: string;
    headingLead: string;
    headingItalic: string;
    intro: string;
    items: ServiceTeaser[];
    linkLabel: string;
  };
  "home.contactCta": {
    eyebrow: string;
    headingLead: string;
    headingItalic: string;
    body: string;
    primaryCta: string;
    phoneLabel: string;
    phoneTel: string;
  };
  "about.intro": {
    eyebrow: string;
    headingLead: string;
    headingItalic: string;
    intro: string;
  };
  "about.founder": {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    portrait: string;
    credentialsLabel: string;
    credentials: string[];
  };
  "about.process": {
    eyebrow: string;
    heading: string;
    steps: ProcessStep[];
  };
  "about.quote": {
    image: string;
    quote: string;
  };
  "about.cta": {
    heading: string;
    buttonLabel: string;
  };
  "services.header": {
    eyebrow: string;
    heading: string;
    intro: string;
  };
  "services.cards": {
    items: ServiceCard[];
  };
  "services.timeline": {
    eyebrow: string;
    heading: string;
    phases: Phase[];
  };
  "services.cta": {
    eyebrow: string;
    headingLead: string;
    headingItalic: string;
    body: string;
    buttonLabel: string;
  };
  "contact.header": {
    eyebrow: string;
    headingLead: string;
    headingItalic: string;
    intro: string;
  };
  "contact.options": {
    projectTypes: string[];
    budgets: string[];
  };
  "contact.nextSteps": {
    eyebrow: string;
    steps: string[];
  };
};

export type SectionKey = keyof SiteContent;

export const DEFAULTS: SiteContent = {
  "site.branding": {
    studioName: "interiors",
    studioMark: "dl",
    tagline: "Interior Design Studio",
    headerCta: "Book Consultation",
    footerAbout:
      "A residential interior design studio based between Johannesburg and Pretoria, shaping warm, considered homes across South Africa.",
    footerCredit: "Designed in Johannesburg.",
  },
  "home.hero": {
    eyebrow: "Interior Design Studio",
    titleLead: "dl",
    titleItalic: "interiors",
    tagline: "Residential · Corporate · Hospitality · Retail",
    primaryCta: "Get in touch",
    phoneLabel: "011 447 6016",
    phoneTel: "+27114476016",
    image: hero,
  },
  "home.profile": {
    eyebrow: "Profile",
    headingLead: "An interior design practice with a",
    headingItalic: "quietly prestigious",
    headingTail: "reputation.",
    paragraphs: [
      "dl interiors works across residential, corporate, hospitality and retail projects. The studio offers a full turnkey service as well as focused consultation on specific rooms, and collaborates fluently with architects, garden designers and specialist trades.",
      "Efficient and professional service with a deep commitment to well-researched, innovative design and hands-on personal care. Every scheme is directed at the client's specific needs — through extensive client and designer dialogue.",
      "Over the years the studio has developed a trusted network of highly skilled builders, upholsterers, curtain makers and paint specialists — an infrastructure that quietly holds every project together.",
    ],
    portrait: designer,
    linkLabel: "More about the studio",
  },
  "home.categories": {
    eyebrow: "Our Portfolio",
    heading: "Selected work, by category.",
    intro:
      "A body of work spanning private homes, corporate spaces, hotels and international commissions.",
    items: [
      { title: "Current Projects", image: lounge, tag: "In progress" },
      { title: "Residential", image: bedroom, tag: "Homes & apartments" },
      { title: "Kitchens", image: kitchen, tag: "Bespoke joinery" },
      { title: "Bathrooms", image: bath, tag: "Sculptural calm" },
      { title: "Corporate & Hospitality", image: office, tag: "Studios, lodges, offices" },
      { title: "International", image: dining, tag: "Beyond South Africa" },
    ],
    linkLabel: "View the full portfolio",
  },
  "home.services": {
    eyebrow: "Services",
    headingLead: "From consultation only",
    headingItalic: "to full turnkey projects.",
    intro:
      "Including large and small renovations. The studio scales its involvement to suit each commission — from a single room to a full estate.",
    items: [
      { title: "Small to Medium Projects", body: "From a single room through to medium-sized luxury homes, hospitality, retail and corporate spaces." },
      { title: "Large Scale Projects", body: "Corporate interiors, boutique hotels, restaurants, clubs, large residences and game lodges." },
      { title: "Construction & Renovations", body: "We outsource and project-manage builds, liaising with architects and contractors to your brief." },
      { title: "Hard Finishes", body: "Tile layouts and choices, ceiling design, bathroom layout, sanitary ware, lighting design." },
      { title: "Soft Finishes", body: "Fabrics, window treatments, headboards, ottomans, chairs, sofas — layered with intent." },
      { title: "Custom Furniture", body: "Sofas, chairs, tables, TV units and home theatres — designed uniquely to your lifestyle." },
      { title: "Accessories & Art", body: "For the perfect finish we hand-pick antiques, rugs, art and framing." },
      { title: "Specifying & Sourcing", body: "We specify and source anything the home requires — cutlery, crockery, linen and beyond." },
    ],
    linkLabel: "Explore all services",
  },
  "home.contactCta": {
    eyebrow: "Get in touch",
    headingLead: "Let's begin the",
    headingItalic: "conversation.",
    body: "Tell us about your project — residential, corporate or hospitality — and we'll be in touch within a day.",
    primaryCta: "Contact the studio",
    phoneLabel: "011 447 6016",
    phoneTel: "+27114476016",
  },
  "about.intro": {
    eyebrow: "About the studio",
    headingLead: "A small studio, shaping homes with",
    headingItalic: "unhurried care.",
    intro:
      "dl interiors was founded on a simple idea: that the homes we love most are the ones designed slowly, with materials chosen by hand and rooms planned around the people who live in them.",
  },
  "about.founder": {
    eyebrow: "Founder",
    heading: "A practice built on listening.",
    paragraphs: [
      "After a decade designing for some of South Africa's most respected residential studios, the founder of dl interiors set out to build a smaller, more personal practice — one that could give every project the attention it deserves.",
      "The work is rooted in warmth, restraint, and a respect for the way light moves through a Highveld home. We believe great interiors are felt before they are noticed.",
    ],
    portrait: designer,
    credentialsLabel: "Credentials",
    credentials: [
      "10+ years in South African residential design",
      "Full-service from concept to install",
      "Member, IID South Africa",
      "Featured in Visi & House and Leisure",
    ],
  },
  "about.process": {
    eyebrow: "How we work",
    heading:
      "A clear, calm process — from first conversation to the day you move back in.",
    steps: [
      { title: "Discovery", body: "We meet in your home, listen carefully, and understand how you live before we draw a single line." },
      { title: "Concept", body: "We present a complete design direction — palette, materials, planning, references — for you to react to." },
      { title: "Refinement", body: "Together we evolve the design, choose every finish, and confirm the budget and timeline." },
      { title: "Procurement", body: "We manage every order, every maker and every delivery so you don't have to." },
      { title: "Install & Reveal", body: "We hand over a finished home, styled and ready to live in — often in a single day." },
    ],
  },
  "about.quote": {
    image: lounge,
    quote:
      "We design for how a home will feel on an ordinary Tuesday — not just how it photographs on the day we finish.",
  },
  "about.cta": {
    heading: "Like what you see?",
    buttonLabel: "Start a conversation",
  },
  "services.header": {
    eyebrow: "Services",
    heading: "Considered design, at every scale of project.",
    intro:
      "We work with private clients across full home design, individual rooms, and focused consulting engagements.",
  },
  "services.cards": {
    items: [
      { icon: "Home", title: "Full Interior Design", body: "End-to-end design from concept through procurement to install day — typically for new homes, full renovations or complete refurnishings.", for: "Homeowners taking on a whole house or major renovation.", from: "From R85,000" },
      { icon: "Layout", title: "Space Planning & Layout", body: "Floor plans, joinery design and furniture layouts that resolve how rooms actually work — flow, function, light, and proportion.", for: "Renovations, extensions or rooms that simply don't sit right.", from: "From R18,000" },
      { icon: "Sparkles", title: "Styling & Curation", body: "We restyle existing rooms, source new pieces and curate a refreshed look using what you have alongside considered additions.", for: "Homes that need a refresh, not a renovation.", from: "From R12,000" },
      { icon: "Palette", title: "Color & Material Consultation", body: "A focused engagement to develop a cohesive palette and material strategy across your home — paints, finishes, fabrics and timber.", for: "Clients self-managing a build who need a guiding eye.", from: "From R8,500" },
      { icon: "Leaf", title: "Sustainably-led Design", body: "Built around durable, locally sourced and naturally derived materials — designed to last decades, not seasons.", for: "Homes built to last and tread lightly.", from: "Included in all services" },
      { icon: "ClipboardCheck", title: "Project Management", body: "On-site coordination with contractors, joiners and suppliers — we keep the build moving and the details correct.", for: "Anyone who wants their project handed over fully resolved.", from: "Scoped per project" },
    ],
  },
  "services.timeline": {
    eyebrow: "A typical project",
    heading: "From first conversation to handover — usually 4 to 6 months.",
    phases: [
      { phase: "Discovery", duration: "1–2 weeks" },
      { phase: "Concept", duration: "3–4 weeks" },
      { phase: "Refinement", duration: "2–3 weeks" },
      { phase: "Procurement", duration: "8–14 weeks" },
      { phase: "Install & Reveal", duration: "1–2 days" },
    ],
  },
  "services.cta": {
    eyebrow: "Begin",
    headingLead: "Every project starts with",
    headingItalic: "a conversation.",
    body: "Tell us about your home, your timeline and what's important to you — we'll come back to you within a day.",
    buttonLabel: "Book a free consultation",
  },
  "contact.header": {
    eyebrow: "Contact",
    headingLead: "Tell us about your",
    headingItalic: "home.",
    intro:
      "The more we know, the more useful our first conversation will be. We respond to every enquiry within one working day.",
  },
  "contact.options": {
    projectTypes: ["Full Home", "Kitchen", "Bedroom / Suite", "Bathroom", "Living Areas", "Styling Refresh", "Other"],
    budgets: ["Under R100k", "R100k — R300k", "R300k — R750k", "R750k — R1.5m", "R1.5m+"],
  },
  "contact.nextSteps": {
    eyebrow: "What happens next",
    steps: [
      "A short reply within one working day.",
      "A 45-minute discovery call or studio visit.",
      "A tailored proposal for your project.",
    ],
  },
};

let cache: Record<string, unknown> | null = null;
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();

async function load() {
  if (cache) return;
  if (!pending) {
    pending = (async () => {
      const { data } = await supabase.from("site_content").select("section,data");
      const next: Record<string, unknown> = {};
      for (const row of (data as { section: string; data: unknown }[] | null) ?? []) {
        next[row.section] = row.data;
      }
      cache = next;
      listeners.forEach((l) => l());
    })();
  }
  await pending;
}

export function useSiteContent<K extends SectionKey>(key: K): SiteContent[K] {
  const [, tick] = useState(0);
  useEffect(() => {
    const l = () => tick((v) => v + 1);
    listeners.add(l);
    load();
    return () => {
      listeners.delete(l);
    };
  }, []);
  const stored = (cache?.[key] ?? {}) as Partial<SiteContent[K]>;
  return { ...DEFAULTS[key], ...stored } as SiteContent[K];
}

export function invalidateSiteContent() {
  cache = null;
  pending = null;
  listeners.forEach((l) => l());
}

export async function saveSection<K extends SectionKey>(key: K, data: SiteContent[K]) {
  const { error } = await supabase.from("site_content").upsert({ section: key, data });
  if (error) throw error;
  invalidateSiteContent();
}

export async function fetchSection<K extends SectionKey>(key: K): Promise<SiteContent[K]> {
  const { data } = await supabase.from("site_content").select("data").eq("section", key).maybeSingle();
  const stored = (data?.data ?? {}) as Partial<SiteContent[K]>;
  return { ...DEFAULTS[key], ...stored } as SiteContent[K];
}
