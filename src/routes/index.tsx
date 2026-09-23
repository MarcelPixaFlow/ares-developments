import { createFileRoute } from "@tanstack/react-router";
import heroImage from "@/assets/mars-hero.jpg";
import { SiteNav } from "@/features/site/SiteNav";
import { AresLogo } from "@/features/site/AresLogo";
import { ContactCta } from "@/features/site/ContactCta";
import { RoiCalculator } from "@/features/roi/RoiCalculator";
import { PortfolioSection } from "@/features/portfolio/PortfolioSection";
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
        <section className="relative flex min-h-screen items-end overflow-hidden">
          <img
            src={heroImage}
            alt="Paisagem rochosa de Marte no Arcana Valley ao entardecer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative mb-16 ml-0 max-w-2xl px-6 py-10 text-left sm:mb-20 sm:px-10 lg:ml-[8%]">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-transparent blur-[0.5px]" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#c69a6d]">Arcana Valley</p>
            <h1 className="mt-5 max-w-xl font-serif text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Um novo horizonte de capital.
            </h1>
            <p className="mt-5 text-xs uppercase tracking-[0.16em] text-white/65">
              Cidadela Helios · US$ 2.400.000 por lote
            </p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row">
              <a
                href="#contato"
                className="inline-flex w-full items-center justify-center bg-[#c98c58] px-10 py-4 text-xs uppercase tracking-[0.2em] text-[#1b120d] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
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
        <section id="tese" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
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

        <section id="veiculo" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-primary">
                  Sítio e veículo
                </p>
                <h2 className="mt-6 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
                  O sítio e o veículo.
                </h2>
              </div>
              <div className="grid gap-10 lg:col-span-8">
                <div className="border-t border-border pt-6">
                  <h3 className="font-serif text-lg text-foreground">Por que o flanco leste</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Arcana Valley é um corredor baixo, contínuo, no hemisfério que a tese
                    trata como porta de entrada logística. O flanco leste (AV-HX-01) encosta
                    em platô para campo solar, depressão para extração hídrica e linha de
                    aproximação para pista. A escassez não é “Marte inteiro”; é a borda útil
                    desse corredor.
                  </p>
                </div>
                <div className="border-t border-border pt-6">
                  <h3 className="font-serif text-lg text-foreground">O veículo (conceitual)</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Alocação fechada, fora de mercado, para family office e institucional.
                    Lock-up alinhado ao horizonte geracional — liquidez esperada em décadas,
                    não em trimestres. Não há cota negociável, lastro registral nem direito
                    real sobre o solo marciano. O que se descreve é exposição conceitual a um
                    sítio e aos âncoras que o programam.
                  </p>
                </div>
                <div className="border-t border-border pt-6">
                  <h3 className="font-serif text-lg text-foreground">Cronograma hipotético</h3>
                  <ul className="mt-4 grid gap-4 text-sm leading-relaxed text-muted-foreground">
                    <li>
                      <span className="text-foreground">2030–2038.</span> Terra crua, sítio,
                      energia e água em escala de estudo.
                    </li>
                    <li>
                      <span className="text-foreground">2038–2050.</span> Habitats modulares e
                      primeiros âncoras (saúde, logística).
                    </li>
                    <li>
                      <span className="text-foreground">2050–2065.</span> Cidadela Helios como
                      hub; varejo e colônia como demanda derivada.
                    </li>
                    <li>
                      <span className="text-foreground">2065–2080.</span> Janela hipotética de
                      liquidez secundária. Sem garantia de evento de saída.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI */}
        <section id="projecoes" className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <p className="text-[10px] uppercase tracking-[0.35em] text-primary">
              Projeções Hipotéticas
            </p>
            <h2 className="mt-6 max-w-2xl font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Simule a valorização a partir do preço fixo de cada lote.
            </h2>
            <div className="mt-16">
              <RoiCalculator />
            </div>
          </div>
        </section>

        <PortfolioSection />

        <HeliosSection />

        {/* Contact */}
        <section id="contato" className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
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
