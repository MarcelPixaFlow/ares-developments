import catalog from "./inventory.json";

export type InventoryProject = {
  slug: string;
  nome: string;
  tipo: string;
  preco_base: number;
  status: string;
  lotes_total: number;
  lotes_disponiveis: number;
};

export const inventoryProjects = catalog.projects as InventoryProject[];

export function inventoryBySlug(slug: string): InventoryProject {
  const row = inventoryProjects.find((item) => item.slug === slug);
  if (!row) {
    throw new Error(`Inventário sem o projeto ${slug}`);
  }
  return row;
}

export function commercialBySlug(slug: string) {
  const row = inventoryBySlug(slug);
  return {
    price: row.preco_base,
    lotsTotal: row.lotes_total,
    lotsAvailable: row.lotes_disponiveis,
  };
}
