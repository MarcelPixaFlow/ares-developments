import { useMemo, useState } from "react";
import { formatUSD, formatUSDAmount, parseAmount, projectValue, projections } from "./projections";

const PRESETS = [100_000, 250_000, 1_000_000, 5_000_000];

export function RoiCalculator() {
  const [amount, setAmount] = useState(250000);

  const rows = useMemo(
    () =>
      projections.map((p) => ({
        ...p,
        value: projectValue(amount, p.multiplier),
      })),
    [amount],
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
        <p id="roi-disclaimer" className="mt-8 text-xs leading-relaxed text-muted-foreground">
          Projeções meramente ilustrativas, de caráter hipotético e especulativo.
          Resultados não garantidos.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border lg:col-span-7 sm:grid-cols-3">
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
    </div>
  );
}
