import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useContactInfo } from "@/hooks/use-contact-info";
import { useSiteContent } from "@/lib/site-content";
import { supabase } from "@/integrations/supabase/client";


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
  const header = useSiteContent("contact.header");
  const opts = useSiteContent("contact.options");
  const next = useSiteContent("contact.nextSteps");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const result = schema.safeParse(data);
    if (!result.success) {
      const nx: Record<string, string> = {};
      for (const issue of result.error.issues) nx[String(issue.path[0])] = issue.message;
      setErrors(nx);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const v = result.data;
    const { error } = await supabase.from("contact_submissions").insert({
      name: v.name,
      email: v.email,
      phone: v.phone || null,
      project_type: v.projectType,
      budget: v.budget || null,
      message: v.message,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError("Sorry — we couldn't send your message. Please try again or email us directly.");
      return;
    }
    setSubmitted(true);
  };


  return (
    <div className="pt-32 md:pt-40">
      <header className="mx-auto max-w-7xl px-6">
        <p className="eyebrow">{header.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">
          {header.headingLead} <em className="italic text-primary">{header.headingItalic}</em>
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">{header.intro}</p>
      </header>

      <section className="mx-auto mt-16 grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-7">
          {submitted ? (
            <div className="border border-border bg-card p-10 text-center" role="status" aria-live="polite">
              <p className="eyebrow">Thank you</p>
              <h2 className="mt-3 font-serif text-3xl">Your message is on its way.</h2>
              <p className="mt-4 text-sm text-muted-foreground">We'll be in touch within one working day to set up your consultation.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6" noValidate aria-label="Project enquiry">
              <Field label="Name" name="name" error={errors.name} required />
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Email" name="email" type="email" error={errors.email} required />
                <Field label="Phone (optional)" name="phone" type="tel" error={errors.phone} />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <SelectField label="Project type" name="projectType" error={errors.projectType} options={opts.projectTypes} required />
                <SelectField label="Budget (optional)" name="budget" error={errors.budget} options={opts.budgets} />
              </div>
              <div>
                <label htmlFor="contact-message" className="eyebrow block">Tell us about your project *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  required
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className="mt-3 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground placeholder:text-muted-foreground"
                  placeholder="A few words about your home, what you'd like to change, and your timeline."
                />
                {errors.message && <p id="contact-message-error" className="mt-2 text-xs text-destructive">{errors.message}</p>}
              </div>
              <button type="submit" disabled={submitting} className="rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] text-background hover:bg-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? "Sending…" : "Send enquiry"}
              </button>
              {submitError && <p className="text-xs text-destructive" role="alert">{submitError}</p>}
              <p className="text-xs text-muted-foreground">We typically reply within one working day.</p>
            </form>
          )}
        </div>


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
            <p className="eyebrow">{next.eyebrow}</p>
            <ol className="mt-4 space-y-4 text-sm">
              {next.steps.map((s, i) => (
                <li key={i}><span className="font-serif text-primary mr-2">{String(i + 1).padStart(2, "0")}</span>{s}</li>
              ))}
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
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">{label}{required && " *"}</label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-3 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground placeholder:text-muted-foreground"
      />
      {error && <p id={`${id}-error`} className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, options, error, required }: { label: string; name: string; options: string[]; error?: string; required?: boolean }) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">{label}{required && " *"}</label>
      <select
        id={id}
        name={name}
        defaultValue=""
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-3 w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
      >
        <option value="" disabled>Please select</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p id={`${id}-error`} className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
