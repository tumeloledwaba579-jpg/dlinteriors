## Goal
Trim oversized images site-wide, especially on the home page, and add a proper mobile pass (responsive image loading, tighter heights, comfortable spacing and typography).

## Home page (`src/routes/index.tsx`)
- Hero section: reduce from `h-[100svh] min-h-[640px]` to `h-[85svh] min-h-[520px] md:min-h-[640px]`; scale headline down on small screens (`text-5xl md:text-8xl lg:text-9xl`) and reduce top button padding/gap on mobile.
- Hero `<img>`: add `fetchpriority="high"`, `decoding="async"`, and use `object-position: center` on mobile so subject stays visible when cropped narrow.
- Profile portrait: keep 4/5 on mobile, cap width — change wrapper to `max-w-sm md:max-w-none mx-auto` so it doesn't dominate small screens.
- Category cards: switch mobile aspect from `4/3` (currently full-width tall) to `3/2` mobile / `4/3` desktop to reduce vertical scroll; reduce section vertical padding on mobile (`py-16 md:py-32`).
- CTA section: reduce mobile heading size (`text-4xl md:text-7xl`) and padding (`py-20 md:py-36`).

## Portfolio listing (`src/routes/portfolio.tsx`)
- Cap the featured (every-3rd) image at `aspect-[16/10]` on mobile (currently `16/9` is very wide when full-bleed) — actually keep 16/9 on desktop, use `4/3` on mobile.
- Reduce top padding on mobile (`pt-24 md:pt-40`).

## Project detail (`src/routes/portfolio.$slug.tsx`)
- Hero: reduce from `h-[78svh] min-h-[520px]` to `h-[68svh] min-h-[440px] md:min-h-[560px]`; headline `text-4xl md:text-7xl`.
- Gallery: current alternating layout produces very tall stacked images on mobile — force `aspect-[4/3]` on mobile for the wide items, and stack the paired items vertically on mobile with a smaller `aspect-[4/5]`.
- Add `decoding="async"` to all `<img>`.
- Meta grid: `grid-cols-2 md:grid-cols-4` so labels don't stack into a tall column on mobile.

## Responsive image loading (global pattern)
For each large `<img>`, add:
- `sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 1200px"` (adjusted per usage)
- `loading="lazy"` everywhere except the LCP hero images (which get `fetchpriority="high"`)
- `decoding="async"`

Uploaded images through Supabase storage are single-size, so we can't generate a true `srcset`. The wins here come from correct `sizes`/`loading`/`decoding` hints, tighter aspect ratios, and reduced heights — the browser will still download the single source but render efficiently, and CDN caching handles the rest. Bundled `@/assets/*` images are already optimized by Vite.

## Out of scope
- No changes to admin, auth, forms, business logic, or data.
- No new dependencies.
- Not regenerating source images at smaller dimensions (would require re-uploading assets).

## Verification
- Load `/`, `/portfolio`, `/portfolio/westcliff-residence` at 375px, 768px, and 1280px via Playwright; screenshot each and confirm images no longer dominate the viewport and vertical rhythm feels balanced.
