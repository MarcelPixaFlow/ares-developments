export function ContactCta() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
      <div className="lg:col-span-7">
        <h2 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          Converse com um especialista da Ares
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Atendimento dedicado a investidores institucionais e family offices.
          Apresentamos a tese completa, a estrutura do veículo e o cronograma de
          alocação em reunião privada.
        </p>
      </div>
      <div className="flex flex-wrap gap-4 lg:col-span-5 lg:justify-end">
        <a
          href="mailto:relacoes@aresdevelopments.example"
          className="inline-flex items-center justify-center bg-primary px-8 py-4 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Falar com Especialista
        </a>
        <a
          href="#tese"
          className="inline-flex items-center justify-center border border-border px-8 py-4 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Rever a tese
        </a>
      </div>
    </div>
  );
}
