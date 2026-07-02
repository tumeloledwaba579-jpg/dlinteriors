
## Goal
Every piece of text and imagery visible on the public site should be editable from `/admin`. Today only Projects, Services, Testimonials, and Contact info are. The Home, About, Services, and Contact pages still contain hardcoded copy, images, and lists.

## What becomes editable

**Home page**
- Hero: eyebrow, title (with italic word), tagline, primary CTA label, phone CTA label + tel, background image
- Profile: eyebrow, heading, 3 body paragraphs, portrait image, "more about the studio" link label
- Portfolio Categories section: eyebrow, heading, intro, and the 6 category cards (title, tag, image)
- Services teaser: eyebrow, heading, intro (the 8 service cards will be pulled from the existing Services admin — one source of truth)
- Contact CTA: eyebrow, heading, body, CTA labels + phone

**About page**
- Intro heading + intro paragraph
- Founder section: portrait, heading, 2 body paragraphs, credentials list
- Process: 5 numbered steps (title + body)
- Pull-quote image + quote text
- Closing CTA heading + button label

**Services page**
- Page heading + intro
- 6 service cards (icon key, title, body, "ideal for", investment) — or reuse the Services admin table
- 5-phase timeline (phase + duration)
- Closing CTA eyebrow/heading/body/button label

**Contact page**
- Page heading + intro
- Project type options list, Budget options list
- Sidebar: "What happens next" 3 steps

**Sitewide**
- Studio name in header, header CTA label, footer copy

## Approach

Add a single `site_content` table keyed by `section` (text PK) storing a JSON `data` blob per section — one row per logical block (e.g. `home.hero`, `home.profile`, `home.categories`, `home.contact_cta`, `about.intro`, `about.founder`, `about.process`, `about.quote`, `about.cta`, `services.header`, `services.cards`, `services.timeline`, `services.cta`, `contact.header`, `contact.options`, `contact.next_steps`, `site.branding`). Public read for all rows, admin-only write.

Seed rows with the current hardcoded content so nothing visually changes on first load.

Add a typed helper `useSiteContent(section)` (React Query) that returns the parsed JSON with the seeded defaults as fallback while loading.

Rewrite the public pages to read from those hooks instead of module-level constants. Images use the existing `ImageUpload` (site-assets bucket) or fall back to bundled defaults.

Extend `/admin` with a new **"Pages"** tab containing sub-tabs (Home, About, Services page, Contact page, Branding). Each sub-tab is a form built with the existing `Card / Input / Textarea / ImageUpload / Btn` primitives — repeatable rows for lists (categories, process steps, timeline, credentials, options, next-steps). Save writes the whole JSON blob back to its row.

Services-page cards and homepage services teaser both read from the existing `services` table (with a "show on home" flag added) so the user edits service copy in one place.

## Technical notes
- New migration: `site_content(section text pk, data jsonb, updated_at)` with GRANTs, RLS (`select` for anon+authenticated, `insert/update/delete` for admins via `has_role`), `updated_at` trigger. Seed with `INSERT ... ON CONFLICT DO NOTHING` in a follow-up insert step.
- Add `show_on_home boolean default false` to `services` (optional; only if user wants the homepage teaser tied to the same table — otherwise store the 8-item teaser as its own `home.services_teaser` blob).
- No public route becomes auth-gated; loaders stay public.
- `useSiteContent` uses TanStack Query with a per-section key; falls back to hardcoded defaults so SSR and cold loads never blank.
- New admin components: `AdminPages.tsx` (tab shell) + one component per section form. All under `src/components/admin/pages/`.
- Icon fields (Services page cards) become a small select of allowed lucide icon keys.

## Out of scope
- Contact form submission storage (form currently just shows a thank-you).
- Rich-text editing — plain textareas for now.
- Reordering via drag-and-drop — numeric `sort_order` inputs where needed.

## Question before I build
Do you want the homepage services teaser and the Services page cards to be **one shared list** (edit once, appears on both — I'd add a "show on home" toggle to each), or kept as **two separate editable blocks** so you can word them differently?
