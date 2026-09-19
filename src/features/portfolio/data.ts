import aresColony from "@/assets/ares-colony.jpg";
import modularHabitats from "@/assets/modular-habitats.jpg";
import retailArcology from "@/assets/retail-arcology.jpg";
import medicalCenter from "@/assets/medical-center.jpg";

export type ProjectStatus = "Conceito" | "Sítio" | "Render de estudo";

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  status: ProjectStatus;
  program: string;
  demand: string;
};

export const projects: Project[] = [
  {
    id: "ares-colony",
    title: "Ares Colony",
    description: "Complexo habitacional de alta densidade e biosfera controlada.",
    image: aresColony,
    status: "Render de estudo",
    program:
      "Densidade alta sob biosfera controlada; malha de módulos e ruas pressurizadas no fundo do vale.",
    demand: "Base residencial permanente de operação, não turismo.",
  },
  {
    id: "habitats-modulares",
    title: "Habitats Modulares",
    description: "Instalações de luxo para executivos e pesquisadores.",
    image: modularHabitats,
    status: "Conceito",
    program:
      "Unidades de estadia para equipe executiva e pesquisa, plugadas em energia e ar da malha.",
    demand: "Ocupação temporária de alto valor no sítio, antes da colônia cheia.",
  },
  {
    id: "mars-retail-arcology",
    title: "Mars Retail Arcology",
    description:
      "Mega complexo comercial e de entretenimento para turismo interplanetário.",
    image: retailArcology,
    status: "Conceito",
    program:
      "Volume comercial e de encontro sob cúpula, dependente de fluxo de pessoas que ainda não existe.",
    demand:
      "Só faz sentido depois dos âncoras de morar, saúde e logística. Último na fila.",
  },
  {
    id: "centro-medico",
    title: "Centro Médico de Excelência",
    description: "Infraestrutura de saúde de ponta garantindo biossegurança total.",
    image: medicalCenter,
    status: "Sítio",
    program: "Infraestrutura de biossegurança e cuidado para população de operação.",
    demand: "Condição de permanência no vale, não amenidade.",
  },
];
