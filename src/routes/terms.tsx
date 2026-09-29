import { createFileRoute, Link } from "@tanstack/react-router";
import { useContactInfo } from "@/hooks/use-contact-info";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — dl interiors" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const contact = useContactInfo();
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
          <strong>Draft — not yet reviewed by a lawyer.</strong> A reasonable
          starting point for a small studio's marketing site. Have it
          checked before relying on it, especially if you begin taking
          bookings, deposits, or contracts through the site directly.
        </div>

        <h1 className="font-serif text-4xl">Terms of Use</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose prose-neutral mt-10 max-w-none space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-serif text-xl">Use of this site</h2>
            <p className="mt-2">
              This website is provided to showcase dl interiors' work and
              services and to let prospective clients get in touch. You may
              browse the site and use the contact form for genuine
              enquiries. You may not use it to submit false information,
              attempt to access areas of the site you're not authorised to
              use, or interfere with its normal operation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl">Content and intellectual property</h2>
            <p className="mt-2">
              All text, images, and project photography on this site are
              the property of dl interiors unless otherwise noted, and may
              not be reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl">No warranty</h2>
            <p className="mt-2">
              This site and its content are provided "as is". While we aim
              to keep information accurate and up to date, we make no
              guarantees about completeness or accuracy, and pricing or
              service details shown here are indicative, not binding quotes.
              Actual project scope, pricing, and timelines are agreed
              directly with you before any work begins.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl">Governing law</h2>
            <p className="mt-2">
              These terms are governed by the laws of South Africa.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl">Contact us</h2>
            <p className="mt-2">
              Questions about these terms can be sent to{" "}
              {contact.email || "our contact email"}.
            </p>
          </section>
        </div>

        <Link to="/" className="mt-12 inline-block text-xs uppercase tracking-[0.2em] hover:underline underline-offset-8">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
