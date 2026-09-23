import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Database,
  FileDown,
  Inbox,
  Lock,
  LogOut,
  Server,
  Sparkles,
  Timer,
} from "lucide-react";
import { AresLogo } from "@/features/site/AresLogo";
import { formatUSD } from "@/features/roi/projections";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  API_BASE,
  API_META,
  FALLBACK_LEADS,
  FALLBACK_PROJECTS,
  availableLots,
  buildRevenueByProject,
  isSoldStatus,
  projectedRevenue,
  realizedRevenue,
  soldLotsCount,
  totalLots,
  type ApiStatus,
  type DashboardLead,
  type DashboardProject,
} from "./data";
import { authHeaders, clearDashboardKey, readDashboardKey, saveDashboardKey } from "./auth";

type DashboardView = "overview" | "portfolio" | "leads" | "settings";

const VIEWS: { id: DashboardView; label: string }[] = [
  { id: "overview", label: "Visão Geral" },
  { id: "portfolio", label: "Portfólio de Projetos" },
  { id: "leads", label: "Leads" },
  { id: "settings", label: "Configurações" },
];

const chartConfig = {
  realized: {
    label: "Receita realizada",
    color: "var(--primary)",
  },
  remaining: {
    label: "Receita em estoque",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

const integerFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

function statusClass(status: string): string {
  const value = status.toLowerCase();
  if (value.includes("dispon") || value.includes("sítio") || value.includes("sitio")) {
    return "text-[#c69a6d]";
  }
  if (value.includes("esgot")) return "text-muted-foreground";
  if (value.includes("constru") || value.includes("render")) return "text-[#c69a6d]";
  return "text-muted-foreground";
}

function MetricCard({
  label,
  value,
  ready,
  format,
}: {
  label: string;
  value: number;
  ready: boolean;
  format: (n: number) => string;
}) {
  return (
    <article className="border border-border bg-card p-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-3 font-serif text-4xl tabular-nums tracking-tight text-foreground">
        {ready ? format(value) : "—"}
      </p>
    </article>
  );
}

function LeadsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary/40">
        <Inbox className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="mt-4 font-serif text-lg text-foreground">Nenhum lead registado no momento</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Novas reservas e pedidos de alocação aparecerão aqui assim que o pipeline comercial
        receber o primeiro contacto de um family office ou institucional.
      </p>
    </div>
  );
}

