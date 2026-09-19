import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HeliosMap } from "./HeliosMap";
import { heliosComplex, heliosViewSlots, heliosZones } from "./heliosData";

export function HeliosSection() {
  const [selectedZoneId, setSelectedZoneId] = useState(heliosZones[0]?.id ?? "nucleo");
  const [openViewId, setOpenViewId] = useState<string | null>(null);
  const selected =
    heliosZones.find((zone) => zone.id === selectedZoneId) ?? heliosZones[0];
  const openView = heliosViewSlots.find((slot) => slot.id === openViewId);

  return (
    <section id="cidadela" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
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

            {selected && (
              <div className="mt-10 border-t border-border pt-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary">
                  Zona selecionada
                </p>
                <h3 className="mt-3 font-serif text-xl text-foreground">{selected.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{selected.summary}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {selected.description}
                </p>
              </div>
            )}

            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {heliosZones.map((zone) => {
                const active = zone.id === selectedZoneId;
                return (
                  <li key={zone.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`w-full border px-4 py-3 text-left text-xs uppercase tracking-[0.16em] transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                      }`}
                    >
                      {zone.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="relative h-[min(72vh,640px)] overflow-hidden border border-border bg-[#0F0F11]">
              <HeliosMap selectedZoneId={selectedZoneId} onSelectZone={setSelectedZoneId} />
              <p className="pointer-events-none absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.25em] text-white/55">
                Arraste para orbitar · clique num volume para selecionar
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
                className="block w-full text-left"
              >
                <img
                  src={slot.image}
                  alt={slot.label}
                  className="aspect-[16/10] h-auto w-full object-cover"
                />
              </button>
              <figcaption className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {slot.label} · clique para ampliar
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(openView)} onOpenChange={(open) => !open && setOpenViewId(null)}>
        <DialogContent className="max-w-6xl border-border bg-[#0F0F11] p-0 sm:rounded-none">
          {openView && (
            <>
              <DialogTitle className="sr-only">{openView.label}</DialogTitle>
              <img
                src={openView.image}
                alt={openView.label}
                className="max-h-[88vh] w-full object-contain"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
