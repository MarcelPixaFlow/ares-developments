import aresColony from "@/assets/ares-colony.jpg";
import aresInterno from "@/assets/ares-interno.jpg";
import aresZoom from "@/assets/ares-zoom.jpg";
import modularHabitats from "@/assets/modular-habitats.jpg";
import modularHabitatKitchen from "@/assets/modular-habitat-kitchen.jpg";
import modularHabitatQuarto from "@/assets/modular-habitat-quarto.jpg";
import retailArcology from "@/assets/retail-arcology.jpg";
import retailArcologyAlimentacao from "@/assets/retail-arcology-alimentacao.jpg";
import retailArcologyPlayground from "@/assets/retail-arcology-playground.jpg";
import retailArcologyZoom from "@/assets/retail-arcology-zoom.jpg";
import medicalCenter from "@/assets/medical-center.jpg";
import medicalCenterTrans from "@/assets/medical-center-trans.jpg";
import medicalCenterZoomIn from "@/assets/medical-center-zoom-in.jpg";
import { commercialBySlug } from "@/data/inventory";

export type ProjectStatus = "Conceito" | "Sítio" | "Render de estudo";

export type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
  status: ProjectStatus;
  program: string;
  demand: string;
  price: number;
  lotsTotal: number;
  lotsAvailable: number;
};

export type LotTicket = {
  id: string;
  title: string;
  price: number;
};

export const projects: Project[] = [
  {
    id: "ares-colony",
    title: "Ares Colony",
    description: "Complexo habitacional de alta densidade e biosfera controlada.",
    images: [aresColony, aresInterno, aresZoom],
    status: "Render de estudo",
    program:
      "Densidade alta sob biosfera controlada; malha de módulos e ruas pressurizadas no fundo do vale.",
    demand: "Base residencial permanente de operação, não turismo.",
    ...commercialBySlug("ares-colony"),
  },
  {
    id: "habitats-modulares",
    title: "Habitats Modulares",
    description: "Instalações de luxo para executivos e pesquisadores.",
    images: [modularHabitats, modularHabitatKitchen, modularHabitatQuarto],
    status: "Conceito",
    program: "Unidades de estadia para equipe e pesquisa, ligadas à malha de energia e ar.",
    demand: "Ocupação temporária de alto valor, antes da colônia cheia.",
    ...commercialBySlug("habitats-modulares"),
  },
  {
    id: "mars-retail-arcology",
    title: "Mars Retail Arcology",
    description: "Mega complexo comercial e de entretenimento para turismo interplanetário.",
    images: [
      retailArcology,
      retailArcologyAlimentacao,
      retailArcologyPlayground,
      retailArcologyZoom,
    ],
    status: "Conceito",
    ...commercialBySlug("mars-retail-arcology"),
    program: "Volume comercial e de encontro sob cúpula, dependente de fluxo que ainda não existe.",
    demand: "Só depois dos âncoras de morar, saúde e logística. Último na fila.",
  },
  {
    id: "centro-medico",
    title: "Centro Médico de Excelência",
    description: "Infraestrutura de saúde de ponta garantindo biossegurança total.",
    images: [medicalCenter, medicalCenterTrans, medicalCenterZoomIn],
    status: "Sítio",
    program: "Biossegurança e cuidado para a população de operação.",
    demand: "Condição de permanência no vale, não amenidade.",
    ...commercialBySlug("centro-medico"),
  },
];

export const heliosCommercial: LotTicket & { lotsTotal: number; lotsAvailable: number } = {
  id: "cidadela-helios",
  title: "Cidadela Helios",
  ...commercialBySlug("cidadela-helios"),
};
