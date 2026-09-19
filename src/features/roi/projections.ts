export type Projection = {
  id: string;
  horizon: string;
  years: number;
  growthLabel: string;
  multiplier: number;
};

export type ScenarioId = "atraso" | "base" | "antecipada";

export type Scenario = {
  id: ScenarioId;
  label: string;
  title: string;
  body: string;
  projections: Projection[];
};

/** Illustrative, hypothetical growth scenarios. Not guaranteed returns. */
export const scenarios: Scenario[] = [
  {
    id: "atraso",
    label: "Atraso",
    title: "Atraso",
    body: "Janela de pouso, energia e água escorrega uma geração. Terra crua permanece illiquid por mais tempo. O múltiplo de 10 anos é quase só optionality; o de 50 anos não alcança o Base.",
    projections: [
      { id: "y10", horizon: "10 anos", years: 10, growthLabel: "+120%", multiplier: 2.2 },
      { id: "y20", horizon: "20 anos", years: 20, growthLabel: "+450%", multiplier: 5.5 },
      { id: "y50", horizon: "50 anos", years: 50, growthLabel: "+1.900%", multiplier: 20 },
    ],
  },
  {
    id: "base",
    label: "Base",
    title: "Base",
    body: "Corredor logístico do Arcana Valley recebe âncoras no ritmo da tese: primeiros habitats na década de 2030, Cidadela como hub na de 2040, liquidez residual só em horizonte geracional. Re-rating concentrado nos primeiros 10–20 anos; depois o múltiplo cresce mais devagar (CAGR implícito decrescente: 10a ≈ 18,6% a.a. · 20a ≈ 13,7% a.a. · 50a ≈ 8,2% a.a.).",
    projections: [
      { id: "y10", horizon: "10 anos", years: 10, growthLabel: "+450%", multiplier: 5.5 },
      { id: "y20", horizon: "20 anos", years: 20, growthLabel: "+1.200%", multiplier: 13 },
      { id: "y50", horizon: "50 anos", years: 50, growthLabel: "+5.000%", multiplier: 51 },
    ],
  },
  {
    id: "antecipada",
    label: "Antecipada",
    title: "Antecipada",
    body: "Energia, extração hídrica e pista entram antes do desenho-base. Âncoras (colônia, saúde, retail) antecipam demanda derivada. Continua especulativo: execução, titularidade e saída não existem.",
    projections: [
      { id: "y10", horizon: "10 anos", years: 10, growthLabel: "+700%", multiplier: 8 },
      { id: "y20", horizon: "20 anos", years: 20, growthLabel: "+2.100%", multiplier: 22 },
      { id: "y50", horizon: "50 anos", years: 50, growthLabel: "+8.400%", multiplier: 85 },
    ],
  },
];

export const getScenario = (id: ScenarioId) =>
  scenarios.find((item) => item.id === id) ?? scenarios[1]!;

export const projections = getScenario("base").projections;

export const projectValue = (amount: number, multiplier: number) =>
  Math.max(0, amount) * multiplier;

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

export const formatUSDAmount = (value: number) => numberFormatter.format(value);

export const formatUSD = (value: number) => `US$ ${formatUSDAmount(value)}`;

export const parseAmount = (raw: string) => {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};
