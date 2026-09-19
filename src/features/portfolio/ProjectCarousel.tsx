import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "./data";

export function ProjectCarousel({ project }: { project: Project }) {
  const [index, setIndex] = useState(0);
  const images = project.images;
  const count = images.length;

  const go = (delta: number) => {
    if (count < 2) return;
    setIndex((current) => (current + delta + count) % count);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === index ? project.title : ""}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Imagem anterior"
                className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-black/60 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima imagem"
                className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-black/60 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div
                className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5"
                role="tablist"
                aria-label={`Vistas de ${project.title}`}
              >
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Vista ${i + 1} de ${count}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === index ? "w-5 bg-primary" : "w-1.5 bg-white/35 hover:bg-white/60",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>

      <div className="flex flex-1 flex-col p-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
          {project.status}
        </p>
        <h3 className="mt-3 font-serif text-xl text-foreground">{project.title}</h3>
        <div className="mt-6 grid gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Programa
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {project.program}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Demanda
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {project.demand}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
