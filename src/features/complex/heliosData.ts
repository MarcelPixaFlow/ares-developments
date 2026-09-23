import heliosAerial from "@/assets/helios-aerial.jpg";
import heliosOblique from "@/assets/helios-ob.jpg";
import heliosTower from "@/assets/helios-tower.jpg";

export type HeliosZone = {
  id: string;
  title: string;
  use: string;
  adjacencies: string;
  program: string;
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
    use: "Comando, comunicações, observação.",
    adjacencies: "Anel residencial, laboratórios, hub logístico.",
    program: "Eixo vertical de controle e referência visual do complexo.",
    focus: { x: 0, y: 2.4, z: 0 },
  },
  {
    id: "residencial",
    title: "Anel residencial",
    use: "Moradia de operação.",
    adjacencies: "Núcleo, estufas, laboratórios.",
    program: "Cinturão habitável em volta do núcleo; circulação curta até trabalho e estufa.",
    focus: { x: 5.4, y: 0.8, z: 5.4 },
  },
  {
    id: "estufas",
    title: "Estufas Vesper",
    use: "Alimento e ciclo de ar.",
    adjacencies: "Anel residencial, extração hídrica, campo solar.",
    program: "Produção em borda iluminada, dependente de água e energia do sítio.",
    focus: { x: 0, y: 0.9, z: -11 },
  },
  {
    id: "plataforma",
    title: "Plataforma de pouso",
    use: "Pista e pátio.",
    adjacencies: "Hub logístico, núcleo.",
    program: "Linha de aproximação do flanco leste; não é o centro — é a porta.",
    focus: { x: 11.5, y: 0.4, z: 6 },
  },
  {
    id: "solar",
    title: "Campo solar",
    use: "Geração.",
    adjacencies: "Extração hídrica, estufas, laboratórios.",
    program: "Platô alto, sombreamento baixo, alimenta o restante do programa.",
    focus: { x: -12, y: 0.5, z: -8 },
  },
  {
    id: "hidrica",
    title: "Extração hídrica",
    use: "Água.",
    adjacencies: "Estufas, campo solar, hub.",
    program: "Depressão do sítio; sem isto o anel e as estufas não param de pé.",
    focus: { x: -11, y: 1.1, z: 8 },
  },
  {
    id: "logistica",
    title: "Hub logístico",
    use: "Carga, oficina, trânsito de superfície.",
    adjacencies: "Pista, núcleo, extração.",
    program: "Quebra da cadeia entre pouso e o resto do complexo.",
    focus: { x: 10, y: 0.9, z: -8 },
  },
  {
    id: "laboratorios",
    title: "Laboratórios",
    use: "Pesquisa.",
    adjacencies: "Núcleo, anel, campo solar.",
    program: "Bloco técnico do âncora AV-HX-01, não vitrine.",
    focus: { x: 9, y: 0.9, z: 10 },
  },
];

export const heliosViewSlots = [
  {
    id: "aerea",
    label: "Vista aérea",
    hint: "Planta a 90°",
    image: heliosAerial,
    diagram: true,
  },
  {
    id: "obliqua",
    label: "Vista oblíqua",
    hint: "Câmera 35–45°",
    image: heliosOblique,
    diagram: false,
  },
  {
    id: "nucleo",
    label: "Vista do núcleo",
    hint: "Torre em close",
    image: heliosTower,
    diagram: false,
  },
] as const;

export const heliosViewImages = {
  aerea: heliosAerial,
  obliqua: heliosOblique,
  nucleo: heliosTower,
};
