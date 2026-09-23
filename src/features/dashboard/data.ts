import { inventoryProjects } from "@/data/inventory";

export type DashboardProject = {
  id: number;
  nome: string;
  tipo: string;
  preco_base: number;
  status: string;
  lotes_total: number;
  lotes_disponiveis: number;
};

export type DashboardLead = {
  id: number;
  nome: string;
  email: string;
  project_id: number;
  project: DashboardProject;
};

export type ApiStatus = "loading" | "online" | "offline";

export const FALLBACK_PROJECTS: DashboardProject[] = inventoryProjects.map((item, index) => ({
  id: index + 1,
  nome: item.nome,
  tipo: item.tipo,
  preco_base: item.preco_base,
  status: item.status,
  lotes_total: item.lotes_total,
  lotes_disponiveis: item.lotes_disponiveis,
}));

export const FALLBACK_LEADS: DashboardLead[] = [
  {
    id: 1,
    nome: "Helena Voss",
    email: "helena.voss@example.com",
    project_id: 1,
    project: FALLBACK_PROJECTS[0]!,
  },
  {
    id: 2,
    nome: "Marcus Chen",
    email: "marcus.chen@example.com",
    project_id: 2,
    project: FALLBACK_PROJECTS[1]!,
  },
  {
    id: 3,
    nome: "Sofia Almeida",
    email: "sofia.almeida@example.com",
    project_id: 3,
    project: FALLBACK_PROJECTS[2]!,
  },
];

function readApiBase(): string {
  const value = import.meta.env["VITE_API_URL"];
  return typeof value === "string" && value.length > 0 ? value : "http://127.0.0.1:8000";
}

export const API_BASE = readApiBase();

export function isSoldStatus(status: string): boolean {
  return status.toLowerCase().includes("esgot");
}

export function availableLots(projects: DashboardProject[]): number {
  return projects.reduce((total, project) => total + (project.lotes_disponiveis ?? 0), 0);
}

function soldLotsFor(project: DashboardProject): number {
  const remaining = project.lotes_disponiveis ?? 0;
  const inventory = project.lotes_total ?? 0;
  return Math.max(0, inventory - remaining);
}

export function soldLotsCount(projects: DashboardProject[]): number {
  return projects.reduce((total, project) => total + soldLotsFor(project), 0);
}

export function totalLots(projects: DashboardProject[]): number {
  return projects.reduce((total, project) => total + (project.lotes_total ?? 0), 0);
}

export function realizedRevenue(projects: DashboardProject[]): number {
  return projects.reduce(
    (total, project) => total + soldLotsFor(project) * project.preco_base,
    0,
  );
}

export function projectedRevenue(projects: DashboardProject[]): number {
  return projects.reduce(
    (total, project) => total + (project.lotes_disponiveis ?? 0) * project.preco_base,
    0,
  );
}

export type KpiTrend = {
  pct: string;
  caption: string;
  positive: boolean;
};

export const KPI_TRENDS = {
  soldLots: { pct: "+12,4%", caption: "vs. último mês", positive: true },
  availableLots: { pct: "stock vivo", caption: "unidades ainda alocáveis", positive: true },
  revenue: { pct: "pipeline", caption: "estoque × preço base", positive: true },
  leads: { pct: "+4,1%", caption: "vs. último mês", positive: true },
} as const satisfies Record<string, KpiTrend>;

export const API_META = {
  version: "Ares API 1.0.0",
  runtime: "FastAPI · Uvicorn",
  database: "SQLite · ares.db",
} as const;

export type RevenueBarPoint = {
  name: string;
  realized: number;
  remaining: number;
};

function shortProjectName(nome: string): string {
  return nome.trim().split(/\s+/).slice(0, 2).join(" ");
}

export function buildRevenueByProject(projects: DashboardProject[]): RevenueBarPoint[] {
  return projects.map((project) => ({
    name: shortProjectName(project.nome),
    realized: soldLotsFor(project) * project.preco_base,
    remaining: (project.lotes_disponiveis ?? 0) * project.preco_base,
  }));
}
