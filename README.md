# 🍫 Dolce Neves — Confeitaria Artesanal Gourmet

Sistema completo para gestão de confeitaria artesanal: vitrine digital, encomendas, precificação, fidelização e dashboard executivo.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (tema customizado)
- **Banco de dados:** Supabase (PostgreSQL + Auth + RLS)
- **Gráficos:** Recharts
- **QR Code:** qrcode.react
- **Deploy:** Vercel

## Módulos

### 🌐 Vitrine Pública

- **Landing Page** — hero, galeria de produtos, CTA Monte sua Caixa, calculadora preview, depoimentos, sobre, corporativo
- **Cardápio Digital** — filtro por categoria, modal de produto, botão WhatsApp contextual
- **Monte sua Caixa** — drag & drop de produtos, resumo de pedido, envio WhatsApp
- **Página Corporativa** — formulário para eventos empresariais
- **Calculadora de Festas** — cálculo por ocasião/convidados, sugestão de produtos, estimativa de preço, CTA WhatsApp

### 🔐 Painel Administrativo

- **Dashboard Executivo** — KPIs (pedidos, receita, NPS), gráficos de receita e pedidos, top produtos, alertas inteligentes
- **Agenda de Encomendas** — calendário visual, capacidade diária, pipeline de status
- **Lista de Pedidos** — filtros, status workflow, detalhamento de pedido
- **Capacidade** — gestão de limites diários, overbooking warnings
- **Ingredientes** — CRUD de ingredientes com preços/fornecedores
- **Fichas Técnicas** — composição de receitas, cálculo de custo automático
- **Relatório de Preços** — saúde financeira por produto, margem, sugestão de preço
- **QR Codes** — geração por pedido, rastreamento de scan, feedbacks NPS, cupons de desconto

### 📱 Fidelização (QR Code)

- QR Code impresso na embalagem após entrega
- Página pública de feedback (/f/[slug])
- NPS com emojis (1-5), comentário, indicação
- Cupom de desconto automático como recompensa
- Rastreamento de scans e feedbacks

## Estrutura de Pastas

```
app/
├── page.tsx                    # Landing page
├── cardapio/                   # Cardápio digital
├── monte-sua-caixa/            # Box builder
├── corporativo/                # Página corporativa
├── calculadora/                # Calculadora de festas
├── f/[slug]/                   # Feedback público (QR)
├── login/                      # Autenticação admin
├── admin/
│   ├── page.tsx                # Dashboard executivo
│   ├── encomendas/             # Agenda + pedidos + capacidade
│   ├── ingredientes/           # Gestão de ingredientes
│   ├── fichas/                 # Fichas técnicas
│   ├── relatorio/              # Relatório de preços
│   └── qrcodes/                # Gestão de QR codes
├── api/products/               # API de produtos (calculadora)
├── sitemap.ts                  # SEO
└── robots.ts                   # SEO
components/
├── admin/
│   ├── dashboard/              # Componentes do dashboard
│   ├── qrcodes/                # Componentes de QR admin
│   ├── fichas/                 # Editor de fichas
│   └── ...
├── calculadora/                # Componentes da calculadora
├── qr/                         # Componentes de feedback público
├── cardapio/                   # Componentes do cardápio
└── ...                         # Componentes compartilhados
lib/
├── actions/                    # Server actions (Supabase)
├── party-calculator.ts         # Lógica da calculadora
├── supabase.ts                 # Cliente browser (@supabase/ssr)
├── supabase-server.ts          # Cliente server
└── supabase-admin.ts           # Cliente admin (service role)
types/                          # Tipos TypeScript
supabase/migrations/            # Migrações SQL
```

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

### 3. Rodar migrações no Supabase

Execute os arquivos em `supabase/migrations/` na ordem:

1. `001_products.sql` — Produtos e categorias
2. `002_ingredients_fichas.sql` — Ingredientes e fichas técnicas
3. `003_orders.sql` — Pedidos e encomendas
4. `004_corporate.sql` — Pedidos corporativos
5. `005_qr_codes.sql` — QR codes e feedbacks

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

### 5. Build de produção

```bash
npm run build
npm start
```

## Variáveis de Ambiente

| Variável                        | Descrição                   |
| ------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL do projeto Supabase     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (anon)        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Chave de serviço (admin)    |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`   | Número WhatsApp com DDI     |
| `NEXT_PUBLIC_SITE_URL`          | URL do site em produção     |
| `NEXT_PUBLIC_APP_URL`           | URL da aplicação (QR codes) |
| `ADMIN_EMAIL`                   | E-mail para notificações    |
| `RESEND_API_KEY`                | API key do Resend           |

## Paleta de Cores

| Cor              | Hex       | Uso                   |
| ---------------- | --------- | --------------------- |
| dolce-rosa       | `#C96B7A` | Cor primária/destaque |
| dolce-creme      | `#F7F0E8` | Backgrounds claros    |
| dolce-marrom     | `#3D2314` | Texto principal       |
| dolce-rosa-claro | `#FAE8EC` | Backgrounds suaves    |

## Fontes

- **Display:** Playfair Display (títulos)
- **Body:** Inter (texto)

## SEO

- Meta tags Open Graph e Twitter Card
- JSON-LD LocalBusiness schema
- Sitemap XML gerado automaticamente
- Robots.txt com disallow em /admin e /f

## Deploy na Vercel

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na main

---

Desenvolvido com 🍫 para Dolce Neves Confeitaria Artesanal Gourmet.
