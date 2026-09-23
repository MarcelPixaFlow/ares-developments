import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AresLogo } from "./AresLogo";

const links = [
  { href: "#tese", label: "Tese" },
  { href: "#veiculo", label: "Sítio" },
  { href: "#projecoes", label: "Projeções" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#cidadela", label: "Cidadela Helios" },
  { href: "#contato", label: "Contato" },
];

const dashboardLinkClass =
  "shrink-0 text-xs tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "fixed inset-x-0 top-0 z-50 border-b border-border bg-background" : "fixed inset-x-0 top-0 z-50 bg-transparent"}>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-5 lg:px-10">
        <a href="#topo" className="min-w-0 flex-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="Ares Developments, início">
          <AresLogo />
        </a>

        <nav className="hidden items-center gap-8 lg:gap-10 md:flex" aria-label="Seções">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {l.label}
            </a>
          ))}
          <Link to="/dashboard" className={dashboardLinkClass}>
            Acesso interno
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Link to="/dashboard" className={dashboardLinkClass}>
            Acesso interno
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-mobile"
            aria-label={open ? "Fechar navegação" : "Abrir navegação"}
            className="border border-white/30 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
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
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block border-b border-border/60 px-6 py-4 text-xs uppercase tracking-[0.2em] text-foreground"
          >
            Acesso interno
          </Link>
        </nav>
      )}
    </header>
  );
}
