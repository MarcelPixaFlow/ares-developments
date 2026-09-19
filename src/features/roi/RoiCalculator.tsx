import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  formatUSD,
  formatUSDAmount,
  getScenario,
  parseAmount,
  projectValue,
  scenarios,
  type ScenarioId,
} from "./projections";

const PRESETS = [100_000, 250_000, 1_000_000, 5_000_000];

const chartConfig = {
  value: {
    label: "Valor ilustrativo",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function RoiCalculator() {
  const [amount, setAmount] = useState(250000);
  const [scenarioId, setScenarioId] = useState<ScenarioId>("base");
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
        <label
          htmlFor="investment"
          className="block text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          Capital de entrada (US$)
        </label>
        <div className="mt-4 flex items-center gap-3 border-b border-border pb-3 focus-within:border-primary">
          <span className="shrink-0 font-serif text-2xl text-muted-foreground">US$</span>
          <input
            id="investment"
            inputMode="numeric"
            value={amount ? formatUSDAmount(amount) : ""}
            onChange={(e) => setAmount(parseAmount(e.target.value))}
            placeholder="250.000"
            className="w-full min-w-0 bg-transparent font-serif text-3xl tabular-nums text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-4xl"
            aria-describedby="roi-disclaimer"
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const active = amount === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  active
                    ? "border-primary text-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {formatUSD(preset)}
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
        <p id="roi-disclaimer" className="mt-8 text-xs leading-relaxed text-muted-foreground">
          Projeções meramente ilustrativas. Resultados não garantidos.
        </p>
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
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Projeções meramente ilustrativas. Resultados não garantidos.
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-8 lg:col-span-12">
        <p className="text-[10px] uppercase tracking-[0.35em] text-primary">Premissas</p>
        <h3 className="mt-3 font-serif text-2xl text-foreground">Premissas ilustrativas</h3>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Exercício hipotético. Não há fluxo de caixa, título nem mercado. O motor é um
          múltiplo de valor terminal sobre o capital de entrada — não uma DCF.
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
    </div>
  );
}
