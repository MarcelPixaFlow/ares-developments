import { useMemo, useState } from "react";
import { formatUSD, parseAmount, projectValue, projections } from "./projections";

export function RoiCalculator() {
  const [amount, setAmount] = useState(250000);

  const rows = useMemo(
    () =>
      projections.map((p) => ({
        ...p,
        value: formatUSD(projectValue(amount, p.multiplier)),
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
          Capital de entrada (USD)
        </label>
        <div className="mt-4 flex items-center gap-3 border-b border-border pb-3 focus-within:border-primary">
          <span className="font-serif text-2xl text-muted-foreground">$</span>
          <input
            id="investment"
            inputMode="numeric"
            value={amount ? amount.toLocaleString("pt-BR") : ""}
            onChange={(e) => setAmount(parseAmount(e.target.value))}
            placeholder="250.000"
            className="w-full bg-transparent font-serif text-3xl text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-4xl"
            aria-describedby="roi-disclaimer"
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {[100000, 250000, 1000000, 5000000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className="rounded-full border border-border px-4 py-1.5 text-xs tracking-wide text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {formatUSD(preset)}
            </button>
          ))}
        </div>
        <p id="roi-disclaimer" className="mt-8 text-xs leading-relaxed text-muted-foreground">
          Projeções meramente ilustrativas, de caráter hipotético e especulativo.
          Resultados não garantidos.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border lg:col-span-7 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.id} className="bg-card p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {row.horizon}
            </p>
            <p className="mt-6 font-serif text-2xl text-foreground sm:text-3xl">
              {row.value}
            </p>
            <p className="mt-3 text-sm text-primary">{row.growthLabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
