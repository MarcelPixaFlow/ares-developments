import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "./data";

export function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-primary/60">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Abrir ficha de ${project.title}`}
          className="flex h-full flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
          <div className="flex flex-1 flex-col p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
              {project.status}
            </p>
            <h3 className="mt-3 font-serif text-xl text-foreground">{project.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {project.program}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {project.demand}
            </p>
          </div>
        </button>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl border-border bg-background p-0 sm:rounded-none">
          <img
            src={project.image}
            alt=""
            className="aspect-[16/10] w-full object-cover"
          />
          <div className="p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
              {project.status}
            </p>
            <DialogTitle className="mt-3 font-serif text-2xl text-foreground">
              {project.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Ficha do projeto {project.title}
            </DialogDescription>
            <div className="mt-8 grid gap-6">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
