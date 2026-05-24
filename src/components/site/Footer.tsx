import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl">dl</span>
            <span className="eyebrow">interiors</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A residential interior design studio based between Johannesburg and Pretoria, shaping
            warm, considered homes across South Africa.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Studio</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/portfolio" className="hover:text-foreground text-muted-foreground">Portfolio</Link></li>
            <li><Link to="/about" className="hover:text-foreground text-muted-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground text-muted-foreground">Services</Link></li>
            <li><Link to="/contact" className="hover:text-foreground text-muted-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Get in touch</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>hello@dlinteriors.co.za</li>
            <li>+27 11 000 0000</li>
            <li>Johannesburg · Pretoria</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground"><Instagram size={18} /></a>
            <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground"><Linkedin size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} dl interiors. All rights reserved.</p>
          <p>Designed in Johannesburg.</p>
        </div>
      </div>
    </footer>
  );
}
