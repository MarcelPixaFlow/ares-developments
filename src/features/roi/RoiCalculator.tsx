import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { heliosCommercial, projects } from "@/features/portfolio/data";
import {
  formatUSD,
  formatUSDAmount,
  getScenario,
  projectValue,
  scenarios,
  type ScenarioId,
} from "./projections";

const chartConfig = {
  value: {
    label: "Valor ilustrativo",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const investmentOptions = [
  ...projects.map((project) => ({
    id: project.id,
    title: project.title,
    price: project.price,
    lotsAvailable: project.lotsAvailable,
    lotsTotal: project.lotsTotal,
  })),
  {
    id: heliosCommercial.id,
    title: heliosCommercial.title,
    price: heliosCommercial.price,
    lotsAvailable: heliosCommercial.lotsAvailable,
    lotsTotal: heliosCommercial.lotsTotal,
  },
].sort((a, b) => a.price - b.price);

export function RoiCalculator() {
  const [ticketId, setTicketId] = useState("ares-colony");
  const [scenarioId, setScenarioId] = useState<ScenarioId>("base");
  const [showPremises, setShowPremises] = useState(false);
  const selectedTicket =
    investmentOptions.find((item) => item.id === ticketId) ?? investmentOptions[0]!;
  const amount = selectedTicket.price;
  const scenario = getScenario(scenarioId);

  const rows = useMemo(
    () =>
      scenario.projections.map((p) => ({
        ...p,
        value: projectValue(amount, p.multiplier),
      })),
    [amount, scenario],
  );

  const chartData = useMemo(
    () => [
      { horizon: "Entrada", years: 0, value: Math.max(0, amount) },
      ...rows.map((row) => ({
        horizon: row.horizon,
        years: row.years,
        value: row.value,
      })),
    ],
    [amount, rows],
  );

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Selecione o investimento
        </p>
        <p className="mt-4 font-serif text-3xl tabular-nums text-foreground sm:text-4xl">
          {formatUSD(amount)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{selectedTicket.title}</p>
        <div
          role="radiogroup"
          aria-label="Selecione o investimento"
          className="mt-6 grid gap-2"
        >
          {investmentOptions.map((ticket) => {
            const active = ticket.id === ticketId;
            const sold = ticket.lotsAvailable <= 0;
            return (
              <button
                key={ticket.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTicketId(ticket.id)}
                className={`rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  active
                    ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-serif text-sm text-foreground">{ticket.title}</span>
                  <span className="font-serif text-sm tabular-nums text-foreground">
                    {formatUSD(ticket.price)}
                  </span>
                </span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.14em]">
                  {sold
                    ? "Esgotado"
                    : `${ticket.lotsAvailable} / ${ticket.lotsTotal} lotes disponíveis`}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Cenário
        </p>
        <div
          role="radiogroup"
          aria-label="Cenário de infraestrutura"
          className="mt-4 grid grid-cols-3 gap-2"
        >
          {scenarios.map((item) => {
            const active = item.id === scenarioId;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setScenarioId(item.id)}
                className={`border px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
          {rows.map((row) => (
            <div key={row.id} className="bg-card p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {row.horizon}
              </p>
              <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                US$
              </p>
              <p className="mt-1 whitespace-nowrap font-serif text-xl tabular-nums text-foreground sm:text-2xl">
                {formatUSDAmount(row.value)}
              </p>
              <p className="mt-3 text-sm text-primary">{row.growthLabel}</p>
            </div>
          ))}
        </div>
        <p id="roi-disclaimer" className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Projeções meramente ilustrativas. Resultados não garantidos.
        </p>

        <div className="mt-8 border border-border bg-card p-4 sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Três horizontes · {scenario.label}
          </p>
          <ChartContainer config={chartConfig} className="mt-4 aspect-[16/7] w-full">
            <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="horizon" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                hide
                domain={[0, (dataMax: number) => Math.max(dataMax * 1.05, 1)]}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {formatUSD(Number(value ?? 0))}
                      </span>
                    )}
                  />
                }
              />
              <Area
                dataKey="value"
                type="monotone"
                fill="var(--color-value)"
                fillOpacity={0.18}
                stroke="var(--color-value)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      <div className="border-t border-border pt-8 lg:col-span-12">
        <button
          type="button"
          onClick={() => setShowPremises((open) => !open)}
          aria-expanded={showPremises}
          aria-controls="roi-premissas"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {showPremises ? "Ocultar premissas" : "Ver premissas"}
        </button>
        {showPremises && (
          <div id="roi-premissas">
            <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-primary">
              Premissas
            </p>
            <h3 className="mt-3 font-serif text-2xl text-foreground">Premissas ilustrativas</h3>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              O capital de entrada é o preço fixo do lote de cada projeto do portfólio.
              Os múltiplos de horizonte continuam hipotéticos — não há fluxo de caixa,
              título nem mercado. O motor é um múltiplo de valor terminal, não uma DCF.
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {scenarios.map((item) => (
                <div key={item.id} className="border-t border-border pt-5">
                  <h4 className="font-serif text-lg text-foreground">{item.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