function ApiStatusBadge({
  status,
  latencyMs,
}: {
  status: ApiStatus;
  latencyMs: number | null;
}) {
  const label =
    status === "loading"
      ? "Conectando à API…"
      : status === "online"
        ? "API conectada"
        : "API offline — dados ilustrativos";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs transition-colors hover:border-primary/70",
              status === "online" && "text-[#c69a6d]",
              status === "offline" && "text-muted-foreground",
              status === "loading" && "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                status === "online" && "bg-[#c69a6d]",
                status === "offline" && "bg-muted-foreground",
                status === "loading" && "animate-pulse bg-muted-foreground",
              )}
              aria-hidden="true"
            />
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          className="w-72 border border-border bg-card p-0 text-left text-foreground shadow-xl"
        >
          <div className="border-b border-border px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Telemetria da ligação
            </p>
          </div>
          <dl className="space-y-2 px-3 py-3 text-xs">
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                Latência FastAPI
              </dt>
              <dd className="tabular-nums text-foreground">
                {latencyMs == null ? "—" : `${latencyMs} ms`}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <Server className="h-3.5 w-3.5" aria-hidden="true" />
                Versão
              </dt>
              <dd className="text-foreground">{API_META.version}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <Database className="h-3.5 w-3.5" aria-hidden="true" />
                Base de dados
              </dt>
              <dd className="text-foreground">
                {status === "online" ? `${API_META.database} · saudável` : "sem ligação"}
              </dd>
            </div>
            <p className="pt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {API_META.runtime}
            </p>
          </dl>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function exportExecutiveReport(input: {
  soldLots: number;
  available: number;
  realized: number;
  revenue: number;
  leads: number;
  projects: DashboardProject[];
}) {
  const generatedAt = new Date().toLocaleString("pt-BR");
  const rows = input.projects
    .map(
      (project) =>
        `<tr><td>${project.nome}</td><td>${project.tipo}</td><td>${formatUSD(project.preco_base)}</td><td>${project.lotes_disponiveis ?? 0}/${project.lotes_total ?? 0}</td><td>${project.status}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Ares Developments — Relatório Executivo</title>
    <style>
      body { font-family: Georgia, serif; background: #0F0F11; color: #f5f5f4; padding: 48px; }
      h1 { font-weight: 500; }
      p, td, th { font-family: Inter, system-ui, sans-serif; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { border-bottom: 1px solid #2a2a2e; text-align: left; padding: 10px 8px; font-size: 13px; }
      .muted { color: #a3a3a3; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; }
    </style>
  </head>
  <body>
    <p class="muted">Ares Developments · Arcana Valley</p>
    <h1>Relatório executivo de portfólio</h1>
    <p>Gerado em ${generatedAt}. Receita = lotes × preço base.</p>
    <p>Lotes vendidos: ${input.soldLots} · Lotes disponíveis: ${input.available} · Receita realizada: ${formatUSD(input.realized)} · Receita em estoque: ${formatUSD(input.revenue)} · Leads: ${input.leads}</p>
    <table>
      <thead><tr><th>Projeto</th><th>Tipo</th><th>Preço base</th><th>Lotes</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
</html>`;

  const popup = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (popup) {
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    popup.print();
    return;
  }

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "ares-relatorio-executivo.html";
  anchor.click();
  URL.revokeObjectURL(url);
}

function GateScreen({
  password,
  error,
  onPasswordChange,
  onSubmit,
}: {
  password: string;
  error: string | null;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-border bg-card p-8"
      >
        <AresLogo />
        <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
          Acesso restrito
        </p>
        <h1 className="mt-3 font-serif text-3xl text-foreground">Painel administrativo</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Informe a senha operacional para ver leads, receita e registrar vendas.
        </p>
        <label className="mt-8 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            autoComplete="current-password"
            className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-muted-foreground">{error}</p> : null}
        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          Entrar
        </button>
        <Link
          to="/"
          className="mt-4 inline-flex w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          Voltar ao site
        </Link>
      </form>
    </div>
  );
}

export function Dashboard() {
  const [sessionKey, setSessionKey] = useState<string | null>(() => readDashboardKey());
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [view, setView] = useState<DashboardView>("overview");
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [status, setStatus] = useState<ApiStatus>("loading");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [saleBusyId, setSaleBusyId] = useState<number | null>(null);
  const [saleError, setSaleError] = useState<string | null>(null);
  const [saleQty, setSaleQty] = useState<Record<number, number>>({});
  const hasLiveData = useRef(false);

  useEffect(() => {
    if (!sessionKey) return;

    let cancelled = false;
    const controllers: AbortController[] = [];

    async function load() {
      const controller = new AbortController();
      controllers.push(controller);
      const startedAt = performance.now();
      try {
        const [projectsRes, leadsRes] = await Promise.all([
          fetch(`${API_BASE}/projects`, { signal: controller.signal }),
          fetch(`${API_BASE}/leads`, {
            signal: controller.signal,
            headers: authHeaders(sessionKey!),
          }),
        ]);
        if (!projectsRes.ok || !leadsRes.ok) throw new Error("API error");
        const nextProjects = (await projectsRes.json()) as DashboardProject[];
        const nextLeads = (await leadsRes.json()) as DashboardLead[];
        if (cancelled) return;
        hasLiveData.current = true;
        setProjects(nextProjects);
        setLeads(nextLeads);
        setLatencyMs(Math.round(performance.now() - startedAt));
        setStatus("online");
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        if (hasLiveData.current) return;
        setProjects(FALLBACK_PROJECTS);
        setLeads(FALLBACK_LEADS);
        setLatencyMs(null);
        setStatus("offline");
      }
    }

    void load();
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 8000);

    return () => {
      cancelled = true;
      controllers.forEach((controller) => controller.abort());
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(interval);
    };
  }, [sessionKey]);

  const ready = status !== "loading";
  const viewTitle = VIEWS.find((item) => item.id === view)?.label ?? "Visão Geral";
  const soldLots = useMemo(() => soldLotsCount(projects), [projects]);
  const remainingLots = useMemo(() => availableLots(projects), [projects]);
  const inventoryLots = useMemo(() => totalLots(projects), [projects]);
  const revenue = useMemo(() => projectedRevenue(projects), [projects]);
  const bookedRevenue = useMemo(() => realizedRevenue(projects), [projects]);
  const revenueByProject = useMemo(() => buildRevenueByProject(projects), [projects]);
  const simulatedTicket = useMemo(() => {
    const available = projects.filter((project) => !isSoldStatus(project.status));
    const source = available[0] ?? projects[0];
    return source?.preco_base ?? 0;
  }, [projects]);
  const simulatedHorizon = simulatedTicket * 5.5;

  const unlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!saveDashboardKey(password.trim())) {
      setAuthError("Senha inválida.");
      return;
    }
    setAuthError(null);
    setPassword("");
    setSessionKey(password.trim());
  };

  const lock = () => {
    clearDashboardKey();
    setSessionKey(null);
    setProjects([]);
    setLeads([]);
    setStatus("loading");
    hasLiveData.current = false;
  };

  const qtyFor = (project: DashboardProject) => {
    const available = project.lotes_disponiveis ?? 0;
    const requested = saleQty[project.id] ?? 1;
    return Math.min(Math.max(1, requested), Math.max(1, available));
  };

  const registerSale = async (project: DashboardProject) => {
    const available = project.lotes_disponiveis ?? 0;
    const quantidade = qtyFor(project);
    if (!sessionKey || available < 1 || quantidade < 1 || quantidade > available) return;
    setSaleBusyId(project.id);
    setSaleError(null);
    try {
      const response = await fetch(`${API_BASE}/projects/${project.id}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(sessionKey),
        },
        body: JSON.stringify({ quantidade }),
      });
      if (!response.ok) {
        const detail =
          response.status === 409
            ? "Estoque insuficiente."
            : "Não foi possível registrar a venda.";
        throw new Error(detail);
      }
      const updated = (await response.json()) as DashboardProject;
      setProjects((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSaleQty((current) => ({
        ...current,
        [project.id]: Math.min(quantidade, Math.max(1, updated.lotes_disponiveis ?? 0)),
      }));
      setStatus("online");
    } catch (error) {
      setSaleError(error instanceof Error ? error.message : "Não foi possível registrar a venda.");
    } finally {
      setSaleBusyId(null);
    }
  };

  if (!sessionKey) {
    return (
      <GateScreen
        password={password}
        error={authError}
        onPasswordChange={(value) => {
          setPassword(value);
          setAuthError(null);
        }}
        onSubmit={unlock}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <aside className="flex w-full flex-col border-b border-border bg-card lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="border-b border-border px-6 py-6">
          <Link
            to="/"
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Voltar à landing page"
          >
            <AresLogo />
          </Link>
          <p className="mt-5 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Painel administrativo
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Dashboard">
          {VIEWS.map((item) => {
            const active = item.id === view;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-3.5 py-2.5 text-left text-sm transition-colors",
                  active
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={lock}
            className="inline-flex w-full items-center justify-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sair
          </button>
        </div>
        <p className="px-6 pb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Arcana Valley · Marte
        </p>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              Ares Developments
            </p>
            <h1 className="mt-2 font-serif text-3xl text-foreground">{viewTitle}</h1>
          </div>
          <ApiStatusBadge status={status} latencyMs={latencyMs} />
        </header>

        {view === "overview" && (
          <section className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Lotes Vendidos"
                value={soldLots}
                ready={ready}
                format={(n) => integerFormatter.format(Math.round(n))}
              />
              <MetricCard
                label="Lotes Disponíveis"
                value={remainingLots}
                ready={ready}
                format={(n) => integerFormatter.format(Math.round(n))}
              />
              <MetricCard
                label="Receita em Estoque"
                value={revenue}
                ready={ready}
                format={formatUSD}
              />
              <MetricCard
                label="Novos Leads"
                value={leads.length}
                ready={ready}
                format={(n) => integerFormatter.format(Math.round(n))}
              />
            </div>

            <article className="border border-border bg-card p-5">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Portfólio comercial
                  </p>
                  <h2 className="mt-1 font-serif text-xl text-foreground">Receita por projeto</h2>
                </div>
                <p className="text-xs text-muted-foreground">Lotes × preço base</p>
              </div>
              <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
                <BarChart data={revenueByProject} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 8" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={48}
                    tickMargin={8}
                    tickFormatter={(value: number) =>
                      value >= 1_000_000 ? `${Math.round(value / 1_000_000)}M` : formatUSD(value)
                    }
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        formatter={(value) => (
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {formatUSD(Number(value ?? 0))}
                          </span>
                        )}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="realized" stackId="revenue" fill="var(--color-realized)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="remaining" stackId="revenue" fill="var(--color-remaining)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </article>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setView("portfolio")}
                className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-opacity hover:opacity-90"
              >
                Registrar venda
              </button>
              <button
                type="button"
                onClick={() =>
                  exportExecutiveReport({
                    soldLots,
                    available: remainingLots,
                    realized: bookedRevenue,
                    revenue,
                    leads: leads.length,
                    projects,
                  })
                }
                className="inline-flex items-center justify-center gap-2 border border-border bg-card px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary/70"
              >
                <FileDown className="h-4 w-4 text-primary" aria-hidden="true" />
                Exportar Relatório PDF
              </button>
              <button
                type="button"
                onClick={() => setSimulateOpen(true)}
                className="inline-flex items-center justify-center gap-2 border border-border bg-card px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary/70"
              >
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                Simular tese 5,5×
              </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <DataTable
                title="Últimos Leads / Reservas"
                columns={["Investidor", "Projeto de Interesse", "Status"]}
                emptyState={<LeadsEmptyState />}
                rows={leads.map((lead) => [
                  lead.nome,
                  lead.project?.nome ?? "—",
                  { text: "Novo", className: "text-[#c69a6d]" },
                ])}
              />
              <DataTable
                title="Status do Portfólio"
                columns={["Projeto", "Tipo", "Lotes disponíveis", "Status"]}
                empty="Nenhum projeto no portfólio."
                rows={projects.map((project) => [
                  project.nome,
                  project.tipo,
                  {
                    text: `${project.lotes_disponiveis ?? 0} / ${project.lotes_total ?? 0}`,
                    className:
                      (project.lotes_disponiveis ?? 0) > 0 ? "text-[#c69a6d]" : "text-muted-foreground",
                  },
                  { text: project.status, className: statusClass(project.status) },
                ])}
              />
            </div>
          </section>
        )}

        {view === "portfolio" && (
          <section className="overflow-hidden border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-serif text-xl text-foreground">Portfólio de Projetos</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe a quantidade e registre a venda. O estoque no SQLite, a receita e os KPIs atualizam na hora.
              </p>
              {saleError ? <p className="mt-2 text-sm text-muted-foreground">{saleError}</p> : null}
              {status === "offline" ? (
                <p className="mt-2 text-sm text-amber-400">
                  API offline — vendas só são gravadas com o backend ligado.
                </p>
              ) : null}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <tr>
                    {["Projeto", "Tipo", "Preço Base", "Lotes", "Status", ""].map((column) => (
                      <th key={column || "acao"} className="px-5 py-3 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {projects.map((project) => {
                    const available = project.lotes_disponiveis ?? 0;
                    const quantidade = qtyFor(project);
                    const canSell = available > 0 && saleBusyId !== project.id && status === "online";
                    return (
                      <tr key={project.id}>
                        <td className="px-5 py-3 text-foreground">{project.nome}</td>
                        <td className="px-5 py-3 text-muted-foreground">{project.tipo}</td>
                        <td className="px-5 py-3 text-muted-foreground">{formatUSD(project.preco_base)}</td>
                        <td
                          className={cn(
                            "px-5 py-3",
                            available > 0 ? "text-[#c69a6d]" : "text-muted-foreground",
                          )}
                        >
                          {available} / {project.lotes_total ?? 0}
                        </td>
                        <td className={cn("px-5 py-3", statusClass(project.status))}>{project.status}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <input
                              type="number"
                              min={1}
                              max={Math.max(1, available)}
                              step={1}
                              value={available < 1 ? 0 : quantidade}
                              disabled={!canSell}
                              aria-label={`Quantidade de lotes para ${project.nome}`}
                              onChange={(event) => {
                                const next = Number.parseInt(event.target.value, 10);
                                setSaleQty((current) => ({
                                  ...current,
                                  [project.id]: Number.isFinite(next)
                                    ? Math.min(Math.max(1, next), available)
                                    : 1,
                                }));
                              }}
                              className="h-8 w-16 border border-border bg-background px-2 text-right text-xs tabular-nums text-foreground outline-none focus:border-primary disabled:opacity-40"
                            />
                            <button
                              type="button"
                              disabled={!canSell || quantidade < 1 || quantidade > available}
                              onClick={() => void registerSale(project)}
                              className="border border-border px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {saleBusyId === project.id
                                ? "Gravando…"
                                : quantidade === 1
                                  ? "Vender 1 lote"
                                  : `Vender ${quantidade} lotes`}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {view === "leads" && (
          <DataTable
            title="Leads"
            columns={["Investidor", "E-mail", "Projeto", "Status"]}
            emptyState={<LeadsEmptyState />}
            rows={leads.map((lead) => [
              lead.nome,
              lead.email || "—",
              lead.project?.nome ?? "—",
              { text: "Novo", className: "text-[#c69a6d]" },
            ])}
          />
        )}

        {view === "settings" && (
          <article className="max-w-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl text-foreground">Configurações</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Endpoint da API: <span className="text-foreground">{API_BASE}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Leads e vendas exigem a senha operacional. O site público continua a gravar
              pedidos em <code className="text-foreground">POST /leads</code> sem senha.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Senha local padrão: <code className="text-foreground">ares-admin</code>. Altere
              com <code className="text-foreground">VITE_DASHBOARD_PASSWORD</code> e{" "}
              <code className="text-foreground">ARES_DASHBOARD_PASSWORD</code>.
            </p>
          </article>
        )}
      </main>

      <Dialog open={simulateOpen} onOpenChange={setSimulateOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Simular nova aquisição</DialogTitle>
            <DialogDescription>
              Preço fixo do lote disponível, com horizonte ilustrativo de 10 anos (tese Base, 5,5×).
            </DialogDescription>
          </DialogHeader>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Preço do lote</dt>
              <dd className="tabular-nums text-foreground">{formatUSD(simulatedTicket)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Valor projetado em 2035</dt>
              <dd className="tabular-nums text-[#c69a6d]">
                {formatUSD(simulatedHorizon)}
              </dd>
            </div>
          </dl>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type CellValue = string | { text: string; className?: string };

function DataTable({
  title,
  columns,
  rows,
  empty,
  emptyState,
}: {
  title: string;
  columns: string[];
  rows: CellValue[][];
  empty?: string;
  emptyState?: ReactNode;
}) {
  return (
    <section className="overflow-hidden border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-serif text-xl text-foreground">{title}</h2>
      </div>
      {rows.length === 0 && emptyState ? (
        emptyState
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-5 py-3 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-8 text-muted-foreground">
                    {empty}
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => {
                      const text = typeof cell === "string" ? cell : cell.text;
                      const className = typeof cell === "string" ? undefined : cell.className;
                      return (
                        <td
                          key={`${index}-${cellIndex}`}
                          className={cn(
                            "px-5 py-3",
                            cellIndex === 0 ? "text-foreground" : "text-muted-foreground",
                            className,
                          )}
                        >
                          {text}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
