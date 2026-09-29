import { createFileRoute, Link } from "@tanstack/react-router";
import { useContactInfo } from "@/hooks/use-contact-info";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — dl interiors" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const contact = useContactInfo();
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
          <strong>Draft — not yet reviewed by a lawyer.</strong> This is a
          reasonable starting point covering what the site actually does
          (the contact form and admin sign-in), written to be accurate about
          our own data handling. Have it checked against South Africa's
          POPIA requirements — and any other law that applies to you —
          before relying on it as a binding legal document.
        </div>

        <h1 className="font-serif text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose prose-neutral mt-10 max-w-none space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-serif text-xl">What we collect</h2>
            <p className="mt-2">
              When you use our contact form, we collect your name, email
              address, phone number (if provided), and the message you send
              us, along with any project type or budget information you
              choose to share. If you sign in to an admin account, we use
              your email address and, if you sign in with Google, basic
              profile information (name, email, profile photo) provided by
              Google.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl">How we use it</h2>
            <p className="mt-2">
              We use contact form submissions solely to respond to your
              enquiry about our interior design services. We use admin
              account information solely to manage access to our website's
              content management system. We do not sell, rent, or share
              your information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl">Where it's stored</h2>
            <p className="mt-2">
              Our website and its data are hosted using Cloudflare Workers
              and Supabase. Sign-in via Google uses Google's own
              authentication service. These providers may process data
              outside South Africa; each maintains their own security and
              privacy standards.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl">Your rights</h2>
            <p className="mt-2">
              Under South Africa's Protection of Personal Information Act
              (POPIA), you have the right to ask what personal information
              we hold about you, request that it be corrected, and request
              that it be deleted. To do so, contact us using the details
              below.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl">Cookies</h2>
            <p className="mt-2">
              This site does not currently use tracking or analytics
              cookies. Signing in uses essential session storage required
              for authentication to function.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl">Contact us</h2>
            <p className="mt-2">
              For any privacy-related questions or requests, contact us at{" "}
              {contact.email || "our contact email"}
              {contact.phone ? ` or ${contact.phone}` : ""}.
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
