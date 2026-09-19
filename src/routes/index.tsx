import { createFileRoute } from "@tanstack/react-router";
import heroImage from "@/assets/mars-hero.jpg";
import { SiteNav } from "@/features/site/SiteNav";
import { AresLogo } from "@/features/site/AresLogo";
import { ContactCta } from "@/features/site/ContactCta";
import { RoiCalculator } from "@/features/roi/RoiCalculator";
import { ProjectCard } from "@/features/portfolio/ProjectCard";
import { projects } from "@/features/portfolio/data";
import { HeliosSection } from "@/features/complex/HeliosSection";

const title = "Ares Developments — Marte: O Próximo Grande Salto Para Seu Portfólio";
const description =
  "Tese de investimento especulativa em terrenos e projetos primordiais no Arcana Valley, Marte. Projeções ilustrativas e portfólio de projetos âncora.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="topo" className="min-h-screen bg-background">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
          <img
            src={heroImage}
            alt="Paisagem rochosa de Marte no Arcana Valley ao entardecer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/80" />

          <div className="relative mx-auto max-w-4xl px-6 py-32 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Arcana Valley · Marte
            </p>
            <h1 className="mt-8 font-serif text-4xl leading-[1.15] text-foreground sm:text-5xl lg:text-6xl">
              Marte: O Próximo Grande Salto Para Seu Portfólio.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Investimento exclusivo em terrenos e projetos primordiais no Arcana
              Valley.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contato"
                className="inline-flex w-full items-center justify-center bg-primary px-10 py-4 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
              >
                Falar com Especialista
              </a>
              <a
                href="#projecoes"
                className="inline-flex w-full items-center justify-center border border-border bg-transparent px-10 py-4 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
              >
                Ver Projeções
              </a>
            </div>
          </div>
        </section>

        {/* Thesis */}
        <section id="tese" className="scroll-mt-24 border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-primary">
                  A Tese
                </p>
                <h2 className="mt-6 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
                  Um ciclo de capital que começa antes da infraestrutura.
                </h2>
              </div>
              <div className="grid gap-10 lg:col-span-8 sm:grid-cols-3">
                {[
                  {
                    k: "Escassez estrutural",
                    v: "A oferta de parcelas em corredores logísticos primordiais é finita por definição geográfica.",
                  },
                  {
                    k: "Horizonte geracional",
                    v: "A tese é construída para alocações pacientes, com liquidez esperada em décadas, não trimestres.",
                  },
                  {
                    k: "Natureza especulativa",
                    v: "Trata-se de um exercício prospectivo. Não há garantia de execução, retorno ou titularidade.",
                  },
                ].map((item) => (
                  <div key={item.k} className="border-t border-border pt-6">
                    <h3 className="font-serif text-lg text-foreground">{item.k}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ROI */}
        <section id="projecoes" className="scroll-mt-24 border-t border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
            <p className="text-[10px] uppercase tracking-[0.35em] text-primary">
              Projeções Hipotéticas
            </p>
            <h2 className="mt-6 max-w-2xl font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Simule um cenário ilustrativo de valorização.
            </h2>
            <div className="mt-16">
              <RoiCalculator />
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="scroll-mt-24 border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
            <p className="text-[10px] uppercase tracking-[0.35em] text-primary">
              Portfólio
            </p>
            <h2 className="mt-6 max-w-2xl font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Projetos âncora no Arcana Valley.
            </h2>
            <div className="mt-16 grid gap-8 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        <HeliosSection />

        {/* Contact */}
        <section id="contato" className="scroll-mt-24 border-t border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
            <ContactCta />
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-4">
            <AresLogo />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground lg:col-span-8">
            Ares Developments é um conceito ficcional e especulativo, apresentado
            para fins ilustrativos. Nenhuma oferta de valores mobiliários, titularidade
            de terrenos em Marte ou promessa de retorno é feita ou implícita. Projeções
            meramente ilustrativas — resultados não garantidos.
          </p>
        </div>
      </footer>
    </div>
  );
}
