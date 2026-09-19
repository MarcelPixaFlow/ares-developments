import heliosAerial from "@/assets/helios-aerial.jpg";
import heliosOblique from "@/assets/helios-ob.jpg";
import heliosTower from "@/assets/helios-tower.jpg";

export type HeliosZone = {
  id: string;
  title: string;
  summary: string;
  description: string;
  focus: { x: number; y: number; z: number };
};

export const heliosComplex = {
  name: "Cidadela Helios",
  code: "AV-HX-01",
  location: "Flanco leste do Arcana Valley",
  blurb:
    "Novo âncora do portfólio: hub de pesquisa, energia e logística no flanco leste. A maquete 3D é a planta de sítio — volumes, adjacências e circulação de superfície, em escala de estudo.",
};

export const heliosZones: HeliosZone[] = [
  {
    id: "nucleo",
    title: "Núcleo Helios",
    summary: "Torre de comando e observatório central.",
    description:
      "Volume vertical de controle, comunicações e observação. Ponto de referência do complexo e eixo de todas as conexões de superfície.",
    focus: { x: 0, y: 2.4, z: 0 },
  },
  {
    id: "residencial",
    title: "Anel residencial",
    summary: "Módulos habitacionais em anel ao redor da praça.",
    description:
      "Oito módulos pressurizados para equipes de pesquisa e operação. O anel define o pátio central e o circuito de circulação.",
    focus: { x: 5.4, y: 0.8, z: 5.4 },
  },
  {
    id: "estufas",
    title: "Estufas Vesper",
    summary: "Dois volumes lineares de cultivo controlado.",
    description:
      "Barras de cultivo e suporte biológico no eixo sul. Leitura clara em planta: dois retângulos longos paralelos à via principal.",
    focus: { x: 0, y: 0.9, z: -11 },
  },
  {
    id: "plataforma",
    title: "Plataforma de pouso",
    summary: "Pátio de pouso e transferência de carga.",
    description:
      "Disco operacional a leste, com anel de sinalização. Destinado a naves de reabastecimento e módulos de carga curta.",
    focus: { x: 11.5, y: 0.4, z: 6 },
  },
  {
    id: "solar",
    title: "Campo solar",
    summary: "Matriz de captação no quadrante oeste.",
    description:
      "Grelha de painéis de baixa altura. No mapa, funciona como textura de ocupação do terreno — não como volume habitável.",
    focus: { x: -12, y: 0.5, z: -8 },
  },
  {
    id: "hidrica",
    title: "Extração hídrica",
    summary: "Três tanques e linha de transferência.",
    description:
      "Conjunto de cilindros no noroeste para armazenamento e processamento de gelo/regolito. Alimenta estufas e o anel residencial.",
    focus: { x: -11, y: 1.1, z: 8 },
  },
  {
    id: "logistica",
    title: "Hub logístico",
    summary: "Armazém e pátio de consolidação.",
    description:
      "Bloco baixo a sudoeste, encostado à via leste-oeste. Recebe carga da plataforma e distribui para o restante do sítio.",
    focus: { x: 10, y: 0.9, z: -8 },
  },
  {
    id: "laboratorios",
    title: "Laboratórios",
    summary: "Bloco de pesquisa no quadrante nordeste.",
    description:
      "Volume horizontal de ensaios e instrumentação, ligado ao núcleo por galeria. Fachada contínua, fácil de isolar em vistas laterais.",
    focus: { x: 9, y: 0.9, z: 10 },
  },
];

export const heliosViewSlots = [
  {
    id: "aerea",
    label: "Vista aérea",
    hint: "Planta a 90°",
    image: heliosAerial,
  },
  {
    id: "obliqua",
    label: "Vista oblíqua",
    hint: "Câmera 35–45°",
    image: heliosOblique,
  },
  {
    id: "nucleo",
    label: "Vista do núcleo",
    hint: "Torre em close",
    image: heliosTower,
  },
] as const;

export const heliosViewImages = {
  aerea: heliosAerial,
  obliqua: heliosOblique,
  nucleo: heliosTower,
};
