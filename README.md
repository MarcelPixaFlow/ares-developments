# Ares Developments

Landing corporativa e painel operacional da Ares Developments — tese especulativa de investimento no Arcana Valley, Marte.

## Visão geral

*   **Contexto:** Página premium para executivos C-level, com linguagem de fundo imobiliário de elite.
*   **Fluxo:** Hero → tese → sítio/veículo → projeções → portfólio → Cidadela Helios → contato. O botão **Acesso interno** abre `/dashboard` (protegido por senha).
*   **Páginas:** `/` (landing) e `/dashboard` (KPIs, portfólio, leads, registro de venda, configurações).

## Portfólio (preços fixos)

O capital de entrada deixou de ser um ticket sugerido. Preço e stock vivem numa única fonte: `src/data/inventory.json`. O seed da API, a landing, o ROI, o formulário e o fallback do painel leem esse ficheiro.

| Projeto | Tipo | Preço do lote | Disponíveis |
|---|---|---|---|
| Habitats Modulares | Habitat | US$ 420.000 | 86 / 120 |
| Centro Médico de Excelência | Comercial | US$ 650.000 | 11 / 18 |
| Ares Colony | Habitat | US$ 890.000 | 31 / 48 |
| Mars Retail Arcology | Comercial | US$ 1.200.000 | 0 / 24 (Esgotado) |
| Cidadela Helios | Infraestrutura | US$ 2.400.000 | 9 / 12 |

Para alterar números, edite `src/data/inventory.json` e reinicie a API (o seed atualiza projetos existentes pelo `nome`).

## Interface

*   **Hero:** Paisagem do Arcana Valley, logo, CTAs “Falar com Especialista” / “Ver Projeções”.
*   **Tese / sítio:** Escassez estrutural, horizonte geracional, veículo conceitual e cronograma 2030–2080.
*   **Calculadora de ROI:** Escolhe o projeto; o valor de entrada é o preço fixo do lote. Cenários Atraso / Base / Antecipada (10, 20 e 50 anos). Base: +450% / +1.200% / +5.000%. Múltiplos continuam hipotéticos.
*   **Portfólio:** Carrossel, preço do lote, stock, status, programa e demanda.
*   **Cidadela Helios:** Maquete 3D (Three.js), preço US$ 2.400.000 e 9/12 lotes.
*   **Contato:** Nome, e-mail, projeto, preço fixo do lote e mensagem. Grava em `POST /leads`. Sem API, o envio fica desativado.
*   **Painel (`/dashboard`):** Senha de acesso (padrão `ares-admin`). Lotes vendidos, lotes disponíveis, receita e leads. Em **Portfólio**, informe a quantidade e registre a venda no SQLite; KPIs atualizam na hora. Polling a cada 8 s. Se a API cair depois do primeiro fetch, não volta ao fallback.

## Backend

FastAPI + SQLAlchemy + SQLite em `backend/ares.db` (caminho absoluto a partir de `backend/database.py` — não use um `ares.db` na raiz).

| Método | Rota | Função |
|---|---|---|
| GET | `/projects` | Portfólio público |
| POST | `/projects` | Criar projeto (senha) |
| POST | `/projects/{id}/sales` | Registrar venda de lote (senha) |
| GET | `/leads` | Listar leads (senha) |
| POST | `/leads` | Formulário público de contato |

Senha padrão: `ares-admin`. Front: `VITE_DASHBOARD_PASSWORD`. API: `ARES_DASHBOARD_PASSWORD`. Header: `X-Ares-Key`.

CORS: `allow_origins=["*"]`. O frontend usa `VITE_API_URL` ou `http://127.0.0.1:8000`.

O seed atualiza tipo, preço e total de lotes pelo `nome`, mas **não** reseta `lotes_disponiveis` nem `status` — as vendas do painel permanecem no SQLite.

## Desenvolvimento local

Frontend (Node.js + npm):

```sh
npm i
npm run dev
```

Backend (Python 3):

```sh
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Testes da API: `python -m pytest -q` em `backend/`.  
Outros scripts do front: `npm run build`, `npm run preview`, `npm run lint`.

## Stack

*   Front: React 19, TanStack Start / Router, Vite, Tailwind CSS 4, Three.js, Recharts.
*   Back: FastAPI, Uvicorn, SQLAlchemy, SQLite.
*   Features: `src/features/` (`site`, `roi`, `portfolio`, `complex`, `dashboard`).

## Restrições

Não inventar depoimentos, clientes, certificações, aprovações regulatórias, histórico de performance ou titularidade real de terras em Marte. Projeções de horizonte não são retorno garantido.

