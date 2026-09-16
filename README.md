# Ares Mars Investments

Este projeto foi construído com o [Lovable](https://lovable.dev).

## Visão Geral do Projeto

*   **Contexto:** Construção de uma landing page corporativa premium para a Ares Developments, apresentando uma tese de investimento imobiliário fictícia/especulativa em Marte para executivos C-level. A linguagem visual se assemelha a um fundo de investimento de elite ou imobiliária de luxo: contida, sofisticada, orientada a dados e altamente polida.
*   **Objetivo:** Desenvolver uma landing page de página única (single-page) que apresente a tese de investimento em Marte, uma calculadora interativa de projeção de ROI, quatro projetos âncora e um Call to Action (CTA) claro para contato.
*   **Fluxo do Usuário:** Descobrir a tese no Hero → explorar projeções ilustrativas de ROI → revisar os quatro projetos → contatar um especialista.
*   **Páginas:** Página única (single-page) com navegação âncora para as seções: Hero, Calculadora de ROI, Portfólio e Rodapé (Footer).

## Interface e Funcionalidades (Features)

*   **Hero Section (Tela Principal):** Fundo ocupando toda a tela (full-viewport) com a imagem da paisagem rochosa de Marte e um overlay escuro. Inclui o logo da Ares Developments, links de navegação discretos, título centralizado com fonte serifada ("Marte: O Próximo Grande Salto Para Seu Portfólio.") e subtítulo focado em investimentos. Conta com um CTA primário ("Falar com Especialista") e um CTA secundário transparente.
*   **Calculadora de ROI:** Input interativo para valores de investimento em dólares (USD) com cálculo dinâmico das projeções exibidas para 10 anos (450%), 20 anos (1.200%) e 50 anos (5.000%). 
*   **Aviso Legal (Disclaimer):** Os valores de ROI são ilustrativos. Inclui selos de "Resultados não garantidos" ou "Projeções meramente ilustrativas" próximos à calculadora.
*   **Portfólio de Projetos:** Quatro cards padronizados contendo imagem, título e descrição para os seguintes projetos: "Ares Colony", "Habitats Modulares", "Mars Retail Arcology" e "Centro Médico de Excelência". As imagens fornecidas devem mapear perfeitamente para seus respectivos projetos.
*   **Interatividade:** Navegação âncora suave, responsividade excelente para dispositivos móveis e interações sutis de hover/focus (sem animações excessivas).

## Design System e UI

*   **Tema:** Dark mode com fundo principal em `#0F0F11` e superfícies de seções/cards em `#1A1A1D`.
*   **Cores:** Acento primário em vermelho escuro/ferrugem profundo (deep rust) e textos em branco quebrado (off-white).
*   **Tipografia:** `Inter` ou `Roboto` para o corpo do texto e uma fonte serifada elegante (como `Playfair Display`) para os títulos principais.
*   **Estrutura:** Desenvolvido com Tailwind CSS, espaçamentos generosos, grid de 12 colunas no desktop, bordas contidas e sombras sutis.

## Arquitetura e Restrições Técnicas

*   **Estrutura de Pastas:** Baseada em funcionalidades (feature-based).
*   **Boas Práticas:** Separação clara entre UI e lógica de negócios, preferência por componentes reutilizáveis, eliminação de estados duplicados (single source of truth) e manutenção de componentes modulares.
*   **Restrições de Conteúdo:** Não inventar depoimentos falsos, clientes, certificações, aprovações regulatórias, histórico de performance ou alegações de propriedade real de terras em Marte.

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
