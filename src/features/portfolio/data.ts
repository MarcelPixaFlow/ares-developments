import aresColony from "@/assets/ares-colony.jpg.asset.json";
import modularHabitats from "@/assets/modular-habitats.jpg.asset.json";
import retailArcology from "@/assets/retail-arcology.jpg.asset.json";
import medicalCenter from "@/assets/medical-center.jpg.asset.json";

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const projects: Project[] = [
  {
    id: "ares-colony",
    title: "Ares Colony",
    description: "Complexo habitacional de alta densidade e biosfera controlada.",
    image: aresColony.url,
  },
  {
    id: "habitats-modulares",
    title: "Habitats Modulares",
    description: "Instalações de luxo para executivos e pesquisadores.",
    image: modularHabitats.url,
  },
  {
    id: "mars-retail-arcology",
    title: "Mars Retail Arcology",
    description:
      "Mega complexo comercial e de entretenimento para turismo interplanetário.",
    image: retailArcology.url,
  },
  {
    id: "centro-medico",
    title: "Centro Médico de Excelência",
    description: "Infraestrutura de saúde de ponta garantindo biossegurança total.",
    image: medicalCenter.url,
  },
];
