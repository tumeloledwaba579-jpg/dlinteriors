## Finishing touches

A quick walkthrough of the site + admin surfaced these gaps. Grouped by priority so you can pick what to ship.

### 1. Brand & metadata (high impact, low effort)
- Add a real **favicon + apple-touch-icon** (currently the default Lovable icon shows in tabs).
- Add a proper **og:image** on the homepage and About/Services/Contact leaves (social share currently has none, so previews are blank).
- Wire the studio name from `site.branding` into the root `<title>` / og tags so renaming the studio in admin updates browser tabs too.
- Generate `robots.txt` allow + confirm `sitemap.xml` includes About, Services, Contact, and portfolio detail routes.

### 2. Contact form actually works
Right now the form on `/contact` just shows a thank-you; submissions are lost.
- New `contact_submissions` table (name, email, phone, project_type, budget, message, created_at) with admin-only read, public insert.
- Store the submission on submit, keep the thank-you state.
- New **"Inquiries"** tab in `/admin` to view / mark-read / delete leads.
- Optional: email notification via a public API route + Resend (needs a `RESEND_API_KEY` secret — I'll ask before adding).

### 3. Image & performance polish
- Add `loading="lazy"` + `decoding="async"` to all non-hero `<img>` tags (hero stays eager).
- Add explicit `width`/`height` where missing to prevent layout shift.
- Compress / swap the hero to a `<picture>` with a mobile crop (the current hero image is heavy on phones).
- Add a subtle skeleton/placeholder for portfolio + category cards while images load.

### 4. Accessibility
- Give every decorative image `alt=""` and every meaningful image a real alt (some currently say "" or reuse the title).
- Ensure the header nav has a visible focus ring and the mobile menu traps focus / closes on Esc.
- Contrast check on the hero overlay text and the muted-foreground body copy.
- Add `aria-current="page"` to the active nav link.

### 5. Admin UX
- Replace the browser `alert()` / `confirm()` calls with the existing `sonner` toast + a small confirm dialog.
- Add a **"Preview"** link next to each Pages sub-tab that opens the corresponding public page in a new tab.
- Show a "last saved" timestamp per section.
- Add **drag-to-reorder** (or up/down arrows) for services, testimonials, categories, process steps — currently only numeric `sort_order` inputs.
- Add an **"Invite admin"** flow: an existing admin can grant the role to another signed-in user by email (uses `has_role` + a small server function).

### 6. 404 / error / loading states
- The root `NotFoundComponent` exists but leaf routes (portfolio/[slug]) fall through to it silently — add a per-route `notFoundComponent` that says "Project not found" with a link back to portfolio.
- Add a `pendingComponent` (small skeleton) on portfolio + services so navigation doesn't flash blank.

### 7. Small visual bugs to sweep
- Header: mobile hamburger + slide-in menu (currently nav is desktop-only below a certain width).
- Footer: year should be dynamic (`new Date().getFullYear()`).
- Portfolio detail: back-to-portfolio link.
- Consistent button sizing — a couple of CTAs are `py-3` vs `py-3.5`.

### Out of scope unless you ask
- Blog / journal
- Multi-language
- Analytics beyond what Lovable already provides
- Full CMS-editable navigation (menu is currently fixed)

---

**Which of these should I do?** A safe default first pass would be **1, 2, 4, 6, and 7** — the user-facing polish + working contact form. **3** and **5** are worth a follow-up round. Let me know which groups to ship (or "all") and whether to add Resend for contact-form emails.
