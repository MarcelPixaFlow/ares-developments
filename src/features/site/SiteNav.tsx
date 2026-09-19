import { useState } from "react";
import { AresLogo } from "./AresLogo";

const links = [
  { href: "#tese", label: "Tese" },
  { href: "#projecoes", label: "Projeções" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#cidadela", label: "Cidadela Helios" },
  { href: "#contato", label: "Contato" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-5 lg:px-10">
        <a href="#topo" className="min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="Ares Developments, início">
          <AresLogo />
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Seções">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-mobile"
          aria-label={open ? "Fechar navegação" : "Abrir navegação"}
          className="shrink-0 border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="nav-mobile" className="border-t border-border bg-background md:hidden" aria-label="Seções">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 px-6 py-4 text-xs uppercase tracking-[0.2em] text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
