# How to change what's on the website

You mostly don't need to touch code to update content. Sign in at `/login`
with an admin account, go to `/admin`, and use the sections there. This
page tells you **which admin section changes which part of the site** —
because a few things look editable but currently aren't (see the
"Known gaps" section at the bottom — read that before you assume
something is broken).

## Quick map: page → where to edit it

| What you see on the site | Where to change it |
|---|---|
| Phone number, email, address, Instagram/Pinterest link (footer, homepage, Contact page — everywhere) | `/admin` → **Contact** |
| Portfolio projects (the grid at `/portfolio` and each project's own page) | `/admin` → **Projects** |
| Services list at `/services` | `/admin` → **Services** |
| Testimonials | `/admin` → **Testimonials** *(see Known gaps — not shown publicly yet)* |
| Contact form submissions people have sent you | `/admin` → **Inquiries** |
| Requests from other logged-in users to become admins | `/admin` → **Access requests** |
| Who has which login/role | `/admin` → **Users** |
| Homepage hero headline, "About" page paragraphs, "Services" page intro/timeline text, and similar page copy | `/admin` → **Pages** |

**One rule worth remembering:** the phone number is edited in exactly
one place — **Contact** — even though it visually appears on the
homepage hero, the bottom "get in touch" section, the footer, and the
Contact page. All four read from the same place now, so updating it
once updates it everywhere. (This didn't used to be true — see
`PITFALLS.md` entry "Phone number shown twice, only one was editable.")

## Known gaps (as of this doc)

These are things that exist in `/admin` but don't fully work yet, so
you know what to expect rather than thinking something's broken:

- **Testimonials**: you can add/edit them in `/admin`, but no public
  page displays them yet. The one quote on the About page is still
  hardcoded in `src/routes/about.tsx`. Ask for this to be wired up if
  you want testimonials to actually appear on the site.
- **Services "Service cards" section under Pages**: this is placeholder
  content only. It's shown *only* if the real Services section (in the
  sidebar, not under Pages) has nothing published yet. Once you add
  real services there, this placeholder stops being used automatically.
  You don't need to edit both — just use the **Services** section.

## Things that are still hardcoded in code (not editable in /admin)

- The 8 built-in service descriptions and the "How we work" steps on
  the About page are written directly in
  `src/routes/services.tsx` / `src/routes/about.tsx`, unless/until real
  content is added through the matching `/admin` section (Projects and
  Services override these automatically once populated — see above).
- Legal/compliance pages (privacy policy, terms) don't exist yet at all.
- The site's SEO meta text (title/description tags for each page) is
  in each route file's `head()` function — ask for help with this if
  you want it changed, since it's not in `/admin`.

## If you get stuck

You don't need to fix code yourself. Come back to this conversation
(or a new one) and describe what you're trying to change — mention
this file (`docs/EDITING-CONTENT.md`) and `docs/PITFALLS.md` so
whoever's helping has the full history and doesn't repeat a mistake
that's already been fixed once.
