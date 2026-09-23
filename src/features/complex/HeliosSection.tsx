import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { heliosCommercial } from "@/features/portfolio/data";
import { formatUSD } from "@/features/roi/projections";
import { HeliosMap } from "./HeliosMap";
import { heliosComplex, heliosViewSlots, heliosZones } from "./heliosData";

export function HeliosSection() {
  const [selectedZoneId, setSelectedZoneId] = useState(heliosZones[0]?.id ?? "nucleo");
  const [openViewId, setOpenViewId] = useState<string | null>(null);
  const selected =
    heliosZones.find((zone) => zone.id === selectedZoneId) ?? heliosZones[0];
  const openView = heliosViewSlots.find((slot) => slot.id === openViewId);

  return (
    <section id="cidadela" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.35em] text-primary">
              Novo âncora · {heliosComplex.code}
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              {heliosComplex.name}
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {heliosComplex.location}
            </p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {heliosComplex.blurb}
            </p>
            <p className="mt-6 font-serif text-2xl tabular-nums text-foreground">
              {formatUSD(heliosCommercial.price)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Preço do lote · {heliosCommercial.lotsAvailable} / {heliosCommercial.lotsTotal}{" "}
              disponíveis
            </p>

            {selected && (
              <div className="mt-10 border-t border-border pt-6" aria-live="polite">
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary">
                  Zona selecionada
                </p>
                <h3 className="mt-3 font-serif text-xl text-foreground">{selected.title}</h3>
                <dl className="mt-4 grid gap-4 text-sm">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Uso
                    </dt>
                    <dd className="mt-1 text-muted-foreground">{selected.use}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Adjacências
                    </dt>
                    <dd className="mt-1 text-muted-foreground">{selected.adjacencies}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Programa
                    </dt>
                    <dd className="mt-1 leading-relaxed text-muted-foreground">
                      {selected.program}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <div
              role="radiogroup"
              aria-label="Zonas da planta de sítio"
              className="mt-8 grid gap-2 sm:grid-cols-2"
            >
              {heliosZones.map((zone) => {
                const active = zone.id === selectedZoneId;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={`Selecionar zona ${zone.title}`}
                    data-zone-id={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    onKeyDown={(event) => {
                      if (
                        event.key !== "ArrowRight" &&
                        event.key !== "ArrowDown" &&
                        event.key !== "ArrowLeft" &&
                        event.key !== "ArrowUp"
                      ) {
                        return;
                      }
                      event.preventDefault();
                      const index = heliosZones.findIndex((item) => item.id === selectedZoneId);
                      const delta =
                        event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
                      const next =
                        heliosZones[(index + delta + heliosZones.length) % heliosZones.length];
                      if (!next) return;
                      setSelectedZoneId(next.id);
                      const node = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
                        `[data-zone-id="${next.id}"]`,
                      );
                      node?.focus();
                    }}
                    className={`w-full border px-4 py-3 text-left text-xs uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                    }`}
                  >
                    {zone.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative h-[min(72vh,640px)] overflow-hidden border border-border bg-[#0F0F11]">
              <HeliosMap selectedZoneId={selectedZoneId} onSelectZone={setSelectedZoneId} />
              <p className="pointer-events-none absolute bottom-4 left-4 max-w-[70%] text-[10px] uppercase tracking-[0.25em] text-white/55">
                Arraste para orbitar · role para zoom · clique num volume para selecionar
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {heliosViewSlots.map((slot) => (
            <figure key={slot.id} className="overflow-hidden border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenViewId(slot.id)}
                aria-label={`Ampliar ${slot.label}, recorte de estudo da maquete`}
                className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <img
                  src={slot.image}
                  alt={`${slot.label} — recorte de estudo da maquete`}
                  className="aspect-[16/10] h-auto w-full object-cover"
                />
              </button>
              <figcaption className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {slot.diagram ? "Planta aérea · diagrama de implantação" : `${slot.label} · vista de estudo`}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(openView)} onOpenChange={(open) => !open && setOpenViewId(null)}>
        <DialogContent className="max-w-6xl border-border bg-[#0F0F11] p-0 sm:rounded-none">
          {openView && (
            <>
              <DialogTitle className="sr-only">
                {openView.label} — recorte de estudo da maquete
              </DialogTitle>
              <img
                src={openView.image}
                alt={`${openView.label} — recorte de estudo da maquete`}
                className="max-h-[88vh] w-full object-contain"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
