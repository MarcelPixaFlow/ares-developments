import { ProjectCarousel } from "./ProjectCarousel";
import { projects } from "./data";

export function PortfolioSection() {
  return (
    <section id="portfolio" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <p className="text-[10px] uppercase tracking-[0.35em] text-primary">Portfólio</p>
        <h2 className="mt-6 max-w-2xl font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          Projetos âncora no Arcana Valley.
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCarousel key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
