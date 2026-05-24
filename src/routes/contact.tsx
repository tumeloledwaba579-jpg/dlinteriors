import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useContactInfo } from "@/hooks/use-contact-info";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — dl interiors" },
      { name: "description", content: "Begin an interior design project with dl interiors. Based in Johannesburg, working across Pretoria and greater South Africa." },
      { property: "og:title", content: "Contact — dl interiors" },
      { property: "og:description", content: "Begin a residential interior design project." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more about your project").max(2000),
});

function ContactPage() {
  const c = useContactInfo();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const result = schema.safeParse(data);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <div className="pt-32 md:pt-40">
      <header className="mx-auto max-w-7xl px-6">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">
          Tell us about your <em className="italic text-primary">home.</em>
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">
          The more we know, the more useful our first conversation will be. We respond to every enquiry within one working day.
        </p>
      </header>

      <section className="mx-auto mt-16 grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:gap-20">
        {/* Form */}
        <div className="md:col-span-7">
          {submitted ? (
            <div className="border border-border bg-card p-10 text-center">
              <p className="eyebrow">Thank you</p>
              <h2 className="mt-3 font-serif text-3xl">Your message is on its way.</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                We'll be in touch within one working day to set up your consultation.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <Field label="Name" name="name" error={errors.name} required />
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Email" name="email" type="email" error={errors.email} required />
                <Field label="Phone (optional)" name="phone" type="tel" error={errors.phone} />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <SelectField
                  label="Project type"
                  name="projectType"
                  error={errors.projectType}
                  options={["Full Home", "Kitchen", "Bedroom / Suite", "Bathroom", "Living Areas", "Styling Refresh", "Other"]}
                  required
                />
                <SelectField
                  label="Budget (optional)"
                  name="budget"
                  error={errors.budget}
                  options={["Under R100k", "R100k — R300k", "R300k — R750k", "R750k — R1.5m", "R1.5m+"]}
                />
              </div>
              <div>
                <label className="eyebrow block">Tell us about your project *</label>
                <textarea
                  name="message"
                  rows={6}
                  className="mt-3 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="A few words about your home, what you'd like to change, and your timeline."
                />
                {errors.message && <p className="mt-2 text-xs text-destructive">{errors.message}</p>}
              </div>
              <button type="submit" className="rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] text-background hover:bg-primary transition-colors">
                Send enquiry
              </button>
              <p className="text-xs text-muted-foreground">We typically reply within one working day.</p>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <aside className="md:col-span-4 md:col-start-9 space-y-10">
          <div>
            <p className="eyebrow">Studio</p>
            <ul className="mt-4 space-y-3 text-sm">
              {c.email && <li className="flex items-start gap-3"><Mail size={16} className="mt-0.5 text-primary" /> {c.email}</li>}
              {c.phone && <li className="flex items-start gap-3"><Phone size={16} className="mt-0.5 text-primary" /> {c.phone}</li>}
              {c.address && <li className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-primary" /> {c.address}</li>}
            </ul>
          </div>

          <div className="border-t border-border pt-6">
            <p className="eyebrow">What happens next</p>
            <ol className="mt-4 space-y-4 text-sm">
              <li><span className="font-serif text-primary mr-2">01</span> A short reply within one working day.</li>
              <li><span className="font-serif text-primary mr-2">02</span> A 45-minute discovery call or studio visit.</li>
              <li><span className="font-serif text-primary mr-2">03</span> A tailored proposal for your project.</li>
            </ol>
          </div>

          <div className="border-t border-border pt-6">
            <p className="eyebrow">Follow</p>
            <div className="mt-4 flex gap-4">
              {c.instagram && <a href={c.instagram} aria-label="Instagram" className="text-foreground/80 hover:text-foreground"><Instagram size={20} /></a>}
              {c.pinterest && <a href={c.pinterest} aria-label="Pinterest" className="text-foreground/80 hover:text-foreground"><Linkedin size={20} /></a>}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", error, required }: { label: string; name: string; type?: string; error?: string; required?: boolean }) {
  return (
    <div>
      <label className="eyebrow block">{label}{required && " *"}</label>
      <input
        name={name}
        type={type}
        className="mt-3 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
      />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, options, error, required }: { label: string; name: string; options: string[]; error?: string; required?: boolean }) {
  return (
    <div>
      <label className="eyebrow block">{label}{required && " *"}</label>
      <select
        name={name}
        defaultValue=""
        className="mt-3 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
      >
        <option value="" disabled>Please select</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
