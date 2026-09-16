import aresColony from "@/assets/ares-colony.jpg";
import modularHabitats from "@/assets/modular-habitats.jpg";
import retailArcology from "@/assets/retail-arcology.jpg";
import medicalCenter from "@/assets/medical-center.jpg";

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
    image: aresColony,
  },
  {
    id: "habitats-modulares",
    title: "Habitats Modulares",
    description: "Instalações de luxo para executivos e pesquisadores.",
    image: modularHabitats,
  },
  {
    id: "mars-retail-arcology",
    title: "Mars Retail Arcology",
    description:
      "Mega complexo comercial e de entretenimento para turismo interplanetário.",
    image: retailArcology,
  },
  {
    id: "centro-medico",
    title: "Centro Médico de Excelência",
    description: "Infraestrutura de saúde de ponta garantindo biossegurança total.",
    image: medicalCenter,
  },
];
