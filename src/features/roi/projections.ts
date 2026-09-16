export type Projection = {
  id: string;
  horizon: string;
  growthLabel: string;
  multiplier: number;
};

/** Illustrative, hypothetical growth scenarios. Not guaranteed returns. */
export const projections: Projection[] = [
  { id: "y10", horizon: "10 anos", growthLabel: "+450%", multiplier: 5.5 },
  { id: "y20", horizon: "20 anos", growthLabel: "+1.200%", multiplier: 13 },
  { id: "y50", horizon: "50 anos", growthLabel: "+5.000%", multiplier: 51 },
];

export const projectValue = (amount: number, multiplier: number) =>
  Math.max(0, amount) * multiplier;

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatUSD = (value: number) => formatter.format(value);

export const parseAmount = (raw: string) => {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};
