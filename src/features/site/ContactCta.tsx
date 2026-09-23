import { useEffect, useMemo, useState, type FormEvent } from "react";
import { formatUSD } from "@/features/roi/projections";
import { cn } from "@/lib/utils";
import {
  API_BASE,
  FALLBACK_PROJECTS,
  isSoldStatus,
  type DashboardProject,
} from "@/features/dashboard/data";

type Inquiry = {
  name: string;
  email: string;
  ticket: number;
  message: string;
  projectName: string;
  recordedAt: string;
};

export function ContactCta() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [projectId, setProjectId] = useState<number | "">("");
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === projectId),
    [projects, projectId],
  );
  const ticket = selectedProject?.preco_base ?? 0;
  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => a.preco_base - b.preco_base),
    [projects],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch(`${API_BASE}/projects`, { signal: controller.signal });
        if (!response.ok) throw new Error("API error");
        const next = (await response.json()) as DashboardProject[];
        setProjects(next);
        setApiOnline(true);
        const preferred = next.find((project) => !isSoldStatus(project.status)) ?? next[0];
        setProjectId(preferred?.id ?? "");
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        setProjects(FALLBACK_PROJECTS);
        setApiOnline(false);
        const preferred =
          FALLBACK_PROJECTS.find((project) => !isSoldStatus(project.status)) ??
          FALLBACK_PROJECTS[0];
        setProjectId(preferred?.id ?? "");
      }
    }

    void loadProjects();
    return () => controller.abort();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) {
      setError("Informe nome e e-mail.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (projectId === "") {
      setError("Selecione um projeto de interesse.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: trimmedName,
          email: trimmedEmail,
          project_id: projectId,
        }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const created = (await response.json()) as { project?: { nome?: string } };
      setInquiry({
        name: trimmedName,
        email: trimmedEmail,
        ticket,
        message: message.trim(),
        projectName: created.project?.nome ?? projects.find((item) => item.id === projectId)?.nome ?? "—",
        recordedAt: new Date().toISOString(),
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Não foi possível registrar o lead. Confirme se a API está em execução.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setInquiry(null);
    setError(null);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <h2 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          Converse com um especialista da Ares
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Reunião privada sobre a tese e o veículo descritos acima.
        </p>
        <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted-foreground">
          O pedido é gravado no backend e aparece no painel administrativo. O ticket
          é o preço fixo do lote do projeto escolhido; a mensagem fica só neste ecrã
          de confirmação.
        </p>
        <a
          href="#tese"
          className="mt-8 inline-flex items-center justify-center border border-border px-8 py-4 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Rever a tese
        </a>
      </div>

      <div className="lg:col-span-7">
        {inquiry ? (
          <div
            className="border border-border bg-card p-8"
            role="status"
            aria-live="polite"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary">
              Lead registado na API
            </p>
            <h3 className="mt-4 font-serif text-2xl text-foreground">
              Pedido enviado à fila institucional.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Os dados já estão no backend e devem aparecer em Painel → Leads.
              Segue o resumo do pedido:
            </p>
            <dl className="mt-8 grid gap-4 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Nome
                </dt>
                <dd className="mt-1 text-foreground">{inquiry.name}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  E-mail
                </dt>
                <dd className="mt-1 text-foreground">{inquiry.email}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Projeto
                </dt>
                <dd className="mt-1 text-foreground">{inquiry.projectName}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Preço do lote
                </dt>
                <dd className="mt-1 tabular-nums text-foreground">
                  {formatUSD(inquiry.ticket)}
                </dd>
              </div>
              {inquiry.message ? (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Mensagem
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-foreground">
                    {inquiry.message}
                  </dd>
                </div>
              ) : null}
            </dl>
            <button
              type="button"
              onClick={resetForm}
              className="mt-8 inline-flex items-center justify-center border border-border px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Registrar outro pedido
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="grid gap-6 border border-border bg-card p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Nome
              </label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-3 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                E-mail
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-3 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <fieldset className="min-w-0">
              <legend className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Selecione o investimento
              </legend>
              <div
                role="radiogroup"
                aria-label="Projeto de interesse"
                className="mt-3 grid gap-1.5"
              >
                {orderedProjects.length === 0
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-10 animate-pulse rounded-md border border-border bg-secondary/40"
                      />
                    ))
                  : orderedProjects.map((project) => {
                      const sold = isSoldStatus(project.status);
                      const active = project.id === projectId;
                      return (
                        <button
                          key={project.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setProjectId(project.id)}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                            active
                              ? "border-primary bg-primary/15 ring-1 ring-primary"
                              : "border-border bg-secondary/30 hover:border-primary/70 hover:bg-secondary/60",
                            sold && !active && "opacity-70",
                          )}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-foreground">
                              {project.nome}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-muted-foreground">
                              {sold
                                ? "Esgotado"
                                : `${project.lotes_disponiveis ?? 0}/${project.lotes_total ?? 0} lotes`}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm tabular-nums text-foreground">
                            {formatUSD(project.preco_base)}
                          </span>
                        </button>
                      );
                    })}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Mensagem
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-3 w-full resize-y border border-border bg-transparent p-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            {apiOnline === false ? (
              <p className="text-sm text-amber-400" role="status">
                API offline. Inicie o backend em 127.0.0.1:8000 para gravar o lead.
              </p>
            ) : null}

            {error ? (
              <p className="text-sm text-muted-foreground" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting || apiOnline === false || projects.length === 0}
              className="inline-flex w-full items-center justify-center bg-primary px-8 py-4 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {submitting ? "A enviar…" : "Registrar pedido"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
