# Ares Mars Investments

Context: Build a premium corporate landing page for Ares Developments, presenting a fictional/speculative real-estate investment thesis involving Mars to C-level executives. The visual language should resemble an elite investment fund or luxury real-estate firm: restrained, sophisticated, data-driven, and highly polished. Goal: Build a single-page corporate landing page that presents the Mars investment thesis, an interactive ROI projection calculator, four anchor projects, and a clear contact CTA. Flow: discover the thesis in the hero → explore illustrative ROI projections → review the four projects → contact a specialist. Pages: single landing page with anchored sections for Hero, ROI Calculator, Portfolio, and Footer. Core screen: full-viewport Mars rocky landscape hero with a dark overlay, Ares Developments logo, discreet navbar links, centered serif headline “Marte: O Próximo Grande Salto Para Seu Portfólio.”, subtitle “Investimento exclusivo em terrenos e projetos primordiais no Arcana Valley.”, primary CTA “Falar com Especialista”, and a transparent secondary CTA. Features: Add a working investment input in USD and dynamically calculate displayed projected values for 10 years (450%), 20 years (1.200%), and 50 years (5.000%); build four standardized project cards with image, title and description; add smooth anchor navigation and responsive mobile navigation; add a contact CTA suitable for a corporate lead; add subtle hover/focus interactions without excessive animation. Portfolio projects: “Ares Colony” — “Complexo habitacional de alta densidade e biosfera controlada.”; “Habitats Modulares” — “Instalações de luxo para executivos e pesquisadores.”; “Mars Retail Arcology” — “Mega complexo comercial e de entretenimento para turismo interplanetário.”; “Centro Médico de Excelência” — “Infraestrutura de saúde de ponta garantindo biossegurança total.” Data: ROI projections are illustrative/demo values, not guaranteed returns; clearly label them as hypothetical projections and include a discreet “Resultados não garantidos” / “Projeções meramente ilustrativas” disclaimer near the calculator. Design: dark mode with #0F0F11 main background and #1A1A1D section/card surfaces, deep rust/dark red primary accent, off-white text, Inter or Roboto for body copy and an elegant serif such as Playfair Display for major headings; use Tailwind CSS, generous spacing, 12-column desktop grid, restrained borders, subtle shadows, cinematic imagery, excellent mobile responsiveness, accessibility, and premium editorial composition. Hero image: use the provided Mars rocky landscape image if available in the project/assets; otherwise create a visually appropriate image placeholder that is easy to replace. Portfolio images: use the user-provided assets for the domed base, interior with window, shopping complex, and hospital; preserve their intended mapping to the four projects. Constraints: use a feature-based folder structure; separate UI from business logic; prefer reusable components over one-offs; avoid duplicated state (single source of truth); keep components modular and maintainable. Do not invent testimonials, clients, certifications, regulatory approvals, performance history, or claims of actual Mars land ownership. Do not

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/51d5e833-fc80-4d3c-857a-39fa8dd77f92).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
