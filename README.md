# Ares Mars Investments

Este projeto foi construído com o [Lovable](https://lovable.dev).

## Visão Geral do Projeto

*   **Contexto:** Landing page corporativa premium para a Ares Developments, com uma tese de investimento imobiliário fictícia/especulativa em Marte (Arcana Valley) para executivos C-level. A linguagem visual se assemelha a um fundo de investimento de elite ou imobiliária de luxo: contida, sofisticada, orientada a dados e altamente polida.
*   **Objetivo:** Página única que apresenta a tese, o sítio e o veículo conceitual, uma calculadora interativa de projeções ilustrativas, quatro projetos âncora, a Cidadela Helios (maquete 3D) e um CTA de contato.
*   **Fluxo do Usuário:** Descobrir a tese no Hero → ler o sítio/veículo → simular projeções → revisar o portfólio → explorar a Cidadela Helios → registrar interesse.
*   **Páginas:** Página única com navegação âncora: Hero, Tese, Sítio, Projeções, Portfólio, Cidadela Helios e Contato.

## Interface e Funcionalidades (Features)

*   **Hero:** Fundo full-viewport com a paisagem do Arcana Valley e overlay escuro. Logo Ares Developments, navegação discreta, título serifado (“Marte: O Próximo Grande Salto Para Seu Portfólio.”) e CTAs “Falar com Especialista” / “Ver Projeções”.
*   **Tese:** Três pilares — escassez estrutural, horizonte geracional e natureza especulativa.
*   **Sítio e veículo:** Por que o flanco leste (AV-HX-01), o veículo conceitual (alocação fechada, lock-up geracional) e um cronograma hipotético 2030–2080.
*   **Calculadora de ROI:** Capital de entrada em USD, presets e três cenários ilustrativos (Atraso, Base, Antecipada) com horizontes de 10, 20 e 50 anos. O cenário Base permanece em +450% / +1.200% / +5.000%. Inclui gráfico de área e premissas expansíveis.
*   **Aviso legal:** Projeções meramente ilustrativas; resultados não garantidos. Sem oferta de valores mobiliários nem titularidade real em Marte.
*   **Portfólio:** Quatro âncoras com carrossel de imagens, status, programa e demanda: Ares Colony, Habitats Modulares, Mars Retail Arcology e Centro Médico de Excelência.
*   **Cidadela Helios:** Novo âncora (AV-HX-01) no flanco leste. Maquete 3D interativa (Three.js) com zonas selecionáveis (núcleo, anel residencial, estufas, pista, solar, hídrica, logística, laboratórios) e vistas de estudo (aérea, oblíqua, núcleo).
*   **Contato:** Formulário local (nome, e-mail, ticket, mensagem) persistido em `sessionStorage` — sem backend de envio.
*   **Interatividade:** Navegação âncora suave, menu mobile, hover/focus contidos e responsividade para desktop e mobile.

## Design System e UI

*   **Tema:** Dark mode. Fundo principal próximo de `#0F0F11` e superfícies/cards próximas de `#1A1A1D` (tokens em `oklch` no CSS).
*   **Cores:** Acento primário em vermelho escuro/ferrugem; texto em off-white.
*   **Tipografia:** `Inter` no corpo e `Playfair Display` nos títulos.
*   **Estrutura:** Tailwind CSS, espaçamentos generosos, grid de 12 colunas no desktop, bordas contidas e sombras sutis.

## Arquitetura e Restrições Técnicas

*   **Stack:** React 19, TanStack Start / Router, Vite, Tailwind CSS 4, Three.js (Helios), Recharts (ROI).
*   **Estrutura de pastas:** Feature-based em `src/features/` (`site`, `roi`, `portfolio`, `complex`).
*   **Boas práticas:** Separação entre UI e lógica, componentes reutilizáveis, fonte única de verdade para projeções/projetos/Helios.
*   **Restrições de conteúdo:** Não inventar depoimentos, clientes, certificações, aprovações regulatórias, histórico de performance ou alegações de propriedade real de terras em Marte.

---

## Desenvolvido com Lovable

Continue desenvolvendo este projeto no [editor do Lovable](https://lovable.dev/projects/51d5e833-fc80-4d3c-857a-39fa8dd77f92).

*   **Entregue mais rápido:** descreva o que você deseja construir e o Lovable cuida do código.
*   **Sempre sincronizado:** cada alteração feita no Lovable é commitada diretamente neste repositório.
*   **Controle total:** este código é seu. Faça um push para a branch `main` no GitHub e suas alterações serão sincronizadas de volta ao Lovable, prontas para o seu próximo prompt.

## Desenvolvimento Local

Prefere trabalhar localmente? Você precisará do Node.js e do npm — [instale com o nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <url-deste-repositorio>
cd <nome-do-repositorio>
npm i
npm run dev
```

Outros scripts: `npm run build`, `npm run preview`, `npm run lint`.

